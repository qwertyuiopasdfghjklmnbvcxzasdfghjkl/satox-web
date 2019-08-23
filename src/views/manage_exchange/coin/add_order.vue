<template>
    <div class="add_order">
        <Card style="width:600px;">
            <p slot="title">
                {{vm.$t('exchange.tjbz')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100"
                  style="max-height:680px;overflow:auto;">
                <Row>
                    <Col span="12">
                        <FormItem :label="vm.$t('exchange.dh')" prop="symbol">
                            <Input v-model="formLeft.symbol" name="symbol"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem :label="vm.$t('exchange.ywqc')" prop="caption">
                            <Input v-model="formLeft.caption" name="caption"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem :label="vm.$t('exchange.zwmqc')" prop="captionCN">
                            <Input v-model="formLeft.captionCN" name="captionCN"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem :label="vm.$t('exchange.fxzl')" prop="totalIssuance">
                            <Input v-model="formLeft.totalIssuance" name="totalIssuance"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem :label="vm.$t('exchange.ltzl')" prop="totalCirculation">
                            <Input v-model="formLeft.totalCirculation" name="totalCirculation"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem :label="vm.$t('exchange.fxjg')" prop="issuePrice">
                            <Input v-model="formLeft.issuePrice" name="issuePrice"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem :label="vm.$t('exchange.hblx')" prop="flag">
                    <RadioGroup ref="flag" v-model="formLeft.flag">
                        <Radio label="1">
                            <span>ERC20</span>
                        </Radio>
                        <Radio label="2">
                            <span>{{vm.$t('common.fei')}}ERC20</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="vm.$t('common.zllx')" prop="symbolType">
                    <RadioGroup ref="symbolType" v-model="formLeft.symbolType">
                        <Radio v-for="item in  symbolTypeList" :label="item.code">
                            <span>{{item.name}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="Property ID" prop="propertyId" v-if="this.formLeft.symbolType === '3'">
                    <Input v-model="formLeft.propertyId" name="propertyId"></Input>
                    <!-- <input type="file" ref="iconFile" name="iconFile" @change="iconValidator('iconFile', $event)"/> -->
                </FormItem>
                <FormItem label="ICON" prop="iconFile">
                    <input type="file" ref="iconFile" name="iconFile" @change="iconValidator('iconFile', $event)"/>
                </FormItem>
                <FormItem :label="vm.$t('exchange.erc20hydz')" prop="contractAddr"
                          v-if="this.formLeft.flag === '1' && this.formLeft.symbolType === '2'">
                    <Input v-model="formLeft.contractAddr" name="contractAddr"></Input>
                </FormItem>
                <Row>
                    <Col span="12">
                        <FormItem :label="vm.$t('exchange.hyjd')" prop="contractDecimals"
                                  v-if="this.formLeft.flag === '1' && this.formLeft.symbolType === '2'">
                            <Input v-model="formLeft.contractDecimals" name="contractDecimals"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem :label="vm.$t('exchange.zxtbsl')" prop="minWithdrawQuantity">
                            <numberbox ref="price" type="text" :min="0.1" name="minWithdrawQuantity"
                                       v-model="formLeft.minWithdrawQuantity"
                                       style="width100%;border:1px solid #dddee1;"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem :label="vm.$t('exchange.sxfgded')" prop="feeFixedAmount">
                            <numberbox ref="price" type="text" :min="0.1" name="feeFixedAmount"
                                       v-model="formLeft.feeFixedAmount" style="width100%;border:1px solid #dddee1;"/>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem :label="vm.$t('exchange.kgf')" prop="minerFee">
                            <numberbox ref="price" type="text" :min="0.1" name="minerFee" v-model="formLeft.minerFee"
                                       style="width100%;border:1px solid #dddee1;"/>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="GASPrice" prop="gasprice" v-if="this.formLeft.symbolType === '2'">
                            <InputNumber style="width:100%;" :min="0.1" name="gasprice"
                                         v-model="formLeft.gasprice"></InputNumber>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="GASNumber" prop="gaslimit" v-if="this.formLeft.symbolType === '2'">
                            <InputNumber style="width:100%;" :min="0.1" name="gaslimit"
                                         v-model="formLeft.gaslimit"></InputNumber>
                        </FormItem>
                    </Col>
                </Row>
                <FormItem :label="vm.$t('exchange.cbqx')" prop="rechargeFlag">
                    <RadioGroup ref="rechargeFlag" v-model="formLeft.rechargeFlag">
                        <Radio label="1">
                            <span>{{vm.$t('exchange.zc')}}</span>
                        </Radio>
                        <Radio label="2">
                            <span>{{vm.$t('exchange.dj')}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="vm.$t('exchange.tbqx')" prop="withdrawFlag">
                    <RadioGroup ref="withdrawFlag" v-model="formLeft.withdrawFlag">
                        <Radio label="1">
                            <span>{{vm.$t('exchange.zc')}}</span>
                        </Radio>
                        <Radio label="2">
                            <span>{{vm.$t('exchange.zt')}}</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem :label="vm.$t('exchange.ddqks')" prop="confirmBlock">
                    <InputNumber style="width:100%;" name="confirmBlock" v-model="formLeft.confirmBlock"></InputNumber>
                </FormItem>

                <FormItem :label="vm.$t('exchange.bpsdz')" prop="whitePaperUrl">
                    <Input style="width:100%;" name="whitePaperUrl" v-model="formLeft.whitePaperUrl"></Input>
                </FormItem>
                <FormItem :label="vm.$t('exchange.gw')" prop="officialWebsite">
                    <Input style="width:100%;" name="officialWebsite" v-model="formLeft.officialWebsite"></Input>
                </FormItem>
                <FormItem :label="vm.$t('exchange.qkcx')" prop="blockQueryUrl">
                    <Input style="width:100%;" name="blockQueryUrl" v-model="formLeft.blockQueryUrl"></Input>
                </FormItem>
                <Button type="primary" @click="addCurreny()">{{vm.$t('common.tj')}}</Button>
            </Form>
        </Card>
    </div>
</template>
<script>
    import currenyApi from '../../../api/currency';
    import until from '../../../libs/util';
    import numberbox from '../../components/dialog/numberbox';

    export default {
        data () {
            const validateAddrCheck = (rule, value, callback) => {
                if (this.formLeft.flag === '1' && value === '') {
                    callback(new Error(vm.$t('common.qsr') + vm.$t('exchange.erc20hydz')));
                } else {
                    callback();
                }
            };
            const customValidator = (rule, value, callback) => {
                if (this.formLeft[rule.field] === null) {
                    return callback(new Error('error'));
                } else {
                    return callback();
                }
            };
            const xxx = (rule, value, callback) => {
                if (/\.(jpg|png|jpeg|bmp|ico)/i.test(value) === false) {
                    return callback(new Error());
                } else {
                    return callback();
                }
            };
            let self = this;
            const xxx1 = (rule, value, callback) => {
                let isTrue = until.limitUploadImage(self.$refs.iconFile);
                if (!isTrue) {
                    return callback(new Error());
                }
                return callback();
            };
            const vm = window.vm;
            return {
                vm: vm,
                formLeft: {
                    caption: '',
                    captionCN: '',
                    confirmBlock: null,
                    contractAddr: '',
                    feeFixedAmount: null,
                    iconFile: '',
                    minWithdrawQuantity: null,
                    rechargeFlag: '1', // 1，正常 2，暂停
                    // riseRatio: null,
                    contractDecimals: null,
                    flag: '1',
                    symbol: '',
                    // symbolServer: '',
                    symbolType: '2',
                    withdrawFlag: '1', // 1，正常 2，冻结
                    gaslimit: null,
                    gasprice: null,
                    minerFee: null,
                    totalIssuance: null, //发行总量
                    totalCirculation: null, //流通总量
                    issuePrice: null, //发行价格
                    propertyId: null,
                    whitePaperUrl: null,
                    officialWebsite: null,
                    blockQueryUrl: null,
                },
                ruleInline: {
                    symbol: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.dh'), trigger: 'blur'}
                    ],
                    caption: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.ywqc'), trigger: 'blur'},
                    ],
                    captionCN: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.zwmqc'), trigger: 'blur'}
                    ],

                    totalIssuance: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.fxzl'), trigger: 'blur'}
                    ],
                    totalCirculation: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.ltzl'), trigger: 'blur'}
                    ],
                    issuePrice: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.fxjg'), trigger: 'blur'}
                    ],

                    flag: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.hblx'), trigger: 'blur'},
                    ],
                    symbolType: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('monitoring.gllx')}
                    ],
                    iconFile: [
                        {required: true, message: vm.$t('common.qsr') + 'ICON', trigger: 'blur'},
                        {validator: xxx, message: vm.$t('common.znscpnghjpeghbmpdtp'), trigger: 'blur'},
                        {validator: xxx1, message: vm.$t('common.tpbncg2m'), trigger: 'blur'}
                    ],
                    // symbolServer: [
                    //     { required: true, message: '钱包服务', trigger: 'blur' },
                    // ],
                    contractAddr: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.erc20hydz'), trigger: 'blur'},
                        {
                            validator: validateAddrCheck,
                            message: vm.$t('common.qsr') + vm.$t('exchange.erc20hydz'),
                            trigger: 'blur'
                        },
                    ],
                    contractDecimals: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.hyjd'), trigger: 'blur'},
                        {
                            validator: validateAddrCheck,
                            message: vm.$t('common.qsr') + vm.$t('exchange.hyjd'),
                            trigger: 'blur'
                        },
                    ],
                    minWithdrawQuantity: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.zxtbsl'),},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('exchange.zxtbsl'),
                            trigger: 'blur'
                        },
                    ],
                    minerFee: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.kgf'),},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('exchange.kgf'),
                            trigger: 'blur'
                        },
                    ],
                    feeFixedAmount: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.sxfgded')},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('exchange.sxfgded'),
                            trigger: 'blur'
                        },
                    ],
                    // riseRatio: [
                    //     { required: true, message: '上浮百分比',},
                    //     { validator: customValidator, message: '上浮百分比', trigger: 'blur' },
                    // ],
                    rechargeFlag: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.cbqx'), trigger: 'blur'}
                    ],
                    withdrawFlag: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.tbqx'), trigger: 'blur'}
                    ],
                    confirmBlock: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('exchange.ddqks'),},
                        {
                            validator: customValidator,
                            message: vm.$t('common.qsr') + vm.$t('exchange.ddqks'),
                            trigger: 'blur'
                        },
                    ],
                    gasprice: [
                        {required: true, message: vm.$t('common.qsr') + 'GASPrice'},
                        {validator: customValidator, message: vm.$t('common.qsr') + 'GASPrice', trigger: 'blur'},
                    ],
                    gaslimit: [
                        {required: true, message: vm.$t('common.qsr') + 'GASNumber'},
                        {validator: customValidator, message: vm.$t('common.qsr') + 'GASNumber', trigger: 'blur'},
                    ],
                    propertyId: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.propertyId')},
                    ],
                    whitePaperUrl: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.bpsdz')},
                    ],
                    officialWebsite: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.gw')},
                    ],
                    blockQueryUrl: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.qkcx')},
                    ],
                },
                symbolTypeList: [],
            };
        },
        components: {
            numberbox
        },
        created () {
            this.$nextTick(() => {
                let cks = ['flag', 'symbolType', 'rechargeFlag', 'withdrawFlag'];
                cks.forEach((item) => {
                    let flags = this.$refs[item].$el.querySelectorAll('input');
                    flags[0].value = '1';
                    flags[1].value = '2';
                });
            });
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            binValidator (prop, e) {
                this.formLeft[prop] = e.target.value;
            },
            abiValidator (prop, e) {
                this.formLeft[prop] = e.target.value;
            },
            iconValidator (prop, e) {
                this.formLeft[prop] = e.target.value;
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            addCurreny () {
                let form = this.$refs.formItem;
                form.validate((valid) => {
                    if (valid) {
                        var formData = new FormData(form.$el);
                        let cks = ['flag', 'symbolType', 'rechargeFlag', 'withdrawFlag'];
                        cks.forEach((item) => {
                            formData.append(item, this.formLeft[item]);
                        });
                        currenyApi.insertSymbol(formData, (res) => {
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
    };
</script>
<style lang="less" scoped>

    .add_order {
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
