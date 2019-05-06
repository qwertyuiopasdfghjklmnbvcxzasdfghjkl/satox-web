<template>
    <div class="operation_placard">
        <Card>
            <p slot="title">{{$t('operation.gg')}}
                <Button type="primary" @click="addMarket">{{$t('common.xz')}}</Button>
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
    import addPlacard from './addPlacard';
    import upPlacard from './upPlacard';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                columns1: [
                    {
                        title: this.$t('operation.sx'),
                        key: 'sequence'
                    },
                    {
                        title: this.$t('operation.jtggbt'),
                        key: 'title'
                    },
                    {
                        title: this.$t('operation.jtgglj'),
                        key: 'link',
                    },
                    {
                        title: this.$t('operation.ywggbt'),
                        key: 'titleEn'
                    },
                    {
                        title: this.$t('operation.ywgglj'),
                        key: 'linkEn'
                    },
                    {
                        title: this.$t('operation.ftggbt'),
                        key: 'titleCht',
                    },
                    {
                        title: this.$t('operation.ftgglj'),
                        key: 'linkCht'
                    },
                    {
                        title: this.$t('common.gxsj'),
                        key: 'updatedTime'
                    },
                    {
                        title: this.$t('common.zt'),
                        key: 'displayStatus',
                        render: (h, params) => {
                            return h('div', params.row.displayStatus === 1 ?
                                this.$t('operation.zs') : this.$t('operation.bzs'));
                        }
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
                                            util.setDialog(upPlacard, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getfindAllAnnouncement();
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
                                                this.getfindAllAnnouncement();
                                            }, (msg) => {
                                                this.$Message.error({content: msg});
                                            });
                                        }
                                    }
                                }, this.$t('operation.scgg'))
                            ]);
                        }
                    }
                ],
                data1: []
            };
        },
        created () {
            this.getfindAllAnnouncement();
        },
        methods: {
            addMarket () {
                util.setDialog(addPlacard, {
                    okCallback: () => {
                        this.getfindAllAnnouncement();
                    }
                });
            },
            getfindAllAnnouncement () {
                extendApi.findAllAnnouncement(this.curPage, {}, (res) => {
                    this.data1 = res;
                });
            },
            changePage () {
                this.curPage = page;
            }
        }
    };
</script>
