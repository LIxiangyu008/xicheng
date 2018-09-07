<template>
<div id="legend" v-show="cShowLegend">
  <el-collapse @change="openLegend" accordion>
    <div id="legend-title">图层</div>
    <el-collapse-item v-for="(item, index) in legends" :name="index" :key="item.url+index">
      <template slot="title">
        <span class="name-span">
            <span class="text">{{item.name}}</span>
        </span>
        <span class="btn-span">
		        <template v-if="item.visible">
		        	<i class="header-icon green el-icon-circle-check" @click.stop="hideLayer(item)"></i>
		    		</template>
				    <template v-else>
				      <i class="header-icon gray el-icon-circle-check" @click.stop="hideLayer(item)"></i>
				    </template>
				    <i class="el-icon-caret-top" title="图层上移" @click.stop="layerUp(item)" style="font-size: 20px"></i>
				    <i class="el-icon-caret-bottom" title="图层下移" @click.stop="layerDown(item)" style="font-size: 20px"></i>
				    <i class="el-icon-delete" title="删除" @click.stop="deleteLayer(item)" style="font-size: 15px"></i>
		    </span>
      </template>
      <template v-if="!item.legend">
        <div class="block">
          <div class="demonstration">透明度</div>
          <el-slider :max="1"  :step="0.01" class="right-slider" @change="changeOpacity" v-model="item.alpha" :format-tooltip="formatTooltip"></el-slider>
        </div>
      </template>
      <template v-else>
        <div class="block">
          <div class="demonstration">透明度</div>
          <el-slider  :max="1"  :step="0.01" class="right-slider" @change="changeOpacity" v-model="item.alpha" :format-tooltip="formatTooltip"></el-slider>
        </div>
        <ul>
          <li v-for="(le, index) in item.legend">
            <img :src="le.imgurl"/>
            <span>{{le.caption}}</span>
          </li>
        </ul>
    </template>
    </el-collapse-item>
  </el-collapse>
</div>
</template>
<script type="text/javascript">
import {
  mapState,
  mapMutations
} from 'vuex'
import {
  serviceMgr
} from './../../map/serviceMeta.js';

export default {
  data() {
    return {
      openItem: {},
      legends: []
    }
  },
  watch: {
    cSpecialLayer: {
      handler(val, oldVal) {
        let afterleg = [];
        let leg = val;
        for (var i = leg.length - 1; i >= 0; i--) {
          afterleg.push(leg[i])
        }
        afterleg = JSON.parse(JSON.stringify(afterleg));
        this.legends = afterleg;
      },
      deep: true
    }
  },
  computed: {
    ...mapState({
      cShowLegend: state => state.scene.cShowLegend,
      cSpecialLayer: state => state.scene.cSpecialLayers
    })
  },
  methods: {
    ...mapMutations([
      'cChangeLayerZIndex',
      'cChangeLayerOpacity',
      'cRemoveLayer',
      'cShowHideLayer',
      'cShowHideLegend',
      'cAddLegend'
    ]),
    hideLayer(item) {
      let self = this;
      let e = event.target;
      var flag = true;
      for (let i = 0; i < self.legends.length; i++) {
        if (self.legends[i] === item) {
          self.cShowHideLayer({
            layer: item,
            flag: !self.legends[i].visible
          })
        }
      }
      event.stopPropagation();
    },
    layerUp(data) {
      let self = this;
      for (var i = 0; i < this.legends.length; i++) {
        if (this.legends[i] === data) {
          if (i == 0) {
            return
          } else {
            let objlayer = this.legends[i];
            let lastlayer = this.legends[i - 1];
            self.cChangeLayerZIndex({
              downLayer: lastlayer,
              upLayer: objlayer
            });
            return;
          }
        }
      };
      event.stopPropagation();
    },
    layerDown(data) {
      let self = this;
      for (let i = 0; i < this.legends.length; i++) {
        if (this.legends[i] === data) {
          if (i == this.legends.length - 1) {
            return
          } else {
            let objlayer = this.legends[i];
            let nextlayer = this.legends[i + 1];
            self.cChangeLayerZIndex({
              downLayer: objlayer,
              upLayer: nextlayer
            });
            return;
          }

        }
      };
      event.stopPropagation();
    },
    deleteLayer(item) {
      let self = this;
      if (this.legends.length == 1) {
        self.cShowHideLegend(false);
      }
      self.cRemoveLayer(item)
      EventBus.$emit('tree-removelayer',item);
      event.stopPropagation();
    },
    openLegend(activeNames) {
      let self = this;
      this.openItem = self.legends[activeNames];
      if (self.legends[activeNames] && self.legends[activeNames].layerType.indexOf("REST") > -1 && self.legends[activeNames].legend.length == 0) {
        serviceMgr.getLegend(self.legends[activeNames].url, function(res) {
          self.cAddLegend({
            layer: self.legends[activeNames],
            legend: res
          });
        })
      }

    },
    formatTooltip(val) {
      //return val * 100;
    },
    changeOpacity(e) {
      this.cChangeLayerOpacity({
        layer: this.openItem,
        opacity: e
      })
    }
  },
  destroy() {

  }
}
</script>
<style lang="scss" scoped>
#legend {
  position: absolute;
  border-radius: 5px;
  top: 15%;
  right: 10px;
  z-index: 99999999999;
  line-height: 30px;
  background-color: #f2f2ff;
  padding: 7px;
  -webkit-box-shadow: 0px 1px 8px #85a1b9;
  box-shadow: 0px 1px 8px #85a1b9;
  min-width: 150px;
  max-height: 450px;
  overflow-y: auto;
  overflow-x: hidden;
  user-select: none;
  .demonstration {
    width: 24%;
    float: left;
    height: 38px;
    text-align: center;
    line-height: 38px;
  }

  .right-slider {
    float: right;
    width: 70%;
    padding-right: 10px;
  }

}


#legend img {
  height: 20px;
  width: 20px;
  vertical-align: middle;
}

#legend span {
  vertical-align: middle;
}

#legend-title {
  font-size: 16px
}

.green {
  color: green
}

.gray {
  color: gray
}

.btn-span {
  float: right;
  padding-right: 10px;
}

.name-span {
  display: inline-block;
  width: 156px;
}
</style>
