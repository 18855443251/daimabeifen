<template>
    <div>
      <navBar :title="title"></navBar>
      <scroller>
            <intiate-progress v-if="showBtn == '0'"></intiate-progress>
            <progress v-if="showBtn == '1'"></progress>
            <div style="padding-left: 30px;">
                  <div class="everySingle">
                      <text class="leftText">购买支票账号</text>
                      <text class="rightText">{{detail.PayerAcNo}}</text>
                  </div>
                  <div class="everySingle">
                      <text class="leftText">账户名称</text>
                      <text class="rightText">{{detail.PayerAcName}}</text>
                  </div>
                  <div class="everySingle">
                      <text class="leftText">支票种类</text>
                      <text class="rightText">{{CheckKind(detail.CheckKind)}}</text>
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
            </div>
            <div class="kong"></div>
            <div style="padding-left: 30px;">
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
            <div style="padding-left: 30px;" v-if="detail.Opr2Nm">
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
      rightArrowSrc: "",
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
    //查看可领取支票网点地址
    gotoNetAddress(){
        context.launchStage("main.buyCheckNet");
    },
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
.kong{
  width: 750px;
  height: 20px;
  background-color: rgb(249,249,249);
}
</style>