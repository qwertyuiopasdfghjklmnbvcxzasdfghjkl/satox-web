<!-- 推广活动 -->
<template>
  <Card>
    <p slot="title">推广活动</p>
    <Table :columns="columns1" :data="data1"></Table>
    <Row style="margin-top:10px;">
        <Col span="12" style="text-align:center;">添加BANNER页<Icon type="plus-round" style="cursor:pointer; color: #2d8cf0;font-size:24px;verticalAlign:middle;margin-left:10px;"></Icon></Col>
        <Col span="12"></Col>
    </Row>
  </Card>
  
</template>

<script>
import extendApi from '../../api/extend'
export default {
  data () {
    return {
      curPage: 1, 
      total: 0,
      columns1: [
          {
              title: '广告位',
              key: 'adPosition'
          },
          {
              title: '更新时间',
              key: 'lastUpdatedTime'
          },
          {
              title: '图片名称',
              key: 'activityImgName',
          },
          {
              title: '展示时长',
              key: 'display_duration',
            //   render: (h, params) => {
            //       h('div', [(params.row.displayBeginTime) - (params.row.displayEndTime)  ])
            //   }
              render: (h, params) => {
                  return h('div', [
                      h('span', [(params.row.displayBeginTime) - (params.row.displayEndTime)  ]),
                      h('Icon', {
                        props: {type: 'gear-b', size: 20},
                        style: {cursor: 'pointer', marginLeft: '10px',verticalAlign: 'middle'}
                      })
                  ]);
              }
          },
          {
              title: '操作',
              key: 'opreat',
              render: (h, params) => {
                  return h('div', [
                      h('Upload', {
                          props: {action: '//jsonplaceholder.typicode.com/posts/'}
                      }, [
                        h('Button', {
                          props: {type: 'primary', size: 'small', icon: 'ios-cloud-upload-outline'}
                        }, '上传图片')
                      ])
                  ]);
              }
          }
      ],
      data1: []
    }
  },
  created () {
      this.getfindAllActivity()
  },
  methods: {
      getfindAllActivity () {
          extendApi.findAllActivity(this.curPage, { },(res) => {
              this.data1 = res
          })
      },
      changePage (page) {
        this.curPage = page
        this.getfindAllActivity()
      }
  }
}
</script>

<style lang="less">
</style>
