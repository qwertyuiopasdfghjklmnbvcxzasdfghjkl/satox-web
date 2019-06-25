<template>
    <div class="operation_placard">
        <Card>
            <p slot="title">{{$t('nav.jdyjgz')}}
                <Button type="primary" @click="addMarket">{{$t('common.xz')}}</Button>
            </p>
            <p style="margin-bottom: 10px;">
                {{$t('monitoring.gllx')}}：
                <Select style="width: 200px;" v-model="publicLink">
                    <Option :value="0" :key="0">{{$t('common.qb')}}</Option>
                    <Option v-for="item in plink" :value="item.code" :key="item.code">{{item.name}}</Option>
                </Select>
                <Button type="primary" @click="getList()">{{$t('common.cx')}}</Button>
            </p>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>
<script>
    import extendApi from '../../api/extend';
    import util from '../../libs/util';
    import add from './node/add';
    import updata from './node/updata';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                columns1: [
                    {
                        title: this.$t('risk.bhid'),
                        key: 'sequence'
                    },
                    {
                        title: this.$t('monitoring.gllx'),
                        key: 'title'
                    },
                    {
                        title: this.$t('risk.syjdtbczfz'),
                        key: 'link',
                    },
                    {
                        title: this.$t('risk.qksmgdczfz'),
                        key: 'titleEn'
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
                plink: [],
                publicLink: 0
            };
        },
        created () {
            this.getList();
            this.plink = JSON.parse(window.localStorage.symbolTypes)
        },
        methods: {
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
