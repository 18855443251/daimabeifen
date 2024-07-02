<template>
  <div>
    <wxc-mask
      height="550"
      width="630"
      border-radius="0"
      duration="200"
      mask-bg-color="#FFFFFF"
      :has-animation="hasAnimation1"
      :has-overlay="true"
      :show="$store.state.isshowMoney"
      :overlay-can-close="false"
    >
      <div class="explain">
        <div class="explain_header">
          <text class="Remark"
            >已选项设置相同的金额({{ $store.state.payeeSeleteNumber }})</text
          >
          <image :src="xImg" class="x_img" @click="cancel" />
        </div>
        <text class="addRemark">相同代发金额</text>
        <div class="explain_money">
          <text class="yuan">¥</text>
          <price-input
            :textValue="sameAmount"
            @onChange="inputMoney"
            :stringRegex="stringRegex"
            placeholder="请输入代发金额"
            class="input2"
            type="number"
            isTS="true"
          ></price-input>
        </div>
        <div class="xian"></div>
        <div class="explain_footer">
          <text
            :class="[sameAmount == '' ? 'gray' : 'explain_btn']"
            @click="confirmAmount"
            >确认</text
          >
        </div>
      </div>
    </wxc-mask>
  </div>
</template>
<script>
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
import { WxcMask } from "weex-ui";
export default {
  components: { WxcMask },
  props: ["Mflag"],
  data() {
    return {
      xImg: this.$store.state.imgBaseUrl + "19.png",
      hasAnimation1: true,
      // 相同金额
      sameAmount: "",
      stringRegex: "^(([0]|(0[.]\\d{0,2}))|([1-9]\\d{0,12}(([.]\\d{0,2})?)))?$"
    };
  },
  methods: {
    inputMoney(event) {
      this.sameAmount = event.value;
    },
    // 取消
    cancel() {
      this.$store.state.isshowMoney = false;
    },
    // 确认
    confirmAmount() {
      // 全部收款人页
      if (!this.sameAmount) {
        return;
      } else if (Number(this.sameAmount) == 0) {
          wjalert.alert("金额不能为0", "确定", data => {});
          return;
        }else {
        if (this.Mflag == "0") {
          for (let j in this.$store.state.allPayeeList) {
            if (this.$store.state.allPayeeList[j].select == true) {
              if (this.$store.state.allPayeeList[j].selectFlag == false) {
                this.$store.state.allPayeeList[j].Amount = this.sameAmount;
                this.$store.state.isshowMoney = false;
              }
            }
          }
        } else {
        for (var i = 0; i < this.$store.state.payrollEntry.length; i++) {
            if((this.$store.state.payrollEntry[i].errorMsg=="金额格式不正确"&&this.$store.state.payrollEntry[i].flag == "2"&&this.$store.state.payrollEntry[i].Remark.length <= 8)||(this.$store.state.payrollEntry[i].errorMsg=="金额不能为空"&&this.$store.state.payrollEntry[i].flag == "2"&&this.$store.state.payrollEntry[i].Remark.length <= 8)||(Number(this.$store.state.payrollEntry[i].Amount)==0 &&this.$store.state.payrollEntry[i].flag == "2"&&this.$store.state.payrollEntry[i].Remark.length <= 8)){
               this.$parent.test();
               this.$store.state.payrollEntry[i].errorMsg="";
                 this.$store.state.payrollEntry[i].flag="1";
            }else if((this.$store.state.payrollEntry[i].errorMsg=="金额格式不正确"&&this.$store.state.payrollEntry[i].flag == "2"&&this.$store.state.payrollEntry[i].Remark.length > 8)||(this.$store.state.payrollEntry[i].errorMsg=="金额不能为空"&&this.$store.state.payrollEntry[i].flag == "2"&&this.$store.state.payrollEntry[i].Remark.length > 8)||(Number(this.$store.state.payrollEntry[i].Amount)==0 &&this.$store.state.payrollEntry[i].flag == "2"&&this.$store.state.payrollEntry[i].Remark.length > 8)){
              this.$store.state.payrollEntry[i].errorMsg="";
               this.$store.state.payrollEntry[i].flag="2";
            }
            this.$store.state.payrollEntry[i].Amount = this.sameAmount;
           } 
        }
        this.$store.state.isshowMoney = false;
        this.sameAmount = "";
      }
    }
  }
};
</script>
<style scoped>
.explain {
  width: 630px;
  height: 550px;
  background-color: rgba(255, 255, 255, 1);
}
.explain_header {
  width: 630px;
  height: 108px;
  justify-content: center;
  align-items: center;
}
.Remark {
  font-size: 36px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.addRemark {
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(51,51,51,1);
  margin-left: 40px;
  margin-top: 28px;
}
.explain_text {
  width: 550px;
  height: 90px;
  display: flex;
  justify-content: center;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: rgba(221, 221, 221, 1);
  margin-top: 20px;
  margin-left: 40px;
}
.explain_money {
  width: 550px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: rgba(221, 221, 221, 1);
  margin-top: 20px;
  margin-left: 40px;
}
.input1 {
  width: 500px;
  height: 80px;
  padding-left: 24px;
  line-height: 80px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(170, 170, 170, 1);
}
.input2 {
  width: 500px;
  height: 80px;
  padding-left: 10px;
  line-height: 80px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  /* font-weight: 500; */
  /* color: rgba(170, 170, 170, 1); */
   color: rgba(124, 124, 124, 1);
}
.yuan {
  margin-left: 24px;
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.explain_footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 35px;
}
.explain_btn {
  width: 550px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  border-radius: 12px;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.gray {
  width: 550px;
  height: 88px;
  line-height: 88px;
  text-align: center;
   background-image: linear-gradient( to right,rgb(221, 221, 221),rgb(221, 221, 221));
  /* background-color: rgba(210, 209, 209, 0.56); */
  /* opacity: 0.5; */
  border-radius: 12px;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}

.xian {
  width: 630px;
  height: 1px;
  background-color: rgba(234, 234, 234, 1);
  margin-top: 104px;
}
.x_img {
  width: 30px;
  height: 30px;
  position: absolute;
  right: 36px;
  top: 42px;
}
</style>
