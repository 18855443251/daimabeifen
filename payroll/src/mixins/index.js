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
            deviceStatusBarHeight: 68,
            defaultDeviceStatusBarHeight: 68
        }
    },
    created() {
        this.initDeviceStatusBarHeight();
    },
    computed: {
        getStatusHeight() {
            return { height: this.deviceStatusBarHeight, backgroundColor: "#FFFFFF" }
        }
    },
    methods: {
        // 适配刘海屏
        initDeviceStatusBarHeight() {
            if (weex.config.env.platform == 'iOS') {
                weexConfig.statusHeight(data => {
                    this.deviceStatusBarHeight = data;
                })
            } else {
                const { env: { deviceHeight, deviceWidth } } = weex.config;
                let status_bar_height = context.getDeviceInfo().status_bar_height;
                let statusHeight = status_bar_height * 750 / deviceWidth;
                this.deviceStatusBarHeight = statusHeight;
            }
        },
        getPosiScrollerTop() {
            let scrollerTop = parseFloat(this.deviceStatusBarHeight) + 90;
            return scrollerTop;
        },
        //获取随机数
        getRandom1() {
            this.getRandomInfo.name = context.secureGetString("UserName");
            this.getRandomInfo.idnum = context.secureGetString('idNumber');
            this.getRandomInfo.type = "0";
            this.getRandomInfo.mobile = context.secureGetString('Mobiel');
            this.getRandomInfo.deviceID = context.envGet("DeviceID");
            this.getRandomInfoStr = JSON.stringify(this.getRandomInfo);
            cfcaPlugin.getRandomStr(this.getRandomInfoStr, data => {
                if (JSON.parse(data).type == "1") {
                    this.serverRandom = JSON.parse(data).serverRandom;
                    this.RandomSign1();
                } else {
                    wjalert.alert(data, "确定", data => { });
                    this.$store.state.firstCommit = true;
                }
            })
        },
        //随机数签名
        RandomSign1() {
            if (this.serverRandom) {
                const params = {
                    Random: this.serverRandom
                };
                loading.showLoading("等待云盾服务器身份认证");
                stream.fetch({
                    method: "POST",
                    url: "/refacmob/SignRandom.do",
                    type: "json",
                    body: JSON.stringify(params),
                    headers: { "Content-Type": "application/json" }
                }, response => {
                    cfcaPlugin.auth(response.data.signresult, data => {
                        loading.stopLoading();
                        this.authdata = JSON.parse(data);
                        context.sessionSetString("authdata", JSON.stringify(this.authdata))
                        if (this.authdata.type == "1") {
                            if (this.authdata.state != "1") {
                                wjalert.confirm("您的手机上不存在云盾证书，请先下载证书", "确定", "取消", data => {
                                    if (data == "Y") {
                                        this.faceIdentify();
                                        this.$store.state.firstCommit = true;
                                    } else if (data == "N") {
                                        this.$store.state.firstCommit = true;
                                    }
                                })
                            } else if (this.authdata.PinState == "3") {
                                wjalert.alert('您的云盾密码已被锁定，请使用其他认证方式', "确定", data => { })
                                this.$store.state.firstCommit = true;
                            } else {
                                setTimeout(() => {
                                    this.$store.state.serverRandomStr = JSON.parse(data).serverRandom;
                                }, 10)
                            }
                        }
                    })
                })
            }
        },
        //下载证书人脸认证
        faceIdentify() {
            let CounterCertFlag = context.secureGetString('CounterCertFlag');
            if (CounterCertFlag == '0') {
                face.setLicence("MDQzOTA5bm9kZXZpY2Vjd2F1dGhvcml6ZZXn5+bn5+bq/+bg5efm4+f65ubn4Obg5Yjm5uvl5ubrkeXm5uvl5uai6+Xm5uvl5uTm6+Xm5uDm1efr5+vn6+er4Ofr5+vn6/vn5+bn4uTi");
                face.startAliveCheck(data => {
                    if (!JSON.parse(data).errorCode) {
                        this.goJson('/refacmob/FaceVerifyV3.do', {
                            CifName: context.secureGetString("UserName"),
                            IdNo: context.secureGetString('idNumber'),
                            IdType: '101',
                            Img: JSON.parse(data).base64
                        }, response => {
                            context.launchStage('main.certdownload?certdownload=true');
                        })
                    } else {
                        modal.toast({ message: JSON.parse(data).errorMsg });
                    }
                })
            } else {
                context.launchStage('main.certdownload?certdownload=true');
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
        goBack() {
            if (this.$router) {
                if (this.$route.path == "/index") {
                    context.replaceStage('main.launcher')
                    //context.finish();
                }else if (this.$route.path === this.$router.indexRouter) {
                    context.finish();
                } else if (this.$route.path == "/submittedSuccessful") {
                    context.finish();
                } else if (this.$route.path == "/groupManagement1") {
                  this.$router.push('/groupDetail1');
                } else if (this.$route.path == "/selectpaymentAccount") {
                    // 付款方账号置为空
                    this.$store.state.AcNo1 = "";
                    // 付款方名称置为空
                    this.$store.state.AcName1 = "";
                    // 可用余额置为空
                    this.$store.state.AvailBal = "";
                    this.$router.push('/payrollEntry');
                } else if (this.$route.path == "/newGroup") {
                    this.$store.state.bgBolG = 1;
                    this.$router.push('/myPayrollRegister');
                }else if (this.$route.path == "/addMembers2") {
                    // 返回代发工资首页
                    this.$router.push('/newGroup');
                }else if (this.$route.path == "/addMembers1") {
                    // 返回代发工资首页
                    this.$router.push('/groupManagement1');
                } else if (this.$route.path == "/myPayrollRegister") {
                    // 返回代发工资首页
                    this.$router.push('/index');
                } else if (this.$route.path == "/myPayroll") {
                    // 返回代发录入页
                    this.$router.push('/payrollEntry');
                } else if (this.$route.path == "/payrollEntry") {
                    // 返回代发工资首页
                    this.$router.push('/index');
                } else if (this.$route.path == "/groupsDetail") {
                    // 从分组详情返回代发名册分组页
                    this.$store.state.bgBolU = 1;
                    this.$router.push('/myPayroll');
                } else if (this.$route.path == "/groupDetail1") {
                    // 从分组详情返回代发名册分组页
                    this.$store.state.bgBolG = 1;
                    this.$router.push('/myPayrollRegister');
                } 
                else {
                    this.$router.back();
                }
            }
        },
        isEmpty(obj) {
            if (obj == '' || obj == undefined) {
                return true;
            }
            return false;
        },
        //数据处理 20180815 日期
        dealTime(str) {
            if (str) {
                var a = str.substring(4, 6) + '月';
                var b = str.substring(6, 8) + '日';
                return a + b;
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
        // 数据处理日期 201808091213
        dealTime2(str) {
            if (str) {
                var a = str.substring(0, 4) + '/';
                var b = str.substring(4, 6) + '/';
                var c = str.substring(6, 8) + ' ';
                var d = str.substring(8, 10) + ':';
                var e = str.substring(10, 12)
                return a + b + c + d + e;
            }
        },
        dealTime3(str) {
            if (str) {
                var a = str.substring(0, 4) + '-';
                var b = str.substring(4, 6) + '-';
                var c = str.substring(6, 8);
                return a + b + c;
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
        AccountNoFormat(value, beginnum, endnum) {
            value = value.replace(/[\s]/g, '');
            if (beginnum && endnum) {
                value = value.slice(0, beginnum) + '********' + value.slice(endnum);
                value = value.replace(/(.{4})/g, '$1 ');
            } else {
                value = value.replace(/(.{4})/g, '$1 ');
            }
            return value;
        },
        // 1566 **** **** 6355
        runAcno(str) {
            str = str.substring(0, 4) + " " + "****" + " " + "****" + " " + str.substr(str.length - 4);
            return str
        },
        runAcno1(str) {
            str = str.substring(0, 8) + "  " + "*****" + " " + "****" + "  " + str.substr(str.length - 3);
            return str.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
        },
        //处理别名
        dealalias(str) {
            if (str) {
                return str.length > 0 ? '(' + str + ')' : ''
            }
        },
        dealstatus(str) {
            if (str == '0') {
                return '交易成功';
            } else if (str == '1') {
                return '通讯失败';
            } else if (str == '2') {
                return '交易失败';
            } else if (str == '3') {
                return '交易异常';
            } else if (str == '5') {
                return '正在发送主机';
            } else if (str == '6') {
                return '预约成功';
            } else if (str == '9') {
                return '状态未明';
            }
        },
        //截取银行卡后四位
        dividelastfour(str) {
            if (str) {
                return str.substr(str.length - 4);
            }
        },
        //格式化金额并保留两位小数
        NumFormat(str) {
            if (!str) return ''
            // intPart字符串
            var str1 = str.toString();
            //   获取小数部分，没有四舍五入
            if (str1.indexOf(".") == -1) {
                var intPart = str.toFixed(0);
                var intPartFormat = intPart.toString().replace(/(?=(\B)(\d{3})+$)/g, ","); // 将整数部分逢三一断
                return intPartFormat + ".00"
            }
            else {
                var intPart = str1.substring(0, str1.indexOf("."));
                var intPartFormat = intPart.replace(/(?=(\B)(\d{3})+$)/g, ","); // 将整数部分逢三一断
                var decimals = str1.substr(str1.indexOf("."), 3);
                return intPartFormat + decimals;
            }
        },
        moneyFilter(money) {
            var reg = /^(([0]|(0[.]\d{0,2}))|([1-9]\d{0,12}(([.]\d{0,2})?)))?$/;
            if(reg.test(money)){
                if (!money) return money
                if (money && money != null) {
                    var left = money.split('.')[0];
                    var right = money.split('.')[1];
                    right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
                    var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
                    var str1 = (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
                    return str1;
                } else {
                    return money
                }
            } else{
                return money
            }
        },
          moneyFilter1(money) {
            if (!money) return money
            if (money && money != null) {
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
        queryDate(str) {
            if (str == "本月") {
                return "本月"
            } else if (str == "近七天") {
                return "近七天"
            } else if (str == "近三个月") {
                return "近3个月"
            } else if (str == "当天") {
                return "当天"
            } else {
                return
            }
        },
        // 格式化当前日期
        FormattedCurDate(str) {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();//年
            var month = date.getMonth() + 1;//月
            var strDate = date.getDate(); //日
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var str = year + seperator1 + month + seperator1 + strDate;
            return str;
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
        //根据日期选择的推算日期
        calcDate(dateValue) {
            var nowDate = new Date();//当前日期
            if (dateValue == 'Today' || dateValue == '0') {
                var formDate = this.getNowFormatDate('/');
            } else if (dateValue.includes('D')) {//推算天
                let dateNum = dateValue.replace(/[^\d]/g, '');
                let longtimes = nowDate.setDate(nowDate.getDate() - dateNum);
                var formDate = this.getNowFormatDate('/', longtimes);
            } else if (dateValue.includes('M')) {//推算月
                let monthNum = dateValue.replace(/[^\d]/g, '');
                let longtimes = nowDate.setMonth(nowDate.getMonth() - monthNum);
                var formDate = this.getNowFormatDate('/', longtimes);
            }
            return formDate;
        },
        //格式化日期
        getNowFormatDate(seperator1, longtimes) {//longtimes是要格式化的毫秒数，不传默认当前日期
            if (longtimes) {
                var date = new Date(longtimes);
            } else {
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
            var currentdate = "" + year + seperator1 + month + seperator1 + strDate;
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
// 格式化浮点数
         formatFloat(f, digit) {
            var m = Math.pow(10, digit);
            return Math.round(f*m) / m;
            },
        runAcType(str) {
            if (str == "01") {
                return "基本存款账户";
            } else if (str == "02") {
                return "一般存款账户";
            } else if (str == "03") {
                return "临时存款账户";
            } else if (str == "04") {
                return "支票户";
            } else if (str == "05") {
                return "存折户";
            } else if (str == "06") {
                return "结算账户";
            } else if (str == "07") {
                return "保证金";
            }
            else if (str == "08") {
                return "专用户";
            } else if (str == "09") {
                return "验资户";
            } else if (str == "10") {
                return "资本金户";
            } else if (str == "11") {
                return "同业存放";
            } else if (str == "12") {
                return "邮政汇兑户";
            } else if (str == "19") {
                return "活期一本通";
            } else if (str == "20") {
                return "定期账户";
            } else if (str == "29") {
                return "定期一本通";
            } else if (str == "30") {
                return "一天通知存款";
            } else if (str == "31") {
                return "七天通知存款";
            } else if (str == "32") {
                return "通知存款";
            } else if (str == "33") {
                return "协定存款";
            } else if (str == "34") {
                return "贷款";
            } else if (str == "C5") {
                return "圆鼎单位卡";
            } else if (str == "C6") {
                return "对公活期";
            } else if (str == "D0") {
                return "公司卡";
            } else if (str == "T1") {
                return "整存整取";
            } else if (str == "T2") {
                return "零存整取";
            } else if (str == "T3") {
                return "教育储蓄";
            } else if (str == "T4") {
                return "整存零取";
            } else if (str == "T5") {
                return "存本取息";
            } else if (str == "T6") {
                return "定活两便";
            } else if (str == "T7") {
                return "华侨存款";
            } else if (str == "T8") {
                return "大额定期";
            } else if (str == "T9") {
                return "保值储蓄";
            } else {
                return "";
            }

        },
        banknotes(str) {
            if (str == "AUD") {
                return "澳大利亚元"
            } else if (str == "CAD") {
                return "加拿大元"
            } else if (str == "CHF") {
                return "瑞士法郎"
            } else if (str == "CNY") {
                return "人民币"
            } else if (str == "EUR") {
                return "欧元"
            } else if (str == "GBP") {
                return "英镑"
            } else if (str == "HKD") {
                return "港币"
            } else if (str == "JPY") {
                return "日元"
            } else if (str == "NZD") {
                return "新西兰元"
            } else if (str == "SEK") {
                return "瑞典克郎"
            } else if (str == "SGD") {
                return "新加坡元"
            } else if (str == "USD") {
                return "美元"
            } else {
                return ""
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
        imgdata(x) {
            if (x) {
                if (x == '314305400015')
                    return this.$store.state.imgBaseUrl + '9999.png';
                if (x == '305')
                    return this.$store.state.imgBaseUrl + '9999.png';

                if (x.length > 4)
                    x = x.substring(0, 3);

                if (x == '102' || x == '103' || x == '104' || x == '105'
                    || x == '301' || x == '302' || x == '303' || x == '403'
                    || x == '308' || x == '310'
                    || x == '9999')
                    return this.$store.state.imgBaseUrl + x + '.png';

            }
            return this.$store.state.imgBaseUrl + 'Headportrait@3x.png';
        },
        // 金额大写
        changeMoneyToChinese(value) {
            if (!value) return ''
            value = value.toString()
            let strOutput = ''
            let strUnit = '仟佰拾亿仟佰拾万仟佰拾元角分'
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
        changeAmountUnit(value) {
            if (value >= 1000 && value < 10000) {
                return "千"
            } else if (value >= 10000 && value < 100000) {
                return "万"
            } else if (value >= 100000 && value < 1000000) {
                return "十万"
            } else if (value >= 1000000 && value < 10000000) {
                return "百万"
            } else if (value >= 10000000 && value < 100000000) {
                return "千万"
            } else if (value >= 100000000 && value < 1000000000) {
                return "亿"
            } else if (value >= 1000000000 && value < 10000000000) {
                return "十亿"
            } else if (value >= 10000000000 && value < 100000000000) {
                return "百亿"
            } else if (value >= 100000000000 && value < 1000000000000) {
                return "千亿"
            } else if (value >= 1000000000000 && value < 10000000000000) {
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
        goJson(streamId, streamParams, callback) {
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
                            } else {
                                wjalert.alert(response.data.errmsg, "确定", data => {
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
                                })
                                return;
                            }
                        }
                    }
                } else {
                    wjalert.alert('网络通讯异常请稍后再试', "确定", data => { })
                }
            })
        },
        //收款人登记簿搜索用
        commonmethod(streamId, streamParams, callback) {
            stream.fetch({
                method: 'POST',
                url: streamId,
                type: 'json',
                timeout: 60000,
                body: JSON.stringify(streamParams),
                headers: { "Content-Type": 'application/json' }
            }, response => {
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
                            } else {
                                wjalert.alert(response.data.errmsg, "确定", data => {
                                    if (streamParams.hasOwnProperty("_tokenName")) {
                                        stream.fetch({
                                            method: 'POST',
                                            url: '/refacmob/getNewTokenNameV1.do',
                                            type: 'json',
                                            headers: { "Content-Type": "application/json" }
                                        }, response => {
                                            this.$store.state.selfTokenName = response.data._tokenName;
                                            this.$store.state.otherTokenName = response.data._tokenName;
                                        })
                                    }
                                })
                                return;
                            }
                        }
                    }
                } else {
                    wjalert.alert('网络通讯异常请稍后再试', "确定", data => { })
                }
            })
        },
        post(streamId, streamParams, callback) {
            loading.showLoading("");
            stream.fetch({
                method: 'POST',
                url: streamId,
                type: 'json',
                body: JSON.stringify(streamParams),
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'text/mobjson'
                }
            }, response => {
                // callback(response);//返回成功的response
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
                                wjalert.alert(response.data.errmsg, "确定", data => { });
                            }
                        }
                    }
                } else {
                    wjalert.alert('网络通讯异常请稍后再试', "确定", data => { })
                }
            });
        },
    }
}