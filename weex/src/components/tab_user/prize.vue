<template>
  <div class="mask" :style="{'height':main_height}" @click="prizeIsBol">
    <div class="img_box">
      <image class="prizeImage" :src="prizeImg" @click="goWebView"></image>
    </div>
  </div>
</template>

<script>
const context = weex.requireModule("context");
const modal = weex.requireModule('modal')
export default {

  data() {
    return {
      prizeImg: "./imgs/other/prize.png",
    };
  },
  methods: {
    prizeIsBol(){
      this.$store.state.AutoLoginUrl = ""; 
    },
    goWebView(){
      context.launchStage("main.webPrize");
    }
  },
  computed:{
     main_height:function(){
       var height = 750/weex.config.env.deviceWidth*weex.config.env.deviceHeight;
       return height;
     }
  },
  watch: {
    
  }
}
</script>

<style scoped>
.img_box{
  width: 600px;
  height: 750px;
}
.mask{
  width:750px;
  background-color: rgba(22, 20, 20, 0.9);
  position:fixed;
  top:0px;
  left:0px;
  justify-content: center;
  align-items: center;
}
.prizeImage{
  width: 600px;
  height: 750px;
}
</style>

