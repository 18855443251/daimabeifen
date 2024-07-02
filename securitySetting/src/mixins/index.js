//客户端扩展模块
const context = weex.requireModule('context')
const stream = weex.requireModule("stream")
const modal = weex.requireModule("modal")
const loading = weex.requireModule("wxEncryption")
const wjalert = weex.requireModule("weex-alert")
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
        post(streamId, streamParams,callback){
            loading.showLoading('加载中');
            stream.fetch({
                method: 'POST',
                url: streamId,
                type:'json',
                // body: this.toParams(streamParams),
                // headers:{ "Content-Type":'application/x-www-form-urlencoded',
                // "Accept":'text/mobjson'}
                body: JSON.stringify(streamParams),
                headers: { "Content-Type": 'application/json',"Accept": 'text/mobjson'}
            },response => {
                loading.stopLoading();
                // callback(response);//返回成功的response
                if (response.status == 200) {
                    if (response.data._RejCode == '000000') {//请求成功
                        callback(response);//返回成功的response
                    } else {

                        if (response.data._RejCode != "000000") {
                            //登录超时
                            if (response.data._RejCode == "888888" || response.data._RejCode == "777777") {
                                wjalert.alert(response.data.errmsg, "确定", data => {
                                    context.sessionSetString("isLogin", "");
                                    context.sessionSetString('userinfo', '');
                                    context.clearToken();
                                    context.sessionSetString("nextScenes", "");
                                    context.replaceStage("main.login?flag=1");
                                })
                            }else if(response.data._RejCode == "222222"){
                                wjalert.alert(response.data.errmsg, "确定", data => {
                                    context.launchStage("main.reconciliation")
                                });
                            } else {
                                wjalert.alert(response.data.errmsg, "确定", data => {});
                            }
                        }
                    }
                } else {
                     wjalert.alert('网络通讯异常请稍后再试', "确定", data => { })
                }
            });
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
        jump(to) {
            if (this.$router) {
                this.$router.push(to)
            }
        },
        //返回按钮
        goBack() {
            loading.stopLoading();
            if (this.$router) {
                if (this.$route.path === this.$router.indexRouter) {
                    context.finish();
                }else if (this.$route.path == "/Index") {
                    context.finish()
                } else {
                    this.$router.back()
                }
            }
        },
        // goHome(){
        //     context.finish()
        // },
        goJson(streamId,streamParams,callback,fail) {
            loading.showLoading('加载中');
            stream.fetch({
                method: 'POST',
                url: streamId,
                type: 'json',
                timeout: 30000,
                body: JSON.stringify(streamParams),
                headers: { "Content-Type": 'application/json',"Accept": 'text/mobjson'}
                }, response => {
                    loading.stopLoading();
                    if(response.status==200){
                        if(response.data._RejCode=='000000'){//请求成功
                            callback(response);//返回成功的response
                     
                        }else{
                            loading.stopLoading();
                            if(response.data && response.data.errmsg && response.data._RejCode != "000000"){
                                //登录超时
                                if(response.data._RejCode=="888888"||response.data._RejCode=="777777"){
                                    wjalert.alert(response.data.errmsg,"确定",data=>{
                                        context.sessionSetString("isLogin", "")
                                        context.sessionSetString('userinfo', '')
                                        context.clearToken();
                                        context.sessionSetString("nextScenes","");
                                        context.replaceStage("main.login?flag=1")
                                      })
                                }else if(response.data._RejCode == "222222"){
                                    wjalert.alert(response.data.errmsg, "确定", data => {
                                        context.launchStage("main.reconciliation")
                                    });
                                }else{
                                    fail(response);
                                    wjalert.alert(response.data.errmsg,"确定",data=>{}) 
                                  return;
                                }
                            }
                        }
                    }else {
                        loading.stopLoading();
                        fail(response);
                        wjalert.alert('服务器通讯异常或网络连接失败',"确定",data=>{}) 
                    }
            })
        }
    }
}