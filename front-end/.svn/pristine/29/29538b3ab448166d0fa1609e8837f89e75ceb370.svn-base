<template>
    <section>
        <div id="trackPopUp" v-show="popShow && objData">
            <div id="trackPopUpContent" class="leaflet-popup" style="top:55px;right:30px;">
                <a class="leaflet-popup-close-button" href="#" @click="closePopup">×</a>
                <div class="leaflet-popup-content-wrapper">
                    <button style="padding: 0px;background:none;border:none;color: #C1C1C1;fill: #C1C1C1;cursor: pointer" @click="focusTo()">
                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="width: 30px;height: 30px">
                          <path d="M 13.8438 7.03125 C 11.4128 7.03125 9.46875 8.9753 9.46875 11.4063 L 9.46875 11.5938 L 2.53125 7.21875 L 2.53125 24.0625 L 9.46875 19.6875 C 9.48534 22.104 11.4232 24.0625 13.8438 24.0625 L 25.875 24.0625 C 28.306 24.0625 30.2813 22.0872 30.2813 19.6563 L 30.2813 11.4063 C 30.2813 8.9753 28.306 7.03125 25.875 7.03125 L 13.8438 7.03125 Z" />
                        </svg>
                    </button>
                    <div id="trackPopUpLink" class="leaflet-popup-content" style="max-width: 300px;">
                    </div>
                     <prop-table :objData="objData" ></prop-table>
                </div>
                <div class="leaflet-popup-tip-container" style="display: none">  
                    <div class="leaflet-popup-tip"></div>  
                </div>
            </div>
        </div>
    </section>
</template>
<script type="text/javascript">
    import PropTable from './FunctionalTabel'
    let removeHandler,content,autoInfoWindow,planBox;
    let scene;
    let destination;
    let entity;
    export default {
        components: {
            PropTable
        },
        data() {
            return {
                objData: {},
                popShow: false,
                planBox: {},
                boxShow: false,
            }
        },
        mounted() {
            EventBus.$on('initPopup',this.initPopup);
        },
        destory() {
            EventBus.$off('initPopup',this.initPopup);
        },
        methods: {
            initPopup(entity) {
                entity = entity;
                if(!entity || !entity.props) {
                    this.popShow = false;
                    return;
                }
                this.objData = entity.props || {};
                this.popShow = true;
            },
            closePopup() {
                this.popShow = false;
                //Viewer.entities.removeAll();
            },
            focusTo() {
                Viewer.entities;
                if(Viewer.selectedEntity) {
                    Viewer.zoomTo(Viewer.selectedEntity);
                }
            },
            showPlanBox(){
            },
        }
    }
</script>
<style>
    #trackPopUp .leaflet-popup {  
        position: absolute;  
        text-align: center;  
    }  
    #trackPopUp .leaflet-popup-close-button {  
        position: absolute;  
        top: 5px;  
        right: 5px;  
        z-index: 999;
        padding: 4px 4px 0 0;  
        text-align: center;  
        width: 18px;  
        height: 14px;  
        font: 16px/14px Tahoma, Verdana, sans-serif;  
        color: #c3c3c3;  
        text-decoration: none;  
        font-weight: bold;  
        background: transparent;  
    }  
    #trackPopUp .leaflet-popup-content-wrapper {  
        text-align: center;  
        max-height: 350px;  
        overflow-y: auto;  
        background: white;  
        box-shadow: 0 3px 14px rgba(0,0,0,0.4);  
        padding: 1px;  
        text-align: left;  
        border-radius: 3px;  
    }  
    #trackPopUp .leaflet-popup-content {  
        margin: 13px 19px;  
        line-height: 1.4;  
    }  
    #trackPopUp .leaflet-popup-tip-container {  
        margin: 0 auto;  
        width: 200px;  
        height: 100px;  
        position: relative;  
        overflow: hidden;  
    }  
    #trackPopUp .leaflet-popup-tip {  
        background: white;  
        box-shadow: 0 3px 14px rgba(0,0,0,0.4);  
        width: 17px;  
        height: 17px;  
        padding: 1px;  
        margin: -10px auto 0;  
        -webkit-transform: rotate(45deg);  
        -moz-transform: rotate(45deg);  
        -ms-transform: rotate(45deg);  
        -o-transform: rotate(45deg);  
        transform: rotate(45deg);  
    }
</style>