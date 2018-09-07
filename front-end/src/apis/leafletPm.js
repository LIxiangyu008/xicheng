"use strict";var DragMixin={_initDraggableLayer:function(){this._tempDragCoord=null;var t=this._layer._path;L.DomUtil.addClass(t,"leaflet-pm-draggable"),this._layer.on("mousedown",this._dragMixinOnMouseDown,this)},_dragMixinOnMouseUp:function(){var t=this,e=this._layer._path;return this._layer._map.dragging.enable(),this._layer._map.off("mousemove",this._dragMixinOnMouseMove,this),this._layer.off("mouseup",this._dragMixinOnMouseUp,this),!!this._dragging&&(this._initMarkers(),window.setTimeout(function(){t._dragging=!1,L.DomUtil.removeClass(e,"leaflet-pm-dragging"),t._layer.fire("pm:dragend"),t._fireEdit()},10),!0)},_dragMixinOnMouseMove:function(t){var e=this._layer._path;this._dragging||(this._dragging=!0,L.DomUtil.addClass(e,"leaflet-pm-dragging"),this._layer.bringToFront(),this._layer._map.dragging.disable(),this._markerGroup.clearLayers(),this._layer.fire("pm:dragstart")),this._onLayerDrag(t)},_dragMixinOnMouseDown:function(t){this._tempDragCoord=t.latlng,this._layer.on("mouseup",this._dragMixinOnMouseUp,this),this._layer._map.on("mousemove",this._dragMixinOnMouseMove,this)},dragging:function(){return this._dragging},_onLayerDrag:function(t){var e=t.latlng,i={lat:e.lat-this._tempDragCoord.lat,lng:e.lng-this._tempDragCoord.lng},a=void 0;a=this._layer instanceof L.Polygon?this._layer._latlngs[0]:this._layer._latlngs;var n=a.map(function(t){var e={lat:t.lat+i.lat,lng:t.lng+i.lng};return e});this._layer.setLatLngs(n).redraw(),this._tempDragCoord=e,this._layer.fire("pm:drag")}},OverlapMixin={_applyPossibleCoordsChanges:function(){if(this._tempPolygon){var t=this._tempPolygon.getLayers()[0].getLatLngs();this._poly.setLatLngs(t).redraw(),this._initMarkers()}},_drawTemporaryPolygon:function(t){this._poly.setStyle({opacity:0,fillOpacity:0}),this._tempPolygon=L.geoJson(t).addTo(this._poly._map).bringToBack()},_handleOverlap:function(){var t=this._poly,e=this._layerGroup.getLayers(),i=!1,a=this._poly.toGeoJSON();e.filter(function(e){return!Object.is(e,t)}).map(function(t){var e=void 0;try{e=turf.intersect(a,t.toGeoJSON())}catch(n){console.warn("Turf Error.")}return e&&(a=turf.difference(a,t.toGeoJSON()),"MultiPolygon"!==a.geometry.type&&(i=!0)),!0}),this._tempPolygon&&(this._tempPolygon.remove(),delete this._tempPolygon),i?this._drawTemporaryPolygon(a):this._poly.setStyle({opacity:1,fillOpacity:.2})}},SnapMixin={_initSnappableMarkers:function(){var t=this;this.options.snapDistance=this.options.snapDistance||30,this._markers.forEach(function(e){e.off("drag",t._handleSnapping,t),e.on("drag",t._handleSnapping,t),e.off("dragend",t._cleanupSnapping,t),e.on("dragend",t._cleanupSnapping,t)}),this._layer.off("pm:dragstart",this._unsnap,this),this._layer.on("pm:dragstart",this._unsnap,this)},_unsnap:function(){delete this._snapLatLng},_cleanupSnapping:function(){delete this._snapList,this.debugIndicatorLines&&this.debugIndicatorLines.forEach(function(t){t.remove()})},_handleSnapping:function(t){if(t.originalEvent.altKey)return!1;if(void 0===this._snapList&&this._createSnapList(t),this._snapList.length<=0)return!1;var e=t.target,i=this._calcClosestLayer(e.getLatLng(),this._snapList),a=i.layer instanceof L.Marker||i.layer instanceof L.CircleMarker,n=void 0;n=a?i.latlng:this._checkPrioritiySnapping(i);var r=this.options.snapDistance,s={marker:e,snapLatLng:n,segment:i.segment,layer:this._layer,layerInteractedWith:i.layer};return i.distance<r?(e.setLatLng(n),e._snapped=!0,this._snapLatLng!==n&&(this._snapLatLng=n,e.fire("pm:snap",s),this._layer.fire("pm:snap",s))):this._snapLatLng&&(this._unsnap(s),e._snapped=!1,s.marker.fire("pm:unsnap",s),this._layer.fire("pm:unsnap",s)),!0},_checkPrioritiySnapping:function(t){var e=this._map,i=t.segment[0],a=t.segment[1],n=t.latlng,r=this._getDistance(e,i,n),s=this._getDistance(e,a,n),o=r<s?i:a,l=r<s?r:s,h=this.options.snapDistance,_=void 0;return _=l<h?o:n,Object.assign({},_)},_createSnapList:function(){var t=this,e=[],i=[],a=this._map;a.eachLayer(function(t){if(t instanceof L.Polyline||t instanceof L.Marker||t instanceof L.CircleMarker){e.push(t);var a=L.polyline([],{color:"red"});i.push(a)}}),e=e.filter(function(e){return t._layer!==e}),e=e.filter(function(t){return t._latlng||t._latlngs.length>0}),e=e.filter(function(t){return!t._pmTempLayer}),this._otherSnapLayers?this._snapList=e.concat(this._otherSnapLayers):this._snapList=e,this.debugIndicatorLines=i},_calcClosestLayer:function(t,e){var i=this,a={};return e.forEach(function(e,n){var r=i._calcLayerDistances(t,e);i.debugIndicatorLines[n].setLatLngs([t,r.latlng]),(void 0===a.distance||r.distance<a.distance)&&(a=r,a.layer=e)}),a},_calcLayerDistances:function(t,e){var i=this,a=this._map,n=e instanceof L.Polygon,r=!(e instanceof L.Polygon)&&e instanceof L.Polyline,s=e instanceof L.Marker||e instanceof L.CircleMarker,o=t,l=void 0;if(n)l=e.getLatLngs()[0];else if(r)l=e.getLatLngs();else if(s)return l=e.getLatLng(),{latlng:Object.assign({},l),distance:this._getDistance(a,l,o)};var h=void 0,_=void 0;l.forEach(function(t,e){var r=t,s=void 0;s=n?e+1===l.length?0:e+1:e+1===l.length?void 0:e+1;var p=l[s];if(p){var c=i._getDistanceToSegment(a,o,r,p);(void 0===_||c<_)&&(_=c,h=[r,p])}return!0});var p=this._getClosestPointOnSegment(a,t,h[0],h[1]);return{latlng:Object.assign({},p),segment:h,distance:_}},_getClosestPointOnSegment:function(t,e,i,a){var n=t.getMaxZoom();n===1/0&&(n=t.getZoom());var r=t.project(e,n),s=t.project(i,n),o=t.project(a,n),l=L.LineUtil.closestPointOnSegment(r,s,o);return t.unproject(l,n)},_getDistanceToSegment:function(t,e,i,a){var n=t.latLngToLayerPoint(e),r=t.latLngToLayerPoint(i),s=t.latLngToLayerPoint(a);return L.LineUtil.pointToSegmentDistance(n,r,s)},_getDistance:function(t,e,i){return t.latLngToLayerPoint(e).distanceTo(t.latLngToLayerPoint(i))}};L.PM=L.PM||{version:"0.14.0",initialize:function(){this.addInitHooks()},addInitHooks:function(){function t(){this.pm=new L.PM.Edit.LayerGroup(this)}function e(){this.pm=new L.PM.Edit.Marker(this)}function i(){this.pm=new L.PM.Edit.Poly(this)}function a(){this.pm=new L.PM.Edit.Line(this)}function n(){this.pm=new L.PM.Edit.Circle(this)}function r(){this.pm=new L.PM.Map(this)}L.LayerGroup.addInitHook(t),L.Marker.addInitHook(e),L.Polygon.addInitHook(i),L.Polyline.addInitHook(a),L.Circle.addInitHook(n),L.Map.addInitHook(r)}},L.PM.initialize(),L.PM.Map=L.Class.extend({initialize:function(t){this.map=t,this.Draw=new L.PM.Draw(t),this.Toolbar=new L.PM.Toolbar(t)},addControls:function(t){this.Toolbar.addControls(t)},removeControls:function(){this.Toolbar.removeControls()},toggleControls:function(){this.Toolbar.toggleControls()},controlsVisible:function(){return this.Toolbar.isVisible},enableDraw:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Poly",e=arguments[1];this.Draw.enable(t,e)},disableDraw:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"Poly";this.Draw.disable(t)},setPathOptions:function(t){this.Draw.setPathOptions(t)},removeLayer:function(t){var e=t.target;e._layers||e.pm.dragging()||t.target.remove()},toggleGlobalRemovalMode:function(){var t=this;this.globalRemovalEnabled()?(this._globalRemovalMode=!1,this.map.eachLayer(function(e){e.off("click",t.removeLayer)})):(this._globalRemovalMode=!0,this.map.eachLayer(function(e){e.on("click",t.removeLayer)})),this.Toolbar.toggleButton("deleteLayer",this._globalRemovalMode)},globalRemovalEnabled:function(){return this._globalRemovalMode},globalEditEnabled:function(){return this._globalEditMode},toggleGlobalEditMode:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{snappable:!0,draggable:!0},e=[];this.map.eachLayer(function(t){(t instanceof L.Polyline||t instanceof L.Marker||t instanceof L.Circle)&&e.push(t)}),e=e.filter(function(t){return!!t.pm}),e=e.filter(function(t){return!t._pmTempLayer}),this.globalEditEnabled()?(this._globalEditMode=!1,e.forEach(function(t){t.pm.disable()})):(this._globalEditMode=!0,e.forEach(function(e){e.pm.enable(t)})),this.Toolbar.toggleButton("editPolygon",this._globalEditMode)}}),L.PM.Draw=L.Class.extend({includes:[SnapMixin],options:{snappable:!0,snapDistance:20,finishOnDoubleClick:!1,templineStyle:{color:"red"},hintlineStyle:{color:"red",dashArray:[5,5]},markerStyle:{draggable:!0}},initialize:function(t){var e=this;this._map=t,this.shapes=["Poly","Line","Marker","Circle"],this.shapes.forEach(function(t){e[t]=new L.PM.Draw[t](e._map)})},setPathOptions:function(t){this.options.pathOptions=t},getShapes:function(){return this.shapes},enable:function(t,e){if(!t)throw new Error("Error: Please pass a shape as a parameter. Possible shapes are: "+this.getShapes().join(","));this.disable(),this[t].enable(e)},disable:function(){var t=this;this.shapes.forEach(function(e){t[e].disable()})},addControls:function(){var t=this;this.shapes.forEach(function(e){t[e].addButton()})}}),L.PM.Edit=L.Class.extend({includes:[DragMixin,SnapMixin]}),L.PM.Draw.Circle=L.PM.Draw.extend({initialize:function(t){this._map=t,this._shape="Circle",this.toolbarButtonName="drawCircle"},enable:function(t){L.Util.setOptions(this,t),this.options.radius=0,this._enabled=!0,this._layerGroup=new L.LayerGroup,this._layerGroup.addTo(this._map),this._layer=L.circle([0,0],this.options.templineStyle),this._layer._pmTempLayer=!0,this._layerGroup.addLayer(this._layer),this._centerMarker=L.marker([0,0],{icon:L.divIcon({className:"marker-icon"}),draggable:!0,zIndexOffset:100}),this._centerMarker._pmTempLayer=!0,this._layerGroup.addLayer(this._centerMarker),this._hintMarker=L.marker([0,0],{icon:L.divIcon({className:"marker-icon cursor-marker"})}),this._hintMarker._pmTempLayer=!0,this._layerGroup.addLayer(this._hintMarker),this.options.cursorMarker&&L.DomUtil.addClass(this._hintMarker._icon,"visible"),this._hintline=L.polyline([],this.options.hintlineStyle),this._hintline._pmTempLayer=!0,this._layerGroup.addLayer(this._hintline),this._map._container.style.cursor="crosshair",this._map.on("click",this._placeCenterMarker,this),this._map.on("mousemove",this._syncHintMarker,this),this._map.fire("pm:drawstart",{shape:this._shape}),this._map.pm.Toolbar.toggleButton(this.toolbarButtonName,!0),this._otherSnapLayers=[]},disable:function(){this._enabled&&(this._enabled=!1,this._map._container.style.cursor="default",this._map.off("click",this._finishShape,this),this._map.off("click",this._placeCenterMarker,this),this._map.off("mousemove",this._syncHintMarker,this),this._map.removeLayer(this._layerGroup),this._map.fire("pm:drawend",{shape:this._shape}),this._map.pm.Toolbar.toggleButton(this.toolbarButtonName,!1),this.options.snappable&&this._cleanupSnapping())},enabled:function(){return this._enabled},toggle:function(t){this.enabled()?this.disable():this.enable(t)},_syncHintLine:function(){var t=this._centerMarker.getLatLng();this._hintline.setLatLngs([t,this._hintMarker.getLatLng()])},_syncCircleRadius:function(){var t=this._centerMarker.getLatLng(),e=this._hintMarker.getLatLng(),i=t.distanceTo(e);this._layer.setRadius(i)},_syncHintMarker:function(t){if(this._hintMarker.setLatLng(t.latlng),this.options.snappable){var e=t;e.target=this._hintMarker,this._handleSnapping(e)}},_placeCenterMarker:function(t){this._hintMarker._snapped||this._hintMarker.setLatLng(t.latlng);var e=this._hintMarker.getLatLng();this._centerMarker.setLatLng(e),this._map.off("click",this._placeCenterMarker,this),this._map.on("click",this._finishShape,this),this._placeCircleCenter()},_placeCircleCenter:function(){var t=this._centerMarker.getLatLng();t&&(this._layer.setLatLng(t),this._hintMarker.on("move",this._syncHintLine,this),this._hintMarker.on("move",this._syncCircleRadius,this))},_finishShape:function(){var t=this._centerMarker.getLatLng(),e=this._hintMarker.getLatLng(),i=t.distanceTo(e),a=L.circle(t,{radius:i}).addTo(this._map);this.disable(),this._map.fire("pm:create",{shape:this._shape,layer:a})},_createMarker:function(t){var e=new L.Marker(t,{draggable:!1,icon:L.divIcon({className:"marker-icon"})});return e._pmTempLayer=!0,this._layerGroup.addLayer(e),e}}),L.PM.Draw.Line=L.PM.Draw.extend({initialize:function(t){this._map=t,this._shape="Line",this.toolbarButtonName="drawPolyline"},enable:function(t){L.Util.setOptions(this,t),this._enabled=!0,this._layerGroup=new L.LayerGroup,this._layerGroup.addTo(this._map),this._layer=L.polyline([],this.options.templineStyle),this._layer._pmTempLayer=!0,this._layerGroup.addLayer(this._layer),this._hintline=L.polyline([],this.options.hintlineStyle),this._hintline._pmTempLayer=!0,this._layerGroup.addLayer(this._hintline),this._hintMarker=L.marker([0,0],{icon:L.divIcon({className:"marker-icon cursor-marker"})}),this._hintMarker._pmTempLayer=!0,this._layerGroup.addLayer(this._hintMarker),this.options.cursorMarker&&L.DomUtil.addClass(this._hintMarker._icon,"visible"),this._map._container.style.cursor="crosshair",this._map.on("click",this._createVertex,this),this.options.finishOnDoubleClick&&this._map.on("dblclick",this._finishShape,this),this._map.on("mousemove",this._syncHintMarker,this),this._hintMarker.on("move",this._syncHintLine,this),this._map.fire("pm:drawstart",{shape:this._shape}),this._map.pm.Toolbar.toggleButton(this.toolbarButtonName,!0),this._otherSnapLayers=[]},disable:function(){this._enabled&&(this._enabled=!1,this._map._container.style.cursor="default",this._map.off("click",this._createVertex,this),this._map.off("mousemove",this._syncHintMarker,this),this._map.off("dblclick",this._finishShape,this),this._map.removeLayer(this._layerGroup),this._map.fire("pm:drawend",{shape:this._shape}),this._map.pm.Toolbar.toggleButton(this.toolbarButtonName,!1),this.options.snappable&&this._cleanupSnapping())},enabled:function(){return this._enabled},toggle:function(t){this.enabled()?this.disable():this.enable(t)},_syncHintLine:function(){var t=this._layer.getLatLngs();if(t.length>0){var e=t[t.length-1];this._hintline.setLatLngs([e,this._hintMarker.getLatLng()])}},_syncHintMarker:function(t){if(this._hintMarker.setLatLng(t.latlng),this.options.snappable){var e=t;e.target=this._hintMarker,this._handleSnapping(e)}},_createVertex:function(t){this._hintMarker._snapped||this._hintMarker.setLatLng(t.latlng);var e=this._hintMarker.getLatLng();if(e.equals(this._layer.getLatLngs()[0]))return void this._finishShape();var i=0===this._layer.getLatLngs().length;this._layer.addLatLng(e),this._createMarker(e,i),this._hintline.setLatLngs([e,e])},_finishShape:function(){var t=this._layer.getLatLngs(),e=L.polyline(t,this.options.pathOptions).addTo(this._map);this.disable(),this._map.fire("pm:create",{shape:this._shape,layer:e}),this.options.snappable&&this._cleanupSnapping()},_createMarker:function(t){var e=new L.Marker(t,{draggable:!1,icon:L.divIcon({className:"marker-icon"})});return e._pmTempLayer=!0,this._layerGroup.addLayer(e),e.on("click",this._finishShape,this),e}}),L.PM.Draw.Marker=L.PM.Draw.extend({initialize:function(t){this._map=t,this._shape="Marker",this.toolbarButtonName="drawMarker"},enable:function(t){L.Util.setOptions(this,t),this._enabled=!0,this._map.on("click",this._createMarker,this),this._map.pm.Toolbar.toggleButton(this.toolbarButtonName,!0),this._hintMarker=L.marker([0,0]),this._hintMarker._pmTempLayer=!0,this._hintMarker.addTo(this._map),this._layer=this._hintMarker,this._map.on("mousemove",this._syncHintMarker,this),this._map.eachLayer(function(t){t instanceof L.Marker&&t.pm.enable()})},disable:function(){this._enabled&&(this._map.off("click",this._createMarker,this),this._hintMarker.remove(),this._map.off("mousemove",this._syncHintMarker,this),this._map.eachLayer(function(t){t instanceof L.Marker&&!t._pmTempLayer&&t.pm.disable()}),this._enabled=!1)},enabled:function(){return this._enabled},toggle:function(t){this.enabled()?this.disable():this.enable(t)},_createMarker:function(t){if(t.latlng){this._hintMarker._snapped||this._hintMarker.setLatLng(t.latlng);var e=this._hintMarker.getLatLng(),i=new L.Marker(e,this.options.markerStyle);i.addTo(this._map),i.pm.enable(),this._map.fire("pm:create",{shape:this._shape,marker:i,layer:i}),this._cleanupSnapping()}},_syncHintMarker:function(t){if(this._hintMarker.setLatLng(t.latlng),this.options.snappable){var e=t;e.target=this._hintMarker,this._handleSnapping(e)}}}),L.PM.Draw.Poly=L.PM.Draw.Line.extend({initialize:function(t){this._map=t,this._shape="Poly",this.toolbarButtonName="drawPolygon"},_finishShape:function(){var t=this._layer.getLatLngs(),e=L.polygon(t,this.options.pathOptions).addTo(this._map);this.disable(),this._map.fire("pm:create",{shape:this._shape,layer:e}),this._cleanupSnapping(),this._otherSnapLayers.splice(this._tempSnapLayerIndex,1),delete this._tempSnapLayerIndex},_createMarker:function(t,e){var i=new L.Marker(t,{draggable:!1,icon:L.divIcon({className:"marker-icon"})});i._pmTempLayer=!0,this._layerGroup.addLayer(i),e&&(i.on("click",this._finishShape,this),this._tempSnapLayerIndex=this._otherSnapLayers.push(i)-1,this.options.snappable&&this._cleanupSnapping())}}),L.PM.Edit.Circle=L.PM.Edit.extend({initialize:function(t){this._layer=t,this._enabled=!1},toggleEdit:function(t){this.enabled()?this.disable():this.enable(t)},enabled:function(){return this._enabled},enable:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.options=e,this._map=this._layer._map,this.enabled()||this.disable(),this._enabled=!0,this._initMarkers(),this._layer.on("remove",function(e){t.disable(e.target)})},disable:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this._layer;if(!this.enabled())return!1;if(t.pm._dragging)return!1;t.pm._enabled=!1,t.pm._layerGroup.clearLayers(),t.off("mousedown"),t.off("mouseup");var e=t._path;return L.DomUtil.removeClass(e,"leaflet-pm-draggable"),!0},_initMarkers:function(){var t=this._map;this._layerGroup&&this._layerGroup.clearLayers(),this._layerGroup=new L.LayerGroup,t.addLayer(this._layerGroup);var e=this._layer.getLatLng(),i=this._layer._radius,a=this._getLatLngOnCircle(e,i);this._centerMarker=this._createCenterMarker(e),this._outerMarker=this._createOuterMarker(a),this._markers=[this._centerMarker,this._outerMarker],this._createHintLine(this._centerMarker,this._outerMarker),this.options.snappable&&this._initSnappableMarkers()},_getLatLngOnCircle:function(t,e){var i=this._map.project(t),a=L.point(i.x+e,i.y);return this._map.unproject(a)},_resizeCircle:function(){this._syncHintLine(),this._syncCircleRadius()},_moveCircle:function(t){var e=t.latlng;this._layer.setLatLng(e);var i=this._layer._radius,a=this._getLatLngOnCircle(e,i);this._outerMarker.setLatLng(a),this._syncHintLine()},_syncCircleRadius:function(){var t=this._centerMarker.getLatLng(),e=this._outerMarker.getLatLng(),i=t.distanceTo(e);this._layer.setRadius(i)},_syncHintLine:function(){var t=this._centerMarker.getLatLng(),e=this._outerMarker.getLatLng();this._hintline.setLatLngs([t,e])},_createHintLine:function(t,e){var i=t.getLatLng(),a=e.getLatLng();this._hintline=L.polyline([i,a],this.options.hintlineStyle),this._hintline._pmTempLayer=!0,this._layerGroup.addLayer(this._hintline)},_createCenterMarker:function(t){var e=this._createMarker(t);return e.on("move",this._moveCircle,this),e},_createOuterMarker:function(t){var e=this._createMarker(t);return e.on("move",this._resizeCircle,this),e},_createMarker:function(t){var e=new L.Marker(t,{draggable:!0,icon:L.divIcon({className:"marker-icon"})});return e._origLatLng=t,e._pmTempLayer=!0,this._layerGroup.addLayer(e),e}}),L.PM.Edit.LayerGroup=L.Class.extend({initialize:function(t){var e=this;this._layerGroup=t,this._layers=this.findLayers(),this._layers.forEach(function(t){return e._initLayer(t)}),this._layerGroup.on("layeradd",function(t){e._layers=e.findLayers(),t.layer.pm&&e._initLayer(t.layer),t.target.pm.enabled()&&e.enable(e.getOptions())})},findLayers:function(){var t=this._layerGroup.getLayers();return t=t.filter(function(t){return!!t.pm})},_initLayer:function(t){var e=this,i=["pm:edit","pm:remove","pm:dragstart","pm:drag","pm:dragend","pm:snap","pm:unsnap","pm:raiseMarkers","pm:markerdragend","pm:markerdragstart"];i.forEach(function(i){t.on(i,e._fireEvent,e)}),t.pm._layerGroup=this._layerGroup},_fireEvent:function(t){this._layerGroup.fireEvent(t.type,t)},toggleEdit:function(t){this._options=t,this._layers.forEach(function(e){e.pm.toggleEdit(t)})},enable:function(t){this._options=t,this._layers.forEach(function(e){e.pm.enable(t)})},disable:function(){this._layers.forEach(function(t){t.pm.disable()})},enabled:function t(){var t=this._layers.find(function(t){return t.pm.enabled()});return!!t},dragging:function e(){var e=this._layers.find(function(t){return t.pm.dragging()});return!!e},getOptions:function(){return this._options}}),L.PM.Edit.Line=L.PM.Edit.extend({initialize:function(t){this._layer=t,this._enabled=!1},toggleEdit:function(t){this.enabled()?this.disable():this.enable(t)},enable:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.options=e,this._map=this._layer._map,this._map&&(this.enabled()||this.disable(),this._enabled=!0,this._initMarkers(),this._layer.on("remove",function(e){t.disable(e.target)}),this.options.draggable&&this._initDraggableLayer())},enabled:function(){return this._enabled},disable:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this._layer;if(!this.enabled())return!1;if(t.pm._dragging)return!1;t.pm._enabled=!1,t.pm._markerGroup.clearLayers(),t.off("mousedown"),t.off("mouseup");var e=t._path;return L.DomUtil.removeClass(e,"leaflet-pm-draggable"),!0},_initMarkers:function(){var t=this._map;this._markerGroup&&this._markerGroup.clearLayers(),this._markerGroup=new L.LayerGroup,t.addLayer(this._markerGroup);var e=this._layer._latlngs;this._markers=e.map(this._createMarker,this);for(var i=0;i<e.length-1;i+=1){var a=i+1;this._createMiddleMarker(this._markers[i],this._markers[a])}this.options.snappable&&this._initSnappableMarkers()},_createMarker:function(t,e){var i=new L.Marker(t,{draggable:!0,icon:L.divIcon({className:"marker-icon"})});return i._origLatLng=t,i._index=e,i._pmTempLayer=!0,i.on("dragstart",this._onMarkerDragStart,this),i.on("move",this._onMarkerDrag,this),i.on("dragend",this._onMarkerDragEnd,this),i.on("contextmenu",this._removeMarker,this),this._markerGroup.addLayer(i),i},_createMiddleMarker:function(t,e){var i=this,a=this._calcMiddleLatLng(t.getLatLng(),e.getLatLng()),n=this._createMarker(a),r=L.divIcon({className:"marker-icon marker-icon-middle"});n.setIcon(r),t._middleMarkerNext=n,e._middleMarkerPrev=n,n.on("click",function(){var a=L.divIcon({className:"marker-icon"});n.setIcon(a),i._addMarker(n,t,e)}),n.on("movestart",function(){n.on("moveend",function(){var t=L.divIcon({className:"marker-icon"});n.setIcon(t),n.off("moveend")}),i._addMarker(n,t,e)})},_addMarker:function(t,e,i){t.off("movestart"),t.off("click");var a=t.getLatLng(),n=this._layer._latlngs,r=e._index+1;n.splice(r,0,a),t._origLatLng=n[r],this._markers.splice(r,0,t),this._markers.map(function(t,e){return t._index=e,!0}),this._createMiddleMarker(e,t),this._createMiddleMarker(t,i),this._fireEdit(),this.options.snappable&&this._initSnappableMarkers()},_removeMarker:function(t){var e=t.target,i=this._layer._latlngs,a=e._index;if(void 0!==a){i.splice(a,1),i.length<1?this._layer.remove():this._layer.redraw(),e._middleMarkerPrev&&this._markerGroup.removeLayer(e._middleMarkerPrev),e._middleMarkerNext&&this._markerGroup.removeLayer(e._middleMarkerNext),this._markerGroup.removeLayer(e);var n=a-1<0?void 0:a-1,r=a+1>=this._markers.length?void 0:a+1;if(r&&n&&r!==n){var s=this._markers[n],o=this._markers[r];this._createMiddleMarker(s,o)}this._markers.splice(a,1),this._markers.map(function(t,e){return t._index=e,!0}),this._fireEdit()}},_onMarkerDrag:function(t){var e=t.target;if(void 0!==e._index){var i=e._index+1>=this._markers.length?0:e._index+1,a=e._index-1<0?this._markers.length-1:e._index-1;L.extend(e._origLatLng,e._latlng),this._layer.redraw();var n=e.getLatLng(),r=this._markers[a].getLatLng(),s=this._markers[i].getLatLng();if(e._middleMarkerNext){var o=this._calcMiddleLatLng(n,s);e._middleMarkerNext.setLatLng(o)}if(e._middleMarkerPrev){var l=this._calcMiddleLatLng(n,r);e._middleMarkerPrev.setLatLng(l)}}},_onMarkerDragEnd:function(t){this._layer.fire("pm:markerdragend",{markerEvent:t}),this._fireEdit()},_onMarkerDragStart:function(t){this._layer.fire("pm:markerdragstart",{markerEvent:t})},_fireEdit:function(){this._layer.edited=!0,this._layer.fire("pm:edit")},_calcMiddleLatLng:function(t,e){var i=this._map,a=i.project(t),n=i.project(e),r=i.unproject(a._add(n)._divideBy(2));return r}}),L.PM.Edit.Marker=L.PM.Edit.extend({initialize:function(t){this._layer=t,this._enabled=!1,this._layer.on("dragend",this._onDragEnd,this)},toggleEdit:function(t){this.enabled()?this.disable():this.enable(t)},enable:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{draggable:!0,snappable:!0};this.options=t,this._map=this._layer._map,this.enabled()||(this._enabled=!0,this._layer.on("contextmenu",this._removeMarker,this),this.options.snappable&&this._layer.dragging.enable(),this.options.snappable&&this._initSnappableMarkers())},enabled:function(){return this._enabled},disable:function(){this._enabled=!1,this._layer.dragging.disable(),this._layer.off("contextmenu",this._removeMarker,this)},_removeMarker:function(t){var e=t.target;e.remove(),e.fire("pm:remove")},_onDragEnd:function(t){var e=t.target;e.fire("pm:edit")},_initSnappableMarkers:function(){var t=this._layer;this.options.snapDistance=this.options.snapDistance||30,t.off("drag",this._handleSnapping,this),t.on("drag",this._handleSnapping,this),t.off("dragend",this._cleanupSnapping,this),t.on("dragend",this._cleanupSnapping,this),t.off("pm:dragstart",this._unsnap,this),t.on("pm:dragstart",this._unsnap,this)}}),L.PM.Edit.Poly=L.PM.Edit.Line.extend({_initMarkers:function(){var t=this._map;this._markerGroup&&this._markerGroup.clearLayers(),this._markerGroup=new L.LayerGroup,t.addLayer(this._markerGroup);var e=this._layer._latlngs[0];this._markers=e.map(this._createMarker,this);for(var i=0;i<e.length;i+=1){var a=i+1>=e.length?0:i+1;this._createMiddleMarker(this._markers[i],this._markers[a])}this.options.snappable&&this._initSnappableMarkers()},_addMarker:function(t,e,i){t.off("movestart"),t.off("click");var a=t.getLatLng(),n=this._layer._latlngs[0],r=e._index+1;n.splice(r,0,a),t._origLatLng=n[r],this._markers.splice(r,0,t),this._markers.map(function(t,e){return t._index=e,!0}),this._createMiddleMarker(e,t),this._createMiddleMarker(t,i),this._fireEdit(),this.options.snappable&&this._initSnappableMarkers()},_removeMarker:function(t){var e=t.target,i=this._layer._latlngs[0],a=e._index;if(void 0!==a&&!(i.length<=3)){i.splice(a,1),i.length<1?this._layer.remove():this._layer.redraw(),this._markerGroup.removeLayer(e._middleMarkerPrev),this._markerGroup.removeLayer(e._middleMarkerNext),this._markerGroup.removeLayer(e);var n=a-1<0?this._markers.length-1:a-1,r=a+1>=this._markers.length?0:a+1;if(r!==n){var s=this._markers[n],o=this._markers[r];this._createMiddleMarker(s,o)}this._markers.splice(a,1),this._markers.map(function(t,e){return t._index=e,!0}),this._fireEdit()}}}),L.Control.PMButton=L.Control.extend({options:{position:"topleft"},initialize:function(t){this._button=L.Util.setOptions(this,t)},onAdd:function(t){return this._map=t,this._container=this._map.pm.Toolbar.container,this.buttonsDomNode=this._makeButton(this._button),this._container.appendChild(this.buttonsDomNode),this._container},onRemove:function(){return this.buttonsDomNode.remove(),this._container},getText:function(){return this._button.text},getIconUrl:function(){return this._button.iconUrl},destroy:function(){this._button={},this._update()},toggle:function(t){return"boolean"==typeof t?this._button.toggleStatus=t:this._button.toggleStatus=!this._button.toggleStatus,this._applyStyleClasses(),this._button.toggleStatus},toggled:function(){return this._button.toggleStatus},onCreate:function(){this.toggle(!1)},_triggerClick:function(t){this._button.onClick(t),this._clicked(t),this._button.afterClick(t)},_makeButton:function(t){var e=this,i=L.DomUtil.create("a","leaflet-buttons-control-button",this._container);t.toggleStatus&&L.DomUtil.addClass(i,"active");var a=L.DomUtil.create("div","control-icon",i);return t.iconUrl&&a.setAttribute("src",t.iconUrl),t.className&&L.DomUtil.addClass(a,t.className),L.DomEvent.addListener(i,"click",function(){e._button.disableOtherButtons&&e._map.pm.Toolbar.triggerClickOnToggledButtons(e)}),L.DomEvent.addListener(i,"click",this._triggerClick,this),L.DomEvent.disableClickPropagation(i),i},_applyStyleClasses:function(){this._container&&(this._button.toggleStatus?L.DomUtil.addClass(this.buttonsDomNode,"active"):L.DomUtil.removeClass(this.buttonsDomNode,"active"))},_clicked:function(){this._button.doToggle&&this.toggle()}}),L.PM.Toolbar=L.Class.extend({options:{drawMarker:!0,drawPolygon:!0,drawPolyline:!0,drawCircle:!0,editPolygon:!0,dragPolygon:!1,deleteLayer:!0,position:"topleft"},initialize:function(t){this.map=t,this.buttons={},this.isVisible=!1,this.container=L.DomUtil.create("div","leaflet-pm-toolbar leaflet-bar leaflet-control"),this._defineButtons()},getButtons:function(){return this.buttons},addControls:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.options;L.Util.setOptions(this,t),this._showHideButtons(),this.isVisible=!0},removeControls:function(){var t=this.getButtons();for(var e in t)t[e].remove();this.isVisible=!1},toggleControls:function(){this.isVisible?this.removeControls():this.addControls()},_addButton:function(t,e){return this.buttons[t]=e,this.options[t]=this.options[t]||!1,this.buttons[t]},triggerClickOnToggledButtons:function(t){for(var e in this.buttons)this.buttons[e]!==t&&this.buttons[e].toggled()&&this.buttons[e]._triggerClick()},toggleButton:function(t,e){return this.triggerClickOnToggledButtons(this.buttons[t]),this.buttons[t].toggle(e)},_defineButtons:function(){var t=this,e={className:"icon-delete",onClick:function(){},afterClick:function(){t.map.pm.toggleGlobalRemovalMode()},doToggle:!0,toggleStatus:!1,disableOtherButtons:!0,position:this.options.position},i={className:"icon-polygon",onClick:function(){},afterClick:function(){t.map.pm.Draw.Poly.toggle()},doToggle:!0,toggleStatus:!1,disableOtherButtons:!0,position:this.options.position},a={className:"icon-marker",onClick:function(){},afterClick:function(){t.map.pm.Draw.Marker.toggle()},doToggle:!0,toggleStatus:!1,disableOtherButtons:!0,position:this.options.position},n={className:"icon-polyline",onClick:function(){},afterClick:function(){t.map.pm.Draw.Line.toggle()},doToggle:!0,toggleStatus:!1,disableOtherButtons:!0,position:this.options.position},r={className:"icon-circle",onClick:function(){},afterClick:function(){t.map.pm.Draw.Circle.toggle()},doToggle:!0,toggleStatus:!1,disableOtherButtons:!0,position:this.options.position},s={className:"icon-edit",onClick:function(){},afterClick:function(){t.map.pm.toggleGlobalEditMode({snappable:!0,draggable:!0})},doToggle:!0,toggleStatus:!1,disableOtherButtons:!0,position:this.options.position},o={className:"icon-drag",onClick:function(){},afterClick:function(){},doToggle:!0,toggleStatus:!1,disableOtherButtons:!0,position:this.options.position};this._addButton("drawMarker",new L.Control.PMButton(a)),this._addButton("drawPolygon",new L.Control.PMButton(i)),this._addButton("drawPolyline",new L.Control.PMButton(n)),this._addButton("drawCircle",new L.Control.PMButton(r)),this._addButton("editPolygon",new L.Control.PMButton(s)),this._addButton("dragPolygon",new L.Control.PMButton(o)),this._addButton("deleteLayer",new L.Control.PMButton(e))},_showHideButtons:function(){this.removeControls();var t=this.getButtons();for(var e in t)this.options[e]&&(t[e].setPosition(this.options.position),t[e].addTo(this.map))}});
//# sourceMappingURL=maps/leaflet.pm.min.js.map
