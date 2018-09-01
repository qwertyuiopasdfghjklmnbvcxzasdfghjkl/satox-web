<template>
  <div>
        <Row>
           <Card style="font-size:16px;">
                <Row>
                    <Form>
                        <p class="notwrap">
                            <strong>
                                <span>广告管理</span>
                                <span style="float:right;">
                                    <Button type="primary" @click="showModel=true">广告发布设置</Button>
                                </span>
                            </strong>
                        </p>
                         <p class="notwrap margin-top-20">
                            <Tabs type="card" :animated="false" @on-click="changeTab" style="height:750px;">
                                <TabPane label="购买广告" name="1">
                                    <Table :columns="columns" :data="datas"></Table>
                                    <Page style="margin-top:10px;float:right;" :total="params.totalPage" :page-size="params.show" @on-change="pageChange"></Page>
                                </TabPane>
                                <TabPane label="出售广告" name="2">
                                    <Table :columns="columns" :data="datas"></Table>
                                    <Page style="margin-top:10px;float:right;" :total="params.totalPage" :page-size="params.show" @on-change="pageChange"></Page>
                                </TabPane>
                                <Select v-model="params.currency" style="width:150px;margin-right:20px;" size="small" slot="extra">
                                    <Option v-for="item in currencys" :value="item.id" :key="item.id">{{ item.name }}</Option>
                                </Select>
                                <Select v-model="params.symbol" style="width:150px;margin-right:20px;" size="small" slot="extra">
                                    <Option v-for="item in coins" :value="item" :key="item">{{ item }}</Option>
                                </Select>
                                <Checkbox v-model="adsStatus" slot="extra">
                                    只显示已上架广告
                                </Checkbox>
                            </Tabs>
                        </p>
                    </Form>
                </Row>
            </Card>
        </Row>
        <adssetting v-model="showModel"/>
        <vieworder v-model="vieworderShow" :orderParams="orderParams"/>
    </div>
</template>

<script>
import config from '@/assets/js/config'
import adssetting from './adssetting'
import vieworder from './vieworder'
import util from '@/libs/util';
import qs from 'qs';
export default {
  components: {
    adssetting,
    vieworder
  },
  data () {
    return {
      showModel: false,
      vieworderShow: false,
      currencys: config.currencys,
      coins: config.coins,
      adsStatus: false,
      ad_id: null,
      params: {
        ad_type: 1,
        symbol: 'BTC',
        currency: 'CNY',
        current_price: 1000,
        page: 1,
        show: 10,
        totalPage: 0
      },
      columns: [
        {key: 'username', title: '发布人'},
        {key: 'min_amount', title: '交易限额', render: (h, params) => {
            var row = params.row;
            return h('div', [row.min_amount, ' - ', row.max_amount]);
        }},
        {key: 'lowest_price', title: '交易单价', render: (h, params) => {
            var row = params.row;
            return h('div', [row.lowest_price, ' ', row.currency]);
        }},
        {key: 'pay_type', title: '交易方式', render: (h, params) => {
            var pay_type = params.row.pay_type;
            return h('div', [pay_type.indexOf('1') !== -1 ? '银行卡，' : '', pay_type.indexOf('2') !== -1 ? '支付宝，' : '', pay_type.indexOf('3') !== -1 ? '微信' : '']);
        }},
        {key: 'create_time', title: '创建时间'},
        {key: 'expired_time', title: '到期时间'},
        {key: 'status', title: '状态', render: (h, params) => {
            var status = params.row.status;
            var txt = '已过期';
            var style = {};
            if (status === 0) {
                txt = '已下架';
                style = {color: '#ed3f14'};
            } else if (status === 1) {
                txt = '已上架';
                style = {color: '#19be6b'};
            }
            return h('div', {
                style: style
            }, [txt]);
        }},
        {key: 'action', title: '操作', width: 300, render: (h, params) => {
            var row = params.row;
            var status = row.status;
            var id = row.id;
            var txtStatus = status === 1 ? '下架广告' : '上架广告';
            return h('div', [
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: { marginRight: '10px'},
                    on: {
                        click: () => {
                            this.ad_id = id;
                            this.vieworderShow = true;
                        }
                    }
                }, '查看订单'),
                status !== 0 && status !== 1 ? '' : h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: { marginRight: '10px'},
                    on: {
                        click: () => {
                            this.$Modal.confirm({
                                title: txtStatus,
                                content: `确认${txtStatus}？`,
                                onOk: () => {
                                    this.underAds(id);
                                }
                            });
                        }
                    }
                }, txtStatus),
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    on: {
                        click: () => {
                            this.$Modal.confirm({
                                title: '删除广告',
                                content: `确认删除广告？`,
                                onOk: () => {
                                    this.deleteAds(id)
                                }
                            });
                        }
                    }
                }, '删除广告')
            ]);
        }}
      ],
      datas: []
    }
  },
  computed: {
      paramsChange () {
          return {
              ad_type: this.params.ad_type,
              symbol: this.params.symbol,
              currency: this.params.currency,
              page: this.params.page
          };
      },
      orderParams () {
          return {
              ad_type: this.params.ad_type,
              symbol: this.params.symbol,
              ad_id: this.ad_id
          };
      }
  },
  watch: {
      adsStatus (bool) {
          if (bool) {
              this.params.status = 1
          } else {
              delete this.params.status;
          }
          this.getList();
      },
      paramsChange () {
          this.getList();
      },
      vieworderShow (bool) {
          if (!bool) {
              this.ad_id = null;
          }
      }
  },
  created () {
    this.getList();
  },
  methods: {
    getList () { // 获取广告列表
        util.ajax.post('api/v1/manage/otc/ads/list', qs.stringify(this.params)).then((res) => {
            if (res.data && res.data.rst === 1) {
                this.datas = res.data.data;
                this.params.totalPage = res.data.total;
            } else if (res.data && res.data.rst !== 1){
                this.$Message.error(res.data.msg);
                window.console.log(res.data.msg);
            }
        }).catch((error) => {
            this.$Message.error('其他错误');
            window.console.log(error);
        });
    },
    underAds (id) { // 下架广告
        util.ajax.delete(`api/v1/manage/otc/ads/down/${id}`, qs.stringify(this.params)).then((res) => {
            if (res.data && res.data.rst === 1) {
                this.datas = res.data.data
            } else if (res.data && res.data.rst !== 1){
                this.$Message.error(res.data.msg);
                window.console.log(res.data.msg)
            }
            this.getList();
        }).catch((error) => {
            this.$Message.error('其他错误');
            window.console.log(error);
            this.getList();
        });
    },
    deleteAds (id) { // 删除广告
        util.ajax.delete(`api/v1/manage/otc/ads/${id}`, qs.stringify(this.params)).then((res) => {
            if (res.data && res.data.rst === 1) {
                this.datas = res.data.data
            } else if (res.data && res.data.rst !== 1){
                this.$Message.error(res.data.msg);
                window.console.log(res.data.msg)
            }
            this.getList();
        }).catch((error) => {
            this.$Message.error('其他错误');
            window.console.log(error);
            this.getList();
        });
    },
    changeTab (ad_type) {
        this.params.page = 1;
        this.params.ad_type = ad_type;
    },
    pageChange (page) {
        this.params.page = page;
    }
  }
}
</script>

<style>

</style>
