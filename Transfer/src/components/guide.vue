<template>
 <div class="container center" v-if="guideing">
        <div class="loading" @click="clickClose"> 
            <image :src='guideUrl' class="guideUrl"/>
        </div>
  </div>
</template>
<script >
const context =weex.requireModule('context')
export default { 
  data() {
    return {
       guideUrl:this.$store.state.imgBaseUrl + "zhuanzhangguide@3x.png",
       guideing:false
    }
  },
  created() {
    setTimeout(()=>{
       this.showGuide();
    },200)
  },
  methods: {
    //显示引导图
     showGuide(){
     let label = context.secureGetString("showGuide");
     if(!label){
          this.guideing = true;
      }
     },
   //点击关闭引导图
   clickClose(){
        this.guideing = false;
        context.secureSetString("showGuide",'showGuide');
      }
  }
}
</script>
<style scoped>
 .container {
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.3);
}
.loading{
  margin-top: 140px;
}
.guideUrl{
  width: 730px;
  height: 939px;
}
</style>
