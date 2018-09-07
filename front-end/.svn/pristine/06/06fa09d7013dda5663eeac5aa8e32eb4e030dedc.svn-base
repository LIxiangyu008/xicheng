<template>
<div :class="['multi-screen', 'clearfix' ,'multi-screen-' + multi]" >
  <div :class="[
      'screen-item',
      'screen-item-' + i,
      {'screen-item-main': i == 1}
      ]" v-for="i in multi">
    <div class="multi-screen-num">
      <i :class="['icon-number' + i]"></i>
    </div>
    <template v-if="i == 1">
      <l-map ref="map" :key="i" :options="mapOptions" @l-moveend="mapMoveEnd">
        <template v-for="(layer, index) in (layers[i-1] || [])">
            <l-wms-tilelayer  v-if="layer.layerType == 'WMS111'" :key="Math.random().toFixed(6)" :url="layer.url" :version="'1.1.1'" :options="layer.options" :zIndex="index * 10 || 5"></l-wms-tilelayer>
            <l-wms-tilelayer v-else-if="layer.layerType == 'WMS130'" :key="Math.random().toFixed(6)" :url="layer.url" :version="'1.3.0'" :options="layer.options" :zIndex="index * 10 || 5"></l-wms-tilelayer>
            <l-wmts-tilelayer v-else-if="layer.layerType == 'WMTS100'" :key="Math.random().toFixed(6)" :url="layer.url" :options="layer.options" :zIndex="index * 10 || 5"></l-wmts-tilelayer>
            <l-wmts-tilelayer v-else-if="layer.layerType == 'SGSWMTS100'" :key="Math.random().toFixed(6)" :url="layer.url" :options="layer.options" :zIndex="index * 10 || 5"></l-wmts-tilelayer>
            <l-wmts-tilelayer v-else-if="layer.layerType == 'WMTS-china'" :key="Math.random().toFixed(6)" :url="layer.url" :options="layer.options" :zIndex="index * 10 || 5"></l-wmts-tilelayer>
            <l-rest-tilelayer v-else-if="layer.layerType == 'SMRESTMAP'" :key="Math.random().toFixed(6)" :url="layer.url" :options="layer.options" :zIndex="index * 10 || 5" :layersID="layer.layerName"></l-rest-tilelayer>
            <l-esri-dynamic-tilelayer v-else-if="layer.layerType == 'ArcGISREST'" :key="Math.random().toFixed(6)" :url="layer.url" :options="layer.options" :zIndex="index * 10 || 5" :proxy="arcgisProxy"></l-esri-dynamic-tilelayer>
          </template>
      </l-map>
    </template>
    <template v-else>
      <l-map ref="map" :key="i" :options="mapOptions" :zoom="zoom" :center="center">
        <template v-for="(layer, index) in (layers[i-1] || [])">
            <l-wms-tilelayer  v-if="layer.layerType == 'WMS111'" :key="Math.random().toFixed(6)" :url="layer.url" :version="'1.1.1'" :options="layer.options" :zIndex="index * 10 || 5"></l-wms-tilelayer>
            <l-wms-tilelayer v-else-if="layer.layerType == 'WMS130'" :key="Math.random().toFixed(6)" :url="layer.url" :version="'1.3.0'" :options="layer.options" :zIndex="index * 10 || 5"></l-wms-tilelayer>
            <l-wmts-tilelayer v-else-if="layer.layerType == 'WMTS100'" :key="Math.random().toFixed(6)" :url="layer.url" :options="layer.options" :zIndex="index * 10 || 5"></l-wmts-tilelayer>
            <l-wmts-tilelayer v-else-if="layer.layerType == 'SGSWMTS100'" :key="Math.random().toFixed(6)" :url="layer.url" :options="layer.options" :zIndex="index * 10 || 5"></l-wmts-tilelayer>
            <l-wmts-tilelayer v-else-if="layer.layerType == 'WMTS-china'" :key="Math.random().toFixed(6)" :url="layer.url" :options="layer.options" :zIndex="index * 10 || 5"></l-wmts-tilelayer>
            <l-rest-tilelayer v-else-if="layer.layerType == 'SMRESTMAP'" :key="Math.random().toFixed(6)" :url="layer.url" :options="layer.options" :zIndex="index * 10 || 5" :layersID="layer.layerName"></l-rest-tilelayer>
            <l-esri-dynamic-tilelayer v-else-if="layer.layerType == 'ArcGISREST'" :key="Math.random().toFixed(6)" :url="layer.url" :options="layer.options" :zIndex="index * 10 || 5" :proxy="arcgisProxy"></l-esri-dynamic-tilelayer>
          </template>
      </l-map>
    </template>
  </div>
