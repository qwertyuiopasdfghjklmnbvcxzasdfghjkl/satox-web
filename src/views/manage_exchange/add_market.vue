<template>
    <div class="coin_setting">
        <Card style="width:500px;">
            <p slot="title">
                新增{{type == 1 ? '真实' : '虚拟'}}市场
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                <FormItem label="市场名称" prop="market">
                    <Input v-model="formLeft.market" name="market"></Input>
                </FormItem>
                <FormItem label="标的币种" prop="currencySymbol">
                    <Input v-model="formLeft.currencySymbol" name="currencySymbol"></Input>
                </FormItem>
                <FormItem label="基础币种" prop="baseSymbol">
                    <Input v-model="formLeft.baseSymbol" name="baseSymbol"></Input>
                </FormItem>
                <FormItem label="开盘价格" prop="openingPrice">
                    <InputNumber style="width:100%;" v-model="formLeft.openingPrice"></InputNumber>
                </FormItem>
                <FormItem label="状态" prop="state">
                    <RadioGroup v-model="formLeft.state" name="status">
                        <Radio label="1">
                            <span>上线</span>
                        </Radio>
                        <Radio label="2">
                            <span>下线</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="价格精度" prop="accuracy">
                    <InputNumber style="width:100%;" v-model="formLeft.accuracy" name="accuracy"></InputNumber>
                </FormItem>
                <FormItem label="数量精度" prop="quantityAccu">
                    <InputNumber style="width:100%;" v-model="formLeft.quantityAccu"
                                 name="quantityAccu"></InputNumber>
                </FormItem>
                <FormItem label="金额精度" prop="amountAccu">
                    <InputNumber style="width:100%;" v-model="formLeft.amountAccu" name="amountAccu"></InputNumber>
                </FormItem>
                <FormItem label="深度合并精度" prop="digit">
                    <InputNumber style="width:100%;" v-model="formLeft.digit" name="digit"></InputNumber>
                </FormItem>
                <FormItem label="最小下单金额" prop="minPlaceOrderAmount">
                    <InputNumber style="width:100%;" v-model="formLeft.minPlaceOrderAmount"
                                 name="minPlaceOrderAmount"></InputNumber>
                </FormItem>
                <FormItem label="最小交易数量" prop="minPlaceOrderQuantity">
                    <InputNumber style="width:100%;" v-model="formLeft.minPlaceOrderQuantity"
                                 name="minPlaceOrderQuantity"></InputNumber>
                </FormItem>
                <FormItem label="固定价格" prop="fixedPrice">
                    <InputNumber style="width:100%;" v-model="formLeft.fixedPrice" name="fixedPrice"></InputNumber>
                </FormItem>
                <FormItem label="自动委托笔数" prop="autoEntrustCount">
                    <InputNumber style="width:100%;" v-model="formLeft.autoEntrustCount"
                                 name="autoEntrustCount"></InputNumber>
                </FormItem>
                <Button type="primary" @click="getAddMarket()">添加</Button>
            </Form>
        </Card>
    </div>
</template>
<script>
    import currenyApi from '../../api/currency';

    export default {
        props: ['type'],
        data () {
            const customValidator = (rule, value, callback) => {
                if (this.formLeft[rule.field] === null) {
                    return callback(new Error('error'));
                } else {
                    return callback();
                }
            };
            return {
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
                    autoEntrustCount: 0
                },
                ruleInline: {
                    market: [
                        {required: true, message: '请输入市场名称', trigger: 'blur'}
                    ],
                    currencySymbol: [
                        {required: true, message: '请输入标的币种', trigger: 'blur'}
                    ],
                    baseSymbol: [
                        {required: true, message: '请输入基础币种', trigger: 'blur'}
                    ],
                    accuracy: [
                        {required: true, message: '请输入价格精度'},
                        {validator: customValidator, message: '请输入价格精度', trigger: 'blur'},
                    ],
                    amountAccu: [
                        {required: true, message: '请输入金额精度'},
                        {validator: customValidator, message: '请输入金额精度', trigger: 'blur'},
                    ],
                    quantityAccu: [
                        {required: true, message: '请输入数量精度'},
                        {validator: customValidator, message: '请输入数量精度', trigger: 'blur'},
                    ],
                    minPlaceOrderAmount: [
                        {required: true, message: '请输入最小下单金额'},
                        {validator: customValidator, message: '请输入最小下单金额', trigger: 'blur'}
                    ],
                    minPlaceOrderQuantity: [
                        {required: true, message: '请输入最小交易数量'},
                        {validator: customValidator, message: '请输入最小交易数量', trigger: 'blur'},
                    ],
                    state: [
                        {required: true, message: '请输入状态'},
                        {validator: customValidator, message: '请输入状态', trigger: 'blur'},
                    ],
                    openingPrice: [
                        {required: true, message: '请输入开盘价格'},
                        {validator: customValidator, message: '请输入开盘价格', trigger: 'blur'},
                    ],
                    digit: [
                        {required: true, message: '请输入深度合并精度'},
                        {validator: customValidator, message: '请输入深度合并精度', trigger: 'blur'},
                    ]
                }
            };
        },
        methods: {
            closeDialog () {
                this.$emit('removeDialog');
            },
            getAddMarket () {
                if (this.type == 1) {
                    this.$refs.formItem.validate((valid) => {
                        if (valid) {
                            currenyApi.insertMarket(this.formLeft, (res) => {
                                this.$Message.success({content: '添加成功'});
                                this.$emit('okCallback');
                                this.$emit('removeDialog');
                            }, (msg) => {
                                this.$Message.error({content: msg});
                            });
                        }
                    });
                } else if (this.type == 0) {
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
                                state: '2',
                                marketType: 0
                            }, (res) => {
                                this.$Message.success({content: '添加成功'});
                                this.$emit('okCallback');
                                this.$emit('removeDialog');
                            }, (msg) => {
                                this.$Message.error({content: msg});
                            });
                        }
                    });
                }
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

