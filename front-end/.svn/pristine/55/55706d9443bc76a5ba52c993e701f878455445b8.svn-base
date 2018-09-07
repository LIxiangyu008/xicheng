<template>
<section>
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
      <!-- <el-form-item label="显示模式">
					<el-select v-model="skyOption" @change="skylineChange">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item> -->
      <el-form-item label="天际线颜色">
        <el-color-picker v-model="skyCorlr" show-alpha></el-color-picker>
      </el-form-item>
      <el-form-item>
        <el-button plain type="info" @click="skyLine">天际线</el-button>
        <el-button plain type="info" @click="getSkyline2D">二维显示</el-button>
        <el-button plain type="info" @click="clearLine">清除</el-button>
      </el-form-item>
    </el-form>
  </section>
</section>
</template>

<script>
import echarts from 'echarts'
//import $ from 'jquery'

let skyline;
export default {
  data() {
    return {
      pointX: '',
      pointY: '',
      pointZ: '',
      skyCorlr: 'rgb(216,231,54)',
      options: [{
          value: 'line',
          label: '线显示'
        },
        {
          value: 'surface',
          label: '面显示'
        }
      ],
      skyOption: '线显示',
    }
  },
  mounted() {
    EventBus.$on('skyLine', this.initializing);
    EventBus.$on('clearAll', this.clearLine);
  },
  destroyed() {
    EventBus.$off('skyLine', this.initializing);
    EventBus.$off('clearAll', this.clearLine);
  },
  methods: {
    initializing(tab) {
      skyline = new Cesium.Skyline(Viewer.scene);
      this.getColor();
    },
    skyLine() {
      let scene = Viewer.scene;
      this.clearLine();
      this.getColor();
      skyline = new Cesium.Skyline(scene);
      var cartographic = scene.camera.positionCartographic;
      var longitude = Cesium.Math.toDegrees(cartographic.longitude);
      var latitude = Cesium.Math.toDegrees(cartographic.latitude);
      // var height = cartographic.height;
      var height = cartographic.height;
      if (height < 0) {
        height = 0;
      }
      var heading = scene.camera.heading;
      var pitch = scene.camera.pitch;
      // var roll = scene.camera.roll;
      // 设置相机位置、视角，便于观察场景
      // scene.camera.setView({
      //     destination : new Cesium.Cartesian3.fromDegrees(longitude,latitude,height),
      //     orientation : {
      //         heading : heading,
      //         pitch : pitch,
      //         roll : roll
      //     }
      // });
      //天际线分析的视口位置设置成当前相机位置
      skyline.viewPosition = [longitude, latitude, height];
      //设置俯仰和方向
      skyline.pitch = pitch;
      skyline.direction = heading;
      skyline.radius = 10000; // 天际线分析半径设置为10000米
      skyline.build();
      EventBus.$emit('scene-label', {
        lon:4.518725114461417,
        lat:2.6998824667944263,
        alt:72.50288859847933,
        heading:0.013960228369650274,
        pitch:-0.18371155360152103,
        roll:6.283185307179586
      });
      this.pointX = longitude;
      this.pointY = latitude;
      this.pointZ = height;
    },
    clearLine() {
      Viewer.entities.removeAll();
      this.pointX = '';
      this.pointY = '';
      this.pointZ = '';
      if (skyline) {
        skyline.clear();
      }
      if (document.getElementById('map')) {
        document.getElementById('map').style.display = "none";
      }

    },
    getSkyline2D() {
      if (!document.getElementById("map")) {
        this.addElementDiv();
      };
      //获取二维天际线对象
      var object = skyline.getSkyline2D();
      this.getColor();
      //用echarts绘制二维天际线
      var myChart = echarts.init(document.getElementById("map"));

      var option = {
        backgroundColor: "rgba(73,139,156,0.9)",
        title: {
          text: "二维天际线"
        },

        tooltip: {
          trigger: "axis"
        },

        calculable: true,
        xAxis: [{
          type: "category",
          boundaryGap: false,
          data: object.x,
          show: false
        }],

        yAxis: [{
          type: "value",
          min: 0,
          max: 1
        }],

        series: [{
          name: "",
          type: "line",
          data: object.y,
          color: this.skyCorlr,
        }]
      }
      myChart.setOption(option);
      document.getElementById('map').style.display = "block";
    },
    addElementDiv() {　　　　
      var parent = document.getElementsByTagName("body");　　　　 //添加 div
      　　　　
      var div = document.createElement("div");

      　　　　 //设置 div 属性，如 id
      　　　　
      div.setAttribute("id", "map");

      　　　　
      div.style.width = '450px';
      div.style.height = '400px';
      div.style.bottom = '5%';
      div.style.left = '20%';
      div.style.position = 'absolute';
      parent[0].appendChild(div);　　
    },
    remove() {
      if (skyline) {
        skyline.destroy();
        skyline = undefined;
      }
    },
    skylineChange(data) {
      if (data === 'line') {
        skyline.displayStyle = 0;
        this.getColor();
      } else if (data === 'surface') {
        skyline.displayStyle = 1;
        this.getColor();
      }
    },
    getColor() {
      var color = Cesium.Color.fromCssColorString(this.skyCorlr);
      skyline.color = color;
    }
  }
}
</script>

<style lang="scss" scope>
.inputGroup .el-form-item__content .el-input {
    width: 30% !important;
    margin: 0;
}

.inputGroup .el-input-group__append,
.inputGroup .el-input-group__prepend {
    padding: 0 10px !important;
    //background-color: #333333 !important;
    //border: 1px solid #686363 !important;
    //color: #D3D3D3 !important;
}

.inputGroup .el-input__inner {
    padding: 0 3px;
    //background-color: #333333 !important;
    //border: 1px solid #686363 !important;
    //color: #D3D3D3 !important;
}

.inputGroup .el-form-item__label {
    //color: #D3D3D3 !important;
}
</style>
