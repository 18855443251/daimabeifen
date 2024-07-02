<template>
  <div class="row">
    <image class="big_bg" :src="big_bg" v-if="big_bg"></image>
    <image class="help" :src="service_img" @click="JumpTo('main.login')" v-if="isLogin==false"></image>
    <text class="loginText" @click="JumpTo('main.login')"  v-if="isLogin==false">{{loginText}}</text>
    <image class="help" :src="logout_img" @click="logout" v-if="isLogin==true"></image>
    <text class="loginText" @click="logout"  v-if="isLogin==true">{{loginText}}</text>
    <div class="searchdiv" :style='{backgroundColor:searchdivBgcolor}'>
      <image class="searchimg" :src="searchimg"></image>
      <text class="searchinput" @click="JumpTo('main.search',true)" :style='{color:searchFontColor}'>找不到功能？搜一下直达</text>
    </div>
    <image class="message" :src="message_img" @click="JumpTo('main.bankNotice')"></image>
    <image class="message" :src="qrcode_img" @click="moreclick"></image>
        <wxc-popover ref="wxc-popover"
                    :buttons="btns"
                    :position="popoverPosition"
                    :arrowPosition="popoverArrowPosition"
                    @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>
  </div>
</template>
<style scoped>
.row {
  /* background-color: #E6022C; */
  width: 750px;
  padding-top: 80px;
  padding-left: 10px;
  padding-right: 30px;
  padding-bottom: 25px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.big_bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.searchdiv {
  width:416px;
  height:54px;
  background:rgba(255,255,255,1);
  /* opacity:0.3; */
  border-radius:27px;
  /* width: 450px;
  background-color: rgba(0, 0, 0, 0.1);
  border: 2px solid;
  border-radius: 50px;
  height: 65px; */
  flex-direction: row;
  align-items: center;
  align-content: space-around;
  padding-left: 36px;
  margin-left: 20px;
}

.searchinput {
  align-content: center;
  width: 400px;
  font-size:24px;
  color: rgba(255, 255, 255, 0.7);
  margin-left: 22px;
}

.imgQrcode {
  width: 42px;
  height: 42px;
}

.searchimg {
  width: 25px;
  height: 25px;
  /* margin-right: 5px;
  margin-left: 5px; */
}

.help {
  margin-left: 27px;
  width: 40px;
  height: 40px;
}

.message {
  width: 42px;
  height: 42px;
  margin-left: 25px;
}

.loginText {
  font-size: 24px;
  color: #FFFFFF;
  margin-left: 20px;
}
</style>
<script>
const modal = weex.requireModule("modal");
const context = weex.requireModule("context");
const stream = weex.requireModule("stream");
const qrscan = weex.requireModule("weexqrscan");
const wjalert = weex.requireModule("weex-alert");
import {WxcPopover} from 'weex-ui';
export default {
  components: { WxcPopover },
  props: ["jsonurl"],
  created() {    
     this.itemer =  setTimeout(data=>{
        if(this.$store.state.isLogin  == 'y'){
          this.isLogin=true
          this.loginText="退出"
        }else{
          this.isLogin=false
          this.loginText="登录"
        }
      },200)
    this.getJson();
  },
  watch:{   
    "$store.state.isLogin"(){
        if(this.$store.state.isLogin  == 'y'){
          this.isLogin=true;
          this.loginText="退出";
        }else{
          this.isLogin=false
          this.loginText="登录"
        }
    }
  },
  data() {
    return {
      big_bg: "",
      qrcode_img: "./imgs/tab_home/titlebar/more@3x.png",
      searchimg: "./imgs/tab_home_color/titlebar/search.png",
      message_img: "./imgs/tab_home/titlebar/message@3x.png",
      service_img: "./imgs/tab_home/titlebar/login@3x.png",
      logout_img:"./imgs/tab_home/titlebar/logout@3x.png",
      searchdivBgcolor: "rgba(250, 250, 250, 0.1)",
      searchFontColor: "rgba(255, 255, 255, 0.7)",
      loginText: "登录",
      btns:[
        {
         icon: "./imgs/tab_home/titlebar/scan@3x.png",
         text:'扫一扫',
         key:'key-scan'
        },
        {
          icon: "./imgs/tab_home/titlebar/cardinfo@3x.png",
          text:'企业名片',
          key:'key-qrcode'
        }
      ],
      popoverPosition:{x:-14,y:158},
      popoverArrowPosition:{pos:'top',x:-15},
      itemer:"",
      isLogin:false
    };
  },
  methods: {   
    logout(){
      wjalert.confirm("您确定退出登录？", "确定", "取消", data => {
        if (data == "Y") {
          this.goJson("/eweb/logout.do", {}, response => {
            context.sessionSetString("isLogin", "");
            context.sessionSetString("userinfo", "");
            // context.sessionSetString("nextScenes", "");
            context.clearToken();
            context.replaceStage("main.launcher");
          });
        }
      });
    },
    moreclick () {
        this.$refs['wxc-popover'].wxcPopoverShow();
      },
      popoverButtonClicked (obj) {
        if(obj.index==0){
          qrscan.scanQRcode(data => {
            let qrDate = JSON.parse(data);
            if(qrDate.type=="1"){
              context.launchStage("main.enterprisesCard");
            } else {
              try {
                  var obj=JSON.parse(qrDate.result);
                  if(typeof obj == 'object' && obj ){
                    if(obj.flag=="1") {
                      wjalert.confirm("确认向该账户转账?","确定","取消",data=>{
                          if(data == "Y") {
                              context.sessionSetString("tansferdata",qrDate.result)
                              context.launchStage("main.FastTrans?flag=scan");
                          }
                      })
                    } else if(obj.flag=="receipt"){
                        modal.alert({
                          message:"此回单真实有效"
                        })
                      }else {
                        modal.alert({
                          message:"暂不支持此类型二维码"
                        })
                    }
                  }else{
                      modal.alert({
                        message:"您扫描的内容不在我行的服务范围内,二维码识别内容为:"+qrDate.result
                      })
                  }
              } catch(e) {
                  modal.alert({
                    message:"您扫描的内容不在我行的服务范围内,二维码识别内容为:"+qrDate.result
                  })
              }
            }
          });
        }else{
          context.launchStage("main.enterprisesCard");
        }
        // modal.toast({ 'message': `key:${obj.key}, index:${obj.index}`, 'duration': 1 });
      },
    JumpTo(url, isNotRecord) {
      // context.launchStage(url);
      this.gotoStage(url, isNotRecord);
    },
    getJson() {
      if (this.jsonurl) {
        stream.fetch(
          {
            method: "GET",
            url: this.$store.state.jsonBaseUrl + this.jsonurl,
            type: "json"
          },
          response => {
            if (response.status === 200) {
              var tmp = response.data.data;
              if (tmp.bgSrc) {
                this.big_bg = tmp.bgSrc;
              }
              if (tmp.otherImg) {
                this.qrcode_img = tmp.otherImg.leftSrc;
                this.message_img = tmp.otherImg.rightSrc1;
                this.service_img = tmp.otherImg.rightSrc2;
                if (tmp.otherImg.searchSrc) {
                  this.searchimg = tmp.otherImg.searchSrc;
                }
              }
              if (tmp.searchdivBgcolor) {
                this.searchdivBgcolor = tmp.searchdivBgcolor;
              }
              if (tmp.searchFontColor) {
                this.searchFontColor = tmp.searchFontColor;
              }
            }
          }
        );
      }
    },
    //扫一扫二维码查询
    getQueryOrder(Qrdata) {
      const params = {
        QrNo: Qrdata
      };
      this.goJson(
        "/refacmob/QueryQrOrder.do",
        params,
        response => {
          context.sessionSetString(
            "ResponseData",
            JSON.stringify(response.data)
          );
          context.launchStage("main.qrcode");
        },
        fail => {
          modal.alert({
            message: fail
          });
        }
      );
    }
  },
  beforeDestroy(){
    clearTimeout(this.itemer)
  }
};
</script>
