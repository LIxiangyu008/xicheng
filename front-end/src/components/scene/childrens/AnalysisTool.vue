<template>
    <section class="analysisTools">
    <button class="el-dialog__headerbtn setting-btn" @click="analysisClose">
      <i class="el-dialog__close el-icon el-icon-close"></i>
    </button>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="可视域分析" >
          <span slot="label" title="可视域分析"><i class="fa fa-eye"></i></span>
          <viewshed3d></viewshed3d>
        </el-tab-pane>
        <el-tab-pane name="阴影分析">
          <span slot="label" title="阴影分析"><i class="fa fa-industry"></i></span>
          <shadows></shadows>
        </el-tab-pane>
        <el-tab-pane name="通视分析">
          <span slot="label" title="通视分析"><i class="fa fa-cubes"></i></span>
          <sight-line></sight-line>
        </el-tab-pane>
        <el-tab-pane name="天际线分析">
          <span slot="label" title="天际线分析"><i class="fa fa-signal"></i></span>
          <sky-line></sky-line>
        </el-tab-pane>
        <!-- <el-tab-pane name="三维特效">
          <span slot="label" title="三维特效"><i class="el-icon-date"></i></span>
          <particle-analysis></particle-analysis>
        </el-tab-pane> -->
        <el-tab-pane name="控高分析">
          <span slot="label" title="控高分析"><i class="fa fa-minus-square-o"></i></span>
          <height-control></height-control>
        </el-tab-pane>
        <el-tab-pane name="三维挖方">
          <span slot="label" title="三维挖方"><i class="fa fa-wrench"></i></span>
          <excavation></excavation>
        </el-tab-pane>
      </el-tabs>
    </section>

</template>

<script>
    import viewshed3d from './../analysisTools/Viewshed3D.vue';
    import shadows from './../analysisTools/Shadows.vue';
    import skyLine from './../analysisTools/SkyLine.vue';
    import SightLine from './../analysisTools/SightLine';
    import HeightControl from './../analysisTools/HeightControl.vue'
    import Excavation from './../analysisTools/Excavation'
    export default {
        components:{
            viewshed3d,shadows,skyLine,SightLine,HeightControl,Excavation
        },
        mounted() {
        },
        destroyed() {
        },
        data() {
            return {
                activeName:'可视域分析',
            }
        },
        methods: {
            init( ) {
            },
            handleClick(tab, event) {
                EventBus.$emit('clearAll',true);
                if(tab.name === '阴影分析') {
                    EventBus.$emit('shadows', tab.name);
                };
                if(tab.name === '天际线分析') {
                    EventBus.$emit('skyLine', tab.name);
                };
                if(tab.name === '通视分析') {name
                    EventBus.$emit('sightLine', tab.name);
                };
                if(tab.name === '三维挖方') {
                    EventBus.$emit('excavation', tab.name);
                };
            },
            analysisClose() {
                EventBus.$emit('clearAll',true);
                this.$emit('analysis-close');
            }
        }
    }
</script>

<style lang="scss" scoped>
    .setting-btn {
      top: 5px;
      right: 5px;
      z-index: 999999;

      i {
        font-size: 20px;
        color: rgb(175, 179, 187);

        &:hover {
          color: #fff;
        }
      }
    }

    .analysisTools {
        position: absolute;
        right: 10px;
        top: 70px;
        //margin-top: 30px;
        cursor: auto;
        min-width: 320px;
        max-width: 350px;
        //border: 1px solid #526f82;
        border-radius: 5px;
        border: none;
        //color: #ffffff;
        font-size: 10pt;
        padding: 1em;
        background-color: #F5F7FA;
    }

    .elTabs {
        margin-top:10px;
    }
</style>
<style type="text/css">
    .analysisTools .el-tabs__nav-scroll .el-tabs__item{
        /*color: #ffffff !important;*/
        padding: 0px 10px !important;
    }

    .analysisTools .el-tabs__nav-scroll .el-tabs__item i{
        font-size: 20px;
    }

    .analysisTools .el-tabs .el-tabs__header .el-tabs__nav-wrap::after {
        background-color: #6a6f77 !important;
    }
    .analysisTools .el-tabs__nav-scroll .el-tabs__item.is-active {
        color: #E38D0C !important;
    }

    .analysisTools .el-tabs__nav-scroll .el-tabs__active-bar {
        background-color: #ffffff;
    }

    .analysisTools .el-tabs__nav-scroll .el-tabs__item:hover {
        color: #E38D0C !important;
    }

</style>
