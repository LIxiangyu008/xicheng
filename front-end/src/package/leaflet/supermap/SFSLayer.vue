<template></template>

<script>
	import L from 'leaflet'
  import mixin from './../mixins/mixin'
  import axios from 'axios'

  axios.defaults.withCredentials = true;

  const defaultIcon = L.icon({
    iconUrl:  require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  })

  const props = {
    request: {
      type: String,
      default: 'GETFEATURE'
    },
    requestType: {
      type: String,
      default: 'GET'
    },
    filter: {
      type: String,
      default: '1=1'
    },
    page: {
      type: Number,
      default: 1
    },
    rp: {
      type: Number,
      default: 10
    },
    icon: {
      type: Object,
      default:() => defaultIcon
    },
    visible:{
      type:Boolean
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
  }

  let bounds = [];

  export default {
    name: 'LSfsLayer',
    mixins: [mixin],
    props: {
      ...props,
      url: {
        type: String,
      },
      keepInView: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      if (this.$parent._isMounted) {
        this._initHooks(this.$parent.leaflet);
      }
    },
    data() {
      return {
        type: ''
      }
    },
    watch: {
      page(val, oldVal) {
        this._initHooks(this.$parent.leaflet);
      },
      rp(val, oldVal) {
        this._initHooks(this.$parent.leaflet);
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
          this._initHooks(this.$parent.leaflet);
        },
        deep: true
      }
    },
    beforeDestroy() {
      let parent = this.$parent.leaflet;
      if (parent) {
        parent.removeLayer(this.leaflet);
        this.leaflet = null;
      }
    },
    methods: {
      async _initHooks(parent) {
        // let bounds;
        if (this.leaflet) {
          parent.removeLayer(this.leaflet);
        }
        this.leaflet = await this.fetchData();
        this.leaflet.addTo(parent);
        if (this.keepInView) {
          let bounds;
          switch (this.type) {
            case 'POINT':
              let latLngs = [];
              this.leaflet.eachLayer((layer) => {
                latLngs.push(layer.getLatLng());
              })
              bounds = L.latLngBounds(latLngs);
              break;
            case 'LINE':
            case 'REGION':
              this.leaflet.eachLayer((layer) => {
                layer.bindPopup(layer.options);
                bounds = bounds ? bounds.extend(layer.getBounds()) : layer.getBounds();
              })
              break;
          }
          parent.fitBounds(bounds);
        }
      },
      fetchData() {
        return new Promise(async (resolve, reject) => {
          const options = this.mixinPropOption(this._props, props);
          const res = await axios({ type: options.requestType, url: this.url + L.Util.getParamString(options) })
          let pointArr, layers;
          const data = res.data;
          switch(data.dataType.toUpperCase()) {
            case 'POINT':
              this.type = 'POINT';
              layers = [];
              data.rows.forEach((item, index) => {
                layers.push(L.marker([item.SMY, item.SMX], {
                  icon: this.icon
                }));
              })
              break;
            case 'LINE':
              this.type = 'LINE';
              layers = [];
              data.rows.forEach((item, index) => {
                item.points.split('|').forEach((item, index) => {
                  pointArr = [];
                  item.split(';').forEach((item, index) => {
                    pointArr.push([item.split(',')[1], item.split(',')[0]])
                  })
                  layers.push(L.polyline(pointArr));
                })
              })
              break;
            case 'REGION':
              this.type = 'REGION';
              layers = [];
              data.rows.forEach((item, index) => {
                item.points.split('|').forEach((item, index) => {
                  pointArr = [];
                  item.split(';').forEach((item, index) => {
                    pointArr.push([item.split(',')[1], item.split(',')[0]])
                  })
                  layers.push(L.polygon(pointArr));
                })
              })
              break;
          }
          resolve(L.layerGroup(layers));
        })
      }
    }
  }

</script>