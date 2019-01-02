<template>
  <div class="page">
    <ol class="page-list">
      <li class="page-item prev" :class="{disabled: isDisabledPrev}" @click="prev">{{$t('otc_public.otc_Previous')}}<!--上一页--></li>
      <li class="page-item" :class="{active: item === iPageIndex, more: item === '...'}" v-for="(item, index) in finalTotalPage" :key="index" @click="jump(item)">{{item}}</li>
      <li class="page-item next" :class="{disabled: isDisabledNext}" @click="next">{{$t('otc_public.otc_Next')}}<!--下一页--></li>
    </ol>
  </div>
</template>

<script>
export default {
  props: {
    pageIndex: { // 当前页
      type: Number,
      default: 1
    },
    pageSize: { // 每页显示数量
      type: Number,
      default: 10
    },
    total: { // 总数量
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      iPageIndex: this.pageIndex,
      iPageSize: this.pageSize,
      iTotal: this.total
    }
  },
  computed: {
    totalPage () { // 总页数
      return Math.max(1, Math.ceil(this.iTotal / this.iPageSize))
    },
    finalTotalPage () {
      let i = this.iPageIndex
      let t = this.totalPage

      if (t < 8) {
        return this.totalPage
      } else {
        if (i < 5) {
          return [1, 2, 3, 4, 5, 6, '...', t]
        } else if (i > t - 4) {
          return [1, '...', t - 5, t - 4, t - 3, t - 2, t - 1, t]
        } else {
          return [1, '...', i - 2, i - 1, i, i + 1, i + 2, '...', t]
        }
      }
    },
    isDisabledPrev () {
      return this.iPageIndex === 1
    },
    isDisabledNext () {
      return this.iPageIndex === this.totalPage
    }
  },
  watch: {
    pageIndex (newVal) {
      this.iPageIndex = newVal
    },
    pageSize (newVal) {
      this.iPageSize = newVal
    },
    total (newVal) {
      this.iTotal = newVal
    },
    iPageIndex (newVal) {
      this.$emit('changePageIndex', newVal)
    }
  },
  methods: {
    prev () { // 上一页
      this.iPageIndex = Math.max(1, this.iPageIndex - 1)
    },
    next () { // 下一页
      this.iPageIndex = Math.min(this.totalPage, this.iPageIndex + 1)
    },
    jump (item) { // 跳转到指定页
      if (item === '...') {
        return false
      } else {
        this.iPageIndex = item
      }
    }
  }
}
</script>

<style scoped>
.page-list{padding-top: 24px;padding-bottom: 24px;line-height: 0;font-size: 0;text-align: center;}
.page-item{display: inline-block;height: 20px;line-height: 20px;padding-left: 4px;padding-right: 4px;font-weight: bold;font-size: 16px;color: #959eb7;cursor: pointer;}
.page-item:hover{color: #3283FF;}
.page-item.more{cursor: default;}
.page-item.more:hover{color: #959eb7;}
.page-item.prev{padding-left: 0;padding-right: 0;margin-right: 20px;color: #3283FF;}
.page-item.next{padding-left: 0;padding-right: 0;margin-left: 20px;color: #3283FF;}
.page-item.active{color: #3283FF;}
.page-item.prev:hover,
.page-item.next:hover,
.page-item.active:hover{color: #3283FF;}
.page-item.disabled{color: #959eb7;cursor: not-allowed;}
.page-item.disabled:hover{color: #959eb7;}
</style>

