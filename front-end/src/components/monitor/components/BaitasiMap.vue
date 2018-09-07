<template>
    <div class="xl-map">
        <div style="width: 100%;height: 100%;" id="xl-map">
        </div>
        <div v-if="!baitasPanelShow">
            <quota-statistic></quota-statistic>
            <SensorData :deviceName="deviceName" :deviceCode="deviceCode" />
            <div class="baitasi-legend">
                <ul>
                    <li>
                        <span style="background-color:#ff6464">&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span>&gt;{{legend[1]}}</span>
                    </li>
                    <li>
                        <span style="background-color:#008000"> &nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span>{{legend[0]}} &lt; value &lt; {{legend[1]}}</span>
                    </li>
                    <li>
                        <span style="background-color:#7f7f7f"> &nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span>无数据</span>
                    </li>
                </ul>
            </div>
        </div>
        <div v-if="baitasPanelShow">
            <baitashi-analysis></baitashi-analysis>
            <div class="batisStatAnalysis" v-show="isShow">
                <div class="title">
                    <span class="title-name">{{statType}}统计</span>
                    <span class="unit">数值单位：xxxxxx</span>
                    <a class="close-button" @click="hidePanel">×</a>
                </div>
                <statistic-analysis :dayData="dayData"></statistic-analysis>
            </div>
        </div>
    </div>

</template>

<script>
import SgsMap from "./../../map/SgsMap";
import Vue from "vue";
import L from "leaflet";
import "./../../../../static/lib/iclient9-leaflet.js";
import "./../../../../static/lib/iclient9-leaflet.css";
import { ServiceConfig } from "@/config/app-config";
import { getBaitasiData } from "@/apis/api";
import { mapState } from "vuex";
import { getSensorDataCollect, getSensor } from "../../../apis/api";
import SensorInfoVue from "./SensorInfo.vue";
import SensorData from "./SensorData";
import BaitashiAnalysis from "./children/BaitashiAnalysis";
import StatisticAnalysis from './../commons/StatisticAnalysis'
import QuotaStatistic from "./children/QuotaStatistic"
let XLmap = XLCONFIG.map; // static/config/app-config.js 配置
let XLcrs = XLCONFIG.crs; // static/config/app-config.js 配置
let XLthemeLayer = XLCONFIG.themeLayer; // static/config/app-config.js 配置
let map,heatLayer;

