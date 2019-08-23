<template>
    <div class="add_order">
        <Card style="width:840px;">
            <p slot="title">
                {{vm.$t('exchange.xgbz')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
                <Col span="5">{{vm.$t('exchange.dh')}}</Col>
                <Col span="10">{{this.datas.symbol || 0}}</Col>
                <Col span="6"></Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('exchange.ywqc')}}</Col>
                <Col span="8">{{this.datas.caption || 0}}</Col>
                <Col span="8">
                    <Input v-model="caption" style="width: 150px"/>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('caption')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('exchange.zwmqc')}}</Col>
                <Col span="8">{{this.datas.captionCN || 0}}</Col>
                <Col span="8">
                    <Input v-model="captionCN" style="width: 150px"/>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('captionCN')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>

            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('exchange.fxzl')}}</Col>
                <Col span="8">{{this.datas.totalIssuance || 0}}</Col>
                <Col span="8">
                    <InputNumber style="width:100%;" v-model="totalIssuance"></InputNumber>
                    <!-- <Input v-model="totalIssuance" style="width: 150px" /> -->
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('totalIssuance')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('exchange.ltzl')}}</Col>
                <Col span="8">{{this.datas.totalCirculation || 0}}</Col>
                <Col span="8">
                    <InputNumber style="width:100%;" v-model="totalCirculation"></InputNumber>
                    <!-- <Input v-model="totalCirculation" style="width: 150px" /> -->
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('totalCirculation')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">{{vm.$t('exchange.fxjg')}}</Col>
                <Col span="8">{{this.datas.issuePrice || 0}}</Col>
                <Col span="8">
                    <InputNumber style="width:100%;" v-model="issuePrice"></InputNumber>
                    <!-- <Input v-model="issuePrice" style="width: 150px" /> -->
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('issuePrice')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>

            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="5">ICON</Col>
                <Col span="8"
                     style="width:254px;overflow:hidden;overflow: hidden;height: 40px;text-overflow: ellipsis;white-space: nowrap;">
                    {{this.datas.iconUrl || 0}}
                </Col>
                <Col span="8">
                    <!-- <FormItem label="ICON" prop="iconUrl"> -->
                    <input ref="form" type="file" name="iconFile"/>
                    <!-- </FormItem> -->
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabsImage('iconFile')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;">
                <Col span="5">{{vm.$t('exchange.hblx')}}</Col>
                <Col span="16">
                    <RadioGroup v-model="datas.flag">
                        <Radio label="1">
                            <span>ERC20</span>
                        </Radio>
                        <Radio label="2">
                            <span>{{vm.$t('common.fei')}}ERC20</span>
                        </Radio>
                    </RadioGroup>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs1('flag')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec; line-height:45px;">
                <Col span="5">{{vm.$t('common.zllx')}}</Col>
                <Col span="16">
                    <RadioGroup v-model="datas.symbolType">
                        <Radio v-for="item in  symbolTypeList" :label="item.code">
                            <span>{{item.name}}</span>
                        </Radio>
                    </RadioGroup>
                </Col>
                <Col span="3">
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;"
                 v-if="this.datas.symbolType === '3'">
                <Col span="5">Property ID</Col>
                <Col span="8">{{this.datas.propertyId || 0}}
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;"
                 v-if="this.datas.flag === '1' && this.datas.symbolType === '2'">
                <Col span="5">{{vm.$t('exchange.hyjd')}}</Col>
                <Col span="8">{{this.datas.contractDecimals || 0}}</Col>
                <Col span="8">
                    <InputNumber style="width:100%;" v-model="contractDecimals"></InputNumber>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs2('contractDecimals')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;"
                 v-if="this.datas.flag === '1' && this.datas.symbolType === '2'">
                <Col span="5">{{vm.$t('exchange.erc20hydz')}}</Col>
                <Col span="8">{{this.datas.contractAddr || 0}}
                </Col>
                <Col span="8">
                    <Input v-model="contractAddr" style="width: 150px"/>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('contractAddr')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>

            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;">
                <Col span="5">{{vm.$t('exchange.bpsdz')}}</Col>
                <Col span="8">{{this.datas.whitePaperUrl || ''}}
                </Col>
                <Col span="8">
                    <Input v-model="whitePaperUrl" style="width: 150px"/>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('whitePaperUrl')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>

            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;">
                <Col span="5">{{vm.$t('exchange.gw')}}</Col>
                <Col span="8">{{this.datas.officialWebsite || ''}}
                </Col>
                <Col span="8">
                    <Input v-model="officialWebsite" style="width: 150px"/>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('officialWebsite')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>

            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;">
                <Col span="5">{{vm.$t('exchange.qkcx')}}</Col>
                <Col span="8">{{this.datas.blockQueryUrl || ''}}
                </Col>
                <Col span="8">
                    <Input v-model="blockQueryUrl" style="width: 150px"/>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('blockQueryUrl')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    import currenyApi from '../../../api/currency';

    export default {
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                symbol: '1',
                caption: '',
                captionCN: '',
                // symbolServer: '',
                contractDecimals: null,
                contractAddr: '',
                iconFile: '',
                issuePrice: null,
                totalCirculation: null,
                totalIssuance: null,
                whitePaperUrl: null,
                officialWebsite: null,
                blockQueryUrl: null,
                datas: {
                    flag: '',
                    symbolType: '',
                    symbol: '1',
                    caption: '',
                    captionCN: '',
                    // symbolServer: '',
                    contractDecimals: null,
                    contractAddr: '',
                    iconFile: '',
                    issuePrice: null,
                    totalCirculation: null,
                    totalIssuance: null,
                },
                symbolTypeList: [],
            };
        },
        created () {
            this.getSymbolInfo();
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            getSymbolInfo () {
                currenyApi.coinFindSymbolInfo({
                    symbolId: this.item.symbolId
                }, (res) => {
                    for (var i in res) {
                        this.datas[i] = res[i] ? String(res[i]) : null;
                    }
                    console.log(this.datas);
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            tabsImage (propName) {
                var formData = new FormData();
                console.log(this.$refs);
                formData.append('iconFile', this.$refs.form.files[0]);
                formData.append('symbolId', this.item.symbolId);
                formData.append('symbol', this.item.symbol);
                console.log(formData);
                currenyApi.updateIconFile(formData, (res) => {
                    this.getSymbolInfo();
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            tabs1 (propName) {
                let data = {
                    symbolId: this.item.symbolId,
                };
                data[propName] = this.datas[propName];
                currenyApi.updateSymbol(data, (res) => {
                    this.getSymbolInfo();
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            tabs (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: this.vm.$t('common.bnwk')});
                    return;
                }
                let data = {
                    symbolId: this.item.symbolId,
                };
                data[propName] = this[propName];
                currenyApi.updateSymbol(data, (res) => {
                    this.getSymbolInfo();
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    // this.$emit('okCallback')
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            tabs2 (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: this.vm.$t('common.bnwk')});
                    return;
                }
                let data = {
                    symbolId: this.item.symbolId,
                };
                data[propName] = parseFloat(this[propName]);
                currenyApi.updateSymbol(data, (res) => {
                    this.getSymbolInfo();
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                }, (msg) => {
                    this.$Message.error({content: msg});
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
