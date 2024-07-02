<template>
<scroller>
  <wxc-mask
      height="540"
      width="630"
      border-radius="0"
      duration="200"
      mask-bg-color="#FFFFFF"
      :has-animation="hasAnimation2"
      :has-overlay="true"
      :show="$store.state.promptShow"
       :overlay-can-close="false"
    >

    <div class="all">
      <div class="topDiv">
          <text class="title_text">温馨提示</text>
          <text class="gray_text">打开excel文件须知，首先打开一个excel文件，点击右上角 ，选择其他应用打开，找到美团银行银行App，然后打开到代发工资代发录入页即可</text>
      </div> 
      <div class="bottomDiv" @click="closePopup">
          <text class="remove_text">我知道了</text>
      </div>
    </div>
   </wxc-mask>
</scroller>
</template>

<style scoped>
.all{
  width:630px;
  height:540px;
  align-items: center;
  background:rgba(255,255,255,1);
}
.topDiv{
  width:630px;
  height:379px;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #EAEAEA;
}
.bottomDiv{
  width:360px;
  height:88px;
  border-radius:12px;
  margin-top:36px;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to right,rgba(251,93,122,1),rgba(230,2,44,1));
}
.title_text{
  font-size:32px;
  margin-top:36px;
  font-weight:bold;
  align-items: center;
  justify-content: center;
  color:rgba(51,51,51,1);
}
.gray_text{
  font-size:26px;
  font-weight:500;
  line-height:48px;
  align-items: center;
  margin-top:36px;
  margin-left: 40px;
  margin-right:40px;
  color:rgba(124,124,124,1);
}
.remove_text{
  font-size:32px;
  font-weight:bold;
  align-items: center;
  justify-content: center;
  color:rgba(255,255,255,1);
}
</style>

<script>
import { WxcMask } from "weex-ui";
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");

export default {
  props:["acBdkh"],
  components: {
     WxcMask
  },
  data() {
    return {
 hasAnimation2: true,
    }
  },
  created() {
  },
  methods: {
    // 关闭这个下部弹框
    popupOverlayBottomClick(){
      this.$store.state.promptShow=false;
    },
    closePopup(){
      this.popupOverlayBottomClick();
    },     
  }
};
</script>