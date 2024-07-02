<template>
  <div>
    <nav-bar title="分组详情"></nav-bar>
    <div class="groupsDetai">
      <div class="section">
        <text class="group_title">分组名称</text>
        <text class="group_name">{{ $store.state.UGroupName }}</text>
      </div>
      <div class="group">
        <text class="group_memer"
          >组内成员&nbsp;&nbsp;{{meberNum}}人</text
        >
      </div>
      <list class="info" :style="{ top: this.getPosiScrollerTop()+180 +'px' }">
        <cell>
          <div
            v-for="(item, index) in $store.state.groupsDetail"
            :key="index"
            class="info_item"
          >
            <div class="item_box">
              <div class="item_box_text">
                <div @click="select(index)">
                  <image
                    :src="selectImg"
                    class="start_img"
                    v-if="item.select == true"
                  />
                  <image
                    :src="noSelectImg"
                    class="start_img"
                    v-if="item.select == false"
                  />
                </div>
                <text class="info_item_box_title">{{ellipsis(item.AcName,13)}}</text>
              </div>
              <div class="edit" @click="openExplain(item)">
                <text class="text_state1">{{ ellipsis(item.Remark,5) }}</text>
                <image :src="editImg" class="edit_img" />
              </div>
            </div>
            <div class="item_box_right">
              <text class="text_state">{{ divieBanks(item.AcNo) }}</text>
              <div class="money">
                <div class="money_box">
                  <text>¥</text>
                   <price-input @onChange="inputMoney"  @input="Amtlimit(index)" :stringRegex="stringRegex" :textValue="$store.state.groupsDetail[index].Amount"  placeholder="请输入代发金额" class="money_text"  type="number" isTS = "true" ></price-input> 
                </div> 
                 <text class="bigMoney" v-if="item.Amount >= 1000">|{{
                  changeAmountUnit(item.Amount)
                }}</text>
              </div>
            </div>
          </div>
        </cell>
      </list>
     <div class="section_bottom">
        <div class="text_gray"></div>
      <div class="select">
        <div class="select_left">
          <div @click="checkAll">
            <image :src="selectImg" class="start_img" v-if="check1 == true" />
            <image
              :src="noSelectImg"
              class="start_img"
              v-if="check1 == false"
            />
          </div>
          <text class="allselect">全选</text>
        </div>
        <div class="select_box">
          <text class="hasselect">已选</text>
          <text class="select_desc"
            >{{groupsDetailNumber}}/{{ totalNumber }}</text
          >
        </div>
      </div>
      <div class="next" @click="confirm">
        <text class="next_btn">确认</text>
      </div>
     </div>
      <remark></remark>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
