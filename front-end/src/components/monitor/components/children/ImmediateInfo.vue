<template lang="html">
  <div class="immediate">
    <div class="tool-select">按 
      <el-select v-model="quota" placeholder="噪音" size="mini" style="width: 190px;"  @change="changeSelect">
        <el-option v-for="items in renderoptions" :key="items.value" :label="items.label" :value="items.value">
        </el-option>
      </el-select>
      渲 染
    </div>
    <div class="rank_table">
      <div class="rank_header">
        <div class="rank_title">
          <span>{{quotaName}}指标排行榜</span>
        </div>
        <div class="rank_title update_time">
           <span>更新时间:{{currentTime}}</span> 
        </div>
      </div>
      <el-row>
        <el-radio v-model="rankVale" label="1">{{optimalName}}</el-radio>
        <el-radio v-model="rankVale" label="2">{{worstName}}</el-radio>
      </el-row>
      <el-table
        :data="tableData"
        highlight-current-row
        style="width: 100%;">
        <el-table-column label="排名">
           <template  slot-scope="scope">
            <span class="rankFont" :style="rankStyle">{{ scope.row.index }}</span>
          </template>
        </el-table-column>
        <el-table-column label="监测点">
          <template  slot-scope="scope">
            <span>{{ scope.row.deviceName }}</span>
          </template>
        </el-table-column>
        <el-table-column  label="监测值">
          <template  slot-scope="scope" >
            <span class="checkFont">{{ scope.row.monitorValue }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {mapMutations} from  'vuex'


let params = {
      size: 0,
      query: {
        bool: {
          filter: [
            {
              range: {
                time: {
                  format: "yyyy-MM-dd HH:mm:ss",
                  gte: "2016-09-25 04:00:00",
                  lte: "2020-10-25 05:00:00"
                }
              }
            },
            {
              match: {
                indName: "NOISE"
              }
            }
          ]
        }
      },
      aggs: {
        device: {
          terms: {
            field: "deviceCode.keyword",
            size: 10,
            order: {
              "avg_value.value": "asc"
            }
          },
          aggs: {
            avg_value: {
              avg: {
                field: "indValue"
              }
            }
          }
        }
      }
    };
  import { getSensorDataCollect, getSensor } from "./../../../../apis/api";
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
            value1: '',
            renderoptions: [{
                value: 'NOISE_噪音',
                label: '噪音'
            },{
                value: 'LIGHT_光照',
                label: '光照'
            },{
                value: 'TEMPERATURE_温度',
                label: '温度'
            },{
                value: 'PRESSURE_气压',
                label: '气压'
            },{
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
            },{
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
            quota: '',
            tableData: [],
            rankVale: '1',
            quotaField:'NOISE',
            orderType:'',
            quotaName: '噪音',
            currentTime:'',
            deviceInfos:[],
            rankStyle : "",
            optimalName:'最优排名',
            worstName:'最差排名',
         }
    },
    watch:{
      rankVale(val,oldVal){
        let quotaConfig = QUOTACONFIG[this.quotaField];
         let orderType = params.aggs.device.terms.order;
        if(val === "1"){
          if(quotaConfig.optimal){
            orderType['avg_value.value'] =  quotaConfig.optimal.order;
            this.rankStyle = quotaConfig.optimal.rankStyle;
          }else{
            orderType['avg_value.value'] = "desc"
          }
        } else {
          if(quotaConfig.worst){
            orderType['avg_value.value'] =  quotaConfig.worst.order;
            this.rankStyle = quotaConfig.worst.rankStyle;
          }else{
            orderType['avg_value.value'] = "asc"
          }
        }
        this.queryByQuota();
      }
    },
    mounted(){
      this.queryDeviceData();
    },
    methods:{

        ...mapMutations(['changeBaitasiMarkerQuota']),
      async queryByQuota(){
        let self = this;
        this.currentTime = this.formatDate(new Date().getTime());
        let devices = this.deviceInfos; 
        if(devices.length>0 && devices[0].index || devices.length==0){
          this.queryDeviceData();
        }
        let queryParams = params;
        let monitorInfos = await getSensorDataCollect(queryParams);
        if(!monitorInfos.data.aggregations){
          return;
        }
        let data = monitorInfos.data.aggregations.device.buckets;
        this.tableData = data.map((item,index) =>{
          let matchDevice = self.deviceInfos.filter(device =>{
           return device._source.deviceCode === item.key;
          })
          let diviceMonitorInfo = {};
          if(matchDevice.length){
            diviceMonitorInfo = matchDevice[0]._source;
            diviceMonitorInfo.monitorValue = Math.floor(item.avg_value.value * 100) / 100;
            diviceMonitorInfo.index = index + 1;
          }
          return diviceMonitorInfo;
        });
      },
       queryDeviceData(callback){
        this.tableData = [];
        let self = this;
        getSensor({ size: 10000 }).then((sensorData =>{
            let deviceInfo = sensorData.data.hits.hits;
            if(deviceInfo && deviceInfo.length){
              self.deviceInfos = deviceInfo;
              self.queryByQuota();
            }
        }));
      },
      changeSelect(value){
        let quotas = value.split("_");
        this.quotaField = quotas[0];
        this.quotaName = quotas[1];
        this.changeBaitasiMarkerQuota(this.quotaField);
        params.query.bool.filter[1].match.indName = this.quotaField;
        let quotaConfig = QUOTACONFIG[quotas[0]];
        let rankSelect = QUOTACONFIG.RANKSELECT;
        let orderType = params.aggs.device.terms.order;
        if(quotaConfig.optimal){
          if(this.rankVale === "1"){
             orderType['avg_value.value'] = quotaConfig.optimal.order;
          }else{
            orderType['avg_value.value'] = quotaConfig.worst.order;
          }   
          this.rankStyle = quotaConfig.optimal.rankStyle;
          this.optimalName = rankSelect.googbad.optimalName;
          this.worstName = rankSelect.googbad.worstName;
        }else{
          if(this.rankVale === "1"){
            orderType['avg_value.value'] ="desc";
          }else{
            orderType['avg_value.value'] = "asc";
          } 
           this.optimalName = rankSelect.bigsmall.optimalName;
           this.worstName = rankSelect.bigsmall.worstName;
        }
        this.queryByQuota();
      },
      formatDate(time){
        let date = new Date(time);
        let year = date.getFullYear(),
            month = date.getMonth() + 1,//月份是从0开始的
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();
        let newTime = year + '-' +month + '-' +day + ' ' +hour + ':' +min + ':' +sec;
        return newTime;         
      }
    }
}
</script>

<style lang="scss" scoped>
.immediate {
  height: 100%;
  font-size: 14px;
  font-family: "SimHei,微软雅黑";
  .tool-select {
    padding: 10px 0px 10px 10px;
    border-bottom: 1px solid #D3DCE6;
  }
  .el-button--mini, .el-button--mini.is-round {
      padding: 7px 6px;
  }
  .rank_table {
    .rank_header {
      height: 50px;
      background-color: #5098EA;
      .rank_title {
        text-align: center;
        color: #FFFFFF;
        padding: 5px;
      }
      .update_time {
        color: #E3D295; 
      } 
    } 
  }
  .el-row {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    margin: 10px 0;
    .btnSize {
      padding: 5px 11px
    }
  }
  .tableStyle th {
    padding: 8px 0;
  }
  .rankFont {
    color: black;
    padding: 10px;
    background-color: #DFAA75;
  }
  .checkFont {
    color:#DFAA75;
  }
  .el-table th {
      background: #DFAA75;
      color: #fff;
  }
  .el-table td, .el-table th {
      padding: 7px 0;
      min-width: 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-overflow: ellipsis;
      vertical-align: middle;
      position: relative;
  }
}
</style>
