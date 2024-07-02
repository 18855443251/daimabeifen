<template>
  <div @clickbackitem="goBack" @viewappear="viewappear">
    <!--主界面-->
    <router-view style="flex:1"></router-view>
  </div>
</template>

<script>
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");

export default {
  data() {
    return {};
  },
  created() {
    var platform = weex.config.env.platform.toLowerCase();
    if (platform == "ios") {
      this.viewappear();
    }
    //this.getPermission();
  },
  methods: {
    viewappear() {
      this.$store.state.isGetCheck=context.sessionGetString("isGetCheck")||this.$store.state.isGetCheck;
      this.$store.state.isLogin = context.sessionGetString('isLogin');
      this.getUserInfo();
      this.$store.state.UpdateAntiFake = context.sessionGetString("UpdateAntiFake");
      this.$store.state.launcherTabbarTimes=context.sessionGetString('launcherTabbarTimes')+1;
    },
    getUserInfo() {
      let isLogin = context.sessionGetString("isLogin"),
        userinfo = context.sessionGetString("userinfo");
      if (isLogin) {
        this.$store.state.isLogin = isLogin;
        this.$store.state.userinfo = JSON.parse(userinfo);
        this.$store.state.mobiel = this.$store.state.userinfo.Mobiel;
        this.$store.state.i++;
        this.$store.state.AutoLoginUrl = context.secureGetString("AutoLoginUrl");
      } else {
        this.$store.state.isLogin = "";
        this.$store.state.userinfo = {};
        this.$store.state.mobiel = "";
      }
      this.$store.state.viewappear++;
    },
    getPermission() {
      stream.fetch(
        {
          method: "GET",
          url: "/weex/json/system/permission.json",
          type: "json"
        },
        response => {
          if (response.status === 200) {
            this.$store.state.permission = response.data.data;
          }
        }
      );
    }
  }
};
</script>
