<template>
  <div class="container">
    <div class="content">
      <div class="cellList" style="margin-top: 0px;">
        <div class="cellItem border-bottom">
          <text class="itemLeft">绑定手机号：</text>
          <text class="itemRight">{{mobilePhone|blurMobilePhone}}</text> 
        </div>
        <div class="cellItem border-bottom">
          <text class="itemLeft">绑定账户</text>
          <text class="itemRight">{{accountNum|blurCardNum}}</text>
        </div>
      </div>
    </div>
    <div class="bottom">
      <text @click="toConfirm" class="bottom-button bottom-button-text">确认</text>
    </div>
    <popup :isTrue="isTrue" :popupData="popupData" :orderType="orderType" :paramsPopup="paramsPopup" @closePopup="closePopup"></popup>
  </div>
</template>

<script>
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");
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
    if (this.activeTab == 2) {
      this.init();
    }
  },
  data() {
    return {
      mobilePhone: "",
      accountNum: "",
      AcctBank: "",
      popupData: {
        title: "注销手机号转账",
        url: "ActMsgChg",
        smsUrl: "ActMsgChg",
        after: "ActMsgChgAfter",
        ActChType: "1",
        resultPath: "/MTChangeResultLogout"
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
      this.goJson(
        "/refacmob/ActMsgGet.do",
        {
          CheckAcNoFlag: "N"
        },
        response => {
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
          }
        }
      );
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
          ActChType: "1",
          DelBankNum: this.AcctBank,
          CagBankNum: this.AcctBank,
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
      if (value == 2) {
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
