<template>
    <div class="addWallet">
        <Card>
            <p slot="title">修改
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Form ref="formItem"  label-position="left" :label-width="100">
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">币种</Col>
                    <Col span="6">{{this.item.symbol}}</Col>
                    <Col span="6">
                    <Input v-model="symbol"></Input>
                    </Col>
                    <Col span="6" style="text-align:right;">
                    <Button type="primary" @click="tabs('symbol')">保存</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">最小金额</Col>
                    <Col span="6">{{this.item.coinMin}}</Col>
                    <Col span="6">
                    <InputNumber style="width:100%;" :min="0.1" name="coinMin" v-model="coinMin"></InputNumber>
                    <!-- <Input v-model="coinMin"></Input> -->
                    </Col>
                    <Col span="6" style="text-align:right;">
                    <Button type="primary" @click="tabs('coinMin')">保存</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">保留金额</Col>
                    <Col span="6">{{this.item.coinReserve}}</Col>
                    <Col span="6">
                    <Input v-model="coinReserve"></Input>
                    </Col>
                    <Col span="6" style="text-align:right;">
                    <Button type="primary" @click="tabs('coinReserve')">保存</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">BTC矿工费</Col>
                    <Col span="6">{{this.item.minerFee}}</Col>
                    <Col span="6">
                    <Input v-model="minerFee"></Input>
                    </Col>
                    <Col span="6" style="text-align:right;">
                    <Button type="primary" @click="tabs('minerFee')">保存</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">ETH GAS单价</Col>
                    <Col span="6">{{this.item.gasPrice}}</Col>
                    <Col span="6">
                    <Input v-model="gasPrice"></Input>
                    </Col>
                    <Col span="6" style="text-align:right;">
                    <Button type="primary" @click="tabs('gasPrice')">保存</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">ETH GAS上限</Col>
                    <Col span="6">{{item.gasLimit}}</Col>
                    <Col span="6">
                    <Input v-model="gasLimit"></Input>
                    </Col>
                    <Col span="6" style="text-align:right;">
                    <Button type="primary" @click="tabs('gasLimit')">保存</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">是否可用</Col>
                    <Col span="6"> 
                    </Col>
                    <Col span="6">
                        <RadioGroup v-model="enable" >
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="0">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </Col>
                    <Col span="6" style="text-align:right;">
                        <Button type="primary" @click="tabs1('enable')">保存</Button>
                    </Col>
                </Row>
                <Row style="margin-top:10px;border-bottom:1px solid #e9eaec;padding-bottom:5px;">
                    <Col span="6">主链类型</Col>
                    <Col span="14">
                        <RadioGroup v-model="symbolType" >
                             <Radio label="2">
                                <span>ETH</span>
                            </Radio>
                            <Radio label="1">
                                <span>BTC</span>
                            </Radio>
                            <Radio label="3">
                                <span>OMNI</span>
                            </Radio>
                            <Radio label="4">
                                <span>MBT</span>
                            </Radio>
                            <Radio label="5">
                                <span>EOS</span>
                            </Radio>
                        </RadioGroup>
                    </Col>
                    <Col span="4" style="text-align:right;">
                        <Button type="primary" @click="tabs1('symbolType')">保存</Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
import fundApi from '../../api/fund'
export default {
    props: ['item'],
    data () {
        return {
            symbol: '',
            coinMin: null,
            coinReserve: null,
            minerFee: null,
            gasPrice: null,
            gasLimit: null,
            enable: this.item.enable.toString(),
            symbolType: this.item.symbolType.toString(),
            datas: []
        }
    },
    created () {
        this.getConfig()
    },
    methods: {
        getConfig () {
            fundApi.findOneTransferConfig({
                configId: this.item.configId
            }, (res) => {
                this.datas = res
            })
        },
        tabs1(propName) {
            if (!this[propName]) {
                this.$Message.error({content: '请输入值'})
                return
            }
            let data = {
                configId: this.item.configId,
                version: this.item.version,
                marketId: this.item.marketId
            }
            data[propName] = this[propName]
            fundApi.updateConfig(data, (res) =>{
                this.item[propName] = this[propName]
                this.$Message.success({content: '修改成功'})
                this.$emit('okCallback')
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        tabs(propName) {
            if (!this[propName]) {
                this.$Message.error({content: '请输入值'})
                return
            }
            let data = {
                configId: this.item.configId,
                version: this.item.version,
                marketId: this.item.marketId
            }
            data[propName] = this[propName]
            fundApi.updateConfig(data, (res) =>{
                this.item[propName] = this[propName]
                this.$Message.success({content: '修改成功'})
                this[propName] = ''
                this.$emit('okCallback')
                this.$emit('removeDialog')
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        closeDialog () {
            this.$emit('removeDialog')
        }
    }
}
</script>

<style>
.addWallet{width: 500px;}
.ivu-form-item-error .ivu-input{width: 200px;}
</style>

