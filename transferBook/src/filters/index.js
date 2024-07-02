export function host (url) {
  if (!url) return ''
  const host = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  const parts = host.split('.').slice(-3)
  if (parts[0] === 'www') parts.shift()
  return parts.join('.')
}

export function https (url) {
  const env = weex.config.env || WXEnvironment
  if (env.platform === 'iOS' && typeof url === 'string') {
    return url.replace(/^http\:/, 'https:')
  }
  return url
}


export function timeAgo (time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}
export function Name (name) {
  if (name == "" ||name==null||name==undefined) {
    name="";
  }else if(name.length > 4){
    name = name.substring(0,4) +"..."
  }
  return name;
}
export function pluralize (time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function unescape (text) {
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

export function bankNumm (str) {
  if(str != null && str != undefined && str.length > 4){
    str = str.substring(0,4)+" "+"****"+" "+"****"+" "+str.substr(str.length - 4);
  }
  return str;
}

export function Amount (amount) {
  if(amount == null || amount == undefined || isNaN(parseFloat(amount))){
    amount = "";
    return amount;
  }
  var xsd = amount.toString().split(".");
  if(xsd.length == 1){
    amount = amount.toString()+".00";
  }
  if(xsd.length > 1){
    if(xsd[1].length < 2){
      amount = amount.toString()+"0";
    }else if(xsd[1].length > 2){
      amount = amount.toString().substring(0,amount.toString().indexOf('.')+3);
    }else{
      amount = amount.toString();
    }
  }
  return amount;
}

export function depositTerm (term) {
  if(term == null || term == undefined || term == ""){
    term = "";
  }else if(term == "D0"){
    term = "活期";
  }else if(term == "M3"){
    term = "三个月";
  }else if(term == "M6"){
    term = "六个月";
  }else if(term == "Y1"){
    term = "一年";
  }else if(term == "Y2"){
    term = "二年";
  }else if(term == "Y3"){
    term = "三年";
  }else if(term == "Y5"){
    term = "五年";
  }else if(term == "N1"){
    term = "一天";
  }else if(term == "N7"){
    term = "七天";
  }
  return term;
}

export function depositType (type) {
  if(type == null || type == undefined || type == ""){
    type = "";
  }else if(type == "100"){
    type = "活期存单";
  }else if(type == "101"){
    type = "活期存款";
  }else if(type == "102"){
    type = "定活两便";
  }else if(type == "103"){
    type = "整存整取";
  }else if(type == "104"){
    type = "整存零取";
  }else if(type == "105"){
    type = "零存整取";
  }else if(type == "106"){
    type = "存本取息";
  }else if(type == "107"){
    type = "大额存单（可转让）";
  }else if(type == "108"){
    type = "通知存款";
  }else if(type == "109"){
    type = "保值整整";
  }else if(type == "110"){
    type = "教育存款";
  }else if(type == "111"){
    type = "储能一年定期";
  }
  return type;
}

export function loanTime (dklldm) {
  if(dklldm == null || dklldm == undefined || dklldm == ""){
    dklldm = "";
  }else if(dklldm == "01000006"){
    dklldm = "6个月以内(含6个月)";
  }else if(dklldm == "01000012"){
    dklldm = "6-12个月(含12个月)";
  }else if(dklldm == "02000036"){
    dklldm = "中期1-3年(含3年)";
  }else if(dklldm == "02000060"){
    dklldm = "中期3-5年(含5年)";
  }else if(dklldm == "03000120"){
    dklldm = "长期5年以上";
  }
  return dklldm;
}

export function currency (currency) {
  if(currency == null || currency == undefined || currency == ""){
    currency = "";
  }else if(currency == "AUD"){
    currency = "澳大利亚元";
  }else if(currency == "CAD"){
    currency = "加拿大元";
  }else if(currency == "CHF"){
    currency = "瑞士法郎";
  }else if(currency == "CNY"){
    currency = "人民币";
  }else if(currency == "EUR"){
    currency = "欧元";
  }else if(currency == "GBP"){
    currency = "英镑";
  }else if(currency == "HKD"){
    currency = "港币";
  }else if(currency == "JPY"){
    currency = "日元";
  }else if(currency == "NZD"){
    currency = "新西兰元";
  }else if(currency == "SEK"){
    currency = "瑞典克郎";
  }else if(currency == "SGD"){
    currency = "新加坡元";
  }else if(currency == "USD"){
    currency = "美元";
  }
  return currency;
}