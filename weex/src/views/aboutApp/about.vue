<template>

    <div class="yundunpasswordsetting">
        <nav-bar title="关于APP" left-show="false"></nav-bar>
        <div class="title">
            <image :src="iconUrl" class="nullicon"></image>
            <text class="toptext">美团银行银行企业版</text>
            <text class="bottomtext">Version {{versionName}}</text>
        </div>
        <div class="all"></div>
        <div class="textdiv">
          <div class="contextdiv" >
            <text class="kefutext">版本更新</text>
            <div class="rightDiv" @click="newVersion">  
              <text class="contexttext" v-if="hasNewVersion">有新版本</text>
              <image :src="oneUrl" class="yundunlogoicon"></image>
            </div>
          </div>
          <div class="contextdiv">
            <text class="kefutext">联系我们</text>
            <div class="rightDiv" @click="jumpAboutus"> 
              <image :src="oneUrl" class="yundunlogoicon" ></image>
            </div>
          </div>
          <div class="contextdiv" @click="share">
            <text class="kefutext">APP分享</text>
            <div class="rightDiv" > 
              <image :src="oneUrl" class="yundunlogoicon" ></image>
            </div>
            
          </div>      
        </div>
        <wxc-popup popup-color="white"
               :show="isBottomShow"
               @wxcPopupOverlayClicked="popupOverlayBottomClick"
               pos="bottom"
               height="450">
               <div class="popupDiv">
                 <div class="popupDivTop">
                  <div class="aLine"></div>
                   <div class ="ceterDiv">
                     <image :src="versionImg" class="versionImg" ></image>
                      <text class="versionText">检测到新版本</text>
                   </div> 
                  <div class="aLine"></div>
                 </div>
                 <div class="describeDiv">
                    <text class="describeText">新版本{{newVersionNamer}}</text>
                    <text class="describeText">{{describe}}</text>
                 </div>
                 <div class="popBottom">
                   <text class="juText" v-if="isWifi">您正在使用移动网络确认更新？</text>
                   <text class="updateText">立即更新</text>
                 </div>
               </div>
        </wxc-popup>
          <wxc-popup popup-color="white"
               :show="isShare"
               @wxcPopupOverlayClicked="isShareClick"
               pos="bottom"
               height="400">
               <div class="shareDiv">
                 <text class="sharetext">分享给好友</text>
                 <div class="flde">
                   <div class="shareCon" @click="shareWX"> 
                     <image class="shareImg" src="./imgs/aboutApp/wechat@2x.png"></image>
                     <text class="sharetext1">微信好友</text>
                   </div>
                   <div class="shareCon1" @click="shareWXF"> 
                     <image class="shareImg" src="./imgs/aboutApp/friends@2x.png"></image>
                     <text class="sharetext1">朋友圈</text>
                   </div>
                 </div>
                 <div class="btn" @click="cancleShare">
                  <text class="btntext">取消</text>
                 </div>
               </div>
               
        </wxc-popup>
    </div>
