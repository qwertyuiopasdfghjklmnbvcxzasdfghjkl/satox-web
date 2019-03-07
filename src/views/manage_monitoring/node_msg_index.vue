<template>
    <div>
        <Card>
            <p slot="title">比特币同步区块数</p>
            <Table :columns="columns2" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
        <Card style="margin-top:30px;">
            <p slot="title">以太坊同步区块数</p>
            <Table :columns="columns2" :data="data2"></Table>
            <Page :current="curPage1" :total="total1" @on-change="changePage1"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
        <Card style="margin-top:30px;">
            <p slot="title">OMNI同步区块数</p>
            <Table :columns="columns2" :data="data3"></Table>
        </Card>
        <Card style="margin-top:30px;">
            <p slot="title">MBT同步区块数</p>
            <Table :columns="columns2" :data="data4"></Table>
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
                columns1: [
                    {
                        title: '服务名',
                        key: 'serviceDomain'
                    },
                    {
                        title: '私有节点IP',
                        key: 'nodeIp'
                    },
                    {
                        title: '私有节点最新区块',
                        key: 'nodeLastBlockNumber'
                    },
                    {
                        title: '主网络区块数',
                        key: 'mainNetLastBlockNumber'
                    },
                    {
                        title: '差值',
                        key: 'difference'
                    }
                ],
                data1: [],
                data3: [],
                data4: [],
                columns2: [
                    {
                        title: '服务名',
                        key: 'serviceDomain'
                    },
                    {
                        title: '私有节点IP',
                        key: 'nodeIp'
                    },
                    {
                        title: '已扫描到区块',
                        key: 'scanningBlockNumber'
                    },
                    {
                        title: '私有节点最新区块',
                        key: 'nodeLastBlockNumber'
                    },
                    {
                        title: '主网络区块数',
                        key: 'mainNetLastBlockNumber'
                    },
                    {
                        title: '扫描区块差值',
                        key: 'scanDifference'
                    },
                    {
                        title: '同步区块差值',
                        key: 'difference'
                    },
                    {
                        title: '已扫描与网络差值',
                        key: 'scanOnlineDifference'
                    }
                ],
                data2: []
            };
        },
        created () {
            this.getfindBtcNodeList();
            this.getfindEthNodeList();
            this.getfindOMNINodeList();
            this.getfindMBTNodeList();
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
            getfindMBTNodeList () {
                monitApi.findMBTNNodeList((res, total) => {
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
