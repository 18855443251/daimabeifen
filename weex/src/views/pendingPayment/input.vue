<template>
  <div class="container">
    <title-bar title="待付款流水查询"></title-bar>
    <div class="content">
      <div class="cell-list" v-for="(item,key) in cardlist" :key="key" @click="nextPage(item)">
        <div class="cell-item border-bottom">
          <div class="cell-left">
            <image class="bank-img" :src="imgBaseUrl+item.bankImg"></image>
            <div class="cell-left-box">
              <div class="payment-info">
                <text class="payer-name">{{item.payeename}}</text>
                <text class="tail-number">{{"（尾号"+item.payeeacc.substr(-4)+"）"}}</text>
              </div>
              <text class="bank-name">{{item.sendbankname}}</text>
            </div>
          </div>
          <div class="cell-right">
            <div class="cell-right-box">
              <div class="amount-box">
                <text class="sign">- </text>
                <text class="amount">{{item.amount}}</text>
              </div>
              <text class="time">{{item.workdate}}</text>
            </div>
            <image class="more" :src="more"></image>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isShow">
      <no-record recordText="当前暂无待付款流水"></no-record>
    </div>
  </div>
</template>

<script>
const context = weex.requireModule("context");

import TitleBar from "@/components/templet/titlebar";
import NoRecord from "@/components/templet/no-record.vue";

export default {
  components: {
    TitleBar,
    NoRecord
  },
  created() {
    this.DrFlowGet();
  },
  data() {
    return {
      more: "./imgs/tab_user/user/more.png",
      imgBaseUrl: "./imgs/bindingRrecord/",
      cardlist: [],
      isShow: false
    };
  },
  methods: {
    //待付款流水查询
    DrFlowGet() {
      this.goJson("/refacmob/DrFlowGet.do", {}, response => {
        let cardlist = response.data.List;
        for (let val of cardlist) {
          val.bankImg = this.cardImageMap(val.sendbank);
        }
        this.cardlist = cardlist;
        if (cardlist.length == 0) {
          this.isShow = true;
        }
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
    nextPage(item) {
      this.$router.push({
        name: "PendingPaymentDetail",
        params: { item }
      });
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #ececec;
}
.cell-list {
  width: 750px;
  margin-top: 16px;
  padding-left: 30px;
  padding-right: 30px;
  background-color: #ffffff;
}
.cell-item {
  height: 140px;
  width: 690px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.cell-left {
  height: 140px;
  flex-direction: row;
  align-items: center;
}
.bank-img {
  width: 76px;
  height: 76px;
}
.cell-left-box {
  margin-left: 25px;
}
.payment-info {
  margin-bottom: 6px;
  flex-direction: row;
  align-items: center;
}
.payer-name {
  font-size: 32px;
  color: rgb(34, 34, 34);
}
.tail-number {
  font-size: 29px;
  color: rgb(34, 34, 34);
}
.bank-name {
  font-size: 24px;
  color: rgb(153, 153, 153);
  margin-top: 6px;
}
.cell-right {
  height: 140px;
  flex-direction: row;
  align-items: center;
}
.cell-right-box {
  height: 140px;
  justify-content: center;
  margin-right: 25px;
}
.amount-box {
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 7px;
}
.sign {
  font-size: 30px;
  color: rgb(31, 182, 92);
}
.amount {
  font-size: 30px;
  color: rgb(34, 34, 34);
}
.time {
  font-size: 24px;
  color: rgb(153, 153, 153);
  margin-top: 6px;
}
.more {
  width: 26px;
  height: 26px;
}
</style>
