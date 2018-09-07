<template>
<el-container class="wrapper">
  <el-aside class="map-sidebar">
     <map-sidebar></map-sidebar>
    <!-- <resource-tree></resource-tree> -->
  </el-aside>
  <template v-if="isShowAllScreen">
    <el-main class="main allScreenMap">
      <map-container></map-container>
    </el-main>
  </template>
  <template v-else-if="!isShowMenu">
    <el-main class="main hideMenu">
      <map-container></map-container>
    </el-main>
  </template>
  <template v-else>
    <el-main class="main">
      <map-container></map-container>
    </el-main>
  </template>
</el-container>
</template>

<script>
import MapContainer from './MapContainer'
import ResourceTree from './../common/ResourceTree'
import MapSidebar from './../common/MapSidebar'
import {
  mapState,
  mapActions
} from 'vuex'

export default {
  components: {
    MapContainer,
    ResourceTree,
    MapSidebar
  },
  computed: {
    ...mapState({
      isShowAllScreen: state => state.map.isShowAllScreen,
      isShowMenu: state => state.map.isShowMenu
    })
  },
  created() {
    // this.getUserInfo();
  },
  methods: {
    ...mapActions(['getUserInfo']),
  }
}
</script>

<style lang="scss">
.wrapper {
    height: 100%;
    .main {
        padding: 0;
    }
}
.allScreenMap {
    position: relative;
    top: -80px;
    left: -300px;
    margin-right: -300px;
    margin-bottom: -80px;
}
.hideMenu {
    position: relative;
    left: -300px;
    margin-right: -300px;
}
.map-sidebar {
  overflow-x: hidden;
}

</style>