</template>
<style scoped>
.btntext{
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(156,156,156,1);
  line-height:110px;
  text-align: center
}
.btn{
  margin-top: 31px;
  height: 110px;
  width: 750px;
  border-top-width: 1px;
  border-top-color: rgba(234,234,234,1);
}
.sharetext1{
  font-size:26px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  margin-top: 24px;
  width: 110px;
  text-align: center;
}
.shareCon1{
  margin-left: 90px;
}
.shareCon{
  margin-left: 40px;
}
.shareImg{
  margin-left: 15px;
  width: 80px;
  height: 80px;
}
.sharetext{
  font-size:28px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(102,102,102,1);
  margin-left: 40px;
  margin-top: 40px;
}
.shareDiv{
  width: 750px;
}
.flde{
  margin-top: 40px;
  flex-direction: row;
}
.all{
  width: 750px;
  height: 20px;
  background-color: rgba(249,249,249,1);
}
.yundunpasswordsetting {
  width:750px;
  height:1334px;
  background-color: white;
}
.title{
  width: 750px;
  height: 400px;
  border-bottom-style: soild;
  background-color: white;
}
.toptext{
  font-size: 32px;
  margin-top: 20px;
  margin-left: 230px;
  font-family:PingFang-SC-Bold,PingFang-SC;
  font-weight:bold;
  color:rgba(51,51,51,1);
}
.bottomtext{
  width: 210px;
  margin-left: 270px;
  height: 48px;
  border-radius: 24px;
  margin-top: 30px;
  font-size:28px;
  font-weight:500;
  color:rgba(255,255,255,1);
   background-image: linear-gradient(to right, rgb(251,93,122), rgb(230,2,44));
  /* background-image: linear-gradient(124deg,rgba(251,93,122,1) 0%,rgba(230,2,44,1) 100%); */
  text-align: center;
  line-height: 48px;
}
.textdiv {
  width: 750px;
  background-color: white;
}
.nullicon{
  margin-top: 80px;
  margin-left: 315px;
  width: 120px;
  height: 120px;
}
.yundunlogoicon {
  width: 30px;
  height: 30px;
  position: absolute;
  background-color: white;
  right: 35px;
  top:40px;
}
.contextdiv {
  width: 720px;
  height: 110px;
  margin-left: 30px;
  flex-direction: row;
  justify-content: space-between;
  /* margin-bottom: 20px; */
  border-bottom-width: 1px;
  border-bottom-color:#EAEAEA;
}
.kefutext {
  line-height:110px;
  font-size:30px;
  font-weight:500;
  color:rgba(51,51,51,1);
}

.contexttext {
  font-size:28px;
  font-weight:500;
  color:rgba(74,137,252,1);
  right:100px;
  line-height: 110px;
  position: absolute;
}
.rightDiv{
  width: 500px;
  flex-direction: row;
}
.popupDiv{
  border-top-left-radius:30px;
  border-top-right-radius: 30px;
  width: 750px;
  /* background-color: red; */
}
.popupDivTop{
  flex-direction: row;
  width: 690px;
  margin-left: 30px;
  background-color: white;
  height: 100px;
}
.aLine{
  width: 190px;
  height: 2px;
  background-color: lightgray;
  margin-top: 60px;
}
.ceterDiv{
  width: 310px;
  flex-direction: row;
}
.versionText{
  font-size: 30px;
  margin-top: 40px;
  margin-left: 15px;
}
.versionImg{
  width: 40px;
  height: 40px;
  margin-left: 30px;
  margin-top: 40px;
}
.describeDiv{
  margin-left: 30px;
  margin-top: 10px;
}
.describeText{
  margin-top: 20px;
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(51,51,51,1);
 /* font-size:30px;
  font-weight:500; */
}
.popBottom{
  margin-top: 50px;
  margin-left: 30px;
  width: 690px;
  height: 150px;
}
.juText{
  /* font-size:30px; */
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(51,51,51,1);
  font-size: 26px;
}
.updateText{
  margin-top: 15px;
  width:690px ;
  height: 88px;
  border-radius:12px;
  text-align: center;
  line-height: 88px;
  background-image: linear-gradient(to right, rgb(251,93,122), rgb(230,2,44));
  font-size:32px;
  font-family:PingFang-SC-Bold,PingFang-SC;
  font-weight:bold;
  color:rgba(255,255,255,1);
}
</style>

