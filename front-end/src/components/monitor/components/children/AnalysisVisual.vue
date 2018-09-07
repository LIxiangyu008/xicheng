<template lang="html">
  <div class="analysisVisual">
    <span class="moduleStyle">分析</span>
    <div class="tool-select">按&nbsp;
      <el-select style="width: 91%;" v-model="quotaName" placeholder="噪音" size="mini" @change="selectChange">
        <el-option v-for="items in renderoptions" :key="items.value" :label="items.label" :value="items.value">
        </el-option>
      </el-select>
    </div>
    <div class="analysis">
      <div>
        <el-radio-group v-model="informtype" size="mini" fill="#5098EA">
          <el-radio-button label="hour">时报</el-radio-button>
          <el-radio-button label="day">日报</el-radio-button>
          <el-radio-button label="week">周报</el-radio-button>
          <el-radio-button label="month">月报</el-radio-button>
          <el-radio-button label="year">年报</el-radio-button>
        </el-radio-group>
      </div>
      <div class="indicator">
        <el-date-picker
            style="width: 98%;"
            v-model="times"
            type="daterange"
            @change="timeChange"
            size="mini"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
      </div>
      <el-button class="btnStyle" @click="queryData">分析</el-button>
    </div>
  </div>
</template>
<script>
import { getSensorDataCollect, getSensor } from "../../../../apis/api"
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      dataoptions: [{
        value: '白塔寺监测点',
        label: '白塔寺监测点'
      }, {
        value: '手机信令',
        label: '手机信令'
      }],
      value1: '',
      renderoptions: [{
        value: 'NOISE_噪音',
        label: '噪音'
      }, {
        value: 'LIGHT_光照',
        label: '光照'
      }, {
        value: 'TEMPERATURE_温度',
        label: '温度'
      }, {
        value: 'PRESSURE_气压',
        label: '气压'
      }, {
        value: 'HUMIDITY_湿度',
        label: '湿度'
      }, {
        value: 'O3_臭氧',
        label: '臭氧'
      }, {
        value: 'HCHO_甲醛',
        label: '甲醛'
      }, {
        value: 'WINDSPEED_风速',
        label: '风速'
      }, {
        value: 'UV_紫外线',
        label: '紫外线'
      }, {
        value: 'HUMANFLOW_人流量',
        label: '人流量'
      }, {
        value: 'CARFLOW_车流量',
        label: '车流量'
      }, {
        value: 'CO2_二氧化碳',
        label: '二氧化碳'
      }, {
        value: 'PM2P5_细颗粒物',
        label: '细颗粒物'
      }, {
        value: 'CO_一氧化碳',
        label: '一氧化碳'
      }, {
        value: 'SO2_二氧化硫',
        label: '二氧化硫'
      }, {
        value: 'NO2_二氧化氮',
        label: '二氧化氮'
      }, {
        value: 'PM10_可吸入颗粒物',
        label: '可吸入颗粒物'
      }, {
        value: 'VOC_挥发性有机化合物',
        label: '挥发性有机化合物'
      }],
      informtype: 'hour',
      times: ["2017-12-15 00:00:00", "2017-12-15 23:00:00"],
      largetime: '2017-12-15 23:00:00',
      smalltime: '2017-12-15 00:00:00',
      quota: 'NOISE',
      quotaName: "噪音",
      informtypeMatch: {
        "hour": "时",
        "day": "日",
        "week": "周",
        "month": "月",
        "year": "年"
      }
    }
  },
  methods: {
    ...mapMutations([
      "changeBaitisAnalysisMapData",
      "changeBaitisAnalysisChartData",
      "changeBaitisAnalysisTime"
    ]),
    selectChange(val) {
      let quotas = val.split("_");
      this.quota = quotas[0];
      this.quotaName = quotas[1];
    },
    timeChange(times) {
      this.smalltime = times[0];
      this.largetime = times[1];
      this.changeBaitisAnalysisTime(times);
    },
    async queryData() {
      EventBus.$emit("clear-all");
      let params = this.initParams();
      let data = await getSensorDataCollect(params);
      let sensorData = await getSensor({ size: 10000 });
      let listData = data.data.aggregations.ind.buckets;
      let sData = sensorData.data.hits.hits;
      if (listData.length) {
        let eChartdatas = listData[0].datetime.buckets;
        let  heatData = listData[0].deviceData.buckets;
        let statObj = {};
        let aggsData = eChartdatas.map(item => {
          return {
            time: item.key_as_string,
            avgVal: item.avgValue.value,
            sumVal: item.sumValue.value
          };
        });
        statObj.data = aggsData;
        statObj.title = this.quotaName;
        statObj.statType = this.quotaName + this.informtypeMatch[this.informtype];
        this.changeBaitisAnalysisChartData(statObj);
        let resultData = heatData.map(item => {
            let matchData = sData.filter(data => {
              return data._source.deviceCode == item.key;
            });
            if (matchData.length) {
              let obj = {};
              obj = matchData[0]._source;
              obj.mVal = item.avg_value.value;
              return obj;
            }
        });
        this.changeBaitisAnalysisMapData(resultData);
        EventBus.$emit("add-specialLayer");
      } else {
        this.$message({
          message: '当前条件查询结果为空！',
          type: 'warning'
        });
      }
    },
    initParams() {
      return {
        "size": 0,
        "query": {
          "bool": {
            "filter": [{
                "range": {
                  "time": {
                    "format": "yyyy-MM-dd HH:mm:ss",
                    "gte": this.smalltime,
                    "lte": this.largetime
                  }
                }
              },
              {
                "match": {
                  "indName": this.quota
                }
              }
            ]
          }
        },
        "aggs": {
          "ind": {
            "terms": {
              "field": "indName.keyword",
              "size": 1000
            },
            "aggs": {
              "deviceData": {
                "terms": {
                  "field": "deviceCode.keyword",
                  "size": 10000000
                },
                "aggs": {
                  "avg_value": {
                    "avg": {
                      "field": "indValue"
                    }
                  }
                }
              },
              "datetime": {
                "date_histogram": {
                  "field": "time",
                  "interval": this.informtype,
                  "format": "yyyy-MM-dd HH:mm:ss"
                },
                "aggs": {
                  "avgValue": {
                    "avg": {
                      "field": "indValue"
                    }
                  },
                  "sumValue": {
                    "sum": {
                      "field": "indValue"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

</script>
<style lang="scss">
.analysisVisual {
  height: 100%;
  font-size: 14px;
  font-family: "微软雅黑";
  .moduleStyle {
    color: #999999;
    font-size: 17px;
    display: block;
    margin-bottom: 10px;
  }
  .m2 {
    margin-top: 45px
  }
  .tool-select {
    padding: 10px 0px 10px 10px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 60px;
  }
  .el-radio-button--mini .el-radio-button__inner {
    padding: 7px 14px !important;
    font-size: 12px;
    border-radius: 0;
  }
  .indicator {
    background-color: #5098EA;
    line-height: 40px;
    text-align: center;
    margin: 10px 0 10px 0;
    .el-date-editor .el-range-separator {
      padding: 0 5px;
      line-height: 20px !important;
      width: 9% !important;
      color: #303133;
    }
  }
  .btnStyle {
    color: #FFFFFF;
    background-color: #5098EA;
    width: 100%;
    margin-left: 0px;
  }
  .m1 {
    margin-top: 20px;
  }
}

</style>
