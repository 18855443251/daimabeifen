<template>
  <div class="greyBoxShadow">
    <nav-bar :title="title"></nav-bar>
    <!--确认转账  -->
    <scroller v-if="inConfirm">
      <div>
        <div class="topAmount">
            <div class="smallAmount">
                <text style="line-height:66px;">¥</text>
                <text class="smallAmountText">{{$store.state.transferSubmitData.Amount|NumFormat}}</text>
            </div>
            <text class="upperCaseAmount">{{$store.state.transferSubmitData.Amount|changeMoneyToChinese}} </text>
        </div>
        <div class="payee">
            <div class="payeeInfoName">
              <image :src="payeeimg" class="payerimg" />
              <text class="everyInfoTitle">收款方信息</text>
            </div>
            <div class="payee_box">
              <text class="payer_box_title">名称：</text>
              <text class="payer_box_Text">{{ellipsis($store.state.transferSubmitData.PayeeAcName,15)}}</text>
            </div>
            <div class="payee_box">
              <text class="payer_box_title">账号：</text>
              <text class="payer_box_Text">{{$store.state.transferSubmitData.PayeeAcNo|AccountNoFormat}}</text>
            </div>
            <div class="payee_box">
              <text class="payer_box_title">银行：</text>
              <text class="payer_box_Text">{{$store.state.transferSubmitData.PayeeBankName}}</text>
            </div>
            <!-- 跨行显示行号 -->
            <div class="payee_box" v-if="$store.state.BankInner=='1'">
              <text class="payer_box_title">行号：</text>
              <text class="payer_box_Text">{{$store.state.transferSubmitData.BankNodeFlag=='Y'?$store.state.transferSubmitData.PayeeNetName.Value:$store.state.transferSubmitData.BankCode}}</text>
            </div>
        </div>
        <div class="payer">
          <div class="payeeInfoName">
            <image :src="payerimg" class="payerimg" />
            <text class="everyInfoTitle">付款方信息</text>
          </div>
          <div class="payer_box">
            <text class="payer_box_title">名称：</text>
            <text class="payer_box_Text">{{ellipsis($store.state.transferSubmitData.PayerAcName)}} </text>
          </div>
          <div class="payer_box">
            <text class="payer_box_title">账号：</text>
            <text class="payer_box_Text" v-if="!$store.state.accountProtect">{{$store.state.transferSubmitData.PayerAcNo|AccountNoFormat}}</text>
            <text class="payer_box_Text" v-else>{{$store.state.transferSubmitData.PayerAcNo|AccountNoFormat(6,-4)}}</text>
          </div>
          <div class="payer_box" v-if="$store.state.transferSubmitData.PayerOpenFlag == 'Y'">
            <text class="payer_box_title">账簿号/账簿名：</text>
            <text class="payer_box_Text">{{$store.state.transferSubmitData.selectAcctBookItem.AsAcno}}/{{$store.state.transferSubmitData.selectAcctBookItem.AsAcname}}</text>
          </div>
          <div class="payer_box">
            <text class="payer_box_title">银行：</text>
            <text class="payer_box_Text">美团银行农村商业银行</text>
          </div>
        </div>
        <div class="other">
          <div class="payeeInfoName">
            <image :src="otherimg" class="payerimg" />
            <text class="everyInfoTitle">金额及其他信息</text>
          </div>
          <div class="other_box">
            <text class="payer_box_title">转账金额：</text>
            <text class="payer_box_Text">{{$store.state.transferSubmitData.Amount}}</text>
          </div>
          <div class="other_box">
            <text class="payer_box_title">手续费：</text>
            <text class="payer_box_Text">¥{{$store.state.transferSubmitData.Fee}}</text>
            <text class="payer_box_Text" v-if="$store.state.transferSubmitData.PreferAmt">(优惠￥{{moneyFilter($store.state.transferSubmitData.PreferAmt)}})</text>
          </div>
          <div class="other_box" v-if="$store.state.transferSubmitData.transferUse">
            <text class="payer_box_title">转账用途：</text>
            <text class="payer_box_Text">{{ellipsis($store.state.transferSubmitData.transferUse,15)}}</text>
          </div>
          <div class="other_box">
            <text class="payer_box_title">到账方式：</text>
            <text class="payer_box_Text">{{$store.state.transTypeList[$store.state.transferSubmitData.ImmediatelyFlag]}}</text>
          </div>
          <div class="other_box" v-if="$store.state.transferSubmitData.mobilePhone">
            <text class="payer_box_title">短信通知收款人：</text>
            <text class="payer_box_Text">{{$store.state.transferSubmitData.mobilePhone}}</text>
          </div>
        </div>
        <SubmitBtn @click.native="openBottomPopup" btntext="确认" />
      </div>
    </scroller>
    <div v-else>
        <div class="res2">
          <image src="./imgs/transresult.gif" class="transresultGif" />
          <text class="timer">{{time}}</text>
      </div>
      <text class="transferDealing">转账申请已提交，银行正在处理中</text>
    </div>
    <!-- <div class="fucengModal" v-if="isBottomShow">
        <div class="modalBox">
            <div class="certificateBox">
                <text class="certificateTitle">安全认证</text>
                <image :src="cancelMsgIcon" class="cancelMsgIcon" @click="cancel" />
            </div>
            <div class="mainCertificate">
              <text class="certificateText">云盾密码</text>
              <cfcaPassword ref="cloudPwd" class="certificateInput" @chickFinish = "cfcaKeyboradHide" :strServerRandom = "serverRandomStr" >
              </cfcaPassword>
              <text class="forgetCertifiText">忘记云盾密码</text>
            </div>
            <text class="passwordBtn" @click="finalConfirm">确认</text>
        </div>
    </div> -->
    <!-- 云盾浮层 -->
    <yundunModal v-if="isBottomShow" />
  </div>
