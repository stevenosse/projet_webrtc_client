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
      <el-col v-for="(item, index) in userStreams" :key="index" :span="6">
        <div :style="`background-image: url(${item.stream});`" class="grid-content bg-purple"></div>
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
  </div>
</template>

<script>
import SimplePeer from "simple-peer";

export default {
  name: "Room",
  data() {
    return {
      activeIndex: "1",
      userStreams: [],
    };
  },
  mounted() {
    this.$socket.emit("holder-id", {
      room: this.$route.params.id,
    });

    this.sockets.subscribe("user-stream", (data) => {
      const user = this.userStreams.find((u) => data.name == u.name);
      
      if (!user) {
        this.userStreams.push(data);
      } else {
        this.userStreams.splice(
          this.userStreams.findIndex((x) => x.name == data.name),
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
  min-height: 200px;
  margin-top: 20px;
  cursor: pointer;

  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>