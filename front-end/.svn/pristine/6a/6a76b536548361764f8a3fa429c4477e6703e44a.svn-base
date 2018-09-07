<template>
<div class="query-box">
  <el-container>
    <el-header style="height: 45px;padding-top: 3px;">
      <el-autocomplete
        v-model="name"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect">
        <template v-if="!isShowMenu">
          <el-button slot="prepend" icon="el-icon-d-arrow-right" title="显示左侧菜单" @click=hideMenu()></el-button>
        </template>
        <template v-else>
          <el-button slot="prepend" icon="el-icon-menu" title="隐藏左侧菜单" @click=hideMenu()></el-button>
        </template>
        <el-button slot="append" icon="el-icon-search" @click=searchPOI()></el-button>
        <el-button slot="append" icon="el-icon-close" v-show="close" @click=clearResult()></el-button>
      </el-autocomplete>
    </el-header>
  </el-container>
</div>
</template>
<script>
import {
  mapState,
  mapMutations
} from 'vuex'
import Vue from 'vue'
import $ from 'jquery'
import { fuzzyAddress } from '@/apis/api'


export default {
  data() {
    return {
      name: "",
      close: false,
      resultdata:[],
      param:{
        address:"",
        top:10
      }
    }
  },
  mounted() {

  },
  computed: {
    ...mapState({
      isShowMenu: state => state.map.isShowMenu,
      baseMapLayersGroup: state => state.map.baseMapLayersGroup,
    })
  },
  methods: {
    ...mapMutations([
      'changeShowMenu',
      'changListShow'
    ]),
    querySearchAsync(queryString, cb) {
      let self = this;
      let results = [];
      if (!queryString) {
        return;
      }
      let addressMatchingUrl = self.baseMapLayersGroup[0].addressMatchingUrl
      if(!addressMatchingUrl){
        self.$message.warning('该地图无地名地址服务！');
        return
      }
      self.param.address = self.name;
      fuzzyAddress(this.param,addressMatchingUrl).then((res) => {
        if(res.data){
          let data = self.parseXmlToJson(res.data);
          let re = data.address.add;
          if (re && re.length) {
            re.forEach((item, index) => {
                results.push({
                    address: item.Name,
                    value: item.Name
                })
            })
          }
        }
      })
      clearTimeout(this.timeout);
      self.timeout = setTimeout(() => {
        cb(results);
      }, 1500 * Math.random());
    },
    handleSelect(item) {
      console.log(item);
    },
    searchPOI() {
      let self = this;
      self.close = true;
      if (!self.name) {
        return;
      }
      let addressMatchingUrl = self.baseMapLayersGroup[0].addressMatchingUrl
      if(!addressMatchingUrl){
        self.$message.warning('该地图无地名地址服务！');
        return
      }
      self.param.address = self.name;
      fuzzyAddress(self.param,url).then((res) => {
        if(res.data){
          self.changListShow(true);
          let data = self.parseXmlToJson(res.data);
          self.resultdata = data.address.add;
          EventBus.$emit('query-poi', data.address.add);
        }

      })
    },
    parseXmlToJson(xml){
      let nameAndAdds = {
      address:{
            add:[],
            sum:""
          }
      }
      let re = $(xml);
      let STAddressesDocs = re.find("MatchAddress");
      if(STAddressesDocs && STAddressesDocs.length > 0){
        for(let i=0;i<STAddressesDocs.length;i++){
          let itemaddress = STAddressesDocs[i];
          let add = {
              Code:"",Desc:"",GatDate:"",Id:"",LastDic:"",LastDicCode:"",LastDicType:"",Name:"",ParentId:"",X:"",Y:""
          };
          add.Code = $(itemaddress).find("Code").text();
          add.Desc = $(itemaddress).find("Desc").text();
          add.GatDate = $(itemaddress).find("GatDate").text();
          add.Id = $(itemaddress).find("Id").text();
          add.LastDic = $(itemaddress).find("LastDic").text();
          add.LastDicCode = $(itemaddress).find("LastDicCode").text();
          add.LastDicType = $(itemaddress).find("LastDicType").text();
          add.Name = $(itemaddress).find("Name").text();
          add.ParentId = $(itemaddress).find("ParentId").text();
          add.X = $(itemaddress).find("X").text();
          add.Y = $(itemaddress).find("Y").text();
          nameAndAdds.address.add.push(add);
        }
        return nameAndAdds;
      } else {
        this.$message.warning('查询异常！');
      }

    },
    hideMenu() {
      this.changeShowMenu(!this.isShowMenu)
    },
    clearResult() {
      this.changListShow(false);
      this.close = false;
      this.name = "";
    }
  },
  destroy() {

  }
}
</script>
<style lang="scss">
.query-box {
    position: absolute;
    top: 2%;
    left: 4.5%;
    z-index: 999;
    background-color: #fff;
    width: 300px;
    border-radius: 5px;
    -webkit-box-shadow: 0 1px 8px #85a1b9;
    box-shadow: 0 1px 8px #85a1b9;
    .el-autocomplete{
      width: 100% !important;
    }
    .el-input {
        width: 100%;
    }
    .el-header {
        padding: 0 5px;
    }
    .reicon {
        font-size: 21px;
        color: #0b6eb4;
        padding: 0 4px;
    }
    .item {
        line-height: 40px;
        border-bottom: 1px solid #e6e6e6;
        height: 40px;
        cursor: pointer;
    }
    .item:hover {
        background-color: #a7ddf240;
    }
    .el-card__body {
        padding: 9px;
    }
    .el-input-group__append,
    .el-input-group__prepend {
        background-color: #fff;
        border-radius: 4px;
        padding: 0 7px;
        font-size: 17px;
        border: none;
    }
    .el-input__inner {
        border: none;
    }
}
</style>
