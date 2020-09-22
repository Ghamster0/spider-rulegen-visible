import Vue from "vue"

import Element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
import App from "./App.vue"

Vue.use(Element)

export function initApp(bridge, id) {
    window.bridge = bridge
    new Vue({
        render: (h) => h(App)
    }).$mount('#' + id)
}