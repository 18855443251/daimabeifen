<template>
  <div class="main">
    <div class="sign-out" @click="signout">
      <text class="sign-out-text">退出登录</text>
    </div>
  </div>
</template>
<style scoped>
.main {
  margin-top: 60px;
  margin-bottom: 25px;
}
.sign-out {
  width: 750px;
  height: 96px;
  align-items: center;
}
.sign-out-text {
  width: 690px;
  height: 96px;
  line-height: 96px;
  text-align: center;
  background-color: #ffffff;
  border-radius: 10px;
  border-width: 2px;
  border-color: #bec9db;
  font-size: 32px;
  color: #98a9c2;
}
</style>
<script>
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");
export default {
  data() {
    return {};
  },
  methods: {
    signout() {
      wjalert.confirm("您确定退出登录？", "确定", "取消", data => {
        if (data == "Y") {
          this.goJson("/refacmob/logout.do", {}, response => {
            context.sessionSetString("isLogin", "");
            context.sessionSetString("userinfo", "");
            context.sessionSetString("nextScenes", "");
            context.clearToken();
            context.launchStage("main.login");
          });
        }
      });
    }
  }
};
</script>
