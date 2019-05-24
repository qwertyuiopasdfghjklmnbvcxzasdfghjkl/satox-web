<template>
    <div class="transferRecord">
        <Card style="margin-top: 20px;">
            <Row style="margin-bottom: 20px;">
                <Col span="2">{{$t('monitoring.gllx')}}：</Col>
                <Col span="4">
                    <select v-model="symbolType"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option v-for="item in  symbolTypeList" :value="item.code">{{item.name}}</option>
                    </select>
                </Col>
                <Col span="2">{{$t('common.bz')}}：</Col>
                <Col span="4">
                    <Input v-model="symbol" style="width:100px;"/>
                </Col>
                <Col span="2">{{$t('fund.zzlx')}}：</Col>
                <Col span="4">
                    <select v-model="direction"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option value="4">{{$t('monitoring.lqbcz')}}</option>
                        <option value="5">{{$t('monitoring.lqbtx')}}</option>
                    </select>
                </Col>
            </Row>
            <Row style="margin-bottom: 20px;">
                <Col span="2">{{$t('fund.zzzt')}}：</Col>
                <Col span="4">
                    <!--// 1 未处理 2 等待交易发起 3 交易已发送(等待对账) 4 撤销 5 提现失败 6对账完成 7提现失败资金返还 ,-->
                    <select v-model="status"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option value="1">{{$t('risk.wcl')}}</option>
                        <option value="2">{{$t('finance.ddjyfq')}}</option>
                        <option value="3">{{$t('fund.jyyfs')}}</option>
                        <option value="4">{{$t('finance.cx')}}</option>
                        <option value="5">{{$t('finance.txsb')}}</option>
                        <option value="6">{{$t('monitoring.dzwc')}}</option>
                        <option value="7">{{$t('finance.txsbzjfh')}}</option>
                    </select>
                </Col>
                <Col span="2">{{$t('monitoring.jyfqsc')}}：</Col>
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
                    <Button type="primary" @click="curPage1=1;getconfirmList()">{{$t('common.cx')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage1" :total="total" @on-change="changePage1" :page-size="size"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>
<script>
    import fundApi from '../../api/fund';
    import monitorApi from '../../api/monitoring';

    export default {
        data () {
            return {
                curPage1: 1,
                total: 0,
                symbolType: '',
                symbol: '',
                initiationTime: '',
                direction: '',
                username: '',
                txId: '',
                status: '',
                size: 10,
                symbolTypeList: [],
                columns1: [
                    {
                        title: this.$t('fund.zzlx'),
                        key: 'direction',
                        render: (h, params) => {
                            return h('div', this.switchDirection(params.row.direction));
                        }
                    },
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
                        title: this.$t('fund.zzzt'), //1 等待  2 完成
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
                        title: this.$t('monitoring.Nz'),
                        key: 'nonce'
                    },
                    {
                        title: this.$t('monitoring.jyfqsj'),
                        key: 'createAt'
                    },
                    {
                        title: this.$t('monitoring.jywcsj'),
                        key: 'completeTime'
                    }
                ],
                data1: []
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
            switchDirection (state) {
                switch (state) { // 1：充值 ，2：提现，3：交易所归集，4：冷钱包充值，5：冷钱包提现
                    case 1:
                        return this.$t('finance.cz');
                        break;
                    case 2:
                        return this.$t('finance.tx');
                        break;
                    case 3:
                        return this.$t('monitoring.jysgj');
                        break;
                    case 4:
                        return this.$t('monitoring.lqbcz');
                        break;
                    case 5:
                        return this.$t('monitoring.lqbtx');
                        break;
                }
            },
            switchStaus2 (state) {
                switch (state) { //  状态 1 未处理 2 等待交易发起 3 交易已发送(等待对账) 4 撤销 5 提现失败 6对账完成 7提现失败资金返还 ,
                    case 1:
                        return this.$t('risk.wcl');
                        break;
                    case 2:
                        return this.$t('finance.ddjyfq');
                        break;
                    case 3:
                        return this.$t('fund.jyyfs');
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
                monitorApi.transfersColdList({
                    page: this.curPage1,
                    size: this.size,
                    symbolType: this.symbolType,
                    initiationTime: this.initiationTime,
                    username: this.username,
                    status: this.status,
                    direction: this.direction,
                    symbol: this.symbol,
                    txId: this.txId
                }, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            changePage1 (page) {
                this.curPage1 = page;
                this.getconfirmList();
            }
        }
    };
</script>
<style scoped>
    .ivu-card-head p {
        display: flex;
        justify-content: space-between;
        height: 30px;
    }
</style>
