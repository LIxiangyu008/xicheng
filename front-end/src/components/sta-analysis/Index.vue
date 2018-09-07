<template>
	<div style="height: 100%;">
		<div class="container">
			<div class="title">统计分析</div>
			<div class="content">
				<el-tabs type="border-card" style="height: 100%;" stretch="stretch">
				  <el-tab-pane label="高级查询">高级查询</el-tab-pane>
				  <el-tab-pane label="统计">统计</el-tab-pane>
				  <el-tab-pane label="分析">
				  	<div class="HighQuery">
				  		<div>
				  			<img src="">
				  			<span>缓存分析</span>
				  		</div>
				  		<div>
				  			<img src="">
				  			<span>叠加区分析</span>
				  		</div>
				  		<div>
				  			<img src="">
				  			<span>服务设施查询</span>
				  		</div>
				  		<div @click="heatAnalysis">
				  			<img src="">
				  			<span>热力图分析</span>
				  		</div>
				  	</div>
				  	<div class="changeLayer">
				  		请选择图层: 
				  		<select>
				  			<option>图层12131232132131</option>
				  		</select>
				  	</div>
				  </el-tab-pane>
				</el-tabs>		
			</div>
		</div>
		<div id="map"></div>
	</div>
</template>

<script>
import '../../../static/lib/leaflet-heat.js';
    export default {
    	data() {
    		return {
    			stretch: true
    		};
    	},
    	methods: {
    		heatAnalysis() {
   				var resultLayer;
				var map = L.map('map', {
				    preferCanvas: true,
				    center: [39.89, 116.35],
				    maxZoom: 18,
				    zoom: 11
				});
				var heatNumbers = 150, heatRadius = 30;
				var num = parseInt(heatNumbers);
				num = (num > 0) ? num : 0;
				var radius = parseInt(heatRadius);
				radius = (radius > 0) ? radius : 0;
				var heatPoints = [];
				for (var i = 0; i < num; i++) {
				    heatPoints[i] = [Math.random() * 0.28 + 39.78, Math.random() * 0.5 + 116.12, Math.random() * 80];
				}
				resultLayer = L.heatLayer(heatPoints, {
				    radius: radius,
				    minOpacity: 0.5
				}).addTo(map);
    		}
    	}
    }
</script>

<style lang="scss" scoped>
.container {
	float: left;
	width: 300px;
	height: 100%;
    border-right: 1px solid #62C7E4;
}
.container .title {
	width: 100%;
    height: 30px;
    line-height: 30px;
    background: #eee;
    color: #999;
    text-align: center;
}
.container .content {
	padding: 10px 0;
    height: 100%;
}
.container .content .HighQuery {
	display: flex;
	flex-wrap: wrap;
}
.container .content .HighQuery div {
	width: 31.33%;
    font-size: 12px;
    height: 80px;
    text-align: center;
    cursor: pointer;
    background: #eeeeee61;
    margin-right: 5px;
    margin-bottom: 5px;
    border-radius: 5px;
    color: #333;
    padding-top: 5px;
}
.container .content .HighQuery div:nth-child(3n) {
	margin-right: 0;
}
.container .content .HighQuery div img {
    display: block;
    width: 50px;
    height: 50px;
    margin: auto;
    margin-bottom: 6px;
}
.container .content .changeLayer {
	padding: 10px;
}
#map {
	height: 100%;
	width: 100%;
    margin-left: 300px;
}
</style>