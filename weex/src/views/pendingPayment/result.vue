<template>
  <div class="container"> 
    <title-bar title="待付款流水查询" :leftShow="leftShow"></title-bar>
    <div class="content">
      <image class="bg" :src="bgSrc"></image>
      <image class="sccessful" :src="successfulSrc"></image>
      <text class="text">操作成功</text>
    </div>
    <div class="bottom">
      <text @click="replaceStage('main.launcher')" class="bottom-button">完成</text>
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
      leftShow: false,
      bgSrc: "./imgs/mobileTransferRegister/bg.png",
      successfulSrc: "./imgs/mobileTransferRegister/successful.png"
    };
  },
  methods: {
    
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
.bottom {
  margin-top: 40px;
  padding-left: 30px;
  padding-right: 30px;
}
.bottom-button {
  width: 690px;
  height: 90px;
  line-height: 90px;
  text-align: center;
  background-color: rgb(238, 63, 35);
  border-radius: 8px;
  color: #ffffff;
  font-size: 32px;
}
</style>
