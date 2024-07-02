<template>
  <div class="header">
    <div class="title-left">
      <div class="backDiv" @click="goBack" v-if="leftShow">
        <image class="backImg" :src="backSrc"></image>
      </div>
    </div>
    <div class="title-box">
      <div class="title-text-box">
        <text class="title">{{title}}</text>
      </div>
    </div>
    <div class="title-right"> </div>
  </div>
</template>

<style scoped>
.header {
  height: 140px;
  width: 750px;
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding-left: 20px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgb(234,234,234);
  background-color: #ffffff;
  padding-right: 20px;
}
.title-left {
  flex: 1;
}
.backDiv {
  height: 100px;
  flex-direction: row;
  /* justify-content: center; */
  align-items: center;
}
.backImg {
  width: 42px;
  height: 42px;
  color: #D8D8D8;
}
.title {
  font-size: 34px;
  color: #333333;
  font-weight: bold;
  letter-spacing: -0.64px;
  text-align: center;
}
.title-right {
  flex: 1;
}
</style>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    leftShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      backSrc: "./imgs/templet/titlebar/back@3x.png"
    };
  },
  created() {},
  methods: {
    JumpTo(url) {
      this.gotoStage(url);
    }
  }
};
</script>