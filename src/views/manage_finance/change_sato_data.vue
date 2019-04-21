<template>
    <Row>
        <Card>
            <p slot="title">
                SATO{{$t('finance.slxg')}}
                <span class="refresh" @click="getList"></span>
            </p>
            <Row>
                <Col span="16">
                    {{$t('common.yhm')}}:
                    <Input v-model="formData.text" clearable style="width: 200px"></Input>
                    <Button type="primary" @click="getList(true)">{{$t('common.cx')}}</Button>
                </Col>
                <Col span="8">
                    <Button type="primary" style="float:right;" @click="reviseDialog">{{$t('finance.xgjl')}}</Button>
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
                    {title: this.$t('common.yhm'), key: 'username'},
                    {title: this.$t('common.sjh'), key: 'mobile'},
                    {title: this.$t('common.xm'), key: 'userRealName'},
                    {
                        title: this.$t('common.qblx'),
                        key: 'type',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.type));
                        }
                    },
                    {title: this.$t('common.bzdh'), key: 'symbol'},
                    {title: this.$t('common.zje'), key: 'totalBalance'},
                    {title: this.$t('common.kyje'), key: 'availableBalance'},
                    {title: this.$t('common.djje'), key: 'frozenBalance'},
                    {
                        title: this.$t('common.cz'),
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
                                }, this.$t('common.zj')),
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
                                }, this.$t('common.kc'))
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
                        return this.$t('common.zqb');
                        break;
                    case 2:
                        return this.$t('common.fzqb');
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
