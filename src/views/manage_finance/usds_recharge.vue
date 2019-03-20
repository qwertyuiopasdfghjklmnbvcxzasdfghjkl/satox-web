<!-- USDS 充值 -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <Card>
                    <p slot="title">USDS 充值</p>
                    <Row>
                        <Select v-model="formData.type" style="width:200px;">
                            <Option value="username">用户名</Option>
                            <Option value="mobile">手机号</Option>
                        </Select>
                        <Input v-model="formData.text" clearable style="width: 200px"></Input>
                        <Button type="primary" @click="page=1;getList()">查询</Button>
                    </Row>
                    <Table :columns="columns" :data="data" style="margin-top: 20px;"></Table>
                    <Page :current="page" :total="total" :page-size="size" @on-change="changePage"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
        </Col>
    </Row>
</template>

<script>
    import util from '../../libs/util';
    import dialog from './components/dialog_recharge';
    import financeApi from '../../api/finance';

    export default {
        data () {
            return {
                formData: {
                    type: '',
                    text: ''
                },
                page: 1,
                size: 20,
                total: 0,
                columns: [
                    {title: '账号', key: 'username'},
                    {title: '手机号', key: 'mobile'},
                    {title: '姓名', key: 'userRealName'},
                    {title: '币种代号', key: 'symbol'},
                    {title: 'USDS总金额', key: 'totalBalance'},
                    {title: 'USDS可用金额', key: 'availableBalance'},
                    {title: 'USDS冻结金额', key: 'frozenBalance'},
                    {
                        title: '操作', key: 'action', render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {
                                            util.setDialog(dialog, {
                                                id: params.row.accountId,
                                                state: '0',
                                                okCallback () {
                                                    window.vueInstance.getList();
                                                }
                                            });
                                        }
                                    }
                                }, '充值'),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {
                                            util.setDialog(dialog, {
                                                id: params.row.accountId,
                                                state: '1',
                                                okCallback () {
                                                    window.vueInstance.getList();
                                                }
                                            });
                                        }
                                    }
                                }, '扣除')
                            ]);
                        }
                    }
                ],
                data: []
            };
        },
        created () {
            window.vueInstance = this;
            this.getList();
        },
        methods: {
            getList () {
                let data = {page: this.page, size: this.size};
                if (this.formData.type && this.formData.text) {
                    data[this.formData.type] = this.formData.text;
                }
                financeApi.findUSDSRechargeRecords(data, (rdata, rtotel) => {
                    this.data = rdata;
                    this.total = rtotel;
                });
            },
            changePage (page) {
                this.page = page;
                this.getList();
            }
        }
    };
</script>

<style lang="less" scoped>
    .refresh {
        width: 49px;
        height: 24px;
        background: url(../../images/frsh.png) center/cover no-repeat;
        background-size: contain;
        cursor: pointer;
        color: #2d8cf0;
    }

    .ivu-table-sort i {
        display: none;
    }

    .ivu-table-cell .ivu-table-sort i:first-child {
        display: none;
    }

    .ivu-card-head-inner, .ivu-card-head p {
        display: flex !important;
        justify-content: space-between !important;
        height: 40px !important;
        line-height: 40px !important;
    }
</style>
