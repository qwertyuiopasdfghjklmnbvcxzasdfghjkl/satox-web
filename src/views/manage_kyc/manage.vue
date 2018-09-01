<!-- KYC管理 -->
<template>
  <Row>
    <Card>
      <p slot="title">
        KYC管理
      </p>
      <Row>
        <Col span="16">
          <Select v-model="formData.type" style="width:200px;">
            <Option value="account">账号</Option>
            <Option value="verifyName">姓名</Option>
            <Option value="verifyIdCard">证件号</Option>
            <Option value="cn">地区</Option>
          </Select>
          <Input v-model="formData.text" clearable style="width: 200px"></Input>
          <Button type="primary" @click="getList">查询</Button>
        </Col>
        <Col span="8">
          <Button type="primary" style="float:right;" @click="addDialog">添加</Button>
        </Col>
      </Row>
      <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
      <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
    </Card>
  </Row>
</template>

<script>
import util from '../../libs/util'
import detail from './auditing_detail'
import add from './add'
import kyc from '../../api/kyc'
export default {
  data () {
    return {
      curPage: 1,
      total: 0,
      formData: {
        type: 'account',
        text: ''
      },
      columns1: [
        {title: '账号', key: 'account'},
        {title: '地区', key: 'cn'},
        {title: '姓名', key: 'verifyName'},
        {title: '性别', key: 'verifySex',
          render: (h, params) => {
              return h('div', params.row.verifySex === 1 ? '男' : '女')
          }
        },
        {title: '证件类型', key: 'verifyClass',
          render: (h, params) => { 
              return h('div',  this.switchVerify(params.row.verifyClass))
          }
        }, 
        {title: '证件号', key: 'verifyIdCard'},
        {title: '状态', key: 'verifyStatus',  //0：未验证、1：待审核、2：已通过、3：未通过、4 : 待复核
          render: (h, params) => { // 0：未验证  蓝色、1：待审核 蓝色、2：已通过 绿色、3：未通过 红色、4 : 待复核 紫色
              let status = Number(params.row.verifyStatus)
              let color = ''

              switch(status){
                  case 0:
                      color = 'blue'
                      break;
                  case 1:
                      color = 'blue'
                      break;
                  case 2:
                      color = 'green'
                      break;
                  case 3:
                      color = 'red'
                      break;
                  case 4:
                      color = '#eb00ff'
                      break;
              }
              return h('div', [
                h('div', {
                    style: { color: color}
                }, this.switchStaus(params.row.verifyStatus)),
              ])
              
          }
        },
        {title: '通过时间', key: 'verifyUpdateTime'},
        {title: '审核管理员', key: 'firstMgrName'},
        {title: '复核管理员', key: 'secondMgrName'},
        {title: '操作', key: 'action', render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: {marginRight: '10px'},
                    on: {
                        click: () => {
                          util.setDialog(detail, {
                            verifyId: params.row.verifyId,
                            type: 'manage'
                          })
                        }
                    }
                }, '查看详情'),
                // h('Button', {
                //     props: {type: 'primary', size: 'small'},
                //     on: {
                //         click: () => {
                //           this.$Modal.confirm({
                //                 content: '<p style="font-size:20px;margin-top:-6px;">确认删除？</p>',
                //                 style: {fontSize: '20px'},
                //                 onOk: () => {
                //                   kyc.deleteVerify({
                //                     verifyId: params.row.verifyId,
                //                     verifyStatus: params.row.verifyStatus
                //                   }, (msg) => {
                //                     this.$Message.success({content: '删除成功'});
                //                     this.getList();
                //                   }, (msg) => {
                //                     this.$Message.error({content: msg});
                //                   })     
                //                 }
                //             });
                //         }
                //     }
                // }, '删除')
            ]);
        }}
      ],
      data1: []
    }
  },
  created () {
    this.getList();
  },
  methods: {
    switchVerify(state) {// 0：驾照，1：护照，2：国民身份证）
        switch(state){
            case 2:
                return '身份证'
                break;
            case 0:
                return '驾照'
                break;
            case 1:
                return '护照'
                break;
        }
    },
    switchStaus(state) {//0：未验证、1：待审核、2：已通过、3：未通过、4 : 待复核
        switch(state){
            case 0:
                return '未验证'
                break;
            case 1:
                return '待审核'
                break;
            case 2:
                return '已通过'
                break;
            case 3:
                return '未通过'
                break;
            case 4:
                return '待复核'
                break;
        }
    },
    getList () {
      let data = {}
      if (this.formData.text) {
        data[this.formData.type] = this.formData.text
      }
      kyc.selectPageKycVerifys(this.curPage, data, (res, total) => {
        this.total = total
        this.data1 = res
      });
    },
    addDialog () {
      util.setDialog(add, {
        okCallback: () => {
            this.getList()
        }
      })
    },
    changePage (page) {
      this.curPage = page
      this.getList()
    }
  }
}
</script>

<style lang="less">
.ivu-modal-confirm-body{font-size: 20px;}
</style>
