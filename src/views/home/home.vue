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
                        :intro-text="$t('home.zyh')"
                ></infor-card>
            </Col>

            <Col span="6">
                <infor-card
                        id-name="registerAmountDaily"
                        :end-val="data1.registerAmountDaily || 0"
                        iconType="person-add"
                        color="#2d8cf0"
                        :intro-text="$t('home.jrxzyh')"
                ></infor-card>
            </Col>

            <Col span="6">
                <infor-card
                        id-name="onlineUserAmount"
                        :end-val="data2.onlineUserAmount || 0"
                        iconType="mouse"
                        color="#ffd572"
                        :intro-text="$t('home.dqzxyh')"
                ></infor-card>
            </Col>
            <Col span="6">
                <infor-card
                        id-name="loginAmountDaily"
                        :end-val="data1.loginAmountDaily || 0"
                        iconType="coffee"
                        color="#f25e43"
                        :intro-text="$t('home.jrdlyh')"
                ></infor-card>
            </Col>
        </Row>

        <Row style="margin-top: 2rem">

            <Col span="6">
                <infor-card
                        id-name="visit_count"
                        :end-val="data3.verifyWaitFirstCheck || 0"
                        iconType="lock-combination"
                        color="#64d572"
                        :iconSize="50"
                        :intro-text="$t('home.kycdsh')"
                ></infor-card>
            </Col>
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
