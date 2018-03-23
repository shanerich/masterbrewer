import Vue from 'vue'
import VueRouter from 'vue-router'
import LightBootstrap from './light-bootstrap-main'
// Plugins
import App from './App.vue'
import './util/firebase'
import VueFire from 'vuefire'

// firebase auth ref
import { auth } from './util/firebase'

// router setup
import routes from './routes/routes'
// vuex store setup
import { store } from './store/index'
// plugin setup
Vue.use(VueRouter)
Vue.use(LightBootstrap)
Vue.use(VueFire)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  let currentUser = auth.currentUser
  let requiresAuth = to.matched.some(record => 
    record.meta.requiresAuth)

  if (requiresAuth && !currentUser) {
    next('Login')
  } else if (requiresAuth && currentUser) {
    next() 
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
})

