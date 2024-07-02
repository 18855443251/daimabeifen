<template>
  <div>
  <div class="add_bg">
      <div class="add" @click="addPayee3">
      <div class="add_box">
        <image :src="jiaImg" class="arrow_img1" />
        <text class="add_title">新增收款人</text>
      </div>
      <image :src="arrowImg" class="arrow_img" />
    </div>
  </div>
    <list class="info" :style="{ top: this.getPosiScrollerTop()+318 +'px' }">
      <cell>
        <div
          v-for="(item, index) in $store.state.allPayeeList"
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
              <text class="info_item_box_title">{{ellipsis(item.Acname,13) }}</text>
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
                  <price-input @onChange="inputMoney"  @input="Amtlimit(index)" :textValue="$store.state.allPayeeList[index].Amount"  :stringRegex="stringRegex"  placeholder="请输入代发金额" class="money_text"  type="number" isTS = "true" ></price-input> 
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
    <div class="section">
      <div class="section_box">
        <text class="select">已选</text>
        <text class="select_desc"
          >{{FullPayeeNumber }}/{{ totalNumber }}</text
        >
      </div>
      <text class="text_blue" @click="openMoney">已选项设置相同金额</text>
    </div>
    <div class="btn">
      <div class="btn_box" @click="checkAll">
        <div>
          <image :src="checkImg" class="start_img" v-if="check1 == true" />
          <image :src="noSelectImg" class="start_img" v-if="check1 == false" />
        </div>
        <text class="all">全选</text>
      </div>
      <text class="confirm" @click="payrollEntry">立即代发</text>
    </div>
  </div>
    <remark></remark>
    <money Mflag="0"></money>
  </div>
