<template>

</template>

<script>
	import L from 'leaflet'
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
    opacity: {
      type: Number,
      default: 1
    },
    zIndex: {
      type: Number,
    },
    format: {
      type: String,
      default: 'image/png' //override the leaflet default value
    },
    transparent: {
      type: Boolean,
      default: true
    },
    crs: {
      type: Object,
      default: null
    },
    version: null,
    visible:{
      type:Boolean,
      default:true
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
  }

  export default {
    name: 'LWmsTilelayer',
    mixins: [mixin],
    props: {
      ...props,
      url: {
        type: String,
        default: '',
        required: true
      },
      layers: {
        type: String,
      },
    },
    mounted() {

      let layerOptions = this.mixinPropOption(this._props, props);

      this.leaflet = L.tileLayer.wms(this.url, layerOptions);

      this.addEventHook(this.leaflet, events);

      if (this.$parent._isMounted) {
        this._initHooks(this.$parent.leaflet);
      }
    },
    watch: {
      url(val, newVal) {
        if (this.leaflet) {
          this.leaflet.setUrl(val);
        }
      },
      opacity(val, newVal) {
        this.leaflet.setOpacity(val);
      },
      zIndex(val, newVal) {
        this.leafelt.setZIndex(val);
      },
      visible(val, newVal) {
        let parent = this.$parent.leaflet;
        if (parent) {
          if(val){
            this.leaflet.addTo(parent);
          } else {
            this.leaflet.remove();
          }
        }
      },
      options: {
        handler(val, oldVal) {
          // L.setOptions(this.leaflet, val);
        },
        deep: true
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
        console.log(parent)
      }
    }
  }
</script>
