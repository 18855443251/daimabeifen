<template>
  <div class="container">
    <title-bar title="手机号绑定关系查询"></title-bar>
    <div class="content" v-if="bankType=='allBank'">
      <div class="card-list">
        <div v-for="(item,key) in cardlist" :key="key" class="card-item">
          <image v-if="item.DftAccType=='DFLT'" class="default-flag-img" :src="imgBaseUrl+defaultFlag"></image>
          <div class="item-top">
            <image class="bank-img" :src="imgBaseUrl+item.bankImg"></image>
            <div class="bank-info">
              <text class="bank-num">{{item.CustActNum | blurCardNum}}</text> 
              <text class="bank-name">{{item.BankName}}</text>
            </div>
            <div class="item-top-right">
              <text class="register-time">注册时间：{{item.ActCrnTime.substr(0, 10)}}</text>
            </div>
          </div>
          <div class="item-bottom">
            <div @click="logoutAccount(item)" class="item-bottom-left">
              <text class="item-bottom-text">注销</text>
            </div>
            <div class="line"></div>
            <div class="item-bottom-right">
              <text @click="changeDefaultAccount('DFLT',item)" v-if="item.DftAccType=='NDFT'" class="item-bottom-text">设置为默认账户</text>
              <text @click="changeDefaultAccount('NDFT',item)" v-if="item.DftAccType=='DFLT'" class="item-bottom-text">取消默认账户</text>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="bankType=='wjrcb'">
      <div class="cellList">
        <div class="cellItem border-bottom">
          <text class="itemLeft">绑定手机号：</text>
          <text class="itemRight">{{accountInfo.CustPhone|blurMobilePhone}}</text>
        </div>
        <div class="cellItem border-bottom">
          <!-- <text v-if="accountInfo.DftAccType=='DFLT'" class="itemLeft">默认账户：</text>
          <text v-if="accountInfo.DftAccType=='NDFT'" class="itemLeft">非默认账户：</text> -->
          <text class="itemLeft">绑定账户：</text>
          <text class="itemRight">{{accountInfo.CustActNum|blurCardNum}}</text>
          <image :src="defaultUrl" class="default_img" v-if="accountInfo.DftAccType=='DFLT'"></image>
        </div>
        <div class="cellItem border-bottom">
          <text class="itemLeft">状态：</text>
          <text class="itemRight">正常</text>
        </div>
      </div>
      <div class="bottom">
        <text @click="replaceStage('main.MTChangerInput?Page=0')" class="bottom-button bottom-button-left">变更绑定账户</text>
        <text @click="replaceStage('main.MTChangerInput?Page=1')" class="bottom-button">变更默认账户</text>
      </div>
    </div>
    <div v-if="bankType=='allBank'&&cardlist.length==0">
      <no-record recordText="当前暂无绑定关系"></no-record>
    </div>
    <popup :isTrue="isTrue" :popupData="popupData" :orderType="orderType" :paramsPopup="paramsPopup" @closePopup="closePopup" @inTheEnd="inTheEnd"></popup>
  </div>
</template>

<script>
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");

import TitleBar from "@/components/templet/titlebar";
import Popup from "@/components/templet/popup";
import NoRecord from "@/components/templet/no-record.vue";

