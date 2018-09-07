<template>
<el-container class="wrapper">
  <el-aside width="350px">
    <section class="multi-screen-control">
      <div class="control-header">分屏对比</div>
      <article class="control-selection">
        <div class="control-title">分屏模式</div>
        <ul class="clearfix">
          <li v-for="index in 6" :key="index" class="control-img" :class="{'is-active': multi == index}">
            <img :src="'static/img/multi-screen/screen-' + index + '.png'" @click="changeScreen(index)">
          </li>
        </ul>
      </article>
      <article class="control-content">
        <div class="control-title">
          <p>分屏专题</p>
          <el-button type="text" style="position: absolute; right: 20px; top: -5px" @click="showDialogFlag = true">新增专题图</el-button>
        </div>
        <div v-for="(item, index) in layersControl" class="control-item">
          <div class="control-item-title">
            <i class="el-icon-info"></i><span>{{ item.name }}</span>
            <span style="float: right; margin-right: 20px" @click="deleteControlItem(index)">
              <i class="control-item-delete el-icon-delete"></i>
            </span>
          </div>
          <div class="control-bar">
            <ul class="clearfix">
              <li v-for="i in multi"><i :class="['icon-number' + i, {'is-active': item.index == i - 1}]" @click="changePosition(item, i - 1)"></i></li>
            </ul>
          </div>
        </div>
      </article>
    </section>
  </el-aside>
  <el-main>
    <multi-screen :mapOptions="mapOptions" :multi="multi" :layers="layers"></multi-screen>
  </el-main>
  <el-dialog class="resource-selected-dialog" title="选择图层" :visible.sync="showDialogFlag" width="30%" center>
    <section class="resource-selected">
      <el-tag v-for="tag in selectedItems" :key="tag.key" type="success">{{tag.name}}</el-tag>
    </section>
    <section class="resource-content">
      <!-- <resource-tree @tree-sideBarCheck="onResourceCheck"></resource-tree> -->
      <map-sidebar @sideBarCheck="onMapSidebarCheck"></map-sidebar>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="addLayers">确 定</el-button>
  </span>
  </el-dialog>
</el-container>
</template>

<script>
import MultiScreen from './MultiScreen'
import ResourceTree from '@/components/common/ResourceTree'
import MapSidebar from '@/components/common/MapSidebar'
import {
  sortServiceInfos
} from "@/components/common/serviceUtil.js";
import {
  mapState,
} from 'vuex'
import {
  apiServiceCatalogServiceByID
} from '@/apis/api'
import {
  serviceMgr
} from './../serviceMeta.js';
let serType = [
  "SMRESTMAP",
  "WMS111",
  "WMS130",
  "WMTS100",
  "SGSWMTS100",
  "SGSSFS110"
];

let MultiScreenLayers = APPCONFIG.MultiScreenLayers,
  mapOptions = APPCONFIG.BaseConfig.map,
  crsOptions = mapOptions.crsOptions;

