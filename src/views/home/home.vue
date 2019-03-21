<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row>
            <Col span="6">
                <infor-card
                        id-name="allUserAmount"
                        :end-val="data2.allUserAmount || 0"
                        iconType="person"
                        color="#64d572"
                        :iconSize="50"
                        intro-text="总用户"
                ></infor-card>
            </Col>

            <Col span="6">
                <infor-card
                        id-name="registerAmountDaily"
                        :end-val="data1.registerAmountDaily || 0"
                        iconType="person-add"
                        color="#2d8cf0"
                        intro-text="今日新增用户"
                ></infor-card>
            </Col>

            <Col span="6">
                <infor-card
                        id-name="onlineUserAmount"
                        :end-val="data2.onlineUserAmount || 0"
                        iconType="mouse"
                        color="#ffd572"
                        intro-text="当前在线用户"
                ></infor-card>
            </Col>
            <Col span="6">
                <infor-card
                        id-name="loginAmountDaily"
                        :end-val="data1.loginAmountDaily || 0"
                        iconType="coffee"
                        color="#f25e43"
                        intro-text="今日登陆用户"
                ></infor-card>
            </Col>
        </Row>


        <!--<Row style="margin-top: 2rem">-->
            <!--<Col span="6">-->
                <!--<infor-card-->
                        <!--id-name="btcTransactionAmount"-->
                        <!--:end-val="data2.btcTransactionAmount || 0"-->
                        <!--iconType="social-bitcoin"-->
                        <!--color="#1dd5f3"-->
                        <!--:iconSize="50"-->
                        <!--intro-text="今日BTC交易量"-->
                <!--&gt;</infor-card>-->
            <!--</Col>-->
            <!--<Col span="6">-->
                <!--<infor-card-->
                        <!--id-name="ethTransactionAmount"-->
                        <!--:end-val="data2.ethTransactionAmount || 0"-->
                        <!--iconType="ios-shuffle-strong"-->
                        <!--color="#8424bf"-->
                        <!--intro-text="今日ETH交易量"-->
                <!--&gt;</infor-card>-->
            <!--</Col>-->

            <!--<Col span="6">-->
                <!--<infor-card-->
                        <!--id-name="usdtTransactionAmount"-->
                        <!--:end-val="data2.usdtTransactionAmount || 0"-->
                        <!--iconType="arrow-graph-up-right"-->
                        <!--color="#ff72a6"-->
                        <!--intro-text="今日USDT交易量"-->
                <!--&gt;</infor-card>-->
            <!--</Col>-->
        <!--</Row>-->


        <Row style="margin-top: 2rem">

            <Col span="6">
                <infor-card
                        id-name="visit_count"
                        :end-val="data3.verifyWaitFirstCheck || 0"
                        iconType="lock-combination"
                        color="#64d572"
                        :iconSize="50"
                        intro-text="KYC待审核"
                ></infor-card>
            </Col>
            <!--<Col span="6">-->
                <!--<infor-card-->
                        <!--id-name="waitHandleAppealAmount"-->
                        <!--:end-val="data3.waitHandleAppealAmount || 0"-->
                        <!--iconType="ios-compose"-->
                        <!--color="#2d8cf0"-->
                        <!--intro-text="OTC待处理申诉"-->
                <!--&gt;</infor-card>-->
            <!--</Col>-->

            <!--<Col span="6">-->
                <!--<infor-card-->
                        <!--id-name="shop"-->
                        <!--:end-val="data3.shop || 0"-->
                        <!--iconType="ios-box"-->
                        <!--color="#ffba72"-->
                        <!--intro-text="商家待审核"-->
                <!--&gt;</infor-card>-->
            <!--</Col>-->

        </Row>
    </div>

</template>

<script>
    import inforCard from './components/inforCard.vue';
    import kycAPI from '../../api/kyc';
    import otcApi from '../../api/otc';
    import currenyApi from '../../api/currency';

    export default {
        components: {
            inforCard
        },
        data () {
            return {
                data1: {
                    allUserAmount: 0,
                    registerAmountDaily: 0,
                    onlineUserAmount: 0,
                    loginAmountDaily: 0
                },
                data2: {},
                data3: {}
            };
        },
        computed: {},
        created () {
            this.getStatusCount();
            this.getfindDataStatistic();
            this.getRequestManage();
            this.getfindStatisticData();
            this.getfindUserDataList();
        },
        methods: {
            getStatusCount () {
                kycAPI.showReviewStatusCount((res) => {
                    this.data3.verifyWaitFirstCheck = Number(res.data.verifyWaitFirstCheck);
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            getfindDataStatistic () {
                otcApi.findDataStatistic((res) => {
                    this.data3.waitHandleAppealAmount = Number(res.data.waitHandleAppealAmount);
                });
            },
            getRequestManage () {
                otcApi.listAppealRequestManage(1, {}, (res, total) => {
                    this.data3.shop = total;
                });
            },
            getfindStatisticData () {
                currenyApi.findStatisticData((res) => {
                    this.data2 = [res][0];
                });
            },
            getfindUserDataList () {
                currenyApi.findUserDataList((res) => {
                    this.data1 = res;
                });
            }
        }
    };
</script>
