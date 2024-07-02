<template>
  <div>
    <div class="section">
      <text class="section_title"
        >{{ queryDate($store.state.dayNumber) }}代发工资查询结果</text
      >
      <image :src="queryImg" class="query_img" @click="query" />
    </div>
    <div
        class="section_bottom"
         :style="{ top: this.getPosiScrollerTop() + 170 + 'px' }"
      >
        <div class="section_box"  v-if="isShowImg"> 
          <image :src="dataImg" class="data_img" />
          <text class="section_desc">暂无数据</text>
        </div>
      </div>
    <list
      v-if="payrollWageQueryHome.length>0"
      class="wage"
      :style="{ top: this.getPosiScrollerTop() + 170 + 'px' }"
    >
      <cell
        v-for="(item, index) in payrollWageQueryHome"
        :key="index"
        class="item"
        @click="payrollWageDetail(item)"
      >
       <div class="item_box">
          <div class="wage_item_box box1">
          <text class="BatchNo">{{ item.BatchNo }}</text>
          <text class="TotalAmount">¥{{ moneyFilter1(item.TotalAmount) }}</text>
        </div>
        <div class="wage_item_box box2">
          <div class="money_box">
            <text class="TotalCount">共{{ item.TotalCount }}笔/</text>
            <text class="success">成功{{ item.SuccessCount }}笔</text>
          </div>
          <image :src="arrowImg" class="arrow_img" />
        </div>
        <div class="date">
          <text class="date_text">发放日期:</text>
          <text class="date_text GrantDate">{{
            dealTime3(item.GrantDate)
          }}</text>
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
    <datealert @WorkList="change($event)"></datealert>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
import datealert from "../../../components/dateAlert.vue";
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: { NavBar, datealert },
  data() {
    return {
      queryImg: this.$store.state.imgBaseUrl + "20.png",
      arrowImg: this.$store.state.imgBaseUrl + "25.png",
       dataImg: this.$store.state.imgBaseUrl + "sad@3x.png",
      // 上拉加载的时候是否显示重新加载文字
      pageText: "",
      // 控制上拉加载的显示
      hasMore: false,
      loadinging: false,
     //每次查询从第几条开始，例如一页10条，依次是0,10,20
      CurrentIndex: 0,
     //当前是第几页
      CurrentPage: 0, 
      // 每页10条数据
      PageSize: "10",
      // 开始日期
      startDate: "请输入开始日期",
      // 结束日期
      endDate: "请输入结束日期",
      // 三个月
      TimeFlag: "3M",
      conditionParams: "",
      payrollWageQueryHome: [],
      isShowImg:false
    };
  },
  created() {
    this.$store.state.dayNumber = "近三个月";
    // 日期控件隐藏
    this.$store.state.isshowDate = false;
    // 默认从第一条数据查起
    this.CurrentIndex = 0;
    // 开始日期是近三个月
    this.startDate = this.calcDate(this.TimeFlag);
    // 当前日期
    this.endDate = this.getNowFormatDate("/");
    this.getSalary();
  },
  methods: {
    // 获取子组件传来的数据
    change(data) {
      this.loadinging = false;
      this.hasMore = false;
      this.CurrentPage = 0; //按条件查询时将当前页清0
      this.payrollWageQueryHome = [];
      this.conditionParams = data;
      this.getSalary(data);
    },
    // 一开始conditionParams为空
    getSalary(conditionParams) {
      // 从第一条查起
      this.CurrentIndex = this.CurrentPage * this.PageSize;
      var reg2 = new RegExp("/", "gm");
      var params = {
        currentIndex: this.CurrentIndex,
        pageSize: this.PageSize,
        BeginDate: this.startDate.replace(reg2, "-"),
        EndDate: this.endDate.replace(reg2, "-"),
        QryType: "0"
      };
      // 只用使用日期控件conditionParams才会不为空，使用日期控件之后，开始日期和结束日期会改变，也就是params会改变
      if (conditionParams) {
        Object.assign(params, conditionParams);
      }
      this.post("/eweb/AgentSalaryQry.do", params, response => {
        this.payrollWageQueryHome = this.payrollWageQueryHome.concat(
          response.data.List
        );
          if (this.payrollWageQueryHome.length>0) {
           this.isShowImg = false;
          } else {
            this.isShowImg = true;
          }
        this.loadinging = false;
        if (this.payrollWageQueryHome.length < response.data.recordNumber) {
          this.hasMore = true;
          this.pageText = "上拉加载更多数据";
          this.CurrentPage++;
        } else {
          this.hasMore = false;
          this.pageText = "暂无更多数据";
        }
      });
    },
    onloading(event) {
      this.loadinging = true;
      if (this.hasMore) {
        if (this.conditionParams) {
          this.getSalary(this.conditionParams);
        } else {
          this.getSalary();
        }
      }
    },
    // 查看收款人明细
    payrollWageDetail(item) {
      this.$store.state.payrollWageDetail = item;
      this.jump("/payrollWageDetail");
    },
    // 日期弹框展示
    query() {
      this.$store.state.isshowDate = !this.$store.state.isshowDate;
      this.isShowImg = false;
    }
  }
};
</script>
<style scoped>
.section {
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: rgba(221, 221, 221, 1);
  padding-left: 30px;
  padding-right: 30px;
}
.section_title {
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.query_img {
  width: 30px;
  height: 30px;
}
.money_box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.success {
  font-size: 24px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-left: 17px;
}
.wage{
  /* width: 750px; */
  position: fixed;
  bottom:0;
  left: 0;
  right:0; 
}
.wage_item_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.item {
  height: 200px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  filter: blur(0px);
  background-color: rgba(255, 255, 255, 1);
}
.item_box{
padding-left: 30px;
padding-right: 30px;
}
.box1 {
  margin-top: 31px;
}
.box2 {
  margin-top: 18px;
}
.arrow_img {
  width: 14px;
  height: 24px;
}
.date {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 18px;
}
.date_text {
  font-size: 24px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(156, 156, 156, 1);
}
.TotalAmount {
  font-size: 32px;
  font-family: DIN-Medium, DIN;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-right: 70px;
}
.GrantDate {
  margin-left: 10px;
}
.BatchNo {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.TotalCount {
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
  .section_bottom{
  position: fixed;
  bottom:0;
  left: 0;
  right:0; 
  display: flex;
  align-items: center;
  justify-content: center;
  }
  .section_box{
 display: flex;
  align-items: center;
  justify-content: center;
  }
  .data_img{
  width: 220px;
  height: 220px;
}
.section_desc{
  /* margin-top: 20px; */
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
</style>
