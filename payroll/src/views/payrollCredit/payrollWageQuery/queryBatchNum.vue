<template>
  <div>
    <div class="wrapper">
      <input
        type="number"
        placeholder="请输入批次号"
        class="input1"
        v-model="BatchNo"
      />
      <image :src="queryImg" class="query_img" @click="query" />
    </div>
    <div class="text_gray"></div>
    <list class="wage" :style="{ top: this.getPosiScrollerTop() + 210 + 'px' }">
      <cell>
        <div
          v-for="(item, index) in queryBatchNum"
          :key="index"
          class="item"
          @click="payrollWageDetail(item)"
        >
          <div class="wage_item_box box1">
            <text class="BatchNo">{{ item.BatchNo }}</text>
            <text class="TotalAmount"
              >¥{{ moneyFilter1(item.TotalAmount) }}</text
            >
          </div>
          <div class="wage_item_box box2">
            <div class="money_box">
              <text class="TotalCount">共{{ item.TotalCount }}笔/</text>
              <text class="success">成功{{ item.SuccessCount }}笔</text>
            </div>
            <image :src="arrowImg" class="arrow_img" />
          </div>
          <div class="date">
            <text class="date_text">发放日期:</text>
            <text class="date_text GrantDate">{{
              dealTime3(item.GrantDate)
            }}</text>
          </div>
        </div>
      </cell>
    </list>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
const stream = weex.requireModule("stream");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: { NavBar },
  data() {
    return {
      queryImg: this.$store.state.imgBaseUrl + "14.png",
      arrowImg: this.$store.state.imgBaseUrl + "25.png",
      // 批次号
      BatchNo: "",
      queryBatchNum:[],
    };
  },
  methods: {
    payrollWageDetail(item) {
      this.$store.state.payrollWageDetail = item;
      this.jump("/payrollWageDetail");
    },
    // 按批次号查询
    query() {
      if (!this.BatchNo) {
        wjalert.alert("请输入批次号", "确定", data => {});
      } else {
        this.post(
          "/eweb/AgentSalaryQry.do",
          {
            // 批次号
            BatchNo: this.BatchNo,
            QryType: "1"
          },
          response => {
            this.queryBatchNum = response.data.List;
          }
        );
      }
    }
  }
};
</script>
<style scoped>
.wrapper {
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-left: 30px;
  padding-right: 30px;
  border-radius: 8px;
  border-width: 1px;
  border-color: rgba(221, 221, 221, 1);
}
.input1 {
  width: 600px;
  height: 56px;
  line-height: 58px;
  outline: none;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  /* font-weight: 500; */
  color: rgba(170, 170, 170, 1);
}
.query_img {
  width: 25px;
  height: 25px;
}
.item {
  height: 200px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  filter: blur(0px);
  padding-right: 30px;
  margin-left: 30px;
  background-color: rgba(255, 255, 255, 1);
}
.money_box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.success {
  font-size: 24px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-left: 17px;
}
.wage{
  position: fixed;
  bottom:0;
  left: 0;
  right:0;
}
.wage_item_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.box1 {
  margin-top: 31px;
}
.box2 {
  margin-top: 18px;
}
.arrow_img {
  width: 14px;
  height: 24px;
}
.date {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 18px;
}
.date_text {
  font-size: 24px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(156, 156, 156, 1);
}
.TotalAmount {
  font-size: 32px;
  font-family: DIN-Medium, DIN;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-right: 70px;
}
.GrantDate {
  margin-left: 10px;
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.BatchNo {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.TotalCount {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
</style>
