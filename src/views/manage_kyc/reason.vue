<template>
    <div class="reason">
        <Card>
            <p slot="title">选择不通过原因</p>
            <select v-model="verifyAuditNoPassType">
                <option value="0" selected>请选择</option>
                <option :value="data.verifyFailId" v-for="(data, index) in reasonData" :key="data.id">{{data.descCn}}</option>
                <!-- <option value="2">关键信息被覆盖</option>
                <option value="3">证件已过期</option>
                <option value="4">上传错误的证件照片</option>
                <option value="5">未按要求手持写有newton和日期卡片</option>
                <option value="6">非本人证件</option>
                <option value="7">姓名或证件号码填写错误</option> -->
            </select>
            <Row>
                <Col span="5">
                    <Button type="primary" @click="passfirstReview('false')">确定</Button>
                </Col>
                <Col span="5">
                    <Button type="ghost" @click="closeDialog">取消</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import kycApi from '../../api/kyc'
export default {
  props: ['verifyId', 'type'],
  data () {
      return {
          verifyAuditNoPassType: '0',
          reasonData: []
      }
  },
  created () {
      this.failReasons()
  },
  methods: {
      closeDialog () {
            this.$emit('removeDialog');
      },
      failReasons () {
          kycApi.listVerifyFailReasons({
              verifyId: this.verifyId
          },(res) => {
              this.reasonData = res
          }, (msg) => {
               this.$Message.error({content: msg})
          })
      },
      passfirstReview (code) {
          console.log(this.type)
            if (Number(this.verifyAuditNoPassType) !== 0) {
              kycApi[this.type !== 'fuhe' ? 'firstReview' : 'secondReview'](code,{
              verifyId: this.verifyId,
              verifyAuditNoPassType: Number(this.verifyAuditNoPassType)
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
          } else {
              this.$Message.error({content: '请选择理由'})
          }
        }
  }
}
</script>

<style scoped>
.reason{width: 500px;}
.reason select{width: 100%;height: 30px;border: 1px solid rgb(221, 222, 225);border-radius: 4px;margin-bottom: 30px;}
</style>

