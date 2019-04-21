<template>
    <Card style="width:500px;">
        <p slot="title">
            {{vm.$t('kyc.gyh')}}{{this.username}}{{vm.$t('kyc.fsxtxx')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formItem" :model="formItem" :rules="ruleItem" style="margin:0 20px;">
            <FormItem prop="msg" :label="vm.$t('kyc.qsrxtxx')">
                <Input v-model="formItem.msg" type="textarea" :rows="10" :placeholder="vm.$t('kyc.dhsr')"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" style="width:100px;" @click="sendMessage">{{vm.$t('kyc.fs')}}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import kycAPI from '../../api/kyc';

    export default {
        props: ['userId', 'username', 'type'],
        data () {
            var vm = window.vm;
            return {
                vm: vm,
                formItem: {
                    msg: ''
                },
                ruleItem: {
                    msg: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('kyc.xtxx')}
                    ]
                }
            };
        },
        methods: {
            closeDialog () {
                this.$emit('removeDialog');
            },
            sendMessage () {
                this.$refs.formItem.validate((valid) => {
                    if (valid) {
                        if (this.type === 1) {
                            kycAPI.firstSendSystemMessage({
                                userId: this.userId,
                                msg: this.formItem.msg
                            }, (res) => {
                                this.$Message.success({content: this.vm.$t('kyc.fscg')});
                                this.$emit('removeDialog');
                            }, (msg) => {
                                this.$Message.error({content: msg});
                            });
                        } else if (this.type === 2) {
                            kycAPI.secondSendSystemMessage({
                                userId: this.userId,
                                msg: this.formItem.msg
                            }, (res) => {
                                this.$Message.success({content: this.vm.$t('kyc.fscg')});
                                this.$emit('removeDialog');
                            }, (msg) => {
                                this.$Message.error({content: msg});
                            });
                        } else if (this.type === 3) {
                            kycAPI.manageSendSystemMessage({
                                userId: this.userId,
                                msg: this.formItem.msg
                            }, (res) => {
                                this.$Message.success({content: this.vm.$t('kyc.fscg')});
                                this.$emit('removeDialog');
                            }, (msg) => {
                                this.$Message.error({content: msg});
                            });
                        }

                        // otcApi.sendSystemMessageManage({
                        //     userId: this.userId,
                        //     msg: this.formItem.msg
                        // }, (res) => {
                        //     this.$Message.success({content: '发送成功'})
                        //     this.$emit('removeDialog');
                        // })
                    }
                });
            }
        }
    };
</script>

<style>

</style>
