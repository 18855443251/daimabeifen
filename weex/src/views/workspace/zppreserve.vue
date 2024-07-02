<template>
    <div>
       <NavBar :title="title"></NavBar>
      <scroller>
           <intiate-progress v-if="showBtn == '0'"></intiate-progress>
        <progress v-if="showBtn == '1'"></progress>  
            <div style="padding-left: 30px;">
                  <!-- <div class="everySingle">
                      <text class="leftText">购买支票账号</text>
                      <text class="rightText">{{detail.PayerAcNo}}</text>
                  </div>
                  <div class="everySingle">
                      <text class="leftText">账户名称</text>
                      <text class="rightText">{{detail.PayerAcName}}</text>
                  </div> -->
                  <div class="everySingle">
                      <text class="leftText">支票种类</text>
                      <text class="rightText">现金支票</text>
                  </div>
                  <div class="everySingle">
                      <text class="leftText">张数</text>
                      <text class="rightText">{{detail.Share}}</text>
                  </div>
                  <div class="everySingle">
                      <text class="leftText">领取时间</text>
                      <text class="rightText">{{detail.ReserveDate}}</text>
                  </div>
                   <div class="everySingle" style="border-bottom-width:0px;" @click="gotoNetAddress">
                      <text class="leftText">领取地址</text>
                      <text class="rightText">查看可领取支票网点及地址</text>
                  </div>
                  <!-- <div class="everySingle" style="border-bottom-width:0px;">
                      <text class="leftText">领取地址</text>
                      <div class="rowDirection" @click="gotoNetAddress">
                          <text class="rightText" style="margin-right:30px;line-height:100px;color:rgba(124,124,124,1)">查看可领取支票网点及地址</text>
                          <image :src="rightArrowSrc" class="rightArrow"/>
                      </div>
                  </div> -->
            </div>
            <!-- <splitDiv /> -->
            <div style="padding-left: 30px;" v-if="detail.Opr1Nm">
                <div class="everySingle">
                    <text class="leftText">经办人1名称</text>
                    <text class="rightText">{{detail.Opr1Nm}}</text>
                </div>
                <div class="everySingle">
                    <text class="leftText">经办人1证件类型</text>
                    <text class="rightText">身份证</text>
                </div>
                <div class="everySingle">
                    <text class="leftText">经办人1证件号码</text>
                    <text class="rightText">{{detail.Opr1IdentNo}}</text>
                </div>
            </div>
            <div style="padding-left: 30px;" v-if="detail.Opr2Nm && detail.Opr2Nm!='请选择经办人'">
                <div class="everySingle">
                    <text class="leftText">经办人2名称</text>
                    <text class="rightText">{{detail.Opr2Nm}}</text>
                </div>
                <div class="everySingle">
                    <text class="leftText">经办人2证件类型</text>
                    <text class="rightText">身份证</text>
                </div>
                <div class="everySingle">
                    <text class="leftText">经办人2证件号码</text>
                    <text class="rightText">{{detail.Opr2IdentNo}}</text>
                </div>
            </div>
      </scroller>
       <showBotton v-if="showBtn == '0'"></showBotton>
    </div>
