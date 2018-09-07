const MAPRADIUS = 6371000; //默认地球半径

const convertMeterToRealLength = (meter, CRS) => {
	//平面坐标系无获取单位方法
	if (!CRS.projection.getUnits || CRS.projection.getUnits() == 'meter') {
		return meter;
	} else {
		//米转度
		return meter / (Math.PI * 2 * MAPRADIUS / 360);
	}
}

export {
	convertMeterToRealLength
}