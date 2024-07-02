<template>
  <div class="toolcontainer">
    <text class="banker-center-left">工具类</text>
    <div class="product-wrapper">
      <div class="row">
        <!-- <div class="depositdiv" v-for="(item,key) in financeList" :key="key" @click="JumpTo(item.url)"> -->
          <image class="toolsimg" :src="banknourl" @click="jumpBank"></image>
          <image class="toolsimg" :src="rateurl" @click="qrcode"></image>
          <!-- <div class="bankno">
            <text class="down_head">{{item.finance_type}}</text>
          </div>
          <text class="down_head_title">{{item.des}}</text> -->
          <!-- <div class="down_content">
            <div class="term_box">
              <text class="amount">{{item.des}}</text>
            </div>
          </div> -->
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.toolsimg{
  width: 334px;
  height: 180px;
}
.toolcontainer {
  width: 750px;
  padding-top: 10px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 10px;
  background-color: #ffffff;
}
.banker-center-left {
  font-size: 32px;
  font-weight: bold;
  color: #1a263f;
}
.wrapper {
  height: 288px;
  width: 690px;
  position: relative;
}
.big_bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.finance_name {
  height: 125px;
  line-height: 125px;
  font-size: 32px;
  color: #222222;
  padding-left: 30px;
}
.buy_pro {
  margin-top: 15px;
  padding-left: 30px;
  padding-right: 30px;
  flex-direction: row;
  justify-content: space-between;
}
.center {
  justify-content: center;
  align-items: center;
}
.term_box {
  height: 46px;
  flex-direction: row;
  align-items: flex-end;
}
.symbol {
  padding-bottom: 4px;
  color: #d00111;
  font-size: 28px;
}
.amount {
  font-size: 48px;
  color: #d00111;
}
.term {
  padding-bottom: 5px;
  font-size: 35px;
  color: #d00111;
}
._down {
  margin-top: 20px;
  font-size: 26px;
  color: #999999;
}

.product-wrapper {
  margin-top: 30px;
}
.row {
  flex-direction: row;
  justify-content: space-between;
}
.depositdiv {
  width: 330px;
  height: 180px;
  background-color: #ffffff;
  border-radius: 20px;
  border-bottom-color: rgb(211, 211, 211);
  border-bottom-style: solid;
  border-bottom-color: 1px;
  border-top-color: rgb(211, 211, 211);
  border-top-style: solid;
  border-top-color: 1px;
  border-right-color: rgb(211, 211, 211);
  border-right-style: solid;
  border-right-color: 1px;
  border-left-color: rgb(211, 211, 211);
  border-left-style: solid;
  border-left-color: 1px;
}
.down_head {
  line-height: 54px;
  text-align: center;
  font-size: 32px;
  color: #666666;
  margin-top: 12px;
  margin-left: 12px;
}
.bankno{
  width: 330px;
  height: 90px;
  align-items: center;
  justify-content: center;
}
.down_head_title {
  line-height: 54px;
  text-align: center;
  font-size: 26px;
  color: #999999;
  margin-top: 12px;
  margin-left: 12px;
}
.down_content {
  height: 244px;
  flex-direction: column;
  padding-top: 47px;
  margin-left: 30px;
}
.down_text1 {
  margin-top: 28px;
  font-size: 28px;
  color: #222;
}
</style>
<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
const qrscan = weex.requireModule("weexqrscan");

