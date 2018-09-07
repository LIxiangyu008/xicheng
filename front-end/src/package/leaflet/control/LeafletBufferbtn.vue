<template>

</template>

<script>
import './../plugins/leaflet-bufferbtn.js'
import './../plugins/leaflet-bufferbtn.css'

export default {
  name: 'LBufferbtnControl',
  mounted() {
    this.leaflet = L.control.bufferbtn({fn: this.fn})
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
    }
  },
  beforeDestroy() {
    this.leaflet.remove();
    // this.leaflet = null;
  }
}
</script>

<style lang="css">
</style>
