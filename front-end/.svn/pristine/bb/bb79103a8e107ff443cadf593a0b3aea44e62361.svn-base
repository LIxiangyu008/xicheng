import { apiScenesList, apiProxyUrl } from '@/apis/api'

/**
 * 根据给定的地图范围获取三维高度
 * @param  {[LatLngBounds]} bounds [地图范围]
 * @return {[type]}        [高度]
 */
const calculateAltitudeFromBounds = (bounds) => {
  let _PI = 3.1415926,
    _earthRadius = 6378137,
    altitude = _earthRadius,
    boundsWidth = bounds.getEast() - bounds.getWest();
  if (boundsWidth >= 120) {
    altitude = _earthRadius * boundsWidth / 60 - _earthRadius;
  } else if (boundsWidth != 0) {
    let angle1 = (boundsWidth / 360) * _PI;
    let height = Math.sin(angle1) * _earthRadius;
    let a = height / Math.tan(angle1);
    let b = height / Math.tan(_PI / 6);
    altitude = a + b - _earthRadius;
  }
  return altitude;
}

/**
 * 根据给定的场景高度计算地图中显示范围的宽度
 * @param  {[type]} altitude [description]
 * @return {[type]}          [description]
 */
const calculateSizeFromAltitude = (altitude) => {
  let _PI = 3.1415926,
    _earthRadius = 6378137,
    size;
  if (altitude >= _earthRadius) { //当场景高度大于可全幅显示整球的高度时
    let ratio = (altitude + _earthRadius) * 0.5;
    size = 120 * ratio / _earthRadius
  } else { //当场景高度小于可全幅显示整球的高度时，即无法看到整球时
    let tan30 = Math.tan(_PI / 6);
    //设置方程组的a,b,c
    let a = (Math.pow(tan30, 2) + 1) * Math.pow(_earthRadius, 2);
    let b = -2 * (_earthRadius + altitude) * _earthRadius * Math.pow(tan30, 2);
    let c = Math.pow(tan30, 2) * Math.pow(_earthRadius + altitude, 2) - Math.pow(_earthRadius, 2.0);
    //解一元二次方程，取锐角，因此余弦值较大
    let cosd = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
    let d = Math.acos(cosd);
    let widthd = 2 * d * _earthRadius;
    size = (widthd / (_PI * _earthRadius)) * 180;
  }
  return size;
}

/**
 * @param  {promise 返回layer对象}
 * @return {[type]}
 */
const getBoundsFromPromisesLayer = (layers) => {
  let locationLayersBounds = [], layerBounds;
  for (let i = 0; i < layers.length; i++) {
    //场景含多个s3m图层
    if (Array.isArray(layers[i])) {
      let s3mLayers = layers[i];
      for (let j = 0; j < s3mLayers.length; j++) {
        if (s3mLayers[j] instanceof Cesium.S3MTilesLayer) {
          locationLayersBounds.push(getBoundsFromLayer(s3mLayers[j]));
        }
      }
    } else if (layers[i] instanceof Cesium.S3MTilesLayer) {
      locationLayersBounds.push(getBoundsFromLayer(layers[i]));
    }
  }

  return Cesium.BoundingSphere.fromBoundingSpheres(locationLayersBounds);
}

/**
 * @param  {S3MTilesLayer}
 * @return {[type]}
 */
const getBoundsFromLayer = (layer) => {
  if (!layer) {
    return null
  }

  let bounds = layer.layerBounds;
  if(!bounds){
    let extend = 0.1;
    let left = Cesium.Math.toRadians(layer.lon - extend);
    let right = Cesium.Math.toRadians(layer.lon + extend);
    let top = Cesium.Math.toRadians(layer.lat + extend);
    let bottom = Cesium.Math.toRadians(layer.lat - extend);
    bounds = new Cesium.Rectangle(left,bottom,right,top);
  }
  return Cesium.BoundingSphere.fromRectangle3D(bounds);
}

const getScenesInfo = (sceneUrl) => {

  return new Promise((resolve, reject) => {
    apiScenesList(sceneUrl).then(({data}) => {
      console.log(data);
      if (!data || !data.length) {
        resolve(null);
      } else {
        apiProxyUrl(data[0].path + '.json').then((sceneInfo) => {
          resolve(sceneInfo);
        })
        .catch((e) => {
          reject(e);
        })
      }
    })
    .catch((e) => {
      reject(e);
    })
  })


}

export {
  calculateAltitudeFromBounds,
  calculateSizeFromAltitude,
  getBoundsFromLayer,
  getBoundsFromPromisesLayer,
  getScenesInfo
}
