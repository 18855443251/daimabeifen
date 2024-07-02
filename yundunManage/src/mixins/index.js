//客户端扩展模块
const context = weex.requireModule('context')
const stream = weex.requireModule("stream")
const modal = weex.requireModule("modal")
const loading = weex.requireModule("wxEncryption")
const cfcaPlugin = weex.requireModule("yunzhengtong");
const wjalert = weex.requireModule("weex-alert");
const weexConfig = weex.requireModule("weex-config");//ios状态栏
export default {
    data(){
        return {
            deviceStatusBarHeight:68,
            defaultDeviceStatusBarHeight:68
        }
    },
    created(){
        this.initDeviceStatusBarHeight();
    },
  computed: {
    getStatusHeight(){
        return {height: this.deviceStatusBarHeight,backgroundColor:"#FFFFFF"}
    }  
  },
    methods: {
        getPosiScrollerTop(){
            let scrollerTop=parseInt(this.deviceStatusBarHeight)+90;
            return scrollerTop;
        },
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
        selectType(){
            let type = context.secureGetString('IdType');//证件类型
            if(type=="00"){
                return "0"
            }else if(type == "05"){
                return "1"
            }else if(type == "01"){
                return "2"
            }
            // else if(type == "17"){
            //     return "A"
            // }
            else if(type == "06"){
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
        money(s)  {
            if(s==""||s==undefined||s==null){
              s="";
              return  s;
            }else
            if  (s.toString().length  >  0)  {
              let  temp  =  s.toString();
              if  (temp.split(".")[0].length  ===  0)  {
                s  =  "0"  +  s;
              }
              if  (/[^0-9\.]/.test(s))
                return  "0.00";
              if  (s  ==  null  ||  s  ==  "null"  ||  s  ==  "")
                return  "0.00";
              s  =  s.toString().replace(/^(\d*)$/,  "$1.");
              s  =  (s  +  "00").replace(/(\d*\.\d\d)\d*/,  "$1");
              s  =  s.replace(".",  ",");
              let  re  =  /(\d)(\d{3},)/;
              while  (re.test(s))
                s  =  s.replace(re,  "$1,$2");
              s  =  s.replace(/,(\d\d)$/,  ".$1");
              return  s;
            }},
        initDeviceStatusBarHeight(){
			if(weex.config.env.platform =='iOS'){
                weexConfig.statusHeight(data=>{
                    this.deviceStatusBarHeight = data;
                })
			}else{
				const { env: { deviceHeight, deviceWidth } } = weex.config;
				let status_bar_height = context.getDeviceInfo().status_bar_height;
				let statusHeight = status_bar_height * 750 / deviceWidth;
                this.deviceStatusBarHeight = statusHeight;
			}
        },
        alertMsg(message) {
            wjalert.alert(message, "确定", data => {
                //点击确认执行方法

            })},
        alertM(message, callback) {
            modal.alert({
                message: message,
                okTitle :'确定',
                duration: 3
            }, function (value) {
                callback();
            })
        },
        post(streamId, streamParams,callback){
            stream.fetch({
                method: 'POST',
                url: streamId,
                type:'json',
                body: this.toParams(streamParams),
                headers:{ "Content-Type":'application/x-www-form-urlencoded',
                "Accept":'text/mobjson'}
            },response => {
                callback(response);//返回成功的response
            });
        },
        //json转字符串，用在stream的body
        toParams(obj) {
            var param = ""
            for (const name in obj) {
                if (typeof obj[name] != 'function') {
                    param += "&" + name + "=" + encodeURI(obj[name])
                }
            }
            return param.substring(1)
        },
        showCommonAlert(msg) {
            modal.alert({
                message: msg,
                okTitle: "确定"
            });
        },
        jump(to) {
            if (this.$router) {
                this.$router.push(to);
               // this.$store.state.pathArray.push(to);
            }
        },
        showToast(msg) {
            modal.toast({
                message: msg,
                duration: 0.3
            });
        },
        plusXing(str,frontLen, endLen) {
            var len = str.length -frontLen - endLen;
            var xing = '';
            for (var i = 0; i < len; i++) {
                xing += '*';
            }
            return str.substring(0,frontLen) + xing +str.substring(str.length -endLen);
          },

          goBackPath(path) {
            var array = this.$store.state.pathArray.reverse()
            for (let i = 0; i < array.length; i++) {
                if (array[i] == path) {
                    break;
                }
                this.$router.back();
            };
            this.$store.state.pathArray = []; //清空数组重新计算
        },
        //返回按钮
        goBack() {
            if(this.$router) {
                if(this.$route.path == "/cloudshieldmanagement") {
                    context.sessionSetString("isgoBack","1")  //让安全设置页面发交易的标志
                    context.finish();
                }else if(this.$route.path == "/certdownloadsuccess"||this.$route.path == "/cloudshieldpasswordreset2"||this.$route.path == "/cloudshieldpasswordmodify2"){
                    this.$router.go(-2);
                }else if(this.$route.path == "/cloudshieldpwdsetsuccessful"){
                    if(this.$store.state.isGopasswordsetting == "1"){
                        this.$router.go(-2);
                    }else{
                        this.$router.go(-3);
                    }  
                }
                else{
                    this.$router.back();
                }
            }
        },
        goto(to) {
            context.launchStage(to);
        },
        goHome(){
            context.finish()
        },
        //get方法
        Get(url, callback) {
            stream.fetch({
                method: 'GET',
                url: url,
                type: 'json'
            }, response => {
                if (response.status == 200) {

                    callback(response.data);

                } else {
                    this.showToast("服务器通讯异常或网络连接失败");
                }
            });
        },
        goJson(streamId,streamParams,callback,failback) {
            loading.showLoading('加载中');
            stream.fetch({
                method: 'POST',
                url: streamId,
                type: 'json',
                timeout: 30000,
                body:JSON.stringify(streamParams),
                headers:{ "Content-Type": 'application/json',"accept": "text/mobjson"}
                }, response => {
                    // if(streamId!='/eweb/SignRandom.do'){
                        loading.stopLoading();
                    // }
                    // this.showCommonAlert(JSON.stringify(response))
                    if(response.status==200){
                        if(response.data._RejCode=='000000'){//请求成功
                            callback(response);//返回成功的response
                        }else{
                            if(response.data.errmsg && response.data._RejCode != "000000"){
                                //登录超时
                                if(response.data._RejCode=="888888"||response.data._RejCode=="777777"){
                                    wjalert.alert(response.data.errmsg,"确定",data=>{
                                        context.sessionSetString("isLogin", "");
                                        context.sessionSetString('userinfo', '');
                                        context.clearToken();
                                        context.sessionSetString("nextScenes","");
                                        context.replaceStage("main.login?flag=1");
                                    })
                                } else if(response.data._RejCode=="222222"){
                                    wjalert.alert(response.data.errmsg,"确定",data=>{
                                        context.launchStage("main.reconciliation")
                                    })
                                }else if(streamId=="/eweb/FaceVerify.do"){
                                    failback(response);
                                }
                                else{
                                    failback(response);
                                    wjalert.alert(response.data.errmsg,"确定",data=>{})
                                    return;
                                }
                            }
                        }
                    }else{
                        wjalert.alert("网络通讯异常，请稍后再试","确定",data=>{})
                    }
                })
            }
      }
}