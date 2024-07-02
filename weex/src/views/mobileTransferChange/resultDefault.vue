<template>
  <div class="container">
    <title-bar title="默认账户变更"></title-bar> 
    <div class="content">
      <image class="bg" :src="bgSrc"></image>
      <image class="sccessful" :src="successfulSrc"></image>
      <text class="text">已受理</text>
      <text class="text-detail">默认账户变更已受理</text>
    </div>
    <div class="bottom">
      <text @click="replaceStage('main.MBindingRrecord')" class="bottom-button bottom-button-left">变更结果查询</text>
      <text @click="replaceStage('main.phonetransfer')" class="bottom-button">手机号转账</text>
    </div>
  </div>
</template>

<script>
import TitleBar from "@/components/templet/titlebar";
export default {
  components: {
    TitleBar
  },
  data() {
    return {
      bgSrc: "./imgs/mobileTransferRegister/bg.png",
      successfulSrc: "./imgs/mobileTransferRegister/successful.png"
    };
  }
};
</script>

<style scoped>
.container {
  background-color: #ececec;
}
.content {
  width: 750px;
  height: 440px;
  position: relative;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.bg {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.sccessful {
  width: 110px;
  height: 110px;
  margin-bottom: 15px;
}
.text {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 32px;
  color: rgb(34, 34, 34);
}
.text-detail {
  margin-top: 10px;
  font-size: 24px;
  color: #999999;
}
.bottom {
  margin-top: 40px;
  padding-left: 30px;
  padding-right: 30px;
  flex-direction: row;
  justify-content: space-between;
}
.bottom-button {
  width: 330px;
  height: 90px;
  line-height: 90px;
  text-align: center;
  background-color: rgb(238, 63, 35);
  border-radius: 8px;
  color: #ffffff;
  font-size: 32px;
}
.bottom-button-left {
  background-color: #ffffff;
  color: rgb(193, 153, 101);
  border-width: 2px;
  border-color: rgb(193, 153, 101);
}
</style>
