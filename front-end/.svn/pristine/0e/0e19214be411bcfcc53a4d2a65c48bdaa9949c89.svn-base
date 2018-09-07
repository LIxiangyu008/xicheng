<template>
<article class="tools">
  <el-menu class="scene-tool" mode="horizontal">

    <!-- 添加 -->
    <el-submenu index="203">
      <template slot="title">
        <i class="fa fa-window-maximize"></i>
        三维变迁
      </template>
      <el-menu-item index="203-1" @click.async="handleTimeList">区域变迁</el-menu-item>
      <el-menu-item index="203-2" @click.async="handleTime">{{varTime}}</el-menu-item>
    </el-submenu>
    <el-menu-item index="201" @click.async="attrClick">
      <i class="fa fa-search"></i>
      <span>{{seeAttr}}</span>
    </el-menu-item>
    <el-menu-item index="202" @click.async="delclick">
      <i class="fa fa-home"></i>
      <span>{{btntext}}</span>
    </el-menu-item>
    <el-menu-item index="3" @click.async="analysisFlagd">
      <i class="fa fa-cubes"></i>
      <span>三维分析</span>
    </el-menu-item>
    <el-menu-item index="12" @click.async="sceneLabel">
      <i class="icon-location2"></i>
      <span>场景标注</span>
    </el-menu-item>
    <el-menu-item index="11" @click.async="flyRoute">
      <i class="icon-paper-plane"></i>
      <span>飞行</span>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="icon-measure"></i>
      <el-dropdown @command="measure">
        <span class="el-dropdown-link">
          测量<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-tooltip content="是否贴地" placement="left">
            <el-switch class="choose-btn" v-model="isCloseToGround" active-color="#13ce66" inactive-color="#f0f0f0">
            </el-switch>
          </el-tooltip>
          <el-dropdown-item command="distance">量距</el-dropdown-item>
          <el-dropdown-item command="polyline">量面</el-dropdown-item>
          <el-dropdown-item command="height">量高</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu-item>
    <el-menu-item index="10" @click.async="showLegend">
      <i class="fa fa-road"></i>
      <span>图例</span>
    </el-menu-item>
    <el-menu-item index="9" @click.async="clearAll">
      <i class="fa fa-trash"></i>
      <span>清除</span>
    </el-menu-item>
  </el-menu>
  <el-collapse-transition>
    <analysis-tool v-show="analysisFlag" @analysis-close="analysisClose"></analysis-tool>
  </el-collapse-transition>
  <!-- <transition
          enter-active-class="animated flipInY"
          leave-active-class="animated flipOutY"
          >
          <analysis-tool v-show="analysisFlag==true" @analysis-close="analysisClose"></analysis-tool>
        </transition> -->
  <scene-label v-show="sceneLabelShow"></scene-label>
  <fly-route v-show="flyShow"></fly-route>
  <historical-dimensional v-if="showTimeAxias" :HDlayers="HDlayers" :Model="Model" :buildlayer="buildlayer" :buildId="buildId" @updateTime="updateTime" @updateYear="updateYear" :sonSlider="sonSlider" @resonSlider="resonSlider">
  </historical-dimensional>
  <time-list v-if="timeListShow" :AreaArr="AreaArr" :HDlayers="HDlayers"></time-list>
</article>
</template>

<script>
import analysisTool from './AnalysisTool';
import sceneLabel from './SceneLabel';
import flyRoute from './FlyRoute';
import HistoricalDimensional from './HistoricalDimensional'
import TimeList from './TimeList'
import {
  mapState,
  mapMutations
} from 'vuex'
import {
  smFindBySql
} from "./../../common/supermapService";
let handler
let pastIndex = APPCONFIG.Analysis.default.pastIndex // 三维历史重点区域查询配置

