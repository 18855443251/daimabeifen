<template>
  <div>
    <wxc-mask
      height="260"
      width="540"
      border-radius="24"
      duration="200"
      mask-bg-color="#FFFFFF"
      :has-animation="hasAnimation3"
      :has-overlay="true"
      :show="$store.state.isDaoruReset"
      :overlay-can-close="false"
    >
      <div class="daoru">
        <text class="daoru_text">是否重新导入excel文件?</text>
        <div class="daoru-footer">
          <text class="cancel" @click="cancel3">取消</text>
          <div class="daoru_xian"></div>
          <text class="comfirm" @click="comfirmExcel3">确定</text>
        </div>
      </div>
    </wxc-mask>
  </div>
</template>
<script>
import { WxcMask } from "weex-ui";
export default {
  components: { WxcMask },
  data() {
    return {
      xImg: this.$store.state.imgBaseUrl + "19.png",
      hasAnimation3: true
    };
  },
  methods: {
    // 取消导入
    cancel3() {
      this.$store.state.isDaoruReset = false;
    },
    // 确定
    comfirmExcel3() {
     this.$store.state.isDaoruReset = false;
     this.$store.state.isDaoruShow = false;
     this.$store.state.isFailClose = false;
     this.$parent.modify1();
      for (let i in this.$store.state.payrollEntry) {
          for (let j in this.$store.state.excelList) {
            if (
              this.$store.state.payrollEntry[i].PayeeAcNo ==
              this.$store.state.excelList[j].PayeeAcNo
            ) {
              this.$store.state.payrollEntry.splice(i, 1);
            }
          }
        } 
          this.$store.state.excelList=[];
           this.$parent.nextBtn();
    }
  }
};
</script>
<style  scoped>
.daoru {
    width: 540px;
    height: 260px;
    /* background-color: rgba(255, 255, 255, 1); */
   
  }
  .daoru_text {
    width: 540px;
    height: 172px;
    line-height: 172px;
    text-align: center;
    border-bottom-width: 1px;
    border-bottom-color: rgba(234, 234, 234, 1);
    font-size: 32px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
  }
  .daoru-footer {
    display: flex;
    flex-direction: row;
    flex-direction: row;
    align-items: center;
  }
  .cancel {
    width: 269px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 34px;
    font-family: PingFang-SC-Bold, PingFang-SC;
    font-weight: bold;
    color: rgba(0, 122, 255, 1);
  }
  .comfirm {
    width: 269px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 34px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: rgba(0, 122, 255, 1);
  }
  .daoru_xian {
    width: 2px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    background-color: rgba(234, 234, 234, 1);
  }
</style>


