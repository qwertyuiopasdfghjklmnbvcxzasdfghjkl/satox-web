<template>
     <Card class="manage_exchange_collect_market" style="width:900px;">
        <p slot="title">
            {{vm.$t('exchange.yqxx')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row style="border-bottom:1px solid #ccc;height:36px;line-height:36px;">
            <Col span="3">{{vm.$t('exchange.bryqm')}}</Col>
            <Col span="3">{{vm.$t('exchange.tjryqm')}}</Col>
            <Col span="3">{{vm.$t('exchange.tjrzh')}}</Col>
            <Col span="1">M1</Col>
            <Col span="1">M2</Col>
            <Col span="1">M3</Col>
            <Col span="2">TotalM1</Col>
            <Col span="2">TotalM2</Col>
            <Col span="2">TotalM3</Col>
            <Col span="3">{{vm.$t('exchange.jlffzt')}}</Col>
            <Col span="3">{{vm.$t('exchange.jlffsj')}}</Col>
        </Row>
        <Row style="height:36px;line-height:36px;">
            <Col span="3">{{data1.myInvitationCode || '-'}}</Col>
            <Col span="3">{{data1.invitedCode  || vm.$t('common.w')}}</Col>
            <Col span="3">{{data1.invitedUsername  || vm.$t('common.w') }}</Col>
            <Col span="1">{{data1.m1}}</Col>
            <Col span="1">{{data1.m2}}</Col>
            <Col span="1">{{data1.m3}}</Col>
            <Col span="2">{{data1.totalM1}}</Col>
            <Col span="2">{{data1.totalM2 }}</Col>
            <Col span="2">{{data1.totalM3}}</Col>
            <Col span="3">{{data1.awardHasGiven}}</Col>
            <Col span="3">{{data1.awardGivenTime   || '----'}}</Col>
        </Row>
    </Card>
</template>
<script>
import currenyApi from '../../../api/currency'
    export default {
        props: ['userId'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                data1: []
            }
        },
        created () {
          this.inviteInfo()
        },
        methods: {
          closeDialog () {
             this.$emit('removeDialog')
          },
          inviteInfo () {
              currenyApi.findUserInviteInfo({
                  userId: this.userId
              }, (res) => {
                  this.data1 = res
                //   console.log(this.data1.awardHasGiven)
              })
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
