<template lang="html">
  <div class="monitor-middle">
    <div class="xl-map" id="xl-map">
    </div>
    <div style="position:relative;">
        <div style="position:absolute;">
          <time-version class="timeVersion" v-show="versionList.length > 0" :versionList="versionList" @layerAdd="layerShow"></time-version>
        </div>
    </div>
  </div>
</template>

<script>
import SgsMap from "./../../map/SgsMap";
import TimeVersion from "./../commons/TimeVersion";
import Vue from "vue";
import L from "leaflet";
import "./../../../../static/lib/iclient9-leaflet.js";
import "./../../../../static/lib/iclient9-leaflet.css";
import { getThemeStat } from "./../../../apis/api.js";
import { ServiceConfig } from "@/config/app-config";
let XLmap = XLCONFIG.map; // static/config/app-config.js 配置
let XLcrs = XLCONFIG.crs;
let XLthemeLayer = XLCONFIG.themeLayer;
let map, UVthemeLayer, TAGthemeLayer;

export default {
  name: "MonitorMiddle",
  components: {
    SgsMap,
    TimeVersion
  },
  data() {
    return {
      versionList: [],
      currVersion: null,
      featureArr: []
    };
  },
  methods: {
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
      //   var xl_wmts = L.supermap.wmtsLayer(XLmap.url, {
      //     layer: XLmap.layer,
      //     style: XLmap.style,
      //     tilematrixSet: XLmap.tilematrixSet,
      //     format: XLmap.format
      //   }).addTo(map);
      this.initUVThemeLayer();
    },
    //单值专题图
    initUVThemeLayer() {
      UVthemeLayer = L.supermap
        .uniqueThemeLayer("UVThemeLayer", {
          // isHoverAble: true, //图形是否在 hover 时高亮 ，默认值：false
          // opacity: 0.8 // 透明度，取值范围[0, 1]
        })
        .addTo(map);
      // 图层基础样式
      UVthemeLayer.style = new SuperMap.ThemeStyle({
        shadowBlur: 0, //阴影模糊度，（大于 0 有效; 默认值 0）
        // shadowColor: "#000000", //阴影颜色; 默认值 '#000000'
        shadowOffsetX: 0, //阴影 X 方向偏移值; 默认值 0
        shadowOffsetY: 0, //Y 方向偏移值; 默认值 0
        fillColor: "#FFFFFF", //十六进制填充颜色。默认值为 "#000000"
        stroke: true, //是否描边，不需要描边则设置为false，默认值为 false
        strokeWidth: 3, //线宽度/描边宽度，默认值 1
        strokeColor: "#FFFFFF", //十六进制描边颜色。默认值为 "#000000"
        strokeOpacity: 1 //描边的不透明度。取值范围[0, 1]，默认值 1
      });
      // hover 高亮样式
      // UVthemeLayer.highlightStyle = new SuperMap.ThemeStyle({
      //   stroke: true,
      //   strokeWidth: 2,
      //   strokeColor: 'blue',
      //   fillColor: "#00F5FF",
      //   fillOpacity: 0.2
      // });
      // 用于单值专题图的属性字段名称
      UVthemeLayer.themeField = XLthemeLayer.themeField;
      // 风格数组，设定值对应的样式
      var styles = [];
      for (var j = 0; j < XLthemeLayer.styleGroups.length; j++) {
        styles[j] = {
          value: XLthemeLayer.styleGroups[j].value,
          style: {
            fillColor: "#FFFFFF"//XLthemeLayer.styleGroups[j].fillColor
          }
        };
      }
      UVthemeLayer.styleGroups = styles;
      this.addThemeLayer();
    },
    //查询feature数据
    addThemeLayer() {
      var getFeatureBySQLParams = new SuperMap.GetFeaturesBySQLParameters({
        queryParameter: new SuperMap.FilterParameter({
          name: XLthemeLayer.datasource,
          attributeFilter: "SMID > -1"
        }),
        toIndex: 500, // 查询结果的最大索引号
        datasetNames: [XLthemeLayer.datasource + ":" + XLthemeLayer.dataset]
      });
      L.supermap
        .featureService(
          "/webframe/biz/httpproxy/httpproxy.jsp?url=" + XLthemeLayer.url
        )
        .getFeaturesBySQL(
          getFeatureBySQLParams,
          this.processComplete,
          SuperMap.DataFormat.ISERVER
        );
    },
    //数据预处理并添加到专题图图层
    processComplete(serviceResult) {
      var result = serviceResult.result;
      var feas = [];
      if (result && result.features) {
        var features = result.features;
        for (var i = 0, len = features.length; i < len; i++) {
          var feature = features[i];
          feature.attributes = this.concatAttributes(
            feature.fieldNames,
            feature.fieldValues
          );
          var smid = feature.attributes.SMID.toString();
          feas.push(feature);
        }
        this.featureArr = feas;
        UVthemeLayer.addFeatures(feas);
      }
      this.initTAGThemeLayer(feas);
    },
    //数据处理
    concatAttributes(fieldNames, filedValues) {
      var attr = {};
      for (var i = 0; i < fieldNames.length; i++) {
        attr[fieldNames[i]] = filedValues[i];
      }
      return attr;
    },
    //标签专题图
    initTAGThemeLayer(feas, index) {
      TAGthemeLayer = L.supermap.labelThemeLayer("TAGThemeLayer").addTo(map);
      TAGthemeLayer.style = new SuperMap.ThemeStyle({
        labelRect: false, //是否显示文本标签矩形背景
        //fontColor: "#ffff00", //附加文本字体颜色
        fontWeight: "bold", //附加文本字体粗细。可设值："normal", "bold", "bolder", "lighter"; 默认值："normal"
        fontSize: "14px", //附加文本字体大小。默认值 12，单位是像素
        //fill: true, //是否填充，不需要填充则设置为 false，默认值为 true
        fillColor: "#475791", //十六进制填充颜色
        //fillOpacity: 0.8, //填充不透明度。取值范围[0, 1]，默认值 1
        stroke: false, //是否描边，不需要描边则设置为false，默认值为 false
        strokeColor: "#FFFFFF", //十六进制描边颜色
        strokeWidth:1
      });
      //用于专题图的属性字段名称
      TAGthemeLayer.themeField = XLthemeLayer.themeField;
      //this.addTAGThemeFeatures(feas, index);
      this.getThemeData(feas, index);
    },
    resetThemeStyle() {
      if(!this.currVersion){
        return;
      }
      let colorSystem = XLthemeLayer.colorSystem;
      let currVersion = this.currVersion.items;
      let styleGroups = UVthemeLayer.styleGroups;
      for (let i = 0; i < currVersion.length; i++) {
        for (let j = 0; j < styleGroups.length; j++) {
          if (
            currVersion[i].key.indexOf(styleGroups[j].value) > -1 ||
            styleGroups[j].value.indexOf(currVersion[i].key) > -1
          ) {
            UVthemeLayer.styleGroups[j].style.fillColor = colorSystem[i];
          }
        }
      }
      UVthemeLayer.redraw();
    }, //添加标签专题图
    addTAGThemeFeatures(feas, index) {
      if (index == undefined) {
        this.currVersion = this.versionList[0];
      } else {
        this.currVersion = this.versionList[index];
      }
      this.resetThemeStyle();
      var labelFeatures = [];
      var feat;
      if (feas.length > 0) {
        for (var i = 0; i < feas.length; i++) {
          var x = feas[i].geometry.center.x;
          var y = feas[i].geometry.center.y;
          var text = feas[i].attributes.JDNAME;
          let distStatObj = this.currVersion.items.filter(item => {
            if (item.key.indexOf(text) > -1 || text.indexOf(item.key) > -1) {
              return item;
            }
          });
          if (distStatObj && distStatObj.length) {
            feas[i].attributes.JDNAME =
              feas[i].attributes.JDNAME.split("\n")[0] +
              "\n" +
              distStatObj[0].sum_value.value;
            if (index !== undefined && index > 0) {
              let oldDistStatObj = this.versionList[index - 1].items.filter(
                item => {
                  if (
                    item.key.indexOf(text) > -1 ||
                    text.indexOf(item.key) > -1
                  ) {
                    return item;
                  }
                }
              );
              distStatObj[0].sum_value.value > oldDistStatObj[0].sum_value.value
                ? (feas[i].attributes.JDNAME += " ↑")
                : (feas[i].attributes.JDNAME += " ↓");
            }
            text = feas[i].attributes.JDNAME;
          }
          feat = L.supermap.themeFeature([y, x, text], feas[i].attributes);
          labelFeatures.push(feat);
        }
      }
      TAGthemeLayer.addFeatures(labelFeatures);
    },
    async getThemeData(feas, index){
      if(!this.versionList || !this.versionList.length){
        let themeUrl = XLthemeLayer.staUrl + "/signalling/_search";
        //post请求参数，可传入时间段，目前配置写死，可拿到对应的json节点修改时间段
        let themeRequestData = XLthemeLayer.themeStatRequestData;
        let themeData = await getThemeStat(themeUrl, themeRequestData);
        if(!themeData.data.aggregations){
          return;
        }
        let tDataArr = themeData.data.aggregations.per_hour.buckets;
        if (tDataArr && tDataArr.length > 0) {
          let versionArr = tDataArr.map(tData => {
            let time = parseInt(tData.key_as_string);
            let items = tData.ind.buckets;
            let sortItems = this.bubbleSort(items);
            return {
              title: time,
              items: sortItems
            };
          });
          this.versionList = versionArr.slice(versionArr, 24);
        }
      }
      this.addTAGThemeFeatures(feas, index); 
    },
    layerShow(index) {
      map.removeLayer(TAGthemeLayer);
      this.initTAGThemeLayer(this.featureArr, index);
    },
    bubbleSort(arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          if (arr[j].sum_value.value > arr[j + 1].sum_value.value) {
            let temp = arr[j + 1]; //元素交换
            arr[j + 1] = arr[j];
            arr[j] = temp;
          }
        }
      }
      return arr;
    }
  },
  mounted() {
    this.initXlMap();
  }
};
</script>

<style lang="scss" scoped>
.monitor-middle {
  height: 100%;
  .map-item {
    height: 85%;
  }
  .xl-map {
    height: 85%;
    background: #fff;
  }
  .timeVersion {
    position: relative;
    z-index: 9999;
  }
}
</style>
