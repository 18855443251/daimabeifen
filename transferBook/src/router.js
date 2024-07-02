// import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//加载器
import historyTransfer from './views/historyTransfer.vue'
import edidalis from './views/edidalis.vue'
import details from './views/details.vue'
import addtransfer from './views/addtransfer.vue'
import detailMes from './views/detailMes.vue'
// import demo from './views/demo.vue'
export default new Router({
    // mode: 'abstract', 
    routes: [
        // {
        //     path: '/demo',
        //     component: demo
        // }, 
        {
            path: '/detailMes',
            component: detailMes
        }, 
        {
            path: '/addtransfer',
            component: addtransfer
        }, 
        {
            path: '/details',
            component: details
        },  
        {
            path: '/edidalis',
            component: edidalis
        },       
        {
            path: '/historyTransfer',
            component: historyTransfer
        },
        {
            path: '/',
            redirect: '/historyTransfer'
        }
    ]
})