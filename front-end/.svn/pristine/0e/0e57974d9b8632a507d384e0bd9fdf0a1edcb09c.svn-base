<template>
	<div>
		<template>
          <div class="tabs">
            <span class="demonstration">日期选择</span>
            <el-date-picker
              format="yyyy/MM/dd"
              value-format = "yyyy/MM/dd"
              v-model="date"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div class="tabs">
              <span class="demonstration">开始时间</span>
              <el-time-select
              v-model="starttime"
              @change='startTimeChange'
              :picker-options="{
                start: '00:00',
                step: '02:00',
                end: '22:00'
              }"
              placeholder="选择开始时间">
              </el-time-select>
          </div>
          <div class="tabs">
              <span class="demonstration">结束时间</span>
              <el-time-select
              v-model="endtime"
              @change='endTimeChange'
              :picker-options="{
                start: '02:00',
                step: '02:00',
                end: '24:00'
              }"
              placeholder="选择结束时间">
              </el-time-select>
          </div>
          <div class="tabs shadow">
              <span class="demonstration">底部高程(米)</span>
              <el-input v-model="bottomHeight" placeholder="20" @change='bottomHeightChange'></el-input>
              </el-time-select>
          </div>
          <div class="tabs shadow">
              <span class="demonstration">拉伸高度(米)</span>
              <el-input v-model="extrudeHeight" placeholder="20" @change='extrudeHeightChange'></el-input>
              </el-time-select>
          </div>
           <div class="tabs">
              <span class="demonstration">日照速率(毫秒)</span>
              <el-slider v-model="controlspeed" :min='20' :max='100' @change='HeiChange' :step="20" show-input></el-slider>
          </div>         
          <div style="position: relative;margin: 10px;float: right;">
            <el-button plain type="info" @click="shadowAnalysis">阴影分析</el-button>
            <el-button plain type="info" @click="sunlight">日照效果</el-button>
            <el-button plain type="info" @click="clearVS">清除</el-button>
          </div>
        </template>
	</div>
</template>

