<template>
  <div>
        <Row>
           <Card style="font-size:16px;">
                <Row>
                    <Form>
                        <p class="notwrap">
                            <strong>
                                <span>币种管理</span>
                                <span class="padding-left-20">
                                    <Input v-model="search" style="width:120px;"></Input>
                                </span>
                                <span class="padding-left-20">
                                    <Select v-model="state" style="width:200px">
                                        <Option value="all">全部</Option>
                                        <Option value="0">未上架</Option>
                                        <Option value="1">已上架，未开放交易</Option>
                                        <Option value="2">已上架，已开放交易</Option>
                                    </Select>
                                </span>
                                <span style="float:right;">
                                    <Button type="primary" @click="modalShow=true">新增货币</Button>
                                </span>
                            </strong>
                        </p>
                    </Form>
                </Row>
                <Row style="margin-top:20px;height:750px;">
                    <Table :columns="columns" height="750" :data="filterData"></Table>
                </Row>
            </Card>
        </Row>
        <coe v-model="modalShow"/>
    </div>
</template>

<script>
import util from '@/libs/util';
import qs from 'qs';
import coe from './model'
export default {
  components: {
    coe
  },
  data () {
    return {
      search: '',
      state: 'all',
      columns: [
        {key: 'symbol', title: '名称'},
        {key: 'caption', title: '全称'},
        {key: 'value', title: '总量'},
        {key: 'value', title: 'BTC估值'},
        {key: 'value', title: '美元估值'},
        {key: 'value', title: '人民币估值'},
        {key: 'state', title: '状态', render: (h, params) => {
            var state = params.row.state;
            var style = {};
            if (state === 0) {
                state = '未上架';
            } else if (state === 1) {
                state = '已上架，未开放交易';
                style = {color: '#ed3f14'};
            } else if (state === 2) {
                state = '已上架，已开放交易';
                style = {color: '#19be6b'};
            }
            return h('div', {
                style: style
            }, [state]);
        }},
        {key: 'value', title: '操作', width: 300, render: (h, params) => {
            var state = params.row.state;
            return h('div', [
                state === 0 ? h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: { marginRight: '10px'},
                    on: {
                        click: () => {
                            this.shelvesCoin(params.row);
                        }
                    }
                }, '上架') : '',
                state === 1 ? h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: { marginRight: '10px'},
                    on: {
                        click: () => {
                            this.underCoin(params.row);
                        }
                    }
                }, '下架') : '',
                state === 1 ? h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: { marginRight: '10px'},
                    on: {
                        click: () => {
                            this.openDeal(params.row);
                        }
                    }
                }, '开放交易') : '',
                state === 2 ? h('Button', {
                    props: {type: 'primary', size: 'small'},
                    on: {
                        click: () => {
                            this.closeDeal(params.row);
                        }
                    }
                }, '停止交易') : ''
            ]);
        }}
      ],
      modalShow: false,
      datas: []
    }
  },
  computed: {
      filterData () {
          return this.datas.filter((item) => {
              var search = this.search.toLowerCase();
              var symbol = item.symbol.toLowerCase();
              var caption = item.caption.toLowerCase();
              var b1 = this.search ? symbol.indexOf(search) !== -1 : caption.indexOf(search) !== -1;
              var b2 = this.state === 'all' ? true : this.state == item.state;

              return b1 && b2;
          });
      }
  },
  created () {
      this.getList();
  },
  methods: {
      getList () { // 获取币种列表
        util.ajax.get(`api/v1/manage/otc/symbolList`).then((res) => {
            if (res.data && res.data.rst === 1) {
                this.datas = res.data.data;
            } else if (res.data && res.data.rst !== 1){
                var msgs = res.data.msg;
                this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                window.console.log(res.data.msg);
            }
        }).catch((error) => {
            this.$Message.error('其他错误');
            window.console.log(error);
        });
      },
      shelvesCoin (item) { // 上架币种
        util.ajax.put(`api/v1/manage/otc/symbol/up/${item.id}`).then((res) => {
            if (res.data && res.data.rst === 1) {
                this.$Message.success(res.data.msg);
                item.state = 1;
            } else if (res.data && res.data.rst !== 1){
                var msgs = res.data.msg;
                this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                window.console.log(res.data.msg);
            }
        }).catch((error) => {
            this.$Message.error('其他错误');
            window.console.log(error);
        });
      },
      underCoin (item) { // 下架币种
        util.ajax.put(`api/v1/manage/otc/symbol/down/${item.id}`).then((res) => {
            if (res.data && res.data.rst === 1) {
                this.$Message.success(res.data.msg);
                item.state = 0;
            } else if (res.data && res.data.rst !== 1){
                var msgs = res.data.msg;
                this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                window.console.log(res.data.msg);
            }
        }).catch((error) => {
            this.$Message.error('其他错误');
            window.console.log(error);
        });
      },
      openDeal (item) { // 开放交易
        util.ajax.put(`api/v1/manage/otc/symbol/start/${item.id}`).then((res) => {
            if (res.data && res.data.rst === 1) {
                this.$Message.success(res.data.msg);
                item.state = 2;
            } else if (res.data && res.data.rst !== 1){
                var msgs = res.data.msg;
                this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                window.console.log(res.data.msg);
            }
        }).catch((error) => {
            this.$Message.error('其他错误');
            window.console.log(error);
        });
      },
      closeDeal (item) { // 停止交易
        util.ajax.put(`api/v1/manage/otc/symbol/stop/${item.id}`).then((res) => {
            if (res.data && res.data.rst === 1) {
                this.$Message.success(res.data.msg);
                item.state = 1;
            } else if (res.data && res.data.rst !== 1){
                var msgs = res.data.msg;
                this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                window.console.log(res.data.msg);
            }
        }).catch((error) => {
            this.$Message.error('其他错误');
            window.console.log(error);
        });
      }
  }
}
</script>

<style>

</style>
