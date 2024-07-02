<template>
  <div class="contariner">
    <nav-bar title="云盾密码重置"></nav-bar>
    <div class="yundunpasswordsetting">
      <div class="yundunpassword">
          <text class="yundunpasswordtext">新云盾密码:</text>
        <!--  客户端提供的云盾密码输入组件 onChange输入长度变化时候会触发
              nMaxInputLength最大长度
              nMinInputLength  最小长度
              strServerRandom   使用机构证书对云证通服务器返回的随机数做的签名
        -->
          <cfcaPassword @onChange="newPssword"  class="passwordtext" ref="Pwd1" nMaxInputLength="8" nMinInputLength="6" :strServerRandom="pinServerRandom" placeholder="6-8位数字与字母组合" @chickFinish="cfcaKeyboradHide"></cfcaPassword>
      </div>
      <div class="yundunpassword">
          <text class="yundunpasswordtext">确认云盾密码:</text>
          <cfcaPassword @onChange="againPssword" class="passwordtext" ref="Pwd2" nMaxInputLength="8" nMinInputLength="6" :strServerRandom="pinServerRandom" placeholder="6-8位数字与字母组合" @chickFinish="cfcaKeyboradHide"></cfcaPassword>
      </div>
      <div class="yundunbuttondiv" >
        <!-- 计算属性密码输入完全后按钮变红 可点击 -->
          <text class="yundunbuttontext" v-if="getBtnStatus" @click="confirm()">提交</text>
          <text class="yundunbuttontext1" v-if="!getBtnStatus" >提交</text>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from "../components/titlebar_component.vue";
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
const cfcaPlugin = weex.requireModule("yunzhengtong"); //云证通
const loading = weex.requireModule("loading");  //客户端写的遮罩层
export default {
  components: {
    NavBar
  },
  data() {
    return {
      pinServerRandom: "",//使用机构证书对云证通服务器返回的随机数做的签名
      getRandomInfo: {},//给云盾服务器获取随机数传的信息
      serverRandom:"",//云盾服务器随机数
      signresult:"",//拿到服务端签名后的
      authdata:{},    //云盾服务器返回的东西
      newPsswordLength:"",   //密码长度
      againPsswordLength:"",   //确认密码长度
      data:{},//获取随机数返回的信息
      isClick:true,   // 防重复点击
    };
  },
  mounted() {
    /**
     * 使用云盾第一步都是去获取随机数，随机数使用一次后就会失效需要重新获取
     * 企业的云盾为了防止一人拥有多家企业账号时候会导致一个账号开了云盾所有的都开了获取随机数的时候姓名和证件号会拼上唯一的客户号
     * 
     */
      this.getRandom();
  },
  computed:{
      //判断是否可以点击确定 
      getBtnStatus(){
          return parseInt(this.newPsswordLength)>=6&&parseInt(this.againPsswordLength)>=6;
      }
  },
  methods: {  
    //客户端提供的获取云盾密码长度的方法  新密码长度
    newPssword(event){
      this.newPsswordLength = event.length;
    },
    //客户端提供的获取云盾密码长度的方法  旧密码长度
    againPssword(event){
      this.againPsswordLength = event.length;
    },
    //获取随机数
    getRandom() {
      loading.showLoading("正在请求云盾服务器随机数");
      this.getRandomInfo.name = context.secureGetString("UserName")+context.secureGetString("CifNo"); //用户名加客户号
      this.getRandomInfo.idnum = context.secureGetString("idNumber")+context.secureGetString("CifNo");//身份证号加客户号
      this.getRandomInfo.type = this.selectType();//证件类型  
      this.getRandomInfo.mobile = context.secureGetString("Mobiel"); //手机号
      this.getRandomInfo.deviceID = context.envGet("DeviceID");//设备号
      this.getRandomInfoStr = JSON.stringify(this.getRandomInfo);
      cfcaPlugin.getRandomStr(this.getRandomInfoStr, data => {   //获取随机数的方法
        this.data = JSON.parse(data);
        if (this.data.type == "1") {   //type为1 的时候认证成功  其他情况均失败无法进行下一步
          this.serverRandom = this.data.serverRandom; //   拿到随机数
          this.RandomSign();//去服务端进行随机数加密
        } else {
          this.alertMsg(this.data.msg);
        }
      });
    },
    /**
     * 服务端对获取的随机数进行加密    
     * 服务端可能会因为证件类型的原因导致云盾解密失败，要是报签名解析失败，找服务端核对下发往云盾前置需要的证件类型是否一致
     */
    RandomSign() {
      if (this.serverRandom) {
        this.goJson("/eweb/SignRandom.do",{ 
            Random: this.serverRandom,//随机数
            IdNo:context.secureGetString("idNumber")+context.secureGetString("CifNo"),//证件号+客户号
            MobilePhone:context.secureGetString("Mobiel"),//手机号
            Name:context.secureGetString("UserName")+context.secureGetString("CifNo"),//姓名+客户号
            IdType:context.secureGetString("IdType")  //证件类型
        },response => {
          //服务端对随机数进行加密的结果
            this.signresult = response.data.SignResult;
            //调用方法发往云盾服务器验证随机数
            cfcaPlugin.auth(this.signresult, data => {
              loading.stopLoading();
              this.authdata = JSON.parse(data);
              /**
               * type 等于1的时候认证成功  0 失败 
               * state 无证书的是时候等于2  有证书返回1
               * pinState返回 1代表没有密码  返回2有密码  返回3密码锁定
               * 
               */
              if (this.authdata.type == "1") {
                //  认证通过 需要把得到随机数做的签名给云盾的面组件 没赋值或者赋值失败会导致设置密码失败
                setTimeout(() => {
                  this.pinServerRandom = this.authdata.serverRandom;
                }, 200);
              } else {
                this.alertMsg(this.authdata.msg);
              }
            });
        },failback=>{
          
        })
      }
    },
    /**
     * 点击确定去重置密码
     */
    confirm() {
      if(this.isClick){
      this.isClick = false;
      setTimeout(() => {
          this.isClick = true;
      }, 1000); 
      //checkMatchRegexWithError  验证是否通过云盾服务器的正则type返回1则代表未通过，其他都为通过
      this.$refs.Pwd1.checkMatchRegexWithError(data => {
        var params = JSON.parse(data);
        if (params.type == "1") {
          this.alertMsg("云盾密码输入有误，" + params.msg);
        } else {
          this.$refs.Pwd2.checkMatchRegexWithError(data => {
            var params = JSON.parse(data);
            if (params.type == "1") {
              this.alertMsg("确认密码输入有误，" + params.msg);
            } else {
              //checkInputValueEqual  云盾服务器校验两次密码是否输入一致，type为0代表一致
              this.$refs.Pwd1.checkInputValueEqual(this.$refs.Pwd2, data => {
                var params = JSON.parse(data);
                if (params.type == "0") {
                  //服务端发往云盾前置去清除原有的密码
                    this.goJson("/eweb/MCertPinClear.do", {
                      IdType:context.secureGetString("IdType"), //证件类型
                      IdNo:context.secureGetString("idNumber"),//证件号
                      MobilePhone:context.secureGetString("Mobiel"),//手机号
                      Name: context.secureGetString("UserName"),//用户名
                      OperType:"2",  
                    }, response => {
                      //setHKEPwd 设置密码 type为0成功
                      this.$refs.Pwd2.setHKEPwd(data => {
                        var params = JSON.parse(data);
                        if (params.type == "0") {
                          this.jump("/cloudshieldpasswordreset2"); //成功跳到成功页 
                        } else {
                          this.alertMsg(params.msg);
                        }
                      });
                    },failback=>{

                    })
                } else {
                  this.alertMsg(params.msg);
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
