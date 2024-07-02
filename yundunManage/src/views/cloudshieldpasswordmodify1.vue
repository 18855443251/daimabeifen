<template>
  <div class="contariner">
    <nav-bar title="云盾密码修改"></nav-bar>
      <div class="top">
        <div class="yundunpassword">
            <text class="yundunpasswordtext">原云盾密码：</text>
            <cfcaPassword @onChange="oldPssword"  class="passwordtext" ref="Pwd1" nMaxInputLength="8" nMinInputLength="6" :strServerRandom="pinServerRandom" placeholder="6-8位数字与字母组合" @chickFinish="cfcaKeyboradHide"></cfcaPassword>
        </div>
        <div class="yundunpassword">
            <text class="yundunpasswordtext">新云盾密码：</text>
            <cfcaPassword @onChange="newPssword" class="passwordtext" ref="Pwd2" nMaxInputLength="8" nMinInputLength="6" :strServerRandom="pinServerRandom" placeholder="6-8位数字与字母组合" @chickFinish="cfcaKeyboradHide"></cfcaPassword>
        </div>
        <div class="yundunpassword">
            <text class="yundunpasswordtext">确认密码：</text>
            <cfcaPassword @onChange="againPssword" class="passwordtext" ref="Pwd3" nMaxInputLength="8" nMinInputLength="6" :strServerRandom="pinServerRandom" placeholder="6-8位数字与字母组合" @chickFinish="cfcaKeyboradHide"></cfcaPassword>
        </div>
        <div class="yundunbuttondiv" >
            <!-- <text class="yundunbuttontext">确认修改</text> -->
          <text class="yundunbuttontext" v-if="getBtnStatus" @click="yundunpasswordmodify()">提交</text>
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
  /* margin-left: 200px; */
  width: 490px;
  height: 90px;
  font-size: 30px;
  text-align: right;
}
.top {
  width:750px;
  height:1206px;
  background-color:rgba(255,255,255,1);
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
.yundunpasswordtext {
  width: 230px;
  line-height: 96px;
  font-size:30px;
  font-weight:500;
  color:rgba(51,51,51,1);
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

<script>
import NavBar from "../components/titlebar_component.vue";
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const cfcaPlugin = weex.requireModule("yunzhengtong"); //云证通
const loading = weex.requireModule("loading");
const stream = weex.requireModule("stream");
export default {
  components: {
    NavBar
  },
  data() {
    return {
      pinServerRandom: "",
      getRandomInfo: {},
      signresult:"",
      oldPsswordLength:"",   //旧密码长度
      newPsswordLength:"",   //新密码长度
      againPsswordLength:"",    //确定密码长度
      isClick:true,   //重复点击判断
    };
  },
  mounted() {
  //  this.alertM("连外网去获取随机数",data=>{
      this.getRandom();
    //})
  },
    computed:{
      //判断是否可以点击确定 
      getBtnStatus(){
          return parseInt(this.oldPsswordLength)>=6&&parseInt(this.newPsswordLength)>=6&&parseInt(this.againPsswordLength)>=6;
      }
  },
  methods: {
    oldPssword(event){
      this.oldPsswordLength = event.length;
    },
    newPssword(event){
      this.newPsswordLength = event.length;
    },
    againPssword(event){
      this.againPsswordLength = event.length;
    },
    getRandom() {
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
          //})
        } else {
          this.alertMsg(this.data1.msg);
        }
      });
    },

    RandomSign() {
      if (this.serverRandom) {
        this.goJson("/eweb/SignRandom.do",{ 
            Random: this.serverRandom,
            IdNo:context.secureGetString("idNumber")+context.secureGetString("CifNo"),
            MobilePhone:context.secureGetString("Mobiel"),
            Name:context.secureGetString("UserName")+context.secureGetString("CifNo"),
            IdType:context.secureGetString("IdType")
        },response => {
            this.signresult = response.data.SignResult;
          //   this.alertM("连接外网 去云正统  一会输入密码也用外网",res=>{
            // cfcaPlugin.auth(this.signresult, data => {
              // loading.stopLoading();
            //   this.data2 = JSON.parse(data);
            //   if (this.data2.type == "1") {
            //     //  认证通过
            //     setTimeout(() => {
            //       this.pinServerRandom = this.data2.serverRandom;
            //     }, 200);
            //   } else {
            //     this.alertMsg(this.data2.msg);
            //   }
            // });
            cfcaPlugin.auth(this.signresult, data => {
              loading.stopLoading();
              this.data2 = JSON.parse(data);
             // this.alertM(this.data2,res=>{})
              if (this.data2.type == "1") {
                //  认证通过
                setTimeout(() => {
                  this.pinServerRandom = this.data2.serverRandom;
                }, 200);
              } else {
                this.alertMsg(this.data2.msg);
              }
            });
         // }
       // );
        },failback=>{})
      }
    },

    yundunpasswordmodify() {
      if(this.isClick){
      this.isClick = false;
      setTimeout(() => {
          this.isClick = true;
      }, 1000);  
      this.$refs.Pwd1.checkMatchRegexWithError(data => {     // checkMatchRegexWithError 验证是否符合正则规则  type为1 的时候为失败
        var params = JSON.parse(data);
        if (params.type == "1") {
          this.alertMsg(params.msg);
        } else {
          this.$refs.Pwd2.checkMatchRegexWithError(data => {
            var params = JSON.parse(data);
            if (params.type == "1") {   
              this.alertMsg(params.msg);
            } else {
              this.$refs.Pwd3.checkMatchRegexWithError(data => {
                var params = JSON.parse(data);
                if (params.type == "1") {
                  this.alertMsg(params.msg);
                } else {
                  //checkInputValueEqual  验证密码是否一样  type为1 的时候不一致
                  this.$refs.Pwd1.checkInputValueEqual(this.$refs.Pwd2,data => {
                      if (JSON.parse(data).type == "1") {
                        this.$refs.Pwd2.checkInputValueEqual(this.$refs.Pwd3,data => {
                            if (JSON.parse(data).type == "0") {
                              //changeHKEPwd  修改密码
                              this.$refs.Pwd1.changeHKEPwd(this.$refs.Pwd3,data1 => {
                                  if (JSON.parse(data1).type == "0") {
                                    this.jump("/cloudshieldpasswordmodify2");
                                  } else {
                                    this.alertMsg(JSON.parse(data1).msg);
                                  }
                                }
                              );
                            } else {
                              this.alertMsg(JSON.parse(data).msg);
                            }
                          }
                        );
                      } else {
                        this.alertMsg("新密码和原密码不能相同！");
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
      }
    },
    getoldcode(event) {
      this.oldcode = event.value;
    },
    getnewcode(event) {
      this.newcode = event.value;
    },
    getsucccode(event) {
      this.succcode = event.value;
    },
  }
};
</script>

