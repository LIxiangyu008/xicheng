import L from 'leaflet'

const convertLayerToBufferParams = (layer) => {
  let coords = layer._latlngs,
    params = '';

    if (layer instanceof L.Marker) {
      params = layer._latlng.lng + ',' + layer._latlng.lat;
    } else if (layer instanceof L.Polygon) {
      let firstPoint;
      coords.forEach((feature, featureIndex) => {
        feature.forEach((item, itemIndex) => {
          if (featureIndex == 0 && itemIndex == 0) {
            firstPoint = item.lng + ',' + item.lat + ';';
          }
          params += item.lng + ',' + item.lat + ';';
        })
      })
      params += firstPoint;
    } else if (layer instanceof L.Polyline) {
      coords.forEach((item) => {
        params += item.lng + ',' + item.lat + ';';
      })
    }

    return params;
}

const convertBufferToLayer = (buffer, type) => {
  if (!buffer) {
    return null;
  }

  let pointArr = buffer.split(' '),
    coordsArr = [];
  pointArr.forEach((item) => {
    coordsArr.push([item.split(',')[1], item.split(',')[0]]);
  })
  return L.polygon(coordsArr);
}

export {
  convertBufferToLayer,
  convertLayerToBufferParams
}
