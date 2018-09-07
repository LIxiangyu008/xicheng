// import { SuperMap, QueryService, FeatureService, QueryBySQLParameters,
// 		 DataFormat , QueryByDistanceParameters, QueryByGeometryParameters, LayerInfoService} from '@supermap/iclient-leaflet'
// import * as sm from '@supermap/iclient-leaflet';
// console.log(sm);
import L from 'leaflet';
import './../../../static/lib/iclient9-leaflet.js';
import {
  ServiceConfig
} from "./../../config/app-config.js"

let LayerInfoCacheMap = {}; //layerInfo缓存

// export const smFindBySql = ({ url = '', dataSourceName = '', dataSetName = '', sql = '', options = {} }) => {
// 	let params = new GetFeaturesBySQLParameters(Object.assign(options, {
// 		queryParameter: {
// 			name: `${dataSetName}@${dataSourceName}`,
// 			attributeFilter: sql
// 		},
// 		datasetNames: [`${dataSourceName}:${dataSetName}`]
// 	}))
// 	return new Promise((resolve, reject) => {
// 		new FeatureService(url).getFeaturesBySQL(params, (serviceResult) => {
// 			resolve(serviceResult);
// 		})
// 	})
// }

// export const smRestMapFindBySql = ({ url = '', dataSourceName = '', dataSetName = '', sql = '', options = {} }) => {
// 	let params = new QueryBySQLParameters(Object.assign({
// 		queryParams: {
// 			name: `${dataSetName}@${dataSourceName}`,
// 			attributeFilter: sql
// 		},
// 		expectCount: 20
// 	}, options));
// 	return new Promise((resolve, reject) => {
// 		new QueryService(url).queryBySQL(params, (result) => {
// 			result = transformIServerData(result);
// 			resolve(result);
// 		}, DataFormat.ISERVER)
// 	})
// }

// export const smRestMapFindByDistance = ({ url = '', options = {}}) => {
// 	let params = new QueryByDistanceParameters(Object.assign({
// 		isNearest: true,
// 		distance: 0.000105,
// 		expectCount: 10
// 	}, options));
// 	return new Promise((resolve, reject) => {
// 		new QueryService(url).queryByDistance(params, (result) => {
// 			result = transformIServerData(result);
// 			resolve(result);
// 		}, DataFormat.ISERVER);
// 	})
// }



// export const smRestMapFindByGeometry = ({ url = '', options = {}}) => {
// 	let params = new QueryByGeometryParameters(Object.assign({
// 		expectCount: 10
// 	}, options));
// 	return new Promise((resolve, reject) => {
// 		new QueryService(url).queryByDistance(params, (result) => {
// 			result = transformIServerData(result);
// 			resolve(result);
// 		}, DataFormat.ISERVER);
// 	})
// }

export const smFindBySql = ({
  url = '',
  dataSourceName = '',
  dataSetName = '',
  sql = '',
  options = {}
}) => {
  let params = new SuperMap.GetFeaturesBySQLParameters(Object.assign(options, {
    queryParameter: {
      name: `${dataSetName}@${dataSourceName}`,
      attributeFilter: sql
    },
    datasetNames: [`${dataSourceName}:${dataSetName}`]
  }))
  return new Promise((resolve, reject) => {
    // L.supermap.featureService(`${ServiceConfig.httpproxy}` + "?url=" + url).getFeaturesBySQL(params, (serviceResult) => {
    L.supermap.featureService(url).getFeaturesBySQL(params, (serviceResult) => {
      resolve(serviceResult);
    })
  })
}

export const smRestMapFindBySql = ({
  url = '',
  dataSourceName = '',
  dataSetName = '',
  sql = '',
  options = {}
}) => {
  let params = new SuperMap.QueryBySQLParameters(Object.assign({
    queryParams: {
      name: `${dataSetName}@${dataSourceName}`,
      attributeFilter: sql
    },
    expectCount: 20
  }, options));
  return new Promise((resolve, reject) => {
    // L.supermap.queryService(`${ServiceConfig.httpproxy}` + "?url=" + url).queryBySQL(params, (result) => {
    // why
    L.supermap.queryService(url).queryBySQL(params, (result) => {
      result = transformIServerData(result);
      resolve(result);
    }, 'ISERVER')
  })
}

export const smRestMapFindByDistance = ({
  url = '',
  name = "",
  geometry = null,
  options = {}
}) => {
  let params = new SuperMap.QueryByDistanceParameters(Object.assign({
    isNearest: true,
    distance: 0.000105,
    queryParams: {
      name: name
    },
    expectCount: 10,
    returnContent: true
  }, options));
  return new Promise((resolve, reject) => {
    // L.supermap.queryService(`${ServiceConfig.httpproxy}` + "?url=" + url).queryByDistance(params, (result) => {
    L.supermap.queryService(url).queryByDistance(params, (result) => {
      result = transformIServerData(result);
      resolve(result);
    }, 'ISERVER');
  })
}

/*`${ServiceConfig.httpproxy}`+"?url="+*/
export const smQueryLayerInfo = function(url){
  return new Promise((resolve, reject) => {
    if (LayerInfoCacheMap[url]) {
      resolve(LayerInfoCacheMap[url]);
    } else {
      L.supermap.layerInfoService(url).getLayersInfo((result) => {
        LayerInfoCacheMap[url] = result;
        resolve(result);
      })
    }
  })
};

/*`${ServiceConfig.httpproxy}` + "?url=" +*/
export const smRestMapFindByGeometry = ({ url = '',name = [] , geometry = null, options = {}}) => {
  let params = new SuperMap.QueryByGeometryParameters(Object.assign({
    expectCount: 10,
    queryParams: name,
  }, options));
  return new Promise((resolve, reject) => {
    L.supermap.queryService(url).queryByGeometry(params, (result) => {
      result = transformIServerData(result);
      resolve(result);
    }, 'ISERVER');
  })
}

function transformIServerData(result) {
  result = result.result;
  if (result && result.recordsets && result.recordsets.length) {
      let geoJSONFormat = new SuperMap.Format.GeoJSON();
      for (let i = 0;i < result.recordsets.length; i++) {
        if (result.recordsets[i].features && result.recordsets[i].features.length) {
          let fea = result.recordsets[i].features;
          result.recordsets[i].features = fea.filter((feature) => {
            feature.fieldNames = result.recordsets[i].fieldCaptions
            return  feature.geometry.type != "REGION3D"
          })
          if(result.recordsets[i].features && result.recordsets[i].features.length){
            result.recordsets[i].features = JSON.parse(geoJSONFormat.write(result.recordsets[i].features));
          }
        }
      }

  }
  return result;
}
