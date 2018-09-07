<template lang="html">
  <div class="signal-middle">
    <el-main class="signal-main">
      <el-header class="head">
        <div class="header-left">
          <span>{{distTitle}}</span>
        </div>
        <div class="header-right">
          <span>{{timeTitle}}</span>
        </div>
      </el-header>
      <el-container height="100%">
        <div class="left">
          <div class="middle-top">
            <div class="title"><span>人流量趋势图</span></div>
            <div id="leftTopChart" class="leftTopChart"></div>
          </div>
          <div class="middle-bottom">
            <div class="title"><span>运行商人流量统计图</span></div>
            <div id="leftBottomChart" class="leftBottomChart"></div>
          </div>
        </div>
        <div class="right">
          <div class="middle-right">
            <div class="title"><span>运行商人流量统计图</span></div>
            <div id="rightChart" class="rightChart"></div>
          </div>
        </div>
      </el-container>
    </el-main>
  </div> 
</template>
<script>
let topChart = null,
  bottomChart = null,
  rightBarChart = null;
import { mapMutations, mapState } from "vuex";
export default {

  data() {
    return {
      unicomInfos:[],
      timess:[],
      mobileInfos:[],
      telecomInfos:[],
      pieChartDatas:[]
    }
  },
  watch:{
    mobileInfo:{
      handler(val,oldVal){
        if(val){
          this.mobileInfos = val.data;
        }else{
          this.mobileInfos = []
        }
        topChart.setOption(this.setChartOptions("lineChart"), true);
        rightBarChart.setOption(this.setChartOptions("barChart"), true);
      },
      deep:true
    },
    times:{
      handler(val,oldVal){
        this.timess = val; 
        topChart.setOption(this.setChartOptions("lineChart"), true);
        rightBarChart.setOption(this.setChartOptions("barChart"), true);
      },
      deep:true
    },
    unicomInfo:{
      handler(val,oldVal){
        if(val){
          this.unicomInfos = val.data;
        }else{
          this.unicomInfos = [];
        }
        topChart.setOption(this.setChartOptions("lineChart"), true);
        rightBarChart.setOption(this.setChartOptions("barChart"), true);
      },
      deep:true
    },
    telecomInfo:{
      handler(val,oldVal){
        if(val){
          this.telecomInfos = val.data;  
        }else{
          this.telecomInfos = []
        }
        topChart.setOption(this.setChartOptions("lineChart"), true);
        rightBarChart.setOption(this.setChartOptions("barChart"), true);
      },
      deep:true
    },
    pieChartData:{
      handler(val,oldVal){
        this.pieChartDatas = val;
        bottomChart.setOption(this.setChartOptions("pieChart"), true);
      },
      deep:true
    }
  },
  computed: {
   ...mapState({
      mobileInfo: state => state.map.mobileInfo,
      telecomInfo: state => state.map.telecomInfo,
      unicomInfo: state => state.map.unicomInfo,
      times: state => state.map.times,
      pieChartData: state => state.map.pieChartData,
      distTitle: state => state.map.distTitle,
      timeTitle: state => state.map.timeTitle,
    })
  },
  mounted() {
    this.initCharts();
  },
  methods: {
    initCharts() {
      if(this.mobileInfo && this.telecomInfo && this.times.length && this.unicomInfo && this.pieChartData){
        this.unicomInfos = this.unicomInfo.data;
        this.mobileInfos = this.mobileInfo.data;
        this.telecomInfos = this.telecomInfo.data;
        this.timess = this.times;
        this.pieChartDatas = this.pieChartData; 
      }
      topChart = this.$echarts.init(document.getElementById("leftTopChart"));
      topChart.setOption(this.setChartOptions("lineChart"), true);
      bottomChart = this.$echarts.init(document.getElementById("leftBottomChart"));
      bottomChart.setOption(this.setChartOptions("pieChart"), true);
      rightBarChart = this.$echarts.init(document.getElementById("rightChart"));
      rightBarChart.setOption(this.setChartOptions("barChart"), true);
    },
    setChartOptions(chartType) {
      if (!chartType) return;
      switch (chartType) {
        case "lineChart":
          return {
            title: {
              text: ''
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['移动', '电信','联通']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.timess
            },
            yAxis: {
              type: 'value'
            },
            series: [{
                name: '移动',
                type: 'line',
                stack: 'a',
                data: this.mobileInfos
              },
              {
                name: '电信',
                type: 'line',
                stack: 'b',
                data: this.telecomInfos
              },
              {
                name: '联通',
                type: 'line',
                stack: 'c',
                data: this.unicomInfos
              }
            ]
          };
        case "pieChart":
          return {
/*            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
            },*/
            legend: {
              orient: 'vertical',
              x: 'left',
              data: ['联通', '电信','移动']
            },
            color:["#7FB3ED","#FFAD5B","#FF5858"],
            series: [
                {
                    name:'人流量占比',
                    type:'pie',
                    radius: ['40%', '55%'],
                    label: {
                        normal: {
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#FFFFFF',
                            borderColor: '#58ADF3',
                            borderWidth: 1,
                            borderRadius: 4,
                            rich: {
                                a: {
                                    color: '#58ADF3',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                // abg: {
                                //     backgroundColor: '#333',
                                //     width: '100%',
                                //     align: 'right',
                                //     height: 22,
                                //     borderRadius: [4, 4, 0, 0]
                                // },
                                hr: {
                                    borderColor: '#58ADF3',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#FFFFFF',
                                    backgroundColor: '#58ADF3',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    data: this.pieChartDatas
                }
            ]
          };
        case "barChart":
          return {
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            color:["#7FB3ED","#FFAD5B","#FF5858"],
            legend: {
              data:  ['移动', '电信', '联通']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value'
            },
            yAxis: {
              type: 'category',
              data: this.timess
            },
            series: [{
                name: '移动',
                type: 'bar',
                stack: '总量',
                label: {
                  normal: {
                    show: true,
                    position: 'insideRight'
                  }
                },
                data: this.mobileInfos
              },
              {
                name: '电信',
                type: 'bar',
                stack: '总量',
                label: {
                  normal: {
                    show: true,
                    position: 'insideRight'
                  }
                },
                data: this.telecomInfos
              },
              {
                name: '联通',
                type: 'bar',
                stack: '总量',
                label: {
                  normal: {
                    show: true,
                    position: 'insideRight'
                  }
                },
                data: this.unicomInfos
              }
            ]
          };

      }

    }
  }
}

</script>
<style lang="scss" scoped>
.signal-middle {
  height: 100%;
  width: 100%;
  .title {
    line-height: 30px;
    font-size: 20px;
    color: #5089EA;
  }
  .signal-main {
    overflow: hidden;
    margin: 5px;
    .head {
      line-height: 60px;
      margin-bottom: 15px;
      text-align: center;
      .header-left {
        float: left;
        width: 360px;
        font-size: 25px;
        color: #FFFFFF;
        background: #58ADF3;
      }
      .header-right {
        float: left;
        margin-left: 50px;
        font-size: 21px !important;
        color: #58ADF3;
      }
    }
    .right{
      width: 50%;
      .middle-right {
        overflow: hidden;
        .rightChart {
          width: 100%;
          height:760px;
        }
      }
    }
    .left {
      overflow: hidden;
      width: 50%;
      .middle-top {
        .leftTopChart {
            height: 380px;
            width: 100%;
        }
      }
      .middle-bottom {
        height: 390px;
        .leftBottomChart {
            width: 100%;
            height: 380px;
        }
      }
    }
  }
}

</style>
