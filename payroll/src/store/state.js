export default {
  jsonBaseUrl: "./json/",
  imgBaseUrl: "./imgs/",
  // 代发录入总共笔数
  strokeCount: 0,
  // 代发录入总金额
  totalMoney:0,
  // 相同金额弹框展示
  isshowMoney: false,
  // 取消导入展示
  isDaoruCancel: false,
  isDaoruShow: false,
  // 全部收款人
  allCode1:[],
  // 搜索回来的收款人
  queryCode1:[],
  // 没有选中的收款人
  noSelectPayee1:[],
  //已经选中的收款人
  hasSelectPayee1:[],
  //代发名册那里
  allCode2:[],
  queryCode2:[],
  //修改分组代发名册那
  allCode3:[],
  queryCode3:[],
  //没有选中的收款人
  noSelectPayee2:[],
  //新建分组代发名册那
  allCode4:[],
  queryCode4:[],
 //没有选中的收款人
  noSelectPayee3:[],
  // 错误笔数关闭
  isFailClose: false,
  // excel为空时
  isemptyClose: false,
  //  excel文件名字
  fileName: "",
  // 错误笔数
  penNum: 0,
  // 保存分组的时候把后来添加的组员传给后台
  newgroupManagement: [],
  // 代发录入
  payrollEntry: [],
  //把金额格式化为之前的，不带逗号传给后台 
  payrollEntryList:[],
  // 重新导入excel时
  excelList: [],
  acnolist: [],
  // 代发录入
  editPayeeItem: {},
  // 收款人选择
  // 备注
  payeeSeleteItem: {},
  // 删除分组成员
  deleteGroupMemberItem:{},
  deleteNewGroupMemberItem:{},
  // 展示删除分组成员弹框
  isshowGroupMerber:false,
  isshowNewGroupMerber:false,
  // 展示备注
  isshowRemark: false,
  // 已选项设置的相同金额，默认为0
  payeeSeleteNumber: 0,
  // 分组
  undertakesRegister: [],
  // 分组名称
  UGroupName: "",
  // 分组详情
  groupsDetailItem: {},
  groupsDetail: [],
  // 全部收款人
  allPayeeList: [],
  // 全部收款人备注item
  FullPayeeItem: {},
  // 代发名册分组列表
  group: [],
  // 分组名称
  GGroupName: "",
  oldGGroupName: "",
  groupDetail1: [],
  GroupId: "",
  groupDetail1Item: {},
  groupManagement1: [],
  deleteList:[],
  // 已选人数
  groupDetail1Number: "",
  bgBolU: 0,
  bgBolG:0,
  // 新的分组名称
  newGroupName: "",
  addMembers2: [],
  // 已选择人数
  addMembers2Number: "",
  // 新建分组
  newGroup: [],
  isshowAdd: true,
  isshowList: false,
  changeHeight: false,
  deleteSelectPage: [],
  isshowdeleteSelectPage: false,
  selectPageNumber: 0,
  // 代发确认页账户名
  AcName1: "",
  //代发确认页账号名 
  AcNo1: "",
  // 可以余额
  AvailBal:"",
  select1: "请选择账薄",
  select: "请选择账号",
  payrollWageDetail: {},
  // 批次号
  BatchNo: "",
  // 按日期查询
  payrollWageQueryHome: [],
  dayNumber: "近三个月",
  // 展示日期弹框
  isshowDate: false,
  isshowGroup: false,
  remarkList: [],
  Flag:"",
  //代发结果审核员列表
  AuthItemList:[],
  // 代发录入页温馨提示
  promptShow:false,
  // 重新导入excel
  isDaoruReset:false,
  // 账号保护
  accountProtect:false,
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
}