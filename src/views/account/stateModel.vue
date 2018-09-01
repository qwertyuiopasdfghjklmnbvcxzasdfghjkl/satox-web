<template>
    <Modal v-model="show" title="账号状态设置" @on-ok="stateInfo">
        <RadioGroup v-model="state1">
            <Radio label="0">冻结</Radio>
            <Radio label="1">正常</Radio>
        </RadioGroup>
    </Modal>
</template>

<script>
import util from '../../libs/util';
import qs from 'qs';
export default {
  props: ['value', 'userId' , 'state'],
  data () {
    return {
      show: this.value,
      state1: null
    }
  },
  watch: {
    value (bool) {
      this.show = bool
    },
    show (bool) {
      this.$emit('input', bool)
    },
    state () {
      this.state1 = this.state
    }
  },
  methods: {
    stateInfo () {
      util.ajax.put(`api/v1/manage/otc/customer/state/${this.userId}`, qs.stringify({
        state: this.state1
      })).then((res)=> {
         if (res.data && res.data.rst === 1) {
            this.$Message.success(res.data.msg);
            this.$emit('customerList');
          } else if (res.data && res.data.rst !== 1) {
            var msgs = res.data.msg;
            this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
          } else {
            this.$Message.error('其他错误');
            window.console.log(error);
          }
      })
    }
  }
}
</script>

<style>

</style>
