<template>
  <div class="container">
    <div class="content">
      <div class="cellList" style="margin-top: 0px;">
        <div class="cellItem border-bottom">
          <text class="itemLeft">原绑定手机号：</text>
          <text class="itemRight">{{mobilePhone|blurMobilePhone}}</text>
        </div>
        <div class="cellItem border-bottom">
          <text class="itemLeft">原绑定账户：</text>
          <text class="itemRight">{{accountNum|blurCardNum}}</text>
        </div>
      </div>
      <div class="cellList">
        <div @click="selectAccount" class="cellItem space-between border-bottom">
          <div class="cellLeft">
            <text class="itemLeft">新绑定账户：</text>
            <text class="itemRight">{{newAccountNumC}}</text>
          </div>
          <div class="cellRight">
            <div class="arrow-wrapper">
              <image class="arrow" :src="arrow"></image>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <text @click="judgeData" class="bottom-button bottom-button-text">确认</text>
    </div>
    <popup :isTrue="isTrue" :popupData="popupData" :orderType="orderType" :paramsPopup="paramsPopup" @closePopup="closePopup"></popup>
  </div>
</template>

<script>
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");
const picker = weex.requireModule("weex-picker");

import Popup from "@/components/templet/popup";

export default {
  components: {
    Popup
  },
  props: {
    activeTab: {
      type: Number,
      default: 0
    }
  },
  created() {
    if (this.activeTab == 0) {
      this.init();
    }
  },
  data() {
    return {
      arrow: "./imgs/mobileTransferRegister/arrow.png",
      mobilePhone: "",
      accountNum: "",
      newAccountNum: "",
      newAccountNumC: "",
      AcctBank: "",
      defaultPiker: 0,
      bindAccountItems: [],
      aliasAccountItems: [],
      popupData: {
        title: "绑定账户变更",
        url: "ActMsgChg",
        smsUrl: "ActMsgChg",
        after: "ActMsgChgAfter",
        ActChType: "2",
        resultPath: "/MTChangeResultBind"
      },
      orderType: [],
      paramsPopup: {},
      isTrue: false
    };
  },
  methods: {
    init() {
      this.ActMsgGet();
    },
    //获取注册信息
    ActMsgGet() {
      this.goJson("/refacmob/ActMsgGet.do", {}, response => {
        var res = response.data;
        if (res.State == "1") {
          wjalert.confirm(
            "您还未注册手机号转账业务，请先完成注册再进行变更",
            "确定",
            "取消",
            data => {
              if (data == "Y") {
                context.replaceStage("main.MTRegisterInput");
              } else if (data == "N") {
                context.finish();
              }
            }
          );
        } else {
          this.mobilePhone = res.CustPhone;
          this.accountNum = res.CustActNum;
          this.AcctBank = res.AcctBank;
          this.bankInnerTransferPre();
        }
      });
    },
    //获取账号
    bankInnerTransferPre() {
      this.bindAccountItems = [];
      this.aliasAccountItems = [];
      this.goJson("/refacmob/BankInnerTransferPre.do", {}, response => {
        let payerAcNoList = response.data.CommonPayerAcNoList;
        for (let val of payerAcNoList) {
          let BankAcType = val.BankAcType;
          if (
            BankAcType == "03" ||
            BankAcType == "e" ||
            BankAcType == "s" ||
            BankAcType == "BB"
          ) {
            if (val.No == this.accountNum) {
              continue;
            }
            this.bindAccountItems.push(val.No);
            this.aliasAccountItems.push(
              this.acnoRun(val.No) + "/" + val.aliasName
            );
          }
        }
        this.newAccountNumC = this.aliasAccountItems[0];
        this.newAccountNum = this.bindAccountItems[0];
      });
    },
    acnoRun(str) {
      return str.substr(0, 4) + " **** " + "**** " + str.substr(-4);
    },
    selectAccount() {
      picker.pick(
        {
          index: this.defaultPiker,
          items: this.aliasAccountItems
        },
        event => {
          if (event.result === "success") {
            var index = event.data;
            this.newAccountNumC = this.aliasAccountItems[index];
            this.newAccountNum = this.bindAccountItems[index];
            this.defaultPiker = index;
          }
        }
      );
    },
    judgeData() {
      if (this.bindAccountItems.length == 0) {
        this.weexAlert("新绑定账户不能为空");
      } else {
        this.toConfirm();
      }
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
        this.paramsPopup = {
          //传给弹框的参数
          CustActNum: this.accountNum,
          AcctBank: this.AcctBank,
          mobilePhone: this.mobilePhone,
          ActChType: "2",
          AcNo: this.newAccountNum,
          _tokenName: response.data._tokenName
        };
        this.isTrue = true;
      });
    },
    closePopup() {
      this.isTrue = false;
    }
  },
  watch: {
    activeTab(value) {
      if (value == 0) {
        this.init();
      }
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #ececec;
}
.border-bottom {
  border-bottom-color: rgb(221, 221, 221);
  border-bottom-width: 1px;
}
.space-between {
  justify-content: space-between;
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
.cellLeft {
  flex-direction: row;
  align-items: center;
}
.arrow-wrapper {
  height: 96px;
  width: 96px;
  flex-direction: row-reverse;
  align-items: center;
}
.arrow {
  width: 26px;
  height: 26px;
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
}
.bottom-button-text {
  color: #ffffff;
  font-size: 32px;
}
</style>
