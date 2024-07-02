<template>
  <div @clickbackitem="goBack"  @viewappear="viewappear">
    <!--主界面-->
      <router-view style="flex:1;background-color:#fff"></router-view>
  </div>
</template>

<script>
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const wjalert = weex.requireModule("weex-alert");
export default {
  data() {
    return {};
  },
  created() {
     
  },
  methods:{
    viewappear(){
      this.$store.state.updateList=context.sessionGetString("updateList");
      //获取登录里返回的账号保护标识
      if(context.sessionGetString("AcNoProtect")=='Y'){
        this.$store.state.accountProtect=true;
      }else{
        this.$store.state.accountProtect=false;
      }
      //别的场景跳转回来的标志，0(从选择收款银行场景跳回)，1(从收款人登记簿列表或者收款人登记簿详情的立即转账跳回页面)
      let updateBankName=context.sessionGetString("updateBankName");
      if(updateBankName=='0'){
          this.$store.state.transferSubmitData.PayeeBankName = context.sessionGetString("BankName");//转账-收款方银行名称
          this.$store.state.transferSubmitData.PayeeBank = context.sessionGetString("BankCode");//转账-收款方银行序列号
          context.sessionSetString("updateBankName",'');//清空updateBankName
      }else if(updateBankName=='1'){
          if(context.sessionGetString("payeeDetail")){
            let payeeDetail=JSON.parse(context.sessionGetString("payeeDetail"));
            this.$store.state.transferSubmitData.PayeeAcNo = this.divieBanks(payeeDetail.PayeeAcNo);//转账-收款方账号
            this.$store.state.transferSubmitData.PayeeAcName = payeeDetail.PayeeAcName;//转账-收款方名称
            this.$store.state.cityCode = payeeDetail.ProCity;//转账-收款人城市码（用于查询网点名称列表）
            this.$store.state.transferSubmitData.PayeeProvince.Name=payeeDetail.ProvinceName;//收款人省份名称
            this.$store.state.transferSubmitData.PayeeCity.Name=payeeDetail.CityName;//收款人城市名称
            this.$store.state.transferSubmitData.PayeeNetName.Name=payeeDetail.LName;//收款人网点名称
            this.$store.state.transferSubmitData.PayeeNetName.Value=payeeDetail.BankCode;//有网点是收款人网点行号，没有网点则是总行行号（转账提交交易的重要字段）
            this.$store.state.transferSubmitData.PayeeBankName = payeeDetail.BankName;//转账-收款方银行名称
            this.$store.state.transferSubmitData.PayeeBank = payeeDetail.PayeeBank;//转账-收款方银行序列号（BankId:402）
            this.$store.state.transferSubmitData.mobilePhone=payeeDetail.Phone?payeeDetail.Phone:'';
            this.$store.state.transferSubmitData.SysFlag=payeeDetail.SysFlag;//收款人管理簿标识网点省市，网点名称是否可用（1可用）
            context.sessionSetString("updateBankName",'');//清空updateBankName
            // this.checkBankInner(payeeDetail.PayeeAcNo,this.$store.state.transferSubmitData.Amount,this.$store.state.transferSubmitData.ImmediatelyFlag);
            this.checkBankInner(payeeDetail.PayeeAcNo);
          }
      }
    }
  }
};
</script>
<style scope>
body{
  margin:0;
  padding:0;
}
</style>
