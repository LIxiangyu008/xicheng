<template>

</template>

<script>
  import L from 'leaflet'
  import mixin from './../mixins/mixin'

  const events = [
  ]

  const props = {
    render:{
      type:String,
      default:"canvas"
    },
    onClick:{
      type:Function
    },
    options: {
      type: Object,
      default: () => {}
    }
  }

  export default {
    name: 'LHeatmaplayer',
    mixins: [mixin],
    props: {
      ...props,
      analysisParams: {
        type: Array,
        default: [],
        required: true
      }
    },
    mounted() {
      let layerOptions = this.mixinPropOption(this._props, props);
      this.leaflet = L.supermap.heatMapLayer(this.analysisParams, layerOptions)
      //this.addEventHook(this.leaflet, events);

      if (this.$parent._isMounted) {
        this._initHooks(this.$parent.leaflet);
      }
    },
    watch: {
      analysisParams:{
        handler(val, newVal){
          //this.leaflet.update(val)
          if(!val || !val.length) {
            return;
          }
          this.leaflet.analysisParams = val;
          let self = this;
          let time = 500;
          if(val && val.length){
            if(val.length <1001){
              time = 500
            } else if(val.length > 1000 && val.length < 5001){
              time = 700
            } else if(val.length > 5000){
              time=1000
            }
          }
          setTimeout(() => {
            // self.leaflet.redraw();
          },time)

        },
        deep:true
      }
    },
    beforeDestroy() {
      let parent = this.$parent.leaflet;
      this.leaflet.analysisParams = {};
      this.leaflet.redraw();
      this.leaflet.remove();
    },
    methods: {
      _initHooks(parent) {
        // this.leaflet.addTo(parent);
      }
    }
  }
</script>
