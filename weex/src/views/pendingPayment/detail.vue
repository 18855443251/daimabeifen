<template>
  <scoller class="container">
    <title-bar title="待付款流水查询"></title-bar>
    <div class="content">
      <div class="content-top">
        <text class="bank-name"> {{item.payeename+"（***"+item.payeeacc.substr(-4)+"）"}}</text>
        <text class="">¥ {{item.amount}}</text>
        <text class="amount-text">待付款金额</text>
      </div>
      <div class="line"></div>
      <div class="content-bottom">
        <div class="cell-item">
          <text class="item-left">验证码:</text>
          <input v-model="AuthInfo" class="item-right PtcId" placeholder="请输入验证码" maxlength="6" type="number" />
        </div>
        <div class="cell-item" style="">
          <text class="item-left">收款银行:</text>
          <text class="item-right">{{item.sendbankname}}</text>
        </div>
        <div class="cell-item">
          <text class="item-left">收款户名:</text>
          <text class="item-right">{{item.payeename}}</text>
        </div>
        <div class="cell-item">
          <text class="item-left">收款账号:</text>
          <text class="item-right">{{item.payeeacc|blurCardNum}}</text>
        </div>
        <div @click="cliHidden" v-if="cliHiddenIsBol" style="justify-content: center;">
            <text class="cliHidden">更多</text>
            <image class="down_img" :src="down"></image>
        </div>
        <div v-else>
          <div class="cell-item">
            <text class="item-left">付款账户:</text>
            <text class="item-right">{{item.payeracc|blurCardNum}}</text>
          </div>
          <div class="cell-item">
            <text class="item-left">付款户名:</text>
            <text class="item-right">{{item.payername}}</text>
          </div>
          <div class="cell-item">
            <text class="item-left">交易日期:</text>
            <text class="item-right">{{item.workdate}}</text>
          </div>
          <div class="cell-item">
            <text class="item-left">手续费:</text>
            <text class="item-right">¥ {{item.feecurrency ? item.feecurrency : "0.00"}}</text>
          </div>
          <div class="cell-item">
            <text class="item-left">流水号:</text>
            <text class="item-right">{{item.agentserialno}}</text>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-button">
      <div class="button-box">
        <text class="button-left" @click="confirm('N')">拒绝付款</text>
        <text class="button-right" @click="confirm('Y')">确认付款</text>
      </div>
    </div>
  </scoller>
</template>

<script>
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");
const modal = weex.requireModule("modal");

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
      item: {},
      cliHiddenIsBol:true,
      down: "./imgs/tab_user/user/drop-down@3x.png",
      AuthInfo: ""
    };
  },
  methods: {
    cliHidden(){
      this.cliHiddenIsBol = !this.cliHiddenIsBol;
    },
    getParams() {
      this.item = this.$route.params.item;
    },
    confirm(PtcId) {
      if (!this.AuthInfo) {
        wjalert.alert("请输入验证码", "确认", data => {
          //点击确认执行方法
        });
      } else {
        this.OtherRet(PtcId);
      }
    },
    OtherRet(PtcId) {
      
      this.getNewTokenNameV1(_tokenName => {
        this.goJson(
          "/refacmob/OtherRet.do",
          {
            _tokenName: _tokenName,
            workdate: this.item.workdate,
            agentserialno: this.item.agentserialno,
            AuthInfo: this.AuthInfo,
            PtcId
          },
          response => {
            this.$router.push("/PendingPaymentresult");
          },
          err => {
            // if (err.data._RejCode == "11111") {
              wjalert.alert(err.data.errmsg, "确认", data => {
                //点击确认执行方法
                this.$router.back();
              });
            // }
          }
        );
      });
    },
    getNewTokenNameV1(cb) {
      this.goJson("/refacmob/getNewTokenNameV1.do", {}, response => {
        if (cb && typeof cb === "function") {
          cb(response.data._tokenName);
        }
      });
    }
  }
};
</script>

<style scoped>
.down_img{
  width: 30px;
  height: 30px;
  margin-top: 5px;
  margin-left: 330px;
}
.cliHidden{
  text-align: center;
  color: skyblue;
}
.container {
  background-color: #ececec;
}
.content {
  width: 750px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #ffffff;
}
.content-top {
  align-items: center;
}
.bank-name {
  margin-top: 55px;
  font-size: 26px;
  color: rgb(102, 102, 102);
}
.amount {
  margin-top: 45px;
  font-size: 48px;
  color: rgb(34, 34, 34);
  font-weight: bold;
}
.amount-text {
  margin-top: 20px;
  font-size: 24px;
  color: rgb(153, 153, 153);
}
.line {
  background-color: rgb(221, 221, 221);
  height: 1px;
  width: 690px;
  margin-top: 63px;
  margin-bottom: 18px;
}
.content-bottom {
  margin-bottom: 60px;
}

.cell-item {
  flex-direction: row;
  justify-content: space-between;
  margin-top: 36px;
}
.item-left {
  font-size: 26px;
  color: rgb(153, 153, 153);
}
.item-right {
  font-size: 26px;
  color: rgb(34, 34, 34);
}
.PtcId {
  width: 360px;
  height: 40px;
  text-align: right;
  placeholder-color: red;
}
.bottom-button {
  width: 750px;
  padding-left: 30px;
  padding-right: 30px;
  margin-top: 40px;
}
.button-box {
  flex-direction: row;
  justify-content: space-between;
}
.button-left {
  width: 330px;
  height: 90px;
  line-height: 90px;
  background-color: #ffffff;
  font-size: 32px;
  color: rgb(193, 153, 101);
  text-align: center;
  border-width: 2px;
  border-color: rgb(193, 153, 101);
  border-radius: 8px;
}
.button-right {
  width: 330px;
  height: 90px;
  line-height: 90px;
  background-color: rgb(238, 63, 35);
  font-size: 32px;
  color: #ffffff;
  text-align: center;
  border-radius: 8px;
}
</style>
