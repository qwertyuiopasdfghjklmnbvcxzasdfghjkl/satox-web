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
          <div>
            <div>{{$t('business.MERCHANT_LEVEL_1')}}</div>
            <div>1%</div>
            <div>1W</div>
            <div>0</div>
            <div>-</div>
          </div>
          <div>
            <div>{{$t('business.MERCHANT_LEVEL_2')}}</div>
            <div>0.8%</div>
            <div>5W</div>
            <div>10W</div>
            <div><img src="../../assets/images/icon-silver.png"></div>
          </div>
          <div>
            <div>{{$t('business.MERCHANT_LEVEL_3')}}</div>
            <div>0.6%</div>
            <div>10W</div>
            <div>50W</div>
            <div><img src="../../assets/images/icon-golden.png"></div>
          </div>
          <div>
            <div>{{$t('business.MERCHANT_LEVEL_4')}}</div>
            <div>0.4%</div>
            <div>50W</div>
            <div>150W</div>
            <div><img src="../../assets/images/icon-diamond.png"></div>
          </div>
        </div>
        <p class="mt20">
          <button type="button" class="btn-apply" @click="applyDialog">{{$t('business.TO_APPLY')}}</button>
        </p>
      </article>
    </section>
  </div>
</template>

<script>
import utils from '@/assets/js/utils'
import merchantApply from '@/public/dialog/merchantApply'
export default {
  data () {
    return {
      
    }
  },
  components: {
    
  },
  watch: {
    
  },
  methods: {
    applyDialog () {
      // 修改呢称
      utils.setDialog(merchantApply, {
        okCallback: (aNickName) => {
          this.userState.nickname = aNickName
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

