// import Vue from 'vue'
import Router from 'vue-router';
Vue.use(Router);

//协议
import warmPrompt from "./views/warmPrompt";
import Agreement from './views/Agreement';
// import ensureAgreement from './views/ensureAgreement';
import privacyStatement from "./views/privacyStatement";
//引导页面
import Guide from './views/guide';
//闪屏页面
import Splash from './views/splash';

//加载器
import Launcher from './views/launcher';

//标准版首页
import Tab_home from './views/tab_home.vue';
//主题首页
import recentAmap from './views/recentAmap';
//我的
import Tab_user from './views/tab_user';
//工作台
import Tab_bench from './views/tab_bench';
//简约版首页
import Tab_business from './views/tab_business';
//简约版待审核
import checkSimple from './views/checkSimple';

//七天转账
import sevenTransfer from './views/sevenTransfer';

//主题设置
import ThemeSetting from './views/themeSetting';

//全部菜单
import Allmenu from './views/allmenu';

//搜索
import Search from './views/search.vue';

//工作台

import  Check from './views/workspace/check';
import  CheckResult from './views/workspace/checkResult';
import  Workdetails from './views/workspace/details';
import  hnzzdetail from './views/workspace/hnzzdetail';//转账详情
import  yundunOpen from './views/workspace/yundunOpen';//云盾开通
import  yundunResetPsw from './views/workspace/yundunResetPsw';//云盾重置密码
import  transferCanceldetail from './views/workspace/transferCanceldetail';//转账撤销
import  dfgzdetail from './views/workspace/dfgzdetail';//代发工资详情
import  Tspjdetail from './views/workspace/tspjdetail';//提示票据详情
import  Dzdetail from './views/workspace/dzdetail';//对账详情
import  Bszrdetail from './views/workspace/bszrdetail';//背书转让详情
import  Ssjhdetail from './views/workspace/ssjhdetail';//实时结汇详情
import  Txdetail from './views/workspace/txdetail';//贴现详情
import  Pjqsdetail from './views/workspace/pjqsdetail';//票据签收详情
import  Yygmzpdetail from './views/workspace/yygmzpdetail';//预约购买支票详情
import  payeeDetail from './views/workspace/payeeDetail';//收款方明细

import  zppreserve from './views/workspace/zppreserve';//支票预约维护

import  AboutApp from './views/aboutApp/about';
import  ContactUs from './views/aboutApp/contactUs';

//web外部页面
import web from './views/web';

import getExcel from './views/getExcel';

let routerSwitch = true;

let router = new Router({
  // mode: 'abstract',
  routes: [
    {
      path: "/getExcel",
      component: getExcel
    },
    {
      path: "/zppreserve",
      component: zppreserve
    },
    {
      path: "/Guide",
      component: Guide
    },
    {
      path: "/Splash",
      component: Splash
    },
    {
      path: "/Launcher",
      component: Launcher
    },
    {
      path: "/Tab_home",
      component: Tab_home
    },
    {
      path: "/recentAmap",
      component: recentAmap,
      name: "recentAmap"
    },
    {
      path: "/Tab_user",
      component: Tab_user
    },
    {
      path: "/Tab_bench",
      component: Tab_bench
    },
    {
      path: "/Tab_business",
      component: Tab_business
    },
    {
      path: "/ThemeSetting",
      component: ThemeSetting
    },
    {
      path: "/Allmenu",
      component: Allmenu
    },
    {
      path: "/Search",
      component: Search
    },
    {
      path: "/Workdetails",
      name: "Workdetails",
      component: Workdetails
    },
    {
      path: "/hnzzdetail",
      component: hnzzdetail
    },
    {
      path: "/yundunOpen",
      component: yundunOpen
    },
    {
      path: "/yundunResetPsw",
      component: yundunResetPsw
    },
    {
      path: "/transferCanceldetail",
      component: transferCanceldetail
    },
    {
      path: "/dfgzdetail",
      component: dfgzdetail
    },
    {
      path: "/Check",
      name: "Check",
      component: Check
    },
    {
      path: "/CheckResult",
      component: CheckResult
    },
    {
      path: "/AboutApp",
      name: "AboutApp",
      component: AboutApp
    },
    {
      path: "/ContactUs",
      name: "ContactUs",
      component: ContactUs
    },
    {
      path: "/web",
      component: web
    },
    {
      path: "/Agreement",
      component: Agreement
    },
    {
      path: "/Tspjdetail",
      component: Tspjdetail
    },
    {
      path: "/Dzdetail",
      component: Dzdetail
    },
    {
      path: "/Bszrdetail",
      component: Bszrdetail
    },
    {
      path: "/Ssjhdetail",
      component: Ssjhdetail
    },
    {
      path: "/Txdetail",
      component: Txdetail
    },
    {
      path: "/Pjqsdetail",
      component: Pjqsdetail
    },
    {
      path: "/Yygmzpdetail",
      component: Yygmzpdetail
    },
    {
      path: "/payeeDetail",
      component: payeeDetail
    },
    {
      path: "/checkSimple",
      component: checkSimple
    },
    {
      path: "/sevenTransfer",
      component: sevenTransfer
    },
    {
      path: "/privacyStatement",
      component: privacyStatement
    },
    {
      path: "/warmPrompt",
      component: warmPrompt
    },
    {
      path: "/",
      redirect: "/warmPrompt" //checkSimple
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (routerSwitch) {
    router.indexRouter = to.path;
    routerSwitch = false;
  }
  next();
});

export default router;
