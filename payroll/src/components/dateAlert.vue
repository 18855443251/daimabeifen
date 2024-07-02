<template>
  <div>
    <div
      class="alert"
      v-if="$store.state.isshowDate"
      :style="{ top: this.getPosiScrollerTop() + 170 + 'px' }"
      @click="prevent"
    >
      <div class="alert_content">
        <div class="alert_header">
          <div class="alert_header_box">
            <text class="alert_title">代发日期</text>
            <text class="alert_desc"
              >&nbsp;&nbsp;&nbsp;&nbsp;({{
                startDate
              }}&nbsp;&nbsp;-&nbsp;&nbsp;{{ endDate }})</text
            >
          </div>
          <div class="alert_box">
            <text
              v-for="(item, index) in dateList"
              @click="changeDate(index)"
              :class="[index == changeBackground ? 'text_color' : 'alert_btn']"
              :key="index"
              >{{ item.date }}</text
            >
          </div>
          <div class="alert_box1" v-if="showPickerDate">
            <text class="date_btn" @click="pickerStartDate">{{
              startDate
            }}</text>
            <text class="xian">—</text>
            <text class="date_btn" @click="pickerEndDate">{{ endDate }}</text>
          </div>
        </div>
        <div class="alert_footer">
          <text class="text_btn" @click="reset">重置</text>
          <text class="comfirm" @click="comfirm">确定</text>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const pickerCalendar = weex.requireModule("picker");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  data() {
    return {
      dateList: [
        { date: "本月", value: "1M" },
        { date: "近七天", value: "7D" },
        { date: "近三个月", value: "3M" },
        { date: "当天", value: "0" },
        { date: "自定义", value: "10" }
      ],
      // 默认选中近三个月
      changeBackground: 2,
      // 开始日期
      startDate: "请输入开始日期",
      // 结束日期
      endDate: "请输入结束日期",
      showPickerDate: false,
      // 默认三个月
      TimeFlag: "3M",
      // 最小日期
      minDate: "",
      // 最大日期
      maxDate: "",
    };
  },
  created() {
    var reg2 = new RegExp("/", "gm");
    // 默认查询近三个月的日期
    this.startDate = this.calcDate(this.TimeFlag);
    // 当前电脑时间
    this.endDate = this.getNowFormatDate("/");
    // 获取一年之前的日期,正好那一天不算
    var oldDate = this.calcDate("12M").replace(reg2, "-");
    var date = new Date(oldDate);
    // 获取一年前的后一天的日期
　　date = +date +1000 * 60 * 60 * 24;
　　date = new Date(date);
    var seperator1 = "-";
    var year = date.getFullYear();//年
    var month = date.getMonth() + 1;//月
    var strDate = date.getDate(); //日
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    this.minDate = year + seperator1 + month + seperator1 + strDate;
    // 当前时间
    this.maxDate = this.getNowFormatDate("/").replace(reg2, "-");
  },
  methods: {
    changeDate(index) {
      this.changeBackground = index;
      this.$store.state.dayNumber = this.dateList[index].date;
      this.TimeFlag = this.dateList[index].value;
      // 不是自定义和本月
      if (this.TimeFlag != "10") {
        if (this.TimeFlag != "1M") {
          this.startDate = this.calcDate(this.TimeFlag);
          this.endDate = this.getNowFormatDate("/");
        } else {
          //本月
          this.startDate = this.getFirstDate(); //本月第一天
          this.endDate = this.getNowFormatDate("/");
        }
        this.showPickerDate = false;
      }
      // 是自定义
      if (this.TimeFlag == "10") {
        this.showPickerDate = true;
      }
    },
    pickerStartDate() {
      pickerCalendar.pickDate(
        {
          value: this.startDate,
          min: this.minDate,
          max: this.maxDate
        },
        event => {
          if (event.result === "success") {
            this.TimeFlag = "3M";
            //自定义日期控件的日期是-形式，页面显示要用/
            this.startDate = event.data;
            var reg = new RegExp("-", "gm");
            this.startDate = event.data.replace(reg, "/");
          }
        }
      );
    },
    pickerEndDate() {
      pickerCalendar.pickDate(
        {
          value: this.endDate,
          min: this.minDate,
          max: this.maxDate
        },
        event => {
          if (event.result === "success") {
            this.TimeFlag = "3M";
            this.endDate = event.data;
            var reg = new RegExp("-", "gm");
            this.endDate = event.data.replace(reg, "/");
          }
        }
      );
    },
    comfirm() {
       var reg2 = new RegExp("/", "gm");
      if (this.endDate < this.startDate) {
        wjalert.alert("开始日期不能大于结束日期", "确定", data => {});
        return;
      } else {
        var params = {
          // CurrentIndex: 0,
          BeginDate: this.startDate.replace(reg2, "-"),
          EndDate: this.endDate.replace(reg2, "-"),
          QryType: "0"
        };
        this.$emit("WorkList", params);
         this.$store.state.isshowDate=false;
      }
    },
    // 重置为近三个月
    reset() {
      this.TimeFlag = "3M";
      this.startDate = this.calcDate(this.TimeFlag);
      this.endDate = this.getNowFormatDate("/");
      this.changeBackground = 2;
       this.showPickerDate = false;
    },
      prevent(event){
        event.stopPropagation();
    },
  }
};
</script>
<style scoped>
.alert {
  position: fixed;
  left: 0;
  right: 0;
  bottom:0;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 1;
}
.alert_content {
  height: 815px;
  background-color: rgba(255, 255, 255, 1);
}
.alert_header {
  height: 600px;
}
.alert_header_box{
  display: flex;
  align-items: center;
  flex-direction: row;
   margin-top: 60px;
  margin-left: 30px;
}
.alert_box {
  width: 750px;
  padding-left: 30px;
  padding-right: 30px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 20px;
}
.alert_btn {
  width: 200px;
  height: 64px;
   margin-right:29px;
   margin-top: 30px;
  background-color: rgba(248, 248, 247, 1);
  border-radius: 4px;
  line-height: 64px;
  text-align: center;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.alert_desc{
font-size:28px;
font-family:PingFang-SC-Medium,PingFang-SC;
font-weight:500;
color:rgba(170,170,170,1);
}
.alert_box1{
  height: 100px;
  padding-left: 30px;
  padding-right: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 80px;
}
.alert_title {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.date_btn {
  width: 312px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border-width: 1px;
  border-color: rgba(221, 221, 221, 1);
  border-radius: 4px;
  font-size:28px;
font-family:PingFang-SC-Medium,PingFang-SC;
font-weight:500;
color:rgba(170,170,170,1);
}
.alert_footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 127px;
}
.text_btn {
  width: 375px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  background-color: rgba(248, 248, 247, 1);
}
.comfirm {
  width: 375px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
}
.text_color {
    /* 148 */
  width: 200px;
  height: 64px;
  line-height: 64px;
   margin-right:29px;
   margin-top: 30px;
  text-align: center;
  border-radius: 4px;
  border-width: 1px;
  border-color: rgba(230, 2, 44, 1);
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(230, 2, 44, 1);
}
.xian{
  font-size:28px;
font-family:PingFang-SC-Medium,PingFang-SC;
font-weight:500;
color:rgba(170,170,170,1);
}
</style>
