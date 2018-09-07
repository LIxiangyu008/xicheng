<template>
<section>
  <el-form :inline="true">
    <el-form-item label="观察点位置" class="inputGroup">
      <el-input v-model="pointX" width="50px">
        <template slot="prepend">X</template>
      </el-input>
      <el-input v-model="pointY" width="50px">
        <template slot="prepend">Y</template>
      </el-input>
      <el-input v-model="pointZ" width="50px">
        <template slot="prepend">Z</template>
      </el-input>
    </el-form-item>
    <el-form-item label="可视域颜色">
      <el-color-picker v-model="trueColor" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item label="不可视颜色">
      <el-color-picker v-model="errorCorlr" show-alpha></el-color-picker>
    </el-form-item>
    <el-form-item>
      <el-button plain type="info" size="small" @click="addTargetPoint">添加观察点</el-button>
      <el-button plain type="info" size="small" @click="addViewpoint">添加目标点</el-button>
      <el-button plain type="info" size="small" @click="clearSL">清除</el-button>
    </el-form-item>
  </el-form>
</section>
</template>
<script>
let sightline, sgPointHandler;
export default {
  data() {
    return {
      pointX: '',
      pointY: '',
      pointZ: '',
      trueColor: 'rgb(0,255,0)',
      errorCorlr: 'rgb(255,0,0)',
    }
  },
  mounted() {
    EventBus.$on('sightLine', this.sightInitializing);
    EventBus.$on('clearAll', this.clearSL);
  },
  destroyed() {
    EventBus.$off('sightLine', this.sightInitializing);
    EventBus.$off('clearAll', this.clearSL);
  },
  methods: {
    sightInitializing(tab) {
      sightline = new Cesium.Sightline(Viewer.scene);
      sightline.couldRemove = false;
      sgPointHandler = new Cesium.PointHandler(Viewer);

      let that = this;

      sgPointHandler.drawCompletedEvent.addEventListener((point) => {
        let position = point.position._value;
        sightline.build();
        //将获取的点的位置转化成经纬度
        let cartographic = Cesium.Cartographic.fromCartesian(position);
        let longitude = Cesium.Math.toDegrees(cartographic.longitude);
        let latitude = Cesium.Math.toDegrees(cartographic.latitude);
        let height = cartographic.height;

        if (Viewer.scene.sgFlag) {
          //设置视口位置
          sightline.viewPosition = [longitude, latitude, height];
          Viewer.scene.sgFlag = false;

          that.pointX = longitude;
          that.pointY = latitude;
          that.pointZ = height;
        } else {
          Viewer.entities.remove(point);
          //添加视点
          sightline.addTargetPoint({
            position: [longitude, latitude, height],
            name: "point" + new Date()
          });

          sightline.couldRemove = true;
        }
        let tcolor = Cesium.Color.fromCssColorString(that.trueColor);
        sightline.visibleColor = tcolor;

        let utcolor = Cesium.Color.fromCssColorString(that.errorCorlr);
        sightline.hiddenColor = utcolor;
      });
    },

    removeSight() {
      if (sgPointHandler) {
        sgPointHandler.deactivate();
      }
      Viewer.entities.removeAll();
      if (sightline) {
        sightline = sightline.destroy();
        sightline = undefined;
      }
    },

    addTargetPoint() {
      if (sgPointHandler.active) {
        return;
      }
      Viewer.scene.sgFlag = true;
      Viewer.entities.removeAll();
      if (sightline.couldRemove) {
        sightline.removeAllTargetPoint();
      }
      sgPointHandler.activate();
    },

    addViewpoint() {
      Viewer.scene.sgFlag = false;
      sgPointHandler.activate();
    },

    clearSL() {
      Viewer.entities.removeAll();
      this.pointX = '';
      this.pointY = '';
      this.pointZ = '';
      if (sightline && sightline.couldRemove) {
        sightline.removeAllTargetPoint();
        sightline.couldRemove = false;
      }
    }

  }
}
</script>
<style type="text/css">
.inputGroup .el-form-item__content .el-input {
  width: 30% !important;
  margin: 0px 0px;
}

.inputGroup .el-input-group__append,
.inputGroup .el-input-group__prepend {
  padding: 0px 10px !important;
  /*background-color: #333333 !important;
		border: 1px solid #686363 !important;*/
  /*color: #D3D3D3 !important;*/
}

.inputGroup .el-input__inner {
  padding: 0px 3px;
  /*background-color: #333333 !important;
		border: 1px solid #686363 !important;*/
  /*color: #D3D3D3 !important;*/
}

.inputGroup .el-form-item__label {
  /*color: #D3D3D3 !important;*/
}
</style>
