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
        <el-menu-item index="2-1"
          ><el-icon class="el-icon-close"></el-icon> Terminer la
          surveillance</el-menu-item
        >
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

    <div :style="`width: ${overlayVisible == true ? '100%' : '0'}`" class="overlay">
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
          style="width: 40%; height: 50vh; background-position: center; background-size: contain; background-repeat: no-repeat"
        ></div>
        </center>
      </div>
    </div>
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
    };
  },
  created() {
    document.addEventListener('keyup', this.hideOverlay);
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
      if(event.keyCode === 27) {
        this.overlayVisible = false
        this.hoveredElement = null
      }
    }
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

.user-screen-large {
  transform: scale(450%) translate(50%, 25%);
  border-radius: 0 !important;
  position: relative;
  top: 50%;
  left: 50%;
  transition: 0.5s;
}

/* Overlay management */
/* The Overlay (background) */
.overlay {
  /* Height & width depends on how you want to reveal the overlay (see JS below) */
  height: 100%;
  width: 0;
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  background-color: rgb(0, 0, 0); /* Black fallback color */
  background-color: rgba(0, 0, 0, 0.5); /* Black w/opacity */
  overflow-x: hidden; /* Disable horizontal scroll */
  transition: 0.5s; /* 0.5 second transition effect to slide in or slide down the overlay (height or width, depending on reveal) */
}

/* Position the content inside the overlay */
.overlay-content {
  position: relative;
  top: 25%; /* 25% from the top */
  width: 100%; /* 100% width */
  text-align: center; /* Centered text/links */
  margin-top: 30px; /* 30px top margin to avoid conflict with the close button on smaller screens */
}

/* The navigation links inside the overlay */
.overlay a {
  padding: 8px;
  text-decoration: none;
  font-size: 36px;
  color: #818181;
  display: block; /* Display block instead of inline */
  transition: 0.3s; /* Transition effects on hover (color) */
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