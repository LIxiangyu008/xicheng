<template>
<div class="map-toolbar">
  <el-menu default-active="1-4-1" mode="horizontal" class="el-menu-toolbar">
    <!-- <el-menu-item index="0" @click="showQh()">
      <i class="el-icon-sort"></i>
      <span slot="title">{{acitveDis.name}}</span>
    </el-menu-item> -->
    <el-menu-item index="1" @click="showLegend()">
      <i class="el-icon-news"></i>
      <span slot="title">图例</span>
    </el-menu-item>
    <el-menu-item index="2" @click="fullScreen()">
      <i class="el-icon-document"></i>
      <span slot="title">{{ isShowAllScreen ? '退出全屏' : '全屏' }}</span>
    </el-menu-item>
    <el-menu-item index="3" @click="fullWidth()">
      <i class="el-icon-rank"></i>
      <span slot="title">全幅</span>
    </el-menu-item>
    <el-menu-item index="4" @click="clearAll()">
      <i class="el-icon-delete"></i>
      <span slot="title">清除</span>
    </el-menu-item>
    <el-menu-item index="5">
      <i class="el-icon-menu"></i>
      <el-dropdown @command="measured">
        <span class="el-dropdown-link">
		      通用工具
          <i class="el-icon-arrow-down el-icon--right dropdown-link"></i>
		    </span>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="polyline">量距</el-dropdown-item>
            <el-dropdown-item command="polygon">量面</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu-item>
    <!-- <el-submenu index="5">
      <template slot="title">通用工具</template>
      <el-menu-item index="measurePolyline" @click="measured('polyline')">量线</el-menu-item>
      <el-menu-item index="measurePolygon" @click="measured('polygon')">量面</el-menu-item>
    </el-submenu> -->
<!--     <el-menu-item index="6">
      <i class="el-icon-printer"></i>
      <el-dropdown>
        <span class="dropdown-link">
          辅助工具
          <i class="el-icon-arrow-down el-icon--right dropdown-link"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click="currentGeoType = 'polygon'">
            <el-upload class="upload-demo" action="11" :show-file-list="false" :auto-upload="false" :on-change="change">
              <div  title="上传面数据txt" @click="currentGeoType = 'polygon'">上传面数据</div>
            </el-upload>
          </el-dropdown-item>
          <el-dropdown-item @click="currentGeoType = 'polygon'">
            <el-upload class="upload-demo" action="11" :show-file-list="false" :auto-upload="false" :on-change="change">
              <div  title="上传线数据txt" @click="currentGeoType = 'polyline'">上传线数据</div>
            </el-upload>
          </el-dropdown-item>
          <el-dropdown-item @click.native="changeBufferState(!showBufferFlag)">缓冲区分析</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu-item> -->
    <el-menu-item index="7" @click.native="showMultiCfgFlag = !showMultiCfgFlag">
      <i class="fa fa-window-restore"></i>
      <span slot="title">分屏对比</span>
    </el-menu-item>
    <el-menu-item index="8" @click="rollUp">
      <i class="el-icon-rank"></i>
      <span slot="title">卷帘</span>
    </el-menu-item>
    <el-menu-item index="9" @click="analysis()">
      <i class="el-icon-search"></i>
      <span slot="title">分析</span>
    </el-menu-item>
    <!-- <el-menu-item index="909" @click="queryClick()">
      <i class="el-icon-search"></i>
      <span slot="title">周边查询</span>
    </el-menu-item> -->
  </el-menu>
<!--   <el-collapse-transition>
    <buffer-analysis v-show="showBufferFlag"></buffer-analysis>
  </el-collapse-transition> -->
  <!-- <el-collapse-transition>
    <map-district v-show="showDisFlag" @remove-district="removeDistrict"></map-district>
  </el-collapse-transition> -->
  <el-collapse-transition>
    <multi-screen-cfg :visible.sync="showMultiCfgFlag" v-on:click.prevent></multi-screen-cfg>
  </el-collapse-transition>
