<template>
  <div :id="id" ref="dialog" class="koall-dialog" :style="modelStyle">
  </div>
</template>

<script>
export default {
  props: {
    id: null,
    model: {
      type: Boolean,
      default: true
    },
    component: null
  },
  created () {
    this.$nextTick(() => {
      this.component && this.component.$el && this.$refs.dialog.appendChild(this.component.$el)
    })
  },
  computed: {
    modelStyle () {
      let style = {}
      this.model && (style['background-color'] = 'rgba(0, 0, 0, 0.5)')
      return style
    }
  },
  methods: {
    removeDialog () {
      if (!this.$refs.dialog.parentNode) {
        return
      }
      this.component.$destroy()
      let dialog = this.$refs.dialog
      this.$destroy()
      document.body.removeChild(dialog)
    }
  }
}
</script>

<style scoped>
.koall-dialog{
  width:100%;height:100%;z-index:9999;position:fixed;top:0;left:0;
  display:flex;justify-content:center;align-items:center;
}
</style>

