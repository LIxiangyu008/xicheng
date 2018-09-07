<template>
<div class="version-wrap">
<!--   <section class="map-version" v-show="showVersion">
    <progress-tracker :defaultActive="defaultActive" :single="true" markerSize="small">
      <step-item v-for="(item, index) in versionList" :title="item.title" :index="item.title" :key="index" @item-click="addLayer">
      </step-item>
    </progress-tracker>
  </section> -->
  <section class="time-version" v-show="showVersion">
    <time-version :versionList="versionList" @layerAdd="layerShow"></time-version>
  </section>
  <div class="base-map-control" @mouseover="mapiconMouseOver()" @mouseout="mapiconMouseOut()">
    <ul>
      <li v-for="(item, index) in baseMapLayersGroup" :index="index" style="right: 0px;" :value='item.pkid' @click="changeBaseMap(index, item)">
        <div><img :src="item.imgUrl"></div>
        <span :class='item.icon'>
          <div class='map-icons-font'>{{item.name}}</div>
        </span>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import Vue from 'vue'
import {
  ProgressTracker,
  StepItem
} from './../../package/progress-tracker'
import TimeVersion from './../common/TimeVersion'
import {
  apiBaseMap,
} from '@/apis/api'


export default {
  data() {
    return {
      defaultActive: '',
      versionList: [],
      showVersion: false
    }
  },
  props: {
    leafletMap: Object
  },
  components: {
    ProgressTracker,
    StepItem,
    TimeVersion
  },
  async created() {
    await this.$store.dispatch('getUserInfo');
    this.initBaseMap();
  },
  computed: {
    ...mapState({
      baseMapLayersGroup(state) {
        //复制一份 防止引用修改vuex数值
        let _baseMapLayers = JSON.parse(JSON.stringify(state.map.baseMapLayersGroup));
        let baseMapLayerGroup = []
        _baseMapLayers.forEach((item, index) => {
          item.imgUrl = 'static/' + item.imgUrl;
          baseMapLayerGroup.push(item)
        })
        //街景json数据
        let vistaMapLayer = {
          imgUrl: 'static/img/mapshow/jiejing.png',
          name: '街景',
          type: 'vista'
        };
        baseMapLayerGroup.push(vistaMapLayer);

        return baseMapLayerGroup.reverse()
      },
      baseMap: state => state.map.baseMapLayersGroup
    }),
    currentLayers() {
      //底图数组更新时，调整地图类型
      if (this.baseMap && this.baseMap[0]) {
        if (this.baseMap[0].type == 'map') {
          this.changeMapMode('2d');
        } else if (this.baseMap[0].type == 'scene') {
          this.changeMapMode('3d');
        }
      }
      return this.baseMap[0] ? this.baseMap[0].verLayers : [];
    }
  },
  watch: {
    currentLayers(val, oldVal) {
      if (val) {
        if (val.length > 1) {
          this.showVersion = true;
        } else {
          this.showVersion = false;
        }
        this.initVersion();
      } else {
        this.showVersion = false; //强制关闭version control bar
      }
    }
  },
  methods: {
    ...mapMutations([
      'changeCurrentBaseMapIndex',
      'changeMapMode',
      'removeAllSLayer',
      'changeShowMenu',
      'changeQueryWin',
      'addBaseMapLayersGroup',
      'changeMarkerQueryList',
      'removeGraphics',
      'changeGraphics',
      'changeAnlysisShow',
      'handleShowHisModel'
    ]),
    mapiconMouseOver() {
      let iconlist = this.$el.children[1].children[0].children;
      for (let i = 0; i < iconlist.length; i++) {
        let iconhtml = iconlist[i];
        let rightPX = ((iconlist.length - iconhtml.getAttribute("index") - 1) * 66) + "px";
        iconhtml.style.right = rightPX;
      }
    },
    mapiconMouseOut() {
      let iconlist = this.$el.children[1].children[0].children;
      for (let i = 0; i < iconlist.length; i++) {
        let iconhtml = iconlist[i];
        iconhtml.style.right = 0;
      }
    },
    changeBaseMap(index, item) {
      this.changeAnlysisShow(false); // 关闭分析
      this.handleShowHisModel(false)
      if(this.leafletMap._layers != undefined){
        this.changeMarkerQueryList(false)
        this.removeGraphics()
        this.leafletMap.closePopup()
        let leafletLayers = this.leafletMap._layers
        // why 清除地图上的graphic数组及图标重绘
        for (let graLayer in leafletLayers) {
          if (leafletLayers[graLayer].graphics != undefined || leafletLayers[graLayer].graphics != null) {
            leafletLayers[graLayer].graphics = []
            leafletLayers[graLayer].redraw()
          }
        }
        this.changeGraphics([])
      }
      EventBus.$emit('pritree-removeAll');
      let type = item.type;
      if (type == 'scene') {
        this.changeMapMode('3d');
        this.changeCurrentBaseMapIndex(this.baseMapLayersGroup.length - index - 1);
        this.changeShowMenu(true);
        this.changeQueryWin(true);
        document.getElementById('el-close').style.zIndex = -1
      }else if (type == 'vista') {
        // 改变成街景
        this.changeMapMode('vista');
        // this.changeCurrentBaseMapIndex(this.baseMapLayersGroup.length - index - 1);
        this.changeShowMenu(false);
        this.changeQueryWin(false);
        this.showVersion = false;
      } else {
        this.changeMapMode('2d');
        this.changeCurrentBaseMapIndex(this.baseMapLayersGroup.length - index - 1);
        this.changeShowMenu(true);
        this.changeQueryWin(true);
      }
    },
    initVersion() {
      this.versionList = [];
      let activeMap = this.baseMapLayersGroup[this.baseMapLayersGroup.length - 1]
      activeMap.verLayers.forEach((item) => {
        let version = {
          isActive: false,
          isComplete: false,
          title: item.version
        };
        this.versionList.push(version);
      });
      this.defaultActive = activeMap.verLayers[0].version;
    },
    addLayer(item) {
      this.defaultActive = item.title;
      for (let i = 0; i < this.currentLayers.length; i++) {
        if (item.title == this.currentLayers[i].version) {
          EventBus.$emit("change-version", i)
          break;
        }
      }
    },
    layerShow(index){
      EventBus.$emit("change-version",index)
    },
    async initBaseMap() {
      const {
        resultInfo
      } = await apiBaseMap();
      let items = resultInfo.data.items;
      let datas = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].mapType == 0) {
          if (items[i].versions.length > 0) {
            datas = items[i].versions.map((version) => {
              let layer = items[i].layers.filter((layer) => {
                return layer.version == version
              })
              return {
                version,
                layer
              }
            })
            items[i].verLayers = datas;
            items[i].type="map";
          }
        }else {
          items[i].type="scene";
          items[i].imgUrl="img/mapshow/yingxiang_1.png";
          items[i].url=items[i].realspaceurl;
          items[i].isShow=true;
        }
      }
      if (!items || !items.length) {
        this.$message.error('暂未配置底图，请联系管理员配置')
        return;
      }
      // let scenesCfg = Analysis.default.scenes;
      // items = items.concat(scenesCfg)
      this.addBaseMapLayersGroup(items);
    }
  }
}
</script>

