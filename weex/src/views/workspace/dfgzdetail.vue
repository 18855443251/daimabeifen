<template>
  <div class="home">
    <NavBar :title="title"></NavBar>
    <scroller>
      <div class="container">
        <intiate-progress v-if="showBtn == '0'"></intiate-progress>
        <progress v-if="showBtn == '1'"></progress>
        <div class="totalamt">
          <text class="amt">¥{{ money(detail.Amount) }}</text>
          <text>{{ changeMoneyToChinese(detail.Amount) }}</text>
        </div>
        <div class="content_box">
          <div class="content_details content_details_title">
            <div class="detail_title">
              <image class="firstImg" :src="shouImg"></image>
            </div>
            <text class="detail_info">收款方信息</text>
          </div>
          <div class="content_details margin32">
            <text class="info">发放日期：</text>
            <text class="info_right">{{ detail.GrantDate }}</text>
          </div>
          <div class="content_details margin32">
            <text class="info">总笔数：</text>
            <text class="info_right">{{ detail.TotalCount }}</text>
          </div>
          <div class="content_details margin32">
            <text class="info">总金额：</text>
            <text class="info_right">¥{{ money(detail.Amount) }}</text>
          </div>
          <div class="payee_box">
            <text class="payee_mingxi" @click="payeeDetail">收款方明细</text>
          </div>
        </div>
        <div class="content_box">
          <div class="content_details content_details_title">
            <div class="detail_title">
              <image class="firstImg" :src="fuImg"></image>
            </div>
            <text class="detail_info">付款方信息</text>
          </div>
          <div class="content_details margin32">
            <text class="info">名称：</text> 
            <text class="info_right" style="width:500px;">{{ellipsis(detail.SalaryName) || '/'}}</text>
          </div>
          <div class="content_details margin32">
            <text class="info">账号：</text>
            <text class="info_right">{{ divieBanks(detail.PayerAcNo) }}</text>
          </div>
        </div>
      </div>
      <show-botton v-if="showBtn == '0'"></show-botton>
    </scroller>
  </div>
</template>
<style scoped>
.white {
  color: #ffffff;
}
.red {
  color: #e6022c;
}
.font32 {
  font-size: 32px;
}
.info_right {
  text-align: right;
  font-size: 30px;
  color: #666;
}
.footer {
  background-color: #ffffff;
  position: fixed;
  bottom: 10px;
  flex-direction: row;
  height: 90px;
  width: 750px;
}
.left_button {
  width: 325px;
  border-width: 2px;
  border-style: solid;
  border-color: #e6022c;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-left: 30px;
}
.right_button {
  margin-left: 40px;
  width: 325px;
  background-image: linear-gradient(
    to right,
    rgb(251, 93, 122),
    rgb(230, 2, 44)
  );
  border-radius: 12px;
  align-items: center;
  justify-content: center;
}
.payee_mingxi {
  margin-left: 32px;
  margin-bottom: 20px;
  font-size: 30px;
  color: #4b95fa;
}
.info {
  font-size: 30px;
  color: #333;
}
.detail_info {
  color: #222222;
  font-size: 32px;
  font-weight: bold;
  margin-left: 32px;
}
.detail_type {
  color: #ffffff;
  font-size: 28px;
  font-weight: bold;
}
.detail_title {
  margin-left: 30px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}
