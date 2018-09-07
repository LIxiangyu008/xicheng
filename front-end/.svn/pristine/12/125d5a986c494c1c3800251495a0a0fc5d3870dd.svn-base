<template>
	<div>
		<div v-show="analysisShow" @click="toggle()" class="toggle">
			<div v-show="statusChange">
				<i class="el-icon-d-arrow-left" title="收起"></i>
			</div>
			<div v-show="!statusChange">
				<i class="el-icon-d-arrow-right" title="打开"></i>
			</div>
		</div>
		<div v-show="statusChange">
			<div class="heatContainer" v-show="analysisShow">
				<div class="content">
					<el-tabs type="border-card" style="box-shadow: none;border: none;border-top: 1px solid #dcdfe6;" stretch="stretch" @tab-click="clearAll">
						<el-tab-pane label="高级查询">
							<div class="changeLayer HighQuery">
								<div class="legendsChoose">
									<span>请选择图层</span><br>
									<select v-model="HQlegends" style="width: 180px;margin-bottom: 10px;">
										<option value="-1" disabled="disabled">请选择</option>
										<option v-for="(item, index) in legendsHQ" :value="index">{{item.name}}</option>
									</select>
								</div>
								<div class="term">
									属性查询条件<br>
									<div v-for="(items, Index) in moreProp">
										<select v-model="moreProp[Index].propVal" @change="choose(moreProp[Index].propVal, Index)">
											<option value="0" disabled="disabled">请选择</option>
											<option v-for="(item, index) in properties">{{item}}</option>
										</select>
										<select style="margin-left: 0;" v-model="moreProp[Index].compareVal">
											<option value="0" disabled="disabled">请选择</option>
											<option v-for="(item, index) in moreProp[Index].typeResult">{{item}}</option>
										</select>
										<input type="text" name="" v-model="moreProp[Index].inputVal">
										<img src="../../../static/img/min.png" v-show="subShow" @click="subTerm(Index)">
										<img src="../../../static/img/add.png" v-show="Index == moreProp.length - 1 ? true : false" @click="addTerm(Index)">
									</div>
								</div>
								<div class="confirmBtn">
									<button @click="query">查询</button>
								</div>
							</div>
						</el-tab-pane>
						<el-tab-pane label="分析">
							<div class="analysis">
							  <div @click="dataAnalysis(0)" :class="isActive === 0 ? 'active' : ''">
							    <i class="icon-relitu"></i>
							    <span>热力图分析</span>
							  </div>
							  <div @click="dataAnalysis(1)" :class="isActive === 1 ? 'active' : ''">
							    <i class="icon-icon-chongdie"></i>
							    <span>缓冲区分析</span>
							  </div>
							  <div @click="dataAnalysis(2)" :class="isActive === 2 ? 'active' : ''">
							    <i class="icon-midu"></i>
							    <span>密度分析</span>
							  </div>
							  <div @click="dataAnalysis(3)" :class="isActive === 3 ? 'active' : ''">
							    <i class="icon-rediantance"></i>
							    <span>热点分析</span>
							  </div>
							</div>
							<div class="changeLayer HeatLayer" v-show="selectShow">
							  请选择图层    
							  <select v-model="optionChange">
							  	<option value="-1">请选择</option>
							    <option v-for="(item, index) in options" :value="index">{{item.name}}</option>
							  </select>
							</div>
						</el-tab-pane>
					</el-tabs>
				</div>
				<div class="configParams" v-show="configParams">
					<div class="content">
						<div class="colorValue">
							选择颜色 
							<ul @click="colorOption">
								<li :style="colorBar[colorIndex]"></li>
							</ul>
							<ul v-show="colorFlag">
								<li @click="colorChange('0')" :style="colorBar[0]"></li>
								<li @click="colorChange('1')" :style="colorBar[1]"></li>
								<li @click="colorChange('2')" :style="colorBar[2]"></li>
							</ul>
						</div>
						<div class="radiu">
							选择半径  
							<div class="block">
							    <el-slider v-model="radius" :max="500">
							    </el-slider>
							</div>
							<span class="num">{{radius}}米</span>
						</div>
						<div>
							<button @click="clear">清除</button>
							<button @click="beganDraw()">开始绘制</button>
						</div>
					</div>
				</div>
				<div class="bufferRadius" v-show="isActive === 1">
					<div>自定义缓冲区分析</div>
					<ul class="drawType" :class="optionChange === '-1' ? '' : 'disabled'">
						<li @click="drawLayer('point')" :class="isDraw === 1 ? 'isDraw' : ''"><i class="el-icon-edit"></i>画点</li>
						<li @click="drawLayer('polyline')" :class="isDraw === 2 ? 'isDraw' : ''"><i class="el-icon-edit"></i>画线</li>
						<li @click="drawLayer('polygon')" :class="isDraw === 3 ? 'isDraw' : ''"><i class="el-icon-edit"></i>画面</li>
					</ul>
					<div>缓冲区半径</div>
					<div class="block">
					    <el-slider v-model="bufferRadius" :max="100">
					    </el-slider>
					</div>
					<div class="num">
						<span>{{bufferRadius}}</span>
						<select v-model="bufferUint">
							<option value="meter">米</option>
							<option value="Km">公里</option>
						</select>
					</div>
					<div>
						<button @click="clear">清除</button>
						<button @click="beginBufferAnalysis">开始分析</button>
					</div>
				</div>
				<div style="position: relative">
					<div class="densityAnalysis public" v-show="isActive === 2">
						<div>
							<span>选择数据</span>
							<select v-model="datasetValue">
								<option v-for="(item, index) in dataSet" :value="index">{{item}}</option>
							</select>
						</div>
						<div>
							<span>分析方法</span>
							<select v-model="densityParm.method">
								<option value="0">简单点密度分析</option>
								<option value="1">核密度分析</option>
							</select>
						</div>
						<div>
							<span>网格面类型</span>
							<select v-model="densityParm.meshType" style="margin-left: 36px;">
								<option value="0">四边形网格</option>
								<option value="1">六边形网格</option>
							</select>
						</div>
						<div style="position: relative;">
							<span>权重值字段</span>
							<input v-model="densityParm.fields" @click="showWeight" type="text" name="" style="margin-left: 36px;">
							<ul v-show="weightShow" class="weightOption">
								<li v-for="(item, index) in weight" @click="weightOption(index)">{{item}}</li>
								<i class="el-icon-circle-close-outline" title="收起" @click="weightShow = false"></i>
							</ul>
						</div>
						<div>
							<span>分析范围</span>
							<input v-model="densityParm.queryRange" type="text" name="">
						</div>
						<div>
							<span>网格大小</span>
							<input v-model="densityParm.meshSize" type="text" name="">
						</div>
						<div>
							<span>网格大小单位</span>
							<select v-model="densityParm.meshSizeUnit" style="margin-left: 22px;">
								<option value="Meter">Meter</option>
								<option value="Kilometer">Kilometer</option>
								<option value="Yard">Yard</option>
								<option value="Foot">Foot</option>
								<option value="Mile">Mile</option>
							</select>
						</div>
						<div>
							<span>搜索半径</span>
							<input v-model="densityParm.radius" type="text" name="">
						</div>
						<div>
							<span>搜索半径单位</span>
							<select v-model="densityParm.radiusUnit" style="margin-left: 22px;">
								<option value="Meter">Meter</option>
								<option value="Kilometer">Kilometer</option>
								<option value="Yard">Yard</option>
								<option value="Foot">Foot</option>
								<option value="Mile">Mile</option>
							</select>
						</div>
						<div>
							<span>面积单位</span>
							<select v-model="densityParm.areaUnit">
								<option value="SquareMile">SquareMile</option>
								<option value="Hectare">Hectare</option>
								<option value="Are">Are</option>
								<option value="Acre">Acre</option>
								<option value="SquareFoot">SquareFoot</option>
								<option value="SquareYard">SquareYard</option>
								<option value="SquareMeter">SquareMeter</option>
							</select>
						</div>
						<div>
							<button @click="clear">清除</button>
							<button @click="beginDensityAnalysis">开始分析</button>
						</div>
					</div>					
				</div>
				<div style="position: relative;">
					<div class="hotspotAnalysis public" v-show="isActive === 3">
						<div>
							<span>选择数据</span>
							<select v-model="datasetValue">
								<option v-for="(item, index) in dataSet" :value="index">{{item}}</option>
							</select>
						</div>
						<div>
							<span>聚合类型</span>
							<select v-model="hotspotParm.polyType">
								<option value="SUMMARYMESH">网格面聚合</option>
								<option value="SUMMARYREGION">多边形聚合</option>
							</select>
						</div>
						<div>
							<span>网格面类型</span>
							<select style="margin-left: 36px;" v-model="hotspotParm.meshType">
								<option value="0">四边形网格</option>
								<option value="1">六边形网格</option>
							</select>
						</div>
						<div>
							<span>分析范围</span>
							<input v-model="hotspotParm.queryRange" type="text" name="">
						</div>
						<div>
							<span>分辨率</span>
							<input v-model="hotspotParm.resolution" type="text" name="" style="margin-left: 64px;">
						</div>
						<div style="position: relative;">
							<span>统计模式</span>
							<input v-model="hotspotParm.statisticModes" @click="showModes" type="text" name="" title="'统计模式'个数应与'权重值字段'个数一致">
							<ul v-show="modeShow" class="weightOption" style="z-index: 9;">
								<li v-for="(item, index) in modes" @click="modesOption(index)">{{item}}</li>
								<i class="el-icon-circle-close-outline" title="收起" @click="modeShow = false"></i>
							</ul>
						</div>
						<div style="position: relative;">
							<span>权重值字段</span>
							<input v-model="hotspotParm.fields" @click="showWeight" type="text" name="" style="margin-left: 36px;">
							<ul v-show="weightShow" class="weightOption">
								<li v-for="(item, index) in weight" @click="weightOption(index)">{{item}}</li>
								<i class="el-icon-circle-close-outline" title="收起" @click="weightShow = false"></i>
							</ul>
						</div>
						<div>
							<button @click="clear">清除</button>
							<button @click="beginHotspotAnalysis">开始分析</button>
						</div>
					</div>	
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
import '../../../static/lib/leaflet-heat.js';
import { serviceMgr } from "./serviceMeta.js";
import L from "leaflet";
import {
  mapState,
  mapMutations
} from 'vuex';
import axios from 'axios';
import {
	getMapLayer, getMapData
} from '../../apis/api.js';
let heatMapColor = APPCONFIG.Analysis.default.heatMapColor;
export default {
	data() {
		return {
			stretch: true,
			configParams: false,
			optionChange: '-1',
			colorValue: heatMapColor[0],
			colorFlag: false,
			colorBar: [
				"background: -webkit-linear-gradient(left,red,orange,yellow);",
				"background: -webkit-linear-gradient(left,green,orange,yellow);",
				"background: -webkit-linear-gradient(left,purple,orange,yellow);"
			],
			colorIndex: 0,
			radius: 30,
			options: [],// 分析图层
			requestParams: {
		        name: "",
		        pageSize: 300,
		        options: {
		          startRecord: 0,
		          expectCount: 300
		        }
	      	},
	      	currentMapName: '',
	      	statusChange: true,
	      	legendsHQ: [],  // 高级查询图层
	      	HQlegends: '-1',
	      	properties: [], // 属性集
	      	typeVal: [],  // 属性对应的数据类型集合
	      	propCalled: [], // 属性别称(用于查询)
			moreProp: [
				{
					propVal: '0',
					compareVal: '0',
					inputVal: '',
					typeResult: [] // 比较类型
				}
			],
	      	subShow: false,
	      	resultList: [],
	      	isActive: 0,
	      	flag: false,  // 标志位，防止因监听同一个specialLayers而引起的冲突
	      	mark: false,  // 标志位，控制清除高级查询弹出层
	      	bufferRadius: 10, // 缓冲区半径
	      	bufferUint: 'meter',
	      	isDraw: 0,
	      	selectShow: true,
	      	datasetValue: '0',
	      	hotspotParm: {
	      		datasetName: '',
	      		polyType: 'SUMMARYMESH',
	      		meshType: '0',
	      		queryRange: '496955.1,300202.23,503621.21,311711.09',
	      		resolution: '100',
	      		statisticModes: 'sum',
	      		fields: 'Field_SmUserID',
	      		flag: 'hotspot'  // 添加的标识符
	      	},
	      	densityParm: {
	      		datasetName: '',
	      		method: '1',
	      		meshType: '1',
	      		fields: 'Field_SmUserID',
	      		queryRange: '496955.1,300202.23,503621.21,311711.09',
	      		meshSize: '100',
	      		meshSizeUnit: 'Meter',
	      		radius: '400',
	      		radiusUnit: 'Meter',
	      		areaUnit: 'SquareMile',
	      		flag: 'density'  // 添加的标识符
	      	},
	      	weightShow: false,
	      	weight: ['medallion','hack_license','vecdor_id','rate_code','pickup_datetime'],
	      	modeShow: false,
	      	modes: ['max','min','average','variance','stdDeviation'],
	      	dataSet: []  // 数据集
		}
	},
	computed: {
	    ...mapState({
	      analysisShow: state => state.map.analysisShow,
	      specialLayers: state => state.map.specialLayers,
	      analysisParams: state => state.map.analysisParams,
	      geojsonDataFlag: state => state.map.geojsonDataFlag,
	      currentActiveLayerIndex: state => state.map.currentActiveLayerIndex
	    })
  	},
	methods: {
		...mapMutations([
			'removeAnalysisParams',
			'changeAnalysisParams',
			"changeGeoJsonDataFlag",
			'changeMarkerQueryList'
		]),
		dataAnalysis(index) {
			this.selectShow = true;
			if (index === 2 || index === 3) {
				this.selectShow = false;
			}
			this.clearAll();
			this.isActive = index;
		},
	    beganDraw() {  // 修改参数
	    	var params = {'colorValue': this.colorValue, 'radius': this.radius};
	    	EventBus.$emit('openHeatAnalysis', {'coords': this.analysisParams, 'params': params});
	    },
	    colorChange(val) {
	    	switch(val) {
	    		case "0":
	    			this.colorValue = heatMapColor[0];
	    			this.colorIndex = 0;
	    			break;
	    		case "1":
	    			this.colorValue = heatMapColor[1];
	    			this.colorIndex = 1;
	    			break;
	    		case "2":
	    			this.colorValue = heatMapColor[2];
	    			this.colorIndex = 2;
	    			break;
	    	}
	    	this.colorFlag = false;
	    },
	    colorOption() {
	    	this.colorFlag = true;
	    },
	    toggle() {
	    	this.statusChange = !this.statusChange;
	    },
	    clearAnalysis() { // 清除分析
	    	this.optionChange = '-1';
	    	this.clear();
	    	this.configParams = false;
	    	this.radius = 30;
	    	this.colorIndex = 0;
	    	this.colorValue = heatMapColor[0];
	    	this.hotspotParm.fields = 'Field_SmUserID';
	    	this.densityParm.fields = 'Field_SmUserID';
	    	this.modeShow = false;
	    	this.weightShow = false;
	    	if (!this.analysisShow) {
	    		this.isActive = 0;
	    	}
	    },
	    clearQuery() { // 清除查询
	    	this.moreProp = [
				{
					propVal: '0',
					compareVal: '0',
					inputVal: '',
					typeResult: [] // 比较类型
				}
			];
			if (this.mark) {
				EventBus.$emit('clear-highQueryLayer');  // 清除高级查询的弹出
				this.mark = false;
			}
	    },
	    clearAll(tab, event) {
	    	if (tab) {  // tabs插件参数
		    	if (tab.label === '分析') {
		    		this.flag = true;
		    		this.isActive = 0;
			    	this.dataSet = [];
					var url = 'http://192.168.46.64:8090/iserver/services/datacatalog/rest/datacatalog/sharefile.json';
					var data = [];
					var layerName = [];
					getMapData(url).then((res) => {  // 获取所有的数据集
						data = res.data.datasetNames;
						var layerUrl = 'http://192.168.46.64:8090/iserver/services/datacatalog/rest/datacatalog/sharefile/';
						for (var i = 0; i < data.length; i++) {
							getMapData(layerUrl + data[i] + '.json').then((res) => {
								if (res.status === 200) {
									if (res.data.datasetInfo.datasetType === 'POINT') {  // 筛选点数据集
										layerName.push(res.data.datasetInfo.name);	
									}
								}
							}).catch((error) => {
								this.$message('查询数据详情失败');
							});
						}
						this.dataSet = layerName;
					})
		    	} else {
		    		this.flag = false;
		    		this.isActive = 0;
		    	}	
	    	}
	    	this.HQlegends = '-1';
	    	this.currentMapName = '';
	    	this.clearAnalysis();
	    	this.clearQuery();
	    },
	    addTerm(index) {
	    	this.subShow = true;
	    	this.moreProp.push({
				propVal: '0',
				compareVal: '0',
				inputVal: '',
				typeResult: []
	    	});
	    	this.addShow = this.moreProp[index+1];
	    },
	    subTerm(index) {
	    	this.moreProp.splice(index,1);
	    },
	    query() { // 高级查询
	    	this.changeMarkerQueryList(false); // 清除mark查询列表
	    	this.mark = true;
	    	EventBus.$emit('clear-highQueryLayer');
	    	this.changeGeoJsonDataFlag(false);  // 清除之前的弹框
	    	var propertiesValue, compareType, inputVal, sql, currentPosition, queryProperties;
	    	for (var i = 0; i < this.moreProp.length; i++) {
	    		propertiesValue = this.moreProp[i].propVal;
	    		if (propertiesValue === '0') {
	    			propertiesValue = 'SmID';
	    		}
	    		compareType = this.moreProp[i].compareVal;
	    		if (compareType === '0') {
	    			compareType = '大于等于';
	    		}
	    		inputVal = this.moreProp[i].inputVal;
	    		if (inputVal === '') {
	    			inputVal = '1';
	    		}
	    		currentPosition = this.properties.indexOf(propertiesValue);  // 找到当前所选属性在属性列表中的位置
	    		queryProperties = this.propCalled[currentPosition];  // 用于查询用的属性别称
	    		if (this.typeVal[currentPosition] === 'WTEXT') {
	    			if (compareType === '模糊') {
	    				compareType = ' like ';
	    				inputVal = "'%" + inputVal + "%'";
	    			} else {
	    				inputVal = "'" + inputVal + "'";
	    			}
	    		}
				switch(compareType) {
					case '大于':
						compareType = ' > ';break; 
					case '大于等于':
						compareType = ' >= ';break;
					case '小于':
						compareType = ' < ';break;
					case '小于等于':
						compareType = ' <= ';break;
					case '等于':
						compareType = ' = ';break;
				}
	    		if (i > 0) { // 多条件查询
	    			sql = sql + " AND " + queryProperties + compareType + inputVal;
	    		} else {
					sql = queryProperties + compareType + inputVal;
	    		}		
	    	}
			this.requestParams.sql = sql;
			this.requestParams.url = "/webframe/biz/httpproxy/httpproxy.jsp?url=" + this.legendsHQ[this.HQlegends].url;
			serviceMgr.getRestBySql(this.requestParams).then((res) => {
				this.resultList = [];
				EventBus.$emit('clear-queryData'); // 清除绘制查询的缓存数据
				if (res.recordsets && res.recordsets.length) {
					for (var i = 0; i < res.recordsets.length; i++) {
						if (res.recordsets[i].features.features && res.recordsets[i].features.features.length > 0) {
							this.changeGeoJsonDataFlag(true);
							this.resultList.push({
			                    name: res.recordsets[i].datasetName,
			                    data: res.recordsets[i].features
			                });
			                EventBus.$emit('query-Data', this.resultList);
			                EventBus.$emit('query-mark', this.resultList[0].data);
						} else {
							this.$message('未查询到数据');
						}
					}
				}
			})
	    },
	    choose(val, index) {
	    	var i = this.properties.indexOf(val);
	    	if (this.typeVal[i] === 'WTEXT') {
	    		this.moreProp[index].typeResult = ['等于','模糊'];
	    	} else {
	    		this.moreProp[index].typeResult = ['大于','大于等于','小于','小于等于','等于'];
	    	}
	    },
	    beginBufferAnalysis() { // 缓冲区分析
			var radius = this.bufferRadius;
			if (this.bufferUint === 'Km') {
				radius = radius * 1000;
			}
			if (this.optionChange !== '-1') {  // 选择了图层
				serviceMgr.getRestBySql(this.requestParams).then((res) => {
					if (res.succeed) {
						var datasetName = res.recordsets[0].datasetName;
						var bufferParams = {'datasetName': datasetName, 'radius': radius};
						EventBus.$emit('buffer-analysis', bufferParams);
					}
				})
			}
			if (this.optionChange === '-1') {  // 未选图层
				if (this.isDraw === 0) {
					this.$message('请选择图层');
				} else {
					EventBus.$emit('toolbar-startBuffer', radius, this.bufferUnit)
				}
			}
	    },
		drawLayer(type) {   // 选择绘制方式
			switch(type) {
				case 'point':
					if (this.isDraw === 1) {
						this.isDraw = 0;
					} else {
						this.isDraw = 1;
					}
					break;
				case 'polyline':
					if (this.isDraw === 2) {
						this.isDraw = 0;
					} else {
						this.isDraw = 2;
					}
					break;
				case 'polygon':
					if (this.isDraw === 3) {
						this.isDraw = 0;
					} else {
						this.isDraw = 3;
					}
					break;
			}
			EventBus.$emit('toolbar-draw', type);
		},
		beginDensityAnalysis() { // 密度分析
			this.densityParm.datasetName = this.dataSet[this.datasetValue];
			// EventBus.$emit('start-unionAnalysis', this.densityParm);
			console.log(this.densityParm.datasetName);
		},
		beginHotspotAnalysis() {  // 热点分析
			this.hotspotParm.datasetName = this.dataSet[this.datasetValue];
			EventBus.$emit('start-unionAnalysis', this.hotspotParm);
		},
		clear() {  // 清除分析
			EventBus.$emit('clear-analysis');
		},
		showWeight() {
			this.weightShow = true;
			this.modeShow = false;
		},
		showModes() {
			this.modeShow = true;
			this.weightShow = false;
		},
		weightOption(index) {
			this.densityParm.fields += ',' + this.weight[index];
			this.hotspotParm.fields += ',' + this.weight[index];
		},
		modesOption(index) {
			this.hotspotParm.statisticModes += ',' + this.modes[index];
		}
	},
	watch: {
		optionChange (val, oldval) {  // 分析图层  切换监听
			if (this.flag) {
				if (val !== '-1') {
					this.isDraw = 0;
					this.currentMapName = this.options[val].name;
					var url = this.options[val].url;
					let sql = " SMID>0 ";
					this.requestParams.sql = sql;
					this.requestParams.url = "/webframe/biz/httpproxy/httpproxy.jsp?url=" + url;
					getMapLayer(url).then((res) => {
						if (res.status === 200) {
							var dataType = res.data[0].subLayers.layers[0].datasetInfo.type;
							if (this.isActive === 0) {  // 热力图分析
								if (dataType === 'POINT') { // 可做热力分析
									this.configParams = true;
									serviceMgr.getRestBySql(this.requestParams).then((res) => {
										if (res.succeed) {
											var resultList = [];
											var coords = [];
											for(var i = 0; i < res.recordsets.length; i++){
												resultList.push(res.recordsets[i].features.features);
											}
											for(var j = 0;  j < resultList.length; j++) {
												for(var k = 0; k < resultList[j].length; k++){
													var latlng = L.latLng(
														resultList[j][k].properties.SmY,
														resultList[j][k].properties.SmX
													);
													coords.push(latlng);
												}
											}
											this.changeAnalysisParams(coords);
											var params = {'colorValue': this.colorValue, 'radius': this.radius};
											EventBus.$emit('openHeatAnalysis', {'coords': this.analysisParams, 'params': params});
										}
									});
								} else {  // 不能热力分析
									this.$message('当前图层不支持热力分析');
									this.configParams = false;
								}
							}
						}
					}).catch((error) => {
						this.$message.error('请求或服务器错误');
						console.log(error);
					});
				} else {
					this.clearAll();
				}
			}
		},
		HQlegends(val, oldval) { // 高级查询图层 切换监听
			if (val != '-1') {
				this.currentMapName = this.legendsHQ[val].name;
				var url = this.legendsHQ[val].url;
				let sql = " SMID>0 ";
				this.requestParams.sql = sql;
				this.requestParams.url = "/webframe/biz/httpproxy/httpproxy.jsp?url=" + url;
				serviceMgr.getRestBySql(this.requestParams).then((res) => {
					if (res.succeed) {
						if (res.recordsets) {
							this.properties = res.recordsets[0].fieldCaptions;
							this.typeVal = res.recordsets[0].fieldTypes;
							this.propCalled = res.recordsets[0].fields;
						}
					}
				})
			}	
		},
		specialLayers (val, oldval) {  // 图层基本信息
			this.legendsHQ = this.specialLayers;
			this.options = this.specialLayers;
			if (this.currentMapName && val.length !== 0) {
				var currentLegendsPos; // 当前所选图层在options中的索引
				var arr = val.filter((item, index) => {
					if (item.name === this.currentMapName) {
						currentLegendsPos = index;
					}
					return item.name === this.currentMapName;
				});
				if (arr.length === 0) { // 左侧列表取消的图层刚好是当前所选图层
					this.clearAll();
				} else {
					this.optionChange = currentLegendsPos;  // 保证option还是当前所选状态
					this.HQlegends = currentLegendsPos;
				}
			} else {
				this.clearAll();
			}
		},
		analysisShow (val, oldval) {
			if (!val) {
				this.clearAll();
				this.statusChange = true;
			}
		},
		moreProp (val, oldval) {
			if (this.moreProp.length == 1) {
				this.subShow = false;
			}
		}
	}
}
</script>
<style  lang="scss" scoped>
.toggle {
    position: absolute;
    top: 10%;
    left: 4.5%;
    z-index: 9;
    width: 24px;
    height: 24px;
    line-height: 24px;
    font-size: 18px;
    text-align: center;
    border-radius: 12px;
    color: #ccc;
    background-color: rgba(0.2,0.2,0.2,0.1);
}
.toggle:hover {
	cursor: pointer;
	color: #dcdfe6;
    background-color: rgba(0.2, 0.2, 0.2, 0.3);
}
.heatContainer {
    background: #fff;
    border: 1px solid #dcdfe6;
    position: absolute;
    top: 14%;
    width: 306px;
    z-index: 99;
    left: 4.5%;
}
.heatContainer .content .analysis {
	display: flex;
	flex-wrap: wrap;
	margin: -5px;
	margin-bottom: 12px;
}
.heatContainer .content .analysis .active {
	color: #409EFF;
	border-color: #409EFF;
}
.heatContainer .content .analysis div {
    border: 1px solid #ccc;
    width: 31.33%;
    font-size: 12px;
    height: 65px;
    text-align: center;
    cursor: pointer;
    margin-right: 8px;
    margin-bottom: 5px;
    border-radius: 5px;
    color: #606266d9;
    padding-top: 5px;
}
.heatContainer .content .analysis div i {
    font-size: 36px;
    display: block;
    margin-bottom: 4px;
}
.heatContainer .content .analysis div:nth-child(3n) {
  	margin-right: 0;
}
.heatContainer .content .analysis div img {
    display: block;
    width: 50px;
    height: 50px;
    margin: auto;
    margin-bottom: 6px;
}
.heatContainer .content .changeLayer {
    font-size: 14px;
    color: #666;
    margin: -5px;
}
.heatContainer .content .HighQuery select {
    margin: 10px 0px 0px 10px;
    width: 87px;
    padding: 6px;
    border-radius: 5px;
    font-size: 12px;
    border-color: #ccc;
    vertical-align: middle;
    color: #333;
}
.heatContainer .content .HighQuery .term input {
    width: 50px;
    outline: none;
    border-radius: 5px;
    border-style: none;
    border: 1px solid #ccc;
    height: 30px;
    text-indent: 5px;
    border-color: #ccc;
    vertical-align: middle;
    margin-top: 8px;
}
.heatContainer .content .HighQuery .term img {
	cursor: pointer;
	vertical-align: middle;
    margin-top: 10px;
}
.heatContainer .content .HighQuery .confirmBtn {
	text-align: center;
}
.heatContainer .content .HighQuery .confirmBtn button {
    padding: 5px 30px;
    margin-top: 10px;
    width: 94px;
    border: 1px solid #ccc;
    background: #eee;
    color: rgb(51, 51, 51);
    border-radius: 3px;
    cursor: pointer;
}
.heatContainer .content .HeatLayer {
	padding: 5px 10px;
	color: #666;
}
.heatContainer .content .HeatLayer select {
	width: 160px;
    height: 24px;
    outline: none;
    line-height: 24px;
    border: 1px solid #c0c4cc;
    text-indent: 5px;
    margin-left: 24px;
    color: #666;
    border-radius: 3px;
}
.configParams {
    margin-top: -12px;
}
.configParams .content {
	padding: 10px 20px;
    font-size: 14px;
    color: #666;
}
.configParams .content .public {
    display: inline-block;
    height: 24px;
    line-height: 24px;
    border: 1px solid #c0c4cc;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    text-align: center;
    background: #eee;	
}
.configParams .content .colorValue {
	position: relative;
}
.configParams .content .colorValue input {
	width: 40%;
	float: left;
}
.configParams .content .colorValue select {
    width: 160px;
    height: 24px;
    outline: none;
    line-height: 24px;
    border: 1px solid #c0c4cc;
    text-indent: 5px;
    margin-left: 38px;
    color: #666;
    border-radius: 3px;
}
.configParams .content .colorValue ul {
	display: inline-block;
    margin-left: 38px;
    width: 160px;
    vertical-align: middle;
    border: 1px solid #c0c4cc;
    border-radius: 3px;	
    padding: 1px 1px 0 1px;
    cursor: pointer;
}
.configParams .content .colorValue ul:nth-child(2) {
    position: absolute;
    left: 60px;
    z-index: 9999;
    background: #fff;	
}
.configParams .content .colorValue ul li {
    height: 22px;
    margin-bottom: 1px;
}
.configParams .content .radiu {
	margin: 10px 0;
	position: relative;
}
.configParams .content .radiu .block {
    width: 160px;
    display: inline-block;
    height: 25px;
    margin-left: 38px;
    margin-top: -5px;
}
.configParams .content .radiu .num {
    position: absolute;
    font-size: 13px;
    top: -3px;
    left: 66%;
    color: #666;
}
.configParams .content button {
    margin-left: 24px;
    color: #666;
    width: 94px;
    background: #eee;
    border: 1px solid #ccc;
    font-size: 12px;
    padding: 2px;
    border-radius: 1px;
    cursor: pointer;
}

