<template lang="html">
  <div class="tool">
    <div class="tool-menu">实时监测</div>
    <div class="tool-select">监测类型:
      <el-select style="width:76%;" v-model="monitorType" placeholder="白塔寺监测点" size="mini" @change="selectChange">
        <el-option v-for="item in dataoptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>

    <el-tabs type="border-card" stretch v-if="monitorType === '白塔寺监测点'" @tab-click="tabClick">
      <el-tab-pane label="实时信息">
          <immediate-info></immediate-info>
      </el-tab-pane>
      <el-tab-pane  label="分析与可视化">
        <analysis-visual></analysis-visual>
      </el-tab-pane>
    </el-tabs>
    <div class="phone-signal" v-else>
      <el-tabs type="border-card" stretch @tab-click="changeTab">
        <el-tab-pane label="实时信息">实时信息
        </el-tab-pane>
        <el-tab-pane label="分析与可视化">
          <signal-analysis></signal-analysis>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import ImmediateInfo from './children/ImmediateInfo'
import AnalysisVisual from './children/AnalysisVisual'
import SignalAnalysis from './children/SignalAnalysis'
import { mapMutations} from "vuex";
export default {
    name: 'MonitorTool',
    data() {
        return {
            dataoptions: [{
                value: '白塔寺监测点',
                label: '白塔寺监测点'
            }, {
                value: '手机信令',
                label: '手机信令'
            }],
            monitorType: '白塔寺监测点',
            renderoptions: [{
                value: 'time',
                label: '时间'
            }, {
                value: 'area',
                label: '区域'
            }, {
                value: 'light',
                label: '亮度'
            }, {
                value: 'noise',
                label: '噪音'
            }, {
                value: 'pressure',
                label: '气压'
            }, {
                value: 'pm2.5',
                label: 'PM2.5'
            }, {
                value: 'pm10',
                label: 'PM10'
            }, {
                value: 'windspeed',
                label: '风速'
            }, {
                value: 'CO2',
                label: '二氧化碳'
            }, {
                value: 'CO',
                label: '一氧化碳'
            }, {
                value: 'SO2',
                label: '二氧化硫'
            }, {
                value: 'NO2',
                label: '二氧化氮'
            }, {
                value: 'VOC',
                label: '挥发性有机化合物'
            }, {
                value: 'O3',
                label: '臭氧'
            }, {
                value: 'CH2O',
                label: '甲醛'
            }],
        }
    },
    components: {
      ImmediateInfo,
      AnalysisVisual,
      SignalAnalysis
    },
    methods:{
      ...mapMutations([
        "changeBaitasTab",
        "changeBaitasPanelShow",
        "changeBaitasPanShowDetail",
        "changeBaitasPanShowChart"
      ]),
      selectChange(value){
          this.$emit("monitorType",value);
      },
      changeTab(val){
        let flag = true  
        if(val.label === "分析与可视化"){
          flag = false;
        }
        this.$emit("showMiddlePanel",flag);
      },
      tabClick(val){
        debugger
        this.changeBaitasPanShowChart({isShow:false,time:new Date()});
        if(val.paneName == 0){
          this.changeBaitasPanelShow(false);  
        }else {
          let obj = {};
          obj.isShow = false;
          obj.time =  new Date();
          this.changeBaitasPanShowDetail(obj);
          this.changeBaitasPanelShow(true);
        }
        this.changeBaitasTab(parseInt(val.paneName));
        EventBus.$emit("clear-all");
      }
    }
}
</script>

<style lang="scss" scoped>
.tool {
  height: 100%;
  border-right: 1px solid #62c7e4;
  font-size: 14px;
  overflow: hidden;
  font-family: "SimHei,微软雅黑";
  .phone-signal {
    width: 100%;
    height: 100%;
  }
  .el-input {
    width: 100%;
  }
  .tool-menu {
    background: #E5E9F2;
    padding: 0 20px ;
    font-size:18px;
    color: #333;
    height: 40px;
    line-height: 40px;
  }
  .tool-select {
    padding: 10px 0px 10px 10px;
  }
}
</style>
