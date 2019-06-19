<template>
  <div class="info">
    <h3 class="message-title">
      SATO 借记卡
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
        <li v-for="list in proList">
          <span>{{list.orderId}}</span>
          <span>{{date(list.createdAt)}}</span>
          <span>{{list.receiverAddress}}</span>
          <span>{{list.productQuantity}}</span>
          <span>{{list.symbolPrice}}{{list.paytype}}</span>
          <span>{{state(list.state)}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import shopApi from '../../api/shops'

  export default {
    data() {
      return {
        proList: []
      }
    },
    components: {},
    created() {
      this.getList()
    },
    methods: {
      getList() {
        let data = {};
        shopApi.orderList(data, (res) => {
          res.filter((data) => {
            if (data.productName !== '中本硬件') {
              this.proList.push(data)
            }
          })
          console.log(this.proList)
        })
      },
      state(i){ //0：待支付 1：待确认 2：已付款未发货 3：已发货 4：已验收 5：已退回
        switch (i) {
          case 0: return '待支付'
          case 1: return '待确认'
          case 2: return '已付款未发货'
          case 3: return '已发货'
          case 4: return '已验收'
          case 5: return '已退回'
        }
      },
      date(d){
        return (new Date(d)).format();
      }
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

  .ul {

    li {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #5F543D;
      padding: 12px 0;
      font-size: 14px;
      color: #FFFFFF;

      &.yellow {
        color: #BA8D35;
      }

      span {
        text-align: center;
        padding: 0 2px;
      }

      span:nth-child(1) {
        min-width: 18%;
        text-align: left;
        text-indent: 8px;
      }

      span:nth-child(2) {
        min-width: 15%;
        text-align: left;
      }

      span:nth-child(3) {
        min-width: 37%;
        text-align: left;
      }

      span:nth-child(4) {
        min-width: 10%;
      }

      span:nth-child(5) {
        min-width: 10%;
      }

      span:nth-child(6) {
        min-width: 10%;
      }

    }
  }
</style>

