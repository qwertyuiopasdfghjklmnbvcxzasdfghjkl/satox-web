<template>
    <Row>
        <Card>
            <p slot="title">
                SATO数量修改
                <span class="refresh" @click="getList"></span>
            </p>
            <Row>
                <Col span="16">
                    <Select v-model="formData.type" style="width:200px;">
                        <Option value="username">用户名</Option>
                    </Select>
                    <Input v-model="formData.text" clearable style="width: 200px"></Input>
                    <Button type="primary" @click="getList(true)">查询</Button>
                </Col>
                <Col span="8">
                    <Button type="primary" style="float:right;" @click="reviseDialog">修改记录</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
            <Page :current="page" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    import financeApi from '../../api/finance';
    // import kyc from '../../api/kyc';
    import util from '../../libs/util';
    import reviseDialog from './components/revise_list';
    import dialog from './components/dialog_sato';

    export default {
        data () {
            return {
                formData: {
                    type: 'username',
                    text: ''
                },
                page: 1,
                size: 15,
                total: 0,
                columns1: [
                    {title: '用户名', key: 'username'},
                    {title: '手机号', key: 'mobile'},
                    {title: '姓名', key: 'userRealName'},
                    {
                        title: '钱包类型',
                        key: 'type',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.type));
                        }
                    },
                    {title: '币种代号', key: 'symbol'},
                    {title: '总金额', key: 'totalBalance'},
                    {title: '可用金额', key: 'availableBalance'},
                    {title: '冻结金额', key: 'frozenBalance'},
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(dialog, {
                                                id: params.row.accountId,
                                                state: '0',
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, '增加'),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(dialog, {
                                                id: params.row.accountId,
                                                state: '1',
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, '扣除')
                            ]);
                        }
                    }
                ],
                data1: []
            };
        },
        created () {
            this.getList();
        },
        methods: {
            switchStaus (state) { // 1：主钱包，2：非主钱包）
                switch (state) {
                    case 1:
                        return '主钱包';
                        break;
                    case 2:
                        return '非主钱包';
                        break;
                }
            },
            getList () {
                let data = {
                    page: this.page,
                    size: this.size,
                    symbol: 'SATO'
                };
                if (this.formData.type && this.formData.text) {
                    data[this.formData.type] = this.formData.text;
                }
                financeApi.findUSDSRechargeRecords(data, (rdata, rtotel) => {
                    this.data1 = rdata;
                    this.total = rtotel;
                });
            },
            reviseDialog () {
                util.setDialog(reviseDialog, {
                    okCallback: () => {
                        this.getList();
                    }
                });
            },
            changePage (page) {
                this.page = page;
                this.getList();
            }
        }
    };
</script>

<style scoped>

</style>
