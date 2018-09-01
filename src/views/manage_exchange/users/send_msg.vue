<template>
    <Card class="send_msg" style="width:500px;">
      <p slot="title">
        发送消息
        <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
      </p>
      <span >编辑消息内容</span>
      <Input v-model="value5" type="textarea" placeholder="输入内容"></Input>
      <Button type="ghost" @click="closeDialog">取消</Button>
      <Button type="primary" @click="send_msg">发送</Button>
    </Card>
</template>
<script>
import currenyApi from '../../../api/currency'
    export default {
        props: ['userId'],
        data () {
          return {
            value5: ''
          }
        },
        methods: {
          closeDialog () {
             this.$emit('removeDialog')
          },
          send_msg() {
            currenyApi.insertUserMessage(this.userId, this.value5, (res) => {
              this.$Message.success({content: '发送成功'})
              this.$emit('removeDialog')
            }, (msg) => {
               this.$Message.error({content: msg})
            })
          }
        }
    }
</script>

<style lang="less">
.send_msg{
    .cion{text-align: right;font-size: 14px;cursor: pointer;margin-right: 10px;margin-top: 5px;}
    .title{font-size: 14px;font-weight: bold;margin-left: 8px;text-align: left}
    .ivu-input-wrapper{text-align: center;width: 96%;}
    span{float: left;padding:6px 0px; }
    textarea.ivu-input{margin-left: -10px;}
    [type=reset], [type=submit], button, html [type=button]{padding: 0px 10px;text-align: center;margin-top: 20px;margin-right: 10px;}
}
</style>
