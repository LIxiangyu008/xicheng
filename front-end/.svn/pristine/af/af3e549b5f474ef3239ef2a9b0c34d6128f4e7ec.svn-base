import axios from 'axios'
import jsonp from 'jsonp'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;

import {
  ServiceConfig,
  SgsConfig,
  Geoesbmengine,
  Map,
  DFC,
  GeoEntity
} from './../config/app-config.js';
import querystring from 'querystring';

const GeoesbService = Geoesbmengine.location + '/services';
const MapService = Map.location + '/services';
const DFCService = DFC.location + '/services';
const GeoEntityService = GeoEntity.location + '/services';

//获取地图
export const getMaps = (param) => {
  return axios.get(`${ServiceConfig.getMap}`, {
    params: param || {}
  })
}

//获取子分类
export const getSpecials = (id) => {
  return axios.get(`${ServiceConfig.catalogSpecials}.json?pkid=${id}`)
}

//获取指定ID的专题目录信息
export const getCatalogSpecial = (id) => {
  return axios.get(`${ServiceConfig.catalogSpecial}/${id}`)
}

//获取sfs请求
export const getSfsData = (url, param) => {
  return axios.get(`${ServiceConfig.httpproxy}?url=${url}?`, {
    params: param || {}
  })
}


//发送url请求元数据
export const getMetaData = (url) => {
  return axios.get(`${ServiceConfig.httpproxy}?url=${url}`)
}

//获取模型列表
export const getSymbol = () => {
  return axios.get(`${ServiceConfig.Planconmanage}/sys/queryAll.json`);
}

//上传模型
export const postSymbol = (param) => {
  return axios({
    method: 'post',
    url: `${ServiceConfig.Planconmanage}/sys/uploadArchive.json`,
    data: param
  });
}

//导出Excel
export const getExcelExport = (param) => {
  return axios({
    method: 'post',
    data: param,
    url: `${ServiceConfig.Planconmanage}/seo/exportExl`,
  })
}



//资源目录树操作
export const getServiceList = (options, option, onsucc, onfail, onerror, formattype, serviceType) => {
  var url = `${SgsConfig.GetServiceNodes}/${options.resId}?.json`
  url += "?" + "type=" + formattype; //目录规则
  url += "&" + "itypes=" + option.itypes; //接口类型
  if (options) {
    var catalogInfoKey = options.catalogNodeInfo.catalogType.value;
    url += "&" + "catalogInfo=" + catalogInfoKey + ":" + options.catalogNodeInfo.catalogCode; //当前目录信息
    if (options.parentCategoryNodeInfos != null && options.parentCategoryNodeInfos.length > 0) {
      url += "&" + "parGategoryCatalog=";
      var parGategoryCatalog = "";
      for (var i = 0; i < options.parentCategoryNodeInfos.length; i++) {
        var parGategoryCatalogKey = options.parentCategoryNodeInfos[i].catalogType.value;
        parGategoryCatalog += parGategoryCatalogKey + ":" + options.parentCategoryNodeInfos[i].catalogCode;
        if (i != options.parentCategoryNodeInfos.length - 1) {
          parGategoryCatalog += ",";
        }
      }
      url += parGategoryCatalog;
    }
  }

  return axios({
    method: 'get',
    url: url
  })
}


export const getCatalogNodes = (options, option, onsucc, onfail, onerror, formattype, serviceType) => {
  var url = `${SgsConfig.GetCatalogNodes}`
  url += "?" + "type=" + formattype; //目录规则
  url += "&" + "itypes=" + option.itypes; //接口类型
  if (options) {
    url += "&" + "catalogInfo=" + options.catalogNodeInfo.catalogType.value + ":" + options.catalogNodeInfo.catalogCode; //当前目录信息
    if (options.parentCategoryNodeInfos != null && options.parentCategoryNodeInfos.length > 0) {
      url += "&" + "parGategoryCatalog=";
      var parGategoryCatalog = "";
      for (var i = 0; i < options.parentCategoryNodeInfos.length; i++) {
        var parGategoryCatalogKey = options.parentCategoryNodeInfos[i].catalogType.value;
        parGategoryCatalog += parGategoryCatalogKey + ":" + options.parentCategoryNodeInfos[i].catalogCode;
        if (i != options.parentCategoryNodeInfos.length - 1) {
          parGategoryCatalog += ",";
        }
      }
      url += parGategoryCatalog;
    }

  }
  return axios({
    method: 'get',
    url: url
  })
}

