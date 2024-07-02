<template>
   <div class="contariner">
    <nav-bar title="设置密码"></nav-bar>
    <div class="yundunpasswordsetting">
      <div class="yundunpassword">
          <text class="yundunpasswordtext">云盾密码:</text>
          <cfcaPassword @onChange="newPssword" class="passwordtext" ref="Pwd1" nMaxInputLength="8" nMinInputLength="6" :strServerRandom="pinServerRandom" placeholder="6-8位数字与字母组合" @chickFinish="cfcaKeyboradHide"></cfcaPassword>
      </div>
      <div class="yundunpassword">
          <text class="yundunpasswordtext">确认云盾密码:</text>
          <cfcaPassword  @onChange="againPssword" class="passwordtext" ref="Pwd2" nMaxInputLength="8" nMinInputLength="6" :strServerRandom="pinServerRandom" placeholder="6-8位数字与字母组合" @chickFinish="cfcaKeyboradHide"></cfcaPassword>
      </div>
      <div class="yundunbuttondiv">
          <!-- <text class="yundunbuttontext">确定</text> -->
           <text class="yundunbuttontext" v-if="getBtnStatus"  @click="passwordconfirm()">提交</text>
          <text class="yundunbuttontext1" v-if="!getBtnStatus" >提交</text>
      </div>
    </div>
  </div>
