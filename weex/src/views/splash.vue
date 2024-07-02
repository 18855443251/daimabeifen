<template>
  <div class="Bg">
    <text class="Time" :style="{top:topHeight}" @click="ToNext">点击跳过 {{timeShow}} s</text>
    <image class="adImg" :src="baseUrl+adImgUrl"></image>
  </div>
</template>

<style scoped>
.Bg {
  background-color: #ffffff;
  flex: 1;
}
.adImg {
  flex: 1;
  width: 750px;
  margin-top: -50px;
}
.Time {
  position: fixed;
  top: 30px;
  right: 20px;
  width: 180px;
  color: #ffffff;
  font-size: 24px;
  height: 50px;
  line-height: 50px;
  border-width: 1px;
  border-radius: 50px;
  border-color: #ffffff;
  text-align: center;
}
</style>
<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");

export default {
  data() {
    return {
      timeShow: 5, //闪屏默认时间
      timeRecorder: null, //时间记录
      baseUrl: "./imgs/splash/ordinaryScreen/",
      adImgUrl: "startup.png",
      status_bar_height: 0,
      colorTheme: "standard",
      festivalTheme: "",
      recordTheme: "",
      themeList: {
        standard: { 
          launcher: "tab.json",
          homeLayout: "layout.json",
          leve: 1
        },
        red: {
          launcher: "tabRed.json",
          homeLayout: "layoutRed.json",
          leve: 2
        },
        blue: {
          launcher: "tabBlue.json",
          homeLayout: "layoutBlue.json",
          leve: 2
        },
        orange: {
          launcher: "tabOrange.json",
          homeLayout: "layoutOrange.json",
          leve: 2
        },
        cyanBlue: {
          launcher: "tabCyanBlue.json",
          homeLayout: "layoutCyanBlue.json",
          leve: 2
        },
        newYears: {
          launcher: "tabNewYears.json",
          homeLayout: "layoutNewYears.json",
          leve: 3
        },
        spring: {
          launcher: "tabSpring.json",
          homeLayout: "layoutSpring.json",
          leve: 3
        },
        valentine: {
          launcher: "tabValentine.json",
          homeLayout: "layoutValentine.json",
          leve: 3
        },
        labor: {
          launcher: "tabLabor.json",
          homeLayout: "layoutLabor.json",
          leve: 3
        },
        dragonBoat: {
          launcher: "tabDragonBoat.json",
          homeLayout: "layoutDragonBoat.json",
          leve: 3
        },
        midAutumn: {
          launcher: "tabMidAutumn.json",
          homeLayout: "layoutMidAutumn.json",
          leve: 3
        },
        nationalDay: {
          launcher: "tabNationalDay.json",
          homeLayout: "layoutNationalDay.json",
          leve: 3
        },
        smple: {
          launcher: "",
          homeLayout: "",
          leve: 4
        }
      }
    };
  },
  computed: {
    topHeight() {
      return this.status_bar_height + 10 + "px";
    }
  },
  created() {
    // this.isFirstJoin();
    this.getSession();
    this.getStatusBarHeight();
    this.judgeScreenRatio();
    
  },
  mounted() {
    var guide = context.secureGetString("guide");   
    this.setInterval();
    this.clearSession();
  },
  methods: {
    getSession() {
      this.colorTheme = context.secureGetString("colorTheme");
      this.festivalTheme = context.secureGetString("festivalTheme");
      this.recordTheme = context.secureGetString("recordTheme");
    },
    setInterval() {
      this.timeShow = context.getParam("duration") || 5;
      //倒计时
      this.timeRecorder = setInterval(() => {
        this.timeShow = this.timeShow - 1;
        if (this.timeShow == 0) {
          this.ToNext();
        }
      }, 1000);
    },
    //清除用户类型
    clearSession() {
      context.secureSetString("LoginType", "");
    },
    //判断是否是全面屏
    judgeScreenRatio() {
      const {
        env: { deviceHeight, deviceWidth }
      } = weex.config;
      let screenRatio = deviceHeight / deviceWidth;
      if (screenRatio > 1.8) {
        this.baseUrl = "./imgs/splash/fullScreen/";
      }
    },
    //获取状态栏高度
    getStatusBarHeight() {
      var platform = weex.config.env.platform.toLowerCase();
      if (platform == "android") {
        this.status_bar_height = context.getDeviceInfo().status_bar_height - 20;
      } else if (platform == "ios") {
        this.status_bar_height = context.getDeviceInfo().status_bar_height;
      }
    },
    //跳过
    ToNext() {
      clearInterval(this.timeRecorder);
      this.checkFestivalTheme();
    },
    //查看今天是否是节假日
    checkFestivalTheme() {
      // stream.fetch(
      //   {
      //     method: "GET",
      //     url: "/weex/json/system/holidayTime.json",
      //     type: "json"
      //   },
      //   response => {
      //     if (response.status === 200) {
      //       let themeList = response.data.data,
      //         currentTime = new Date();
      //       let festivalList = themeList.filter(item => {
      //         return (
      //           new Date(item.start) < currentTime &&
      //           new Date(item.end) > currentTime
      //         );
      //       });
      //       if (this.colorTheme) {
      //         if (festivalList.length && this.colorTheme != "smple") {
      //           var theme = festivalList[0].type;
      //           if (this.festivalTheme != theme) {
      //             context.secureSetString("festivalTheme", theme);
      //             this.colorTheme = theme;
      //           }
      //         } else if (
      //           this.themeList[this.colorTheme].leve == 3 &&
      //           festivalList.length == 0
      //         ) {
      //           if (this.recordTheme) {
      //             this.colorTheme = this.recordTheme;
      //           } else {
      //             this.colorTheme = "standard";
      //           }
      //         }
      //       } else {
      //         this.colorTheme = "standard";
      //       }
      //       this.isFirstJoin();
      //     }
      //   }
      // );
      
            this.isFirstJoin();
    },
    //是否首次进入app
    isFirstJoin() {
      var guide = context.secureGetString("guide");
      if (guide) {
        this.judgeTheme();
      } else {
        this.setMyTheme("main.guide");
      }
    },
    //判断主题
    judgeTheme() {
      if (this.colorTheme == "smple") {
        this.setMyTheme("main.tabbusiness");
      } else {
        this.setMyTheme("main.launcher");
      }
    },
    //设置主题参数
    setMyTheme(url) {
      let theme = JSON.stringify(this.themeList[this.colorTheme]);
      context.sessionSetString("myTheme", theme);
      context.secureSetString("colorTheme", this.colorTheme);
      this.goto(url);
    },
    goto(url) {
      context.launchStage(url);
    }
  }
};
</script>