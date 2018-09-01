<template>
    <div class="block_scan">
        <Card>
            <p slot="title">区块扫描进度
                 <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
        </Card>
    </div>
</template>
<script>
import monitorApi from '../../api/monitoring'
export default {
    data () {
        return {
            curPage: 1,
            total: 0,
            columns1: [
                {
                    title: '公链类型',
                    key: 'symbolType'
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
                    title: '主网最新区块',
                    key: 'mainNetLastBlockNumber'
                }
            ],
            data1: []
        }
    },
    created () {
        this.getfindScanningBlockNumber()
    },
    methods:　{
        getfindScanningBlockNumber () {
            monitorApi.findScanningBlockNumber(this.curPage, {}, (res, total) => {
                this.total = total
                this.data1 = res
            }, (msg) => {
                this.$Message.error({name: msg}) 
            })
        },
        changePage (page) {
            this.curPage = page
            this.getfindScanningBlockNumber()
        },
        closeDialog () {
            this.$emit('removeDialog');
        }
    }
}
</script>
<style>
.block_scan{width: 600px;background: #fff;padding: 10px;}
</style>

