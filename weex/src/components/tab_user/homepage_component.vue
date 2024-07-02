<template>
  <div class="comcontainer">
    <div class="banker-botto">
      <div class="banker-botto-div">
        <image class="logb" :src="totalimg"></image>
        <text class="title">企业资产</text>
        <image class="loga" :src="isshow?eyeimg:closeimg" @click="eyeClick"></image>
      </div>
    </div>
    <div class="banker" @click="moreClick">
      <text class="left_account">{{isshow? money(this.AllDal) :'******'}}</text>
        <image class="logal" :src="rightimg"></image>     
      <!-- <div class="banker-center-left ">
        
      <image class="logal" :src="rightimg" @click="moreClick"></image> -->
        <!-- <text class="right_account" style="color:#d00111">{{isshow? this.debt :'******'}}</text>
        <text class="tite_top">总负债（元）</text>
      </div> -->
    </div>
    <div class="banker-center-bottom">       
        <text class="tite_top">总资产（元）</text>
      </div>
  </div>
</template>

<style scoped>
.comcontainer {
  width: 690px;
  height: 268px;
  position: absolute;
  top: 400px;
  left: 30px;
  background-color: #ffffff;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  border-width: 1px;
  border-color: rgb(245, 245, 245);
  border-style:solid;
}

.banker-botto {
  padding-left: 30px;
  padding-right: 60px;
  height: 100px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.banker-botto-div {
  height: 100px;
  flex-direction: row;
  align-items: center;
}

.title { 
  margin-left: 10px;
  font-weight: bold;
  font-size: 30px;
  color: #333333;
}
.loga { 
  width: 40px;
  height: 40px;
  margin-left: 30px;
}
.logb { 
  width: 32px;
  height: 32px;
}
.logal {
  width: 14px;
  height: 24px;
}
.banker {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 30px;
  margin-right: 60px;
}
.banker-center-bottom {
  margin-left: 30px;
  margin-top: 20px;
}
.left_account {
  font-size: 48px;
  color: #333;
}
.right_account {
  font-size: 48px;
  font-weight: bold;
  color: #d00111;
  margin-top: 10px;
}
.tite_top {
  font-size: 26px;
  color: #7c7c7c;
}
</style>
<script>
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
const loading = weex.requireModule("loading");
const wjalert = weex.requireModule("weex-alert");

export default {
  props: {
    finance: {
      type: String
    }
  },
  data() {
    return {
      isshow: false,
      debt: "0.00",
      AllDal: "0.00",
      eyeimg: "./imgs/tab_user//homepage/eye.png",
      closeimg: "./imgs/tab_user//homepage/closeeye.png",
      totalimg:"./imgs/tab_user//homepage/total@3x.png",
      rightimg: "./imgs/tab_user//user/more.png"
    };
  },
  created() {
    this.searchCF();
    // this.isshow = context.sessionGetString("isshow");
  },
  methods: {
    eyeClick() {
      this.isshow = !this.isshow;
      context.sessionSetString("isshow",this.isshow);
    },
    moreClick() {
      context.launchStage("main.property");
    },
    searchCFBefore() {
      this.isVisitor(() => {
        this.searchCF();
      });
    },
    // 查询总资产
    searchCF() {
      this.goJson("/eweb/TotalAssQry.do", {}, response => {
        this.AllDal = response.data.List[0].AllDal;
      });
    }
  },
  watch: {
    "$store.state.i": function() {
      if (this.$store.state.isLogin == "y") {
        // this.isshow = context.sessionGetString("isshow");
      }
    },
    "$store.state.launcherTabbarTimes":{
          handler(newV,oldV){
              this.searchCF();
          },
          immediate:true
      },
  }
};
</script>