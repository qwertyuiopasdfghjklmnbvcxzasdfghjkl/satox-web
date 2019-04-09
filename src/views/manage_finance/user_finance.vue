<template>
    <Row style="margin-top:10px;">
        <Card>
            <p slot="title">用户资产查询</p>
            <p style="margin-bottom: 20px">
                币种：
                <Select v-model="formData.symbol" style="width: 200px" :clearable="true">
                    <Option v-for="item in symbolList" :value="item.symbol" :key="item.symbol">{{ item.symbol }}
                    </Option>
                </Select>
                用户名：
                <Input v-model="formData.username" clearable style="width: 200px"></Input>
                数量：
                <Select v-model="amount" style="width: 200px">
                    <Option value="0">全部</Option>
                    <Option value="1">小于等于1</Option>
                    <Option value="2">大于1小于等于1000</Option>
                    <Option value="3">大于1000小于等于10000</Option>
                    <Option value="4">大于10000</Option>
                </Select>
                钱包类型：
                <Select v-model="formData.type" style="width: 200px">
                    <Option value="">全部</Option>
                    <Option value="1">主钱包</Option>
                    <Option value="2">非主钱包</Option>
                </Select>
                <Button type="primary" @click="curPage=1;getfindUser()">查询</Button>
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

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                size: 20,
                columns: [
                    {title: '用户名', key: 'username'},
                    {title: '币种', key: 'symbol'},
                    {
                        title: '钱包类型', key: 'type',
                        render: (h, params) => {
                            return h('div', params.row.type === 1 ? '主钱包' : '非主钱包');
                        }
                    },
                    {title: '总金额', key: 'totalBalance'},
                    {title: '可用金额', key: 'availableBalance'},
                    {title: '冻结金额', key: 'frozenBalance'},
                    {title: '更新时间', key: 'updatedAt'},
                ],
                data: [],
                formData: {
                    username: '',
                    symbol: '',
                    type: '',
                    max: null,
                    min: null
                },
                amount: '0',
                symbolList: null
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
                    default:
                        this.formData = {
                            max: null,
                            min: null
                        };
                }
                this.formData.page = this.curPage;
                this.formData.size = this.size;
                let data = this.formData;
                financeApi.finduserAccountList(data, (res, total) => {
                    this.total = total;
                    this.data = res;
                });
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
