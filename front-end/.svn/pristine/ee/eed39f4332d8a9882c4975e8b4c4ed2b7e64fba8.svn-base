import Vue from 'vue'

const state = {
  cCurrentBaseMapIndex: 0, //当前激活地图集合图层索引
  cBaseMapLayers: [], //底图图层集合数据
  cSpecialLayers: [], //专题图层数据
  cShowLegend: false, //是否显示三维图例
  showHisModel: false //是否显示三维单模型的时间轴
}

const getters = {

}

const mutations = {
  cAddLegend(state, {
    layer,
    legend
  }) {
    for (let i = 0; i < state.cSpecialLayers.length; i++) {
      if (state.cSpecialLayers[i].url == layer.url) {
        state.cSpecialLayers[i].legend = legend;
        break;
      }
    }
  },
  cShowHideLegend(state, isShowLegend) {
    state.cShowLegend = isShowLegend;
  },
  handleShowHisModel(state, showHisModel) {
    state.showHisModel = showHisModel;
  },
  cAddLayer(state, layer) {
    //layer.zIndex = state.cSpecialLayers.length == 0 ? 10 : state.cSpecialLayers.length * 10; //默认设置zIndex 方便后续调整图层顺序
    state.cSpecialLayers.push(layer);
  },
  cRemoveLayer(state, layer) {
    for (let i = 0; i < state.cSpecialLayers.length; i++) {
      if (state.cSpecialLayers[i].url == layer.url) {
        state.cSpecialLayers.splice(i, 1);
        break;
      }
    }
  },
  cShowHideLayer(state, {
    layer,
    flag
  }) {
    for (let i = 0; i < state.cSpecialLayers.length; i++) {
      if (state.cSpecialLayers[i].url == layer.url) {
        state.cSpecialLayers[i].visible = flag;
        break;
      }
    }

  },
  cChangeSpecialLayer(state, specialLayers) {
    state.cSpecialLayers = specialLayers
  },
  cChangeLayerOpacity(state, {
    layer,
    opacity
  }) {
    for (var i = 0; i < state.cSpecialLayers.length; i++) {
      if (state.cSpecialLayers[i].url == layer.url) {
        state.cSpecialLayers[i].alpha = opacity
      }
    }
  },
  cChangeCurrentBaseMapIndex(state, index) {
    state.currentBaseMapIndex = index;
    var templayer = state.baseMapLayersGroup[0];
    Vue.set(state.baseMapLayersGroup, 0, state.baseMapLayersGroup[index]);
    Vue.set(state.baseMapLayersGroup, index, templayer);

  },
  cChangeLayerZIndex(state, {
    downLayer,
    upLayer
  }) {
    for (let i = 0; i < state.cSpecialLayers.length; i++) {
      if (state.cSpecialLayers[i].url == downLayer.url) {
        var templayer = state.cSpecialLayers[i];
        for (let j = 0; j < state.cSpecialLayers.length; j++) {
          if (state.cSpecialLayers[j].url == upLayer.url) {
            Vue.set(state.cSpecialLayers, i, state.cSpecialLayers[j]);
            Vue.set(state.cSpecialLayers, j, templayer);
            return
          }
        }
      }
    }

  }
}

export default {
  state,
  getters,
  mutations
}
