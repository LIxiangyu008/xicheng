<template>
<div>
  <div class="sidebar">
    <div class="input-box">
      <el-input placeholder="输入资源名称查询" icon="search" v-model="keywords" ref="input">
        <el-button slot="append" icon="el-icon-search" @click="searchResource"></el-button>
      </el-input>
      <!-- <el-button type="primary" @click="searchResource">查询</el-button> -->
    </div>
    <div v-show="districtDiv" class="districtDiv">
      <div class="divClose" @click="closeDiv"><i class="el-icon-close"></i></div>
      <div v-for="item in resoucesName" class="districtDivItem" @click="handleResourceSelect(item)">{{item.resourceName}}</div>
    </div>
    <div class="catalog-tree">
      <el-tree ref="tree" node-key="nodekey" :data="districts" :props="props" :load="loadNode" :accordion="true" v-show="treeShow" lazy show-checkbox @check-change="handleCheckChange" :check-strictly="true" :render-content="renderContent">
      </el-tree>
    </div>
  </div>
</div>
</template>

<script>
import _ from 'underscore'
import {
  getServiceList,
  getCatalogNodes,
  getResourceNodes,
  searchResource
} from "./../../apis/api.js"
import {
  mapState,
  mapMutations
} from 'vuex'
let serviceTypes = {
  WMTS: "WMTS100",
  SGSWMTS: "SGSWMTS100",
  SMRESTMAP: "SMRESTMAP",
  SGSFILES110: "SGSFILES110",
  SGSAFS: "SGSAFS",
  LJMarketSupervise: "LJMarketSupervise",
  HTTPService: "HTTPService",
  SGSSFS: "SGSSFS110",
  WMS111: "WMS111",
  WMS130: "WMS130"
}