</template>
<script>
  import NavBar from "@/components/titlebar_component.vue";
  import yundunModal from "@/components/yundunModal.vue";//云盾模态框
  import { WxcPopup } from "weex-ui";
  import SubmitBtn from "../../components/submitBtn.vue";
  const modal = weex.requireModule("modal");
  const cfcaPlugin = weex.requireModule("yunzhengtong");//云盾
  const wjalert = weex.requireModule("weex-alert");
  const face = weex.requireModule("face");
  const loading = weex.requireModule("wxEncryption");
  const context = weex.requireModule("context");
  const stream = weex.requireModule("stream");
  export default {
    components: { NavBar, WxcPopup ,SubmitBtn,yundunModal},
    data() {
      return {
        title:'确认转账',
        // 收款方
        PayeeAcName:'',
        PayeeAcNo:'',
        PayeeBankName:'',
        PayeeBankNo:'',
        
        iscocp: false,//是否开通现金管理
        // 收款方图片
        payeeimg: "./imgs/payeeimg.png",
        // 付款方图片
        payerimg: "./imgs/payerimg.png",
        // 其他图片
        otherimg: "./imgs/otherimg.png",
        cancelMsgIcon:this.$store.state.imgBaseUrl+'cancelMsgIcon.png',
        // RteFlg:'l001',//默认到账最快
        //到账最快单选
        fastTransfer:'./imgs/circleHasSelect.jpg',
        //手续费最低
        lastestFee:'./imgs/circleNotSelect.jpg',
        // 短信验证码
        messageCode: "",
        // 云盾密码
        password: "",
        isBottomShow: false,
        msg1: "获取验证码",
        n: "", //秒数
        s: "", // s
        yzmFlag: true,
        inConfirm: true,//判断是在确认阶段还是在提交后等返回结果阶段
        time: 10,
        _tokenName:'',//防重复验证码
        //云盾相关
        serverRandomStr: "",//云盾随机数
        getRandomInfo:{},
        authdata:'',
        signresult: "",
        certretdata:"",
        PESign: {},
        hkepwdstr:'',
        encryptedClientRandom: "",
        serverRandom:''//云盾获取的随机数
      };
    },
    created(){
      if(this.$store.state.transferSubmitData.TransferPath=='HVPS'){
        this.fastTransfer='./imgs/circleHasSelect.jpg';
        this.lastestFee='./imgs/circleNotSelect.jpg';
      }else if(this.$store.state.transferSubmitData.TransferPath=='BEPS'){
        this.lastestFee='./imgs/circleHasSelect.jpg';
        this.fastTransfer='./imgs/circleNotSelect.jpg';
      }
      this.getTokenName();
    },
    mounted() {
      //this.getRandom();
    },
    methods: {
      //切换智能汇路获取手续费
      // shiftTranWay(param){
      //   this.$store.state.RteFlg=param;
      //   if(param=='l001'){
      //       var TransferPath='HVPS';
      //   }else{
      //       var TransferPath='BEPS';
      //   }
      //   let params={
      //     PayerAcNo:this.$store.state.transferSubmitData.PayerAcNo,
      //     PayerAcName:this.$store.state.transferSubmitData.PayerAcName,
      //     PayeeAcNo:this.$store.state.transferSubmitData.PayeeAcNo.replace(/[\s]/g,''),
      //     PayeeAcName:this.$store.state.transferSubmitData.PayeeAcName,
      //     ImmediatelyFlag:this.$store.state.transferSubmitData.ImmediatelyFlag,
      //     Amount:this.$store.state.transferSubmitData.Amount,
      //     BankCode:this.$store.state.transferSubmitData.PayeeNetName.Value,
      //     TransferPath:TransferPath
      //   }
      //   this.post("/eweb/TransferFeeCal.do",params,response=>{
      //     if(param=='l001'){
      //         this.fastTransfer='./imgs/circleHasSelect.jpg';
      //         this.lastestFee='./imgs/circleNotSelect.jpg';
      //     }else{
      //         this.fastTransfer='./imgs/circleNotSelect.jpg';
      //         this.lastestFee='./imgs/circleHasSelect.jpg';
      //     }
      //     this.$store.state.transferSubmitData.Fee=response.data.Fee;
      //     this.$store.state.transferSubmitData.PreferAmt=response.data.PreferAmt;
      //     this.$store.state.transferSubmitData.Postage=response.data.Postage;//邮电费
      //     this.$store.state.transferSubmitData.TransferPath=response.data.TransferPath;//支付渠道代码
      //   });
      // },
      //获取防重复验证码
      getTokenName(){
          this.post("/eweb/GenToken4m.do",{},response=>{
              this._tokenName=response.data._tokenName;
          });
      },
      // 打开弹框
      openBottomPopup() {
        if(context.secureGetString('CertFlag')=='1'){//未开通
          wjalert.confirm("您尚未开通云盾，请先开通云盾","确定","取消",data=>{
              if(data == "Y") {
                  context.launchStage('main.yundunManage');//跳转到云盾管理去人脸识别然后下载证书
              }
          })
        }else{
          //Transfer.do提交交易
          this.$store.state.confirmTransferParams={
            PayeeAcNo:this.$store.state.transferSubmitData.PayeeAcNo.replace(/[\s]/g,''),
            PayeeAcName:this.$store.state.transferSubmitData.PayeeAcName,
            PayerAcNo:this.$store.state.transferSubmitData.PayerAcNo,
            PayerAcName:this.$store.state.transferSubmitData.PayerAcName,
            PayerCurrency:this.$store.state.transferSubmitData.PayerCurrency,
            ImmediatelyFlag:this.$store.state.transferSubmitData.ImmediatelyFlag,
            Amount:this.$store.state.transferSubmitData.Amount,
            BankCode:this.$store.state.transferSubmitData.BankNodeFlag=='Y'?this.$store.state.transferSubmitData.PayeeNetName.Value:this.$store.state.transferSubmitData.BankCode,//跨行的话显示,行内后台自己送(跨行是收款网点的行号，行内时后台返回默认的总行行号)
            TransferPath:this.$store.state.transferSubmitData.TransferPath,
            PayeeBankName:this.$store.state.transferSubmitData.PayeeBankName,
            Fee:this.$store.state.transferSubmitData.Fee,
            Postage:this.$store.state.transferSubmitData.Postage,
            Remark:this.$store.state.transferSubmitData.transferUse,
            MobilePhone:this.$store.state.transferSubmitData.mobilePhone,//短信通知收款人
            PayeeBank:this.$store.state.transferSubmitData.PayeeBank,
            CityCode:this.$store.state.transferSubmitData.BankNodeFlag=='Y'?this.$store.state.cityCode:'',//城市代码：有网点时上送
            _tokenName:this._tokenName,
            AcctBookFlag:this.$store.state.transferSubmitData.PayerOpenFlag=='Y'?'Y':'',//多级账簿送Y
            AcctBookNo:this.$store.state.transferSubmitData.selectAcctBookItem.AsAcno,
            AcctBookNm:this.$store.state.transferSubmitData.selectAcctBookItem.AsAcname,
            InOtsdBnkFlg:this.$store.state.BankInner,
            //工作台展示审核详情时需要
            BankNodeFlag:this.$store.state.transferSubmitData.BankNodeFlag,
            PreferAmt:this.$store.state.transferSubmitData.PreferAmt,
            BankInner:this.$store.state.BankInner
          }
          this.isBottomShow = true;
        }
      },
      popupOverlayBottomClick() {
        this.isBottomShow = false;
      },
      //确认转账交易
      finalConfirm() {
            loading.showLoading("");
            stream.fetch({
                method: 'POST',
                url: "/eweb/Transfer.do",
                type: 'json',
                timeout: 60000,
                body: JSON.stringify(this.$store.state.confirmTransferParams),
                headers: { "Content-Type": 'application/json',"Accept": 'text/mobjson'}
            }, response => {
                loading.stopLoading();
                if (response.status == 200) {
                    if (response.data._RejCode == '000000') {//请求成功
                        this.$store.state.transResData=response.data;
                        this.inConfirm = false;
                        this.title='转账结果';
                        this.timeOut();
                        if(response.data.AuthItemList&&response.data.AuthItemList.length!=0){
                            this.$store.state.transResultFlag='0';//这个是需要审核，提交成功
                        }else if(this.$store.state.transferSubmitData.ImmediatelyFlag=='0'){
                            this.$store.state.transResultFlag='1';//实时到账成功
                        }else if(this.$store.state.transferSubmitData.ImmediatelyFlag=='1'){
                            this.$store.state.transResultFlag='2';//普通
                        }else if(this.$store.state.transferSubmitData.ImmediatelyFlag=='2'){
                            this.$store.state.transResultFlag='3';//次日
                        }
                        this.jump('/TransferResult');
                    } else {
                        this.$store.state.transResData=response.data;
                        if (response.data._RejCode == "888888" || response.data._RejCode == "777777") {
                            wjalert.alert(response.data.errmsg, "确定", data => {
                                context.sessionSetString("isLogin", "");
                                context.sessionSetString('userinfo', '');
                                context.clearToken();
                                context.sessionSetString("nextScenes", "");
                                context.replaceStage("main.login?flag=1");
                            })
                        } else if(response.data._RejCode=="222222"){
                            wjalert.alert(response.data.errmsg,"确定",data=>{
                                context.launchStage("main.reconciliation")
                            })
                        }else {
                            wjalert.alert(response.data.errmsg, "确定", data => {
                                this.$store.state.transResultFlag='4';//转账失败
                                this.jump('/TransferResult');
                            });
                        }
                    }
                } else {
                     wjalert.alert('网络通讯异常请稍后再试', "确定", data => { })
                }
            })
      },
      cancel() {
        this.isBottomShow = false;
      },
      // 短信验证码
      getValue(event) {
        this.msgCode = event.value;
        this.$emit("getCode", this.msgCode);
      },
      blur() {
        this.placeholder = "请输入" + this.phoneFormat(this.data.PayerPhoneNo) + "的验证码"
      },
      focus() {
        this.placeholder = '';
      },
      changeYZM() {
        if (this.yzmFlag) {
          this.yzmFlag = false;
          clearInterval(this.timer);
          if (!this.n) {
            this.msg1 = "";
            this.n = "60";
            this.s = "s";
            var that = this;
            this.timer = setInterval(function () {
              that.n--;
              if (that.n <= 0) {
                clearInterval(that.timer);
                that.msg1 = "重新获取";
                that.n = "";
                that.s = "";
                that.yzmFlag = true;
              }
            }, 1000);
            var param = {
              sid: context.sessionGetString("coresid")
            };
            this.postDo(
              "TrusfortGetAuthCode.do",
              param,
              suc => {
                // this.alertMsg("TrusfortGetAuthCode.do"+JSON.stringify(suc))
                this.$refs.msgInput.focus();
                if (suc.status != "1000") {
                  this.alertMsg("获取短信验证码失败！");
                  return;
                }
                this.toastMsg('请注意来电!');
              }, fail => {
                // 9001为短信验证码错误
                // if(fail._RejMessage.substr(0,4)==9001){
                // this.alertMsg("短信验证码错误，请重试!")
                // }else{
                this.alertMsg(fail._RejMessage);
                // }

              }
            );
          }
        }
      },
      timeOut() {
          this.timer = setInterval(() =>{
              this.time--;
              if (this.time <= 0) {
                clearInterval(this.timer);
              }
          }, 1000);
      }
    }
  };
