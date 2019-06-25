<!-- 上币/退币 -->
<template>
  <div>
    <Card>
      <p slot="title">上币/退币</p>
      <Row>
          <Button type="primary" style="float:right" @click="creates()">添加货币</Button>
      </Row>
      <Table :columns="columns1" :data="data1" style="margin-top:20px;"></Table>
    </Card>
  </div>
</template>

<script>
import util from '../../../libs/util'
import create from '../distrbute/create'
export default {
    data () {
        return {
            columns1: [
                {
                    title: '币种',
                    key: 'curreny'
                },
                {
                    title: '上币时间',
                    key: 'time'
                },
                {
                    title: '状态',
                    key: 'stutas'
                },
                {
                    title: '操作',
                    key: 'opreat',
                    render: (h, params) => {
                      return h('div', [
                          h('Button', {
                              props: {type: 'primary', size: 'small'},
                              style: {marginRight: '10px'},
                              on: {
                                  click: () => {
                                  }
                              }
                          }, '退币')
                      ]);
                  }
                }
            ],
            data1: [
                {
                  curreny: 'BTC',
                  time: '2018-05-10',
                  stutas: '正常'
                },
                {
                  curreny: 'BTC',
                  time: '2018-05-12',
                  stutas: '未上线'
                }
            ]
        }
    },
    methods: {
      creates () {
        util.setDialog(create)
      }
    }
}
</script>