export default {
  components: {
    MultiScreen,
    ResourceTree,
    MapSidebar
  },
  created() {
    if (this.$route.query.fromMap) {
      let multiCfg = this.currentMapState;
      if (multiCfg) {
        this.mapOptions = {
          center: multiCfg.center,
          zoom: multiCfg.zoom,
          crs: multiCfg.crs
        }

        this.layersControl = this.adaptLayerIndex(multiCfg.layers, multiCfg.multi);

        this.multi = multiCfg.multi;
      }

    } else {
      let _crsOptions = {
          origin: L.point(crsOptions.origin[0], crsOptions.origin[1]),
          bounds: L.bounds(crsOptions.bounds)
        },
        crs = L.CRS.TianDiTu_WGS84;
      this.mapOptions = {
        center: [0, 0],
        zoom: 1,
        crs
      }
    }
  },
  mounted() {

  },
  data() {
    return {
      mapOptions: {},
      showDialogFlag: false,
      layersControl: [],
      multi: 4,
      selectedItems: []
    }
  },
  computed: {
    ...mapState({
      currentMapState: state => state.map.currentMapState
    }),
    layers() {
      let _layers = [];
      this.layersControl.forEach((item, index) => {
        if (!_layers[item.index]) {
          _layers[item.index] = [];
        }
        _layers[item.index].push(item);
      })
      return _layers;
    }
  },
  watch: {
    multi(max, oldVal) {
      this.layersControl.forEach((item, index) => {
        if (item.index >= max) {
          item.index = max - 1;
        }
      })
    }
  },
  methods: {
    adaptLayerIndex(layers, max) {
      max = max || this.multi;
      layers = JSON.parse(JSON.stringify(layers));
      layers.forEach((item, index) => {
        if (typeof item.index == 'undefined') {
          index > max ? item.index = max : item.index = index;
        }
      })
      return layers;
    },
    changeScreen(num) {
      this.multi = num;
      let layers = this.layers;
      if (layers.length == num) {
        return;
      } else if (layers.length > num) {
        layers.splice(num - 1 || 1);
      } else {
        for (var i = layers.length; i < num; i++) {
          layers.push([]);
        }
      }
    },
    changePosition(item, index) {
      item.index = index;
    },
    async onResourceCheck(node, checked) {
      let that = this;
      if (checked) {
        const {
          data
        } = await apiServiceCatalogServiceByID(node.resID);
        if (data.resultInfo.data.length > 0) {
          let resource = data.resultInfo.data[0];
          let service = resource.serviceInfos;
          if (service.length > 0) {
            for (var i = 0; i < service.length; i++) {
              let sermeta = serviceMgr.getMetadata(service[i].id).then((res) => {
                that.selectedItems.push(res[0]);
              });
            }
          } else {
            this.$message.warning('无可用服务！')
          }
        }
      } else {
        let index = 0;
        for (let i = 0; i < this.selectedItems.length; i++) {
          if (this.selectedItems[i].name == node.name) {
            this.selectedItems.splice(i, 1);
            break;
          }
        }
      }
    },
    async onMapSidebarCheck(node, checked) {
      let that = this;
      if (checked) {
        const {
          data
        } = await apiServiceCatalogServiceByID(node.resourceId);
        if (data.resultInfo.data.length > 0) {
          let resource = data.resultInfo.data;
          let originRes = [];
          for (let resou of resource) {
            originRes = originRes.concat(resou.serviceInfos);
          }
          let ser = sortServiceInfos(originRes, serType);
          let service = []
          service[0] = ser[0]
          if (service.length > 0) {
            for (var i = 0; i < service.length; i++) {
              let sermeta = serviceMgr.getMetadata(service[i].id).then((res) => {
                that.selectedItems.push(res[0]);
              });
            }
          } else {
            this.$message.warning('无可用服务！')
          }
        }
      } else {
        let index = 0;
        for (let i = 0; i < this.selectedItems.length; i++) {
          if (this.selectedItems[i].name == node.name) {
            this.selectedItems.splice(i, 1);
            break;
          }
        }
      }
    },
    addLayers() {
      let maxLength = this.layers.length - 1 || 0,
        layers = this.layers,
        index = 0,
        that = this;
      let addItems = this.selectedItems.map((item, index) => {
        let layer, layerIndex = maxLength;
        for (let i = 0; i < that.multi; i++) {
          if (!layers[i] || !layers[i].length) {
            layerIndex = i;
            index++;
            break;
          }
        }
        return {
          name: item.name,
          url: item.url,
          layerType: item.layerType,
          key: Math.random().toFixed(6),
          index: layerIndex,
          options: item.options
        }
      })
      this.layersControl = this.layersControl.concat(addItems);
      this.showDialogFlag = false;
    },
    closeDialog() {
      this.selectedItems = [];
      this.showDialogFlag = false;
    },
    deleteControlItem(index) {
      this.layersControl.splice(index, 1);
    }
  }
}
</script>

<style lang="scss">
.wrapper {
    width: 100%;
    height: 100%;
}

.resource-content {
    max-height: 500px;
    overflow-y: auto;
}

.resource-selected {
    padding: 10px 0;
    min-height: 54px;
    border-top: 1px solid #eee;
    border-bottom: 1px solid #eee;
    margin-bottom: 10px;
}

.control-item-delete {
    display: none;
    font-size: 18px;
    transition: color 0.3s;

    &:hover {
        cursor: pointer;
        color: #00daff;
    }
}

.multi-screen-control {

    .control-header {
        padding: 10px 0 10px 15px;
        background: #eee;
        margin-bottom: 15px;
    }

    .control-title {
        position: relative;
        padding: 5px 0 5px 10px;
    }

    .control-selection {
        padding: 2px 5px;
    }

    .control-content {
        .control-item {
            margin-top: 10px;
            border-radius: 1px solid #eee;
        }

        i.is-active {
            color: #00daff;
        }

        .control-item-title {
            padding-left: 20px;
            margin: 5px 0;

            i {
                color: #6797ef;
            }

            &:hover {

                .control-item-delete {
                    display: block;
                }
            }
        }

        ul {
            margin-left: 20px;
        }

        li {
            float: left;
            font-size: 20px;
            padding: 5px;
            margin: 3px 8px;
            color: #eee;

            &:hover {
                cursor: pointer;
                color: #6797ef;
            }
        }
    }

    li.is-active {
        background: #6797ef;
        border-radius: 5px;
    }

    li.control-img {
        float: left;
        width: 113px;
        height: 65px;
        padding: 5px 10px;

        img:hover {
            cursor: pointer;
        }

        img {
            width: 100%;
            height: auto;
        }
    }

}
</style>
