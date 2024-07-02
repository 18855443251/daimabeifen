<template>
  <div>
    <nav-bar title="代发录入"></nav-bar>
    <div class="selectpaymentAccount">
      <div class="wrapper">
        <div class="wrapper_box">
          <text class="wrapper_icon">¥</text>
          <text class="wrapper_title">{{ moneyFilter1($store.state.totalMoney) }}</text>
        </div>
        <div class="wrapper_box">
          <text class="allmoney">总金额</text>
          <text class="wrapper_chi">(共{{ $store.state.strokeCount }}笔)</text>
        </div>
      </div>
      <div class="text_gray"></div>
      <div class="info">
        <div class="info_box" @click="selectAcount">
          <text class="info_title">付款方账号</text>
          <div class="info_box_desc">
            <text class="info_desc1" v-if="!$store.state.AcNo1">{{
              $store.state.select
            }}</text>
            <text class="info_desc2" v-else-if="$store.state.AcNo1&&$store.state.accountProtect">{{
              AccountNoFormat($store.state.AcNo1,6,-4)
            }}</text>
               <text class="info_desc2" v-else>{{
              divieBanks($store.state.AcNo1)
            }}</text>
            <image :src="arrowImg" class="arrow_img" />
          </div>
        </div>
        <div class="balance">
          <text class="info_title">可用余额(元)</text>
          <text class="balance_desc">{{ moneyFilter1($store.state.AvailBal)}}</text>
        </div>
        <div class="info_box">
          <text class="info_title">付款方名称</text>
          <text class="info_desc">{{ellipsis($store.state.AcName1,16)}}</text>
        </div>
      </div>
      <div class="btn">
        <text class="btn_text" @click="submit">提交</text>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: { NavBar },
  data() {
    return {
      arrowImg: this.$store.state.imgBaseUrl + "25.png",
    };
  },
  methods: {
    // 选择付款方账户
    selectAcount() {
      this.jump("/chooseAccount");
    },
    submit() {
      if (!this.$store.state.AcNo1) {
         wjalert.alert("请先选择账号","确定",data=>{});
         return;
      }else if(Number(this.$store.state.AvailBal)<=Number(this.$store.state.totalMoney)){
        wjalert.alert("账户余额不足","确定",data=>{});
         return;
      }else{
          this.jump("/payrollCreditConfirm");
      } 
    }
  }
};
</script>
<style scoped>
.selectpaymentAccount {
  background-color: rgba(255, 255, 255, 1);
}
.wrapper {
  height: 166px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper_box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.wrapper_icon {
  font-size: 36px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.wrapper_title {
  font-size: 56px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin-left: 10px;
}
.allmoney {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}
.wrapper_chi {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
  margin-left: 20px;
}
.info {
  height: 434px;
}
.info_box {
  height: 110px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  margin-left: 30px;
  padding-right: 30px;
}
.info_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.info_desc {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.info_desc1 {
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(170, 170, 170, 1);
}
.info_desc2 {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.info_desc3 {
  width: 400px;
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.arrow_img {
  width: 14px;
  height: 24px;
  margin-left: 29px;
}
.balance {
  height: 81px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  margin-left: 30px;
  padding-right: 30px;
}
.info_box_desc {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.balance_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(170, 170, 170, 1);
}
.balance_desc {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(248, 124, 54, 1);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 300px;
}
.btn_text {
  width: 670px;
  height: 88px;
  line-height: 88px;
  background-image: linear-gradient(to right, rgba(251, 93, 122, 1),rgba(230, 2, 44, 1));
  border-radius: 12px;
  text-align: center;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
</style>