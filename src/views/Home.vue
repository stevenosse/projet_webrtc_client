<template>
  <div class="login">
    <el-card>
      <h2>SUPERVISOR</h2>
      <small>Créer une évaluation</small>
      <el-form
        class="login-form"
        :model="model"
        ref="form"
        @submit.native.prevent="createRoom"
      >
        <el-form-item prop="username">
          <el-input
            v-model="model.subject"
            placeholder="Sujet"
            prefix-icon="el-icon-c-scale-to-original"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-time-select
            v-model="model.duration"
            :picker-options="{
              start: '00:30',
              step: '00:15',
              end: '6:30',
            }"
            placeholder="Choisissez un horaire"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="login-button"
            type="primary"
            native-type="submit"
            block
          >
            OBTENIR LE LIEN
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      model: {
        duration : '02:00',
        subject: 'DevTest'
      },
    };
  },
  methods: {
    createRoom() {
      this.$socket.emit('create-room', this.model)
      this.sockets.subscribe('room-created', data => {
        this.$message({
          type: 'success',
          message: 'L\'évaluation a été créée avec succès.'
        })
        this.$router.push({ name: 'rooms.show', params: { id: data._id } })
      })
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button {
  width: 100%;
  /* margin-top: 20px; */
}
.login-form {
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
.login .el-input__inner:hover {
  border-color: $teal;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}
.login .el-input input {
  padding-left: 35px;
}
.login .el-card {
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
.login .el-card {
  width: 340px;
  display: flex;
  justify-content: center;
}
</style>
