import Vue from "vue";
import VueSocketIO from "vue-socket.io";

const socketClient = new VueSocketIO({
  debug: false,
  connection: "https://" + window.ENDPOINT + ":"+window.PORT,
  options: {
    reconnection: false,
  },
});

Vue.use(socketClient);
