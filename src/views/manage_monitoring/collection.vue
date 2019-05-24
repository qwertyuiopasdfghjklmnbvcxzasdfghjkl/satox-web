<template>
    <div style="min-width: 1250px">
        <Card>
            <Row style="margin-bottom: 20px;">
                <Col span="2">{{$t('monitoring.gllx')}}：</Col>
                <Col span="4">
                    <select v-model="symbolType"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option value="1">BTC</option>
                        <option value="2">ETH</option>
                        <option value="3">OMNI</option>
                        <!--<option value="4">MBT</option>-->
                        <!--<option value="5">EOS</option>-->
                    </select>
                </Col>
                <Col span="2">{{$t('common.bz')}}：</Col>
                <Col span="4">
                    <Input v-model="symbol" style="width:100px;"/>
                </Col>
                <Col span="2">{{$t('common.yhm')}}：</Col>
                <Col span="4">
                    <Input v-model="username" style="width:100px;"/>
                </Col>
            </Row>
            <Row style="margin-bottom: 20px;">
                <Col span="2">{{$t('monitoring.gjzt')}}：</Col>
                <Col span="4">
                    <select v-model="status"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <!--<option value="1">未处理</option>-->
                        <option value="2">{{$t('finance.ddjyfq')}}</option>
                        <option value="3">{{$t('finance.jyyfs')}}</option>
                        <option value="4">{{$t('finance.cx')}}</option>
                        <option value="5">{{$t('monitoring.gjsb')}}</option>
                        <option value="6">{{$t('monitoring.gjwc')}}</option>
                        <option value="7">{{$t('monitoring.gjsbzjfh')}}</option>
                    </select>
                </Col>
                <Col span="2">{{$t('monitoring.jyfqsj')}}：</Col>
                <Col span="4">
                    <select v-model="initiationTime"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option value="1">{{$t('monitoring.yxsn')}}</option>
                        <option value="2">{{$t('monitoring.lxsn')}}</option>
                        <option value="5">{{$t('monitoring.wxsn')}}</option>
                        <option value="24">{{$t('monitoring.esxsn')}}</option>
                    </select>
                </Col>
                <Col span="2">{{$t('common.jyid')}}：</Col>
                <Col span="4">
                    <Input v-model="txId" style="width:100px;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="curPage=1;getconfirmList()">{{$t('common.cx')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>

<script>
    import monitorApi from '../../api/monitoring';
    import block_scan from './block_scan';
    import util from '../../libs/util';

    export default {
        data () {
            return {
                symbolType: '',
                symbol: '',
                initiationTime: '',
                direction: '',
                username: '',
                txId: '',
                status: '',
                curPage: 1,
                size: 10,
                total: 0,
                columns1: [
                    {
                        title: this.$t('common.jyid'),
                        key: 'txId'
                    },
                    {
                        title: this.$t('common.yhm'),
                        key: 'username'
                    },
                    {
                        title: this.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: this.$t('monitoring.gllx'),
                        key: 'symbolType',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.symbolType));
                        }
                    },
                    {
                        title: this.$t('monitoring.fdz'),
                        key: 'fromAddress'
                    },
                    {
                        title: this.$t('monitoring.tdz'),
                        key: 'toAddress'
                    },
                    {
                        title: this.$t('common.sl'),
                        key: 'amount'
                    },
                    {
                        title: this.$t('exchange.kgf'),
                        key: 'btcMinerFee'
                    },
                    {
                        title: this.$t('monitoring.gjzt'), //1 等待  2 完成
                        key: 'status',
                        render: (h, params) => {
                            return h('div', this.switchStaus2(params.row.status));
                        }
                    },
                    {
                        title: this.$t('monitoring.jysbyy'),
                        key: 'failMsg'
                    },
                    {
                        title: this.$t('monitoring.nz'),
                        key: 'nonce'
                    },
                    {
                        title: this.$t('monitoring.jyfqsj'),
                        key: 'tradeAt'
                    },
                    {
                        title: this.$t('monitoring.jywcsj'),
                        key: 'completeTime'
                    },
                    {
                        title: this.$t('monitoring.jdghid'),
                        key: 'tradeWaitingTime'
                    }
                ],
                data1: [],
                symbolTypeList: []
            };
        },
        created () {
            this.getconfirmList();
            this.symbolTypeList = JSON.parse(window.localStorage.symbolTypes);
        },
        methods: {
            switchStaus (state) {
                return this.symbolTypeList.map((res) => {
                    if (res.code == state) {
                        return res.name;
                    }
                });
            },
            switchStaus2 (state) {
                switch (state) { //  1 未处理 2 等待交易发起 3 交易已发送(等待对账) 4 撤销 5 提现失败 6 对账完成 7 提现失败资金返还
                    case 1:
                        return this.$t('risk.wcl');
                        break;
                    case 2:
                        return this.$t('finance.ddjyfq');
                        break;
                    case 3:
                        return this.$t('finance.jyyfs');
                        break;
                    case 4:
                        return this.$t('finance.cx');
                        break;
                    case 5:
                        return this.$t('finance.txsb');
                        break;
                    case 6:
                        return this.$t('monitoring.dzwc');
                        break;
                    case 7:
                        return this.$t('finance.txsbzjfh');
                        break;
                }
            },
            getconfirmList () {
                monitorApi.transfersList({
                    page: this.curPage,
                    size: this.size,
                    symbolType: this.symbolType,
                    initiationTime: this.initiationTime,
                    username: this.username,
                    status: this.status,
                    symbol: this.symbol,
                    txId: this.txId
                }, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getconfirmList();
            }
        }
    };
</script>
<style scoped>
    .main .single-page-con {
        width: 2500px;
    }

    .ivu-row {
        height: 40px;
        line-height: 40px;
    }
</style>