</div>
</template>

<script>
import Vue from "vue";
import L from "leaflet";
import axios from "axios";
import FullScreen from "../common/FullScreen";
import "./../../../static/lib/iclient9-leaflet.js";
import "./../../../static/lib/iclient9-leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet-draw/dist/leaflet.draw-src.js";
import "./../../../static/lib/leaflet-measure-path.js";
import "./../../../static/lib/leaflet-measure-path.css";
import "leaflet-contextmenu";
import "leaflet-contextmenu/dist/leaflet.contextmenu.min.css";
import { serviceMgr } from "./serviceMeta.js";
import {
  LMap,
  LWmsTilelayer,
  LMarker,
  LCircle,
  LRestTilelayer,
  LWmtsTilelayer,
  LSfsLayer,
  LLayerGroup,
  LDraw,
  LQuerybtnControl,
  LEsriDynamicTilelayer,
  LGeojson,
  LPolyline,
  LGraphiclayer
} from "./../../package/leaflet/main";
import {
  apiBaseMap,
  apiGetUserInfo,
  apiServiceCatalogServiceByID,
  apiServiceCatalogByResID,
  apiBufferService,
  updateMap
} from "@/apis/api";
import { ServiceConfig } from "@/config/app-config";
import {
  smRestMapFindByGeometry,
  smRestMapFindByDistance,
  smQueryLayerInfo,
  smRestMapFindBySql
} from "./../common/supermapService";
import {
  convertBufferToLayer,
  convertLayerToBufferParams
} from "@/components/common/dfcUtil";
import TabList from "./childrens/TabList.vue";
import MarkerQueryList from "./childrens/MarkerQueryList.vue";
import FunctionalTable from "./../common/FunctionalTabel";
import SpecialTable from "./../common/SpecialTable";
import { Loading } from "element-ui";
import { sortServiceInfos } from "./../common/serviceUtil.js";
import { convertMeterToRealLength } from "./../common/mapUtil.js";
import "../../../static/lib/leaflet-heat.js";
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
import BufferAnalysis from './childrens/BufferAnalysis'
import UploadCoords from './UploadCoords'
import MapDistrict from './childrens/District'
import MultiScreenCfg from './multi-screen/MultiScreenCfg'

