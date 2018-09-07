<template lang="html">
  <div class="timelist">
    <el-card class="box-card" :body-style="{ padding: '0px' }">
      <div class="clearfix">
        <span>历史重点区域</span>
      </div>
      <div class="box-body">
        <div class="body-item" v-for="(item, index) in AreaArr" :key="index" @click="clickAreaName(item)">
          <i class="icon-location2" style="color: #62C7E4;"></i>
          <div class="item-name">{{item.name}}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'TimeList',
  data() {
    return {
      changeLayers: []
    }
  },
  props: {
    AreaArr: Array,
    HDlayers: Array
  },
  methods: {
    clickAreaName(val) {
      let layers = this.HDlayers
      //取出含有点击区域的s3m
      this.changeLayers = []
      for (let i = 0; i < layers.length; i++) {
        for (let j = 0; j < layers[i].length; j++) {
          let str = layers[i][j].name
          if (val.name == str.substring(0, str.length - 4)) {
            this.changeLayers.push(layers[i][j])
          }
        }
      }
      Viewer.flyTo(this.HDlayers[0][1])
      // this.flyToArea(val)
    },
    flyToArea(val) {
      let x = val.x
      let y = val.y

    }
  }
}
</script>

<style lang="scss" scoped>
.timelist {
    position: absolute;
    top: 10%;
    left: 4.5%;
    .box-card {
        width: 300px;
        .clearfix {
            width: 100%;
            color: #FFF;
            padding-left: 5px;
            padding-top: 10px;
            padding-bottom: 10px;
            background: #5098EA;
        }
        .box-body {
            max-height: 300px;
            overflow-y: auto;
            padding-left: 2px;
            padding-top: 5px;
            padding-bottom: 5px;
            .body-item {
                cursor: pointer;
                border-bottom: 1px solid #ccc;
                padding: 6px;
                .item-name {
                    display: inline;
                    padding-left: 3px;
                }
            }
            .body-item:hover {
                background: #ccc;
            }
        }
    }
}
</style>
