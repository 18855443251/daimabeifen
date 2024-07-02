<template>
  <div>
    <list class="info" :style="{ top: this.getPosiScrollerTop() + 230 + 'px' }">
      <cell>
        <div
          v-for="(item, index) in $store.state.allPayeeList"
          :key="index"
          class="info_item"
        >
          <div class="item_box">
            <div class="item_box_text">
              <div @click="select(index, item)">
                <div v-if="item.selectFlag == false">
                  <image :src="selectImg" class="start_img" v-if="item.select == true"/>
                  <image :src="noSelectImg" class="start_img" v-if="item.select == false"/>
                </div>
                <div v-if="item.selectFlag == true">
                  <image :src="grayImg" class="start_img" v-if="item.select == true"/>
                  <image :src="noSelectImg" class="start_img" v-if="item.select == false"/>
                </div>
              </div>
              <text class="info_item_box_title">{{ellipsis(item.Acname, 13)}}</text>
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
                <div v-if="item.selectFlag == false">
                <price-input
                  @onChange="inputMoney"
                  @input="Amtlimit(index)"
                  :textValue="$store.state.allPayeeList[index].Amount"
                  :stringRegex="stringRegex"
                  placeholder="请输入代发金额"
                  class="money_text"
                  type="number"
                  isTS="true"
                ></price-input>
                </div>
               <div v-if="item.selectFlag == true">
                  <text class="textMoney">{{ item.Amount }}</text>
                </div> 
              </div>
              <text class="bigMoney" v-if="item.Amount >= 1000">|{{ changeAmountUnit(item.Amount)}}</text>
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
          <text class="select_desc">{{ payeeSeleteNumber }}</text>
        </div>
        <text class="text_blue" @click="openMoney">已选项设置相同金额</text>
      </div>
      <div class="btn">
        <div class="btn_box">
          <div @click="checkAll">
            <image :src="checkImg" class="start_img" v-if="check1 == true" />
            <image :src="noSelectImg" class="start_img" v-if="check1 == false"/>
          </div>
          <text class="all">全选</text>
        </div>
        <text class="confirm" @click="confirm">确定</text>
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
      // 金额
      Amount: "",
      searchImg: this.$store.state.imgBaseUrl + "14.png",
      // 灰色按钮
      grayImg: this.$store.state.imgBaseUrl + "28.png",
      xImg: this.$store.state.imgBaseUrl + "19.png",
      // 选中按钮
      selectImg: this.$store.state.imgBaseUrl + "16.png",
      checkImg: this.$store.state.imgBaseUrl + "29.png",
      // 没有选中按钮
      noSelectImg: this.$store.state.imgBaseUrl + "15.png",
      editImg: this.$store.state.imgBaseUrl + "22.png",
      // // 全选
      check1: false,
      // 至少选中一条数据
      hasSelected: false,
      stringRegex: "^(([0]|(0[.]\\d{0,2}))|([1-9]\\d{0,12}(([.]\\d{0,2})?)))?$"
    };
  },
  created() {
    // 页面一进来就要隐藏添加备注弹框
    this.$store.state.isshowRemark = false;
     // 页面一进来就要隐藏添加金额弹框
    this.$store.state.isshowMoney = false;
    this.getPayeeInfo();
  },
  computed: {
    // 已选人数
    payeeSeleteNumber() {
      var sum = 0;
      for (let i in this.$store.state.allPayeeList) {
        // 选中状态
        if (this.$store.state.allPayeeList[i].select == true) {
          {
            // 复选框置灰的也是选中状态
            if (this.$store.state.allPayeeList[i].selectFlag == false) {
              sum++;
            }
          }
        }
      }
      // 如果代发录入页列表没有数据
      if (this.$store.state.payrollEntry.length == 0) {
        // 再判断全部收款人页有没有数据，没有数据
        if (this.$store.state.allPayeeList.length == 0) {
          // 全选按钮不选中
          this.check1 = false;
        } else {
          // 已选人数小于全部收款人的人数
          if (sum < this.$store.state.allPayeeList.length) {
            // 选选不选中
            this.check1 = false;
          } else {
            // 全选选中
            this.check1 = true;
          }
        } 
         this.$store.state.hasSelectPayee1=[];
      } else {
        // 如果代发录入页列表有数据，重新计算已选人数
        if (this.$store.state.noSelectPayee1.length == 0) {
          sum = 0;
          // 全选不选
          this.check1 = false;
        } else {
          // 已选人数小于剩下来的没勾选的人数
          if (sum < this.$store.state.noSelectPayee1.length) {
            // 全选不选中
            this.check1 = false;
          } else {
            this.check1 = true;
          }
        }
      }
      //金额弹框已选项设置相同的金额
      this.$store.state.payeeSeleteNumber = sum;
      return sum;
    }
  },
  methods: {
    // 金额
    Amtlimit(index) {
      this.$store.state.allPayeeList[index].Amount = this.Amount;
    },
    inputMoney(event) {
      this.Amount = event.value;
    },
    // 打开备注弹框
    openExplain(item) {
      if (item.selectFlag == false) {
        this.$store.state.payeeSeleteItem = item;
        // 备注弹框显示
        this.$store.state.isshowRemark = true;
      }
    },
    // 打开金额弹框
    openMoney() {
      for (let i in this.$store.state.allPayeeList) {
        // 如果复选框选中
        if (this.$store.state.allPayeeList[i].select == true) {
          // 判断是不是灰色按钮
          if (this.$store.state.allPayeeList[i].selectFlag == false) {
            // 不是灰色按钮就可以打开金额弹框
            this.$store.state.isshowMoney = true;
          }
        }
      }
    },
    select(index) {
      // 当代发录入页没有数据时
      if (this.$store.state.payrollEntry.length == 0) {
        // 复选框可切换
        this.$store.state.allPayeeList[index].select = !this.$store.state.allPayeeList[index].select;
        this.$store.state.allPayeeList.splice(index, 1,this.$store.state.allPayeeList[index]);
        // 当代发录入页有数据时
      } else {
        var flag = false;
        for (let j in this.$store.state.payrollEntry) {
          // 如果代发录入页和收款人选中页账号相同时
          if (
            this.$store.state.allPayeeList[index].AcNo ==
            this.$store.state.payrollEntry[j].PayeeAcNo
          ) {
            flag = true;
            // 复选框为选中状态
            this.$store.state.allPayeeList[index].select = true;
            this.$store.state.allPayeeList.splice(index,1,this.$store.state.allPayeeList[index]);
          }
        }
        if (flag == false) {
          this.$store.state.allPayeeList[index].select = !this.$store.state.allPayeeList[index].select;
          this.$store.state.allPayeeList.splice(index,1,this.$store.state.allPayeeList[index]);
        }
      }
    },
    // 全选
    checkAll() {
      if (this.$store.state.payrollEntry.length != 0) {
        // 剩下来没选中的收款人列表
        if (this.$store.state.noSelectPayee1.length == 0) {
          return;
        }
      }else{
        if (this.$store.state.allPayeeList.length == 0) {
          return;
        }
      }
      this.check1 = !this.check1;
      // 全选选中
      if (this.check1 == true) {
        // 全部收款人列表
        for (let i in this.$store.state.allPayeeList) {
          // 全部收款人选中
          this.$store.state.allPayeeList[i].select = true;
        }
      } else {
        for (let i in this.$store.state.allPayeeList) {
          if (this.$store.state.allPayeeList[i].select == true) {
            {
              if (this.$store.state.allPayeeList[i].selectFlag == false) {
                this.$store.state.allPayeeList[i].select = false;
              }
            }
          }
        }
      }
    },
    // 获得收款人信息
    getPayeeInfo() {
      this.post("/eweb/ActInfoQry.do", {}, response => {
        this.$store.state.allPayeeList = response.data.List;
        // 代发录入页没有数据时
        if (this.$store.state.payrollEntry.length == 0) {
          for (let i in this.$store.state.allPayeeList) {
            // 添加select字段置为false
            this.$set(this.$store.state.allPayeeList[i], "select", false);
            // 添加selectFlag字段置为false
            this.$set(this.$store.state.allPayeeList[i], "selectFlag", false);
            // 如果备注为空
            if (!this.$store.state.allPayeeList[i].Remark) {
              // 将添加备注全部赋值给备注
              this.$set(
                this.$store.state.allPayeeList[i],"Remark","添加备注");
            }
            if (!this.$store.state.allPayeeList[i].Amount) {
              this.$set(this.$store.state.allPayeeList[i], "Amount", "");
            }
          }
          // 全部收款人列表,用于搜索收款人比较
          this.$store.state.allCode1 = this.$store.state.allPayeeList;
          // 代发录入页有数据时
        } else {
          for (let i in this.$store.state.allPayeeList) {
            for (let j in this.$store.state.payrollEntry) {
              // 代发录入页和全部收款人的账号相同
              if (
                this.$store.state.allPayeeList[i].AcNo ==this.$store.state.payrollEntry[j].PayeeAcNo&& this.$store.state.allPayeeList[i].Acname==this.$store.state.payrollEntry[j].PayeeAcName) {
                // 将select置为true
                this.$set(this.$store.state.allPayeeList[i], "select", true);
                // 将selectFlag字段置为true
                this.$set(this.$store.state.allPayeeList[i],"selectFlag",true);
                // 如果代发录入页有备注
                if (this.$store.state.payrollEntry[j].Remark) {
                  //  将代发录入页的备注赋值给全部收款人页
                  this.$store.state.allPayeeList[i].Remark = this.$store.state.payrollEntry[j].Remark;
                } else {
                  this.$store.state.allPayeeList[i].Remark = "";
                }
                if (this.$store.state.payrollEntry[j].Amount) {
                  //  将代发录入页的备注赋值给全部收款人页
                  this.$store.state.allPayeeList[i].Amount = this.$store.state.payrollEntry[j].Amount;
                }
                break;
              } else {
                // 代发录入页和全部收款人的账号不相同
                // 添加select字段置为false
                this.$set(this.$store.state.allPayeeList[i], "select", false);
                // 添加selectFlag字段置为false
                this.$set(this.$store.state.allPayeeList[i],"selectFlag",false);
                if (!this.$store.state.allPayeeList[i].Remark) {
                  this.$set(this.$store.state.allPayeeList[i],"Remark","添加备注");
                }
                if (!this.$store.state.payrollEntry[j].Amount) {
                  this.$set(this.$store.state.allPayeeList[i], "Amount", "");
                }
              }
            }
          }
          // 全部收款人
          this.$store.state.allCode1 = this.$store.state.allPayeeList;
          var arr5 = [];
          var arr6 = [];
          for (let value of this.$store.state.allPayeeList) {
            // 选中复选框时
            if (value.select == false) {
              if (value.selectFlag == false) {
                var payeeObj4 = {
                  PayeeAcNo: value.AcNo
                };
                arr5.push(payeeObj4);
              }
            } else {
              if (value.selectFlag == true) {
                var payeeObj5 = {
                  PayeeAcNo: value.AcNo
                };
                arr6.push(payeeObj5);
              }
            }
          }
          // 没有选中的人
          this.$store.state.noSelectPayee1 = arr5;
          this.$store.state.hasSelectPayee1 = arr6;
        }
      });
    },
    confirm() {
      for (let value of this.$store.state.allPayeeList) {
        // 选中复选框时
        if (value.select == true) {
          // 如果当前项不被禁用时
          if (value.selectFlag == false) {
            if (!value.Amount) {
              wjalert.alert("金额不能为空", "确定", data => {});
              return;
              // 如果金额不为空时
            } else if (Number(value.Amount) == 0) {
              wjalert.alert("金额不能为0", "确定", data => {});
              return;
            }else {
              this.hasSelected = true;
              if (value.Remark == "添加备注") {
                value.Remark = "";
              }
              var payeeObj = {
                PayeeAcName: value.Acname,
                PayeeAcNo: value.AcNo,
                Remark: value.Remark,
                Amount: value.Amount,
                select: true,
                hideShow: "1",
                errorMsg: "",
                flag:"1"
              };
              this.$store.state.payrollEntry.push(payeeObj);
            }
          }
        }
      }
      if(this.$store.state.allPayeeList.length==0){
        return;
      }else if (
        this.$store.state.hasSelectPayee1.length ==this.$store.state.allPayeeList.length
      ) {
        wjalert.alert("已经没有可供选择的数据", "确定", data => {});
        return;
      }else if(this.hasSelected == false){
        wjalert.alert("请至少选择一条数据", "确定", data => {});
      }else {
        this.jump("/payrollEntry");
      }
    }
  }
};
</script>
<style scoped>
.start_img {
  width: 30px;
  height: 30px;
}
.info {
  position: fixed;
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
.money_text {
  margin-left: 10px;
  width: 280px;
  height: 50px;
  line-height: 50px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  color: rgba(170, 170, 170, 1);
}
.textMoney{
   margin-left: 10px;
  width: 220px;
  height: 50px;
  line-height: 50px;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  color: rgba(170, 170, 170, 1);
}
.bigMoney {
  font-size: 26px;
  font-family: PingFang-SC-Regular, PingFang-SC;
  font-weight: 400;
  color: rgba(170, 170, 170, 1);
  margin-top: 10px;
}
.text_state {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
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
.text_blue {
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(74, 137, 252, 1);
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
.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.section_bottom{
  position: fixed;
  bottom:0px;
  left:0;
  right:0;
}
</style>