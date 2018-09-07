<template>
  <section class="box-panel buffer-analysis">
    <div class="item-panel division">
      <div class="buffer-title">绘制图形</div>
      <ul class="clearfix">
        <li class="buffer-draw" @click="drawLayer('point')"><i class="el-icon-edit"></i>画点</li>
        <li class="buffer-draw" @click="drawLayer('polyline')"><i class="el-icon-edit"></i>画线</li>
        <li class="buffer-draw" @click="drawLayer('polygon')"><i class="el-icon-edit"></i>画面</li>
      </ul>
    </div>
    <div class="item-panel">
      <span class="buffer-title">缓冲区半径</span>
      <div class="slider-group clearfix">
        <el-slider class="slider-group-item slider" :max="1000" :min="0" v-model="bufferDistance" :disabled="!currentActiveLayerIndex"></el-slider>
        <el-input v-model="bufferDistance" :disabled="!currentActiveLayerIndex" class="slider-group-item slider-input">
          <el-select v-model="bufferUnit" slot="append" placeholder="请选择">
            <el-option label="米" value="meter"></el-option>
            <el-option label="公里" value="km"></el-option>
          </el-select>
        </el-input>
      </div>
    </div>
    <div class="item-panel">
      <el-button type="primary" icon="el-icon-search" style="float: right" @click="startBufferAnalysis">开始分析</el-button>
    </div>
    <div class="close-btn" @click="changeBufferState(false)">
      <i class="el-icon-close"></i>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { apiBufferService } from '@/apis/api'
import { convertBufferToLayer } from '@/components/common/dfcUtil'

export default {
  data() {
    return {
      bufferDistance: 50,
      bufferUnit: 'meter'
    }
  },
  props: {
    disabled: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    bufferDistance(val, oldVal) {
    }
  },
  computed: {
    ...mapState({
      currentActiveLayerIndex: state => state.map.currentActiveLayerIndex
    }),
    realDistance() {
      if (this.bufferUnit == 'meter') {
        return this.bufferDistance;
      } else {
        return this.bufferDistance * 1000;
      }
    }
  },
  methods: {
    ...mapMutations([
      'changeBufferState'
    ]),
    drawLayer(type) {
      EventBus.$emit('toolbar-draw', type);
    },
    startBufferAnalysis() {
      EventBus.$emit('toolbar-startBuffer', this.realDistance, this.bufferUnit)
    }
  }
}
</script>

<style lang="scss">
  .buffer-analysis {
    position: absolute;
    width: 319px;
    top: 50px;
    right: 50px;

    .buffer-draw {
      float: left;
      cursor: pointer;
      margin-right: 15px;
      padding: 5px;
      font-size: 14px;
      color: #252525;

      i {
        font-size: 22px;
      }
    }

    ul {
      padding: 3px;
    }

    .buffer-title {
      padding: 7px 0;
      font-size: 14px;
    }

    .item-panel {
      margin-bottom: 10px;
    }

    .slider-group {
      padding: 10px 0;

      .slider-group-item {
        float: left;
      }

      .slider {
        width: 160px;
      }

      .slider-input {
        margin-left: 10px;
        width: 120px;

        input {
          padding: 2px 2px 2px 6px;
        }

        .el-input--suffix .el-input__inner {
          width: 70px;
        }
      }
    }

    .close-btn {
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 20px;
      cursor: pointer;
      transition: all .2s;

      &:hover {
        transform: rotate(180deg);
        color: #28519e;
      }
    }
  }
</style>
