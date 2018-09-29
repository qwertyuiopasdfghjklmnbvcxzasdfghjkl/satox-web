<template>
    <Card class="manage_exchange_login_record" style="width:700px;">
        <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
         <Tabs>
            <TabPane label="登录记录">
                <p slot="title">
                    登录记录
                    
                </p>
                <Row>
                    <Col>注册时间：{{dataTime.createdTime}}</Col>
                </Row>
                <Table :columns="columns1" :data="data1"></Table>
                <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
            </TabPane>
            <TabPane label="收藏市场">
                <p slot="title">
                    收藏市场
                    <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
                </p>
                <!-- <Table :columns="columns1" :data="data1"></Table> -->
                <Row >
                    <!-- <Col span="6" v-for="(data, index) in data1" :key="index">{{index+1}}. {{(data.market).replace(/(BTC|ETH|BARK)$/, function (m) { return ' / ' + m })}}</Col> -->
                    <Col span="6" v-for="(data, index) in data2" :key="index">{{index+1}}. {{(data.market).replace(/(BTC|ETH|ATN)$/, function (m) { return ' / ' + m })}}</Col>            
                </Row>
                <Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>
           </TabPane>
        </Tabs>
    </Card>
</template>
<script>
import currenyApi from '../../../api/currency'
    export default {
        props: ['userId'],
        data () {
            return {
                curPage: 1,
                total: 0,
                curPage1: 1,
                total1: 0,
                columns1: [
                    {
                        title: '时间',
                        key: 'loginTime'
                    },
                    {
                        title: 'IP地址',
                        key: 'clientIp'
                    },
                    {
                        title: '所在地',
                        key: 'loginLocation'
                    },
                    {
                        title: '方式',
                        key: 'clientType'
                    }
                ],
                data1: [],
                data2: [],
                dataTime: []
            }
        },
        created () {
          this.getLoginList()
          this.getfindUserInfo()
          this.collectData()
        },
        methods: {
          getfindUserInfo () {
              currenyApi.findUserInfo(this.userId, (res) => {
                  this.dataTime = res
              })
          },
          closeDialog () {
             this.$emit('removeDialog')
          },
          getLoginList () {
            currenyApi.findUserLoginLogList(this.curPage, {
                userId: this.userId
            }, (res, total) => {
                this.total = total
                this.data1 = res
            })
          },
          changePage (page) {
            this.curPage = page
            this.getLoginList()
          },
          collectData () {
              console.log(this.userId)
              currenyApi.findUserCollectionMarketList(this.curPage1, {
                  userId: this.userId
              }, (res, total) => {
                  this.total1 = total
                  this.data2 = res
              })
          },
          changePage1 (page) {
            this.curPage1 = page
            this.collectData()
          }
        }
    }
</script>

<style lang="less">
.manage_exchange_login_record{
    .cion{text-align: right;font-size: 14px;cursor: pointer;margin-right: 10px;margin-top: 5px;}
    .title{font-size: 14px;font-weight: bold;margin-left: 8px;}
}
</style>