export default {
    components: {
        SensorData,
        BaitashiAnalysis,
        StatisticAnalysis,
        QuotaStatistic,
    },
    data() {
        return {
            deviceName: "",
            deviceCode: "",
            markerLayerGroup: {},
            isShow: false,
            dayData:[],
            statType:"",
        };
    },
    computed: {
        ...mapState({
            quota: state => state.map.baitasiMarkerQuota,
            baitisAnalysisMapData: state => state.map.baitisAnalysisMapData,
            baitasPanelShow: state => state.map.baitasPanelShow,
            baitasPanShowChart: state => state.map.baitasPanShowChart,
            baitisAnalysisChartData: state => state.map.baitisAnalysisChartData,
        }),
        legend() {
            return QUOTACONFIG[this.quota].low;
        }
    },
    watch: {
        quota: {
            handler: function (newVal, oldVal) {
                this.addMarker(newVal);
            }
        },
        baitasPanShowChart: {
            handler(val, oldVal) {
               this.isShow = val.isShow;     
            },
            deep:true
        },
        baitisAnalysisChartData: {
            handler(val, oldVal) {
                if(val && val.statType){
                    this.statType = val.statType;
                    this.dayData = val;
                }
            },
            deep:true
        },
    },
    methods: {
        initEvent() {
          EventBus.$on("clear-all", this.clearAll);
          EventBus.$on("add-specialLayer", this.addSpecialLayer);
        },
        offEvent() {
          EventBus.$off("clear-all", this.clearAll);
          EventBus.$off("add-specialLayer", this.addSpecialLayer);

        },
        handleChildMounted(){
            this.$nextTick(function () {
                this.dayData = this.baitisAnalysisChartData;
            });
        }
        ,
        // 初始化地图
        initXlMap() {
            // 设置平面坐标系
            var crs = L.CRS.NonEarthCRS({
                origin: L.point(XLcrs.bounds[0], XLcrs.bounds[3]),
                bounds: L.bounds(
                    [XLcrs.bounds[0], XLcrs.bounds[1]],
                    [XLcrs.bounds[2], XLcrs.bounds[3]]
                ),
                resolutions: XLcrs.resolutions
            });
            // 地图初始化
            map = L.map("xl-map", {
                center: [XLmap.center[1], XLmap.center[0]], // 此处坐标为[Y , X]
                crs: crs,
                maxBounds: L.latLngBounds(
                    L.latLng(XLcrs.bounds[1], XLcrs.bounds[0]),
                    L.latLng(XLcrs.bounds[3], XLcrs.bounds[2])
                ),
                maxZoom: XLmap.maxZoom,
                zoom: XLmap.zoom
            });
            var xl_wmts = L.supermap
                .wmtsLayer(XLmap.url, {
                    layer: XLmap.layer,
                    style: XLmap.style,
                    tilematrixSet: XLmap.tilematrixSet,
                    format: XLmap.format
                })
                .addTo(map);
            map.setView([306460.39585415, 500485.23391098], 5);
            this.addMarker(this.quota);
        },
        async addMarker(quote) {
            // map.removeLayer();
            map.setMaxZoom(5);
            this.markerLayerGroup.clearLayers && this.markerLayerGroup.clearLayers();


            let params = {
                size: 0,
                query: {
                    bool: {
                        filter: [
                            {
                                range: {
                                    time: {
                                        format: "yyyy-MM-dd HH:mm:ss",
                                        gte: "2017-09-25 04:00:00",
                                        lte: "2017-09-25 05:00:00"
                                    }
                                }
                            },
                            {
                                match: {
                                    indName: quote
                                }
                            }
                        ]
                    }
                },
                aggs: {
                    device: {
                        terms: {
                            field: "deviceCode.keyword",
                            size: 10000
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
            };
            let data = await getSensorDataCollect(params);
            let sensorData = await getSensor({ size: 10000 });
            data = data.data.aggregations.device.buckets;
            sensorData = sensorData.data.hits.hits;
            let markerLayers = [];
            for (let markerData of sensorData) {
                if (markerData._source.GPSy && markerData._source.GPSx) {

                    let datavalue = data.filter(function (value) {
                        return value.key === markerData._source.deviceCode
                    });

                    let iconUrl = '';
                    if (datavalue[0]) {
                        if (quote === "CARFLOW" || quote === "HUMANFLOW") {
                            if (datavalue[0].sum_value.value > QUOTACONFIG[quote].low[1]) {
                                iconUrl = './static/img/colorfulMarker/582989.png'
                            } else {
                                iconUrl = './static/img/colorfulMarker/582983.png'
                            }

                        } else {
                            if (datavalue[0].avg_value.value > QUOTACONFIG[quote].low[1]) {
                                iconUrl = './static/img/colorfulMarker/582989.png'
                            } else {
                                iconUrl = './static/img/colorfulMarker/582983.png'
                            }

                        }

                    }


                    let icon = L.icon({
                        iconUrl: iconUrl || "./static/img/colorfulMarker/582981.png",
                        iconSize: [48, 48],
                        iconAnchor: [24, 36],
                        popupAnchor: [0, -20]
                    });
                    let marker = L.marker([markerData._source.GPSy, markerData._source.GPSx], {
                        icon: icon
                    })
                        .bindPopup(
                            new Vue({
                                store: this.$store,
                                render(h) {
                                    return <SensorInfoVue data={markerData._source} />;
                                }
                            }).$mount().$el
                        );
                    markerLayers.push(marker);
                }
            }
            this.markerLayerGroup = L.layerGroup(markerLayers);
            map.addLayer(this.markerLayerGroup);
            map.setView([306460.39585415, 500485.23391098], 5);

        },
        addSpecialLayer(index){
            let currData = this.baitisAnalysisMapData;
            this.addHeatMap(currData);
            this.addMarkerLayer(currData);
            this.isShow = true;
        },
        addMarkerLayer(data){
            let markerLayers = [];
            for (let markerData of data) {
                if (markerData.GPSy && markerData.GPSx) {

                    let icon = L.icon({
                        iconUrl: "./static/img/blue-small.png",
                        iconSize: [20, 20]
                    });
                    let marker = L.marker([markerData.GPSy, markerData.GPSx], {
                        icon: icon
                    }).bindPopup(
                            new Vue({
                                store: this.$store,
                                render(h) {
                                    return <SensorInfoVue data={markerData} />;
                                }
                            }).$mount().$el
                        );
                    markerLayers.push(marker);
                }
            }
            this.markerLayerGroup = L.layerGroup(markerLayers);
            map.addLayer(this.markerLayerGroup);
        },
        addHeatMap(data) {
            let  heatRadius = 30;
            let radius = parseInt(heatRadius);
            radius = (radius > 0) ? radius : 0;
            let heatPoints = [];
            for (let i = 0; i < data.length; i++) {
                if(data[i].GPSy &&  data[i].GPSx){
                    heatPoints.push([data[i].GPSy, data[i].GPSx,data[i].mVal]);
                }
            }
            heatLayer = L.heatLayer(heatPoints, {
                radius: radius,
                minOpacity: 0.5
            }).addTo(map);
            map.setMaxZoom(4);
        },
        clearAll(){
            map.removeLayer(this.markerLayerGroup);
            if(heatLayer){
                map.removeLayer(heatLayer);    
            }
        },
        hidePanel(){
            this.isShow = false;
        }
    },
    mounted() {
        this.initEvent();
        this.initXlMap();
    }
};
</script>

<style lang="scss" scoped>
.xl-map {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
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
  .baitasi-legend {
    z-index: 1000;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
  .batisStatAnalysis{
    width: 1000px;
    z-index: 999;
    position: absolute;
    left: 400px;
    bottom: 0;
    background: #fff;
    .title{
        height: 50px;
        background: #5098EA;
        span {
            display: block;
            color: #FFFFFF;
        }
        .title-name{
            line-height: 25px;
            font-size: 17px;
            margin-left: 5px;
        }
        .unit{
            line-height: 20px;
            font-size: 15px;
            margin-left: 15px;
        }
    }
  }
}
</style>
