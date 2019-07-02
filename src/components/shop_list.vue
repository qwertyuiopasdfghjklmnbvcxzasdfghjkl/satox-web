<template>
  <div class="list">
    <b>{{lang === 1 ? this.item.productName : this.item.productNameEn}}</b>
    <div>
      <label @click="del()" :class="{'dis':!change}">-</label>
      <span>1</span>
      <label @click="add()" :class="{'dis':!change}">+</label>
    </div>
    <p>${{this.item.discountPrice}}</p>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    props: {
      item: {
        type: Object,
        default: {}
      },
      change: {
        type: Boolean,
        default: true,
      }
    },
    name: "shopList",
    data() {
      return {
        lang: 1
      }
    },
    computed: {
      ...mapGetters(['getLang']),
    },
    watch: {
      getLang() {
        this.cLang()
      },
    },
    created() {
      this.cLang();
      console.log(this.item)
    },
    methods: {
      cLang() {
        if (this.getLang === 'zh-CN') {
          this.lang = 1
        } else {
          this.lang = 2
        }
      },
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
      font-size: 16px;
    }

    div {
      width: 60px;
      border: 1px solid #F8F8F8;
      text-align: center;
      display: flex;
      justify-content: space-around;
      align-items: center;
      line-height: 14px;

      span {
        border: 1px solid #F8F8F8;
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
        &.dis{
          color: #949494;
          cursor: no-drop;
        }
      }
    }

    p {
      font-size: 20px;
      color: #bb8d34;
      width: 50px;
    }
  }
</style>
