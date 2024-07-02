<template>
  <div>
    <nav-bar title="收款方明细"></nav-bar>
    <div class="payeeDetail">
      <list class="jilu"  :style="{ top: this.getPosiScrollerTop()+ 'px' }">
        <cell
          class="jilu_item"
          v-for="(item, index) in $store.state.payrollEntryList"
          :key="index"
        >
          <div class="jilu_item_left">
            <image v-if="BankId" :src="imgdata(BankId)" class="bank_img" />
          </div>
          <div class="jilu_item_right">
            <div class="jilu_item_box_text  box1">
              <text class="jilu_title">{{ item.PayeeAcName }}</text>
              <text class="jilu_amount">¥ {{ moneyFilter1(item.Amount) }}</text>
            </div>
            <div class="jilu_item_box_text box2">
              <text class="jilu_desc">{{ divieBanks(item.PayeeAcNo) }}</text>
              <text class="jilu_remark">{{ item.Remark }}</text>
            </div>
          </div>
        </cell>
      </list>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: { NavBar },
  data() {
    return {
      //   银行logo
      BankId: "9999",
    };
  }
};
</script>
<style scoped>
.payeeDetail {
  background-color: rgba(255, 255, 255, 1);
}
.jilu {
  position: fixed;
  bottom:0;
  left:0;
  right:0;
  background-color: rgba(249, 249, 249, 1);
}
.jilu_item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
}
.jilu_item_left {
  width: 118px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.jilu_item_right {
  width: 632px;
  filter: blur(0px);
  display: flex;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  padding-right: 30px;
}
.jilu_item_box_text {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.box1 {
  margin-top: 20px;
}
.box2 {
  margin-top: 20px;
  margin-bottom: 20px;
}
.bank_img {
  width: 64px;
  height: 64px;
}
.jilu_title {
  width:220px;
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.jilu_desc {
  width: 360px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.jilu_remark{
   text-align: right;
  width: 222px;
   font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.jilu_amount {
  text-align: right;
  width: 366px;
  font-size: 32px;
  font-family: DIN-Medium, DIN;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
</style>
