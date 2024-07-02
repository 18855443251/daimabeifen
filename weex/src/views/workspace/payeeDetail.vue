<template>
  <div>
    <nav-bar title="收款方明细"></nav-bar>
    <scroller @loadmore="loadmore" loadmoreoffset=1 style="background-color:#fff;">
      <div class="jilu_item" v-for="(item,index) in payeeList" :key="index">
        <div class="jilu_item_left">
          <image :src="newBankImg" class="bank_img" />
        </div>
        <div class="jilu_item_right">
          <div class="jilu_item_box_text box1">
            <text class="jilu_title">{{ellipsis(item.PayeeAcName,10)}}</text>
              <!-- :style="{'color':item.flag=='2'?'rgba(230,2,44,1)':'rgba(51,51,51,1)'}" -->
            <text class="jilu_amount">¥ {{moneyFilter(item.Amount)}}</text>
          </div>
          <div class="jilu_item_box_text box2">
            <text class="jilu_desc">{{divieBanks(item.PayeeAcNo)}}</text>
            <text class="jilu_desc">{{ellipsis(item.Remark,8)}}</text>
          </div>
        </div>
      </div>
      <text class="moreText">{{pageText}}</text>
    </scroller>
  </div>
</template>
<script>
import NavBar from "@/components/templet/titlebar";
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
export default {
  components: { NavBar },
  data() {
    return {
      newBankImg: "./imgs/314.png",//   银行logo
      hasMore:true,
      showBtn:'',
      JnlNo:'',
      TransCode:'',
      CurrentPage:0,
      RecordNumberDetail:'',//总笔数
      currentIndexDetail:0,//当前查询数据下标
      PageSize:20,//20页
      payeeList: [
        // {PayeeAcName:"的司法鉴的司法鉴定的司法鉴定的司法鉴定定",Amount:100,PayeeAcNo:'516561561611615',Remark:'范德萨发生'},
      ],
      pageText:''
    };
  }, 
  mounted() {
    // this.payeeList = this.$store.state.payrollEntry;
    this.showBtn=context.sessionGetString("showBtn");
    this.JnlNo=context.sessionGetString("JnlNo");
    this.TransCode=context.sessionGetString("TransCode");
    this.getAuthPayeeList();
  },
  methods:{
    loadmore(){
      if(this.hasMore){
        this.getAuthPayeeList();
      }
    },
    //我发起的，我处理的分页查询代发工资收款人明细列表
    getAuthPayeeList(){
        this.currentIndexDetail=this.CurrentPage*this.PageSize;
        //服务需要上送的字段
        var params = {
            TransCode: this.TransCode,
            JnlState:"0",
            JnlNo: this.JnlNo,
            RecordNumberDetail:this.RecordNumberDetail,
            CurrentIndexDetail:this.currentIndexDetail,
            PageSize:this.PageSize
        };
        this.goJson("/eweb/AuthDetailList.do", params, response => {
            this.payeeList=this.payeeList.concat(response.data.List);
            this.RecordNumberDetail=response.data.RecordNumberDetail;
            if (this.payeeList.length <response.data.RecordNumber) {
                this.pageText="上拉加载更多数据……";
                this.CurrentPage++;
            } else {
                this.pageText="暂无更多数据";
                this.hasMore = false;
            }
        });
    },
  }
};
</script>
<style scoped>
.moreText{
    width: 750px;
    height: 40px;
    font-size: 26px;
    text-align: center;
}
.payeeDetail {
  background-color: rgba(255, 255, 255, 1);
}
.jilu_item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .jilu_item_left {
    width: 118px;
    height: 142px;
    display: flex;
    align-items: center;
    justify-content: center;
   
  }
  .jilu_item_right {
    width: 632px;
    height: 142px;
    display: flex;
    /* justify-content: center; */
    border-bottom-width: 1px;
    border-bottom-color: rgba(234, 234, 234, 1);
    padding-right: 30px;
   
  }
  .jilu_item_box_text {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
.box1{
margin-top: 32px;
}
.box2 {
  margin-top: 20px;
}
  .bank_img {
    width: 64px;
    height: 64px;
  }
  .jilu_title {
    font-size: 30px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }
  .jilu_desc {
    font-size: 26px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: rgba(124, 124, 124, 1);
  }
  .jilu_amount {
    font-size: 32px;
    font-family: DIN-Medium, DIN;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }
</style>


