<template>
    <div class="addConfig">
        <Card>
            <p slot="title">{{vm.$t('common.tj')}}</p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" style="margin:0 20px;">
                <FormItem :label="vm.$t('common.bz')" prop="symbol">
                    <Input type="text" v-model="formValidate.symbol"></Input>
                </FormItem>
                <FormItem :label="vm.$t('system.zxje')" prop="coinMin">
                    <Input type="text" v-model="formValidate.coinMin"></Input>
                </FormItem>
                <FormItem :label="vm.$t('system.blje')" prop="coinReserve">
                    <Input type="text" v-model="formValidate.coinReserve"></Input>
                </FormItem>
                <FormItem :label="vm.$t('system.kgfbz')" prop="minerSymbol">
                    <Input type="text" v-model="formValidate.minerSymbol"></Input>
                </FormItem>
                <FormItem :label="vm.$t('system.kgfsl')" prop="minerFee" v-if="formValidate.symbolType !== '2'">
                    <Input type="text" v-model="formValidate.minerFee" style="width:100%;"></Input>
                </FormItem>
                <FormItem label="GASPrice" prop="gasPrice" v-if="formValidate.symbolType === '2'">
                    <InputNumber style="width:100%;" :min="0.1" name="gasPrice"
                                 v-model="formValidate.gasPrice"></InputNumber>
                </FormItem>
                <FormItem label="GASNumber" prop="gasLimit" v-if="formValidate.symbolType === '2'">
                    <InputNumber style="width:100%;" :min="0.1" name="gasLimit"
                                 v-model="formValidate.gasLimit"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('system.sfky')" prop="enable">
                    <RadioGroup ref="enable" v-model="formValidate.enable">
                        <Radio label="1">
                            <span>{{vm.$t('common.s')}}</span>
                        </Radio>
                        <Radio label="2">
                            <span>{{vm.$t('common.f')}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="vm.$t('common.zllx')" prop="symbolType">
                    <RadioGroup ref="symbolType" v-model="formValidate.symbolType">
                        <Radio v-for="item in  symbolTypeList" :label="item.code">
                            <span>{{item.name}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem style="line-height:0;text-align:center;">
                    <Button type="ghost" style="width:100px;margin-right:50px;" @click="closeDialog">{{vm.$t('common.qx')}}</Button>
                    <Button type="primary" style="width:100px;" @click="saveConfig">{{vm.$t('common.qd')}}</Button>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>
<script>
    import system from '../../api/systemparam';

    export default {
        data () {
            const customValidator = (rule, value, callback) => {
                if (this.formValidate[rule.field] === null) {
                    return callback(new Error('error'));
                } else {
                    return callback();
                }
            };
            const vm = window.vm;
            return {
                vm: vm,
                formValidate: {
                    symbol: '',
                    coinMin: null,
                    coinReserve: null,
                    minerSymbol: null,
                    minerFee: null,
                    gasPrice: null,
                    gasLimit: null,
                    enable: '1',
                    symbolType: '1'
                },
                ruleValidate: {
                    symbol: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('common.bz'), trigger: 'blur'}
                    ],
                    coinMin: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('system.zxje'), trigger: 'blur'}
                    ],
                    coinReserve: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('system.blje'), trigger: 'blur'}
                    ],
                    minerSymbol: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('system.kgfbz'), trigger: 'blur'}
                    ],
                    minerFee: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('exchange.kgf'), trigger: 'blur'}
                    ],
                    gasPrice: [
                        {required: true, message: vm.$t('common.qsr')+'gasPrice'},
                        {validator: customValidator, message: vm.$t('common.qsr')+'gasprice', trigger: 'blur'}
                    ],
                    gasLimit: [
                        {required: true, message: vm.$t('common.qsr')+'gasLimit'},
                        {validator: customValidator, message: vm.$t('common.qsr')+'gasLimit', trigger: 'blur'},
                    ],
                },
                symbolTypeList: [],
            };
        },
        created () {
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            closeDialog () {
                this.$emit('removeDialog');
            },
            saveConfig () {
                let form = this.$refs.formValidate;
                form.validate((valid) => {
                    if (valid) {
                        if (Number(this.formValidate.coinReserve) > Number(this.formValidate.coinMin)) {
                            this.$Message.error({content: this.vm.$t('system.bljeysyzxje')});
                            return;
                        }
                        if (Number(this.formValidate.coinReserve) < Number(this.formValidate.minerFee)) {
                            this.$Message.error({content: this.vm.$t('system.bljedykgf')});
                            return;
                        }
                        system.addConfig({
                            symbol: this.formValidate.symbol,
                            coinMin: this.formValidate.coinMin,
                            coinReserve: this.formValidate.coinReserve,
                            minerSymbol: this.formValidate.minerSymbol,
                            minerFee: this.formValidate.minerFee,
                            gasPrice: this.formValidate.gasPrice,
                            gasLimit: this.formValidate.gasLimit,
                            enable: this.formValidate.enable,
                            symbolType: this.formValidate.symbolType
                        }, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$emit('removeDialog');
                            this.$emit('okCallback');
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });

                    }
                });

            }
        }
    };
</script>
<style>
    .addConfig {
        width: 600px;
        padding: 20px;
        background: #fff;
    }

    .ivu-form-item-error .ivu-input {
        width: 100% !important;
    }
</style>
