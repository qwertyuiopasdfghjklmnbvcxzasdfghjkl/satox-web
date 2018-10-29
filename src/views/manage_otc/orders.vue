<!-- 订单管理 -->
<template>
  <Card>
    <p slot="title">订单管理
        <span class="refresh" @click="getOrdersList"></span>
    </p>
    <Row>
      <Select v-model="formData.symbol" style="width:200px">
          <Option value="BTC">BTC</Option>
          <Option value="ETH">ETH</Option>
          <Option value="ATN">ATN</Option>
          <Option value="MECoin">MECoin</Option>
      </Select>
      <Input v-model="formData.orderNumber" clearable style="width: 300px;" placeholder="OTC45941545316384768"></Input>
      <Button type="primary" @click="curPage=1;getOrdersList()">查询</Button>
    </Row>
    <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
    <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
  </Card>
</template>

<script>
import util from '../../libs/util';
import chatModel from './orders/chatModel';
import otcApi from '../../api/otc'
import { orderStates } from '../../libs/config';
import Cookies from 'js-cookie';
export default {
  data () {
    return {
      curPage: 1, 
      total: 0,
      formData: {
        symbol: 'BTC',
        orderNumber: ''
      },
      columns1: [
            {title: '订单编号', key: 'orderNumber'},
            {title: '订单状态', key: 'state', render: (h, params) => {
                return h('div', this.switchStaus(params.row.state, params.row.payState));
            }},
            {title: '价格', key: 'curPrice',
                render: (h, params) => {
                    return h('div', [(params.row.curPrice).toFixed(2).toMoney(), 'CNY']);
                }
            },
            {title: '数量', key: 'symbolCount', 
                render: (h, params) => {
                    return h('div', [params.row.symbolCount, '', params.row.symbol]);
                }
            },
            {title: '金额', key: 'currencyCount',
                render: (h, params) => {
                    return h('div', [(params.row.currencyCount).toFixed(2).toMoney(), 'CNY']);
                }
            },
            {title: '买家账号', key: 'toUserName'},
            {title: '卖家账号', key: 'fromUserName'},
            {title: '剩余付款时间', key: 'surplus_Time',
                render: (h, params) => {
                    return h('div', [params.row.state == 2 ? '00:00' : params.row.surplus_Time]);
                }
            },
            {title: '创建时间', key: 'updatedAt'},
            {title: '操作', key: 'action', width: 300, render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {type: 'primary', size: 'small', disabled: params.row.state == 2 || params.row.state == 3 || (params.row.state == 1 && params.row.payState == 0) || !util.showThisRoute(['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_OTC_AUDIT'], Cookies.get('roles')) && util.showThisRoute(['ROLE_OTC_APPEAL', 'ROLE_CUSTOMER'], Cookies.get('roles'))},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                otcApi.sendMsg({
                                    userId: params.row.fromUserId,
                                    orderId: params.row.orderId,
                                    orderNumber: params.row.orderNumber
                                },(res) => {
                                    this.$Message.success({content:'提醒成功'})
                                }, (msg) => {
                                    this.$Message.error({content: msg})
                                })
                            }
                        }
                    }, '提醒放币'),
                    h('Button', {
                        props: {type: 'primary', size: 'small', disabled: params.row.state == 2 || params.row.state == 3 || (params.row.state == 1 && params.row.payState == 0) || !util.showThisRoute(['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_OTC_AUDIT'], Cookies.get('roles')) && util.showThisRoute(['ROLE_OTC_APPEAL', 'ROLE_CUSTOMER'], Cookies.get('roles'))},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                this.$Modal.confirm({
                                    content: '<p style="font-size:18px;">是否强制释放货币？</p>',
                                    onOk: () => {
                                        otcApi.releaseCoin({
                                            orderId: params.row.orderId
                                        }, (res) => {
                                            this.$Message.success({content: '放币成功'})
                                            this.getOrdersList();
                                        }, (msg) => {
                                             this.$Message.success({content: msg})
                                        })
                                    },
                                    onCancel: () => {
                                        this.$emit('removeDialog'); 
                                    }
                                });
                            }
                        }
                    }, '强制放币'),
                    h('Button', {
                        props: {type: 'primary', size: 'small', disabled: params.row.state == 2 || params.row.state == 3 || (params.row.state == 1 && params.row.payState == 0) || !util.showThisRoute(['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_OTC_AUDIT'], Cookies.get('roles')) && util.showThisRoute(['ROLE_OTC_APPEAL', 'ROLE_CUSTOMER'], Cookies.get('roles'))},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                                this.$Modal.confirm({
                                    content: '<p style="font-size:18px;margin-top:-6px;">是否解除锁币？</p>',
                                    onOk: () => {
                                        otcApi.unlockCoin({
                                            orderId: params.row.orderId
                                        },(res) => {
                                            this.$Message.success({content: '解锁成功'})
                                            this.getOrdersList();
                                        }, (msg) => {
                                            this.$Message.error({content: msg})
                                        })
                                    },
                                    onCancel: () => {
                                         this.$emit('removeDialog');
                                    }
                                });
                            }
                        }
                    }, '解除锁币'),
                    h('i', {
                        class: 'ivu-icon ivu-icon-ios-chatboxes-outline',
                        style: {verticalAlign: 'middle', cursor: 'pointer', fontSize: '28px'}, 
                        on: {
                            click: () => {
                                util.setDialog(chatModel, {
                                    orderNumber: params.row.orderNumber, 
                                    type: 'chat'
                                });
                            }
                        }
                    })
                ]);
            }}
        ],
        data1: []
    }
  },
  created () {
      this.getOrdersList();
  },
  methods: {
      switchStaus(state, payState) { 
        switch(state){
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
      getOrdersList () {
        otcApi.listAllOrders(this.curPage, {
            symbol: this.formData.symbol,
            orderNumber: this.formData.orderNumber
        }, (res, total) => {
            res.forEach((item, index) => {
                item.createTime = item.createdAt
                let date = util.formatDate(item.createTime).getTime()
                let ndate = util.formatDate(item.nowTime).getTime()
                var diffTime = Math.floor((ndate - date) / 1000)
                var surplusTime = item.payApplyTime * 60 - diffTime
                util.countDown(surplusTime, (time) => {
                    item.surplus_Time = time
                })
                item.surplus_Time = '00:00'
            })
          this.total = total
          this.data1 = res
        }, (msg) => {
          this.$Message.error({content: msg})
        })
      },
      changePage (page) {
        this.curPage = page
        this.getOrdersList()
      }
  }
}
</script>

<style lang="less" scoped>
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
