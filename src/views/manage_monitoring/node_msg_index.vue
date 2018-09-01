<template>
    <div>
        <Card>
            <p slot="title" >比特币同步区块数</p>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
        </Card>
         <Card style="margin-top:30px;">
            <p slot="title" >以太坊同步区块数</p>
            <Table :columns="columns2" :data="data2"></Table>
            <Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>  
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
                data2: []
            }
        },
        created () {
            this.getfindBtcNodeList()
            this.getfindEthNodeList()
        },
        methods: {
            getfindBtcNodeList () {
                monitApi.findBtcNodeList(this.curPage, (res, total) => {
                    this.total = total
                    this.data1 = res.data
                })
            },
            getfindEthNodeList () {
                monitApi.findEthNodeList(this.curPage1, (res, total) => {
                    this.total1 = total
                    this.data2 = res.data
                })
            },
            changePage (page) {
                this.curPage = page
                this.getfindBtcNodeList()
            },
            changePage1 (page) {
                this.curPage1 = page
                this.getfindEthNodeList()
            }
        }
    }
</script>
<style scoped>
.ivu-row{height: 40px;line-height: 40px;}
</style>