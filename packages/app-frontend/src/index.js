import Vue from 'vue'
import App from './App.vue'
import './addon/clickoutside'
import './assets/css/fontawesome.min.css'
import './assets/css/app.css'

import { createStore } from './store'
import { initBackendListener } from './utils/backend'
import { initDatabusListener } from "./utils/databus"

Vue.config.productionTip = false

const store = createStore()

export function initApp(bridge, id) {
    window.bridge = bridge

    initBackendListener(store)
    initDatabusListener(store)

    new Vue({
        store,
        render: (h) => h(App)
    }).$mount('#' + id)
}