<template>
    <Row>
        <Card style="width:1000px;">
            <p slot="title">
                <span>{{vm.$t('finance.xnctlsjl')}}</span>
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row>
                <Col span="16">
                    <span>{{vm.$t('common.yhm')}}</span>
                    <Input v-model="formData.username" clearable style="width: 200px"></Input>
                    <span>{{vm.$t('common.bz')}}</span>
                    <Select v-model="formData.symbol" style="width: 200px">
                        <Option value="0">{{vm.$t('common.qb')}}</Option>
                        <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                        </Option>
                    </Select>
                    <Button type="primary" @click="page=1;getList(true)">{{vm.$t('common.cx')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
            <Page :current="page" :total="total" :page-size="size" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    import financeApi from '../../../api/finance';
    import kyc from '../../../api/kyc';
    import currenyApi from '../../../api/currency';

    export default {
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                page: 1,
                size: 10,
                total: 0,
                symbolList: null,
                formData: {
                    username: '',
                    symbol: '0',
                },
                columns1: [
                    {title: vm.$t('common.cjsj'), key: 'createdTime'},
                    {title: vm.$t('common.yhm'), key: 'userName'},
                    {title: vm.$t('common.sjh'), key: 'mobile'},
                    {title: vm.$t('common.xm'), key: 'userRealName'},
                    {title: vm.$t('common.bzdh'), key: 'symbol'},
                    {
                        title: vm.$t('finance.lx'),
                        key: 'transactionType',
                        render: (h, params) => {
                            return h('div', params.row.transactionType == 1 ? vm.$t('finance.zsjy') :
                                vm.$t('finance.xnjy'));
                        }
                    },
                    {
                        title: vm.$t('common.sl'),
                        key: 'amount',
                        render: (h, params) => {
                            return h('div', Math.abs(params.row.amount));
                        }
                    },
                    {
                        title: vm.$t('common.zt'),
                        key: 'status',
                        render: (h, params) => {
                            return h('div', params.row.status == 1 ? vm.$t('common.dd') : vm.$t('common.wc'));
                        }
                    },
                ],
                data1: []
            };
        },
        created () {
            this.getList();
            this.getdataSymbol();
        },
        methods: {
            getdataSymbol () {
                currenyApi.findAllValidSymbolList((res) => {
                    this.symbolList = res;
                });
            },
            state (data) {
                switch (data) {
                    case 1:
                }
            },
            getList () {
                let D = JSON.stringify(this.formData.symbol);
                let symbol = JSON.parse(D);
                let data = {
                    page: this.page,
                    size: this.size,
                    userName: this.formData.username,
                    symbol: symbol === '0' ? null : symbol
                };
                financeApi.virtualList(data, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            changePage (page) {
                this.page = page;
                this.getList();
            },
            closeDialog () {
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style scoped>

</style>
