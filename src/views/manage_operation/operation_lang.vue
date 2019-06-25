<template>
    <div class="operation_placard">
        <Card>
            <p slot="title">{{$t('nav.dyysz')}}</p>
            <Row>
                <Col span="16">
                    {{$t('operation.yymczw')}}
                    <Input v-model="formData.value" clearable style="width: 200px"
                           :placeholder="$t('common.qsr')"></Input>
                    {{$t('common.zt')}}
                    <Select v-model="formData.type" style="width: 200px">
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
    import addI18n from './lang/add';
    import updataI18n from './lang/updata';

    export default {
        data () {
            return {
                curPage: 1,
                size: 10,
                total: 0,
                formData: {
                    value: null,
                    type: 0,
                },
                columns1: [
                    {
                        title: 'ID',
                        key: 'globalInfoId'
                    },
                    {
                        title: this.$t('operation.yymczw'),
                        key: 'cn',
                    },
                    {
                        title: this.$t('operation.yyzs'),
                        key: 'en'
                    },
                    {
                        title: this.$t('common.zt'),
                        key: 'cnzh'
                    },
                    {
                        title: this.$t('common.cjsj'),
                        key: 'korean'
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
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            // util.setDialog(updataI18n, {
                                            //     item: params.row,
                                            //     okCallback: () => {
                                            //         this.getList();
                                            //     }
                                            // });
                                        }
                                    }
                                }, this.$t('exchange.xs')),
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
