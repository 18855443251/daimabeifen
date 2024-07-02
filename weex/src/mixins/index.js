//客户端扩展模块
const context = weex.requireModule('context');
const modal = weex.requireModule('modal');
const wjalert = weex.requireModule('weex-alert');
const stream = weex.requireModule('stream');
const loading = weex.requireModule('loading');
const commonMenu = weex.requireModule('common_menu');
const storage = weex.requireModule("storage");

import { mapState } from 'vuex';

export default {
  data() {
    return {
        deviceStatusBarHeight: 68,
        defaultDeviceStatusBarHeight: 68
    }
  },
  created() {
    //this.initDeviceStatusBarHeight();
  },
  computed: {
    // getStatusHeight() {
    //   return { height: this.deviceStatusBarHeight, backgroundColor: "#FFFFFF" }
    // },
    ...mapState(['isPromptError', 'mobiel'])
  },
  methods: {
    //到账类型
    Immediately(str){
      if(str=="0"){
                return "实时到账"
      }else if(str=="1"){
            return "普通到账"
      }else if(str=="2"){
          return "次日到账"
      }
    }, 
    //支票种类
    CheckKind(str){
      if(str=="51"){
                return "现金支票"
      }else if(str=="52"){
            return "转账支票"
      }else{
          return ""
      }
    },
    // 币种汉字与简写互换
    changeCurrency(msg) {
      switch (msg) {
          case "CNY":
              return "人名币";
              break;
          case "人名币":
              return "CNY";
              break;
          case "GBP":
              return "英镑";
              break;
          case "英镑":
              return "GBP";
              break;
          case "HKD":
              return "港币";
              break;
          case "港币":
              return "HKD";
              break;
          case "USD":
              return "美元";
              break;
          case "美元":
              return "USD";
              break;
          case "CHF":
              return "瑞士法郎";
              break;
          case "瑞士法郎":
              return "CHF";
              break;
          case "AUD":
              return "澳大利亚元";
              break;
          case "澳大利亚元":
              return "AUD";
              break;
          case "CAD":
              return "加拿大元";
              break;
          case "加拿大元":
              return "CAD";
              break;
          case "EUR":
              return "欧元";
              break;
          case "JPY":
              return "日元";
              break;
          case "日元":
              return "JPY";
              break;
          case "NZD":
              return "新西兰元";
              break;
          case "新西兰元":
              return "NZD";
              break;
          case "SEK":
              return "瑞典克郎";
              break;
          case "瑞典克郎":
              return "SEK";
              break;
          case "SGD":
              return "新加坡元";
              break;
          case "新加坡元":
              return "SGD";
              break;
          default:
              break
          }
      },
    // 根据数值判断状态
    // runstatus(item){
    //   var str="";
    //   if(item.IsAuthing==null){
    //       if(item.TrsState==null){
    //           if(item.JnlState=="0"){
    //               str="交易成功";
    //           }else if(item.JnlState=="1"){
    //               str="通讯失败";
    //           }else if(item.JnlState=="2"){
    //               str="交易失败";
    //           }else if(item.JnlState=="3"){
    //               str="交易异常";
    //           }else if(item.JnlState=="5"){
    //               str="正在发送主机";
    //           }else if(item.JnlState=="6"){
    //               str="预约成功";
    //           }else if(item.JnlState=="9"){
    //               str="状态未明";
    //           }
    //       }else{
    //           if(item.TrsState=="0"){
    //               str="审核通过";
    //           }else if(item.TrsState=="8"){
    //               str="审核退回";
    //           }else if(item.TrsState=="9"){
    //               str="审核拒绝";
    //           }
    //       }
    //     }else{
    //         str="待审核";
    //     }
    //     return str
    // },       
    // 根据数值判断状态
    runstatus(item){
      var str="";
          if(item !== null){
              if( item =="1"){
                  str="交易成功";             
              }else if(item =="2"){
                  str="交易失败";
              }else if(item =="3"){
                  str="待审核";
              }else if(item =="4"){
                  str="已拒绝";
              }else if(item =="5"){
                  str="银行已受理";
              }
          }
        return str
    },   
      // 票据签收状态
 getNewDraftStsNm(str) {
  let tempDraftSts = "";
  if (str == "-") {
    tempDraftSts = "未收票";
  } else if (str == "010004") {
    tempDraftSts = "出票已登记";
  } else if (str == "020001") {
    tempDraftSts = "提示承兑待签收";
  } else if (str == "020006") {
    tempDraftSts = "提示承兑已签收";
  } else if (str == "030001") {
    tempDraftSts = "提示收票待签收";
  } else if (str == "030006") {
    tempDraftSts = "提示收票已签收";
  } else if (str == "100001") {
    tempDraftSts = "背书待签收";
  } else if (str == "100006") {
    tempDraftSts = "背书已签收";
  } else if (str == "110101") {
    tempDraftSts = "买断式贴现待签收";
  } else if (str == "110103") {
    tempDraftSts = "买断式贴现已签收待清算";
  } else if (str == "110105") {
    tempDraftSts = "买断式贴现已签收已排队";
  } else if (str == "110106") {
    tempDraftSts = "买断式贴现已签收";
  } else if (str == "110201") {
    tempDraftSts = "回购式贴现待签收";
  } else if (str == "110203") {
    tempDraftSts = "回购式贴现已签收待清算";
  } else if (str == "110205") {
    tempDraftSts = "回购式贴现已签收已排队";
  } else if (str == "110206") {
    tempDraftSts = "回购式贴现已签收";
  } else if (str == "110216") {
    tempDraftSts = "回购式贴现已至赎回开放日";
  } else if (str == "110218") {
    tempDraftSts = "回购式贴现已逾赎回截止日";
  } else if (str == "120001") {
    tempDraftSts = "回购式贴现赎回待签收";
  } else if (str == "120003") {
    tempDraftSts = "回购式贴现赎回已签收待清算";
  } else if (str == "120005") {
    tempDraftSts = "回购式贴现赎回已签收已排队";
  } else if (str == "120006") {
    tempDraftSts = "回购式贴现赎回已签收";
  } else if (str == "130101") {
    tempDraftSts = "买断式转贴现待签收";
  } else if (str == "130103") {
    tempDraftSts = "买断式转贴现已签收待清算";
  } else if (str == "130105") {
    tempDraftSts = "买断式转贴现已签收已排队";
  } else if (str == "130106") {
    tempDraftSts = "买断式转贴现已签收";
  } else if (str == "130201") {
    tempDraftSts = "回购式转贴现待签收";
  } else if (str == "130203") {
    tempDraftSts = "回购式转贴现已签收待清算";
  } else if (str == "130205") {
    tempDraftSts = "回购式转贴现已签收已排队";
  } else if (str == "130206") {
    tempDraftSts = "回购式转贴现已签收";
  } else if (str == "130216") {
    tempDraftSts = "回购式转贴现已至赎回开放日";
  } else if (str == "130218") {
    tempDraftSts = "回购式转贴现已逾赎回截止日";
  } else if (str == "140001") {
    tempDraftSts = "回购式转贴现赎回待签收";
  } else if (str == "140003") {
    tempDraftSts = "回购式转贴现赎回已签收待清算";
  } else if (str == "140005") {
    tempDraftSts = "回购式转贴现赎回已签收已排队";
  } else if (str == "140006") {
    tempDraftSts = "回购式转贴现赎回已签收";
  } else if (str == "150101") {
    tempDraftSts = "买断式再贴现待签收";
  } else if (str == "150103") {
    tempDraftSts = "买断式再贴现已签收待清算";
  } else if (str == "150105") {
    tempDraftSts = "买断式再贴现已签收已排队";
  } else if (str == "150106") {
    tempDraftSts = "买断式再贴现已签收";
  } else if (str == "150201") {
    tempDraftSts = "回购式再贴现待签收";
  } else if (str == "150203") {
    tempDraftSts = "回购式再贴现已签收待清算";
  } else if (str == "150205") {
    tempDraftSts = "回购式再贴现已签收已排队";
  } else if (str == "150206") {
    tempDraftSts = "回购式再贴现已签收";
  } else if (str == "150216") {
    tempDraftSts = "回购式再贴现已至赎回开放日";
  } else if (str == "150218") {
    tempDraftSts = "回购式再贴现已逾赎回截止日";
  } else if (str == "160001") {
    tempDraftSts = "回购式再贴现赎回待签收";
  } else if (str == "160003") {
    tempDraftSts = "回购式再贴现赎回已签收待清算";
  } else if (str == "160005") {
    tempDraftSts = "回购式再贴现赎回已签收已排队";
  } else if (str == "160006") {
    tempDraftSts = "回购式再贴现赎回已签收";
  } else if (str == "180001") {
    tempDraftSts = "质押待签收";
  } else if (str == "180006") {
    tempDraftSts = "质押已签收";
  } else if (str == "180020") {
    tempDraftSts = "质押已至票据到期日";
  } else if (str == "190001") {
    tempDraftSts = "质押解除待签收";
  } else if (str == "190006") {
    tempDraftSts = "质押解除已签收";
  } else if (str == "170001") {
    tempDraftSts = "保证待签收";
  } else if (str == "200001") {
    tempDraftSts = "提示付款待签收";
  } else if (str == "200003") {
    tempDraftSts = "提示付款已签收待清算";
  } else if (str == "200005") {
    tempDraftSts = "提示付款已签收已排队";
  } else if (str == "000000") {
    tempDraftSts = "票据已结清";
  } else if (str == "200312") {
    tempDraftSts = "提示付款已拒付（可拒付追索，只能追出票人，承兑人及其保证人）";
  } else if (str == "200412") {
    tempDraftSts = "提示付款已拒付（可拒付追索，可以追所有人)";
  } else if (str == "200512") {
    tempDraftSts = "提示付款已拒付（不可进行拒付追索)";
  } else if (str == "210001") {
    tempDraftSts = "逾期提示付款待签收";
  } else if (str == "210003") {
    tempDraftSts = "逾期提示付款已签收待清算";
  } else if (str == "210005") {
    tempDraftSts = "逾期提示付款已签收已排队";
  } else if (str == "210312") {
    tempDraftSts = "逾期提示付款已拒付（可拒付追索，只能追出票人，承兑人及其保证人)";
  } else if (str == "210412") {
    tempDraftSts = "逾期提示付款逾期提示付款已拒付（可拒付追索，可以追所有人)";
  } else if (str == "220607") {
    tempDraftSts = "拒付追索待清偿";
  } else if (str == "230601") {
    tempDraftSts = "拒付追索同意清偿待签收";
  } else if (str == "230606") {
    tempDraftSts = "拒付追索同意清偿已签收";
  } else if (str == "220707") {
    tempDraftSts = "非拒付追索待清偿";
  } else if (str == "220710") {
    tempDraftSts = "非拒付追索已撤销";
  } else if (str == "230701") {
    tempDraftSts = "非拒付追索同意清偿待签收";
  } else if (str == "230706") {
    tempDraftSts = "非拒付追索同意清偿已签收";
  } else if (str == "000026") {
    tempDraftSts = "已逾票据权利失效日";
  } else if (str == "250001") {
    tempDraftSts = "央行卖票待签收";
  } else if (str == "250003") {
    tempDraftSts = "央行卖票已签收待清算";
  } else if (str == "250005") {
    tempDraftSts = "央行卖票已签收已排队";
  } else if (str == "250006") {
    tempDraftSts = "央行卖票已签收";
  }
  return tempDraftSts;
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
        //时间格式化
      formatDate(str){
          var month = str.getMonth() + 1;
          var strDate = str.getDate();
          if(month >= 1 && month <= 9) {
              month = "0" + month;
          }          
          if(strDate >= 1 && strDate <= 9) {
            strDate = "0" + strDate;
        }
          return str= str.getFullYear() + "-" + month + "-" + strDate
      },
    //前往
    jump(to) {
      if (this.$router) {
          this.$router.push(to)
      }
    },
    //确认，取消,confirm
    alertMsg(text,okTitle,cancelTitle,confirm){
      wjalert.confirm(text,okTitle,cancelTitle,confirm)
    },
    //content,确认,回调，alert弹框,
    showOneBtnAlert(msg,okTitle,confirm){
        wjalert.alert(msg,okTitle,confirm)
    },
    jumpBundle(name, bundle) {
      if (this.$router) {
        this.$router.push({
          name: name,
          params: bundle
        });
      }
    },
    goBack() {
      var warmId = context.secureGetString("warmId");
      if(warmId!=1){
        context.shutdown();
      }
      if (this.$router) {
        let [shutArr, arr] = [
          ['/Tab_business', '/Launcher'],
          [
            '/MTRegisterResult',
            '/MTChangeResultLogout',
            '/MTChangeResultBind',
            '/MTChangeResultDefault',
            '/Agreement',
            '/PendingPaymentresult',
            '/CheckResult',
          ]
        ];
        if (shutArr.toString().indexOf(this.$route.path) != -1) {
          this.shutdown();
        }else if (this.$route.path === '/Guide') {
            return;
        }else if (this.$route.path === this.$router.indexRouter ||arr.toString().indexOf(this.$route.path) != -1) {
          context.finish();
        } else {
          this.$router.back();
        }
      }
    },
    shutdown() {
      wjalert.confirm('您确定退出应用?', '确定', '取消', data => {
        if (data == 'Y') {
          context.shutdown();
        }
      });
    },
    toParams(obj) {
      var param = '';
      for (const name in obj) {
        if (typeof obj[name] != 'function') {
          param += '&' + name + '=' + encodeURI(obj[name]);
        }
      }
      return param.substring(1);
    },
    weexAlert(message, button = '确认', callback) {
      wjalert.alert(message, button, data => {
        if (callback) {
          callback();
        }
      });
    },
    alert(message) {
      modal.alert({
        message: message,
        duration: 0.3
      });
    },
    // 结售汇对象数字词典
    exchangeObjectChange(msg) {
        switch (msg) {
            case '01':
                return '银行自身';
                break;
            case '02':
                return '金融机构';
                break;
            case '03':
                return '中资机构';
                break;
            case '04':
                return '外资机构';
                break;
            case '05':
                return '居民个人';
                break;
            case '06':
                return '非居民个人';
                break;
        }
    },
    alertMsgCallBack(message, callback) {
      modal.alert(
        {
          message: message,
          okTitle: '确定',
          duration: 3
        },
        function(value) {
          callback();
        }
      );
    },
    toastMsg(message) {
      modal.toast({
        message: message,
        duration: 3
      });
    },
    call(num) {
      if (!this.isNull(num)) context.launchStage('ext:tel:' + num);
    },
    launchStage(stage) {
      context.launchStage(stage);
    },
    replaceStage(stage) {
      context.replaceStage(stage);
    },
    finishPage() {
      context.finish();
    },
    setSession(key, value) {
      context.sessionSetString(key, value);
    },
    getHeight() {
      const {
        env: { deviceHeight, deviceWidth }
      } = weex.config;
      var pageHeight = (deviceHeight / deviceWidth) * 750;
      return pageHeight;
    },
    isNull(message) {
      if (message == null || message == undefined || message == '') {
        return true;
      }
      return false;
    },
    judgeIslogin(callback) {
      if (context.sessionGetString('isLogin') == 'y') {
        callback();
      } else {
        context.launchStage('main.login?flag=1');
      }
    },
    isVisitor(callback) {
      var LoginType = context.secureGetString('LoginType');
      if (LoginType == 'V') {
        this.confirmModal();
      } else {
        callback();
      }
    },
    //是否是iphoneX iphoneXS iphoneXSMax
    isipx() {
      let [deviceList, deviceModel] = [
        [
          'iPhone10,3',
          'iPhone10,6',
          'iPhone11,8',
          'iPhone11,2',
          'iPhone11,4',
          'iPhone11,6'
        ],
        weex.config.env.deviceModel
      ];
      return deviceList.indexOf(deviceModel) != '-1';
    },
    RecordMenu(menu) {
      commonMenu.menuRecord(this.mobiel, menu);
    },
    gotoStage(url, isNotRecord) {
      // if (!isNotRecord) {
      //   commonMenu.menuRecord(this.mobiel, url);
      // }
      // context.sessionSetString('nextScenes', url);
      // if (context.sessionGetString('isLogin') == 'y') {
      //   var LoginType = context.secureGetString('LoginType');
      //   for (let value of this.$store.state.permission) {
      //     if (value.url == url) {
      //       if (value.auth.match(LoginType)) {
      //         context.launchStage(url);
      //       } else {
      //         this.checkUserAuch(LoginType);
      //       }
      //       return;
      //     }
      //   }
      // }
      context.launchStage(url);
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
    checkUserAuch(auth) {
      switch (auth) {
        case 'V':
          this.confirmModal();
          break;
        case 'E':
          this.alertModal('直销');
          break;
        case 'R':
          this.alertModal('大众版');
          break;
      }
    },
    //银行卡号每四位分割
    divieBanks(str) {
      if (str) {
          return str.replace(/[\s]/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
      }
    },
    // 适配刘海屏
    // initDeviceStatusBarHeight() {
    //   if (weex.config.env.platform == 'iOS') {
    //       weexConfig.statusHeight(data => {
    //           this.deviceStatusBarHeight = data;
    //       })
    //   } else {
    //       const { env: { deviceHeight, deviceWidth } } = weex.config;
    //       let status_bar_height = context.getDeviceInfo().status_bar_height;
    //       let statusHeight = status_bar_height * 750 / deviceWidth;
    //       this.deviceStatusBarHeight = statusHeight;
    //   }
    // },
    // getPosiScrollerTop(){
    //   let scrollerTop=parseFloat(this.deviceStatusBarHeight)+90;
    //   return scrollerTop;
    // },
    alertModal(msg) {
      wjalert.alert(
        `当前${msg}银行不支持该功能，请至柜面升级专业版后进行操作`,
        '我知道了',
        data => {
          //点击确认执行方法
        }
      );
    },
    // 日期格式化
    toDate(str){
      if (str !== undefined) {
        str = str.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3')
      }
      return str
    },
    //金额格式化
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
      }
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
    dealTimeLine(str,time) {
        if (str) {
            if(time){
                return str.substring(0, 4)+"-"+str.substring(4, 6) +"-"+ str.substring(6, 8)+" "+time.substring(0, 2)+":"+time.substring(2, 4) +":"+ time.substring(4, 6);
            }else{
                return str.substring(0, 4)+"-"+str.substring(4, 6) +"-"+ str.substring(6, 8);
            }
        }
    },
    //  卡号格式化
    CardNum(cardNum)  {
      if(cardNum==""||cardNum==undefined||cardNum==null){
        cardNum="";
      }else{
        cardNum = cardNum.substr(0, 4) + '**** ****' + cardNum.substr(cardNum.length - 4, cardNum.length);
      }
      return cardNum;
    },
    confirmModal() {
      wjalert.confirm(
        '您的当前身份为游客，此功能需要绑卡后才可操作，是否前去绑卡？',
        '去绑卡',
        '取消',
        data => {
          if (data == 'N') {
          } else if (data == 'Y') {
            //点击确认执行方法
            context.launchStage('main.identifyId');
          }
        }
      );
    },
    httpGet(url, callback) {
      stream.fetch(
        {
          method: 'GET',
          url: url,
          type: 'json'
        },
        response => {
          if (response.status == 200) {
            callback(response); //返回成功的response
          } else {
            wjalert.alert(
              '网络通讯异常，请稍后再试或联系客服',
              '确定',
              data => {}
            );
          }
        }
      );
    },
    //最近使用功能
    lastfuncAction(url, name, key, platform) {
      //最近使用功能存储###########
      //删除相同功能
      var oldlist = [];
      this.oldlist = this.$store.state.oldlist;
      for (var i = 0; i < this.oldlist.length; i++) {
          if (this.oldlist[i].lastfuncname === name) {
              this.oldlist.splice(i, 1);
          }
      }
      //将跳转功能存储
      const lastfunctionitem = {
          lastfuncurl: url,
          lastfuncname: name,
          lastfunckey: key,
          lastfuncplatform: platform
      };

      this.oldlist.push(lastfunctionitem);
      //保持常用功能个数为4
      if (this.oldlist.length > 4) {
          this.oldlist.shift();
          var temp = {
              oldlist: this.oldlist
          };
          storage.setItem('lastfunction', JSON.stringify(temp), event => {

          });
      } else {
          var temp = {
              oldlist: this.oldlist
          };
          storage.setItem('lastfunction', JSON.stringify(temp), event => {

          });
      }
      //###############################
    },
    getoldlist() {
        //获取最近常用功能
        storage.getItem('lastfunction', event => {
            this.$store.state.oldlist = JSON.parse(event.data).oldlist;
        })
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
    formatTime(date){
      
    },
    //根据日期选择的推算日期
    calcDate(seperator,dateValue){
      var nowDate=new Date();//当前日期
      if(dateValue=='Today'||dateValue=='0'){
          var formDate=this.getNowFormatDateWeex(seperator);
      }else if(dateValue.includes('D')){//推算天
          let dateNum=dateValue.replace(/[^\d]/g,'');
          let longtimes=nowDate.setDate(nowDate.getDate()-dateNum);
          var formDate=this.getNowFormatDateWeex(seperator,longtimes);
      }else if(dateValue.includes('M')){//推算月
          let monthNum=dateValue.replace(/[^\d]/g,'');
          let longtimes=nowDate.setMonth(nowDate.getMonth()-monthNum);
          var formDate=this.getNowFormatDateWeex(seperator,longtimes);
      }
      return formDate;
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
    //格式化日期
    getNowFormatDateWeex(seperator1,longtimes) {//longtimes是要格式化的毫秒数或者符合格式的日期，不传默认当前日期
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
    //限制只能输入数字，且保留两位小数
    clearNoAmountMd(value) {
      let obj = value
      obj = obj.replace(/[^\d.]/g, '') //清除“数字”和“.”以外的字符
      obj = obj.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
      obj = obj
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      obj = obj.replace(/^(\-)*(\d*)\.(\d\d).*$/, '$1$2.$3') //只能输入两个小数
      //如果没有小数点，不能为类似 01、02的金额
      if (obj.indexOf('.') < 0 && obj != '') {
        obj = parseFloat(obj).toString()
      }
      //如果有小数点，不能为类似 1.10的金额
      // if (obj.indexOf('.') > 0 && obj.lastIndexOf('0') > obj.indexOf('.') + 1) {
      //   obj = parseFloat(obj).toString()
      // }
      //如果有小数点，不能为类似 0.00的金额
      if (
        obj.indexOf('.') > 0 &&
        obj.indexOf('0') === 0 &&
        obj.lastIndexOf('0') > 2
      ) {
        obj = parseFloat(obj).toString()
      }
      return obj
    },
    goJson(streamId, streamParams, callback, errCallback,loadingflag) {
      if(!loadingflag){
        loading.showLoading('加载中');
      }
      stream.fetch(
        {
          method: 'POST',
          url: streamId,
          type: 'json',
          timeout: 60000,
          // body: this.toParams(streamParams),
          body: JSON.stringify(streamParams),
          headers:{ "Content-Type": 'application/json',"Accept":'text/mobjson'},
          // headers: { 'Content-Type': 'application/json' }
        },
        response => {
          if(!loadingflag){
            loading.stopLoading();
          }
          // callback(response);
          if (response.status == 200) {
            if (response.data._RejCode == '000000') {
              //请求成功
              callback(response); //返回成功的response
            } else {
              var errmsg = response.data.errmsg;
              //登录超时
              if (response.data._RejCode == '888888' ||response.data._RejCode == '777777') {
                wjalert.alert(errmsg, '确定', data => {
                  context.sessionSetString('isLogin', '');
                  context.sessionSetString('userinfo', '');
                  context.clearToken();
                  context.sessionSetString('nextScenes', '');
                  context.launchStage('main.login');
                });
              }else if(response.data._RejCode=="222222"){
                  wjalert.alert(response.data.errmsg,"确定",data=>{
                      context.launchStage("main.reconciliation")
                  })
              }else {
                  if (response.data._RejCode != "validation.acno.opendate.error") {
                    this.showOneBtnAlert(errmsg,"确定",()=>{});
                  }
                  errCallback(response);
              }
            }
          } else {
            if (errCallback) {
              errCallback(response);
            }
            if (this.isPromptError) {
              this.$store.dispatch('setPromptErrorAction', false);
              wjalert.alert(
                '网络通讯异常，请稍后再试或联系客服',
                '确定',
                data => {}
              );
            }
          }
        }
      );
    }
  }
};
