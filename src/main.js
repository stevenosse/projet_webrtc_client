import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

require('./config/plugins')
require('./config/socket-io')
import('./config/peer')

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
