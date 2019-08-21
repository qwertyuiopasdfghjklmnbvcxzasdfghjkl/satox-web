<template>
    <div>
        <!--<Card>-->
        <!--<p slot="title">{{$t('monitoring.btbtbqks')}}</p>-->
        <!--<Table :columns="columns2" :data="data1"></Table>-->
        <!--<Page :current="curPage" :total="total" @on-change="changePage"-->
        <!--style="text-align:center;margin-top:20px;"></Page>-->
        <!--</Card>-->
        <!--<Card style="margin-top:30px;">-->
        <!--<p slot="title">{{$t('monitoring.ytftbqks')}}</p>-->
        <!--<Table :columns="columns2" :data="data2"></Table>-->
        <!--<Page :current="curPage1" :total="total1" @on-change="changePage1"-->
        <!--style="text-align:center;margin-top:20px;"></Page>-->
        <!--</Card>-->
        <!--<Card style="margin-top:30px;">-->
        <!--<p slot="title">{{$t('monitoring.omnitbqks')}}</p>-->
        <!--<Table :columns="columns2" :data="data3"></Table>-->
        <!--</Card>-->
        <!--<Card style="margin-top:30px;">-->
        <!--<p slot="title">EOS{{$t('monitoring.tbqks')}}</p>-->
        <!--<Table :columns="columns2" :data="data4"></Table>-->
        <!--</Card>-->
        <!--<Card style="margin-top:30px;">-->
        <!--<p slot="title">LTC{{$t('monitoring.tbqks')}}</p>-->
        <!--<Table :columns="columns2" :data="data5"></Table>-->
        <!--</Card>-->
        <!--<Card style="margin-top:30px;">-->
        <!--<p slot="title">XRP{{$t('monitoring.tbqks')}}</p>-->
        <!--<Table :columns="columns2" :data="data6"></Table>-->
        <!--</Card>-->
        <!--<Card style="margin-top:30px;">-->
        <!--<p slot="title">ADA{{$t('monitoring.tbqks')}}</p>-->
        <!--<Table :columns="columns2" :data="data7"></Table>-->
        <!--</Card>-->
        <!--<Card style="margin-top:30px;">-->
        <!--<p slot="title">NEO{{$t('monitoring.tbqks')}}</p>-->
        <!--<Table :columns="columns2" :data="data8"></Table>-->
        <!--</Card>-->
        <!--<Card style="margin-top:30px;">-->
        <!--<p slot="title">ACM{{$t('monitoring.tbqks')}}</p>-->
        <!--<Table :columns="columns2" :data="data9"></Table>-->
        <!--</Card>-->
        <Card style="margin-top:30px;">
            <p slot="title">{{$t('monitoring.tbqks')}}</p>
            <Table :columns="columns2" :data="data"></Table>
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
                data: [],
                columns2: [
                    {
                        title: this.$t('monitoring.fwt'),
                        key: 'symbolType'
                    },
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
            // this.getfindBtcNodeList();
            // this.getfindEthNodeList();
            // this.getfindOMNINodeList();
            // this.getfindEOSNodeList();
            // this.getfindLTCNodeList();
            // this.getfindXRPNodeList();
            // this.getNodeList();
            this.getList();
        },
        methods: {
            getList(){
                monitApi.findAllList(res=>{
                    console.log(res)
                    this.data = res.data
                })
            },
            getfindBtcNodeList () {
                monitApi.findBtcNodeList((res) => {
                    this.data1.push(res);
                });
            },
            getfindEthNodeList () {
                monitApi.findEthNodeList((res) => {
                    this.data2.push(res);
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
            getfindLTCNodeList () {
                monitApi.findLTCNodeList((res, total) => {
                    this.data5.push(res);

                });
            },
            getfindXRPNodeList () {
                monitApi.findXRPNodeList((res, total) => {
                    this.data6.push(res);

                });
            },
            getNodeList () {
                monitApi.findNodeList('findADANode', (res) => {
                    this.data7.push(res);
                });
                monitApi.findNodeList('findNEONode', (res) => {
                    this.data8.push(res);
                });
                monitApi.findNodeList('findACMNode', (res) => {
                    this.data9.push(res);
                });
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
