<template>
  <div class="l-map">
    <slot></slot>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import 'leaflet-editable/src/Leaflet.Editable'
import mixin from './../mixins/mixin'

/**
 * leaflet map events Array.For details, please look up http://leafletjs.com/reference-1.2.0.html#map-event
 * @type {Array}
 */
const events = [
  //layer events
  'baselayerchange',
  'overlayadd',
  'overlayremove',
  'layeradd',
  'layerremove',
  //Map state change events
  'zoomlevelschange',
  'resize',
  'unload',
  'viewreset',
  'load',
  'zoomstart',
  'movestart',
  'zoom',
  'move',
  'zoomend',
  'moveend',
  //Popup events
  'popupopen',
  'popupclose',
  'autopanstart',
  //Tooltip events
  'tooltipopen',
  'tooltipclose',
  //Location events
  'locationerror',
  'locationfound',
  //Interaction events
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
  'mousemove',
  'contextmenu',
  'keypress',
  'preclick',
  //animation events
  'zoomanim'
]

/**
 * providing instrictions for common attributes, For more map options details
 * please look up http://leafletjs.com/reference-1.2.0.html#map-option
 * @type {Object}
 */
const props = {
  center: {
    type: [Array, Object],
  },
  zoom: {
    type: Number,
  },
  zoomAround: {
    type: Object,
    default: () => {},
    except: true
  },
  zoomPanOptions: {
    type: Object,
    default: () => {},
    except: true
  },
  minZoom: {
    type: Number,
  },
  maxZoom: {
    type: Number,
  },
  maxBounds: {
    type: [Array, Object],
    default: null
  },
  editable: {
    type: Boolean,
    default: true,
  },
  editOptions: {
    type: Object,
  },
  //强制不接收center, zoom更新， 解决多屏联动时主屏抖动的bug
  forceNotZoom: {
    type: Boolean,
    default: false
  },
  crs: {
    type: Object,
    // default: () => L.CRS.EPSG4326
  },
  options: {
    type: Object,
    default: () => {}
  }
}

let draw = null;
let drawLayers = L.featureGroup();
export default {
  name: 'LMap',
  props: {
    ...props,
    bounds: {
      type: [Array, Object]
    }
  },
  mixins: [mixin],
  mounted() {
    let mapOptions = this.mixinPropOption(this._props, props);

    //map Object
    this.leaflet = L.map(this.$el, mapOptions);
    if (this.bounds && this.bounds.length) {
      this.leaflet.fitBounds(this.bounds);
    }
    this.addEventHook(this.leaflet, events);
    for (let children of this.$children) {
      children._initHooks && children._initHooks(this.leaflet);
    }
    this.leaflet.whenReady(()=> {
      if (mapOptions.center && mapOptions.zoom) {
        this.leaflet.setView(mapOptions.center, mapOptions.zoom);
      }
    })
  },
  beforeDestroy() {
    this.leaflet.remove();
  },
  watch: {
    center(val, newVal) {
      if (this.leaflet && !this.forceNotZoom) {
        this.leaflet.setView(val, this.zoom || this.options.zoom);
      }
    },
    zoom(val, newVal) {
      if (this.forceNotZoom || this.leaflet.getZoom() == val ) {
        return;
      }
      this.leaflet.setZoom(val, this.getZoomPanelOption());
    },
    minZoom(val, newVal) {
      // this.leaflet.setMinZoom(val);
    },
    maxZoom(val, newVal) {
      // this.leaflet.setMaxZoom(val);
    },
    crs(val, newVal) {
      console.warn('sorry it`s not available for now!');
    },
    zoomAround(val, newVal) {
      // this.leaflet.setZoomAround(val, null, this.options.animate)
    },
    bounds(val, newVal) {
      if (this.leaflet) {
        this.leaflet.fitBounds(val);
      }
    },
    options(options, newVal) {
      if (this.leaflet) {
        L.setOptions(this.leaflet, options);
        this.leaflet.setView(options.center, options.zoom);
      }
    }
  },
  methods: {
    getZoomPanelOption() {
      const zoomPanOptions = this.zoomPanOptions || {
        animate: this.options.animate,
        duration: this.options.duration,
        easeLinearity: this.options.easeLinearity,
        noMoveStart: this.options.noMoveStart
      };
      return zoomPanOptions;
    },
    changeCrs(Crs) {

    },
    clearMeasure(){
      if(drawLayers){
        drawLayers.clearLayers();
      }
    },
    measure(type, callback){
      console.log(type)
      let that = this;
      if(!this.leaflet.hasLayer(drawLayers)){
        this.leaflet.addLayer(drawLayers);
      }
      let drawOptions = {
        icon: new L.DivIcon({
          iconSize: new L.Point(16, 16),
          className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move leaflet-touch-icon'
        })
      }
      if(type == "polyline"){
        draw = new L.Draw.Polyline(this.leaflet, drawOptions);
      } else if(type == "polygon"){
        draw = new L.Draw.Polygon(this.leaflet, drawOptions);
      } else if(type == "rectangle"){
        draw = new L.Draw.Rectangle(this.leaflet, drawOptions);
        draw = new L.Draw.Circle(this.leaflet,drawOptions);
      } 
      draw.enable();
      this.leaflet.on(L.Draw.Event.CREATED,(e)=>{
        that.measureComplete(e, callback)
      })
    },
    measureComplete(e, callback) {
      let type = e.layerType,layer = e.layer;
      let points = [];
      if (type == 'polyline') {
        let latlngs = layer._latlngs;
        for(let i = 0; i < latlngs.length; i++){
          points.push([latlngs[i].lat,latlngs[i].lng]);
        }
        L.polyline(points)
        .addTo(drawLayers)
        .showMeasurements();
      } else if (type == 'polygon' || type == 'rectangle') {
        let latlngs = layer._latlngs[0];
        for(let i = 0; i < latlngs.length; i++){
          points.push([latlngs[i].lat,latlngs[i].lng]);
        }
        L.polygon(points)
        .addTo(drawLayers)
        .showMeasurements();
      } else {
        let center =  layer._latlng;
        let mRadius = layer._mRadius;
        L.circle([center.lat,center.lng], mRadius)
        .addTo(drawLayers)
        .showMeasurements();
      };
      draw.disable();
      draw = null;
        this.leaflet.off(L.Draw.Event.CREATED);
      callback && callback()
    }
  }
}
</script>

<style>
  .l-map {
    width: 100%;
    height: 100%;
    z-index: 3;
  }
</style>
