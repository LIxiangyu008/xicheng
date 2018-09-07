<template>
  <div class="map-list">
    <el-button-group>
      <el-button type="primary" @click="showMapForm" icon="el-icon-plus">添加地图</el-button>
      <el-button type="primary" @click="showSceneForm" icon="el-icon-plus">添加场景</el-button>
    </el-button-group>

    <el-table
      :data="baseMapLayersGroup.slice((curPage-1)*10,curPage*10)"
      border
      style="width: 100%;margin: 20px auto 50px;">
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="地图名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        label="地图类型"
        align="center">
      </el-table-column>
      <el-table-column
        prop="layers.length"
        label="图层个数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="index"
        label="排序"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150">
        <template slot-scope="scope">
          <el-button size="small" @click.native.prevent="editBaseMap(scope.$index,scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click.native.prevent="deleteBaseMap(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="width: 400px;margin: 0 auto;"
      @current-change="curPageChange"
      @prev-click="prevPageChange"
      @next-click="nextPageChange"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="baseMapLayersGroup.length">
    </el-pagination>
    <el-dialog  :visible.sync="isShowMapForm" width="1000px">
      <map-register @hideMapForm="hideMapForm" :type="type"></map-register>
    </el-dialog>
    <el-dialog  :visible.sync="isShowSceneForm" width="650px">
      <scene-register  @hideSceneForm="hideSceneForm" :type="type"></scene-register>
    </el-dialog>
  </div>
</template>

<script>

  import {
    mapState,
    mapMutations
  } from 'vuex'
  import MapRegister from './MapRegister'
  import SceneRegister from './SceneRegister'
  import {
    apiBaseMap,
    apiDeleteBaseMap
  } from '@/apis/api'

  let Analysis = APPCONFIG.Analysis
  export default {
    components: {
      MapRegister,
      SceneRegister
    },
    computed: {
      ...mapState({
        baseMapLayersGroup: state => state.map.baseMapLayersGroup,
        curMap: state => state.map.curMap
      }),
    },
    mounted () {
      this.initBaseMap();
    },
    methods: {
      ...mapMutations([
        'addBaseMapLayersGroup',
        'changeManageMap'
      ]),
      curPageChange (val) {
          this.curPage = val;
      },
      prevPageChange () {
          this.curPage--;
      },
      nextPageChange () {
          this.curPage++;
      },
      showMapForm () {
        this.type = 1;
        this.isShowMapForm = true;
        this.changeManageMap(this.dRegisterParam);
      },
      hideMapForm () {
        this.isShowMapForm = false;
      },
      showSceneForm () {
        this.type = 1;
        this.isShowSceneForm = true;
        this.changeManageMap(this.SceneParam);
      },
      hideSceneForm () {
        this.isShowSceneForm = false;
      },
      editBaseMap(index,data){
        if(data.type == "map"){
          this.type = 2
          this.isShowMapForm = true;
          this.changeManageMap(JSON.parse(JSON.stringify(data)));
        } else {
          this.type = 2
          this.isShowSceneForm = true;
          this.changeManageMap(JSON.parse(JSON.stringify(data)));
        }
      },
      deleteBaseMap (index,map) {
        this.$confirm("是否确定删除？删除后不可恢复。", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () => {
          let data = await apiDeleteBaseMap(map.pkid);
          if(data.data.resultInfo.success){
            this.$message({
              message: '删除成功！',
              type: 'success'
            });
          } else {
            this.$message.error('删除失败！');
          }
          this.initBaseMap();
        }).catch(() => {
        });
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
            curPage: 1,
            isShowMapForm: false,
            isShowSceneForm: false,
            registerParam:{},
            type:1,
            SceneParam:{
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
            },
            dRegisterParam: {
              name: '',
              index: '',
              imgUrl: 'img/mapshow/shiliang_1.png',
              networkUrl: '',
              addressMatchingUrl: '',
              mapType: 0,
              status: 1,
              openHistory: true,
              versions: [],
              layers: [],
              userId: '41',
              centerX: '',
              centerY: '',
              bbox: [],
              projection: '',
              initLevel: ''
          }
        }
    }
  }
</script>

<style lang="scss">
  .map-list {
      width: 95%;
      margin: 50px auto;
      .el-table th {
        background: #EFF1F7;
        color: #000000;
      }
      .dialog-footer{
        text-align: center
      }
  }

</style>
