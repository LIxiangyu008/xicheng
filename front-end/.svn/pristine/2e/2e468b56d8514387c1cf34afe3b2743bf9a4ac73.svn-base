<template>
  <div id="poiData" class="poiData" v-show="isShow">
      <div class="search-title"><span>查询结果</span>
        <el-button icon="el-icon-close" @click=hideResult()></el-button>
      </div>
      <div class="OneItem">
          <div v-for="(item,index) in poiData" class="item" @mouseover="inMarker(index)" @mouseout="outMarker(index)" @click='setCurrentRow(item)'>
              <div class="resultTitleDiv textitem" >名称: {{item.Name}}</div>
          </div>
      </div>
  </div>
</template>

  <script>
  import {
    mapState,
    mapMutations,
    mapActions
  } from 'vuex'
    export default {
      data() {
        return {
          poiData:[],
          currentRow :null,
          isShow:false
        }
      },
      mounted() {
        EventBus.$on('query-poi', this.showList);
      },
      methods:{
        ...mapMutations([
          'changListShow',
        ]),
        showList(data){
          this.isShow = true;
          this.poiData = data;
        },
        setCurrentRow(val){
          EventBus.$emit('query-seleted', val);
        },
        inMarker(index){
          EventBus.$emit('query-inmarker', index);
        },
        outMarker(index){
          EventBus.$emit('query-outmarker', index);
        },
        hideResult(){
          this.changListShow(false);
          this.poiData = [];
        }
      }
    }
  </script>
  <style lang="scss" scope>
    .poiData{
      width:230px;
      .search-title{
        line-height: 35px;
        padding-left: 10px;
        color: #828282;
      }
      .el-button{
        float: right;
        border: none;
        height: 35px;
      }
      .item{
        padding-bottom: 5px;
        padding-top: 5px;
        cursor: pointer;
        padding-left: 10px;
        border-bottom: dashed 1px #9AC2FF;
        line-height: 2;
        .textitem{
          white-space: nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
      }
      .item:hover{
        background-color:#D3E1F9;
      }
    }
    .resultTitleDiv {
        font-size: 12px;
        font-family: 微软雅黑;
        font-weight: bold;
        color: rgb(7, 84, 154);
        height:20px;
    }
    .resultNameDiv {
        font-size: 12px;
        font-family: 微软雅黑;
        color: rgb(40, 40, 40);
        height:20px;
    }
    .OneItem{
        border-radius: 5px;
        max-width: 322px;
        border-bottom: dashed 1px #ccc;
    }
  </style>