<template>
  <div class="hardware">
    <div class="info">
      <h3 class="message-title">
        中本硬件
      </h3>
      <div>
        <ul class="ul">
          <li class="yellow">
            <span>订单号码</span>
            <span>订单日期</span>
            <span>送货地址</span>
            <span>数量</span>
            <span>数额</span>
            <span>状态</span>
          </li>
          <li>
            <span>订单号码</span>
            <span>订单日期</span>
            <span>送货地址</span>
            <span>数量</span>
            <span>数额</span>
            <span>状态</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        active: 'delegate'
      }
    },
    components: {

    },
    methods: {
    }
  }
</script>
<style scoped lang="less">
  .message-title {
    height: 55px;
    padding-left: 20px;
    font-weight: normal;
    font-size: 18px;
    line-height: 55px;
    color: #333;
    text-indent: 8px;
    border-bottom: 1px solid #e7e7e7;
    position: relative;
  }

  .info {
    background-color: #202020;
    box-shadow: 0 1px 5px #131313;
  }
  .ul{
    li{
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #5F543D;
      padding: 12px 0;
      font-size: 14px;
      color: #FFFFFF;
      &.yellow{
        color: #BA8D35;
      }
      span{
        text-align: center;
        padding: 0 2px;
      }
      span:nth-child(1){
        width: 10%;
      }
      span:nth-child(2){
        width: 10%;
      }
      span:nth-child(3){
        width: 50%;
        text-align: left;
      }
      span:nth-child(4){
        width: 10%;
      }
      span:nth-child(5){
        width: 10%;
      }
      span:nth-child(6){
        width: 10%;
      }
    }
  }
</style>

