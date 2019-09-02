<template>
    <Row style="margin-top:10px;">
        <Card>
            <p slot="title">
                {{$t('finance.yhzccx')}}
                <Button type="primary" @click="download()">{{$t('systemlog.dc')}}</Button>
            </p>
            <p style="margin-bottom: 20px">
                {{$t('common.bz')}}：
                <Select v-model="formData.symbol" style="width: 200px" :clearable="true">
                    <Option value="0">{{$t('common.qb')}}</Option>
                    <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                    </Option>
                </Select>
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
                {{$t('common.qblx')}}：
                <Select v-model="formData.type" style="width: 200px">
                    <Option value="0">{{$t('common.qb')}}</Option>
                    <Option value="1">{{$t('common.zqb')}}</Option>
                    <Option value="2">{{$t('common.fzqb')}}</Option>
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
                size: 20,
                columns: [
                    {title: this.$t('common.yhm'), key: 'username'},
                    {title: this.$t('common.bz'), key: 'symbol'},
                    {
                        title: this.$t('common.qblx'), key: 'type',
                        render: (h, params) => {
                            return h('div', params.row.type === 1 ? this.$t('common.zqb') : this.$t('common.fzqb'));
                        }
                    },
                    {title: this.$t('common.zje'), key: 'totalBalance'},
                    {title: this.$t('common.kyje'), key: 'availableBalance'},
                    {title: this.$t('common.djje'), key: 'frozenBalance'},
                    {title: this.$t('common.gxsj'), key: 'updatedAt'},
                ],
                data: [],
                formData: {
                    username: '',
                    symbol: '0',
                    type: '0',
                    max: null,
                    min: null
                },
                amount: '0',
                symbolList: null,
                exportDocPrames: {}
            };
        },
        created () {
            this.getdataSymbol();
            // this.getfindUser();
        },
        methods: {
            getdataSymbol () {
                currenyApi.findAllValidSymbolList((res) => {
                    this.symbolList = res;
                });
            },
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
                let D = JSON.stringify(this.formData)
                let data = JSON.parse(D);
                data.symbol = data.symbol === '0' ? null : data.symbol;
                data.type = data.type === '0' ? null : data.type;
                this.exportDocPrames = data
                financeApi.finduserAccountList(data, (res, total) => {
                    this.total = total;
                    this.data = res;
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getfindUser();
            },
            download(){
                let data = ['export=1']
                for (let i in this.exportDocPrames) {
                    let v = this.exportDocPrames[i] ? this.exportDocPrames[i] : ''
                    data.push(i+'='+v)
                }
                window.location.href = `${util.baseURL}api/bm/monitor/userAccount/list?${data.join('&')}`
            }
        }
    };
</script>

<style scoped>

</style>
