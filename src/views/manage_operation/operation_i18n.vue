<template>
    <div class="operation_placard">
        <Card>
            <p slot="title">{{$t('nav.gjhgl')}}</p>
            <Row>
                <Col span="16">
                    <Select v-model="formData.type" style="width: 200px">
                        <Option value="languageId">ID</Option>
                        <Option value="publicKey">Public_key</Option>
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
            <Page :current="curPage" :total="total" @on-change="changePage" :page-size="size"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>
<script>
    import extendApi from '../../api/extend';
    import util from '../../libs/util';
    import addI18n from './i18n/addI18n';
    import updataI18n from './i18n/updataI18n';
    import look from './i18n/look';

    export default {
        data () {
            return {
                curPage: 1,
                size: 10,
                total: 0,
                formData: {
                    value: null,
                    type: 'cn'
                },
                columns1: [
                    {
                        title: 'ID',
                        key: 'languageId'
                    },
                    {
                        title: 'parent_key',
                        key: 'parentKey'
                    },
                    {
                        title: 'Public_key',
                        key: 'publicKey'
                    },
                    {
                        title: this.$t('operation.zw'),
                        key: 'cn',
                    },
                    {
                        title: this.$t('operation.yw'),
                        key: 'en',
                        render: (h, params) => {
                            return h('div', params.row.en || '-')
                        }
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
                                                lang: this.langList,
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
                                            util.setDialog(look, {
                                                lang: this.langList,
                                                item: params.row
                                            });
                                        }
                                    }
                                }, this.$t('kyc.ckxq')),
                            ]);
                        }
                    }
                ],
                data1: [],
                langList: []
            };
        },
        created () {
            this.getList();
            this.getLang();
        },
        methods: {
            addMarket () {
                util.setDialog(addI18n, {
                    item: this.langList,
                    okCallback: () => {
                        this.getList();
                    }
                });
            },
            getList () {
                let datas = {
                    size: this.size,
                    page: this.curPage,
                };
                datas[this.formData.type] = this.formData.value;
                extendApi.findI18nList(datas, (res, total) => {
                    this.data1 = res;
                    this.total = total;
                });
            },
            getLang () {
                let data = {
                    size: 999,
                    page: 1,
                };
                extendApi.getLang(data, (res) => {
                    this.langList = res;
                });
            },
            changePage (e) {
                console.log(e);
                this.curPage = e;
                this.getList();
            }
        }
    };
</script>
