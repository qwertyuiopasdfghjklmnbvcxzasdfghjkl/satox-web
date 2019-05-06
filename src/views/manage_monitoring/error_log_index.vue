<template>
  <div class="aaa" style="width:2300px;">
     <Row style="margin-bottom: 20px;margin-top:20px;">
       <Col span="1">{{$t('monitoring.cwyy')}}：</Col>
       <Col span="2">
          <Input v-model="errorApp"  style="width:100px;"/>
       </Col>
       <Col span="1">{{$t('monitoring.cwmk')}}：</Col>
       <Col span="2">
           <Input v-model="errorModal"  style="width:100px;"/>
       </Col>
      <Col span="1">{{$t('monitoring.cwfssj')}}：</Col>
      <Col span="2">
          <DatePicker type="date" v-model="date" :placeholder="$t('common.kssj')"
                      format="yyyy-MM-dd" style="width: 150px"></DatePicker>
      </Col>
       <Col span="2">
          <DatePicker type="date" v-model="date1" :placeholder="$t('common.jssj')"
                      format="yyyy-MM-dd" style="width: 150px"></DatePicker>
      </Col>
      <Col span="1">{{$t('monitoring.ywid')}}: </Col>
       <Col span="3">
          <Input v-model="businessId"   style="width:150px;"/>
       </Col>
       <Col span="2">
          <Button type="primary" @click="curPage=1;getfindErrorLogList()">{{$t('common.cx')}}</Button>
      </Col>
     </Row>
     <Table :columns="columns1" :data="data1"></Table>
     <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
  </div>
</template>
<script>
import monitApi from '../../api/monitoring'
import util from '../../libs/util'
import errorDe from './errorDe'
    export default {
        data () {
            return {
               errorApp: '',
               errorModal: '',
               businessId: '',
               date: '',
               date1: '',
               curPage: 1,
               total: 0,
               curPage1: 1,
               total1: 0,
               columns1: [
                    {
                        title: this.$t('monitoring.cwyy'),
                        key: 'app'
                    },
                    {
                        title: this.$t('monitoring.cwmk'),
                        key: 'module'
                    },
                    {
                        title: this.$t('monitoring.ywb'),
                        key: 'businessTable'
                    },
                    {
                        title: this.$t('monitoring.ywid'),
                        key: 'businessId'
                    },
                     {
                        title: this.$t('monitoring.cwlb'),
                        key: 'errorType'
                    },
                    {
                        title: this.$t('monitoring.cwjs'),
                        key: 'errorSketch',
                        width: 300
                    },
                    {
                        title: this.$t('monitoring.cwxq'),
                        key: 'errorDetails',//
                        render: (h, params) => {
                            return h('div', [
                                params.row.hasDetails === 0 ? '': h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(errorDe, {
                                                errorLogId: params.row.errorLogId
                                            })

                                        }
                                    }
                                }, this.$t('monitoring.ckxqlj'))
                            ]);
                        }

                    },
                    {
                        title: this.$t('monitoring.cs'),
                        key: 'params',
                        width: 300
                    },
                    {
                        title: this.$t('monitoring.cscwdlj'),
                        key: 'path'
                    },
                    {
                        title: this.$t('monitoring.wbfwdz'),
                        key: 'externalServices'
                    },
                    {
                        title: this.$t('common.cjsj'),
                        key: 'createdTime'
                    }
                ],
                data1: []
            }
        },
        created () {
            this.getfindErrorLogList()
        },
        computed: {
            params () {
                let data = {
                    errorApp: this.errorApp,
                    errorModal: this.errorModal,
                    businessId: this.businessId
                }
                // data.beginDate = util.dateToStr(new Date(), 'yyyy-MM-dd 00:00:00')
                if (this.date) {
                    data.beginTime = util.dateToStrDate(this.date)
                }
                if (this.date1) {
                    data.endTime = util.dateToStrDate(this.date1)
                }
                return data
            }
        },
        methods: {
            getfindErrorLogList () {
                monitApi.findErrorLogListPage(this.curPage, {
                    app: this.errorApp || '',
                    module: this.errorModal || '',
                    businessId: this.businessId || '',
                    beginTime: this.params.beginTime || null,
                    endTime: this.params.endTime || null
                }, (res, total) => {
                    this.total = total
                    this.data1 = res
                })
            },
            changePage (page) {
                this.curPage = page
                this.getfindErrorLogList()
            }
        }
    }
</script>
<style scoped>
.ivu-row{height: 40px;line-height: 40px;}
</style>