export default {
  components: {
    analysisTool,
    sceneLabel,
    flyRoute,
    HistoricalDimensional,
    TimeList
  },
  data() {
    return {
      analysisFlag: false,
      isCloseToGround: false,
      btntext: '房屋揭盖',
      seeAttr: '属性查看',
      mapname: APPCONFIG.Analysis.default.scenes[0].building,
      isDel: false,
      isSee: false,
      sceneLabelShow: false,
      timeListShow: false,
      flyShow: false,
      legendShow: true, //仅仅作为图例显示与否的标志位
      showTimeAxias: false,
      HDlayers: [],
      // larArr:[],
      varTime: '建筑变迁',
      isTime: false,
      Model: '',
      buildId: null,
      buildlayer: null,
      newArrs: [],
      AreaArr: [],
      initYear: APPCONFIG.Analysis.default.scenes[0].time,
      sonSlider: null
    }
  },
  created() {

  },
  mounted() {
    var that =  this;
    EventBus.$on('showTimeAxias', this.FunshowTimeAxias)
    // EventBus.$on('blankArrs',blankArrs =>{
    //   that.newArrs = blankArrs
    //   console.log(that.newArrs)
    // });
  },
  computed: {
    ...mapState({
      isShowLegend: state => state.map.isShowLegend
    })
  },
  methods: {
    ...mapMutations([
      'cShowHideLegend',
      'changeShowMenu',
      'changeQueryWin',
      'changeMapMode',
      'handleShowHisModel'
    ]),
    analysisFlagd() {
      if (this.analysisFlag === true) {
        this.clearAll();
        return;
      }
      this.clearAll();
      this.analysisFlag = !this.analysisFlag;
    },
    analysisClose() {
      this.analysisFlag = false;
    },
    measure(command) {
      EventBus.$emit('toolbar-measured', command, this.isCloseToGround);
    },
    clearAll() {
      EventBus.$emit('toolbar-clearAll');
      this.closeAll();
      this.closetxt();
      this.closeArrt()
      this.closeTime()

    },
    cleraAlls() {

    },
    closeAll() {

      this.analysisFlag = false;
      this.sceneAnalysisShow = false;
      this.flyShow = false;
      this.sceneLabelShow = false;
      this.timeListShow = false
      this.cShowHideLegend(false);
    },
    closeTime() {
      this.isTime = false
      this.varTime = '建筑变迁'
      this.handleShowHisModel(this.isTime)
    },
    closetxt() {
      if (this.btntext == '关闭揭盖') {
        this.buildlayer.setOnlyObjsVisible(this.newArrs, true)
        this.newArrs = [];
        this.btntext = '房屋揭盖'
        this.isDel = false
      } else {
        this.btntext = '房屋揭盖'
        this.isDel = false
      }
    },
    closeArrt() {
      this.isSee = false;
      this.seeAttr = '属性查询';
      document.getElementById('bubble').style.display = 'none';
      // EventBus.$on('clickCols', this.clickClose)
      // EventBus.$emit('seeAttr', this.isAttr);
    },
    showLegend() {
      this.legendShow = !this.legendShow;
      if (this.legendShow === true) {
        this.clearAll();
        return;
      }
      this.clearAll();
      this.cShowHideLegend(!this.isShowLegend);
    },
    flyRoute() {
      if (this.flyShow === true) {
        this.clearAll();
        return;
      }
      this.clearAll();
      this.flyShow = !this.flyShow;
      EventBus.$emit('fly-start');
    },
    sceneLabel() {
      if (this.sceneLabelShow === true) {
        this.clearAll()
        return;
      }
      this.clearAll();
      this.sceneLabelShow = !this.sceneLabelShow;
      EventBus.$emit('scene-label');
    },
    delclick() {
      let that = this
      if (this.showTimeAxias == true) {
        this.closeAll()
        this.closeArrt()
        this.closeTime()
        this.isDel = !this.isDel
        handler = new Cesium.ScreenSpaceEventHandler(Viewer.scene.canvas)

        if (this.isDel == true) {
          this.btntext = '关闭揭盖'
          //设置鼠标左键单击回调事件
          handler.setInputAction(this.delClickMethod, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        } else {
          this.btntext = '房屋揭盖'

          this.delClickMethod();

          if (handler != undefined) {
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            handler = handler && handler.destroy()
          }
          this.$message.success('关闭功能成功')
        }
        EventBus.$emit('delClickModel', this.isDel)
      } else {
        this.$message.error("暂无地图三维数据，请联系管理员！");
      }

    },
    // 属性查询开关
    attrClick() {
      let that = this
      if (this.showTimeAxias == true) {
        this.closeAll()
        this.closetxt();
        this.closeTime()
        this.isSee = !this.isSee
        handler = new Cesium.ScreenSpaceEventHandler(Viewer.scene.canvas)
        if (this.isSee == true) {
          this.seeAttr = '关闭属性查看'
          //  this.attrHid()
          //设置鼠标左键单击回调事件
          handler.setInputAction(this.attrHide, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        } else {
          this.seeAttr = '属性查看'
          document.getElementById('bubble').style.display = 'none';
          if (handler != undefined) {
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            handler = handler && handler.destroy()
          }
          this.$message.success('关闭功能成功')
        }
        EventBus.$emit('attrClickModel', this.isSee)
      } else {
        this.$message.error("暂无属性数据，请联系管理员！");
      }
    },
    showHisPlan() {
      if (this.hisDimShow === true) {
        this.clearAll();
        return;
      }
      this.clearAll();
      this.hisDimShow = !this.hisDimShow;
    },
    FunshowTimeAxias(layers) {
      this.HDlayers = layers
      if (layers.length < 2) { // 若只有一个场景配置，则不显示时间轴
        this.showTimeAxias = false
      } else {
        this.showTimeAxias = true
      }
    },
    handleTime() {
      let that = this
      if (this.showTimeAxias == true) {
        this.closeAll()
        this.closetxt()
        this.closeArrt()

        this.isTime = !this.isTime
        handler = new Cesium.ScreenSpaceEventHandler(Viewer.scene.canvas)
        if (this.isTime == true) {
          this.varTime = '关闭建筑变迁'
          //设置鼠标左键单击回调事件
          handler.setInputAction(this.handlerMethod, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        } else {
          this.varTime = '建筑变迁'
          this.handleShowHisModel(false)
          if (handler != undefined) {
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
            handler = handler && handler.destroy()
          }
          this.$message.success('关闭功能成功')
        }
        EventBus.$emit('handleHisModel', this.isTime)
      } else {
        this.$message.error("暂无历史三维数据，请联系管理员！");
      }
    },
    handlerMethod(e) {
      if (this.varTime == "关闭建筑变迁") {
        let that = this
        let layers = this.HDlayers;
        for (let i = 0; i < layers.length; i++) {
          for (let j = 0; j < layers[i].length; j++) {
            if (layers[i][j].visible == true) { // 判断当前场景是否显示
              if (layers[i].spaceId == this.initYear) { //判断当前场景年份是否正确
                if (layers[i][j].name == APPCONFIG.Analysis.default.scenes[i].building) {
                  that.sonSlider = i
                  that.buildId = layers[i][j].getSelection() //获取点击模型的ModelID
                  that.Model = that.buildId[0]
                  that.buildlayer = layers[i][j] // 传参给子组件 进行当前模型的隐藏
                  that.handleShowHisModel(true)
                }
              }
            }
          }
        }
      }
    },
    updateTime(e) {
      this.varTime = e
      this.isTime = false
    },
    updateYear(e) {
      this.initYear = e
    },
    resonSlider(val) {
      this.sonSlider = val
    },
    delClickMethod(e) {
      let that = this
      if (this.btntext == "关闭揭盖") {
        let layers = this.HDlayers;
        for (let i = 0; i < layers.length; i++) {
          for (let j = 0; j < layers[i].length; j++) {
            if (layers[i][j].visible == true) { // 判断当前场景是否显示
              if (layers[i][j].name == APPCONFIG.Analysis.default.scenes[i].building) {
                that.buildId = layers[i][j].getSelection() //获取点击模型的ModelID
                that.Model = that.buildId[0];
                that.buildlayer = layers[i][j] 
                that.newArrs.push(that.Model);
                that.buildlayer.setOnlyObjsVisible(that.newArrs, false);
                EventBus.$emit('yearSwitch', this.newArrs)
              }
            }
          }
        }
      } else if (this.btntext == "房屋揭盖") {

        that.buildlayer.setOnlyObjsVisible(this.newArrs, true)
        this.newArrs = []
        if (this.newArrs != 0) {
          that.buildlayer.setOnlyObjsVisible(this.newArrs, true);
          this.newArrs = []
        }
      }
    },
    attrHide(e) {
      if (this.seeAttr == "关闭属性查看") {
        let that = this
        let layers = this.HDlayers;
        for (let i = 0; i < layers.length; i++) {
          for (let j = 0; j < layers[i].length; j++) {
            if (layers[i][j].visible == true) { // 判断当前场景是否显示
              if (layers[i][j].name == APPCONFIG.Analysis.default.scenes[i].building) {
                that.buildlayer = layers[i][j] // 传参给子组件 进行当前模型的隐藏

                var selectModelID = that.buildlayer.getSelection();
                var sql = APPCONFIG.Analysis.default.scenes[i].keyWord + " like '%" + selectModelID + "%'";
                smFindBySql({
                  url: "/webframe/biz/httpproxy/httpproxy.jsp?url=" + ATTRVALUE.mapurl,
                  sql: sql,
                  dataSourceName: ATTRVALUE.dataSourceName,
                  dataSetName: ATTRVALUE.dataSetName,
                  options: {}
                }).then((res) => {
                  document.getElementById('bubble').style.display = 'block';
                  var infoboxContainer = document.getElementById("bubble");
                  that.buildlayer.customInfobox = infoboxContainer;
                  if (res.result.features.features.length == 1) {
                    EventBus.$emit('tablevalue', res.result.features.features[0].properties)
                  } else if (res.result.features.features.length == 0) {
                    this.$message.error('该建筑模型无数据，请点击其他建筑模型')
                    document.getElementById('bubble').style.display = 'none';
                    // EventBus.$emit('tablevalue',res.result.features.features.properties)
                  }
                })
              }
            }
          }
        }
      }
    },
    handleTimeList() { // 重点区域三维历史列表
      if (this.timeListShow === true) {
        this.clearAll()
        return
      }
      this.clearAll()
      this.timeListShow = !this.timeListShow
      if (this.timeListShow === true) {
        this.queryArea()
      }
    },
    queryArea() {
      var getFeatureParam, getFeatureBySQLService, getFeatureBySQLParams;
      getFeatureParam = new SuperMap.FilterParameter({
        attributeFilter: 'SmID > 0'
      });
      getFeatureBySQLParams = new SuperMap.GetFeaturesBySQLParameters({
        queryParameter: getFeatureParam,
        toIndex: -1,
        datasetNames: pastIndex.datasetNames
      });
      getFeatureBySQLService = new SuperMap.GetFeaturesBySQLService(pastIndex.url, {
        eventListeners: {
          "processCompleted": this.processCompleted,
          "processFailed": this.processFailed
        }
      });
      getFeatureBySQLService.processAsync(getFeatureBySQLParams);
    },
    processCompleted(queryEventArgs) {
      if (queryEventArgs.result.features == undefined) {
        this.$message.error('历史重点区域查询失败，请联系管理员！')
        return
      }
      var selectedFeatures = queryEventArgs.result.features.features
      let size = queryEventArgs.result.totalCount
      this.AreaArr = []
      for (let i = 0; i < size; i++) {
        let object = {}
        object.name = selectedFeatures[i].properties.NAME
        object.year = selectedFeatures[i].properties.YEAR
        object.x = selectedFeatures[i].geometry.coordinates[0][0][0][0]
        object.y = selectedFeatures[i].geometry.coordinates[0][0][0][1]
        this.AreaArr.push(object)
      }
    },
    processFailed() {
      this.$message.error('历史重点区域查询失败，请联系管理员！')
    }
  }
}
</script>

<style lang="scss">
.el-dropdown-menu {
    .el-switch {
        padding: 20% !important;
    }
    .el-switch:active {
        border: none;
    }
}
</style>
<style lang="scss" scoped>
.scene-tool {
    position: absolute;
    right: 10px;
    height: 33px;
    line-height: 33px;
    top: 14px;
    -webkit-box-shadow: 1px 1px 14px 0 #aaa;
    box-shadow: 1px 1px 14px 0 #aaa;
    background: #fff;
    border: none;
    border-radius: 5px;

    i {
        font-size: 20px;
        width: 13px;
        margin-right: 5px;
    }

    i.el-submenu__icon-arrow {
        display: none;
    }

    .el-menu-item {
        border-bottom: none !important;
        height: 33px;
        line-height: 33px;
        padding: 0 7px;
        border-radius: 5px;
    }
}

.childrens-items {

    li {
        float: left;
        transition: all 0.1s;

        &:hover {
            background: #eee;
        }
    }

    i {
        font-size: 20px;
        padding: 20px;
    }

    .queryInput {
        width: 390px;
        position: absolute;
        top: -2px;
        right: 0;
        height: 42px;
        line-height: 42px;
    }
}
</style>
<style type="text/css">
.tools>.scene-tool>.el-menu--horizontal>.el-menu-item {
  height: 41px !important;
  line-height: 41px !important;
}

.el-menu--horizontal>.el-submenu .el-submenu__title {
  height: 33px !important;
  line-height: 37px !important;
  padding: 0 7px !important;
}

.queryInput .el-input-group__prepend {
  width: 115px !important;
}

.queryInput .el-input .el-input__inner {
  height: 42px !important;
}

.queryInput .el-select .el-input.is-focus .el-input__inner {
  border-color: none !important;
}
</style>
