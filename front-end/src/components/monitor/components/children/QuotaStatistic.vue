<template lang="html">
	<div class="quota-statistic" v-if="showPanel">
		<div class="header">
			<div class="query-style">
				<div class="title">{{deviceInfo.deviceName}}监测点日统计</div>
				<div class="query">
				   <el-date-picker
				      v-model="value"
				      type="daterange"
				      @change="timeChange"
				      size="mini"
				      align="right"
				      unlink-panels
				      format="yyyy 年 MM 月 dd 日"
      				  value-format="yyyy-MM-dd"
				      range-separator="至"
				      start-placeholder="开始日期"
				      end-placeholder="结束日期">
				    </el-date-picker>
				</div>
			</div>
			<div class="quota-style">
			    <el-radio v-for="(quota,index) in quotas" style="width:112px;" :key="index" v-model="radio" @change="quotaChange" :label="quota.value" border>{{quota.name}}</el-radio>
		    </div>
			<a class="close-button" @click="hidePanel">×</a>
		</div>
		<div>
			<statistic-analysis :dayData="dayDatas"></statistic-analysis>
		</div>
	</div>
</template>
<script>
import StatisticAnalysis from './../../commons/StatisticAnalysis'
import { getSensorDataCollect } from "./../../../../apis/api"
import { mapMutations,mapState } from "vuex";
let aqi = QUOTACONFIG.AQI;//空气质量标准配置
let params={
  "size": 0,
  "query": {
    "bool": {
      "filter": [
        {
          "range": {
            "time": {
              "format": "yyyy-MM-dd",
              "gte": "2017-11-13",
              "lte": "2017-11-21"
            }
          }
        },
        {
          "match": {
            "indName": "HUMANFLOW"
          }
        },
        {
          "match": {
            "deviceCode": 61510030535260
          }
        }
      ]
    }
  },
  "aggs": {
    "per_day": {
      "date_histogram": {
        "field": "time",
        "interval": "day",
        "format": "yyyy-MM-dd",
        "min_doc_count": 0,
        "extended_bounds": {
          "min": "2017-11-13",
          "max": "2017-11-21"
        }
      },
      "aggs": {
        "ind": {
          "terms": {
            "field": "indName.keyword"
          },
          "aggs": {
            "avg_value": {
              "avg": {
                "field": "indValue"
              }
            },
            "sum_value": {
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

	export default {
		components: {
			StatisticAnalysis
		},
		data(){
			return{
				value: ["2017-11-13", "2017-11-21"],
				quotas:[{name:"人流量",value:"HUMANFLOW"},{name:"车流量",value:"CARFLOW"},{name:"温度",value:"TEMPERATURE"},{name:"湿度",value:"HUMIDITY"},{name:"空气质量",value:"NO2 CO SO2 PM10 PM2P5 O3"}],
				radio:"HUMANFLOW",
				deviceCode:"61510030535260",
				dayDatas:[],
				currQuota: '人流量',
				showPanel: false,
			}
		},
		computed: {
			 ...mapState({
		      deviceInfo: state => state.map.deviceInfo,
		      showStatPanel: state => state.map.showStatPanel
		    })
		},
		watch: {
			deviceInfo:{
				handler(val,oldVal){
					if(val.show){
						this.showPanel = true;
						let timeRange = params.query.bool.filter[0].range.time;
						let timeBounds= params.aggs.per_day.date_histogram.extended_bounds;
						timeRange.gte = this.value[0];
						timeRange.lte = this.value[1];
						timeBounds.min = this.value[0];
						timeBounds.max = this.value[1];
						params.query.bool.filter[1].match.indName = this.radio;
						this.queryData();
					}
				},
				deep:true
			}
		},
		methods:{
			...mapMutations([
				"changeSensorData",
				"changeDeviceInfo"
			]),
			hidePanel(){
				this.showPanel = false;
			},
			timeChange(time){
				if(!time){
					return;
				}
				let timeRange = params.query.bool.filter[0].range.time;
				let timeBounds= params.aggs.per_day.date_histogram.extended_bounds;
				timeRange.gte = time[0];
				timeRange.lte = time[1];
				timeBounds.min = time[0];
				timeBounds.max = time[1];
				this.queryData();
			},
			quotaChange(val){
				let indexName = params.query.bool.filter[1].match;
				indexName.indName = val;
				let currQuotaObj = this.quotas.filter(quota => quota.value === val);
				if(currQuotaObj.length){
					this.currQuota = currQuotaObj[0].name;
				}
				this.queryData();
			},
		    async queryData(){
		    	this.dayDatas = {};
		    	params.query.bool.filter[2].match.deviceCode = this.deviceInfo.deviceCode;
		    	let sensorData = await getSensorDataCollect(params);
		    	if(!sensorData.data.aggregations){
		    		return
		    	}
		    	console.log(params);
		    	let dayDatas = sensorData.data.aggregations.per_day.buckets;
		    	if(dayDatas.length){
		    		let obj = {};
		    		if(this.currQuota != "空气质量"){
		    			let dataArr = dayDatas.map(item =>{
		    				let ibkts = item.ind.buckets;
		    				let avg_value = 0;
		    				let sum_value = 0;
		    				if(ibkts.length){
		    					avg_value = ibkts[0].avg_value.value;
		    					sum_value = ibkts[0].sum_value.value;
		    				}
		    				return {
		    					time: item.key_as_string,
		    					avgVal: avg_value,
		    					sumVal: sum_value
		    				};

		    			});
		    			obj.data = dataArr;
		    		}else{
		    			let airData = dayDatas.map(item =>{
		    				let ibkts = item.ind.buckets;
		    				let avg_max = 0;
		    				if(ibkts.length){
		    					for(let i = 0; i < ibkts.length; i++){
		    						let constants = aqi[ibkts[i].key];
		    						let val = ibkts[i].avg_value.value;
		    						let index = 0;
		    						for(let j = 0; j < constants.length; j++){
		    							if(constants[j] >= val){
		    								index = j;
		    								break;
		    							}
		    						}
		    						if(index == 0 && avg_max <= 0){
		    							avg_max = 0;
		    						}else{
		    							let md = (aqi.IAQI[index] - aqi.IAQI[index-1])/(constants[index]-constants[index-1])*(val-constants[index-1]);
		    							if(md > avg_max) {
		    								avg_max = md;
		    							}
		    						}
		    					}
		    				}
		    				return{
		    					time: item.key_as_string,
		    					avgVal: avg_max
		    				};
		    			});
		    			obj.data = airData;
		    		}
		    		obj.title = this.currQuota;
		    		this.dayDatas = obj;
		    	}else{
		    		this.$message({
			          message: '当前条件查询结果为空！',
			          type: 'warning'
			        });
		    	}

			}
		}
	}
</script>
<style lang="scss" scoped>
	.el-range-editor.el-input__inner {
	    display: -webkit-inline-box;
	    display: -ms-inline-flexbox;
	    display: inline-flex;
	    -webkit-box-align: center;
	    -ms-flex-align: center;
	    align-items: center;
	    padding: 3px 3px;
	}
	.quota-statistic {
		width: 1000px;
		height: 300px;
		background-color: #FFFFFF;
		position: absolute;
    	bottom: 10px;
    	z-index: 999;
    	.header {
    		height: 60px;
    		position: relative;
			.close-button{
    			position: absolute;
			    top: 5px;
			    right: 6px;
			    font: 22px/18px Tahoma, Verdana, sans-serif;
			    color: #FFFFFF;
			    text-decoration: none;
			    font-weight: bold;
			    -webkit-transition: all .3s;
			    transition: all .3s;
			    cursor: pointer;
			    &:hover{
		            transform: rotate(360deg);
		            -webkit-transform: rotate(360deg);
		            -moz-transform: rotate(360deg);
		            -o-transform: rotate(360deg);
		            -ms-transform: rotate(360deg);
			    }
    		}
    		.query-style{
    			float:left;
    			height: 100%;
    			width: 370px;
    			.title{
    				padding-left: 5px;
    				line-height: 25px;
    				color: #FFFFFF;
    				font-family:"SimHei,微软雅黑"
    			}
    			.query {
    				padding-left: 10px;
    			}
    		}
    		.quota-style{
    			float:left;
    			line-height:60px;
    			.el-radio.is-bordered {
				    text-align: center;
				    border-radius: 4px;
				    border: 1px solid #dcdfe6;
				    -webkit-box-sizing: border-box;
				    box-sizing: border-box;
				    background: #FFF;
				    height: 40px;
				}
    		}
    	}
	}
</style>
