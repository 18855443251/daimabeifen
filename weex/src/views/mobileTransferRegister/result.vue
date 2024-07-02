<template>
  <div class="container">
    <title-bar title="绑定手机号" :leftShow="leftShow"></title-bar>
    <div class="content">
      <image class="bg" :src="bgSrc"></image>
      <div class="content-result">
        <image class="sccessful" :src="successfulSrc"></image>
        <div v-if="State=='0'" class="text-box">
          <text class="text">手机号绑定已受理，结果可点击</text><text @click="replaceStage('MBindingRrecord')" class="text text-click">绑定关系查询</text><text class="text">进行查询</text>
        </div>
        <div v-if="State=='1'" class="text-box">
          <text class="text">请等待人行的消息通知，进行确认</text>
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
    <div v-if="State=='0'" class="bottom">
      <text @click="replaceStage('main.MBindingRrecord')" class="bottom-button bottom-button-left">绑定结果查询</text>
      <text @click="replaceStage('main.phonetransfer')" class="bottom-button">手机号转账</text>
    </div>
    <div v-if="State=='1'" class="bottom">
      <text @click="finishPage" class="bottom-button bottom-finish">完成</text>
    </div>
  </div>
</template>

<script>
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");

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
      leftShow: false,
      bgSrc: "./imgs/mobileTransferRegister/bg.png",
      successfulSrc: "./imgs/mobileTransferRegister/successful.png",
      mobilePhone: "",
      accountNum: "",
      State: ""
    };
  },
  methods: {
    ReqExChangeMallMdlAddTimes(){
      this.goJson("/refacmob/ReqExChangeMallMdlAddTimes.do", {
        UserId:context.secureGetString("idNumber")
      }, response => {
        if(response.data.AutoLoginUrl!=""){
            wjalert.confirm(
              "您已获得抽奖资格，快去抽大奖吧?",
              "确定",
              "取消",
              data => {
                if (data == "Y") {
                  context.launchStage("main.webPrize");
                  context.secureSetString('AutoLoginUrl',response.data.AutoLoginUrl);
                } else if (data == "N") {
                  
                }
              }
            );
        }
      });
    },
    getParams() {
      this.mobilePhone = this.$route.query.mobilePhone;
      this.accountNum = this.$route.query.AcNo;
      this.State = this.$route.query.State;
      if(this.State == "0"){
        this.ReqExChangeMallMdlAddTimes();
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
  margin-top: 80px;
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
.bottom-finish {
  width: 690px;
}
.margin-bottom {
  margin-bottom: 30px;
}
</style>
