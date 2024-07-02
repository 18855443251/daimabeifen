<template>
  <div style="background-color: #ffffff;">
      <!-- 工作台上方登录人员信息 -->
      <div class="bannerBox">
          <image class="redBannerimg" :src="bannerimg"></image>
          <text class="tab_bench_title" @click="show">工作台</text>
          <div class="tab_bench_userBox">
              <image class="bench-bg-img" :src="userUrl"></image>         
              <div class="topuser">
                <weex-image class="userimg" ref="photoImg"  v-if="$store.state.isLogin == 'y'"></weex-image>
                <image class="userimg" :src="userimg" v-if="$store.state.isLogin != 'y'"></image>
                <div class="username" v-if="$store.state.isLogin == 'y'">
                  <text class="user">{{$store.state.userinfo.UserName}}，您好！</text>
                  <text class="company">{{$store.state.userinfo.CifName}}</text>
                </div>
                <div class="username" v-if="$store.state.isLogin != 'y'">
                  <text class="user">游客，您好！</text>
                  <text class="company">********</text>
                </div>
              </div>
              <div class="totaltitle">
                <div class="initiate">
                  <text class="totalno" v-if="$store.state.isLogin != 'y'" @click="tologin">**</text>
                  <text class="totalno" v-else>{{$store.state.AuthTotal}}</text>
                  <text class="totalname">我发起的</text>
                </div>
                <div class="initiate">
                  <text class="totalno" v-if="$store.state.isLogin != 'y'" @click="tologin">**</text>
                  <text class="totalno" v-else>{{$store.state.checkTotal}}</text>
                  <text class="totalname">待我审批</text>
                </div>
              </div>
              <div class="touinfo">
                <image style="width: 20px;height: 40px;" :src="touUrl"></image>
              </div>
          </div>
      </div>
      <!-- 切换我发起的，待我审批的tab框 -->
      <div class="tab_bench_Select">
        <text v-for="(item , key) in tabs" :key="key" :class="[activeTab==key?'tab-seleted':'tab-seleteds']" @click="tabSelect(key)">{{item}}</text>
      </div>
      <!-- 没有登录页面组件 isLogin是否登录 -->
      <div class="no_login" v-if="$store.state.isLogin != 'y'">
        <no-login></no-login>
      </div>     
      <div class="tabContent" @swipe="handleSwipe" v-else>
        <audit v-if="activeTab==0"></audit>
        <intiate v-if="activeTab==1"></intiate>
        <deal-with v-if="activeTab==2"></deal-with>
      </div>
      <div class="footer" :style="{'bottom':list_bottom}"  v-if="activeTab==1&&$store.state.isLogin == 'y'&&$store.state.checkList.length>0">
          <div class="selectall">
            <image class="selectimg" :src="unselecturl" v-if="$store.state.showall==false"  @click="selectall"></image>
            <image class="selectimg" :src="selecturl" v-if="$store.state.showall==true"  @click="selectall"></image>
            <text class="select"  @click="selectall">全选</text>
            <text class="selecttotal" v-if="$store.state.showall==true">{{$store.state.checkTotal}}/{{$store.state.checkTotal}}</text>
            <text class="selecttotal" v-if="$store.state.showall==false">{{$store.state.tocheck}}/{{$store.state.checkTotal}}</text>
            <text class="total">总金额 ¥{{moneyFilter($store.state.totalAmount)}}</text>
          </div>
          <div class="button">
            <div class="left_button" @click="refuse">
              <text class="font32 red">拒绝</text>
            </div>
            <div class="right_button" @click="pass">
              <text class="font32 white">通过</text>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule('modal');
import NoLogin from "../components/tab_bench/nologin.vue";
import Intiate from "../components/tab_bench/intiate.vue";
import Audit from "../components/tab_bench/audit.vue";
import DealWith from "../components/tab_bench/dealwith.vue";

