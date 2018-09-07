<template>
  <section class="district-lable">
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark">{{acitveDis.name}}<span v-show="count > 1" class="back-to-last" @click="backToLast"><i class="el-icon-caret-top"></i></span>
        <span class="removeDistrict" @click="removeDistrict"><i class="el-icon-close"></i></span></div>
      </el-col>
    </el-row>
    <div class="qh-div">
      <span class="qhspan" v-for="(item,index) in qhdata" @click="clickqh(item)">{{item.name}}</span>
    </div>
  </section>
</template>

<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import {
  getChildDistrict,
  getDistrict
} from './../../../apis/api'

export default {
  data() {
    return {
      lastqh:null,
      qhdata:[],
      count:0,
      clickData:{}
    }
  },
  watch: {
    acitveDis: {
      handler(val, oldVal) {
        /*
          //todo  根据变化后的code查询当前的区划下级区划 赋值给this.qhdata;
          this.qhdata = [{
            name:"我是下一级",
            code:"010000001"
          }]*/
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      acitveDis: state => state.map.acitveDis,
      districtLayer: state => state.map.districtLayer
    })
  },
  methods: {
    ...mapMutations([
      'changeDistrict',
      'addDistrictLayer',
      'removeDistrictLayer'
    ]),
    clickqh(item){
      this.lastqh = this.acitveDis;
      this.changeDistrict(item);
      this.clickData[this.count++] = this.acitveDis;
      //todo 此处根据item的code查询区划数据 传入districtLayers数组中
      this.loadDistrict();
      this.getGeoData();
    },
    loadDistrict(){
      let self = this;
      getChildDistrict({code:this.acitveDis.code}).then((res) => {
        self.qhdata = res.data.resultInfo.data.items;
      })
    },
    getGeoData(){
      let self = this;
      this.removeDistrictLayer();
      getDistrict(this.acitveDis.code).then((res) => {
        let data = res.data.resultInfo.data;
        if(data.features.length > 0){
          let geometry = data.features[0].geometry;
          if(geometry.type == "Polygon"){
            geometry.type="LineString";
            geometry.coordinates = geometry.coordinates[0];
          } else if(geometry.type == "MultiPolygon"){
            geometry.type = "MultiLineString";
            geometry.coordinates = geometry.coordinates[0];
          }
          self.addDistrictLayer(data)
        }
      })
    },
    backToLast(){
      this.count--;
      this.changeDistrict(this.clickData[this.count-1]);
      this.removeDistrictLayer();
      if(this.count > 1){
        this.getGeoData();
      }
      this.loadDistrict();
      //toto  此处根据this.lastqh的code重新查询该级别下级区划 将下级所有区划传入districtLayers数组中
    },
    removeDistrict(){
      this.removeDistrictLayer();
      this.$emit("remove-district")
    }
  },
  mounted(){
    let self = this;
    //todo 默认进来加载第一级区划
    this.clickData[this.count++] = this.acitveDis;
    this.loadDistrict();
    
  }
}
</script>

<style lang="scss">
.district-lable{
  position: absolute;
  top: 60px;
  width: 532px;
  border-radius: 5px;
  background: white;
  font-size: 14px;
  box-shadow: 1px 2px 9px #cdcdcd;
  .grid-content{
    line-height: 25px;
    background: #eaeaf5;
    padding: 8px;
    .back-to-last{
      color:orange;
      cursor: pointer;
    }
    .removeDistrict{
      float:right;
      cursor:pointer
    }
  }
  .qh-div{
    max-height: 455px;
    overflow: auto;
    padding:5px;
  }
  .qhspan{
    line-height:38px;
    padding:10px;
    cursor: pointer;
  }
}
</style>
