<template>
    <div class="container">
        <div>
          <div class="kong"></div>       
          <div class="footer">
              <div class="left_button" @click="refuse">
                <text class="font32 black">拒绝</text>
              </div>
              <div class="right_button" @click="pass">
                <text class="font32 white">通过</text>
              </div>
          </div>
        </div>
        <div class="mark" v-if="showReason">
          <div class="reason" :style="{'bottom':list_bottom+'px'}">
            <div class="reason_title">
              <text class="reason_info">拒绝原因</text>
              <image class="reason_img" :src="reasonImg" @click="closeReason"></image>
            </div>
            <textarea placeholder="请输入拒绝原因" rows="4" cols="30" v-model="RefuseReason" class="input" @focus="showfocus" @blur="showblur" maxlength="9"></textarea>
            <div class="button" @click="reasonpass">
                <text class="font32 white">确认</text>
            </div>
          </div>
        </div>
        <!-- <cfca-confirm v-if = "showCfca" @changeCfca = "change($event)"></cfca-confirm>        -->
    </div>
</template>


<style scoped>
.mark{
  position: fixed;
    top: 0;
    left: 0;
    width: 750px;
    height: 1334px;
    z-index: 10;
    /* background-color: black; */
    background-color: rgba(0, 0, 0, 0.4);
}
.reason{
  width: 750px;
  height: 640px;
  background-color: #ffffff;
  position: fixed;
}
.reason_title{
  position: relative;
  width: 750px;
  height: 120px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.reason_info{
  font-size: 36px;
  color: #333333;
  font-weight: bold;
}
.reason_img{
  width: 36px;
  height: 36px;
  position: absolute;
  top: 45px;
  right: 30px;
}
.input{
  width:690px;
  height:300px;
  border-radius:12px;
  border-width: 1px;
  border-color: rgb(221,221,221);
  border-style:solid;
  padding: 20px;
  line-height: 40px;
  font-size: 28px;
  color: #aaa;
  margin-left: 30px;
}
.button{
  width: 670px;
  height: 88px;
  background-image: linear-gradient(to right,#FB5D7A,#E6022C);
  flex-direction: row;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-left: 40px;
  margin-top: 80px;
}
.white{
  color: #ffffff;
}
.black{
  color: #666;
}
.font32{
  font-size: 32px;
}
.kong{
  height: 90px;
}
.footer{
    background-color: #ffffff;
    flex-direction: row;
    height: 90px;
    width: 750px;
    position: fixed;
    bottom: 0;
    left: 0;
}
.info_right{
  font-size: 30px;
  color: #666;
}
.left_button{
    width: 375px;
    background-color: #F8F8F7;
    align-items: center;
    justify-content: center;
}
.right_button{
    width: 375px;
    background-image: linear-gradient(to right,#FB5D7A,#E6022C);
    align-items: center;
    justify-content: center;
}
.kong{
  height: 120px;
}
</style>

<script>
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
import cfcaConfirm from "./cfcaConfirm.vue";
export default {
  components: {
    cfcaConfirm
  },
  data() {
    return {
      list_bottom: "0",
      reasonImg: "./imgs/cancel@2x.png",
      showReason: false,
      showCfca: false,
      selectList: [],
    };
  },
  mounted(){
    this.selectList = JSON.parse(context.sessionGetString("selectList"));
  },
  methods: {
    // 点击拒绝按钮弹出拒绝确认框
    refuse(){
      this.showReason = true;
    },
        //获取焦点定位弹出框
    showblur() {
      this.list_bottom = "0";
    },
    //关闭弹出框
    closeReason() {
      this.showReason = false;
    },
    // 确认拒绝发交易
    reasonpass() {
      if(!this.RefuseReason){
        wjalert.alert("请输入拒绝原因","确定",data=>{});
      }else{
         this.goJson("/eweb/AuthResult.do", {
              _AuthAction:"Reject",
              AuthList: this.selectList,
              RefuseReason:this.RefuseReason
        }, response => {
          let isGetCheck=context.sessionGetString("isGetCheck")||this.$store.state.isGetCheck;
          isGetCheck++;
          context.sessionSetString("isGetCheck",isGetCheck);//切换isGetCheck状态以在finish关闭场景后可实时刷新列表数据
          this.$router.push({
            path:'/CheckResult',
            query:{
              checkResultInfo:response.data.Result
            }
          });
        });
      }
    },
    // 点击通过发送交易
    pass(){
          this.goJson("/eweb/AuthResult.do", {
                _AuthAction:"Accept",
                AuthList: this.selectList,
          }, response => {
          let isGetCheck=context.sessionGetString("isGetCheck")||this.$store.state.isGetCheck;
          isGetCheck++;
          context.sessionSetString("isGetCheck",isGetCheck);//切换isGetCheck状态以在finish关闭场景后可实时刷新列表数据
          this.showReason = false;
          this.$router.push({
            path:'/CheckResult',
            query:{
              checkResultInfo:response.data.Result
            }
          });
      });
    },
    change(data){               
      this.showCfca = data;                
    },
  }
};
</script>