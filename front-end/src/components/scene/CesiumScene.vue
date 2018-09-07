<template>
<div class="cesium-scene" id="cesium-scene">
  <slot></slot>
  <Tables></Tables>
  <div id="cesiumContainer"></div>
</div>
</template>

<script>
import Tables from './childrens/Table';

import {
  Loading
} from 'element-ui';
import {
  calculateSizeFromAltitude,
  getBoundsFromPromisesLayer
} from './../common/sceneUtil'
import {
  CRestTilelayer
} from './../../package/cesium/main'
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'


let Analysis = APPCONFIG.Analysis;
let baseMarkerUrl = "./../../../static/img/marker/";
let handlerDis, handlerArea, handlerHeight;
let labelCameraInit = Analysis.default.labelCamera;
export default {
  components: {
    Tables
  },
  data() {
    return {
      show: false,
      isSt: '默认值',
      viewer: {},
      layer: {},
      layerattr: ['1', '2', '3']
    }
  },

  mounted() {
    this._loadingService = Loading.service({
      target: this.$el,
      background: 'rgba(0, 0, 0, 0.8)',
      text: '拼命加载中',
      spinner: 'el-icon-loading'
    });
    this.initLayerout();
    this.initViewer();
    this.initSceneMouseEvent();
    this.initEvent();

    //通知子组件父组件已经渲染完毕
    for (let children of this.$children) {
      children._initHooks && children._initHooks();
    }
  },
  computed: {
    ...mapState({
      baseMapLayersGroup: state => state.map.baseMapLayersGroup
    }),
    currentBaseMap() {
      return this.baseMapLayersGroup[0];
    }
  },
  watch: {
    currentBaseMap(val, oldVal) {
      if (val.type == "scene") {
        this.initViewer()
      }
    },
  },
  beforeDestroy() {
    this.offEvent();
  },
  methods: {

    initEvent() {

      EventBus.$on('mapToScene', this.mapToScene);
      EventBus.$on('toolbar-measured', this.initmeasure);
      EventBus.$on('toolbar-clearAll', this.clearAll);
      EventBus.$on('query-poi', this.showPoi); //查询的兴趣点
      EventBus.$on('query-seleted', this.showOne); //选中某点
      EventBus.$on('query-inmarker', this.inMarker);
      EventBus.$on('query-outmarker', this.outMarker);
      EventBus.$on('scene-label', this.openSceneLabel); // 开启场景标注
      EventBus.$on('fly-start', this.flySatrt); // 开启飞行

    },
    offEvent() {
      EventBus.$off('mapToScene', this.mapToScene);
      EventBus.$off('toolbar-measured', this.initmeasure);
      EventBus.$off('toolbar-clearAll', this.clearAll);
      EventBus.$off('query-poi', this.showPoi); //查询的兴趣点
      EventBus.$off('query-seleted', this.showOne); //选中某点
      EventBus.$off('query-inmarker', this.inMarker);
      EventBus.$off('query-outmarker', this.outMarker);
      EventBus.$off('scene-label', this.openSceneLabel); // 开启场景标注
      EventBus.$off('fly-start', this.flySatrt); // 开启飞行

    },
    initViewer() {
      if (this.currentBaseMap.type == "scene") {
        if (window.Viewer) {
          window.Viewer.destroy();
          if (window.Viewer.isDestroyed()) {
            this.renderView();
          }
        } else {
          this.renderView();
        }
      }
    },
    renderView() {
      let that = this;
      let layerCfg = Analysis.default.imgLayers,
        cameraCfg = Analysis.default.camera,
        dataSourcesCfg = Analysis.default.dataSources,
        s3mLayersCfg = Analysis.default.s3mLayers,
        scenesCfg = this.currentBaseMap,
        xcScensCfg = Analysis.default.scenes;
      let promises = [],
        viewerOptions = {
          shadows: true,
          navigation: false,
          selectionIndicator: false,
          infoBox: false
        };
      //平面三维支持
      if (this.currentBaseMap.desc == 'NONEARTHFLAT' || this.currentBaseMap.desc == '') {
        viewerOptions.sceneMode = Cesium.SceneMode.COLUMBUS_VIEW;
        viewerOptions.imageryProvider = new Cesium.SingleTileImageryProvider({
          url: Analysis.default.planeImgUrl
        });
        // this.$message.error('暂不支持平面场景！');
        // 关闭loading
        // this._loadingService && this._loadingService.close();
        // return;
      }
      let viewer = new Cesium.Viewer(this.$el, viewerOptions)

      this.viewer = viewer;
      //影像底图图层
      if (layerCfg && layerCfg.length) {
        let imageryLayers = viewer.imageryLayers;
        layerCfg.forEach((item, index) => {
          if (item.isShow) {
            let layer = new Cesium.SuperMapImageryProvider({
              url: item.url,
              name: item.name,
              credit: item.type,
            })
            layer.alpha = 1.0;
            imageryLayers.addImageryProvider(layer);
          }
        })
      }
      //关闭cesium logo
      viewer._cesiumWidget._creditContainer.style.display = 'none';
      let scene = viewer.scene;
      scene.screenSpaceCameraController.enableIndoorColliDetection = true;
      Analysis.debugShowFramesPerSecond ? scene.debugShowFramesPerSecond = true : scene.debugShowFramesPerSecond = false;
      window.Viewer = viewer;
      if (scenesCfg) {
        let senceUrl;
        if (scenesCfg.isShow) {
          if (this.currentBaseMap.url.indexOf("886e60bb7e014f22a707de23e6f6505d") == -1) {
            senceUrl = this.currentBaseMap.url + "/886e60bb7e014f22a707de23e6f6505d"
          }

          let promise
          for (let i = 0; i < xcScensCfg.length; i++) {
            let scenes = xcScensCfg
            if (scenes[i].scenetype == 'scene') {
              promise = scene.open(scenes[i].url)
              promises.push(promise)
            } else {}
          }
        }
      }

      if (s3mLayersCfg && s3mLayersCfg.length) {
        s3mLayersCfg.forEach((item, index) => {
          if (item.isShow) {
            let promise = scene.addS3MTilesLayerByScp(item.url, {
              name: item.name
            });
            promises.push(promise);
          }
        })
      }

      Cesium.when.all(promises, (layers) => {
        // 历史三维数据处理
        for (let i = 0; i < layers.length; i++) {
          // 给予每个工作空间独立的ID
          layers[i].spaceId = xcScensCfg[i].time
          // 默认显示第一个工作空间的场景
          if (i > 0) {
            for (let j = 0; j < layers[i].length; j++) {
              layers[i][j].visible = false
              // layers[i][j].setObjsVisible([], true)
            }
          }
        }
        // 历史三维数据提交
        EventBus.$emit('showTimeAxias', layers)

        // 房屋揭盖功能,根据新方式加载场景做出数组调整
        let la = []
        for (let i = 0; i < layers.length; i++) {
          // 判断是否有水面S3M
          if (scene.layers.find(xcScensCfg[i].waterName)) {
            var waterLayer = scene.layers.find(xcScensCfg[i].waterName)
            var waterStyle = new Cesium.Style3D()
            waterStyle.bottomAltitude = 5
            //设置水面图层的底部高程，确保水面与模型贴合
            waterLayer.style3D = waterStyle
            //设置风格后需刷新
            waterLayer.refresh()
          }

          for (let j = 0; j < layers[i].length; j++) {
            la.push(layers[i][j])
          }
        }
        let las = []
        las[0] = la
        EventBus.$emit('newArrOne', las[0]);
        //初始化数据源耗时不小，并且同时渲染白膜及转动相机位置容易导致卡顿
        this._loadingService && this._loadingService.close();
        this.layer = layers;
        //定位s3m图层
        let bounds = getBoundsFromPromisesLayer(layers);
        if (!bounds) {
          return;
        }
        if (this.currentBaseMap.desc == 'NONEARTHFLAT' || this.currentBaseMap.desc == '') {
          // var provider_wgs = new Cesium.SuperMapImageryProvider({
          //   url: Analysis.default.locationRest
          // });
          // var imagery_wgs = viewer.imageryLayers.addImageryProvider(provider_wgs);
          // viewer.flyTo(imagery_wgs);

          Viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(cameraCfg.destination.x, cameraCfg.destination.y, cameraCfg.destination.z),
            orientation: {
              heading: cameraCfg.orientation.heading,
              pitch: cameraCfg.orientation.pitch,
              roll: cameraCfg.orientation.roll
            }
          })

        } else {
          Viewer.camera.flyToBoundingSphere(bounds, {
            duration: 6
          });
        }

      }, (e) => {
        this.$message.error('加载三维场景失败、请联系管理员或刷新重试！')
      });
      viewer.selectedEntityChanged.addEventListener((entity) => {
        EventBus.$emit('initPopup', entity);
      })
    },

    showPoi(list) {
      if (Viewer) {
        Viewer.entities.removeAll();
        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          Viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(parseFloat(item.X), parseFloat(item.Y), parseFloat(300)),
            billboard: {
              image: baseMarkerUrl + (i + 1) + ".png",
              width: 30,
              height: 40,
            },
            name: item.Name,
            id: i,
            props: item,
            description: item.Name
          });
        }
        Viewer.zoomTo(Viewer.entities);
      }

    },
    showOne(item) {
      if (Viewer) {
        Viewer.scene.camera.flyTo({
          destination: new Cesium.Cartesian3.fromDegrees(+item.X, +item.Y, 15000),
        });
      }
    },
    inMarker(index) {
      let self = this;
      if (Viewer) {
        Viewer.entities.values.forEach(function(layer) {
          if (layer._id == index) {
            layer._billboard._image._value = baseMarkerUrl + (index + 1) + "_h.png";
          }
        });
      }
    },
    outMarker(index) {
      let self = this;
      if (Viewer) {
        Viewer.entities.values.forEach(function(layer) {
          if (layer._id == index) {
            layer._billboard._image._value = baseMarkerUrl + (index + 1) + ".png";
          }
        });
      }
    },
    initmeasure(command, isCloseToGround) {
      let scene = Viewer.scene;
      //widget = Viewer.cesiumWidget;
      let that = this;
      //初始化测量距离
      if (!handlerDis) {
        handlerDis = new Cesium.MeasureHandler(Viewer, Cesium.MeasureMode.Distance, 0);

        //注册测距功能事件
        handlerDis.measureEvt.addEventListener(function(result) {
          var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
          handlerDis.disLabel.text = '距离:' + distance;

        });
        handlerDis.activeEvt.addEventListener(function(isActive) {
          if (isActive == true) {
            Viewer.enableCursorStyle = false;
            Viewer._element.style.cursor = '';
          } else {
            Viewer.enableCursorStyle = true;
          }
        });

      }

      if (!handlerArea) {
        //初始化测量面积
        handlerArea = new Cesium.MeasureHandler(Viewer, Cesium.MeasureMode.Area, 0);
        handlerArea.measureEvt.addEventListener(function(result) {
          var area = result.area > 1000000 ? (result.area / 1000000).toFixed(2) + 'km²' : result.area + '㎡'
          handlerArea.areaLabel.text = '面积:' + area;
        });
        handlerArea.activeEvt.addEventListener(function(isActive) {
          if (isActive == true) {
            Viewer.enableCursorStyle = false;
            Viewer._element.style.cursor = '';
          } else {
            Viewer.enableCursorStyle = true;
          }
        });

      }

      if (!handlerHeight) {
        //初始化测量高度
        handlerHeight = new Cesium.MeasureHandler(Viewer, Cesium.MeasureMode.DVH);
        handlerHeight.measureEvt.addEventListener(function(result) {
          var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
          var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
          var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
          handlerHeight.disLabel.text = '空间距离:' + distance;
          handlerHeight.vLabel.text = '垂直高度:' + vHeight;
          handlerHeight.hLabel.text = '水平距离:' + hDistance;
        });
        handlerHeight.activeEvt.addEventListener(function(isActive) {
          if (isActive == true) {
            Viewer.enableCursorStyle = false;
            Viewer._element.style.cursor = '';
          } else {
            Viewer.enableCursorStyle = true;
          }
        });

      }

      if (isCloseToGround) {
        handlerDis.clampMode = 1;
        handlerArea.clampMode = 1;
        handlerHeight.clampMode = 1;
      } else {
        handlerDis.clampMode = 0;
        handlerArea.clampMode = 0;
        handlerHeight.clampMode = 0;
      }

      if (command == 'distance') {
        that.measureDis();
      };
      if (command == 'polyline') {
        that.measureArea();
      };
      if (command == 'height') {
        that.measureHeight();
      };
    },
    measureDis() {
      this.deactiveAll();
      handlerDis && handlerDis.activate();
    },
    measureArea() {
      this.deactiveAll();
      handlerArea && handlerArea.activate();
    },
    measureHeight() {
      this.deactiveAll();
      handlerHeight && handlerHeight.activate();
    },
    deactiveAll() {
      handlerDis && handlerDis.deactivate();
      handlerArea && handlerArea.deactivate();
      handlerHeight && handlerHeight.deactivate();
    },
    clearAll() {
      handlerDis && handlerDis.clear();
      handlerArea && handlerArea.clear();
      handlerHeight && handlerHeight.clear();
    },
    openSceneLabel(values) {
      var lon = labelCameraInit.lon;
      var lat = labelCameraInit.lat;
      var alt = labelCameraInit.alt;
      var heading = labelCameraInit.heading;
      var pitch = labelCameraInit.pitch;
      var roll = labelCameraInit.roll;
      if (values) {
        lon = values.lon;
        lat = values.lat;
        alt = values.alt;
        heading = values.heading;
        pitch = values.pitch;
        roll = values.roll;
      }
      var viewer = this.viewer;
      var scene = viewer.scene;
      var widget = viewer.cesiumWidget;
      //设置相机位置、视角，便于观察场景
      scene.camera.setView({
        destination: new Cesium.Cartesian3.fromDegrees(lon, lat, alt),
        orientation: {
          heading: heading,
          pitch: pitch,
          roll: roll
        }
      });
      for (var i = 0; i < this.layer.length; i++) {
        this.layer[i].selectEnabled = false;
      }
    },


    flySatrt() {
      var scene = this.viewer.scene;
      var routes = new Cesium.RouteCollection(this.viewer.entities);
      //添加fpf飞行文件，fpf由SuperMap iDesktop生成
      var fpfUrl = '../../../static/flyRoutes/flyRoutes1.fpf';
      routes.fromFile(fpfUrl);
      //初始化飞行管理
      var flyManager = new Cesium.FlyManager({
        scene: scene,
        routes: routes
      });
      flyManager.readyPromise.then(function() { // 飞行路线就绪
        var currentRoute = flyManager.currentRoute;
        currentRoute.isLineVisible = true;
        currentRoute.isStopVisible = true;
        flyManager && flyManager.play();
      });
    },
    initLayerout() {
      let $parentNode = this.$el.parentNode;
      this.$el.style.height = $parentNode.clientHeight + 'px';
    },
    forceResize() {
      Viewer && Viewer.forceResize();
    },
    mapToScene({
      lng,
      lat,
      altitude
    }) {
      let that = this;
      Viewer.scene.camera.moveEnd.removeEventListener(this.sceneToMapEvent);
      if (lng && lat && altitude) {
        Viewer.scene.camera.flyTo({
          destination: new Cesium.Cartesian3.fromDegrees(lng, lat, altitude),
          complete() {
            setTimeout(() => {
              Viewer.scene.camera.moveEnd.addEventListener(that.sceneToMapEvent)
            }, 200)
          }
        })
      }
    },
    initSceneMouseEvent() {
      Viewer.scene.camera.moveEnd.addEventListener(this.sceneToMapEvent)
    },
    sceneToMapEvent() {
      let camera = Viewer.scene.camera;
      let cameraPosiion = camera.position;
      let cartographic = Cesium.Cartographic.fromCartesian(cameraPosiion);
      let longitude = Cesium.Math.toDegrees(cartographic.longitude);
      let latitude = Cesium.Math.toDegrees(cartographic.latitude);
      let height = cartographic.height;
      let size = calculateSizeFromAltitude(height);
      size = size * 0.5;
      EventBus.$off('mapToScene', this.mapToScene);
      EventBus.$emit('sceneToMap', [
        [latitude - size, longitude - size],
        [latitude + size, longitude + size]
      ])
      EventBus.$on('mapToScene', this.mapToScene);
    }
  }
}
</script>

<style lang="scss" scope>
.cesium-scene {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