<script>
let layers,shadowQuery,handlerPolygon,startTime,endTime

	export default {
		data() {
            return {
                date:'',
                bottomHeight:20,
                extrudeHeight:20,
                starttime:'',
                endtime:'',
                points:[],
                shadow :{

                },
                polygon:Object,
                nTimer:0.0,
                controlspeed:40
            }
		},
		mounted() {
      EventBus.$on('shadows', this.initBase);
      EventBus.$on('sightLine', this.clearVS);
		},
    destroyed () {
      EventBus.$off('sightLine', this.sightInitializing);
      EventBus.$off('sightLine', this.clearVS);
    },
    methods:{


        initBase(){
          let scene = Viewer.scene;
          layers = scene.layers.layerQueue;
          //创建阴影查询对象
          shadowQuery = new Cesium.ShadowQueryPoints(scene);
        },
        init(){
          this.initBase();
          //设置图层的阴影模式
          shadowQuery.build();
          this.setCurrentTime();
          handlerPolygon = new Cesium.DrawHandler(Viewer,Cesium.DrawMode.Polygon,0);
          handlerPolygon.activeEvt.addEventListener(function(isActive){
              if(isActive == true){
                  Viewer.enableCursorStyle = false;
                  Viewer._element.style.cursor = '';
                  // $('body').removeClass('drawCur').addClass('drawCur');
              }
              else{
                  Viewer.enableCursorStyle = true;
                  // $('body').removeClass('drawCur');
              }
          });
          let points = this.points;
          let that = this;
          handlerPolygon.drawEvt.addEventListener(function(result){
            points.length = 0 ;
            let polygon = Object.assign({}, result.object);
            if(!polygon){
                return ;
            }
            polygon.show = false;
            handlerPolygon.polyline.show = false;
            let positions = [].concat(polygon.positions);
            positions = Cesium.arrayRemoveDuplicates(positions,Cesium.Cartesian3.equalsEpsilon);
            //遍历多边形，取出所有点
            for(var i = 0, len = positions.length; i < len; i++) {
                //转化为经纬度，并加入至临时数组
                var cartographic = Cesium.Cartographic.fromCartesian(polygon.positions[i]);
                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
                points.push(longitude);
                points.push(latitude);
            }
            //设置分析对象的开始结束时间
            startTime = new Date(that.date);
            startTime.setHours(parseInt(that.starttime));
            shadowQuery.startTime = Cesium.JulianDate.fromDate(startTime);

            endTime = new Date(that.date);
            endTime.setHours(parseInt(that.endtime));
            shadowQuery.endTime = Cesium.JulianDate.fromDate(endTime);

            //设置当前时间
            that.setCurrentTime();

            shadowQuery.spacing = 10;
            shadowQuery.timeInterval = 60;

            //设置分析区域、底部高程和拉伸高度
            var bh = parseInt(that.bottomHeight);
            var eh = parseInt(that.extrudeHeight);
            shadowQuery.qureyRegion({
                position : points,
                bottom : bh,
                extend : eh
            });
            shadowQuery.build();

        });
        },
        HeiChange(val) {
          this.controlspeed = val;

        },
        shadowAnalysis(){
          Viewer.entities.removeAll();
          if(shadowQuery){
              shadowQuery.qureyRegion({
                  position : [0,0],
                  bottom : 0,
                  extend : 0
              });
              shadowQuery =  shadowQuery.destroy();
              shadowQuery = undefined;
          }
          this.init();
          for(var i = 0;i < layers.length;i++){
                layers[i].shadowType = 2;
            };
          handlerPolygon.deactivate();
          handlerPolygon.activate();
        },
        sunlight(){
          this.init();
          var dateVal = this.date;
          startTime = new Date(dateVal);
          endTime = new Date(dateVal);
          var shour = parseInt(this.starttime);
          var ehour = parseInt(this.endtime);
          for(var i = 0;i < layers.length;i++){
              layers[i].shadowType = 2;
          };
          if(shour > ehour) {
              return;
          }

          // shadowQuery.qureyRegion({
          //     position : [0,0],
          //     bottom : 0,
          //     extend : 0
          // });

          let nTimer = 0.0;
          let that = this;
          var nIntervId = setInterval(function() {
              if(shour < ehour) {
                  startTime.setHours(shour);
                  startTime.setMinutes(nTimer);
                  Viewer.clock.currentTime = Cesium.JulianDate.fromDate(startTime);
                  nTimer += 10.0;
                  if(nTimer > 60.0){
                      shour += 1.0;
                      nTimer = 0.0;
                  }
              }else {
                  clearInterval(nIntervId);
              }
          }, 120-that.controlspeed);
        },
        clearVS(){
            Viewer.entities.removeAll();
            /*this.date = '';
            this.starttime = '';
            this.endtime = '';
            this.bottomHeight = 20;
            this.extrudeHeight = 20;*/
            for(var i = 0;i < layers.length;i++){
                layers[i].shadowType = 0;
            };

            this.shadow.isStart = false;
            if(!handlerPolygon){
                return;
            }
            else{
                handlerPolygon.deactivate();
            };
            if(shadowQuery){
                shadowQuery.qureyRegion({
                    position : [0,0],
                    bottom : 0,
                    extend : 0
                });
                shadowQuery =  shadowQuery.destroy();
                shadowQuery = undefined;
            }
        },
        setCurrentTime() {
            endTime = new Date(this.date);
            endTime.setHours(parseInt(this.endtime));
            Viewer.clock.currentTime = Cesium.JulianDate.fromDate(endTime);
            Viewer.clock.multiplier = 1;
            Viewer.clock.shouldAnimate = true;
        },

        startTimeChange(val){
            startTime = new Date(this.date);
            startTime.setHours(parseInt(val));
            shadowQuery.startTime = Cesium.JulianDate.fromDate(startTime);
        },
        endTimeChange(val){
            endTime = new Date(this.date);
            endTime.setHours(parseInt(val));
            shadowQuery.endTime = Cesium.JulianDate.fromDate(endTime);
            this.setCurrentTime();
        },

        bottomHeightChange(){
            var bh = parseInt(this.bottomHeight);
            var eh = parseInt(this.extrudeHeight);
            shadowQuery.qureyRegion({
                position : this.points,
                bottom : bh,
                extend : eh
            });
        },

        extrudeHeightChange(){
            var bh = parseInt(this.bottomHeight);
            var eh = parseInt(this.extrudeHeight);
            shadowQuery.qureyRegion({
                position : this.points,
                bottom : bh,
                extend : eh
            });
        },


    }
	}
</script>

<style lang="scss">
	 .tabs {
      margin:10px
   }
  .shadow{
    .el-input {
      width: 67%;
    }
  }   
</style>
