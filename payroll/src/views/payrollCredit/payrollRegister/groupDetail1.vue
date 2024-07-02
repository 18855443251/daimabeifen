<template>
  <div>
    <nav-bar title="分组详情"></nav-bar>
    <div class="groupDetail1">
      <div class="section">
        <text class="group_title">分组名称</text>
        <text class="group_name">{{ $store.state.GGroupName }}</text>
      </div>
      <div class="group" @click="groupManagement1">
        <text class="group_memer"
          >组内成员&nbsp;&nbsp;&nbsp;{{meberNum}}人</text
        >
        <text class="group_btn">管理分组</text>
      </div>
      <list class="info" :style="{ top: this.getPosiScrollerTop()+200 +'px' }">
        <cell>
          <div
            v-for="(item, index) in $store.state.groupDetail1"
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
                <text class="info_item_box_title">{{
                  ellipsis(item.AcName, 13)
                }}</text>
              </div>
              <div class="edit" @click="openExplain(item)">
                <text class="text_state1">{{ ellipsis(item.Remark, 5) }}</text>
                <image :src="editImg" class="edit_img" />
              </div>
            </div>
            <div class="item_box_right">
              <text class="text_state">{{ divieBanks(item.AcNo) }}</text>
              <div class="money">
                <div class="money_box">
                  <text>¥</text>
                   <price-input @onChange="inputMoney"  @input="Amtlimit(index)" :textValue="$store.state.groupDetail1[index].Amount" :stringRegex="stringRegex"  placeholder="请输入代发金额" class="money_text"  type="number" isTS = "true" ></price-input> 
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
            >{{ groupDetail1Number }}/{{ totalNumber }}</text
          >
        </div>
      </div>
      <div class="next">
        <text class="next_btn" @click="next">立即代发</text>
      </div>
       </div>
      <remark></remark>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
import remark from "../../../components/remark.vue";
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
const stream = weex.requireModule("stream");
export default {
  components: { NavBar, remark },
  data() {
    return {
      selectImg: this.$store.state.imgBaseUrl + "16.png",
      noSelectImg: this.$store.state.imgBaseUrl + "15.png",
      editImg: this.$store.state.imgBaseUrl + "22.png",
      // 全选复选框
      check1: false,
      stringRegex:"^(([0]|(0[.]\\d{0,2}))|([1-9]\\d{0,12}(([.]\\d{0,2})?)))?$" ,
      hasSelected:false,
    };
  },
  created(){
   this.$store.state.newgroupManagement=[];
  },
  computed: {
    // 总人数
    totalNumber() {
      var  totalSum=0;
      totalSum= this.$store.state.groupDetail1.length;
      return totalSum;
    },
    meberNum() {
      var meberSum=0;
      meberSum=this.$store.state.groupDetail1.length;
      return meberSum;
    },
    groupDetail1Number() {
      var sum = 0;
      for (let i in this.$store.state.groupDetail1) {
        if (this.$store.state.groupDetail1[i].select == true) {
          sum++;
        }
        // 已选小于总长度
        if (sum < this.$store.state.groupDetail1.length) {
          this.check1 = false;
        } else {
          this.check1 = true;
        }
      }
      return sum;
    }
  },
  methods: {
    Amtlimit(index){
        this.$store.state.groupDetail1[index].Amount = this.Amount;
    },  
      inputMoney(event){
         this.Amount = event.value;
    },
    // 打开备注弹框
    openExplain(item) {
        this.$store.state.groupDetail1Item = item;
        this.$store.state.isshowRemark = true;
    },
    // 跳到分组管理页
    groupManagement1() {
      this.$store.state.groupManagement1 = this.$store.state.groupDetail1;
      this.jump("/groupManagement1");
    },
    // 选择复选框
    select(index) {
      this.$store.state.groupDetail1[index].select = !this.$store.state
        .groupDetail1[index].select;
      this.$store.state.groupDetail1.splice(
        index,
        1,
        this.$store.state.groupDetail1[index]
      );
    },
    // 全选
    checkAll() {
      this.check1 = !this.check1;
      // 如果全选选中
      if (this.check1 == true) {
        for (let i in this.$store.state.groupDetail1) {
          this.$store.state.groupDetail1[i].select = true;
        }
        // 全选不选中
      } else {
        for (let i in this.$store.state.groupDetail1) {
          this.$store.state.groupDetail1[i].select = false;
        }
      }
    },
    // 带回代发录入页
    next() {
      var arr = [];
      for (let i in this.$store.state.groupDetail1) {
        // 选中复选框
        if (this.$store.state.groupDetail1[i].select == true) {
          //  金额没有输入时
          if (!this.$store.state.groupDetail1[i].Amount) {
            wjalert.alert("金额不能为空","确定",data=>{});
            return;
          }else if(Number(this.$store.state.groupDetail1[i].Amount)==0){
             wjalert.alert("金额不能为0","确定",data=>{});
            return;
          }else {
                this.hasSelected = true;
            if( this.$store.state.groupDetail1[i].Remark=="添加备注"){
              this.$store.state.groupDetail1[i].Remark="";
            }
            var payeeObj = {
              PayeeAcName: this.$store.state.groupDetail1[i].AcName,
              PayeeAcNo: this.$store.state.groupDetail1[i].AcNo,
              Remark: this.$store.state.groupDetail1[i].Remark,
              Amount:this.$store.state.groupDetail1[i].Amount,
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
.groupDetail1 {
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
  margin-top: 20px;
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
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(74, 137, 252, 1);
}
.info {
  position: fixed;
  /* top:328px; */
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
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.next {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.next_btn {
  width: 750px;
  height: 88px;
  line-height: 88px;
  text-align: center;
background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.start_img {
  width: 30px;
  height: 30px;
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
