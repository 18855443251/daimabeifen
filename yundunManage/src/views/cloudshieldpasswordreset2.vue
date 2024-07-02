<template>
  <div class="contariner">
    <nav-bar title="云盾密码重置"></nav-bar>
    <div class="yundundownload">
      <div class="yundunlogo" >
          <image :src="iconUrl" class="yundunlogoicon"/>
          <text class="yundunlogotext">重置成功</text>
          <!-- <text class="pstext">待其他操作员审核通过后，继续重置云盾密码</text> -->
      </div>
      <div class="yundunbuttondiv" @click="passwordconfirm()">
            <text class="yundunbuttontext">返回</text>
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
.yundundownload {
  width:750px;
  height:1206px;
  background-color: rgba(255,255,255,1);
}
.yundunlogo {
  width: 750px;
  height: 288px;
  align-items: center;
  /* border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1); */
}
.yundunlogoicon {
  width:110px;
  height: 110px;
  margin-top:50px;
}
.yundunlogotext {
  font-size:30px;
  margin-top:20px;
  font-weight:bold;
  color:rgba(51,51,51,1);
}
.pstext{
  font-size:28px;
  font-weight:500;
  margin-top:21px;
  color:rgba(124,124,124,1);
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
import NavBar from "../components/NavBar.vue";
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const cfcaPlugin = weex.requireModule("yunzhengtong"); //云证通
const loading = weex.requireModule("loading");
const stream = weex.requireModule("stream");
const wjalert = weex.requireModule("weex-alert");

export default {
  components: {
    NavBar
  },
  data() {
    return {
      isClick:true,
      fontBgUrl: this.$store.state.imgBaseUrl + "card_bg@2x.png",
      iconUrl: this.$store.state.imgBaseUrl + "results@2x.png",
      pinServerRandom: "",
      serverRandom: "",
      getRandomInfo: {},
      isOpen: "",
      isShow: true,
      data1: {},
      data2: {}
    };
  },
  mounted() {
    // this.isOpen = context.sessionGetString("pinState");
    // if (this.isOpen == "1") {
    //   this.isShow = true;
    // } else if (this.isOpen == "2") {
    //   wjalert.alert("您已设置云盾密码，请直接点击跳过", "确定", data => {});
    //   this.isShow = false;
    // } else if (this.isOpen == "3") {
    //   wjalert.alert(
    //     "云盾密码功能已锁定，暂不能使用，隔天自动解锁",
    //     "确定",
    //     data => {}
    //   );
    //   this.isShow = false;
    // }
  },

  methods: {
     passwordconfirm() {
      if(this.isClick){
        this.isClick = false;
        context.secureSetString("CertFlag", "0");
        this.$router.go(-2);
      }
      
     // this.goBackPath("/cloudshieldmanagement");
    }
  }
};
</script>


