<template>
  <div class="container">
    <title-bar :jsonurl="titlebarurl"></title-bar>
    <list :scrollable="$store.state.scrollable">
      <cell>
        <div class="menu-notice">
          <image class="bg" :src="bg"></image>
          <hot-menu :jsonurl="hotmenuurl"></hot-menu>
        </div>
        <menu class="menu" :jsonurl="AllMenuurl"></menu>
        <ad :jsonurl="Adurl"></ad>
        <notice :jsonurl="noticeurl"></notice>
        <hot-finance :jsonurl="financeurl"></hot-finance>
        <FXRate :jsonurl="FXRateurl"></FXRate>
      </cell>
      <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
        <bottom-loading></bottom-loading>
      </loading>
    </list>
    <bottom></bottom>
    <guide></guide>
  </div>
</template>
<style scoped>
.container {
  width: 750;
  background-color: rgb(255, 255, 255);
}
.menu{
  width: 690px;
}
.menu-notice {
  position: relative;
  width: 750px;
  height: 283px;
}
.menu-bulletin{
  width: 690px;
  height: 140px;
  border: 1px solid #000;
  border-radius: 30px;
  position: absolute;
  background-color: #fff;
  top: 200px;
  left: 5%;
  z-index: 1;
}
.bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.loading {
  width: 750px;
  height: 200px;
  background-color: #f1f1f1;
}
</style>
<script>
import TitleBar from "../components/tab_home/titlebar.vue";
import HotMenu from "../components/tab_home/hotmenu.vue";
import Notice from "../components/tab_home/notice.vue";
import Menu from "../components/tab_home/menu.vue";
import Ad from "../components/tab_home/ad.vue";
// import RateMenu from "../components/tab_home/ratemenu.vue";
import HotFinance from "../components/tab_home/hotfinance.vue";
// import NearNetwork from "../components/tab_home/nearnetwork.vue";
import Bottom from "../components/templet/bottom.vue";
import BottomLoading from "../components/templet/loading.vue";
import Guide from "../components/tab_home/guide.vue";
// import Bulletin from "../components/tab_home/bulletin.vue";
import FXRate from "../components/tab_home/fxrate.vue";

const stream = weex.requireModule("stream");
const modal = weex.requireModule('modal');
const context = weex.requireModule('context');

export default {
  components: {
    TitleBar,
    HotMenu,
    Notice,
    Menu,
    Ad,
    // RateMenu,
    HotFinance,
    // NearNetwork,
    Bottom,
    BottomLoading,
    Guide,
    // Bulletin,
    FXRate
  },
  data() {
    return {
      bg: "./imgs/tab_home/hotmenu/bg@3x.png",
      titlebarurl: "tab_home/titlebar.json",
      hotmenuurl: "tab_home/hotmenu.json",
      noticeurl: "tab_home/notice.json",
      financeurl:"tab_home/hotfinance.json",
      laytou_url: "layout.json",
      FXRateurl:"tab_home/fxrate.json",
      AllMenuurl:"tab_home/menu.json",
      Adurl:"tab_home/ad.json",
      layoutlist: [],
      loadinging: false,
      myTheme: {
        launcher: "tab.json",
        homeLayout: "layout.json",
        leve: 1
      },
    };
  },
  created() {
    this.judgeTheme();
  },
  mounted() {
     var warmId = context.secureGetString("warmId"); 
      if(warmId != 1) {
        context.launchStage("main.warmPrompt");
      }
  },
  methods: {
    // 判断主题
    judgeTheme() {
      var myTheme = context.sessionGetString("myTheme"); 
      if (myTheme) {
        myTheme = JSON.parse(myTheme);
        this.laytou_url = myTheme.homeLayout;
        if (myTheme.launcher == "tabBlue.json") {
          this.titlebarurl = "tab_home_color/titlebar/titlebarBlue.json";
          this.hotmenuurl = "tab_home_color/hotmenu/hotmenuBlue.json";
          this.AllMenuurl = "tab_home_color/menu/menuDragonBoat.json";
          this.bg = "./imgs/tab_home/hotmenu/blue.png";
        } else if(myTheme.launcher == "tabRed.json") {
          this.titlebarurl = "tab_home_color/titlebar/titlebarRed.json";
          this.hotmenuurl = "tab_home_color/hotmenu/hotmenuRed.json";
          this.AllMenuurl = "tab_home_color/menu/menuDragonBoat.json";
          this.bg = "./imgs/tab_home/hotmenu/red.png";
        } else if(myTheme.launcher == "tabCyanBlue.json") {
          this.titlebarurl = "tab_home_color/titlebar/titlebarCyanBlue.json";
          this.hotmenuurl = "tab_home_color/hotmenu/hotmenuCyanBlue.json";
          this.AllMenuurl = "tab_home_color/menu/menuDragonBoat.json";
          this.bg = "./imgs/tab_home/hotmenu/green.png";
        }
      }   
    },
    onloading() {
      this.loadinging = true;
      setTimeout(() => {
        this.loadinging = false;
      }, 1200);
    }
  }
};
</script>