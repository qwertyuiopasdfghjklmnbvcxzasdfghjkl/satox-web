<template>
    <div class="addWallet">
        <Card>
            <p slot="title">{{vm.$t('common.xg')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Form ref="formItem" label-position="left" :label-width="100">
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">{{vm.$t('common.bz')}}</Col>
                    <Col span="6">{{this.item.symbol}}</Col>
                    <Col span="6">
                        <Input v-model="symbol"></Input>
                    </Col>
                    <Col span="6" style="text-align:right;">
                        <Button type="primary" @click="tabs('symbol')">{{vm.$t('common.bc')}}</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">{{vm.$t('system.zxje')}}</Col>
                    <Col span="6">{{this.item.coinMin}}</Col>
                    <Col span="6">
                        <!--<InputNumber style="width:100%;" :min="0" step="0.1" name="coinMin" v-model="coinMin"></InputNumber>-->
                        <!--<Input v-model="coinMin"></Input>-->
                        <numberbox v-model="coinMin" :min="0" class="num"></numberbox>
                        <!--<input type="number" v-model="coinMin" :min="0">-->
                    </Col>
                    <Col span="6" style="text-align:right;">
                        <Button type="primary" @click="tabs('coinMin')">{{vm.$t('common.bc')}}</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">{{vm.$t('system.blje')}}</Col>
                    <Col span="6">{{this.item.coinReserve}}</Col>
                    <Col span="6">
                        <Input v-model="coinReserve"></Input>
                    </Col>
                    <Col span="6" style="text-align:right;">
                        <Button type="primary" @click="tabs('coinReserve')">{{vm.$t('common.bc')}}</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">{{vm.$t('system.kgfbz')}}</Col>
                    <Col span="6">{{this.item.minerSymbol}}</Col>
                    <Col span="6">
                        <Input v-model="minerSymbol"></Input>
                    </Col>
                    <Col span="6" style="text-align:right;">
                        <Button type="primary" @click="tabs('minerSymbol')">{{vm.$t('common.bc')}}</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">{{vm.$t('system.btckgf')}}</Col>
                    <Col span="6">{{this.item.minerFee}}</Col>
                    <Col span="6">
                        <Input v-model="minerFee"></Input>
                    </Col>
                    <Col span="6" style="text-align:right;">
                        <Button type="primary" @click="tabs('minerFee')">{{vm.$t('common.bc')}}</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">{{vm.$t('system.ethdj')}}</Col>
                    <Col span="6">{{this.item.gasPrice}}</Col>
                    <Col span="6">
                        <Input v-model="gasPrice"></Input>
                    </Col>
                    <Col span="6" style="text-align:right;">
                        <Button type="primary" @click="tabs('gasPrice')">{{vm.$t('common.bc')}}</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">{{vm.$t('system.ethsx')}}</Col>
                    <Col span="6">{{item.gasLimit}}</Col>
                    <Col span="6">
                        <Input v-model="gasLimit"></Input>
                    </Col>
                    <Col span="6" style="text-align:right;">
                        <Button type="primary" @click="tabs('gasLimit')">{{vm.$t('common.bc')}}</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">{{vm.$t('system.sfky')}}</Col>
                    <Col span="6">
                    </Col>
                    <Col span="6">
                        <RadioGroup v-model="enable">
                            <Radio label="1">
                                <span>{{vm.$t('common.s')}}</span>
                            </Radio>
                            <Radio label="0">
                                <span>{{vm.$t('common.f')}}</span>
                            </Radio>
                        </RadioGroup>
                    </Col>
                    <Col span="6" style="text-align:right;">
                        <Button type="primary" @click="tabs1('enable')">{{vm.$t('common.bc')}}</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">{{vm.$t('common.zllx')}}</Col>
                    <Col span="14">
                        <RadioGroup v-model="symbolType">
                            <Radio v-for="item in  symbolTypeList" :label="item.code">
                                <span>{{item.name}}</span>
                            </Radio>
                        </RadioGroup>
                    </Col>
                    <Col span="4" style="text-align:right;">
                        <Button type="primary" @click="tabs1('symbolType')">{{vm.$t('common.bc')}}</Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
    import fundApi from '../../api/fund';
    import Numberbox from '../components/dialog/numberbox';

    export default {
        components: {Numberbox},
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                symbol: '',
                coinMin: null,
                coinReserve: null,
                minerSymbol: null,
                minerFee: null,
                gasPrice: null,
                gasLimit: null,
                enable: this.item.enable.toString(),
                symbolType: this.item.symbolType.toString(),
                datas: [],
                symbolTypeList: [],
            };
        },
        created () {
            this.getConfig();
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            getConfig () {
                fundApi.findOneTransferConfig({
                    configId: this.item.configId
                }, (res) => {
                    this.datas = res;
                });
            },
            tabs1 (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: this.vm.$t('exchange.qsrz')});
                    return;
                }
                let data = {
                    configId: this.item.configId,
                    version: this.item.version,
                    marketId: this.item.marketId
                };
                data[propName] = this[propName];
                fundApi.updateConfig(data, (res) => {
                    this.item[propName] = this[propName];
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this.$emit('okCallback');
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            tabs (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: this.vm.$t('finance.qsryxz')});
                    return;
                }
                let data = {
                    configId: this.item.configId,
                    version: this.item.version,
                    marketId: this.item.marketId
                };
                data[propName] = this[propName];
                fundApi.updateConfig(data, (res) => {
                    this.item[propName] = this[propName];
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this[propName] = '';
                    this.$emit('okCallback');
                    this.$emit('removeDialog');
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style lang="less">
    .addWallet {
        width: 500px;
    }

    .ivu-form-item-error .ivu-input {
        width: 200px;
    }

    input.num {
        border: 1px solid #dddee1;
        transition: 0.3s;

        &:hover {
            border: 1px solid #57a3f3
        }

    }
</style>

