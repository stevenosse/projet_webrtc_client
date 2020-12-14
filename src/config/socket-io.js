import Vue from "vue";
import VueSocketIO from "vue-socket.io";

const socketClient = new VueSocketIO({
  debug: false,
  connection: "https://" + window.endpoint + ":3000",
  options: {
    reconnection: false,
  },
});

Vue.use(socketClient);
