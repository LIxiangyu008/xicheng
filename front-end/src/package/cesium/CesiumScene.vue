<template>
<div class="cesium-scene">
  <slot></slot>
</div>
</template>

<script>

export default {
  mounted() {
  },
  props: {
    imgLayer: {
      type: Array,
      default: []
    },
  }
}
</script>

<style lang="scss" scope>
.cesium-scene {
    width: 100%;
    height: 100%;
}
</style>
