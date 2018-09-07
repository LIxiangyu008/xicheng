<template>
	<section>
		<el-form ref="viewModel" :model="viewModel" id="elFrom">
			<el-form-item>
				<span class="demonstration">速率</span>
				<el-slider v-model="viewModel.rate"></el-slider>
			</el-form-item>
			<el-form-item>
				<el-button @click="getFire">火焰</el-button>
			</el-form-item>
		</el-form>
	</section>
</template>
<script type="text/javascript">

	let start,stop,entityPosition,entityOrientation,rotationMatrix,modelMatrix,hpr,trs,
		circularPosition,staticPosition,emitterModelMatrix,translation,rotation;
	let scene,sgPointHandler,entity,particleSystem,gravityScratch ;
	

	export default {
		data() {
			return{
				viewModel : {
				    rate : 5,
				    gravity : 0,
				    minimumLife : 1,
				    maximumLife : 1,
				    minimumSpeed : 5,
				    maximumSpeed : 5,
				    startScale : 1,
				    endScale : 4,
				    particleSize : 20,
				    transX : 2,
				    transY : 4,
				    transZ : 1,
				    heading : 0,
				    pitch : 0,
				    roll : 0,
				    fly : false,
				    spin : false,
				    show : true
				},
			}
		},
		mounted() {
			EventBus.$on('thAnalysis', this.init);
		},
		destroyed() {
			EventBus.$off('thAnalysis', this.init);
		},
		methods: {
			init(tab) {
				scene = Viewer.scene;
				Cesium.Math.setRandomNumberSeed(5);

				start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
				stop = Cesium.JulianDate.addSeconds(start, 360, new Cesium.JulianDate());
				sgPointHandler = new Cesium.PointHandler(Viewer);

				Viewer.clock.startTime = start.clone();
				Viewer.clock.stopTime = stop.clone();
				Viewer.clock.currentTime = start.clone();
				Viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
				Viewer.clock.multiplier = 1;

				Cesium.knockout.track(this.viewModel);
				let elFrom = document.getElementById('elFrom');
				Cesium.knockout.applyBindings(this.viewModel,elFrom);

				entityPosition = new Cesium.Cartesian3();
				entityOrientation = new Cesium.Quaternion();
				rotationMatrix = new Cesium.Matrix3();
				modelMatrix = new Cesium.Matrix4();

				emitterModelMatrix = new Cesium.Matrix4();
				translation = new Cesium.Cartesian3();
				rotation = new Cesium.Quaternion();
				hpr = new Cesium.HeadingPitchRoll();
				trs = new Cesium.TranslationRotationScale();

				let that = this;
				sgPointHandler.drawCompletedEvent.addEventListener((point) => {
					let position = point.position._value;
					let cartographic = Cesium.Cartographic.fromCartesian(position);
		            let longitude = Cesium.Math.toDegrees(cartographic.longitude);
		            let latitude = Cesium.Math.toDegrees(cartographic.latitude);
		            let height = cartographic.height;
					circularPosition = that.computeCirclularFlight(longitude, latitude, height);
					staticPosition = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
				});

				entity = Viewer.entities.add({

				    //Set the entity availability to the same interval as the simulation time.
				    availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
				        start : start,
				        stop : stop
				    })]),

				    //Load the Cesium plane model to represent the entity
				    model : {
				        uri : "./../../../../static/data/bus.json",
				        minimumPixelSize : 64
				    },

				    position : staticPosition
				});
				Viewer.trackedEntity = entity;

				gravityScratch = new Cesium.Cartesian3();
				particleSystem = scene.primitives.add(new Cesium.ParticleSystem({
				    image : './../../../assets/fire1.png',

				    startColor : Cesium.Color.RED.withAlpha(0.7),
				    endColor : Cesium.Color.YELLOW.withAlpha(0.3),

				    startScale : that.viewModel.startScale,
				    endScale : that.viewModel.endScale,

				    minimumLife : that.viewModel.minimumLife,
				    maximumLife : that.viewModel.maximumLife,

				    minimumSpeed : that.viewModel.minimumSpeed,
				    maximumSpeed : that.viewModel.maximumSpeed,

				    minimumWidth : that.viewModel.particleSize,
				    minimumHeight : that.viewModel.particleSize,

				    maximumWidth : that.viewModel.particleSize,
				    maximumHeight : that.viewModel.particleSize,

				    // Particles per second.
				    rate : that.viewModel.rate,

				    bursts : [
				        new Cesium.ParticleBurst({time : 5.0, minimum : 300, maximum : 500}),
				        new Cesium.ParticleBurst({time : 10.0, minimum : 50, maximum : 100}),
				        new Cesium.ParticleBurst({time : 15.0, minimum : 200, maximum : 300})
				    ],

				    lifeTime : 16.0,

				    emitter : new Cesium.CircleEmitter(0.5),

				    emitterModelMatrix : that.computeEmitterModelMatrix(),

				    //forces : [applyGravity]
				}));

				Viewer.scene.preRender.addEventListener(function(scene, time) {
				    particleSystem.modelMatrix = that.computeModelMatrix(entity,time);

				    // Account for any changes to the emitter model matrix.
				    particleSystem.emitterModelMatrix = that.computeEmitterModelMatrix();

				    // Spin the emitter if enabled.
				    if (that.viewModel.spin) {
				        that.viewModel.heading += 1.0;
				        that.viewModel.pitch += 1.0;
				        that.viewModel.roll += 1.0;
				    }
				});

				Cesium.knockout.getObservable(that.viewModel, 'rate').subscribe(
				    function(newValue) {
				        particleSystem.rate = parseFloat(newValue);
				    }
				);
			},
			computeModelMatrix(time) {
				let position = Cesium.Property.getValueOrUndefined(staticPosition, time, entityPosition);
			    if (!Cesium.defined(position)) {
			        return undefined;
			    }
			    modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, modelMatrix);
			    return modelMatrix;

			    /*let position = Cesium.Property.getValueOrUndefined(staticPosition, time, entityPosition);
			    if (!Cesium.defined(position)) {
			        return undefined;
			    }
			    let orientation = Cesium.Property.getValueOrUndefined(entity.orientation, time, entityOrientation);
			    if (!Cesium.defined(orientation)) {
			        modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position, undefined, modelMatrix);
			    } else {
			        modelMatrix = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation, rotationMatrix), position, modelMatrix);
			    }
			    return modelMatrix;*/
			},
			computeEmitterModelMatrix() {
			    /*hpr = Cesium.HeadingPitchRoll.fromDegrees(this.viewModel.heading, this.viewModel.pitch, this.viewModel.roll, hpr);

			    trs.translation = Cesium.Cartesian3.fromElements(this.viewModel.transX, this.viewModel.transY, this.viewModel.transZ, entityPosition);
			    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, entityOrientation);

			    return Cesium.Matrix4.fromTranslationRotationScale(trs, modelMatrix);*/

			    hpr = Cesium.HeadingPitchRoll.fromDegrees(this.viewModel.heading, this.viewModel.pitch, this.viewModel.roll, hpr);

			    trs.translation = Cesium.Cartesian3.fromElements(this.viewModel.transX, this.viewModel.transY, this.viewModel.transZ, translation);
			    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);

			    return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
			},
			computeCirclularFlight(lon, lat, radius) {
			    var property = new Cesium.SampledPositionProperty();
			    for (var i = 0; i <= 360; i += 45) {
			        var radians = Cesium.Math.toRadians(i);
			        var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
			        var position = Cesium.Cartesian3.fromDegrees(lon + (radius * 1.5 * Math.cos(radians)), lat + (radius * Math.sin(radians)), Cesium.Math.nextRandomNumber() * 500 + 1750);
			        property.addSample(time, position);
			    }
			    return property;
			},
			applyGravity(p, dt) {
			    // We need to compute a local up vector for each particle in geocentric space.
			    let position = p.position;

			    Cesium.Cartesian3.normalize(position, gravityScratch);
			    Cesium.Cartesian3.multiplyByScalar(gravityScratch, this.viewModel.gravity * dt, gravityScratch);

			    p.velocity = Cesium.Cartesian3.add(p.velocity, gravityScratch, p.velocity);
			},
			getFire() {
				if(sgPointHandler.active) {
	                return;
	            }	            
	            sgPointHandler.activate();
			},
		}
	}
</script>
<style lang="scss" scoped>
	
</style>