<template>
  <div class="map-form">
    <!-- <el-dialog title="新增地图"  @close="hideDialog"> -->
      <el-form label-width="80px">
        <el-form-item label="地图名称" required>
          <el-input v-model="registerData.name"></el-input>
        </el-form-item>
        <el-form-item label="地图序号" required>
          <el-input v-model="registerData.index"></el-input>
        </el-form-item>
        <div class="control-group">
          <label class="control-label" for="map_icon">地图图标</label>
          <div class="base-map-control" id="map_icon" ref="baseMapControl" @mouseover="mapiconMouseOver()" @mouseout="mapiconMouseOut()">
            <ul>
              <li v-for="(icon, index) in mapIcons" :index="index" style="right: 0px;" :value='icon' @click="changeBaseMap(index, icon)">
                <div><img :src="'static/'+icon"></div>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <el-form-item label="选择图层" required>
            <el-button @click="newVersion">添加新版本</el-button>
            <div class="version" v-for="(v,index) in registerData.versions" >
              <i class="version-delete el-icon-delete" @click="deleteVersion(index)"></i>
              <div class="version-name">
                <label>版本:</label>
                <el-input @focus="focusVersion(registerData.versions[index])" @blur="editVersion(registerData.versions[index])" class="version-edit" type="text" v-model="registerData.versions[index]"></el-input>
              </div>
              <div>
                <label style="float: left;">图层:</label>
                <div class="layer" v-for="layer in registerData.layers">
                  <label v-if="layer.version==v">{{layer.name}}
                    <i class="el-icon-caret-top" title="上移" @click.stop="layerUp(layer)" style="font-size: 20px"></i>
                    <i class="el-icon-caret-bottom" title="下移" @click.stop="layerDown(layer)" style="font-size: 20px"></i>
                    <i class="el-icon-delete" title="删除" @click.stop="deleteLayer(layer)" style="font-size: 15px"></i>
                  </label>
                </div>
                <div style="margin-left: 36px">
                  <el-button @click="changeTreeVisibility(v)">添加图层</el-button>
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <div id="resource-tree" v-show="isShowTree">
          <resource-tree></resource-tree>
        </div>

        <el-form-item label="地名地址服务">
          <el-input v-model="registerData.addressMatchingUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import ResourceTree from './../common/ResourceTree'
  import {
    apiServiceCatalogServiceByID,
    apiAddBaseMap,
    updateBaseMap,
    apiBaseMap
  } from '@/apis/api'
  import {
    serviceMgr
  } from './../map/serviceMeta.js';
  import {sortServiceInfos} from './../common/serviceUtil.js'
  let serType = ['WMTS100', 'SGSWMTS100', 'SMRESTMAP', 'WMS111', 'WMS130','SGSSFS110']

  let Analysis = APPCONFIG.Analysis
  export default {
    components: {
      ResourceTree
    },
    props: {
      type:{
        type: Number,
        default:1
      }
    },
    mounted() {
      this.initEvent()
    },
    beforeDestroy() {
      this.offEvent();
    },
    computed: {
      ...mapState({
        baseMapLayersGroup: state => state.map.baseMapLayersGroup,
        registerParam: function(state){
          let data = JSON.parse(JSON.stringify(state.map.curMap))
          this.registerData = data;
          if(this.type == 1){
            this.registerData.index = this.baseMapLayersGroup.length + 1;
          }
          return data
        }
      })
    },
    watch: {
      registerParam:{
        handler(val, oldVal) {
        }
      }
    },
    methods: {
      ...mapMutations([
        'addBaseMapLayersGroup'
      ]),
      hideDialog () {
        this.$emit('hideMapForm','');
        this.registerData = {
          name: '',
          index: '',
          imgUrl: 'img/mapshow/shiliang_1.png',
          networkUrl: '',
          addressMatchingUrl: '',
          mapType: 0,
          status: 1,
          openHistory: true,
          versions: [],
          layers: [],
          userId: '41',
          centerX: '',
          centerY: '',
          bbox: [],
          projection: '',
          initLevel: ''
        }
      },
      mapiconMouseOver() {
        let iconlist = this.$refs.baseMapControl.children[0].children;
        for (let i = 0; i < iconlist.length; i++) {
          let iconhtml = iconlist[i];
          let leftPX = ((iconlist.length - iconhtml.getAttribute("index") - 1) * 66) + "px";
          iconhtml.style.left = leftPX;
        }
      },
      mapiconMouseOut() {
        let iconlist = this.$refs.baseMapControl.children[0].children;
        for (let i = 0; i < iconlist.length; i++) {
          let iconhtml = iconlist[i];
          iconhtml.style.left = 0;
        }
      },
      changeBaseMap(index, icon) {
          this.mapIcons.push(icon);
          this.mapIcons.splice(index,1);
          this.registerData.imgUrl = this.mapIcons[this.mapIcons.length-1];
      },
      changeTreeVisibility (version) {
          this.curVersion = version;
          if(!this.isShowTree){
            EventBus.$emit('tree-removeAll');
          }
          this.isShowTree = !this.isShowTree;

      },
      newVersion () {
          this.registerData.versions.push(
            '新版本_'+(this.registerData.versions.length+1)
          )
      },
      focusVersion(name){
        this.curVersion = name;
      },
      editVersion(name){
        this.registerData.layers.map((layer) => {
          if(layer.version == this.curVersion){
            layer.version = name;
          }
        })
      },
      initEvent () {
        EventBus.$on('tree-sideBarCheck', this.onSideBarCheck);
      },
      offEvent() {
        EventBus.$off('tree-sideBarCheck', this.onSideBarCheck);
      },
      layerUp(layer){
        let index = layer.index;
        if(layer.index == 0){
          return;
        } else {
          let temp = 100;
          this.registerData.layers.map((item) => {
            if(item.index == index){
              item.index = temp;
            }
            if(item.index == (index-1)){
              item.index = index;
            }
          })
          this.registerData.layers.map((item2) => {
            if(item2.index == temp){
              item2.index = index-1;
            }
          })
          this.registerData.layers.sort(function(a,b){
            return a.index-b.index})
        }
      },
      layerDown(layer){
        let index = layer.index;
        if(layer.index == this.registerData.layers.length-1){
          return;
        } else {
          let temp = 100;
          this.registerData.layers.map((item) => {
            if(item.index == index){
              item.index = temp;
            }
            if(item.index == (index+1)){
              item.index = index;
            }
          })
          this.registerData.layers.map((item2) => {
            if(item2.index == temp){
              item2.index = index+1;
            }
          })
          this.registerData.layers.sort(function(a,b){
            return a.index-b.index})
        }
      },
      async onSideBarCheck (node, checked, indeterminate) {
        if(checked){
          const {
            data
          } = await apiServiceCatalogServiceByID(node.resID);

          let services = [];
          data.resultInfo.data.forEach((item, index) => {
            services = services.concat(item.serviceInfos);
          })

          let wmtsService = null;
          let restService = null;
          let mapService = null;
          let ser = sortServiceInfos(services,serType);
          if(ser.length && (ser[0].interfaceType.value.indexOf('WMTS') > -1 || ser[0].interfaceType.value.indexOf('RESTMAP') > -1)){
            mapService = ser[0];
            let standLayer = {},isContinue = true,errorPro="",errorRes="",errorScale="",errorBbox="";
            let sermeta = serviceMgr.getMetadata(mapService.id).then((res) => {
              let layer = {
                name: res[0].layerType.indexOf('WMTS') > -1 ? res[0].options.layer : res[0].name,
                maxScale: null,
                minScale: null,
                layerUrl: res[0].url.substring(0, res[0].url.lastIndexOf("\/")),
                status: 1,
                layerType: res[0].layerType.indexOf('WMTS') > -1 ? 'WMTS' : res[0].layerType,
                index: this.registerData.layers.length,
                matrixSet: res[0].options.tilematrixSet,
                format: res[0].options.format,
                version: this.curVersion,
                scale: res[0].options.scales || null,
                resolution: res[0].options.resolutions || null,
                identifier: res[0].options.identifier,
                bbox: res[0].bounds.length > 0 ? [
                  res[0].bounds[0][1],
                  res[0].bounds[1][0],
                  res[0].bounds[1][1],
                  res[0].bounds[0][0]
                ] : null,
                startLevel: 0,
                endLevel: 0,
                isStandlayer: false
              }
              let existLayer = this.registerData.layers.filter((item) => {
                return (item.version == this.curVersion) && (layer.layerUrl == item.layerUrl)
              })
              if(existLayer.length){
                this.$message('该版本下已存在所选图层！');
                return;
              }
              if (this.registerData.layers.length) {
                standLayer = this.registerData.layers[0];
                if (standLayer.projection != layer.projection) {
                  isContinue = false;
                  errorPro = "投影、";
                }
                //判断分辨率是否一致
                if (layer.resolution && standLayer.resolution) {
                  for (var iii = 0; iii < standLayer.identifier; iii++) {
                    for (var iiii = 0; iiii < layerIdentifier.length; iiii++) {
                      if (standLayer.identifier[iii] == layerIdentifier[iiii] &&
                        standLayer.resolution[iii] != layer.resolution[iiii]) {
                        isContinue = false;
                        errorRes = "分辨率、";
                      }
                    }
                  }
                };
                //判断比例尺是否一致
                if (layer.scales && standLayer.scales) {
                  for (var iii = 0; iii < standLayer.identifier; iii++) {
                    for (var iiii = 0; iiii < layerIdentifier.length; iiii++) {
                      if (standLayer.scales[iii] == layer.scales[iiii] &&
                        standLayer.scales[iii] != layer.scales[iiii]) {
                        isContinue = false;
                        errorScale = "比例尺、";
                      }
                    }
                  }
                };
                //判断空间范围是否一致
                if (standLayer.bbox[0] != layer.bbox[0] ||
                  standLayer.bbox[1] != layer.bbox[1] ||
                  standLayer.bbox[2] != layer.bbox[2] ||
                  standLayer.bbox[3] != layer.bbox[3]) {
                  isContinue = false;
                  errorBbox = "空间范围、";
                };
              } else {
                this.registerData.centerX = res[0].center.length > 0 ? res[0].center[0] : null;
                this.registerData.centerY = res[0].center.length > 0 ? res[0].center[1] : null;
                this.registerData.bbox = res[0].bounds.length > 0 ? [
                  res[0].bounds[0][1],
                  res[0].bounds[1][0],
                  res[0].bounds[1][1],
                  res[0].bounds[0][0]
                ] : null;
                this.registerData.projection = res[0].project;
              }
              if (isContinue == true) {
                this.registerData.layers.push(layer);
              } else {
                var showMessage = errorPro + errorRes + errorScale + errorBbox;
                this.$confirm("当前选中图层服务"+showMessage+"与其它图层不一样，可能会影响出图效果。是否继续添加", '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  center: true
                }).then(() => {
                  this.registerData.layers.push(layer);
                }).catch(() => {

                });
              }
            });
          } else {
              this.$message('该资源没有地图服务');
          }
          this.isShowTree = false;
        }

      },
      deleteVersion (index) {
        for (let i=0;i<this.registerData.versions.length;i++) {
          if (i == index) {
            //清除该版本下的图层
            for (let j=0;j<this.registerData.layers.length;j++) {
                if (this.registerData.layers[j].version == this.registerData.versions[i]) {
                    this.registerData.layers.splice(j,1);
                }
            }
            //清除版本
            this.registerData.versions.splice(i,1);
          }
        }
        if(this.registerData.versions.length == 0){
          this.isShowTree = false
        }
      },
      deleteLayer(layer){
        this.registerData.layers = this.registerData.layers.filter((item) => {
          return !((item.version == layer.version) && (layer.layerUrl == item.layerUrl))
        })
        let samedata = this.registerData.layers.filter((item) => {
          return layer.version == item.version
        })
        if(!samedata.length){
          this.registerData.versions = this.registerData.versions.filter((item) => {
            return item != layer.version
          })
        }
        if(this.registerData.versions.length == 0){
          this.isShowTree = false
        }
      },
      async submit () {
        delete this.registerData.verLayers;
        delete this.registerData.type;
        if(!this.registerData.layers.length){
          this.$message("请至少选择一个图层！");
          return;
        }
        let data = null;
        if(this.type == 1){
          data = await apiAddBaseMap(this.registerData);
        } else if(this.type == 2) {
          data = await updateBaseMap(this.registerData);
        }
        if(data.data.resultInfo.success){
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
        } else {
          this.$message.error('保存失败！');
        }
        this.hideDialog();
        this.initBaseMap();
      },
      async initBaseMap() {
        let resultInfo = await apiBaseMap();
        let items = resultInfo.resultInfo.data.items;
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
        let scenesCfg = Analysis.default.scenes;
        items = items.concat(scenesCfg)
        this.addBaseMapLayersGroup(items);
      }
    },
    data () {
        return {
          isShowTree: false,
          curVersion: '',
          registerData:{},
          mapIcons: [
            'img/mapshow/yingxiang_2.jpg',
            'img/mapshow/yingxiang_1.png',
            'img/mapshow/dixing_1.png',
            'img/mapshow/shiliang_3.png',
            'img/mapshow/shiliang_2.jpg',
            'img/mapshow/shiliang_1.png'
          ]
        }
    }
  }