export default {
  data() {
    return {
      keywords: '',
      districts: [],
      props: {
        children: 'children',
        nodekey: 'nodekey',
        label: 'name',
        isLeaf: 'isLeaf'
      },
      treeShow: true,
      districeName: '',
      districtDiv: false,
      resoucesName: [],
      option: {
        itypes: null,
        allCatalog: null,
        isServiceCount: null
      },
      serType: null,
      treemodel: 0, //目录树的结构：0只有服务的目录  1完整目录
      isServiceCount: 0 //目录树的结构 是否按服务统计：0 按资源  1 按服务
    }
  },
  mounted() {
    // this.getChildData();
    EventBus.$on('priTree-removelayer', this.removeNode);
    EventBus.$on('pritree-removeAll', this.removeAllNode);
  },
  methods: {
    searchResource() {
      let self = this;
      let queryString = this.$refs.input.value;
      let param = {
        pageindex: 1,
        pagesize: 10,
        name: queryString
      }
      this.queryDistrictSuggest(param, (data) => {
        self.resoucesName = data;
      });
      this.treeShow = false;
      this.districtDiv = true;
    },
    fuzzySearch() {

    },
    queryDistrictSuggest(param, cb) {
      searchResource(param).then((res) => {
        cb(res.data.resultInfo.data.items)
      })
    },
    handleResourceSelect(item) {
      let node = item;
      node.catalogName = item.resourceName;
      node.nodekey = item.resourceId;
      let flag = true;
      for (let i = 0; i < this.specialLayers.length; i++) {
        if (node.resourceId == this.specialLayers[i].resourceId) {
          flag = false;
          break;
        }
      }
      EventBus.$emit('sideBarCheck', node, flag, null);
      this.$emit('sideBarCheck', node, flag, null);
      //触发Check事件
    },
    handleCheckChange(node, checked, indeterminate) {
      EventBus.$emit('sideBarCheck', node, checked, null);
      this.$emit('sideBarCheck', node, checked, null);
    },
    loadNode(node, resolve) {
      this.getChildData(node.data, (data) => {
        resolve(data);
      })
    },
    async getChildData(treeNode, callback) {
      let self = this;
      let fomattype = "spec";
      self.serType = serviceTypes;
      self.option.itypes = self.parastoArrayString(self.serType);
      self.option.allCatalog = (self.treemodel == 0 ? false : true);
      if (!treeNode || !treeNode.name) {
        getCatalogNodes(null, self.option, null, null, null, fomattype, "RES").then((result) => {
          if (result != null) {
            let root = result.data.resultInfo.data;
            root.open = true;
            root.nocheck = true;
            root.name = root.catalogName;
            root.disabled = true;
            let opt = self.genParas(root);
            getCatalogNodes(opt, self.option, null, null, null, fomattype, "RES").then((res) => {
              if (res) {
                let data = res.data.resultInfo.data;
                let result = [];
                if (data instanceof Array) {
                  data = self.trans(data);
                  for (let i = 0; i < data.length; i++) {
                    let d = data[i];
                    if (d.privilegeStatus != 0 || d.privilegeResourceCount != 0) {
                      data[i].name = data[i].catalogName + '（' + data[i].resourceCount + '）';
                      data[i].disabled = true;
                      result.push(d);
                    }
                  }
                } else {
                  result = data;
                }
                callback && callback(result);
              }
            });
          }
        })
      } else {
        let opt = treeNode;
        let type = fomattype.split("-");
        let tempType = treeNode.catalogNodeInfo.catalogType.value.toLowerCase();
        let resData = []

        if (treeNode.childResource && tempType == type[type.length - 1]) {//请求该目录下的资源
          let resResource = await getResourceNodes(opt, self.option, null, null, null, fomattype, "RES")
          if (resResource) {
            let data = resResource.data.resultInfo.data;
            for (let i = 0; i < data.length; i++) {
              data[i].name = data[i].catalogName;
              if (!self.option.allCatalog && data[i].privilegeStatus == 0) {
                data[i].isHidden = true;
              } else {
                data[i].isLeaf = true;
                data[i].nodekey = data[i].resourceId; // 给予每个资源唯一的id，方便删除同步
                data[i].catalogType = 0 // 修改样式的绑定属性
              }
            }
            resData = data
          }
        }

        if (treeNode.childCatalog || tempType != type[type.length - 1]) {//请求该目录下的子目录
          let resCatalog = await getCatalogNodes(opt, self.option, null, null, null, fomattype, "RES")
          if (resCatalog) {
            let data = resCatalog.data.resultInfo.data
            let result = [];
            if (data instanceof Array) {
              data = self.trans(data, type);
              for (let i = 0; i < data.length; i++) {
                let d = data[i];
                if (d.privilegeStatus != 0 || d.privilegeResourceCount != 0) {// 无数据的子目录不做展示
                  data[i].name = data[i].catalogName + '（' + data[i].resourceCount + '）';
                  data[i].disabled = true;
                  result.push(d);
                }
              }
            } else {
              result = data;
            }
            resData = resData.concat(result)
          }
        }
        callback && callback(resData);
      }
    },
    genParas(treeNode) {
      let opt = {};
      opt.catalogNodeInfo = treeNode.catalogNodeInfo;
      opt.isChildCatalog = treeNode.isChildCatalog;
      opt.isChildResource = treeNode.isChildResource;
      opt.parentCatalogNodeInfo = treeNode.parentCatalogNodeInfo;
      opt.parentCategoryNodeInfos = treeNode.parentCategoryNodeInfos;
      opt.privilegeResourceCount = treeNode.privilegeResourceCount;
      opt.resourceCount = treeNode.resourceCount;
      opt.checked = treeNode.checked;
      return opt;
    },
    trans(treeNode, type) {
      for (let i = 0; i < treeNode.length; i++) {
        treeNode[i].name = treeNode[i].catalogName + "(" + treeNode[i].privilegeResourceCount + "/" + treeNode[i].resourceCount + ")"
        treeNode[i].isParent = true; //只要不是资源，那么都默认为文件夹样式，不进行目录规则的判断
        treeNode[i].nocheck = true;
      }
      return treeNode;
    },
    parastoArrayString(param) {
      let result = "";
      _.each(param, function(val, key) {
        if (val !== null) {
          val = (val + "").trim();
          if (val !== "") {
            result += encodeURI(val) + "-";
          }
        }
      });
      if (result != "") {
        result = result.substring(0, result.length - 1);
      }
      return result;
    },
    closeDiv() {
      this.keywords = '';
      this.treeShow = true;
      this.districtDiv = false;
    },
    removeNode(item) {
      let checkNodes = this.$refs.tree.getCheckedNodes()
      if (checkNodes && checkNodes.length > 0) {
        for (let i = 0; i < checkNodes.length; i++) {
          if (item.resID == checkNodes[i].resourceId) {
            this.$refs.tree.setChecked(checkNodes[i], false, null);
            break;
          }
        }
      }
    },
    removeAllNode() {
      if (this.$refs.tree) {
        let checkNodes = this.$refs.tree.getCheckedNodes()
        if (checkNodes && checkNodes.length > 0) {
          for (let i = 0; i < checkNodes.length; i++) {
            this.$refs.tree.setChecked(checkNodes[i], false, null);
          }
        }
      }
    },
    renderContent(h, {
      node,
      data,
      store
    }) {
      if (data.catalogType == 0) {
        return ( <
          span >
          <
          span class = "res-icon" > < /span> <span> {data.name} </span > {
            " "
          } <
          /span>
        );
      } else {
        return ( <
          span >
          <
          i class = "fa fa-folder" / >
          <
          span > {
            data.name
          } < /span>{" "} < /
          span >
        );
      }
    },
  },
  computed: {
    ...mapState({
      specialLayers: state => state.map.specialLayers
    })
  }
}
</script>

