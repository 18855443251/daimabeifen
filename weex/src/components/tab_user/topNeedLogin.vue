<template>
  <div class="container">
    <image class="finance-bg-img" :src="bannerimg"></image>
    <div class="wrapper">
      <div class="row0">
        <div class="exit">
        <text class="title_font" @click="logout">安全退出</text>
        </div>
        <image @click="gotoStage('main.bankNotice')" class="title-img message" :src="messageUrl"></image>
        <image @click="gotoStage('main.enterprisesCard')" class="title-img" :src="qrcode"></image>
      </div>
      <!-- <div class="row border_b">
        <text class="text">上次登录：{{userinfo.LastLoginTime}}</text>
        <image class="border_img" :src="qrimageUrl"></image>
      </div> -->
      <div class="row">
        <div class="row-left">
          <div class="img_box">
            <image class="user-img" :src="imageUrl"></image>
            <weex-image class="finance-img" ref="photoImg" @click="judgeSetPhoto"></weex-image>
          </div>
          <div class="user-box">
            <text class="title">{{username}}</text>
            <text class="text">{{cifname}}</text>
          </div>
        </div>
        <div class="edit_img_box" @click="userinfoClick">
          <image class="edit_img" :src="rightimg"></image>
        </div>
      </div>
      <div class="note-bg">
        <div class="note-box">
          <text class="note-text">预留信息：{{message}}</text>
          <div class="note-img-box" @click="messageClick">
            <image class="note-img" :src="editimg"></image>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row0 {
  padding-left: 40px;
  padding-right: 40px;
  padding-top: 76px;
  padding-bottom: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.title-bg {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
}
.message{
  left: 200px;
}
.title-img {
  width: 42px;
  height: 42px;
}
.exit{
  width:120px;
  height: 42px;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #ffffff;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #ffffff;
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: #ffffff;
  border-left-style: solid;
  border-left-width: 1px;
  border-left-color: #ffffff;
  border-top-left-radius: 21px;
  border-top-right-radius: 21px;
  border-bottom-left-radius: 21px;
  border-bottom-right-radius: 21px;
}
.title_font {
  font-size: 22px;
  line-height: 42px;
  color: #ffffff;
  text-align: center;
}



.container {
  width: 750px;
  height: 540px;
  background-color: #ffffff;
  position: relative;
}
.finance-bg-img {
  position: absolute;
  height: 540px;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
.user-img {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
.row {
  padding-left: 30px;
  padding-right: 90px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
}
.border_b {
  width: calc(100% - 90px);
  margin-left: 30px;
  padding-left: 0px;
  padding-right: 0px;
  padding-bottom: 10px;
  border-bottom: 1px solid #DCDCDC;
}
.border_img {
  width: 50px;
  height: 50px;
}
.row-left {
  flex-direction: row;
  align-items: center;
}
.finance-img {
  width: 108px;
  height: 108px;
  border-radius: 100%;
}
.img_box {
  width: 108px;
  height: 108px;
  border-radius: 100%;
  overflow: hidden;
}
.user-box {
  margin-left: 20px;
}
.title {
  font-size: 36px;
  color: #FFFFFF;
  font-weight: bold;
  /* font-weight: bold; */
  margin-bottom: 6px;
}
.text {
  width: 500px;
  font-size: 26px;
  color: #FFFFFF;
}
.edit_img_box {
  width: 52px; 
  height: 52px;
  flex-direction: row-reverse;
  align-items: center;
}
.edit_img {
  width: 32px;
  height: 32px;
}
.note-bg {
  margin-top: 40px;
  margin-left: 30px;
  width: 656px;
  height: 52px;
  /* background-image: linear-gradient(to right, #d9a562, #d9a562); */
  border-top-right-radius: 26px;
  border-bottom-right-radius: 26px;
}
.note-box {
  padding-left: 30px;
  padding-right: 25px;
  height: 52px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
}
.note-text {
  width: 550px;
  font-size: 26px;
  color: #fffefe;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.note-img {
  width: 32px;
  height: 32px;
}
.note-img-box {
  width: 52px;
  height: 52px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
</style>
<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const weexHead = weex.requireModule("weex-head");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  props: ["jsonurl"],
  data() {
    return {
      qrimageUrl:"./imgs/tab_user/user/u3909.svg",
      imageUrl: "./imgs/tab_user/user/userimg@3x.png",
      editimg: "./imgs/tab_user/user/editor@3x.png",
      bannerimg: "./imgs/tab_user/user/bg@3x.png",
      rightimg: "./imgs/tab_user/user/more@3x.png",
      userinfo: "北京科蓝软件系统股份有限公司",
      messageUrl: './imgs/templet/titlebar_tab/message@3x.png',
      qrcode:"./imgs/templet/titlebar_tab/qrcode@3x.png",
      username: "交易银行部测试",
      cifname: "北京科蓝软件系统股份有限公司",
      apm: "",
      message: "",
      Mobiel: "",
      isFirst: true,
      myTheme: {
        launcher: "tab.json",
        homeLayout: "layout.json",
        leve: 1
      },
    };
  },
  created() {
    
  },
  mounted(){
    this.judgeTheme()
    this.getMobileData();
    this.getmessage();
  },
  // watch:{   
   
  // },
  methods: {
    // 获取预留信息
    getmessage() {
      this.goJson("/eweb/UpdateAntiFakePre.do", {}, response => {
        this.message = response.data.Message;
      },err=>{},true)
    },
    // 判断主题
    judgeTheme() {
      var myTheme = context.sessionGetString("myTheme");
      if (myTheme) {
        myTheme = JSON.parse(myTheme);
        this.laytou_url = myTheme.homeLayout;
        if (myTheme.launcher == "tabBlue.json") {
          this.bannerimg = "./imgs/tab_user/user/blue.png";
        } else if(myTheme.launcher == "tabRed.json") {
          this.bannerimg = "./imgs/tab_user/user/red.png";
        } else if(myTheme.launcher == "tabCyanBlue.json") {
          this.bannerimg = "./imgs/tab_user/user/green.png";
        }
      }     
    },
    // 加载用户信息
    getMobileData() {
      this.Mobiel = context.secureGetString("Mobiel");
      if (this.isFirst) {
        setTimeout(() => {
          this.getUserStatus();
          this.isFirst = false;
        }, 0);
      }
    },
    // 获取头像
    getPhotoImg() {
      this.Mobiel = context.secureGetString("Mobiel");
      this.$refs.photoImg.getHeadResourece(this.Mobiel, data => {
        if (data != "") {
          //本地有，加载本地
          this.$refs.photoImg.setHeadResourece(this.Mobiel, data);
        } else {
          //本地没有
          this.goJson("/eweb/QueryHeadPortrait.do", {}, response => {
            this.$refs.photoImg.setHeadResourece(
              this.Mobiel,
              response.data.HeadImage
            );
          },err=>{},true);
        }
      });
    },
    // 设置头像事件
    judgeSetPhoto() {
      this.isVisitor(() => {
        this.setPhoto();
      });
    },
    //上传头像
    setPhoto() {
      this.Mobiel = context.secureGetString("Mobiel");
      weexHead.setHeadImage(data => {      
        if (data != "") {
          var token = "";
          this.goJson("/eweb/GenToken4m.do", {}, response => {
            token = response.data._tokenName;
            this.goJson("/eweb/UploadHeadPortrait.do",{
                ImageData: data,
                _tokenName: token
              },response => {
                this.$refs.photoImg.setHeadResourece(this.Mobiel, data);
              },err=>{},true);
          },err=>{},true);
        }
      });
    },
    goto(id) {
      context.launchStage(id);
    },
    // 跳转用户信息设置页面
    userinfoClick() {
      // context.launchStage('main.userinfo');
      this.gotoStage("main.operatorInfo");
    },
    // 跳转预留信息设置页面
    messageClick() {
      context.launchStage('main.reservedInformation');
      // this.gotoStage("main.reservedInformation", true);
    },
    // 加载用户信息
    handler() {
      this.userinfo = this.$store.state.userinfo;
      if (this.userinfo.UserName) {
        this.username = this.userinfo.UserName;
        this.cifname = this.userinfo.CifName;
      } else {
        this.username = "游客";
      }
    },
    // 点击退出登录
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
    getUserStatus() {
      this.getPhotoImg();
      this.handler();
    }
  },
  watch: {
    "$store.state.i"() {
      this.getUserStatus();
    },
    // 监听预留信息
     "$store.state.UpdateAntiFake"(){
        if(this.$store.state.UpdateAntiFake  == '0'){
          this.$store.state.UpdateAntiFake="";
          context.sessionSetString("UpdateAntiFake","");
          this.getmessage();
        }
    }
  }
};
</script>