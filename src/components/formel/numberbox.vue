<template>
    <input ref="input" type="text" :value="value" @input="updateValue"/>
</template>

<script>
import utils from '@/assets/js/utils'
const regs = [
  /[0-9]+\.{0,1}[0-9]{0,0}/,
  /[0-9]+\.{0,1}[0-9]{0,1}/,
  /[0-9]+\.{0,1}[0-9]{0,2}/,
  /[0-9]+\.{0,1}[0-9]{0,3}/,
  /[0-9]+\.{0,1}[0-9]{0,4}/,
  /[0-9]+\.{0,1}[0-9]{0,5}/,
  /[0-9]+\.{0,1}[0-9]{0,6}/,
  /[0-9]+\.{0,1}[0-9]{0,7}/,
  /[0-9]+\.{0,1}[0-9]{0,8}/,
  /[0-9]+\.{0,1}[0-9]{0,9}/,
  /[0-9]+\.{0,1}[0-9]{0,10}/
]
export default {
  props: {
    value: null,
    accuracy: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      reg: regs[this.accuracy] || regs[0]
    }
  },
  watch: {
    accuracy (val) {
      this.reg = regs[val] || regs[0]
    }
  },
  methods: {
    updateValue () {
      let newPos = utils.getCursortPosition(this.$refs.input)
      var newValue = this.$refs.input.value
      var matches = newValue.match(this.reg)
      newValue = matches ? matches[0] : ''
      this.$refs.input.value = newValue
      utils.setCursortPosition(this.$refs.input, newPos)
      this.$emit('input', newValue)
    }
  }
}
</script>

