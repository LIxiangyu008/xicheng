<template>
  <el-collapse-transition>
    <section class="box-panel multi-screen-cfg" v-show="visible">
      <div class="control-title">分屏模式</div>
      <ul class="clearfix control-content">
        <li v-for="index in 6" :key="index" class="control-img" @click="linkToMulti(index)">
          <img :src="'static/img/multi-screen/screen-' + index + '.png'">
        </li>
      </ul> 
      <div class="close-btn" @click="close(false)">
        <i class="el-icon-close"></i>
      </div>
    </section>
  </el-collapse-transition>
</template>

<script>
  import {
    mapState,
  } from 'vuex'

  export default {
    data() {
      return {
      }
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
    },
    computed: {
      ...mapState({
        specialLayers: state => state.map.specialLayers,
      })
    },
    methods: {
      linkToMulti(index) {
        if (!this.specialLayers || !this.specialLayers.length) {
          this.$message.warning('请选择至少一副专题图');
          return;
        }
        //触发设置多屏基本参数
        EventBus.$emit('toolbar-multiscreen', index);

        this.$router.push({path: 'multiScreen', query: { fromMap: true}})
      },
      close(flag) {
        this.$emit('update:visible', flag)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .multi-screen-cfg {
    position: absolute;
    top: 50px;
    right: 0px;
    width: 300px;
    
    .control-title {
      position: relative;
      line-height: 30px;
      margin-left: 5px;
      font-size: 15px;
    }
    
    .control-content {
      padding-top: 10px;
    }

    li {
      border-radius: 5px;

      &:hover {
        background: #7a8396;
        cursor: pointer;
      }

      &.control-img {
        float: left;
        width: 90px;
        height: 55px;
        padding: 5px 10px;

        img {
          width: 100%;
          height: auto;
        }
      }
    }
    

  }
</style>