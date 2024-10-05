<template>
    <div class="count-box">
        <button @click="handleSub" class="minus">-</button>
        <input class="inp" @change="handleChange" :value="value" type="text">
        <button @click="handleAdd" class="add">+</button>
    </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  methods: {
    handleAdd () {
      this.$emit('input', this.value + 1)
    },
    handleSub () {
      if (this.value <= 1) {
        return
      }
      this.$emit('input', this.value - 1)
    },
    handleChange (e) {
      const num = +e.target.value // 转数字处理

      // 对输入的商品数量进行判断处理，非正数则回退
      if (isNaN(num) || num < 1) {
        e.target.value = this.value
        return
      }

      this.$emit('input', num)
    }
  }
}
</script>

<style lang="less" scoped>
.count-box {
  width: 110px;
  display: flex;
  .add, .minus {
    width: 30px;
    height: 30px;
    outline: none;
    border: none;
    background-color: #efefef;
  }
  .inp {
    width: 40px;
    height: 30px;
    outline: none;
    border: none;
    margin: 0 5px;
    background-color: #efefef;
    text-align: center;
  }
}
</style>
