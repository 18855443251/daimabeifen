<template>
  <div class="contariner">
    <nav-bar title="云盾管理"></nav-bar>
      <div class="tip">
        <div class="yundunlogo">
          <image class="bglogodiv" src="./imgs/bg@2x.png" ></image>
          <text class="logoText">企业手机银行云盾为您保驾护航</text>
        </div>
        <div class="all"></div>
      <!-- 手机云盾没有开通，显示开通页面 -->
        <div v-if="isShow">
          <div class="yundunprotocoldiv">
            <div class="isAgrerDiv" @click="agreeMes">
                <image class="agreeImg" src="./imgs/Before@3x.png" v-if="isAgree"></image>
                <image class="agreeImg" src="./imgs/complete@3x.png" v-else></image>
            </div>
              <text class="xieyitext">本人已阅读并同意 </text>
              <text class="xieyilink" @click="chickprotocol">《云盾服务协议》</text>
          </div>
          <div class="yundunbuttondiv"  >
            <text class="yundunbuttontext" v-if="!getBtnStatus" @click="isSignPeople">开通云盾服务</text>
            <text class="yundunbuttontext1" v-if="getBtnStatus" >开通云盾服务</text>
          </div>
        </div>
        <div v-if="!isShow">
             <div class="limitmoney">
                <text class="limitText">云盾限额</text>
                <div class="textRight">
                  <text class="limitmoneyText1">单笔{{money(SingleLimit)}}</text>
                  <div class="lim"></div>
                  <text class="limitmoneyText">日累计{{money(CurrentLimitPerDay)}}</text>
                </div>
            </div>
            <!-- 是否开启密码 -->
            <div class="limitmoney" v-if="isSetPwd" @click="gopasswordsetting">
                <text class="limitText">开启密码保护</text>
                <image class="rightImg" src="./imgs/rightarrow_icon@2x.png"></image>
            </div> 
            <div v-if="!isSetPwd">
              <div class="limitmoney" @click="passwordmodify">
                  <text class="limitText">修改密码</text>
                  <image class="rightImg" src="./imgs/rightarrow_icon@2x.png"></image>
              </div>
              <div class="limitmoney" @click="passwordreset">
                  <text class="limitText">重置密码</text>
                  <image class="rightImg" src="./imgs/rightarrow_icon@2x.png"></image>
              </div>
            </div>
         
            <!-- <div class="button">
              <text class="button_reset" @click="passwordmodify">修改密码</text>
              <text class="button_cal"  @click="passwordreset">重置密码</text>
            </div> -->
          <div class="bottom">
              <text class="yundunbuttonclose" @click="closeyundunservicesubmit">关闭云盾</text> 
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped>
.rightImg{
  width: 17px;
  height: 35px;
  margin-top: 35px;
  margin-right: 30px;
}
.yundunbuttonclose{
  width: 750px;
  height: 70px;
  text-align: center;
  font-size:30px;
  font-family:PingFang SC;
  font-weight:500;
  color: #2779f4;
}
.bottom{
  margin-top: 150px;
}
.limitmoneyText1{
  padding-right: 10px;
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(124,124,124,1);
  line-height:110px;
}
.limitmoneyText{
  color:rgba(124,124,124,1);
  padding-left: 10px;
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:200;
  line-height:110px;
}
.lim{
  margin-top: 35px;
  width: 1px;
  height: 40px;
  background-color: rgb(124,124,124);
}
.textRight{
  padding-right: 30px;
  flex-direction: row;
}
.limitText{
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:110px;
}
.limitmoney{
  width: 710px;
  height: 110px;
  margin-left:30px;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: rgb(240,240,240);
}
.all{
  width: 750px;
  height: 20px;
  background-color: rgba(245,245,245,1);
}
.tip{
  width: 750px;
  background-color: rgba(255,255,255,1);
}
.contariner{
  width: 750px;
  height: 1334px;
  background-color: rgb(255,255,255);
}
.yundunlogo {
  width: 750px;
  height: 490px;
  /* background-color: red; */
}
.logoText{
  height:40px;
  font-size:28px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:40px;
  margin-left: 174px;
  margin-top: 80px;
}
.yundunprotocoldiv {
  margin-top: 30px;
  margin-left: 40px;
  height: 50px;
  flex-direction: row;
}
.isAgrerDiv{
  width: 40px;
  height: 50px;
}
.agreeImg{
  margin-top: 12px;
  width: 27px;
  height: 27px;
}
.xieyitext {
  line-height: 50px;
  color: #AAAAAA;
  font-size:26px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
}
.xieyilink {
  line-height: 50px;
  font-size:26px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color: #4A89FC;
}
.yundunbuttondiv {
  margin-top: 66px;
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
.button {
    height: 90px;
    width: 690px;
    margin-top: 150px;
    margin-left: 30px;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .button_reset {
    height: 90px;
    width: 330px;
    border-radius:12px;
    border-width: 2px;
    border-color: rgba(230,2,44,1);
    line-height: 90px;
    text-align: center;
    font-size:32px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    font-weight:bold;
    color:rgba(230,2,44,1);
  }
  .button_cal {
    height: 90px;
    width: 330px;
    margin-left: 30px;
    border-radius: 8px;
    background-image: linear-gradient(to right, rgb(251,93,122), rgb(230,2,44));
    line-height: 90px;
    text-align: center;
    font-size: 32px;
    color: rgb(255,255,255);
  }
.bglogodiv {
  width: 299px;
  height: 249px;
  margin-top: 65px;
  margin-left: 220px;
}

</style>

<script>
import NavBar from "../components/titlebar_component.vue";
import { WxcPopup } from "weex-ui";
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const cfcaPlugin = weex.requireModule("yunzhengtong"); //云证通
const loading = weex.requireModule("loading");
const stream = weex.requireModule("stream");
const face = weex.requireModule("face");
const qrscan = weex.requireModule("weexqrscan");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: {
    NavBar,
    WxcPopup
  },
  data() {
    return {
      isSetPwd:false,   //s是否设置了密码
      isLimit:true,   //是否设置了限额
      isAgree:true,
      getRandomInfo: {},
      states: "",
      isShow: true,
      isBottomShow: false,
      agreeflag: false,
      serverRandom:"",
      CloudFlag: "",//是否在柜面开通云盾 0-未开通  1-已开通
      signresult:"",
      YdFlag:"true" ,  //true是单人   false是多人   服务端返回的字符串格式 
      CurrentLimitPerDay:"",   //日累积限额
      SingleLimit:"",     //单笔限额
      isOpenYunDun:true,   //true 代表开通  false代表重置  网银校验码的判断
    };
  },
    computed:{
      //判断是否可以点击确定 
      getBtnStatus(){
          return this.isAgree;
      }
  },
  mounted() {
    
  //   if (context.secureGetString("CertFlag") == "0") {
  // //    loading.showLoading("正在请求随机数");  柜面开通标识CounterCertFlag=0-过人脸    1-不需要
  // //CertFlag=0-已开通   1-未开通
  //     this.isShow = false;
  //   } else {
  //     this.isShow = true;
  //   }
   /**
     * 使用云盾第一步都是去获取随机数，随机数使用一次后就会失效需要重新获取
     * 企业的云盾为了防止一人拥有多家企业账号时候会导致一个账号开了云盾所有的都开了获取随机数的时候姓名和证件号会拼上唯一的客户号
     * goMessage代表去云盾协议页面  返回不发交易用goMessage=1作为判断 用完清空
     */
    if(this.$store.state.goMessage =="1"){
      this.YdFlag =  this.$store.state.YdFlag;
      this.$store.state.goMessage ="";
      this.isAgree =  this.$store.state.isAgree;
    }else{
       this.getRandom();
        this.$store.state.isGopasswordsetting = ""; //清除跳入下个页面的标志
      //判断是单人模式还是多人模式
        // this.isSignPeople();
    //  
    }
       context.sessionSetString("isgoBack","1")  //让安全设置页面发交易的标志
     
  },
  methods: {
    chickprotocol(){
      //存入标识  从协议页面返回i不会发交易
       this.$store.state.YdFlag = this.YdFlag;
       this.$store.state.goMessage ="1";
       this.$store.state.isAgree = this.isAgree;
      this.jump("/message")
    },
    //获取限额信息
    limitMoney(){
      this.goJson("/eweb/MCertLimitQry.do",{},response => {
        this.SingleLimit = response.data.SingleLimit;  //云盾单笔限额
        this.CurrentLimitPerDay = response.data.CurrentLimitPerDay;//云盾日累计限额
      },failback=>{})
    },
    //单人模式还是多人模式
    isSignPeople(){
      this.goJson("/eweb/EntOperCountQry.do",{},response => {
        this.YdFlag = response.data.YdFlag;  //true是单人   false是多人 字符串形式的 
        //开通云盾  根据多人还是单人
        this.openyundunServe();
      },failback=>{})
    },
     //重置密码
    passwordreset(){
      this.goJson("/eweb/EntOperCountQry.do",{},response => {
        this.YdFlag = response.data.YdFlag;  //true是单人   false是多人 字符串形式的 
        //重置云盾  根据多人还是单人
        this.passwordreset1();
      },failback=>{})
    },
    //是否统一协议 
    agreeMes(){
      this.isAgree= !this.isAgree;
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
        this.goJson(
          "/eweb/SignRandom.do",{ 
            Random: this.serverRandom,//随机数
            IdNo:context.secureGetString("idNumber")+context.secureGetString("CifNo"),//身份证号加客户号
            MobilePhone:context.secureGetString("Mobiel"),//手机号
            Name:context.secureGetString("UserName")+context.secureGetString("CifNo"), //用户名加客户号
            IdType:context.secureGetString("IdType")//证件类型  
          },
          response => {
             //服务端对随机数进行加密的结果
            this.signresult = response.data.SignResult;
             //调用方法发往云盾服务器验证随机数
            cfcaPlugin.auth(this.signresult, data => {
              this.authdata = JSON.parse(data);
              loading.stopLoading();
              /**
               * type 等于1的时候认证成功  0 失败 
               * state 无证书的是时候等于2  有证书返回1
               * pinState返回 1代表没有密码  返回2有密码  返回3密码锁定
               * 
               */
              if (this.authdata.type == "1") {
                this.limitMoney();//查询云盾限额
              //   context.sessionSetString("pinServerRandom",this.authdata.serverRandom);
                if (this.authdata.PinState == "1") {
                    this.isSetPwd = true;  //没有密码显示去设置
                    loading.stopLoading();
                } 
              if(this.states == "close"){
                //close代表发关闭云盾的交易  
                    this.states = "";
                   this.confirm();
              }else if (this.authdata.PinState == "2") {
                  this.isSetPwd = false;  //有密码  显示修改重置按钮
                  context.sessionSetString("isHavePwd", "Y");
                  loading.stopLoading();
               } else if (this.authdata.PinState == "0" &&this.authdata.state != "2") {
                  this.isSetPwd = true;// 不显示修改按钮 
                  context.sessionSetString("isHavePwd", "N");
                  this.alertMsg("云盾密码功能不可用");
                  loading.stopLoading();
                } else if (this.authdata.PinState == "3" &&this.authdata.state != "2") {
                  this.isSetPwd = true;  //不显示修改按钮 
                  context.sessionSetString("isHavePwd", "N");
                  this.alertMsg(
                    "云盾密码功能已锁定，今天暂不能使用云盾密码功能！隔日自动解锁"
                  );
                  loading.stopLoading();
                }
                if (this.authdata.state == "2") {
                  this.isShow = true;
                  // context.secureSetString("CertFlag", "1");
                }else{
                    this.isShow = false;
                 // context.secureSetString("CertFlag", "0");
                }
              } else {
                this.isShow = true;
                 // context.secureSetString("CertFlag", "1");
                this.alertMsg(this.authdata.msg);
                loading.stopLoading();
              }
            });
          },failback=>{})
      }
    },
    /**
     * 开启云盾，单人模式： 证件类型二代身份证的需要验证人脸或者网银授权码   其他只走网银授权码
     * 多人模式审核 同一个客户号下面的其他的操作员进行审核 MCertAuthModeMgmtForMore交易返回的AuthFlag  //1审核完成    0待审核  
     * 去网银授权码页面传 CertTranferCode 传的是下个交易的交易码
     */
    openyundunServe() {
      if (this.isAgree == true) {
        this.alertMsg("请先勾选《云盾服务协议》");
      } else {
        this.isOpenYunDun = true;
        if(this.YdFlag == "true"){  //单人模式
          context.sessionSetString("back", "y");
          let idType = context.secureGetString('IdType');//证件类型 二代身份证走人脸 其他走网银授权码
        if(idType=="00"){
         if(context.secureGetString("CounterCertFlag") == "0"){
           //人脸sdk的证书
            face.setLicence(
              "MDQzOTA5bm9kZXZpY2Vjd2F1dGhvcml6ZZXn5+bn5+bq/+bg5efm4+f65ubn4Obg5Yjm5uvl5ubrkeXm5uvl5uai6+Xm5uvl5uTm6+Xm5uDm1efr5+vn6+er4Ofr5+vn6/vn5+bn4uTi"
            );
            face.startAliveCheck(data => {
            if (JSON.parse(data).base64) {
              context.sessionSetString("back", "n");
              this.goJson("/eweb/FaceVerify.do",{
                CifNo: context.secureGetString("CifNo"), //客户号
                UserName:context.secureGetString("UserName"), //用户姓名
                IdNo:context.secureGetString("idNumber"),   //证件号
                IdType:context.secureGetString("IdType"),  //证件类型
                Img:JSON.parse(data).base64,     //人脸的base
              },response => {
                this.jump("/certdownload");
              },fail=>{
                //发交易失败的回调
                if(fail.data.errmsg.substr(0,8)=="联网核查失败异常"){
                  wjalert.confirm("人脸识别未通过","继续重试","其他认证方式",data=>{
                  if(data == "Y") {
                    this.openyundunServe();
                  }else{
                    // CertTranferCode 到网银授权码需要传下个交易的交易吗
                      context.sessionSetString("isCert", "1");
                       context.sessionSetString("CertTranferCode","MCertAuthModeMgmt");
                      context.launchStage('main.securityCertificate');  //人脸验证失败  选择另外一种验证方法
                    }
                  })
                }else{
                   wjalert.confirm(fail.data.errmsg,"继续重试","其他认证方式",data=>{
                    if(data == "Y") {
                      this.openyundunServe();
                    }else{
                      context.sessionSetString("isCert", "1");
                       context.sessionSetString("CertTranferCode","MCertAuthModeMgmt");
                      context.launchStage('main.securityCertificate');  //人脸验证失败  选择另外一种验证方法
                    }
                  })
                }
              });
              }else if(JSON.parse(data).errorCode=="-1"){
              } else {
                //人脸sdk的报错
                  wjalert.confirm(JSON.parse(data).errorMsg,"继续重试","其他认证方式",data=>{
                    if(data == "Y") {
                      this.openyundunServe();
                    }else{
                      context.sessionSetString("isCert", "1");
                       context.sessionSetString("CertTranferCode","MCertAuthModeMgmt");
                      context.launchStage('main.securityCertificate');  //人脸验证失败  选择另外一种验证方法
                    }
                  })
              }
            });
            }else{
              this.jump("/certdownload");
            }
          }else{
              context.sessionSetString("isCert", "1");
              context.sessionSetString("CertTranferCode","MCertAuthModeMgmt");
              context.launchStage('main.securityCertificate');  //不是二代身份证的  网银授权码
          }

        }else{
            //多人模式去发交易
            this.goJson("/eweb/MCertAuthModeMgmtForMore.do",{
              OperType:"1",   //1开通  2重置
              MachineCode: context.envGet("DeviceID"),
              MachineModle: weex.config.env.deviceModel,
              IdNo:context.secureGetString("idNumber"),//身份证号
              MobilePhone:context.secureGetString("Mobiel"),//手机号
              Name:context.secureGetString("UserName"), //用户名
              IdType:context.secureGetString("IdType")//证件类型  
             //MachineModle: this.authdata.MachineModle,
            // SerialNo: "",   //证书序列号  重置密码需要
            },response => {
              this.$store.state._DisplayAuthList = response.data._DisplayAuthList;//审核模型返回的还需要多少审核员审核
              //AuthFlag  //1审核完成    0待审核  
              if(response.data.AuthFlag=="0"){
                this.$store.state.isDownLoad = "";
              this.jump("/submitsuccess")
              }else{
                this.jump("/certdownload");
              }
            },failback=>{})
        }
      }
    },
    /**
     * 点击云盾的按钮 关闭云盾  states赋值close到获取随机数的时候判断为close则去发关闭的交易
     */
    closeyundunservicesubmit() {
         wjalert.confirm("确定关闭云盾","确定","取消",data=>{
              if(data == "Y") {
                 this.states = "close";
                      this.getRandom();
              }
          })
    },
    /**
     * y云盾管理家口   OperateType为-1表示关闭云盾
     */
     closeyunduntransaction(){
        this.goJson("/eweb/MCertAuthModeMgmt.do",{
            OperateType:"-1",
            SerialNo: this.authdata.SerialNumber, //证书序列号
            ApplyDate: this.authdata.ApplyDate,  //开启日期
            EndDate: this.authdata.EndDate,//有效日期
            MachineCode: context.envGet("DeviceID"), 
            MachineModle: this.authdata.MachineModle,
            AuthMode:"MCERT" ,
            IdNo:context.secureGetString("idNumber"),//身份证号
            MobilePhone:context.secureGetString("Mobiel"),//手机号
            Name:context.secureGetString("UserName"), //用户名
            IdType:context.secureGetString("IdType")//证件类型  
          },
          response => {
            modal.toast({ message: "云盾关闭成功" });
          },failback=>{}
        );
    },
    /**
     * 关闭云盾 
     */
    confirm() {
      this.goJson("/eweb/MCertDel.do", {
        IdType:context.secureGetString("IdType"),
        IdNo:context.secureGetString("idNumber"),
        MobilePhone:context.secureGetString("Mobiel"),
        Name: context.secureGetString("UserName")
      }, response => {
        //值为2的时候发交易去清除云盾服务器的密码
        if (this.authdata.PinState == "2") {
          this.goJson("/eweb/MCertPinClear.do", {
            IdType:context.secureGetString("IdType"),
            IdNo:context.secureGetString("idNumber"),
            MobilePhone:context.secureGetString("Mobiel"),
            Name: context.secureGetString("UserName")
          }, response => {
            this.closeyunduntransaction();
            this.isShow = true;
            context.secureSetString("CertFlag", "1");
          },failback=>{});
        } else {
          this.closeyunduntransaction();
          this.isShow = true;
          context.secureSetString("CertFlag", "1");
        }
      },failback=>{});
    },
    /**
     * 没有设置密码  去设置密码页面
     */
    gopasswordsetting(){
      if(this.authdata.PinState == "3"){
        this.alertMsg("云盾密码功能已锁定，今天暂不能使用云盾密码功能！隔日自动解锁");
      }else{
        this.$store.state.isGopasswordsetting = "1";
        this.jump("/cloudshieldpasswordsetting");
      }
    },
    /**
     * 修改密码
     */
    passwordmodify(){
       this.jump("/cloudshieldpasswordmodify1")
    },
    /**
     * 重置密码
     */
    passwordreset1(){
       wjalert.confirm("确定重置云盾密码","确定","取消",data=>{
              if(data == "Y") {
                 this.gopasswordreset();
              }
          })
    },
    /**
     * 密码重置，单人模式： 证件类型二代身份证的需要验证人脸或者网银授权码   其他只走网银授权码
     * 多人模式审核 同一个客户号下面的其他的操作员进行审核 MCertAuthModeMgmtForMore交易返回的AuthFlag  //1审核完成    0待审核  
     * 去网银授权码页面传 CertTranferCode 传的是下个交易的交易码
     */
    gopasswordreset(){  
    //单人模式去验证人脸    多人模式去提交审核 
    this.isOpenYunDun = false;
    if(this.YdFlag=="true"){  //单人模式
      let idType = context.secureGetString('IdType');//证件类型 二代身份证走人脸 其他走网银授权码
      if(idType=="00"){
     face.setLicence("MDQzOTA5bm9kZXZpY2Vjd2F1dGhvcml6ZZXn5+bn5+bq/+bg5efm4+f65ubn4Obg5Yjm5uvl5ubrkeXm5uvl5uai6+Xm5uvl5uTm6+Xm5uDm1efr5+vn6+er4Ofr5+vn6/vn5+bn4uTi");
        face.startAliveCheck(data => {
          if (JSON.parse(data).base64) {
            this.goJson("/eweb/FaceVerify.do",{
                CifNo: context.secureGetString("CifNo"),    //客户号
                UserName:context.secureGetString("UserName"),   //姓名
                IdNo:context.secureGetString("idNumber"),    //证件号
                IdType:context.secureGetString("IdType"),    //证件类型
                Img:JSON.parse(data).base64,
              },response => {
                //重置页面
                 this.jump("/cloudshieldpasswordreset1")
              },fail=>{
                //服务报错  联网核查失败的话统一报人脸识别未通过    其他的正常报错
                if(fail.data.errmsg.substr(0,8)=="联网核查失败异常"){
                  wjalert.confirm("人脸识别未通过","继续重试","其他认证方式",data=>{
                  if(data == "Y") {
                    this.gopasswordreset();
                  }else{
                      context.sessionSetString("isCert", "1");
                      context.sessionSetString("CertTranferCode","MCertPinClear");
                      context.launchStage('main.securityCertificate');  //人脸验证失败  选择另外一种验证方法
                    }
                  })
                }else{
                  wjalert.confirm(fail.data.errmsg,"继续重试","其他认证方式",data=>{
                  if(data == "Y") {
                    this.gopasswordreset();
                  }else{
                      context.sessionSetString("isCert", "1");
                       context.sessionSetString("CertTranferCode","MCertPinClear");
                      context.launchStage('main.securityCertificate');  //人脸验证失败  选择另外一种验证方法
                    }
                  })
                }
              }
            );
          }else if(JSON.parse(data).errorCode=="-1"){

          } else {
            //sdk报错 选择验证方式
            wjalert.confirm(JSON.parse(data).errorMsg,"继续重试","其他认证方式",data=>{
              if(data == "Y") {
                this.gopasswordreset();
              }else{
                context.sessionSetString("isCert", "1");
                context.sessionSetString("CertTranferCode","MCertPinClear");
                context.launchStage('main.securityCertificate');  //人脸验证失败  选择另外一种验证方法
                }
            })
          }
        });
      }else{
            context.sessionSetString("isCert", "1");
            context.sessionSetString("CertTranferCode","MCertPinClear");
            context.launchStage('main.securityCertificate');  //不是身份证选择另外一种验证方法
      }
    }else{
      //多人模式
        this.goJson("/eweb/MCertAuthResetPwdForMore.do",{ 
          OperType:"2",   //1开通  2重置
          SerialNo:context.secureGetString("SerialNumber"),   //证书序列号  重置密码需要  MCertAuthModeMgmtForMore
          MachineCode: context.envGet("DeviceID"),
          MachineModle: this.authdata.MachineModle,
          
          IdNo:context.secureGetString("idNumber"),//身份证号
          MobilePhone:context.secureGetString("Mobiel"),//手机号
          Name:context.secureGetString("UserName"), //用户名
          IdType:context.secureGetString("IdType")//证件类型  
        },response => {
           this.$store.state._DisplayAuthList = response.data._DisplayAuthList;//审核模型返回的还需要多少审核员审核
        if(response.data.AuthFlag=="0"){   //审核交易提成功
          this.$store.state.isDownLoad = "isDownLoad";
          this.jump("/submitsuccess")
        }else{
          this.jump("/cloudshieldpasswordreset1")
        }
      },failback=>{})
    }
    }
   
  },
  watch: {
    /**
     * 选择网银授权码 监听授权码是否成功  yundunFace成功否则失败
     * isOpenYunDun为true代表是下载云盾  其他的为重置密码页面
     */
    "$store.state.yundunFace"() {
      if (this.$store.state.yundunFace == "success") {
        this.$store.state.yundunFace="";
        context.sessionSetString('yundunFace',"")
        if(this.isOpenYunDun == true){
          this.jump("/certdownload");
        }else{
          this.jump("/cloudshieldpasswordreset1");
        }
      }
    }
  }
};
</script>

