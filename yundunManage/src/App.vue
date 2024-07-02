<template>
  <div @clickbackitem='goBack'  @viewappear="viewappear">
    <!--主界面-->
    <router-view style="flex:1"></router-view>
  </div>
</template>
<script>
  const modal = weex.requireModule('modal')
  const stream = weex.requireModule('stream')
  const context = weex.requireModule('context')
  // const picker = weex.requireModule("picker")
  // const weexhce = weex.requireModule("weex-hce")
  // const wjalert = weex.requireModule("weex-alert")
  export default {
    data () {
      return {}
    },
    created(){
      this.viewappear();
    // weexhce.getPaymentCards(data=>{
    //           if(JSON.parse(data).rejCode == '000000'){
    //                 this.jump('/mycloudfast'); 
    //           }else if(JSON.parse(data).rejCode == '888888'){
    //                 this.jump('/index'); 
    //           }
    //         })
      },
      methods: {
        viewappear(){
          this.$store.state.yundunFace = context.sessionGetString('yundunFace');
        },
      }
     }
</script>
<style>
body{
  margin: 0;
  padding: 0;
}
</style>

