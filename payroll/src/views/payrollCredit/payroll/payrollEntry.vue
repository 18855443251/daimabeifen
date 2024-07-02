<template>
  <div>
    <nav-bar title="代发录入"></nav-bar>
    <div class="payrollEntry">
      <div class="wrapper">
        <div class="wrapper_content">
          <div class="wrapper_box" @click="fileParsing">
            <image :src="excelImg" class="wrapper_img" />
            <text class="wrapper_title">Excel文件导入</text>
          </div>
          <div class="wrapper_box" @click="newPayee">
            <image :src="payeeImg" class="wrapper_img" />
            <text class="wrapper_title">新建收款人</text>
          </div>
          <div class="wrapper_box" @click="myPayroll">
            <image :src="mingceImg" class="wrapper_img" />
            <text class="wrapper_title">代发名册选择</text>
          </div>
        </div>
      </div>
      <div class="text_gray"></div>
      <div class="excel" v-if="$store.state.isDaoruShow">
        <text class="excel_name">{{ellipsis($store.state.fileName, 30)}}</text>
        <text class="excel_title" @click="openDaoru">取消导入</text>
      </div>
      <div class="info" @click="openMoney">
        <text class="info_title">已选收款人信息</text>
        <text :class="[strokeCount <= 0 ? 'money_gray' : 'money_blue']">设置相同金额</text>
      </div>
      <div class="money">
        <text class="money_title">共{{ strokeCount }}笔</text>
        <text class="money_money">总额：¥{{ totalMoney }}</text>
      </div>
      <div class="fail" v-if="$store.state.isFailClose">
        <div class="fail_left">
          <image :src="failImg" class="fail_img" />
          <text class="fail_title">{{ errPenNum }}笔收款人信息有误，请核对检查修改后提交</text>
        </div>
        <image :src="xImg" class="x_img" @click="close" />
      </div>
      <list class="jilu" :style="{ top: main_height + 'px' }">
        <cell>
          <div
            :class="[item.hideShow == '1' ? 'jilu_item1' : 'jilu_item2']"
            v-for="(item, index) in $store.state.payrollEntry"
            :key="index"
            @click="editPayee1(item)"
            @swipe="goRight($event, index)"
          >
            <div class="jilu_item_left">
              <image v-if="BankId" :src="imgdata(BankId)" class="bank_img" />
            </div>
            <div class="jilu_item_middle">
              <div class="jilu_item_box_text box1">
                <text class="jilu_title">{{ellipsis(item.PayeeAcName, 8)}}</text>
                <text :class="[!item.Amount||Number(item.Amount)==0? 'amount_red' : 'jilu_amount']">¥ {{ moneyFilter(item.Amount) }}</text>
              </div>
              <div class="jilu_item_box_text box2">
                <text class="text_title">{{ divieBanks(item.PayeeAcNo) }}</text>
                <text :class="[item.Remark.length > 8 ? 'jilu_red' : 'jilu_desc']">{{ ellipsis(item.Remark, 8) }}</text>
              </div>
              <div class="jilu_item_box_text box3">
                <text class="fail_desc">{{ item.errorMsg }}</text>
              </div>
            </div>
            <div class="jilu_item_right">
              <text class="delete" @click="deleteItem(item, index)">删除</text>
            </div>
          </div>
        </cell>
      </list>
      <div class="section_bottom">
        <div :class="[errPenNum>0||strokeCount==0 ? 'gray' : 'next']" @click="selectpaymentAccount">
          <text class="next_btn">下一步</text>
        </div>
      </div>
      <daoru></daoru>
      <money Mflag="1"></money>
      <promptShow></promptShow>
      <resetDaoru></resetDaoru>
    </div>
  </div>
