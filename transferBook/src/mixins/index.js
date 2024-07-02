//客户端扩展模块
const modal = weex.requireModule("modal");
const stream = weex.requireModule("stream");
const context = weex.requireModule("context");
const picker = weex.requireModule("weex-picker");
const animation = weex.requireModule('animation');
const loading = weex.requireModule('loading');
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
        getPosiScrollerTop() {
            let scrollerTop = parseFloat(this.deviceStatusBarHeight) + 90;
            return scrollerTop;
        },
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
            //银行卡号每四位分割
            divieBanks(str){
                if(str){
                    return str.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
                }
            },
            PayeeAcName(name){
                if(name.length>12){
                    return name.substr(0, 12)+"...";
                }else{
                    return name;
                }
            },
            //处理别名
            dealalias(str){
                if(str){
                return str.length > 0 ? '('+str+')' : ''
                }    
            },
            //截取银行卡后四位
          dividelastfour(str){
                if(str){
                    return str.substr(str.length-4);
                }
            },
          //对应不同银行logo
          imgdata(x,y){
            if(x){
                if(x == '314305400015')
                    return  this.$store.state.imgBaseUrl+'9999.png';
                if(y=="江苏银行")
                return  this.$store.state.imgBaseUrl+'313.png';
                if(x.length>4)
                    x=x.substring(0,3);

                if(x=='102' || x=='103' || x=='104' || x=='105'
                         || x=='301' || x=='302' || x=='303' || x == '403'
                         || x=='305' || x=='308' || x=='310' 
                         || x=='9999')
                return  this.$store.state.imgBaseUrl+x+'.png'; 
               
                        
            }
            return this.$store.state.imgBaseUrl+'Headportrait@3x.png'; 
          },


          setData(key,val){
            context.sessionSetString(key,val+"||"+Math.random());
          },
          getData(key){
            return context.sessionGetString(key).split("||")[0];
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
        //前往
        jump(to) {
            if (this.$router) {
                this.$router.push(to)
            }
        },
        //返回按钮
        goBack() {
            loading.stopLoading();
            if (this.$router) {
                if (this.$route.path == "/historyTransfer") {
                    context.finish()
                } else {
                    this.$router.back()
                }
            }
        },
        //toast
        showToast(msg) {
            modal.toast({
                message: msg,
                duration: 0.5
            })
        },
        //一个按钮提示窗，有回调
        showOneBtnAlert(msg, okTitle, confirm) {
            wjalert.alert(msg, okTitle, confirm)
        },
        //两个按钮提示窗，有回调
        showTwoBtnAlert(msg, okTitle, cancelTitle, confirm) {
            wjalert.confirm(msg, okTitle, cancelTitle, confirm)
        },
        post(streamId, streamParams,callback){
            stream.fetch({
                method: 'POST',
                url: streamId,
                type:'json',
                body: JSON.stringify(streamParams),
                headers:{ 
                //     "Content-Type":'application/x-www-form-urlencoded',
                // "Accept":'text/mobjson',
                "Content-Type": "application/json",
                  "Accept": "text/mobjson"
            }
            },response => {
                // modal.alert({
                //     message:JSON.stringify(response) +"第三次",
                //     okTitle :'确定',
                //     duration: 3
                //   })
                callback(response);//返回成功的response
            });
        },
        //交易路径streamId
        //参数streamParams
        //回调
        goJson(streamId, streamParams, callback, errorCallback) {
            loading.showLoading("加载中");
            stream.fetch({
                method: 'POST',
                url: streamId,
                type: 'json',
                timeout: 60000,//60s
                body: JSON.stringify(streamParams),
                headers: { "Content-Type": 'application/json',"Accept":"text/mobjson" }
                // headers: { "Content-Type": 'application/x-www-form-urlencoded',"Accept":"text/mobjson" }
            }, response => {
                // modal.alert({
                //     message:JSON.stringify(response)
                //   })
                loading.stopLoading();
                // callback(response)
                if (response.status == 200 && response.data) {
                    if (response.data._RejCode == '000000') {//请求成功
                        callback(response);//返回成功的response
                    } else {
                        if(typeof(errorCallback)=='function'){
                            errorCallback();
                        }
                        if (response.data && response.data.errmsg && response.data._RejCode != "000000") {
                            //登录超时
                            if (response.data._exceptionMessageCode == "role.invalid_user" || response.data._RejCode == "888888" || response.data._RejCode == "777777") {
                                context.sessionSetString("isLogin", "false");
                                context.sessionSetString('userinfo', '');
                                context.sessionSetString("nextScenes","");
                                context.clearToken();
                                this.showOneBtnAlert(response.data.errmsg, "确定", ()=>{
                                    context.replaceStage("main.login?flag=launcher");
                                });
                            } else if(response.data._RejCode=="222222"){
                                wjalert.alert(response.data.errmsg,"确定",data=>{
                                    context.launchStage("main.reconciliation")
                                })
                            }else {
                                this.showOneBtnAlert(response.data.errmsg, "确定", ()=>{});
                                return;
                            }
                        }
                    }
                } else {
                    if(typeof(errorCallback)=='function'){
                        errorCallback();
                    }
                    modal.toast({
                        message: "网络通讯异常请稍后再试"
                    })
                    return;
                }
            })
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

        //结束当前场景
        goHome() {
            context.finish()
        }
    }
}