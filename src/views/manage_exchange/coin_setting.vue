<template>
    <div class="coin_setting" style="width:635px;background: #fff;position:relative;">
        <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        <Tabs style="backgroung:#fff;">
            <TabPane :label="vm.$t('exchange.tbsz')">
                <Card style="width:500px;">
                    <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
                        <Col span="8">{{vm.$t('exchange.dh')}}</Col>
                        <Col span="8">{{data1.symbol}}</Col>
                        <Col span="8"></Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                        <Col span="8">{{vm.$t('exchange.qxmc')}}</Col>
                        <Col span="8">{{vm.$t('exchange.dqzt')}}</Col>
                        <Col span="8">{{vm.$t('common.xg')}}</Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                        <Col span="8">{{vm.$t('exchange.qxzt')}}</Col>
                        <Col span="8">{{item.withdrawFlag===1? vm.$t('exchange.zc'):vm.$t('exchange.zt')}}</Col>
                        <Col span="8" style="text-align:right;margin-left:-15px;">
                            <Button type="primary" @click="updataInsertSymbol">
                                {{item.withdrawFlag===2? vm.$t('exchange.zc'):vm.$t('exchange.zt')}}
                            </Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                        <Col span="8">{{vm.$t('exchange.zxtbsl')}}</Col>
                        <Col span="8">{{data1.minWithdrawQuantity2 || 0}}</Col>
                        <Col span="8">
                            <!-- <numberbox ref="price" :style="baseStyle" v-if="!isMarket" :accuracy="fixedNumber" class="formel-textbox" type="text" v-model="formData.price" :readonly="isMarket"/> -->
                            <numberbox ref="price" type="text" v-model="minWithdrawQuantity"
                                       style="width:80px;border:1px solid #dddee1;"/>
                            <!-- <InputNumber v-model="minWithdrawQuantity" ></InputNumber> -->
                            <Button type="primary" @click="tabs('minWithdrawQuantity')">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px; display:none">
                        <Col span="8">{{vm.$t('exchange.hssl')}}</Col>
                        <Col span="8">{{data1.convertQuantity || 0}}</Col>
                        <Col span="8">
                            <InputNumber v-model="convertQuantity"></InputNumber>
                            <Button type="primary" @click="tabs('convertQuantity')">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px; display:none">
                        <Col span="8">{{vm.$t('exchange.sfbfb')}}</Col>
                        <Col span="8">{{data1.riseRatio || 0}}</Col>
                        <!-- <Col span="8">
                          <InputNumber v-model="riseRatio"></InputNumber>
                          <Button type="primary"  @click="tabs('riseRatio')">{{vm.$t('common.bc')}}</Button>
                        </Col> -->
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px; display:none">
                        <Col span="8">{{vm.$t('exchange.zjkgf')}}</Col>
                        <Col span="8">{{data1.bestMinerFee || 0}}</Col>
                        <Col span="8">
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                        <Col span="8">{{vm.$t('exchange.sxfgded')}}</Col>
                        <Col span="8">{{data1.feeFixedAmount || 0}}</Col>
                        <Col span="8">
                            <InputNumber v-model="feeFixedAmount"></InputNumber>
                            <Button type="primary" @click="tabs('feeFixedAmount')">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>

                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;"
                         v-if="this.item.symbolType !== 2">
                        <Col span="8">{{vm.$t('exchange.kgf')}}</Col>
                        <Col span="8">{{data1.minerFee || 0}}</Col>
                        <Col span="8">
                            <InputNumber v-model="minerFee"></InputNumber>
                            <Button type="primary" @click="tabs('minerFee')">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px; "
                         v-if="this.item.symbolType === 2">
                        <Col span="8">GASPrice</Col>
                        <Col span="8">{{data1.gasprice || 0}}</Col>
                        <Col span="8">
                            <InputNumber v-model="gasprice"></InputNumber>
                            <Button type="primary" @click="tabs('gasprice')">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;"
                         v-if="this.item.symbolType === 2">
                        <Col span="8">GASNumber</Col>
                        <Col span="8">{{data1.gaslimit || 0}}</Col>
                        <Col span="8">
                            <InputNumber v-model="gaslimit"></InputNumber>
                            <Button type="primary" @click="tabs('gaslimit')">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                        <Col span="8">{{vm.$t('exchange.ksctxz')}}</Col>
                        <Col span="8">{{data1.withdrawFastFlag | state }}</Col>
                        <Col span="8">
                            <Button type="primary" @click="tabs('withdrawFastFlag')">{{data1.withdrawFastFlag === 1?
                                vm.$t('exchange.gb') : vm.$t('exchange.kq')}}
                            </Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                        <Col span="8">{{vm.$t('exchange.kscted')}}</Col>
                        <Col span="8">{{data1.withdrawFastQuantity }}</Col>
                        <Col span="8">
                            <InputNumber v-model="withdrawFastQuantity"></InputNumber>
                            <Button type="primary" @click="tabs('withdrawFastQuantity')">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">b
                        <Col span="8">{{vm.$t('exchange.kstxcs')}}</Col>
                        <Col span="8">{{data1.withdrawFastCounts }}</Col>
                        <Col span="8">
                            <InputNumber v-model="withdrawFastCounts"></InputNumber>
                            <Button type="primary" @click="tabs('withdrawFastCounts')">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                </Card>
            </TabPane>
            <TabPane :label="vm.$t('exchange.ctsz')">
                <Card class="recharge_settings" style="width:500px;">
                    <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
                        <Col span="8">{{vm.$t('exchange.dh')}}</Col>
                        <Col span="8">{{item.symbol}}</Col>
                        <Col span="8"></Col>
                    </Row>
                    <Row style="margin-top:10px;border-top:1px solid #e9eaec;line-height:50px;">
                        <Col span="8">{{vm.$t('exchange.qxmc')}}</Col>
                        <Col span="8">{{vm.$t('exchange.dqzt')}}</Col>
                        <Col span="8" style="text-align:right;margin-left:-14px;">{{vm.$t('common.xg')}}</Col>
                    </Row>
                    <Row style="margin-top:10px;border-top:1px solid #e9eaec;line-height:50px;">
                        <Col span="8">{{vm.$t('exchange.qxzt')}}</Col>
                        <Col span="8">{{item.rechargeFlag===1? vm.$t('exchange.zc'): vm.$t('exchange.zt')}}</Col>
                        <Col span="8" style="text-align:right;margin-left:-14px;">
                            <Button type="primary" @click="competence()">
                                {{item.rechargeFlag===2? vm.$t('exchange.zc'): vm.$t('exchange.zt')}}
                            </Button>
                        </Col>
                    </Row>
                    <Row style="margin-top:10px;border-top:1px solid #e9eaec;line-height:50px;">
                        <Col span="8">{{vm.$t('exchange.ddqks')}}</Col>
                        <Col span="8">{{item.confirmBlock || 0}}</Col>
                        <Col span="8">
                            <InputNumber :max="999" :min="1" v-model="confirmBlock"></InputNumber>
                            <Button type="primary" @click="tabs1()">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                </Card>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import currenyApi from '../../api/currency';
    import numberbox from '../components/dialog/numberbox';

    export default {
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                version: null,
                value1: null,
                minWithdrawQuantity2: null,
                minWithdrawQuantity: null,
                convertQuantity: null,
                riseRatio: null,
                feeFixedAmount: null,
                data1: [],
                minerFee: null,
                gasprice: null,
                gaslimit: null,
                confirmBlock: null,
                rechargeFlag: null,
                withdrawFastCounts: null,
                withdrawFastQuantity: null,
                withdrawFastFlag: 1,
                data2: []
            };
        },
        components: {
            numberbox
        },
        created () {
            this.getchangeInfoList();
        },
        methods: {
            tabs (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: this.vm.$t('common.bnwk')});
                    return;
                }
                let data = {
                    symbolFeeId: this.data1.symbolFeeId,
                };
                if (propName === 'withdrawFastFlag') {
                    data.withdrawFastFlag = this.data1.withdrawFastFlag === 1 ? 2 : 1;
                } else {
                    data[propName] = this[propName];
                }
                currenyApi.updateSymbolWithdrawFees(data, (res) => {
                    this.getchangeInfoList();
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            updataInsertSymbol () {
                currenyApi.updateSymbol({
                    symbolId: this.item.symbolId,
                    version: this.version || this.item.version,
                    withdrawFlag: this.item.withdrawFlag === 2 ? 1 : 2
                }, (res) => {
                    this.item.withdrawFlag = this.item.withdrawFlag === 2 ? 1 : 2;
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    currenyApi.coinFindSymbolInfo({
                        symbolId: this.item.symbolId
                    }, (res) => {
                        this.version = res.version;
                    });
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            competence () {
                currenyApi.updateSymbol({
                    symbolId: this.item.symbolId,
                    version: this.version || this.item.version,
                    rechargeFlag: this.item.rechargeFlag === 2 ? 1 : 2
                }, (res) => {
                    this.item.rechargeFlag = this.item.rechargeFlag === 2 ? 1 : 2;
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    currenyApi.coinFindSymbolInfo({
                        symbolId: this.item.symbolId
                    }, (res) => {
                        this.version = res.version;
                    });
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            getchangeInfoList () {
                currenyApi.findSymbolWithdrawFees({
                    id: this.id,
                    symbolId: this.item.symbolId
                }, (res) => {
                    this.data1 = res || {};
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            tabs1 () {
                currenyApi.updateSymbol({
                    symbolId: this.item.symbolId,
                    confirmBlock: this.confirmBlock
                }, (res) => {
                    this.item.confirmBlock = this.confirmBlock;
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this.getchangeInfoList();
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            }
        },
        filters: {
            state (i) {
                return i === 1 ? vm.$t('exchange.kp') : vm.$t('exchange.gb');
            }
        }
    };
</script>
<style lang="less" scoped>
    .ivu-tabs {
        background: #fff;
        width: 600px;
        padding-bottom: 50px;
    }

    .ivu-card-bordered {
        margin: 0 auto;
    }

    .ivu-icon-close {
        position: absolute;
        right: 12px;
        top: 10px;
    }
</style>
