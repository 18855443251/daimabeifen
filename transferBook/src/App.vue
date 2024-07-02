<template>
  <div @clickbackitem="goBack"  @viewappear="viewappear">
    <!--主界面-->
    <router-view style="flex:1"></router-view>
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
    // this.$store.dispatch("SET_STATUS_BAR_ACTION");
  },
  methods:{
    viewappear(event){
      this.$store.state.BankName = context.sessionGetString("BankName");    
      this.$store.state.BankCode = context.sessionGetString("BankCode");
    }
  }
};
</script>
