import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

const socketClient = new VueSocketIO({
  debug: true,
  connection: "https://192.168.1.6:3000",
  options: {
    reconnection: false,
  }
})

Vue.use(socketClient)