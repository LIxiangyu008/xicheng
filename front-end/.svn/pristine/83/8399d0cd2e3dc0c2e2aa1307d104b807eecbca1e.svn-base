<template>

</template>

<script>
  import mixin from './mixins/mixin'

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
      default: 'image/png' 
    },
    transparent: {
      type: Boolean,
      default: true
    },
    opacity: {
      type: Number,
    },
    layerIndex: {
      type: Number,
    },
    visible:{
      type:Boolean,
    },
    options: {
      type: Object,
      default: () => {}
    },
  }

  export default {
    name: 'CRestTilelayer',
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
      let imageryLayers = Viewer.imageryLayers;
      this.provider = new Cesium.SuperMapImageryProvider({
        url : this.url
      });
      if (this.$parent._isMounted) {
        this._initHooks(this.$parent.leaflet);
      }
    },
    watch: {
      url(val, newVal) {
        this.cesium.url = val;
      },
      opacity(val, newVal) {
        this.cesium.alpha = val;
      },
      layerIndex(val, newVal) {
        if(this.cesium){
          this.cesium.setLayerIndex(val);
        }
      },
      visible(val, newVal) {
        this.cesium.show = val;
      }
    },
    beforeDestroy() {
      this.cesium && Viewer.imageryLayers.remove(this.cesium, true);
    },
    methods: {
      _initHooks() {
        this.cesium = Viewer.imageryLayers.addImageryProvider(this.provider);
      },
      mixinOptions() {
        
      }
    }
  }
</script>
