<template>
    <div style="min-width:1000px;">
        <Card>
            <p slot="title">{{$t('monitoring.yhbcxx')}}</p>
            <Row style="margin-bottom: 20px;">
                <Col span="6">
                    {{$t('common.bz')}}：
                    <Select v-model="symbol" style="width:180px;">
                        <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                        </Option>
                    </Select>
                </Col>
                <Col span="6">
                    {{$t('common.zje')}}：
                    <Select v-model="totalBalance" style="width:180px;">
                        <Option :value="0">{{$t('common.dyl')}}</Option>
                        <Option :value="1">{{$t('common.dylxyyq')}}</Option>
                        <Option :value="2">{{$t('common.dydyyw')}}</Option>
                    </Select>
                </Col>
                <Col span="6">
                    {{$t('common.yhm')}}：
                    <Input v-model="username" style="width:180px;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="curPage=1;getfindAccountList()">{{$t('common.cx')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>

    </div>
</template>
<script>
    import monitApi from '../../api/monitoring';
    import currenyApi from '../../api/currency';

    export default {
        data () {
            return {
                username: '',
                symbol: 'ETH',
                totalBalance: 1,
                curPage: 1,
                size: 10,
                total: 0,
                columns1: [
                    {
                        title: this.$t('common.yhm'),
                        key: 'username'
                    },
                    {
                        title: this.$t('monitoring.bzid'),
                        key: 'symbolId'
                    },
                    {
                        title: this.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: this.$t('common.dz'),
                        key: 'toAddress'
                    },
                    {
                        title: this.$t('common.zje'),
                        key: 'totalBalance'
                    },
                    {
                        title: this.$t('common.kyje'),
                        key: 'availableBalance'
                    },
                    {
                        title: this.$t('common.djje'),
                        key: 'loanBalance'
                    },
                    {
                        title: this.$t('common.cjsj'),
                        key: 'createdAt'
                    },
                    {
                        title: this.$t('common.gxsj'),
                        key: 'updatedAt'
                    }
                ],
                data1: [{
                    username: null,
                    symbolId: null,
                    symbol: null,
                    toAddress: null,
                    totalBalance: null,
                    availableBalance: null,
                    loanBalance: null,
                    createdAt: null,
                    updatedAt: null
                }],
                symbolList: [],
            };
        },
        created () {
            // this.getfindAccountList();
            this.getdataSymbol();
        },
        methods: {
            getfindAccountList () {
                monitApi.findCoinPoolList({
                    page: this.curPage,
                    size: this.size,
                    username: this.username,
                    symbol: this.symbol,
                    max: this.getTal(this.totalBalance),
                    min: this.getTal2(this.totalBalance)
                }, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getfindAccountList();
            },
            getdataSymbol () {
                currenyApi.findAllValidSymbolList((res) => {
                    this.symbolList = res;
                });
            },
            getTal (i) {
                if (i === 0) {
                    return i;
                } else if (i === 1) {
                    return 10000;
                }
            },
            getTal2 (i) {
                if (i === 1) {
                    return 0.0001;
                } else if (i === 2) {
                    return 10000;
                }
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
