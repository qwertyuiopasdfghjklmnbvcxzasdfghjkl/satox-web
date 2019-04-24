<template>
    <Card class="manage_exchange_login_record" style="width:700px;">
        <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        <Tabs>
            <TabPane :label="vm.$t('exchange.dljl')">
                <p slot="title">
                    {{vm.$t('exchange.dljl')}}
                </p>
                <Row>
                    <Col>{{vm.$t('exchange.zcsj')}}：{{dataTime.createdTime}}</Col>
                </Row>
                <Table :columns="columns1" :data="data1"></Table>
                <Page :current="curPage" :total="total" @on-change="changePage"
                      style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
            <TabPane :label="vm.$t('exchange.scsc')">
                <p slot="title">
                    {{vm.$t('exchange.scsc')}}
                    <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
                </p>
                <!-- <Table :columns="columns1" :data="data1"></Table> -->
                <Row>
                    <!-- <Col span="6" v-for="(data, index) in data1" :key="index">{{index+1}}. {{(data.market).replace(/(BTC|ETH|BARK)$/, function (m) { return ' / ' + m })}}</Col> -->
                    <Col span="6" v-for="(data, index) in data2" :key="index">
                        {{index+1}}. {{(data.market).replace(/(BTC|ETH|ATN)$/, function (m) { return ' / ' + m; })}}
                    </Col>
                </Row>
                <Page :current="curPage1" :total="total1" @on-change="changePage1"
                      style="text-align:center;margin-top:20px;"></Page>
            </TabPane>
        </Tabs>
    </Card>
</template>
<script>
    import currenyApi from '../../../api/currency';

    export default {
        props: ['userId'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                curPage: 1,
                total: 0,
                curPage1: 1,
                total1: 0,
                columns1: [
                    {
                        title: vm.$t('common.sj'),
                        key: 'loginTime'
                    },
                    {
                        title: vm.$t('exchange.ipdz'),
                        key: 'clientIp'
                    },
                    {
                        title: vm.$t('exchange.szd'),
                        key: 'loginLocation'
                    },
                    {
                        title: vm.$t('exchange.fs'),
                        key: 'clientType'
                    }
                ],
                data1: [],
                data2: [],
                dataTime: []
            };
        },
        created () {
            this.getLoginList();
            this.getfindUserInfo();
            this.collectData();
        },
        methods: {
            getfindUserInfo () {
                currenyApi.findUserInfo(this.userId, (res) => {
                    this.dataTime = res;
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            getLoginList () {
                currenyApi.findUserLoginLogList(this.curPage, {
                    userId: this.userId
                }, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getLoginList();
            },
            collectData () {
                console.log(this.userId);
                currenyApi.findUserCollectionMarketList(this.curPage1, {
                    userId: this.userId
                }, (res, total) => {
                    this.total1 = total;
                    this.data2 = res;
                });
            },
            changePage1 (page) {
                this.curPage1 = page;
                this.collectData();
            }
        }
    };
</script>

<style lang="less">
    .manage_exchange_login_record {
        .cion {
            text-align: right;
            font-size: 14px;
            cursor: pointer;
            margin-right: 10px;
            margin-top: 5px;
        }

        .title {
            font-size: 14px;
            font-weight: bold;
            margin-left: 8px;
        }
    }
</style>
