<template>
    <!-- 云盾浮层 -->
    <div class="fucengModal">
        <div class="modalBox">
            <div class="certificateBox">
                <text class="certificateTitle">安全认证</text>
                <image :src="cancelMsgIcon" class="cancelMsgIcon" @click="cancel" />
            </div>
            <div class="mainCertificate">
              <text class="certificateText">云盾密码</text>
              <!-- 云盾输入框 -->
              <cfcaPassword ref="cloudPwd" class="certificateInput" @chickFinish = "cfcaKeyboradHide" :strServerRandom = "serverRandomStr" v-if="authdata.PinState!='1'">
              </cfcaPassword>
              <text class="certificateInputNo" v-if="authdata.PinState=='1'">您未设置云盾密码，请去设置</text>
              <div class="forgetCertifiTextBox">
                  <text class="forgetCertifiText" @click="forgetYunPas" v-if="authdata.PinState!='1'">忘记云盾密码</text>
              </div>
            </div>
            <text class="passwordBtn" @click="finishTransfer">确认</text>
        </div>
    </div>
</template>
<script>
const cfcaPlugin = weex.requireModule("yunzhengtong");//云盾
const loading = weex.requireModule("wxEncryption");
const wjalert = weex.requireModule("weex-alert");
const context = weex.requireModule("context");
export default {
    data() {
        return {
            cancelMsgIcon:this.$store.state.imgBaseUrl+'cancelMsgIcon.png',
            data1: {},
            yundunparams: {},//云盾服务器验证完生成的数据，包括  签名返回的BusinessText，
            serverRandomStr: "",//云盾随机数
            getRandomInfo:{},
            authdata:'',
            signresult: "",
            certretdata:"",
            PESign: {},
            hkepwdstr:'',
            encryptedClientRandom: "",
            serverRandom:''//云盾获取的随机数
        };
    },
    created(){
        this.getRandom();
    },
    methods: {
        cancel(){
            this.$parent.cancel();//调用父级取消方法
        },
        selectType(){
            // IdType.00=身份证
            // IdType.01=军官证
            // IdType.02=文职干部证
            // IdType.03=警官证
            // IdType.04=士兵证
            // IdType.05=护照
            // IdType.06=港澳居民往来通行
            // IdType.07=户口簿
            // IdType.08=边民出入境通行证
            // IdType.09=外国人永久居留证
            // IdType.10=临时身份证
            // IdType.11=离休干部荣誉证
            // IdType.12=武警警官证誉证补折
            // IdType.13=台湾居民往来通行证
            // IdType.14=军官退休证
            // IdType.15=文职干部退休证
            // IdType.16=军事院校学员证
            // IdType.17=武警士兵证
            // IdType.18=武警文职干部证
            // IdType.19=武警军官退休证
            // IdType.20=武警文职干部退休证
            // IdType.21=驾驶执照
            // IdType.22=其他
            // IdType.23=回乡证
            let type = context.secureGetString('IdType');//证件类型
            if(type=="00"){
                return "0"
            }else if(type == "05"){
                return "1"
            }else if(type == "01"){
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
        //获取随机数
        getRandom() {
            this.getRandomInfo.name = context.secureGetString("UserName")+context.secureGetString("CifNo");
            this.getRandomInfo.idnum = context.secureGetString("idNumber")+context.secureGetString("CifNo");
            this.getRandomInfo.type = this.selectType();
            this.getRandomInfo.mobile = context.secureGetString("Mobiel");
            this.getRandomInfo.deviceID = context.envGet("DeviceID");
            this.getRandomInfoStr = JSON.stringify(this.getRandomInfo);
            loading.showLoading("正在请求云盾服务器随机数");
            cfcaPlugin.getRandomStr(this.getRandomInfoStr, data => {   //获取随机数
                this.data1 = JSON.parse(data);
                if (this.data1.type == "1") {
                    loading.stopLoading();
                    this.serverRandom = this.data1.serverRandom;
                    this.RandomSign();
                } else {
                    loading.stopLoading();
                    this.$parent.cancel();
                    wjalert.alert(this.data1.msg, "确定", data => {})
                }
            });
        },
           
        //随机数签名
        RandomSign() {
            if (this.serverRandom) {
                loading.showLoading("等待云盾服务器身份认证");
                this.post("/eweb/SignRandom.do",{
                    Random: this.serverRandom,
                    IdNo:context.secureGetString("idNumber")+context.secureGetString("CifNo"),
                    MobilePhone:context.secureGetString("Mobiel"),
                    Name:context.secureGetString("UserName")+context.secureGetString("CifNo"),
                    IdType:context.secureGetString("IdType")
                },response => {
                    loading.stopLoading();
                    this.signresult = response.data.SignResult;
                    // this.alertM("随机数验证成功，去下载证书",data=>{
                        cfcaPlugin.auth(this.signresult, data => {   //去验证随机数  type0失败 1成功    成功后state  1是有证书发交易  2的时候去下证书
                            //  face++ 身份认证
                            loading.stopLoading();
                            this.authdata = JSON.parse(data);
                            // this.alertM("云盾验证随机数"+JSON.stringify(data),data1=>{
                                if (this.authdata.type == "1") { //type :0失败 1成功 
                                    //  认证通过  没有证书
                                    if (this.authdata.state != "1") {//state  1是有证书直接去发交易  2的时候去下证书
                                        wjalert.confirm("您的手机上不存在云盾证书或已损坏，请先下载证书","确定","取消",data=>{
                                            this.$parent.cancel();
                                            if(data == "Y") {
                                                context.launchStage('main.yundunManage');//跳转到云盾管理去人脸识别然后下载证书
                                            }
                                        })
                                    } else if(this.authdata.PinState == "3"){
                                        wjalert.alert('您的云盾密码已被锁定!',"确定",data=>{
                                            this.$parent.cancel();
                                        })
                                    }else {
                                        setTimeout(()=>{
                                            this.serverRandomStr = JSON.parse(data).serverRandom;
                                        },10)
                                    }
                                } else {
                                    wjalert.alert(this.authdata.msg, "确定", data => {
                                        this.$parent.cancel();
                                    })
                                }
                            // });
                        })
                    // });
                })
            }else {
                wjalert.alert('随机数获取失败',"确定",data=>{
                    this.$parent.cancel();
                })
            }
        },
        //忘记云盾密码
        forgetYunPas(){
            this.$parent.cancel();
            context.launchStage("main.yundunManage");
        },
        //确认交易
        finishTransfer() {
            if(this.authdata.state !='1'||context.secureGetString("CertFlag")=="1"){// state1是有证书直接去发交易  2的时候去下证书
                    wjalert.confirm("您的手机上不存在云盾证书或已损坏，请先下载证书","确定","取消",data=>{
                        this.$parent.cancel();
                        if(data == "Y") {
                            context.launchStage('main.yundunManage');//跳转到云盾管理去人脸识别然后下载证书
                        }
                    })
                    return;
                }
            this.$store.state.confirmTransferParams.PinState = this.authdata.PinState;
            this.post("/eweb/MCertValueSign.do", this.$store.state.confirmTransferParams, response => {
                // this.$store.state.confirmTransferParams.OrgContent = response.data.BusinessText;//签名返回的BusinessText,由后端自己取了
                this.PESign = response.data;
                if(this.authdata.PinState == "1") {//pinstae  3被锁定   2正常   1没密码
                    wjalert.confirm("您未设置云盾密码，请先设置云盾密码","确定","取消",data=>{
                        this.$parent.cancel();
                        if(data == "Y") {
                            context.launchStage('main.yundunManage');//跳转到云盾管理去设置密码
                        }
                    })
                }else{
                    //有密码 
                    if(this.authdata.PinState == "3"){
                        wjalert.alert('您的云盾密码已被锁定！',"确定",data=>{})
                    }else{
                        this.$refs.cloudPwd.checkMatchRegexWithError(data => {//校验密码是否符合正则表达式,云盾密码在客户端校验，不需上送客户端
                            if(JSON.parse(data).type == "0") { 
                                this.$refs.cloudPwd.getEncryptedData(pwddata => {
                                    this.hkepwdstr = JSON.parse(pwddata).encryptedSignPassword;
                                    this.encryptedClientRandom = JSON.parse(pwddata).encryptedClientRandom;                           
                                    if(this.hkepwdstr){
                                        cfcaPlugin.pwdDoSign(JSON.stringify(this.PESign),this.hkepwdstr,this.encryptedClientRandom,data => {
                                            if(JSON.parse(data).type == '1'){
                                                this.$store.state.confirmTransferParams.SignValue = JSON.parse(data).msg.replace(/\+/g, "%2B");//回调客户端返回的SignValue
                                                this.$store.state.confirmTransferParams.AuthType = "MCERT";//用于后台验证云盾标识MCERT
                                                this.$parent.finalConfirm();
                                                this.$parent.cancel();
                                            }else{
                                                wjalert.alert(JSON.parse(data).msg,"确定",data=>{})
                                            }
                                        })
                                    }else{
                                        wjalert.alert('云盾密码加密失败',"确定",data=>{})
                                    }
                                })
                            }else{
                                wjalert.alert(JSON.parse(data).msg,"确定",data=>{})
                            }
                        })
                    }
                }
            })
        },
    }
}
</script>
<style scoped>
    .fucengModal{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background-color:rgba(0,0,0,0.5);
        justify-content: center;
        align-items: center;
    }
    .modalBox{
        width: 630px;
        height: 540px;
        /* margin-top: 316px;
        margin-left: 68px; */
        background-color: #fff;
        border-radius: 12px;
        align-items: center;
        padding-top: 40px;
    }
     .certificateBox{
        width: 550px;
        flex-direction: row;
        justify-content: center;
        margin-bottom: 50px;
    }
    .certificateTitle{
        height:36px;
        font-size:36px;
        font-family:PingFang-SC-Bold,PingFang-SC;
        font-weight:bold;
        color:rgba(51,51,51,1);
        line-height:36px;
    }
    .cancelMsgIcon{
        width: 36px;
        height: 36px;
        position: absolute;
        right: 0;
    }
    .mainCertificate{
        width:630px;
        padding-left:40px;
        padding-bottom:40px;
        border-bottom-width: 1px;
        border-bottom-color: #EAEAEA;
    }
    .certificateText{
        width: 550px;
        font-size:30px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        color:rgba(51,51,51,1);
    }
    .certificateInput{
        width: 550px;
        height: 90px;
        line-height: 90px;
        border-width: 1px;
        border-color: rgba(221,221,221,1);
        margin-top: 20px;
        margin-bottom: 30px;
    }
    .certificateInputNo{
        width: 550px;
        height: 90px;
        line-height: 90px;
        padding-left: 20px;
        border-width: 1px;
        border-color: rgba(221,221,221,1);
        color: rgba(200,200,200,1); 
        margin-top: 20px;
        margin-bottom: 30px;
    }
    .forgetCertifiTextBox{
        flex-direction: row;
        justify-content: flex-end;
    }
    .forgetCertifiText{
        font-size:30px;
        font-family:PingFang-SC-Medium,PingFang-SC;
        font-weight:500;
        text-align: right;
        color:#4A89FC;
        margin-right: 40px;
    }
    .passwordBtn{
        width:550px;
        height: 88px;
        line-height: 88px;
        text-align: center;
        color: #fff;
        border-radius:12px;
        margin-top: 30px;
        background-image: linear-gradient(to right, #FB5D7A, #E6022C);
    }
</style>