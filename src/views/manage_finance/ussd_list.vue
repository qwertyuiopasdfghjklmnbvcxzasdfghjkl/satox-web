<template>
    <Row style="margin-top:10px;">
        <Card>
            <p slot="title">{{$t('finance.ussdtxjl')}}</p>
            <p style="margin-bottom: 20px">
                {{$t('common.cjsj')}}：
                <DatePicker type="datetime" v-model="formData.createdStart" :placeholder="$t('common.kssj')"
                            format="yyyy-MM-dd HH:mm:ss"
                            style="width: 200px"></DatePicker>
                <DatePicker type="datetime" v-model="formData.createdEnd" :placeholder="$t('common.jssj')"
                            format="yyyy-MM-dd HH:mm:ss"
                            style="width: 200px"></DatePicker>
                {{$t('common.yhm')}}：
                <Input v-model="formData.username" clearable style="width: 200px" :placeholder="$t('common.qsryhm')"></Input>
                {{$t('common.sl')}}：
                <Select v-model="amount" style="width: 200px">
                    <Option value="0">{{$t('common.qb')}}</Option>
                    <Option value="1">{{$t('common.xy1')}}</Option>
                    <Option value="2">{{$t('common.dy1xy1000')}}</Option>
                    <Option value="3">{{$t('common.dy1000xy10000')}}</Option>
                    <Option value="4">{{$t('common.dy10000')}}</Option>
                </Select>
                {{$t('finance.txzt')}}：
                <Select v-model="formData.status" style="width: 200px">
                    <Option value="0">{{$t('common.qb')}}</Option>
                    <Option value="1">{{$t('common.jxz')}}</Option>
                    <Option value="2">{{$t('common.ywc')}}</Option>
                    <Option value="3">{{$t('common.yqx')}}</Option>
                    <Option value="4">{{$t('common.yjj')}}</Option>
                </Select>
                <Button type="primary" @click="curPage=1;getfindUser()">{{$t('common.cx')}}</Button>
            </p>
            <Table ref="test2" :columns="columns" :data="data"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  :page-size="size" style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    import financeApi from '../../api/finance';
    import currenyApi from '../../api/currency';
    import util from '../../libs/util';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                size: 10,
                columns: [
                    {title: this.$t('finance.txsqid'), key: 'transferId'},
                    {title: this.$t('common.yhm'), key: 'username'},
                    {title: this.$t('common.bz'), key: 'symbol'},
                    {title: this.$t('exchange.txsl'), key: 'quantity'},
                    {title: this.$t('finance.txsxf'), key: 'fee'},
                    {
                        title: this.$t('finance.txzt'), key: 'status',
                        render: (h, params) => {
                            return h('div', this.state(''+ params.row.status));
                        }
                    },
                    // {title: this.$t('finance.sbyy'), key: 'remarks'},
                    {title: this.$t('common.cjsj'), key: 'createdAt'},
                    {title: this.$t('monitoring.jywcsj'), key: 'completedAt'},
                    // {title: this.$t('finance.jdthid'), key: 'transferId'},
                ],
                data: [],
                formData: {
                    username: '',
                    status: '0',
                    max: null,
                    min: null,
                    createdStart: null,
                    createdEnd: null,
                },
                amount: '0',
                symbolList: null
            };
        },
        created () {
            this.getfindUser();
        },
        methods: {
            getfindUser () {
                switch (this.amount) {
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
                }
                this.formData.page = this.curPage;
                this.formData.size = this.size;
                this.formData.symbol = 'ussd';
                let D = JSON.stringify(this.formData)
                let data = JSON.parse(D);
                data.createdStart = data.createdStart ? util.dateToStr(new Date(data.createdStart)) : null;
                data.createdEnd = data.createdEnd ? util.dateToStr(new Date(data.createdEnd)) : null;
                data.status = data.status === '0' ? null : data.status;
                financeApi.withdrawsList(data, (res, total) => {
                    this.total = total;
                    this.data = res;
                });
            },
            state(i){
                switch (i) {
                    case '1':return this.$t('common.jxz');
                    case '2':return this.$t('common.ywc');
                    case '3':return this.$t('common.yqx');
                    case '4':return this.$t('common.yjj');
                }
            },
            changePage (page) {
                this.curPage = page;
                this.getfindUser();
            }
        }
    };
</script>

<style scoped>

</style>
