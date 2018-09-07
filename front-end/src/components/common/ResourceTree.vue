<template>
    <el-container class="sidebar">
        <div class="title">资源目录</div>
        <el-header style="height: 70px;padding-top:3px;">
            <el-input ref="input" v-model="keywords" placeholder="请输入资源名称查询">
                <el-button slot="append" icon="el-icon-search" @click="searchResource"></el-button>
            </el-input>
        </el-header>
        <el-main class="main">
            <div v-show="resourceDiv" class="resourceList" style="padding: 0px 10px;">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>服务列表</span>
                        <el-button icon="el-icon-circle-close-outline" class="close" @click="closeDiv" type="text"></el-button>
                    </div>
                    <div v-for="item in resoucesName" @click="handleResourceSelect(item)" class="text item">
                        {{item.resourceName}}
                    </div>
                </el-card>
            </div>
            <div class="catalog-tree">
                <el-tree ref="tree" node-key="nodekey" :data="districts" :props="props" :load="loadNode" :accordion="true" :highlight-current="true" :expand-on-click-node="true" v-show="treeShow" lazy show-checkbox :check-strictly="true" @check-change="handleCheckChange" :render-content="renderContent">
                </el-tree>
            </div>
        </el-main>
    </el-container>
</template>

<script>
import _ from "underscore";
import {
  getServiceList,
  getRootTheme,
  getChildTheme,
  searchFullResource
} from "./../../apis/api.js";
import { mapState } from "vuex";

export default {
  data() {
    return {
      keywords: "",
      districts: [],
      props: {
        children: "children",
        label: "name",
        nodekey: "nodekey",
        isLeaf: "isLeaf"
      },
      treeShow: true,
      districeName: "",
      resourceDiv: false,
      resoucesName: [],
      option: {
        itypes: null,
        allCatalog: null,
        isServiceCount: null
      },
      serType: null,
      treemodel: 0, //目录树的结构：0只有服务的目录  1完整目录
      isServiceCount: 0 //目录树的结构 是否按服务统计：0 按资源  1 按服务
    };
  },
  computed: {
    ...mapState({
      specialLayers: state => state.map.specialLayers
    })
  },
  mounted() {
    EventBus.$on("tree-removelayer", this.removeNode);
    EventBus.$on("tree-removeAll", this.removeAllNode);
  },
  methods: {
    renderContent(h, { node, data, store }) {
      if (data.catalogType == 0) {
        return (
          <span>
            <span class="res-icon"> </span> <span> {data.name} </span>{" "}
          </span>
        );
      } else {
        return (
          <span>
            <i class="fa fa-folder" />
            <span> {data.name} </span>{" "}
          </span>
        );
      }
    },
    searchResource() {
      let self = this;
      let queryString = this.$refs.input.value;
      let param = {
        pageindex: 1,
        pagesize: 10,
        name: queryString
      };
      this.queryDistrictSuggest(param, data => {
        self.resoucesName = data;
      });
      this.treeShow = false;
      this.resourceDiv = true;
    },
    fuzzySearch() {},
    queryDistrictSuggest(param, cb) {
      searchFullResource(param).then(res => {
        cb(res.data.resultInfo.data.items);
      });
    },
    handleResourceSelect(item) {
      let node = item;
      node.catalogName = item.resourceName;
      node.resID = item.resourceId;
      let flag = true;
      for (let i = 0; i < this.specialLayers.length; i++) {
        if (node.resID == this.specialLayers[i].resID) {
          flag = false;
          break;
        }
      }
      EventBus.$emit("tree-sideBarCheck", node, flag, null);
      this.$emit("tree-sideBarCheck", node, flag, null);
      //触发Check事件
    },
    handleCheckChange(node, checked, indeterminate) {
      EventBus.$emit("tree-sideBarCheck", node, checked, null);
      this.$emit("tree-sideBarCheck", node, checked, null);
    },
    loadNode(node, resolve) {
      this.getChildData(node.data, data => {
        resolve(data);
      });
    },
    removeNode(item) {
      let checkNodes = this.$refs.tree.getCheckedNodes();
      if (checkNodes && checkNodes.length > 0) {
        for (let i = 0; i < checkNodes.length; i++) {
          if (item.resID == checkNodes[i].resID) {
            this.$refs.tree.setChecked(checkNodes[i], false);
            break;
          }
        }
      }
    },
    removeAllNode() {
      if (this.$refs.tree) {
        let checkNodes = this.$refs.tree.getCheckedNodes();
        if (checkNodes && checkNodes.length > 0) {
          for (let i = 0; i < checkNodes.length; i++) {
            this.$refs.tree.setChecked(checkNodes[i], false);
          }
        }
      }
    },
    getChildData(treeNode, callback) {
      let self = this;
      if (!treeNode || !treeNode.name) {
        getChildTheme("DATA").then(cres => {
          var data = cres.data.resultInfo.data;
          data = self.transformResource(data);
          self.districts = data;
        });
      } else {
        getChildTheme(treeNode.pkid).then(res => {
          var data = res.data.resultInfo.data;
          data = self.transformResource(data);
          callback && callback(data);
        });
      }
    },
    transformResource(data) {
      var i, d;
      for (i = 0; i < data.length; i++) {
        d = data[i];
        d.parentid = d.catalogPid;
        d.pkid = d.catalogId;
        d.resID = d.catalogId;
        d.name = d.catalogName + "(" + d.dataCount + "/" + d.resCount + ")";
        d.catalogCode = d.catalogCode;
        d.nodekey = d.catalogId;
        if (d.resCount == 0) {
          d.isLeaf = true;
        }
        if (d.catalogType == 0) {
          //资源
          d.leaf = true;
          d.isLeaf = true;
          d.name = d.catalogName;
        } else {
          d.name = d.catalogName + "(" + d.dataCount + "/" + d.resCount + ")";
          d.disabled = true;
        }
      }
      return data;
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
      this.keywords = "";
      this.treeShow = true;
      this.resourceDiv = false;
    }
  }
};
</script>

<style lang="scss">
.text {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  display: -webkit-box;
  word-break: break-all;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.clearfix:after,
.clearfix:before {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.el-card {
  border-radius: 0 !important;
}
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
      &:hover {
      }

      &:unfocus {
      }
    }

    .el-tree-node {
      &:focus {
      }
    }
  }
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

.input-box {
  margin-top: 10px;
  padding: 20px 15px;
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

li {
  list-style: none;
}

.resourceDiv {
  background-color: #ffffff;
  border-radius: 3px;
  padding: 10px 0;
  margin: 0 auto;
  width: 90%;
}

.resourceDivItem {
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  padding: 0 5px;
  margin: 0 auto;
}

.resourceDivItem:hover {
  background-color: #eada8b75;
  border-radius: 3px;
}

.divClose {
  float: right;
  margin-right: 5px;
  cursor: pointer;
}
</style>
