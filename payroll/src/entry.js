// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import mixins from './mixins'
import * as filters from './filters'
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
sync(store, router)
Vue.mixin(mixins)
// Vue.filter(filters)
new Vue(Vue.util.extend({ el: '#root', router, store }, App))
// router.push('/')
var indexRouter = weex.config.bundleUrl.match(/\w*Page=(\w*)$/);
if (indexRouter) {
  router.push(indexRouter[1]);
} else {
  router.push('/');
}