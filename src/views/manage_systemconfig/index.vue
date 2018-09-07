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
        <Row style="margin-bottom:10px;" v-for="(data,index) in exchangeItem" v-if="data.paramGroup == 1" :key="data.id">
          <Col span="6">{{data.codeDesc}}</Col>
          <Col span="6" v-if="data.code !== 'loginLockCount'">{{data.value}}</Col>
          <Col span="3" v-if="data.code === 'loginLockCount'">{{data.value}}次</Col>
          <Col span="3" v-if="data.code === 'loginLockCount'">{{data.value2}}分钟</Col>
          <Col span="12" v-if="data.code === 'loginLockCount'">
            <numberbox ref="price" type="text" v-model="data.$value" style="width:80px;border:1px solid #dddee1;"/>
            <numberbox ref="price" type="text" v-model="data.$value2" style="width:80px;border:1px solid #dddee1;"/>
            <Button type="primary" style="margin-left:10px;" @click="updataSystem1(data)">修改</Button>
          </Col>
          <Col span="12" v-if="data.code !== 'loginLockCount' && data.code !== 'kycCount' && data.code !== 'nicknameUpdateCount' && data.code !== 'headUpdateCount'">
            <numberbox ref="price" type="text" v-model="data.$value" style="width:80px;border:1px solid #dddee1;"/>
            <Button type="primary" style="margin-left:10px;" @click="updataSystem(data)">修改</Button>
          </Col>
        </Row>
      </TabPane>
      <TabPane label="OTC交易设置">
        <Row style="margin-bottom:10px;border-bottom:1px solid #dddee1;">
          <Col span="6">项目</Col>
          <Col span="6">现状</Col>
          <Col span="12">修改</Col>
        </Row>
        <Row style="margin-bottom:10px;" v-for="(data,index) in exchangeItem" v-if="data.paramGroup == 2" :key="data.id">
          <Col span="6">{{data.codeDesc}}</Col>
          <Col span="6" v-if="data.code !== 'otcCoinType'">{{data.value}}</Col>
          <Col span="12" v-if="data.code !== 'otcCoinType' && data.code !== 'cancelOrderCountLimit' && data.code !== 'oneAdMaxConcurrency' && data.code !== 'adCountLimit' && data.code !== 'priceBasePlatform'">
            <numberbox ref="price" type="text" v-model="data.$value" style="width:80px;border:1px solid #dddee1;" v-if="data.code !== 'priceBasePlatform'"/>
            <Input type="text" :min="0" v-model="data.$value" v-if="data.code === 'priceBasePlatform'" style="width:80px;"></Input>
            <Button type="primary" style="margin-left:10px;" @click="updataSystem(data)">修改</Button>
          </Col>
          <Row style="margin-bottom:10px;border:1px solid rgb(221, 222, 225);height:30px;line-height:30px;" v-if="data.code === 'otcCoinType'">
            <CheckboxGroup v-model="data.$value"  @on-change="updataSystem(data)">
              <Checkbox :label="da.symbol" v-for="da in dataSymbol" :key="data.id">{{da.symbol}}</Checkbox>
            </CheckboxGroup>
          </Row>
        </Row>
      </TabPane>
      <TabPane label="添加特殊账户地址参数设置">
        <Card>
          <p slot="title" style="height:auto;vertical-align:top;overflow:hidden;">
            <span style="height:32px;font-weight:normal;line-height:32px;">交易所手续费账户</span>
            <Input type="text" v-model="accountsSymbolParam" placeholder="请输入要查询的币种关键字" style="width:auto;margin-left:28px;"></Input>
            <Button type="primary" @click="fnFindAdminAccounts(accountsSymbolParam)">查询</Button>
            <Button type="ghost" @click="fnFindAdminAccounts()">重置</Button>
            <Button type="primary" style="float:right;" @click="addOrEditFeeAccountDialog">添加手续费账户</Button>
          </p>
          <Table :columns="accountsColumns" :data="accountsData" style="margin-top:10px;"></Table>
          <Page :current="accountsPage.currentPage" :total="accountsPage.total" @on-change="changePage(arguments[0], 1)" style="text-align:center;margin-top:20px;"></Page>
        </Card>
        <Card style="margin-top:16px;">
          <p slot="title" style="height:auto;vertical-align:top;overflow:hidden;">
            <span style="height:32px;font-weight:normal;line-height:32px;">提币主地址设置</span>
            <Input type="text" v-model="coinPoolsSymbolParam" placeholder="请输入要查询的币种关键字" style="width:auto;margin-left:28px;"></Input>
            <Button type="primary" @click="fnFindAdminCoinPools(coinPoolsSymbolParam)">查询</Button>
            <Button type="ghost" @click="fnFindAdminCoinPools()">重置</Button>
            <Button type="primary" style="float:right;" @click="addOrEditWithdrawalAddressDialog">添加提币主地址</Button>
          </p>
          <Table :columns="coinPoolsColumns" :data="coinPoolsData" style="margin-top:10px;"></Table>
          <Page :current="coinPoolsPage.currentPage" :total="coinPoolsPage.total" @on-change="changePage(arguments[0], 2)" style="text-align:center;margin-top:20px;"></Page>
        </Card>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
