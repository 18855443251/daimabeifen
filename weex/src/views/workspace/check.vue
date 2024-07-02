<template>
  <div class="home">
    <NavBar :title="title"></NavBar>

    <div class="container">
      <list class="list_info" :style="{'bottom':main_bottom+'px'}">
        <cell>
          <div class="contents">
            <div class="allcontents" v-for="(item,index) in selectList" :key="index">
              <div class="details">
                <text class="details_type">{{item.TransName}}</text>
                <text class="details_amt" v-if="item.Amount">¥{{money(item.Amount)}}</text>
              </div>
              <div class="details">
                <text class="details_trstime">{{item.TransTime}}</text>
                <text class="details_status">待审核</text>
              </div>
            </div>
            <div class="p"></div>
          </div>
        </cell>
      </list>

      <div class="refuse" v-if="checkflag=='0'" :style="{'bottom':list_bottom+'px'}">
        <text class="refuse_info">拒绝原因</text>
        <textarea
          placeholder="请输入拒绝原因"
          rows="4"
          cols="30"
          v-model="RefuseReason"
          class="input"
          @focus="showfocus"
          @blur="showblur"
          maxlength="9"
        ></textarea>
      </div>
      <div class="footer">
        <div class="selectall">
          <text class="select">共{{tocheck}}笔</text>
          <text style="font-size:30px;color:#FF1A58" v-if="isShowAmount">总金额 ¥{{moneyFilter(totalAmount)}}</text>
        </div>
        <div class="button" v-if="checkflag=='0'" @click="refuse">
          <text class="font32 white">确认拒绝</text>
        </div>
        <div class="button" v-else @click="pass">
          <text class="font32 white">确认通过</text>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.p {
  height: 120px;
  width: 750px;
}
.refuse_info {
  margin-top: 36px;
  font-size: 36px;
  color: #333333;
  font-weight: bold;
  margin-left: 30px;
}
.list_info {
  width: 750px;
  position: fixed;
  top: 190px;
  /* height: 750px; */
}
.refuse {
  width: 750px;
  height: 260px;
  background-color: #ffffff;
  position: fixed;
}
.input {
  width: 690px;
  height: 160px;
  font-size: 28px;
  color: #aaaaaa;
  margin-left: 30px;
  background-color: #f7f7f7;
  padding: 20px;
  line-height: 40px;
  margin-top: 24px;
}
.select {
  font-size: 30px;
  color: #333333;
}
.total {
  font-size: 30px;
  color: #333333;
}
.white {
  color: #ffffff;
}
.font32 {
  font-size: 32px;
}
.selectall {
  width: 670px;
  height: 90px;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  margin-left: 40px;
  justify-content: space-between;
}
.button {
  width: 670px;
  height: 88px;
  background-image: linear-gradient(to right, #fb5d7a, #e6022c);
  flex-direction: row;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-left: 40px;
}
.footer {
  background-color: #ffffff;
  position: fixed;
  bottom: 20px;
  flex-direction: column;
  border-top-width: 1px;
  border-top-color: rgb(234,234,234);
  height: 180px;
  width: 750px;
}

.contents {
  /* position: absolute; */
  width: 750px;
  display: flex;
  flex-direction: column;
}
.allcontents {
  width: 690px;
  height: 150px;
  margin-top: 20px;
  margin-left: 30px;
  background-color: #ffffff;
  border-width: 1px;
  border-color: rgb(245, 245, 245);
  border-style: solid;
  border-radius: 12px;
  flex-direction: column;
  align-items: center;
}
.details {
  margin-left: 24px;
  flex-direction: row;
  justify-content: space-between;
  width: 642px;
  height: 75px;
  align-items: center;
}

.details_trstime {
  font-size: 24px;
  color: #aaaaaa;
  line-height: 75px;
  margin-bottom: 20px;
}
.details_status {
  font-size: 28px;
  color: #7c7c7c;
  line-height: 75px;
  margin-bottom: 20px;
}
.details_type {
  font-size: 30px;
  color: #333333;
  line-height: 75px;
  margin-top: 30px;
}
.details_amt {
  font-size: 32px;
  color: #333333;
  line-height: 75px;
  margin-top: 30px;
}

.margin32 {
  margin-left: 32px;
}
.home {
  width: 750px;
  /* margin-top: 140px; */
}
.container {
  width: 750px;
  /* height: 900px; */
  background-color: #ffffff;
  /* margin-bottom: 200px; */
}
.bottom {
  width: 750px;
  height: 96px;
  position: fixed;
  bottom: 0;
  background-color: rgb(254, 79, 64);
  /* background-image: linear-gradient(
    to bottom,
    rgb(254, 79, 64),
    rgb(254, 107, 65)
  ); */
}

.text {
  margin-left: 296px;
  margin-top: 32px;
  font-family: "PingFangSC-Medium";
  font-size: 32px;
  color: rgb(255, 255, 255);
  text-align: left;
}
</style>
<script>
import NavBar from "@/components/templet/titlebar";
const context = weex.requireModule("context");
const modal = weex.requireModule("modal");
const wjalert = weex.requireModule("weex-alert");
export default {
  components: {
    NavBar
  },
  data() {
    return {
      title: "审核确认",
      BgColor: "rgb(64,64,64)",
      FontColor: "#ffffff",
      useDefaultReturn: false,
      selectList: [],
      checktype: "",
      checkflag: "",
      AuthList: [],
      list_bottom: "280",
      main_bottom:'',
      totalAmount: "",
      tocheck: "",
      RefuseReason:'',
      isShowAmount:true
    };
  },
  created() {
    
  },
  mounted() {
    this.totalAmount = context.sessionGetString("totalAmount");
    
    this.tocheck = context.sessionGetString("tocheck");
    this.selectList = JSON.parse(context.sessionGetString("selectLists"));
    this.checkflag = context.sessionGetString("checkFlag");
    if (this.checkflag == "0") {
      this.checktype = "拒绝";
      this.main_bottom='540';
    } else if (this.checkflag == "1") {
      this.checktype = "通过";
      this.main_bottom='220';
    };
    // this.totalAmount=this.totalAmount.toFixed(2);
    if(!this.totalAmount||parseFloat(this.totalAmount)==0){
      this.isShowAmount=false;
    }
  },
  methods: {
    //失去焦点
    showblur() {
      this.list_bottom = "280";
    },
    //获取焦点
    showfocus() {

    },
    // 确认拒绝
    refuse() {
      if(!this.RefuseReason){
          wjalert.alert("请输入拒绝原因",'确定',data=>{});
          return;
      }else{
          const resultparams = {
            AuthList: this.selectList,
            _AuthAction: "Reject",
            RefuseReason:this.RefuseReason
          };
          this.goJson("/eweb/AuthResult.do", resultparams, response => {
            let isGetCheck=context.sessionGetString("isGetCheck")||this.$store.state.isGetCheck;
            isGetCheck++;
            context.sessionSetString("isGetCheck",isGetCheck);//切换isGetCheck状态以在finish关闭场景后可实时刷新列表数据
            this.$router.push({
              path:'/CheckResult',
              query:{
                checkResultInfo:response.data.Result
              }
            });
          });
      }
    },
    // 确认通过
    pass() {
      const resultparams = {
        AuthList: this.selectList,
        _AuthAction: "Accept"
      };
      this.goJson("/eweb/AuthResult.do", resultparams, response => {
        // this.toastMsg("审核成功");
        let isGetCheck=context.sessionGetString("isGetCheck")||this.$store.state.isGetCheck;
        isGetCheck++;
        context.sessionSetString("isGetCheck",isGetCheck);//切换isGetCheck状态以在finish关闭场景后可实时刷新列表数据
        this.$router.push({
          path:'/CheckResult',
          query:{
            checkResultInfo:response.data.Result
          }
        });
        // context.finish();
      });
    },
  }
};
</script>



