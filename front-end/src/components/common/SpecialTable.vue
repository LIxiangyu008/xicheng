<template>
<section class="special-tabel">
  <el-table :data="objectToArr" :max-height="300" :stripe="true" size="mini">
    <el-table-column label="名称" prop="objKey"></el-table-column>
    <el-table-column label="属性" prop="objValue"></el-table-column>
  </el-table>
</section>
</template>

<script>
export default {
  data() {
    return {
      objectArr: []
    }
  },
  mounted() {
    // this.objectArr = this.objectToArr(this.objData) ;
    // console.log(this.objectArr, this.objData);
  },
  props: {
    objData: {
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
  },
  computed: {
    objectToArr() {
      let self = this,
        _tableData = [],
        _keys = Object.keys(this.objData);
      if (this.filterSM) {
        _keys = _keys.filter(item => !item.toLowerCase().startsWith('sm'));
      }
      if (this.filterChinese) {
        _keys = _keys.filter(item => /.*[\u4e00-\u9fa5]+.*/.test(item));
      }
      _tableData = _keys.map((item) => {
        return {
          objKey: item,
          objValue: self.objData[item]
        }
      })
      return _tableData;
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.special-tabel {
    width: 300px;

    .el-table {
      border-radius: 10px 10px 0 0;
    }
}
</style>
