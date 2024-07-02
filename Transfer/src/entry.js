import App from './App.vue'
import router from './router'
import store from './store'
import { sync } from 'vuex-router-sync'
import * as filters from './filters'
import mixins from './mixins'
sync(store, router)

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
Vue.mixin(mixins)
// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.

new Vue(Vue.util.extend({ el: '#root', router, store }, App))
// router.push('/')
var indexRouter = weex.config.bundleUrl.match(/\w*Page=(\w*)$/);
if (indexRouter) {
  router.push(indexRouter[1]);
} else {
  router.push('/');
}