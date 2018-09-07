<template lang="html">
  <div class="baitis-analysis" v-show="isShow">
    <div class="head">
      <div class="head-title">
        <span>{{baitisAnalysisDetailData.deviceName}}监测点统计</span>
        <a class="close-button" @click="closePanel">×</a>
      </div>
      <div class="head-time">
        <span>2018-05-12 15:30</span>
      </div>
    </div>
    <div class="content">
      <div class="city-operation" style="height: 165px;" id="1">
        <div class="module-title">
          <span>城市运行</span>
        </div>
        <div class="quotas">
          <div class="quota-item">
            <span style="font-size: 20px;">{{humanFlow.avg}}</span>
            <span>(人次)</span>
            <br>
            <span>人流量平均值</span>
          </div>
          <div class="quota-item mg">
            <span style="font-size: 20px;">{{carFlow.avg}}</span>
            <span>(车次)</span>
            <br>
            <span>车流量平均值</span>
          </div>
          <div class="quota-item mg">
            <span style="font-size: 20px;">{{noise.avg}}</span>
            <span>(分贝)</span>
            <br>
            <span>噪音平均值</span>
          </div>
        </div>
        <ul class="quotas-detail">
          <li class="top">
            <span class="fc">人流量最低值：<span class="fg">{{humanFlow.min}}</span>&nbsp;人次</span>
          </li>
          <li class="top">
            <span class="fc">人流量最高值：<span class="fr">{{humanFlow.max}}</span>&nbsp;人次</span>
          </li>
          <li>
            <span class="fc">车流量最低值：<span class="fg">{{carFlow.min}}</span>&nbsp;人次</span>
          </li>
          <li>
            <span class="fc">车流量最高值：<span class="fr">{{carFlow.max}}</span>&nbsp;人次</span>
          </li>
          <li>
            <span class="fc">噪音最低值：<span class="fg">{{noise.min}}</span>&nbsp;分贝</span>
          </li>
          <li>
            <span class="fc">噪音量最高值：<span class="fr">{{noise.max}}</span>&nbsp;分贝</span>
          </li>
        </ul>
      </div>
      <div class="city-operation" style="height: 234px;" id="3">
        <div class="module-title">
          <span>舒适度</span>
        </div>
        <div class="quotas">
          <div class="quota-item">
            <span style="font-size: 20px;">{{temperature.avg}}</span>
            <span>(度)</span>
            <br>
            <span>温度平均值</span>
          </div>
          <div class="quota-item mg">
            <span style="font-size: 20px;">{{humidity.avg}}</span>
            <span>(%)</span>
            <br>
            <span>湿度平均值</span>
          </div>
          <div class="quota-item mg">
            <span style="font-size: 20px;">{{windspeed.avg}}</span>
            <span>(米/秒)</span>
            <br>
            <span>风速平均值</span>
          </div>
        </div>
        <ul class="quotas-detail">
          <li class="top">
            <span class="fc">温度最低值：<span class="fg">{{temperature.min}}</span>&nbsp;℃</span>
          </li>
          <li class="top">
            <span class="fc">温度最高值：<span class="fr">{{temperature.max}}</span>&nbsp;℃</span>
          </li>
          <li>
            <span class="fc">湿度最低值：<span class="fg">{{humidity.min}}</span>&nbsp;%</span>
          </li>
          <li>
            <span class="fc">湿度最高值：<span class="fr">{{humidity.max}}</span>&nbsp;%</span>
          </li>
          <li>
            <span class="fc">紫外线最低值：<span class="fg">{{uv.min}}</span>&nbsp;mW/m2</span>
          </li>
          <li>
            <span class="fc">紫外线最高值：<span class="fr">{{uv.max}}</span>&nbsp;mW/m2</span>
          </li>
          <li>
            <span class="fc">气压最低值：<span class="fg">{{pressure.min}}</span>&nbsp;Pa</span>
          </li>
          <li>
            <span class="fc">气压最高值：<span class="fr">{{pressure.max}}</span>&nbsp;Pa</span>
          </li>
          <li>
            <span class="fc">光照最低值：<span class="fg">{{light.min}}</span>&nbsp;lux</span>
          </li>
          <li>
            <span class="fc">光照最高值：<span class="fr">{{light.max}}</span>&nbsp;lux</span>
          </li>
          <li>
            <span class="fc">风速最低值：<span class="fg">{{windspeed.min}}</span>&nbsp;m/s</span>
          </li>
          <li>
            <span class="fc">风速最高值：<span class="fr">{{windspeed.max}}</span>&nbsp;m/s</span>
          </li>
        </ul>
      </div>
      <div class="city-operation" id="2">
        <div class="module-title">
          <span>空气质量</span>
        </div>
        <div class="quotas">
          <div class="quota-item wt">
            <span style="font-size: 20px;">{{avg_aqi}}</span>
            <br>
            <span>AQI平均值</span>
          </div>
          <div class="quota-item mg wt">
            <span style="font-size: 30px;" v-if="avg_aqi>=0 && avg_aqi<=20">优</span>
            <span style="font-size: 30px;" v-if="avg_aqi>20 && avg_aqi<=40">良</span>
            <span style="font-size: 30px;" v-if="avg_aqi>40 && avg_aqi<=60">差</span>
          </div>         
          <div class="info">
            <span style="font-size: 30px;"></span>
          </div>
        </div>
        <ul class="quotas-detail">
          <li class="top">
            <span class="fc">CO最低值：<span class="fg">{{co.min}}</span>&nbsp;ug/m3</span>
          </li>
          <li class="top">
            <span class="fc">CO最高值：<span class="fr">{{co.min}}</span>&nbsp;ug/m3</span>
          </li>
          <li>
            <span class="fc">NO2最低值：<span class="fg">{{no2.min}}</span>&nbsp;ug/m3</span>
          </li>
          <li>
            <span class="fc">NO2最高值：<span class="fr">{{no2.max}}</span>&nbsp;ug/m3</span>
          </li>
          <li>
            <span class="fc">SO2最低值：<span class="fg">{{so2.min}}</span>&nbsp;ug/m3</span>
          </li>
          <li>
            <span class="fc">SO2最高值：<span class="fr">{{so2.max}}</span>&nbsp;ug/m3</span>
          </li>
          <li>
            <span class="fc">PM10最低值：<span class="fg">{{pm10.min}}</span>&nbsp;ug/m3</span>
          </li>
          <li>
            <span class="fc">PM10最高值：<span class="fr">{{pm10.max}}</span>&nbsp;ug/m3</span>
          </li>
          <li>
            <span class="fc">PM2P5最低值：<span class="fg">{{pm2p5.min}}</span>&nbsp;ug/m3</span>
          </li>
          <li>
            <span class="fc">PM2P5最高值：<span class="fr">{{pm2p5.max}}</span>&nbsp;ug/m3</span>
          </li>
          <li>
            <span class="fc">O3最低值：<span class="fg">{{O3.min}}</span>&nbsp;ug/m3</span>
          </li>
          <li>
            <span class="fc">O3最高值：<span class="fr">{{O3.max}}</span>&nbsp;ug/m3</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { getSensorDataCollect } from "./../../../../apis/api"
