<template>
  <div class="container">
    <title-bar title="手机号绑定关系查询"></title-bar>
    <div class="content">
      <div class="cellList">
        <div class="cellItem border-bottom">
          <text class="itemLeft">绑定手机号：</text>
          <text class="itemRight">{{mobilePhone|blurMobilePhone}}</text>
        </div>
        <div class="cellItem">
          <div class="cellLeft">
            <text class="itemLeft">查询银行：</text>
          </div>
          <div class="cellRight">
            <div class="tab">
              <div v-for="(item , key) in tabs" :key="key" class="tabItem" @click="tabSelect(key)">
                <text class="tab-unseleted" :class="[activeTab==key?'tab-seleted':'']">{{item}}</text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <text @click="toConfirm" class="bottom-button bottom-button-text">查询</text>
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
  created() {},
  mounted() {
    this.getUserinfo();
  },
  data() {
    return {
      mobilePhone: "",
      bankType: "本行",
      tabs: ["本行", "所有银行"],
      activeTab: 0,
      accountInfo: {}
    };
  },
  methods: {
    getUserinfo() {
      this.mobilePhone = context.secureGetString("Mobiel"); //手机号
    },
    tabSelect(param) {
      if (this.activeTab != param) {
        this.activeTab = param;
      }
    },
    toConfirm() {
      if (this.activeTab == 0) {
        this.ActMsgGet(() => {
          this.next("MBindingRrecordResult", {
            type: "wjrcb",
            accountInfo: this.accountInfo
          });
        });
      } else {
        this.ActMsgGet(() => {
          this.ActMsgDon();
        });
      }
    },
    //获取注册信息
    ActMsgGet(callback) {
      this.goJson(
        "/refacmob/ActMsgGet.do",
        {
          CheckAcNoFlag: "N"
        },
        response => {
          var res = response.data;
          if (res.State == "1") {
            wjalert.confirm(
              "您未注册本行手机号转账，是否进行注册?",
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
            this.accountInfo = res;
            callback && callback();
          }
        }
      );
    },
    //绑定信息查询
    ActMsgDon() {
      this.goJson("/refacmob/ActMsgDon.do", {}, response => {
        let cardlist = response.data.List;
        for (let val of cardlist) {
          val.bankImg = this.cardImageMap(val.AcctBank);
        }
        var params = {
          type: "allBank",
          accountInfo: this.accountInfo,
          cardlist: cardlist
        };
        this.next("MBindingRrecordResult", params);
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
    next(name, params) {
      this.$router.push({
        name,
        params
      });
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
.cellLeft {
  flex-direction: row;
  align-items: center;
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
.tab {
  flex-direction: row;
  border-radius: 10px;
}
.tabItem {
  flex-direction: row;
}
.tab-unseleted {
  width: 160px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 28px;
  color: #ffffff;
  background-color: #cacbcc;
}
.tab-seleted {
  background-color: rgb(193, 153, 101);
}
</style>