export default {
  components: {
    TitleBar,
    Popup,
    NoRecord
  },
  created() {
    this.getParams();
  },
  data() {
    return {
      imgBaseUrl: "./imgs/bindingRrecord/",
      defaultFlag: "default.png",
      defaultUrl:"./imgs/mobileTransferRegister/default@2x.png",
      cardlist: [],
      accountInfo: {},
      bankType: "",
      popupData: {
        title: "",
        url: "ActMsgChg",
        smsUrl: "ActMsgChg",
        after: "ActMsgChgAfter",
        ActChType: "",
        resultPath: ""
      },
      orderType: [],
      paramsPopup: {},
      isTrue: false
    };
  },
  methods: {
    getParams() {
      let params = this.$route.params;
      if (params.type == "allBank") {
        this.cardlist = params.cardlist;
      }
      this.bankType = params.type;
      this.accountInfo = params.accountInfo;
    },
    logoutAccount(item) {
      this.popupData.title = "注销手机号转账";
      this.popupData.ActChType = "1";
      this.paramsPopup = {
        //传给弹框的参数
        CustActNum: this.accountInfo.CustActNum, 
        AcctBank: this.accountInfo.AcctBank,
        ActChType: "1",
        DelBankNum: item.AcctBank,
        CagBankNum: item.AcctBank,
        _tokenName: ""
      };
      this.toConfirm();
    },
    changeDefaultAccount(DftAccType, item) {
      this.popupData.title = "默认账户变更";
      this.popupData.ActChType = "3";
      this.paramsPopup = {
        //传给弹框的参数
        CustActNum: this.accountInfo.CustActNum,
        AcctBank: this.accountInfo.AcctBank,
        CagBankNum: item.AcctBank,
        ActChType: "3",
        DftAccType: DftAccType,
        _tokenName: ""
      };
      this.toConfirm();
    },
    toConfirm() {
      this.goJson("/refacmob/ActMsgChgConfirm.do", {}, response => {
        this.orderType = response.data.TypeList;
        this.orderType.map((ele, index) => {
          if (ele.value == 4) {
            ele.text = "云盾";
            ele.txetPlace = "请输入云盾密码";
            ele.title = "云盾密码";
          } else if (ele.value == 2) {
            ele.text = "令牌";
            ele.txetPlace = "请输入动态口令";
            ele.title = "动态口令";
          } else if (ele.value == 1) {
            ele.text = "短信";
            ele.txetPlace = "请输入短信验证码";
            ele.title = "短信验证码";
          }
        });
        this.paramsPopup._tokenName = response.data._tokenName;
        this.isTrue = true;
      });
    },
    //绑定信息查询
    ActMsgDon() {
      this.goJson("/refacmob/ActMsgDon.do", {}, response => {
        let cardlist = response.data.List;
        for (let val of cardlist) {
          val.bankImg = this.cardImageMap(val.AcctBank);
        }
        this.cardlist = cardlist;
        wjalert.alert(`变更成功`, "确认", data => {
          //点击确认执行方法
        });
      });
    },
    cardImageMap(x) {
      if (x) {
        if (x == "314305400015") return "9999.png";

        if (x.length > 4) x = x.substring(0, 3);

        let cardNum = [
          "102",
          "103",
          "104",
          "105",
          "301",
          "302",
          "303",
          "305",
          "308",
          "310",
          "403",
          "9999"
        ];
        if (cardNum.indexOf(x) != "-1") return x + ".png";
      }
      return "Headportrait@3x.png";
    },
    closePopup() {
      this.isTrue = false;
    },
    inTheEnd() {
      this.ActMsgDon();
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #ececec;
}
.card-list {
  padding-left: 20px;
  padding-right: 20px;
}
.card-item {
  margin-top: 20px;
  padding-left: 25px;
  padding-right: 25px;
  width: 710px;
  border-radius: 10px;
  background-color: #ffffff;
}
.default-flag-img {
  width: 76px;
  height: 76px;
  position: absolute;
  top: 0px;
  right: 0px;
}
.item-top {
  margin-top: 30px;
  flex-direction: row;
  align-items: center;
}
.bank-img {
  width: 80px;
  height: 80px;
}
.bank-info {
  margin-left: 20px;
}
.bank-num {
  margin-bottom: 5px;
  font-size: 28px;
  color: rgb(34, 34, 34);
}
.bank-name {
  margin-top: 5px;
  font-size: 24px;
  color: rgba(153, 153, 153, 0.9);
}
.item-top-right {
  margin-top: 6px;
  height: 74px;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
}
.register-time {
  margin-right: 11px;
  font-size: 24px;
  color: rgba(153, 153, 153, 0.9);
}
.item-bottom {
  margin-top: 25px;
  border-top-width: 1px;
  border-top-color: rgb(221, 221, 221);
  width: 660px;
  height: 90px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.item-bottom-left {
  flex: 1;
  justify-content: center;
  align-items: center;
}
.item-bottom-right {
  flex: 1;
  align-items: center;
  justify-content: center;
}
.item-bottom-text {
  font-size: 28px;
  color: rgb(34, 34, 34);
}
.line {
  width: 1px;
  height: 34px;
  background-color: rgb(221, 221, 221);
}
.border-bottom {
  border-bottom-color: rgb(221, 221, 221);
  border-bottom-width: 1px;
}
.cellList {
  width: 750px;
  margin-top: 16px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #ffffff;
}
.cellItem {
  height: 96px;
  flex-direction: row;
  align-items: center;
}
.itemLeft {
  width: 196px;
  font-size: 28px;
  color: rgb(34, 34, 34);
}
.itemRight {
  font-size: 28px;
  color: rgb(34, 34, 34);
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
.default_img{
  width:80px;
  height: 80px;
  position: absolute;
  top:0px;
  right: 0px;
}
</style>
