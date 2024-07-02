<template>
    <div class="home">
    <NavBar :title="title"></NavBar> 
		<scroller>
			<div class="container" >
        <div class="progress">
          <div class="transresult">
            <div class="trans">
              <div class="transbut">
                <text class="transstep">经办</text>
              </div>
              <div class="space"></div>
            </div>
            <div class="trans">
              <div class="transbut">
                <text class="transstep">通过</text>
              </div>
              <div class="space"></div>
            </div>
            <div class="trans0">
              <div class="transbut">
                <text class="transstep">{{status}}</text>
              </div>
            </div>
          </div>
          <!-- <div class="transresult1">
            <div class="transdate">
              <text class="transname">张三</text>
              <text class="transname">2019/09/05 12:03:34</text>
            </div>
            <div class="transdate">
              <text class="transname">张三</text>
              <text class="transname">2019/09/05 12:03:34</text>
            </div>
            <div class="transdate">
              <text class="transname">2019/09/05 12:03:34</text>
            </div>
          </div> -->
        </div>
        <div class="totalamt">
          <text class="amt">¥{{Amount}}</text>
          <text>{{changeMoneyToChinese(Amount)}}</text>
        </div>
        <div class="content_box">
          <div class="content_details">
            <div class="detail_title">
              <text class="detail_type">收</text>
            </div>
            <text class="detail_info">收款方信息</text>
          </div>
          <div  class="content_details margin32">
            <text class="info">名称：</text>
            <text class="info">{{PayeeAcName}}</text>
          </div>
          <div  class="content_details margin32">
            <text class="info">账号：</text>
            <text class="info">{{PayeeAcNo}}</text>
          </div>
          <div  class="content_details margin32">
            <text class="info">银行：</text>
            <text class="info">{{PayeeBankName}}</text>
          </div>
          <div  class="content_details margin32">
            <text class="info">行号：</text>
            <text class="info">{{PayeeBankId}}</text>
          </div>
        </div>
        <div class="content_box_pay">
          <div class="content_details">
            <div class="detail_title">
              <text class="detail_type">付</text>
            </div>
            <text class="detail_info">付款方信息</text>
          </div>
          <div  class="content_details margin32">
            <text class="info">名称：</text>
            <text class="info">{{PayerAcName}}</text>
          </div>
          <div  class="content_details margin32">
            <text class="info">账号：</text>
            <text class="info">{{PayerAcNo}}</text>
          </div>
          <!-- <div  class="content_details margin32">
            <text class="info">银行：</text>
            <text class="info">美团银行农村商业银行</text>
          </div> -->
        </div>
        <div class="content_box">
          <div class="content_details">
            <div class="detail_title">
              <text class="detail_type">其</text>
            </div>
            <text class="detail_info">金额及其他信息</text>
          </div>
          <div  class="content_details margin32">
            <text class="info">转账金额：</text>
            <text class="info">¥{{Amount}}</text>
          </div>
          <div  class="content_details margin32">
            <text class="info">手续费：</text>
            <text class="info">¥{{Fee}}</text>
          </div>
          <div  class="content_details margin32">
            <text class="info">转账用途：</text>
            <text class="info">{{PayPurpose}}</text>
          </div>
          <div  class="content_details margin32">
            <text class="info">到账方式：</text>
            <text class="info">{{TransferType}}</text>
          </div>
          <div  class="content_details margin32">
            <text class="info">短信通知收款人：</text>
            <text class="info">{{MobilePhone}}</text>
          </div>
        </div>
			</div>
		</scroller>
	</div>
	
