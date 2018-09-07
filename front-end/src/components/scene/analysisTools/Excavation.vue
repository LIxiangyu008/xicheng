<template>
	<section>
		<el-form>
			<el-form-item label="开挖深度：">
				<el-input-number v-model="num1" :min="0" label="描述文字"></el-input-number>
			</el-form-item>
			<el-form-item>
				<el-button @click="startExc">开挖</el-button>
			    <el-button @click="cancle">清除</el-button>
			</el-form-item>
		</el-form>
	</section>
</template>
<script type="text/javascript">
	let handlerPolygon,scene;
	export default {
		data() {
			return {
				num1: 50,
			}
		},
		mounted() {
			EventBus.$on('excavation', this.initDraw);
		},
		methods: {
			initDraw() {
				let that = this;
				scene = Viewer.scene;
				scene.undergroundMode = true;
				handlerPolygon = new Cesium.DrawHandler(Viewer,Cesium.DrawMode.Polygon,0);
				/*handlerPolygon = new Cesium.DrawHandler(Viewer,Cesium.DrawMode.Polygon,Cesium.ClampMode.Ground);*/
				handlerPolygon.clampMode = 1;
				handlerPolygon.deactivate();
				handlerPolygon.activeEvt.addEventListener(function(isActive){
		            if(isActive == true){
		                Viewer.enableCursorStyle = false;
		                Viewer._element.style.cursor = '';
		            }
		            else{
		                Viewer.enableCursorStyle = true;
		            }
		        });
				handlerPolygon.drawEvt.addEventListener(function(result){
		            if(!result.object.positions){
		                handlerPolygon.polygon.show = false;
		                handlerPolygon.polyline.show = false;
		                handlerPolygon.deactivate();
		                //handlerPolygon.activate();
		                return;
		            };
		            var array = [].concat(result.object.positions);
		            var positions = [];
		            for(var i = 0, len = array.length; i < len; i ++){
		                var cartographic = Cesium.Cartographic.fromCartesian(array[i]);
		                var longitude = Cesium.Math.toDegrees(cartographic.longitude);
		                var latitude = Cesium.Math.toDegrees(cartographic.latitude);
		                var h=cartographic.height;
		                if(positions.indexOf(longitude)==-1&&positions.indexOf(latitude)==-1){
		                    positions.push(longitude);
		                    positions.push(latitude);
		                    positions.push(h);
		                }
		            }
		            var dep = that.num1;
		            Viewer.scene.globe.removeAllExcavationRegion();
		            Viewer.scene.globe.addExcavationRegion({
		                name : 'ggg' ,
		                position : positions,
		                height : dep,
		                transparent : false
		            });
		            handlerPolygon.polygon.show = false;
		            handlerPolygon.polyline.show = false;
		            handlerPolygon.deactivate();
		            //handlerPolygon.activate();
		        });
		        if(!scene.pickPositionSupported){
		            alert('不支持深度纹理,无法绘制多边形，地形开挖功能无法使用！');
		        }
			},
			startExc() {
				if(handlerPolygon) {
					handlerPolygon.activate();
				}
			},
			cancle() {
				scene.globe.removeAllExcavationRegion();
            	handlerPolygon.polygon.show=false;
            	handlerPolygon.polyline.show=false;
			}
		}
	}
</script>
<style lang="scss" scoped>
</style>
