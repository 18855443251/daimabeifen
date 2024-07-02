<template>
  <div class="account">
     <nav-bar :title="title"></nav-bar>
        <div class="headerInfo">
          <div class="headerBorder">
              <image class="bankImg"  :src="imgdata($store.state.bankCarsInfo.BankCode,$store.state.bankCarsInfo.BankName)"></image>
              <div class="rightDiv">
                <div class="bankName">
                  <text class="bankNameText">{{$store.state.bankCarsInfo.BankName}}</text>
                  <text class="bankNameText1" @click="copyNum">复制账号</text>
                </div>
                <div class="bankCard">
                  <text class="bankNameText">{{divieBanks(PayeeAcNo)}}</text>
                  <image class="rightImg" src="./imgs/rightarrow_icon@3x.png" @click="gotoDetail"></image>
                </div>
                <text class="name">{{$store.state.bankCarsInfo.PayeeAcName}}</text>
              </div>
              
          </div>
          <div class="bottomDiv">
            <text class="textdiv" @click="gotoTrans">立即转账</text>
            <div class="all"></div>
            <text class="textdiv" @click="transRecord">转账记录</text>
          </div>
        </div>
        <div class="button">
          <text class="button_reset" @click="del">删除收款人</text>
          <text class="button_cal"  @click="edit">编辑收款人</text>
        </div>
  </div>
</template>
<script>
import NavBar from "../components/NavBar.vue"
const modal = weex.requireModule("modal")
const stream = weex.requireModule("stream")
const context =weex.requireModule('context')
const wjalert = weex.requireModule("weex-alert")
const weexConfig = weex.requireModule("weex-config")
export default {
    components:{ NavBar},
    data () {
      return {
        title:"收款人详情",
        aliasname:'',
        transUrl: this.$store.state.imgBaseUrl + "/rightarrow_icon@3x.png",
        PayeeAcNo:"",
        bankCarsInfo:[]
     }
  },
  mounted(){
    this.PayeeAcNo = this.$store.state.bankCarsInfo.PayeeAcNo;
    this.bankCarsInfo = this.$store.state.bankCarsInfo;
  },
  created(){
  },
   methods: {
     gotoDetail(){
       this.jump("/detailMes");
     },
     //跳转交易记录页面  
     transRecord(){
       context.sessionSetString("PyeAcctNo",this.PayeeAcNo);
       context.launchStage("main.otherRecordList")
        
        //context.launchStage("main.RecordList")  //main.otherRecordList
     },
     gotoTrans(){

        if(context.sessionGetString('enterBookFlag')=="0"){  //0代表是从转账页面跳进来的   进入后清除该标志 
              context.sessionSetString('updateBankName','1');
              context.sessionSetString('enterBookFlag','');  //进入后转账页面进入的标志
            //  context.sessionSetString('fastTransferFlag','transferBook');
              context.sessionSetString("payeeDetail",JSON.stringify(this.bankCarsInfo)); //存这个账号所有的信息
            //  context.sessionSetString("payeeDetail",JSON.stringify(data));
              context.finish();
         }else{
           context.sessionSetString('fastTransferFlag','transferBook');
            context.sessionSetString("payeeDetail",JSON.stringify(this.bankCarsInfo)); //存这个账号所有的信息
            context.launchStage("main.FastTrans")  //去转账页面 
         }
          
     },
     copyNum(){
       weexConfig.copyString(this.PayeeAcNo,data=>{ this.showToast("复制成功")});
      
     },
     edit(){
        this.jump('/edidalis');
     },
     del(){
        wjalert.confirm(
            "确定删除当前收款人信息？",
            "确定",
            "取消",
            data => {
              if (data == "Y") { 
               this.goJson('/eweb/PayeeBookManage.do',{
                        Operation:"2",
                        PayeeAcNo:this.$store.state.bankCarsInfo.PayeeAcNo,
                        SysFlag:this.$store.state.bankCarsInfo.SysFlag
                  },response=>{
                    context.sessionSetString("updateList",true)
                     modal.toast({message: '删除成功'});
                     setTimeout(() => {
                        this.goBack();
                     }, 500);
                  })
              } else if (data == "N") {
              }
            }
          );
     }
    }
  }
</script>
<style scoped>
 .button {
    height: 90px;
    width: 690px;
    margin-top: 600px;
    margin-left: 30px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .button_reset {
    height: 90px;
    width: 325px;
    border-radius:12px;
    border-width: 2px;
    border-color: rgba(230,2,44,1);
    line-height: 90px;
    text-align: center;
    font-size:32px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    font-weight:500;
    color:rgba(230,2,44,1);
  }
  .button_cal {
    height: 90px;
    width: 325px;
    margin-left: 40px;
    border-radius: 8px;
    background-image: linear-gradient(to right, rgb(251,93,122), rgb(230,2,44));
    /* background-color: rgb(238,63,35); */
    line-height: 90px;
    text-align: center;
    font-size: 32px;
    color: rgb(255,255,255);
    font-weight:400;
  }
.all{
  width: 1px;
  height: 44px;
  background-color: #E1E1E1;
  margin-top: 28px;
}
.textdiv{
  width: 344px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  font-size:30px;
font-family:PingFangSC-Medium,PingFang SC;
font-weight:500;
color:rgba(74,137,252,1);
}
.bottomDiv{
  width: 690px;
  height: 100px;
  flex-direction: row;
}
.name{
  font-size:28px;
font-family:PingFangSC-Regular,PingFang SC;
font-weight:400;
color:rgba(124,124,124,1);
margin-top: 5px;
}
.rightImg{
  width: 32px;
  height: 32px;
}
.bankCard{
  margin-top: 5px;
  flex-direction: row;
  justify-content: space-between;
}
.rightDiv{
   margin-left: 20px;
   width: 563px;
}
.bankNameText1{
  font-size:24px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(74,137,252,1);
}
.bankNameText{
  font-size:30px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(51,51,51,1);
}
.bankName{
  margin-top: 38px;
  flex-direction: row;
  justify-content: space-between;
}
.account{
  width: 750px;
  height: 1334px;
  background-color: rgb(255,255,255);
}
.headerInfo{
  border-radius:12px;
  margin-top: 25px;
  width: 690px;
  margin-left: 30px;
  height: 300px;
  border-width: 1px;
  border-color:rgb(240,240,240)
}
.headerBorder{
  flex-direction: row;
  height: 200px;
  width: 690px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234,234,234,1);
}
.bankImg{
  margin-left: 24px;
  margin-top: 44px;
  width: 64px;
  height: 64px;
}
</style>


