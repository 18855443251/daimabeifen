<template>
  <div class="container1">
    <title-bar></title-bar>
    <scroller>
      <div class="container-content">
        <div v-for="(layout,key) in layoutlist" :key="key">
          <!-- 轮播广告 -->
          <!-- <mp-slider :jsonUrl="layout.url" @mpSliderClick="mpSliderClick" v-if="layout.type == 'AD'" :autoPlay="autoPlay" :infinite="infinite">
          </mp-slider> -->
          <ad :jsonurl="layout.url" v-if="layout.type == 'AD'"></ad>
          <!-- 广告跑马灯 -->
          <notice :jsonurl="layout.url" v-if="layout.type == 'NOTICE'" class="noticewz"></notice>
          <bus-menu :jsonurl="layout.url" v-if="layout.type == 'MENU'"></bus-menu>
        </div>
        <div class="bottom" @click="changeVersion">
          <text class="bottom-text">切换标准版</text>
        </div>
      </div>
    </scroller>
  </div>
</template>
<style scoped>
.container1 {
  width: 750px;
}
.container-content {
  background-color: #fff;
}
.refresh {
  width: 750px;
  align-items: center;
  /* background-color: #323232; */
  background-color: #ffffff;
}
.noticewz{
  margin-top: 30px;
}
.indicator {
  margin-top: 30px;
  margin-bottom: 30px;
  height: 40px;
  width: 40px;
  color: #0000ff;
}
.load_refresh {
  color: #888888;
  font-size: 28px;
  text-align: center;
}
.row {
  flex-direction: row;
}
.right-btn {
  margin-left: 10px;
}
.list-div {
  width: 750px;
  height: 216px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
}
.item-div {
  width: 226px;
  height: 216px;
  background-color: red;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}
.item-img {
  width: 226px;
  height: 216px;
}
.bottom {
  width: 690px;
  height: 100px;
  background-image: linear-gradient(to right, rgb(251,93,122), rgb(230,2,44));
  margin-top: 80px;
  margin-left: 30px;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
}
.bottom-text {
  text-align: center;
  font-size: 32px;
  color: #ffffff;
  line-height: 100px;
  font-weight: 600;
}
</style>
<script>

import TitleBar from "@/components/tab_business/titlebar.vue";
import BusMenu from "@/components/tab_business/busMenu.vue";
import ad from "@/components/tab_business/ads.vue";
import Notice from "../components/tab_business/notice.vue";

//import { MpSlider, MpMenu } from "madp-ui";

const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const qrscan = weex.requireModule("weexqrscan");
export default {
  components: {
    //MpSlider,
    //MpMenu,
    BusMenu,
    TitleBar,
    ad,
    Notice
  },
  data() {
    return {
      layoutlist: [],
      laytou_url: "./json/tab_business/layout.json",
      sliderIndex: "0",
      autoPlay: true,
      infinite: true
    };
  },
  created() {
    //查询楼层
    this.qry();
  },
  methods: {
    changeVersion: function() {
      context.secureSetString("colorTheme", "standard");
      context.sessionSetString("myTheme", "");
      context.replaceStage("main.launcher");
    },
    //点击轮播广告触发事件
    mpSliderClick(item) {
      this.gotoStage(item.url);
    },
    qry() {
      stream.fetch(
        {
          method: "GET",
          url: this.laytou_url,
          type: "json"
        },
        response => {
          if (response.status === 200) {
            this.layoutlist = response.data.data;
          }
        }
      );
    }
  }
};
</script>