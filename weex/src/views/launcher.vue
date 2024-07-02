<template>
  <div class="container">
    <osc-tabbar :unselectedColor="unselectedColor" :selectedColor="selectedColor" :tabItems="tabItems" @tabBarOnClick="tabBarOnClick" />
  </div>
</template>
<style scoped>
  .container{
    border-top-width: 1px;
    border-top-color: rgb(245, 245, 245);
    border-top-style:solid;
  }

</style>
<script>
import oscTabbar from "../components/launcher/tabbar.vue";
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule('modal');
const wjalert = weex.requireModule("weex-alert");
const uploadFile = weex.requireModule("weex-UploadFile");
export default {
  data() {
    return {
      platform: "",
      versionName: "",
      tabItems: [],
      unselectedColor: "",
      selectedColor: "",
      tabItem: "",
      baseURL: "",
      myTheme: {
        launcher: "tab.json",
        homeLayout: "layout.json",
        leve: 1
      },
      versionData: {}
    };
  },
  components: { oscTabbar},
  created() {
    this.getDeviceInfo();
    this.judgeTheme();
    uploadFile.getExcel(data=>{
      if(data=="true"){   //有文件上传 
          context.launchStage("main.payroll")
      }
    })
    // this.getNav();
  },
  methods: {
    getDeviceInfo() {
      this.platform = weex.config.env.platform.toLowerCase();
      this.versionName = context.envGet("versionName"); //获取版本名 如 1.0.1
      this.getVersion();
    },
    tabBarOnClick: function(e) {
    },
    pollingTheme() {
      setTimeout(() => {
        var myTheme = context.sessionGetString("myTheme");
        if (myTheme) {
          myTheme = JSON.parse(myTheme);
          if (this.myTheme.launcher != myTheme.launcher) {
            this.myTheme = myTheme;
            this.getNav();
          } else {
            this.pollingTheme();
          }
        } else {
          this.pollingTheme();
        };
      }, 1000);
    },
    //判断主题
    judgeTheme() {
      var myTheme = context.sessionGetString("myTheme");
      if (myTheme) {
        this.myTheme = JSON.parse(myTheme);
      }
      this.getNav();
    },
    //获取导航信息
    getNav() {
      this.baseURL = weex.config.bundleUrl.replace(/\/index.weex.js\/?.*/, "/");
      //获取tab
      stream.fetch(
        {
          method: "GET",
          url: "./json/launcher/" + this.myTheme.launcher,
          type: "json"
        },
        res => {
          var res_data = res.data.data;
          this.tabItems = res_data.tabs;
          this.unselectedColor = res_data.unselectedColor;
          this.selectedColor = res_data.selectedColor;
          for (var i = 0; i < this.tabItems.length; i++) {
            this.tabItem = this.tabItems[i];
            this.tabItem.src = this.baseURL + this.tabItem.src;
            this.tabItem.image = this.tabItem.image;
            this.tabItem.selectedImage = this.tabItem.selectedImage;
          }
          this.pollingTheme();
        }
      );
    },
    //版本更新
    getVersion() {
      var url = "./json/system/" + this.platform + ".json";
      this.httpGet(url, res => {
        let tmp = res.data.data[0];
        let oldarr = this.versionName.split("."); //缓存版本号
        let newarr = tmp.versionName.split("."); //服务器版本号
        this.versionData = tmp;
        this.compareVersion(oldarr, newarr);
      });
    },
    //判断版本是否需要更新
    compareVersion(oldarr, newarr) {
      let { url, describe, update } = this.versionData;
      let [oldVersion, newVersion] = this.getVersionCode(oldarr, newarr);
      if (newVersion > oldVersion) {
        if (update == "0") {
          wjalert.alert(describe, "立即更新", data => {
            this.versionUpdate(url);
          });
        } else {
          wjalert.confirm(describe, "立即更新", "稍后更新", data => {
            if (data == "N") {
            } else if (data == "Y") {
              //点击确认执行方法
              this.versionUpdate(url);
            }
          });
        }
      }
    },
    //获取版本号
    getVersionCode(...params) {
      let tmpArr = [];
      for (let arr of params) {
        var code = 0,
          _length = arr.length;
        for (let [index, val] of arr.entries()) {
          code += Math.pow(10, _length - index) * val;
        }
        tmpArr.push(code);
      }
      return tmpArr;
    },
    //ios或安卓版本更新具体操作
    versionUpdate(updateUrl) {
      if (this.platform == "android") {
        //安卓更新地址 https://dl.wjrcb.com/WjrcbMobile.apk
        context.launchStage("ext:" + updateUrl);
        // const weexUpdata = weex.requireModule("weex-updata");
        // weexUpdata.updata('https://dl.wjrcb.com/WjrcbMobile.apk');
      } else if (this.platform == "ios") {
        context.launchStage("ext:" + updateUrl);
      }
    },
  },
  watch: {
    "$store.state.viewappear"() {
      this.getVersion();
    },
  }
};
</script>