export default {
  components: {
    NoLogin,
    Intiate,
    Audit,
    DealWith,
  },
  data() {
    return {     
      userUrl: './imgs/tab_bench/user_bg@3x.png',
      touUrl: './imgs/tab_bench/tou@3x.png',
      upimg: './imgs/tab_bench/u2457.png',
      downimg: './imgs/tab_bench/u2595.png',
      unselecturl:'./imgs/tab_bench/unselected@3x.png',
      selecturl:'./imgs/tab_bench/selected@3x.png',
      bannerimg: './imgs/tab_bench/bg@3x.png',
      userimg:'./imgs/tab_bench/user@3x.png',
      isLogin: false,
      tabs: ["我发起的", "待我审批", "我处理的"],
      activeTab: 1,
      AuthList:[],
      itemer:"",
      username:"",
      Mobiel: "",
      cifname:"欢迎来到美团银行科技有限公司",
      myTheme: {
        launcher: "tab.json",
        homeLayout: "layout.json",
        leve: 1
      },
      touxiang:false,
      list_bottom: 102,
      Amount: 0,
      starttime:"",
      endtime:"",
      StartAmount:"",
      EndAmount:"",
      begindate:"",
      enddate:"",
      timeflag:"",
      transcode:"",
      checkitemList: [],
    };
  },
  watch:{
     "$store.state.i"() {
        setTimeout(() => {
          this.getPhotoImg();
        },500)
      },
      "$store.state.launcherTabbarTimes":{
          handler(newV,oldV){
              this.activeTab=1;
          },
          immediate:true
      },
  }, 
  mounted(){ 
    this.$store.state.isIntiateIndex=true;
    this.getListBottom();
    this.judgeTheme();
    this.getPhotoImg();
  },
  methods: {
    // 请求待审核数据列表            
      getCheck(){
          //服务需要上送的字段
          var params = {
              TransCode:this.transcode,
              StartAmount:this.StartAmount,
              EndAmount:this.EndAmount,
              BeginDate:this.begindate,
              EndDate:this.enddate,
              TimeFlag:this.timeflag,
          };
          this.goJson("/eweb/AuthListForMob.do", params, response => {
              this.$store.state.checkList=response.data.EjnlList;
              this.$store.state.checkTotal=response.data.RecordNumber;
          });
      },
      // 获取我发起的列表
      getAuduit() {
          //服务需要上送的字段
          var params = {
              TransCode:this.transcode,
              JnlState:"0",
              AcNo:"",
              StartAmount:this.StartAmount,
              EndAmount:this.EndAmount,
              BeginDate:this.begindate,
              EndDate:this.enddate,
              TimeFlag:this.timeflag
          };
          this.goJson("/eweb/MobQueryJnls.do", params, response => {
              this.$store.state.auduitList=response.data.EjnlList;
              this.$store.state.AuthTotal=response.data.RecordNumber;
          });
      },
      // 请求我处理的数据列表
        getDealList() {
            //服务需要上送的字段
            var params = {
                TransCode:this.transcode,
                JnlState:"0",
                StartAmount:this.StartAmount,
                EndAmount:this.EndAmount,
                BeginDate:this.begindate,
                EndDate:this.enddate,
                TimeFlag:this.timeflag,
                CurrentIndex:0,
                PageSize:'20'
            };
            this.goJson("/eweb/AuthMyDealQry.do", params, response => {
                this.$store.state.dealList=response.data.EtrsJnlList;  
            });
        },
    // 获取定位离底部高度
    getListBottom() {
      if(this.isipx()) {
        this.list_bottom = 150
      } else {
        this.list_bottom = 102
      }
    },
    // 获取主题
    judgeTheme() {
      var myTheme = context.sessionGetString("myTheme");
      if (myTheme) {
        myTheme = JSON.parse(myTheme);
        this.laytou_url = myTheme.homeLayout;
        if (myTheme.launcher == "tabBlue.json") {
          this.bannerimg = "./imgs/tab_bench/blue.png";
          this.userUrl = "./imgs/tab_bench/user_blue.png";
          this.touUrl = "./imgs/tab_bench/tou_blue.png";
        } else if(myTheme.launcher == "tabRed.json") {
          this.bannerimg = "./imgs/tab_bench/red.png";
          this.userUrl = "./imgs/tab_bench/user_red.png";
          this.touUrl = "./imgs/tab_bench/tou_red.png";
        } else if(myTheme.launcher == "tabCyanBlue.json") {
          this.bannerimg = "./imgs/tab_bench/green.png";
          this.userUrl = "./imgs/tab_bench/user_green.png";
          this.touUrl = "./imgs/tab_bench/tou_green.png";
        }
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
          });
        }
      });
    },
    // 点击tab标签
    handleSwipe(e){
      if(e.direction=="right"){
        if(this.activeTab<2){
          this.activeTab++;
        }else{
          this.activeTab=0;
        }
      }else if(e.direction=="left"){
        if(this.activeTab>0){
          this.activeTab--;
        }else{
          this.activeTab=2;
        }
      }
    },
    //未登陆进入登陆页面
    tologin(){
      context.replaceStage("main.login");
    },
    tabSelect(param) {
      if (this.activeTab != param) {
        this.activeTab = param;
      }
      if(param == 1) {
        this.getListBottom();
      }
    },
    // 点击拒绝跳转
    refuse(){
      if(this.$store.state.selectList.length<1){
        this.showOneBtnAlert("请选择待审核交易","确定");
        return
      }
    context.sessionSetString("tocheck", this.$store.state.tocheck);
    context.sessionSetString("totalAmount", this.$store.state.totalAmount);
    context.sessionSetString("selectLists", JSON.stringify(this.$store.state.selectList));
    context.sessionSetString("checkFlag", "0");
    context.launchStage("main.WorkSpaceCheck");
    },
    // 点击通过跳转
    pass(){
      if(this.$store.state.selectList.length<1){
        this.showOneBtnAlert("请选择待审核交易","确定");
        return
      }
    context.sessionSetString("tocheck", this.$store.state.tocheck);
    context.sessionSetString("totalAmount", this.$store.state.totalAmount);
    context.sessionSetString("selectLists", JSON.stringify(this.$store.state.selectList));
    context.sessionSetString("checkFlag", "1");
    context.launchStage("main.WorkSpaceCheck");
    },
    //选项判断
    selectall(){
      this.$store.state.showall=!this.$store.state.showall;
      this.$store.state.totalAmount= 0;
      if(this.$store.state.showall==true){
        for(let i in this.$store.state.checkList){
          this.$store.state.checkList[i].selectShow=true;
          this.$store.state.checkList.splice(i,1,this.$store.state.checkList[i])
          if(this.$store.state.checkList[i].Amount){
            this.$store.state.totalAmount += this.$store.state.checkList[i].Amount*1;
          }
          
        }
        this.$store.state.selectList=this.$store.state.checkList;
        this.$store.state.tocheck=this.$store.state.checkList.length;
      }else if(this.$store.state.showall==false){
        for(let i in this.$store.state.checkList){
          this.$store.state.checkList[i].selectShow=false;
          this.$store.state.checkList.splice(i,1,this.$store.state.checkList[i])
        }
        this.$store.state.tocheck = 0;
        this.$store.state.selectList=[];
        this.$store.state.totalAmount= 0;
      }
      this.$store.state.totalAmount=this.$store.state.totalAmount.toFixed(2);
    },
    //是否是iphoneX iphoneXS iphoneXSMax  iPhone11
    isipx() {
        let [deviceList, deviceModel] = [
          [
            'iPhone10,3',
            'iPhone10,6',
            'iPhone11,8',
            'iPhone11,2',
            'iPhone11,4',
            'iPhone11,6',
              // 'iPhone12,1',
              // 'iPhone11,3',
              // 'iPhone11,5'
  
          ],
          weex.config.env.deviceModel
        ];
        return deviceList.indexOf(deviceModel) != '-1';
    },
  },
  // beforeDestroy(){
  //   clearTimeout(this.itemer)
  // }
};
</script> 

