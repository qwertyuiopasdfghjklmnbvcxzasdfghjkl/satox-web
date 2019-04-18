<!-- 提币审核 -->
<template>
    <Row>
        <Col span="24">
            <Row>
                <!--<Card>-->
                <!---->
                <!--<Row>-->
                <!--<Col span="12">-->
                <!--<p>自动审核</p>-->
                <!--<p>-->
                <!--<span>待审核笔数：{{numberData.toBeAuditingAutoCount }}</span>-->
                <!--<span style="margin-left:40px;">已审核笔数：{{numberData.auditingFinishAutoCount }}</span>-->
                <!--</p>-->
                <!--</Col>-->
                <!--<Col span="12">-->
                <!--<p>人工审核</p>-->
                <!--<p>-->
                <!--<span>待审核笔数：{{numberData.toBeAuditingManualCount}}</span>-->
                <!--<span style="margin-left:40px;">已审核笔数：{{numberData.auditingFinishManualCount}}</span>-->
                <!--</p>-->
                <!--</Col>-->
                <!--</Row>-->
                <!--</Card>-->
                <Card style="margin-top:10px;">
                    <p slot="title">{{$t('finance.title')}}
                        <span class="refresh" @click="reshAll"></span>
                    </p>
                    <p style="margin-bottom: 20px">
                        币种：
                        <Select v-model="formData.symbol" style="width: 200px" :clearable="true" :placeholder="'请选择币种'">
                            <Option value="0">全部</Option>
                            <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                            </Option>
                        </Select>
                        创建时间：
                        <DatePicker type="datetime" v-model="formData.createdStart" placeholder="开始时间"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 200px"></DatePicker>
                        <DatePicker type="datetime" v-model="formData.createdEnd" placeholder="结束时间"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    style="width: 200px"></DatePicker>
                        用户名：
                        <Input v-model="formData.userName" clearable style="width: 200px"
                               :placeholder="'请输入用户名'"></Input>
                        数量：
                        <Select v-model="formData.amount" style="width: 200px" :placeholder="'请选择数量'">
                            <Option value="0">全部</Option>
                            <Option value="1">小于等于1</Option>
                            <Option value="2">大于1小于等于1000</Option>
                            <Option value="3">大于1000小于等于10000</Option>
                            <Option value="4">大于10000</Option>
                        </Select>
                        状态：
                        <Select v-model="formData.auditStatus" style="width: 200px" :placeholder="'请选择状态'">
                            <Option value="3">全部</Option>
                            <Option value="0">未审核</Option>
                            <Option value="1">审核通过</Option>
                            <Option value="2">审核不通过</Option>
                        </Select>
                        <Button type="primary" @click="curPage=1;getAuditing()">查询</Button>
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
    import check from './check';
    import financeApi from '../../api/finance';
    import currenyApi from '../../api/currency';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                columns: [
                    {key: 'createdTime', title: '创建时间'},
                    {key: 'userName', title: '用户名'},
                    {
                        key: 'withdrawAmount', title: '提现金额',
                        render: (h, params) => {
                            return h('div', [params.row.withdrawAmount, params.row.symbol]);
                        }
                    },
                    {key: 'phoneNumber', title: '电话'},
                    {
                        key: 'auditStatus', title: '状态',
                        render: (h, params) => {
                            return h('div', this.switchStaus(params.row.auditStatus));
                        }
                    },//0 未审核 1 审核不通过 2 审核通过
                    {
                        key: 'action', title: '操作', render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small', disabled: params.row.auditStatus !== 0},
                                    on: {
                                        click: () => {
                                            util.setDialog(check, {
                                                id: params.row.id,
                                                withdrawApplyId: params.row.withdrawApplyId,
                                                okCallback: () => {
                                                    this.getAuditing();
                                                }
                                            });
                                        }
                                    }
                                }, '审核')
                            ]);
                        }
                    }
                ],
                datas: [],
                // numberData: []
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
                        return '未审核';
                        break;
                    case 1:
                        return '审核不通过';
                        break;
                    case 2:
                        return '审核通过';
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
