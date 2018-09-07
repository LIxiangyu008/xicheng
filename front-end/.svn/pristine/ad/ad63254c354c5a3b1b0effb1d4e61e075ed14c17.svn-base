<template lang="html">
  <div class="monitor-header">
    <div class="limit-card" v-for="item of cardData" :key="item.id">
      <el-card class="box-card" :body-style="{ background: '#5098ea' }">
        <div class="win-info">
          <span class="info-title">{{item.title}}</span>
          <span>{{item.time}}</span>
          <div class="info-people">
            <span class="people-num">{{item.num}}</span><span>人</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getSignalling } from "@/apis/api.js";

export default {
    name: "MonitorHeader",
    data() {
        return {
            cardData: [
                {
                    id: 0,
                    title: "西城区日均夜间人口",
                    time: "2018年7月",
                    num: "0"
                },
                {
                    id: 1,
                    title: "西城区日均日间人口",
                    time: "2018年7月",
                    num: "0"
                },
                {
                    id: 2,
                    title: "实时人口",
                    time: "2018年7月15日 19:00",
                    num: "0"
                }
            ]
        };
    },
    async created() {
        let paramForMonth = {
            "size": 0,
            "query": {
                "bool": {
                    "filter": [
                        {
                            "match": {
                                "area": "0861102"
                            }
                        },
                        {
                            "range": {
                                "date": {
                                    "format": "yyyy-MM-dd HH:mm:ss",
                                    "gte": "2018-07-01 00:00:00",
                                    "lt": "2018-08-01 00:00:00",
                                    "time_zone": "+08:00"

                                }
                            }
                        }
                    ]
                }
            },
            "aggs": {
                "per_month": {
                    "date_histogram": {
                        "field": "date",
                        "interval": "month",
                        "format": "yyyy-MM-dd HH:mm:ss",
                        "time_zone": "+08:00"

                    },
                    "aggs": {
                        "ind": {
                            "terms": {
                                "field": "areaName.keyword",
                                "size": 999
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
        let paramForNow = {
            "size": 0,
            "query": {
                "bool": {
                    "filter": [
                        {
                            "match": {
                                "area": "0861102"
                            }
                        },
                        {
                            "range": {
                                "date": {
                                    "format": "yyyy-MM-dd HH:mm:ss",
                                    "gte": "2018-07-31 00:00:00",
                                    "lt": "2018-08-01 00:00:00",
                                    "time_zone": "+08:00"
                                }
                            }
                        }
                    ]
                }
            },
            "aggs": {
                "per_hour": {
                    "date_histogram": {
                        "field": "date",
                        "interval": "hour",
                        "format": "yyyy-MM-dd HH:mm:ss",
                        "time_zone": "+08:00"

                    },
                    "aggs": {
                        "ind": {
                            "terms": {
                                "field": "areaName.keyword",
                                "size": 999
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
        }

        let dataForMonth = await getSignalling(paramForMonth);
        let dataForNow = await getSignalling(paramForNow);
        dataForMonth = dataForMonth.data.aggregations.per_month.buckets;
        dataForNow = dataForNow.data.aggregations.per_hour.buckets;
        if(dataForMonth.length>0){
            this.cardData[0].num=dataForMonth[0].ind.buckets[0].sum_value.value/30;
            this.cardData[1].num=dataForMonth[0].ind.buckets[0].sum_value.value/30;
        }
        if(dataForNow.length>0){
            this.cardData[2].num=dataForNow[0].ind.buckets[0].sum_value.value;
        }


    },
    methods: {}
};
</script>

<style lang="scss" scoped>
.monitor-header {
  // text-align: center;
  justify-content: space-between;
  display: flex;
  .limit-card {
    display: inline-block;
    width: 25%;
    // margin-left: 13%;
    margin-top: 10px;
    .win-info {
      color: #fff;
      text-align: center;
      .info-title {
        margin-right: 20px;
      }
      .info-people {
        margin-top: 20px;
        .people-num {
          font-size: 25px;
        }
      }
    }
  }
}
</style>
