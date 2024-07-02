<template>
  <div>
    <nav-bar title="新增收款人"></nav-bar>
    <div class="newPayee">
      <div class="payeeList">
        <div class="payeeList_item">
          <text class="payeeList_title">收款户名</text>
          <input
            type="text"
            v-model="Acname"
            placeholder="请输入收款户名"
            :class="[Acname? 'input2' : 'input1']"
          />
        </div>
        <div class="payeeList_item">
          <text class="payeeList_title">收款账号</text>
          <input
            type="number"
            v-model="AcNo"
            placeholder="请输入收款账号"
            :class="[AcNo? 'input2' : 'input1']"
            @input="changeAcNo"
          />
        </div>
      </div>
      <div class="btn">
        <text class="btn_text" @click="finish">完成</text>
        <text class="add_text" @click="addPayee">继续新增</text>
      </div>
      <div class="hint">
        <text class="hint_title">温馨提示</text>
        <text class="hint_desc"
          >代发收款账号仅支持本行账号，非本行账号不支持</text
        >
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component.vue";
const stream = weex.requireModule("stream");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: { NavBar },
  data() {
    return {
      // 收款户名
      Acname: "",
      // 收款账号
      AcNo: "",
      // 格式化之前的账号
      PayeeAcNo: "",
    };
  },
  created() {
    this.getPayeeInfo();
  },
  methods: {
     changeAcNo() {
     this.PayeeAcNo = this.AcNo.replace(/[\s]/g, "");
     this.AcNo = this.PayeeAcNo.replace(/(\d{4})(?=\d)/g, "$1 ");
    },
    getPayeeInfo() {
      //查询收款人信息
      this.post("/eweb/ActInfoQry.do", {}, response => {
        this.$store.state.allPayeeList = response.data.List;
      });
    },
    finish() {
      if (this.$store.state.allPayeeList.length < 100) {
        if (!this.Acname) {
          wjalert.alert("收款户名不能为空", "确定", data => {});
          return;
        } else if (!this.AcNo) {
          wjalert.alert("收款账号不能为空", "确定", data => {});
          return;
        } else {
          this.post(
            "/eweb/ActInfoActAccess.do",
            {
              AcName: this.Acname,
              AcNo: this.PayeeAcNo,
              Amount: "",
              Remark: ""
            },
            response => {
              if (response.data._RejCode == "000000") {
                wjalert.alert("新增成功", "确定", data => {
                  this.jump("/addMembers2");
                });
              } else {
                wjalert.alert(response.data.errmsg, "确定", data => {});
              }
            }
          );
        }
      } else {
        wjalert.alert("新增收款人已达上限", "确定", data => {});
      }
    },
    addPayee() {
      if (this.$store.state.allPayeeList.length < 100) {
        if (!this.Acname) {
          wjalert.alert("收款户名不能为空", "确定", data => {});
          return;
        } else if (!this.AcNo) {
          wjalert.alert("收款账号不能为空", "确定", data => {});
          return;
        } else {
          this.post(
            "/eweb/ActInfoActAccess.do",
            {
              AcName: this.Acname,
              AcNo: this.PayeeAcNo,
              Amount: "",
              Remark: ""
            },
            response => {
              var arr = [];
              if (response.data._RejCode == "000000") {
                wjalert.alert("新增成功", "确定", data => {});
                this.Acname = "";
                this.PayeeAcNo = "";
                this.AcNo = "";
              } else {
                wjalert.alert(response.data.errmsg, "确定", data => {});
              }
            }
          );
        }
      } else {
        wjalert.alert("新增收款人已达上限", "确定", data => {});
      }
    }
  }
};
</script>
<style scoped>
.newPayee {
  background-color: rgba(255, 255, 255, 1);
}
.payeeList {
  height: 222px;
  margin-top: 20px;
}
.payeeList_item {
  height: 110px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: 30px;
   margin-left: 30px;
}
.input1 {
  width: 550px;
  height: 60px;
  line-height: 60px;
  text-align: right;
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  /* font-weight: 500; */
  color: rgba(170, 170, 170, 1);
}
.input2 {
  width: 550px;
  height: 60px;
  line-height: 60px;
  text-align: right;
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  /* font-weight: 500; */
  color: rgba(124, 124, 124, 1);
}
.btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 100px;
}
.btn_text {
  width: 325px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  border-radius: 12px;
  border-width: 2px;
  border-color: rgba(230, 2, 44, 1);
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  /* font-weight: bold; */
  color: rgba(230, 2, 44, 1);
}
.add_text {
  width: 325px;
  height: 88px;
  line-height: 88px;
  text-align: center;
background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  border-radius: 12px;
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  /* font-weight: bold; */
  color: rgba(255, 255, 255, 1);
}
.hint {
  margin-top: 60px;
  width: 670px;
  height: 108px;
  margin-left: 40px;
}
.hint_title {
  font-size: 28px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(85, 85, 85, 1);
}
.hint_desc {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}

.payeeList_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
</style>
