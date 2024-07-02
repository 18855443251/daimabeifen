<template>
  <div>
    <nav-bar title="收款方明细"></nav-bar>
    <div class="payeeDetail2">
      <div class="wrapper">
        <div class="wrapper_box">
          <text class="bishu">笔数:</text>
          <text class="bishu bi">{{$store.state.payrollWageDetail.TotalCount}}</text>
        </div>
        <div class="wrapper_box">
          <text class="allmoney">总金额:</text>
          <text class="money">{{moneyFilter($store.state.payrollWageDetail.TotalAmount)}}</text>
        </div>
      </div>
      <div class="text_gray"></div>
      <list class="jilu" :style="{ top: this.getPosiScrollerTop()+108 +'px' }">
        <cell class="jilu_item" v-for="(item,index) in payrollList" :key="index">
          <div class="jilu_item_left">
            <image v-if="BankId" :src="imgdata(BankId)" class="bank_img" />
          </div>
          <div class="jilu_item_right">
            <div class="jilu_item_box_text box1">
              <text
                class="jilu_title"
                :style="{'color':item.flag=='2'?'rgba(230,2,44,1)':'rgba(51,51,51,1)'}"
              >{{item.PayeeAcName}}</text>
              <text class="jilu_amount">¥ {{moneyFilter1(item.Amount)}}</text>
            </div>
            <div class="jilu_item_box_text box2">
              <text class="jilu_desc">{{divieBanks(item.PayeeAcNo)}}</text>
              <text class="jilu_remark">{{item.Remark}}</text>
            </div>
           <div class="jilu_item_box_text box3" v-if="item.Salary==0||item.Salary==1">
              <text class="suc_text">成功</text>
              <text class="suc_desc">{{item.FailReason}}</text>
            </div>
            <div class="jilu_item_box_text box3" v-if="item.Salary==2">
              <text class="fail_text">未发放</text>
              <text class="fail_desc">{{item.FailReason}}</text>
            </div>
             <div class="jilu_item_box_text box3" v-if="item.Salary==4">
              <text class="fail_text">失败</text>
              <text class="fail_desc">{{item.FailReason}}</text>
            </div>
          </div>
        </cell>
         <loading
        @loading="onloading"
        :display="loadinging ? 'show' : 'hide'"
        class="loading"
        v-if="hasMore"
      >
        <text class="indicator-text">{{ pageText }}......</text>
        <loading-indicator class="indicator"></loading-indicator>
      </loading>
      </list>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
const stream = weex.requireModule("stream");
const wjalert = weex.requireModule("weex-alert");
const modal = weex.requireModule("modal");
export default {
  components: { NavBar },
  data() {
    return {
      BankId: "9999",
      payrollList: [],
      pageText:"",
      hasMore:false,
      loadinging:false,
      CurrentIndex: 0, //每次查询从第几条开始，例如一页10条，依次是0,10,20
      CurrentPage: 0, //当前是第几页
      PageSize: "10",
    };
  },
  created() {
    this.payeeDetail2();
  },
  methods: {
     onloading(event) {
      this.loadinging = true;
      if (this.hasMore) {
         this.payeeDetail2();
      }
    },
    payeeDetail2() {
       this.CurrentIndex = this.CurrentPage * this.PageSize;
      this.post(
        "/eweb/AgentSalaryTrsQry.do",
        {
        currentIndex: this.CurrentIndex,
        pageSize: this.PageSize,
          Flag:0,
          // 发放日期
          GrantDate:this.$store.state.payrollWageDetail.GrantDate,
          // 批次号
          BatchNo: this.$store.state.payrollWageDetail.BatchNo
        },
        response => {
          this.payrollList = this.payrollList.concat(
          response.data.List
        );
        this.loadinging = false;
        if (this.payrollList.length < response.data.recordNumber) {
          this.hasMore = true;
          this.pageText = "上拉加载更多数据";
          this.CurrentPage++;
        } else {
          this.pageText = "暂无更多数据";
          this.hasMore = false;
        }
          if(response._RejCode=="999999"){
              wjalert.alert("数据库操作错误","确定",data=>{});
          }
        }
      );
    }
  }
};
</script>
<style scoped>
.payeeDetail2 {
    background-color: rgba(255, 255, 255, 1);
}
.jilu{
  position: fixed;
  bottom:0;
  left: 0;
  right:0;
}
.wrapper {
  height: 88px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  filter: blur(0px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 30px;
  margin-right: 30px;
}
.wrapper_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.bishu {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.bi {
  margin-left: 20px;
}
.allmoney {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.money {
  font-size: 36px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin-left: 20px;
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.jilu_item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
   background-color: rgba(255, 255, 255, 1);
}
.jilu_item_left {
  width: 118px;
  display: flex;
  align-items: center;
  justify-content: center;

}
.jilu_item_right {
  width: 632px;
  filter: blur(0px);
  display: flex;
  justify-content: center;
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
  margin-top: 20px;
}
.box2 {
  margin-top: 10px;
  margin-bottom: 8px;
}
.box3{
  margin-bottom: 20px;
}
.bank_img {
  width: 64px;
  height: 64px;
}
.jilu_title {
   width:220px;
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.jilu_desc {
  width: 370px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.jilu_remark{
  width:212px;
  text-align: right;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.jilu_amount {
width:366px;
text-align: right;
font-size:32px;
font-family:DINAlternate-Bold,DINAlternate;
font-weight:bold;
color:rgba(51,51,51,1);
}
.fail_text{
  width: 80px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(237, 70, 101, 1);
  margin-top: 10px;
}
.fail_desc {
  width: 522px;
  text-align: right;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(237, 70, 101, 1);
  margin-top: 10px;
}
.suc_desc {
  width: 522px;
  text-align: right;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
 color: rgba(124, 124, 124, 1);
  margin-top: 10px;
}
.suc_text{
  width: 80px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
  margin-top: 10px;
}
.loading {
    width: 750px;
    height: 100px;
    align-items: center;
    justify-content: center;
    /* margin-top: 40px !important; */
  }
  .indicator-text {
   color: #888888;
  font-size: 30px;
  text-align: center;
  }
  /* .indicator {
    margin-top: 16px;
    height: 40px;
    width: 40px;
    color: blue;
  } */
</style>


