<template>
  <div>
    <cesium-scene>
      <template v-for="(item, index) in cSpecialLayers">
        <c-rest-tilelayer 
          v-if="item.layerType == 'SMRESTMAP'" 
          :key="item.key" 
          :url="item.url" 
          :visible="item.visible" 
          :opacity="item.opacity" 
          :options="item.options"
          :layerIndex="(index || 0) + 1"
          >
        </c-rest-tilelayer>
        <c-wms-imageryprovider 
          v-if="item.layerType == 'WMS111'" 
          :version="'1.1.1'" 
          :key="item.key" 
          :url="item.url" 
          :visible="item.visible" 
          :opacity="item.opacity" 
          :options="item.options" 
          :zIndex="(index || 0) + 1"
          >
        </c-wms-imageryprovider>
        <c-wms-imageryprovider 
          v-if="item.layerType == 'WMS130'" 
          :version="'1.3.0'" 
          :key="item.key" 
          :url="item.url" 
          :visible="item.visible" 
          :opacity="item.opacity" 
          :options="item.options" 
          :zIndex="(index || 0) + 1"
          >
        </c-wms-imageryprovider>
        <c-wmts-imageryprovider
          v-if="item.layerType == 'WMTS100'" 
          :key="item.key" 
          :url="item.url" 
          :visible="item.visible" 
          :opacity="item.opacity" 
          :options="item.options" 
          :zIndex="(index || 0) + 1"
          >
        </c-wmts-imageryprovider>
        <c-wmts-imageryprovider
          v-if="item.layerType == 'SGSWMTS100'" 
          :key="item.key" 
          :url="item.url" 
          :visible="item.visible" 
          :opacity="item.opacity" 
          :options="item.options" 
          :zIndex="(index || 0) + 1"
          >
        </c-wmts-imageryprovider>
      </template>
    </cesium-scene>
    <scene-tool></scene-tool>
    <cesium-popup></cesium-popup>
  </div>
</template>

<script>
  import { Loading } from 'element-ui';
  import {
    ServiceConfig
  } from '@/config/app-config'
  import { CRestTilelayer, CWmsImageryprovider, CWmtsImageryprovider } from './../../package/cesium/main'
  import CesiumScene  from './CesiumScene'
  import CesiumPopup from './../common/CesiumPopup'
  import SceneTool from './childrens/SceneTool'
  import {
    mapState,
    mapMutations,
    mapActions
  } from 'vuex'
  import {
    serviceMgr
  } from './../map/serviceMeta.js';
  import {
    apiBaseMap,
    apiGetUserInfo,
    apiServiceCatalogServiceByID,
    apiServiceCatalogByResID,
    apiServiceOriginUrl
  } from '@/apis/api'
  import {
    sortServiceInfos
  } from '@/components/common/serviceUtil'

  export default {
    components:{
      CesiumScene,CRestTilelayer,SceneTool,CesiumPopup, CWmsImageryprovider, CWmtsImageryprovider
    },
    data() {
      return {
        show: false
      }
    },
    mounted() {
      this.initEvent()
    },
    computed: {
      ...mapState({
        cSpecialLayers: state => state.scene.cSpecialLayers,
      })
    },
    beforeDestroy() {
      this.offEvent();
    },
    methods: {
      ...mapMutations([
          'cAddLayer',
          'cRemoveLayer'
        ]),
      initEvent(){
        EventBus.$on('tree-sideBarCheck', this.onSideBarCheck); //添加图层
      },
      offEvent() {
        EventBus.$off('tree-sideBarCheck', this.onSideBarCheck); //添加图层
      },
      async onSideBarCheck(node, checked, indeterminate) {
        let self = this;
        if (checked) {
          const {
            data
          } = await apiServiceCatalogServiceByID(node.resID);
          if (data.resultInfo.data.length > 0) {
            let resource = data.resultInfo.data[0];
            let service = resource.serviceInfos;
            let supportArr = ['WMTS100', 'SGSWMTS100', 'WMS111', 'WMS130', ];

            let filterService = sortServiceInfos(service, supportArr);
            if (!filterService.length) {
              this.$message.error('当前资源无可叠加服务！');
              return;
            }

            let sermeta =  await serviceMgr.getMetadata(filterService[0].id);
            let splitArr = sermeta[0].url.split('\/'),
              serviceId = splitArr[splitArr.length -2];
            let serviceData =  await apiServiceOriginUrl(serviceId);
            sermeta[0].resID = node.resID
            sermeta[0].show = true;
            sermeta[0].visible = true;
            sermeta[0].url = serviceData.data.resultInfo.data;
            // sermeta[0].options.proxy = ServiceConfig.httpproxy + '?url=';
            this.cAddLayer(sermeta[0]);
          }
        } else {
          for (let i = 0; i < this.cSpecialLayers.length; i++) {
            if (node.resID == this.cSpecialLayers[i].resID) {
              this.cRemoveLayer(this.cSpecialLayers[i]);
            }
          }
        }
      },
    }
  }

</script>

<style lang="scss" scope>
</style>
