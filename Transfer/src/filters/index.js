export function host(url) {
  if (!url) return ''
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}

export function https(url) {
  const env = weex.config.env || WXEnvironment
  if (env.platform === 'iOS' && typeof url === 'string') {
    return url.replace(/^http\:/, 'https:')
  }
  return url
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function unescape(text) {
  let res = text || ''

    ;[
      ['<p>', '\n'],
      ['&amp;', '&'],
      ['&amp;', '&'],
      ['&apos;', '\''],
      ['&#x27;', '\''],
      ['&#x2F;', '/'],
      ['&#39;', '\''],
      ['&#47;', '/'],
      ['&lt;', '<'],
      ['&gt;', '>'],
      ['&nbsp;', ' '],
      ['&quot;', '"']
    ].forEach(pair => {
      res = res.replace(new RegExp(pair[0], 'ig'), pair[1])
    })

  return res
}
//去空格
export function deleteSpace(str) {
  if (!str) {
    return '';
  }
  return str.replace(/\s+/g, '')
}

//超过16位显示省略号
export function ellipsis(str, length) {
  if (!str) {
    return '';
  }
  var leng = length || 16;//默认16
  if (str.length <= leng) {
    return str
  } else {
    return str.substr(0, leng) + '...'
  }
}

export function changeMoneyToChinese(value) {
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
}

//币种数据字典
export function currency(code) {
  switch (code) {
    case 'CNY': return '人民币';
    case 'AUD': return '澳大利亚元';
    case 'CAD': return '加拿大元';
    case 'CHF': return '瑞士法郎';
    case 'CNY': return '人民币';
    case 'EUR': return '欧元';
    case 'GBP': return '英镑';
    case 'HKD': return '港币';
    case 'JPY': return '日元';
    case 'NZD': return '新西兰元';
    case 'SEK': return '瑞典克郎';
    case 'SGD': return '新加坡元';
    case 'USD': return '美元';
  }
  return code;
}

// 钞汇标志
export function crflag(code) {
  switch (code) {
    case 'C': return '钞';
    case 'O': return '其他';
    case 'R': return '汇';
  }
  return code;
}


// 金额格式化
export function NumFormat(value) {
  if(typeof(value=='string')){
      value = Number(value);
  }
  if (!value) return "0.00";
  value = value.toFixed(2);
  var intPart = Number(Math.floor(value)); // 获取整数部分
  var intPartFormat = intPart
      .toString()
      .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,"); // 将整数部分逢三一断
  var floatPart = ".00"; // 预定义小数部分
  var value2Array = value.split(".");
  // =2表示数据有小数位
  if (value2Array.length === 2) {
      floatPart = value2Array[1].toString(); // 拿到小数部分
      if (floatPart.length === 1) {
          // 补0,实际上用不着
          return intPartFormat + "." + floatPart + "0";
      } else {
          return intPartFormat + "." + floatPart;
      }
  } else {
      return intPartFormat + floatPart;
  }
}
//银行卡账号4位分隔,且支持账号保护
export function AccountNoFormat(value,beginnum,endnum){
    if(value){
      value=value.replace(/[\s]/g,'');
      if(beginnum&&endnum){
          value=value.slice(0,beginnum)+'********'+value.slice(endnum);
          value=value.replace(/(.{4})/g,'$1 ');
      }else{
          value=value.replace(/(.{4})/g,'$1 ');  
      }
      return value;
    }else{
      return '';
    }
}