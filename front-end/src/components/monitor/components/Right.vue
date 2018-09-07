<template lang="html">
  <div class="monitor-right">
    <div class="charts">
      <div class="charts-div3">
        <div id="thildchart" :style="{width:'100%',height:'370px'}"></div>
      </div>
      <div class="charts-div4">
        <div id="fourchart" :style="{width:'100%',height:'370px'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSignalling } from "@/apis/api.js";
let options = [];

export default {
  name: "MonitorRight",
    data() {
        return {
            groupNo: 0,
            leftTopName: [],
            leftTopPeople: [],
            leftBottomName: [],
            leftBottomPeople: [],
            firstchart: {},
            secondchart: {}
        };
    },
    computed: {
        options() {
            return [
                {
                    color: ["#57ef9c", "#f99384", "#ffb76b", "#7fb3ed", "#91e2ff", "#c3e67e", "#f9945c", "#EED846"],
                    title: {
                        text: "重点区域夜间人口总体情况",
                        subtext: "单位：万",
                        left: "center",
                        textStyle: {
                            color: "#33CCFF",
                            fontSize: 20
                        }
                    },
                    tooltip: {},
                    grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "3%",
                        containLabel: true
                    },
                    xAxis: {
                        type: "value",
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: "category",
                        data: this.leftTopName.slice(this.groupNo * 8 + 0, this.groupNo * 8 + 8),
                        axisLabel: {
                            interval: 0,
                            rotate: -40
                        }
                    },
                    series: [
                        {
                            //   name: this.leftTopName[1],
                            type: "bar",
                            data: [
                                this.leftTopPeople[this.groupNo * 8 + 0],
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ],
                            stack: "a"
                        },
                        {
                            //   name: this.leftTopName[2],
                            type: "bar",
                            data: [
                                0,
                                this.leftTopPeople[this.groupNo * 8 + 1],
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ],
                            stack: "a"
                        },
                        {
                            //   name: this.leftTopName[3],
                            type: "bar",
                            data: [
                                0,
                                0,
                                this.leftTopPeople[this.groupNo * 8 + 2],
                                0,
                                0,
                                0,
                                0,
                                0
                            ],
                            stack: "a"
                        },
                        {
                            //   name: this.leftTopName[4],
                            type: "bar",
                            data: [
                                0,
                                0,
                                0,
                                this.leftTopPeople[this.groupNo * 8 + 3],
                                0,
                                0,
                                0,
                                0
                            ],
                            stack: "a"
                        },
                        {
                            //   name: this.leftTopName[5],
                            type: "bar",
                            data: [
                                0,
                                0,
                                0,
                                0,
                                this.leftTopPeople[this.groupNo * 8 + 4],
                                0,
                                0,
                                0
                            ],
                            stack: "a"
                        },
                        {
                            //   name: this.leftTopName[5],
                            type: "bar",
                            data: [
                                0,
                                0,
                                0,
                                0,
                                0,
                                this.leftTopPeople[this.groupNo * 8 + 5],
                                0,
                                0
                            ],
                            stack: "a"
                        },{
                            //   name: this.leftTopName[5],
                            type: "bar",
                            data: [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                this.leftTopPeople[this.groupNo * 8 + 6],
                                0
                            ],
                            stack: "a"
                        },{
                            //   name: this.leftTopName[5],
                            type: "bar",
                            data: [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                this.leftTopPeople[this.groupNo * 8 + 7]
                            ],
                            stack: "a"
                        }
                    ]
                },
                {
                    color: ["#57ef9c", "#f99384", "#ffb76b", "#7fb3ed", "#91e2ff", "#c3e67e", "#f9945c", "#EED846"],
                    title: {
                        text: "重点区域日间人口总体情况",
                        subtext: "单位：万",
                        left: "center",
                        textStyle: {
                            color: "#33CCFF",
                            fontSize: 20
                        }
                    },
                    tooltip: {},
                    grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "3%",
                        containLabel: true
                    },
                    xAxis: {
                        type: "value",
                        boundaryGap: [0, 0.01]
                    },
                     yAxis: {
                        type: "category",
                        data: this.leftBottomName.slice(this.groupNo * 8 + 0, this.groupNo * 8 + 8),
                        axisLabel: {
                            interval: 0,
                            rotate: -40
                        }
                    },
                    series: [
                        {
                            //   name: this.leftBottomName[1],
                            type: "bar",
                            data: [
                                this.leftBottomPeople[this.groupNo * 8 + 0],
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ],
                            stack: "a"
                        },
                        {
                            //   name: this.leftBottomName[2],
                            type: "bar",
                            data: [
                                0,
                                this.leftBottomPeople[this.groupNo * 8 + 1],
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ],
                            stack: "a"
                        },
                        {
                            //   name: this.leftBottomName[3],
                            type: "bar",
                            data: [
                                0,
                                0,
                                this.leftBottomPeople[this.groupNo * 8 + 2],
                                0,
                                0,
                                0,
                                0,
                                0
                            ],
                            stack: "a"
                        },
                        {
                            //   name: this.leftBottomName[4],
                            type: "bar",
                            data: [
                                0,
                                0,
                                0,
                                this.leftBottomPeople[this.groupNo * 8 + 3],
                                0,
                                0,
                                0,
                                0
                            ],
                            stack: "a"
                        },
                        {
                            //   name: this.leftBottomName[5],
                            type: "bar",
                            data: [
                                0,
                                0,
                                0,
                                0,
                                this.leftBottomPeople[this.groupNo * 8 + 4],
                                0,
                                0,
                                0
                            ],
                            stack: "a"
                        },{
                            //   name: this.leftBottomName[5],
                            type: "bar",
                            data: [
                                0,
                                0,
                                0,
                                0,
                                0,
                                this.leftBottomPeople[this.groupNo * 8 + 5],
                                0,
                                0
                            ],
                            stack: "a"
                        },{
                            //   name: this.leftBottomName[5],
                            type: "bar",
                            data: [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                this.leftBottomPeople[this.groupNo * 8 + 6],
                                0
                            ],
                            stack: "a"
                        },{
                            //   name: this.leftBottomName[5],
                            type: "bar",
                            data: [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                this.leftBottomPeople[this.groupNo * 8 + 7],
                            ],
                            stack: "a"
                        }
                    ]
                }
            ];
        }
    },
    methods: {
        // initChart(obj, objoption) {
        //   let mychart = this.$echarts.init(document.getElementById(obj));
        //   mychart.setOption(objoption);
        // },
        getStreetInfoSucc(res) {
            if (res.data != null) {
                let data = res.data.aggregations.ind.buckets;
                for (var i = 0; i < data.length; i++) {
                    this.leftTopName[i] = data[i].key;
                    this.leftTopPeople[i] = (data[i].sum_value.value / 240000).toFixed(4);
                    this.leftBottomName[i] = data[i].key;
                    this.leftBottomPeople[i] = (data[i].sum_value.value / 240000).toFixed(4);
                }
                // this.setChartOptions();
                // this.initChart("firstchart", options[0]);
                // this.initChart("secondchart", options[1]);

                this.firstchart = this.$echarts.init(
                    document.getElementById("thildchart")
                );
                this.firstchart.setOption(this.options[0]);
                this.secondchart = this.$echarts.init(
                    document.getElementById("fourchart")
                );
                this.secondchart.setOption(this.options[1]);
                let _this = this;
                let changeChartCode = function () {
                    _this.groupNo = (_this.groupNo + 1) % 4;
                    _this.firstchart.setOption(_this.options[0]);
                    _this.secondchart.setOption(_this.options[1]);
                };
                setInterval(changeChartCode, 3000);
            } else {
                this.$message.error("数据查询失败，请联系管理员或刷新重试！");
            }
        }
    },
    mounted() {
        let params = {
            size: 0,
            query: {
                bool: {
                    filter: [
                        {
                            range: {
                                date: {
                                    format: "yyyy-MM-dd HH:mm:ss",
                                    gte: "2018-07-31 00:00:00",
                                    lt: "2018-08-01 00:00:00",
                                    time_zone: "+08:00"
                                }
                            }
                        },
                        {
                            prefix: {
                                area: "0861102310"
                            }
                        }
                    ]
                }
            },
            aggs: {
                ind: {
                    terms: {
                        field: "areaName.keyword",
                        size: 100
                    },
                    aggs: {
                        sum_value: {
                            sum: {
                                field: "sdTotal"
                            }
                        }
                    }
                }
            }
        };
        getSignalling(params).then(this.getStreetInfoSucc);
    }
};
</script>

<style lang="scss" scoped>
.monitor-right {
  overflow: hidden;
  height: 100%;
  .charts-div3 {
    // margin-top: 1%;
    // padding-left: 15%;
    // padding-right: 15%;
  }
  .charts-div4 {
    // margin-top: 7%;
    // padding-left: 15%;
    // padding-right: 15%;
  }
  h1 {
    text-align: center;
    color: #33ccff;
    font-size: 20px;
    font-weight: bolder;
  }
  h6 {
    text-align: center;
    color: #aaa;
    font-size: 12px;
    margin-top: 10px;
  }
}
</style>
