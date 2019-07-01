<!-- 商品管理 -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <Card style="margin-top:10px;">
                    <p slot="title">{{$t('nav.xmgl')}}
                        <!--<span class="refresh" @click="reshAll"></span>-->
                    </p>
                    <p style="margin-bottom: 20px">
                        {{$t('common.yhm')}}：
                        <Input v-model="formData.username" clearable style="width: 120px"
                               :placeholder="$t('common.yhm')"></Input>
                        {{$t('mall.spmc')}}：
                        <Select v-model="formData.productName" style="width: 120px">
                            <Option value="0">{{$t('common.qb')}}</Option>
                            <Option value="中本硬件">{{$t('mall.zbyj')}}</Option>
                            <Option value="SATO 借记卡">{{$t('mall.zbjjk')}}</Option>
                        </Select>
                        <Button type="primary" @click="curPage=1;getAuditing()">{{$t('common.cx')}}</Button>
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
    import updata from './list/updata';
    import mallApi from '../../api/mall';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                size: 10,
                columns: [
                    {key: 'createdAt', title: this.$t('ieo.xmbh')},
                    {key: 'createdAt', title: this.$t('ieo.xmmc')},
                    {key: 'orderId', title: this.$t('common.bzdh')},
                    {key: 'username', title: this.$t('ieo.fxsl')},
                    {key: 'productName', title: this.$t('ieo.fxjg')},
                    {key: 'productQuantity', title: this.$t('ieo.mjmb')},
                    {key: 'paytype', title: this.$t('common.kssj')},
                    {key: 'symbolPrice', title: this.$t('common.jssj')},
                    {key: 'productPrice', title: this.$t('ieo.kksj')},
                    {key: 'totalPrice', title: this.$t('ieo.fbsj')},
                    {
                        key: 'state', title: this.$t('common.zt'),
                        render: (h, params) => {
                            return h('div', {
                                style: {
                                    color: this.switchColor(params.row.state)                                }
                            },this.switchStaus(params.row.state));
                        }
                    },
                    {key: 'receiverPhone', title: this.$t('ieo.zfs')},
                    {key: 'receiverPhone', title: this.$t('ieo.syfs')},
                    {key: 'updatedAt', title: this.$t('common.gxsj')},
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
                                                    this.getAuditing();
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
                    productName: '0',
                    createdStart: null,
                    createdEnd: null,
                    username: null,
                    orderId: null,
                    receiverName: null,
                    receiverPhone: null,
                    state: 7
                },
            };
        },
        created () {
            this.getAuditing();
        },
        methods: {
            reshAll () {
                this.formData = {
                    productName: '0',
                    createdStart: null,
                    createdEnd: null,
                    username: null,
                    orderId: null,
                    receiverName: null,
                    receiverPhone: null,
                    state: 0
                }
                this.curPage = 1
                this.getAuditing();
            },
            switchStaus (state) {//0：待支付 1：待确认 2：已付款未发货 3：已发货 4：已验收 5：已退回
                switch (state) {
                    case 0:
                        return this.$t('mall.dzf');
                    case 1:
                        return this.$t('mall.dqr');
                    case 2:
                        return this.$t('mall.yfk');
                    case 3:
                        return this.$t('mall.yfh');
                    case 4:
                        return this.$t('mall.yys');
                    case 5:
                        return this.$t('mall.yth');
                }
            },
            switchColor(i){
                switch (i) {
                    case 0:
                        return '#f3b138';
                    case 1:
                        return '#6ff35b';
                    case 2:
                        return '#3ba5f3';
                    case 3:
                        return '#5a60f3';
                    case 4:
                        return '#0a5ff3';
                    case 5:
                        return '#d14af3';
                }
            },
            getAuditing () {
                let D = JSON.stringify(this.formData);
                let data = JSON.parse(D);
                data.createdStart = data.createdStart ? util.dateToStr(new Date(data.createdStart)) : null;
                data.createdEnd = data.createdEnd ? util.dateToStr(new Date(data.createdEnd)) : null;
                data.state = data.state === 7 ? null : data.state;
                data.productName = data.productName === '0' ? null : data.productName;
                data.size = this.size;
                data.page = this.curPage;
                mallApi.getOrderList(data,
                    (res, total) => {
                        this.total = total;
                        this.datas = res;
                    });
            },
            switch (i) {
                switch (i) {
                    case '1':
                        this.formData.min = null;
                        this.formData.max = 1;
                        break;
                    case '2':
                        this.formData.max = 1000;
                        this.formData.min = 1;
                        break;
                    case '3':
                        this.formData.max = 10000;
                        this.formData.min = 1000;
                        break;
                    case '4':
                        this.formData.min = 10000;
                        this.formData.max = null;
                        break;
                    case '0':
                        this.formData.max = null;
                        this.formData.min = null;
                        break;
                    default:
                        this.formData.max = null;
                        this.formData.min = null;
                }
            },
            changePage (page) {
                this.curPage = page;
                this.getAuditing();
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
