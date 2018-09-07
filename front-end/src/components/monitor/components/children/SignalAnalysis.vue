<template lang="html">
  <div class="signalAnalysis">
    <div class="district">
      <el-popover placement="bottom" width="300" trigger="hover">
        <el-button slot="reference" style="background: #5098EA;color: #FFFFFF;">行政区划<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <div :style="qhDiv" id="qhDiv">
          <span :style="qhspan" v-for="(item,index) in district" :id="'_'+item.name" @mouseout="mouseOut($event,item)" @mouseover="mouseOver($event,item)" @click="selectDist(item)" :title="item.name">{{item.name}}</span>
        </div>
      </el-popover>
      <el-popover placement="bottom" width="300" trigger="hover">
        <el-button slot="reference" style="background: #5098EA;color: #FFFFFF;float: right;">重点区域<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <div :style="qhDiv" id="qhDiv">
          <span :style="qhspan" v-for="(item,index) in keyArea" :id="'_'+item.name" @mouseout="mouseOut($event,item)" @mouseover="mouseOver($event,item)" @click="selectDist(item)" :title="item.name">{{item.name}}</span>
        </div>
      </el-popover>
    </div>
    <div class="analysis">
      <div class="title">
        <span>{{currDist.name}}</span>
      </div>
      <div>
        <el-radio-group v-model="inform" size="mini" fill="#5098EA">
          <el-radio-button label="hour">时报</el-radio-button>
          <el-radio-button label="day">日报</el-radio-button>
          <el-radio-button label="week">周报</el-radio-button><!-- style="margin-left:15px;" -->
          <el-radio-button label="month">月报</el-radio-button>
          <el-radio-button label="year">年报</el-radio-button>
        </el-radio-group>
      </div>
      <div class="query">
        <el-date-picker style="width: 98%;" v-model="times" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" @change="timeChange" size="mini" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </div>
    </div>
  </div>
</template>
<script>
import { getSignalling } from "./../../../../apis/api"
import { mapMutations, mapState } from "vuex";
let params1 = {
  "size": 0,
  "query": {
    "bool": {
      "filter": [{
          "range": {
            "date": {
              "format": "yyyy-MM-dd HH:mm:ss",
              "gte": "2018-05-01 00:00:00",
              "lte": "2018-05-01 23:00:00"
            }
          }
        },
        {
          "match": {
            "area": "0861102"
          }
        }
      ]
    }
  },
  "aggs": {
    "ind": {
      "terms": {
        "field": "type.keyword"
      },
      "aggs": {
        "per_day": {
          "date_histogram": {
            "field": "date",
            "interval": "hour",
            "format": "yyyy-MM-dd HH:mm:ss"
          },
          "aggs": {
            "sum_value": {
              "sum": {
                "field": "sdTotal"
              }
            }
          }
        }
      }
    }
  }
};
let params2 = {
  "size": 0,
  "query": {
    "bool": {
      "filter": [{
          "range": {
            "date": {
              "format": "yyyy-MM-dd HH:mm:ss",
              "gte": "2018-05-01 00:00:00",
              "lte": "2018-05-01 23:00:00"
            }
          }
        },
        {
          "match": {
            "area": "0861102"
          }
        }
      ]
    }
  },
  "aggs": {
    "ind": {
      "terms": {
        "field": "type.keyword"
      },
      "aggs": {
        "sum_value": {
          "avg": {
            "field": "sdTotal"
          }
        }
      }
    }
  }
}

