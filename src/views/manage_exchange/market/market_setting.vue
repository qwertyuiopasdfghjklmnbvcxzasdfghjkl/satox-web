<template>
    <Card class="market_setting" style="width:500px;">
        <p slot="title">
            {{vm.$t('exchange.scsz')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
            <Col span="6">{{vm.$t('exchange.scmc')}}</Col>
            <Col span="6">{{item.market}}</Col>
            <Col span="12"></Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.qxmc')}}</Col>
            <Col span="6">{{vm.$t('exchange.dqzt')}}</Col>
            <Col span="12" style="text-align:right;">{{vm.$t('common.xg')}}</Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.sxzt')}}</Col>
            <Col span="6">{{item.state === 1 ? vm.$t('exchange.sx'): vm.$t('exchange.xs')}}</Col>
            <Col span="12" style="text-align:right;">
                <Button type="primary" @click="update">{{this.item.state === 1 ? vm.$t('exchange.xs'):
                    vm.$t('exchange.sx')}}
                </Button>
            </Col>
        </Row>

        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.bdbz')}}</Col>
            <Col span="6">{{item.currencySymbol}}</Col>
            <Col span="6">
                <Input v-model="currencySymbol"></Input>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('currencySymbol')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.jbbz')}}</Col>
            <Col span="6">{{item.baseSymbol}}</Col>
            <Col span="6">
                <Input v-model="baseSymbol"></Input>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('baseSymbol')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.kpjg')}}</Col>
            <Col span="6">{{item.openingPrice}}</Col>
            <Col span="6">
                <InputNumber style="width:113px;" :min="0" v-model="openingPrice"></InputNumber>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('openingPrice')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.zxjg')}}</Col>
            <Col span="6">{{item.lastPrice}}</Col>
            <Col span="6">
                <InputNumber style="width:113px;" :min="0" v-model="lastPrice"></InputNumber>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('lastPrice')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>

        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.jgjd')}}</Col>
            <Col span="6">{{item.accuracy}}</Col>
            <Col span="6">
                <InputNumber style="width:113px;" :min="0.1" v-model="accuracy"></InputNumber>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('accuracy')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.sljd')}}</Col>
            <Col span="6">{{item.quantityAccu}}</Col>
            <Col span="6">
                <InputNumber style="width:113px;" :max="8" :min="0" :stpe="1" v-model="quantityAccu"></InputNumber>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('quantityAccu')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.jejd')}}</Col>
            <Col span="6">{{item.amountAccu}}</Col>
            <Col span="6">
                <InputNumber style="width:113px;" :max="8" :min="0" :stpe="1" v-model="amountAccu"></InputNumber>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('amountAccu')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.sdhbjd')}}</Col>
            <Col span="6">{{item.digit}}</Col>
            <Col span="6">
                <InputNumber style="width:113px;" :min="0.1" v-model="digit"></InputNumber>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('digit')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.zxxdje')}}</Col>
            <Col span="6">{{item.minPlaceOrderAmount || 0}}</Col>
            <Col span="6">
                <numberbox style="width:113px; border:1px solid #dddee1"  v-model="minPlaceOrderAmount"></numberbox>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('minPlaceOrderAmount')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.zxjysl')}}</Col>
            <Col span="6">{{item.minPlaceOrderQuantity || 0}}</Col>
            <Col span="6">
                <numberbox style="width:113px; border:1px solid #dddee1" v-model="minPlaceOrderQuantity"></numberbox>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('minPlaceOrderQuantity')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.gdjg')}}</Col>
            <Col span="6">{{item.fixedPrice || 0}}</Col>
            <Col span="6">
                <numberbox style="width:113px; border:1px solid #dddee1" v-model="fixedPrice"></numberbox>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('fixedPrice')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.zdwtbs')}}</Col>
            <Col span="6">{{item.autoEntrustCount || 0}}</Col>
            <Col span="6">
                <InputNumber style="width:113px;" v-model="autoEntrustCount"></InputNumber>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('autoEntrustCount')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.sclx')}}</Col>
            <Col span="6">{{item.marketType | filterMarket}}</Col>
            <Col span="6">
                <Select v-model="marketType" style="width:113px" :disabled="role">
                    <Option :value="1">{{vm.$t('exchange.zssc')}}</Option>
                    <Option :value="0">{{vm.$t('exchange.xnsc')}}</Option>
                    <Option :value="2">{{vm.$t('exchange.dzsp')}}</Option>
                </Select>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('marketType')" :disabled="role">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.jylxz')}}</Col>
            <Col span="6">{{parseFloat(item.volumeRatio24h)/0.01 || 0}}%</Col>
            <Col span="6">
                <input class="number_input" type="number" @input="oninput"
                       style="width:113px;border:1px solid #dddee1;padding: 4px;"/>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('volumeRatio24h')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.pullGemini')}}</Col>
            <Col span="6">{{item.pullGemini||"无"}}</Col>
            <Col span="6">
                <Input v-model="pullGemini"></Input>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('pullGemini')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.buyFixedPriceRate')}}</Col>
            <Col span="6">{{item.buyFixedPriceRate||"无"}}</Col>
            <Col span="6">
                <input v-model="buyFixedPriceRate" type="number" @input="oninput"
                       style="width:113px;border:1px solid #dddee1;padding: 4px;">
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('buyFixedPriceRate')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.sellFixedPriceRate')}}</Col>
            <Col span="6">{{item.sellFixedPriceRate||"无"}}</Col>
            <Col span="6">
                <input v-model="sellFixedPriceRate" type="number" @input="oninput"
                       style="width:113px;border:1px solid #dddee1;padding: 4px;">
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('sellFixedPriceRate')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.pullInterval')}}</Col>
            <Col span="6">{{item.pullInterval||"无"}}</Col>
            <Col span="6">
                <input v-model="pullInterval" type="number" @input="oninput"
                       style="width:113px;border:1px solid #dddee1;padding: 4px;">
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('pullInterval')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
            <Col span="6">{{vm.$t('exchange.zdwtjg')}}</Col>
            <Col span="6">{{item.basePrice||"无"}}</Col>
            <Col span="6">
                <InputNumber style="width:113px;" v-model="basePrice" :min="0"></InputNumber>
            </Col>
            <Col span="6" style="text-align:right;">
                <Button type="primary" @click="tabs('basePrice')">{{vm.$t('common.bc')}}</Button>
            </Col>
        </Row>
    </Card>
</template>

<script>
    import currenyApi from '../../../api/currency';
    import numberbox from '../../components/dialog/numberbox';
    import Cookies from 'js-cookie';

    export default {
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                curPage: 1,
                total: 0,
                value1: null,
                data1: [],
                accuracy: null,
                lastPrice: null,
                quantityAccu: null,
                amountAccu: null,
                digit: null,
                minPlaceOrderAmount: null,
                minPlaceOrderQuantity: null,
                currencySymbol: '',
                baseSymbol: '',
                fixedPrice: '',
                autoEntrustCount: 0,
                volumeRatio24h: null,
                openingPrice: null,
                marketType: null,
                pullGemini: null,
                buyFixedPriceRate: null,
                sellFixedPriceRate: null,
                pullInterval: null,
                role: true,
                basePrice: null
            };
        },
        components: {
            numberbox
        },
        created() {
            this.findMarketList();
            this.getRole();
        },
        methods: {
            oninput(e) {
                // 通过正则过滤小数点后8位
                e.target.value = (e.target.value.match(/^\d*(\.?\d{0,4})/g)[0]) || null;
                e.target.value = e.target.value > 1 ? 1 : e.target.value;
                this.volumeRatio24h = e.target.value;
            },
            getRole() {
                let roles = Cookies.get('roles');
                if (roles.indexOf('ROLE_ADMIN') === -1) {
                    this.role = true;
                } else {
                    this.role = false;
                }
            },
            closeDialog() {
                this.$emit('removeDialog');
            },
            findMarketList() {
                currenyApi.findMarketList({}, this.curPage, (res, total) => {
                    this.total = total;
                    this.data2 = res;
                }, (msg) => {
                    this.$Messags.error({content: msg});
                });
            },
            tabs(propName) {
                if (!this[propName] && (this[propName] !== 0)) {
                    this.$Message.error({content: this.vm.$t('exchange.qsrz')});
                    return;
                }
                let data = {
                    marketId: this.item.marketId
                };
                data[propName] = this[propName];
                currenyApi.updateMarket(data, (res) => {
                    this.item[propName] = this[propName];
                    this.$emit('okCallback');
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this[propName] = '';
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            update() {
                currenyApi.updateMarket({
                    version: this.item.version,
                    marketId: this.item.marketId,
                    state: this.item.state === 2 ? 1 : 2
                }, (res) => {
                    this.item.state = this.item.state === 2 ? 1 : 2;
                    this.findMarketList();
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            }
        },
        filters:{
            filterMarket(id){
                let arr = [window.vm.$t('exchange.xnsc'), window.vm.$t('exchange.zssc'), window.vm.$t('exchange.dzsp')]
                return arr[id]
            }
        }
    };
</script>
<style lang="less" scoped>
    .market_setting {
        background: #fff;
        padding: 8px;

        .title {
            font-size: 14px;
            font-weight: bold;
            color: #000;
        }

        .ivu-table-cell input {
            width: 50px;
        }

        .ivu-table-cell > div {
            display: flex;
        }

        .ivu-btn-primary {
            margin-left: 12px;
        }

        // .ivu-input-number-input{width: 72%;}
    }
</style>
