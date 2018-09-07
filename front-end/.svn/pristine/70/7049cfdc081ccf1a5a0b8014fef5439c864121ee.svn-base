<template lang="html">
  <div class="query-list">
    <div class="query-list-data">
      <el-container>
        <el-table :data="tabledata" :header-cell-style="rowClass" :cell-style="cellStyle" height="13.65em">
          <el-table-column prop="level" label="级别"></el-table-column>
          <el-table-column prop="name" label="景点名称"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="introduction" label="简介"></el-table-column>
        </el-table>
      </el-container>
    </div>
    <query-list-media :MediaInfo="MediaInfo" :tabledata="tabledata"></query-list-media>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import Vue from 'vue'
import $ from 'jquery'
import QueryListMedia from './QueryListMedia'

export default {
  name: 'MarkerQueryList',
  components: {
    QueryListMedia
  },
  props: {
    tabledata: Array,
    MediaInfo: Array
  },
  methods: {
    rowClass() {
      return 'background: $lightBlue;font-weight: 600;border-right: 1px solid #ebeef5'// 表头样式
    },
    cellStyle() {
      return 'border-right: 1px solid #ebeef5;vertical-align: top;'// 行样式
    }
  }
}
</script>

<style lang="scss" scoped>
.query-list-data {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 999;
    width: 60%;
    border-radius: 5px;
    -webkit-box-shadow: 0 1px 8px #85a1b9;
    box-shadow: 0 1px 8px #85a1b9;
    .el-container {
        width: 100%;
        height: 12em;
    }
}
</style>