<style lang="scss">
.version-wrap {
    position: absolute;
    min-width: 200px;
    height: 143px;
    right: 12px;
    bottom: 28px;
    z-index: 9999;
}
.time-version {
    position: relative;
    right: 210px;
    padding-top: 42px;
  }
.map-version {
    position: absolute;
    border-radius: 5px;
    z-index: 9999;
    right: 0;
    min-width: 200px;
    -webkit-box-shadow: 0 1px 17px #03539a;
    box-shadow: 0 1px 8px #85a1b9;
    background-color: rgba(255, 255, 255, 0.75);

    .progress-tracker {
        margin: 8px 5px 3px;
    }
    .progress-step {
        padding: 5px;
    }
    .progress-tracker--marker-small .progress-marker {
        width: 16px;
        height: 16px;
    }
    .progress-text {
        padding: 0;
    }
    .progress-text:hover {
        color: #2c93ef;
    }
}
.base-map-control {
    position: absolute;
    top: 68px;
    width: 60px;
    height: 60px;
    z-index: 9999;
    right: 0;
    transition: 0.5s;

    li {
        list-style-type: none;
        width: 60px;
        height: 60px;
        position: absolute;
        text-align: center;
        font-size: 12px;
        color: white;
        border: 2px #b3d6f1 solid;
        border-radius: 5px;
        overflow: hidden;
        cursor: pointer;
        transition: 1s;
    }

    .map-icons-font {
        background: #178af5;
        opacity: 0.8;
        width: 56px;
        margin-top: 15px;
        padding: 2px;
        position: absolute;
        bottom: 10px;
    }
}
</style>
