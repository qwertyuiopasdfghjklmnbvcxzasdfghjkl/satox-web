<template>
     <Card class="manage_exchange_collect_market" style="width:700px;">
        <p slot="title">
            收藏市场
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <!-- <Table :columns="columns1" :data="data1"></Table> -->
        <Row >
            <Col span="6" v-for="(data, index) in data1" :key="index">{{index+1}}. {{(data.market).replace(/(BTC|ETH|BARK)$/, function (m) { return ' / ' + m })}}</Col>
        </Row>
        <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
     </Card>
</template>
<script>
import currenyApi from '../../../api/currency'
    export default {
        props: ['userId'],
        data () {
            return {
                data1: [],
                curPage: 1,
                total: 0
            }
        },
        created () {
          this.collectData()
        },
        methods: {
          closeDialog () {
             this.$emit('removeDialog')
          },
          collectData () {
              console.log(this.userId)
              currenyApi.findUserCollectionMarketList(this.curPage, {
                  userId: this.userId
              }, (res, total) => {
                  this.total = total
                  this.data1 = res
              })
          },
          changePage (page) {
            this.curPage = page
            this.collectData()
          }
        }
    }
</script>

<style lang="less" scoped>
.manage_exchange_collect_market{
    .cion{text-align: right;font-size: 14px;cursor: pointer;margin-right: 10px;margin-top: 5px;}
    .title{font-size: 14px;font-weight: bold;margin-left: 8px;}
}
</style>
