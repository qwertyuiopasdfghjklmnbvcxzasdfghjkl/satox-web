<template>
    <div class="coin_setting" style="width:635px;background: #fff;position:relative;">
        <i @click="closeDialog" class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;"></i>
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
                            <Button @click="updataInsertSymbol('withdrawFlag')" type="primary">
                                {{item.withdrawFlag===2? vm.$t('exchange.zc'):vm.$t('exchange.zt')}}
                            </Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                        <Col span="8">{{vm.$t('exchange.zxtbsl')}}</Col>
                        <Col span="8">{{data1.minWithdrawQuantity2 || 0}}</Col>
                        <Col span="8">
                            <!-- <numberbox ref="price" :style="baseStyle" v-if="!isMarket" :accuracy="fixedNumber" class="formel-textbox" type="text" v-model="formData.price" :readonly="isMarket"/> -->
                            <numberbox ref="price" style="width:80px;border:1px solid #dddee1;" type="text"
                                       v-model="minWithdrawQuantity"/>
                            <!-- <InputNumber v-model="minWithdrawQuantity" ></InputNumber> -->
                            <Button @click="tabs('minWithdrawQuantity')" type="primary">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px; display:none">
                        <Col span="8">{{vm.$t('exchange.hssl')}}</Col>
                        <Col span="8">{{data1.convertQuantity || 0}}</Col>
                        <Col span="8">
                            <InputNumber v-model="convertQuantity"></InputNumber>
                            <Button @click="tabs('convertQuantity')" type="primary">{{vm.$t('common.bc')}}</Button>
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
                            <Button @click="tabs('feeFixedAmount')" type="primary">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>

                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;"
                         v-if="this.item.symbolType !== 2">
                        <Col span="8">{{vm.$t('exchange.kgf')}}</Col>
                        <Col span="8">{{data1.minerFee || 0}}</Col>
                        <Col span="8">
                            <InputNumber v-model="minerFee"></InputNumber>
                            <Button @click="tabs('minerFee')" type="primary">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px; "
                         v-if="this.item.symbolType === 2">
                        <Col span="8">GASPrice</Col>
                        <Col span="8">{{data1.gasprice || 0}}</Col>
                        <Col span="8">
                            <InputNumber v-model="gasprice"></InputNumber>
                            <Button @click="tabs('gasprice')" type="primary">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;"
                         v-if="this.item.symbolType === 2">
                        <Col span="8">GASNumber</Col>
                        <Col span="8">{{data1.gaslimit || 0}}</Col>
                        <Col span="8">
                            <InputNumber v-model="gaslimit"></InputNumber>
                            <Button @click="tabs('gaslimit')" type="primary">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                        <Col span="8">{{vm.$t('exchange.ksctxz')}}</Col>
                        <Col span="8">{{item.withdrawFastFlag | state }}</Col>
                        <Col span="8">
                            <Button @click="updataInsertSymbol('withdrawFastFlag')" type="primary">
                                {{item.withdrawFastFlag === 1?
                                vm.$t('exchange.gb') : vm.$t('exchange.kq')}}
                            </Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                        <Col span="8">{{vm.$t('exchange.kscted')}}</Col>
                        <Col span="8">{{item.withdrawFastQuantity || 0}}</Col>
                        <Col span="8">
                            <InputNumber v-model="withdrawFastQuantity"></InputNumber>
                            <Button @click="updataInsertSymbol('withdrawFastQuantity')" type="primary">
                                {{vm.$t('common.bc')}}
                            </Button>
                        </Col>
                    </Row>
                    <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
                        <Col span="8">{{vm.$t('exchange.kstxcs')}}</Col>
                        <Col span="8">{{item.withdrawFastCounts || 0}}</Col>
                        <Col span="8">
                            <InputNumber v-model="withdrawFastCounts"></InputNumber>
                            <Button @click="updataInsertSymbol('withdrawFastCounts')" type="primary">
                                {{vm.$t('common.bc')}}
                            </Button>
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
                            <Button @click="competence()" type="primary">
                                {{item.rechargeFlag===2? vm.$t('exchange.zc'): vm.$t('exchange.zt')}}
                            </Button>
                        </Col>
                    </Row>
                    <Row style="margin-top:10px;border-top:1px solid #e9eaec;line-height:50px;">
                        <Col span="8">{{vm.$t('exchange.ddqks')}}</Col>
                        <Col span="8">{{item.confirmBlock || 0}}</Col>
                        <Col span="8">
                            <InputNumber :max="999" :min="1" v-model="confirmBlock"></InputNumber>
                            <Button @click="tabs1()" type="primary">{{vm.$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                </Card>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import currenyApi from '../../../api/currency';
    import numberbox from '../../components/dialog/numberbox';

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
                data: [],
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
                if(propName !== 'feeFixedAmount'){
                    if (!this[propName]) {
                        this.$Message.error({content: this.vm.$t('common.bnwk')});
                        return;
                    }
                }

                let data = {
                    symbolFeeId: this.data1.symbolFeeId,
                };
                data[propName] = this[propName];
                currenyApi.updateSymbolWithdrawFees(data, (res) => {
                    this.getchangeInfoList();
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            closeDialog () {
                this.$emit('okCallback');
                this.$emit('removeDialog');
            },
            updataInsertSymbol (propName) {
                let data = {
                    symbolId: this.item.symbolId,
                    lastUpdatedBy: this.item.lastUpdatedBy
                };
                if (propName === 'withdrawFastFlag') {
                    data.withdrawFastFlag = this.item.withdrawFastFlag === 1 ? 2 : 1;
                } else if (propName === 'withdrawFlag') {
                    data.withdrawFlag = this.item.withdrawFlag === 2 ? 1 : 2;
                } else {
                    data[propName] = this[propName];
                }
                currenyApi.updateSymbol(data, (res) => {
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this.item[propName] = data[propName] || this[propName];
                    // this.item.withdrawFlag = data.withdrawFlag;
                    // this.item[propName] = this.withdrawFastQuantity;        withdrawFastQuantity
                    // this.item.withdrawFastCounts = this.withdrawFastCounts; withdrawFastCounts
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
                return i === 1 ? vm.$t('exchange.kq') : vm.$t('exchange.gb');
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
