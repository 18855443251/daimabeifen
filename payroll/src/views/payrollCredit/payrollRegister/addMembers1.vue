<template>
  <div>
    <nav-bar title="代发名册"></nav-bar>
    <div class="addMembers">
      <div class="wrapper">
        <div class="wrapper_box">
          <image :src="searchImg" class="search_img" />
          <input
            type="text"
            placeholder="输入户名/账号"
            class="input1"
            v-model="likeName"
            @blur="queryPayeeInfo"
          />
        </div>
      </div>
      <div class="text_gray"></div>
      <div class="add">
        <div class="add_content" @click="addPayee1">
          <div class="add_box">
            <image :src="jiaImg" class="arrow_img1" />
            <text class="add_title">新增收款人</text>
          </div>
          <image :src="arrowImg" class="arrow_img" />
        </div>
      </div>
      <list class="info" :style="{ top: this.getPosiScrollerTop()+248 +'px' }">
        <cell
          v-for="(item, index) in $store.state.allPayeeList"
          :key="index"
          class="info_item"
          @click="select(index, item)"
        >
          <div class="info_item_left">
            <image v-if="BankId" :src="imgdata(BankId)" class="bank_img" />
            <image v-else :src="newBankImg" class="bank_img" />
          </div>
          <div class="info_item_right">
            <div class="info_item_box_text">
              <text class="text_acname">{{ ellipsis(item.Acname, 18) }}</text>
              <text class="text_acno">{{ divieBanks(item.AcNo) }}</text>
            </div>
            <div>
              <div v-if="item.selectFlag == false">
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
              <div v-if="item.selectFlag == true">
                <image
                  :src="grayImg"
                  class="start_img"
                  v-if="item.select == true"
                />
                <image
                  :src="noSelectImg"
                  class="start_img"
                  v-if="item.select == false"
                />
              </div>
            </div>
          </div>
        </cell>
      </list>
     <div class="section_bottom">
        <div class="text_gray"></div>
      <div class="section">
        <div class="section_item" @click="checkAll">
          <div class="section_item_right">
            <image :src="selectImg" class="start_img" v-if="check1 == true" />
            <image
              :src="noSelectImg"
              class="start_img"
              v-if="check1 == false"
            />
          </div>
          <text class="all_select">全选</text>
        </div>
        <div class="section_item">
          <text class="section_item_title">已选&nbsp;&nbsp;&nbsp;&nbsp;</text>
          <text class="section_item_desc">{{ groupDetail1Number }}人</text>
        </div>
      </div>
      <div class="btn">
        <text class="dissolution" @click="reset">重置</text>
        <text class="save" @click="confirm">确认</text>
      </div>
     </div>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
