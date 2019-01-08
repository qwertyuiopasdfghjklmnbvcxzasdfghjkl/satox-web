<template>
  <!--商家申请 begin-->
  <div class="container">
    <section>
      <h3 class="">{{$t('business.MERCHANT_APPLICATION')}}</h3>
      <article>
        <p>{{$t('business.BUSINESS_INTERESTS')}}</p>
        <p><strong>{{$t('business.APPLICATION_RULES')}}</strong></p>
        <p>{{$t('business.APPLICATION_RULES_1')}}</p>
        <p>{{$t('business.APPLICATION_RULES_2')}}</p>
        <p>{{$t('business.APPLICATION_RULES_3')}}</p>
        <p>{{$t('business.FEE_DISCOUNT')}}</p>
        <div class="table border mt20">
          <div>
            <div>{{$t('business.MERCHANT_LEVEL')}}</div>
            <div>{{$t('business.AD_SERVICE_FEE')}}</div>
            <div>{{$t('business.SINGLE_AD_LIMIT')}}</div>
            <div>{{$t('business.PROMOTION_STANDARD')}}</div>
            <div>{{$t('business.EXCLUSIVE_LOGO')}}</div>
          </div>
          <div v-for="item in shopsLevel">
            <div>{{merchant_name(item.levelIndex)}}</div>
            <div>{{item.feeRate*100}}%</div>
            <div>{{item.adLimit}}</div>
            <div>{{item.riseStandard}}</div>
            <div><img :src="levelSymbol[item.shopsLevelId]" v-if="item.shopsLevelId>=2"><span v-else>-</span></div>
          </div>
        </div>
        <p class="mt20">
          <button type="button" class="btn-apply" @click="applyDialog">{{applyText}}</button>
        </p>
      </article>
    </section>
  </div>
</template>

<script>
import utils from '@/assets/js/utils'
import merchantApply from '@/public/dialog/merchantApply'
import shopsApi from '@/api/shops'
import silver from '@/assets/images/icon-silver.png'
import golden from '@/assets/images/icon-golden.png'
import diamond from '@/assets/images/icon-diamond.png'
export default {
  data () {
    return {
      applyStatus:null,
      shopsLevel:[],
      levelSymbol:{2:silver,3:golden,4:diamond}
    }
  },
  computed: {
    applyText(){
      if(this.applyStatus===1 || this.applyStatus===2){
        return this.$t('public0.public151')
      } else {
        return this.$t('business.TO_APPLY')
      }
    }
  },
  created(){
    this.getShopsLevel()
    this.getShopsApply()
  },
  methods: {
    merchant_name(level){
      return this.$t(`business.MERCHANT_LEVEL_${level}`)
    },
    getShopsLevel(){
      shopsApi.getShopsLevel(res=>{
        this.shopsLevel = res.data
      })
    },
    getShopsApply(){
      shopsApi.getShopsApply(res=>{
        this.applyStatus = (res.data && res.data.state) || null
      })
    },
    applyDialog () {
      // 修改呢称
      utils.setDialog(merchantApply, {
        okCallback: (aNickName) => {
          this.getShopsApply()
        }
      })
    },
  }
}
</script>

<style scoped>
.mt20 {margin-top: 20px;}
.container section{background-color: #FFF; border-radius: 4px; box-shadow: 0 1px 3px #e2e2e2;}
section > h3{height: 55px; padding-left: 20px; font-weight: normal;font-size: 18px;line-height: 55px;color: #333;text-indent: 8px;border-bottom: 1px solid #e7e7e7;}
section > article {padding: 20px 20px 40px; color: #333;}
section > article p {line-height: 35px;}
.btn-apply {width: 160px; height: 50px; background-color: #3283FF; color: #fff; cursor: pointer; border-radius: 4px; font-size: 16px;}
.btn-apply:hover {background-color: #2565c5;}
</style>

