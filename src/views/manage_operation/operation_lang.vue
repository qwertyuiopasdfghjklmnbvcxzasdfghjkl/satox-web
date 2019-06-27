<template>
    <div class="operation_placard">
        <Card>
            <p slot="title">{{$t('nav.dyysz')}}</p>
            <Row>
                <Col span="16">
                    {{$t('operation.yymczw')}}
                    <Input v-model="formData.name" clearable style="width: 200px"
                           :placeholder="$t('common.qsr')"></Input>
                    {{$t('common.zt')}}
                    <Select v-model="formData.status" style="width: 200px">
                        <Option :value="0">{{$t('common.qb')}}</Option>
                        <Option :value="1">{{$t('exchange.xs')}}</Option>
                        <Option :value="2">{{$t('exchange.sx')}}</Option>
                    </Select>
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
    import add from './lang/add';
    import updata from './lang/updata';

    export default {
        data () {
            return {
                curPage: 1,
                size: 10,
                total: 0,
                formData: {
                    name: null,
                    status: 0,
                },
                columns1: [
                    {
                        title: 'ID',
                        key: 'languageTypeId'
                    },
                    {
                        title: this.$t('operation.yymczw'),
                        key: 'languageTypeCode',
                    },
                    {
                        title: this.$t('operation.yyzs'),
                        key: 'languageTypeName'
                    },
                    {
                        title: this.$t('common.zt'),
                        key: 'languageTypeState',
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    color: params.row.languageTypeState === 1 ? '' : '#1ac27f'
                                }},
                                params.row.languageTypeState === 1 ? this.$t('exchange.xs') : this.$t('exchange.sx')
                            );
                        }
                    },
                    {
                        title: this.$t('common.cjsj'),
                        key: 'createdAt'
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
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            let data = {
                                                languageTypeId: params.row.languageTypeId,
                                                languageTypeState: params.row.languageTypeState === 1 ? 2 : 1
                                            };
                                            extendApi.updataLang(data, (res) => {
                                                let msg = data.languageTypeState === 1 ? this.$t('operation.sxcg')
                                                    : this.$t('operation.xscg');
                                                this.$Message.success({content: msg});
                                                this.getList();
                                            }, (msg) => {
                                                this.$Message.error({content: msg});
                                            });
                                        }
                                    }
                                }, params.row.languageTypeState === 1 ? this.$t('exchange.sx') : this.$t('exchange.xs')),
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
                util.setDialog(add, {
                    okCallback: () => {
                        this.getList();
                    }
                });
            },
            getList () {
                let data = {
                    size: this.size,
                    page: this.curPage,
                    status: this.formData.status === 0 ? null : this.formData.status,
                    name: this.formData.name
                };
                extendApi.getLang(data, (res) => {
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
