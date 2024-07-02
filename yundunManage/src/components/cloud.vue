<template>
  <div>
      <div class="cloudfast">
          <div class="left">
            <div class="cloud_top">
                <div class="img_box">
                    <image class="banklogo" :src="banklogo"/>
                 </div>
                 <div class="bank_info">
                     <text class="bankname">吴江农商行</text>
                     <text class="banktype" v-if="cartype">云闪付卡</text>
                     <text class="banktype" v-if="!cartype">实体卡</text>
                  </div>
                  <div class="right_box">
                      <image class="rightcard" :src="quickUrl"/>
                       <image class="rightcard" :src="unonpayUrl"/>
                  </div>
                  </div>
                 <div class="cloud_middle">
                    <text class="bankcardnums"   v-if="carnum">****{{item.cardPan}}</text>
                    <text class="bankcardnums"   v-if="!carnum">{{item.cardId}}</text>
                    <text class="defaultaccount" v-if="item.isDefaultCard =='true'">默认账户</text>
                    <text class="defaultaccount" v-if="item.isDefaultCard =='false'" @click="setdefault(item.cardId)">设为默认</text>
                  </div>
                  <div class="line"></div>
                  <div class="cloud_bottom">
                     <div class="status">
                         <text class="cardstatus" v-if="item.cardState =='0'" @click="toActive(item.cardId)">待激活</text>
                         <text class="cardstatus" v-if="item.cardState =='1'">正常</text>
                         <text class="cardstatus" v-if="item.cardState =='2'">锁定</text>
                         <text class="cardstatus" v-if="item.cardState =='3'">已激活</text>
                         <image class="statusicon" :src="statusicon" v-if="item.cardState =='0'"/>
                       </div>
                        <text  class="cancleText" @click="cancel(item.cardId)">注销</text>  
                        <image class="reserve" :src="reserveUrl" @click="toggle"/>
                     </div>
              </div>
          </div>
  </div>
