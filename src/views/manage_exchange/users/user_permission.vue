<template>
    <Card style="width:840px">
        <p slot="title">
            {{vm.$t('exchange.zhqx')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row style="margin:0 20px;">
            <Row style="margin-bottom:10px;">
                <Col span="12">{{vm.$t('exchange.qxmc')}}</Col>
                <Col span="8">{{vm.$t('exchange.dqzt')}}</Col>
                <Col span="4" style="text-align:right;">{{vm.$t('common.xg')}}</Col>
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">{{vm.$t('exchange.dlqx')}}</Col>
                <Col span="8">{{data2.loginPermission === 0? vm.$t('exchange.zc'): vm.$t('exchange.dj')}}</Col>
                <Col span="4">
                    <Button type="primary" style="float:right;" @click="updateUserLoginPermission(data2)">
                        {{data2.loginPermission === 0? vm.$t('exchange.dj'):vm.$t('exchange.jd')}}
                    </Button>
                </Col>
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">{{vm.$t('exchange.bbjyqx')}}{{data2.length}}</Col>
                <Col span="8">{{data2.exchangePermission === 1? vm.$t('exchange.zc'):vm.$t('exchange.dj')}}</Col>
                <Col span="4">
                    <Button type="primary" style="float:right;" @click="tabs('exchangePermission')">
                        {{data2.exchangePermission === 1? vm.$t('exchange.dj'):vm.$t('exchange.zc')}}
                    </Button>
                </Col>
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">{{vm.$t('exchange.ggecrz')}}</Col>
                <Col span="8">{{item.googleAuthEnable === 1? vm.$t('exchange.ybd'):vm.$t('exchange.wbd')}}</Col>
                <Col span="4">
                    <Button :disabled="item.googleAuthEnable !== 1" type="primary" style="float:right;"
                            @click="tabs('googleAuthenticate')">{{item.googleAuthEnable === 1?
                        vm.$t('exchange.jb'):vm.$t('exchange.bd')}}
                    </Button>
                </Col>
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">{{vm.$t('exchange.dxecrz')}}</Col>
                <Col span="8">{{data2.mobileAuthenticate === 1? vm.$t('exchange.ybd'):vm.$t('exchange.wbd')}}</Col>
                <Col span="4">
                    <Button :disabled="data2.mobileAuthenticate !== 1" type="primary" style="float:right;"
                            @click="tabsMobile('mobileAuthenticate')">{{data2.mobileAuthenticate === 1?
                        vm.$t('exchange.jb'):vm.$t('exchange.bd') }}
                    </Button>
                </Col>
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">{{vm.$t('exchange.txqx')}}</Col>
                <Col span="8">{{data2.withdrawPermission === 1? vm.$t('exchange.zc'):vm.$t('exchange.dj')}}</Col>
                <Col span="4">
                    <Button type="primary" style="float:right;" @click="tabs('withdrawPermission')">
                        {{data2.withdrawPermission === 1? vm.$t('exchange.dj'):vm.$t('exchange.zc')}}
                    </Button>
                </Col>
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">KYC{{vm.$t('common.zt')}}</Col>
                <Col span="8">{{item.kycState | kycFilter}}</Col>
                <!-- <Col span="4">
                    <Button type="primary" style="float:right;" @click="tabs('kycStatus')">{{data2.kycStatus === 1? '解冻':'正常'}}</Button>
                </Col> -->
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">{{vm.$t('exchange.otcjyqx')}}</Col>
                <Col span="8">{{data2.otcPermission === 1? vm.$t('exchange.zc'):vm.$t('exchange.dj')}}</Col>
                <Col span="4">
                    <!-- <Button type="primary" style="float:right;" @click="tabs('otcPermission')">{{data2.otcPermission === 1? '冻结':'正常'}}</Button> -->
                </Col>
            </Row>
            <Row style="margin-bottom:10px;border-bottom:1px solid #ccc;padding-bottom:10px;display:none;">
                <Col span="12">
                    <span style="margin-right:20px;">
                        {{vm.$t('exchange.yjzt')}}
                    </span>
                    <span>
                        {{vm.$t('exchange.yjqbid')}}
                    </span>
                    <span>
                        {{data2.usbKeyId}}
                        <!-- {{data2.usbKeyStatus === 1? '正常':'解冻'}} -->
                    </span>
                </Col>
                <Col span="8">{{data2.usbKeyStatus === 1? vm.$t('exchange.zc'):vm.$t('exchange.dj')}}</Col>
                <Col span="4">
                    <Button type="primary" style="float:right;" @click="tabs('usbKeyStatus')">
                        {{data2.usbKeyStatus === 1? vm.$t('exchange.jd'):vm.$t('exchange.zc')}}
                    </Button>
                </Col>
            </Row>
            <!-- <Row style="margin-bottom:10px;">
                <Col span="6">提现额度</Col>
                <Col span="6">{{data2.withdrawLimitAmount}}BTC</Col>
                <Col span="6">
                    <InputNumber v-model="withdrawLimitAmount" max="10000"></InputNumber>
                </Col>
                <Col span="6">
                    <Button type="primary" style="float:right;" @click="tabs('withdrawLimitAmount', true)">保存</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:10px;border-bottom:1px solid #ccc;padding-bottom:10px;">
                <Col span="6">人工审核额度</Col>
                <Col span="6">{{data2.artificialAuditingAmount}}BTC</Col>
                <Col span="6">
                     <InputNumber v-model="artificialAuditingAmount"></InputNumber>
                </Col>
                <Col span="6">
                    <Button type="primary" style="float:right;" @click="tabs('artificialAuditingAmount', true)">保存</Button>
                </Col>
            </Row> -->
            <Row>
                <span style="font-size:18px;font-weight:bold;">API</span>
            </Row>
            <Table :columns="columns1" :data="data1"></Table>
            <Row type="flex" justify="center" style="margin-top:10px;">
                <Button @click="closeDialog">{{vm.$t('common.qx')}}</Button>
                <Button type="primary" style="margin-left:20px;" @click="upSubmit">{{vm.$t('common.bc')}}</Button>
            </Row>
        </Row>
    </Card>
</template>

<script>
    import currenyApi from '../../../api/currency';

    export default {
        props: ['userId', 'version','item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                active: true,
                withdrawLimitAmount: null || 0,
                artificialAuditingAmount: null,
                columns1: [
                    {
                        title: vm.$t('exchange.mc'), key: 'name', render: (h, params) => {
                            return h('div', [
                                h('Input')
                            ]);
                        }
                    },
                    {title: vm.$t('exchange.gy'), key: 'publickey'},
                    {
                        title: vm.$t('exchange.qx'), key: 'permission', render: (h, params) => {
                            return h('div', [
                                h('CheckboxGroup', [
                                    h('Checkbox', {
                                        props: {label: vm.$t('exchange.dqxx')}
                                    }),
                                    h('Checkbox', {
                                        props: {label: vm.$t('exchange.xjwt')}
                                    }),
                                    h('Checkbox', {
                                        props: {label: vm.$t('exchange.sjwt')}
                                    }),
                                    h('Checkbox', {
                                        props: {label: vm.$t('exchange.zhtb')}
                                    })
                                ])
                            ]);
                        }
                    },
                    {
                        title: 'IP', key: 'ip', render: (h, params) => {
                            return h('div', [
                                h('Input')
                            ]);
                        }
                    }
                ],
                data1: [],
                data2: {}
            };
        },
        created () {
            this.getPermission();
        },
        methods: {
            updateUserLoginPermission (userData) {
                let status = userData.loginPermission === 0 ? 1 : 0;
                currenyApi.updateUserLoginPermission(userData.userId, status, (res) => {
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this.getPermission();
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            getPermission () {
                currenyApi.findUserPermission(this.userId, (res) => {
                    if (res === null) {
                        return;
                    }
                    this.data2 = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            tabsMobile (propName, type) {
                let data = {
                    userId: this.data2.userId,
                    version: this.data2.version
                };
                if (!type) {
                    data[propName] = this.data2[propName] === 1 ? 2 : 1;
                } else {
                    data[propName] = this[propName];
                }
                currenyApi.updateUserPermission(data, (res) => {
                    if (res == 0) {
                        this.$Message.error({content: this.vm.$t('exchange.jlybqtrxg')});
                        return;
                    }
                    if (!type) {
                        this.data2[propName] = this.data2[propName] === 2;
                    } else {
                        this[propName] = '';
                    }
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this.getPermission();
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            tabs (propName, type) {
                let data = {
                    userId: this.data2.userId,
                    version: this.data2.version
                };
                if (!type) {
                    data[propName] = this.data2[propName] === 1 ? 2 : 1;
                } else {
                    data[propName] = this[propName];
                }
                currenyApi.updateUserPermission(data, (res) => {
                    if (res == 0) {
                        this.$Message.error({content: this.vm.$t('exchange.jlybqtrxg')});
                        return;
                    }
                    if (!type) {
                        this.data2[propName] = this.data2[propName] === 1 ? 2 : 1;
                    } else {
                        this[propName] = null;
                    }
                    this.$Message.success({content: this.vm.$t('common.xgcg')});
                    this.getPermission();
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            upSubmit () {

            }
        },
        filters:{
            kycFilter(id){
                // KYC验证，0未通过，1已通过，-1审核中，-2错误，-3拒绝
                let obj = {
                    '0': window.vm.$t('common.wtg'),
                    '1': window.vm.$t('common.ytg'),
                    '-1': window.vm.$t('common.shz'),
                    '-2': window.vm.$t('common.rzsb'),
                    '-3': window.vm.$t('common.yjj'),
                }
                return obj[id]
            }
        }
    };
</script>

<style>

</style>
