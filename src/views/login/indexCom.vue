<template>
  <div class="login">
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input class="inp" v-model="mobile" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input class="inp" v-model="picCode" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img  v-if="picUrl" :src="picUrl" alt="" @click="getThePicCode">
        </div>
        <div class="form-item">
          <input class="inp" v-model="msgCode" maxlength="6" placeholder="请输入短信验证码" type="text">
          <button @click="getTheCode">{{ totalSecond === second ? '发送验证码' : second + '秒后重新发送'}}</button>
        </div>
      </div>

      <div class="login-btn" @click="loginTo">登录</div>
    </div>
  </div>
</template>

<script>
import { getMsgCode, getPicCode, codeLogin } from '@/api/login.js'
import { Toast } from 'vant'
export default {
  name: 'LoginPage',
  data () {
    return {
      picCode: '', // 用户输入的图形验证码
      picKey: '',
      picUrl: '',
      totalSecond: 60,
      second: 60,
      timer: null, // 定时器
      mobile: null, // 手机号
      msgCode: '' // 短信验证码
    }
  },

  async created () {
    this.getThePicCode()
    // const res = await request.get('/captcha/image')
    // this.picCode = res.data.base64
    // this.picKey = res.data.key
    // console.log(res)
  },

  methods: {
    async getThePicCode () {
      const { data: { base64, key } } = await getPicCode()
      this.picUrl = base64
      this.picKey = key
    },

    // 获取短信验证码
    async getTheCode () {
      if (!this.validCheck()) {
        return
      }

      // 判断计时器状态，保证second和totalSecond相同
      if (!this.timer && this.second === this.totalSecond) {
        // 发送验证码请求
        // await必须接受到正确的status
        await getMsgCode(this.picCode, this.picKey, this.mobile)
        Toast('短信发送成功')
        // 开启倒计时，寄存计时器
        this.timer = setInterval(() => {
          this.second--
          if (this.second <= 1) {
            clearInterval(this.timer)
            this.timer = null
            this.second = this.totalSecond // 倒计时归位
          }
        }, 1000)
      }
    },
    // 发送验证码前，对图形验证码和用户手机号进行校验
    validCheck () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        Toast('请输入正确的手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        Toast('请输入正确的验证码')
        return false
      }
      return true
    },

    // 登录
    async loginTo () {
      // 手机号和图形验证码校验
      if (!this.validCheck()) {
        return
      }
      if (!/^\d{6}$/.test(this.msgCode)) {
        this.$toast('请输入正确的手机验证码')
        return
      }
      const res = await codeLogin(this.mobile, this.msgCode)
      this.$store.commit('user/userInfo', res.data)
      console.log(res)
      // 返回主页
      this.$router.push('/')
      Toast('登录成功')

      // 对当前的地址进行判断是否存在回跳地址
      // 如果存在则回退页面
      // 如果不存在则返回首页
      const url = this.$route.query.backUrl || '/'
      this.$router.replace(url)
    }
  },

  // 钩子函数， 在离开当前页面后清楚计时器，节省资源
  destroyed () {
    clearInterval(this.timer)
  }

}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
