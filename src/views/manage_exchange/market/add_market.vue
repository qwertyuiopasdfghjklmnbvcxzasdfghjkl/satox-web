<template>
    <div class="coin_setting">
        <Card style="width:500px;">
            <p slot="title">
                {{type | filterMarket}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                <FormItem :label="vm.$t('exchange.scmc')" prop="market">
                    <Input v-model="formLeft.market" name="market"></Input>
                </FormItem>
                <FormItem :label=" vm.$t('exchange.bdbz')" prop="currencySymbol">
                    <Input v-model="formLeft.currencySymbol" name="currencySymbol"></Input>
                </FormItem>
                <FormItem :label=" vm.$t('exchange.jbbz')" prop="baseSymbol">
                    <Input v-model="formLeft.baseSymbol" name="baseSymbol"></Input>
                </FormItem>
                <FormItem :label=" vm.$t('exchange.kpjg')" prop="openingPrice">
                    <InputNumber style="width:100%;" v-model="formLeft.openingPrice"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('common.zt')" prop="state">
                    <RadioGroup v-model="formLeft.state" name="status">
                        <Radio label="1">
                            <span>{{vm.$t('exchange.sx')}}</span>
                        </Radio>
                        <Radio label="2">
                            <span>{{vm.$t('exchange.xs')}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="vm.$t('exchange.jgjd')" prop="accuracy">
                    <InputNumber style="width:100%;" v-model="formLeft.accuracy" name="accuracy"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('exchange.sljd')" prop="quantityAccu">
                    <InputNumber style="width:100%;" v-model="formLeft.quantityAccu"
                                 :max="8" :min="0" :stpe="1" name="quantityAccu"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('exchange.jejd')" prop="amountAccu">
                    <InputNumber style="width:100%;" v-model="formLeft.amountAccu"
                                 :max="8" :min="0" :stpe="1" name="amountAccu"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('exchange.sdhbjd')" prop="digit">
                    <InputNumber style="width:100%;" v-model="formLeft.digit" name="digit"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('exchange.zxxdje')" prop="minPlaceOrderAmount">
                    <InputNumber style="width:100%;" v-model="formLeft.minPlaceOrderAmount"
                                 name="minPlaceOrderAmount"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('exchange.zxjysl')" prop="minPlaceOrderQuantity">
                    <InputNumber style="width:100%;" v-model="formLeft.minPlaceOrderQuantity"
                                 name="minPlaceOrderQuantity"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('exchange.gdjg')" prop="fixedPrice">
                    <InputNumber style="width:100%;" v-model="formLeft.fixedPrice" name="fixedPrice"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('exchange.zdwtbs')" prop="autoEntrustCount">
                    <InputNumber style="width:100%;" v-model="formLeft.autoEntrustCount"
                                 name="autoEntrustCount"></InputNumber>
                </FormItem>


                <FormItem :label="vm.$t('exchange.pullGemini')" prop="pullGemini">
                    <Input style="width:100%;" v-model="formLeft.pullGemini"
                                 name="pullGemini"></Input>
                </FormItem>
                <FormItem :label="vm.$t('exchange.buyFixedPriceRate')" prop="buyFixedPriceRate">
                    <InputNumber style="width:100%;" v-model="formLeft.buyFixedPriceRate"
                                 name="buyFixedPriceRate"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('exchange.sellFixedPriceRate')" prop="sellFixedPriceRate">
                    <InputNumber style="width:100%;" v-model="formLeft.sellFixedPriceRate"
                                 name="sellFixedPriceRate"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('exchange.pullInterval')" prop="pullInterval">
                    <InputNumber style="width:100%;" v-model="formLeft.pullInterval||3000"
                                 name="pullInterval"></InputNumber>
                </FormItem>
                <FormItem :label="vm.$t('exchange.zdwtjg')" prop="basePrice">
                    <InputNumber style="width:100%;" v-model="formLeft.basePrice" :min="0"
                                 name="basePrice"></InputNumber>
                </FormItem>
                <Button type="primary" @click="getAddMarket()">{{vm.$t('common.tj')}}</Button>
            </Form>
        </Card>
    </div>
</template>
<script>
    import currenyApi from '../../../api/currency';

    export default {
        props: ['type'],
        data() {
            const customValidator = (rule, value, callback) => {
                if (this.formLeft[rule.field] === null) {
                    return callback(new Error('error'));
                } else {
                    return callback();
                }
            };
            const vm = window.vm;
            return {
                vm: vm,
                lines: '',
                formLeft: {
                    market: '',
                    currencySymbol: '',
                    baseSymbol: '',
                    openingPrice: null,
                    accuracy: null,
                    quantityAccu: null,
                    amountAccu: null,
                    digit: null,
                    minPlaceOrderAmount: null,
                    minPlaceOrderQuantity: null,
                    state: '2',
                    fixedPrice: '',
                    autoEntrustCount: 0,
                    pullGemini: null,
                    buyFixedPriceRate: null,
                    sellFixedPriceRate: null,
                    pullInterval: null,
                    basePrice: null
                },
                ruleInline: {
                    market: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.scmc'), trigger: 'blur'}
                    ],
                    currencySymbol: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.bdbz'), trigger: 'blur'}
                    ],
                    baseSymbol: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.jbbz'), trigger: 'blur'}
                    ],
                    accuracy: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.jgjd')},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('exchange.jgjd'),
                            trigger: 'blur'
                        },
                    ],
                    amountAccu: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.jejd')},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('exchange.jejd'),
                            trigger: 'blur'
                        },
                    ],
                    quantityAccu: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.sljd')},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('exchange.sljd'),
                            trigger: 'blur'
                        },
                    ],
                    minPlaceOrderAmount: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.zxxdje')},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('exchange.zxxdje'),
                            trigger: 'blur'
                        }
                    ],
                    minPlaceOrderQuantity: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.zxjysl')},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('exchange.zxjysl'),
                            trigger: 'blur'
                        },
                    ],
                    state: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.zt')},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('common.zt'),
                            trigger: 'blur'
                        },
                    ],
                    openingPrice: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.kpjg')},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('exchange.kpjg'),
                            trigger: 'blur'
                        },
                    ],
                    digit: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.sdhbjd')},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('exchange.sdhbjd'),
                            trigger: 'blur'
                        },
                    ]
                }
            };
        },
        methods: {
            closeDialog() {
                this.$emit('removeDialog');
            },
            getAddMarket() {
                if (this.type == 1) {
                    this.$refs.formItem.validate((valid) => {
                        if (valid) {
                            currenyApi.insertMarket(this.formLeft, (res) => {
                                this.$Message.success({content: this.vm.$t('common.tjcg')});
                                this.$emit('okCallback');
                                this.$emit('removeDialog');
                            }, (msg) => {
                                this.$Message.error({content: msg});
                            });
                        }
                    });
                } else if (this.type == 0 || this.type == 2) {
                    this.$refs.formItem.validate((valid) => {
                        if (valid) {
                            currenyApi.insertMarket({
                                market: this.formLeft.market,
                                currencySymbol: this.formLeft.currencySymbol,
                                baseSymbol: this.formLeft.baseSymbol,
                                openingPrice: this.formLeft.openingPrice,
                                accuracy: this.formLeft.accuracy,
                                quantityAccu: this.formLeft.quantityAccu,
                                amountAccu: this.formLeft.amountAccu,
                                digit: this.formLeft.digit,
                                minPlaceOrderAmount: this.formLeft.minPlaceOrderAmount,
                                minPlaceOrderQuantity: this.formLeft.minPlaceOrderQuantity,
                                state: this.formLeft.state,
                                basePrice: this.formLeft.basePrice,
                                marketType: this.type
                            }, (res) => {
                                this.$Message.success({content: this.vm.$t('common.tjcg')});
                                this.$emit('okCallback');
                                this.$emit('removeDialog');
                            }, (msg) => {
                                this.$Message.error({content: msg});
                            });
                        }
                    });
                }
            }
        },
        filters:{
            filterMarket(id){
                let arr =[window.vm.$t('exchange.xzxnsc'), window.vm.$t('exchange.xzzssc'), window.vm.$t('exchange.xzdzsp')]
                return arr[id]
            }
        }
    };
</script>
<style lang="less" scoped>
    .coin_setting {
        .title {
            position: relative;
            height: 30px;
            line-height: 30px;
            background: #2d8cf0;
            color: #fff;
            font-size: 16px;
            text-align: center;

            span {
                font-size: 18px;
                cursor: pointer;
                position: absolute;
                right: 10px;
                top: 2px;
            }
        }

        .ivu-form .ivu-form-item-label {
            color: #000;
            font-size: 13px;
        }

        .ivu-form-item {
            margin-top: 10px;
        }

        .ivu-input {
            width: 88%;
        }

        .ivu-form .ivu-form-item-label {
            padding-left: 10px;
        }

        .ivu-btn-primary {
            display: flex;
            margin: 0 auto;
            margin-bottom: 10px;
        }

        .ivu-form-item {
            margin-bottom: 16px;
        }
    }
</style>

