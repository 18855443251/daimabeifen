<template>
  <div>
    <nav-bar title="转账记录查询"></nav-bar>
    <!--交易成功-->
    <scroller>
          <div class="topContent">
              <image :src="resultIcon" class="resultIconPng" />
              <text class="reservateNet" style="font-size:30px;">{{$store.state.OtherRecordListInFo.skrhm}}</text>
              <div class="rowDirection">
                  <text class="reservateNetNum" style="font-size:48px;margin-left:15px;">¥{{$store.state.OtherRecordListInFo.TxnAmt}}</text>
              </div>
              <text class="reservateNet">{{$store.state.recordState[$store.state.OtherRecordListInFo.TxnSt]}}</text>
              <text style="color:#999;font-size: 25px;margin-top: 10px" v-if="$store.state.OtherRecordListInFo.TxnSt!='PR45'&&$store.state.recordState[$store.state.OtherRecordListInFo.TxnSt]!=$store.state.OtherRecordListInFo.OrgnlTxnRetMsg">{{$store.state.OtherRecordListInFo.OrgnlTxnRetMsg}}</text>
          </div>
          <splitDiv />
          <div style="padding-left: 30px;">
              <div class="everySingle">
                  <text class="leftText">交易时间</text>
                  <text class="rightText">{{dealTimeLine($store.state.OtherRecordListInFo.OrgnlTxnCnlDt,$store.state.OtherRecordListInFo.OrgnlSysTm)}}</text>
              </div>
              <div class="everySingle">
                  <text class="leftText">手续费:</text>
                  <text class="rightText">¥{{$store.state.OtherRecordListInFo.PcdFee?$store.state.OtherRecordListInFo.PcdFee:'0.00'}}</text>
              </div>
              <div class="everySingle">
                  <text class="leftText">收款账户:</text>
                  <text class="rightText">{{$store.state.OtherRecordListInFo.PyeAcctNo|AccountNoFormat}}</text>
              </div>
              <div class="everySingle">
                  <text class="leftText">收款银行:</text>
                  <text class="rightText">{{$store.state.OtherRecordListInFo.PyeBnkNm}}</text>
              </div>
              <div class="everySingle">
                  <text class="leftText">付款账户:</text>
                  <text class="rightText" v-if="!$store.state.accountProtect">{{$store.state.OtherRecordListInFo.PyrAcctNo|AccountNoFormat}}</text>
                  <text class="rightText" v-else>{{$store.state.OtherRecordListInFo.PyrAcctNo|AccountNoFormat(6,-4)}}</text>
              </div>
              <div class="everySingle" v-if="iscocp">
                <text class="leftText">账簿名</text>
                <text class="rightText">{{payeeBank}}</text>
              </div>
              <div class="everySingle" v-if="iscocp">
                <text class="leftText">账簿号</text>
                <text class="rightText">{{payerAccount}}</text>
              </div>
              <div class="everySingle" v-if="$store.state.OtherRecordListInFo.Smy">
                <text class="leftText">转账用途</text>
                <text class="rightText">{{ellipsis($store.state.OtherRecordListInFo.Smy,15)}}</text>
              </div>
              <div class="everySingle">
                <text class="leftText">交易类型</text>
                <text class="rightText">{{$store.state.OtherRecordListInFo.OrgnlPymtCnlCd!='CRDC'&&$store.state.OtherRecordListInFo.OrgnlPymtCnlCd!='COSP'?'跨行':'行内'}}</text>
              </div>
              <div class="everySingle">
                <text class="leftText">到账方式</text>
                <text class="rightText">{{transway[$store.state.OtherRecordListInFo.RcvdTmTp]}}</text>
              </div>
              <div class="everySingle">
                <text class="leftText">交易渠道</text>
                <text class="rightText">{{$store.state.transChannel[$store.state.OtherRecordListInFo.OrgnlTxnCnlCd]}}</text>
              </div>
          </div>
          <splitDiv />
        <div class="btn" v-if='$store.state.OtherRecordListInFo.TxnSt=="PR45"||$store.state.OtherRecordListInFo.TxnSt=="PR12"'>
            <text class="text_btn text_btn_left" v-if='$store.state.OtherRecordListInFo.TxnSt=="PR45"||$store.state.OtherRecordListInFo.TxnSt=="PR12"' @click="transAgain">再转一笔</text>
            <text class="text_btn text_btn_right" v-if='$store.state.OtherRecordListInFo.TxnSt=="PR45"' @click="electronicReceipt">电子回单</text>
            <text class="text_btn text_btn_right" @click="cancelTransfer" v-if='$store.state.OtherRecordListInFo.TxnSt=="PR12"'>撤销转账</text>
        </div>
        <submitBtn btntext="再转一笔" @click.native="transAgain" v-if="$store.state.OtherRecordListInFo.TxnSt=='PR90'||$store.state.OtherRecordListInFo.TxnSt=='PR99'" />
    </scroller>
    <wxc-popup popup-color="white" :show="showConfirm" @wxcPopupOverlayClicked="showConfirm = false" pos="bottom" height="640">
      <image src="./imgs/cancelMsgIcon.png" class="cancelIcon"/>
      <text class="canceltitle">撤销原因</text>
      <input class="cancelInput" type="text" placeholder="请输入撤销原因" v-model="CancelReason" >
      <submitBtn btntext="确认" />
    </wxc-popup>
     <!-- 云盾浮层 -->
    <yundunModal v-if="isBottomShow" />
  </div>
