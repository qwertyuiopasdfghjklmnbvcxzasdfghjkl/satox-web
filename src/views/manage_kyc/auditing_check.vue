<!-- KYC审核 -> 重复检查 -->
<template>
  <Card style="width:400px;height:180px;">
    <Row style="padding:30px;font-size:20px;text-align:center;" v-if="status===false">发现重复记录，审核未通过</Row>
    <Row style="padding:30px;font-size:20px;text-align:center;" v-if="status===true">未发现重复记录，审核通过</Row>
    <Row type="flex" justify="center">
      <!-- <Button type="ghost" style="margin-right: 8px" @click="closeDialog">取消</Button> -->
      <Button type="primary" @click="passfirstReview(status)">确定</Button>
    </Row>
  </Card>
</template>

<script>
import kycAPI from '../../api/kyc'
export default {
    props: ['verifyId', 'status'],
    methods: {
        closeDialog () {
            this.$emit('removeDialog')
        },
        getcationCheck () {
          kycAPI.duplicationCheck({
            verifyId: this.verifyId
          }, (res) => {
             this.$emit('okCallback')
             this.$emit('removeDialog')
          }, (msg) => {
            this.$Message.error({content: msg})
            this.$emit('okCallback')
          })
        },
        passfirstReview (code) {
            if (code) {
              kycAPI[this.type !== 'fuhe' ? 'firstReview' : 'secondReview'](code,{
                verifyId: this.verifyId
              }, (res) => {
                  if (code) {
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
               this.$emit('okCallback')
               this.$emit('removeDialog')
            }
        }
    }
}
</script>

<style lang="less">
</style>
