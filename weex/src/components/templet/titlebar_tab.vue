<template>
  <div class="container"> 
    <!-- <image v-if="titleBg" class="title-bg" :src="titleBg"></image> -->
    <div class="row"> 
      <text class="title_font">{{title}}</text>
      <image @click="gotoStage('main.bankNotice')" class="title-img message" :src="message"></image>
      <image class="title-img" :src="qrcode"></image>
      <!-- <image class="title-img" :src="customerservice"></image> -->
      <!-- <div class="title-img"></div> -->
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 750px;
  padding-top: 80px;
  padding-bottom: 28px;
  position: relative;
  background-color: #ffffff;
}
.row {
  padding-left: 30px;
  padding-right: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.title-bg {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.message{
  left: 200px;
}
.title-img {
  width: 42px;
  height: 42px;
}
.title_font {
  width:120px;
  height: 42px;
  font-size: 24px;
  text-align: center;
  color: #ffffff;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #ffffff;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #ffffff;
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: #ffffff;
  border-left-style: solid;
  border-left-width: 1px;
  border-left-color: #ffffff;
  border-top-left-radius: 21px;
  border-top-right-radius: 21px;
  border-bottom-left-radius: 21px;
  border-bottom-right-radius: 21px;
}
</style>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    titleBg: {
      type: String, 
      default: ''
    }
  },
  data() {
    return {
      message: './imgs/templet/titlebar_tab/message@3x.png',
      customerservice: './imgs/templet/titlebar_tab/customerservice.png',
      qrcode:"./imgs/templet/titlebar_tab/qrcode@3x.png"
    };
  }
};
</script>
