import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/LoginView.vue'
import Home from '../views/HomeView'
import User from '../views/user/UserView'
import Welcome from '../views/WelcomeView'
import SoltTest from '../components/TT1'
import Perm from '../views/user/PermView'
import Role from '../views/user/RoleView'

Vue.use(VueRouter)

// 路由表
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/users', component: User },
      { path: '/welcome', component: Welcome },
      { path: '/users/perms', component: Perm },
      { path: '/users/roles', component: Role },
      { path: '/TS', component: SoltTest }
    ]
  }
// {
//   path: '/',
//   name: 'home',
//   component: HomeView
// },
// {
//   path: '/about',
//   name: 'about',
//   // route level code-splitting
//   // this generates a separate chunk (about.[hash].js) for this route
//   // which is lazy-loaded when the route is visited.
//   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
// }
]

const router = new VueRouter({
  routes
})

// GOOD
router.beforeEach((to, from, next) => {
  // if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // else next()
  // console.log(to)
  // console.log(from)
  if (to.path === '/login') {
    next()
  } else {
    // 检查token
    const token = window.localStorage.getItem('token')
    console.log(token)
    if (token) {
      // 拿到token，并不发送到后台去验证,只不过不验证看到的是不过就是前端生成的页面，但是没有数据
      next()
    } else {
      next('/login')
    }
  }
})

export default router
