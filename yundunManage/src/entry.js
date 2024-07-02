// import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import mixins from './mixins'

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// register global mixins.
Vue.mixin(mixins)

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.

new Vue(Vue.util.extend({ el: '#root', router, store }, App))
// let path = weex.config.bundleUrl;
// if(path.indexOf("?") != -1){
//   router.push('/'+path.split('=')[1]);
// }else{
//   router.push('/');
// }
// router.push('/')

var indexRouter = weex.config.bundleUrl.match(/\w*Page=(\w*)$/);
if (indexRouter) {
  router.push(indexRouter[1]);
} else {
  router.push('/');
}