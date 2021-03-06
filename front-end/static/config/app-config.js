/**
 * 西城二期项目全局配置
 * @type {[type]}
 */
var APPCONFIG = APPCONFIG || {};
var FMCONFIG = FMCONFIG || {};
var MARKERCONFIG = MARKERCONFIG || {};
var ATTRVALUE = ATTRVALUE || {};
var QUOTACONFIG = QUOTACONFIG || {};
(function() {
  var location = window.location,
    host = location.port == '3000' ? 'http://192.168.105.122:8080' : location.protocol + '//' + location.hostname + ":" + location.port;
  var baseMarkerUrl = "./static/img/marker/";
  APPCONFIG = {
    IP: host,
    imgUrl: './static/img/',
    DisIp: 'http://192.168.105.122:8088',
    InitDis: {
      name: "怀柔区",
      code: "110116"
    },
    MapCenter: {
      X: 108.00781,
      Y: 30.14761,
      level: 7
    },
    Analysis: {
      default: {
        camera: { // 西城场景初始化相机位置
          destination: {
            x: 4.497043709478049,
            y: 2.75905418837011,
            z: 300.54916200878544,
            deviation: 100 //初始化高度二次旋转偏移量
          },
          duration: 6,
          orientation: {
            heading: 5.901089214916513,
            pitch: -0.40668579780875524,
            roll: 6.281842456812987
          }
        },
        labelCamera: { // 场景标注相机初始位
          lon: 4.503058674735231,
          lat: 2.746877653750054,
          alt: 569.9374832846224,
          heading: 5.80085905314114,
          pitch: -0.42986025134164585,
          roll: 6.283185307179586
        },
        imgLayers: [{
          // url: "http://support.supermap.com.cn:8090/iserver/services/map-Population/rest/maps/PopulationDistribution",
          // name: "人口数据",
          // isShow: true
        }],
        scenes: [{
            indexUrl: "advice008",
            url: "http://192.168.105.122:8090/iserver/services/3D-LaoXiCheng/rest/realspace", //模型文件，必须是s3m的平面场景
            building: 'JZ@新街口旧', // 场景中建筑S3M的名称
            name: "老西城",
            time: 2016,
            scenetype: "scene",
            waterName: "WATER@新街口旧", // 水面S3M数据集名称,可配置为空字符串
            keyWord: 'MODELID_OLD' //key数据
          },
          {
            indexUrl: "advice009",
            url: "http://192.168.105.122:8090/iserver/services/3D-XinXiCheng/rest/realspace", //模型文件，必须是s3m的平面场景
            building: 'JZ@新街口', // 场景中建筑S3M的名称
            name: "新西城",
            time: 2017,
            scenetype: "scene",
            waterName: "WATER@新街口", // 水面S3M数据集名称,可配置为空字符串
            keyWord: 'MODELID_NEW' // key数据
          }
        ],
        planeImgUrl: './static/img/background.png', //三维平面场景地图配置，默认图片为粉色底图
        pastIndex: { // 三维历史重点区域查询rest-data
          datasetNames: ["历史面:历史面"],
          url: 'http://192.168.105.122:8090/iserver/services/data-LiShiMian/rest/data'
        },
        s3mLayers: [{
          // url: 'http://www.supermapol.com/realspace/services/3D-Olympic/rest/realspace/datas/NewDataset@water-caijian/config',
          // name: '珠江钢管',
          // isShow: true,
        }],
        heatMapColor: [ // 热力图颜色参数
          ["rgb(255,255,0)", "rgb(255,0,0)", "rgb(255,185,15)"], // 默认黄红橙
          ["rgb(173,255,47)", "rgb(255,0,0)", "rgb(255,185,15)"], // 黄红橙
          ["rgb(255,255,0)", "rgb(128,0,128)", "rgb(255,185,15)"] // 黄紫橙
        ]
      },
      viewerCesiumInspectorMixin: false, //是否启用应用分析
      debugShowFramesPerSecond: false
    },
    //项目基本配置
    BaseConfig: {
      map: {
        center: [2764050.38919908, 87877.01490325935],
        zoom: 2,
        crsOptions: {
          bounds: [
            [7728.387860505541, 2645120.69708152],
            [168025.64194601303, 2882980.08131664]
          ],
          origin: [7728.387860505541, 2882980.08131664]
        }
      }
    },
    TDTCONFIG: {
      WGS84: [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625,
        0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125, 0.0000858306884765625,
        0.00004291534423828125, 0.000021457672119140625, 0.000010728836059570312, 0.000005364418029785156
      ],
      Mercator: [78271.51696402031, 39135.758482010155, 19567.879241005077, 9783.939620502539, 4891.969810251269, 2445.9849051256347,
        1222.9924525628173, 611.4962262814087, 305.74811314070433, 152.87405657035217, 76.43702828517608, 38.21851414258804,
        19.10925707129402, 9.55462853564701, 4.777314267823505, 2.3886571339117526, 1.1943285669558763, 0.5971642834779382
      ]
    }
  }
  FMCONFIG = {
    VistaUrl: 'http://192.168.105.122:8092/nl/',
    rollUpUrl: 'http://192.168.105.122:8080/mapcompare/',
    XZFWurl: 'http://192.168.105.122:8090/iserver/services/map-SGS/rest/maps/XianZhuangFangWu',
    FMLayerName: '风貌影像点',
    FMAxiosUrl: 'http://192.168.105.122:8080/map/services/appearance/getMetaData/',
    FMAxiosMedia: 'http://192.168.105.122:8080/map/services/appearance/getAch/',
    baseImgUrl: [{
      name: '类型1',
      src: baseMarkerUrl + 'FM01.png',
      typevalue: "国家级"
    }, {
      name: '类型2',
      src: baseMarkerUrl + 'FM02.png',
      typevalue: "市级"
    }, {
      name: '类型3',
      src: baseMarkerUrl + 'FM03.png',
      typevalue: "区级"
    }, {
      name: '类型4',
      src: baseMarkerUrl + 'FM04.png',
      typevalue: "普查项目"
    }]
  }
  MARKERCONFIG = {
    markerMapping: { //sID 是对应的服务ID
      //"5bfb24cf5d9c4ba6be6e79b23d560de6" : "SpecialTheme"
    },
    SpecialTheme: {
      tipTemplateName: "SpecialTable" //
    }
  }
  ATTRVALUE = {
    // 三维地图属性查看接口
    mapurl: 'http://192.168.105.122:8081/geoesb/proxy/services/maps/rest/dc68386ae41942849aa36fb6e59c9cc5/886e60bb7e014f22a707de23e6f6505d',
    dataSourceName: 'XZFW',
    dataSetName: '新街口房屋'
  }
  XLCONFIG = {
    map: {
      url: 'http://192.168.105.122:8090/iserver/services/map-xc/wmts100',
      center: [499738.046182069, 305342.369685293], // 地图中心点
      layer: 'xc',
      style: 'default',
      tilematrixSet: 'Custom_xc',
      format: 'image/png',
      maxZoom: 5, //最大显示层级
      zoom: 1, // 初始化层级
    },
    crs: {
      resolutions: [32.11609723025452, 16.058048615127287, 8.029024307563645, 4.014512153781837, 2.007256076890913, 1.003628038445455], // 分辨率数组
      bounds: [494404.480034902, 298097.131083944, 505071.6123292369, 312587.608286642]
    },
    themeLayer: {
      url: 'http://192.168.105.122:8090/iserver/services/data-SGS/rest/data', //单值专题图发布注册代理的rest-data服务
      staUrl: 'http://192.168.105.122:8081/geoesb/proxy/aa6b04acba4943dfa8ff0e00337627f2/886e60bb7e014f22a707de23e6f6505d',
      themeStatRequestData: {
        "size": 0,
        "query": {
          "bool": {
            "filter": [{
                "prefix": {
                  "area": "0861102400"
                }
              },
              {
                "range": {
                  "date": {
                    "format": "yyyy-MM-dd HH:mm:ss",
                    "gte": "2018-07-31 00:00:00",
                    "lte": "2018-08-01 00:00:00",
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
              "format": "HH",
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
      },
      datasource: 'XCJD', // 数据源
      dataset: 'xc_jd', //数据集
      themeField: 'JDNAME', //专题图字段 名称
      fontfillColor: '#6ACD06',
      fontSize: '14px',
      colorSystem: [
        '#f2f6ff',
        '#f2f6ff',
        '#f2f6ff',
        '#dfe5f3',
        '#dfe5f3',
        '#dfe5f3',
        '#c4d7ff',
        '#c4d7ff',
        '#c4d7ff',
        '#9dbfff',
        '#9dbfff',
        '#9dbfff',
        '#6398fe',
        '#6398fe',
        '#6398fe',
      ],
      styleGroups: [{
        value: '西长安街街道',
        fillColor: '#D8F0FF'
      }, {
        value: '新街口街道',
        fillColor: '#C0F0F0'
      }, {
        value: '月坛街道',
        fillColor: '#C0D8F0'
      }, {
        value: '展览路街道',
        fillColor: '#C0F0FF'
      }, {
        value: '德胜街道',
        fillColor: '#A8F0F0'
      }, {
        value: '金融街街道',
        fillColor: '#78C0F0'
      }, {
        value: '什刹海街道',
        fillColor: '#A8D8F0'
      }, {
        value: '大栅栏街道',
        fillColor: '#3090F0'
      }, {
        value: '天桥街道',
        fillColor: '#6090D8'
      }, {
        value: '椿树街道',
        fillColor: '#4878D8'
      }, {
        value: '陶然亭街道',
        fillColor: '#90C0D8'
      }, {
        value: '广安门内街道',
        fillColor: '#0048D8'
      }, {
        value: '牛街街道',
        fillColor: '#60A8F0'
      }, {
        value: '白纸坊街道',
        fillColor: '#3078D8'
      }, {
        value: '广安门外街道',
        fillColor: '#1860D8'
      }]
    }
  }
  QUOTACONFIG = {
    AQI: { //空气质量参数配置
      IAQI: [0, 50, 100, 150, 200, 300, 400, 500], //空气质量分指数
      SO2: [0, 50, 150, 475, 800, 1600, 2100, 2620],
      NO2: [0, 40, 80, 180, 280, 565, 750, 940],
      PM10: [0, 50, 150, 250, 350, 420, 500, 600],
      PM2P5: [0, 35, 75, 115, 150, 250, 350, 500],
      O3: [0, 100, 160, 265, 800, 1000, 1200],
      CO: [0, 2, 4, 14, 24, 36, 48, 60]
    },
    RANKSELECT: {
      //指标分为两类，一类是可以判断修优差(如噪音)的，一类只能判断大小(如风速)
      googbad: {
        optimalName: "最优排名",
        worstName: "最差排名"
      },
      bigsmall: {
        optimalName: "最大排名",
        worstName: "最小排名"
      }
    },
    LIGHT: {
      optimal: {
        order: "desc", //排序
        rankStyle: "" //排名的css样式 例如 "color:green;"
      },
      worst: {
        order: "asc",
        rankStyle: ""
      },
      low: [0, 5000]
    },
    NOISE: {
      optimal: {
        order: "asc",
        rankStyle: "background-color:#DFAA75;"
      },
      worst: {
        order: "desc",
        rankStyle: "background-color:#DFAA75;"
      },
      low: [0, 45]
    },
    HCHO: {
      optimal: {
        order: "asc",

      },
      worst: {
        order: "desc",

      },
      low: [0, 1]
    },
    PM2P5: {
      optimal: {
        order: "asc",

      },
      worst: {
        order: "desc",

      },
      low: [0, 100]
    },
    PM10: {
      optimal: {
        order: "asc",
        rankStyle: ""
      },
      worst: {
        order: "desc",
        rankStyle: ""
      },
      low: [0, 200]
    },
    UV: {
      optimal: {
        order: "asc",

      },
      worst: {
        order: "desc",

      },
      low: [0, 8]
    },
    CO2: {
      optimal: {
        order: "asc",

      },
      worst: {
        order: "desc",

      },
      low: [0, 1000]
    },
    CO: {
      optimal: {
        order: "asc",

      },
      worst: {
        order: "desc",

      },
      low: [0, 500]
    },
    SO2: {
      optimal: {
        order: "asc",

      },
      worst: {
        order: "desc",

      },
      low: [0, 10]
    },
    NO2: {
      optimal: {
        order: "asc",

      },
      worst: {
        order: "desc",

      },
      low: [0, 10]
    },
    VOC: {
      optimal: {
        order: "asc",

      },
      worst: {
        order: "desc",

      },
      low: [0, 15]
    },
    TEMPERATURE: {
      low: [0, 28]
    },
    HUMIDITY: {
      low: [0, 80]
    },
    PRESSURE: {
      low: [0, 1000]
    },
    WINDSPEED: {
      low: [0, 6]
    },
    O3: {
      low: [0, 500]
    },
    HUMANFLOW: {
      low: [0, 10000]
    },
    CARFLOW: {
      low: [0, 500]
    }
  }
  ESURL = 'http://192.168.105.122:8081/geoesb/proxy/aa6b04acba4943dfa8ff0e00337627f2/886e60bb7e014f22a707de23e6f6505d';
}())
