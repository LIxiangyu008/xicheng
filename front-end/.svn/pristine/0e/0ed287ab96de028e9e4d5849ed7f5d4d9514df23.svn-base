/**
 * 该配置文件打包编译之后内容无法修改， 打包之后需要修改的配置统一放置在static/config/app-config.js
 */

const Local = window.location;
//const host = `${Local.protocol}//${ Local.port == '3000' ? Local.hostname +':8080' : Local.host }`;
//const host = `${Local.protocol}//${ Local.port == '3000' ? '192.168.105.122:8080' : Local.host }`;
const host = APPCONFIG.IP;
const geohost = APPCONFIG.DisIp;

const Sites={
    Geoesbmengine: host + "/geoesbmengine",
    GWebframe: host + "/webframe",
}

module.exports = {
    ServiceConfig: {
        httpproxy:"/webframe/biz/httpproxy/httpproxy.jsp"
    },
    SgsConfig: {
      GetServiceNodes: Sites.Geoesbmengine+ "/services/catalog/resource/service",
      GetCatalogNodes: Sites.Geoesbmengine+ "/services/catalog/gategoty/view.json",
      GetResourceNodes: Sites.Geoesbmengine+ "/services/catalog/resource/view.json",
      SearchResource: Sites.Geoesbmengine + "/services/resource/data/full/pri",
      SearchFullResource : Sites.Geoesbmengine + "/services/resource/data/full",
      GetRootTheme:Sites.Geoesbmengine + "/services/servicemanager/datacatalog/root.json",
      GetChildTheme: Sites.Geoesbmengine + "/services/servicemanager/datacatalog/tree",
      GetServiceDate: Sites.Geoesbmengine + "/services/resource/data/serinfo"
    },
    Geoesbmengine: {
        location: host + '/geoesbmengine',
    },
    Map: {
        location: host + '/map'
    },
    DFC: {
      location: host + '/dfc'
    },
    GeoEntity:{
      location: geohost + '/geoentity'
    }
}
