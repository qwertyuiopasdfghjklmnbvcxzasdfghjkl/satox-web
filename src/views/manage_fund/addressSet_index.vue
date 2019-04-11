<template>
    <div class="addressSet">
        <Card>
            <p slot="title">自动转账
                <Button @click="adddEploy">添加配置</Button>
            </p>
            <Table :columns="columns" :data="data"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage1" :page-size="size"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
        <!--<Card>-->
        <!--<p slot="title">手动转账</p>-->
        <!--<Table :columns="columns2" :data="data2"></Table>-->
        <!--<Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>-->
        <!--</Card>-->
        <!-- -->
    </div>
</template>
<script>
    import upAddress from './upAddress';
    import util from '../../libs/util';
    import fundApi from '../../api/fund';
    import eploy from './eploy';
    import monitorApi from '../../api/monitoring';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                size: 10,
                columns: [
                    {
                        title: '币种',
                        key: 'symbol'
                    },
                    {
                        title: '最小金额',
                        key: 'coinMin'
                    },
                    {
                        title: '保留金额',
                        key: 'coinReserve'
                    },
                    {
                        title: '矿工费币种',
                        key: 'minerSymbol'
                    },
                    {
                        title: 'BTC矿工费',
                        key: 'minerFee'
                    },
                    {
                        title: 'ETH GAS单价',
                        key: 'gasPrice'
                    },
                    {
                        title: 'ETH GAS上限',
                        key: 'gasLimit'
                    },
                    {
                        title: '是否可用',
                        key: 'enable',
                        render: (h, params) => {
                            return h('div', params.row.enable === 0 ? '不可用' : '可用');
                        }
                    },
                    {
                        title: ' ',
                        key: 'address',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(upAddress, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getTransferConfig();
                                                }
                                            });
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                data: [],
            };
        },
        created () {
            this.getTransferConfig();
        },
        methods: {
            adddEploy () {
                util.setDialog(eploy, {
                    okCallback: () => {
                        this.getTransferConfig();
                    }
                });
            },
            getTransferConfig () {
                fundApi.findTransferConfig(this.curPage, (res, total) => {
                    this.total = total;
                    this.data = res;
                });
            },
            changePage1 (page) {
                this.curPage = page;
                this.getTransferConfig();
            }
        }
    };
</script>
<style scoped>
    .ivu-card-head p {
        display: flex;
        justify-content: space-between;
        height: 30px;
    }
</style>
