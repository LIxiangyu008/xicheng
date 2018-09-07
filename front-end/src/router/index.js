import Vue from 'vue'
import Router from 'vue-router'
import Map from '../components/map/Index.vue'
import Sta from '../components/sta-analysis/Index.vue'
import MultiScreen from '../components/map/multi-screen/MultiScreenView.vue'
import MapManage from '../components/mapmanage/MapManage.vue'

Vue.use(Router)

export default new Router({
  routes: [
        {
            path: '/',
            redirect: 'home'
        },
        {
            path: '/home',
            name: 'home',
            component: resolve => require(['../components/home/Index.vue'], resolve),
            children: [
                {
                    path: '',
                    component: Map
                },
                {
                    path: '/map',
                    name: 'map',
                    component: Map
                },
                {
                    path: '/sta',
                    name: 'sta',
                    component: Sta
                },
                {
                  path: '/multiScreen',
                    component: MultiScreen
                },
                {
                  path: '/mapManage',
                  component: MapManage
                },
                {
                  path: '/monitor',
                  component: resolve => require(['../components/monitor/Monitor.vue'],resolve)
                }
            ]
        }
    ]
})
