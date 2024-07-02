// import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
//代发工资首页
import index from './views/index.vue'
// 代发
import chooseAccount from './views/payrollCredit/payroll/chooseAccount.vue'
// 代发录入
import payrollEntry from './views/payrollCredit/payroll/payrollEntry.vue'
// 编辑收款人
import editPayee1 from './views/payrollCredit/payroll/editPayee1.vue'
// 新建收款人
import newPayee from './views/payrollCredit/payroll/newPayee.vue'
// 选择付款方账户
import selectpaymentAccount from './views/payrollCredit/payroll/selectpaymentAccount.vue'
// 代发工资确认
import payrollCreditConfirm from './views/payrollCredit/payroll/payrollCreditConfirm.vue'
// 收款方明细
import payeeDetail from './views/payrollCredit/payroll/payeeDetail.vue'
// 分组详情
import groupsDetail from './views/payrollCredit/payroll/groupsDetail.vue'
// 代发结果提交成功
import submittedSuccessful from './views/payrollCredit/payroll/payrollResult/submittedSuccessful.vue'
// 收款人选择
import payeeSelete from './views/payrollCredit/payroll/payeeSelete.vue'
import myPayroll from './views/payrollCredit/payroll/myPayroll.vue'
// 代发名册
import undertakesRegister from './views/payrollCredit/payroll/undertakesRegister.vue'
// 代发名册首页
import FullPayee from './views/payrollCredit/payrollRegister/FullPayee.vue'
import myPayrollRegister from './views/payrollCredit/payrollRegister/myPayrollRegister.vue'
// 已选择X项
import selectPage from './views/payrollCredit/payrollRegister/selectPage.vue'
// 新增收款人
import addPayee1 from './views/payrollCredit/payrollRegister/addPayee1.vue'
import addPayee2 from './views/payrollCredit/payrollRegister/addPayee2.vue'
import addPayee3 from './views/payrollCredit/payrollRegister/addPayee3.vue'
// 代发名册分组
import group from './views/payrollCredit/payrollRegister/group.vue'
// 分组详情
import groupDetail1 from './views/payrollCredit/payrollRegister/groupDetail1.vue'
// 分组管理
import groupManagement1 from './views/payrollCredit/payrollRegister/groupManagement1.vue'
// 添加组员
import addMembers2 from './views/payrollCredit/payrollRegister/addMembers2.vue'

import addMembers1 from './views/payrollCredit/payrollRegister/addMembers1.vue'
// 新建分组
import newGroup from './views/payrollCredit/payrollRegister/newGroup.vue'
// 代发工资查询主页
import payrollWageQueryHome from './views/payrollCredit/payrollWageQuery/payrollWageQueryHome.vue'
// 代发工资 按批次查询
import queryBatchNum from './views/payrollCredit/payrollWageQuery/queryBatchNum.vue'
// 代发工资 按批次查询
import payrollWageDetail from './views/payrollCredit/payrollWageQuery/payrollWageDetail.vue'
// 收款方明细
import payeeDetail2 from './views/payrollCredit/payrollWageQuery/payeeDetail2.vue'
import myquery from './views/payrollCredit/payrollWageQuery/myquery.vue'
let routerSwitch = true;
let router = new Router({
    // mode: 'abstract',
    routes: [
        {
            path: '/index',
            component: index
        },
        // 选择账户
        {
            path: '/chooseAccount',
            component: chooseAccount
        },
        // 代发录入
        {
            path: '/payrollEntry',
            component: payrollEntry
        },
        // 收款人选择
        {
            path: '/payeeSelete',
            component: payeeSelete
        },
        // 编辑收款人
        {
            path: '/editPayee1',
            component: editPayee1
        },
        // 代发名册
        {
            path: '/undertakesRegister',
            component: undertakesRegister
        },
        // 选择付款方账户
        {
            path: '/selectpaymentAccount',
            component: selectpaymentAccount
        },
        // 代发工资确认
        {
            path: '/payrollCreditConfirm',
            component: payrollCreditConfirm
        },
        // 代发结果提交成功
        {
            path: '/submittedSuccessful',
            component: submittedSuccessful
        },

        // 收款方明细
        {
            path: '/payeeDetail',
            component: payeeDetail
        },
        // 新增收款人
        {
            path: '/newPayee',
            component: newPayee
        },
        // 分组详情
        {
            path: '/groupsDetail',
            component: groupsDetail
        },
        // 代发名册首页
        {
            path: '/FullPayee',
            component: FullPayee
        },
        // 已选择X项
        {
            path: '/selectPage',
            component: selectPage
        },
        // 新增收款人
        {
            path: '/addPayee1',
            component: addPayee1
        },
        {
            path: '/addPayee2',
            component: addPayee2
        },
        {
            path: '/addPayee3',
            component: addPayee3
        },
        //代发名册分组
        {
            path: '/group',
            component: group
        },
        // 分组详情
        {
            path: '/groupDetail1',
            component: groupDetail1
        },
        // 分组管理
        {
            path: '/groupManagement1',
            component: groupManagement1
        },
        // 添加组员
        {
            path: '/addMembers1',
            component: addMembers1
        },
        {
            path: '/addMembers2',
            component: addMembers2
        },
        //新的分组
        {
            path: '/newGroup',
            component: newGroup
        },
        // 代发工资查询主页
        {
            path: '/payrollWageQueryHome',
            component: payrollWageQueryHome
        },
        // 按批次号查询
        {
            path: '/queryBatchNum',
            component: queryBatchNum
        },
        // 代发工资详情
        {
            path: '/payrollWageDetail',
            component: payrollWageDetail
        },
        // 收款方明细
        {
            path: '/payeeDetail2',
            component: payeeDetail2
        },
        {
            path: '/myPayrollRegister',
            component: myPayrollRegister
        },
        {
            path: '/myquery',
            component: myquery
        },
        {
            path: '/myPayroll',
            component: myPayroll
        },
        {
            path: '/',
            redirect: 'index'
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