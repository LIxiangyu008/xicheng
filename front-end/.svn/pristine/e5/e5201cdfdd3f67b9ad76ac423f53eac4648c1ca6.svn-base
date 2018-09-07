<template>
	<section>
		<div id="timerlineBtns">
			<div class="timerline-btns clearfix" title="向前">
		      <div id="timerbtn-pre">
		      	<img :src="baseButtonUrl + 'pre.png'" @click="prevStep()">
		      	<!-- <el-button class="fa fa-step-backward" circle @click="prevStep()"></el-button> -->
		      </div>
		      <template v-if="play">
		      	<div id="timerbtn-play" title="播放">
		      		<img :src="baseButtonUrl + 'play.png'" @click="palyChange('play')">
			      	<!-- <el-button class="fa fa-play" circle @click="palyChange('play')" ></el-button> -->
			      </div>
		      </template>
		      <template v-else>
		      	<div id="timerbtn-play" title="暂停">
		      		<img :src="baseButtonUrl + 'stop.png'" @click="palyChange('stop')">
			      	<!-- <el-button class="fa fa-stop" circle @click="palyChange('stop')"></el-button> -->
			    </div>
		      </template>
		      <div id="timerbtn-next" title="向后">
		      	<img :src="baseButtonUrl + 'next.png'" @click="nextStep()">
		      	<!-- <el-button class="fa fa-step-forward" circle @click="nextStep()"></el-button> -->
		      </div>
		    </div>
		</div>
		<div id="timerline">
			<div class="process_container">
		      <div id="process_bar" style="width:40px;"></div>
		    </div>
		    <ul id="dates" class="timerlineul dates1 clearfix">
		      <li v-for="(item,index) in versionList" :index="index" :value="item.title" @click="timerPlay()">
		      	<span>{{item.title}}</span>
		      </li>
		    </ul>
		</div>
		
	</section>
</template>
<script type="text/javascript">
	let URL = APPCONFIG.imgUrl;
	export default {
		props: {
			versionList: {
				types: Array
			}
		},
		data () {
			return {
				index_process:0,
	    		Interval_process:null,
	    		play: true,
	    		timer: null,
	    		buttonUrl: URL + 'marker/',
	    		//buttonUrl: '/static/img/marker/',
	    		baseButtonUrl: URL,
			}
		},
		methods: {
			timerPlay() {
				let that = this;
				var target = event.target || event.srcElement;
				for(var i=0;i<that.versionList.length;i++){
					if(target.innerText==that.versionList[i].title){	
						that.index_process=i;
						that.$emit('layerAdd',that.index_process);
						that.Setprocess(i,false);
						return ;
					}
				}
			},
			Setprocess(index,isInterval) {
				let that = this;
				var datesDiv = document.getElementById("dates");
				var processDiv = document.getElementById('process_bar');
				if(index==null){
					processDiv.style.width =parseInt(processDiv.style.width)+datesDiv.getElementsByTagName('li')[0].scrollWidth+'px';
				}else{
					processDiv.style.width =(datesDiv.getElementsByTagName('li')[0].scrollWidth)*parseInt(index+1)+'px';
				}
			},
			prevStep() {
				if(this.index_process==0) {
					this.Setprocess(this.index_process+this.versionList.length-1,false);
					this.index_process=this.versionList.length-1;
					this.$emit('layerAdd',this.index_process);
				}else {
					this.Setprocess(this.index_process-1,false);
					this.index_process=this.index_process-1;
					this.$emit('layerAdd',this.index_process);
				}
			},
			nextStep() {
				if(this.index_process==this.versionList.length-1) {
					this.index_process=0;
					this.Setprocess(this.index_process,false);	
					this.$emit('layerAdd',this.index_process);
				}else {
					this.Setprocess(this.index_process+1,false);
					this.index_process=this.index_process+1;
					this.$emit('layerAdd',this.index_process);
				}
			},
			palyChange(type) {
				let that = this;
				if(type == 'play') {
					this.timer=setInterval(function(){  
				      	that.nextStep();    
				   	},3000);
				   	that.play = false;
				}else {
					clearInterval(this.timer);
					that.play = true;
				}
			}
		}
	}
</script>

<style type="text/css">
	.timerline-btns {
	    width: 150px;
	    margin: 0 auto;
	    top: 18px;
	    text-align: center;
	    margin-bottom: 10px;
	}
	.clearfix:after {
	    visibility: hidden;
	    display: block;
	    font-size: 0;
	    content: " ";
	    clear: both;
	    height: 0;
	}
	.timerline-btns>div {
	    width: 33.33%;
	    float: left;
	    font-size: 30px;
	    color: #FFCC99;
	    transition: all .5s;
	    cursor: pointer;
	}
	#timerline {
	    margin: 0 auto;
	    border: 1px solid #FFCC99;
	    border-radius: 30px;
	    overflow: hidden;
	    position: relative;
	    background: #f5f5f5;
	}
	#timerline ul {
	    list-style-type: none;
	}
	.dates1 {
	    width: 100%;
	    padding-left: 0;
	    margin: 0;
	    transition: all 1s;
	    position: relative;
	}
	.timerlineul {
	    height: 100%;
	}
	#timerline li {
	    float: left;
	}
	.dates1 li:hover {
	    cursor: pointer;
	}
	.dates1 li {
	    width: 30px;
	    padding: 5px;
	    -webkit-box-sizing: border-box;
	    box-sizing: border-box;
	    text-align: center;
	}
	#process_bar {
	    opacity: 1;
	    background: #6398fe;
	    float: left;
	    height: 100%;
	    text-align: center;
	    line-height: 150%;
	    border-radius: 50px;
	    transition: all 1.5s;
	}

	.process_container {
	    box-sizing: border-box;
	    position: absolute;
	    top: 0px;
	    width: 100%;
	    height: 100%;
	    border-radius: 50px;
	}
</style>