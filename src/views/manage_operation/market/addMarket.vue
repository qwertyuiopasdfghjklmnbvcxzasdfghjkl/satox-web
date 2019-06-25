<template>
  <div class="addMarket">
      <Card>
          <p slot="title">{{vm.$t('common.xz')}}</p>
           <Row style="margin-bottom: 20px;">
              <Col span="3">
                  {{vm.$t('risk.sc')}}
              </Col>
              <Col span="10">
                <Input style="width:200px" v-model="market"></Input>
              </Col>
          </Row>
          <Row style="margin-bottom: 20px;">
              <Col span="3">
                  {{vm.$t('common.bz')}}
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
                <Button type="primary" @click="addSpecialMarket">{{vm.$t('common.qd')}}</Button>
              </Col>
              <Col span="10">
                <Button @click="closeDialog">{{vm.$t('common.qx')}}</Button>
              </Col>
          </Row>
      </Card>
  </div>
</template>
<script>
import extendApi from '../../../api/extend'
export default {
    data () {
        const vm = window.vm;
        return {
            vm: vm,
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
                this.$Message.success({content: this.vm.$t('common.tjcg')})
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