<style lang="scss" >

.catalog-tree {
    overflow: hidden;
    //box-shadow: 1px 5px 4px 3px rgba(7, 17, 27, 0.2);

    .el-tree-node__content {
        height: 50px;
        transition: background 0.3s;
    }

    .is-disabled {
        display: none;
    }
    .el-tree-node__label {
        font-size: 15px;
    }

    .el-tree-node__children {
        .res-name {
            font-size: 15px;
        }

        .el-tree-node__content {
            border-bottom: 0.5px dotted #d9d9ea;

            &:focus,
            &:hover {}

            &:unfocus {}
        }

        .el-tree-node {
            &:focus {}
        }
    }
}

.input-box {
    margin-top: 10px;
    padding: 20px 15px;
}

.district-tree {
    padding: 15px;

    & > .el-tree {
        border-radius: 4px;
        max-height: 750px;
        overflow-y: auto;
    }
}

li {
    list-style: none;
}

.districtDiv {
    background-color: #ffffff;
    border-radius: 3px;
    padding: 10px 0;
    margin: 0 auto;
    width: 90%;
}

.districtDivItem {
    height: 45px;
    line-height: 45px;
    cursor: pointer;
    padding: 0 5px;
    margin: 0 auto;
}

.districtDivItem:hover {
    background-color: #DDDDDD;
    border-radius: 3px;
}

.divClose {
    float: right;
    margin-right: 5px;
    cursor: pointer;
}

.container {
    float: left;
    width: 300px;
    height: 100%;
    border-right: 1px solid #62C7E4;
}
.container .title {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: #eee;
    color: #999;
    text-align: center;
}
.container .content {
    padding: 10px 0;
    height: 100%;
}
.container .content .HighQuery {
    display: flex;
    flex-wrap: wrap;
}
.container .content .HighQuery div {
    width: 31.33%;
    font-size: 12px;
    height: 80px;
    text-align: center;
    cursor: pointer;
    background: #eeeeee61;
    margin-right: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
    color: #333;
    padding-top: 5px;
}
.container .content .HighQuery div:nth-child(3n) {
    margin-right: 0;
}
.container .content .HighQuery div img {
    display: block;
    width: 50px;
    height: 50px;
    margin: auto auto 6px;
}
.container .content .changeLayer {
    padding: 10px;
}
#map {
    height: 100%;
    width: 100%;
    margin-left: 300px;
}
.sidebar {
    .close {
        float: right;
        padding: 3px 0;
        font-size: 18px;
        font-weight: 600;
    }
    .item {
        line-height: 40px;
        height: 40px;
        border-bottom: 1px solid #eaeaea;
        cursor: pointer;
    }
    .item:hover {
        background-color: #a7ddf240;
    }
    .el-tree-node {
        font-size: 15px;
    }
    transition: width 2s;
    -moz-transition: width 2s;
    /* Firefox 4 */
    -webkit-transition: width 2s;
    /* Safari 和 Chrome */
    -o-transition: width 2s;
}
.res-icon {
    width: 16px;
    height: 15px;
    float: left;
    background-image: url("./../../../static/img/point.png");
}
.district-tree {
    padding: 15px;

    & > .el-tree {
        border-radius: 4px;
        max-height: 750px;
        overflow-y: auto;
    }
}
</style>
