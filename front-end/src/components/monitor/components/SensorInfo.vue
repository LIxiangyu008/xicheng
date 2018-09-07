<template>
  <div class="sensor-table">
    <div class="sensor-header">
      <span class="sensor-title">监控点信息</span>
    </div>
    <div class="sensor-main">
      <table class="sensor-content">
        <tr>
          <td>设备名称:</td>
          <td>{{data.deviceName}}</td>
        </tr>
        <tr>
          <td>设备编码:</td>
          <td>{{data.deviceCode}}</td>
        </tr>
        <tr>
          <td>添加时间:</td>
          <td>{{data.addTime.replace('T',' ')}}</td>
        </tr>
        <tr>
          <td></td>
          <td>
            <el-button @click="getSensorDataByDeviceCode(data.deviceCode)">查看详情</el-button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { getSensorDataCollect } from "../../../apis/api";
import { mapMutations, mapState } from "vuex";

const props = {
  data: Object
};
export default {
  props: props,
  mounted() {
    //  this.getSensorDataByDeviceCode(this.data.deviceCode);
  },
  computed: {
    ...mapState({
      baitasTab: state => state.map.baitasTab,
      baitisAnalysisTime: state => state.map.baitisAnalysisTime
    })
  },
  methods: {
    ...mapMutations([
        "changeSensorData",
        "changeDeviceInfo",
        "changeBaitasPanelShow",
        "changeBaitasPanShowDetail",
        "changeBaitisAnalysisDetailData"
        ]),
    async getSensorDataByDeviceCode(deviceCode) {
      if(!this.baitasTab){  
          let deviceInfo = {};
          deviceInfo.deviceCode = deviceCode;
          deviceInfo.deviceName = this.data.deviceName;
          deviceInfo.show = true;
          this.changeDeviceInfo(deviceInfo);
          let data = await getSensorDataCollect(this.getParams(deviceCode,this.baitasTab));
          data = data.data.aggregations.ind.buckets;
          this.$store.commit("changeSensorData", data);
      }else{
        this.changeBaitasPanShowDetail({isShow:true,time:new Date()});
        let analysisData = await getSensorDataCollect(this.getParams(deviceCode,this.baitasTab));
        let datas = analysisData.data.aggregations.ind.buckets;
        this.changeBaitisAnalysisDetailData({data: datas,deviceName:this.data.deviceName});
        debugger
      }
    },
    getParams(deviceCode,index) {
      switch (index) {
        case 0:
          return {
            size: 0,
            query: {
              bool: {
                filter: [{
                    range: {
                      time: {
                        format: "yyyy-MM-dd HH:mm:ss",
                        gte: "2017-01-31 00:00:00",
                        lte: "2018-12-31 00:00:00"
                      }
                    }
                  },
                  {
                    match: {
                      deviceCode: deviceCode
                    }
                  }
                ]
              }
            },
            aggs: {
              ind: {
                terms: {
                  field: "indName.keyword"
                },
                aggs: {
                  avg_value: {
                    avg: {
                      field: "indValue"
                    }
                  },
                  sum_value: {
                    sum: {
                      field: "indValue"
                    }
                  }
                }
              }
            }
          }
        case 1:
          return {
            size: 0,
            query: {
              bool: {
                filter: [{
                    range: {
                      time: {
                        format: "yyyy-MM-dd HH:mm:ss",
                        gte: this.baitisAnalysisTime[0],
                        lte: this.baitisAnalysisTime[1]
                      }
                    }
                  },
                  {
                    match: {
                      deviceCode: deviceCode
                    }
                  }
                ]
              }
            },
            aggs: {
              ind: {
                terms: {
                  field: "indName.keyword",
                  "size": 10000000
                },
                aggs: {
                  avg_value: {
                    avg: {
                      field: "indValue"
                    }
                  },
                  sum_value: {
                    sum: {
                      field: "indValue"
                    }
                  },
                  max_value: {
                    max: {
                       field: "indValue"
                    }
                  },
                  min_value: {
                    min: {
                      field: "indValue"
                    }
                  }
                }
              }
            }
          };
      }
    }
  }
};

</script>
<style lang="scss">
.sensor-table {
  width: 300px;
  font-size: 14px;
  .sensor-header {
    padding: 5px;
    background: #5098ea;
    .sensor-title {
      font-size: 16px;
      color: #fff;
    }
  }
  .sensor-main {
    .sensor-content {
      width: 300px;
      td {
        padding: 5px 20px 5px 20px;
        .el-button {
          padding: 5px 10px;
          float: right;
        }
      }
    }
  }
}

</style>
