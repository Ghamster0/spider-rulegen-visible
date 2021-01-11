import Vue from 'vue'
import App from './App.vue'
import './assets/css/fontawesome.min.css'
import './assets/css/app.css'

import { createStore } from './store'
import { extractUrls } from './utils/backend'

Vue.config.productionTip = false
Vue.directive('click-outside', {
    bind: function (el, binding) {
        el.clickOutsideEvent = function (event) {
            if (!(el == event.target || el.contains(event.target))) {
                binding.value(event);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent)
    },
    unbind: function (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
    }
})

const store = createStore()

export function initApp(bridge, id) {
    window.bridge = bridge

    bridge.on("msg-from-backend", (e) => {
        console.log("frontend <<< ", e)
        const msgBody = e.value
        switch (e.type) {
            case "selector-predict:urls":
                store.commit("SET_RULE_LINK", { indicator: msgBody.indicator, linkConf: { selector: msgBody.selector } })
                extractUrls(msgBody.indicator, msgBody.selector)
                break
            case "selector-predict:contents":
                store.commit("SET_RULE_EXTRACT", { indicator: msgBody.indicator, templatePatch: { selector: msgBody.selector } })
                break
            case "extracted:urls":
                store.commit("SET_RULE_LINK", { indicator: msgBody.indicator, linkConf: { urls: msgBody.urls } })
                break
            case "extracted:contents":
                store.commit("SET_RULE_EXTRACT", { indicator: msgBody.indicator, templatePatch: { contents: msgBody.contents } })
        }
    });

    bridge.on("databus-to-rulegen", e => {
        console.log("databus -> rulegen", e)
        if (window.confirm("从Databus平台导入配置？")) {
            store.commit("SET_GROUPS", e.rules)
            store.commit("LOAD_GROUP", "")
        }
    })

    new Vue({
        store,
        render: (h) => h(App)
    }).$mount('#' + id)
}