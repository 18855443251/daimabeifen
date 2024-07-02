<template>
  <div class="container">
    <image :src="bgImg" class="Img_bg"></image>
    <div class="row">
      <div class="amount_div">
        <text v-if="isLogin==true" class="amount">{{isShow?this.assets:'******'}}</text>
        <text v-if="isLogin==false" class="noLogin_text">请登录后查看您的资产</text>
        <text v-if="isLogin==false" class="noLogin_btn" @click="onlogin">登录</text>
        <text v-if="isLogin==true" class="noLogin_btn" @click="checkDetails">查看详情</text>
      </div>
      <div class="my-amount">
        <text class="title">我的投资（元）</text>
        <image v-if="isLogin==true" :src="isShow?eyeimg:closeimg" class="eye_img" @click="eyeClickBefore"></image>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  height: 230px;
  width: 750px;
  background-color: #ffffff;
}
.Img_bg {
  position: absolute;
  top: 0;
  left: 0px;
  right: 0px;
  bottom: 0;
}
.row {
  padding-left: 30px;
  padding-right: 30px;
}
.amount_div {
  margin-top: 71px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.my-amount {
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
}
.title {
  font-size: 28px;
  color: #666666;
}
.eye_img {
  width: 40px;
  height: 40px;
  margin-left: 44px;
}
.amount {
  font-size: 60px;
  color: #3e4c57;
}
.noLogin_text {
  font-size: 34px;
  color: #3e4c57;
  font-weight: bold;
  margin-top: -8px;
}
.noLogin_btn {
  width: 220px;
  height: 64px;
  line-height: 64px;
  border-radius: 32px;
  background-color: #d2a66c;
  color: #ffffff;
  text-align: center;
  font-size: 28px;
}
</style>
<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
const loading = weex.requireModule("loading");
export default {
  data() {
    return {
      bgImg: "./imgs/tab_finance/finance/background.png",
      eyeimg: "./imgs/tab_finance/finance/open.png",
      closeimg: "./imgs/tab_finance/finance/close.png",
      assets: "0.00",
      isShow: false,
      isLogin: false
    };
  },
  created() {
    this.getUserStatus();
  },
  methods: {
    eyeClickBefore() {
      this.isVisitor(() => {
        this.eyeClick();
      });
    },
    eyeClick() {
      if (!this.isShow) {
        this.goJson("/refacmob/MyAcctCenterMoney.do", {}, response => {
          this.assets = response.data.TotelInvestMoney;
          this.isShow = !this.isShow;
        });
      } else {
        this.isShow = !this.isShow;
      }
    },
    onlogin() {
      this.launchStage("main.login");
    },
    handler(newValue, oldValue) { 
      this.assets = this.$store.state.assets;
    },
    checkDetails() {
      this.gotoStage("main.investView");
    },
    getUserStatus() {
      if (this.$store.state.isLogin == "y") {
        this.isLogin = true;
      } else {
        this.isLogin = false;
        this.assets = "";
      }
    }
  },
  watch: {
    "$store.state.i"() {
      this.getUserStatus();
      this.isShow = false;
    }
  }
};
</script>
