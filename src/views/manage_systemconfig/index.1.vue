<!-- 系统参数 -->
<template>
  <Card>
    <p slot="title">系统参数设置</p>
    <Tabs>
        <TabPane label="币币交易参数">
          <Row style="margin-bottom:10px;border-bottom:1px solid #dddee1;">
            <Col span="6">项目</Col>
            <Col span="6">现状</Col>
            <Col span="12">修改</Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">币币交易费率</Col>
            <Col span="6">{{item.transactionRate}}%</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="transactionRate"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('transactionRate')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">KYC</Col>
            <Col span="6">{{item.kycCount}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="kycCount"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('kycCount')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">IP个数</Col>
            <Col span="6">{{item.ipCount}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="ipCount"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('ipCount')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">API个数</Col>
            <Col span="6">{{item.apiCount}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="apiCount"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('apiCount')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">最小交易额</Col>
            <Col span="6">{{item.minQuota}} CNY</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="minQuota"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('minQuota')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;display:none;">
            <Col span="6">登录锁定</Col>
            <Col span="6">
              <span>{{exchangeItem.loginNumber}}次</span>
              <span style="margin-left:20px;">{{exchangeItem.hour}}小时</span>
            </Col>
            <Col span="12">
              <Input placeholder="次数" style="width:70px" :min="0"></Input>
              <Input placeholder="时间" style="width:120px;margin-left:6px;"></Input>
              <Button type="primary" style="margin-left:10px;" >修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">交易日限定</Col>
            <Col span="6">{{item.tradeLimitDays}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="tradeLimitDays"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('tradeLimitDays')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">委托深度统计数据</Col>
            <Col span="6">{{item.entrustDepth}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="entrustDepth"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('entrustDepth')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">昵称修改次数</Col>
            <Col span="6">{{item.nicknameUpdateCount}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="nicknameUpdateCount"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('nicknameUpdateCount')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">头像修改次数</Col>
            <Col span="6">{{item.headUpdateCount}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="headUpdateCount"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('headUpdateCount')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">修改密码后提币权限限时</Col>
            <Col span="6">{{item.upPwdLimitTime}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="upPwdLimitTime"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('upPwdLimitTime')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">用户日提币限额</Col>
            <Col span="6">{{item.extractQuotaDay}} BTC</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="extractQuotaDay"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('extractQuotaDay')">修改</Button>
            </Col>
          </Row>
        </TabPane>
        <TabPane label="OTC交易设置">
          <Row style="margin-bottom:10px;border-bottom:1px solid #dddee1;">
            <Col span="6">项目</Col>
            <Col span="6">现状</Col>
            <Col span="12">修改</Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">OTC交易费率</Col>
            <Col span="6">{{item.otcTransactionRate}}%</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="otcTransactionRate"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('otcTransactionRate')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">超时预警时间</Col>
            <Col span="6">{{item.overtimeWarningTime}}min</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="overtimeWarningTime"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('overtimeWarningTime')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">超额预警金额</Col>
            <Col span="6">{{item.excessWarningAmount}} CNY</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="excessWarningAmount"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('excessWarningAmount')">修改</Button>
            </Col>
          </Row>
          <Row>
            <Col span="15"> OTC币种</Col>
            <Col span="5">
              <Button type="primary" style="margin-left:10px;" :min="0" @click="updataSystem('otcCoinType')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;border:1px solid rgb(221, 222, 225);height:30px;line-height:30px;">
            <CheckboxGroup v-model="otcCoinType">
                <Checkbox label="BTC">BTC</Checkbox>
                <Checkbox label="ETH">ETH</Checkbox>
                <Checkbox label="BARK">BARK</Checkbox>
            </CheckboxGroup>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">上架广告限制数量</Col>
            <Col span="6">{{item.adCountLimit}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="adCountLimit"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('adCountLimit')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">限制取消订单数</Col>
            <Col span="6">{{item.cancelOrderCountLimit}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="cancelOrderCountLimit"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('cancelOrderCountLimit')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">价格基准平台</Col>
            <Col span="6">{{item.priceBasePlatform}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="priceBasePlatform"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('priceBasePlatform')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">单个广告最大并发数</Col>
            <Col span="6">{{item.oneAdMaxConcurrency}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="oneAdMaxConcurrency"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('oneAdMaxConcurrency')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;">
            <Col span="6">用户交易最大并发数</Col>
            <Col span="6">{{item.userTransactMaxConcurrency}}</Col>
            <Col span="12">
              <InputNumber style="width:50%;" :min="0.1" v-model="userTransactMaxConcurrency"></InputNumber>
              <Button type="primary" style="margin-left:10px;" @click="updataSystem('userTransactMaxConcurrency')">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;display:none;">
            <Col span="6">购买BTC广告最小限额</Col>
            <Col span="6">0.01 BTC</Col>
            <Col span="12">
              <Input placeholder="单行输入" style="width:200px" :min="0"></Input>
              <Button type="primary" style="margin-left:10px;">修改</Button>
            </Col>
          </Row>
          <Row style="margin-bottom:10px;display:none;">
            <Col span="6">购买ETH广告最小限额</Col>
            <Col span="6">0.1 ETH</Col>
            <Col span="12">
              <Input placeholder="单行输入" style="width:200px" :min="0"></Input>
              <Button type="primary" style="margin-left:10px;">修改</Button>
            </Col>
          </Row>
        </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import system from '../../api/systemparam'
export default {
  data () {
    return {
      exchangeItem: [],
      item: {
        kycCount: 0,
        ipCount: 0,
        minQuota: 0,
        otcCoinType: [],
        version: null
      },
      tempItem: {},
      otcCoinType: [],
      transactionRate: null || 0,
      kycCount: null || 0,
      ipCount: null || 0,
      apiCount: null || 0,
      minQuota: null || 0,
      tradeLimitDays: null || 0,
      entrustDepth: null || 0,
      nicknameUpdateCount: null || 0,
      headUpdateCount: null || 0,
      upPwdLimitTime: null || 0,
      extractQuotaDay: null || 0,
      otcTransactionRate: null || 0,
      overtimeWarningTime: null || 0,
      excessWarningAmount: null || 0,
      adCountLimit: null || 0,
      cancelOrderCountLimit: null || 0,
      priceBasePlatform: null || 0,
      oneAdMaxConcurrency: null || 0,
      userTransactMaxConcurrency: null || 0
    }
  },
  created () {
    this.getfindSysParam()
  },
  methods: {
    getfindSysParam () {
      system.findSysParam((res) => {
        res.forEach((d) => {
          this.item[d.code] = `${d.value || '0'}`
          if (d.code === 'otcCoinType') {
            this.otcCoinType = d.value.split(',')
          }
          this.tempItem[d.code] = d
        })
        this.exchangeItem = res
      }, (msg) => {
        this.$Message.error({content: msg})
      })
    },
    updataSystem (code) {
      if (!this[code] || (code === 'otcCoinType' && this[code].length === 0)) {
        this.$Message.error({content: '请输入内容'})
        return
      }
      let value = code === 'otcCoinType' ? this[code].join(',') : this[code]
      system.saveSysParam({
        value: value,
        sysParamId: this.tempItem[code].sysParamId,
        version: this.tempItem[code].version
      },(res) => {
        this.getfindSysParam()
        this.$Message.success({content: '修改成功'})
        if (code !== 'otcCoinType') {
          this[code] = ''
        }
      }, (msg) => {
        this.$$Message.error({content: msg})
      })
    }
  }
}
</script>

<style lang="less">
</style>