export const getResourceNodes = (options, option, onsucc, onfail, onerror, formattype, serviceType) => {
  var url = `${SgsConfig.GetResourceNodes}`
  url += "?" + "type=" + formattype; //目录规则
  url += "&" + "itypes=" + option.itypes; //接口类型
  if (options) {
    url += "&" + "catalogInfo=" + options.catalogNodeInfo.catalogType.value + ":" + options.catalogNodeInfo.catalogCode; //当前目录信息
    if (options.parentCategoryNodeInfos != null && options.parentCategoryNodeInfos.length > 0) {
      url += "&" + "parGategoryCatalog=";
      var parGategoryCatalog = "";
      for (var i = 0; i < options.parentCategoryNodeInfos.length; i++) {
        var parGategoryCatalogKey = options.parentCategoryNodeInfos[i].catalogType.value;
        parGategoryCatalog += parGategoryCatalogKey + ":" + options.parentCategoryNodeInfos[i].catalogCode;
        if (i != options.parentCategoryNodeInfos.length - 1) {
          parGategoryCatalog += ",";
        }
      }
      url += parGategoryCatalog;
    }

  }
  return axios({
    method: 'get',
    url: url
  })
}

//资源树查询

export const searchResource = (param) => {
  return axios.get(`${SgsConfig.SearchResource}`, {
    params: param || {}
  })
}

export const searchFullResource = (param) => {
  return axios.get(`${SgsConfig.SearchFullResource}.json?includeService=false`, {
    params: param || {}
  })
}

/*
获取资源根节点
*/
export const getRootTheme = () => {
  return axios.get(`${SgsConfig.GetRootTheme}`)
}

export const getChildTheme = (id) => {
  return axios.get(`${SgsConfig.GetChildTheme}/${id}.json?datacount=true`)
}

export const apiGetUserInfo = () => {
  return axios.get(`${GeoesbService}/servicemanager/user/current.json`);
}

export const apiBaseMap = () => {
  return new Promise((resolve, reject) => {
    jsonp(`${MapService}/map/manager/query.jsonp?pageindex=1&pageSize=1000&userid=41`, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data);
      }
    })
  })
}

// 获取场景标注
export const getSceneLabel = () => {
  return axios({
    method: 'get',
    url: `${MapService}/userMarker/getMarkerRecords/100.json`,
    data: {}
  });
}
// 添加场景标注
export const addSceneLabel = (param) => {
  return axios({
    method: 'post',
    url: `${MapService}/userMarker/addMarkerRecord`,
    data: param
  });
}
// 删除场景标注
export const delSceneLabel = (pkid) => {
  return axios({
    method: 'post',
    url: `${MapService}/userMarker/deleteMarkerRecord/?pkid=` + pkid
  });
}

// 获取图层信息
export const getMapLayer = (url) => {
  return axios({
    method: 'get',
    url: `/webframe/biz/httpproxy/httpproxy.jsp?url=` + url + `/layers.json`
  });
}
export const getMapData = (url) => {
  return axios({
    method: 'get',
    url: `/webframe/biz/httpproxy/httpproxy.jsp?url=` + url
  });
}

export const apiAddBaseMap = (param) => {
  return axios({
    method: 'post',
    url: `${MapService}/map/manager/add.jsonp`,
    data: param
  });
}

export const updateBaseMap = (param) => {
  return axios({
    method: 'put',
    url: `${MapService}/map/manager/update.jsonp`,
    data: param
  });
}

