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
    format: {
      type: String,
      // default: 'image/png' //override the leaflet default value
    },
    transparent: {
      type: Boolean,
      default: true
    },
    opacity: {
      type: Number,
    },
    crs: {
      type: Object,
      default: null
    },
    zIndex: {
      type: Number,
    },
    visible:{
      type:Boolean
    },
    layersID: {
      type: String,
    },
    options: {
      type: Object,
      default: () => {}
    },
  }

  export default {
    name: 'LRestTilelayer',
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
      if(this._props.options.isFade){
        layerOptions.opacity = 0;
      }
      if (layerOptions.layersID) {
        layerOptions.layersID = this.convertLayerName(layerOptions.layersID);
      }
      this.leaflet = L.supermap.tiledMapLayer(this.url, layerOptions);

      this.addEventHook(this.leaflet, events);

      if (this.$parent._isMounted) {
        this._initHooks(this.$parent.leaflet);
      }
      if(this._props.options.isFade){
        this.fadeInteval(0,1000);
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
      },
      fadeInteval(start,end){
        let self = this;
        let i = setInterval(function(){
          if(start <= end){
            self.leaflet.setOpacity(start/end);
            start += 100;
          }else{
            clearInterval(i);
          }
        },150);
      },
      convertLayerName(layerName) {
        if (!layerName) {
          return null;
        }
        let splitLayerName = layerName.split(',');
        let idsName = '[0:';
        splitLayerName.forEach((item, index) => {
          index == 0 ? idsName += item.split(":")[1] : idsName += ',' + item.split(":")[1];
        })
        idsName += ']';
        return idsName;
      }
    }
  }
</script>
