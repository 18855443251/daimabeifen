export default {
    jsonBaseUrl: "./json/",
    imgBaseUrl: "./imgs/",
    newsInfoUrl: "",
    isHeight: 1125, //交易弹窗的高度
    isTrue: false,  //是否显示交易弹窗
    status_bar_height: 0,
    WxcCityShow: false,
    selectCity: null,
    bankCarsInfo: {},
    userName: '',
    TypeList: [],
    money: '',
    tokenName: '',
    address: '',
    
    authdata: {},
    i: 0,
    isRandom: false,
    serverRandomStr: '',
    firstCommit: true,
    ResolvedMsg: '',
    isShowPayeeNet: false,

    transferPayerAcctList:[],//转账账户列表
    transferPayerAcctBookList:[],//转账账簿列表
    cityCode:'',//市代码
    // 转账提交数据
    transferSubmitData: {
        //付款方信息
        'ImmediatelyFlag': '0',
        'TransferPath':'',//支付渠道代码
        // 'RteFlg':'',//智能汇路标识,1001:到账最快，1002，手续费最少
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
        'transferUse':'往来款',//转账用途，默认往来款
        'mobilePhone': '',//短信通知收款人
        'SysFlag':'',//收款人管理簿标识网点省市，网点名称是否可用（1可用）
        'isCheckBankInner':'',//是否需要查询CheckBankInner的标识
        'selectAcctBookItem':'',//选中的账簿
    },
    transResData:{},//转账成功的返回结果数据
    BankInner:'',//是否是行内（ 9：行外,其他值是行内）
    transType:'',//到账方式
    RecordListInFo:"",//转账记录列表每条信息详情
    OtherRecordListInFo:"",//他人转账记录列表每条信息详情
    RecordDetailInFo:"",//转账记录详情
    recordState:{
        'PR00':"待处理",
        'PR10':"待复核",
        'PR11':"待授权",
        'PR12':"待发送",//可撤销
        'PR13':"待回执",
        'PR19':"录取超时",
        'PR20':"发送中",
        'PR21':"已发送",
        'PR30':"回执中",
        'PR31':"已回执",
        'PR42':"已退回",
        'PR45':"已完成",//交易成功
        'PR46':"已冲正",
        'PR90':"已撤销",
        'PR99':"已失败"
        
    },
    payeeDetail:"",//从收款人账户管理场景跳回时拿到的收款人信息
    BankAcTypeNameList:{
        '01':'基本存款账户',
        '02':'一般存款账户',
        '03':'临时存款账户',
        '04':'支票户',
        '05':'存折户',
        '06':'结算账户',
        '07':'保证金',
        '08':'专用户',
        '09':'验资户',
        '10':'资本金户',
        '11':'同业存放',
        '12':'邮政汇兑户',
        '19':'活期一本通',
        '20':'定期账户',
        '29':'定期一本通',
        '30':'一天通知存款',
        '31':'七天通知存款',
        '32':'通知存款',
        '33':'协定存款',
        '34':'贷款',
        'C5':'圆鼎单位卡',
        'C6':'对公活期',
        'D0':'公司卡',
        'T1':'整存整取',
        'T2':'零存整取',
        'T3':'教育储蓄',
        'T4':'整存零取',
        'T5':'存本取息',
        'T6':'定活两便',
        'T7':'华侨存款',
        'T8':'大额定期',
        'T9':'保值储蓄'
    },
    transTypeList:{
        '0':'实时到账',
        '1':'普通到账',
        '2':'次日到账'
    },
    transChannel:{
        '00':"柜面",
        '01':"POS",
        '02':"ATM",
        '03':"网银",
        '04':"手机银行",
        '05':"电话银行",
        '06':"自助银行",
        '07':"现金管理",
    },
    transResultFlag:'0',//转账结果页的标识，共5种(0：需审核，提交成功 1:实时到账成功 2：普通转账成功，已受理 3：次日转账成功，已受理 4：转账失败)
    accountProtect:false,//账号保护是否开启，默认关闭    
    // upPwd:false,
    netWorkList:[],
    transCancelResData:{},//撤销成功的返回结果数据
    updateList:'',//是否刷新首页查询收款人的标识
    confirmTransferParams:{},//转账的trasnfer.do交易的提交参数，放在store里是因为这个参数方便与yundunModal云盾验证框共享
    transUseList:['货款','采购款','工资','借款','往来款','还款','差旅费','保证金','运费'],//转账用途   发TransferPre可能会有新增  会往后push
}