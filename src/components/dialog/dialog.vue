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
  computed: {
    modelStyle () {
      let style = {}
      this.model && (style['background-color'] = 'rgba(0, 0, 0, 0.5)')
      return style
    }
  },
  created () {
    this.$nextTick(() => {
      this.component && this.component.$el && this.$refs.dialog.appendChild(this.component.$el)
    })
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
.koall-dialog{display:flex;justify-content:center;align-items:center;position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;}
</style>

