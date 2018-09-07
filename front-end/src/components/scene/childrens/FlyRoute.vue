<template>
	<div style="height: 100%;">
		<div id="cesiumContainer" style="height: 100%;"></div>
		<div class='toolbar'>
		    <span type="button" id="play" class="button black" title="开始" @click="flyChange('1')">开始</span>
		    <span type="button" id="pause" class="button black" title="暂停" @click="flyChange('2')">暂停</span>
		    <span type="button" id="stop" class="button black" title="停止" @click="flyChange('3')">停止</span>
		    <div class="roots">
		        <select id="stopList" class="form-control" style="width: 100%;">
		            <option>路线1</option>
		            <option>路线2</option>
		        </select>
		    </div>
		    <div class="checkbox">
		        <label>
		            <input type="checkbox" id="show-line" checked> 显示飞行路线
		        </label>
		    </div>
		    <div class="checkbox">
		        <label>
		            <input type="checkbox" id="show-stop" checked> 显示飞行站点
		        </label>
		    </div>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default {
		data() {
			return {
				flyManager: {}
			};
		},
		methods: {
			flyChange(val) {
				EventBus.$emit('fly-start');
				// switch(val) {
				// 	case '1': this.flyManager && this.flyManager.play();console.log('开始');
				// 		break;
				// 	case '2': this.flyManager && this.flyManager.pause();console.log('暂停');
				// 		break;
				// 	case '3': this.flyManager && this.flyManager.stop();console.log('结束');
				// 		break;
				// }
			}
		},
		mounted() {
			// var viewer = new Cesium.Viewer('cesiumContainer');
			// var scene = viewer.scene;
			// var routes = new Cesium.RouteCollection(viewer.entities);
			// //添加fpf飞行文件，fpf由SuperMap iDesktop生成
			// var fpfUrl = '../../../../static/flyRoutes/flyRoutes1.fpf';
			// routes.fromFile(fpfUrl);
			// //初始化飞行管理
			// var flyManager = new Cesium.FlyManager({
			// 	scene: scene,
   //              routes: routes
			// });
			// flyManager.readyPromise.then(function () { // 飞行路线就绪
			// 	var currentRoute = flyManager.currentRoute;
			// 	currentRoute.isLineVisible = true;
			// 	currentRoute.isStopVisible = true;
			// });
			// this.flyManager = flyManager;
		}
	}
</script>
<style scoped>
.toolbar {
	margin-top: 60px;
    margin-left: 20px;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(38, 38, 38, 0.75);
    padding: 20px 20px 10px 20px;
    color: #ffffff;
    border: 1px solid #526f82;
}
.toolbar .roots {
	width: 150px;
}
.button.black {
    border: 1px solid #333;
    box-shadow: 0 1px 2px #8b8b8b inset, 0 -1px 0 #3d3d3d inset, 0 -2px 3px #8b8b8b inset;
    background: -webkit-linear-gradient(top,rgba(34, 34, 34, 0.49),rgba(51, 51, 51, 0.55));
}
.button {
    line-height: 30px;
    text-align: center;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 1px 1px #333;
    border-radius: 3px;
    margin: 0 8px 8px 0;
    position: relative;
    overflow: hidden;
    }
#play {
    content: url('../../../../static/img/flyRoutes/play.png');
    height: 30px;
    padding: 5px;
}
#pause {
    content: url('../../../../static/img/flyRoutes/pause.png');
    height: 30px;
    padding: 5px;
}
#stop {
    content: url('../../../../static/img/flyRoutes/stop.png');
    height: 30px;
    padding: 5px;
}
</style>