export  function amountFormat(input) {
    //汉字的数字
    const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    //基本单位
    const cnIntRadice = ['', '拾', '佰', '仟'];
    //对应整数部分单位
    const cnIntUnits = ['', '万', '亿', '万'];
    //对应小数部分单位
    const cnDecUnits = ['角', '分', '毫', '厘'];
    //整数金额时后面跟的字符
    let zheng = '整';
    //整型完以后的单位
    let yuan = '元';
    //最大处理的数字
    const maxNum = 999999999999999.9999;
    //金额整数部分
    let intNum;
    //金额小数部分
    let decimalNum;
    //输出的中文金额字符串
    let chineseStr = '';
    //分离金额后用的数组
    let arr;
    input = parseFloat(input);
    // console.log(input + "洪")
    if (input === undefined || input === null || input === '') {
        return '';
    }
    if (input >= maxNum) {
        //超出最大处理数字
        return '';
    }
    if (input == 0) {
        chineseStr = cnNums[0] + yuan + zheng;
        // console.log(chineseStr + '丽')
        return chineseStr;

    }
    //转换为字符串
    input = input.toString();
    // 如果.不存在，就是只有整数部分
    if (input.indexOf('.') == -1) {
        intNum = input;
        decimalNum = '';
    } else {
        arr = input.split('.');
        // console.log(arr)
        // 取整数部分
        intNum = arr[0];
        // 取小数部分并且只取四位
        decimalNum = arr[1].substr(0, 4);
        // console.log(decimalNum)
    }
    //获取整型部分转换
    if (parseInt(intNum, 10) > 0) {
        var zeroCount = 0;
        // 整数部分的长度
        var IntLen = intNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = intNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
                console.log(zeroCount+"江")
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                    console.log( chineseStr+"美")
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += yuan;
    }
    //小数部分
    if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + yuan + zheng;
    } else if (decimalNum == '') {
        chineseStr += zheng;
    }
    return chineseStr;
}
export  function   changeMoneyToChinese(value) {
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
}
