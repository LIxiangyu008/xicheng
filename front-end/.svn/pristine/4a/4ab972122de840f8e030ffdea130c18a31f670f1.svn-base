<template>
<section class="geojson-table">
  <div class="change-wrap" v-show="geojsonDataFlag || !firstClick">
    <el-tooltip class="item" effect="dark" content="展开收起查询结果" placement="bottom-start">
      <span class="item-span"><i class="fa fa-list-ul" @click="changeState"></i></span>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="导出查询结果" placement="bottom-start">
      <span class="item-span"><i class="fa fa-download" @click="exportResult"></i></span>
    </el-tooltip>
  </div>
  <geo-table ref="table" :selectData="selectData" :geojsonData="geojsonData" v-show="geojsonDataFlag" @l-row-click="onClick" @l-select-tr="selectChange"></geo-table>
</section>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
import GeoTable from './../common/GeojsonTable'

export default {
  data() {
    return {
      firstClick: true,
      selectData:[]
    }
  },
  props: {
    geojsonData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  components: {
    GeoTable
  },
  mounted() {
  },
  computed: {
    ...mapState({
      geojsonDataFlag: state => state.map.geojsonDataFlag
    })
  },
  methods: {
    ...mapMutations([
      'changeGeoJsonDataFlag'
    ]),
    changeState() {
      this.firstClick = false;
      this.changeGeoJsonDataFlag(!this.geojsonDataFlag)
    },
    onClick(e) {
      this.$emit(`l-row-click`, e);
    },
    selectChange(arg){
      this.selectData = arg;
    },
    exportResult(){
      if(this.selectData.length > 0){
        let data = this.selectData;
        let str = ""
        for (var i = 0; i < data.length; i++) {
          str += JSON.stringify(data[i]);
        }
        var eleLink = document.createElement('a');
        eleLink.download = "查询结果.txt";
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        var blob = new Blob([str]);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
      } else {
        this.$message.warning('当前无选中记录！');
      }
    }
  }
}
</script>
<style lang="scss">
.change-wrap{
  line-height: 30px;
  width: 60px;
  float: right;
  position: relative;
  bottom: 8px;
  right: 13px;
  .item-span{
    width: 27px;
    line-height: 27px;
    height: 29px;
    padding: 2px 4px;
    background-color: #deedf17d;
    display: inline-block;
    -webkit-transition: 0.5s !important;
    transition: 0.5s !important;
    cursor: pointer;
    color: #57bef9;
    font-size: 17px;
  }
  .item-span:hover{
    font-size: 20px;
    color:#3092a0;
  }
}

.data-table {
  -webkit-animation-name: fadeIn;
  /*动画名称*/
  -webkit-animation-duration: 1s;
  /*动画持续时间*/
  -webkit-animation-iteration-count: 1;
  /*动画次数*/
  -webkit-animation-delay: 0s;
  /*延迟时间*/
}

@-webkit-keyframes fadeIn {
  0% {
    opacity: 0;
    /*初始状态 透明度为0*/
  }
  50% {
    opacity: 0.5;
    /*中间状态 透明度为0*/
  }
  100% {
    opacity: 1;
    /*结尾状态 透明度为1*/
  }
}
</style>
