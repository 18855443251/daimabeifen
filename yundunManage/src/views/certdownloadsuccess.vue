<template>
  <div class="contariner">
    <nav-bar title="设置密码"></nav-bar>
      <div class="yundundownload">
        <!-- <div class="yundunlogo" >
            <image :src="iconUrl" class="yundunlogoicon"/>
            <text class="yundunlogotext">证书下载成功！</text>
        </div> -->
        <div class="resultTop">
            <image class="checkImg" :src="iconUrl"></image>
            <text class="checkText">证书下载成功！</text>
        </div>
        <div class="titleDiv" v-if="isShow">
          <div class="title">
            <text class="title_text">设置云盾密码</text>
          </div>
          <div class="yundunpassword">
                <text class="yundunpasswordtext">云盾密码：</text>
                <cfcaPassword @onChange="newPssword" class="passwordtext" ref="Pwd1" nMaxInputLength="8" nMinInputLength="6" :strServerRandom="pinServerRandom" placeholder="6-8位数字与字母组合" @chickFinish="cfcaKeyboradHide"></cfcaPassword>
          </div>
          <div class="yundunpassword">
              <text class="yundunpasswordtext">确认密码：</text>
              <cfcaPassword @onChange="againPssword" class="passwordtext" ref="Pwd2" nMaxInputLength="8" nMinInputLength="6" :strServerRandom="pinServerRandom" placeholder="6-8位数字与字母组合" @chickFinish="cfcaKeyboradHide"></cfcaPassword>
          </div>
        </div>
        <div class="yundunbuttondiv"  v-if="isShow">
          <text class="yundunbuttontext" v-if="getBtnStatus"  @click="passwordconfirm()">确定</text>
          <text class="yundunbuttontext1" v-if="!getBtnStatus" >确定</text>
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
.yundunbuttondiv1 {
  margin-left: 40px;
  width:670px;
  height:100px;
  margin-top: 200px;
  border-radius:12px;
  background-image: linear-gradient(to right,rgba(251,93,122,1),rgba(230,2,44,1));
}
.yundunbuttontext1 {
  line-height: 100px;
  text-align: center;
  font-size:32px;
  font-family:PingFang-SC-Bold,PingFang-SC;
  font-weight:bold;
  color:rgba(255,255,255,1);
}
.resultTop {
  margin-top: 20px;
  background-color: white;
}
.checkImg {
  width: 110px;
  height: 110px;
  margin-top: 30px;
  margin-left: 320px;
}
.checkText {
  margin-top: 20px;
  width: 750px;
  font-size:30px;
  font-family:PingFang-SC-Bold,PingFang-SC;
  font-weight:bold;
  color:rgba(51,51,51,1);
  text-align: center;
}
.yundundownload {
  width:750px;
  height:1206px;
  background-color: rgba(255,255,255,1);
}
.yundunlogo {
  width: 750px;
  height: 250px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1);
}
.titleDiv{
  margin-top: 100px;
  width:750px;
  height:280px;
  justify-content: center;
  /* border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1); */
}
.title{
  width:720px;
  height:88px;
  margin-left:30px;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1);
}
.title_text{
  font-size:30px;
  font-weight:bold;
  /* margin-left:30px; */
  color:rgba(51,51,51,1);
}
.yundunpassword {
  width: 720px;
  height: 96px;
  margin-left: 30px;
  flex-direction: row;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1);
}
.yundunpasswordtext {
  line-height: 96px;
  font-size:30px;
  font-weight:500;
  color:rgba(51,51,51,1);
}
.topinput{
  width:500px;
  height:70px;
  right:10px;
  position:absolute;
  font-size:30px;
  font-weight:500;
  color:rgba(124,124,124,1);
}
.passwordtext {
  margin-left: 50px;
  width: 500px;
  height: 90px;
  font-size: 30px;
  text-indent: 150px;
}
.yundunlogoicon {
  width: 70px;
  height: 70px;
  top: 97px;
  left: 200px;
  position:absolute;
}
.yundunlogotext {
  font-size: 32px;
  top:110px;
  left:300px;
  position: absolute;
}
.yundunbuttondiv {
  width:670px;
  height:88px;
  left:40px;
  bottom:120px;
  position: absolute;
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
      isShow:false, //是都需要设置密码
       newPsswordLength:"",   //密码长度
      againPsswordLength:"",   //确认密码长度
       isClick:true,   //是否是第一次点击
    };
  },
  mounted() {
    //1没有密码  2有   3锁定
    this.isOpen = context.sessionGetString("pinState");
    if (this.isOpen == "1") {
      this.isShow = true;
        this.getRandom();
    } else if (this.isOpen == "2") {
       this.isShow = false;
      wjalert.alert("您已设置云盾密码，请直接点击跳过", "确定", data => {
         this.$router.go(-2);
      });
    
    } else if (this.isOpen == "3") {
      wjalert.alert(
        "云盾密码功能已锁定，暂不能使用，隔天自动解锁",
        "确定",
        data => {}
      );
      this.isShow = false;
    }
    
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
              this.RandomSign();
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
            cfcaPlugin.auth(this.signresult, data => {
              loading.stopLoading();
              this.data2 = JSON.parse(data);
              if (this.data2.type == "1") {
                setTimeout(() => {
                  this.pinServerRandom = this.data2.serverRandom;
                }, 200);
              }else {
                this.alertMsg(this.data2.msg);
              }
            });
          },failback=>{}
        );
      }
    },
    /**
     * 设置密码 只要调用sdk的方法 检验正则 两次输入是否一致等等    不需要调用服务端的交易 
     */
    passwordconfirm() {
       if(this.isClick){
         this.isClick = false;
      this.$refs.Pwd1.checkMatchRegexWithError(data => {  //校验密码是否符合正则表达式
        var params = JSON.parse(data);
        if (params.type == "1") {
           this.isClick = true;
          this.alertMsg(params.msg);
        } else {
          this.$refs.Pwd2.checkMatchRegexWithError(data => {
            var params = JSON.parse(data);
            if (params.type == "1") {
               this.isClick = true;
               this.alertMsg(params.msg);
            } else {
              this.$refs.Pwd1.checkInputValueEqual(this.$refs.Pwd2, data => {   //输入两次密码比较是否一致
                 var params = JSON.parse(data);
                if (params.type == "0") {
                  //设置密码调用sdk方法  不需要发交易
                  this.$refs.Pwd2.setHKEPwd(data => {   //设置密码
                    var params = JSON.parse(data);
                    if (params.type == "0") {
                      this.jump("/cloudshieldpwdsetsuccessful");
                    } else {
                       this.isClick = true;
                       this.alertMsg(params.msg);
                    }
                  });
                } else {
                   this.isClick = true;
                   this.alertMsg(params.msg);
                }
              });
            }
          });
        }
      });
       }
    },
    /**
     * 调用这个方法去首页   可以清栈内存
     */
    passwordconfirmover() {
    //已经有密码了 去首页   cloudshieldmanagement  
      this.$router.go(-2);
    }
  
  }
};
</script>