import { mapMutations, mapState } from "vuex";
let aqi = QUOTACONFIG.AQI;//空气质量标准配置
export default {
  components: {},
  data() {
    return {
      isShow: false,
      humanFlow:{
        max:"null",
        min:"null",
        avg:"null"
      },
      carFlow: {
        max:"null",
        min:"null",
        avg:"null"
      },
      noise: {
        max:"null",
        min:"null",
        avg:"null"
      },
      temperature: {
        max:"null",
        min:"null",
        avg:"null"
      },
      humidity: {
        max:"null",
        min:"null",
        avg:"null"
      },
      uv: {
        max:"null",
        min:"null",
        avg:"null"
      },
      pressure: {
        max:"null",
        min:"null",
        avg:"null"
      },
      light: {
        max:"null",
        min:"null",
        avg:"null"
      },
      windspeed: {
        max:"null",
        min:"null",
        avg:"null"
      },
      pm2p5: {
        max:"null",
        min:"null",
        avg:"null"
      },
      pm10: {
        max:"null",
        min:"null",
        avg:"null"
      },
      O3: {
        max:"null",
        min:"null",
        avg:"null"
      },
      co: {
        max:"null",
        min:"null",
        avg:"null"
      },
      so2: {
        max:"null",
        min:"null",
        avg:"null"
      },
      no2: {
        max:"null",
        min:"null",
        avg:"null"
      },      
      CO2: {
        max:"null",
        min:"null",
        avg:"null"
      },
      avg_aqi:"",
      quotas:["BATTERY","NOISE","LIGHT","TEMPERATURE","PRESSURE","HUMIDITY","O3","WINDSPEED","UV","HUMANFLOW","CARFLOW","CO2","PM2P5","CO","SO2","NO2","PM10"],
      AQI:["NO2", "CO", "SO2" ,"PM10" ,"PM2P5" ,"O3"]
    }
  },
  computed: {
    ...mapState({
      deviceInfo: state => state.map.deviceInfo,
      showStatPanel: state => state.map.showStatPanel,
      baitasPanShowDetail: state => state.map.baitasPanShowDetail,
      baitisAnalysisDetailData: state => state.map.baitisAnalysisDetailData
    })
  },
  watch: {
    baitasPanShowDetail: {
      handler(val, oldVal) {
        this.isShow = val.isShow;
      },
      deep: true
    },
    baitisAnalysisDetailData: {
      handler(val, oldVal) {
        if(!val){
          return;
        }
        let arrDetail = [];
        let arrAqi = [];
        for (let data of val.data) {
          this.quotas.filter(item =>{
            if(item == data.key){
              arrDetail.push(data);
            }
          })
          this.AQI.filter(item =>{
            if(item == data.key){
              arrAqi.push(data);
            }
          })
        }
        for (let data of arrDetail) {
          switch (data.key) {
            case "HUMANFLOW":
              this.humanFlow.max = data.max_value.value ;
              this.humanFlow.min = data.min_value.value;
              this.humanFlow.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "CARFLOW":
              this.carFlow.max = data.max_value.value;
              this.carFlow.min =data.min_value.value;
              this.carFlow.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "NOISE":
              this.noise.max = data.max_value.value ;
              this.noise.min = data.min_value.value;
              this.noise.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "TEMPERATURE":
              this.temperature.max = data.max_value.value;
              this.temperature.min = data.min_value.value;
              this.temperature.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "HUMIDITY":
              this.humidity.max = data.max_value.value ;
              this.humidity.min = data.min_value.value;
              this.humidity.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "UV":
              this.uv.max = data.max_value.value;
              this.uv.min = data.min_value.value;
              this.uv.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "PRESSURE":
              this.pressure.max = data.max_value.value;
              this.pressure.min = data.min_value.value;
              this.pressure.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "LIGHT":
              this.light.max = data.max_value.value;
              this.light.min = data.min_value.value;
              this.light.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "WINDSPEED":
              this.windspeed.max = data.max_value.value;
              this.windspeed.min = data.min_value.value;
              this.windspeed.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "PM2P5":
              this.pm2p5.max = data.max_value.value;
              this.pm2p5.min = data.min_value.value;
              this.pm2p5.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "PM10":
              this.pm10.max = data.max_value.value;
              this.pm10.min = data.min_value.value;
              this.pm10.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "O3":
              this.O3.max = data.max_value.value;
              this.O3.min = data.min_value.value;
              this.O3.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "CO":
              this.co.max = data.max_value.value;
              this.co.min = data.min_value.value;
              this.co.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "SO2":
              this.so2.max = data.max_value.value;
              this.so2.min = data.min_value.value;
              this.so2.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            case "NO2":
              this.no2.max = data.max_value.value;
              this.no2.min = data.min_value.value;
              this.no2.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
              case "CO2":
              this.CO2.max = data.max_value.value;
              this.CO2.min = data.min_value.value;
              this.CO2.avg = Math.floor(data.avg_value.value * 10) / 10;
              break;
            default:
              console.log(arrAqi);
              let avg_max = 0;
              for(let i = 0; i < arrAqi.length; i++){
                let constants = aqi[arrAqi[i].key];
                let quotaVal = arrAqi[i].avg_value.value;
                let index = 0;
                for(let j = 0; j < constants.length; j++){
                  if(constants[j] >= quotaVal){
                    index = j;
                    break;
                  }
                }
                if(index == 0 && avg_max <= 0){
                  avg_max = 0;
                }else{
                  let md = (aqi.IAQI[index] - aqi.IAQI[index-1])/(constants[index]-constants[index-1])*(quotaVal-constants[index-1]);
                  if(md > avg_max) {
                    avg_max = md;
                  }
                }
              }
              this.avg_aqi = Math.floor(avg_max * 10) / 10;
          }
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations([
      "changeSensorData",
      "changeDeviceInfo"
    ]),
    closePanel() {
      this.isShow = false;
    }
  }

}

</script>
<style lang="scss">
.el-date-table td.in-range div {
  background-color: #90c0f1 !important;
}

.baitis-analysis {
  width: 356px;
  ;
  height: 690px;
  border: 1px solid #409EFF;
  background: #FFFFFF;
  position: absolute;
  bottom: 50px;
  right: 10px;
  z-index: 999;
  font-size: 14px;
  .head {
    background: #5099EB;
    height: 50px;
    color: #FFFFFF;
    .head-title {
      line-height: 25px;
      margin-left: 5px;
      .close-button {
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
        &:hover {
          transform: rotate(360deg);
          -webkit-transform: rotate(360deg);
          -moz-transform: rotate(360deg);
          -o-transform: rotate(360deg);
          -ms-transform: rotate(360deg);
        }
      }
    }
    .head-time {
      line-height: 25px;
      text-align: center;
      font-size: 10px;
    }
  }
  .mg {
    margin-left: 15px;
  }
  .top {
    border-top: dashed 1px #6CCBE7;
  }
  .fc {
    color: #5099EB;
  }
  .fg {
    color: #66CD66;
  }
  .fr {
    color: #FF3415
  }
  li {
    width: 50%;
    float: left;
    border-bottom: dashed 1px #6CCBE7;
    line-height: 22px;
    font-size: 13px;
  }
  .content {
    padding: 8px;
    .city-operation {
      .module-title {
        font-size: 20px;
        color: #5099EB;
        padding-bottom: 10px;
      }
      .quotas {
        height: 45px;
        margin-bottom: 10px;
        .quota-item {
          width: 100px;
          padding: 2px;
          color: #66CD66;
          border: 1px solid;
          float: left;
          text-align: center;
        }
        .wt {
          width: 160px;
          height: 45px;
        }
      }
    }
  }
}

</style>
