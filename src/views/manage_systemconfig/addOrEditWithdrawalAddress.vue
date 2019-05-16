<!-- 系统参数 -> 添加特殊账户地址参数设置 -> 添加提币主地址 -->
<template>
    <Card style="width:440px">
        <p slot="title">
            <span>{{isEdit ? vm.$t('system.xgtbzdz') : vm.$t('system.tjtbzdz') }}</span>
            <a class="ivu-icon ivu-icon-close" href="javascript:;" style="float:right;margin-top:3px;color:#1c2438;"
               @click="closeDialog"></a>
        </p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="margin:0 20px;">
            <FormItem :label="vm.$t('common.zllx')"  prop="symbolType">
                <RadioGroup ref="symbolType" v-model="formValidate.symbolType">
                    <Radio label="2">
                        <span>ETH</span>
                    </Radio>
                    <Radio label="1">
                        <span>BTC</span>
                    </Radio>
                    <Radio label="3">
                        <span>OMNI</span>
                    </Radio>
                    <Radio label="4">
                        <span>MBT</span>
                    </Radio>
                    <Radio label="5">
                        <span>EOS</span>
                    </Radio>
                    <Radio label="6">
                        <span>LTC</span>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem :label="vm.$t('common.bz')" prop="symbol">
                <!-- <b v-if="isEdit">{{formValidate.symbol}}</b> -->
                <Input type="text" v-model="formValidate.symbol"></Input>
            </FormItem>
            <FormItem :label="vm.$t('common.yhm')" prop="username">
                <Input type="text" v-model="formValidate.username"></Input>
            </FormItem>
            <FormItem style="line-height:0;text-align:center;">
                <Button type="ghost" style="width:100px;margin-right:50px;" @click="closeDialog">{{vm.$t('common.qx')}}</Button>
                <Button type="primary" style="width:100px;" @click="save">{{vm.$t('common.qd')}}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import system from '../../api/systemparam';

    export default {
        props: ['isEdit', 'symbol', 'username', 'symbolType'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                formValidate: {
                    symbol: this.isEdit ? this.symbol : null,
                    username: this.isEdit ? this.username : null,
                    symbolType: this.isEdit ? this.symbolType.toString() : '1'
                },
                ruleValidate: {
                    symbol: [
                        {required: true, type: 'string', message:  vm.$t('common.qsr')+vm.$t('common.bz'), trigger: 'blur'}
                    ],
                    username: [
                        {required: true, type: 'string', message: vm.$t('common.qsr')+vm.$t('common.yhm'), trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            save () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        if (this.isEdit) {
                            system.updateAdminCoinPools({
                                symbol: this.formValidate.symbol,
                                username: this.formValidate.username,
                                symbolType: Number(this.formValidate.symbolType)
                            }, (msg) => {
                                this.$Message.success({content: this.vm.$t('common.bccg')});
                                this.$emit('okCallback');
                                this.$emit('removeDialog');
                            }, (error) => {
                                this.$Message.error({content: error});
                            });
                        } else {
                            system.addAdminCoinPools({
                                symbol: this.formValidate.symbol,
                                username: this.formValidate.username,
                                symbolType: Number(this.formValidate.symbolType)
                            }, (msg) => {
                                this.$Message.success({content: this.vm.$t('common.bccg')});
                                this.$emit('okCallback');
                                this.$emit('removeDialog');
                            }, (error) => {
                                this.$Message.error({content: error});
                            });
                        }
                    }
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style>
</style>
