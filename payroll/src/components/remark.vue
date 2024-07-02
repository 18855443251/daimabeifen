<template>
  <wxc-mask
    height="550"
    width="630"
    border-radius="0"
    duration="200"
    mask-bg-color="#FFFFFF"
    :has-overlay="true"
    :has-animation="hasAnimation"
    :show="$store.state.isshowRemark"
     :overlay-can-close="false"
  >
    <div class="explain">
      <div class="explain_header">
        <text class="Remark">添加备注</text>
        <image :src="xImg" class="x_img" @click="cancel" />
      </div>
      <text class="addRemark">添加备注</text>
      <div class="explain_text">
        <input type="text" placeholder="请输入备注信息" class="input1"  v-model="Remark" />
      </div>
      <div class="xian"></div>
      <div class="explain_footer" @click="confirmRemark">
        <text :class="[!Remark ? 'gray1' : 'explain_btn1']">确认</text>
      </div>
    </div>
  </wxc-mask>
</template>
<script>
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
import { WxcMask } from "weex-ui";
export default {
  components: { WxcMask },
  data() {
    return {
      xImg: this.$store.state.imgBaseUrl + "19.png",
      Remark: "",
      hasAnimation: true
    };
  },
  methods: {
    // 取消
    cancel() {
      this.$store.state.isshowRemark = false;
    },
    // 确认
    confirmRemark() {
      if(!this.Remark){
       return;
      }else if(this.Remark.length>8){
           wjalert.alert("备注最多8位", "确定", data => {});
          return;
        }else{
        // 全部收款人
      this.$store.state.payeeSeleteItem.Remark = this.Remark;
      // 代发名册
      this.$store.state.FullPayeeItem.Remark = this.Remark;
      // 分组详情
      this.$store.state.groupsDetailItem.Remark = this.Remark;
      // 分组详情
      this.$store.state.groupDetail1Item.Remark = this.Remark;
       this.Remark="";
      this.$store.state.isshowRemark = false;
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
.explain_text{
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
.explain_btn1 {
  width: 550px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  background-image: linear-gradient(to right,rgba(251,93,122,1),rgba(230,2,44,1));
  border-radius: 12px;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.gray1 {
  width: 550px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  /* background-color: rgba(210, 209, 209, 0.56); */
  /* opacity: 0.5; */
   background-image: linear-gradient( to right,rgb(221, 221, 221),rgb(221, 221, 221));
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


