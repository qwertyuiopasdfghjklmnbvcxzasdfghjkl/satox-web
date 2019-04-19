<!-- 用户虚拟充值提现 -->
<template>
    <Card>
        <p slot="title">用户虚拟充值提现</p>
        <Row>
            <Col span="16">
                用户名
                <Input v-model="formData.username" clearable style="width: 200px" placeholder="请输入..."></Input>
                币种
                <Select v-model="formData.symbol" style="width: 200px">
                    <Option value="0">全部</Option>
                    <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                    </Option>
                </Select>
                <Button type="primary" @click="users.page=1;getList()">查询</Button>
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
                        {title: '用户名', key: 'username'},
                        {title: '手机号', key: 'mobile'},
                        {title: '姓名', key: 'userRealName'},
                        {title: '币种代号', key: 'symbol'},
                        {title: '总金额', key: 'totalBalance'},
                        {title: '可用金额', key: 'availableBalance'},
                        {title: '冻结金额', key: 'loanBalance'},
                        {title: '币池虚拟金额', key: 'virtualBalance'},
                        {
                            title: '操作',
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
                                    }, '充值'),
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
                                    }, '提现')
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
        }
    };
</script>


<style lang="less" scoped>
    .ivu-modal-wrap.z-top {
        z-index: 1003;
    }
</style>
