//客户端扩展模块
const context = weex.requireModule('context')
const stream = weex.requireModule("stream")
const modal = weex.requireModule("modal")
const loading = weex.requireModule("wxEncryption")
const cfcaPlugin = weex.requireModule("yunzhengtong")
const wjalert = weex.requireModule("weex-alert")
const face = weex.requireModule("face")
const weexConfig = weex.requireModule("weex-config");//ios状态栏
export default {
    data() {
        return {
            getRandomInfo: {},
            getRandomInfoStr: '',
            serverRandom: '',
            authdata: {},
            deviceStatusBarHeight:68,
            defaultDeviceStatusBarHeight:68
        }
    },
    created(){
        // setTimeout(()=>{
            this.initDeviceStatusBarHeight();
        // },200);
    },
    computed: {
        //获取状态栏的高度
        getStatusHeight(){
            return {height: this.deviceStatusBarHeight,backgroundColor:"#FFFFFF"}
        },
        //获取除标题栏外部分距离顶部的距离
        getPosiScrollerTop(){
            let scrollerTop=parseFloat(this.deviceStatusBarHeight)+90;
            return {top:scrollerTop+'px'}
        },
    },
    methods: {
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
        jump(to,flag) {
            if (this.$router) {
                if(flag){this.$router.replace(to);return}
                this.$router.push(to);
            }
        },
        goBack() {
            // loading.stopLoading();
            if (this.$router) {
                if(this.$route.path=='/PayerInfo'||this.$route.path=='/PayeeInfo'||this.$route.path == "/FastTrans"){
                    this.clearSubmitData();
                }
                if (this.$route.path === this.$router.indexRouter||this.$route.path ==='/TransferResult') {
                    if(this.$route.path == "/FastTrans"){
                        context.sessionSetString('TransferPreFlag','');
                    }
                    context.finish();
                } else {
                    this.$router.back();
                }
            }
        },
        backRoute(count){//多级返回
            var num = count || 1;
            for(let i=0;i<num;i++){
                this.$router.back();
            }
        },
        //数据处理 20180815 日期
        dealTime(str) {
            if (str) {
                var a = str.substring(4, 6) + '月';
                var b = str.substring(6, 8) + '日';
                return a + b;
            }
        },
        dealTimeLine(str,time) {
            if (str) {
                if(time){
                    return str.substring(0, 4)+"-"+str.substring(4, 6) +"-"+ str.substring(6, 8)+" "+time.substring(0, 2)+":"+time.substring(2, 4) +":"+ time.substring(4, 6);
                }else{
                    return str.substring(0, 4)+"-"+str.substring(4, 6) +"-"+ str.substring(6, 8);
                }
            }
        },
        //数据处理 2018-08-15 日期
        dealTime1(str) {
            if (str) {
                var a = str.substring(5, 7) + '月';
                var b = str.substring(8, 10) + '日';
                return a + b;
            }
        },
        //数据处理 星期
        dealweek(str) {
            if (str == '0') {
                return '星期天';
            } else if (str == '1') {
                return '星期一';
            } else if (str == '2') {
                return '星期二';
            } else if (str == '3') {
                return '星期三';
            } else if (str == '4') {
                return '星期四';
            } else if (str == '5') {
                return '星期五';
            } else if (str == '6') {
                return '星期六';
            }

        },
        //银行卡号每四位分割
        divieBanks(str) {
            if (str) {
                return str.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
            }
        },
        //处理别名
        dealalias(str) {
            if (str) {
                return str.length > 0 ? '(' + str + ')' : ''
            }
        },
        //截取银行卡后四位
        dividelastfour(str) {
            if (str) {
                return str.substr(str.length - 4);
            }
        },
        //余额显示到小数后两位
        showLastTwo(str) {
            if (str) {
                return ~~(Number(str) * 100) / 100;
            }
        },
        //银行卡号中间用*****显示
        showBanks(str) {
            var reg = /^(\d{4})\d+(\d{4})$/;
            if (str) {
                return str.replace(reg, "$1*******$2");
            }
        },
        setData(key, val) {
            context.sessionSetString(key, val + "||" + Math.random());
        },
        getData(key) {
            return context.sessionGetString(key).split("||")[0];
        },
        plusXing(str, frontLen, endLen) {
            var len = str.length - frontLen - endLen;
            var xing = '';
            for (var i = 0; i < len; i++) {
                xing += '*';
            }
            return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
        },
        //对应不同银行logo
        imgdata(x,b) {
            var imgList=['102','103','104','105','301','302','303','305','308','310','403','9999'];
            if (x) {
                if (x == '314305400015'){
                    return this.$store.state.imgBaseUrl + '9999.png';
                }
                if (x.length > 4){
                    x = x.substring(0, 3);
                }
                if (imgList.includes(x)){
                    return this.$store.state.imgBaseUrl + x + '.png';
                }else{
                    if(b.includes("江苏银行")){
                        return this.$store.state.imgBaseUrl + '313.png';
                    }
                }
            }
            return this.$store.state.imgBaseUrl + 'Headportrait@3x.png';
        },
        // 金额大写
        changeMoneyToChinese(value) {
            if (!value) return ''
            value = value.toString()
            let strOutput = ''
            let strUnit = '万仟佰拾亿仟佰拾万仟佰拾元角分'
            value += '00'
            let intPos = value.indexOf('.')
            if (intPos >= 0) {
                value = value.substring(0, intPos) + value.substr(intPos + 1, 2)
            }
            strUnit = strUnit.substr(strUnit.length - value.length)
            for (var i = 0; i < value.length; i++) {
                strOutput += '零壹贰叁肆伍陆柒捌玖'.substr(value.substr(i, 1), 1) + strUnit.substr(i, 1)
            }
            return strOutput.replace(/^零角零分$/, '')
                .replace(/零角零分$/, '整')
                .replace(/^零元零角/, '')
                .replace(/零[仟佰拾]/g, '零')
                .replace(/零{2,}/g, '零')
                .replace(/零([亿|万])/g, '$1')
                .replace(/零+元/, '元')
                .replace(/亿零{0,3}万/, '亿')
                .replace(/^元/, '零元')
                .replace(/零角/, '零')
                .replace(/零元/, '')
                .replace(/零分$/, '')
        },
        changeAmountUnit(value){
            if(value>=1000&&value<10000){
                return "千"
            }else if(value>=10000&&value<100000){
                return "万"
            }else if(value>=100000&&value<1000000){
                return "十万"
            }else if(value>=1000000&&value<10000000){
                return "百万"
            }else if(value>=10000000&&value<100000000){
                return "千万"
            }else if(value>=100000000&&value<1000000000){
                return "亿"
            }else if(value>=1000000000&&value<10000000000){
                return "十亿"
            }else if(value>=10000000000&&value<100000000000){
                return "百亿"
            }else if(value>=100000000000&&value<1000000000000){
                return "千亿"
            }else if(value>=1000000000000&&value<10000000000000){
                return "万亿"
            }
        },
        //pop交易用
        finalJson(streamId, streamParams, callback) {
            loading.showLoading("");
            stream.fetch({
                method: 'POST',
                url: streamId,
                type: 'json',
                timeout: 60000,
                body: JSON.stringify(streamParams),
                headers: { "Content-Type": 'application/json' }
            }, response => {
                loading.stopLoading();
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
                            } else if (response.data._RejCode == "validation.resubmit_answered_trs") {
                                this.$store.state.ResolvedMsg = response.data.errmsg;
                                this.jump('/transferResultResolved');
                            } else {
                                wjalert.alert(response.data.errmsg, "确定", data => {
                                    this.$store.state.firstCommit = true;
                                    if (streamParams.hasOwnProperty("_tokenName")) {
                                        stream.fetch({
                                            method: 'POST',
                                            url: '/refacmob/getNewTokenNameV1.do',
                                            type: 'json',
                                            headers: { "Content-Type": 'application/json' }
                                        }, response => {
                                            this.$store.state.tokenName = response.data._tokenName;
                                        })
                                    }
                                    if (streamParams.hasOwnProperty("orgContent") || streamParams.hasOwnProperty("signValue")) {
                                        this.getRandom1();
                                    }
                                })
                                return;
                            }
                        } else {
                            wjalert.alert(response.data.errmsg, "确定", data => { })
                            this.$store.state.firstCommit = true;
                        }
                    }
                } else {
                    wjalert.alert('网络通讯异常请稍后再试', "确定", data => { })
                    this.$store.state.firstCommit = true;
                    if (streamParams.hasOwnProperty("orgContent") || streamParams.hasOwnProperty("signValue")) {
                        this.getRandom1();
                    }
                }
            })
        },
        //普通交易
        post(streamId, streamParams, callback) {
            loading.showLoading("");
            stream.fetch({
                method: 'POST',
                url: streamId,
                type: 'json',
                timeout: 60000,
                body: JSON.stringify(streamParams),
                headers: { "Content-Type": 'application/json',"Accept": 'text/mobjson'}
            }, response => {
                loading.stopLoading();
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
                            }else if(response.data._RejCode=="222222"){
                                wjalert.alert(response.data.errmsg,"确定",data=>{
                                    context.launchStage("main.reconciliation")
                                })
                            }else {
                                 wjalert.alert(response.data.errmsg, "确定", data => {});
                            }
                        }
                    }
                } else {
                     wjalert.alert('网络通讯异常请稍后再试', "确定", data => { })
                }
            })
        },
        goJson(streamId, streamParams, callback) {
            stream.fetch({
                method: 'POST',
                url: streamId,
                type: 'json',
                body: this.toParams(streamParams),
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                    "Accept": 'text/mobjson'
                }
            }, response => {
                callback(response);//返回成功的response
            });
        },

        //超过16位显示省略号
        ellipsis(str, length) {
            if (!str) {
                return '';
            }
            var leng = length || 16;//默认16
            if (str.length <= leng) {
                return str
            } else {
                return str.substr(0, leng) + '...'
            }
        },
        // 判断是否为空
        isEmpty(obj){
            if(obj == '' || obj == undefined){
                return true;
            }
            return false;
        },
        //清空转账提交的数据
        clearSubmitData(){
            this.$store.state.transferSubmitData={
                //付款方信息
                'ImmediatelyFlag': '0',
                'TransferPath':'',//支付渠道代码
                'RteFlg':'',//智能汇路标识,1001:到账最快，1002，手续费最少
                'PayerAcNo': '',//付款账号
                'PayerAcName': '',//付款姓名
                'PayerBankName':'',
                'CRFlag': 'R', //服务端要求写死
                'PayerCurrency':'',//付款币种
                'Amount': '',//转账金额
                'PayerAcAvailBal':'',//选中的付款账号的余额
        
                //收款方信息
                'PayeeBankName': '请选择收款方银行',//收款方银行
        
                'PayeeBank': '',//收款行序列号
                'BankCode':'',//收款行行号
                'BankNodeFlag':'',//是否显示网点的标识（Y：显示网点号，N：不显示）
                'PayeeAcNo': '',//收款方账号
                'PayeeAcName': '',//收款方名称
                'PayeeProvince':{
                    Name:'请选择收款方银行省市'
                },//选中的收款方省份信息
                'PayeeCity':{},//选中的收款方城市信息
                'PayeeNetName':{Name:'请选择收款方银行网点名称',Value:''},//收款方网点信息
                'PayerOpenFlag':'',//是否开通了多级账簿
                'DrawType': '6',
                'Feedrawtype': '',//手续费收取方式
                'Fee':'',//手续费
                'PreferAmt':'',
                'Postage': '',//邮费
                'PassCheck': '',//校验方式
                'TrsPassword': '',//交易密码
                'Remark' :'',//备注
                'Bck':'',//扩展要素
                'method':'',//方法
                'AcSeq':'',//账户序号
                'transferUse':'',//转账用途
                'mobilePhone': '',//短信通知收款人
            },
            this.$store.state.transType='';
            this.$store.state.cityCode='';
            this.$store.state.transferSubmitData.isCheckBankInner='';
        },
        //检查收款方账号是否是行内还是行外
        checkBankInner(PayeeAcNo){
            // ,Amount,ImmediatelyFlag
            if(PayeeAcNo){
                PayeeAcNo=PayeeAcNo.replace(/[\s]/g,'');
                let params={
                    PayeeAcNo:PayeeAcNo,
                    // Amount:Amount,
                    // ImmediatelyFlag:ImmediatelyFlag
                }
                // if(this.$store.state.transferSubmitData.isCheckBankInner!='disable'){
                    this.post("/eweb/QryAcIsBankInner.do", params , response => {
                        this.$store.state.BankInner = response.data.BankInner;//0:行内 1：行外
                        this.$store.state.transferSubmitData.PayeeBankName = response.data.PayeeBankName;//转账-收款方银行名称
                        this.$store.state.transferSubmitData.PayeeBank = response.data.BankId;//转账-收款方银序列号（收款人登记簿用到）
                        this.$store.state.transferSubmitData.BankCode = response.data.BankCode;//转账-收款方银行总行行号（若是行内的话会用到）
                        this.$store.state.transferSubmitData.BankNodeFlag = response.data.BankNodeFlag;//是否显示网点标识
                        this.checkAndResetFlag();
                    });
                // }
            }
        },
        //根据日期选择的推算日期
        calcDate(dateValue){
            var nowDate=new Date();//当前日期
            if(dateValue=='Today'||dateValue=='0'){
                var formDate=this.getNowFormatDate('/');
            }else if(dateValue.includes('D')){//推算天
                let dateNum=dateValue.replace(/[^\d]/g,'');
                let longtimes=nowDate.setDate(nowDate.getDate()-dateNum);
                var formDate=this.getNowFormatDate('/',longtimes);
            }else if(dateValue.includes('M')){//推算月
                let monthNum=dateValue.replace(/[^\d]/g,'');
                let longtimes=nowDate.setMonth(nowDate.getMonth()-monthNum);
                var formDate=this.getNowFormatDate('/',longtimes);
            }
            return formDate;
        },
        //格式化日期
        getNowFormatDate(seperator1,longtimes) {//longtimes是要格式化的毫秒数或者符合格式的日期，不传默认当前日期
            if(longtimes){
                var date = new Date(longtimes);
            }else{
                var date = new Date();
            }
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = ""+year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        //获取本月第一天
        getFirstDate(){
            let todayDate=new Date();
            let nowYear=todayDate.getFullYear();
            let todayMonth=todayDate.getMonth()+1;
            if (todayMonth >= 1 && todayMonth <= 9) {
                todayMonth = "0" + todayMonth;
            }
            let FirstDate=nowYear+"/"+todayMonth+"/01";
            return FirstDate;
        },
        moneyFilter(money) {
            if (!money) return money
            if (money && money != null) {
                money=money.toString();
                var left = money.split('.')[0];
                var right = money.split('.')[1];
                right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
                var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
                var str1 = (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
                return str1;
            } else {
                return money
            }
        },
         //查询账户多级账簿
        getAcctBookQry(PayerAcNo,KeyWord) {
            this.$store.state.transferSubmitData.transferPayerAcctBookList=[];
            if(PayerAcNo){
                var params={
                    PayerAcNo:PayerAcNo,
                }
                if(KeyWord&&KeyWord.replace(/\s/g,'')){
                    params.KeyWord=KeyWord;
                }
                this.post("/eweb/TransferAcctBookQry.do",params, response => {
                    if(response.data.List&&response.data.List.length!=0){
                        // this.$store.state.transferSubmitData.transferPayerAcctBookList=response.data.List;
                        this.$store.state.transferSubmitData.selectAcctBookItem='';
                        this.$store.state.transferSubmitData.PayerOpenFlag='Y';
                    }else{
                        // this.$store.state.transferSubmitData.transferPayerAcctBookList=[];
                        this.$store.state.transferSubmitData.selectAcctBookItem='';
                        this.$store.state.transferSubmitData.PayerOpenFlag='';
                    }
                });
            }
        },
        checkAndResetFlag(){
            if(this.$store.state.transferSubmitData.BankNodeFlag=='Y'&&this.$store.state.transferSubmitData.isCheckBankInner!='disable'){
                this.$store.state.transferSubmitData.PayeeBankName=this.$store.state.transferSubmitData.PayeeBankName?this.$store.state.transferSubmitData.PayeeBankName:"请选择收款方银行";
                this.$store.state.transferSubmitData.PayeeProvince.Name=this.$store.state.transferSubmitData.PayeeProvince.Name?this.$store.state.transferSubmitData.PayeeProvince.Name:'请选择收款方银行省市';
                this.$store.state.transferSubmitData.PayeeCity.Name=this.$store.state.transferSubmitData.PayeeCity.Name?this.$store.state.transferSubmitData.PayeeCity.Name:'';
                if(this.$store.state.transferSubmitData.PayeeNetName&&!this.$store.state.transferSubmitData.PayeeNetName.Value){//如果不存在网点，则将PayeeNetName重置为请选择……网点名称
                    this.$store.state.transferSubmitData.PayeeNetName={Name:'请选择收款方银行网点名称',Value:''};
                }
                // if(!this.$store.state.transferSubmitData.BankCode){//如果BankCode为空说明根据收款人账号未查出对应银行，则网点省市和网点名称要客户手动选择
                //     this.$store.state.transferSubmitData.PayeeBankName=this.$store.state.transferSubmitData.PayeeBankName?this.$store.state.transferSubmitData.PayeeBankName:"请选择收款方银行";
                //     // this.$store.state.transferSubmitData.PayeeProvince.Name='请选择收款方银行省市';
                //     // this.$store.state.transferSubmitData.PayeeCity={};
                //     // this.$store.state.transferSubmitData.PayeeNetName={Name:'请选择收款方银行网点名称',Value:''};
                // }else{
                //     if(this.$store.state.transferSubmitData.SysFlag!=1){//网点省市和网点名称要客户手动选择
                //         this.$store.state.transferSubmitData.PayeeBankName=this.$store.state.transferSubmitData.PayeeBankName?this.$store.state.transferSubmitData.PayeeBankName:"请选择收款方银行";
                //         this.$store.state.transferSubmitData.PayeeProvince.Name='请选择收款方银行省市';
                //         this.$store.state.transferSubmitData.PayeeCity={};
                //         this.$store.state.transferSubmitData.PayeeNetName={Name:'请选择收款方银行网点名称',Value:''};
                //     }
                // }
            }
        }
    }
}