export const apiDeleteBaseMap = (param) => {
  return axios({
    method: 'delete',
    url: `${MapService}/map/manager/remove/`+param+`.jsonp`,
  });
}

// export const apiBaseMap = () => {
//     return new Promise((resolve, reject) => {
//         return axios.get('http://192.168.200.208:8080/appframework/services/map/manager/query.json?pagesize=10&pageindex=1&userid=41').
//                 then((res) => {
//                     console.log(res);
//                     resolve(res.data);
//                 })
//     })
// }
//

//按资源ID查询服务
export const apiServiceCatalogByResID = (id) => {
  return axios.get(`${GeoesbService}/resource/serinfo/interfaces/${id}.json`, {
    showall: false
  })
}

//查询服务时间
export const apiServiceCatalogVersionByID = (id, key) => {
  return axios.get(`${GeoesbService}/resource/serinfo/versions/${id}/${key}.json`, {
    showall: false
  })
}

//查询服务信息
export const apiServiceCatalogServiceByID = (id) => {
  return axios.get(`${GeoesbService}/resource/data/serinfo/${id}.json`, {
    flag: 1
  })
}

export const apiWMTSCapality = (param) => {
  return axios.get(`${GeoesbService}/servicanalysis/WMTS100/capality.json`, {
    params: param || {}
  });
}

export const apiServiceMetadata = (serviceId) => {
  return axios.get(`${GeoesbService}/resource/metadata/serinfo/${serviceId}.xml`)
}

export const apiBufferService = (param) => {
  param = Object.assign({
    endType: 'ROUND',
    leftDistance: 5,
    rightDistance: 5,
    semicircleLineSegment: 10
  }, param);
  return axios.get(`${ServiceConfig.httpproxy}?url=${DFCService}/analyst/buffer.json?`, { params: param });
}

//地名地址匹配
export const fuzzyAddress = (param,url) => {
  return axios.get(`${ServiceConfig.httpproxy}?url=`+url+'?',{
    params: param || {}
  })
}

//获取空间信息
export const getDistrict = (code) => {
  return axios.get(`${GeoEntityService}/district/${code}.json`)
}


//获取下级区划目录
export const getChildDistrict = (param) => {
    return axios.get(`${GeoEntityService}/district/entity.json`,
        { params: param || {}})
}

//设置地图显示范围
export const updateMap = (param) => {
    return axios.put(`${MapService}/map/manager/update.jsonp`,
        param)

}

export const apiServiceOriginUrl = (id) => {
  return axios.get(`${GeoesbService}/service/originUrl/${id}.json`);
}

export const apiScenesList = (sceneUrl) => {
  return axios.get(`${ServiceConfig.httpproxy}?url=${sceneUrl}/scenes.json`);
}

export const apiProxyUrl = (url) => {
  return axios.get(`${ServiceConfig.httpproxy}?url=${url}`);
}
//获取模块
export const getModules = (url) => {
  return axios.get(`${GeoesbService}/${url}`);
}
//实时监控专题统计
export const getThemeStat = (url,param) => {
  return axios({
    method: 'post',//${ServiceConfig.httpproxy}
    url: `/webframe/biz/httpproxy/httpproxy.jsp?url=${url}`,
    data: param
  });
}

//查询楼房详情
export const apiServiceBuildingUrl = (buildingno) => {
  return axios.get(`${MapService}/building/${buildingno}.json`);
}

export const getSignalling = (params)=>{
    return axios.post(`/webframe/biz/httpproxy/httpproxy.jsp?url=${ESURL}/signalling/_search`,params);
}

export const getSensorDataCollect = (params)=>{
    return axios.post(`/webframe/biz/httpproxy/httpproxy.jsp?url=${ESURL}/iot_sensordatacollect/_search`,params);
}
export const getSensor = (params)=>{
    return axios.post(`/webframe/biz/httpproxy/httpproxy.jsp?url=${ESURL}/iot_sensor/_search`,params);
}
export const apicurStyle = () => {
  return axios.get(`${GeoesbService}/customstyle/style/cur.json`);
}