import system from '../../api/systemparam'
import curreny from '../../api/currency'
import util from '../../libs/util'
import numberbox from '../components/dialog/numberbox'
import addOrEditFeeAccount from './addOrEditFeeAccount'
import addOrEditWithdrawalAddress from './addOrEditWithdrawalAddress'
export default {
  data () {
    return {
      dataSymbol: [],
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
      userTransactMaxConcurrency: null || 0,
      accountsSymbolParam: null,
      coinPoolsSymbolParam: null,
      accountsColumns: [
        {title: '币种', key: 'symbol', width: 80},
        {title: '用户名', key: 'username'},
        {title: '用户ID', key: 'userId'},
        {title: '账户ID', key: 'accountId'},
        {title: '创建人', key: 'creator'},
        {title: '创建时间', key: 'createdTime'},
        {title: '最后修改人', key: 'lastUpdatedBy'},
        {title: '最后修改时间', key: 'lastUpdatedTime'},
        {title: '操作', render: (h, params) => {
          return h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                util.setDialog(addOrEditFeeAccount, {
                  isEdit: true,
                  symbol: params.row.symbol,
                  username: params.row.username,
                  okCallback: () => {
                    this.fnFindAdminAccounts()
                  }
                })
              }
            }
          }, '修改')
        }, width: 80}
      ],
      coinPoolsColumns: [
        {title: '币种', key: 'symbol', width: 80},
        {title: '用户名', key: 'username'},
        {title: '用户ID', key: 'userId'},
        {title: '账户ID', key: 'accountId'},
        {title: '钱包地址', key: 'address'},
        {title: '创建人', key: 'creator'},
        {title: '创建时间', key: 'createdTime'},
        {title: '最后修改人', key: 'lastUpdatedBy'},
        {title: '最后修改时间', key: 'lastUpdatedTime'},
        {title: '操作', render: (h, params) => {
          return h('Button', {
            props: {
              type: 'primary',
              size: 'small'
            },
            on: {
              click: () => {
                util.setDialog(addOrEditWithdrawalAddress, {
                  isEdit: true,
                  symbol: params.row.symbol,
                  username: params.row.username,
                  okCallback: () => {
                    this.fnFindAdminCoinPools()
                  }
                })
              }
            }
          }, '修改')
        }, width: 80}
      ],
      accountsData: [],
      coinPoolsData: [],
      accountsPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      coinPoolsPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      }
    }
  },
  components: {
    numberbox
  },
  watch: {
    accountsPage () {
      this.fnFindAdminAccounts(this.accountsSymbolParam)
    },
    coinPoolsPage () {
      this.fnFindAdminCoinPools(this.coinPoolsSymbolParam)
    }
  },
  created () {
    this.getfindSysParam()
    this.getdataSymbol()
    this.fnFindAdminAccounts()
    this.fnFindAdminCoinPools()
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
          if (d.code === 'otcCoinType') {
            d.$value = d.value.split(',')
          } else {
            d.$value = 0
          }
          d.$valu2 = 0
        })
        this.exchangeItem = res
      }, (msg) => {
        this.$Message.error({content: msg})
      })
    },
    updataSystem1 (data) {
      let code = data.code;
      let value = data.$value
      let value2 = data.$value2
      if (!value || !value2 || (code === 'otcCoinType' && value.length === 0)) {
        this.$Message.error({content: '请输入内容'})
        return
      }
      if (value2 > 60) {
          this.$Message.error({content: '分钟不能大于60'})
          return
        }
      value = code === 'otcCoinType' ? value.join(',') : value
      system.saveSysParam({
        value: value,
        value2: value2,
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
    },
    updataSystem (data) {
      let code = data.code;
      let value = data.$value
      if (!value || (code === 'otcCoinType' && value.length === 0)) {
        this.$Message.error({content: '请输入内容'})
        return
      }
      value = code === 'otcCoinType' ? value.join(',') : value
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
    },
    getdataSymbol () {
      curreny.findAllValidSymbolList((res) => {
        this.dataSymbol = res
      })
    },
    fnFindAdminAccounts (symbolParam) {
      let tempSymbolParam = null
      if (symbolParam) {
        tempSymbolParam = {symbol: symbolParam}
      } else {
        tempSymbolParam = {}
        this.accountsSymbolParam = null
      }
      system.findAdminAccounts(this.accountsPage.pageSize, this.accountsPage.currentPage, tempSymbolParam, (data, total) => {
        this.accountsData = data
        this.accountsPage.total = total
      }, (msg) => {
        console.error(msg)
      })
    },
    fnFindAdminCoinPools (symbolParam) {
      let tempSymbolParam = null
      if (symbolParam) {
        tempSymbolParam = {symbol: symbolParam}
      } else {
        tempSymbolParam = {}
        this.coinPoolsSymbolParam = null
      }
      system.findAdminCoinPools(this.coinPoolsPage.pageSize, this.coinPoolsPage.currentPage, tempSymbolParam, (data, total) => {
        this.coinPoolsData = data
        this.coinPoolsPage.total = total
      }, (msg) => {
        console.error(msg)
      })
    },
    addOrEditFeeAccountDialog () {
      util.setDialog(addOrEditFeeAccount, {
        isEdit: false,
        okCallback: () => {
          this.fnFindAdminAccounts()
        }
      })
    },
    addOrEditWithdrawalAddressDialog () {
      util.setDialog(addOrEditWithdrawalAddress, {
        isEdit: false,
        okCallback: () => {
          this.fnFindAdminCoinPools()
        }
      })
    },
    changePage (page, flag) {
      if (flag === 1) {
        this.accountsPage.currentPage = page
        this.fnFindAdminAccounts()
      } else if (flag === 2) {
        this.coinPoolsPage.currentPage = page
        this.fnFindAdminCoinPools()
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less">
</style>
