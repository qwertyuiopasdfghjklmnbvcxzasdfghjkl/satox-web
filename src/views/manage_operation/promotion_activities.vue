<!-- 推广活动 -->
<template>
  <Card>
    <p slot="title">推广活动</p>
    <Table :columns="columns1" :data="data1"></Table> 
    <Row style="margin-top:10px;">
        <Col span="24" style="text-align:center;">
            添加BANNER页
            <Icon type="plus-round" style="cursor:pointer; color: #2d8cf0;font-size:24px;verticalAlign:middle;margin-left:10px;" @click="addBanner"></Icon>
        </Col>
    </Row>
    <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page> 
  </Card>
</template>

<script>
import extendApi from '../../api/extend'
import updaImg from './updaImg'
import util from '../../libs/util'
import addBanner from './addBanner'
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
              title: '跳转地址',
              key: 'jumpAddress',
            //   render: (h, params) => {
            //       return h('div', [
            //           h('span', [params.row.jumpAddress]),
            //           h('Icon', {
            //             props: {type: 'gear-b', size: 20},
            //             style: {cursor: 'pointer', marginLeft: '10px',verticalAlign: 'middle'}
            //           })
            //       ]);
            //   }
          },
          {
              title: '英文图片名称',
              key: 'activityImgNameEn',
          },
          {
              title: '英文图片跳转地址',
              key: 'jumpAddressEn',
            //   render: (h, params) => {
            //       return h('div', [
            //           h('span', [params.row.jumpAddress]),
            //           h('Icon', {
            //             props: {type: 'gear-b', size: 20},
            //             style: {cursor: 'pointer', marginLeft: '10px',verticalAlign: 'middle'}
            //           })
            //       ]);
            //   }
          },
          {
              title: '繁体图片名称',
              key: 'activityImgNameCht',
          },
          {
              title: '繁体图片跳转地址',
              key: 'jumpAddressCht',
            //   render: (h, params) => {
            //       return h('div', [
            //           h('span', [params.row.jumpAddress]),
            //           h('Icon', {
            //             props: {type: 'gear-b', size: 20},
            //             style: {cursor: 'pointer', marginLeft: '10px',verticalAlign: 'middle'}
            //           })
            //       ]);
            //   }
          },
          {
              title: '操作',
              key: 'opreat',
              render: (h, params) => {
                  return h('div', [
                      h('Button', {
                        props: {type: 'primary', size: 'small'},
                        style: {marginRight: '20px'},
                        on: {
                            click: () => {
                                util.setDialog(updaImg, {
                                    item: params.row,
                                    okCallback:() => {
                                        this.getfindAllActivity()
                                    }
                                });
                            }
                        }
                    }, '修改'),
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        on: {
                            click: () => {
                                extendApi.deleteBannerPage({
                                    promotionActivityId: params.row.promotionActivityId
                                }, (res) => {
                                    this.$Message.success({contnet: '删除成功'})
                                    this.getfindAllActivity()
                                }, (msg) => {
                                    this.$Message.error({contnet: msg})
                                })
                            }
                        }
                    }, '删除')
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
          extendApi.findAllActivity(this.curPage, { },(res, total) => {
              this.total = total
              this.data1 = res
          })
      },
      changePage (page) {
        this.curPage = page
        this.getfindAllActivity()
      },
      addBanner () {
          util.setDialog(addBanner, {
              okCallback: () => {
                   this.getfindAllActivity()
              }
          })
      }
  }
}
</script>

<style lang="less">
</style>