</template>
<style scoped>
.contariner{
  width: 750px;
  height: 1334px;
  background-color: rgb(255,255,255);
}
.passwordtext {
  /* margin-left: 50px; */
  width: 500px;
  height: 90px;
  font-size: 30px;
  text-indent: 150px;
}
.yundunpasswordsetting {
  width:750px;
  height:1206px;
  background-color: rgba(255,255,255,1);
}
.yundunpassword {
  width: 720px;
  height: 96px;
  margin-left: 30px;
  flex-direction: row;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1);
}
.yundunpasswordtext {
  width: 230px;
  line-height: 96px;
  font-size:30px;
  font-weight:500;
  color:rgba(51,51,51,1);
}
.topinput{
  width:400px;
  height:70px;
  top: 20px;
  right:30px;
  font-size:30px;
  font-weight:500;
  text-align: right;
  color:rgba(124,124,124,1);
  position: absolute;
}
.passwordtext {
  margin-left: 50px;
  width: 500px;
  height: 90px;
  font-size: 30px;
  text-indent: 150px;
}
.passwordconfirm {
  margin-top: 20px;
  width: 750px;
  height: 90px;
  background-color: white;
  flex-direction: row;
}
.passwordconfirmtext {
  margin-top: 25px;
  margin-left: 40px;
  font-size: 28px;
}
/* .yundunbuttondiv {
  margin-left: 40px;
  width:670px;
  height:100px;
  margin-top: 250px;
  border-radius:12px;
  background-image: linear-gradient(to right,rgba(251,93,122,1),rgba(230,2,44,1));
} */
.yundunbuttondiv {
  margin-top: 250px;
  margin-left: 40px;
  width:670px;
  height:88px;
}
.yundunbuttontext {
  border-radius:12px;
   background-image: linear-gradient(to right,rgba(251,93,122,1),rgba(230,2,44,1));
   width:670px;
  height:88px;
  text-align: center;
  line-height: 88px;
  font-size:32px;
  font-family:Helvetica;
  color:rgba(255,255,255,1);
}
.yundunbuttontext1{
  border-radius:12px;
  background-image: linear-gradient(to right,  #C0C0C0,  #C0C0C0);
   width:670px;
  height:88px;
  text-align: center;
  line-height: 88px;
  font-size:32px;
  font-family:Helvetica;
  color:rgba(255,255,255,1);
}

</style>
<script>
import NavBar from "../components/titlebar_component.vue";
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const cfcaPlugin = weex.requireModule("yunzhengtong"); //云证通
const loading = weex.requireModule("loading");
const stream = weex.requireModule("stream");
const wjalert = weex.requireModule("weex-alert");

export default {
  components: {
    NavBar
  },
  data() {
    return {
      fontBgUrl: this.$store.state.imgBaseUrl + "card_bg@2x.png",
      iconUrl: this.$store.state.imgBaseUrl + "results@2x.png",
      pinServerRandom: "",
      serverRandom: "",
      getRandomInfo: {},
      getRandomInfoStr:{},
      isOpen: "",
      data1: {},
      data2: {},
      signresult:"",  //服务端加密后的随机数
      isShow:true, //是都需要设置密码
      newPsswordLength:"",   //密码长度
      againPsswordLength:"",   //确认密码长度
      isClick:true,   //是否是第一次点击
    };
  },
  mounted() {
    //this.alertM("连外网去获取随机数",data=>{
        this.getRandom();
     // })
  },
   computed:{
      //判断是否可以点击确定 
      getBtnStatus(){
          return parseInt(this.newPsswordLength)>=6&&parseInt(this.againPsswordLength)>=6;
      }
  },
  methods: {
    newPssword(event){
      this.newPsswordLength = event.length;
    },
    againPssword(event){
      this.againPsswordLength = event.length;
    },
     getRandom(){
      loading.showLoading("正在请求云盾服务器随机数");
      this.getRandomInfo.name = context.secureGetString("UserName")+context.secureGetString("CifNo");
      this.getRandomInfo.idnum = context.secureGetString("idNumber")+context.secureGetString("CifNo");
      this.getRandomInfo.type = this.selectType();
      this.getRandomInfo.mobile = context.secureGetString("Mobiel");
      this.getRandomInfo.deviceID = context.envGet("DeviceID");
      this.getRandomInfoStr = JSON.stringify(this.getRandomInfo);
      cfcaPlugin.getRandomStr(this.getRandomInfoStr, data => {
        this.data1 = JSON.parse(data);
        if (this.data1.type == "1") {
          this.serverRandom = this.data1.serverRandom; //   拿到随机数
         // this.alertM("随机数成功连接内网签去发交易"+this.serverRandom,data=>{
              this.RandomSign();
        //  })
         
        } else {
          this.alertMsg(this.data1.msg);
        }
      });
    }, 
    RandomSign() {
      if (this.serverRandom) {
        this.goJson(
          "/eweb/SignRandom.do",
          {  
            Random: this.serverRandom,
            IdNo:context.secureGetString("idNumber")+context.secureGetString("CifNo"),
            MobilePhone:context.secureGetString("Mobiel"),
            Name:context.secureGetString("UserName")+context.secureGetString("CifNo"),
            IdType:context.secureGetString("IdType")
          },
          response => {
              this.signresult = response.data.SignResult;
           // this.alertM("连接外网 去云正统  一会输入密码也用外网",res=>{
            cfcaPlugin.auth(this.signresult, data => {
              loading.stopLoading();
              this.data2 = JSON.parse(data);
            //  this.alertM(this.data2,res=>{})
              if (this.data2.type == "1") {
                //  认证通过
                setTimeout(() => {
                  this.pinServerRandom = this.data2.serverRandom;
                }, 200);
              } else {
                this.alertMsg(this.data2.msg);
              }
            });
         //   })
          },failback=>{}
        );
      }
    },
    passwordconfirm() {
      if(this.isClick){
         this.isClick = false;
      this.$refs.Pwd1.checkMatchRegexWithError(data => {  //校验密码是否符合正则表达式
        // this.alertM(JSON.stringify(data));
        var params = JSON.parse(data);
        if (params.type == "1") {
          this.isClick = true;
           this.alertMsg(params.msg);
         // this.alertM(params.msg);
        } else {
          this.$refs.Pwd2.checkMatchRegexWithError(data => {
            var params = JSON.parse(data);
            if (params.type == "1") {
               this.isClick = true;
               this.alertMsg(params.msg);
              //this.alertM(params.msg);
            } else {
              this.$refs.Pwd1.checkInputValueEqual(this.$refs.Pwd2, data => {   //输入两次密码比较是否一致
                 var params = JSON.parse(data);
                if (params.type == "0") {
                  this.$refs.Pwd2.setHKEPwd(data => {   //设置密码
                    var params = JSON.parse(data);
                    if (params.type == "0") {
                      this.jump("/cloudshieldpwdsetsuccessful");
                    } else {
                       this.isClick = true;
                       this.alertMsg(params.msg);
                     // this.alertM(params.msg);
                    }
                  });
                } else {
                   this.isClick = true;
                   this.alertMsg(params.msg);
                  //this.alertM(params.msg);
                }
              });
            }
          });
        }
      });
    }
    }
  }
};
</script>


