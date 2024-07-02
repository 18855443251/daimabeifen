<template>
  <div class="contariner">
    <nav-bar title="云盾管理"></nav-bar>
    <div class="yundundownload">
      <div class="yundunlogo" >
          <image :src="iconUrl" class="yundunlogoicon"/>
          <text class="yundunlogotext">提交成功</text>
          <text class="pstext" v-for="(item,index) in DisplayAuthList" :key="index" >需要{{item.AuthUserCount}}个{{item.UserGrpId}}级审核员</text>
          <text class="pstext" v-if="isDownLoad" >审核通过后，继续下载</text>
          <text class="pstext" v-if="!isDownLoad">审核通过后，继续重置密码</text>
          
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
  background-color: rgba(255,255,255,1);
}
.yundunlogo {
  width: 750px;
  /* height: 288px; */
  align-items: center;
  /* border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1); */
}
.yundunlogoicon {
  width:110px;
  height: 110px;
  margin-top:30px;
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
      fontBgUrl: this.$store.state.imgBaseUrl + "card_bg@2x.png",
      iconUrl: this.$store.state.imgBaseUrl + "results@2x.png",
      isDownLoad:true,
      isClick:true,
      DisplayAuthList:[],
      list:[{a:1,b:2}],
      pageIndex:0,
      page:[]
    };
  },
  mounted() {
    this.DisplayAuthList = this.$store.state._DisplayAuthList;
    if(this.$store.state.isDownLoad == "isDownLoad"){
        this.isDownLoad = false;
    }else{
      this.isDownLoad = true;
    }
  },

  methods: {
    pages(){
        const pages = []
    // 计算属性-作用：标签超出九个后，展示滑动效果
    // -forEach（循环项,下标）
    // Math.floor向下取整
    this.list.forEach((item, index) => {
      const page = Math.floor(index / 8)
      if (!pages[page]) {
        pages[page] = []
      }
      pages[page].push(item)
    })
    // console.log(JSON.stringify(pages[2]))
    this.page.push(pages[this.pageIndex])
    this.pageIndex++;
    console.log(JSON.stringify(this.page))
    },

    
    passwordconfirm() {
      if(this.isClick){
      this.isClick = false;
        this.$router.go(-1);
      }
       
      // this.goBackPath("/cloudshieldmanagement");
      // if (context.sessionGetString("certdownload") == "true") {
      //   context.sessionSetString("pinState", context.sessionGetString("pinState"));
      //   context.secureSetString("CertFlag", "0");
      //   context.finish();
      // } else {
      //   this.goBackPath("/cloudshieldmanagement");
      // }
    },
    openpasswordaegis() {
      this.jump("/cloudshieldpasswordsetting");
    }
  }
};
</script>


