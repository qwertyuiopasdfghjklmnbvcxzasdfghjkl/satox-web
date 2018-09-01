<!-- 开放API管理 -->
<template>
  <Row>
    <Card>
      <p slot="title">API</p>
      <Table :columns="columns1" :data="data1"></Table>
    </Card>
    <Card style="margin:10px 0;">
      <p slot="title">接入IP</p>
      <Table :columns="columns2" :data="data2"></Table>
    </Card>
    <Card>
      <p slot="title">websocket</p>
      <Table :columns="columns3" :data="data3"></Table>
    </Card>
  </Row>
</template>

<script>
export default {
  data () {
    return {
      columns1: [
        {title: '接口名称', key: 'name'},
        {title: '状态', key: 'status'},
        {title: '操作', key: 'action', render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: {marginRight: '10px'},
                    on: {
                        click: () => {
                        }
                    }
                }, '关闭'),
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    on: {
                        click: () => {
                        }
                    }
                }, '开启')
            ]);
        }}
      ],
      data1: [
        {name: 'API 1', status: '开启'}
      ],
      columns2: [
        {title: '账户', key: 'username'},
        {title: 'IP', key: 'ip'},
        {title: '访问频率', key: 'total'},
        {title: '状态', key: 'status'},
        {title: '操作', key: 'action', render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    on: {
                        click: () => {
                        }
                    }
                }, '禁止')
            ]);
        }}
      ],
      data2: [{username: '1@qq.com', ip: '127.0.0.1', total: '99999/min', status: '正常'}],
      columns3: [
        {title: '接口名称', key: 'name'},
        {title: '状态', key: 'status'},
        {title: '操作', key: 'action', render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: {marginRight: '10px'},
                    on: {
                        click: () => {
                        }
                    }
                }, '关闭'),
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    on: {
                        click: () => {
                        }
                    }
                }, '开启')
            ]);
        }}
      ],
      data3: [
        {name: 'API 1', status: '正常'}
      ]
    }
  }
}
</script>

<style lang="less">
</style>
