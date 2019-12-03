<template>

    <Card>
        <p slot="title">{{$t('nav.txydlb')}}</p>
        <p style="margin-bottom: 20px;">
                <span>
                    {{$t('monitoring.gllx')}}：
                    <select v-model="symbolType"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option v-for="item in  symbolTypeList" :value="item.code">{{item.name}}</option>
                    </select>
                </span>
            <span>
                    {{$t('common.bz')}}：
                    <Input v-model="symbol" style="width:100px;"/>
                </span>
            <span>
                    {{$t('common.yhm')}}：
                    <Input v-model="userName" style="width:100px;"/>
                </span>

            <span>
                    {{$t('monitoring.tbzt')}}：
                    <select v-model="status"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option value="1">{{$t('risk.wcl')}} </option>
                        <option value="2">{{$t('finance.ddjyfq')}}</option>
                        <option value="3">{{$t('finance.jyyfs')}}</option>
                    </select>
                </span>
            <span>
                    {{$t('monitoring.jyfqsj')}}：
                    <select v-model="time"
                            style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                        <option value="">{{$t('common.qb')}}</option>
                        <option value="1">{{$t('monitoring.ldwxsyn')}} </option>
                        <option value="2">{{$t('monitoring.ldwxsys')}}</option>
                        <option value="3">{{$t('monitoring.yxsys')}}</option>
                        <option value="4">{{$t('monitoring.lxsys')}}</option>
                        <option value="5">{{$t('monitoring.sxsys')}}</option>
                        <option value="6">{{$t('monitoring.wxsys')}}</option>
                        <option value="7">{{$t('monitoring.shixsys')}}</option>
                        <option value="8">{{$t('monitoring.esxsys')}}</option>
                        <option value="9">{{$t('monitoring.sbxsys')}}</option>
                        <option value="10">{{$t('monitoring.qexsys')}}</option>
                    </select>
                </span>
            <span>
                    {{$t('finance.txsqid')}}：
                    <Input v-model="withdrawApplyId" style="width:100px;"/>
                </span>
            <Button type="primary" @click="curPage=1;getWithdrawApplyList()">{{$t('common.cx')}}</Button>

        </p>
        <!-- <Table :columns="columns1" :data="data1"></Table> -->
        <Table :columns="columns10" :data="data9"></Table>
        <Page :current="curPage" :total="total" @on-change="changePage"
              style="text-align:center;margin-top:20px;"></Page>
    </Card>
</template>
<script>
    import expandRow from './table-expand1.vue';
    import monitorApi from '../../api/monitoring';

    export default {
        components: {expandRow},
        data () {
            return {
                symbolType: '',
                symbol: '',
                status: '',
                time: '',
                withdrawApplyId: '',
                userName: '',
                curPage: 1,
                total: 0,
                symbolTypeList: [],
                columns10: [
                    {
                        type: 'expand',
                        width: 30,
                        render: (h, params) => {
                            return h(expandRow, {
                                props: {
                                    row: params.row
                                }
                            });
                        }
                    },
                    {
                        title: this.$t('common.jyid'),
                        width: 200,
                        key: 'txId'
                    },
                    {
                        title: this.$t('finance.txsqid'),
                        width: 200,
                        key: 'withdrawApplyId'
                    },
                    {
                        title: this.$t('common.yhm'),
                        width: 160,
                        key: 'userName'
                    },
                    {
                        title: this.$t('common.bz'),
                        width: 80,
                        key: 'symbol'
                    },
                    {
                        title: this.$t('monitoring.gllx'),
                        width: 90,
                        key: 'symbolType',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.symbolType));
                        }
                    },
                    {
                        title: this.$t('monitoring.xtdbdz'),
                        width: 200,
                        key: 'fromAddress'
                    },
                    {
                        title: this.$t('monitoring.yhsbdz'),
                        width: 200,
                        key: 'toAddress'
                    },
                    {
                        title: 'Memo',
                        width: 100,
                        key: 'memo'
                    },
                    {
                        title: this.$t('monitoring.txed'),
                        width: 160,
                        key: 'withdrawAmount'
                    },
                    {
                        title: this.$t('finance.txsxf'),
                        width: 160,
                        key: 'fee'
                    },
                    {
                        title: this.$t('exchange.kgf'),
                        width: 160,
                        key: 'minerFee'
                    },
                    {
                        title: this.$t('monitoring.shzt'), //0 未审核  1 审核不通过  2 审核通过
                        key: 'auditStatus',
                        width: 200,
                        render: (h, params) => {
                            return h('div', this.statusSwicth(params.row.auditStatus));
                        }
                    },
                    {
                        title: this.$t('monitoring.tbzt'),  //1 未处理  2 等待交易发起  3 交易已发送(等待记账)
                        key: 'status',
                        width: 200,
                        render: (h, params) => {
                            return h('div', this.statusSwicth1(params.row.status));
                        }
                    },
                    {
                        title: this.$t('monitoring.jysbyy'),
                        width: 200,
                        key: 'failMsg'
                    },
                    {
                        title: this.$t('monitoring.nz'),
                        width: 200,
                        key: 'nonce'
                    },
                    {
                        title: this.$t('monitoring.sqsj'),
                        width: 160,
                        key: 'createdTime'
                    },
                    {
                        title: this.$t('monitoring.jyfqsj'),
                        width: 160,
                        key: 'tradeTime'
                    },
                    {
                        title: this.$t('monitoring.jyfqsc'),
                        key: 'tradeWaitingTime',
                        width: 160,
                        render: (h, params) => {
                            return h('div', [params.row.tradeWaitingTime, 'h']);
                        }
                    },
                    {
                        title: this.$t('common.cz'),
                        fixed: 'right',
                        width: 100,
                        render: (h, params) => {
                            return h('Button', {
                                props: {type: 'primary', size: 'small'},
                                style: {margin: '3px'},
                                on: {
                                    click: () => {

                                    }
                                }
                            }, this.$t('finance.txsb'));
                        }
                    }
                ],
                data9: []
            };
        },
        created () {
            this.getWithdrawApplyList();
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
            statusSwicth (state) { //0 未审核  1 审核不通过  2 审核通过
                switch (state) {
                    case 0:
                        return this.$t('common.wsh');
                        break;
                    case 1:
                        return this.$t('common.wsbtg');
                        break;
                    case 2:
                        return this.$t('common.wstg');
                        break;

                }
            },
            statusSwicth1 (state) { //1 未处理  2 等待交易发起  3 交易已发送(等待记账)
                switch (state) {
                    case 1:
                        return this.$t('risk.wcl');
                        break;
                    case 2:
                        return this.$t('finance.ddjyfq');
                        break;
                    case 3:
                        return this.$t('finance.jyyfs');
                        break;

                }
            },
            getWithdrawApplyList () {
                monitorApi.findWaitingWithdrawApplyList(this.curPage, {
                    symbolType: this.symbolType || '',
                    symbol: this.symbol || '',
                    status: this.status || '',
                    timeInterval: this.time || '',
                    withdrawApplyId: this.withdrawApplyId || '',
                    userName: this.userName || '',
                }, (res, total) => {
                    this.total = total;
                    this.data9 = res;
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getWithdrawApplyList();
            }
        }
    };
</script>
<style scoped>
    .ivu-row {
        height: 40px;
        line-height: 40px;
    }
</style>
