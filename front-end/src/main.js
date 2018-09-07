import 'babel-polyfill'
import 'promise-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import VideoPlayer from 'vue-video-player'
import 'animate.css/animate.css'
import 'reset-css/reset.css'
import 'font-awesome/css/font-awesome.css'
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/icons/icon-base/style.css'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import echarts from 'echarts'

import './assets/_base.scss'
import './assets/_skin.scss'

require('./../static/lib/Cesium/Widgets/widgets.css');

Vue.use(ElementUI);
Vue.use(VideoPlayer);

Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false

//全局事件总线
window.EventBus = new Vue();

// 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

router.beforeEach((to,from,next) => {
  NProgress.start()
  next()
})

router.afterEach(() => {
  NProgress.done()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
