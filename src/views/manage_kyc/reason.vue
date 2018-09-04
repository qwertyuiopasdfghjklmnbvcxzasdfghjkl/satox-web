<template>
    <div class="reason">
        <Card>
            <p slot="title">选择不通过原因</p>
            <select v-model="verifyAuditNoPassType">
                <option value="1">照片不清晰或不完整</option>
                <option value="2">关键信息被覆盖</option>
                <option value="3">证件已过期</option>
                <option value="4">上传错误的证件照片</option>
                <option value="5">未按要求手持写有newton和日期卡片</option>
                <option value="6">非本人证件</option>
                <option value="7">姓名或证件号码填写错误</option>
            </select>
            <Row>
                <Col span="5">
                    <Button type="primary" @click="failReasons">确定</Button>
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
  props: ['verifyId'],
  data () {
      return {
          verifyAuditNoPassType: '1'
      }
  },
  methods: {
      closeDialog () {
            this.$emit('removeDialog');
      },
      failReasons () {
          kycApi.listVerifyFailReasons({
              verifyId: this.verifyId,
              verifyAuditNoPassType: Number(this.verifyAuditNoPassType)
          },(res) => {
              this.$Message.success({content: '成功'})
              this.$emit('removeDialog')
          }, (msg) => {
               this.$Message.error({content: msg})
               this.$emit('removeDialog')
          })
      }
  }
}
</script>

<style scoped>
.reason{width: 500px;}
.reason select{width: 100%;height: 30px;border: 1px solid rgb(221, 222, 225);border-radius: 4px;margin-bottom: 30px;}
</style>

