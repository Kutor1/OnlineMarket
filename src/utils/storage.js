// 本地存取模块，以应对vuex的持久化处理（防止刷新丢失数据）

// 通用键名
const INFO_KEY = 'hm_shopping_info'
const HISTORY_KEY = 'history_key'

// 获取个人信息
export const getInfo = () => {
  const defaultObj = { token: '', userId: '' }
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : defaultObj
}

// 设置个人信息
export const setInfo = (obj) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(obj))
}

// 移除个人信息
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 获取搜索历史
export const getHistoryList = () => {
  const res = localStorage.getItem(HISTORY_KEY)
  return res ? JSON.parse(res) : [] // 默认无搜索历史
}

// 设置搜索历史
export const setHistoryList = (arr) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr))
}
