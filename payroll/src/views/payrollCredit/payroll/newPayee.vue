<template>
  <div>
    <nav-bar title="新建收款人"></nav-bar>
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
        <div class="text_gray"></div>
        <div class="payeeList_item">
          <text class="payeeList_title">金额(元)</text>
          <div>
            <text class="chiamount" v-if="Amount >= 1000"
              >|{{changeAmountUnit(Amount)}}</text
            >
            <price-input
              :textValue="Amount"
              @onChange="inputMoney"
              :stringRegex="stringRegex"
              placeholder="请输入代发金额"
              :class="[Amount? 'input2' : 'input1']"
              type="number"
              isTS="true"
            ></price-input>
          </div>
        </div>
        <div class="payeeList_item">
          <text class="payeeList_title">备注</text>
          <input
            type="text"
            v-model="Remark"
            placeholder="请输入备注(选填)"
            :class="[Remark? 'input2' : 'input1']"
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
      // 代发金额
      Amount: "",
      // 备注
      Remark: "",
      newPayeeList:[],
      // 格式化之前的账号
      PayeeAcNo: "",
      stringRegex: "^(([0]|(0[.]\\d{0,2}))|([1-9]\\d{0,12}(([.]\\d{0,2})?)))?$"
    };
  },
  created(){
    this.getPayeeInfo();
  },
  methods: {
    inputMoney(event) {
        this.Amount = event.value;
    },
   changeAcNo() {
      this.PayeeAcNo = this.AcNo.replace(/[\s]/g, "");
      this.AcNo = this.PayeeAcNo.replace(/(\d{4})(?=\d)/g, "$1 ");
    },
     getPayeeInfo() {
      // 获得收款人信息
      this.post("/eweb/ActInfoQry.do", {}, response => {
        this.$store.state.allPayeeList = response.data.List;
      });
    },
    // 完成按钮
    finish() {
      if (this.$store.state.allPayeeList.length < 100) {
        if (!this.Acname) {
          wjalert.alert("收款户名不能为空", "确定", data => {});
          return;
        } else if (!this.AcNo) {
          wjalert.alert("收款账号不能为空", "确定", data => {});
          return;
        }else if (!this.Amount) {
          wjalert.alert("金额不能为空", "确定", data => {});
          return;
        } else if (Number(this.Amount) == 0) {
          wjalert.alert("金额不能为0", "确定", data => {});
          return;
        }else if(this.Remark.length>8){
           wjalert.alert("备注最多8位", "确定", data => {});
          return;
        }else {
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
                wjalert.alert("新增成功", "确定", data => {
                  this.jump("/payrollEntry");
                });
                var obj = {
                  PayeeAcName: this.Acname,
                  PayeeAcNo: this.PayeeAcNo,
                  Amount: this.Amount,
                  Remark: this.Remark,
                  select: true,
                hideShow: "1",
                errorMsg: "",
                flag:"1"
                };
                this.$store.state.payrollEntry.push(obj);
                 this.$store.state.allPayeeList.length++;
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
    // 新建收款人
    addPayee() {
      if (this.$store.state.allPayeeList.length < 100) {
        if (!this.Acname) {
          wjalert.alert("收款户名不能为空", "确定", data => {});
          return;
        } else if (!this.AcNo) {
          wjalert.alert("收款账号不能为空", "确定", data => {});
          return;
        } else if (!this.Amount) {
          wjalert.alert("金额不能为空", "确定", data => {});
          return;
        } else if (Number(this.Amount) == 0) {
          wjalert.alert("金额不能为0", "确定", data => {});
          return;
        }else if(this.Remark.length>8){
           wjalert.alert("备注最多8位", "确定", data => {});
          return;
        }else {
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
                var obj1 = {
                  PayeeAcName: this.Acname,
                  PayeeAcNo: this.PayeeAcNo,
                  Amount: this.Amount,
                  Remark: this.Remark,
                  select: true,
                  hideShow: "1",
                  errorMsg: "",
                  flag:"1"
                };
                this.$store.state.payrollEntry.push(obj1);
                // 收款户名
                this.Acname = "";
                // 收款账号
                this.PayeeAcNo = "";
                this.AcNo = "";
                // 收款金额
                this.Amount = "";
                // 备注
                this.Remark = "";
                this.$store.state.allPayeeList.length++;
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
  height: 462px;
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
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
}
.payeeList_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.chiamount {
  font-size: 24px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(170, 170, 170, 1);
   margin-left: 400px;
}
</style>
