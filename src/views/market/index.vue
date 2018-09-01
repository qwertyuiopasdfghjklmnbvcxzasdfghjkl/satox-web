<template>
  <div>
        <Row>
           <Card style="font-size:16px;">
                <Row>
                    <Form>
                        <p class="notwrap">
                            <strong>
                                <span>市场管理</span>
                            </strong>
                        </p>
                         <p class="notwrap margin-top-20">
                            <Tabs type="card" :animated="false" style="height:750px;">
                                <TabPane label="BTC市场" name="BTC">
                                    <Row style="margin-bottom:10px;">
                                        <Button type="primary">添加新币种</Button>
                                    </Row>
                                    <Table :columns="columns" :data="datas"></Table>
                                </TabPane>
                                <TabPane label="ETH市场" name="ETH">
                                    <Row style="margin-bottom:10px;">
                                        <Button type="primary">添加新币种</Button>
                                    </Row>
                                    <Table :columns="columns" :data="datas"></Table>
                                </TabPane>
                                <TabPane label="ATN市场" name="ATN">
                                    <Row style="margin-bottom:10px;">
                                        <Button type="primary">添加新币种</Button>
                                    </Row>
                                    <Table :columns="columns" :data="datas"></Table>
                                </TabPane>
                            </Tabs>
                        </p>
                    </Form>
                </Row>
            </Card>
        </Row>
    </div>
</template>

<script>
import util from '@/libs/util';
import qs from 'qs';
export default {
  data () {
    return {
      params: {
        symbol: 'BTC'
      },
      columns: [
        {key: 'symbol', title: '币种'},
        {key: 'status', title: '状态', render: (h, params) => {
            var status = params.row.status;
            var txt = '已过期';
            if (status === 0) {
                txt = '已下架';
            } else if (status === 1) {
                txt = '已上架';
            }
            return h('div', [txt]);
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
                        }
                    }
                }, '查看订单'),
                status !== 0 && status !== 1 ? '' : h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: { marginRight: '10px'},
                    on: {
                        click: () => {
                        }
                    }
                }, txtStatus)
            ]);
        }}
      ],
      datas: []
    }
  },
  watch: {
      'params.symbol' () {
          this.getList();
      }
  },
  created () {
    this.getList();
  },
  methods: {
    getList () { // 获取对应市场币种列表
        return;
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
    }
  }
}
</script>