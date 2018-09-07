<template>
  <div class="scene-form">
    <!-- <el-dialog title="新增场景" @close="hideDialog"> -->
      <el-form label-width="80px">
        <el-form-item label="场景名称" required>
          <el-input v-model="registerData.name"></el-input>
        </el-form-item>
        <el-form-item label="场景序号" required>
          <el-input v-model="registerData.index"></el-input>
        </el-form-item>
        <el-form-item label="场景地址" required>
          <el-input v-model="registerData.realspaceurl"></el-input>
        </el-form-item>
        <el-form-item label="地名地址服务">
          <el-input v-model="registerData.addressMatchingUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  import {
    apiAddBaseMap,
    apiBaseMap,
    updateBaseMap
  } from '@/apis/api'
  import {
    serviceMgr
  } from './../map/serviceMeta.js';
  import {
    getScenesInfo
  } from '@/components/common/sceneUtil'

  let Analysis = APPCONFIG.Analysis
  
  export default {
    props: {
      type:{
        type: Number,
        default:1
      }
    },
    computed: {
      ...mapState({
        baseMapLayersGroup: state => state.map.baseMapLayersGroup,
        registerParam: function(state){
          let data = JSON.parse(JSON.stringify(state.map.curMap))
          //regisiterData默认初始值
          this.registerData = data;
          if(this.type == 1){
            this.registerData.index = this.baseMapLayersGroup.length + 1;
          }
          return data
        }
      }),
    },
    watch: {
      baseMapLayersGroup() {
        //this.registerData.index = this.baseMapLayersGroup.length + 1;
      },
      registerParam:{
        handler(val, oldVal) {
        }
      }
    },
    methods: {
      ...mapMutations([
        'addBaseMapLayersGroup'
      ]),
      hideDialog () {
        this.$emit('hideSceneForm','');
        /*this.registerData = {
          name:"",
          index:"",
          mapType:1,
          status:1,
          desc:"",
          realspaceName:"",
          realspaceurl:"",
          layers:[
            {
              name:""
            }
          ],
          userId:"41",
          networkUrl:"",
          addressMatchingUrl:""
        }*/
      },
      async submit () {
        this.registerData.index = +this.registerData.index;
        delete this.registerData.isShow;
        delete this.registerData.type;
        delete this.registerData.url;
        const res = await getScenesInfo(this.registerData.realspaceurl);
        if (!res || !res.data) {
          this.$message.error('无效的场景地址，请检查！');
          return;
        }
        this.registerData.desc = res.data.sceneType;
        let data = null;
        if(this.type == 1){
          data = await apiAddBaseMap(this.registerData);
        } else if(this.type == 2) {
          data = await updateBaseMap(this.registerData);
        }
        if(data.data.resultInfo.success){
          this.$message({
            message: '保存成功！',
            type: 'success'
          });
        } else {
          this.$message.error('保存失败！');
        }
        this.hideDialog();
        this.initBaseMap();
      },
      async initBaseMap() {
        const {
          resultInfo
        } = await apiBaseMap();
        let items = resultInfo.data.items;
        let datas = [];
        for (let i = 0; i < items.length; i++) {
          if (items[i].mapType == 0) {
            if (items[i].versions.length > 0) {
              datas = items[i].versions.map((version) => {
                let layer = items[i].layers.filter((layer) => {
                  return layer.version == version
                })
                return {
                  version,
                  layer
                }
              })
              items[i].verLayers = datas;
              items[i].type="map";
            }
          }else {
            items[i].type="scene";
            items[i].imgUrl="img/mapshow/yingxiang_1.png";
            items[i].url=items[i].realspaceurl;
            items[i].isShow=true;
          }
        }
        if (!items || !items.length) {
          this.$message.error('暂未配置底图，请联系管理员配置')
          return;
        }
        this.addBaseMapLayersGroup(items);
      }
    },
    data () {
        return {
          registerData: null
        }
    }
  }
</script>

<style lang="scss">
  .scene-form {
    .el-dialog {
      width: 667px;
    }
    .el-form-item__label {
      width: 100px !important;
    }
    .el-input {
      width: 500px;
    }
  }
</style>
