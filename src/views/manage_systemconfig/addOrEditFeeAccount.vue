<!-- 系统参数 -> 添加特殊账户地址参数设置 -> 添加手续费账户 -->
<template>
    <Card style="width:440px">
        <p slot="title">
            <span>{{isEdit ? vm.$t('system.xgsxfzh') : vm.$t('system.tjsxfzh')}}</span>
            <a class="ivu-icon ivu-icon-close" href="javascript:;" style="float:right;margin-top:3px;color:#1c2438;"
               @click="closeDialog"></a>
        </p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="margin:0 20px;">
            <FormItem :label="vm.$t('common.zllx')" prop="symbolType" v-if="!isEdit">
                <RadioGroup ref="symbolType" v-model="formValidate.symbolType">
                    <Radio v-for="item in  symbolTypeList" :label="item.code">
                        <span>{{item.name}}</span>
                    </Radio>
                </RadioGroup>
            </FormItem>
            <FormItem :label="vm.$t('common.zllx')" prop="symbolType" v-if="isEdit">
                {{this.switchStaus(formValidate.symbolType)}}
            </FormItem>
            <FormItem :label="vm.$t('common.bz')" prop="symbol">
                <b v-if="isEdit">{{formValidate.symbol}}</b>
                <Input type="text" v-model="formValidate.symbol" :readonly="isEdit" v-if="!isEdit"></Input>
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
                        {required: true, type: 'string', message: vm.$t('common.qsr')+vm.$t('common.bz'), trigger: 'blur'}
                    ],
                    username: [
                        {required: true, type: 'string', message: vm.$t('common.qsr')+vm.$t('common.yhm'), trigger: 'blur'}
                    ]
                },
                symbolTypeList: []
            };
        },
        created () {
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            switchStaus (state) {
                return this.symbolTypeList.map((res) => {
                    if (res.code == state) {
                        return res.name;
                    }
                });
            },
            save () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        if (this.isEdit) {
                            system.updateAdminAccounts({
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
                            system.addAdminAccounts({
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
