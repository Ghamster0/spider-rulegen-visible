import Vue from 'vue'
import App from './App.vue'
import './assets/css/fontawesome.min.css'

import { createStore } from './store'

Vue.config.productionTip = false

const store = createStore()

export function initApp(bridge, id) {
  window.bridge = bridge

  bridge.on("msg-from-backend", (e) => {
    if (e.type === "selector:update") {
      store.commit("SET_RULE_LINK_SELECTOR", e.value)
    }
  });

  new Vue({
    store,
    render: (h) => h(App)
  }).$mount('#' + id)
}

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
