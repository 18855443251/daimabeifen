<template>
  <div class="box">
    <nav-bar :title="title"></nav-bar>
    <div class="title">
        <text class="gesText1">{{myTxt1}}</text>
        <text class="gesText2" :style="{color:myColor}">{{myTxt2}}</text>
    </div>
      <div class="active-box">
        <weex-lockview ref="lockview" class="active" 
          @onComplete="onComplete" 
          lineWidth="8" 
          normalColor="#FFE0E0" 
          selectColor="#DF0314" 
          errorColor="#F84646" 
          ratio="0.6">
        </weex-lockview>
    </div>
   </div>
</template>
<style scoped>
.box {
  width: 750px;
  height: 1334px;
}
.title {
  justify-content: center;
  align-items: center;
}
.gesText1 {
  padding-top: 50px;
  font-size: 50px;
  color: #333333;
}
.gesText2 {
  font-size: 25px;
  margin-top: 20px;
}
.active-box {
  width: 750px;
  margin-top: 50px;
  justify-content: center;
  align-items: center;
}
.active {
  width: 600px;
  height: 600px;
}
</style>
<script>
import NavBar from "../components/titlebar_component.vue"
const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const gesturePlugin = weex.requireModule("wxEncryption");
const loading = weex.requireModule("wxEncryption");
const wjalert = weex.requireModule("weex-alert")
export default {
  components: { NavBar },
  data() {
    return {
      title: "手势密码设置",
      selectNums: "",
      UserId: context.secureGetString("UserId"),
      myTxt1: "请设置您的手势密码",
      myTxt2: "手指轻划触动即可",
      myColor: "#999999",
      timeStamp: "",
      temp: []
    };
  },
  methods: {
    onComplete(event) {
      if(this.selectNums == ""){
        if (event.text.length >= 4){
          this.selectNums = event.text;
          this.myTxt1 = "请再次绘制您的手势密码";
        }else{
          this.selectNums == "";
          this.myTxt2 = "请至少连接4个点";
          this.myColor = "#c40000";
        }
        this.$refs.lockview.clear();
      }else if(event.text == this.selectNums){
        this.$refs.lockview.clear();
        loading.showLoading("");
        stream.fetch({
              method: "POST",
              url: "/refacmob/Timestamp.do",
              type: "json",
              headers:{ "Content-Type": 'application/json'}
           },response =>{
            if(response.status == 200){
              if(response.data._RejCode == '000000'){
                this.timeStamp = response.data.Timestamp;
                  if(event.text.length < 5){
                        event.text += "00";
                     }
                  if(event.text.length < 6){
                        event.text += "0";
                    }
             gesturePlugin.strEnctypt(event.text, this.timeStamp, data => {
              const params = {
                LoginAuthType: "G",
                LoginAuthVal: data.replace(/\+/g, "%2B"),
                ConfirmLoginAuthVal: data.replace(/\+/g, "%2B")
              };
              stream.fetch({
                    method: "POST",
                    url: "/refacmob/LoginAuthTypeAdd.do",
                    type: "json",
                    body:JSON.stringify(params),
                    headers:{"Content-Type": "application/json"}
                },response => {
                  loading.stopLoading();
                  if(response.status == 200) {
                    if(response.data._RejCode == "000000"){
                      if(response.data.AddFlag == "true"){
                        this.$refs.lockview.clear();
                        context.secureSetString("gestureState", "N");
                        context.secureSetString("lastopen", "ges");
                        this.jump("/logintype");
                        modal.toast({message: "手势开启成功"});
                      }else{
                        wjalert.alert(response.data.errmsg,"确定",data=>{})
                        this.$refs.lockview.clear();
                      }
                    }else if(response.data._RejCode=="888888"||response.data._RejCode=="777777"){
                      wjalert.alert(response.data.errmsg,"确定",data=>{
                        context.sessionSetString("isLogin", "")
                        context.sessionSetString('userinfo', '')
                        context.clearToken();
                        context.sessionSetString("nextScenes","");
                        context.replaceStage("main.login?flag=1")
                      })
                    }else{
                      wjalert.alert(response.data.errmsg,"确定",data=>{})
                      this.$refs.lockview.clear();
                    }
                  }
                })
             })
             }
           }else{
            wjalert.alert("服务器通讯异常或网络连接失败","确定",data=>{})
           }
      })
      }else{
        this.$refs.lockview.error();
        this.myTxt2 = "与上次绘制不一致，请重新绘制";
        this.myColor = "#c40000";
        this.$refs.lockview.clear();
      }
    }
  }
};
</script>
