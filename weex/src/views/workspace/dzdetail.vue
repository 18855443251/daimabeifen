<template>
    <div class="container">
        <nav-bar :title="title"></nav-bar>
     <scroller>
         <!-- <intiate-progress v-if="showBtn == '0'"></intiate-progress>
         <progress v-if="showBtn == '1'"></progress> -->
        <div class="containTop">
        <div class="lattice">
            <text class="customerNameLeft">客户名称</text>
            <text class="customerNameRight">{{detail.CifName}}</text>
        </div>
        <div class="lattice">
            <text class="customerNameLeft">对账单编号</text>
            <text class="customerNameRight">{{detail.BillNo}}</text>
        </div>
        <div class="lattice">
            <text class="customerNameLeft">余额截止日期</text>
            <text class="customerNameRight">{{detail.BillTerm}}</text>
        </div>
        <div class="lattice">
            <text class="customerNameLeft">账户个数</text>
            <text class="customerNameRight">{{detail.AcNum1}}</text>
        </div>
        </div>
        <div class="containDiv" v-for="(item,index) in cardList" :index="index" :key="index">
          <div class="containDivTop">
            <div class="cardText">
                <div class="cardLeftDiv">
                    <!-- <image class="cardImg" :src="cardImg"></image> -->
                    <text class="cardNum">{{CardNum(item.AcNo)}}/{{item.AcType}}</text>
                </div>
                <text class="cardRight">{{item.Currency}}</text>
            </div>
            <div class="moneyDiv">
                <text class="moneyText">金额:  {{item.Balance|money}}</text>
                <!-- <text class="money"></text> -->
            </div>
          </div>
          <div class="containDivBottom">
              <text class="resultText">对账结果：</text>
              <div class="resultDiv">
                  <text class="checkText">{{item.CheckFlag}}</text>
              </div>
          </div>
        </div>          
        <show-botton v-if="showBtn=='0'"></show-botton>
     </scroller>
    </div>
</template>

<script>
import NavBar from "@/components/templet/titlebar";
import showBotton from "@/components/tab_bench/showBotton.vue";
import intiateProgress from "@/components/tab_bench/intiateProgress.vue";
import Progress from "@/components/tab_bench/progress.vue";
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
export default {
  components: {
    NavBar,
    showBotton,
    intiateProgress,
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
        cardImg: this.$store.state.imgBaseUrl + "nosearch.png",
        checkImg: this.$store.state.imgBaseUrl + "check_box_success.png",
        nocheckImg:this.$store.state.imgBaseUrl + "unchecked.png",
        cardList:[],  //账户类表
        checkList:[], //是否符合
        Billnumber:"",  //对账单编号
        customerName:"", //客户名称
        time:"" ,  //余额截止日期
        AccountsNum:"",    //账户个数
        checkRreult:[],
        _tokenName:"",
    };
  },
  created() {
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
      this.goJson("/eweb/AuthEjnlDetail.do", {
          TransCode: this.TransCode,
          JnlNo: this.JnlNo
      }, response => {
        this.detail = response.data.EjnlList[0];
        this.cardList = this.detail.List;
      })
    },
    //请求待审核的交易详情
    getCheckDetail(){
        this.goJson("/eweb/AuthDetailQuery.do", {
            TransCode:this.TransCode,
            _AuthJnlNo:this.JnlNo
        }, response => {
          this.detail = response.data.EjnlList[0];
          this.cardList = this.detail.List;
      });
    },
  }
};
</script>

<style scoped>
.al{
    width: 750px;
    height: 120px;
}
.container {
    background-color: (250,250,250,1);
}
.containTop{
    background-color: white;
}
.lattice {
  height: 110px;
  border-bottom-width: 1px;
  border-bottom-color: #EAEAEA;
  justify-content: space-between;
  flex-direction: row;
}
.customerNameLeft {
  padding-left: 30px;
  line-height: 110px;
  font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(51,51,51,1);
}
.customerNameRight {
  padding-right: 30px;
  line-height: 110px;
  font-size:30px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
    color:rgba(102,102,102,1);
}
.containDiv {
    border-width: 1px;
    border-color: rgba(245,245,245,1);
    /* box-shadow:0px 0px 14px 2px rgba(51,51,51,0.08); */
  width: 690px;
  margin-left: 30px;
  height: 260px;
  background-color: white;
  border-radius: 20px;
  margin-top: 30px;
}
.cardText {
  flex-direction: row;
  justify-content: space-between;
}
.containDivTop{
    height: 180px;
    border-bottom-width: 1px;
  border-bottom-color: #EAEAEA;
}
.cardLeftDiv {
  flex-direction: row;
  padding-left: 30px;
}
.cardImg{
    width: 40px;
    height: 40px;
    margin-top: 20px;
}
.cardNum{
    line-height: 100px;
    margin-left: 10px;
    font-size: 30px;
}
.cardRight {
    font-size: 30px;
    line-height: 100px;
    padding-right: 30px;
    color: gray;
}
.moneyDiv{
    padding-left: 30px;
    flex-direction: row;
}
.moneyText{
    line-height: 80px;
    font-size: 30px;
}
.containDivBottom{
    flex-direction: row;
    padding-left: 30px;
}
.resultText{
    line-height: 80px;
    font-size: 30px;
}
.resultDiv{
    flex-direction: row;
    margin-left: 60px;
}
.checkImg{
    width: 45px;
    height: 45px;
    margin-top: 17px;
}
.checkText{
    font-size: 30px;
    line-height: 80px;
    margin-left: 10px;
}
.button{
    position: fixed;
    bottom:0;
    width: 750px;
    height: 100px;
    background-color: rgb(239,42,78);
    /* background-color: gray; */
}
.buttonText{
    line-height: 100px;
    text-align: center;
    color: white;
}
</style>
