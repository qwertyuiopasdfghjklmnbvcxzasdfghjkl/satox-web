<!-- 广告管理 -->
<template>
  <Card>
    <p slot="title">广告管理
         <span class="refresh" @click="getAdsList"></span>
    </p>
    <Row>
      <Select v-model="symbol" style="width:200px" @on-change="getAdsList">
          <Option value="BTC">BTC</Option>
          <Option value="ETH">ETH</Option>
          <Option value="ATN">ATN</Option>
          <Option value="MECoin">MECoin</Option>
          <Option value="USDT">USDT</Option>
      </Select>
    </Row>
    <Tabs style="margin-top:10px;" @on-click="changeTab">
        <TabPane label="卖币广告" name="2">
          <Table :columns="columns1" :data="data1" @on-sort-change="setAdsSaleSort"></Table>
          <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page> 
        </TabPane>
        <TabPane label="买币广告" name="1">
          <Table :columns="columns1" :data="data1" @on-sort-change="setAdsBuySort"></Table>
          <Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page> 
        </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import util from '../../libs/util';
import vieworder from './ads/vieworder';
import otcApi from '../../api/otc';
import Cookies from 'js-cookie';
export default {
  data () {
    return {
      curPage: 1, 
      total: 0,
      curPage1: 1, 
      total1: 0,
      columns1: [
            {title: '发布者', key: 'username'},
            {title: '总数量', key: 'symbolCount', sortable: 'custom',
                render: (h, params) => {
                    return h('div', [params.row.symbolCount, '', params.row.symbol]);
                }
            },
            {title: '余额', key: 'remainCount', sortable: 'custom',
                render: (h, params) => {
                    return h('div', [params.row.remainCount, params.row.symbol]);
                }
            },
            {title: '溢价', key: 'priceRate',
                render: (h, params) => {
                    return h('div', [params.row.priceRate, '%']);
                }
            },
            {title: '最高(低)接受价', key: 'acceptPrice', sortable: 'custom',
                render: (h, params) => {
                    return h('div', [params.row.acceptPrice, params.row.currency]);
                }
            },
            {title: '限额', key: 'minAmount', sortable: 'custom',
                render: (h, params) => {
                    return h('div', [params.row.minAmount, params.row.adType === 2 ? params.row.currency : params.row.symbol, ' - ', params.row.maxAmount, params.row.adType === 2 ? params.row.currency : params.row.symbol]);
                }
            },
            {title: '限时', key: 'payLimitTime'},
            {title: '订单限制数', key: 'maxProcessNum'},
            {title: '创建时间', key: 'createdAt', sortable: 'custom'},
            {title: '操作', key: 'action', width: 200, render: (h, params) => {
                return h('div', [
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '10px'},
                        on: {
                            click: () => {
                              util.setDialog(vieworder, {
                                  adId: params.row.adId,
                                  username: params.row.username,
                                  symbol: params.row.symbol
                              });
                            }
                        }
                    }, '查看订单'),
                    h('Button', {
                        props: {type: 'primary', size: 'small', disabled: !util.showThisRoute(['ROLE_ADMIN', 'ROLE_OPERATION', 'ROLE_OTC_AUDIT'], Cookies.get('roles')) && util.showThisRoute(['ROLE_OTC_APPEAL', 'ROLE_CUSTOMER'], Cookies.get('roles'))},
                        on: {
                            click: () => {
                              this.$Modal.confirm({
                                  content: '<p style="font-size:18px;">是否下架该广告？</p>',
                                  onOk: () => {
                                      otcApi.soldOutAd({
                                          adId: params.row.adId,
	                                      userId: params.row.userId
                                      }, (res) => {
                                          this.$Message.success({content: '下架成功'})
                                           this.getAdsList()
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
                    }, '强制下架')
                ]);
            }}
        ],
        data1: [],
        symbol: 'BTC',
        ad_type: 2
    }
  },
  created () {
      this.getAdsList();
  },
  methods: {
    setAdsSaleSort(column){
      this.curPage = 1
      if(column.order!=='normal'){
        this.AdsSaleSortKey = column.key
        this.AdsSaleSortVal = column.order
      } else {
        this.AdsSaleSortKey = null
      }
      this.getAdsList()
    },
    setAdsBuySort(column){
      this.curPage1 = 1
      if(column.order!=='normal'){
        this.AdsBuySortKey = column.key
        this.AdsBuySortVal = column.order
      } else {
        this.AdsBuySortKey = null
      }
      this.getAdsList()
    },
      changeTab (name) {
          this.ad_type = name
          this.symbol = this.symbol
          this.getAdsList()
      },
      getAdsList () {
        let data = {
                symbol: this.symbol,
                adType: this.ad_type
            }
        if(Number(this.ad_type)===1 && this.AdsBuySortKey){
            data.sortKey = `${this.AdsBuySortKey} ${this.AdsBuySortVal}`
        }
        if(Number(this.ad_type)===2 && this.AdsSaleSortKey){
            data.sortKey = `${this.AdsSaleSortKey} ${this.AdsSaleSortVal}`
        }
          otcApi.findAdInfoOtc(this.curPage, data,
            (res, total) => { 
                this.total = total
                this.data1 = res
            }, (msg) => {
                this.$Message.error({content: msg})
            })
      },
      changePage (page) {
        this.curPage = page
        this.getAdsList()
      },
      changePage1 (page) {
        this.curPage1 = page
        this.getAdsList()
      }
  }
}
</script>

<style lang="less" scoped>
.refresh{width: 49px;height: 24px;background: url(../../images/frsh.png) center/cover no-repeat;background-size: contain;cursor: pointer;color: #2d8cf0;}
.ivu-card-head-inner, .ivu-card-head p{display: flex !important;justify-content: space-between  !important;height: 40px !important; line-height: 40px !important;}
</style>
