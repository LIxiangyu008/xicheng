import {
  apiServiceMetadata,
  apiWMTSCapality
} from './../../apis/api'
import $ from 'jquery'
import Vue from 'vue'
import {
  smRestMapFindByGeometry,
  smRestMapFindByDistance,
  smQueryLayerInfo,
  smRestMapFindBySql
} from './../common/supermapService'
import {
  ServiceConfig
} from "./../../config/app-config.js"

export const serviceMgr = {
  getLegend(url, callback) {
    let legend = [];
    smQueryLayerInfo(`${ServiceConfig.httpproxy}?url=${url}`).then((data) => {
      if (data.result) {
        if (data.result.subLayers) {
          var mapname = data.result.name;
          for (var j = 0; j < data.result.subLayers.layers.length; j++) {
            var layer = data.result.subLayers.layers[j];
            var resourcetype = layer.datasetInfo.type;
            if (layer && layer.visible) {
              if (layer.ugcLayerType == "THEME") {
                if (layer.theme.items) {
                  for (var m = 0; m < layer.theme.items.length; m++) {
                    var item = layer.theme.items[m];
                    var style = item.style;
                    //获取图例
                    var imgsrc = getSymbolByStyle(url, style, resourcetype);
                    var caption = item.caption;
                    var le = {
                      caption: caption,
                      imgurl: imgsrc
                    }
                    legend[m] = le;
                  }
                }
                //获取标签图例
                console.log(layer.theme.type)
                if (layer.theme.type == "LABEL") {
                  var legendname = layer.name;
                  legendname = legendname.replace("#", ".");
                  var imgsrc = url + "/layers/" + legendname + "@@" + mapname + "/legend";
                  var caption = layer.caption;
                  var le = {
                    caption: caption,
                    imgurl: imgsrc
                  }
                  legend[legend.length] = le;
                }
              } else {
                var legendname = layer.name;
                legendname = legendname.replace("#", ".");
                //判断图层样式是否为null
                if (layer.caption == "行政区划") {} else {
                  //获取图例
                  var imgsrc = getSymbolByStyle(url, layer.style, resourcetype);
                  var caption = layer.caption;
                  var le = {
                    caption: caption,
                    imgurl: imgsrc
                  }
                  legend[legend.length] = le;
                }

              }
            }

          }
          callback(legend)
        }
      }
    })
  },
  getRestBySql(param){
    return new Promise((resolve, reject) => {
      let queryName = [];
      smQueryLayerInfo(param.url).then((data) => {
        if (data.result) {
          if (data.result.subLayers) {
            let subLayer = data.result.subLayers.layers[0];
            if (subLayer.visible && subLayer.queryable && !(subLayer.datasetInfo.type == "TEXT") &&  subLayer.datasetInfo.name != null && subLayer.datasetInfo.name.indexOf('注记') == -1) {
              smRestMapFindBySql({
                url: param.url,
                sql: param.sql,
                dataSourceName: subLayer.datasetInfo.dataSourceName,
                dataSetName: subLayer.datasetInfo.name,
                options: param.options
              }).then((res) => {
                resolve(res);
              })
            }
          }
        }
      })
    })
  },
  getAllRestResult(layer,layerGeo) {
    console.log('穿透查询')
    let captionMap = {};
    return new Promise(async (resolve, reject) => {
      /*ServiceConfig.httpproxy*/
      let serviceurl = "/webframe/biz/httpproxy/httpproxy.jsp"+ "?url="+ layer.url;  //layer.url;
      
      let subLayers = new Array();
      let splitLayerIndex = this.filteLayerName(layer.layerName);
      smQueryLayerInfo(serviceurl).then((data) => {
        if (data.result) {
          if (data.result.subLayers) {
            let paramNames = [];
            for (let j = 0; j < data.result.subLayers.layers.length; j++) {
              let subLayer = data.result.subLayers.layers[j];
              if (subLayer.visible && subLayer.queryable && !(subLayer.datasetInfo.type == "TEXT") && subLayer.datasetInfo.name.indexOf('注记') == -1) {
                if (!splitLayerIndex.length || splitLayerIndex.indexOf(j) > -1) {
                  captionMap[subLayer.name] = subLayer.caption;
                  paramNames.push({name:subLayer.name})
                }
              }
            };
            if (!paramNames || !paramNames.length) {
              resolve([]);
              return;
            }
            smRestMapFindByGeometry({
              url: serviceurl,
              name: paramNames,
              options: {
                geometry: layerGeo,
                expectCount: 50
              }
            }).then((res) => {
              if (res && res.recordsets) {
                //设置tab标题为图层别名
                res.recordsets.forEach(item => {
                  item.datasetName = captionMap[item.datasetName] || item.datasetName;
                })
              }
              resolve(res);
            })
          }
        }
      })
    })
  },
  getRestResult(layer, layers, succ, f1, f2, f3) {
    console.log('空间查询')
    let params = {};
    let queryName = [];
    let captionMap = {};
    let speciallayersgroup = layers;
    if (speciallayersgroup.length > 0) {
      let toplayer = speciallayersgroup[speciallayersgroup.length - 1];
      let serviceurl = "/webframe/biz/httpproxy/httpproxy.jsp"+ "?url="+ 'http://192.168.105.122:8090/iserver/services/map-SGS/rest/maps/XianZhuangFangWu';
      if (serviceurl.indexOf("rest") > -1) {
        let subLayers = [];
        smQueryLayerInfo(serviceurl).then((data) => {
          if (data.result) {
            if (data.result.subLayers) {
              let getDataSet = [];
              let filterArrIndex = this.filteLayerName(toplayer.layerName);
              for (let j = 0; j < data.result.subLayers.layers.length; j++) {
                let subLayer = data.result.subLayers.layers[j];
                if (subLayer.visible && subLayer.queryable && !(subLayer.datasetInfo.type == "TEXT") && subLayer.datasetInfo.name.indexOf('注记') == -1) {
                  let paramData = subLayer.name;
                  if (!filterArrIndex.length || filterArrIndex.indexOf(j) > -1) {
                    captionMap[subLayer.name] = subLayer.caption;
                    getDataSet.push({
                      name: paramData
                    });
                  }
                }
              };
              if (!getDataSet || !getDataSet.length) {
                f1();
                return;
              }
              smRestMapFindByGeometry({
                url: serviceurl,
                name: getDataSet,
                options: {
                  geometry: layer,
                  expectCount: 50
                }
              }).then((res) => {
                if (res && res.recordsets) {
                  //设置tab标题为图层别名
                  res.recordsets.forEach(item => {
                    item.datasetName = captionMap[item.datasetName] || item.datasetName;
                  })
                }
                succ(res)
              })
            }
          }
        })
      } else {
        f2();
      }

    } else {
      f3();
    }
  },
  filteLayerName(layerName) {
    let filterArr = [],
      splitArray = layerName.split(',');
    if (!layerName) {
      return filterArr;
    }
    filterArr = splitArray.map(item => {
      return +item.split(':')[1];
    })
    return filterArr;
  },
  getMetadata(serviceId, userKey) {
    userKey = userKey || '886e60bb7e014f22a707de23e6f6505d';
    return new Promise(async (resolve, reject) => {
      if (!serviceId) {
        return;
      }
      let layers = [];
      let bounds = [];
      const metaRes = await apiServiceMetadata(serviceId);
      let $meta = $(metaRes.data);
      let metaXml = {
        url: $meta.find("item[id='meta_surl']").attr("value") + '/' + userKey,
        sname: $meta.find("item[id='meta_sname']").attr("value"),
        layerName: $meta.find("item[id='meta_slayername']").attr("value"),
        center_x: $meta.find("item[id='center_x']").attr("value"),
        center_y: $meta.find("item[id='center_y']").attr("value"),
        maxLeft: $meta.find("item[id='bounds_left']").attr("value"),
        maxTop: $meta.find("item[id='bounds_top']").attr("value"),
        maxRight: $meta.find("item[id='bounds_right']").attr("value"),
        maxBottom: $meta.find("item[id='bounds_bottom']").attr("value"),
        projections: $meta.find("item[id='prjcoordsyscode']").attr("value"),
        serviceInterfaceType: $meta.find("item[id='meta_interface']").attr("value"),
        datasetName: $meta.find("item[id='meta_sdatasetname']").attr("value"),
        dataSetType: $meta.find("item[id='meta_sdatasettype']").attr("code"),
        dataSetTypeValue: $meta.find("item[id='meta_sdatasettype']").attr("value"),
        senceName: $meta.find("item[id='meta_sscenename']").attr("value")
      }
      let crs = metaXml.projections == 'EPSG:3857' ? L.CRS.EPSG3857 : L.CRS.EPSG4326;
      let customCrs = null;
      //地图的默认zoom大小
      let zoom = 8;
      let center;
      let options = {};
      if (metaXml.serviceInterfaceType && metaXml.serviceInterfaceType.indexOf('WMS') > -1) {
        var layerIDArray = metaXml.layerName.split(",");
        if (layerIDArray.length > 1) {
          layerIDArray.sort(rank());
          //将数组进行排序
          metaXml.layerName = layerIDArray.toString();
        }
        options = {
          layers: metaXml.layerName
        }
        bounds = [
          [metaXml.maxTop, metaXml.maxLeft],
          [metaXml.maxBottom, metaXml.maxRight]
        ];
      } else if (metaXml.serviceInterfaceType.indexOf('SFS') > -1) {
        var layerIDArray = metaXml.layerName.split(",");
        var layerIndex = layerIDArray[0].split(":")[0];
        var layerNum = layerIDArray[0].split(":")[1];
        metaXml.layerName = "[" + layerIndex + ":";
        for (var i = 0; i < layerIDArray.length; i++) {
          if (layerIndex == layerIDArray[i].split(":")[0]) {
            metaXml.layerName = metaXml.layerName + i + ",";
          }
        }
        bounds = [
          [metaXml.maxTop, metaXml.maxLeft],
          [metaXml.maxBottom, metaXml.maxRight]
        ];
        metaXml.url = ServiceConfig.httpproxy+ "?url="+  metaXml.url;
      } else if (metaXml.serviceInterfaceType.indexOf('WMTS') > -1) {

        const capalityRes = await apiWMTSCapality({
          url: metaXml.url
        });
        let capality = capalityRes.data.resultInfo.data[0];
        let filterArr = capality.tileMatrixSets.filter((item) => {
          return item.identifier == metaXml.layerName;
        })
        //解决wmts服务无layerName导致filterArr为空， 默认取第一个tileMatrixSets
        if (!filterArr.length && capality.tileMatrixSets.length) {
          filterArr = capality.tileMatrixSets;
        }
        if (filterArr.length) {
          let scales = filterArr[0].scales;
          let resolutions = filterArr[0].resolutions || [];
          let matrixIds = [];
          if (filterArr[0].tdtIdentifier) {
            //天地图zoom设置为2
            zoom = 2;
          }
          if (resolutions.length) {
            resolutions.forEach((item, index) => {
              resolutions[index] = Number(resolutions[index]);
            })
          }
          let spatialInfo = filterArr[0].spatialInfo;

          center = [Number(spatialInfo.centerPoint.y), Number(spatialInfo.centerPoint.x)]
          options = {
            layer: capality.identify,
            tilematrixSet: metaXml.layerName,
            style: 'default',
            format: filterArr[0].imageFormat,
            resolutions: resolutions,
            scales: capality.tileMatrixSets[0].scales,
            identifier: capality.tileMatrixSets[0].tdtIdentifier
          };
        }
        bounds = [
          [metaXml.maxTop, metaXml.maxLeft],
          [metaXml.maxBottom, metaXml.maxRight]
        ];
      } else if (metaXml.serviceInterfaceType.indexOf('REST') > -1) {
          bounds = [
            [metaXml.maxTop, metaXml.maxLeft],
            [metaXml.maxBottom, metaXml.maxRight]
          ];
          center = [metaXml.center_x,metaXml.center_y];
      }
      // this.mapOptions = { crs: customCrs || crs, zoom }
      layers = [{
        url: metaXml.url,
        layerType: metaXml.serviceInterfaceType,
        layerName: metaXml.layerName, //图层名称
        name: metaXml.sname,
        legend: [],
        opacity: 1,
        project: metaXml.projections,
        options: options,
        bounds: bounds,
        center: center
      }];
      if (layers.length > 0) {
        resolve(layers);
      } else {
        reject(layers)
      }

    })

  }

}

function getSymbolByStyle(url, style, resourcetype) {
  if (resourcetype == "REGION") {
    resourcetype = "SYMBOLFILL";
  } else if (resourcetype == "POINT") {
    resourcetype = "SYMBOLMARKER";
  } else if (resourcetype == "LINE") {
    resourcetype = "SYMBOLLINE";
  }
  var styleParams = JSON.stringify(style);
  var imageUrl = url + "/symbol.png?resourceType=" + resourcetype + "&style=" + encodeURI(styleParams) + "&picWidth=30&picHeight=20";
  return imageUrl;
}

function rank() {
  return function(obj1, obj2) {
    var val1 = obj1;
    var val2 = obj2;
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return 1;
    } else if (val1 > val2) {
      return -1;
    } else {
      return 0;
    }
  };
}
