import L from 'leaflet'

L.Control.QueryBtn = L.Control.extend({
  options: {
    position: 'topleft',
    btnText: '<i class="el-icon-edit-outline" title="选择查询图形"></i>',
  },
  initialize: function(options) {
    L.Util.extend(this.options, options);
  },
  onAdd: function(map) {
    let container = L.DomUtil.create('div', 'leaflet-querybtn-control leaflet-bar');
    container.innerHTML = this.options.btnText;

    this._initEvent(container);

    return container;
  },
  _initEvent(container) {
    let stop = L.DomEvent.stopPropagation;
    let that = this;
    L.DomEvent
      .on(container, 'click', stop)
      .on(container, 'mousedown', stop)
      .on(container, 'dblclick', stop)
      .on(container, 'click', function(e) {
        let _container = that._map._container;
        that.options.fn(that._map, e);
      });
  }
})

L.control.querybtn = (options) => {
  return new L.Control.QueryBtn(options);
}
