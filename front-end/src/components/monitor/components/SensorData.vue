<template>
    <div class="sensor-data" v-show="showPanel">
<!--         <div class="s-icon" @click="changeShow" title="折叠显示菜单栏">
            <i :class="['fa',showList?'fa-hand-o-left':'fa-hand-o-right']"></i>
        </div> -->
        <a class="close-button" @click="hidePanel">×</a>
        <div>
            <div class="sensor-data-title">
                <span>{{deviceName||""}}监测点一小时内监测数据</span>
                <p>{{new Date().toString()}}</p>
            </div>
            <div class="sensor-data-item">
                <div class="sensor-data-item-title">
                    <span>城市运行</span>
                </div>
                <div class="sensor-data-item-main">
                    <table width="100%">
                        <tr>
                            <td>
                                <span>人流量:</span>
                                <span class="sensor-data-item-value">{{humanFlow}}</span>
                                <span>人</span>
                            </td>
                            <td>
                                <span>车流量:</span>
                                <span class="sensor-data-item-value">{{carFlow}}</span>
                                <span>辆</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>噪音:</span>
                                <span class="sensor-data-item-value">{{noise}}</span>
                                <span>分贝</span>
                            </td>
                            <td></td>
                        </tr>
                    </table>

                </div>
            </div>
            <div class="sensor-data-item">
                <div class="sensor-data-item-title">
                    <span>舒适度</span>
                </div>
                <div class="sensor-data-item-main" style="height: 120px;line-height: 20px">
                    <div class="sensor-chart" id="temperature-chart"> &nbsp;</div>
                    <span>温度:</span>
                    <span>{{temperature}}</span>
                    <span>℃</span><br>
                    <span>湿度:</span>
                    <span>{{humidity}}</span>
                    <span>%</span><br>
                    <span>紫外线</span>
                    <span>{{uv}}</span>
                    <span>mW/m2</span><br>
                    <span>光照:</span>
                    <span>{{light}}</span>
                    <span>lux</span><br>
                    <span>风速:</span>
                    <span>{{windspeed}}</span><br>
                    <span>气压:</span>
                    <span>{{pressure}}</span>
                    <span>Pa</span><br>
                </div>
            </div>
            <div class="sensor-data-item">
                <div class="sensor-data-item-title">
                    <span>空气质量</span>
                </div>
                <div class="sensor-data-item-main">

                    <table width="100%">
                        <tr>
                            <td>
                                <span>
                                    指标名称
                                </span>
                            </td>
                            <td>
                                <span>pm2.5</span>
                            </td>
                            <td>
                                <span>pm10</span>
                            </td>
                            <td>
                                <span>co2</span>
                            </td>
                            <td>
                                <span>co</span>
                            </td>
                            <td>
                                <span>so2</span>
                            </td>
                            <td>
                                <span>no2</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span>
                                    指标值(ug/m3)
                                </span>
                            </td>
                            <td>
                                <span>{{pm2p5}}</span>
                            </td>
                            <td>
                                <span>{{pm10}}</span>
                            </td>
                            <td>
                                <span>{{co2}}</span>
                            </td>
                            <td>
                                <span>{{co}}</span>
                            </td>
                            <td>
                                <span>{{so2}}</span>
                            </td>
                            <td>
                                <span>{{no2}}</span>
                            </td>
                        </tr>
                    </table>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

const props = {
    deviceCode: String,
    /*    deviceName: String*/
};



