<template>
  <div class="search">
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />

    <van-search v-model="search" show-action placeholder="请输入搜索关键词" clearable>
      <template #action>
        <div @click="goSearch(search)">搜索</div>
      </template>
    </van-search>

    <!-- 搜索历史 -->
    <div class="search-history" v-if="histroy.length > 0">
      <div class="title">
        <span >最近搜索</span>
        <van-icon @click="clearHistory()" name="delete-o" size="16" />
      </div>
      <div class="list">
        <div class="list-item" v-for="item in histroy" :key="item" @click="goSearch(item)">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHistoryList, setHistoryList } from '@/utils/storage.js'
export default {
  name: 'SearchIndex',
  data () {
    return {
      search: '', // 搜索框内容
      histroy: getHistoryList() // 历史记录
    }
  },
  methods: {
    goSearch (key) {
      // console.log(item)
      const index = this.histroy.indexOf(key)
      if (index !== -1) {
        // 存在相同的项，将原有关键字删除
        // splice( 从哪个开始，删除几个， 项1，项2)
        this.histroy.splice(index, 1)
      }
      // 将搜索内容前置
      this.histroy.unshift(key)
      //
      setHistoryList(this.histroy)

      // 跳转到搜索列表页, 动态路由传参
      this.$router.push(`/searchlist?search=${key}`)

      // 搜索后清楚搜索框内容
      this.search = ''
    },
    clearHistory () {
      this.histroy = []
      setHistoryList([])
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  .searchBtn {
    background-color: #fa2209;
    color: #fff;
  }
  ::v-deep .van-search__action {
    background-color: #c21401;
    color: #fff;
    padding: 0 20px;
    border-radius: 0 5px 5px 0;
    margin-right: 10px;
  }
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
  }
  .list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 10px;
    gap: 5%;
  }
  .list-item {
    width: 30%;
    text-align: center;
    padding: 7px;
    line-height: 15px;
    border-radius: 50px;
    background: #fff;
    font-size: 13px;
    border: 1px solid #efefef;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }
}
</style>