</script>
<style scoped>
  .fucengModal{
    position:fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
    background-color:rgba(0,0,0,0.5);
    justify-content: center;
    align-items: center;
  }
  .modalBox{
    width: 630px;
    height: 540px;
    /* margin-top: 316px;
    margin-left: 68px; */
    background-color: #fff;
    border-radius: 12px;
    align-items: center;
    padding-top: 40px;
  }
  .certificateBox{
    width: 550px;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 50px;
  }
  .certificateTitle{
    height:36px;
    font-size:36px;
    font-family:PingFang-SC-Bold,PingFang-SC;
    font-weight:bold;
    color:rgba(51,51,51,1);
    line-height:36px;
  }
  .mainCertificate{
    width:630px;
    padding-left:40px;
    padding-bottom:40px;
    border-bottom-width: 1px;
    border-bottom-color: #EAEAEA;
  }
  .certificateText{
    width: 550px;
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
  .forgetCertifiText{
    width: 550px;
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    text-align: right;
    color:#4A89FC;
  }
  .passwordBtn{
    width:550px;
    height: 88px;
    line-height: 88px;
    text-align: center;
    color: #fff;
    border-radius:12px;
    margin-top: 30px;
    background-image: linear-gradient(to right, #FB5D7A, #E6022C);
  }
  .certificateInput{
    width: 550px;
    height: 90px;
    border-width: 1px;
    border-color: rgba(221,221,221,1);
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .cancelMsgIcon{
    width: 36px;
    height: 36px;
    position: absolute;
    right: 0;
  }
  .greyBoxShadow{
    background-color:rgba(250,250,250,1);
    position:fixed;
    width: 750px;
    top:0;
    bottom:0;
  }
  .transresultGif{
    width: 180px;
    height: 180px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .topAmount{
      width: 750px;
      height: 174px;
      justify-content: center;
      align-content: center;
  }
  .smallAmount{
      flex-direction: row;
      justify-content: center;
      
  }
  .smallAmountText{
      font-size:46px;
      font-family:PingFang-SC-Bold,PingFang-SC;
      font-weight:bold;
      color:rgba(51,51,51,1);
      line-height:56px;
  }
  .upperCaseAmount{
      flex-direction: row;
      justify-content: center;
      text-align: center;
      font-size:30px;
      font-family:PingFang-SC-Bold,PingFang-SC;
      font-weight:bold;
      color:rgba(102,102,102,1);
  }
  .everyInfoTitle{
      font-size:32px;
      font-family:PingFang-SC-Bold,PingFang-SC;
      font-weight:bold;
      color:rgba(51,51,51,1);
  }
  .payee,.payer,.other {
    margin-top:15px;
    margin-left:15px;
    margin-right:15px;
    padding:20px;
    padding-bottom: 30px;
    background-color: #fff;
    border-width: 1px;
    border-color: rgba(245,245,245,1);
    border-radius: 12px;

  }
  .transferDealing{
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(124,124,124,1);
    text-align: center;
  }
  .payee_box,.payer_box,.other_box {
    flex-direction: row;
    justify-content: space-between;
    margin-top: 20px;
  }
  .payeeInfoName{
      flex-direction: row;
      margin-top: 20px;
  }

  .payerimg{
    width: 40px;
    height: 40px;
    margin-right: 20px;
  }

  .payer_box_title{
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
  }
  .payer_box_Text{
    /* width: 400px; */
    text-align: right;
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(102,102,102,1);
  }
  .rightzhineng{
    flex-direction: row;
  }
  .rightzhinengText{
    margin-right:20px;
    flex-direction:row;
    align-items: center;
  }
  .checkboximg{
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }
  .other_box_desc {
    font-size:30px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(102,102,102,1);
  }
  .confirm_title {
    width: 500px;
    height: 80px;
    background-color: gray;
    text-align: center;
    line-height: 80px;
    margin: 80px 0;
  }

  .certificate {
    background-color: white;
    padding: 20px;
  }

  .certificate_header {
    border-bottom-width: 1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .certificate_header_x {
    position: absolute;
    right: 10px;
  }

  .certificate_content {
    margin: 40px 0;
  }

  .certificate_box {
    margin: 20px;
  }

  .msg_box {
    width: 670px;
    height: 70px;
    border-width: 2px;
    padding: 20px;
    border-color: rgb(63, 62, 62);
    margin: 10px 0;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .input_box {
    height: 70px;
    width: 670px;
    border-width: 2px;
    border-color: rgb(63, 62, 62);
    padding: 20px;
    margin: 10px 0;
  }

  .text_blue {
    text-align: right;
    color: rgb(42, 164, 235);
    font-size: 24px;
    margin: 0 20px;
  }

  .confirm1,
  .confirm {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .confirm1_btn {
    width: 500px;
    height: 80px;
    background-color: gray;
    text-align: center;
    line-height: 80px;
  }

  

  .res2 {
    width: 180px;
    height: 180px;
    display: flex;
    align-self: center;
    justify-content: center;
    align-items: center;
    background-color: white;
    margin-top: 120px;
    margin-bottom: 60px;
  }

  .timer {
    width:60px;
    height:58px;
    font-size:48px;
    font-family:DIN-Medium,DIN;
    font-weight:500;
    color:rgba(74,137,252,1);
  }
</style>