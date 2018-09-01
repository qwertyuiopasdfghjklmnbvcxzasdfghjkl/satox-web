<template>
    <Card style="width:800px;">
        <p slot="title">
            资产信息
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <div style="font-size:16px;">
            <Row>
                {{this.username}}的资产信息
            </Row>
            <Row>
                当前总估值：1BTC/2000$
            </Row>
        </div>
        <Table :columns="columns" :data="datas"></Table>
        <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
    </Card>
</template>

<script>
import util from '../../../libs/util';
import otcApi from '../../../api/otc'
export default {
    props: ['userId'],
    data () {
        return {
            curPage: 1, 
            total: 0,
            columns: [
                {title: '币种', key: 'accountName'},
                {title: '总额', key: 'totalBalance'},
                {title: '可用余额', key: 'availableBalance'},
                {title: '冻结余额', key: 'frozenBalance'}
            ],
            datas: [],
            username: ''
        };
    },
    created () {
        this.getfindAssetInfo()
    },
    methods: {
        getfindAssetInfo () {
            otcApi.findAssetInfoManage(this.curPage, {
                userId: this.userId
            }, (res, total) => {
                this.total = total
                this.username = res[0].userName
                this.datas = res[0].account
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        changePage (page) {
            this.curPage = page
            this.getfindUserManage()
        },
        closeDialog () {
          this.$emit('removeDialog')
        }
    }
};
</script>

<style lang="less">
</style>