import remark from "../../../components/remark.vue";
import { WxcMask } from "weex-ui";
import { WxcPopup } from "weex-ui";
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
const stream = weex.requireModule("stream");
export default {
  components: { NavBar, WxcPopup, WxcMask, remark },
  data() {
    return {
      xImg: this.$store.state.imgBaseUrl + "19.png",
      selectImg: this.$store.state.imgBaseUrl + "16.png",
      noSelectImg: this.$store.state.imgBaseUrl + "15.png",
      editImg: this.$store.state.imgBaseUrl + "22.png",
      // 全选
      check1: false,
      // 金额
      Amount:"",
      // 至少选择一条
      hasSelected:false,
      stringRegex:"^(([0]|(0[.]\\d{0,2}))|([1-9]\\d{0,12}(([.]\\d{0,2})?)))?$",
    };
  },
  computed: {
     meberNum() {
      var meberSum=0;
      meberSum=this.$store.state.groupsDetail.length;
      return meberSum;
    },
    //页面右下角已选，组内成员总人数
    totalNumber() {
      var totalSum = 0;
      // 等于分组列表的长度
      totalSum = this.$store.state.groupsDetail.length;
      return totalSum;
    },
    // 页面右下角已选多少人
     groupsDetailNumber() {
      var sum = 0;
      for (let i in this.$store.state.groupsDetail) {
        // 复选框选中时,每选中一个,已选就加一个人
        if (this.$store.state.groupsDetail[i].select == true) {
          sum++;
        }
      }
         // 已选人数小于组内人数
        if (sum < this.$store.state.groupsDetail.length) {
          // 全选不自动勾选
          this.check1 = false;
        } else {
           // 全选自动勾选
          this.check1 = true;
        }
      return sum;
    },
  },
  methods: {
    // 金额格式化
      Amtlimit(index){
        this.$store.state.groupsDetail[index].Amount = this.Amount; 
    }, 
      inputMoney(event){
      this.Amount = event.value
    },
    // 打开备注
    openExplain(item) {
      // 备注弹框显示
        this.$store.state.isshowRemark = true;
        this.$store.state.groupsDetailItem = item;
    },
    // 选择复选框
    select(index) {
      // 可以反选
      this.$store.state.groupsDetail[index].select = !this.$store.state
        .groupsDetail[index].select;
      this.$store.state.groupsDetail.splice(
        index,
        1,
        this.$store.state.groupsDetail[index]
      );
    },
    // 全选
    checkAll() {
     this.check1=!this.check1;
      // 如果全选选中
        if (this.check1 == true) {
          for (let i in this.$store.state.groupsDetail) {
            // 所有复选框跟着选中
            this.$store.state.groupsDetail[i].select = true;
          }
        }else{
          // 全选不选中
           for (let i in this.$store.state.groupsDetail) {
            //  所有复选框跟着不选中
            this.$store.state.groupsDetail[i].select = false;
          }
        }
    },
    // 跳到代发录入页
    confirm() {
      for (let i in this.$store.state.groupsDetail) {
        // 先选中一条
        if (this.$store.state.groupsDetail[i].select == true) {
          // 在判断金额为不为空，金额不能为0
          if (!this.$store.state.groupsDetail[i].Amount) {
            wjalert.alert("金额不能为空","确定",data=>{});
            return;
          }else if(Number(this.$store.state.groupsDetail[i].Amount)==0){
             wjalert.alert("金额不能为0","确定",data=>{});
            return;
          }else {
              this.hasSelected = true;
              // 跳到代发录入页时，如果备注是添加备注这四个字，跳到代发录入页要清空
             if(this.$store.state.groupsDetail[i].Remark=="添加备注"){
               this.$store.state.groupsDetail[i].Remark="";
              }
            var payeeObj = {
              PayeeAcName: this.$store.state.groupsDetail[i].AcName,
              PayeeAcNo: this.$store.state.groupsDetail[i].AcNo,
              Remark: this.$store.state.groupsDetail[i].Remark,
              Amount: this.$store.state.groupsDetail[i].Amount,
               select: true,
                hideShow: "1",
                errorMsg: "",
                flag:"1"
            };
           this.$store.state.payrollEntry.push(payeeObj);
          }
        }
      }
      if (this.hasSelected==false) {
          wjalert.alert("请至少选择一条数据","确定",data=>{});
      } else {
        this.jump("/payrollEntry");
      }
    }
  }
};
</script>
<style scoped>
.groupsDetai {
  background-color: rgba(255, 255, 255, 1);
}
.section {
  height: 90px;
  border-bottom-color: rgba(234, 234, 234, 1);
  border-bottom-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}
.group {
  height: 90px;
  border-bottom-color: rgba(234, 234, 234, 1);
  border-bottom-width: 1px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}
.group_btn {
  background-color: rgb(209, 202, 202);
  color: rgb(80, 145, 199);
  padding: 10px;
  border-radius: 30px;
}
.info {
   position: fixed;
  /* top:308px; */
  bottom:196px;
  left: 0;
  right:0;
  background-color: rgba(250, 250, 250, 1);
}
.info_item {
  height: 240px;
  background-color: rgba(255, 255, 255, 1);
  border-style: solid;
  border-width: 1px;
  border-color: rgba(245, 245, 245, 1);
  border-radius: 12px;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
}
.item_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 30px;
  margin-left: 24px;
  margin-right: 24px;
}
.item_box_text {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.info_item_box_title {
  margin-left: 24px;
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.edit {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.text_state1 {
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(170, 170, 170, 1);
}

.item_box_right {
  margin-left: 78px;
  margin-top: 20px;
  margin-right: 24px;
}
.text_state {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.money {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 24px;
  border-top-width: 1px;
  border-top-color: rgba(234, 234, 234, 1);
  padding-top: 15px;
}
.money_box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.money_text {
  margin-left: 10px;
  width: 280px;
  height: 50px;
  line-height: 50px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  /* font-weight: 500; */
  color: rgba(170, 170, 170, 1);
}
.bigMoney {
  font-size: 26px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 400;
  color: rgba(170, 170, 170, 1);
  margin-top: 10px;
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.select {
  height: 88px;
  background: rgba(255, 255, 255, 1);
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 30px;
  padding-right: 30px;
}
.select_left {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.next {
  height: 88px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
}
.next_btn {
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.group_name {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.select_box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.allselect {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
  margin-left: 16px;
}
.hasselect {
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(170, 170, 170, 1);
}
.select_desc {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  margin-left: 16px;
}
.start_img {
  width: 30px;
  height: 30px;
}
.edit_img {
  width: 28px;
  height: 28px;
  margin-left: 5px;
}
.group_title {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.group_memer {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.section_bottom{
   position: fixed;
  bottom:0;
  left: 0;
  right:0;
}
</style>