</script>

<style lang="scss">
  .map-form {
    .el-dialog {
      width: 1000px;
    }
    .el-input {
      width: 395px;
    }
    .base-map-control {
      position: absolute;
      top: 181px;
      left: 130px;
      width: 60px;
      height: 60px;
      z-index: 9999;
      right: 0;
      transition: 0.2s;
    }
    .base-map-control li {
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
    .control-group {
      height: 80px;
      margin-left: 30px;
    }
    .control-label {
      float: left;
      margin-left: 9px;
    }
    .controls {
      float: left;
    }
    .icon_li {
      float: left;
      margin: 0 13px;
    }
    .version-edit {
      width: 150px;
    }
    .el-collapse {
      border-top: 0;
    }
    #resource-tree {
      position: absolute;
      top: 47px;
      right: 2px;
      height: 450px;
      overflow-y: auto;
    }
    .version {
      margin: 10px 0 0 30px;
      border: 1px solid #D8DBE2;
      border-radius: 4px;
      padding: 5px;
      position: relative;
    }
    .version-name {
      margin-bottom: 5px;
    }
    .version-delete {
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .el-form-item__label {
      width: 110px !important;
    }
    .el-form-item {
      width: 505px;
    }
    .el-icon-delete{
      cursor: pointer
    }
    .layer {
      margin-left: 37px;
    }
  }
</style>
