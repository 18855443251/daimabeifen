<template>
  <div>
    <nav-bar title="代发工资详情"></nav-bar>
    <div class="payrollWageDetail">
      <div class="wrapper">
        <div class="wrapper_box">
          <text class="wrapper_icon">¥</text>
          <text class="wrapper_title">{{moneyFilter($store.state.payrollWageDetail.TotalAmount)}}</text>
        </div>
        <text class="wrapper_chi">总笔数&nbsp;&nbsp;&nbsp;&nbsp;(共{{$store.state.payrollWageDetail.TotalCount}}笔)</text>
      </div>
      <div class="text_gray"></div>
      <div class="detail">
        <div class="detail_box">
          <text class="text_title">批次号</text>
          <text class="text_desc">{{$store.state.payrollWageDetail.BatchNo}}</text>
        </div>
        <div class="detail_box">
          <text class="text_title">发放日期</text>
          <text class="text_desc">{{dealTime3($store.state.payrollWageDetail.GrantDate)}}</text>
        </div>
        <div class="detail_box">
          <text class="text_title">发放账号</text>
          <text class="text_desc" v-if="$store.state.accountProtect">{{AccountNoFormat($store.state.payrollWageDetail.PayerAcNo,6,-4)}}</text>
           <text class="text_desc" v-else>{{AccountNoFormat($store.state.payrollWageDetail.PayerAcNo)}}</text>
        </div>
        <div class="detail_box">
          <text class="text_title">成功金额</text>
          <text class="text_desc">¥{{moneyFilter($store.state.payrollWageDetail.SuccessAmount)}}</text>
        </div>
        <div class="detail_box">
          <text class="text_title">成功笔数</text>
          <text class="text_desc">{{$store.state.payrollWageDetail.SuccessCount}}</text>
        </div>
        <div class="detail_box">
          <text class="text_title">失败金额</text>
          <text class="text_red">¥{{moneyFilter($store.state.payrollWageDetail.FailAmount)}}</text>
        </div>
        <div class="detail_box">
          <text class="text_title">失败笔数</text>
          <text class="text_red">{{$store.state.payrollWageDetail.FailCount}}笔</text>
        </div>
        <!-- <div class="detail_box">
          <text class="text_title">录入渠道</text>
          <text class="text_desc">{{channel}}</text>
        </div> -->
      </div>
      <div class="btn">
        <text class="detail_btn" @click="check">查看收款人明细</text>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
const stream = weex.requireModule("stream");
export default {
  components: { NavBar },
  data() {
    return {
      // channel: "手机银行"
    };
  },
  methods: {
    check() {
      this.jump("/payeeDetail2");
    }
  }
};
</script>
<style scoped>
.payrollWageDetail {
  background-color: rgba(255, 255, 255, 1);
}
.wrapper {
  height: 156px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper_title {
  font-size: 56px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin-left: 10px;
}
.wrapper_chi {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}
.detail {
  height: 704px;
}
.detail_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 88px;
  margin-left: 30px;
  padding-right: 30px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(221, 221, 221, 1);
}
.text_desc {
  font-size:30px;
font-family:PingFang-SC-Medium,PingFang-SC;
font-weight:500;
color:rgba(124,124,124,1);
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.wrapper_icon {
  font-size: 36px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.wrapper_box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 118px;
}
.detail_btn {
  width: 670px;
  height: 88px;
  background-image: linear-gradient(to right,rgba(251,93,122,1),rgba(230,2,44,1));
  border-radius: 12px;
  text-align: center;
  line-height: 88px;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.text_red {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(230, 2, 44, 1);
}
.text_title{
font-size:30px;
font-family:PingFang-SC-Medium,PingFang-SC;
font-weight:500;
color:rgba(51,51,51,1);
}
</style>          



