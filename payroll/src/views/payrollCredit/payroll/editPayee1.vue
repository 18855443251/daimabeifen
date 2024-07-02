<template>
  <div>
    <nav-bar title="编辑收款人"></nav-bar>
    <div class="newPayee">
      <div class="payeeList">
        <div class="payeeList_item">
          <text class="payeeList_title">收款户名</text>
          <input
            type="text"
            v-model="Acname"
            placeholder="请输入收款户名"
            :class="[Acname? 'input2' : 'input1']"
             @change="changeAcname"
            @focus="onFocus1"
            @blur="onBlur1"
            autofocus="false"
          />
        </div>
        <div class="payeeList_item">
          <text class="payeeList_title">收款账号</text>
          <input
            type="number"
            v-model="AcNo"
            placeholder="请输入收款账号"
            :class="[AcNo ? 'input2' : 'input1']"
            @change="changeAcno"
            @focus="onFocus2"
            @blur="onBlur2"
          />
        </div>
        <div class="text_gray"></div>
        <div class="payeeList_item">
          <text class="payeeList_title">金额(元)</text>
          <div>
            <text class="chiamount" v-if="Amount >= 1000">|{{ changeAmountUnit(Amount) }}</text>
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
             @change="changeRemark"
            @focus="onFocus3"
            @blur="onBlur3"
          />
        </div>
      </div>
      <div class="btn">
        <text class="btn_text" @click="delete1">删除</text>
        <text  @click="confirm" :class="[isShow==true?'add_text':'add_gray']">确认修改</text>
      </div>
      <div class="hint">
        <text class="hint_title">温馨提示</text>
        <text class="hint_desc">代发收款账号仅支持本行账号，非本行账号不支持</text>
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
      Acname:"",
      // 收款账号
      AcNo: "",
      // 金额
      Amount: "",
      // 备注
      Remark:"",
      // 格式化之前的账号
      PayeeAcNo: "",
      isShow:true,
      // 金额正则匹配
      stringRegex: "^(([0]|(0[.]\\d{0,2}))|([1-9]\\d{0,12}(([.]\\d{0,2})?)))?$",
      // 控制一进去编辑收款人页面确认修改按钮的颜色，刚进去收款户名不能失去焦点
      inputFlag:0
    };
  },
  created() {
      var reg = /^(([0]|(0[.]\d{0,2}))|([1-9]\d{0,12}(([.]\d{0,2})?)))?$/;
      // 用于上传的excel中金额不匹配金额格式，从代发录入页跳到编辑收款人页，把金额置为空，
       if (!reg.test(this.$store.state.editPayeeItem.Amount)) {
         this.Amount=""
       }else{  
          this.Amount = this.$store.state.editPayeeItem.Amount;
       }
        this.Acname=this.$store.state.editPayeeItem.PayeeAcName;
        this.AcNo=this.$store.state.editPayeeItem.PayeeAcNo;
        if (this.AcNo = this.$store.state.editPayeeItem.PayeeAcNo) {
          this.PayeeAcNo = this.$store.state.editPayeeItem.PayeeAcNo;
        }
        this.Remark=this.$store.state.editPayeeItem.Remark;
  },
  methods: {
    // 安卓剪切不会清空账号和户名，苹果可以
    //账号和户名获得焦点，确认按钮变灰，失去焦点，确认按钮变红，一开始进去页面确认按钮是红的
    // 只要用户点击收款户名和收款账号的输入框，确认按钮变灰
    onFocus1(){
      if (weex.config.env.platform != 'iOS') {
        if(this.inputFlag == 0||this.inputFlag==1){
        this.inputFlag++; 
        return;
      }
      }
     this.isShow=false;
    },
    // 输入框失去焦点
    onBlur1(){
    this.isShow=true;
    },
    onFocus2(){
     this.isShow=false;
    },
    onBlur2(){
    this.isShow=true;
    },
    onFocus3(){
     this.isShow=false;
    },
    onBlur3(){
    this.isShow=true;
    },
    changeAcname(event){
       this.Acname = event.value;
    },
    changeAcno(event){
      this.AcNo = event.value;
      this.PayeeAcNo = this.AcNo.replace(/[\s]/g, "");
      this.AcNo = this.PayeeAcNo.replace(/(\d{4})(?=\d)/g, "$1 ");
    },
    changeRemark(event){
    this.Remark= event.value;
    },
    inputMoney(event) {
        this.Amount = event.value;
    },
    // 确认修改按钮
    confirm() {
      // 如果按钮置灰，不可点击按钮
      if(this.isShow==false){
         return;
      }
      if(this.Remark.length>8){
         wjalert.alert("备注最多8位", "确定", data => {});
            return;
      }
      // 如果当前输入的账号不等于代发录入页传过来的账号
      if (this.PayeeAcNo != this.$store.state.editPayeeItem.PayeeAcNo) {
        for (var i = 0; i < this.$store.state.payrollEntry.length; i++) {
          // 如果当前输入的账号等于除了代发录入页传过来的其他账号
          if (this.PayeeAcNo == this.$store.state.payrollEntry[i].PayeeAcNo) {
            // 输入框输入的账号和代发录入页的账号重复，就表示收款人已经存在
            wjalert.alert("收款人已经存在，请重新修改", "确定", data => {});
            return;
          }
        } 
          this.edited();
      } else {
        this.edited();
      }
    },
    edited() {
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
        }else {
          this.post(
            // 修改收款人
            "/eweb/checkAcNoAndName.do",
            {
              PayeeAcName: this.Acname,
              PayeeAcNo: this.PayeeAcNo,
              Amount: "",
              Remark: ""
            },
            response => {
              if (response.data.Flag == "1") {
                // 录入页的户名改变
                this.$store.state.editPayeeItem.PayeeAcName = this.Acname;
                // 将代发录入页的标红字部分去掉
                this.$store.state.editPayeeItem.errorMsg = "",
                  // 录入页的账号改变
                this.$store.state.editPayeeItem.PayeeAcNo = this.PayeeAcNo;
                // 用于代发录入页的删除按钮，恢复原样
                this.$store.state.editPayeeItem.flag = "1";
                // 金额
                this.$store.state.editPayeeItem.Amount = this.Amount;
                // 备注
                this.$store.state.editPayeeItem.Remark = this.Remark;
                 for(let j in this.$store.state.excelList){
               if(this.$store.state.excelList[j].PayeeAcNo==this.$store.state.editPayeeItem.PayeeAcNo){
               this.$store.state.excelList.splice(j,1);
              }
            }
                wjalert.alert("修改成功", "确定", data => {
                  this.jump("/payrollEntry");
                });
              } else {
                wjalert.alert(response.data.Msg, "确定", data => {});
              }
            }
          );
        }
    },
    // 删除按钮
    delete1() {
      this.post(
          // 删除收款人
          "/eweb/DeletActInfo.do",
          {
            UpdPayeelist: [
              {
                Acname: this.$store.state.editPayeeItem.PayeeAcName,
                AcNo: this.$store.state.editPayeeItem.PayeeAcNo
              }
            ]
          },
          response => {
            if (response.data.Deleflag == "1") {
              // 删除录入页的一条
              var index1 = this.$store.state.payrollEntry.indexOf(
                this.$store.state.editPayeeItem
              );
              this.$store.state.payrollEntry.splice(index1, 1);
           for(let j in this.$store.state.excelList){
           if(this.$store.state.excelList[j].PayeeAcNo==this.$store.state.editPayeeItem.PayeeAcNo){
               this.$store.state.excelList.splice(j,1);
            }
            }
              wjalert.alert("删除成功", "确定", data => {
                this.jump("/payrollEntry");
              });
            } else {
              wjalert.alert("删除失败", "确定", data => {});
            }
          }
        );
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
.add_gray{
 width: 325px;
  height: 88px;
  line-height: 88px;
  text-align: center;
 /* background-image: linear-gradient( to right,rgb(179, 169, 170),rgb(163, 158, 159)); */
  background-image: linear-gradient( to right,rgb(221, 221, 221),rgb(221, 221, 221));
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
