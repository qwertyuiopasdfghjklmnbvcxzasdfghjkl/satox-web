<template>
  <div class="addMarket">
      <Card>
          <p slot="title">新增</p>
           <Row style="margin-bottom: 20px;">
              <Col span="3">
                市场
              </Col>
              <Col span="10">
                <Input style="width:200px" v-model="market"></Input>
              </Col>
          </Row>
          <Row style="margin-bottom: 20px;">
              <Col span="3">
                备注
              </Col>
              <Col span="10">
                <Input style="width:200px" v-model="remark"></Input>
              </Col>
          </Row>
           <Row style="margin-bottom: 20px;">
              <Col span="3">
                idx
              </Col>
              <Col span="10">
                 <select v-model="idx" style="width:100px;height:30px;border: 1px solid #dddee1;border-radius: 4px;">
                    <!-- <option value="">全部</option> -->
                    <option value="1">1 </option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
              </Col>
          </Row>
          <Row style="margin-bottom: 20px;">
              <Col span="10">
                <Button type="primary" @click="addSpecialMarket">确定</Button>
              </Col>
              <Col span="10">
                <Button @click="closeDialog">取消</Button>
              </Col>
          </Row>
      </Card>
  </div>  
</template>
<script>
import extendApi from '../../api/extend'
export default {
    data () {
        return {
            market: '',
            remark: '',
            idx:　'1'
        }
    },
    methods: {
        addSpecialMarket () {
            extendApi.addSpecialMarket({
                market: this.market,
                remark: this.remark,
                idx:　this.idx
            },(res) =>{
                this.$Message.success({content: '添加成功'})
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        closeDialog () {
            this.$emit('removeDialog')
        }
    }
}
</script>
<style>
.addMarket{padding: 10px;width: 500px;}
</style>
