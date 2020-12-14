<template>
  <div class="join">
    <el-card v-if="started == false">
      <h2>SUPERVISOR</h2>
      <small>Rejoindre l'évaluation</small>
      <el-form
        class="join-form"
        :model="model"
        ref="form"
        @submit.native.prevent="joinRoom"
      >
        <el-form-item prop="username">
          <el-input
            v-model="model.name"
            placeholder="Nom & Prenom"
            prefix-icon="el-icon-c-scale-to-original"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            class="join-button"
            type="primary"
            native-type="submit"
            block
          >
            REJOINDRE
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-else>
      <h2>SUPERVISOR</h2>
      <small>
        <el-alert
          :center="false"
          title="Avertissement"
          type="warning"
          show-icon
          description="La fermeture de cet onglet entraînera une déconnexion."
        ></el-alert>
      </small>
      <h3>Evaluation en cours: {{ room.subject }}</h3>
      <p>Durée : {{ room.duration }}</p>
      <el-form
        class="join-form"
        :model="model"
        ref="form"
        @submit.native.prevent="leaveRoom"
      >
        <el-form-item>
          <el-button
            class="join-button"
            native-type="submit"
            type="danger"
            block
            @click="leaveRoom()"
          >
            Quitter
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import SimplePeer from "simple-peer";

export default {
  name: "join",
  data() {
    return {
      started: false,
      room: {},
      model: {
        name: "Steve Nosse",
      },
    };
  },
  /**
   * TODO: leave room on screen sharing stopped
   */
  created() {
    this.sockets.subscribe("room-does-not-exist", () => {
      this.$message({
        message: "L'évaluation n'existe pas ou a été supprimée.",
        type: "error",
      });
    });

    this.sockets.subscribe("join-room", (room) => {
      navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
        this.initScreenshotsStream(stream);

        this.sockets.subscribe("start-unique-user-stream", () => {
          this.$peer = new SimplePeer({
            initiator: true,
            stream: stream,
            trickle: false,
            config: window.peerConfig
          });

          this.$peer.on("signal", (data) => {
            this.$socket.emit('unique-user-stream', data)
          });
        });

        this.started = true;
        this.room = room;
        this.$message({
          type: "success",
          message: "Vous êtes maintenant connecté à l'évaluation.",
        });
      });
    });
  },
  methods: {
    initScreenshotsStream(stream) {
      var video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");

      canvas.width = window.screen.width;
      canvas.height = window.screen.height;

      context.width = canvas.width;
      context.height = canvas.height;

      setTimeout(() => {
        this.refreshScreen(canvas, context, video);
      }, 200);

      setInterval(() => {
        this.refreshScreen(canvas, context, video);
      }, 5000);
    },
    leaveRoom() {
      window.location.reload();
    },
    joinRoom() {
      this.model.room = this.$route.params.id;
      this.$socket.emit("join-room", this.model);
    },
    refreshScreen(canvas, context, video) {
      context.drawImage(video, 0, 0, context.width, context.height);
      this.$socket.emit("stream", {
        name: this.model.name,
        stream: canvas.toDataURL("image/webp"),
        room: this.room._id,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.join {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.join-button {
  width: 100%;
  /* margin-top: 20px; */
}
.join-form {
  width: 290px;
  margin-top: 20px;
}
</style>
<style lang="scss">
$teal: rgb(0, 124, 137);
.el-button--primary {
  background: $teal;
  border-color: $teal;

  &:hover,
  &.active,
  &:focus {
    background: lighten($teal, 7);
    border-color: lighten($teal, 7);
  }
}
.join .el-input__inner:hover {
  border-color: $teal;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}
.join .el-input input {
  padding-left: 35px;
}
.join .el-card {
  padding-top: 0;
  padding-bottom: 30px;
}
h2 {
  font-family: "Open Sans";
  letter-spacing: 1px;
  font-family: Roboto, sans-serif;
}
a {
  color: $teal;
  text-decoration: none;
  &:hover,
  &:active,
  &:focus {
    color: lighten($teal, 7);
  }
}
.join .el-card {
  width: 340px;
  display: flex;
  justify-content: center;
}
</style>
