<template>
  <div class="aaa" style="width:2300px;">
     <Row style="margin-bottom: 20px;margin-top:20px;">
       <Col span="1">错误应用：</Col>
       <Col span="2">
          <Input v-model="errorApp"  style="width:100px;"/>
       </Col>
       <Col span="1">错误模块：</Col>
       <Col span="2">
           <Input v-model="errorModal"  style="width:100px;"/>
       </Col>
      <Col span="1">错误发生时间：</Col>
      <Col span="2">
          <DatePicker type="date" v-model="date" placeholder="开始时间" format="yyyy-MM-dd" style="width: 150px"></DatePicker>
      </Col>
       <Col span="2">
          <DatePicker type="date" v-model="date1" placeholder="结束时间" format="yyyy-MM-dd" style="width: 150px"></DatePicker>
      </Col>
      <Col span="1">业务ID: </Col>
       <Col span="3">
          <Input v-model="businessId"   style="width:150px;"/>
       </Col>
       <Col span="2">
          <Button type="primary" @click="curPage=1;getfindErrorLogList()">查询</Button>
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
                        title: '错误应用',
                        key: 'app'
                    },
                    {
                        title: '错误模块',
                        key: 'module'
                    },
                    {
                        title: '业务表',
                        key: 'businessTable'
                    },
                    {
                        title: '业务ID',
                        key: 'businessId'
                    },
                     {
                        title: '错误类别',
                        key: 'errorType'
                    },
                    {
                        title: '错误简述',
                        key: 'errorSketch',
                        width: 300
                    },
                    {
                        title: '错误详情',
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
                                }, '查看详情链接')
                            ]);
                        }

                    },
                    {
                        title: '参数',
                        key: 'params',
                        width: 300
                    },
                    {
                        title: '发生错误的路径',
                        key: 'path'
                    },
                    {
                        title: '外部服务地址',
                        key: 'externalServices'
                    },
                    {
                        title: '创建时间',
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