<style scoped>
.bannerBox{
  width: 750px;
  height: 394px;
  position: relative;
}
.redBannerimg{
  position: fixed;
  top: 0;
  width: 750px;
  height: 394px;
}
.tab_bench_title{
  width: 750px;
  font-size: 36px;
  font-weight: bold;
  color: #fff;
  position: fixed;
  top:62px;
  text-align: center;
}
.tab_bench_userBox{
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  width: 690px;
  height: 256px;
  position: fixed;
  top: 122px;
  left: 30px;
  bottom: 120px;
  background-color: #fff;
}
.tab_bench_Select{
  width: 750px;
  height: 90px;
  flex-direction: row;
  background-color: #ffffff;
  align-items: center;
  border-bottom-color: #eaeaea;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  position: fixed;
  top: 394px;
}














.selecttotal{
  margin-left: 10px;
  font-size: 28px;
  color: #333333;
}
.select{
  font-size: 28px;
  color: #AAAAAA;
}
.total{
  font-size: 30px;
  color: #FF1A58;
  width: 450px;
  text-align: right;
  margin-left: 30px;
}
.selectimg {
  width: 34px;
  height: 34px;
  margin-right: 20px;
  margin-left: 40px;
}
.white{
  color: #ffffff;
}
.red{
  color: #E6022C;
}
.font32{
  font-size: 32px;
}
.selectall{
  height: 90px;
  /* margin-bottom: 30px; */
  flex-direction: row;
  align-items: center;
}
.button{
  height: 90px;
  flex-direction: row;
}
.footer{
    position: fixed;
    flex-direction: column;
    height: 179px;
    width: 750px;
    background-color: #fff;
    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: #eee;
    z-index: 1000;
}
.left_button{
    width: 325px;
    height: 88px;
    border-top-style: solid;
    border-top-width: 2px;
    border-top-color: #E6022C;
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-color: #E6022C;
    border-right-style: solid;
    border-right-width: 2px;
    border-right-color: #E6022C;
    border-left-style: solid;
    border-left-width: 2px;
    border-left-color: #E6022C;
    /* border: 2px solid #E6022C; */
    border-radius: 12px;
    align-items: center;
    justify-content: center;
    margin-left: 30px;
}
.right_button{
    margin-left: 40px;
    width: 325px;
    height: 88px;
    /* background-color: #E6022C; */
    background-image: linear-gradient(to right,#FB5D7A,#E6022C);
    /* background-image: linear-gradient(124deg, #FB5D7A 0%, #E6022C 100%); */
    border-radius: 12px;
    align-items: center;
    justify-content: center;
}
.bench-bg {
  /* background-color: #424242; */
  width: 750px;
  height: 394px;
  align-items: center;
}
.bench-bg-img {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
.title {
  font-size: 36px;
  font-weight: bold;
  color: #fff;
  margin-top:62px;
  /* padding: 80px 0 50px 40px; */
}
.user_box{  
  flex-direction: row;
  align-items: flex-end;
}
.userinfo{
  /* background-color: #FFFFFF; */
  /* box-shadow: inset 0 -4px 10px 0 #FF9BAD; */
  /* border-radius: 24px 24px 0 0; */
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  width: 690px;
  height: 256px;
  margin-top:15px;
  margin-left: 25px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.topuser{
  /* height: 128px; */
  flex-direction: row;
}
.userimg{
  width: 100px;
  height: 100px;
  margin-top: 20px;
  margin-left: 20px;
}
.username{
  flex-direction: column;
  width: 500px;
  margin-top: 35px;
  margin-left: 30px;
}
.user{
  font-size: 36px;
  color: #333333;
  line-height: 36px;
  font-weight: bold;
}
.touinfo{
  width: 20px;
  height: 40px;
  position: absolute;
  bottom: 0px;
  right:-20px;
}
.company{
  font-size: 26px;
  color: #666666;
  line-height: 26px;  
  margin-top: 20px;
}
.totaltitle{
  height: 128px;
  flex-direction: row;
}
.initiate{
  width: 345px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.totalno{
  font-size: 42px;
  color: #1C1B1B;
}
.totalname{
  font-size: 26px;
  color: #7C7C7C;
}
.tab {
  width: 750px;
  height: 90px;
  flex-direction: row;
  /* justify-content: space-around; */
  background-color: #ffffff;
  align-items: center;
  border-bottom-color: #eaeaea;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}
.tabItem {
  /* margin-top: 26px; */
  flex-direction: column;
  align-items: center;
  width: 250px;

}
/* .tab-unseleted {
  font-size: 32px;
  color: rgb(34, 34, 34);
} */
.tab-seleted {
  width: 250px;
  height: 90px;
  font-weight: bold;
  line-height: 90px;
  text-align: center;
  font-size: 34px;
  color: #333333;
  border-bottom-color: #333333;
  border-bottom-style: solid;
  border-bottom-width: 6px;
}
.tab-seleteds {
  width: 250px;
  height: 90px;
  line-height: 90px;
  text-align: center;
  font-size: 30px;
  color: #555555;
}
/* .tab-seleted:after {
  content: '';
  position: absolute;
  left: 65px;
  top: auto;
  bottom: 0;
  right: auto;
  height: 8px;
  width: 60px;
  background-color: #fff;
} */
.tabContent {
  position: fixed;
  top: 484px;
  width: 2250px;
  flex-direction: row;
  /* transition: left 0.2s ease-in-out;   */
}
.no_login {
  width: 750px;
  flex-direction: row;
}
</style>
