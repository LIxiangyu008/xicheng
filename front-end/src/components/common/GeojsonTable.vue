<template>
<section>
  <el-table class="data-table" :data="tableData.data" :stripe="true" :width="width" size="mini" ref="table" :max-height="200" style="transition:0.5s;" @selection-change="handleSelectionChange">
   <!--  <el-table-column
     type="selection"
     width="35">
   </el-table-column> -->
    <el-table-column
      type="index"
      :index="indexMethod"
      width="45">
    </el-table-column>
    <el-table-column :label="key" :prop="key" :key="index" v-for="(key, index) in tableData.keys">
    </el-table-column>
  </el-table>
</section>
</template>

<script>

const events = [
  'select',
  'select-all',
  'selection-change',
  'cell-mouse-enter',
  'cell-mouse-leave',
  'cell-click',
  'cell-dblclick',
  'row-click',
  'row-contextmenu',
  'row-dblclick',
  'header-click',
  'header-contextmenu',
  'sort-change',
  'filter-change',
  'current-change',
  'header-dragend',
  'expand-change',
]
export default {
  data() {
    return {
      keys: [],
      selects:[]
    }
  },
  mounted() {
    events.forEach((item) => {
      this.$refs.table.$on(item, (...args) => {
        this.$emit(`l-${item}`, args);
      })
    })
  },
  props: {
    selectData:{
      type: Array,
      default () {
        return []
      }
    },
    geojsonData: {
      type: Object,
      default () {
        return {}
      }
    },
    //是否过滤sm默认系统字段
    filterSM: {
      type: Boolean,
      default: true
    },
    //是否过滤非中文字段
    filterChinese: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 400
    }
  },
  computed: {
    tableData() {
      let _data = [],
        _keys = [];
      if (this.geojsonData.type == "FeatureCollection") {
        _data = this.geojsonData.features.map((feature) => {
          return feature.properties;
        })
      }
      _keys = this.geojsonData.features && this.geojsonData.features.length ? Object.keys(this.geojsonData.features[0].properties) : []
      if (this.filterSM) {
        _keys = _keys.filter(item => !item.toLowerCase().startsWith('sm'));
      }
      if (this.filterChinese) {
        _keys = _keys.filter(item => /.*[\u4e00-\u9fa5]+.*/.test(item));
      }
      return {
        data: _data,
        keys: _keys
      };
    }
  },
  methods: {
    handleSelectionChange(arg){
      this.$emit("l-select-tr",arg)
    },
    indexMethod(index) {
      return index + 1;
    }
  }
}
</script>
