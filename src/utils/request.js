// 创建axios实例，将来对创建出来的实例，进行自定义配置
// 不会污染原始的axios实例
import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store/index.js'
const instance = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api/',
  timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
// 在发送请求之前做些什么
// 开启loading，同时禁止背景点击（节流，防止多次点击触发）
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    duration: 0 // 加载不会自动消失
  })

  // 只要有token，就在请求时携带，便于请求需要授权的接口
  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  const res = response.data
  if (res.status !== 200) {
    // 错误提示，Toast是单例模式，只能同时存在一个Toast提示
    Toast(res.message)
    // 抛出Promise错误信息
    return Promise.reject(res.message)
  } else {
    // 正确情况，直接走业务逻辑
    Toast.clear()
  }
  Toast.clear()
  // 对响应数据做点什么
  return res
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default instance
