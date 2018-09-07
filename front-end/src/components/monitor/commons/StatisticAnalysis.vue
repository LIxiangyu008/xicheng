<template lang="html">
	<div class="statisticAnalyze">
		   <el-container style="border: 1px solid #0598EA;">
            <el-aside class="aside-style" style="width: 70px;">
                <el-menu
                    class="menu"
                    :default-active="'lineChart'">
                    <el-menu-item index="lineChart" title="折线统计图" @click="changeEvent($event)">
                        <i class="fa fa-line-chart"></i>
                    </el-menu-item>
                    <el-menu-item index="barChart" title="条形统计图" @click="changeEvent($event)">
                        <i class="fa fa-bar-chart"></i>
                    </el-menu-item>
                </el-menu>
                 <el-menu
                    class="menu">
                    <el-menu-item index="download"  title="下载" @click="changeEvent($event)">
                        <i class="fa fa-download" style="color: #5098EA"></i>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <div class="charts">
                    <div id="ChartDiv" class="chart-style"></div>
                </div>
            </el-main>
        </el-container>
	</div>	
</template>
<script>
    let initChart = null;
	export default {
        props: {
            dayData: [Array,Object]
        },
		data(){
			return{
                title:'',
                time:[],
                data:[],
                chartType:"lineChart"
			}
		},
        watch: {
            dayData:{
                handler(val,oldVal){
                    if(val.title){
                        this.title = val.title;
                        let datas = [],times = [];
                        val.data.filter(item =>{
                            let v = (val.title==="人流量"||val.title==="车流量")?item.sumVal:item.avgVal;
                            let t = item.time;
                            if( v ){
                                datas.push(Math.floor(v * 1000) / 1000);
                            }else{
                                datas.push(0);
                            }
                            times.push(t);
                        })
                        this.data = datas;
                        this.time = times;
                        this.initCharts();
                    }
                },
                deep:true
            }
        },
        mounted(){
            this.initCharts();
            this.initEvent();
        },
		methods:{
            initCharts(){
                initChart = this.$echarts.init(document.getElementById("ChartDiv"));
                initChart.setOption(this.setChartOptions(),true);
            },
            initEvent(){
                if(initChart){
/*                    initChart.on('click', function (params) {
                        console.log(params);
                        alert("弹出事件！");
                    });*/
                }
            },
            changeEvent(event){
                let type = event.index;
                if(type.indexOf("Chart") > -1){
                    this.chartType = type;
                    initChart.setOption(this.setChartOptions(),true);
                }else{
                    //download
                }
            },
            setChartOptions(){
                if(!this.chartType)return;
                switch(this.chartType){
                    case "barChart": return {
                                color: ['#3398DB'],
                                tooltip : {
                                    trigger: 'axis',
                                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                    }
                                },
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                },
                                xAxis : [
                                    {
                                        type : 'category',
                                        data : this.time,
                                        axisTick: {
                                            alignWithLabel: true
                                        }
                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value'
                                    }
                                ],
                                series : [
                                    {
                                        name:this.title,
                                        type:'bar',
                                        barWidth: '60%',
                                        data:this.data
                                    }
                                ]
                            };
                    case "lineChart": return{
                                title: {
                                    text: ''
                                },
                                tooltip: {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data:['']
                                },
                                grid: {
                                    left: '3%',
                                    right: '4%',
                                    bottom: '3%',
                                    containLabel: true
                                },
                                xAxis: {
                                    type: 'category',
                                    boundaryGap: false,
                                    data: this.time
                                },
                                yAxis: {
                                    type: 'value'
                                },
                                series: [
                                    {
                                        name:this.title,
                                        type:'line',
                                        stack: '总量',
                                        data:this.data
                                    }
                                ]
                            };
                }
                
            }
		}
	}
</script>
<style lang="scss" scoped>
    .statisticAnalyze {
        height: 100%;
        width: 100%;
        .charts {
            width:100%;
            height:100%;
            .chart-style {
                width: 920px;
                height: 240px;
                overflow: hidden;
            }
        }
        .aside-style {
            width: 70px;
            background: #FFFFFF;
           .menu {
                background: #FFFFFF;
                text-align: center;
                border-right: none !important;
                color: #d0d1d2;
            }
            .menu li.is-active, .menu li:hover {
                cursor: pointer !important;
                background: #FFFFFF;
            }
            .el-menu-item.is-active i, .el-menu-item:hover i {
                color: #5098EA !important;
            } 
        }
    
    }
   
</style>
