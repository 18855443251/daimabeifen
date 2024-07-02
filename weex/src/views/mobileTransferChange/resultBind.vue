<template>
  <div class="container">
    <title-bar title="绑定账户变更"></title-bar>
    <div class="content">
      <image class="bg" :src="bgSrc"></image>
      <div class="content-result">
        <image class="sccessful" :src="successfulSrc"></image>
        <div class="text-box">
          <text class="text">绑定账户变更已受理</text>
        </div>
      </div>
      <div class="result-detail">
        <div class="cell-item margin-bottom">
          <text class="item-left">绑定手机号：</text>
          <text class="item-right">{{mobilePhone|blurMobilePhone}}</text>
        </div>
        <div class="cell-item">
          <text class="item-left">绑定账户：</text>
          <text class="item-right">{{accountNum|blurCardNum}}</text>
        </div>
      </div>
    </div>
    <div class="bottom">
      <text @click="replaceStage('main.MBindingRrecord')" class="bottom-button bottom-button-left">变更结果查询</text>
      <text @click="gotoPhone" class="bottom-button">手机号转账</text>
    </div>
  </div>
</template>

<script>
const context = weex.requireModule("context");

import TitleBar from "@/components/templet/titlebar";
export default {
  components: {
    TitleBar
  },
  created() {
    this.getParams();
  },
  data() {
    return {
      bgSrc: "./imgs/mobileTransferRegister/bg.png",
      successfulSrc: "./imgs/mobileTransferRegister/successful.png",
      mobilePhone: "",
      two:"",
      accountNum: ""
    };
  },
  mounted() {
    this.two = context.getParam("two");//二类户标识
  },

  methods: {
    getParams() {
      this.mobilePhone = this.$route.query.mobilePhone;
      this.accountNum = this.$route.query.AcNo;
    },
    gotoPhone(){
        if(this.two == "e"){//跳到收款
            context.replaceStage('main.phoneShoukuan');
        }else{//跳到付款
            context.replaceStage('main.phonetransfer');
        }
    },
    next(url) {
      context.launchStage(url);
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #ececec;
}
.content {
  width: 750px;
  height: 530px;
  position: relative;
  flex-direction: column;
  /* justify-content: center; */
}
.content-result {
  margin-top: 90px;
  flex-direction: column;
  align-items: center;
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
}
.text-box {
  margin-top: 30px;
  width: 382px;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}
.text {
  margin-top: 10px;
  font-size: 26px;
  color: #999999;
}
.text-click {
  color: rgb(193, 153, 101);
  text-decoration: underline;
}
.result-detail {
  margin-top: 110px;
  width: 750px;
  padding-left: 30px;
  padding-right: 30px;
}
.cell-item {
  flex-direction: row;
  justify-content: space-between;
}
.item-left {
  font-size: 26px;
  color: rgb(102, 102, 102);
}
.item-right {
  font-size: 26px;
  color: rgb(102, 102, 102);
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
.margin-bottom {
  margin-bottom: 30px;
}
</style>
