// import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 登录方式设置
import Index from './views/index.vue'      //指纹登录
import record from './views/record.vue'		//登录记录查询

let routerSwitch = true;

let router = new Router({
	// mode: 'abstract',
	routes: [
		// 登录方式设置
		{
			path: '/',
			redirect: '/Index'
	    },
        {
			path: '/Index',
		    component: Index
		},
		{
			path: '/record',
		    component: record
		},
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