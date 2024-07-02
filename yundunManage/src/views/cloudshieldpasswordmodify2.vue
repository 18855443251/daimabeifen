<template>
  <div class="contariner">
    <nav-bar title="云盾密码设置"></nav-bar>
      <div class="top">
        <div class="yundunlogo">
            <image :src="fontBgUrl" class="yundunlogobg" />
            <text class="yundunlogotext">密码修改成功！</text>
        </div>
        <div class="yundunbuttondiv" >
            <text class="yundunbuttontext" @click="passwordconfirmover()">完成</text>
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
  width: 750px;
  /* align-items: center; */
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
  font-size:30px;
  margin-top:30px;
  font-weight:bold;
  text-align: center;
  color:rgba(51,51,51,1);
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
   width:670px;
  height:100px;
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
const modal = weex.requireModule("modal");
export default {
  components: {
    NavBar
  },
  data() {
    return {
      fontBgUrl: this.$store.state.imgBaseUrl + "results@2x.png",
       isClick:true,
    };
  },
  methods: {
    passwordconfirmover() {
      if(this.isClick){
        this.isClick =false;
        context.secureSetString("CertFlag", "0");
        this.$router.go(-2);
      }
      
      // this.goBackPath("/cloudshieldmanagement");
    }
  }
};
</script>