.amt {
  font-size: 42px;
  font-weight: bold;
}
.totalamt {
  height: 150px;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
.transname {
  font-size: 20px;
  color: #999999;
}
.transdate1 {
  align-items: center;
}
.transdate2 {
  align-items: center;
  margin-right: 240px;
}
.transstep {
  color: #4a89fc;
  font-size: 24px;
  text-align: center;
}
.transstep2 {
  margin-left: 60px;
}
.transgray {
  margin-left: 20px;
  color: #9c9c9c;
  font-size: 24px;
  text-align: center;
}
.trans {
  align-items: center;
}
.space {
  width: 150px;
  height: 1px;
  background-color: black;
}
.transbut {
  width: 80px;
  height: 80px;
  background-color: #999999;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
}
.transresult {
  width: 550px;
  margin-top: 10px;
  margin-left: 100px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}

.firstImg {
  width: 48px;
  height: 48px;
}
.sapnImg {
  width: 154px;
  height: 2px;
}
.transresult1 {
  width: 750px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.progress {
  height: 180px;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
}
.list_money {
  color: rgb(102, 102, 102);
  font-size: 26px;
  line-height: 26px;
  margin-right: 35px;
}
.list_title {
  color: rgb(102, 102, 102);
  font-size: 26px;
  line-height: 26px;
  margin-left: 30px;
}
.card_list {
  flex-direction: row;
  justify-content: space-between;
  width: 750px;
  height: 26px;
}
.content_box {
  width: 690px;
  margin-top: 20px;
  margin-left: 30px;
  border-width: 1px;
  border-color: rgb(245, 245, 245);
  border-style: solid;
  border-radius: 12px;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
}
.content_details {
  flex-direction: row;
  /* height: 70px; */
  line-height: 70px;
  margin-bottom: 15px;
  /* align-items: center; */
}
.content_details_title {
  margin-top: 20px;
}
.margin32 {
  flex-direction: row;
  justify-content: space-between;
  margin-left: 32px;
  margin-right: 32px;
}
.home {
  width: 750px;
}
.container {
  width: 750px;
}
.p {
  height: 120px;
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
import showBotton from "@/components/tab_bench/showBotton.vue";
import intiateProgress from "@/components/tab_bench/intiateProgress.vue";
import Progress from "@/components/tab_bench/progress.vue";
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");

export default {
  components: {
    NavBar,
    intiateProgress,
    Progress,
    showBotton
  },
  data() {
    return {
      title: "代发工资",
      BgColor: "rgb(64,64,64)",
      FontColor: "#ffffff",
      useDefaultReturn: false,
      JnlNo: "",
      TransCode: "",
      TransStatus: "",
      detail: {},
      showBtn: "",
      firstImg: "./imgs/tab_bench/blue1@3x.png",
      secondImg: "./imgs/tab_bench/blue2@3x.png",
      thirdImg: "./imgs/tab_bench/gray3@3x.png",
      firstsapnImg: "./imgs/tab_bench/bluespan@3x.png",
      secondsapnImg: "./imgs/tab_bench/grayspan@3x.png",
      fuImg: "./imgs/tab_bench/fu.png",
      shouImg: "./imgs/tab_bench/shou.png",
      qiImg: "./imgs/tab_bench/qi.png",
      // AuthStep表示审核的先后顺序
      // AuthState   0：未审核  1：已审核
      // UserGrpId  审核员级别 
    };
  },
  created() {
        this.TransStatus=context.sessionGetString("TransStatus");
        this.title=context.sessionGetString("TransName");
        this.JnlNo=context.sessionGetString("JnlNo");
        this.TransCode=context.sessionGetString("TransCode");
        this.showBtn=context.sessionGetString("showBtn");
        if (this.showBtn == "0") {
          this.getCheckDetail();
        } else if (this.showBtn == "1") {
          this.getDetail();
        }
  },
  methods: {
    //请求我发起的和我处理的详情信息
    getDetail() {
      this.$store.state.CheckAuthItemList=[];
      this.goJson("/eweb/AuthEjnlDetail.do", {
          TransCode: this.TransCode,
          JnlNo: this.JnlNo
      }, response => {
        this.detail = response.data.EjnlList[0];
        
        this.$store.state.payrollEntry = response.data.EjnlList[0].List;
        this.$store.state.CheckAuthItemList=this.$store.state.CheckAuthItemList.concat(response.data.EjnlList[0]._AuthItemList);
      })
    },
    //请求待审核的交易详情
    getCheckDetail(){
        this.$store.state.CheckAuthItemList=[];
        this.goJson("/eweb/AuthDetailQuery.do", {
            TransCode:this.TransCode,
            _AuthJnlNo:this.JnlNo
        }, response => {
          this.detail = response.data.EjnlList[0];
          this.$store.state.payrollEntry = response.data.EjnlList[0].List;
          this.$store.state.CheckAuthItemList=this.$store.state.CheckAuthItemList.concat(response.data.EjnlList[0]._AuthItemList);
      });
    },
    //收款人明细
    payeeDetail() {
      this.jump("/payeeDetail");
    }
  }
};
</script>