import { WxcMask } from "weex-ui";
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: { NavBar, WxcMask },
  data() {
    return {
      searchImg: this.$store.state.imgBaseUrl + "14.png",
      arrowImg: this.$store.state.imgBaseUrl + "27.png",
      selectImg: this.$store.state.imgBaseUrl + "16.png",
      grayImg: this.$store.state.imgBaseUrl + "28.png",
      jiaImg: this.$store.state.imgBaseUrl + "17.png",
      noSelectImg: this.$store.state.imgBaseUrl + "15.png",
      check1: false,
      BankId: "9999",
      newBankImg: this.$store.state.imgBaseUrl + "102.png",
      // 户名和账号
      likeName: "",
      hasSelected: false,
      // 全部收款人
      arrPayee3: [],
      // 已经选中的收款人
      hasSelectPayee2:[],
    };
  },
  created() {
    this.getPayeeInfo();
  },
  computed: {
    // 已选人数
    groupDetail1Number() {
      var sum = 0;
      for (let i in this.$store.state.allPayeeList) {
        // 复选框选中时
        if (this.$store.state.allPayeeList[i].select == true) {
          {
            // 且selectFlag为false的状态，已选才生效
            if (this.$store.state.allPayeeList[i].selectFlag == false) {
              sum++;
            }
          }
        }
      }
      // 分组管理页没有数据
      if (this.$store.state.groupManagement1.length == 0) {
        // 代发名册页也没有数据
         if (this.$store.state.allPayeeList.length==0) {
            sum=0;
            // 全选不选
            this.check1 = false;
         }else{
          //  选中的收款人小于所有收款人
          if (sum < this.$store.state.allPayeeList.length) {
            // 全选不选
          this.check1 = false;
        } else {
          // 相等，全选选中
          this.check1 = true;
        }
         }
      } else {
        // 都选中了，意味着没有可供选择的收款人
        if (this.$store.state.noSelectPayee2.length == 0) {
              sum=0;
              // 全选不选
              this.check1 = false;
        } else {
          if (sum < this.$store.state.noSelectPayee2.length) {
            // 全选不选
            this.check1 = false;
          } else {
            this.check1 = true;
          }
        }
      }
      return sum;
    }
  },
  methods: {
    // 获得收款人信息
    getPayeeInfo() {
      this.post("/eweb/ActInfoQry.do", {}, response => {
        this.$store.state.allPayeeList = response.data.List;
        // 如果分组管理页没有成员
        if (this.$store.state.groupManagement1.length == 0) {
          // 将全部复选框置为false
          for (let i in this.$store.state.allPayeeList) {
            this.$set(this.$store.state.allPayeeList[i], "select", false);
            this.$set(this.$store.state.allPayeeList[i], "selectFlag", false);
          }
          // 全部收款人
          this.$store.state.allCode3 = this.$store.state.allPayeeList;
          // 如果分组管理页有成员
        } else {
          for (let i in this.$store.state.allPayeeList) {
            for (let j in this.$store.state.groupManagement1) {
              // 账号相同时
              if (
                this.$store.state.allPayeeList[i].AcNo ==
                this.$store.state.groupManagement1[j].AcNo
              ) {
                // 将复选框置为true
                this.$set(this.$store.state.allPayeeList[i], "select", true);
                this.$set(
                  this.$store.state.allPayeeList[i],
                  "selectFlag",
                  true
                );
                break;
                // 账号不相同时
              } else {
                // 将复选框置为false
                this.$set(this.$store.state.allPayeeList[i], "select", false);
                this.$set(
                  this.$store.state.allPayeeList[i],
                  "selectFlag",
                  false
                );
              }
            }
          }
          // 全部收款人
          this.$store.state.allCode3 = this.$store.state.allPayeeList;
          var arr5 = [];
           var arr6 = [];
            for (let value of this.$store.state.allPayeeList) {
              // 选中复选框时
              if (value.select == false) {
                if (value.selectFlag == false) {
                  var payeeObj5 = {
                    PayeeAcNo: value.AcNo
                  };
                  arr5.push(payeeObj5);
                }
              }else{
                 if (value.selectFlag == true) {
                  var payeeObj6 = {
                    PayeeAcNo6: value.AcNo
                  };
                  arr6.push(payeeObj6);
                }
              }
            }
          this.$store.state.noSelectPayee2 = arr5;
             this.hasSelectPayee2 = arr6;
        }
      });
    },
    // 选中复选框
    select(index, item) {
      // 如果分组管理页没有成员
      if (this.$store.state.groupManagement1.length == 0) {
        // 复选框可以点击
        this.$store.state.allPayeeList[index].select = !this.$store.state
          .allPayeeList[index].select;
        this.$store.state.allPayeeList.splice(
          index,
          1,
          this.$store.state.allPayeeList[index]
        );
        // 如果分组管理页有成员
      } else {
        var flag = false;
        for (let j in this.$store.state.groupManagement1) {
          // 账号相同
          if (
            this.$store.state.allPayeeList[index].AcNo ==
            this.$store.state.groupManagement1[j].AcNo
          ) {
            flag = true;
            // 复选框为选中状态
            this.$store.state.allPayeeList[index].select = true;
            this.$store.state.allPayeeList.splice(
              index,
              1,
              this.$store.state.allPayeeList[index]
            );
          }
        }
        // 账号不相同
        if (flag == false) {
          this.$store.state.allPayeeList[index].select = !this.$store.state
            .allPayeeList[index].select;
          this.$store.state.allPayeeList.splice(
            index,
            1,
            this.$store.state.allPayeeList[index]
          );
        }
      }
    },
    // 输入户名和账号查询收款人信息
    queryPayeeInfo() {
      this.post(
        "/eweb/ActInfoQry.do",
        {
          LikeName: this.likeName
        },
        response => {
          // 查回来的全部收款人
          this.arrPayee3 = this.$store.state.allCode3;
          this.$store.state.allPayeeList = response.data.List;
          if (this.likeName == "") {
            // 展现全部记录
            this.$store.state.allPayeeList = this.arrPayee3;
            // 全部收款人和搜索回来的收款人比较
            for (let i in this.$store.state.allPayeeList) {
              for (let j in this.$store.state.queryCode3) {
                if (
                  this.$store.state.queryCode3[j].AcNo ==
                  this.$store.state.allPayeeList[i].AcNo
                ) {
                  if (this.$store.state.queryCode3[j].select == true) {
                    this.$set(
                      this.$store.state.allPayeeList[i],
                      "select",
                      true
                    );
                    if (this.$store.state.queryCode3[j].selectFlag) {
                      this.$store.state.allPayeeList[
                        i
                      ].selectFlag = this.$store.state.queryCode3[j].selectFlag;
                    } else {
                      this.$set(
                        this.$store.state.allPayeeList[i],
                        "selectFlag",
                        false
                      );
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
                  }
                }
              }
            }
            var arr3 = [];
            var arr7 = [];
            if (this.$store.state.groupManagement1.length != 0) {
              for (let value of this.$store.state.allPayeeList) {
                // 选中复选框时
                if (value.selectFlag == false) {
                  var payeeObj3 = {
                    PayeeAcNo: value.AcNo
                  };
                  arr3.push(payeeObj3);
                }else{
                  var payeeObj7 = {
                    PayeeAcNo: value.AcNo
                  };
                  arr7.push(payeeObj7);
                }
              }
            }
            this.$store.state.noSelectPayee2 = arr3;
            this.hasSelectPayee2 = arr7;
          } else {
            // 搜索回来的收款人和全部收款人比较
            for (let i in this.$store.state.allPayeeList) {
              for (let j in this.arrPayee3) {
                if (
                  this.arrPayee3[j].AcNo ==
                  this.$store.state.allPayeeList[i].AcNo
                ) {
                  if (this.arrPayee3[j].select == true) {
                    this.$set(
                      this.$store.state.allPayeeList[i],
                      "select",
                      true
                    );
                    if (this.arrPayee3[j].selectFlag) {
                      this.$store.state.allPayeeList[
                        i
                      ].selectFlag = this.arrPayee3[j].selectFlag;
                    } else {
                      this.$set(
                        this.$store.state.allPayeeList[i],
                        "selectFlag",
                        false
                      );
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
                  }
                }
              }
            }
            this.$store.state.queryCode3 = this.$store.state.allPayeeList;
            var arr4 = [];
             var arr8 = [];
            if (this.$store.state.groupManagement1.length != 0) {
              for (let value of this.$store.state.allPayeeList) {
                // 选中复选框时
                if (value.selectFlag == false) {
                  var payeeObj4 = {
                    PayeeAcNo: value.AcNo
                  };
                  arr4.push(payeeObj4);
                }else{
                   var payeeObj8 = {
                    PayeeAcNo: value.AcNo
                  };
                  arr8.push(payeeObj8);
                }
              }
            }
            this.$store.state.noSelectPayee2 = arr4;
             this.hasSelectPayee2 = arr8;
          }
        }
      );
    },
    // 带到分组管理页
    confirm() {
      for (let i in this.$store.state.allPayeeList) {
        // 如果复选框选中
        if (this.$store.state.allPayeeList[i].select == true) {
          if (this.$store.state.allPayeeList[i].selectFlag == false) {
             this.hasSelected = true;
            var payeeObj = {
              AcNo: this.$store.state.allPayeeList[i].AcNo,
              AcName: this.$store.state.allPayeeList[i].Acname,
              GroupId: this.$store.state.GroupId
            };
            this.$store.state.groupManagement1.push(payeeObj);
            this.$store.state.newgroupManagement.push(payeeObj);
          }
        } 
      }
       if(this.$store.state.allPayeeList.length==0){
        return;
       }else if(this.hasSelectPayee2.length==this.$store.state.allPayeeList.length){
         wjalert.alert("已经没有可供选择的数据", "确定", data => {});
         return;
      }else if (this.hasSelected==false) {
        wjalert.alert("请至少选择一条数据", "确定", data => {});
      } else {
        this.jump("/groupManagement1");
      }
    },

    checkAll() {
      if (this.$store.state.groupManagement1.length != 0) {
        if (this.$store.state.noSelectPayee2.length == 0) {
          return;
        }
      }else{
        if (this.$store.state.allPayeeList.length == 0) {
          return;
        }
      }  
      this.check1 = true;
      // 全选按钮选中时
      if (this.check1 == true) {
        for (let i in this.$store.state.allPayeeList) {
          this.$store.state.allPayeeList[i].select = true;
        }
      }
    },
    // 重置
    reset() {
      for (let i in this.$store.state.allPayeeList) {
        // 复选框选中
        if (this.$store.state.allPayeeList[i].select == true) {
          {
            // 且满足selectFlag=false
            if (this.$store.state.allPayeeList[i].selectFlag == false) {
              this.$store.state.allPayeeList[i].select = false;
            }
          }
        }
      }
      // 全选按钮不选
      this.check1 = false;
    },
    // 跳转到新增收款人页
    addPayee1() {
      this.jump("/addPayee1");
    }
  }
};
</script>
<style scoped>
.addMembers {
  background-color: rgba(255, 255, 255, 1);
}
.wrapper {
  padding-left: 30px;
  padding-right: 30px;
}
.wrapper_box {
  height: 60px;
  border-radius: 8px;
  border-width: 1px;
  border-color: rgba(221, 221, 221, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
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
.add {
  padding-left: 30px;
  padding-right: 30px;
}
.add_content {
  height: 88px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-width: 1px;
  border-color: rgba(234, 234, 234, 1);
  border-radius: 12px;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-left: 24px;
}
.add_box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.arrow_img {
  margin-right: 20px;
  width: 14px;
  height: 24px;
}
.section_item_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.section_item_desc {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.text_acname {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.arrow_img1 {
  margin-right: 20px;
  width: 26px;
  height: 26px;
}
.checkbox {
  width: 50px;
  height: 50px;
}
.info {
  position: fixed;
  bottom:196px;
  left: 0;
  right:0;
}
.info_item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 1);
}
.info_item_left {
  width: 118px;
  height: 142px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bank_img {
  width: 64px;
  height: 64px;
}
.info_item_right {
  width: 632px;
  height: 142px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  filter: blur(0px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  align-items: center;
  padding-right: 30px;
}
.text_acno {
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
  margin-top: 15px;
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
.section_item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.dissolution {
  width: 375px;
  height: 88px;
  line-height: 88px;
  text-align: center;
background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  opacity: 0.5;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
}
.save {
  width: 375px;
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
.add_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.all_select {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
  margin-left: 20px;
}
.section_bottom{
   position: fixed;
  bottom:0;
  left: 0;
  right:0;
}
</style>