</template>
<style scoped>
.info{
  font-size: 28px;
  color: #666666;
}
.detail_info{
  color: #222222;
  font-size: 32px;
  font-weight: bold;
  margin-left: 32px;
}
.detail_type{
  color: #ffffff;
  font-size: 28px;
  font-weight: bold;
}
.detail_title{
  margin-left: 30px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: #666666;
  align-items: center;
  justify-content: center;
}
.amt{
  font-size: 42px;
  font-weight: bold;
}
.totalamt{
  margin-top: 20px;
  height: 150px;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
.transname{
  font-size: 24px;
  color: #999999;
}
.transdate{
  width: 250px;
  height: 90px;
  justify-content: center;
}
.transstep{
  color: #ffffff;
  font-size: 24px;
  text-align: center;
}
.trans{
  width: 230px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.trans0{
  width: 230px;
  flex-direction: row;
  align-items: center;
}
.space{
  width: 150px;
  height: 1px;
  background-color: black;
}
.transbut{
  width: 80px;
  height: 80px;
  background-color: #999999;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}
.transresult{
  width: 690px;
  margin-left: 30px;
  height: 90px;
  flex-direction: row;
  align-items: center;
}
.transresult1{
  width: 750px;
  margin-left: 30px;
  height: 90px;
  flex-direction: row;
  align-items: center;
}
.progress{
  width: 750px;
  height: 180px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}
.list_money{
  color:rgb(102,102,102);
  font-size:26px;
  line-height:26px;
  margin-right:35px;
}
.list_title{
  color:rgb(102,102,102);
  font-size:26px;
  line-height:26px;
  margin-left:30px;
}
.card_list{
  flex-direction: row;
  justify-content:space-between;
  width:750px;
  height:26px;
}
.content_box_pay{
  width: 750px;
  height: 250px;
  margin-top: 10px;
  flex-direction:column;
  background-color: rgb(255, 255, 255);
}
.content_box{
  width: 750px;
  height: 350px;
  margin-top: 10px;
  flex-direction:column;
  background-color: rgb(255, 255, 255);
}
.content_details{
  flex-direction: row;
  height:60px;
  align-items: center;
}
.margin32{
  margin-left: 32px;
}
.home {
  width: 750px;
  background-color: rgb(236, 234, 234);
  /* margin-top: 140px; */
}
.container {
  width: 750px;
    margin-top: 5px;
    background-color: rgb(236, 234, 234);
}
.p{
  height: 96px;
}


.bottom {
  width: 750px;
  height: 96px;
  position: fixed;
  bottom: 0;
  background-color: rgb(254, 79, 64);
  /* background-image: linear-gradient(
    to bottom,
    rgb(254, 79, 64),
    rgb(254, 107, 65)
  ); */
}

.text {
  margin-left: 296px;
  margin-top: 32px;
  font-family: "PingFangSC-Medium";
  font-size: 32px;
  color: rgb(255, 255, 255);
  text-align: left;
}
</style>
<script>

import NavBar from "@/components/templet/titlebar";
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");

export default {
  components: {
    NavBar
  },
  data() {
    return {
      title: "交易详情",
      BgColor: "rgb(64,64,64)",
      FontColor: "#ffffff",
      useDefaultReturn: false,
      JnlNo:"",
      TransCode:"",
      status:"",
      PayerAcName:"",//付款名称
      PayerAcNo:"",//付款账号
      PayeeAcName:"",//收款名称
      PayeeAcNo:"",//收款账号
      PayeeBankName:"",//收款人银行
      PayeeBankId:"",//收款人行号
      Amount:"",//交易金额
      Fee:"",//手续费
      PayPurpose:"",//用途
      TransferType:"",//方式
      MobilePhone:""
    };
  },
  created(){
        this.status=context.sessionGetString("TransStatus");
        this.title=context.sessionGetString("TransName");
        this.JnlNo=context.sessionGetString("JnlNo");
        this.TransCode=context.sessionGetString("TransCode");
        this.getJnlDetail();
  },
  methods: {
    getJnlDetail(){
        this.goJson("/eweb/AuthEjnlDetail.do", {
            TransCode:this.TransCode,
            JnlNo:this.JnlNo
        }, response => {
                  this.PayerAcName=response.data.PayerAcName//付款名称
                  this.PayerAcNo=response.data.PayerAcNo
                  this.PayeeAcName=response.data.PayeeAcName
                  this.PayeeAcNo=response.data.PayeeAcNo
                  this.PayeeBankName=response.data.PayeeBankName  
                  this.PayeeBankId=response.data.PayeeBankId
                  this.Amount=response.data.Amount
                  this.Fee=response.data.Fee
                  this.PayPurpose=response.data.PayPurpose
                  this.TransferType=response.data.TransferType
                  this.MobilePhone=response.data.MobilePhone
      });
    },
    runMOney(amount) {
      if(amount == null || amount == undefined || isNaN(parseFloat(amount))){
        amount = "";
        return amount;
      }
      var xsd = amount.toString().split(".");
      if(xsd.length == 1){
        amount = amount.toString()+".00";
      }
      if(xsd.length > 1){
        if(xsd[1].length < 2){
          amount = amount.toString()+"0";
        }else if(xsd[1].length > 2){
          amount = amount.toString().substring(0,amount.toString().indexOf('.')+3);
        }else{
          amount = amount.toString();
        }
      }
      return amount;
    }
  }
};
</script>