export default {
  props: ["jsonurl"],
  data() {
    return {
      financeList: [],
      finance: {},
      big_bg: "./imgs/tab_home/finance/finance_big_bg.png",
      samll_bg: "./imgs/tab_home/finance/finance_small_bg.png",
      banknourl:"./imgs/tab_home/finance/bankno@3x.png",
      rateurl:"./imgs/tab_home/finance/rate@3x.png",
      financialProductList: null,
      isDay: false,
      rateIsNum: false,
      hasPer: false,
      UserId: ""
    };
  },
  created() {
    this.getFinance();
  },
  methods: {
    toMore(url) {
      this.gotoStage(url);
    },
    jumpBank(){
      context.launchStage("main.bankSearch");
    },
    qrcode(){
      context.launchStage("main.deposit");
        // qrscan.scanQRcode(data => {

        // });
    },
    JumpTo(url) {
      // context.launchStage(url);
      this.gotoStage(url, true);
    },
    gotoDetails(url) {
      if (this.financialProductList) {
        this.gotoStage(url, true);
      }
    },
    getFinance() {
      if (this.jsonurl) {
        stream.fetch(
          {
            method: "GET",
            url: this.$store.state.jsonBaseUrl + this.jsonurl,
            type: "json"
          },
          res => {
            this.finance = res.data.data;
            this.financeList = this.finance.financeList;
            // this.getGalicha();
            // this.getFinancialProduct();
            // this.getLargeDeposit();
          }
        );
      }
    },
    getFinancialProduct() {
      if (context.secureGetString("idNumber")) {
        this.UserId = context.secureGetString("idNumber");
      }
      // this.goJson(
      //   "/refacmob/InvestProListQry.do",
      //   { UserId: this.UserId },
      //   res => {
      //     var tmp = res.data.List[0];
      //     this.finance.finance_type = tmp.PrdName;
      //     this.finance.rate = this.ModelCommentFormat(
      //       tmp.ModelComment,
      //       tmp.PrdTemplate
      //     );
      //     this.finance.amount = tmp.PfirstAmt / 10000;
      //     if (tmp.PrdTemplate == "1301") {
      //       tmp.term = "定期开放";
      //     } else {
      //       tmp.term = tmp.qixian;
      //     }
      //     this.finance.day = tmp.term;
      //     this.finance.template = tmp.PrdTemplate;
      //     if (!isNaN(parseFloat(this.finance.day))) {
      //       this.isDay = true;
      //     }
      //     if (!isNaN(parseFloat(this.finance.rate))) {
      //       this.rateIsNum = true;
      //     }
      //     this.financialProductList = tmp;
      //     context.sessionSetString(
      //       "financialProduct",
      //       JSON.stringify(this.financialProductList)
      //     );
      //   }
      // );
    },
    getGalicha() {
      // this.goJson("/refacmob/JLBHangQingPublicQry.do", {}, res => {
      //   var tmp = res.data.List[0];
      //   var financeListTmp = this.financeList[0];
      //   financeListTmp.rate = tmp.Yield.substring(0, 4);
      //   this.financeList.splice(0, 1, financeListTmp);
      // });
    },
    getLargeDeposit() {
      // this.goJson("/refacmob/CertificateDepositProductQry.do", {}, res => {
      //   var tmp = res.data.List[0];
      //   var financeListTmp = this.financeList[1];
      //   financeListTmp.rate = tmp.Ll.substring(0, 4);
      //   this.financeList.splice(1, 1, financeListTmp);
      // });
    },
    // 格式化收益率
    ModelCommentFormat(modelComment, PrdTemplate) {
      if (!modelComment) {
        modelComment = "暂无";
        return modelComment;
      }
      var xsd = modelComment.toString().split("-");
      if (PrdTemplate != "1300") {
        if (xsd.length == 1) {
          if (modelComment.toString().indexOf("%") != -1) {
            this.hasPer = true;
            modelComment = parseFloat(
              modelComment.toString().replace("%", "")
            ).toFixed(2);
          } else if (!isNaN(parseFloat(modelComment))) {
            modelComment = parseFloat(modelComment.toString()).toFixed(2);
          }
        } else if (xsd.length > 1) {
          var val = xsd[0];
          if (val.toString().indexOf("%") != -1) {
            this.hasPer = true;
            modelComment = parseFloat(val.toString().replace("%", "")).toFixed(
              2
            );
          } else if (!isNaN(parseFloat(val))) {
            modelComment = parseFloat(val.toString()).toFixed(2);
          }
        }
        return modelComment;
      } else {
        if (xsd.length == 1) {
          if (modelComment.toString().indexOf("%") != -1) {
            this.hasPer = true;
            modelComment = modelComment.toString().replace("%", "");
          }
          return modelComment;
        }
        if (xsd.length > 1) {
          var val = xsd[0];
          if (val.toString().indexOf("%") != -1) {
            this.hasPer = true;
            modelComment = val.toString().replace("%", "");
          } else if (!isNaN(parseFloat(val))) {
            modelComment = val.toString();
          }
        }
        return modelComment;
      }
    }
  },
  watch: {
    jsonurl() {
      this.getFinance();
    },
    // "$store.state.mobiel"() {
    //   this.getFinancialProduct();
    // }
  }
};
</script>
 