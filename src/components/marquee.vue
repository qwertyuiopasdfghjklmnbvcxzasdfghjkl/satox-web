<template>
  <div ref="marquee" class="marquee" @mouseover="mouseover" @mouseout="mouseout">
      <div ref="first" class="marquee-first">
          <slot></slot>
      </div>
      <div ref="second" class="marquee-second">
      </div>
  </div>
</template>

<script>
export default {
  props: ['direction', 'speed'],
  data () {
    return {
      defaultSpeed: 30,
      interval: null,
      Marquee: null
    }
  },
  created () {
    this.$nextTick(() => {
      this.initMarquee()
    })
  },
  methods: {
    initMarquee () {
      // 使用div时，请保证colee_left2与colee_left1是在同一行上.
      var m = this.$refs.marquee
      var first = this.$refs.first
      var second = this.$refs.second
      if (m.scrollWidth <= m.clientWidth) {
        return
      }
      second.innerHTML = first.innerHTML
      function Marquee () {
        if (second.offsetWidth - m.scrollLeft <= 0) { // offsetWidth 是对象的可见宽度
          m.scrollLeft -= first.offsetWidth // scrollWidth 是对象的实际内容的宽，不包边线宽度
        } else {
          m.scrollLeft++
        }
      }
      this.Marquee = Marquee
      this.startMarquee()
    },
    startMarquee () {
      this.interval = setInterval(this.Marquee, this.speed || this.defaultSpeed)
    },
    endMarquee () {
      clearInterval(this.interval)
    },
    mouseover () {
      this.endMarquee()
    },
    mouseout () {
      this.startMarquee()
    }
  }
}
</script>

<style scoped>
.marquee{width:500px;height:100%;overflow:hidden;display:flex;}
.marquee.left{}
</style>
