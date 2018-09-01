<template>
  <div>
        <Row>
           <Card style="font-size:16px;">
                <Row>
                    <Form>
                        <p class="notwrap">
                            <strong>
                                <span>申诉管理</span>
                                <span class="padding-left-20">
                                    <Checkbox v-model="params.state">只显示待处理</Checkbox>
                                </span>
                                <span style="float:right;">
                                    <Button type="primary" @click="typeShow=true">问题类型管理</Button>
                                </span>
                            </strong>
                        </p>
                    </Form>
                </Row>
                <Row class="margin-top-20" style="height:760px;">
                    <Table :columns="columns" :data="datas"></Table>
                    <Page style="margin-top:10px;float:right;" :total="params.totalPage" :page-size="params.show" @on-change="pageChange"></Page>
                </Row>
            </Card>
        </Row>
        <viewdetail v-model="viewdetailShow" :id="id"/>
        <problemorder v-model="problemorderShow" :orderNumber="orderNumber"/>
        <typemodel v-model="typeShow"/>
    </div>
</template>

<script>
import viewdetail from './viewdetail';
import problemorder from './problemorder';
import typemodel from './typeModel';
import util from '@/libs/util';
import qs from 'qs';
export default {
  components: {
    viewdetail,
    problemorder,
    typemodel
  },
  data () {
    return {
      viewdetailShow: false,
      problemorderShow: false,
      typeShow: false,
      id: null,
      orderNumber: null,
      columns: [
        {key: 'username', title: '申诉账号'},
        {key: 'name', title: '申诉人名称'},
        {key: 'mobile', title: '申诉人手机号'},
        {key: 'order_number', title: '申诉订单号'},
        {key: 'type', title: '问题类型'},
        {key: 'state', title: '状态', render: (h, params) => {
            return h('div', {
                style: params.row.state === 1 ? {color: '#19be6b'}: {}
            }, [params.row.state === 1 ? '已处理' : '待处理']);
        }},
        {key: 'create_time', title: '申诉时间'},
        {key: 'description', title: '详情'},
        {key: 'action', title: '操作', width: 300, render: (h, params) => {
            var row = params.row;
            var state = row.state;
            return h('div', [
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: { marginRight: '10px'},
                    on: {
                        click: () => {
                            this.id = params.row.id;
                            this.viewdetailShow = true;
                        }
                    }
                }, '查看详情'),
                state === 1 ? '' : h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: { marginRight: '10px'},
                    on: {
                        click: () => {
                            this.orderNumber = row.order_number;
                            this.problemorderShow = true;
                        }
                    }
                }, '调出问题订单'),
                state === 1 ? '' : h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: { marginRight: '10px'},
                    on: {
                        click: () => {
                            this.updateAppeal(row);
                        }
                    }
                }, '已处理')
            ]);
        }}
      ],
      datas: [],
      params: {
          page: 1,
          show: 10,
          state: false,
          totalPage: 0
      }
    }
  },
  computed: {
      paramsChange () {
          var p = {
              page: this.params.page,
              show: this.params.show,
              state: this.params.state ? 0 : 1
          }
          p.state && (delete p.state);
          return p;
      }
  },
  watch: {
      paramsChange () {
          this.getList();
      }
  },
  created () {
      this.getList();
  },
  methods: {
      getList () { // 申诉列表
        util.ajax.post('api/v1/manage/otc/appeal/list', qs.stringify(this.paramsChange)).then((res) => {
            if (res.data && res.data.rst === 1) {
                this.datas = res.data.data;
                this.params.totalPage = res.data.total;
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
      updateAppeal (data) { // 更新申诉，标记为已处理
        util.ajax.put(`api/v1/manage/otc/appeal/${data.id}`).then((res) => {
            if (res.data && res.data.rst === 1) {
                this.$Message.success(res.data.msg);
                data.state = 1;
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
      pageChange (page) {
          this.params.page = page;
      }
  }
}
</script>

<style>

</style>
