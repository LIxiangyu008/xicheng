<template>
<section class="house-detail">
  <div class="room-div">
    <ul class="ceng-div">
      <li v-for="(value, key) in data" class="cengindex">
        F{{value.factLayerNum}}
      </li>
    </ul>
    <ul class="rooms">
      <li v-for="(value, key) in data" class="cengList">
        <ul class="cengroom">
          <li v-for="room in value.bList" class="roomList">
            <div v-if="room.useClass=='住宅'" class="roomImg">
              <img src="static/img/housedetail/1.png">

              </div>
            <div v-else-if="room.useClass=='公寓'" class="roomImg">
              <img src="static/img/housedetail/2.png">

              </div>
            <div v-else-if="room.useClass=='别墅'" class="roomImg">
              <img src="static/img/housedetail/3.png">

              </div>
            <div v-else-if="room.useClass=='非住宅-商业'" class="roomImg">
              <img src="static/img/housedetail/4.png">

              </div>
            <div v-else-if="room.useClass=='非住宅-工业'" class="roomImg">
              <img src="static/img/housedetail/5.png">

              </div>
            <div v-else-if="room.useClass=='非住宅-办公'" class="roomImg">
              <img src="static/img/housedetail/6.png">

              </div>
            <div v-else-if="room.useClass=='非住宅-车库'" class="roomImg">
              <img src="static/img/housedetail/7.png">

              </div>
            <div v-else-if="room.useClass=='非住宅-人防'" class="roomImg">
              <img src="static/img/housedetail/8.png">

              </div>
            <div v-else-if="room.useClass=='非住宅-教育文卫'" class="roomImg">
              <img src="static/img/housedetail/9.png">

              </div>
            <div v-else-if="room.useClass=='非住宅-综合'" class="roomImg">
              <img src="static/img/housedetail/10.png">

              </div>
            <div v-else-if="room.useClass=='其他'" class="roomImg">
              <img src="static/img/housedetail/11.png">

              </div>
            <div v-else-if="room.useClass==null" class="roomImg">
              <img src="static/img/housedetail/11.png">

              </div>
            <div class="roomDetail">{{room.roomNum}}<br/>{{room.areaTotal}}m<sup>2</sup> </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="legend">
    <li class="title">图例</li>
    <li><img src="static/img/housedetail/1.png"><br/>住宅</li>
    <li><img src="static/img/housedetail/2.png"><br/>公寓</li>
    <li><img src="static/img/housedetail/3.png"><br/>别墅</li>
    <li><img src="static/img/housedetail/4.png"><br/>非住宅-商业</li>
    <li><img src="static/img/housedetail/5.png"><br/>非住宅-工业</li>
    <li><img src="static/img/housedetail/6.png"><br/>非住宅-办公</li>
    <li><img src="static/img/housedetail/7.png"><br/>非住宅-车库</li>
    <li><img src="static/img/housedetail/8.png"><br/>非住宅-人防</li>
    <li><img src="static/img/housedetail/9.png"><br/>非住宅-教育文卫</li>
    <li><img src="static/img/housedetail/10.png"><br/>非住宅-综合</li>
    <li><img src="static/img/housedetail/11.png"><br/>其他</li>
  </div>
</section>
</template>

<script>
import {
  apiServiceBuildingUrl
} from './../../apis/api'
export default {

  data() {
    return {
      buildingNo: "",
      data: []
    }
  },
  mounted() {
    let that = this
    let buildingNo = that.buildingData['PFHOUSEID'];
    apiServiceBuildingUrl(buildingNo).then((res) => {
      if (res.data) {
        that.data = res.data.resultInfo.data.reverse();
        //针对平房重新排序
        if (that.buildingData['HOUSECLASS'] == '平房') {
          that.data[0].bList = that.data[0].bList.sort(that.sortId)
        }
        that.$forceUpdate();
      }
    })

  },
  props: {
    buildingData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {

  },
  methods: {
    sortId(a, b) {
      return a.roomNum-b.roomNum
    }
  }
}
</script>

<style lang="scss">
.el-dialog__body {
    margin: 0 20px;
    // border-top: #b3b3b3 1px solid;
    padding: 10px 0 !important;
}
.ceng-div {
    float: left;
    display: inline-block;
    border-right: #cccccc 1px solid;
    text-align: center;
}
.cengindex {
    width: 50px;
    font-size: 16px;
    height: 70px;
    line-height: 60px;
}
.housedetail {
    height: 600px;
    overflow: auto;
}
.legend,
.room-div {
    display: inline-block;
}
.room-div {
    width: 1000px;
    height: 610px;
    overflow: auto;
}
.rooms {
    width: 910px;
    display: inline-block;
    padding-left: 10px;
}
.legend {
    width: 100px;
    float: right;
    background: #e6e6e6ab;
    margin-right: 14px;
    text-align: center;
    padding: 20px 10px;
    height: 610px;
}
.legend .title {
    padding: 0 0 8px;
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    border-bottom: 1px gray solid;
    margin: 0 0 5px;
}
.legend img {
    width: 30px;
    margin-top: 5px;
}

.cengroom {
    display: inline-block;
    white-space: nowrap;
}
.roomList {
    position: relative;
    display: inline-block;
    text-align: center;
    width: 80px;
    height: 70px;
}
.roomImg {
    position: absolute;
    left: 5px;
}
.roomList img {
    height: 60px;
    width: 70px;
}
.roomDetail {
    position: relative;
    bottom: 2px;
    font-size: 12px;
    color: white;
    line-height: 28px;
    margin: 0 auto;
}
</style>
