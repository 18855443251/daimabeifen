<template>
  <div>
    <wxc-mask
      height="260"
      width="540"
      border-radius="24"
      duration="200"
      mask-bg-color="#FFFFFF"
      :has-animation="hasAnimation5"
      :has-overlay="true"
      :show="$store.state.isshowNewGroupMerber"
      :overlay-can-close="false"
    >
      <div class="daoru">
        <text class="daoru_text">确认删除此分组成员</text>
        <div class="daoru-footer">
          <text class="cancel" @click="cancelNewGroupMeber">取消</text>
          <div class="daoru_xian"></div>
          <text class="comfirm" @click="comfirmNewGroupMeber">确定</text>
        </div>
      </div>
    </wxc-mask>
  </div>
</template>
<script>
import { WxcMask } from "weex-ui";
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: { WxcMask },
  data() {
    return {
      xImg: this.$store.state.imgBaseUrl + "19.png",
      hasAnimation5: true
    };
  },
  methods: {
    // 取消分组
   cancelNewGroupMeber() {
      this.$store.state.isshowNewGroupMerber = false;
    },
     // 删除分组成员
   comfirmNewGroupMeber() {
      this.$store.state.newGroup.splice(
        this.$store.state.newGroup.indexOf(this.$store.state.deleteNewGroupMemberItem),
        1
      );
      wjalert.alert("删除成功","确定",data=>{});
      this.$store.state.isshowNewGroupMerber= false;
    },
  }
};
</script>
<style  scoped>
.daoru {
    width: 540px;
    height: 260px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 24px;
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


