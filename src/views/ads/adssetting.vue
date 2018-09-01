<template>
    <Modal v-model="show" title="广告发布设置">
        <Form ref="formAdsValidate" :model="adsData" :rules="ruleAdsValidate" label-position="top">
            <Row style="padding-bottom:10px;">广告有效期设置：</Row>
            <FormItem prop="expired_time" :label="`当前有效期：${current_time||0}天`">
                <Input v-model="adsData.expired_time">
                    <span slot="append">天</span>
                </Input>
            </FormItem>
            <Row>
                <Button type="primary" style="float:right;" @click="saveAdsInfo">修改</Button>
            </Row>
        </Form>
        <Form class="margin-top-20">
            <Row style="padding-bottom:10px;">手续费设置：</Row>
            <FormItem label="币种选择">
                <Select style="width:200px" v-model="costData.symbol">
                    <Option v-for="item in coins" :value="item" :key="item">{{ item }}</Option>
                </Select>
            </FormItem>
        </Form>
        <Form ref="formCostValidate" :model="costData" :rules="ruleCostValidate" label-position="top">
            <Row style="padding-bottom:10px;">发布广告手续费：</Row>
            <FormItem prop="ad_fee" :label="`当前手续费：${ad_fee||0}${costData.symbol}`">
                <Input v-model="costData.ad_fee"></Input>
            </FormItem>
            <Row style="padding-bottom:10px;">币种交易手续费设置：</Row>
            <FormItem prop="trade_fee" :label="`当前手续费：${trade_fee||0}${costData.symbol}`">
                <Input v-model="costData.trade_fee"></Input>
            </FormItem>
            <Row>
                <Button type="primary" style="float:right;" @click="saveCostInfo">修改</Button>
            </Row>
        </Form>
        <div slot="footer">
            <Button @click="show=false">关闭</Button>
        </div>
    </Modal>
</template>

<script>
import config from '@/assets/js/config';
import util from '@/libs/util';
import qs from 'qs';
import Cookies from 'js-cookie';
export default {
  props: ['value'],
  data () {
    return {
      show: this.value,
      coins: config.coins,
      current_time: null,
      ad_fee: null,
      trade_fee: null,
      adsData: {
          expired_time: null,
          user_id: Cookies.get('user_id')
      },
      ruleAdsValidate: {
        expired_time: [
            { required: true, message: '请输入广告手续费', trigger: 'blur' }
        ]
      },
      costData: {
        symbol: 'BTC',
        ad_fee: null,
        trade_fee: null,
        user_id: Cookies.get('user_id')
      },
      ruleCostValidate: {
        ad_fee: [
            { required: true, message: '请输入广告手续费', trigger: 'blur' }
        ],
        trade_fee: [
            { required: true, message: '请输入交易手续费', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    value (bool) {
      this.show = bool
    },
    show (bool) {
      this.$emit('input', bool);
    },
    'costData.symbol' () {
        this.getCostInfo();
    }
  },
  created () {
      this.getAdsInfo();

      this.getCostInfo();
  },
  methods: {
    getAdsInfo () { // 获取广告信息
      util.ajax.get('api/v1/manage/otc/ads/info').then((res) => {
          if (res.data && res.data.rst === 1) {
              var data = res.data.data;
              if (data) {
                this.current_time = this.adsData.expired_time = data.expired_time;
              } else {
                  this.current_time = this.adsData.expired_time = null;
              }
          } else if (res.data && res.data.rst !== 1) {
              var msgs = res.data.msg;
              this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
          } else {
              this.$Message.error('其他错误');
              window.console.log(error);
          }
      }).catch((error) => {
          this.$Message.error('其他错误');
          window.console.log(error);
      });
    },
    saveAdsInfo () { // 设置广告信息
        this.$refs.formAdsValidate.validate((valid) => {
            if (!valid) {
                return;
            }
            util.ajax.post('api/v1/manage/otc/ads/infoSetting', qs.stringify(this.adsData)).then((res) => {
                if (res.data && res.data.rst === 1) {
                    this.current_time = this.expired_time;
                    this.$Message.success(res.data.msg);
                } else if (res.data && res.data.rst !== 1) {
                    var msgs = res.data.msg;
                    this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                } else {
                    this.$Message.error('其他错误');
                    window.console.log(error);
                }
            }).catch((error) => {
                this.$Message.error('其他错误');
                window.console.log(error);
            });
        });
    },
    getCostInfo () { // 获取费用信息
        util.ajax.get('api/v1/manage/otc/ads/fee', {
            params: {symbol: this.costData.symbol}
        }).then((res) => {
            if (res.data && res.data.rst === 1) {
                var data = res.data.data;
                if (data) {
                    this.ad_fee = this.costData.ad_fee = data.ad_fee;
                    this.trade_fee = this.costData.trade_fee = data.trade_fee;
                } else {
                    this.ad_fee = this.costData.ad_fee = null;
                    this.trade_fee = this.costData.trade_fee = null;
                }
            } else if (res.data && res.data.rst !== 1) {
                var msgs = res.data.msg;
                this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
            } else {
                this.$Message.error('其他错误');
                window.console.log(error);
            }
        }).catch((error) => {
            this.$Message.error('其他错误');
            window.console.log(error);
        });
    },
    saveCostInfo () { // 设置费用信息
        this.$refs.formCostValidate.validate((valid) => {
            if (!valid) {
                return;
            }
                
            util.ajax.post('api/v1/manage/otc/ads/feeSetting', qs.stringify(this.costData)).then((res) => {
                if (res.data && res.data.rst === 1) {
                    this.$Message.success(res.data.msg);
                } else if (res.data && res.data.rst !== 1) {
                    this.$Message.error(res.data.msg);
                } else {
                    this.$Message.error('其他错误');
                    window.console.log(error);
                }
            }).catch((error) => {
                this.$Message.error('其他错误');
                window.console.log(error);
            });
        });
    }
  }
}
</script>

<style>

</style>
