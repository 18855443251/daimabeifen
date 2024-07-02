<template>
  <div class="home">
    <nav-bar title="实时结汇"></nav-bar>
    <scroller>
      <intiate-progress v-if="showBtn == '0'"></intiate-progress>
      <progress v-if="showBtn == '1'"></progress>
      <div class="pick_box">
        <text class="companyNameLeft">币种</text>
        <text class="companyNameRight">{{changeCurrency(detail.Currency)}}</text>
      </div>
      <!-- <div class="pick_box sectionFirst_box">
        <text class="companyNameLeft">单位名称</text>
        <text class="companyNameRight">{{detail.CifName}}</text>
      </div> -->
      <div class="pick_box sectionFirst_box">
        <text class="companyNameLeft">客户类型</text>
        <text class="companyNameRight">{{detail.CifType}}</text>
      </div>
      <div class="pick_box sectionFirst_box">
        <text class="companyNameLeft">外币结算账户</text>
        <text class="companyNameRight">{{CardNum(detail.SettleAcNo)}}</text>
      </div>
      <!-- <div class="pick_box sectionFirst_box">
        <text class="companyNameLeft">账户可用余额</text>
        <text class="companyNameRight">{{money(detail.Balance)}}</text>
      </div> -->
      <div class="pick_box sectionFirst_box section_box_noBorder">
        <text class="companyNameLeft">人民币账户</text>
        <text class="companyNameRight">{{CardNum(detail.RmbAcNo)}}</text>
      </div>   
      <div class="wrapper_box"></div>
      <!-- <div class="pick_box sectionSecond_box">
        <text class="companyNameLeft">货物贸易名录类别</text>
        <text class="companyNameRight">{{ detail.CustomLevel}}</text>
      </div> -->
      <div class="pick_box sectionFirst_box">
        <text class="companyNameLeft">结售汇对象</text>
        <text class="companyNameRight">{{exchangeObjectChange(detail.ExchangeOB)}}</text>
      </div>
      <div class="pick_box sectionFirst_box">
        <text class="companyNameLeft">结售汇项目</text>
        <text class="companyNameRight">{{ detail.ExchangePR}}</text>
      </div>
      <div class="pick_box sectionFirst_box">
        <text class="companyNameLeft">结售汇统计代码</text>
        <text class="companyNameRight">{{ detail.StatNo}}</text>
      </div>
      <div class="pick_box sectionFirst_box section_box_noBorder">
        <text class="companyNameLeft">结售汇类型</text>
        <text class="companyNameRight">结汇/{{detail.ExchangePR}}</text>
      </div>     
      <div class="wrapper_box"></div>
      <div class="pick_box sectionSecond_box">
        <text class="companyNameLeft">交易编码</text>
        <text class="companyNameRight textWidth">{{detail.TradingCode}}</text>
      </div>
      <div class="pick_box sectionFirst_box section_box_noBorder">
        <text class="companyNameLeft">交易类型</text>
        <text class="companyNameRight">{{$store.state.OFTENList[detail.TransType]}}</text>
      </div>
      <div class="wrapper_box"></div>
      <div class="pick_box section_box_noBorder">
        <text class="companyNameLeft">结汇金额</text>
        <text class="companyNameRight font_color">{{money(detail.Amount)}}</text>
      </div>
      <div class="wrapper_box"></div>
      <div class="money">
        <text class="companyNameLeft money_text">备注</text>
        <text class="show_remark">{{detail.Remark}}</text>
      </div>     
      <show-botton v-if="showBtn == '0'"></show-botton>
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
  components: { NavBar, showBotton, intiateProgress, Progress },
  data() {
    return {
      title: "",
      JnlNo:"",
      TransCode:"",
      TransStatus: "",
      detail: {},
      showBtn: "",
      remark: "交易款项",
      CheckAuthItemList:[]
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
<style scoped>
.pick_box {
    overflow: hidden;
    width: 714px;
    height: 105px;
    margin-left: 36px;
    padding-right: 27px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #EAEAEA;
}
.wrapper_box {
    width:750px;
    height:20px;
    background-color:rgba(249,249,249,1);
}
.sectionFirst_box {
    height: 95px;
}
.sectionSecond_box {
    height: 101px;
}
.section_box_noBorder{
    border-bottom-width: 0;
}
.companyNameLeft{
    height:30px;
    font-size:30px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:30px;
}
.companyNameRight{
    padding-right: 10px;
    height:30px;
    font-size:30px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:30px;
    /*text-overflow-ellipsis: ellipsis;*/
    lines: 1;
    text-overflow: ellipsis;
}
.textWidth {
    width: 480px;
    text-align: right;
    lines: 1;
    text-overflow: ellipsis;
}
.font_color {
    height:30px;
    font-size:30px;
    font-family:PingFangSC-Semibold,PingFang SC;
    font-weight:600;
    color:rgba(248,124,54,1);
    line-height:30px;
}
.money {
    width: 690px;
    margin-left: 30px;
    padding-top: 30px;
    padding-bottom: 30px;
}
.money_text {
    height:30px;
    font-size:30px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:30px;
}
.show_remark {
    margin-top: 20px;
    font-size:30px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(102,102,102,1);
    line-height:40px;
}

</style>


