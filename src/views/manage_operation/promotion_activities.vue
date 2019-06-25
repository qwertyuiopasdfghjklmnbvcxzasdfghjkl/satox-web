<!-- 推广活动 -->
<template>
  <Card>
    <p slot="title">{{$t('operation.hdtg')}}</p>
    <Table :columns="columns1" :data="data1"></Table>
    <Row style="margin-top:10px;">
        <Col span="24" style="text-align:center;margin: 0 auto;">
            {{$t('operation.tjbny')}}
            <div @click="addBanner" style="display:inline-block;">
                 <Icon type="plus-round" style="cursor:pointer; color: #2d8cf0;font-size:24px;verticalAlign:middle;margin-left:10px;" ></Icon>
            </div>
        </Col>
    </Row>
    <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
  </Card>
</template>

<script>
import extendApi from '../../api/extend'
import updaImg from './activities/updaImg'
import util from '../../libs/util'
import addBanner from './activities/addBanner'
export default {
  data () {
    return {
      curPage: 1,
      total: 0,
      columns1: [
          {
              title: this.$t('operation.ggw'),
              key: 'adPosition'
          },
          {
              title: this.$t('common.gxsj'),
              key: 'lastUpdatedTime'
          },
          {
              title: this.$t('operation.tpmc'),
              key: 'activityImgName',
          },
          {
              title: this.$t('operation.tzdz'),
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
              title: this.$t('operation.ywtpmc'),
              key: 'activityImgNameEn',
          },
          {
              title: this.$t('operation.ywtptzdz'),
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
              title: this.$t('operation.fttpmc'),
              key: 'activityImgNameCht',
          },
          {
              title: this.$t('operation.fttptzdz'),
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
              title: this.$t('common.cz'),
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
                    }, this.$t('common.xg')),
                    h('Button', {
                        props: {type: 'primary', size: 'small'},
                        on: {
                            click: () => {
                                debugger
                                extendApi.deleteBannerPage({
                                    promotionActivityId: params.row.promotionActivityId
                                }, (res) => {
                                    this.$Message.success({content: this.$t('kyc.sccg')})
                                    this.getfindAllActivity()
                                }, (msg) => {
                                    this.$Message.error({contnet: msg})
                                })
                            }
                        }
                    }, this.$t('common.sc'))
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