</template>
<script>
const modal = weex.requireModule('modal')
const stream = weex.requireModule('stream')
const context = weex.requireModule('context')
const weexhce = weex.requireModule("weex-hce")
const wjalert = weex.requireModule("weex-alert")
const loading = weex.requireModule("wxEncryption")
export default {
  props: ["item"],
  components: {},
  data() {
    return {
       banklogo:this.$store.state.imgBaseUrl + "WJRCB@2x.png",
       quickUrl:this.$store.state.imgBaseUrl + "Cloudflashpay@2x.png",
       unonpayUrl:this.$store.state.imgBaseUrl + "unionpay@2x.png",
       reserveUrl:this.$store.state.imgBaseUrl + "reverse@2x.png",
       statusicon:this.$store.state.imgBaseUrl + "activation@2x.png", 
       cartype:true,
       carnum:false
    }
  },
  methods: {
       //卡片数据切换  
      toggle(){
         this.cartype = !this.cartype; 
         this.carnum  = !this.carnum; 
      },  
        //设置默认卡
      setdefault(num){
          weexhce.setDefaultPaymentCard(num);
          this.$emit('havesetdefault');
       },
       //激活卡片状态
      toActive(num){
        this.$store.state.isTrue = true;
        this.$emit('havetoActive',num);
      },
       //注销
      cancel(cardNum){
        wjalert.confirm('注销后，闪付明细无法查出交易记录，您可以通过账户交易明细进行查询，您确认要注销吗?','确定','取消',data=>{
             if(data == 'Y'){
                  weexhce.revokeCard(cardNum,data =>{
                    if(JSON.parse(data).rejCode == '000000'){
                        modal.toast({message:'注销成功'});
                        this.$emit('havecancel');
                    }else{
                        modal.toast({message:'注销失败'});
                    } 
                })
             }   
        })
      },
  }
};
</script>
<style scoped>
.left{
    width:710px;
    height:290px;
    background-color:#ffffff;
    border-radius:10px; 
}
.right{
    width:188px;
    height:280px;
    background-color: rgb(238,63,35);
    margin-left:20px;
}
.cancleText{
   margin-left: 100px;
   color: #999999;
   font-size: 30px;
   margin-top: 5px;
   color: rgb(232,40,20);
}
.box{
    width: 750px;
    background-color: #ececec;
}
.cloudfast{
    width: 710px;
    height: 280px;
    background-color: #ffffff;
    border-radius:15px; 
    margin-top: 40px;
    margin-left: 20px;
    box-shadow:5px 5px 5px 5px #dddddd;
}
.cloud_top{
    flex-direction: row;
    justify-content: space-around;
    margin-top: 25px;
}
.banklogo{
    width: 88px;
    height: 88px;
}
.bank_info{
    margin-left: -85px;
}
.bankname{
     font-size: 30px;
     color: rgb(34,34,34)
}
.banktype{
     font-size: 24px;
     color: rgb(153,153,153);
     margin-top: 8px;
}
.rightcard{
    width: 66px;
    height: 66px;
    margin-left: 10px;
}
.right_box{
     flex-direction: row;
}
.cloud_middle{
     flex-direction: row;
     margin-bottom: 10px;
}
.bankcardnums{
     font-size: 32px;
     color: rgb(34,34,34);
     margin-left: 160px;
     margin-top: 10px;
     width: 400px;
}
.defaultaccount{
     width: 134px;
     height: 50px;
     border-radius:4px;
     background-color: rgb(255,226,197);
     color: rgb(221,156,72);
     line-height: 50px;
     text-align: center;
     font-size: 30px;
     margin-bottom: 8px;
}
.line{
   height: 1px;
   background-color: #dddddd;
   margin-left: 130px;
   width: 750px;
}
.cloud_bottom{
    flex-direction: row;
    justify-content: flex-start;
    margin-top: 25px;
}
.status{
    flex-direction: row;
    margin-left: 140px;
    width: 120px;
    height: 48px;
    line-height: 48px;
    border-bottom-color: rgb(88,151,235);
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-top-color: rgb(88,151,235);
    border-top-style: solid;
    border-top-width: 1px;
    border-left-color: rgb(88,151,235);
    border-left-style: solid;
    border-left-width: 1px;
    border-right-color: rgb(88,151,235);
    border-right-style: solid;
    border-right-width: 1px;
    border-radius:5px;
}
.cardstatus{
    font-size: 24px;
    color: rgb(88,151,235);
    line-height: 48px; 
    margin-left: 24px;
}
.reserve{
    width: 48px;
    height: 48px;
    margin-left: 180px;
}
.statusicon{
    width:30px;
    height:30px;
    margin-left: 20px;
    margin-top: 20px;
}
.btn {
  flex-direction: row;
  margin-top: 50px;
  margin-bottom: 50px;
  justify-content: space-around;
}
.btntext {
  width: 600px;
  height: 80px;
  color: #fff;
  font-size: 32px;
  text-align: center;
  padding-top: 20px;
  background-color: rgb(247,80,46);
  border-radius: 10px;
}
.closes{
  width: 750px;
  height:60px;
  flex-direction: row;
  justify-content: flex-end;
}
.close{
  width:48px;
  height:48px;
  margin-right: 30px;
  margin-top:20px;
}
.short{
  flex-direction: row;
  position:absolute;
  top:170px;
  right:70px;
}
.getClick{
  font-size: 30px;
  line-height:30px;
}
.btntextok {
  width: 600px;
  height: 80px;
  color: #fff;
  font-size: 32px;
  margin-left:80px;
  line-height: 80px;
  text-align: center;
  margin-top: 80px;
  background-color: rgb(247,80,46);
  border-radius: 10px;
}
.title_text {
  text-align: center;
  color: rgb(34, 34, 34);
  font-size: 32px;
  border-bottom-color: #dddddd;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding-bottom: 20px;
}
.noticeText{
    font-size: 30px;
    color: rgb(34, 34, 34);
    margin-left: 65px;
    margin-top: 60px;
}
.pas_word {
  width: 640px;
  height: 86px;
  font-size: 28px;
  color: rgb(200, 200, 200);
  margin-left: 55px;
  border-top-style: solid;
  border-top-color: rgb(200, 200, 200);
  border-top-width: 1px;
  border-left-style: solid;
  border-left-color: rgb(200, 200, 200);
  border-left-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgb(200, 200, 200);
  border-bottom-width: 1px;
  border-right-style: solid;
  border-right-color: rgb(200, 200, 200);
  border-right-width: 1px;
  border-radius: 5px;
  margin-top: 27px;
  padding-left: 10px;
}
</style>