import Vue from 'vue'
import App from './App.vue'
import './assets/css/fontawesome.min.css'

import { createStore } from './store'
import bm from "./views/backend-mixin"

Vue.config.productionTip = false

const store = createStore()

export function initApp(bridge, id) {
    window.bridge = bridge

    bridge.on("msg-from-backend", (e) => {
        switch (e.type) {
            case "selector:update":
                store.commit("SET_RULE_LINK_SELECTOR", e.value)
                bm.methods.extractUrls(e.value)
                break
            case "extracted:urls":
                console.log("UPDATE_RULE_LINK_EXTRACTED", e)
                store.dispatch("UPDATE_RULE_LINK_EXTRACTED", e.value)
        }
    });

    new Vue({
        store,
        render: (h) => h(App)
    }).$mount('#' + id)
}