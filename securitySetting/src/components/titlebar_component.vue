<template>
<div>
  <div :style="getStatusHeight" class="nav"></div>
  <div class="header" >
    
    <div class="title-left">
      <div v-if="leftElement.exist">
        <div class="backDiv" v-if="leftElement.back.exist" @click="goBack">
          <image class="backImg" :src="leftElement.back.src"/>
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
      <div v-if="rightElement.exist">
         <div class="imgDiv" v-if="rightElement.login.exist" @click="goto(rightElement.login.url)">
          <image class="qrImg" :src="rightElement.login.src"/>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.nav{
  width: 750px;
}
.header {
  height: 90px;
  width: 750px;
  /* padding-top: 10px; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  padding-left: 20px;
  background-color:#ffffff;
  padding-right: 20px;
  border-bottom-width: 1px;
  border-bottom-color: #EAEAEA;
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
  font-family: PingFangSC-Medium;
  font-size: 34px;
  color: #333333;
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
</style>
<script>
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
const getphoneInfo = weex.requireModule("getPhoneInfo");
export default {
  props: {
    titleJson: {
      default: "titlebar.json"
    },
    title:{
      type:String,
      default:""
    }
  },
  data() {
    return {
      leftElement: {
        exist: true,
        back: {
          exist: true,
          src: this.$store.state.imgBaseUrl + "/back@3x.png",
          url: ""
        },

      },
      centerElement: {
        exist: true,
        title: {
          exist: true,
        },
        logo: {
          exist: false,
          src: "./imgs/titlebar/logo.png",
          url: ""
        }
      },
      rightElement: {
        exist: false,
         login: {
          exist: false,
          src: "./imgs/more.png",
          url: ""
        }
      },
      bgcolor: "#ffffff",
      machineOS:""
    };
  },
  created() {
    //获取手机标识码
      // getphoneInfo.getPhoneInfo(data =>{
      //   this.machineOS=JSON.parse(data).machineOS;
      // })
  },
  methods: {
    // Back(){
    //   this.$emit('back')
    // },
    goto(id){
      if(this.machineOS=="Android"){
        this.$store.state.Devflag=false
      }
      context.launchStage(id)
    }
  }
};
</script>