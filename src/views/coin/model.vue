<template>
    <Modal v-model="show" title="新增货币">
        <Form label-position="left" :label-width="100">
            <FormItem label="币种全称">
                <Input></Input>
            </FormItem>
            <FormItem label="币种缩写">
                <Input></Input>
            </FormItem>
            <FormItem label="LOGO">
                <Upload action="//jsonplaceholder.typicode.com/posts/">
                    <Button type="ghost" icon="ios-cloud-upload-outline">Upload files</Button>
                </Upload>
            </FormItem>
        </Form>
        <Form label-position="top">
            <FormItem label="生产钱包地址">
                <Input></Input>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      show: this.value
    }
  },
  watch: {
    value (bool) {
      this.show = bool
    },
    show (bool) {
      this.$emit('input', bool)
    }
  }
}
</script>

<style>

</style>
