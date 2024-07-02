<template>
  <wxc-popup popup-color="#ffffff" :show="isTrue" @wxcPopupOverlayClicked="popupOverlayBottomClick" pos="bottom" :height="$store.state.isHeight">
    <div class="title">
      <text class="title_text">{{title}}</text>
      <div class="closes" @click="closePopup">
        <image :src="closeUrl" class="close"></image>
      </div>
    </div>
    <text class="code" v-if="secrecyTitle=='动态口令'">挑战码</text>
    <weex-image class="codeImg" ref="wxImg" v-if="secrecyTitle=='动态口令'"></weex-image>
    <text class="prompt_text" v-if="secrecyTitle=='动态口令'">提示：请在支付令牌开机后，直接输入挑战码，点击“确认”将获取的动态口令输入下框</text>
    <div class="click_button" v-if="orderType!=[]">
      <text class="order">{{secrecyTitle}}</text>
      <div class="secrecy">
        <text v-for="(itemSecrecy,indexSecrecy) in orderType" :key="indexSecrecy" class="secrecy_text" v-if="indexSecrecy!=SecrecyHide" @click="clickSecrecy(indexSecrecy,itemSecrecy.txetPlace,itemSecrecy.title,itemSecrecy.value)">{{itemSecrecy.text}}</text>
        <div class="solid" v-if="orderType.length==3"></div>
      </div>
    </div>
    <div v-if="orderType!=[]">
      <input type="number" v-model="smssPwd" :placeholder="secrecyPlace" class="pas_word" maxlength="6" autofocus="false" v-if="secrecyTitle=='短信验证码'||secrecyTitle=='动态口令'" />
      <cfcaPassword ref="cloudPwd" class="pas_word" @chickFinish="cfcaKeyboradHide" :strServerRandom="serverRandomStr" v-if="secrecyTitle=='云盾密码' && authdata.PinState == '2'&&authdata.state =='1'" :placeholder="secrecyPlace">
      </cfcaPassword>
      <text class="already" v-if="secrecyTitle=='云盾密码' && authdata.PinState == '1' && authdata.state=='1'">您已选择云盾认证方式</text>
      <text class="already1" v-if="secrecyTitle=='云盾密码' && authdata.PinState == '3' && authdata.state=='1'">您的云盾密码已被锁定，请选用其他认证方式！</text>
      <text class="already1" v-if="secrecyTitle=='云盾密码' && showOrHide"> </text>

      <div class="short">
        <text class="getClicks" v-if="isTimerStop==true&&this.secrecyTitle=='短信验证码'" @click="getsmss">{{msgCodeBtnText}}</text>
        <text class="getClick" v-if="isTimerStop!=true&&this.secrecyTitle=='短信验证码'" @click="getsmss">{{msgCodeBtnText}}</text>
      </div>
    </div>
    <div class="click_buttons">
      <text class="order">交易密码</text>
    </div>
    <wjPassword class="pas_word" ref="Pwd7" @passwordBeginEdit="passwordShowAction" @passwordEndEdit="passwordHideAction" focusable="false" kbdType="number" maxLength="6" minLength="6" placeholder="请输入6位交易密码"></wjPassword>
    <text class="btn" @click="confirm">确定</text>
  </wxc-popup>
</template>

