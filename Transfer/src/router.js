import Router from 'vue-router'
Vue.use(Router)
// 首页
import Index from './views/index.vue' //转账首页--入口
// 普通银行账号转账--未开通现金管理多级账簿
import PayerInfo from './views/bankTrans/payerInfo.vue' //付款人信息
import PayeeInfo from './views/bankTrans/payeeInfo.vue' //收款人信息
// 确认页和结果页--公用--和银行选择和网点选择
import TransferConfirm from './views/commonPage/transferConfirm.vue' //转账确认页
import TransferResult from './views/commonPage/transferResult.vue' //转账结果页面
import ChooseNetName from './views/commonPage/chooseNetName.vue' //网点名称选择页面
// 银行账号转账--账户和多级账簿选择
import ChooseAcct from './views/bankTrans/chooseAcct.vue' //选择实体账户
import ChooseAcctBook from './views/bankTrans/chooseAcctBook.vue' //选择账簿
// 快捷转账
import FastTrans from './views/bankTrans/fastTrans.vue' 
// 收款人登记簿
// 转账记录
import RecordList from './views/recordQry/recordList.vue' //列表
import RecordDetail from './views/recordQry/recordDetail.vue' //详情
import otherRecordDetail from './views/recordQry/otherRecordDetail.vue' //他人转账记录详情
import CancelRes from './views/recordQry/cancelRes.vue' //撤销结果
import Receipt from './views/recordQry/receipt.vue' //电子回单
import otherRecordList from './views/recordQry/otherRecordList.vue' //查看与他人的转账记录列表


let routerSwitch = true;

let router = new Router({
    // mode: 'abstract',
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/index',
            component: Index
        },
        {
            path: '/TransferConfirm',
            component: TransferConfirm
        },
        {
            path: '/TransferResult',
            component: TransferResult
        },
        {
            path: '/PayerInfo',
            component: PayerInfo,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/PayeeInfo',
            component: PayeeInfo,
            meta: {
                keepAlive: true
            }
        },
        {
            name: 'ChooseAcct',
            path: '/ChooseAcct',
            component: ChooseAcct,
            meta: {
                keepAlive: true
            }
        },
        {
            name: 'ChooseAcctBook',
            path: '/ChooseAcctBook',
            component: ChooseAcctBook,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/FastTrans',
            component: FastTrans
        },
        {
            path: '/RecordList',
            component: RecordList
        },
        {
            path: '/otherRecordList',
            component: otherRecordList
        },
        {
            path: '/RecordDetail',
            name:'RecordDetail',
            component: RecordDetail
        },
        {
            path: '/otherRecordDetail',
            name:'otherRecordDetail',
            component: otherRecordDetail
        },
        {
            path: '/CancelRes',
            component: CancelRes
        },
        {
            path: '/Receipt',
            component: Receipt
        },
        {
            name:'ChooseNetName',
            path: '/ChooseNetName',
            component: ChooseNetName
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (routerSwitch) {
        router.indexRouter = to.path;
        routerSwitch = false;
    }
    next();
});

export default router