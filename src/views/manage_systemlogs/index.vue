<!-- 系统日志 -->
<template>
  <Card>
    <p slot="title">{{$t('systemlog.xtrz')}}</p>
    <Row >
        <Col span="12"></Col>
        <Col span="6" style="float:right;"><Button type="primary" @click="exportTable">{{$t('systemlog.dc')}}</Button></Col>
        <Col span="6" style="float:right;">
            {{$t('common.sj')}}： <DatePicker v-model="formItem.date" format="yyyy-MM-dd" type="daterange" placement="bottom-end" style="width: 200px"></DatePicker>
        </Col>
    </Row>
    <Tabs @on-click="aaa">
        <TabPane :label="$t('systemlog.glydlrz')">
          <Table :columns="columns1" :data="data1"></Table>
          <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
        </TabPane>
        <TabPane :label="$t('systemlog.glyczrz')">
          <Table :columns="columns3" :data="data3"></Table>
          <Page :current="curPage1" :total="total1" @on-change="changePage1" style="text-align:center;margin-top:20px;"></Page>
        </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import logs from '../../api/logs'
import util from '../../libs/util'
export default {
  data () {
    return {
      type: 0,
      formItem: {
        date: []
      },
      curPage: 1,
      total: 0,
      curPage1: 1,
      total1: 0,
      columns1: [
        {title: this.$t('systemlog.gly'), key: 'userRealName'},
        {title: this.$t('systemlog.khdlx'), key: 'clientType'},
        {title: this.$t('systemlog.dlip'), key: 'clientIp'},
        {title: this.$t('systemlog.dlipszd'), key: 'loginLocation'},
        {title: this.$t('systemlog.dlylxsj'), key: 'loginTime',
           render: (h, params) => {
              return h('div',  [params.row.loginTime,' -- ', params.row.logoutTime == null ? '':
                  params.row.logoutTime])
          }
        }
      ],
      data1: [],
      item: {
        userRealName: '',
        optContent: ''
      },
      tempItem: {},
      columns3: [
        {title: this.$t('systemlog.gly'), key: 'userRealName'},
        {title: this.$t('systemlog.czdx'), key: 'target'},
        {title: this.$t('systemlog.mk'), key: 'optModel'},
        {title: this.$t('systemlog.czlx'), key: 'optEvent',
           render: (h, params) => {
              return h('div', this.switchStaus(Number(params.row.optEvent)))
          }
        },
        {title: this.$t('systemlog.gn'), key: 'desc'},
        {title: this.$t('systemlog.cznr'), key: 'optContent'},
        {title: this.$t('systemlog.czsj'), key: 'optTime'}
      ],
      data3: []
    }
  },
  created () {
    this.getLogList()
    this.getUserLogin ()
  },
  computed: {
    params () {
      let data = []
      if (this.formItem.date[0]) {
        data.push(`beginDate=${util.dateToStr(this.formItem.date[0])}`)
      } else {
        data.push(`beginDate=${util.dateToStr(new Date(), 'yyyy-MM-dd 00:00:00')}`)
      }
      if (this.formItem.date[1]) {
        data.push(`endDate=${util.dateToStr(this.formItem.date[1], 'yyyy-MM-dd 23:59:59')}`)
      } else {
        data.push(`endDate=${util.dateToStr(new Date(), 'yyyy-MM-dd 23:59:59')}`)
      }
      return data
    }
  },
  methods: {
    aaa (a) {
      this.type = a;
    },
    exportTable () {
      if (this.type===0) {
        window.location.href = `${util.baseURL}`+`api/bm/sysLog/exportUserLoginLogExcel?${this.params.join('&')}`
      } else {
         window.location.href = `${util.baseURL}`+`api/bm/sysLog/exportUserOperateLogExcel?${this.params.join('&')}`
      }

    },
    switchStaus(type) { //2，查询      3，新增    4，修改     5，删除
      switch(type){
        case 2:
            return this.$t('common.cx')
            break;
        case 3:
            return this.$t('common.xz')
            break;
        case 4:
            return this.$t('common.xg')
            break;
        case 5:
            return this.$t('kyc.sc')
            break;
      }
    },
    getLogList () {
      logs.findOptLogList(this.curPage1, (res, total) => {
        this.total1 = total
        this.data3 = res
      }, (msg) => {
        this.$Message.error({content: msg})
      })
    },
    changePage1 (page) {
      this.curPage1 = page
      this.getLogList()
    },
    getUserLogin () {
      logs.findUserLoginLogList(this.curPage, (res, total) => {
        this.total = total
        this.data1 = res
      }, (msg) => {
        this.$Message.error({content: msg})
      })
    },
    changePage (page) {
      this.curPage = page
      this.getUserLogin()
    }
  }
}
</script>

<style lang="less">
</style>
