<!-- USSD 充值 -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <Card>
                    <p slot="title">USSD{{$t('finance.cz')}}</p>
                    <Row>
                        <Col span="16">
                            <Select v-model="formData.type" style="width:200px;">
                                <Option value="username">{{$t('common.yhm')}}</Option>
                                <Option value="mobile">{{$t('common.sjh')}}</Option>
                            </Select>
                            <Input v-model="formData.text" clearable style="width: 200px"></Input>
                            <Button type="primary" @click="page=1;getList()">{{$t('common.cx')}}</Button>
                        </Col>
                        <Col span="8">
                            <Button type="primary" style="float:right;" @click="reviseDialog">{{$t('finance.xgjl')}}</Button>
                        </Col>
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
    import ussdDialog from './components/ussd_list';

    export default {
        data () {
            return {
                formData: {
                    type: 'username',
                    text: ''
                },
                page: 1,
                size: 20,
                total: 0,
                columns: [
                    {title: this.$t('common.yhm'), key: 'username'},
                    {title: this.$t('common.sjh'), key: 'mobile'},
                    {title: this.$t('common.xm'), key: 'userRealName'},
                    {title: this.$t('common.bzdh'), key: 'symbol'},
                    {title: `USSD${this.$t('common.zje')}`, key: 'totalBalance'},
                    {title: `USSD${this.$t('common.kyje')}`, key: 'availableBalance'},
                    {title: `USSD${this.$t('common.djje')}`, key: 'frozenBalance'},
                    {
                        title: this.$t('common.cz'), key: 'action', render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '3px'},
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
                                }, this.$t('finance.cz')),
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
                                }, this.$t('finance.kc'))
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
            reviseDialog () {
                util.setDialog(ussdDialog, {
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
