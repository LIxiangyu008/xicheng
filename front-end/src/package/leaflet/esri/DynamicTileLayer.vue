<template>

</template>

<script>
  import L from 'leaflet'
  import { dynamicMapLayer } from './../../../../static/lib/esri-leaflet-src.js'
  import mixin from './../mixins/mixin'

  const events = [
    'loading',
    'tileunload',
    'tileloadstart',
    'tileerror',
    'tileload',
    'load',
    'add',
    'remove',
    'popupopen',
    'popupclose',
    'tooltipopen',
    'tooltipclose'
  ]

  const props = {
    format: {
      type: String,
      // default: 'png8' //override the leaflet default value
    },
    transparent: {
      type: Boolean,
      default: true
    },
    opacity: {
      type: Number,
    },
    f: {
      type: String,
      default: 'f'
    },
    token: {
      type: String
    },
    useCors: {
      type: Boolean,
      default: true
    },
    proxy: {
      type: String
    },
    zIndex: {
      type: Number,
    },
    visible:{
      type:Boolean
    },
    options: {
      type: Object,
      default: () => {}
    },
  }

  export default {
    name: 'LEsriDynamicTilelayer',
    mixins: [mixin],
    props: {
      ...props,
      url: {
        type: String,
        default: '',
        required: true
      },
    },
    mounted() {
      let layerOptions = this.mixinPropOption(this._props, props);
      layerOptions.url = this.url;
      this.leaflet = dynamicMapLayer(layerOptions);

      this.addEventHook(this.leaflet, events);

      if (this.$parent._isMounted) {
        this._initHooks(this.$parent.leaflet);
      }
    },
    watch: {
      url(val, newVal) {
        this.leaflet.setUrl(val);
      },
      opacity(val, newVal) {
        this.leaflet.setOpacity(val);
      },
      zIndex(val, newVal) {
        if(this.leaflet){
          this.leaflet.setZIndex(val);
        }
      },
      visible(val, newVal) {
        let parent = this.$parent.leaflet;
        if (parent && this.leaflet) {
          if(val){
            this.leaflet.addTo(parent);
          } else {
            this.leaflet.remove();
          }
        }
      }
    },
    beforeDestroy() {
      let parent = this.$parent.leaflet;
      if (parent) {
        parent.removeLayer(this.leaflet);
      }
    },
    methods: {
      _initHooks(parent) {
        this.leaflet.addTo(parent);
      }
    }
  }
</script>
