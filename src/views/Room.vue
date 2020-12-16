<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-submenu index="1">
        <template slot="title"
          ><el-button icon="el-icon-setting"></el-button
        ></template>
        <el-menu-item index="2-1">
          <el-icon class="el-icon-document"></el-icon>
          Journal d'évaluation
        </el-menu-item>
        <el-menu-item @click="onTerminateSession" index="2-1">
          <el-icon class="el-icon-close"></el-icon>
          Terminer la surveillance
        </el-menu-item>
      </el-submenu>

      <el-menu-item index="0">
        <el-button @click="copyMeetingLink()" icon="el-icon-document-copy"
          >Copier le lien</el-button
        >
      </el-menu-item>
    </el-menu>

    <el-row v-if="userStreams.length > 0" class="page-content" :gutter="20">
      <el-col v-for="(item, index) in userStreams" :key="index" :span="4">
        <div
          v-on:click="showUserScreen(item)"
          :style="`background-image: url(${item.stream});`"
          v-on:mouseover="showOverlay(item)"
          class="grid-content bg-purple"
        ></div>
        <span class="grid-title">{{ item.name }}</span>
      </el-col>
    </el-row>
    <center v-else>
      <el-card
        style="
          width: 250px;
          top: 50%;
          position: absolute;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      >
        En attente de connexions...
      </el-card>
    </center>

    <div
      :style="`width: ${overlayVisible == true ? '100%' : '0'}`"
      class="overlay"
    >
      <!-- Button to close the overlay navigation -->
      <a
        href="javascript:void(0)"
        class="closebtn"
        @click="overlayVisible = false"
        >&times;</a
      >

      <!-- Overlay content -->
      <div class="overlay-content">
        <center>
          <div
            v-if="hoveredElement != null"
            v-on:click="showUserScreen(hoveredElement)"
            :style="`background-image: url(${hoveredElement.stream});`"
            class="bg-purple"
            style="
              width: 65%;
              height: 75vh;
              background-position: center;
              background-size: contain;
              background-repeat: no-repeat;
            "
          ></div>
        </center>
      </div>
    </div>
    <el-dialog
      title="Attention"
      :visible.sync="confirmTerminateSessionVisible"
      width="45%"
      lock-scroll
      close-on-click-modal
      close-on-press-escape
      :center="true"
    >
      <span>
        Vous êtes sur le point de mettre fin à la surveillance. <br />
        Cette action va arrêter le partage d'écran chez tous les étudiants.
        <br />
        Voulez-vous continuer ?
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmTerminateSessionVisible = false"
          >Annuler</el-button
        >
        <el-button type="primary" @click="onTerminateSessionConfirmed()">
          Confirmer
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Room",
  data() {
    return {
      activeIndex: "1",
      hoveredElement: null,
      overlayVisible: false,
      userStreams: [],
      confirmTerminateSessionVisible: false,
    };
  },
  created() {
    document.addEventListener("keyup", this.hideOverlay);
  },
  mounted() {
    this.$socket.emit("holder-id", {
      room: this.$route.params.id,
    });

    this.sockets.subscribe("user-leaved", (data) => {
      const idx = this.userStreams.findIndex((x) => x.sid == data.sid);
      if (this.userStreams[idx]) {
        this.$message({
          type: "error",
          message: `${this.userStreams[idx].name} s'est déconnecté.`,
        });
        this.userStreams.splice(idx, 1);
      }
    });

    this.sockets.subscribe("user-stream", (data) => {
      const user = this.userStreams.find((u) => data.sid == u.sid);

      if (!user) {
        this.$message({
          type: "info",
          message: `${data.name} est maintenant connecté.`,
        });
        this.userStreams.push(data);
      } else {
        if (
          this.hoveredElement != null &&
          this.hoveredElement.sid == data.sid
        ) {
          this.hoveredElement = data;
        }
        this.userStreams.splice(
          this.userStreams.findIndex((x) => x.sid == data.sid),
          1,
          data
        );
      }
    });
  },
  methods: {
    handleSelect() {},
    onTerminateSession() {
      this.confirmTerminateSessionVisible = true;
    },
    onTerminateSessionConfirmed() {
      const users = this.userStreams.map((usm) => usm.sid);
      this.$socket.emit("terminate-session", {
        students: users,
      });
      this.confirmTerminateSessionVisible = false;
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    },
    copyMeetingLink() {
      const link = window.location.toString() + "/join";
      navigator.clipboard.writeText(link);
      this.$message({
        type: "success",
        message: "Le lien vers la réunion a été copié dans le presse papier.",
        offset: "0",
      });
    },
    showUserScreen(userStream) {
      const url = `${window.location.toString()}/screen?sid=${
        userStream.sid
      }&teacher=${this.$socket.id}`;
      window.open(
        url,
        `${userStream.name}`,
        "menubar=no, status=no, scrollbars=no, menubar=no"
      );
    },
    showOverlay(item) {
      this.hoveredElement = item;
      this.overlayVisible = true;
    },
    hideOverlay(event) {
      if (event.keyCode === 27) {
        this.overlayVisible = false;
        this.hoveredElement = null;
      }
    },
  },
};
</script>

<style>
body {
  overflow: hidden;
}
.grid-title {
  color: #fff;
  text-align: left;
  margin-top: 5px;
  display: block;
}
.page-content {
  padding: 10px;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 150px;
  margin-top: 20px;
  cursor: pointer;

  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}

/* Overlay management */
.overlay {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.3);
  overflow-x: hidden;
  transition: 0.5s;
}

/* Position the content inside the overlay */
.overlay-content {
  position: relative;
  top: 10%;
  width: 100%;
  text-align: center;
  margin-top: 20px;
}

/* The navigation links inside the overlay */
.overlay a {
  padding: 8px;
  text-decoration: none;
  font-size: 36px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

/* When you mouse over the navigation links, change their color */
.overlay a:hover,
.overlay a:focus {
  color: #f1f1f1;
}

/* Position the close button (top right corner) */
.overlay .closebtn {
  position: absolute;
  top: 20px;
  right: 45px;
  font-size: 60px;
}

/* When the height of the screen is less than 450 pixels, change the font-size of the links and position the close button again, so they don't overlap */
@media screen and (max-height: 450px) {
  .overlay a {
    font-size: 20px;
  }
  .overlay .closebtn {
    font-size: 40px;
    top: 15px;
    right: 35px;
  }
}
</style>