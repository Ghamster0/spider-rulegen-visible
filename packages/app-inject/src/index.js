import App from "./App.vue"
import Vue from "vue"

export function initInject(hook, id) {
    hook.pre()
    new Vue({
        render: (h) => h(App)
    }).$mount('#' + id)
}