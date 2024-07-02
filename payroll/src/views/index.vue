<template>
  <div>
    <nav-bar title="代发工资"></nav-bar>
    <div class="payrollCreditHome">
      <div class="wrapper">
        <div class="wrapper_contet" @click="payrollEntry">
          <image :src="daifaImg" class="daifa_img" />
          <div class="wrapper_box">
            <text class="text_title">代发工资</text>
            <text class="text_desc">支持EXCEL导入/手动导入/代发名册添加</text>
          </div>
          <image :src="arrowImg" class="arrow_img" />
        </div>
      </div>
      <div class="payroll">
        <div class="payroll_box" @click="myquery">
          <image :src="gongziImg" class="gongzi_img" />
          <text class="payroll_title">代发工资查询</text>
        </div>
        <div class="payroll_box xian"></div>
        <div class="payroll_box" @click="myPayrollRegister">
          <image :src="mingceImg" class="gongzi_img" />
          <text class="payroll_title">代发名册</text>
        </div>
      </div>
      <div class="text_gray"></div>
      <text class="text_jilu">最近代发记录</text>
      <div
        class="section_bottom"
        :style="{ top: this.getPosiScrollerTop() + 426 + 'px' }"
      >
        <div v-if="isShowImg" class="section">
          <image :src="dataImg" class="data_img" />
          <text class="section_desc">暂无数据</text>
        </div>
      </div>
      <list
        class="jilu"
        v-if="payrollList.length>0"
        :style="{ top: this.getPosiScrollerTop() + 426 + 'px' }"
      >
        <cell
          class="jilu_item"
          v-for="(item, index) in payrollList"
          :key="index"
          @click="queryRecord"
        >
            <div class="jilu_item_left">
            <image :src="jiluImg" class="bank_img" />
          </div>
          <div class="jilu_item_right">
            <div class="jilu_item_box_text box1">
              <text class="jilu_title">{{ item.TotalCount }}笔</text>
              <text class="jilu_money"
                >¥ {{ moneyFilter1(item.TotalAmount) }}</text
              >
            </div>
            <div class="jilu_item_box_text box2">
              <text class="jilu_date">{{ dealTime3(item.GrantDate) }}</text>
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
import NavBar from "../components/titlebar_component.vue";
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");
const uploadFile = weex.requireModule("weex-UploadFile");
export default {
  components: { NavBar },
  data() {
    return {
      daifaImg: this.$store.state.imgBaseUrl + "4.png",
      arrowImg: this.$store.state.imgBaseUrl + "26.png",
      gongziImg: this.$store.state.imgBaseUrl + "6.png",
      mingceImg: this.$store.state.imgBaseUrl + "7.png",
      jiluImg: this.$store.state.imgBaseUrl + "8.png",
      dataImg: this.$store.state.imgBaseUrl + "sad@3x.png",
      isShowImg: false,
      payrollList: [],
      pageText:"",
      TimeFlag: "3M",
      hasMore:false,
      loadinging:false,
      CurrentIndex: 0, //每次查询从第几条开始，例如一页10条，依次是0,10,20
      CurrentPage: 0, //当前是第几页
      PageSize: "10",
      startDate: "",
      // 结束日期
      endDate: "",
    };
  },
  created() {
    // 用于代发录入页数组去重，从另一个页面新增收款人，修改收款人，跳到代发录入页需要去重
      this.$store.state.AcNo1="";
      this.$store.state.AcName1="";
      this.$store.state.AvailBal="";
      this.$store.state.isDaoruShow=false;
      this.$store.state.isFailClose = false;
      this.$store.state.promptShow=false;
      this.$store.state.isDaoruReset=false;
      this.$store.state.excelList=[];
      this.$store.state.payrollEntry=[];
      this.startDate = this.calcDate(this.TimeFlag);
      this.endDate = this.getNowFormatDate("/");
       uploadFile.getExcel(data=>{
      if(data == "true"){
        this.jump("/payrollEntry");
      }else{
          this.getSalary();    
      }
    })
  },
  methods: {
      onloading(event) {
      this.loadinging = true;
      if (this.hasMore) {
         this.getSalary();
      }
    },
     getSalary() {
      this.CurrentIndex = this.CurrentPage * this.PageSize;
       var reg2 = new RegExp("/", "gm");
      var params = {
        currentIndex: this.CurrentIndex,
        pageSize: this.PageSize,
        BeginDate: this.startDate.replace(reg2, "-"),
        EndDate: this.endDate.replace(reg2, "-"),
        QryType: "0",
      };
      this.post("/eweb/AgentSalaryQry.do", params, response => {
        this.payrollList = this.payrollList.concat(
          response.data.List
        );
           if (this.payrollList.length >0) {
            this.isShowImg = false;
          } else {
            this.isShowImg =true;
          }
         this.loadinging = false;
        if (this.payrollList.length < response.data.recordNumber) {
          this.hasMore = true;
          this.pageText = "上拉加载更多数据";
          this.CurrentPage++;
        } else {
          this.pageText = "暂无更多数据";
          this.hasMore = false;
        }
      });
    },
    payrollEntry() {
      this.jump("/payrollEntry");
    },
    myquery() {
      this.jump("/myquery");
    },
    myPayrollRegister() {
      this.jump("/myPayrollRegister");
    },
    queryRecord(){
      this.jump("/myquery");
    }
  }
};
</script>
<style scoped>
.payrollCreditHome {
  background-color: rgba(255, 255, 255, 1);
}
.wrapper {
  padding-left: 30px;
  padding-right: 30px;
}
.wrapper_contet{
  height: 178px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  border-radius: 12px;
  margin-top: 20px;
}
.daifa_img {
  width: 64px;
  height: 64px;
  margin-left: 47px;
}
.text_title {
  font-size: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
}
.text_desc {
  font-size: 24px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  margin-top: 18px;
}
.arrow_img {
  width: 18px;
  height: 32px;
  margin-right: 49px;
}
.payroll {
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  padding-left: 70px;
  padding-right: 100px;
}
.payroll_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.xian {
  width: 1px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border-color: rgba(234, 234, 234, 1);
  background-color: rgba(234, 234, 234, 1);
}
.gongzi_img {
  width: 36px;
  height: 36px;
  margin-right: 20px;
}
.payroll_title {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.jilu{
  position: fixed;
  bottom:0;
  left: 0;
  right:0;
}
.text_jilu {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  height: 88px;
  line-height: 88px;
  padding-left: 40px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
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
}
.jilu_item_left {
  width: 106px;
  height: 142px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.jilu_item_right {
  width: 644px;
  height: 142px;
  filter: blur(0px);
  display: flex;
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
.bank_img {
  width: 56px;
  height: 56px;
}
.jilu_money {
  font-size: 32px;
  font-family: DIN-Medium, DIN;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.jilu_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.jilu_date {
  font-size: 24px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(156, 156, 156, 1);
}
.jilu_desc {
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(156, 156, 156, 1);
}
.box1 {
  margin-top: 30px;
}
.box2 {
  margin-top: 14px;
}
.data_img{
  width: 220px;
  height: 220px;
}
.section_bottom{
  position: fixed;
  left:0;
  right:0;
  bottom:0;
  display: flex;
  align-items: center;
  justify-content: center;
  }
.section{
  display: flex;
  align-items: center;
  justify-content: center;
}
.section_desc{
  /* margin-top: 20px; */
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
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
