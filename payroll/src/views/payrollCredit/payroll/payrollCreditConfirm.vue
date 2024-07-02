<template>
  <div>
    <nav-bar title="代发工资确认"></nav-bar>
    <div class="payrollCreditConfirm">
      <div class="wrapper">
        <div class="wrapper_box">
          <text class="wrapper_icon">¥</text>
          <text class="wrapper_title">{{
            moneyFilter1($store.state.totalMoney)
          }}</text>
        </div>
        <text class="wrapper_chi">{{
          changeMoneyToChinese($store.state.totalMoney)
        }}</text>
      </div>
      <div class="payee">
        <div class="payee_title">
          <image :src="payeeImg" class="payee_img" />
          <text class="payee_box_text">收款方信息</text>
        </div>
        <div class="payee_box">
          <text class="payee_box_title">发放日期:</text>
          <text class="payee_box_desc">{{FormattedCurDate(releaseDate)}}</text>
        </div>
        <div class="payee_box">
          <text class="payee_box_title">总笔数:</text>
          <text class="payee_box_desc">{{ $store.state.strokeCount }}笔</text>
        </div>
        <div class="payee_box">
          <text class="payee_box_title">总金额:</text>
          <text class="payee_box_desc"
            >¥{{ moneyFilter1($store.state.totalMoney) }}</text
          >
        </div>
        <div class="payee_box">
          <text class="payee_mingxi" @click="payeeDetail">收款方明细</text>
        </div>
      </div>
      <div class="payer">
        <div class="payer_title">
          <image :src="payerImg" class="payee_img" />
          <text class="payer_box_text">付款方信息</text>
        </div>
        <div class="payer_box">
          <text class="payer_box_title">名称:</text>
          <text class="payer_box_desc">{{ ellipsis($store.state.AcName1,16)}}</text>
        </div>
        <div class="payer_box">
          <text class="payer_box_title">账号:</text>
           <text class="payer_box_desc" v-if="$store.state.accountProtect">{{AccountNoFormat($store.state.AcNo1,6,-4)}}</text>
          <text class="payer_box_desc" v-else>{{divieBanks($store.state.AcNo1)}}</text>
        </div>
      </div>
      <div class="btn">
        <text class="btn_text" @click="openBottomPopup">确认</text>
      </div>
      <yundunModal v-if="isBottomShow" />
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
import { WxcPopup } from "weex-ui";
import yundunModal from "../../../components/yundunModal.vue"; //云盾模态框
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
const context = weex.requireModule("context");
const cfcaPlugin = weex.requireModule("yunzhengtong"); //云盾
export default {
  components: { NavBar, WxcPopup, yundunModal },
  data() {
    return {
      releaseDate: "",
      payeeImg: this.$store.state.imgBaseUrl + "11.png",
      payerImg: this.$store.state.imgBaseUrl + "12.png",
      _tokenName: "",
      // 显示安全认证弹框
      isBottomShow: false
    };
  },
  created() {
    this.getTokenName();
  },
  methods: {
    getTokenName() {
      this.post("/eweb/GenToken4m.do", {}, response => {
        // 防重复交易流水号
        this._tokenName = response.data._tokenName;
      });
    },
    // 打开弹框
    openBottomPopup() {
      if (context.secureGetString("CertFlag") == "1") {
        //未开通
        wjalert.confirm(
          "您尚未开通云盾，请先开通云盾",
          "确定",
          "取消",
          data => {
            if (data == "Y") {
              context.launchStage("main.yundunManage"); //跳转到云盾管理去人脸识别然后下载证书
            }
          }
        );
      } else {
        this.$store.state.confirmTransferParams = {
          // 账号
          PayerAcNo: this.$store.state.AcNo1,
          // 名称
          SalaryName:this.$store.state.AcName1,
          // 总笔数
          TotalCount: this.$store.state.strokeCount,
          // 总金额
          Amount: this.$store.state.totalMoney,
          // 发放日期
          GrantDate: this.FormattedCurDate(this.releaseDate),
          List: this.$store.state.payrollEntryList,
          _tokenName: this._tokenName,
          // AuthType: "MTOKEN"
        };
        this.isBottomShow = true;
      }
    },
    finalConfirm() {
      this.post(
        "/eweb/AgentSalary.do",
        this.$store.state.confirmTransferParams,
        response => {
        if (response.data._RejCode == "000000") {
          // 批次号
            this.$store.state.BatchNo = response.data._JnlNo;
            // 审核员审核
            this.$store.state.AuthItemList = response.data._DisplayAuthList;
            this.jump("/submittedSuccessful");
          }
        }
      );
    },
    cancel() {
      this.isBottomShow = false;
    },
    payeeDetail() {
      this.jump("/payeeDetail");
    },
  }
};
</script>
<style scoped>
.payrollCreditConfirm {
  background-color: rgba(255, 255, 255, 1);
}
.wrapper {
  height: 146px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper_box {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
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
.wrapper_chi {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}
.payee {
  height: 340px;
  border-width: 1px;
  border-color: rgba(51, 51, 51, 0.08);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 30px;
  padding-left: 24px;
  padding-right: 24px;
  /* padding-bottom: 30px; */
  /* padding-top: 30px; */
}
.payer {
  height: 240px;
  border-width: 1px;
  border-color: rgba(51, 51, 51, 0.08);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 30px;
  padding-left: 24px;
  padding-right: 24px;
  /* padding-bottom: 30px;
  padding-top: 30px; */
}
.payee_title,
.payer_title {
  display: flex;
  flex-direction: row;
  /* margin-top: 20px; */
}
.payee_box,
.payer_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
.payee_box_title,
.payer_box_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.payee_img {
  width: 34px;
  height: 34px;
}
.payee_mingxi {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(75, 149, 250, 1);
}
.payee_box_text,
.payer_box_text {
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin-left: 18px;
}
.payee_box_desc,
.payer_box_desc {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(102, 102, 102, 1);
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 112px;
}
.btn_text {
  width: 670px;
  height: 88px;
  line-height: 88px;
background-image: linear-gradient(to right,rgba(251,93,122,1),rgba(230,2,44,1));
  border-radius: 12px;
  text-align: center;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
</style>