</template>
<script>
import NavBar from "../../../components/titlebar_component4.vue";
import money from "../../../components/money.vue";
import daoru from "../../../components/daoru.vue";
import promptShow from "../../../components/promptShow.vue";
import resetDaoru from "../../../components/resetDaoru.vue";
const wjalert = weex.requireModule("weex-alert");
const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const uploadFile = weex.requireModule("weex-UploadFile");
export default {
  components: {NavBar,money,daoru,promptShow,resetDaoru},
  data() {
    return {
      excelImg: this.$store.state.imgBaseUrl + "1.png",
      payeeImg: this.$store.state.imgBaseUrl + "2.png",
      mingceImg: this.$store.state.imgBaseUrl + "3.png",
      failImg: this.$store.state.imgBaseUrl + "9.png",
      xImg: this.$store.state.imgBaseUrl + "10.png",
      xImg1: this.$store.state.imgBaseUrl + "19.png",
      BankId: "9999",
      // 从其他页面带过来的收款人
      oldList: [],
      // 导入的excel
      newList: [],
      // 所有收款人
      allList: [],
       // 收款人信息有误列表
      flagList: [],
      // 备注超过八个字列表
      remarkList: [],
      // 金额为空列表
      amountList:[],
      // 金额为0列表
      zeroList:[],
      // 错误笔数
      errPenNum: 0,
    };
  },
  created() {
    // 确定取消导入关闭
    this.$store.state.isDaoruReset = false;
    // 备注弹框隐藏
    this.$store.state.isshowRemark = false;
    // 金额弹框隐藏
    this.$store.state.isshowMoney = false;
    // 用于代发录入页数组去重，从另一个页面新增收款人，修改收款人，跳到代发录入页需要去重
    uploadFile.getExcel(data=>{
      if(data == "true"){
        this.fileParsing();
      }
    })
    this.removeData();
    this.nextBtn();
  },
  computed: {
    main_height() {
      // 从分组详情带过来的收款人且有错误笔数
      if (!this.$store.state.isDaoruShow&&this.$store.state.isFailClose == true) {
        var top = this.getPosiScrollerTop() + 492;
        return top;
        // 导入excel且有错误笔数
      }else if (this.$store.state.isDaoruShow==true&&this.$store.state.isFailClose == true) {
        var top = this.getPosiScrollerTop() + 580;
        return top;
        // 导入不为空的excel且没有错误笔数
      }else if (this.$store.state.isDaoruShow == true&&!this.$store.state.isFailClose) {
        var top = this.getPosiScrollerTop() + 512;
        return top;
      }else{
        var top = this.getPosiScrollerTop() + 424;
        return top;
      }
    },
    // 总金额
    totalMoney() {
      var reg = /^(([0]|(0[.]\d{0,2}))|([1-9]\d{0,12}(([.]\d{0,2})?)))?$/;
      var moneySum = 0;
      for (let i = 0; i < this.$store.state.payrollEntry.length; i++) {
        // excel上传不匹配的金额格式把总额置为空
        if (!reg.test(this.$store.state.payrollEntry[i].Amount)) {
          var m = "";
          return m;
        } else {
          var total = Number(this.$store.state.payrollEntry[i].Amount);
          // 处理计算金额精度丢失的问题
          var fomatTotal = this.formatFloat(total, 10);
          moneySum += fomatTotal;
          moneySum = this.formatFloat(moneySum, 10);
        }
        // 用于确认页提交给后台的金额格式不需要逗号
        this.$store.state.totalMoney = this.moneyFilter1(moneySum + "").replace(/,/g,"");
      }
      return this.moneyFilter1(moneySum + "");
    },
    //共多少笔
    strokeCount() {
      // 代发录入页需要用到
      this.$store.state.strokeCount = this.$store.state.payrollEntry.length;
      return this.$store.state.payrollEntry.length;
    }
  },
  methods: {
    // 文件上传
    fileParsing() {
      //excel一次都没导入
      if (this.$store.state.excelList.length == 0) {
        this.modify1();
      } else {
        this.$store.state.isDaoruReset = true;
      }
    },
  modify1() {
      // tyjf.szrcbank.com
      // 222.92.218.136:9998
      uploadFile.getFilePath("https://www.szrcb.com/eweb/checkExcelFile.do",data => {
         if(JSON.parse(data)._RejCode == "000000"){
           if(JSON.parse(data).List.length == 0){
            wjalert.alert("您上传的文件为空文件,请重新导入", "确定", data => {});
            return;
           }else{
            var beyondSum= this.$store.state.payrollEntry.length+ JSON.parse(data).List.length;
            if(beyondSum>100){
            wjalert.alert("上传条数不能超过100条", "确定", data => {})
            return;
            }else{
             var newArr = [];  
            //列表
            this.oldList = this.$store.state.payrollEntry;
            // 上传的excel
            this.newList = JSON.parse(data).List;
            for (let i in this.newList) {
              this.newList[i].Amount = this.newList[i].Amount + "";
              var newObj = {
                PayeeAcName: this.newList[i].PayeeAcName,
                PayeeAcNo: this.newList[i].PayeeAcNo.replace(/[\s]/g, ""),
                Remark: this.newList[i].Remark,
                Amount: this.newList[i].Amount,
                flag: this.newList[i].flag,
                errorMsg: this.newList[i].errorMsg,
                hideShow: "1"
              };
              newArr.push(newObj);
            }
            // 上传的excel表
            this.allList = newArr;
           // 取消导入展示
            this.$store.state.isDaoruShow = true;
            // 获取文件名字
            this.$store.state.fileName = JSON.parse(data).fileName;
            this.$store.state.payrollEntry = this.oldList.concat(this.allList);
            // 去重
            this.removeData();
            // 上传的excel，excel有可能在头，在尾，在中间，
            this.$store.state.excelList = this.$store.state.payrollEntry.slice(this.oldList.length,this.$store.state.payrollEntry.length);
            this.nextBtn();
            }
           }
          }else {
               if (JSON.parse(data)._RejCode == "888888" || JSON.parse(data)._RejCode == "777777") {
                  wjalert.alert(JSON.parse(data).errmsg, "确定", data => {
                                    context.sessionSetString("isLogin", "");
                                    context.sessionSetString('userinfo', '');
                                    context.clearToken();
                                    context.sessionSetString("nextScenes", "");
                                    context.replaceStage("main.login?flag=1");
                  })
              }else if(JSON.parse(data)._RejCode=="222222"){
                  wjalert.alert(JSON.parse(data).errmsg,"确定",data=>{
                      context.launchStage("main.reconciliation")
                  })
              }else {
                  wjalert.alert(JSON.parse(data).errmsg, "确定", data => { });
              }
          } 
        }
      );
    },
    test(){
     this.errPenNum--;
     if(this.errPenNum==0){
       this.$store.state.isFailClose=false;
     }
    },
    removeData() {
      var removeArr = [];
      var removeObj = {};
      for (var i = 0; i < this.$store.state.payrollEntry.length; i++) {
        if (!removeObj[this.$store.state.payrollEntry[i].PayeeAcNo]) {
          removeArr.push(this.$store.state.payrollEntry[i]);
          removeObj[this.$store.state.payrollEntry[i].PayeeAcNo] = true;
        }
      }
      this.$store.state.payrollEntry = removeArr;
      // 如果列表长度大于100
      if (this.$store.state.payrollEntry.length > 100) {
        // 截取前100条
        this.$store.state.payrollEntry = this.$store.state.payrollEntry.slice(0,100);
        wjalert.alert("您的数据大于100条", "确定", data => {});
      }
    },
    showAlert(){
      // 没导入excel
      if (this.strokeCount == 0&&this.$store.state.excelList.length == 0&&this.errPenNum==0) {
      // 取消导入隐藏
      this.$store.state.isDaoruShow = false;
      // 错误弹框关闭
      this.$store.state.isFailClose = false;
      // 从分组详情带过来的收款人没有错误笔数
    }else if (this.strokeCount>0&&this.$store.state.excelList.length == 0&&this.errPenNum == 0) {
        this.$store.state.isDaoruShow = false;
        this.$store.state.isFailClose = false;
        // 从分组详情带过来的收款人有错误笔数
      }else if (this.strokeCount>0&&this.$store.state.excelList.length == 0&&this.errPenNum > 0) {
        this.$store.state.isDaoruShow = false;
        this.$store.state.isFailClose = true;
        // 导入的excel没有错误笔数
      }else if (this.strokeCount>0&&this.$store.state.excelList.length>0&&this.errPenNum == 0) {
        this.$store.state.isDaoruShow = true;
        this.$store.state.isFailClose = false;
        // 导入的excel有错误笔数
      }else if (this.strokeCount>0&&this.$store.state.excelList.length>0&&this.errPenNum> 0) {
        this.$store.state.isDaoruShow = true;
        this.$store.state.isFailClose = true;
      } else {
        this.$store.state.isFailClose = false;
          this.$store.state.isDaoruShow = false;
      }
    },
    nextBtn() {
       var errSum=0;
      for (let i in this.$store.state.payrollEntry) {
        if (this.$store.state.payrollEntry[i].flag == "2") {
        errSum++;
        }
      }
       this.errPenNum=errSum;
        this.showAlert();
    },
    //  跳转到新建收款人页
    newPayee() {
      this.jump("/newPayee");
    },
    // 跳转到全部收款人页
    myPayroll() {
      this.$store.state.bgBolU = 0;
      this.jump("/myPayroll");
    },
    // 取消导入弹框
    openDaoru() {
      this.$store.state.isDaoruCancel = true;
    },
    // 打开金额弹框
    openMoney() {
      if (this.strokeCount <= 0) {
        this.$store.state.isshowMoney = false;
      } else {
        this.$store.state.isshowMoney = true;
        // 已选项设置相同的金额
        this.$store.state.payeeSeleteNumber = this.strokeCount;
      }
    },
    // 关闭错误笔数弹框
    close() {
      this.$store.state.isFailClose = false;
    },
    // 跳转到编辑收款人页
    editPayee1(item) {
      this.$store.state.editPayeeItem = item;
      this.jump("/editPayee1");
    },
    // 跳转到代发录入页
    selectpaymentAccount() {
      // 金额里面有逗号，要把没有逗号的list传给后台，用于确认页中
      var arr6 = [];
      for (let i in this.$store.state.payrollEntry) {
        var payeeObj = {
          PayeeAcName: this.$store.state.payrollEntry[i].PayeeAcName,
          PayeeAcNo: this.$store.state.payrollEntry[i].PayeeAcNo,
          Remark: this.$store.state.payrollEntry[i].Remark,
          Amount: this.$store.state.payrollEntry[i].Amount.replace(/,/g, "")
        };
        arr6.push(payeeObj);
        if(!this.$store.state.payrollEntry[i].Amount||Number(this.$store.state.payrollEntry[i].Amount)==0){
          return;
        }
      }
      this.$store.state.payrollEntryList = arr6;
      // 只要收款人有错误和笔数为0的，按钮置灰，不可点击下一步
      if(this.errPenNum>0){
        return
      }else if (this.strokeCount == 0) {
        return;
      }else if (this.strokeCount > 100) {
        wjalert.alert("最多代发100笔", "确定", data => {});
        return;
      }else{
         this.jump("/selectpaymentAccount");
      }
    },
    // 左滑显示删除
    goRight(e, y) {
      if (e.direction == "left") {
        this.$store.state.payrollEntry[y].hideShow = "2";
      } else if (e.direction == "right") {
        this.$store.state.payrollEntry[y].hideShow = "1";
      }
    },
    // 删除收款人
    deleteItem(item, index) {
      this.$store.state.payrollEntry.splice(index,1);
      // 如果删除excel里面的一条，又新增一条和这一条一样的数据
      for (let j in this.$store.state.excelList) {
        if (this.$store.state.excelList[j].PayeeAcNo == item.PayeeAcNo) {
          this.$store.state.excelList.splice(j, 1);
        }
      }
      // 如果删除的是收款人信息有误那一条
      if (item.flag == "2") {
        this.errPenNum --;
      }else{
        this.errPenNum = this.errPenNum;
      }
       this.showAlert();
    }
  }
};
</script>
<style scoped>
.payrollEntry {
  background-color: rgba(255, 255, 255, 1);
}
.wrapper {
  padding-left: 30px;
  padding-right: 30px;
}
.wrapper_content {
  height: 178px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
 background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  box-shadow: 0px 0px 12px 2px rgba(230, 2, 44, 0.38);
  border-radius: 12px;
  margin-top: 20px;
  padding-left: 30px;
  padding-right: 30px;
}
.wrapper_box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.wrapper_img {
  width: 54px;
  height: 54px;
}
.wrapper_title {
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  margin-top: 24px;
}
.excel {
  height: 88px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
}
.excel_name{
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  width:560px;
}
.excel_title {
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(74, 137, 252, 1);
}
.info {
  height: 88px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}