<style scoped>
.already {
  width: 640px;
  height: 86px;
  font-size: 28px;
  color: rgb(200, 200, 200);
  margin-left: 55px;
  margin-top: 27px;
}
.already1 {
  width: 640px;
  height: 86px;
  font-size: 28px;
  color: #e66939;
  margin-left: 55px;
  margin-top: 27px;
}
.title {
  width: 750px;
  height: 88px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgb(221, 221, 221);
}
.title_text {
  text-align: center;
  height: 750px;
  line-height: 88px;
  color: rgb(34, 34, 34);
  font-size: 32px;
}
.closes {
  width: 98px;
  height: 88px;
  position: absolute;
  right: 0px;
  top: 0px;
}
.close {
  width: 48px;
  height: 48px;
  margin-left: 25px;
  margin-top: 20px;
}
.open_money {
  width: 750px;
  height: 96px;
  text-align: center;
  line-height: 96px;
  color: rgb(207, 207, 207);
  font-size: 28px;
}
.money {
  color: rgb(34, 34, 34);
  font-size: 48px;
  text-align: center;
}
.code {
  color: rgb(207, 207, 207);
  font-size: 28px;
  text-align: center;
  margin-top: 25px;
}
.codeImg {
  width: 383px;
  height: 81px;
  margin-left: 184px;
  margin-top: 28px;
}
.prompt_text {
  width: 640px;
  margin-left: 56px;
  line-height: 36px;
  font-size: 24px;
  margin-top: 47px;
  color: rgb(102, 102, 102);
}
.click_button {
  flex-direction: row;
  margin-top: 49px;
  margin-left: 56px;
}
.click_buttons {
  flex-direction: row;
  margin-top: 33px;
  margin-left: 56px;
}
.order {
  font-size: 28px;
  color: rgb(34, 34, 34);
  line-height: 28px;
}
.secrecy {
  flex-direction: row;
  position: absolute;
  top: 0px;
  right: 55px;
}
.secrecy_text {
  width: 95px;
  text-align: center;
  color: rgb(48, 164, 251);
  font-size: 28px;
  line-height: 28px;
}
.solid {
  width: 1px;
  height: 28px;
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: rgb(48, 164, 251);
  position: absolute;
  top: 0;
  left: 95px;
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
}
.btn {
  width: 640px;
  height: 86px;
  margin-left: 55px;
  background-color: rgb(238, 63, 35);
  color: rgb(255, 255, 255);
  font-size: 32px;
  margin-top: 84px;
  text-align: center;
  line-height: 86px;
  border-radius: 5px;
}
.short {
  flex-direction: row;
  position: absolute;
  top: 55px;
  right: 85px;
}
.getClick {
  font-size: 30px;
  line-height: 30px;
  color: #999999;
}
.getClicks {
  font-size: 30px;
  line-height: 30px;
  color: rgb(48, 164, 251);
}
</style>

