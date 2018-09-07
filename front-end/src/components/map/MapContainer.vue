<template>
<div class="clearfix map-container" :class="{'23d-screen': mapMode == '23d'}" id="remove">
  <tool-bar v-if="mapMode == '2d' || mapMode =='23d'"></tool-bar>
  <map-query v-show="isVertical"></map-query>
  <map-legend :leafletMap="leafletMap"></map-legend>
  <scene-legend></scene-legend>
  <poi-list class="poilist" v-show="showListPop"></poi-list>
  <sgs-map v-if="mapMode == '2d' || mapMode =='23d'" class="map-item" @handleBaseMap="handleBaseMap"></sgs-map>
  <scene-map v-if="mapMode == '3d' || mapMode =='23d'" class="map-item"></scene-map>
  <base-map-control :class="{btm233:geojsonDataFlag}" :leafletMap="leafletMap"></base-map-control>
  <iframe :src="VistaUrl" v-if="mapMode == 'vista'" class="map-item vista-frame" />
  <iframe :src="rollUpUrl" v-if="mapMode == 'rollup'" class="map-item vista-frame" id="removes" />
  <map-analysis></map-analysis>
  <div class="el-close" id="el-close" @click="rollHide">
      <span>关闭</span>
  </div>
</div>
</template>

<script>
import SgsMap from './SgsMap'
import SceneMap from './../scene/SceneMap'
import BaseMapControl from './BaseMapControl'
import MapLegend from './MapLegend'
import SceneLegend from './../scene/childrens/MapLegend'
import MapQuery from './MapQuery'
import ToolBar from './ToolBar'
import PoiList from './../common/PoiList'
import MapAnalysis from './MapAnalysis'
import {
  mapState,
  mapMutations
} from 'vuex'

let VistaUrl = FMCONFIG.VistaUrl; // static/config/app-config.js 配置
let rollUpUrl = FMCONFIG.rollUpUrl;
export default {
  components: {
    SgsMap,
    SceneMap,
    BaseMapControl,
    ToolBar,
    MapLegend,
    MapQuery,
    PoiList,
    SceneLegend,
    MapAnalysis
  },
  data() {
    return {
      VistaUrl: VistaUrl,
      rollUpUrl:rollUpUrl,
      leafletMap: {}
    }
  },
  mounted() {
  
  },
  computed: {
    ...mapState({
      mapMode: state => state.map.mapMode,
      geojsonDataFlag: state => state.map.geojsonDataFlag,
      showListPop: state => state.map.showListPop,
      isVertical: state => state.map.isVertical
    })
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
      'changeGraphics'
    ]),
    handleBaseMap(leafletMap) {
      this.leafletMap = leafletMap
    },
    rollHide(){
       this.changeMapMode();
       this.changeCurrentBaseMapIndex(0);
        this.removeGraphics()
        this.changeShowMenu(true);
        this.changeQueryWin(true);
        document.getElementById('el-close').style.opacity = 0
    }

  }
}
</script>

<style lang="scss" scoped>
.el-close{
    position:absolute;
    top: 0;
    right: 80px;
    z-index:10;
    cursor: pointer;
    opacity: 0;
    width: 64px;
    height: 20px;
    font-size: 12px;
    font-family: "微软雅黑";
    text-align: center;
    line-height: 20px;
    color: #fff;
    border: 0px;
    margin-top: 4px;
    margin-right: 5px;
    background: url('./../../assets/search.png') no-repeat;
}
.map-container,
.map-item {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.allScreenMap {
    position: relative;
    top: -80px;
    left: -300px;
    margin-right: -300px;
    margin-bottom: -80px;
}
.23d-screen {
    width: 100%;
    height: 100%;

    .map-item {
        float: left;
        width: 50%;
    }
}
.btm233 {
    bottom: 233px;
}
.poilist {
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 99;
    background-color: #fff;
    border-radius: 5px;
    border: 1px solid #efeded;
    padding: 10px;
}
.vista-frame{
  background-color: #fff;
  z-index: 1;
}
</style>
