<!-- 商品管理 -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <Card style="margin-top:10px;">
                    <p slot="title">{{$t('nav.spgl')}}
                        <Button type="primary" @click="add()" style="margin: 4px 0">{{$t('common.tj')}}</Button>
                    </p>
                    <Table :columns="columns" :data="datas"></Table>
                    <Page :current="curPage" :total="total" @on-change="changePage" :page-size="size"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
        </Col>
    </Row>
</template>

<script>
    import util from '../../libs/util';
    import updata from './product/updata';
    import add from './product/add';
    import mallApi from '../../api/mall';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                size: 10,
                columns: [
                    {key: 'productId', title: this.$t('mall.cpid')},
                    {
                        key: 'coverImgPath', title: this.$t('mall.tp'), render: (h, params) => {
                            let src = util.baseURL+params.row.coverImgPath
                            return h('img', {
                                attrs: {
                                    src: src
                                },
                                style: {
                                    height: '40px'
                                }
                            });
                        }
                    },
                    {key: 'discountPrice', title: this.$t('mall.zkj')},
                    {key: 'originalPrice', title: this.$t('mall.yj')},
                    {key: 'productName', title: this.$t('mall.mc')},
                    {key: 'productNameEn', title: this.$t('mall.ywm')},
                    {key: 'productDescription', title: this.$t('mall.jj')},
                    {key: 'productDescriptionEn', title: this.$t('mall.ywjj')},
                    {key: 'createdAt', title: this.$t('mall.cjsj')},
                    {
                        key: 'action', title: this.$t('common.cz'), render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
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
                                }, this.$t('common.xg'))
                            ]);
                        }
                    }
                ],
                datas: [],
                formData: {
                    userName: '',
                    symbol: '0',
                    amount: '0',
                    createdStart: null,
                    createdEnd: null,
                    min: null,
                    max: null,
                    auditStatus: '3'
                },
                symbolList: []
            };
        },
        created () {
            this.getList();
        },
        methods: {
            add () {
                util.setDialog(add, {
                    okCallback: () => {
                        this.getList();
                    }
                });
            },
            getList () {
                let data = {
                    page: this.curPage,
                    size: this.size
                };
                mallApi.productsList(data,
                    (res, total) => {
                        this.total = total;
                        this.datas = res;
                    });
            },
            changePage (page) {
                this.curPage = page;
                this.getList();
            }
        }
    };
</script>

<style lang="less" scoped>
    .refresh {
        width: 49px;
        height: 24px;
        background: url(../../images/frsh.png) center/cover no-repeat;
        background-size: contain;
        cursor: pointer;
        color: #2d8cf0;
    }

    .ivu-card-head-inner, .ivu-card-head p {
        display: flex !important;
        justify-content: space-between !important;
        height: 40px !important;
        line-height: 40px !important;
    }
</style>