.heatContainer .bufferRadius {
	padding: 0 10px 10px 20px;
    color: #666;
    font-size: 14px;
}
.heatContainer .bufferRadius .disabled {
	pointer-events: none;
    cursor: default;
    opacity: 0.6;
}
.heatContainer .bufferRadius .block {
    width: 160px;
    display: inline-block;	
}
.heatContainer .bufferRadius select {
    width: 60px;
    outline: none;
    border: 1px solid #c0c4cc;
    text-indent: 5px;
    color: #666;
    border-radius: 3px;
}
.heatContainer .bufferRadius .num {
    float: right;
    margin-top: 8px;
    margin-right: 15px;
}
.heatContainer .bufferRadius button {
    padding: 5px 30px;
    width: 120px;
    border: 1px solid #ccc;
    background: #eee;
    color: #333333;
    border-radius: 3px;
    cursor: pointer;
    margin-left: 7px;
}
.heatContainer .bufferRadius .drawType {
	padding: 10px 0 10px 96px;
}
.heatContainer .bufferRadius .drawType li {
	display: inline-block;
    margin-right: 14px;
    cursor: pointer;
}
.heatContainer .bufferRadius .drawType .isDraw {
	color: #409EFF;
}
.heatContainer .public {
	padding: 0 10px;
    color: #666;
    font-size: 14px;
    margin-top: -24px;
}
.heatContainer .public>div {
	padding: 2px 0;
}
.heatContainer .public select {
    width: 170px;
    height: 24px;
    outline: none;
    line-height: 24px;
    border: 1px solid #c0c4cc;
    text-indent: 5px;
    margin-left: 50px;
    color: #666;
    border-radius: 3px;	
}
.heatContainer .public input {
    width: 170px;
    height: 24px;
    outline: none;
    line-height: 24px;
    border: 1px solid #c0c4cc;
    text-indent: 8px;
    margin-left: 50px;
    color: #666;
    border-radius: 3px;
    padding-right: 5px;	
}
.heatContainer .public button {
    padding: 5px 30px;
    width: 120px;
    border: 1px solid #ccc;
    background: #eee;
    color: #333333;
    border-radius: 3px;
    cursor: pointer;
    margin: 5px 0 5px 13px;
}
.heatContainer .public .weightOption {
    position: absolute;
    background: #fff;
    width: 170px;
    border: 1px #ccc solid;
    right: 4px;
    top: 30px;
    border-radius: 3px;
    height: 108px;
    cursor: pointer;
    box-shadow: #ccc 2px 2px 2px;
}
.heatContainer .public .weightOption li {
	padding: 3px 7px;
}
.heatContainer .public .weightOption li:hover {
	color: #409EFF;
    background: #eee;
}
.heatContainer .public .weightOption i {
    position: absolute;
    right: -2px;
    bottom: -2px;
    font-size: 10px;
    color: #999;
}
</style>
