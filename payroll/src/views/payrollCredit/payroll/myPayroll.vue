<template>
  <div>
    <nav-bar title="收款人选择" v-if="bgBol == 0"></nav-bar>
    <nav-bar title="代发名册" v-if="bgBol == 1"></nav-bar>
    <div class="query">
      <div class="wrapper">
        <image :src="searchImg" class="search_img" />
        <input
          type="text"
          placeholder="输入户名/账号"
          class="input1"
          v-model="likeName"
          @blur="queryPayeeInfo"
        />
      </div>
      <div class="text_gray"></div>
      <div class="nav_box">
        <div
          v-for="(item, index) in navData"
          class="nav_item"
          :key="index"
          @click="clickType(index)"
        >
          <text :class="[bgBol == index ? 'checked' : 'nochecked']">{{
            item.name
          }}</text>
          <div v-if="bgBol == index" class="block">
            <div class="block1"></div>
          </div>
        </div>
      </div>
      <payeeselete v-if="bgBol == 0"></payeeselete>
      <undertakesregister v-if="bgBol == 1"></undertakesregister>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
import undertakesregister from "./undertakesRegister.vue";
import payeeselete from "./payeeSelete.vue";
const modal = weex.requireModule("modal");
const loading = weex.requireModule("wxEncryption")
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
export default {
  components: { NavBar, undertakesregister, payeeselete },
  data() {
    return {
      searchImg: this.$store.state.imgBaseUrl + "14.png",
      navData: [{ name: "全部收款人" }, { name: "分组" }],
      bgBol:this.$store.state.bgBolU,
      // 输入户名或账号
      likeName: "",
      // 所有全部收款人列表
      arrPayee1: []
    };
  },
  methods: {
    // 导航切换
    clickType(index) {
      this.bgBol = index;
      // 收款人选择页，切换页面要将输入框置为空
      if (this.bgBol == 0) {
        // 清空户名
        this.likeName = "";
      } else {
        this.likeName = "";
      }
    },
    // 输入户名和账号查询
    queryPayeeInfo() {
      // 模糊查询全部收款人
      if (this.bgBol == 0) {
        this.post(
          "/eweb/ActInfoQry.do",
          {
            LikeName: this.likeName
          },
          response => {
            // 全部收款人
            this.arrPayee1 = this.$store.state.allCode1;
            // 查回来的全部收款人，列表展示是allPayeeList
            this.$store.state.allPayeeList = response.data.List;
            // 如果户名和账号为空，默认显示全部收款人列表
            if (this.likeName == "") {
              // 展现全部记录
              this.$store.state.allPayeeList = this.arrPayee1;
              // 全部收款人和搜索回来的收款人比较，先输入户名和账号，选中一条，随后又删除户名和账号，这一条的选中状态要保存，也就是要勾选
              //输入的时候得先执行户名不为空那一个循环
              for (let i in this.$store.state.allPayeeList) {
                for (let j in this.$store.state.queryCode1) {
                  if (
                    this.$store.state.queryCode1[j].AcNo ==
                    this.$store.state.allPayeeList[i].AcNo
                  ) {
                    // 选中复选框
                    if (this.$store.state.queryCode1[j].select == true) {
                      this.$set(
                        this.$store.state.allPayeeList[i],
                        "select",
                        true
                      );
                      // 禁用
                      if (this.$store.state.queryCode1[j].selectFlag) {
                        this.$store.state.allPayeeList[
                          i
                        ].selectFlag = this.$store.state.queryCode1[j].selectFlag;
                      } else {
                        this.$set(
                          this.$store.state.allPayeeList[i],
                          "selectFlag",
                          false
                        );
                      }
                      // 金额
                      if (this.$store.state.queryCode1[j].Amount) {
                        this.$store.state.allPayeeList[
                          i
                        ].Amount = this.$store.state.queryCode1[j].Amount;
                      }
                      // 备注
                      if (this.$store.state.queryCode1[j].Remark) {
                        this.$store.state.allPayeeList[
                          i
                        ].Remark = this.$store.state.queryCode1[j].Remark;
                      }
                      break;
                    } else {
                      this.$set(
                        this.$store.state.allPayeeList[i],
                        "select",
                        false
                      );
                      if (this.$store.state.queryCode1[j].selectFlag) {
                        this.$store.state.allPayeeList[
                          i
                        ].selectFlag = this.$store.state.queryCode1[j].selectFlag;
                      }
                      if (this.$store.state.queryCode1[j].Amount) {
                        this.$store.state.allPayeeList[
                          i
                        ].Amount = this.$store.state.queryCode1[j].Amount;
                      }
                      if (this.$store.state.queryCode1[j].Remark) {
                        this.$store.state.allPayeeList[
                          i
                        ].Remark = this.$store.state.queryCode1[j].Remark;
                      }
                    }
                  }
                }
              }
              var arr3 = [];
              var arr5 = [];
              if (this.$store.state.payrollEntry.length != 0) {
                for (let value of this.$store.state.allPayeeList) {
                  if (value.selectFlag == false) {
                    var payeeObj3 = {
                      PayeeAcNo: value.AcNo
                    };
                    arr3.push(payeeObj3);
                  }else{
                      var payeeObj5 = {
                      PayeeAcNo: value.AcNo
                    };
                    arr5.push(payeeObj5);
                  }
                }
              }
              // 剩下来的收款人
              this.$store.state.noSelectPayee1 = arr3;
              // 已经选中的收款人
              this.$store.state.hasSelectPayee1 = arr5;
            } else {
              // 搜索回来的收款人allPayeeList和全部收款人arrPayee1比较，如果全部收款人账号有选中的，搜索回来的账号也要选中
              for (let i in this.$store.state.allPayeeList) {
                for (let j in this.arrPayee1) {
                  if (
                    this.arrPayee1[j].AcNo ==
                    this.$store.state.allPayeeList[i].AcNo
                  ) {
                    // 如果全部收款人选中了
                    if (this.arrPayee1[j].select == true) {
                      // 搜索回来的收款人也要选中
                      this.$set(
                        this.$store.state.allPayeeList[i],
                        "select",
                        true
                      );
                      if (this.arrPayee1[j].selectFlag) {
                        this.$store.state.allPayeeList[
                          i
                        ].selectFlag = this.arrPayee1[j].selectFlag;
                      } else {
                        this.$set(
                          this.$store.state.allPayeeList[i],
                          "selectFlag",
                          false
                        );
                      }
                      // 如果全部收款人金额输入了
                      if (this.arrPayee1[j].Amount) {
                        // 搜索回来的收款人也要显示金额
                        this.$store.state.allPayeeList[
                          i
                        ].Amount = this.arrPayee1[j].Amount;
                      }
                     // 如果全部收款人备注输入了
                      if (this.arrPayee1[j].Remark) {
                        // 搜索回来的收款人也要显示备注
                        this.$store.state.allPayeeList[
                          i
                        ].Remark = this.arrPayee1[j].Remark;
                      }
                      break;
                    } else {
                      this.$set(
                        this.$store.state.allPayeeList[i],
                        "select",
                        false
                      );
                      this.$set(
                        this.$store.state.allPayeeList[i],
                        "selectFlag",
                        false
                      );
                      if (this.arrPayee1[j].Amount) {
                        this.$store.state.allPayeeList[
                          i
                        ].Amount = this.arrPayee1[j].Amount;
                      }
                      if (this.arrPayee1[j].Remark) {
                        this.$store.state.allPayeeList[
                          i
                        ].Remark = this.arrPayee1[j].Remark;
                      }
                    }
                  }
                }
              }
              // 搜索回来的全部收款人列表重新赋给一个新的list,也就是queryCode1，保存他们的选中和不选中状态，用于输入框删除户名的时候
              this.$store.state.queryCode1 = this.$store.state.allPayeeList;
              var arr4 = [];
              var arr6 = [];
              // 如果收款人选中页选中一条记录跳到代发录入页，也就是代发录入页列表有数据时，再从代发录入页跳到收款人选择页，复选框选中状态也要保存
              if (this.$store.state.payrollEntry.length != 0) {
                for (let value of this.$store.state.allPayeeList) {
                  if (value.selectFlag == false) {
                    var payeeObj4 = {
                      PayeeAcNo: value.AcNo
                    };
                    arr4.push(payeeObj4);
                  }else{
                      var payeeObj6 = {
                      PayeeAcNo: value.AcNo
                    };
                    arr6.push(payeeObj6);
                  }
                }
              }
              // 全部收款人页没有选中的收款人单独放一个list,用于重新计算已选的人数
              this.$store.state.noSelectPayee1 = arr4;
               // 全部收款人页选中的收款人单独放一个list
              this.$store.state.hasSelectPayee1 = arr6;
            }
          }
        );
      } else {
        // 模糊查询分组
        this.post(
          "/eweb/DFActAccessQry.do",
          {
            LikeName: this.likeName
          },
          response => {
            // 分组列表
            this.$store.state.undertakesRegister = response.data.FZQryList;
            for (let i in this.$store.state.undertakesRegister) {
              this.$set(
                this.$store.state.undertakesRegister[i],
                "select",
                false
              );
            }
          }
        );
      }
    }
  }
};
</script>
<style scoped>
.query {
  background-color: rgba(255, 255, 255, 1);
}
.wrapper {
  height: 60px;
  border-radius: 8px;
  border-width: 1px;
  border-color: rgba(221, 221, 221, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.input1 {
  width: 600px;
  height: 56px;
  line-height: 58px;
  outline: none;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  /* font-weight: 500; */
  color: rgba(170, 170, 170, 1);
  margin-left: 17px;
}
.search_img {
  width: 25px;
  height: 25px;
  margin-left: 29px;
}
.nav_box {
  height: 90px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eaeaea;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
}
.nav_item {
  width: 375px;
  height: 84px;
  justify-content: center;
  align-items: center;
}
.checked {
  font-size: 34px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(230, 2, 44, 1);
}
.nochecked {
  font-size: 30px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(85, 85, 85, 1);
}
.block {
  bottom: 0px;
  left: 120px;
  position: absolute;
  align-items: center;
  justify-content: space-around;
}
.block1 {
  width: 140px;
  height: 6px;
 background-image: linear-gradient(to right,rgba(251,93,122,1),rgba(230,2,44,1));
}
</style>
