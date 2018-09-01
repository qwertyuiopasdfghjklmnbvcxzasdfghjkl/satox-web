<template>
  <Card class="manage_otc_auditing_info" style="width:1000px;">
      <p slot="title">
          查看详情
          <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
      </p>
      <Row class="manage_otc_auditing_info_row" type="flex">
          <div class="manage_otc_auditing_info_row_title">申诉人</div>
          <div class="manage_otc_auditing_info_row_name" style="width:250px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
              姓名：{{this.data2.userRealName === null ? this.data2.username : this.data2.userRealName}}
          </div>
          <div class="manage_otc_auditing_info_row_email">
              账号：{{this.data2.username || 0}}
          </div>
          <div>
              电话：{{this.data2.mobile || '--'}}
          </div>
      </Row>
      <Row class="manage_otc_auditing_info_row" type="flex">
          <div class="manage_otc_auditing_info_row_title">被申诉人</div>
          <div class="manage_otc_auditing_info_row_name" style="width:250px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
              姓名：{{this.data1.userRealName  === null ? this.data1.username : this.data1.userRealName}}
          </div>
          <div class="manage_otc_auditing_info_row_email">
              账号：{{this.data1.username || 0}}
          </div>
          <div>
              电话：{{this.data1.mobile || '--'}}
          </div>
      </Row>
      <Table :columns="columns1" :data="datas" style="margin:20px;"></Table>
  </Card>
</template>

<script>
import util from '../../../libs/util';
import chatModel from '../orders/chatModel';
import otcApi from '../../../api/otc'
export default {
    props: ['msgNumber'],
    data () {
        return {
            columns1: [
                {title: '订单号', key: 'orderNumber'},
                {title: '卖家账号', key: 'fromUserName'},
                {title: '交易量', key: 'currencyCount',
                    render: (h, params) => {
                        return h('div', [params.row.symbolCount, params.row.symbol])
                    }
                },
                {title: '支付金额', key: 'currencyCount',
                    render: (h, params) => {
                        return h('div', [params.row.currencyCount, 'CNY'])
                    }
                },
                {title: '交易状态', key: 'state',
                    render: (h, params) => {  
                        return h('div',  this.switchStaus(params.row.state, params.row.payState))
                    }
                },
                {title: '交易限时', key: 'payApplyTime',
                    render: (h, params) => {
                        return h('div', [params.row.payApplyTime, '分钟'])
                    }
                },
                {title: '操作', key: 'action', render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {type: 'primary', size: 'small'},
                            on: {
                                click: () => {
                                    util.setDialog(chatModel, {
                                        orderNumber: params.row.orderNumber
                                    });
                                }
                            }
                        }, '聊天记录')
                    ])
                }}
            ],
            datas: [],
            data1: [],
            data2: []
        }
    },
    created () {
        this.geOneOrderInfo()
    },
    methods: {
        switchStaus(state, payState) { 
            switch(state, payState){
                case 1:
                    return payState === 1 ? '已付款' : '未付款'
                    break;
                case 2:
                    return '已完成'
                    break;
                case 3:
                    return '已取消'
                    break;
            }
        },
        closeDialog () {
            this.$emit('removeDialog');
        },
        geOneOrderInfo () {
            otcApi.selectUserAndOrderInfoOtc({
                msgNumber: this.msgNumber
            }, (res) => {
                if (![res.userInfo.oppositeUser] ) {
                    return
                }
                this.datas  = [res.orderInfo]
                this.data1 = [res.userInfo.oppositeUser][0]
                this.data2 = [res.userInfo.user][0]
            })
        }
    }
}
</script>

<style lang="less">
.manage_otc_auditing_info .ivu-card-body{padding:0px;}
.manage_otc_auditing_info_row{height:60px;line-height:60px;font-size:20px;border-bottom:1px #ccc solid;}
.manage_otc_auditing_info_row_title{width:150px;text-align:center;border-right:1px solid #ccc;}
.manage_otc_auditing_info_row_name{width:220px;padding-left:4px;}
.manage_otc_auditing_info_row_email{width:350px;}
</style>
