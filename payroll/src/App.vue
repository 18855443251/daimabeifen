<template>
  <div @clickbackitem="goBack"  @viewappear="viewappear">
    <!--主界面-->
      <router-view style="flex:1;background-color:#fff"></router-view>
  </div>
</template>
<script>
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
export default {
  data() {
    return {};
  },
  created() {
     
  },
  methods:{
    viewappear(event){
      this.$store.state.BankId   = context.sessionGetString("BankId");
      this.$store.state.BankName = context.sessionGetString("BankName");    
      this.$store.state.BankCode = context.sessionGetString("BankCode");  
      this.$store.state.TotalBankCode = context.sessionGetString("TotalBankCode");
      this.$store.state.cityCode = context.sessionGetString("cityCode");  
      this.$store.state.LName    = context.sessionGetString("LName");
      this.$store.state.DrecCode = context.sessionGetString("DrecCode");
       this.$store.state.AcName    = context.sessionGetString("AcName");
      this.$store.state.AcNo = context.sessionGetString("AcNo");
      //  this.$store.state.bookAcNo = context.sessionGetString("bookAcNo");
      if(context.secureGetString("CertFlag") == "0") {
          this.$store.state.isRandom = false;
          this.$store.state.i++;
       };
      //获取登录里返回的账号保护标识
      if(context.sessionGetString("AcNoProtect")=='Y'){
        this.$store.state.accountProtect = true;
      }else{
        this.$store.state.accountProtect = false;
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
