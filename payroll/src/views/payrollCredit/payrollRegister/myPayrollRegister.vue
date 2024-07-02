<template>
  <div>
    <nav-bar title="代发名册" edit="编辑" v-if="bgBol == 0"></nav-bar>
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
      <fullpayee v-if="bgBol == 0"></fullpayee>
      <group v-if="bgBol == 1"></group>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component1.vue";
import group from "./group.vue";
import fullpayee from "./FullPayee.vue";
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
export default {
  components: { NavBar, group, fullpayee },
  data() {
    return {
      searchImg: this.$store.state.imgBaseUrl + "14.png",
      navData: [{ name: "全部收款人" }, { name: "分组" }],
      bgBol: this.$store.state.bgBolG,
      likeName: "",
      arrPayee2: []
    };
  },
  methods: {
    clickType(index) {
      this.bgBol = index;
      if (this.bgBol == 0) {
        this.likeName = "";
      } else {
        this.likeName = "";
      }
    },
    queryPayeeInfo() {
      // 查询全部收款人
      if (this.bgBol == 0) {
        this.post(
          "/eweb/ActInfoQry.do",
          {
            LikeName: this.likeName
          },
          response => {
            // 查回来的全部收款人
            this.arrPayee2 = this.$store.state.allCode2;
            // 搜索回来的收款人
            this.$store.state.allPayeeList = response.data.List;
            // 户名和账号为空时
            if (this.likeName == "") {
              // 展现全部记录
              this.$store.state.allPayeeList = this.arrPayee2;
              // 全部收款人和搜索回来的收款人比较
              for (let i in this.$store.state.allPayeeList) {
                for (let j in this.$store.state.queryCode2) {
                  if (
                    this.$store.state.queryCode2[j].AcNo ==
                    this.$store.state.allPayeeList[i].AcNo
                  ) {
                    if (this.$store.state.queryCode2[j].select == true) {
                      this.$set(
                        this.$store.state.allPayeeList[i],
                        "select",
                        true
                      );
                      this.$set(
                        this.$store.state.allPayeeList[i],
                        "selectFlag",
                        false
                      );
                      // 金额存在
                      if (this.$store.state.queryCode2[j].Amount) {
                        this.$store.state.allPayeeList[
                          i
                        ].Amount = this.$store.state.queryCode2[j].Amount;
                      }
                      // 备注存在
                      if (this.$store.state.queryCode2[j].Remark) {
                        this.$store.state.allPayeeList[
                          i
                        ].Remark = this.$store.state.queryCode2[j].Remark;
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
                       if (this.$store.state.queryCode2[j].Amount) {
                        this.$store.state.allPayeeList[
                          i
                        ].Amount = this.$store.state.queryCode2[j].Amount;
                      }
                      if (this.$store.state.queryCode2[j].Remark) {
                        this.$store.state.allPayeeList[
                          i
                        ].Remark = this.$store.state.queryCode2[j].Remark;
                      }
                    }
                  }
                }
              }
            } else {
              // 搜索回来的收款人和全部收款人比较
              for (let i in this.$store.state.allPayeeList) {
                for (let j in this.arrPayee2) {
                  if (
                    this.arrPayee2[j].AcNo ==
                    this.$store.state.allPayeeList[i].AcNo
                  ) {
                    if (this.arrPayee2[j].select == true) {
                      this.$set(
                        this.$store.state.allPayeeList[i],
                        "select",
                        true
                      );
                      this.$set(
                        this.$store.state.allPayeeList[i],
                        "selectFlag",
                        false
                      );
                      if (this.arrPayee2[j].Amount) {
                        this.$store.state.allPayeeList[
                          i
                        ].Amount = this.arrPayee2[j].Amount;
                      }
                      if (this.arrPayee2[j].Remark) {
                        this.$store.state.allPayeeList[
                          i
                        ].Remark = this.arrPayee2[j].Remark;
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
                      if (this.arrPayee2[j].Amount) {
                        this.$store.state.allPayeeList[
                          i
                        ].Amount = this.arrPayee2[j].Amount;
                      }
                      if (this.arrPayee2[j].Remark) {
                        this.$store.state.allPayeeList[
                          i
                        ].Remark = this.arrPayee2[j].Remark;
                      }
                    }
                  }
                }
              }
              this.$store.state.queryCode2=this.$store.state.allPayeeList;
            }
          }
        );
      } else {
        // 查询分组信息
        this.post(
          "/eweb/DFActAccessQry.do",
          {
            LikeName: this.likeName
          },
          response => {
            this.$store.state.group = response.data.FZQryList;
            for (let i in this.$store.state.group) {
              this.$set(this.$store.state.group[i], "select", false);
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
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
  margin-bottom: 20px;
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
  display: flex;
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