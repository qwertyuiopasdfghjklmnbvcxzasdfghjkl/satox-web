<template>
    <div class="operation_placard">
        <Card>
            <p slot="title">{{$t('nav.gjhgl')}}</p>
            <Row>
                <Col span="16">
                    <Select v-model="formData.type" style="width: 200px">
                        <Option value="id">ID</Option>
                        <Option value="Public_key">Public_key</Option>
                        <Option value="cn">{{$t('operation.zw')}}</Option>
                        <Option value="en">{{$t('operation.yw')}}</Option>
                    </Select>
                    <Input v-model="formData.value" clearable style="width: 200px"
                           :placeholder="$t('common.qsr')"></Input>
                    <Button type="primary" @click="curPage=1;getList()">{{$t('common.cx')}}</Button>
                </Col>
                <Col span="8" style="text-align: right">
                    <Button type="primary" @click="addMarket">{{$t('common.xz')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1" style="margin-top: 10px"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>
<script>
    import extendApi from '../../api/extend';
    import util from '../../libs/util';
    import addI18n from './addI18n';
    import updataI18n from './updataI18n';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                formData: {
                    type: 'id',
                    value: ''
                },
                columns1: [
                    {
                        title: 'ID',
                        key: 'sequence'
                    },
                    {
                        title: 'Public_key',
                        key: 'title'
                    },
                    {
                        title: this.$t('operation.zw'),
                        key: 'link',
                    },
                    {
                        title: this.$t('operation.yw'),
                        key: 'titleEn'
                    },
                    {
                        title: this.$t('operation.zwft'),
                        key: 'linkEn'
                    },
                    {
                        title: this.$t('operation.hy'),
                        key: 'titleCht',
                    },
                    {
                        title: this.$t('operation.ry'),
                        key: 'linkCht'
                    },
                    {
                        title: this.$t('operation.dy'),
                        key: 'updatedTime'
                    },
                    {
                        title: this.$t('operation.xbyy'),
                        key: 'updatedTime'
                    },
                    {
                        title: this.$t('operation.fy'),
                        key: 'updatedTime'
                    },
                    {
                        title: this.$t('operation.ydly'),
                        key: 'updatedTime'
                    },
                    {
                        title: this.$t('operation.alby'),
                        key: 'updatedTime'
                    },
                    {
                        title: this.$t('operation.sm'),
                        key: 'updatedTime'
                    },
                    {
                        title: this.$t('common.gxsj'),
                        key: 'updatedTime'
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
                                            util.setDialog(updataI18n, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('common.xg')),
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
            addMarket () {
                util.setDialog(addI18n, {
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
            changePage (e) {
                this.curPage = e.page;
                this.getList();
            }
        }
    };
</script>
