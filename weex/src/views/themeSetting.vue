<template>
  <div class="contain-div">
    <nav-bar title="主题设置"></nav-bar>
    <scroller class="scroll-div">
      <div class="head-div-top">
        <text class="head-text">模式主题</text>
      </div>
      <div class="head-div-bottom">
        <div class="head-com" @click="showyoungorbus('1')">
          <div>
            <image class="hdb-left-img" src="./imgs/themeSetting/biaozhun.png"></image>
            <text class="hdb-left-text">青春标准版</text>
          </div>
          <image v-if="curversion=='standard'" class="sel-img" :src="okImg"></image>
        </div>
        <div class="head-com-right" @click="showyoungorbus('2')">
          <div>
            <image class="hdb-right-img" src="./imgs/themeSetting/jianyue.png"></image>
            <text class="hdb-left-text">商务简约版</text>
          </div>
          <image v-if="curversion=='smple'" class="sel-img-right" :src="okImg"></image>
        </div>
      </div>
      <div class="content-div-top">
        <text class="head-text">颜色主题</text>
      </div>
      <div class="content-div-bottom">
        <div class="content-div-fir">
          <div class="content-theme-list" v-for="(item,key) in colorThemeList" :key="key">
            <div class="content-div-item" @click="goto(item)">
              <div class="brd-top-solid" :style='{backgroundColor:item.backgroundColor}'></div>
              <text class="brd-solid" :style='{color:item.backgroundColor}'>{{item.title}}</text>
            </div>
            <image v-if="curversion==item.type" class="sel-theme-img" :src="okImg"></image>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
const context = weex.requireModule("context");
import NavBar from "../components/templet/titlebar";
export default {
  components: {
    NavBar
  },
  data() {
    return {
      okImg: "./imgs/themeSetting/ok.png",
      curversion: "standard",//标准版
      colorThemeList: [
        {
          title: "中国红",
          backgroundColor: "#ef492b",
          type: "red",
          theme: {
            launcher: "tabRed.json",
            homeLayout: "layoutRed.json",
            leve: 2
          }
        },
        {
          title: "梦幻蓝",
          backgroundColor: "#35a7d8",
          type: "blue",
          theme: {
            launcher: "tabBlue.json",
            homeLayout: "layoutBlue.json",
            leve: 2
          }
        },
        {
          title: "活力青",
          backgroundColor: "#36c19b",
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
    this.judgeTheme();
  },
  methods: {
    //判断主题
    judgeTheme() {
      var colorTheme = context.secureGetString("colorTheme");
      if (colorTheme) {
        this.curversion = colorTheme;
      }
    },
    //判断简版和标准版
    showyoungorbus(index) {
      if (index == "1") {
        this.curversion = "standard";
        this.setRecordTheme("");
        context.replaceStage("main.launcher");
      } else {
        this.curversion = "smple";
        this.setRecordTheme("");
        context.replaceStage("main.tabbusiness");
      }
    },
    //跳转具体功能
    goto(item) {
      this.curversion = item.type;
      var theme = JSON.stringify(item.theme);
      this.setRecordTheme(theme);
      context.replaceStage("main.launcher");
    },
    // 设置主题颜色
    setRecordTheme(theme) {
      context.secureSetString("recordTheme", this.curversion);
      context.secureSetString("colorTheme", this.curversion);
      context.sessionSetString("myTheme", theme);
    }
  }
};
</script>

<style scoped>
.contain-div {
  width: 750px;
  background-color: #ececec;
}
.scroll-div {
  width: 750px;
}
.head-div-top {
  width: 750px;
  height: 100px;
  margin-top: 16px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-top-style: solid;
  border-bottom-style: solid;
  border-top-color: rgb(221, 221, 221);
  border-bottom-color: rgb(221, 221, 221);
  background-color: #ffffff;
}
.head-text {
  font-size: 34px;
  color: rgb(34, 34, 34);
  height: 100px;
  line-height: 100px;
  margin-left: 30px;
}
.head-div-bottom {
  width: 750px;
  height: 408px;
  background-color: #ffffff;
  border-bottom-color: rgb(221, 221, 221);
  border-bottom-width: 1px;
  border-bottom-style: solid;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.hdb-left-img {
  width: 300px;
  height: 230px;
}
.hdb-right-img {
  width: 300px;
  height: 230px;
}
.hdb-left-text {
  width: 300px;
  height: 89px;
  line-height: 89px;
  text-align: center;
  font-size: 32px;
  /*box-shadow: 20px  10px 5px rgba(255, 69, 0, 0.8);*/
  border-bottom-style: solid;
  border-bottom-color: rgb(221, 221, 221);
  border-bottom-width: 1px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left-style: solid;
  border-left-color: rgb(221, 221, 221);
  border-left-width: 1px;
  border-right-style: solid;
  border-right-color: rgb(221, 221, 221);
  border-right-width: 1px;
}
.head-com {
  position: relative;
  width: 340px;
  height: 330px;
  padding-left: 35px;
}
.head-com-right {
  position: relative;
  width: 340px;
  height: 330px;
  padding-right: 30px;
}
.content-div-top {
  width: 750px;
  height: 100px;
  margin-top: 16px;
  border-bottom-width: 1px;
  border-top-style: solid;
  border-bottom-color: rgb(221, 221, 221);
  background-color: #ffffff;
}
.content-div-bottom {
  width: 750px;
  margin-bottom: 125px;
  background-color: #ffffff;
}
.content-div-fir {
  width: 750px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 46px;
  padding-left: 50px;
  padding-right: 38px;
}
.content-theme-list {
  width: 312px;
  height: 368px;
  position: relative;
}
.content-div-item {
  width: 300px;
  padding-top: 40px;
}
.brd-solid {
  width: 300px;
  height: 91px;
  text-align: center;
  line-height: 91px;
  font-size: 32px;
  border-bottom-style: solid;
  border-bottom-color: rgb(221, 221, 221);
  border-bottom-width: 1px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left-style: solid;
  border-left-color: rgb(221, 221, 221);
  border-left-width: 1px;
  border-right-style: solid;
  border-right-color: rgb(221, 221, 221);
  border-right-width: 1px;
}
.brd-top-solid {
  width: 300px;
  height: 230px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.sel-img {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 288px;
  left: 300px;
}
.sel-img-right {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 288px;
  left: 278px;
}
.sel-theme-img {
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>