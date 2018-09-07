<template>
  <div class="content-list">
  <div class="change-wrap" v-show="geojsonDataFlag || !firstClick">
    <el-tooltip class="item" effect="dark" content="展开收起查询结果" placement="bottom-start">
      <span class="item-span"><i :class="['fa',geojsonDataFlag?'fa-hand-o-down':'fa-hand-o-up']" @click="changeState"></i></span>
    </el-tooltip>
  </div>
  <span style="clear:both"></span>
	<el-tabs type="border-card"  v-show="geojsonDataFlag" @tab-click="changeTab">
	  <el-tab-pane v-for="(item,index) in (tableListData.length === 0 ? queryData : tableListData)" :key="index" :label="item.name" style="position: relative;height: 100%;">
	  	<geo-table  class="result-table"  :geojsonData="item.data"  @l-row-click="dataClick" ></geo-table>
	  </el-tab-pane>
	</el-tabs>
  </div>
</template>

<script>
import {
  mapState,
  mapMutations,
  mapActions
} from 'vuex'
import GeoTable from './../../common/GeojsonTable'

export default {
	components: {
    GeoTable
  },
  data(){
  	return {
  		staData:[],
  		firstClick: true,
      queryData: []   // 高级查询数据
  	}
  },
	props: {
    total:{
      type:Number,
      default:0
    },
    tableListData: {
      type: Array,
      default () {
        return {}
      }
    },
    params:{
      type: Object,
      default () {
        return {}
      }
    }
  },
  mounted(){
    EventBus.$on('query-Data', this.getQueryData);
  },
  computed: {
    ...mapState({
      geojsonDataFlag: state => state.map.geojsonDataFlag,
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
    dataClick(item){
      this.$emit(`l-row-click`, item);
    },
    changeTab(e){
      EventBus.$emit("tab-click",e.label)
    },
    getQueryData(data) {
      this.queryData = data;
    }
  }
}
</script>

<style lang="scss">
.content-list{
	.el-tabs__content{
		// height:200px;
		height:190px;
  }
	.el-tabs{
		margin-top: 26px;
    .el-tabs__item{
      height: 30px;
      line-height: 30px;
    }
	}
  .el-table--mini td, .el-table--mini th{
    padding: 2px
  }
  .el-table--mini td {
    vertical-align: top;
  }
  .el-tabs--border-card>.el-tabs__content{
    padding: 0px;
  }
  .result-table{
    height: 100%
  }
}
.change-wrap{
  line-height: 30px;
  width: 33px;
  float: right;
  position: relative;
  bottom: 0px;
  right: 0px;
  .item-span{
    position: relative;
    right: 20px;
    width: 27px;
    line-height: 27px;
    height: 29px;
    padding: 2px 4px;
    background-color: #deedf17d;
    display: inline-block;
    transition: 0.3s !important;
    cursor: pointer;
    font-size: 17px;
  }
  .item-span:hover{
    font-size: 20px;
    color:#3092a0;
  }
}

</style>
