<template>
  <input ref="input" type="text" :value="value" @keydown="keyDown" @input="inputValue"/>
</template>

<script>
import utils from '@/assets/js/utils'
export default {
  props: {
    value: null,
    size: {
      type: Number,
      default: 21
    },
    accuracy: {
      type: Number,
      default: 8
    }
  },
  data () {
    return {
      oldPos: null,
      oldValue: ''
    }
  },
  watch: {
    value (newVal) {
      this.$refs.input.value = newVal
    }
  },
  methods: {
    keyDown () {
      this.oldPos = utils.getCursortPosition(this.$refs.input)
      this.oldValue = this.$refs.input.value
    },
    inputValue () {
      let newPos = utils.getCursortPosition(this.$refs.input)
      let newVal = this.$refs.input.value
      let regAccuracy = new RegExp(`^-?[0-9]{0,}\\.{0,1}[0-9]{0,${this.accuracy}}$`)
      if (!regAccuracy.test(newVal) || newVal.length > this.size) {
        newVal = this.oldValue
        newPos = this.oldPos
      }
      this.$refs.input.value = newVal
      utils.setCursortPosition(this.$refs.input, newPos)
      this.$emit('input', newVal)
    }
  }
}
</script>
