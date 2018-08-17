<template>
    <div class="helpe-left">
        <ul>
            <li :class="{'current':data.show===true}"  v-for="(data, index) in contData" :key="data.id">
                <em :class="[!data.show ? 'icon-plus' : 'icon-minus']"></em>
                <span @click="toogle(data,index)">{{data.catption}}</span>
                <ol v-show="data.show === true">
                    <li>如何充币</li>
                    <li>如何提币</li>
                </ol>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
  data () {
    return {
      contData: [
        {catption: '常见问题', show: false},
        {catption: '充值与提币', show: false},
        {catption: '如何交易', show: false},
        {catption: '注册认证', show: false},
        {catption: '币种介绍', show: false}
      ]
    }
  },
  methods: {
    switch_tab (tab) {
      this.$emit('switchTab', tab)
    },
    toogle (data, index) {
      data.show = !data.show
    }
  }
}
</script>
<style scoped>
.helpe-left{width: 392px;height: 100%;border-right: 2px solid #cccccc;position: relative;display: inline-block;}
.helpe-left ul{position: absolute;right: 30px;top:122px;}
.helpe-left ul li{position: relative;}
.helpe-left ul li span{font-size: 18px;color: #333;font-weight: bold;line-height: 34px;cursor: pointer;}
.helpe-left ul li em{font-size: 12px;font-weight: 100;}
.helpe-left ul li.active{color: #11a8fe;}
.helpe-left ul li.active:after{content: "";display: inline-block; height: 4px;background: #11a8fe;width: 100%;position:absolute;top: 42px;}
.helpe-left ul li > ol li{font-size: 14px;text-align:right;line-height:22px;color:#999;}
.helpe-left ul li > ol:hover{color: #11a8fe;}
</style>
