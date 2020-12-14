<template>
  <video autoplay width="300" height="150" :srcObject.prop="stream"></video>
</template>

<script>
import SimplePeer from "simple-peer";

export default {
  data() {
    return {
      stream: null,
    };
  },
  mounted() {
    const teacherID = this.$route.query.teacher;
    const studentID = this.$route.query.sid;

    if(this.$peer == null) {
      this.$peer = new SimplePeer({
        initiator: false,
        trickle: false
      })
    }

    this.$peer.on('error', err => {
      console.log(err)
    })

    this.$socket.emit("start-unique-user-stream");

    this.sockets.subscribe("unique-user-stream", (data) => {
      this.$peer.signal(data);
    });

    this.$peer.on("stream", (stream) => {
      this.stream = stream;
      console.log("User stream received")
      console.log("stream obj ", stream)
    });
  },
};
</script>

<style>
</style>