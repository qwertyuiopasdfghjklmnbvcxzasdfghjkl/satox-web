<template>
    <div class="addressSet">
        <Card>
            <p slot="title">{{$t('fund.zdzz')}}
                <Button @click="adddEploy">{{$t('fund.tjpz')}}</Button>
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
                        title: this.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: this.$t('system.zxje'),
                        key: 'coinMin'
                    },
                    {
                        title: this.$t('system.blje'),
                        key: 'coinReserve'
                    },
                    {
                        title: this.$t('system.kgfbz'),
                        key: 'minerSymbol'
                    },
                    {
                        title: this.$t('system.btckgf'),
                        key: 'minerFee'
                    },
                    {
                        title: this.$t('system.ethdj'),
                        key: 'gasPrice'
                    },
                    {
                        title: this.$t('system.ethsx'),
                        key: 'gasLimit'
                    },
                    {
                        title: this.$t('system.sfky'),
                        key: 'enable',
                        render: (h, params) => {
                            return h('div', params.row.enable === 0 ? this.$t('system.bky') : this.$t('system.ky'));
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
                                }, this.$t('common.xg'))
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
