<template>
    <Card style="width:500px;">
        <p slot="title">
            给用户{{this.username}}发送系统消息
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formItem" :model="formItem" :rules="ruleItem" style="margin:0 20px;">
            <FormItem prop="msg" label="请输入系统消息">
                <Input v-model="formItem.msg" type="textarea" :rows="10" placeholder="多行输入"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" style="width:100px;" @click="sendMessage">发送</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import otcApi from '../../../api/otc'
export default {
    props: ['userId', 'username'],
    data () {
        return {
            formItem: {
                msg: ''
            },
            ruleItem: {
                msg: [
                    {required: true, message: '请输入系统消息'}
                ]
            }
        }
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog');
        },
        sendMessage () {
            this.$refs.formItem.validate((valid) => {
                if (valid) {
                    otcApi.sendSystemMessageManage({
                        userId: this.userId,
                        msg: this.formItem.msg
                    }, (res) => {
                        this.$Message.success({content: '发送成功'})
                        this.$emit('removeDialog');
                    })
                 }
            })
        }
    }
}
</script>

<style>

</style>
