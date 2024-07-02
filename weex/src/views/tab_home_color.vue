<template>
  <div class="container">
    <div v-for="layout in layoutlist" :key="layout.url">
      <title-bar :jsonurl="layout.url" v-if="layout.type == 'TITLE'"></title-bar>
    </div>
    <list :style='{backgroundColor:refreshBg}' :class="[show ? 'cell' : '']">
      <refresh class="refresh" :style='{backgroundColor:refreshBg}' @refresh="onrefresh" :display="refreshing ? 'show' : 'hide'" v-if="show">
      </refresh>
      <cell class="contain">
        <div v-for="layout in layoutlist" :key="layout.url">
          <hot-menu class="hotmenu" :jsonurl="layout.url" v-if="layout.type == 'HOTMENU'"></hot-menu>
          <!-- <menu :jsonurl="layout.url" v-if="layout.type == 'MENU'"></menu> -->
          <menu-color class="hotcol" :jsonurl="layout.url" v-if="layout.type == 'MENU' && show"></menu-color>          
          <menu-theme :jsonurl="layout.url" v-if="layout.type == 'MENU' && !show"></menu-theme>
          <!-- <notice :jsonurl="layout.url" v-if="layout.type == 'NOTICE'"></notice> -->
          <!-- <rate-menu :jsonurl="layout.url" v-if="layout.type == 'RATE'"></rate-menu> -->
          <ad :jsonurl="layout.url" v-if="layout.type == 'AD'"></ad>
          <notice :jsonurl="layout.url" v-if="layout.type == 'NOTICE'"></notice>
          <hot-finance :jsonurl="layout.url" v-if="layout.type == 'HOTFINANCE'"></hot-finance>
          <FXRate :jsonurl="layout.url" v-if="layout.type == 'FXRATE'"></FXRate>
          <!-- <near-network :jsonurl="layout.url" v-if="layout.type == 'NEARNETWORK'"></near-network> -->
        </div>
      </cell>
      <loading class="loading" @loading="onloading" :display="loadinging ? 'show' : 'hide'">
        <bottom-loading></bottom-loading>
      </loading>
    </list>
    <bottom></bottom>
  </div>
</template>
<style scoped>
.contain {
  width: 750px;
  background-color: rgb(255, 255, 255);
}
.cell {
  transform: translateY(-0.5px);
}
.refresh {
  width: 750px;
  height: 120px;
  align-items: center;
}
.loading {
  width: 750px;
  height: 200px;
  background-color: #f1f1f1;
}
</style>
<script>
import TitleBar from "../components/tab_home/titlebar.vue";
import HotMenu from "../components/tab_home_color/hotmenu.vue";
import Notice from "../components/tab_home/notice.vue";
import MenuColor from "../components/tab_home_color/menu.vue";
import MenuTheme from "../components/tab_home_theme/menu.vue";
// import RateMenu from "../components/tab_home/ratemenu.vue";
import Ad from "../components/tab_home_color/ad.vue";
import HotFinance from "../components/tab_home/hotfinance.vue";
// import NearNetwork from "../components/tab_home/nearnetwork.vue";
import Bottom from "../components/templet/bottom.vue";
import BottomLoading from "../components/templet/loading.vue";
import FXRate from "../components/tab_home/fxrate.vue";
// import Menu from "../components/tab_home/menu.vue";

const stream = weex.requireModule("stream");
const context = weex.requireModule("context");

export default {
  components: {
    TitleBar,
    HotMenu,
    Notice,
    MenuColor,
    MenuTheme,
    Ad,
    // RateMenu,
    HotFinance,
    // NearNetwork,
    Bottom,
    BottomLoading,
    FXRate,
    // Menu
  },
  data() {
    return {
      layoutlist: [],
      refreshing: false,
      loadinging: false,
      show: true,
      laytou_url: "layout.json",
      refreshBg: "",
      myTheme: {
        launcher: "tab.json",
        homeLayout: "layout.json",
        leve: 1
      },
      randomList: [
        {
          bgColor: "#ff5234",
          type: "red",
          theme: {
            launcher: "tabRed.json",
            homeLayout: "layoutRed.json",
            leve: 2
          }
        },
        {
          bgColor: "#35a7d8",
          type: "blue",
          theme: {
            launcher: "tabBlue.json",
            homeLayout: "layoutBlue.json",
            leve: 2
          }
        },
        // {
        //   bgColor: "#ff8f2b",
        //   type: "orange",
        //   theme: {
        //     launcher: "tabOrange.json",
        //     homeLayout: "layoutOrange.json",
        //     leve: 2
        //   }
        // },
        {
          bgColor: "#36c19b",
          type: "cyanBlue",
          theme: {
            launcher: "tabCyanBlue.json",
            homeLayout: "layoutCyanBlue.json",
            leve: 2
          }
        }
      ]
    };
  },
  created() {
    // this.getLayout();
    this.judgeTheme();
  },
  methods: {
    onrefresh() {
      this.refreshing = true;
      var randomNum = Math.floor(Math.random() * 4);
      var tmp = this.randomList[randomNum];
      this.laytou_url = tmp.theme.homeLayout;
      this.refreshBg = tmp.bgColor;
      this.setTheme(tmp);
      this.getLayout(() => {
        this.refreshing = false;
      });
    },
    onloading() {
      this.loadinging = true;
      setTimeout(() => {
        this.loadinging = false;
      }, 1200);
    },
    //设置主题
    setTheme(item) {
      var theme = JSON.stringify(item.theme);
      context.secureSetString("colorTheme", item.type);
      context.sessionSetString("myTheme", theme);
    },
    //判断主题
    judgeTheme() {
      var myTheme = context.sessionGetString("myTheme");
      if (myTheme) {
        myTheme = JSON.parse(myTheme);
        this.laytou_url = myTheme.homeLayout;
        if (myTheme.leve == 3) {
          this.show = false;
        }
      }
      this.getLayout();
    },
    getLayout(callBack) {
      //查询楼层
      stream.fetch(
        {
          method: "GET",
          url: "./json/tab_home_color/" + this.laytou_url,
          type: "json"
        },
        response => {
          if (response.status === 200) {
            this.layoutlist = response.data.data;
            if (callBack) {
              callBack();
            }
          }
        }
      );
    },   
  }
};
</script>