.info_money {
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
}
.money {
  height: 88px;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  filter: blur(0px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 30px;
  padding-right: 30px;
}
.money_money {
  font-size: 32px;
  font-family: PingFang-SC-Bold, PingFang-SC;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}

.fail {
  height: 68px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 236, 225, 1);
  padding-left: 30px;
  padding-right: 30px;
}
.fail_left {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}
.fail_img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}
.x_img {
  width: 28px;
  height: 28px;
}
.fail_title {
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(248, 124, 54, 1);
}
.jilu{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 88px;
}
.jilu_item1 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 1050px;
  height: 188px;
  overflow: hidden;
}
.jilu_item2 {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 1050px;
  overflow: hidden;
  height: 188px;
  left: -300px;
}
.jilu_item_left {
  width: 118px;
  height: 142px;
  display: flex;
  align-items: center;
}
.jilu_item_middle {
  width: 632px;
  /* height: 162px; */
  height: 188px;
  filter: blur(0px);
  display: flex;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: rgba(234, 234, 234, 1);
  padding-right: 30px;
}
.jilu_item_right {
  width: 300px;
  height: 188px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.box1 {
  margin-bottom: 15px;
}
.box3{
  margin-top: 15px;
}
.delete {
  width: 300px;
  height: 188px;
  text-align: center;
  line-height: 162px;
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  background-color: red;
}
.jilu_item_box_text {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.bank_img {
  width: 64px;
  height: 64px;
  margin-top: 25px;
}
.jilu_red {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(230, 2, 44, 1);
}
.jilu_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.text_red {
  font-size: 32px;
  font-family: DINAlternate-Bold, DINAlternate;
  font-weight: bold;
  color: rgba(230, 2, 44, 1);
}
.text_title {
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.jilu_desc {
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(124, 124, 124, 1);
}
.jilu_amount {
  font-size: 32px;
  font-family: DINAlternate-Bold, DINAlternate;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
.amount_red {
  font-size: 32px;
  font-family: DINAlternate-Bold, DINAlternate;
  font-weight: bold;
  color: rgba(230, 2, 44, 1);
}
.next {
  height: 88px;
  background-image: linear-gradient(to right, rgba(251, 93, 122, 1), rgba(230, 2, 44, 1));
  display: flex;
  justify-content: center;
  align-items: center;
}
.gray {
  height: 88px;
  /* background-image: linear-gradient( to right,rgb(179, 169, 170),rgb(163, 158, 159)); */
  background-image: linear-gradient( to right,rgb(221, 221, 221),rgb(221, 221, 221));
  display: flex;
  justify-content: center;
  align-items: center;
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
.text_gray {
  height: 20px;
  background-color: rgba(249, 249, 249, 1);
  margin-top: 30px;
}
.money_gray {
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgb(179, 169, 170);
}
.money_blue {
  font-size: 28px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(74, 137, 252, 1);
}

.info_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.money_title {
  font-size: 30px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.section_bottom{
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.fail_desc {
  font-size: 26px;
  font-family: PingFang-SC-Medium, PingFang-SC;
  font-weight: 500;
  color: rgba(237, 70, 101, 1);
}
</style>
