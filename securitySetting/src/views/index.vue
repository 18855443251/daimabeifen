<template>
  <div>
    <nav-bar :title="title"></nav-bar>
      <div class="box">
        <div class="logintype">
          <div class="type_top" @click="modifypwd">
              <text class="Text">登录密码修改</text>
              <image class="loginmodify" :src="loginmodify"/> 
          </div>
          <div class="type">
              <text class="Text">{{loadMessage}}</text>
              <!-- <wjSwitch class="switchIcon1" ref="fingerswitch" :status="checkflag" @onChange="fingerEvent"></wjSwitch> -->
              <image class="switchIcon1" :src="openmodify" @click="shutgFingerEvent" v-if="finger==true" />
              <image class="switchIcon1" :src="shutmodify" @click="opengFingerEvent" v-if="finger==false" />
          </div>
          <div class="type_two" @click="jumpRecord">
              <text class="Text">登录记录查询</text>
              <image class="loginmodify" :src="loginmodify"/> 
          </div>
        </div>
        <div class="gray"></div>
        <div class="logintype_two">
          <div class="type_two">
              <text class="Text">账号保护</text>
              <image class="switchIcon1" :src="openmodify" @click="shutgestureEvent" v-if="open==true"/>
              <image class="switchIcon1" :src="shutmodify" @click="opengestureEvent" v-if="open==false"/>
          </div>
        </div>
        <div class="gray"></div>
        <div class="logintype_three">
          <div class="type_three" @click="jumpYundun" v-if="isAuth">
              <text class="Text">云盾管理</text>
              <text class="blue_Text">{{YundunFlag}}</text>
              <image class="loginmodify" :src="loginmodify"/> 
          </div>
          <div class="type_three" v-else>
              <text class="Text">云盾管理</text>
              <text class="blue_Text">{{YundunFlag}}</text>
              <image class="loginmodify" :src="loginmodify"/> 
          </div>
        </div>

        <div class="null">

        </div>
      </div>
   </div>
</template>

<style scoped>
.box {
  width: 750px;
  height: 1206px;
  background-color:rgba(255,255,255,1);
}
.logintype{
  width:750px;
  height:330px;
  background-color:rgba(255,255,255,1);
}
.type {
  width: 720px;
  height: 110px;
  margin-left:30px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1);
  flex-direction: row;
  align-items: center;
}
.type_top{
  width: 720px;
  height: 110px;
  margin-left:30px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1);
  flex-direction: row;
  align-items: center;
}
.type_two{
  width: 720px;
  height: 110px;
  margin-left:30px;
  flex-direction: row;
  align-items: center;
}
.gray{
  width:750px;
  height:20px;
  background-color:rgba(249,249,249,1);
}
.logintype_two{
  width:750px;
  height:110px;
  background-color:rgba(255,255,255,1)
}
.logintype_three{
  width:750px;
  height:110px;
  background-color:rgba(255,255,255,1)
}
.type_three{
  width: 720px;
  height: 110px;
  margin-left:30px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(234,234,234,1);
  flex-direction: row;
  align-items: center;
}
.Text {
  font-size:30px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:30px;
}
.blue_Text{
  font-size:28px;
  font-family:PingFang-SC-Medium,PingFang-SC;
  font-weight:500;
  margin-top:5px;
  margin-left:444px;
  color:rgba(74,137,252,1);
}
.loginmodify {
  width: 14px;
  height: 24px;
  right:30px;
  bottom:39px;
  position:absolute;
}
.iconUrl {
  width: 48px;
  height: 48px;
  margin-left: 30px;
}
.rightUrl{
  width: 28px;
  height: 28px;
  right:30px;
  position:absolute;
}
.switchIcon1 {
  width: 104px;
  height: 66px;
  top:24px;
  right:28px;
  position:absolute;
}
.null{
  width:750px;
  height:596px;
  background-color:rgba(255,255,255,1)
}
</style>

<script>
import NavBar from "../components/titlebar_component.vue"
const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const fingerPlugin = weex.requireModule("wxEncryption");
const weexfido = weex.requireModule("weex-fido");
const loading = weex.requireModule("wxEncryption");
const wjalert = weex.requireModule("weex-alert");
const cfcaPlugin = weex.requireModule("yunzhengtong");//云盾

