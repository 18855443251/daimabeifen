<template>
  <div class="container" v-if="show">
    <div class="other-guide-box">
      <image class="other-guide" :src="otherGuide" @click="hideGuide"></image>
    </div>
  </div>
</template>

<script>
const context = weex.requireModule("context");

export default {
  created() {
    this.isfirstEnter();
  },
  data() {
    return {
      show: false,
      otherGuide: "./imgs/tab_home/guide/qita.png"
    };
  },
  methods: {
    isfirstEnter() {
      var label = context.secureGetString("tab_home");
      if (!label) {
        this.show = true;
        this.$store.state.scrollable = false;
      }
    },
    hideGuide() {
      this.show = false;
      this.$store.state.scrollable = true;
      context.secureSetString("tab_home", "true");
    }
  }
};
</script>

<style scoped>
.container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
}
.other-guide-box {
  margin-left: 58px;
  margin-top: 557px;
}
.other-guide {
  width: 675px;
  height: 273px;
}
</style>
