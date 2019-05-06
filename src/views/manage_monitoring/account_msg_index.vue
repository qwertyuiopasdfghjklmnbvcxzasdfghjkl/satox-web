<template>
    <div style="width: 1700px;">
        <Card>
            <p slot="title">{{$t('finance.sxfzh')}}</p>
            <Row style="margin-bottom: 20px;">
                <Col span="1">{{$t('common.bz')}}：</Col>
                <Col span="5">
                    <Input v-model="symbol" style="width:200px;"/>
                </Col>
                <Col span="2">{{$t('common.yhm')}}：</Col>
                <Col span="2">
                    <Input v-model="username"   style="width:100px;"/>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="curPage=1;getAccountsList()">{{$t('common.cx')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
        </Card>
         <Card style="margin-top:30px;">
            <p slot="title" >{{$t('monitoring.tbzzh')}}</p>
            <Row style="margin-bottom: 20px;">
                <Col span="1">{{$t('common.bz')}}：</Col>
                <Col span="5">
                    <Input v-model="symbol1"  style="width:200px;"/>
                </Col>
                <Col span="2">{{$t('common.yhm')}}：</Col>
                <Col span="2">
                    <Input v-model="username1"   style="width:100px;"/>
                </Col>
                <Col span="2">
                 <Button type="primary" @click="curPage=1;getPoolsList()">{{$t('common.cx')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns2" :data="data2"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>
<script>
import monitApi from '../../api/monitoring'
    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                curPage1: 1,
                symbol: '',
                username: '',
                symbol1: '',
                username1: '',
                total1: 0,
                columns1: [
                    {
                        title: this.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: this.$t('common.yhm'),
                        key: 'username'
                    },
                    {
                        title: this.$t('system.yhid'),
                        key: 'accountId'
                    },
                    {
                        title: this.$t('monitoring.zhid'),
                        key: 'userId'
                    },
                    {
                        title: this.$t('system.qbdz'),
                        key: 'address'
                    },
                    {
                        title: this.$t('monitoring.zhbzje'),
                        key: 'accountTotalBalance'
                    },
                    {
                        title: this.$t('monitoring.zhbkyje'),
                        key: 'accountAvailableBalance'
                    },
                    {
                        title: this.$t('monitoring.bcbzje'),
                        key: 'coinPoolTotalBalance'
                    },
                    {
                        title: this.$t('monitoring.bcbkyje'),
                        key: 'coinPoolAvailableBalance'
                    },
                    {
                        title: this.$t('monitoring.qklssjje'),
                        key: 'actualBalance'
                    }
                ],
                data1: [],
                columns2: [
                    {
                        title: this.$t('common.bz'),
                        key: 'symbol'
                    },
                    {
                        title: this.$t('common.yhm'),
                        key: 'username'
                    },
                    {
                        title: this.$t('system.yhid'),
                        key: 'accountId'
                    },
                    {
                        title: this.$t('monitoring.zhid'),
                        key: 'userId'
                    },
                    {
                        title: this.$t('system.qbdz'),
                        key: 'address'
                    },
                    {
                        title: this.$t('monitoring.zhbzje'),
                        key: 'accountTotalBalance'
                    },
                    {
                        title: this.$t('monitoring.zhbkyje'),
                        key: 'accountAvailableBalance'
                    },
                    {
                        title: this.$t('monitoring.bcbzje'),
                        key: 'coinPoolTotalBalance'
                    },
                    {
                        title: this.$t('monitoring.bcbkyje'),
                        key: 'coinPoolAvailableBalance'
                    },
                    {
                        title: this.$t('monitoring.qklssjje'),
                        key: 'actualBalance'
                    }
                ],
                data2: []
            }
        },
        created () {
            this.getAccountsList()
            this.getPoolsList()
        },
        methods: {
            getAccountsList () {
                monitApi.findAdminAccountsList(this.curPage,{
                    symbol: this.symbol || '',
                    username: this.username || '',
                }, (res, total) => {
                    this.total = total
                    this.data1 = res
                })
            },
            getPoolsList () {
                monitApi.findAdminCoinPoolsList(this.curPage1, {
                    symbol: this.symbol1 || '',
                    username: this.username1 || '',
                }, (res, total) => {
                    this.total1 = total
                    this.data2 = res
                })
            },
            changePage (page) {
                this.curPage = page
                this.getAccountsList()
            },
            changePage1 (page) {
                this.curPage1 = page
                this.getPoolsList()
            }
        }
    }
</script>
<style scoped>
.ivu-row{height: 40px;line-height: 40px;}
</style>
