export default {
  jsonBaseUrl: './json/',
  imgBaseUrl: './imgs/',
  assets: '',
  isLogin: '',
  debt: '',
  assets: '',
  userinfo: {},
  mobiel: '',
  i: 0,
  y: 0,
  viewappear: 0,
  permission: {},
  isPromptError: true,
  scrollable: true,
  isTrue: false, //控制云盾，短信，令牌
  isHeight: 584,
  upPwd: false,
  AutoLoginUrl:"",
  auduitList:[],//发起的列表
  dealList:[],//处理的列表
  tocheck:0,//选择审核条数
  checkTotal:'',//待审核总数
  totalAmount:"0.00",//待审核总金额
  checkList:[],//待审核列表
  selectList:[],
  AuthList:[],
  trslist:[],
  trsNameList:[],
  ATrstypeShow:false,
  AuthTotal:'',
  SumAmount:"",
  isselectshow:false,
  oldlist: [],
  payrollEntry: [],
  UpdateAntiFake:"",
  showall: false,
  sevenTransfer: "",
  isGetCheck:0,//在待我审批页面是否发送getCheck查询待审核列表页面，监听此属性以当审核成功finish回到列表页 实时刷新待审核数据
  CheckAuthItemList:[],
  transChannel:{
      '00':"柜面",
      '01':"POS",
      '02':"ATM",
      '03':"网银",
      '04':"手机银行",
      '05':"电话银行",
      '06':"自助银行"
  },
  OFTENList:{
    'OFTEN':'经常项下'
  },
  launcherTabbarTimes:0,//首页点击下面3个按钮时的次数，用于监听若改变则刷新交易
};
