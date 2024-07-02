// import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//云盾设置界面
import certdownload from './views/certdownload.vue' //证书下载
import certdownloadsuccess from './views/certdownloadsuccess.vue' //云盾证书下载成功
import cloudshieldmanagement from './views/cloudshieldmanagement.vue' //云盾开通结果页
import submitsuccess from './views/submitsuccess.vue' //提交成功
import cloudshieldpasswordsetting from './views/cloudshieldpasswordsetting.vue' //云盾密码设置
import cloudshieldpwdsetsuccessful from './views/cloudshieldpwdsetsuccessful.vue' //云盾密码设置成功****
import cloudshieldpasswordmodify1 from './views/cloudshieldpasswordmodify1.vue' //云盾密码修改
import cloudshieldpasswordmodify2 from './views/cloudshieldpasswordmodify2.vue' //云盾密码修改成功****
import cloudshieldpasswordreset1 from './views/cloudshieldpasswordreset1.vue' //云盾密码重置
import cloudshieldpasswordreset2 from './views/cloudshieldpasswordreset2.vue' //云盾密码重置成功
import message from './views/message.vue' //云盾密码重置成功
// let routerSwitch = true;
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/submitsuccess'
        },
        {
            path: '/cloudshieldmanagement',
            component: cloudshieldmanagement
        },
        {
            path: '/message',
            component: message
        },
        {
            path: '/certdownload',
            component: certdownload
        },
        {
            path: '/certdownloadsuccess',
            component: certdownloadsuccess
        },
        {
            path: '/cloudshieldpasswordsetting',
            component: cloudshieldpasswordsetting
        },
        {
            path: '/cloudshieldpwdsetsuccessful',
            component: cloudshieldpwdsetsuccessful
        },
        {
            path: '/cloudshieldpasswordmodify1',
            component: cloudshieldpasswordmodify1
        },
        {
            path: '/cloudshieldpasswordmodify2',
            component: cloudshieldpasswordmodify2
        },
        {
            path: '/cloudshieldpasswordreset1',
            component: cloudshieldpasswordreset1
        },
        {
            path: '/cloudshieldpasswordreset2',
            component: cloudshieldpasswordreset2
        },
        {
            path: '/submitsuccess',
            component: submitsuccess
        },
    ]
})

// router.beforeEach((to, from, next) => {
//     if (routerSwitch) {
//       router.indexRouter = to.path;
//       routerSwitch = false;
//     }
//     next();
//   });

// export default router