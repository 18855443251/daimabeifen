export default {
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
  //  卡号格式化
  CardNum(cardNum)  {
    if(cardNum==""||cardNum==undefined||cardNum==null){
      cardNum="";
    }else{
      cardNum = cardNum.substr(0, 4) + '**** ****' + cardNum.substr(cardNum.length - 4, cardNum.length);
    }
    return cardNum;
  },
  blurMobilePhone(value) {
    if (!value) {
      return '';
    }
    return value.substr(0, 3) + ' **** ' + value.substr(-4);
  },
  blurCardNum(val) { 
    if (!val) {
      return '';
    }
    return val.substr(0, 4) + ' **** ' + '**** ' + val.substr(-4);
  },

  formatDate(date, format = '1') {
    if (!date) {
      return '';
    }
    var now = new Date(date);
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth(); //得到月份
    var date = now.getDate(); //得到日期
    var day = now.getDay(); //得到周几
    var hour = now.getHours(); //得到小时
    var minu = now.getMinutes(); //得到分钟
    var sec = now.getSeconds(); //得到秒
    month = month + 1;
    if (month < 10) month = '0' + month;
    if (date < 10) date = '0' + date;
    if (hour < 10) hour = '0' + hour;
    if (minu < 10) minu = '0' + minu;
    if (sec < 10) sec = '0' + sec;
    var time = '';
    //精确到天
    if (format == 1) {
      time = year + '-' + month + '-' + date;
    }
    //精确到分
    else if (format == 2) {
      time =
        year + '-' + month + '-' + date + ' ' + hour + ':' + minu + ':' + sec;
    }
    return time;
  }
};
