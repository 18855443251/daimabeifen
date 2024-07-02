<template>
<div>
    <div :style="getStatusHeight" class="nav"></div>
      <div class="header">
        <div class="title-left">
          <div v-if="isArrowBack">
            <div class="backDiv" @click="goBack">
              <image class="backImg" :src="leftElement.back.src" />
            </div>

          </div>
        </div>
        <div class="title-box">
          <div v-if="centerElement.exist">
            <div class="title-text-box" v-if="centerElement.title.exist">
              <text class="title">{{title}}</text>
            </div>

          </div>
        </div>
        <div class="title-right">
            <text class="addaccount" v-if="showpayee" @click="rightClick">{{rightTitle}}</text>
        </div>
      </div>
  </div>
</template>
<script>
const context = weex.requireModule("context")
const stream = weex.requireModule("stream")
export default {
  props: {
    title:{
      type:String,
      default:""
    },
    rightTitle:{
      type:String,
      default:""
    },
    showpayee:{
      type:Boolean,
      default:false
    },
    isArrowBack:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      leftElement: {
        exist: true,
        back: {
          exist: true,
          src: "./imgs/back@3x.png",
          url: ""
        },

      },
      centerElement: {
        exist: true,
        title: {
          exist: true,
        }
      },
      rightElement: {
        exist: false,
       },
      bgcolor: "#ffffff",
      machineOS:""
    }
  },
  methods: {
       //添加收款人
       rightClick(){
         this.$emit("rightClick");
       },
   }
}
</script>
<style scoped>
.nav{
  width: 750px;
  background-color: #ffffff;
}
.header {
  height: 90px;
  width: 750px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom-width:1px;
  border-bottom-color:rgba(234, 234, 234, 1);
  background-color: #ffffff;
}
.bgclass {
  position: absolute;
  /* width: 1080px;
  height: 116px; */
  width: 750px;
  height: 100px;
}
.title-left {
  flex: 1;
  position: relative;
}
.imgDiv {
  height: 100px;
  width: 80px;
  justify-content: center;
  /* align-items: center; */
}
.backDiv {
  height: 100px;
  flex-direction: row;
  /* justify-content: center; */
  align-items: center;
}
.backImg {
  width: 40px;
  height: 40px;
  color: #ffffff;
}
.back-text {
  font-size: 34px;
  color: #00b9f4;
}
.qrImg {
  width: 50px;
  height: 10px;
}
.title-box {
  flex: 2;
}
.title {
  font-size: 36px;
  color:rgba(51,51,51,1);
  line-height:45px;
  font-weight: bold;
  letter-spacing: -0.64px;
  text-align: center;
}
.logo-box {
  flex: 1;
  justify-content: center;
  align-items: center;
}
.logo {

  width: 277px;
  height: 60px;
}
.title-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
}
.rightDiv {
  height: 100px;
  width: 80px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.codeImg {
  width: 62px;
  height: 62px;
}
.addaccount{
  height: 100px;
  line-height: 100px;
  font-size:32px;
  text-align: center;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(124,124,124,1);
}
</style>