<template>
    <div class="operation_placard">
        <Card>
            <p slot="title">公告
                <Button type="primary" @click="addMarket">新增</Button>
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
                        title: '顺序',
                        key: 'sequence'
                    },
                    {
                        title: '简体公告标题',
                        key: 'title'
                    },
                    {
                        title: '简体公告链接',
                        key: 'link',
                    },
                    {
                        title: '英文公告标题',
                        key: 'titleEn'
                    },
                    {
                        title: '英文公告链接',
                        key: 'linkEn'
                    },
                    {
                        title: '繁体公告标题',
                        key: 'titleCht',
                    },
                    {
                        title: '繁体公告链接',
                        key: 'linkCht'
                    },
                    {
                        title: '更新时间',
                        key: 'updatedTime'
                    },
                    {
                        title: '操作',
                        key: 'opreat',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: params.row.displayStatus === 1 ? 'dashed' : 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            let data = {
                                                announcementId: params.row.announcementId,
                                                displayStatus: params.row.displayStatus === 1 ? 0 : 1
                                            };
                                            extendApi.updateAnnouncement(data, (res) => {
                                                this.getfindAllAnnouncement();
                                                this.$Message.success({content: params.row.displayStatus === 1 ? '下架成功' : '上架成功'});
                                            }, (msg) => {
                                                this.$Message.error({content: msg});
                                            });
                                        }
                                    }
                                }, params.row.displayStatus === 1 ? '下架' : '上架'),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(upPlacard, {
                                                item: params.row
                                            });
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {
                                            extendApi.deleteAnnouncement({
                                                announcementId: params.row.announcementId
                                            }, (res) => {
                                                this.$Message.success({content: '取消成功'});
                                                this.getfindAllAnnouncement();
                                            }, (msg) => {
                                                this.$Message.error({content: msg});
                                            });
                                        }
                                    }
                                }, '删除公告')
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