</template>
<script>
import { WxcMask } from "weex-ui";
import remark from "../../../components/remark.vue";
import money from "../../../components/money.vue";
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
const stream = weex.requireModule("stream");
export default {
  components: { WxcMask, remark, money },
  data() {
    return {
      searchImg: this.$store.state.imgBaseUrl + "14.png",
      jiaImg: this.$store.state.imgBaseUrl + "17.png",
      arrowImg: this.$store.state.imgBaseUrl + "27.png",
      xImg: this.$store.state.imgBaseUrl + "19.png",
      selectImg: this.$store.state.imgBaseUrl + "16.png",
       checkImg:this.$store.state.imgBaseUrl + "29.png",
      noSelectImg: this.$store.state.imgBaseUrl + "15.png",
      editImg: this.$store.state.imgBaseUrl + "22.png",
      // 全选按钮
      check1: false,
      stringRegex:"^(([0]|(0[.]\\d{0,2}))|([1-9]\\d{0,12}(([.]\\d{0,2})?)))?$" ,
       hasSelected:false,
    };
  },
  computed: {
    totalNumber() {
      var totalNumber = 0;
      totalNumber = this.$store.state.allPayeeList.length;
      return totalNumber;
    },
      FullPayeeNumber() {
       var  sum = 0;
      for (let i in this.$store.state.allPayeeList) {
        // 复选框选中时，计算已选条数
        if (this.$store.state.allPayeeList[i].select == true) {
          sum++;
        }
        // 如果已选条数小于总长度
        if (sum < this.$store.state.allPayeeList.length) {
          // 全选按钮为false
          this.check1 = false;
        } else {
          this.check1 = true;
        }
      }
       this.$store.state.payeeSeleteNumber=sum;
      return  sum;
    }
  },
  created() {
     this.$store.state.isshowRemark=false;
    this.$store.state.isshowMoney=false;
    this.getPayeeInfo();
  },
  methods: {
    // 边输入边限制金额大小
    Amtlimit(index){
         this.$store.state.allPayeeList[index].Amount = this.Amount;  
    },  
      inputMoney(event){
         this.Amount = event.value;
    },
    // 打开备注弹框
    openExplain(item) {
        this.$store.state.isshowRemark = true;
        this.$store.state.FullPayeeItem = item;
    },
    // 打开设置相同金额弹框
    openMoney() {
      for (let i in this.$store.state.allPayeeList) {
        if (this.$store.state.allPayeeList[i].select == true) {
          this.$store.state.isshowMoney = true;
        }
      }
    },
    // 选中复选框
    select(index) {
      this.$store.state.allPayeeList[index].select = !this.$store.state
        .allPayeeList[index].select;
      this.$store.state.allPayeeList.splice(
        index,
        1,
        this.$store.state.allPayeeList[index]
      );
    },
    // 全选
    checkAll() {
      if(this.$store.state.allPayeeList.length==0){
        return
      }else{
      this.check1 = !this.check1;
      }
      // 如果全选选中
      if (this.check1 == true) {
        for (let i in this.$store.state.allPayeeList) {
          this.$store.state.allPayeeList[i].select = true;
        }
        // 全选不选中
      } else {
        for (let i in this.$store.state.allPayeeList) {
          this.$store.state.allPayeeList[i].select = false;
        }
      }
    },
    getPayeeInfo() {
      // 获得收款人信息
      this.post("/eweb/ActInfoQry.do", {}, response => {
        this.$store.state.allPayeeList = response.data.List;
        for (let i in this.$store.state.allPayeeList) {
          this.$set(this.$store.state.allPayeeList[i], "select", false);
          this.$set(this.$store.state.allPayeeList[i], "selectFlag", false);
          if (!this.$store.state.allPayeeList[i].Remark) {
            this.$set(this.$store.state.allPayeeList[i], "Remark", "添加备注");
          }
           if (!this.$store.state.allPayeeList[i].Amount) {
            this.$set(this.$store.state.allPayeeList[i], "Amount", "");
          }
        }
          // 全部收款人
        this.$store.state.allCode2=this.$store.state.allPayeeList;
      });
    },
    // 新增收款人
    addPayee3() {
      this.jump("/addPayee3");
    },
    payrollEntry() {
      var arr = [];
      for (let value of this.$store.state.allPayeeList) {
        // 选中复选框时
        if (value.select == true) {
          // 置为true,可以跳转页面
          if (!value.Amount) {
             wjalert.alert("金额不能为空","确定",data=>{});
            return;
            // 如果金额不为空时
          } else if(Number(value.Amount)==0){
             wjalert.alert("金额不能为0","确定",data=>{});
            return;
          }else {
              this.hasSelected = true;
             if(value.Remark=="添加备注"){
                value.Remark="";
              }
            var payeeObj = {
              PayeeAcName: value.Acname,
              PayeeAcNo: value.AcNo,
              Remark: value.Remark,
              Amount:value.Amount,
               select: true,
                hideShow: "1",
                errorMsg: "",
                flag:"1"
            };
            arr.push(payeeObj);
          }
        }
      }
      this.$store.state.payrollEntry = arr;
       if(this.$store.state.allPayeeList.length==0){
        return;
      }else if(this.hasSelected==false) {
         wjalert.alert("请至少选择一条数据","确定",data=>{});
      } else {
        this.jump("/payrollEntry");
      }
    }
  }
};
</script>
<style scoped>
.add_bg{
    background-color: rgba(250, 250, 250, 1);
}
.add {
  height: 88px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1px;
  border-color: rgba(234, 234, 234, 1);
  border-radius: 12px;
  margin-top: 20px;
  padding-left: 24px;
  margin-left: 30px;
  margin-right: 30px;
  background-color: rgba(255, 255, 255, 1);
}
.add_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.arrow_img1 {
  margin-right: 20px;
  width: 26px;
  height: 26px;
}
.arrow_img {
  margin-right: 20px;
  width: 14px;
  height: 24px;
}
.start_img {
  width: 30px;
  height: 30px;
}
.info {
  position: fixed;
  /* top:426px; */
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
.item_box_right {
  margin-left: 78px;
  margin-top: 20px;
  margin-right: 24px;
}
.info_item_box_title {
  margin-left: 24px;
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
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
.text_state {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
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
.section {
  height: 88px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 40px;
  padding-right: 40px;
}
.section_box {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.select {
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
.text_blue {
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(74, 137, 252, 1);
}
.select {
  font-size: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(170, 170, 170, 1);
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.edit {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.edit_img {
  width: 28px;
  height: 28px;
  margin-left: 5px;
}
.text_state1 {
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(170, 170, 170, 1);
}
.btn_box {
  width: 260px;
  height: 88px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  opacity: 0.5;
}
.all {
  line-height: 88px;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  margin-left: 20px;
}
.confirm {
  width: 490px;
  height: 88px;
background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  line-height: 88px;
  text-align: center;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.text_state1 {
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
}

.add_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.juli {
  height: 20px;
}
.section_bottom{
   position: fixed;
  bottom:0px;
  left: 0;
  right:0;
}
</style>