</template>
<script>
  import NavBar from "../../components/titlebar_component.vue";
  import splitDiv from "../../components/splitDiv.vue";
  import submitBtn from "../../components/submitBtn.vue";
  import yundunModal from "@/components/yundunModal.vue";//云盾模态框
  
  import { WxcPopup } from "weex-ui";
  const context = weex.requireModule("context");
  const wjalert = weex.requireModule("weex-alert");
  const modal = weex.requireModule("modal");
  export default {
    components: { NavBar, WxcPopup,splitDiv ,submitBtn,yundunModal},
    data() {
      return {
        resultIcon:'./imgs/transSuccessIcon.png',
        stateImg: "./imgs/revocable@3x.png",
        arrowImg: "./imgs/rightarrow_icon@3x.png",
        transway:{
          0:'实时转账',
          1:'普通转账',
          2:'次日到账'
        },
        state: 2,//交易状态
        iscocp: false,//是否通过账簿转出
        showConfirm: false,//弹出转账撤销
        CancelReason: '',//撤销原因
        operationStatus:'',//表明按钮
        isBottomShow: false,
        cancelMsgIcon:this.$store.state.imgBaseUrl+'cancelMsgIcon.png',
        _tokenName:'',//防重复验证码
      };
    },
    created(){
      let TxnStList=['PR99','PR19'];
      if(TxnStList.includes(this.$store.state.OtherRecordListInFo.TxnSt)){
          this.resultIcon='./imgs/transFailIcon.png';
      }else{
          this.resultIcon='./imgs/transSuccessIcon.png';
      }
      this.getTokenName();
    },
    methods: {
      //获取防重复验证码
      getTokenName(){
          this.post("/eweb/GenToken4m.do",{},response=>{
              this._tokenName=response.data._tokenName;
          });
      },
      electronicReceipt() {
          // this.jump("/Receipt");
          this.$router.push({
            path:'/Receipt',
            query:{
              everyInfo:this.$store.state.OtherRecordListInFo
            }
          })
      },
      cancelTransfer(){
        if(context.secureGetString('CertFlag')=='1'){//未开通
          wjalert.confirm("您尚未开通云盾，请先开通云盾","确定","取消",data=>{
              if(data == "Y") {
                  context.launchStage('main.yundunManage');//跳转到云盾管理去人脸识别然后下载证书
              }
          })
        }else{
          this.$store.state.confirmTransferParams={
              OrgnlTxnCnlCd:this.$store.state.OtherRecordListInFo.OrgnlTxnCnlCd,
              OrgnlTxnCnlDt:this.$store.state.OtherRecordListInFo.OrgnlTxnCnlDt,
              OrgnlCnsmrSeqNo:this.$store.state.OtherRecordListInFo.OrgnlCnsmrSeqNo,
              PyeAcctNo:$store.state.RecordListInFo.PyeAcctNo,
              PyrAcctNo:$store.state.RecordListInFo.PyrAcctNo,
              TxnAmt:this.$store.state.RecordListInFo.TxnAmt,
              _tokenName:this._tokenName,
          }
          this.isBottomShow = true;
        }
      },
      // 转账撤销确认
      finalConfirm() {
          this.post('/eweb/TransferNotRealTimeCancel.do',this.$store.state.confirmTransferParams, response => {
                this.$store.state.transCancelResData=response.data;
                this.jump('/CancelRes');
          })
      },
      //再转一笔，跳转到快捷转账
      transAgain(){
          //将此笔收款人信息放入缓存
          let payeeDetail={
              PayeeAcNo:this.$store.state.OtherRecordListInFo.PyeAcctNo,
              PayeeAcName:this.$store.state.OtherRecordListInFo.skrhm,
              PayeeBankName:this.$store.state.OtherRecordListInFo.PyeBnkNm,
          }
          context.sessionSetString("payeeDetail",JSON.stringify(payeeDetail));
          context.replaceStage('main.FastTrans?flag=transAgain');
      },
      cancel() {
          this.isBottomShow = false;
      },
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
  }
  .modalBox{
    width: 630px;
    height: 540px;
    margin-top: 316px;
    margin-left: 68px;
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
  .cancelMsgIcon{
    width: 36px;
    height: 36px;
    position: absolute;
    right: 0;
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
  input:focus{
    outline: none;
  }
  .cancelIcon{
    width:36px;
    height:36px;
    position:absolute;
    top: 30px;
    right: 30px;
  }
  .canceltitle{
    font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:30px;
    margin-top: 80px;
    margin-left: 30px;
  }
  .cancelInput{
    width:690px;
    height:90px;
    border-radius:8px;
    border:1px solid rgba(221,221,221,1);
    margin-left: 30px;
    margin-top: 30px;
    margin-bottom: 200px;
    padding-left: 20px;
  }
  .row {
    flex-direction: row;
    width: 750px;
    height: 110px;
    align-items: center;
    justify-content: space-between;
    padding-left: 30px;
    padding-right: 30px;
    margin-bottom:30px;
  }
  .title {
    font-size:30px;
    font-family:PingFang SC;
    font-weight:500;
    color:rgba(51,51,51,1);
    line-height:56px;
  }
  .arrow {
    width: 18px;
    height: 30px;
  }
  .btn {
      flex-direction: row;
      justify-content: space-around;
      margin: 50px 0;
  }
  .text_btn {
    width: 325px;
    height: 88px;
    text-align: center;
    line-height: 88px;
  }
  .text_btn_left{
    border-width: 2px;
    border-color:rgba(230,2,44,1);
    border-radius:12px;
    font-weight:bold;
    color:rgba(230,2,44,1);
    letter-spacing:2px;
  }
.text_btn_right{
    background-color:rgba(230,2,44,1);
    border-radius:12px;
    font-weight:bold;
    color:#fff;
    letter-spacing:2px;
}
.topContent{
  padding-top: 50px;
  padding-bottom: 60px;
  align-items: center;
}
.resultIconPng{
  width: 109px;
  height: 109px;
}
.topTextContent{
  position:absolute;
  top:0;
  width:750px;
  align-items: center;
  padding-top: 50px;
}
.reservateNet{
  font-size:32px;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(51,51,51,1);
  line-height:59px;
}
.reservateNetNum{
  font-size:48px;
  font-family:PingFang SC;
  font-weight:bold;
  color:rgba(233,143,57,1);
  line-height:56px;
}
.reservateAdd{
  font-size:26px;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(124,124,124,1);
  line-height:56px;
}
.rowDirection{
  flex-direction:row;
  align-items: center;
}
.everySingle{
  flex-direction: row;
  height: 95px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234,234,234,1);
  align-items: center;
  justify-content: space-between;
}
.leftText{
  font-size:30px;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:56px;
}
.rightText{
  font-size:30px;
  font-family:PingFang SC;
  font-weight:500;
  color:rgba(124,124,124,1);
  line-height:110px;
  margin-right: 30px;
}
</style>