<!-- USSD 充值 -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <Card>
                    <p slot="title">
                        <Col span="16">
                            {{$t('nav.glgl')}}
                        </Col>
                        <Col span="8">
                            <Button type="primary" style="float:right;" @click="add()">{{$t('common.tj')}}</Button>
                        </Col>
                    </p>
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
    import add from './add_public_link.vue';
    import financeApi from '../../api/finance';

    export default {
        data () {
            return {
                page: 1,
                size: 20,
                total: 0,
                columns: [
                    {title: 'ID', key: 'username'},
                    {title: this.$t('monitoring.gllx'), key: 'mobile'},
                    {title: this.$t('common.cjsj'), key: 'userRealName'},
                    {
                        title: this.$t('common.cz'), key: 'action', render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '3px'},
                                    on: {
                                        click: () => {
                                        }
                                    }
                                }, this.$t('common.sc'))
                            ]);
                        }
                    }
                ],
                data: []
            };
        },
        created () {
            this.getList();
        },
        methods: {
            getList () {
                let data = {page: this.page, size: this.size, symbol: 'SATO'};
                financeApi.findUSDSRechargeRecords(data, (rdata, rtotel) => {
                    this.data = rdata;
                    this.total = rtotel;
                });
            },
            changePage (page) {
                this.page = page;
                this.getList();
            },
            add () {
                util.setDialog(add, {
                    okCallback () {
                        this.getList();
                    }
                });
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
