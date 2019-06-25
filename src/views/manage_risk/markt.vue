<template>
    <div class="operation_placard">
        <Card>
            <p slot="title">{{$t('nav.scyjgz')}}
                <Button type="primary" @click="addMarket">{{$t('common.xz')}}</Button>
            </p>
            <p style="margin-bottom: 10px;">
                {{$t('exchange.jysc')}}：
                <Select style="width: 200px;" v-model="publicLink">
                    <Option :value="0" :key="0">{{$t('common.qb')}}</Option>
                    <Option v-for="item in marketList" :value="item.market" :key="item.market">{{ item.market }}</Option>
                </Select>
                <Button type="primary" @click="getList()">{{$t('common.cx')}}</Button>
            </p>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  :page-size="size" style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>
<script>
    import extendApi from '../../api/extend';
    import util from '../../libs/util';
    import add from './markt/add';
    import updata from './markt/updata';
    import currenyApi from '../../api/currency'

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                size: 20,
                columns1: [
                    {
                        title: this.$t('risk.bhid'),
                        key: 'sequence'
                    },
                    {
                        title: this.$t('exchange.jysc'),
                        key: 'title'
                    },
                    {
                        title: this.$t('risk.wjyjgfz'),
                        key: 'link',
                    },
                    {
                        title: this.$t('common.cjsj'),
                        key: 'linkEn'
                    },
                    {
                        title: this.$t('common.cz'),
                        key: 'opreat',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(updata, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('common.xg')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {
                                            extendApi.deleteAnnouncement({
                                                announcementId: params.row.announcementId
                                            }, (res) => {
                                                this.$Message.success({content: this.$t('operation.qxcg')});
                                                this.getList();
                                            }, (msg) => {
                                                this.$Message.error({content: msg});
                                            });
                                        }
                                    }
                                }, this.$t('common.sc'))
                            ]);
                        }
                    }
                ],
                data1: [],
                marketList: [],
                publicLink: 0
            };
        },
        created () {
            this.getList();
            this.getAllMarket();
        },
        methods: {
            getAllMarket () {
                currenyApi.findAllMarketList((res) => {
                    this.marketList = res;
                });
            },
            addMarket () {
                util.setDialog(add, {
                    okCallback: () => {
                        this.getList();
                    }
                });
            },
            getList () {
                extendApi.findAllAnnouncement(this.curPage, {}, (res) => {
                    this.data1 = res;
                });
            },
            changePage (page) {
                this.curPage = page;
            }
        }
    };
</script>
