<template>
  <div class="safety">
    <h3>我的IEO<!--我的IEO--></h3>
    <ul class="join-list">
      <li class="header">
        <span>认购时间</span>
        <span>付款币种</span>
        <span>申请份数</span>
        <span>申请金额</span>
        <span>获取数量</span>
        <span>状态</span>
      </li>
      <li>
        <span>2019-05-05 00:00:00</span>
        <span>BTC</span>
        <span>100</span>
        <span>100BTC</span>
        <span>100</span>
        <span>200</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name:'ieorecords',
  data () {
    return {
      
    }
  },
  methods: {
    switch_tab (tab) {
      this.active = tab
    }
  }
}
</script>
<style lang="less" scoped>
.safety h3{height: 55px; padding-left: 28px; font-weight: normal;font-size: 18px;line-height: 55px;color: #333; border-bottom: 1px solid #e7e7e7;}
.join-list {background-color: #212020;}
.join-list li {
  display: flex;
  line-height: 50px;
  border-bottom: 1px solid #37342F;
  text-align: center;
  &:last-of-type {border-bottom: none;}
  span {
    flex: 1;
    color: #fff;
  }
  &.header span {color: #BA8D35;}
}
</style>

