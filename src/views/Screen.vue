<template>
  <video
    autoplay
    width="100%"
    class="is-fullscreen"
    :srcObject.prop="stream"
  ></video>
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

    if (this.$peer == null) {
      this.$peer = new SimplePeer({
        initiator: false,
        trickle: false,
        // config: window.peerConfig
      });
    }

    const loading = this.$loading({
      lock: true,
      text: "En attente",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)",
    });

    this.$peer.on("error", (err) => {
      console.log(err);
    });

    this.$socket.emit("start-unique-user-stream", {
      student_id: studentID,
      teacher_id: teacherID,
    });
    loading.text = "Etablissement de la connexion"

    this.sockets.subscribe("unique-user-stream", (data) => {
      this.$peer.signal(data.signal);
    });

    this.$peer.on("stream", (stream) => {
      this.stream = stream;
      loading.close();

      console.log("User stream received");
      console.log("stream obj ", stream);
    });
  },
};
</script>

<style>
.is-fullscreen {
  height: 100vh;
}
</style>