<template>
  <div class="home">
    <NavBar :title="title"></NavBar> 
		<scroller class="scroller_content">
			<div class="container">
        <intiate-progress v-if="showBtn == '0'"></intiate-progress>
        <progress v-if="showBtn == '1'"></progress>     
        <div class="totalamt">
          <text class="amt">¥{{moneyFilter(detail.TxnAmt)}}</text>
          <text class="capital">{{changeMoneyToChinese(detail.TxnAmt)}}</text>
        </div>
        <div class="content_box">
          <div class="content_details_spe content_details_title">
            <div class="detail_title">
              <image class="firstImg" :src="shouImg"></image>
            </div>
            <text class="detail_info">撤销转账信息</text>
          </div>
          <div class="content_details">
            <text class="info">交易流水号:</text>
            <text class="info_right">{{detail.OrgnlCnsmrSeqNo}}</text>
          </div>
          <div class="content_details">
            <text class="info">交易时间：</text>
            <text class="info_right">{{dealTimeLine(detail.OrgnlTxnCnlDt)}}</text>
          </div>
          <div class="content_details">
            <text class="info">对方账号：</text>
            <text class="info_right">{{detail.PyeAcctNo}}</text>
          </div>
          <div class="content_details">
            <text class="info">交易渠道：</text>
            <text class="info_right">{{$store.state.transChannel[detail.OrgnlTxnCnlCd]}}</text>
          </div>
        </div>
        <div class="kong"></div>
			</div>
		</scroller>
    <showBotton v-if="showBtn == '0'"></showBotton>
	</div>
	
</template>
<style scoped>
.info_right{
  font-size: 30px;
  width: 450px;
  color: #666;
  text-align: right;
}
.kong{
  height: 100px;
}
.info{
  width: 180px;
  font-size: 30px;
  color: #333;
}
.detail_info{
  color: #333;
  font-size: 30px;
  font-weight: bold;
  margin-left: 32px;
}
.detail_title{
  height: 50px;
  width: 50px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}
.amt{
  font-size: 36px;
  font-weight: bold;
  color: #333;
}
.totalamt{
  height: 150px;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
.capital{
  font-size: 30px;
  color: #555;
  font-weight: bold;
}
.transname{
  font-size: 20px;
  color: #999999;
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
  width: 550px;
  margin-top: 10px;
  margin-left: 100px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.firstImg{
  width: 40px;
  height: 40px;
}
.sapnImg{
  width: 154px;
  height: 2px;
}
.transresult1{
  width: 750px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.progress{
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
.content_box{
  width: 690px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 30px;
  border-width: 1px;
  border-color: rgb(245, 245, 245);
  border-style:solid;
  border-radius: 18px;
  flex-direction:column;
  background-color: rgb(255, 255, 255);
  padding: 30px;
  padding-bottom:10px;
}
.content_details{
  flex-direction: row;
  /* align-items: center; */
  margin-bottom: 15px;
  /* justify-content: space-between; */
}
.content_details_spe{
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
}
.content_details_title{
  margin-top: 20px;
}
.margin32{
  flex-direction: row;
  justify-content:space-between;
  margin-left: 32px;
  margin-right: 32px;
}
.home {
  width: 750px;
  position: fixed;
  top: 0;
  bottom: 0;
  background-color: rgb(250, 250, 250);
  /* margin-top: 140px; */
}
.container {
  width: 750px;
  background-color: rgb(250, 250, 250);
}
.scroller_content::-webkit-scrollbar{
  display: none;
}
</style>
<script>
import showBotton from "@/components/tab_bench/showBotton.vue";
import NavBar from "@/components/templet/titlebar";
import intiateProgress from "@/components/tab_bench/intiateProgress.vue";
import Progress from "@/components/tab_bench/progress.vue";
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");

export default {
  components: {
    NavBar,
    intiateProgress,
    showBotton,
    Progress
  },
  data() {
    return {
      title: "",
      JnlNo:"",
      TransCode:"",
      TransStatus: "",
      detail: {},
      showBtn: "",
      reasonImg: "./imgs/cancel@2x.png",
      firstImg:"./imgs/tab_bench/blue1@3x.png",
      secondImg:"./imgs/tab_bench/blue2@3x.png",
      thirdImg:"./imgs/tab_bench/gray3@3x.png",
      fuImg: "./imgs/tab_bench/fu.png",
      shouImg: "./imgs/tab_bench/chexiao.png",
      qiImg: "./imgs/tab_bench/qi.png",
      CheckAuthItemList:[
          // {
          //   ReMark:null,
          //   AuthUserName:'董春雪',
          //   AuthState:1,
          //   AuthDate:'2020-01-08 16:09:19.669',
          //   AuthSeq:7533721,
          //   AuthStep:1, 
          //   AuthUserSeq:28062,
          //   UserGrpId:1
          // }
        ] 
      // AuthStep表示审核的先后顺序
      // AuthState   0：未审核  1：已审核
      // UserGrpId  审核员级别 
    };
  },
  created(){
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
  }
};
</script>



