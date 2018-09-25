<template>
  <div class="updataMarket">
      <Card>
          <p slot="title">修改
              <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
          </p>
          <Row style="margin-bottom: 20px;">
              <Col span="3">
                市场
              </Col>
              <Col span="3">
                {{item.market}}
              </Col>
              <Col span="10">
                <Input style="width:200px" v-model="newMarket"></Input>
                <!-- <Input v-model="formValidate.serialNumber" :maxlength="255" name="serialNumber"></Input> -->
              </Col>
              <Col span="6">
                <Button type="primary" @click="upMarket('1')">修改</Button>
              </Col>
          </Row>
          <Row>
              <Col span="3">
                备注
              </Col>
              <Col span="3">
                {{item.remark}}
              </Col>
              <Col span="10">
                <Input style="width:200px" v-model="remark"></Input>
                <!-- <Input v-model="formValidate.serialNumber" :maxlength="255" name="serialNumber"></Input> -->
              </Col>
              <Col span="6">
                <Button type="primary" @click="upMarket('2')">修改</Button>
              </Col>
          </Row>
      </Card>
  </div>  
</template>
<script>
import extendApi from '../../api/extend'
export default {
    props: ['item'],
    data () {
        return{
            newMarket: '',
            remark: ''
        }
    },
    methods: {
        upMarket (code) {
            if (code == '1') {
                extendApi.updateSpecialMarket({
                    newMarket: this.newMarket,
                    oldMarketId: this.item.marketId,
                    oldMarket: this.item.market,
                    oldVersion: this.item.version,
                    oldRemark: this.item.remark,
                    oldIdx:this.item.idx
                },(res) => {
                    this.$Message.success({content: '修改成功'})
                }, (msg) => {
                    this.$Message.error({contnet: msg})
                })
            } else {
                extendApi.updateSpecialMarket({
                    oldMarketId: this.item.marketId,
                    oldVersion: this.item.version,
                    remark: this.remark
                },(res) => {
                    this.$Message.success({content: '修改成功'})
                }, (msg) => {
                    this.$Message.error({contnet: msg})
                })
            }
            
        },
        closeDialog () {
            this.$emit('removeDialog')
        }
    }
}
</script>
<style>
.updataMarket{width: 700px;padding: 10px;background: #fff;}
</style>