export default {
  components: { NavBar },
  data() {
    return {
      isAuth:false,
      title: "安全设置",
      loginmodify: this.$store.state.imgBaseUrl + "more@3x.png",
      openmodify: this.$store.state.imgBaseUrl + "open@2x.png",
      shutmodify: this.$store.state.imgBaseUrl + "shut@2x.png",
      UAFRequest: "",
      retCode: "",
      open:false,
      finger:false,
      // isFace:true,
      // isfinger:true,
      YundunFlag:"",  //云盾是否开通标识
      loadMessage:"", //指纹/面容登录

      getRandomInfo:{},
      signresult: "",
      authdata:'',
      getCertFlag:'',//获取login.do返回的CertFlag
      data1:'',
      serverRandom:'',//云盾获取的随机数
      logo:"",//账号保护弹框标志
      isClick:true//  防止重复点击标志
    };
  },
  mounted() {
    this.judgedevice();  //判断
  },
  created() {
    
    //账号保护
    // if(context.secureGetString("CertFlag") == "0"){
    //   this.YundunFlag='已开通'
    // }else{
    //   this.YundunFlag='未开通'
    // }
    this.getCertFlag=context.secureGetString("CertFlag");
    this.getRandom();
    setTimeout(() => {
        this.getRate();
    }, 200);
   
  },
  watch: {
    "$store.state.isgoBack"() {
      if (this.$store.state.isgoBack == "1" && this.$store.state.isYundun=="1") {
        this.$store.state.isgoBack="";
        context.sessionSetString('isgoBack',"")
        this.getCertFlag=context.secureGetString("CertFlag");
        this.getRandom();
      }
    }
  },
  methods: {
    //跳转登录密码修改
    jumpFido(){
      context.launchStage("main.logintype");  
    },
    //判断设备
    judgedevice(){ 
        weexfido.isSupportFido(data=>{
            if(JSON.parse(data).isSupport == 'Y'){

                if(context.secureGetString("DactyState") == "C"){
                        this.finger = false
                }else{
                        this.finger = true
                }
                  // this.finger = true
            }
            // else if(JSON.parse(data).msg == '000001'){
            //     wjalert.alert(JSON.parse(data).errorMsg,"确定",data=>{})
            //     loading.stopLoading();
            //     // this.$refs.fingerswitch.onChange("false");
            //     this.finger = false
            // }else if(JSON.parse(data).msg == '000002'){
            //     wjalert.alert("该设备未开启FaceID权限","确定",data=>{})
            //     loading.stopLoading();
            //     // this.$refs.fingerswitch.onChange("false");
            //     this.finger = false
            // }
            // else{
            //     wjalert.alert("手机不支持指纹！","确定",data=>{})
            //     loading.stopLoading();
            //     // this.$refs.fingerswitch.onChange("false");
            //     this.finger = false
            // }
            //指纹/面容登录
            if(JSON.parse(data).isModels == 'F'){
                this.loadMessage="面容登录"
            }else{
                this.loadMessage="指纹登录"
            }
        })
    },
    getRate(){
      this.post('/eweb/AcNoProtectPre.do',{   
        
      },((response)=>{

        this.RateList=response.data;
        //账号保护
        if(response.data.AcNoProtect && response.data.AcNoProtect.ArgValue=='Y'){
              this.open = true
              if(this.logo=="1"){
                wjalert.alert('开启成功', "确定", data => { })
              }
              // wjalert.alert('开启成功', "确定", data => { })
        }else{
              this.open = false
              if(this.logo=="1"){
                wjalert.alert('关闭成功', "确定", data => { })
              }
              // wjalert.alert('关闭成功', "确定", data => { })
        }
      }))
    },
    //账号保护开启状态时关闭
    shutgestureEvent(){
      this.post('/eweb/AcNoProtect.do',{   
            Opt:"-1",
            ArgName:"AcNoProtect"
      },((response)=>{

        this.RateList=response.data;
        context.sessionSetString("AcNoProtect", "N");
        this.getRate();
        this.logo="1"
        // wjalert.alert('关闭成功', "确定", data => { })
      }))
    },
    //账号保护关闭状态时开启
    opengestureEvent(){
      this.post('/eweb/AcNoProtect.do',{   
            ArgValue:"Y",
            Opt:"1",
            ArgName:"AcNoProtect"
      },((response)=>{

        this.RateList=response.data;
        context.sessionSetString("isShowBank",true)
        context.sessionGetString("isShowBank")
        context.sessionSetString("AcNoProtect", "Y")
        this.getRate();
        this.logo="1"
        // wjalert.alert('开启成功', "确定", data => { })
        
      }))
    },
    //指纹登录开启状态时关闭
    shutgFingerEvent(){
      const closeparams = {
          DeviceID: context.envGet("DeviceID"),
          AuthType: "auth",
          UserVerification: ""
      };
      loading.showLoading("");
      stream.fetch({
          method: "POST",
          url: `/eweb/DeRegulateId.do`,
          type: "json",
          body:JSON.stringify(closeparams),
          headers: { "Content-Type": "application/json","accept": "text/mobjson"}
        },response => {
          if(response.status == 200) {
            if(response.data._RejCode == "000000") {
              loading.stopLoading();
              // modal.toast({message:"关闭成功"});
              // this.$refs.fingerswitch.onChange("false");
              context.secureSetString("DactyState", "C");
              wjalert.alert("关闭成功","确定",data=>{});
            }else if(response.data._RejCode=="888888"||response.data._RejCode=="777777"){
                // modal.toast({message:'关闭失败'});
                // this.$refs.fingerswitch.onChange("true");
                this.finger = true
                wjalert.alert(response.data.errmsg,"确定",data=>{
                    context.sessionSetString("isLogin", "")
                    context.sessionSetString('userinfo', '')
                    context.clearToken();
                    context.sessionSetString("nextScenes","");
              })
            }
          }
          if(context.secureGetString("DactyState") == "C"){
                        this.finger = false
          }else{
                  this.finger = true
          }
        })
    },
    //指纹登录关闭状态时开启
    opengFingerEvent(){
      const params1 = {
          DeviceID: context.envGet("DeviceID"),
          IdNo:'',
          AuthType: "auth",
          StepUp: false,
          Transaction: false,
          DownloadCer:false,
          UserVerification:"",
          UserVerify:'16'
      };
      loading.showLoading("加载中");
      stream.fetch({
          method: "POST",
          url:`/eweb/RegulateIdRequest.do`,
          type: "json",
          body:JSON.stringify(params1),
          headers:{ "Content-Type": 'application/json',"accept": "text/mobjson" }
      },response=>{
          if(response.data._RejCode == "000000"){
            this.UAFRequest = response.data.UAFRequest;
            weexfido.isSupportFido(data => {
                if(JSON.parse(data).isSupport == 'Y'){
                    weexfido.identify(this.UAFRequest,data => {
                        if(JSON.parse(data).rejCode == "000000"){
                            const params2 = {
                                UafRegResp: JSON.parse(data).message
                            };
                            stream.fetch({
                                  method: "POST",
                                  url: `/eweb/RegulateIdResponse.do`,
                                  type: "json",
                                  body:JSON.stringify(params2),
                                  headers:{ "Content-Type": 'application/json',"accept": "text/mobjson"}
                            },response => {
                                  loading.stopLoading();
                                  if (response.data._RejCode == "000000") {
                                        context.secureSetString("DactyState","N");
                                            wjalert.alert("开启成功","确定",data=>{})
                                            // this.judgedevice();
                                            if(context.secureGetString("DactyState") == "C"){
                                                    this.finger = false
                                            }else{
                                                    this.finger = true
                                            }
                                  }else{
                                      // this.$refs.fingerswitch.onChange("false");
                                      this.finger = false
                                        wjalert.alert("开启失败","确定",data=>{})
                                  }
                            });
                        }else {
                            loading.stopLoading();
                            // this.$refs.fingerswitch.onChange("false");
                            this.finger = false
                            wjalert.alert(JSON.parse(data).msg,"确定",data=>{});
                        } 
                    })
                }else if(JSON.parse(data).msg == '000001'){
                      wjalert.alert(JSON.parse(data).errorMsg,"确定",data=>{})
                      loading.stopLoading();
                      // this.$refs.fingerswitch.onChange("false");
                      this.finger = false
                }else if(JSON.parse(data).msg == '000002'){
                      wjalert.alert("该设备未开启FaceID权限","确定",data=>{})
                      loading.stopLoading();
                      // this.$refs.fingerswitch.onChange("false");
                      this.finger = false
                }else{
                      wjalert.alert("手机不支持指纹！","确定",data=>{})
                      loading.stopLoading();
                      // this.$refs.fingerswitch.onChange("false");
                      this.finger = false
                }
            });
          }else if(response.data._RejCode=="888888"||response.data._RejCode=="777777"){
              loading.stopLoading();
              wjalert.alert(response.data.errmsg,"确定",data=>{
                    context.sessionSetString("isLogin", "");
                    context.sessionSetString('userinfo', '');
                    context.clearToken();
                    context.sessionSetString("nextScenes","");
              })
          }else{
              loading.stopLoading();
              wjalert.alert(response.data.errmsg,"确定",data=>{})
          }
      });
    },
    //跳转登录密码修改
    modifypwd(){
      context.launchStage("main.secModifypwd");  
    },
    //跳转云盾管理
    jumpYundun(){
       //launchStage防重复点击
      if(this.isClick){
        this.isClick = false;
        this.$store.state.isYundun="1";
        context.launchStage("main.yundunManage");
        setTimeout(() => {
          this.isClick = true;
        }, 500);
      }
    },
    //跳转登录记录查询
    jumpRecord(){
      this.jump('/record');
    },
    //获取随机数
    getRandom() {
      loading.showLoading('加载中');
      this.getRandomInfo.name = context.secureGetString("UserName")+context.secureGetString("CifNo");
      this.getRandomInfo.idnum = context.secureGetString("idNumber")+context.secureGetString("CifNo");
      this.getRandomInfo.type = this.selectType();
      this.getRandomInfo.mobile = context.secureGetString("Mobiel");
      this.getRandomInfo.deviceID = context.envGet("DeviceID");
      this.getRandomInfoStr = JSON.stringify(this.getRandomInfo);
      cfcaPlugin.getRandomStr(this.getRandomInfoStr, data => {
        loading.stopLoading();
        this.data1 = JSON.parse(data);
        if (this.data1.type == "1") {
          this.serverRandom = this.data1.serverRandom;
          this.RandomSign();
        } else {
          this.isAuth = true;
          wjalert.alert(this.data1.msg, "确定", data => {})
        }
      });
    },
    RandomSign() {
      if (this.serverRandom) {
        this.goJson(
          "/eweb/SignRandom.do",{ 
            Random: this.serverRandom,
            IdNo:context.secureGetString("idNumber")+context.secureGetString("CifNo"),
            MobilePhone:context.secureGetString("Mobiel"),
            Name:context.secureGetString("UserName")+context.secureGetString("CifNo"),
            IdType:context.secureGetString("IdType")
          },
          response => {
            this.signresult = response.data.SignResult;
            cfcaPlugin.auth(this.signresult, data => {
               this.isAuth = true;
               loading.stopLoading();
                this.authdata = JSON.parse(data);
                if(this.getCertFlag=='1'){//未开通
                    this.YundunFlag='未开通'
                }else if(this.getCertFlag=='0'){//已开通标识
                    if (this.authdata.type == "1") {
                        if (this.authdata.state == "2") {//无证书则是待下载
                          this.YundunFlag='待下载'                         
                        }else{
                          this.YundunFlag='已开通'
                        }
                    } else {
                      this.YundunFlag='待下载'                  
                    }
                }
              });
          },fail=>{
               this.isAuth = true;
          })
      }
    },
    selectType(){
          let type = context.secureGetString('IdType');//证件类型
          if(type=="00"){
              return "0"
          }else if(type == "05"){
              return "1"
          }else if(type == "04"){
              return "2"
          }else if(type == "17"){
              return "A"
          }else if(type == "06"){
              return "B"
          }else if(type == "13"){
              return "C"
          }else if(type == "07"){
              return "E"
          }else if(type == "10"){
              return "F"
          }else if(type == "03"){
              return "G"
          }else if(type == "09"){
              return "P"
          }else{
              return "Z"
          }
      },
  }
};
</script>
