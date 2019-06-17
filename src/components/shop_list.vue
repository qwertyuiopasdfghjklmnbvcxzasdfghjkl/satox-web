<template>
  <div class="list">
    <b>{{this.item.productName}}</b>
    <div>
      <label @click="del()">-</label>
      <span>1</span>
      <label @click="add()">+</label>
    </div>
    <p>${{this.item.discountPrice}}</p>
  </div>
</template>

<script>
  export default {
    props: ['item'],
    name: "shopList",
    methods: {
      del() {
        this.$emit('del', this.item)
      },
      add() {
        this.$emit('add')
      }
    }
  }
</script>

<style scoped lang="less">
  .list {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    b {
      width: 60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    div {
      width: 60px;
      border: 1px solid #000;
      text-align: center;
      display: flex;
      justify-content: space-around;
      align-items: center;
      line-height: 14px;

      span {
        border: 1px solid #000;
        border-top: none;
        border-bottom: none;
        display: inline-block;
        width: 33%;
        height: 16px;
        font-size: 12px;
      }

      label {
        flex-grow: 1;
        cursor: pointer;
        height: 16px;
      }
    }

    p {
      font-size: 20px;
      color: #DF0500;

    }
  }
</style>
