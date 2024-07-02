<template>
  <div class="contariner">
      <nav-bar title="云盾密码设置" left-show="false"></nav-bar>
    <div class="top">
      <div class="yundunlogo">
          <image :src="fontBgUrl" class="yundunlogobg" />
          <text class="yundunlogotext">密码设置成功！</text>
      </div>
      <div class="yundunbuttondiv" @click="passwordconfirmover()">
          <text class="yundunbuttontext">完成</text>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contariner{
  width: 750px;
  height: 1334px;
  background-color: rgb(255,255,255);
}
.top {
  width:750px;
}
.yundunlogo {
  width: 750px;
  height: 270px;
  align-items: center;
  /* border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1); */
}
.yundunlogobg {
  width: 110px;
  height: 110px;
  margin-top:50px;
}
.yundunlogotext {
  margin-top: 20px;
  width: 750px;
  font-size:30px;
  font-family:PingFang-SC-Bold,PingFang-SC;
  font-weight:bold;
  color:rgba(51,51,51,1);
  text-align: center;
}
.yundunbuttondiv {
  margin-left: 40px;
  width:670px;
  height:100px;
  margin-top: 200px;
  border-radius:12px;
  background-image: linear-gradient(to right,rgba(251,93,122,1),rgba(230,2,44,1));
}
.yundunbuttontext {
  line-height: 100px;
  text-align: center;
  font-size:32px;
  font-family:PingFang-SC-Bold,PingFang-SC;
  font-weight:bold;
  color:rgba(255,255,255,1);
}
</style>

<script>
import NavBar from "../components/titlebar_component.vue";
const context = weex.requireModule("context");
export default {
  components: {
    NavBar
  },
  data() {
    return {
      isClick:true,
      fontBgUrl: this.$store.state.imgBaseUrl + "results@2x.png",
    };
  },
  methods: {
    passwordconfirmover() {
      if(this.isClick){
        this.isClick = false;
        if(this.$store.state.isGopasswordsetting == "1"){
          this.$router.go(-2);
        }else{
            this.$router.go(-3);
        }  
      }
      //  if (context.sessionGetString("certdownload") == "true") {
      //   context.sessionSetString("pinState","2");
      //   context.secureSetString("CertFlag", "0");
      //   context.finish();
      // } else {
      //   context.secureSetString("CertFlag", "0");
      //   this.goBackPath("/cloudshieldmanagement");
      // }
     
    }
  }
};
</script>