<script>
// import NavBar from "../components/NavBar.vue";
import NavBar from "@/components/templet/titlebar";
import { WxcPopup } from 'weex-ui';
const context = weex.requireModule("context");
const weexshare = weex.requireModule("weex-share");
const weexConfig = weex.requireModule("weex-config");
const modal = weex.requireModule("modal");
export default {
  components: {
    NavBar,WxcPopup
  },
  data() {
    return {
      isShare:false,
      isBottomShow:false,
      iconUrl: "./imgs/aboutApp/logo@2x.png",
      oneUrl:  "./imgs/aboutApp/gengduo@3x.png",
      versionImg:"./imgs/aboutApp/sad@3x.png",
      hasNewVersion:false,
      updateUrl:"" ,//更新地址
      describe:"", //更新的内容
      platform: "",
      versionName: "",
      versionData: {},
      newVersionNamer:"", //新版版服务号
      isWifi:false,
      isupdate:false,
};
  },
  created(){
     this.getDeviceInfo();
  },
  mounted(){
    
  },
  methods: {
      //微信朋友
    shareWX(){
      const param = {
        url: "https://www.wjrcb.com/wbank/wbank_2/weProtal/index.html?OpenId=1&Page=weProtal#?/downloadBank",
        title: "美团银行银行企业银行",
        content: ""
      };
      weexshare.WXShare("0",JSON.stringify(param));  //0是传url   1是图片
    },
  //朋友圈
    shareWXF(){
      const param = {
        url: "https://www.wjrcb.com/wbank/wbank_2/weProtal/index.html?OpenId=1&Page=weProtal#?/downloadBank",
        title: "美团银行银行企业银行",
        content: ""
      };
      weexshare.WXFShare("0",JSON.stringify(param));
    },
    isShareClick(){
      this.isShare = false;
    },
    cancleShare(){
      this.isShare = false;
    },
    share() {
      this.isShare = !this.isShare;
      // const param = {
      //   url: "https://www.wjrcb.com/wbank/wbank_2/weProtal/index.html?OpenId=1&Page=weProtal#?/downloadBank",
      //   title: "美团银行手机银行",
      //   content: ""
      // };
      // weexshare.shareUrl(JSON.stringify(param));
    },
    jumpAboutus(){
        this.jump("/contactUs")
    },
    newVersion(){
      //点击出现弹层
      // this.isBottomShow = true;
      if(this.hasNewVersion == true){
        this.isBottomShow = true;
      }else{
        this.showOneBtnAlert("已经是最新版本","确定",()=>{});
      }
      
       weexConfig.networkStatus(data=>{
          if(data=="1"){
              //wifi
             this.isWifi = false;
          }else if(data=="0"){
             //流量
             this.isWifi = true;
          }
      })
    },
    popupOverlayBottomClick(){
      //点击蒙层消失
      this.isBottomShow = false;
    },
    getDeviceInfo() {
      this.platform = weex.config.env.platform.toLowerCase();
      this.versionName = context.envGet("versionName"); //获取版本名 如 1.0.1
      this.getVersion();
    },
    getVersion() {
      var url = "./json/system/" + this.platform + ".json";
      this.httpGet(url, res => {
        let tmp = res.data.data[0];
        let oldarr = this.versionName.split("."); //缓存版本号
        let newarr = tmp.versionName.split("."); //服务器版本号
        this.versionData = tmp;
        this.compareVersion(oldarr, newarr);
        this.newVersionNamer = tmp.versionName; //新版版服务号
      });
    },
    //判断版本是否需要更新
    compareVersion(oldarr, newarr) {
      let { url, describe, update } = this.versionData;
      let [oldVersion, newVersion] = this.getVersionCode(oldarr, newarr);
      if (newVersion > oldVersion) {
        this.hasNewVersion =true;
        this.updateUrl = url ;//更新地址
        this.describe  = describe;  //更新信息
        // if (update == "0") {
          this.isupdate = true;
        // } else {
          
        // }
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
    versionUpdate() {
      if (this.platform == "android") {
        //安卓更新地址 https://dl.wjrcb.com/WjrcbMobile.apk
        context.launchStage("ext:" + this.updateUrl);
        // const weexUpdata = weex.requireModule("weex-updata");
        // weexUpdata.updata('https://dl.wjrcb.com/WjrcbMobile.apk');
      } else if (this.platform == "ios") {
        context.launchStage("ext:" + this.updateUrl);
      }
    },
  }
};
</script>

