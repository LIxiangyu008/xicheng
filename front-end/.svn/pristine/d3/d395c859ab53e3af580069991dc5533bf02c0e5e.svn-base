<template>
	<section>
      	<div id="setbar_box">
	      <div class="block">
	        <span class="demonstration">高度(米)</span>
	        <el-slider v-model="controlHeight" :min='1' :max='500' @change='HeiChange' show-input></el-slider>
	      </div>
        </div>
		<div style="">
            <el-button plain type="info" @click="init">开始控高分析</el-button>
            <el-button plain type="info" @click="clearVS">清除</el-button>
		</div>
	</section>
</template>

<script>
	let textEntity,boxEntity,handlerPoint_box,pointOne,centerX,centerY
	export default {
		data() {
            return {
	                controlHeight:20.0,
            }
		},
		mounted() {
			EventBus.$on('clearAll',this.clearVS);
		},
		destroyed() {
			EventBus.$off('clearAll',this.clearVS);
		},
		methods:{
			init(){
				Viewer.entities.removeAll();
		        var viewModel = {
		        	length:this.length,
		        	width:this.width,
		        	controlHeight:this.controlHeight
		        };
				let that = this;
		        handlerPoint_box = new Cesium.DrawHandler(Viewer,Cesium.DrawMode.Polygon,Cesium.ClampMode.Ground);
	           	var entities = Viewer.entities;
				        //注册绘制长方体事件
		        handlerPoint_box.drawEvt.addEventListener(function(res){
		            var points = res.object.positions;
		            //var color = Cesium.Color.LIGHTGREY;
                	//var color = Cesium.Color.fromRandom({alpha:0.5});
		            // var color = Cesium.Color.fromRandom({red:222,green:222,blue:222,alpha:0.5});
                	//var color = Cesium.Color.fromBytes(222,222,222,150);
                	var colorItem = Cesium.Color.byteToFloat(222);
                	var alpha = Cesium.Color.byteToFloat(150);
                	var color = new Cesium.Color(colorItem,colorItem,colorItem,alpha);
		            boxEntity = new Cesium.Entity({
                        polygon: {
                            hierarchy:new Cesium.PolygonHierarchy(points),
                            //height:that.controlHeight,
                            extrudedHeight:that.controlHeight,
                            outline:false,
                            outlineColor:Cesium.Color.ANTIQUEWHITE ,
                            closeTop:true,
                            closeBottom:true,
                            fill:true,
                            material:color,
                        },
		            });
                    Viewer.entities.add(boxEntity);
                    pointOne = points[Math.ceil(points.length/2)];
                    centerX = pointOne.x+points[points.length-1].x;
                	centerY = pointOne.y+points[points.length-1].y;
                    textEntity = new Cesium.Entity({
	                    position:(centerX/2,centerY/2,that.controlHeight+20),
	                    label:{
	                        text:"当前高度约为 : " + that.controlHeight.toFixed(2) + " (米)",
	                        //heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND,
	                        font:'50px sans-serif',
	                    }
                    });
                    Viewer.entities.add(textEntity);
		        });
		        handlerPoint_box.activate();
			},
			HeiChange(val) {
                this.controlHeight = val;
                boxEntity.polygon.extrudedHeight.setValue(val);
                textEntity.position.label.text = "当前高度约为 : " + val + " (米)";
            },

			clearVS(){
				Viewer.entities.removeAll();
			}
		}
	}
</script>

<style lang="scss" scoped>
	
</style>