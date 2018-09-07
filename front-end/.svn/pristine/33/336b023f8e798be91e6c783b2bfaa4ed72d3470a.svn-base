/**
 * [serviceInfos过滤排序函数]
 * @param  {[type]} serviceInfos  [description]
 * @param  {Array}  sortArr       [过滤排序数组， 类型出现的顺序将决定过滤后的顺序]
 * @return {[type]}               [description]
 */
const sortServiceInfos = (serviceInfos, sortArr = ['SMRESTMAP', 'WMS111', 'WMS130', 'WMTS100', 'SGSWMTS100']) => {
	let filterService = serviceInfos.filter((item, index) => {
    return sortArr.indexOf(item.interfaceType.value) > -1;
  })

  if (!filterService) {
    return null;
  }

  filterService.sort((service1, service2) => {
    let pos1 = sortArr.indexOf(service1.interfaceType.value),
        pos2 = sortArr.indexOf(service2.interfaceType.value);
    if (pos1 < pos2 ) {
      return -1;
    } else if (pos1 > pos2) {
      return 1;
    } else if (pos1 == pos2) {
      //新增同类型的根据注册的version排序
      if (new Date(service1.version) >= new Date(service2.version)) {
        return -1;
      } else {
        return 1;
      }
    } else {
      return 0;
    }
  })

  return filterService;
}

export {
  sortServiceInfos
}