</template>
<script>
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
const wjalert = weex.requireModule("weex-alert");
import NavBar from "@/components/templet/titlebar";
import intiateProgress from "@/components/tab_bench/intiateProgress.vue";
import Progress from "@/components/tab_bench/progress.vue";
import showBotton from "@/components/tab_bench/showBotton.vue";
module.exports = {
  data() {
    return {
      title: "预约购买支票确认",
    JnlNo:"",
      TransCode:"",
      TransStatus: "",
      detail: {},
      showBtn: "",
    };
  },
  computed: {},
  components: { NavBar,intiateProgress,Progress,showBotton},
  created() {
 //   this.getTokenName();
  this.TransStatus=context.sessionGetString("TransStatus");
        this.title=context.sessionGetString("TransName");
        this.JnlNo=context.sessionGetString("JnlNo");
        this.TransCode=context.sessionGetString("TransCode");
        this.showBtn=context.sessionGetString("showBtn");
        if(this.showBtn == "0") {
          this.getCheckDetail()
        } else if(this.showBtn == "1"){
          this.getDetail()
        }   
  },
  methods: {
       //请求我发起的和我处理的详情信息
    getDetail() {
      var params={
          TransCode: this.TransCode,
          JnlNo: this.JnlNo
      }
      this.goJson("/eweb/AuthEjnlDetail.do", params , response => {
        this.detail = response.data.EjnlList[0];
        this.$store.state.CheckAuthItemList=this.$store.state.CheckAuthItemList.concat(response.data.EjnlList[0]._AuthItemList);
      })
    },
    //请求待审核的交易详情
    getCheckDetail(){
        this.goJson("/eweb/AuthDetailQuery.do", {
            TransCode:this.TransCode,
            _AuthJnlNo:this.JnlNo
        }, response => {
        this.detail = response.data.EjnlList[0];
        this.$store.state.CheckAuthItemList=this.$store.state.CheckAuthItemList.concat(response.data.EjnlList[0]._AuthItemList);
      });
    },


    //查看可领取支票网点地址
    gotoNetAddress(){
        context.launchStage("main.buyCheckNet");
       //this.jump('/network');
    },
    //获取防重复
    getTokenName(){
        this.post("/eweb/GenToken4m.do",{},response=>{
            this._tokenName=response.data._tokenName;
        });
    },
    jumpResult(){
      if(context.secureGetString('CertFlag')=='1'){//未开通
          wjalert.confirm("您尚未开通云盾，请先开通云盾","确定","取消",data=>{
              if(data == "Y") {
                  context.launchStage('main.yundunManage');//跳转到云盾管理去人脸识别然后下载证书
              }
          })
        }else{
            this.$store.state.confirmTransferParams={
                PayerBankAcType:this.$store.state.ReserveBuyResponseData.PayerBankAcType,
                PayerAcName:this.$store.state.ReserveBuyResponseData.PayerAcName,
                PayerAcNo:this.$store.state.ReserveBuyResponseData.PayerAcNo,
                PayerCurrency:this.$store.state.ReserveBuyResponseData.PayerCurrency,
                CheckKind:this.$store.state.ReserveBuyResponseData.CheckKind,
                EqmtTp:this.$store.state.ReserveBuyResponseData.EqmtTp,//(根据支票种类区分，51送0,52送1)
                Share:this.$store.state.ReserveBuyResponseData.Share,
                CostPdn:this.$store.state.ReserveBuyResponseData.CostPdn,
                ReserveDate:this.$store.state.ReserveBuyResponseData.ReserveDate,
                Opr1Nm:this.$store.state.ReserveBuyResponseData.Opr1Nm,
                Opr1IdentTp:this.$store.state.ReserveBuyResponseData.Opr1IdentTp,
                Opr1IdentNo:this.$store.state.ReserveBuyResponseData.Opr1IdentNo,
                Opr2Nm:this.$store.state.ReserveBuyResponseData.Opr2Nm,
                Opr2IdentTp:this.$store.state.ReserveBuyResponseData.Opr2IdentTp,
                Opr2IdentNo:this.$store.state.ReserveBuyResponseData.Opr2IdentNo,
                _tokenName:this._tokenName,
                AuthType:"MCERT"
          }
          this.isBottomShow = true;
      }
    },
    modifyCheckResult(){
      if(context.secureGetString('CertFlag')=='1'){//未开通
          wjalert.confirm("您尚未开通云盾，请先开通云盾","确定","取消",data=>{
              if(data == "Y") {
                  context.launchStage('main.yundunManage');//跳转到云盾管理去人脸识别然后下载证书
              }
          })
        }else{
            this.$store.state.confirmTransferParams={
              PayerAcNo:this.$store.state.ReserveBuyResponseData.PayerAcNo,
              PayerAcName:this.$store.state.ReserveBuyResponseData.PayerAcName,
              CheckKind:this.$store.state.ReserveBuyResponseData.CheckKind,
              Share:this.$store.state.ReserveBuyResponseData.Share,
              ReserveDate:this.$store.state.ReserveBuyResponseData.ReserveDate,
              EqmtTp:this.$store.state.ReserveBuyResponseData.CheckKind=='51'?'0':'1',
              Opr1Nm:this.$store.state.ReserveBuyResponseData.Opr1Nm,
              Opr1IdentTp:this.$store.state.ReserveBuyResponseData.Opr1IdentTp,
              Opr1IdentNo:this.$store.state.ReserveBuyResponseData.Opr1IdentNo,
              Opr2Nm:this.$store.state.ReserveBuyResponseData.Opr2Nm,
              Opr2IdentTp:this.$store.state.ReserveBuyResponseData.Opr2IdentTp,
              Opr2IdentNo:this.$store.state.ReserveBuyResponseData.Opr2IdentNo,
              BkgSeqNo:this.$store.state.ReserveBuyResponseData.BkgSeqNo,
              BkgSt:this.$store.state.ReserveBuyResponseData.BkgSt,
              _tokenName:this._tokenName,
              AuthType:"MCERT"
        }
          this.isBottomShow = true;
      }
    },
    finalConfirm(){
      if(!this.$store.state.operateCheckFlag){
        this.post("/eweb/CheckReserveBuy4m.do",this.$store.state.confirmTransferParams,response=>{
              this.$store.state.ReserveBuyResultData=response.data;
              if(response.data._RejCode=='000000'){
                  this.jump('/develop');
              }
        });
      }else{
        this.post("/eweb/CheckReserveModify4m.do",this.$store.state.confirmTransferParams,response=>{
              this.$store.state.ReserveBuyResultData=response.data;
              if(response.data._RejCode=='000000'){
                  this.jump('/develop');
              }
        });
      }
    },
    jumpNetwork(){
        this.jump("/network")
    },
    cancel() {
        this.isBottomShow = false;
    },
  }
};
</script>
<style scoped>
.everySingle{
  flex-direction: row;
  height: 110px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234,234,234,1);
  align-items: center;
  justify-content: space-between;
}
.rowDirection{
  flex-direction:row;
  align-items:center;
  margin-right: 30px;
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
.rightArrow{
  width: 18px;
  height: 30px;
}
.rowFrame {
  flex-direction: row;
}
.message{
    margin-top: 5px;
    margin-left:10px;
}
.card{
    margin-top: 20px;
    margin-left: 20px;
    font-size: 30px;
}
.num{
    margin-top: 20px;
    margin-left: 20px;
    font-size: 30px;
}
.cut{
    margin-top: 5px;
    margin-left: 30px;
    color:#999999;
}
.cut_font{
    margin-top: 40px;
    margin-left: 100px;
    font-size: 26px;
    color:#999999;
}
.imageFrame{
    width: 30px;
    height: 30px;
    right: 1px;
    top: 24px;
    margin-top: 18px;
    margin-left:5px;
}

.gray{
    margin-top: 20px;
    font-size: 30px;
    right:100px;
    position: absolute;
}
.image{
    width: 30px;
    height: 30px;
    margin-top: 25px;
    right: 50px;
    position: absolute;
}
.cost{
    width: 750px;
    height: 80px;
}
.infodetails {
    width:750px;
    height:250px;
}
.row{
  width:750px;
  margin-top:20px;
  margin-left: 24px;
  flex-direction: row;
  flex-wrap: wrap;
}
.rowFrame_btn{
  width:160px;
  height:70px;
  margin-top:10px;
  margin-left:120px;
  text-align:center;
  line-height:70px;
  background-color:#f3f5f7;
  border-radius:4px;
  color:#222222;
  font-size:24px;
}
.title_type{
  color:#222222;
  font-size:30px;
  margin-left:250px;
  margin-top:5px;
}
.moneyspace{
    width:550px;
    margin-top:20px;
    margin-left: 20px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}
.input{
    height: 70px;
    width: 200px;
    font-size: 28px;
    margin-left:130px;
    border: 1px solid #222222;
}
.add{
    width:750px;
    height:20px;
}
.add_image{
    width: 40px;
    height: 40px;
    margin-top: 25px;
    margin-left: 260px;
}
.add_message{
    font-size: 30px;
    margin-top: 25px;
    margin-left: 40px;
}
.next{
    width:750px;
    height:100px;
    margin-top: 320px;
    border-radius: 24px;
    background-color:#999999;
}
.next_bottom{
    font-size: 30px;
    margin-top: 10px;
    margin-top: 25px;
    display: flex;
    align-items:center;
    justify-content: space-around;
}
</style>
