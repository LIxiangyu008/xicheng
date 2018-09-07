<template>
  
</template>

<script>
  import mixin from './mixins/mixin'

  const props = {
    url: {
      type: String,
      default: '',
      required: true
    },
    visible: {
      type: Boolean
    },
    opacity: {
      type: Number
    },
    zIndex: {
      type: Number
    },
  }

  export default {
    name: 'CWmtsImageryprovider',
    mixins: [mixin],
    props: {
      ...props,
      options: {
        type: Object,
        default: () => {}
      }
    },
    mounted() {
      let options = this.mixinOptions(this._props, props);
      this.provider = new Cesium.WebMapTileServiceImageryProvider(options);

      if (this.$parent._isMounted) {
        this._initHooks();
      }
    },
    methods: {
      _initHooks() {
        let imageryLayers = Viewer.imageryLayers;
        this.cesium = this.zIndex ? imageryLayers.addImageryProvider(this.provider, this.zIndex) : imageryLayers.addImageryProvider(this.provider);
      },
      mixinOptions(_props, propsObj) {
        let options = Object.assign({}, _props['options'] || {});
        let keys = Object.keys(propsObj);
        keys.forEach(key => {
           if (key == 'visible') {
            options.show = _props['visible'];
          } else if (key == 'opacity') {
            options.alpha = _props['opacity'];
          } else {
            options[key] = _props[key];
          }
        })
        if (options['tilematrixSet']) {
          options['tileMatrixSetID'] = options['tilematrixSet'];
          delete options['tilematrixSet'];
        }
        if (options['identifier'] && options['identifier'].length) {
          options['tileMatrixLabels'] = options['identifier'];
        } else {
          options['tileMatrixLabels'] = [];
          let _identArr = options.resolutions || options.scales;
          _identArr.forEach((item, index) => {
            options['tileMatrixLabels'][index] = index + 1;
          }) 
        }
        delete options['identifier'];
        options['tilingScheme'] = new Cesium.GeographicTilingScheme();
        return options;
      }
    },
    beforeDestroy() {
      this.cesium && Viewer.imageryLayers.remove(this.cesium, true);
    },
  }
</script>