export default {
    props: props,
    data() {
        return {
            humanFlow: 0,
            carFlow: 0,
            noise: 0,
            temperature: 0,
            humidity: 0,
            uv: 0,
            pressure: 0,
            light: 0,
            windspeed: 0,
            pm2p5: 0,
            pm10: 0,
            co2: 0,
            co: 0,
            so2: 0,
            no2: 0,
            showList: true,
            showPanel: false,
            deviceName: '',
        };
    },
    computed: {
        ...mapState({
            deviceInfo: state => state.map.deviceInfo,
            sensorData: state => state.map.sensorData
        })
    },
    methods: {
        hidePanel() {
            this.showPanel = false;
        }
    },
    watch: {
        sensorData: {
            handler: function (newVal, oldVal) {
                for (let data of newVal) {
                    switch (data.key) {
                        case "HUMANFLOW":
                            this.humanFlow = Math.floor(data.sum_value.value * 1000) / 1000;
                            break;
                        case "CARFLOW":
                            this.carFlow = Math.floor(data.sum_value.value * 1000) / 1000;
                        case "NOISE":
                            this.noise = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "TEMPERATURE":
                            this.temperature = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "HUMIDITY":
                            this.humidity = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "UV":
                            this.uv = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "PRESSURE":
                            this.pressure = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "LIGHT":
                            this.light = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "WINDSPEED":
                            this.windspeed = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "PM2P5":
                            this.pm2p5 = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "PM10":
                            this.pm10 = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "CO2":
                            this.co2 = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "CO":
                            this.co = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "SO2":
                            this.so2 = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                        case "NO2":
                            this.no2 = Math.floor(data.avg_value.value * 1000) / 1000;
                            break;
                    }
                }

                let mychart = this.$echarts.init(
                    document.getElementById("temperature-chart")
                );
                const option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} %'
                    },
                    series: [
                        {
                            name: '仪表盘',
                            type: 'gauge',
                            data: [{ value: this.temperature, name: '温度' }],
                            radius: '80%',
                            center: ['50%', '50%'],
                            min: -20,
                            max: 40,
                            splitNumber: 4,
                            axisLine: {            // 坐标轴线
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    width: 10,
                                    color: [[0.6, '#5d9cec'], [0.8, '#62c87f'], [1, '#f15755']]
                                }
                            },
                            axisTick: {            // 坐标轴小标记
                                length: 13,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle控制线条样式
                                    color: 'auto'
                                }
                            },
                            splitLine: {           // 分隔线
                                length: 18,        // 属性length控制线长
                                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                    color: 'auto'
                                }
                            },
                            axisLabel: {
                                color: '#666',
                            },
                            detail: {
                                formatter: '{value}',
                                fontSize: 24,
                                offsetCenter: [0, '85%']
                            },
                            title: {
                                fontSize: 12,
                                color: '#999',
                                offsetCenter: [0, '55%']
                            },
                            pointer: {
                                width: 3            // 指针大小
                            }
                        }
                    ]
                };
                mychart.setOption(option);
            },
            deep: true
        },
        deviceInfo: {
            handler(val, oldVal) {
                if (val) {
                    this.showPanel = val.show;
                    this.deviceName = val.deviceName;
                }
            },
            deep: true
        }
    }
};
</script>

<style lang="scss">
$lightBlue: #5098ea;

.sensor-data {
  position: absolute;
  right: 20px;
  top: 150px;
  width: 400px;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 0 5px 2px #ccc;
  border-radius: 5px;
  font-size: 14px;
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
  .s-icon {
    width: 18px;
    top: 0px;
    right: -17px;
    position: relative;
    color: #57bef9;
    font-size: 20px;
    cursor: pointer;
    position: absolute;
    background: #fff0;
    height: 96%;
    z-index: 999;
    &:hover {
      color: orange;
    }
  }
  .sensor-data-title {
    padding: 10px;
    background-color: $lightBlue;
    color: #fff;
    font-size: 16px;
    line-height: 20px;
    p {
      text-align: right;
      font-size: 12px;
    }
  }
  .sensor-data-item {
    padding: 10px;
    .sensor-data-item-title {
      font-size: 16px;
      color: $lightBlue;
      font-weight: bold;
    }
    .sensor-data-item-main {
      color: $lightBlue;
      .sensor-data-item-value {
        font-size: 30px;
        color: #ff6600;
        font-weight: 100;
      }
      .sensor-chart {
        width: 50%;
        height: 130px;
        float: left;
      }
    }
  }
  .sensor-data-item:nth-child(4) {
    table {
      td {
        text-align: center;
        line-height: 25px;
      }
    }
  }
}
</style>
