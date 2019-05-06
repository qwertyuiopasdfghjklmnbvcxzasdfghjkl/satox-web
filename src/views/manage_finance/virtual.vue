<!-- 用户虚拟充值提现 -->
<template>
    <Card>
        <p slot="title">{{$t('finance.yhxncztx')}}</p>
        <Row>
            <Col span="16">
                {{$t('common.yhm')}}
                <Input v-model="formData.username" clearable style="width: 200px"
                       :placeholder="$t('common.qsr')"></Input>
                {{$t('common.bz')}}
                <Select v-model="formData.symbol" style="width: 200px">
                    <Option value="0">{{$t('common.qb')}}</Option>
                    <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                    </Option>
                </Select>
                <Button type="primary" @click="users.page=1;getList()">{{$t('common.cx')}}</Button>
            </Col>
            <Col span="8" style="text-align: right">
                <Button type="primary" @click="digList()">{{$t('finance.ctjl')}}</Button>
            </Col>
        </Row>
        <Table border :columns="users.columns" :data="users.data" style="margin-top:20px;"></Table>
        <Page :current="users.page" :total="users.total" :page-size="users.size" @on-change="userschangePage"
              style="text-align:center;margin-top:20px;"></Page>
    </Card>
</template>

<script>
    import util from '../../libs/util';
    import virtualDialog from './virtual_dialog';
    import dialogList from './components/dialog_list';
    import voteApi from '@/api/vote';
    import currenyApi from '../../api/currency';
    import monitApi from '../../api/monitoring';

    export default {
        data () {
            return {
                symbolList: [],
                formData: {
                    symbol: '0',
                    username: ''
                },
                users: {
                    page: 1,
                    size: 10,
                    total: 0,
                    columns: [
                        {title: this.$t('common.yhm'), key: 'username'},
                        {title: this.$t('common.sjh'), key: 'mobile'},
                        {title: this.$t('common.xm'), key: 'userRealName'},
                        {title: this.$t('common.bzdh'), key: 'symbol'},
                        {title: this.$t('common.zje'), key: 'totalBalance'},
                        {title: this.$t('common.kyye'), key: 'availableBalance'},
                        {title: this.$t('common.djje'), key: 'loanBalance'},
                        {title: this.$t('finance.bcxnje'), key: 'virtualBalance'},
                        {
                            title: this.$t('common.cz'),
                            key: 'dailyVoteAmount',
                            width: 210,
                            align: 'center',
                            render: (h, params) => {
                                return h('div', [
                                    h('Button', {
                                        props: {
                                            type: 'primary'
                                        },
                                        style: {
                                            marginRight: '5px',
                                        },
                                        on: {
                                            click: () => {
                                                util.setDialog(virtualDialog, {
                                                    item: params.row,
                                                    type: 0,
                                                    okCallback: () => {
                                                        this.getList();
                                                    }
                                                });
                                            }
                                        }
                                    }, this.$t('finance.cz')),
                                    h('Button', {
                                        props: {
                                            type: 'primary'
                                        },
                                        on: {
                                            click: () => {
                                                util.setDialog(virtualDialog, {
                                                    item: params.row,
                                                    type: 1,
                                                    okCallback: () => {
                                                        this.getList();
                                                    }
                                                });
                                            }
                                        }
                                    }, this.$t('finance.tx'))
                                ]);
                            }
                        },
                    ],
                    data: [],
                },
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
            userschangePage (page) {
                this.users.page = page;
                this.getList();
            },
            getList () {
                let data = JSON.stringify(this.formData.symbol);
                let symbol = JSON.parse(data);
                monitApi.findCoinPoolList({
                    page: this.users.page,
                    size: this.users.size,
                    username: this.formData.username,
                    symbol: symbol === '0' ? null : symbol
                }, (res, total) => {
                    this.users.total = total;
                    this.users.data = res;
                });
            },
            digList () {
                util.setDialog(dialogList, {
                    okCallback: () => {
                        this.getList();
                    }
                });
            }
        }
    };
</script>


<style lang="less" scoped>
    .ivu-modal-wrap.z-top {
        z-index: 1003;
    }
</style>
