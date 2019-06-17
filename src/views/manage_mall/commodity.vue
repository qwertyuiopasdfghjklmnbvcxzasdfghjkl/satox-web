<!-- 商品管理 -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <Card style="margin-top:10px;">
                    <p slot="title">{{$t('nav.spgl')}}
                        <span class="refresh" @click="reshAll"></span>
                    </p>
                    <p style="margin-bottom: 20px">
                        {{$t('mall.spmc')}}：
                        <Select v-model="formData.symbol" style="width: 120px">
                            <Option value="0">{{$t('common.qb')}}</Option>
                            <Option value="1">{{$t('mall.zbyj')}}</Option>
                            <Option value="2">{{$t('mall.zbjjk')}}</Option>
                        </Select>
                        {{$t('common.yhm')}}：
                        <Input v-model="formData.userName" clearable style="width: 120px"
                               :placeholder="$t('common.yhm')"></Input>
                        {{$t('mall.ddid')}}：
                        <Input v-model="formData.userName" clearable style="width: 120px"
                               :placeholder="$t('mall.ddid')"></Input>
                        {{$t('common.xm')}}：
                        <Input v-model="formData.userName" clearable style="width: 120px"
                               :placeholder="$t('common.xm')"></Input>
                        {{$t('common.sjh')}}：
                        <Input v-model="formData.userName" clearable style="width: 120px"
                               :placeholder="$t('common.sjh')"></Input>
                        {{$t('common.cjsj')}}：
                        <DatePicker type="datetime" v-model="formData.createdStart" :placeholder="$t('common.kssj')"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 160px"></DatePicker>
                        <DatePicker type="datetime" v-model="formData.createdEnd" :placeholder="$t('common.jssj')"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 160px"></DatePicker>
                        {{$t('common.zt')}}：
                        <Select v-model="formData.auditStatus" style="width: 120px">
                            <Option value="3">{{$t('common.qb')}}</Option>
                            <Option value="0">{{$t('mall.yfkdcl')}}</Option>
                            <Option value="2">{{$t('mall.clz')}}</Option>
                            <Option value="1">{{$t('mall.yqs')}}</Option>
                        </Select>
                        <Button type="primary" @click="curPage=1;getAuditing()">{{$t('common.cx')}}</Button>
                    </p>
                    <Table :columns="columns" :data="datas"></Table>
                    <Page :current="curPage" :total="total" @on-change="changePage"
                          style="text-align:center;margin-top:20px;"></Page>
                </Card>
            </Row>
        </Col>
    </Row>
</template>

<script>
    import util from '../../libs/util';
    import updata from './updata_commodity';
    import financeApi from '../../api/finance';
    import currenyApi from '../../api/currency';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                columns: [
                    {key: 'createdTime', title: this.$t('common.cjsj')},
                    {key: 'createdTime', title: 'ID'},
                    {key: 'createdTime', title: this.$t('mall.ddid')},
                    {key: 'userName', title: this.$t('common.yhm')},
                    {key: 'createdTime', title: this.$t('mall.spmc')},
                    {key: 'createdTime', title: this.$t('common.sl')},
                    {key: 'createdTime', title: this.$t('mall.fkfs')},
                    {key: 'createdTime', title: this.$t('mall.spjg')},
                    {key: 'createdTime', title: this.$t('mall.spje')},
                    {key: 'createdTime', title: this.$t('mall.ddzje')},
                    {key: 'createdTime', title: this.$t('common.xm')},
                    {key: 'createdTime', title: this.$t('common.sjh')},
                    {key: 'createdTime', title: 'Email'},
                    {key: 'createdTime', title: this.$t('mall.yjdz')},
                    {
                        key: 'auditStatus', title: this.$t('common.zt'),
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.auditStatus));
                        }
                    },//已付款待处理、处理中、已签收
                    {key: 'createdTime', title: this.$t('common.gxsj')},
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
            this.getAuditing();
            this.getdataSymbol();
        },
        methods: {
            reshAll () {
                this.getAuditing();
            },
            getdataSymbol () {
                currenyApi.findAllValidSymbolList((res) => {
                    this.symbolList = res;
                });
            },
            switchStaus (state) {//0 未审核 1 审核不通过 2 审核通过
                switch (state) {
                    case 0:
                        return this.$t('common.wsh');
                        break;
                    case 1:
                        return this.$t('common.shbtg');
                        break;
                    case 2:
                        return this.$t('common.shtg');
                        break;
                }
            },
            getAuditing () {
                this.switch(this.formData.amount);
                let D = JSON.stringify(this.formData);
                let data = JSON.parse(D);
                data.createdStart = data.createdStart ? util.dateToStr(new Date(data.createdStart)) : null;
                data.createdEnd = data.createdEnd ? util.dateToStr(new Date(data.createdEnd)) : null;
                data.symbol = data.symbol === '0' ? null : data.symbol;
                data.auditStatus = data.auditStatus === '3' ? null : data.auditStatus;
                data.auditType = '';
                financeApi.getAuditingList(this.curPage, data,
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
