<template>
    <div class="operation_placard">
        <Card>
            <p slot="title">{{$t('nav.gjhgl')}}</p>
            <Row>
                <Col span="16">
                    <!--<Select v-model="formData.type" style="width: 200px">-->
                        <!--<Option value="globalInfoId">ID</Option>-->
                        <!--<Option value="publicKey">Public_key</Option>-->
                        <!--<Option value="cn">{{$t('operation.zw')}}</Option>-->
                        <!--<Option value="en">{{$t('operation.yw')}}</Option>-->
                    <!--</Select>-->

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
                size: 10,
                total: 0,
                formData: {
                    value: null
                },
                columns1: [
                    {
                        title: 'ID',
                        key: 'globalInfoId'
                    },
                    {
                        title: 'Public_key',
                        key: 'publicKey'
                    },
                    {
                        title: 'parent_key',
                        key: 'parentKey'
                    },
                    {
                        title: this.$t('operation.zw'),
                        key: 'cn',
                    },
                    {
                        title: this.$t('operation.yw'),
                        key: 'en'
                    },
                    {
                        title: this.$t('operation.zwft'),
                        key: 'cnzh'
                    },
                    {
                        title: this.$t('operation.hy'),
                        key: 'korean'
                    },
                    {
                        title: this.$t('operation.ry'),
                        key: 'japanese'
                    },
                    {
                        title: this.$t('operation.dy'),
                        key: 'german'
                    },
                    {
                        title: this.$t('operation.xbyy'),
                        key: 'spanish'
                    },
                    {
                        title: this.$t('operation.fy'),
                        key: 'french'
                    },
                    {
                        title: this.$t('operation.ydly'),
                        key: 'italian'
                    },
                    {
                        title: this.$t('operation.alby'),
                        key: 'arabic'
                    },
                    {
                        title: this.$t('operation.sm'),
                        key: 'remark'
                    },
                    {
                        title: this.$t('common.gxsj'),
                        key: 'updatedAt'
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
                let data = {
                    size: this.size,
                    page: this.curPage,
                    keyword: this.formData.value
                };
                extendApi.findI18nList(data, (res) => {
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