<script>
import { WxcPopup } from "weex-ui";
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
const cfcaPlugin = weex.requireModule("yunzhengtong");
const loading = weex.requireModule("loading");
const wjalert = weex.requireModule("weex-alert");
const face = weex.requireModule("face");
export default {
  props: {
    isTrue: {
      type: Boolean,
      default: false
    },
    popupData: {
      type: Object,
      default: {}
    },
    orderType: {
      type: Array,
      default: []
    },
    paramsPopup: {
      type: Object,
      default: {}
    }
  },
  components: {
    WxcPopup
  },
  data() {
    return {
      closeUrl: "./imgs/templet/popup/cancel.png",
      UserPwd: "",
      SecrecyHide: "",
      secrecyTitle: "",
      secrecyPlace: "",
      smssPwd: "", //短信验证码
      isTimerStop: true,
      msgCodeBtnText: "获取",
      time: 60,
      title: "验证",
      valType: "",
      yun: false,
      resultTitle: "",
      HH: "", //高度
      isClick: false,
      getRandomInfo: {}, //随机数对象
      getRandomInfoStr: "",
      authdata: {
        PinState: 0,
        state: 0
      },
      serverRandomStr: "",
      hkepwdstr: "",
      PESign: {},
      a: 0,
      Shake: false,
      encryptedClientRandom: ""
    };
  },
  computed: {
    showOrHide() {
      if (this.authdata.state != "1") {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {},
  methods: {
    typeList() {
      //页面初始化
      this.title = this.popupData.title;
      if (this.orderType != []) {
        this.secrecyTitle = this.orderType[0].title;
        if (this.secrecyTitle == "云盾密码") {
          this.$store.state.upPwd = false;
        }
        this.secrecyPlace = this.orderType[0].txetPlace;
        this.valType = this.orderType[0].value; //初始化获取验证方式
        this.paramsPopup.valType = this.valType;
        this.SecrecyHide = 0;
        // this.$store.state.isHeight = 1125;
        if (this.popupData.title) {
          if (this.orderType[0].title == "短信验证码") {
            this.$store.state.isHeight = 830;
          } else if (this.orderType[0].title == "动态口令") {
            this.$store.state.isHeight = 1125;
          } else if (this.orderType[0].title == "云盾密码") {
            this.$store.state.isHeight = 985;
          }
        }
      }
    },
    popupOverlayBottomClick() {
      this.secrecyTitle = ""; //关闭时清空，用于再次打开popup时获取挑战码
      this.smssPwd = "";
      this.Shake = false;
      this.isTrue = false;
      this.$emit("closePopup");
    },
    closePopup() {
      this.secrecyTitle = ""; //同上
      this.popupOverlayBottomClick();
    },
    clickSecrecy(x, y, z, h) {
      //点击切换右上角蓝色验证方式
      this.$refs.Pwd7.closePwd();
      setTimeout(() => {
        this.SecrecyHide = x;
        this.secrecyTitle = z;
        this.secrecyPlace = y;
        this.valType = h;
        this.paramsPopup.valType = this.valType;
        if (this.secrecyTitle == "云盾密码") {
          this.$store.state.upPwd = false;
        }
        if (this.popupData.title) {
          if (h == 1) {
            //短信
            this.$store.state.isHeight = 830;
          } else if (h == 4) {
            //云盾
            this.$store.state.isHeight = 985;
            this.yun = true;
          } else if (h == 2) {
            //令牌
            this.$store.state.isHeight = 1125;
          }
        } else {
          if (h == 1) {
            //短信
            this.$store.state.isHeight = 780;
          } else if (h == 4) {
            //云盾
            this.$store.state.isHeight = 855;
            this.yun = true;
          } else if (h == 2) {
            //令牌
            this.$store.state.isHeight = 965;
          }
        }
      }, 200);
    },
    //获取短信验证码
    getsmss() {
      if (this.isTimerStop == false) {
        this.showOneBtnAlert("请一分钟后再获取", "确定", () => {});
      } else {
        const params = {
          SMSTransCode: this.popupData.smsUrl
        };
        if (this.popupData.ActChType) {
          params.ActChType = this.popupData.ActChType;
        }
        this.goJson("/refacmob/GenTokenName.do", params, response => {
          modal.toast({
            message: "已发送短信验证码，请查看"
          });
          this.count(); //倒计时开启
        });
      }
    },
    //倒计时
    count() {
      if (this.time !== 60) return;
      this.isTimerStop = false;
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
    refreshToken() {
      this.Shake = false;
      this.goJson("/refacmob/getNewTokenNameV1.do", {}, response => {
        this.paramsPopup._tokenName = response.data._tokenName;
        if (this.secrecyTitle == "云盾密码") {
          this.$store.state.upPwd = false;
          this.getRandom();
        } else if (this.secrecyTitle == "动态口令") {
          const params = {
            transCode: this.popupData.url
          };
          this.goJson(
            "/refacmob/GetChallengeCodeMerge.do",
            params,
            response => {
              this.$refs.wxImg.setResourece(response.data.ChallengeImg);
            }
          );
        }
      });
    },
    inTheEnd() {
      //最终交易
      loading.showLoading("请稍等"); 
      stream.fetch(
        {
          method: "POST",
          url: "/refacmob/" + this.popupData.url + ".do",
          type: "json",
          // body: this.toParams(this.paramsPopup),
          body: JSON.stringify(this.paramsPopup),
          // headers:{ "Content-Type": 'application/x-www-form-urlencoded'}
          headers: { "Content-Type": "application/json" }
        },
        response => {
          loading.stopLoading();
          if (response.status == 200) {
            if (response.data._RejCode == "000000") {
              this.$store.state.isTrue = false;
              this.secrecyTitle = ""; //关闭时清空，用于再次打开popup时获取挑战码
              this.smssPwd = "";
              this.$store.state.upPwd = false;
              //请求成功
              this.Shake = false;
              if (this.popupData.after) {
                this.inTheEndFace();
              } else {
                this.trueEnd(response);
              }
            } else if (response.data._RejCode == "777777") {
              this.showOneBtnAlert(response.data.errmsg, "确定", () => {
                context.sessionSetString("isLogin", "false");
                context.sessionSetString("userinfo", "");
                context.clearToken();
                context.replaceStage("main.login?flag=1");
              });
            } else if (
              response.data._RejCode == "888888" ||
              response.data._exceptionMessageCode == "role.invalid_user"
            ) {
              this.showOneBtnAlert(response.data.errmsg, "确定", () => {
                context.sessionSetString("isLogin", "false");
                context.sessionSetString("userinfo", "");
                context.clearToken();
                context.replaceStage("main.login?flag=1");
              });
            } else {
              modal.toast({
                message: response.data.errmsg
              });
              this.refreshToken();
              return;
            }
          } else {
            this.Shake = false;
            this.showOneBtnAlert("请联系客服或重新登陆", "确定", () => {});
          }
        }
      );
    },


    faceIdentify() {
      if(context.secureGetString("CounterCertFlag") == "0"){
      this.Shake = false;
      face.setLicence(
        "MDQzOTA5bm9kZXZpY2Vjd2F1dGhvcml6ZZXn5+bn5+bq/+bg5efm4+f65ubn4Obg5Yjm5uvl5ubrkeXm5uvl5uai6+Xm5uvl5uTm6+Xm5uDm1efr5+vn6+er4Ofr5+vn6/vn5+bn4uTi"
      );
      face.startAliveCheck(data => {
        var data = JSON.parse(data);
        if(!data.errorCode){
            this.goJson('/refacmob/FaceVerifyV3.do',{
              CifName:context.secureGetString("UserName"),
              IdNo:context.secureGetString('idNumber'),
              IdType:'101',
              Img:data.base64
            },response=>{
              context.sessionSetString("certdownload","true");
              context.launchStage('main.certdownload');
          })

        }else{
            modal.toast({
              message:data.errorMsg
            })
            this.Shake = false;
        }
      })
      }else{
          context.sessionSetString("certdownload","true");
          context.launchStage('main.certdownload');
      }
    },


    inTheEndFace() {
      face.setLicence(
        "MDQzOTA5bm9kZXZpY2Vjd2F1dGhvcml6ZZXn5+bn5+bq/+bg5efm4+f65ubn4Obg5Yjm5uvl5ubrkeXm5uvl5uai6+Xm5uvl5uTm6+Xm5uDm1efr5+vn6+er4Ofr5+vn6/vn5+bn4uTi"
      );
      face.startAliveCheck(data => {
        var data = JSON.parse(data);
        if (!data.errorCode) {
          this.goJson(
            "/refacmob/FaceVerifyV3.do",
            {
              CifName: context.secureGetString("UserName"),
              IdNo: context.secureGetString("idNumber"),
              IdType: "101",
              Img: data.base64
            },
            response => {
              this.inTheEndAfter();
            }
          );
        } else {
          modal.toast({
            message: data.errorMsg
          });
          this.refreshToken();
        }
      });
    },
    inTheEndAfter() { 
      this.goJson(
        "/refacmob/" + this.popupData.after + ".do",
        this.paramsPopup,
        response => {
          this.trueEnd(response);
        },
        () => {
          this.refreshToken();
        }
      );
    },
    trueEnd(response) {
      this.popupOverlayBottomClick();
      this.$store.state.upPwd = false;
      this.$emit("inTheEnd");
      if (response.data.State) {
        this.paramsPopup.State = response.data.State;
      }
      if (this.popupData.resultPath) {
        this.$router.push({
          path: this.popupData.resultPath,
          query: this.paramsPopup
        });
      }
    },
    transaction() {
      this.$refs.Pwd7.getLength(data => {
        if (data <= 0) {
          this.showOneBtnAlert("交易密码不能为空", "确定", () => {});
          this.Shake = false;
          if (this.secrecyTitle == "云盾密码") {
            this.$store.state.upPwd = false;
            this.getRandom();
          }
          return;
        } else if (data != 6) {
          this.showOneBtnAlert("交易密码不符合规则", "确定", () => {});
          this.Shake = false;
          if (this.secrecyTitle == "云盾密码") {
            this.$store.state.upPwd = false;
            this.getRandom();
          }
          return;
        } else {
          this.goJson(
            "/refacmob/Timestamp.do",
            {},
            response => {
              this.$refs.Pwd7.getValue(response.data.Timestamp, data => {
                //获取密文
                this.UserPwd = data.replace(/\+/g, "%2B");
                this.paramsPopup.MSGTokenName = this.smssPwd;
                this.paramsPopup.TrsPassword = this.UserPwd;
                this.inTheEnd();
              });
            },
            fail => {
              this.Shake = false;
            }
          );
        }
      });
    },
    confirm() {
      //点击提交
      if (this.Shake == false) {
        this.Shake = true;
        if (this.secrecyTitle == "短信验证码") {
          if (this.smssPwd == "") {
            this.showOneBtnAlert("请输入短信验证码", "确定", () => {});
            this.Shake = false;
            return;
          } else {
            this.paramsPopup.MSGTokenName = this.smssPwd; //短信验证码内容
            this.transaction();
          }
        } else if (this.secrecyTitle == "动态口令") {
          if (this.smssPwd == "") {
            this.showOneBtnAlert("请输入动态口令", "确定", () => {});
            this.Shake = false;
            return;
          } else {
            //说明现在有动态口令
            this.paramsPopup.accFlag = "challenge";
            this.paramsPopup.dynameicpwd = this.smssPwd;
            this.transaction();
          }
        } else if (this.secrecyTitle == "云盾密码") {
          if (this.authdata.state != "1") {
            //说明没有证书
            this.Shake = false;
            wjalert.confirm(
              "您的手机上不存在云盾证书，请先下载证书",
              "确定",
              "取消",
              data => {
                if (data == "Y") {
                  this.faceIdentify();
                }
              }
            );
          } else {
            this.yunPwd();
          }
        }
      }
    },
    //键盘弹出
    passwordShowAction() {
      this.$refs.Pwd7.getHeight(data => {
        this.HH = this.$store.state.isHeight;
        this.$store.state.isHeight = this.HH * 1 + data * 1 * 1334 - 100;
      });
    },
    //键盘隐藏
    passwordHideAction() {
      this.$refs.Pwd7.getHeight(data => {
        this.$store.state.isHeight = this.HH;
      });
    },
    //获取随机数
    getRandom() {
      if (this.$store.state.upPwd == false) {
        this.$store.state.upPwd = true;
        this.getRandomInfo.name = context.secureGetString("UserName");
        this.getRandomInfo.idnum = context.secureGetString("idNumber");
        this.getRandomInfo.type = "0";
        this.getRandomInfo.mobile = context.secureGetString("Mobiel");
        this.getRandomInfo.deviceID = context.envGet("DeviceID");
        this.getRandomInfoStr = JSON.stringify(this.getRandomInfo);
        cfcaPlugin.getRandomStr(this.getRandomInfoStr, data => {
          if (JSON.parse(data).type == "1") {
            this.serverRandom = JSON.parse(data).serverRandom;
            this.RandomSign();
          } else {
            this.Shake = false;
            this.showOneBtnAlert(data, "确定", () => {});
          }
        });
      }
    },
    //随机数签名
    RandomSign() {
      loading.showLoading("等待云盾服务器身份认证");
      if (this.serverRandom) {
        this.goJson(
          "/refacmob/SignRandom.do",
          {
            Random: this.serverRandom
          },
          response => {
            cfcaPlugin.auth(response.data.signresult, data => {
              loading.stopLoading();
              this.authdata = JSON.parse(data);
              context.sessionSetString(
                "authdata",
                JSON.stringify(this.authdata)
              );
              if (this.authdata.type == "1") {
                if (this.authdata.state != "1") {
                  this.Shake = false;
                  wjalert.confirm(
                    "您的手机上不存在云盾证书，请先下载证书",
                    "确定",
                    "取消",
                    data => {
                      if (data == "Y") {
                        this.faceIdentify();
                      }
                    }
                  );
                } else if (this.authdata.PinState == "3") {
                  this.Shake = false;
                  this.showOneBtnAlert(
                    "您的云盾密码已被锁定，请使用其他认证方式",
                    "确定",
                    () => {}
                  );
                } else {
                  setTimeout(() => {
                    this.serverRandomStr = JSON.parse(data).serverRandom;
                  }, 50);
                }
              }
            });
          }
        );
      } else {
        this.Shake = false;
        this.showOneBtnAlert("随机数获取失败", "确定", () => {});
      }
    },
    yunPwd() {
      if (this.paramsPopup.orgContent) {
        Vue.delete(this.paramsPopup, "orgContent"); //vue方法
      }
      if (this.paramsPopup.signValue) {
        Vue.delete(this.paramsPopup, "signValue");
      }

      this.paramsPopup.pinState = JSON.parse(
        context.sessionGetString("authdata")
      ).PinState;
      this.goJson("/refacmob/PESign.do", this.paramsPopup, response => {
        this.paramsPopup.orgContent = response.data.businessText;
        this.PESign = response.data;
        if (this.paramsPopup.pinState == "1") {
          //没密码
          cfcaPlugin.doSign(JSON.stringify(this.PESign), data => {
            if (JSON.parse(data).type == "1") {
              this.paramsPopup.signValue = JSON.parse(data).msg.replace(
                /\+/g,
                "%2B"
              );
              //最终交易
              this.transaction();
            } else {
              this.Shake = false;
            }
          });
        } else {
          if (
            this.$refs.cloudPwd == "undefined" ||
            this.$refs.cloudPwd == null
          ) {
            this.Shake = false;
            wjalert.alert(
              "您的云盾密码已被锁定，请选用其他认证方式！",
              "确定",
              data => {}
            );
          } else {
            //有密码
            this.$refs.cloudPwd.checkMatchRegexWithError(data => {
              if (JSON.parse(data).type == "0") {
                this.$refs.cloudPwd.getEncryptedData(pwddata => {
                  this.hkepwdstr = JSON.parse(pwddata).encryptedSignPassword;
                  this.encryptedClientRandom = JSON.parse(
                    pwddata
                  ).encryptedClientRandom;
                  if (this.hkepwdstr) {
                    cfcaPlugin.pwdDoSign(
                      JSON.stringify(this.PESign),
                      this.hkepwdstr,
                      this.encryptedClientRandom,
                      data => {
                        if (JSON.parse(data).type == "1") {
                          this.paramsPopup.signValue = JSON.parse(
                            data
                          ).msg.replace(/\+/g, "%2B");
                          //最终交易
                          this.transaction();
                        } else {
                          this.Shake = false;
                          this.showOneBtnAlert(
                            JSON.parse(data).msg,
                            "确定",
                            () => {}
                          );
                        }
                      }
                    );
                  } else {
                    this.Shake = false;
                    this.showOneBtnAlert("云盾密码加密失败", "确定", () => {});
                  }
                });
              } else {
                this.Shake = false;
                this.showOneBtnAlert(JSON.parse(data).msg, "确定", () => {});
              }
            });
          }
        }
      });
    },
    showOneBtnAlert(message, button, callback) {
      wjalert.alert(message, button, data => {
        if (callback) {
          callback();
        }
      });
    }
  },
  watch: {
    orderType: "typeList",
    secrecyTitle: function() {
      if (this.secrecyTitle == "动态口令") {
        //获取挑战码
        const params = {
          transCode: this.popupData.url
        };
        this.goJson("/refacmob/GetChallengeCodeMerge.do", params, response => {
          this.$refs.wxImg.setResourece(response.data.ChallengeImg);
        });
      } else if (this.secrecyTitle == "云盾密码") {
        this.getRandom();
      }
    },
    "$store.state.y": function() {
      if (this.isTrue) {
        if (context.sessionGetString("certdownload") == "true") {
          this.$store.state.upPwd = false;
          context.sessionSetString("certdownload", false);
          this.getRandom();
        }
      }
    }
  }
};
</script>