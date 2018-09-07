<template>

</template>

<script>
import './../plugins/leaflet-querybtn.js'
import './../plugins/leaflet-querybtn.css'

export default {
  name: 'LQuerybtnControl',
  mounted() {
    this.leaflet = L.control.querybtn({fn: this.initEvent})
    if (this.$parent._isMounted) {
      this._initHooks(this.$parent);
    }
  },
  props: {
    fn: {
      type: Function
    }
  },
  methods: {
    _initHooks($parent) {
      this.leaflet.addTo($parent);
      // this.initEvent($parent);
    },
    initEvent(map) {
      this.$emit('l-query-compelete');
    },
  },
  beforeDestroy() {
    this.leaflet.remove();
    // this.leaflet = null;
  },
}
</script>

<style lang="css">
</style>
