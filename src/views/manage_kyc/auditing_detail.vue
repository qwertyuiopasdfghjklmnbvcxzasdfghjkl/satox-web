<!-- KYC审核 -> 查看详情并处理 -->
<template>
  <Card style="width:1000px;height:550px;">
      <p slot="title">
          详情信息
          <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;font-size:23px;" @click="closeDialog"></i>
      </p>
      <Table :columns="columns1" :data="data1" style="margin-bottom:20px;"></Table>
      <Row type="flex" justify="space-between" style="margin-bottom:20px;">
            <Col span="8" class="auditing_detail_img">
               <img v-if="data1.length && data1[0].verifyBackImg" v-image-preview :src="data1.length && data1[0].verifyBackImg" width="300px" height="300px"/>
            </Col>
            <Col span="8" class="auditing_detail_img">
               <img v-if="data1.length && data1[0].verifyFrontImg" v-image-preview :src="data1.length && data1[0].verifyFrontImg" width="300px" height="300px"/>
            </Col>
            <Col span="8" class="auditing_detail_img">
               <img v-if="data1.length && data1[0].verifyHandImg" v-image-preview :src="data1.length && data1[0].verifyHandImg" width="300px" height="300px"/>
            </Col>
      </Row>
      <Row type="flex" justify="center" v-if="this.type !== 'manage'">
          <Button type="ghost" style="margin-right: 8px" @click="disagree">不通过</Button>
          <Button type="primary" @click="pass()">通过</Button>
      </Row>
  </Card>
</template>

<script>
import kycApi from '../../api/kyc'
import util from '../../libs/util'
import check from './auditing_check'
import reason from './reason'
export default {
    props: ['verifyId', 'type', 'params'],
    data () {
        return {
            aaa: null,
            columns1: [
                {title: '账号', key: 'account'},
                {title: '地区', key: 'cn'},
                {title: '姓名', key: 'verifyName'},
                {title: '性别', key: 'verifySex',
                    render: (h, params) => {
                        return h('div', params.row.verifySex == 1 ? '男' : '女')
                    }
                },
                {title: '证件类型', key: 'verifyClass',
                    render: (h, params) => { // 1:身份证 2：驾照  3：护照
                        return h('div',  this.switchStaus(params.row.verifyClass))
                    }
                },
                {title: '证件号', key: 'verifyIdCard'}
            ],
            data1: [],
            code: ''
        }
    },
    created () {
        setTimeout(() => {
            this.aaa = 'https://www.baidu.com/img/bd_logo1.png'
        }, 2000)
        if (this.verifyId) {
            if (this.type === 'manage') {
                this.getDetail1()
                return
            }
            this.getDetail()
        }
        
    },
    methods: {
        disagree () {
             util.setDialog(reason, {
                 verifyId: this.verifyId
             })
        },
        pass () {
            if (this.type) {
                this.passfirstReview('true')
                return
            }
            this.getcationCheck(this.params.row.verifyId)
        },
        getcationCheck (verifyId) {
            kycApi.duplicationCheck({
                verifyId: verifyId
            }, (res) => {
                util.setDialog(check, {
                verifyId:verifyId,
                status: res,
                okCallback: () => {
                    this.$emit('okCallback')
                    this.$emit('removeDialog')
                }
                });
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        switchStaus(state) {// 0：驾照，1：护照，2：国民身份证）
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
        getDetail1 () {
            kycApi.showKycDetails({
              verifyId: this.verifyId
            }, (res) => {
                this.data1 = [res]
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        getDetail () {
            kycApi[this.type !== 'fuhe' ? 'showFirstReview' : 'showSecondReview']({
              verifyId: this.verifyId
            }, (res) => {
                this.data1 = [res]
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        closeDialog () {
            this.$emit('removeDialog')
        },
        passfirstReview (code) {
            kycApi[this.type !== 'fuhe' ? 'firstReview' : 'secondReview'](code,{
              verifyId: this.verifyId
            }, (res) => {
                if (code === 'true') {
                    this.$Message.success({content: '审核通过'})
                    this.$emit('okCallback')
                    this.$emit('removeDialog')
                } else {
                    this.$Message.error({content: '审核不通过'})
                    this.$emit('okCallback')
                    this.$emit('removeDialog')
                }
            })
        }
    }
}
</script>

<style lang="less">
.auditing_detail_img{width:300px!important;height:300px!important;background:gray;}
</style>
