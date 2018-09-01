<template>
    <Card class="manage_exchange_login_record" style="width:700px;">
        <p slot="title">
            登录记录
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row>
            <Col>注册时间：{{this.dataTime.createdTime}}</Col>
        </Row>
        <Table :columns="columns1" :data="data1"></Table>
         <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
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
                dataTime: []
            }
        },
        created () {
          this.getLoginList()
          this.getfindUserInfo()
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
