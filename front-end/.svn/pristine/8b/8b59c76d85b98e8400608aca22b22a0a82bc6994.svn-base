import L from 'leaflet'

L.Control.BufferBtn = L.Control.extend({
  options: {
    position: 'topleft',
    btnText: '<i class="el-icon-edit-outline" title="选择启用缓冲区分析"></i>',
  },
  initialize: function(options) {
    L.Util.extend(this.options, options);
  },
  onAdd: function(map) {
    let container = L.DomUtil.create('div', 'leaflet-bufferbtn-control leaflet-bar');
    container.innerHTML = this.options.btnText;

    this._initEvent(container);

    return container;
  },
  _initEvent(container) {
    let stop = L.DomEvent.stopPropagation;
    L.DomEvent
      .on(container, 'click', stop)
      .on(container, 'mousedown', stop)
      .on(container, 'dblclick', stop)
      .on(container, 'click', this.options.fn);
  }
})

L.control.bufferbtn = (options) => {
  return new L.Control.BufferBtn(options);
}