export default {
  components: {
    BufferAnalysis,
    UploadCoords,
    MapDistrict,
    MultiScreenCfg
  },
  data() {
    return {
      currentGeoType: "polygon",
      showDisFlag:false,
      showMultiCfgFlag: false
    }
  },
  mounted() {
       this.initEvent();
  },
  beforeDestroy(){
     
  },
  computed: {
    ...mapState({
      isShowAllScreen: state => state.map.isShowAllScreen,
      isShowLegend: state => state.map.isShowLegend,
      isShowUploadBtn: state => state.map.isShowUploadBtn,
      mapMode: state => state.map.mapMode,
      showBufferFlag: state => state.map.showBufferFlag,
      acitveDis: state => state.map.acitveDis,
      analysisShow: state => state.map.analysisShow,



      mapMode: state => state.map.mapMode,
      baseMapLayersGroup: state => state.map.baseMapLayersGroup,
      specialLayers: state => state.map.specialLayers,
      legendShow: state => state.map.legendShow,
      userInfo: state => state.user.userInfo,
      currentBaseMapIndex: state => state.map.currentBaseMapIndex,
      isShowMenu: state => state.map.isShowMenu,
      geojsonDataFlag: state => state.map.geojsonDataFlag,
      currentActiveLayerIndex: state => state.map.currentActiveLayerIndex,
      districtLayer: state => state.map.districtLayer,
      markLayers: state => state.map.markLayers,
      isMarkerListShow: state => state.map.isMarkerListShow,
      graphics: state => state.map.graphics,
      analysisParams: state => state.map.analysisParams
    })
  },
  methods: {
    ...mapMutations([
      'changeMapMode',
      'changeQueryWin',
      'changeShowMenu',
      'changeShowAllScreen',
      'showHideLegend',
      'changeUploadBtn',
      'changeBufferState',
      'changeAnlysisShow',

      "addBaseMapLayersGroup",
      "addLayer",
      "removeLayer",
      "changeLayerZIndex",
      "addUser",
      "changeGeoJsonDataFlag",
      "removeAllSLayer",
      "changListShow",
      "changeCurrentActiveLayer",
      "removeDistrictLayer",
      "storeCurrentMapState",
      // why
      "addMarkLayers",
      "removeAllMarkLayer",
      "changeGraphics",
      "removeGraphics",
      "changeMarkerQueryList",
      'changeAnalysisParams'
    ]),
    initEvent(){
       EventBus.$on("query-seleted", this.showOne);
    },
     offEvent(){
       EventBus.$off("query-seleted", this.showOne);
     },
    removeDistrict(){
      this.showDisFlag = false;
    },
    showQh(){
      this.showDisFlag = !this.showDisFlag;
    },
    fullWidth() {
      EventBus.$emit("toolbar-fullwidth");
    },
    rollUp(){
      this.changeAnlysisShow(false); // 关闭分析
      // alert("roll")
      document.getElementById('el-close').style.opacity = 1
       this.changeMapMode('rollup');
        this.changeShowMenu(false);
        this.changeQueryWin(false);
      },

    
    clearAll() {
      EventBus.$emit("toolbar-clearAll");
    },
    fullScreen() {
      EventBus.$emit("toolbar-fullscreen");
      this.changeShowAllScreen(!this.isShowAllScreen)
    },
    measured(command) {
      EventBus.$emit('toolbar-measured', command);
    },
    showLegend() {
      this.showHideLegend(!this.isShowLegend)
    },
    change(e) {
      let self = this;
      this.readTxtFile(e, function(data) {
        EventBus.$emit('toolbar-addTxtData', data, self.currentGeoType);
      }, function() {
        self.$message.warning('上传失败')
      })
    },
    readTxtFile(input, sc, ec) {
      //支持chrome IE10
      if (window.FileReader) {
        let file = input.raw;
        let reader = new FileReader();
        reader.onload = function() {
          sc(this.result);
        };
        reader.readAsText(file);
      }
      //支持IE 7 8 9 10
      else if (typeof window.ActiveXObject != 'undefined') {
        let xmlDoc;
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.load(input.value);
        sc(xmlDoc);
      }
      //支持FF
      else if (document.implementation && document.implementation.createDocument) {
        let xmlDoc;
        xmlDoc = document.implementation.createDocument("", "", null);
        xmlDoc.async = false;
        xmlDoc.load(input.value);
        sc(xmlDoc);
      } else {
        ec();
      }
    },
    analysis() {
      this.changeAnlysisShow(!this.analysisShow);
    },
  },
  destroy() {

  }

}
</script>

<style type="text/css" lang="scss">
.map-toolbar {
    position: absolute;
    top: 2%;
    z-index: 999;
    right: 12px;
    height: 33px;
    box-shadow:5px 0px 16px rgba(152,152,152,1);
    background: rgba(255,255,255,1);
    user-select: none;
    border-radius: 5px;
    
    .el-menu--horizontal>.el-menu-item{
      height: 33px !important;
      line-height: 33px !important;
      color: #333333;
    }
    .el-menu--horizontal{
      border-radius:5px
    }
    .el-menu-item, .el-submenu .el-submenu__title {
        padding: 0 5px;
        height: 33px;
        line-height: 33px;
        vertical-align: middle;
        font-size: 14px;
    }
    .el-menu-item i {
        width: 13px;
        color: #333333;
    }

    .dropdown-link {
      font-size: 14px;
      margin: 0;
      color: #333333;
      padding-bottom: 3px;
    }

    .el-dropdown-menu{
      .el-switch{
          padding: 20% !important;
        }
      .el-switch:active{
        border:none
      }
    }
}
</style>
