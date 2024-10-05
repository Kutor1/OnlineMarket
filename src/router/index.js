// 一级路由配置
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

// 二级路由配置
import Home from '@/views/layout/homeCom.vue'
import Cart from '@/views/layout/cartCom.vue'
import Catagory from '@/views/layout/catagoryCom.vue'
import User from '@/views/layout/userCom.vue'
import Layout from '@/views/layout/indexCom.vue'

// 路由懒加载
// 路由优化，将首页展示之外的路由在进入相应路径时再进行导包加载
// 提高首页加载速度
const Login = () => import('@/views/login/indexCom.vue')
const Search = () => import('@/views/search/indexCom.vue')
const SearchList = () => import('@/views/search/searchList.vue')
const MyOrder = () => import('@/views/myorder/indexCom.vue')
const Pay = () => import('@/views/pay/indexCom.vue')
const Prodetail = () => import('@/views/prodetail/indexCom.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      redirect: '/home',
      component: Layout,
      children: [
        { path: '/home', component: Home },
        { path: '/catagory', component: Catagory },
        { path: '/user', component: User },
        { path: '/cart', component: Cart }
      ]
    },
    { path: '/search', component: Search },
    { path: '/searchlist', component: SearchList },
    { path: '/pay', component: Pay },
    { path: '/myorder', component: MyOrder },
    // 动态路由传参 :id
    { path: '/prodetail/:id', component: Prodetail }
  ]
})

// 所有的路由在真正被访问到之前（解析渲染对应页面前），都会先经过全局前置路由
// 守卫，只有全局前置路由守卫放行，才会到达对应的路由页面
// 1. to 往哪里去， 到哪去的路由信息对象
// 2. from 从哪里来， 从哪来的路由信息对象
// 3. next() 是否放行
// 如果next()调用，就是放行
// next(路径) 拦截到某个路径页面

// 定义一个数组，用来存放所有需要权限访问的路径
const authUrls = ['/pay', '/myorder']

router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  // 查询to.path是否在authUrls中
  if (!authUrls.includes(to.path)) {
    // 非权限页面，放行
    next()
    return
  }

  // 权限页面，通过token判断
  // 把token在vuex中封装到getters中
  const token = store.getters.token
  console.log(token)
  if (token) {
    next()
  } else {
    next('/login')
  }
})
export default router