export default {
  data() {
    return {
      inform: 'hour',
      radio: '行政区划',
      keyArea: [
        { name: "人定湖公园", code: "086110231022" },
        { name: "什刹海地区  ", code: "086110231010" },
        { name: "动物园交通枢纽", code: "086110231009" },
        { name: "动物园批发市场", code: "086110231024" },
        { name: "北京北站地区", code: "086110231008" },
        { name: "国家信访局  ", code: "086110231020" },
        { name: "大栅栏（大监测范围）", code: "086110231018" },
        { name: "大栅栏（小监测范围）", code: "086110231019" },
        { name: "大观园", code: "086110231017" },
        { name: "天桥艺术中心", code: "086110231002" },
        { name: "宣武医院门口", code: "086110231025" },
        { name: "宣武门天主教堂", code: "086110231011" },
        { name: "广安门中医院门口", code: "086110231026" },
        { name: "德胜门箭楼及德胜门西大街", code: "086110231021" },
        { name: "报国寺门口及周边", code: "086110231027" },
        { name: "王府井大街", code: "086110231003" },
        { name: "白云观", code: "086110231015" },
        { name: "礼拜寺", code: "086110231030" },
        { name: "缸瓦市教堂", code: "086110231012" },
        { name: "菜市口", code: "086110231029" },
        { name: "菜百", code: "086110231028" },
        { name: "西什库教堂", code: "086110231013" },
        { name: "西单北区", code: "086110231004" },
        { name: "西单南区", code: "086110231005" },
        { name: "西直门教堂", code: "086110231014" },
        { name: "金融街北区", code: "086110231006" },
        { name: "金融街南区", code: "086110231007" },
        { name: "陶然亭公园", code: "086110231016" },
        { name: "马甸桥区域", code: "086110231023" },
        { name: "马连道茶叶街", code: "086110231001" },
        { name: "天桥重点区域", code: "086110231032" },
        { name: "南锣鼓巷", code: "086110231031" }
      ],
      district: [
        { name: "西城区", code: "0861102" },
        { name: "德胜", code: "086110240009" },
        { name: "什刹海", code: "086110240010" },
        { name: "西长安街", code: "086110240006" },
        { name: "大栅栏", code: "086110240008" },
        { name: "天桥", code: "086110240012" },
        { name: "新街口", code: "086110240013" },
        { name: "金融街", code: "086110240001" },
        { name: "椿树", code: "086110240007" },
        { name: "陶然亭", code: "086110240005" },
        { name: "展览路", code: "086110240014" },
        { name: "月坛", code: "086110240002" },
        { name: "广安门内", code: "086110240015" },
        { name: "牛街", code: "086110240011" },
        { name: "白纸坊", code: "086110240004" },
        { name: "广安门外", code: "086110240003" }
      ],
      currDist: { name: "西城区", code: "0861102" },
      times: ["2018-05-01 00:00:00","2018-05-01 23:00:00"],
      qhDiv: 'max-height: 450px; overflow: auto;padding: 5px;', //不支持class，用style
      qhspan: 'line-height: 26px; padding: 5px;cursor: pointer;width: 30%;float:left; overflow: hidden;text-overflow: ellipsis;white-space: nowrap;color: #555555;',
    }

  },
  watch: {
    inform(val,oldVal){
      let date = params1.aggs.ind.aggs.per_day.date_histogram;
      date.interval = val;
      this.queryData();
    }
  },
  mounted() {
    this.queryData();
  },
  methods: {
    ...mapMutations([
      "changeTelecomInfo",
      "changeUnicomInfo",
      "changeMobileInfo",
      "changeTimes",
      "changePieChartData",
      "changeTimeTitle",
      "changeDistTitle",
    ]),
    timeChange(times) {
      console.log(times);
      let date1 =  params1.query.bool.filter[0].range.date;
      date1.gte = times[0];
      date1.lte = times[1];
      let date2 = params2.query.bool.filter[0].range.date;
      date2.gte = times[0];
      date2.lte = times[1];
      let timeTitle = times[0]+"至"+times[1];
      this.changeTimeTitle(timeTitle);
      this.queryData();
    },
    async queryData() {
      let pieData = await getSignalling(params2);
      let sumData = pieData.data.aggregations.ind.buckets;
      if (sumData && sumData.length) {
        let alias = {"mobile":"移动","telecom":"电信","unicom":"联通"};
        let newData =  sumData.map(data =>{
          let obj = {};
          obj.name = alias[data.key];
          obj.value = Math.floor(data.sum_value.value);
          return obj;
        });
        this.changePieChartData(newData);
      } else {
        this.changePieChartData([]);
      }
      let data = await getSignalling(params1);
      let signalData = data.data.aggregations.ind.buckets;
      if (signalData && signalData.length) {
        for (let i = 0; i < signalData.length; i++) {
          if(i == 0){
            let timeArr = signalData[i].per_day.buckets.map(item =>{
                return item.key_as_string;
            })
            this.changeTimes(timeArr);
          }
          if (signalData[i].key == "mobile") {
            let mobile = {};
            mobile.title = "移动";
            mobile.data = signalData[i].per_day.buckets.map(item =>{
              return item.sum_value.value;
            });
            this.changeMobileInfo(mobile);
          } else if (signalData[i].key == "telecom") {
            let telecom = {};
            telecom.title = "电信";
            telecom.data = signalData[i].per_day.buckets.map(item =>{
              return item.sum_value.value;
            });
            this.changeTelecomInfo(telecom);
          } else {
            let unicom = {};
            unicom.title = "联通";
            unicom.data = signalData[i].per_day.buckets.map(item =>{
              return item.sum_value.value;
            });
            this.changeUnicomInfo(unicom);
          }
        }
      }else{
        this.changeTimes([]);
        this.changeUnicomInfo(null);
        this.changeTelecomInfo(null);
        this.changeMobileInfo(null);
        this.changePieChartData([]);
      }
    },
    selectDist(item) {
      document.getElementsByClassName("el-popover")[0].style.display = "none";
      document.getElementsByClassName("el-popover")[1].style.display = "none";
      this.currDist = item;
      this.changeDistTitle(item.name);
      let match2 = params2.query.bool.filter[1].match;
      match2.area = item.code;
      let match1 = params1.query.bool.filter[1].match;
      match1.area = item.code;
      this.queryData();
    },
    mouseOver(e, item) {
      document.getElementById("_" + item.name).style.color = "#5098EA";
    },
    mouseOut(e, item) {
      document.getElementById("_" + item.name).style.color = "#555555";
    }
  }
}

</script>
<style lang="scss">
.el-radio-button--mini .el-radio-button__inner {
    padding: 7px 14px !important;
    font-size: 12px;
    border-radius: 0;
}
.signalAnalysis {
  height: 100%;
  width: 100%;
  font-size: 14px;
  font-family: "SimHei,微软雅黑";
  .district {
    margin-bottom: 20px;
  }
  .select-distict {
    height: 30px;
    background: #5098EA;
    line-height: 30px;
    margin: 10px 0px 15px 0px;
    text-align: center;
    .font-style {
      color: #FFFFFF;
    }
  }
  .analysis {
    .title {
      font-size: 18px;
      margin-bottom: 10px;
      color: #999999;
    }
  }
  .query {
    margin-top: 10px;
    height: 50px;
    width: 100%;
    background: #5098EA;
    line-height: 50px;
    text-align: center;
    .el-date-editor .el-range-separator {
      padding: 0 5px;
      line-height: 20px !important;
      width: 9% !important;
      color: #303133;
    }
  }
}

</style>
