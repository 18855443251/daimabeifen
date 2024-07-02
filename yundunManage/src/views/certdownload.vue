<template>
  <div class="contariner">
    <nav-bar title="证书下载" left-show="false"></nav-bar>
      <div class="top">
        <div class="list">
          <div class="IDcardnamediv">
              <text class="IDcardnametext">姓名：</text>
              <text class="textfield">{{UserName}}</text>
          </div>
          <div class="IDcardnamediv">
              <text class="IDcardnametext">证件号码：</text>
              <text class="textfield">{{IdNo}}</text>
          </div>
          <div class="IDcardnamediv">
              <text class="IDcardnametext">手机号码：</text>
              <text class="textfield">{{Phonenum}}</text>
          </div>
          <div class="IDcardnamediv">
              <text class="IDcardnametext">短信验证：</text>
              <input type="number" class="SMSverificationcode" maxlength="6" @input ="getSMScode" placeholder="请输入短信验证码" />
              <div class="SMSverificationcodeobtain" @click="getSMS()">
                  <text  v-if="isTimerStop" class="SMSverificationcodeobtaintext">{{msgCodeBtnText}}</text>
                  <text v-else class="SMSverificationcodeobtaintext">{{msgCodeBtnText}}</text>
              </div>
          </div>
        </div>
          <div class="yundunbuttondiv">
              <text class="yundunbuttontext"  @click="veritySMS()" v-if="getBtnStatus">证书下载</text>
              <text class="yundunbuttontext1" v-if="!getBtnStatus">证书下载</text>
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
.top {
  width:750px;
  height:1206px;
  background-color: rgba(255,255,255,1);
}
.list{
  width:750px;
  /* height:436px; */
}
.IDcardnamediv {
  width: 720px;
  height: 109px;
  margin-left:30px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1);
}
.IDcardnametext {
  /* font-size:30px;
  font-weight:500;
  color:rgba(51,51,51,1); */
  font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
}
.SMSverificationcode {
  top: 25px;
  width: 280px;
  height: 60px;
  font-size: 30px;
  text-align: right;
  padding-right: 30px;
  /* font-weight:500; */
  right:150px;
  position: absolute;
 color:rgba(102,102,102,1);
}
.SMSverificationcodeobtain {
  top: 29px;
  width: 120px;
  height: 52px;
  right:24px;
  position:absolute;
  border-radius: 8px;
  border-width: 2px;
  border-style: solid;
  border-color: rgba(230,2,44,1);
}
.SMSverificationcodeobtaintext {
  line-height: 40px;
  margin-top: 6px;
  font-size: 26px;
  text-align: center;
  color: rgba(230,2,44,1);
}
.textfield {
  line-height: 109px;
  /* font-size:30px;
  font-weight:500; */
  right:27px;
  position:absolute;
  /* color:rgba(124,124,124,1); */
   font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(102,102,102,1);
}
.yundunbuttondiv {
  width:670px;
  height:88px;
  left:40px;
  bottom:120px;
  position: absolute;
  
}
.yundunbuttontext {
  line-height: 88px;
  text-align: center;
   border-radius:12px;
  background-image: linear-gradient(to right,rgba(251,93,122,1),rgba(230,2,44,1));
   width:670px;
  height:88px;
  font-size:32px;
  font-weight:500;
  color:rgba(255,255,255,1);
}
.yundunbuttontext1 {
  line-height: 88px;
  text-align: center;
   border-radius:12px;
  background-image: linear-gradient(to right,  #C0C0C0,  #C0C0C0);
  width:670px;
  height:88px;
  font-size:32px;
  font-weight:500;
  color:rgba(255,255,255,1);
}
</style>


<script>
import NavBar from "../components/NavBar.vue";
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const cfcaPlugin = weex.requireModule("yunzhengtong"); //云证通
const stream = weex.requireModule("stream");
const loading = weex.requireModule("loading");
const face = weex.requireModule("face");

export default {
  components: {
    NavBar
  },
  data() {
    return {
      UserName:context.secureGetString("UserName"),
      IdNo:context.secureGetString("idNumber"),
      Phonenum:context.secureGetString("Mobiel"),
      dividUrl: this.$store.state.imgBaseUrl + "Dividingline.png",
      agreeflag: false,
      signresult: "",
      msgCodeBtnText: "获取",
      smscode: "",
      getRandomInfo: {},
      data1: {},
      authdata: {},
      certretdata: {},
      time: 60,
      isTimerStop: true,
      PayeeNo: "",
      _tokenName:"",  //获取token  方重读提交
      isClick:true,
    };
  },
   mounted() {
  },
   computed:{
      //判断是否可以点击确定 
      getBtnStatus(){
          return this.smscode.length==6;
      }
  },
  methods: {
   //获取短信验证码
    getSMScode(event) {
      this.smscode = event.value;
    },
    /**
     * 获取短信验证码
     */
    getSMS() {
      if (this.isTimerStop == false) {
        modal.toast({ message: "请一分钟后再获取" });
      } else {
        this.goJson(
          "/eweb/SendVerifyCode.do",
          {
              myTrsId:'McertDownLoad',
              AuthType:"MMSG" //MMSG:银企，MCERT:证书，MTOKEN:网银
          },
          response => {
            modal.toast({ message: "短信已发送" });
            this.count();
          },failback=>{}
        );
      }
    },
    /**
     * 倒计时   60s
     */
    count() {
      if (this.time !== 60) return;
      this.isTimerStop = false;
      //获取短信验证码
      var timer = setInterval(() => {
        if (this.time < 0) {
          this.time = 60;
          this.isTimerStop = true;
          this.msgCodeBtnText = "获取";
          clearInterval(timer);
        } else {
          this.msgCodeBtnText = "(" + this.time-- + "s)";
        }
      }, 1000);
    },
    /**
     * 获取token
     */
    veritySMS(){
      if(this.isClick){
        this.isClick = false;
        this.goJson("/eweb/GenToken4m.do",{},success=>{
            this._tokenName = success.data._tokenName;
            this.veritySMS1();
            setTimeout(() => {
              this.isClick = true;
            }, 1000);
        },failback => {})
      }
    },
    /**
     * 验证短信验证码和token
     */
    veritySMS1() {
      if (this.smscode) {
        this.goJson(
          "/eweb/CertTokenVerify.do",
          {  _tokenName:this._tokenName,
            smsValue: this.smscode,
             AuthType:"MMSG" //MMSG:银企，MCERT:证书，MTOKEN:网银
          }, response => {
              this.getRandom();
          },failback=>{}
        );
      } else {
        this.alertMsg("请先输入短信验证码");
      }
    },
     /**
     * 使用云盾第一步都是去获取随机数，随机数使用一次后就会失效需要重新获取
     * 企业的云盾为了防止一人拥有多家企业账号时候会导致一个账号开了云盾所有的都开了获取随机数的时候姓名和证件号会拼上唯一的客户号
     */
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
        loading.showLoading("等待云盾服务器身份认证");
        this.goJson(
          "/eweb/SignRandom.do",
          {
            Random: this.serverRandom,//随机数
            IdNo:context.secureGetString("idNumber")+context.secureGetString("CifNo"),  //证件号加客户号
            MobilePhone:context.secureGetString("Mobiel"),   //手机号
            Name:context.secureGetString("UserName")+context.secureGetString("CifNo"),  //姓名客户号
            IdType:context.secureGetString("IdType")   //证件类型
          },
          response => {
            loading.stopLoading();
             //服务端对随机数进行加密的结果
            this.signresult = response.data.SignResult;
             //调用方法发往云盾服务器验证随机数
            cfcaPlugin.auth(this.signresult, data => { 
              /**
               * type 等于1的时候认证成功  0 失败 
               * state 无证书的是时候等于2  有证书返回1
               * pinState返回 1代表没有密码  返回2有密码  返回3密码锁定
               * 
               */
              loading.stopLoading();
              this.authdata = JSON.parse(data);
             if (this.authdata.type == "1") { //type0失败 1成功 
                //  认证通过  没有证书
                if (this.authdata.state != "1") {//state  1是有证书直接去发交易  2的时候去下证书
                  loading.showLoading("正在下载云盾证书");
                  this.certDownload();
                } else {
                  context.secureSetString("CertFlag", "0");
                  //本地有证书   发管理的交易
                    const parms ={
                      OperateType:"1",
                      OperType:"1",   //1开通  -1
                      SerialNo: this.authdata.SerialNumber,  //序列号
                      ApplyDate: this.authdata.ApplyDate,  //申请日期
                      EndDate: this.authdata.EndDate,     //有效日期
                      MachineCode: context.envGet("DeviceID"),  //设备号
                      MachineModle: this.authdata.MachineModle,  //机器码
                      AuthMode:"MCERT",
                      IdNo:context.secureGetString("idNumber"),//身份证号
                      MobilePhone:context.secureGetString("Mobiel"),//手机号
                      Name:context.secureGetString("UserName"), //用户名
                      IdType:context.secureGetString("IdType")//证件类型  
                    }
                  this.goJson(
                    "/eweb/MCertAuthModeMgmt.do",parms,response => {
                      loading.stopLoading();
                       context.secureSetString("SerialNumber", this.authdata.SerialNumber);
                      if (response.data._RejCode == "000000") {
                        context.sessionSetString( "pinServerRandom",this.authdata.serverRandom);
                        context.sessionSetString("pinState",this.authdata.PinState);
                         if (this.authdata.PinState == "2") {
                            this.jump("/certdownloadsuccess");
                        } else {
                          context.secureSetString("CertFlag", "0");
                          this.jump("/certdownloadsuccess");
                        }
                      }
                    },failback=>{}
                  );
               }
              } else {
                this.alertMsg(this.authdata.msg);
              }
            })
        },failback=>{})
      }
    },
    /**
     * 本地没有证书  调用客户端的方法去下载证书
     */
    certDownload() {
      cfcaPlugin.downloadCertificate(data => {
        context.secureSetString("CertFlag", "0");
        loading.stopLoading();
        this.certretdata = JSON.parse(data);
        const parms ={
          OperType:"1",   //1开通  2重置
          OperateType:"1",
          SerialNo: this.certretdata.SerialNumber,//系列号
          ApplyDate: this.certretdata.ApplyDate,   //申请日期
          EndDate: this.certretdata.EndDate,      //有效日期
          MachineCode: context.envGet("DeviceID"), //设备号
          MachineModle: this.certretdata.MachineModle,  
          AuthMode:"MCERT",
          IdNo:context.secureGetString("idNumber"),//身份证号
          MobilePhone:context.secureGetString("Mobiel"),//手机号
          Name:context.secureGetString("UserName"), //用户名
          IdType:context.secureGetString("IdType")//证件类型  
        }
        this.goJson(
          "/eweb/MCertAuthModeMgmt.do",parms,
          response => {
            loading.stopLoading();
            if (response.data._RejCode == "000000") {
               context.secureSetString("SerialNumber", this.certretdata.SerialNumber);
              context.sessionSetString(
                "pinServerRandom",
                this.certretdata.serverRandom
              );
              if (context.sessionGetString("download") == "1") {
                context.sessionSetString("pinState", this.authdata.PinState);
                context.finish();
              } else {
                //pinstae  3被锁定   2正常   1没密码
                //判断状态  最终都到下载成功页面
                if (this.authdata.PinState == "3") {
                  this.goJson("/eweb/MCertPinClear.do", {
                      IdType:context.secureGetString("IdType"),
                      IdNo:context.secureGetString("idNumber"),
                      MobilePhone:context.secureGetString("Mobiel"),
                      Name: context.secureGetString("UserName")
                  }, response => {
                    context.sessionSetString("pinState", "1");
                    if (this.authdata.PinState == "2") {
                      context.secureSetString("CertFlag", "0");
                      this.jump("/certdownloadsuccess");
                    } else {
                      context.secureSetString("CertFlag", "0");
                      this.jump("/certdownloadsuccess");
                    }
                  },failback=>{});
                } else {
                  context.sessionSetString("pinState", this.authdata.PinState);
                  if (this.authdata.PinState == "2") {
                    context.secureSetString("CertFlag", "0");
                    this.jump("/certdownloadsuccess");
                  } else {
                    context.secureSetString("CertFlag", "0");
                    this.jump("/certdownloadsuccess");
                  }
                }
              }
            }
          },failback=>{}
        );
      })
    }
  }
};
</script>

