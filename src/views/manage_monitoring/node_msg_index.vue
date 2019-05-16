<template>
    <div>
        <Card>
            <p slot="title">{{$t('monitoring.btbtbqks')}}</p>
            <Table :columns="columns2" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
        <Card style="margin-top:30px;">
            <p slot="title">{{$t('monitoring.ytftbqks')}}</p>
            <Table :columns="columns2" :data="data2"></Table>
            <Page :current="curPage1" :total="total1" @on-change="changePage1"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
        <Card style="margin-top:30px;">
            <p slot="title">{{$t('monitoring.omnitbqks')}}</p>
            <Table :columns="columns2" :data="data3"></Table>
        </Card>
        <Card style="margin-top:30px;">
            <p slot="title">EOS{{$t('monitoring.tbqks')}}</p>
            <Table :columns="columns2" :data="data4"></Table>
        </Card>
        <Card style="margin-top:30px;">
            <p slot="title">LTC{{$t('monitoring.tbqks')}}</p>
            <Table :columns="columns2" :data="data5"></Table>
        </Card>
    </div>
</template>
<script>
    import monitApi from '../../api/monitoring';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                curPage1: 1,
                total1: 0,
                data1: [],
                data2: [],
                data3: [],
                data4: [],
                data5: [],
                columns2: [
                    {
                        title: this.$t('monitoring.fwt'),
                        key: 'serviceDomain'
                    },
                    {
                        title: this.$t('monitoring.syjdip'),
                        key: 'nodeIp'
                    },
                    {
                        title: this.$t('monitoring.ysmdqk'),
                        key: 'scanningBlockNumber'
                    },
                    {
                        title: this.$t('monitoring.syjdzxqk'),
                        key: 'nodeLastBlockNumber'
                    },
                    {
                        title: this.$t('monitoring.zwlqks'),
                        key: 'mainNetLastBlockNumber'
                    },
                    {
                        title: this.$t('monitoring.smqkcz'),
                        key: 'scanDifference'
                    },
                    {
                        title: this.$t('monitoring.tbqkcz'),
                        key: 'difference'
                    },
                    {
                        title: this.$t('monitoring.ysmywlcz'),
                        key: 'scanOnlineDifference'
                    }
                ],
            };
        },
        created () {
            this.getfindBtcNodeList();
            this.getfindEthNodeList();
            this.getfindOMNINodeList();
            this.getfindEOSNodeList();
        },
        methods: {
            getfindBtcNodeList () {
                monitApi.findBtcNodeList(this.curPage, (res, total) => {
                    this.total = total;
                    this.data1 = res.data;
                });
            },
            getfindEthNodeList () {
                monitApi.findEthNodeList(this.curPage1, (res, total) => {
                    this.total1 = total;
                    this.data2 = res.data;
                });
            },
            getfindOMNINodeList () {
                monitApi.findOMNINNodeList((res, total) => {
                    this.data3.push(res);

                });
            },
            getfindEOSNodeList () {
                monitApi.findEOSNodeList((res, total) => {
                    this.data4.push(res);

                });
            },
            changePage (page) {
                this.curPage = page;
                this.getfindBtcNodeList();
            },
            changePage1 (page) {
                this.curPage1 = page;
                this.getfindEthNodeList();
            },
        }
    };
</script>
<style scoped>
    .ivu-row {
        height: 40px;
        line-height: 40px;
    }
</style>