</div>
</template>

<script>
import L from 'leaflet'
import './../../../../static/lib/iclient9-leaflet.js';
import './../../../../static/lib/iclient9-leaflet.css';

import {
  ServiceConfig
} from '@/config/app-config'
import {
  LMap,
  LWmsTilelayer,
  LMarker,
  LRestTilelayer,
  LWmtsTilelayer,
  LSfsLayer,
  LLayerGroup,
  LDraw,
  LQuerybtnControl,
  LEsriDynamicTilelayer
} from './../../../package/leaflet/main'

let sgsProxy = ServiceConfig.httpproxy;

export default {
  components: {
    LMap,
    LWmsTilelayer,
    LMarker,
    LRestTilelayer,
    LWmtsTilelayer,
    LSfsLayer,
    LLayerGroup,
    LDraw,
    LQuerybtnControl,
    LEsriDynamicTilelayer
  },
  props: {
    mapOptions: {
      type: Object,
      default: () => {}
    },
    multi: {
      type: Number,
      default: 2
    },
    layers: {
      type: Array,
      default: []
    }
  },
  mounted() {

  },
  data() {
    return {
      arcgisProxy: sgsProxy + '?url=',
      center: [0, 0],
      zoom: 5,
    }
  },
  watch: {
    multi(val, oldVal){
      this.validateSize();
    }
  },
  methods: {
    mapMoveEnd(e) {
      this.center = e.target.getCenter();
      this.zoom = e.target.getZoom();
    },
    mouseMoveEvent(e) {
      this.mousePosition = e.target.getCenter();
    },
    validateSize() {
      this.$refs.map.forEach((item) => {
        setTimeout(() => {
          if (item && item.leaflet) {
            item.leaflet.invalidateSize();
          }
        }, 1000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.multi-screen {
    width: 100%;
    height: 100%;
}

.screen-item {
    float: left;
    position: relative;
    width: 100%;
    height: 100%;
    transition: all .3s;
    border: 1px solid #607d8b;

    &:before {
      content: ' ';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
      width: 25px;
      z-index: 1800;
      border-bottom: 1px solid #000;
    }

    &:after {
      content: ' ';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%);
      height: 25px;
      z-index: 1800;
      border-right: 1px solid #000;
    }

    .multi-screen-num {
      position: absolute;
      width: 30px;
      height: 30px;
      top: 20px;
      right: 20px;
      font-size: 30px;
      color: #009688;
      z-index: 1800;
    }
}

//双屏
.multi-screen-2 {

  .screen-item {
    &:first-child {
      width: 70%;
      height: 100%;
    }

    width: 30%;
    height: 100%;
  }
}

.multi-screen-3 {
  &>.screen-item {
    width: 50%;
    height: 50%;

    &:first-child {
      width: 50%;
      height: 100%;
    }
  }
}

.multi-screen-4 {
  &>.screen-item {
    width: 30%;
    height: 33.33%;

    &:first-child {
      width: 70%;
      height: 100%;
    }
  }
}

.multi-screen-5 {
  &>.screen-item {
    width: 30%;
    height: 33.33%;

    &:first-child {
      width: 70%;
      height: 66.66%;
    }
  }

  .screen-item-4 {
    width: 70%;
  }
}

.multi-screen-6 {
  &>.screen-item {
    width: 30%;
    height: 33.33%;

    &:first-child {
      width: 70%;
      height: 66.66%;
    }
  }

  .screen-item-4, .screen-item-5 {
    width: 35%;
  }
}
</style>
