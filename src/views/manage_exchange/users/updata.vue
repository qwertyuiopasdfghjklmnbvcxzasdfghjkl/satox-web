<template>
  <div class="add_order">
    <Card style="width:800px;">
        <p slot="title">
        修改币种
        <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
      </p>
     <Row style="border-bottom:1px solid #e9eaec;height:30px; line-height:30px;">
        <Col span="5">代号</Col>
        <Col span="10">{{this.datas.symbol  || 0}}</Col>
        <Col span="6"></Col>
      </Row>
      <!-- <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
        <Col span="5">权限名称</Col>
        <Col span="8">当前状态</Col>
        <Col span="3">修改</Col>
      </Row>
      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:40px; line-height:40px;">
        <Col span="5">代号</Col>
        <Col span="8">{{this.datas.symbol || 0}}</Col>
        <Col span="8">
             <Input v-model="symbol" style="width: 150px" />
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabs('symbol')">保存</Button>
        </Col>
      </Row> -->
      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
        <Col span="5">英文全名</Col>
        <Col span="8">{{this.datas.caption || 0}}</Col>
        <Col span="8">
             <Input v-model="caption" style="width: 150px" />
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabs('caption')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
        <Col span="5">中文全名</Col>
        <Col span="8">{{this.datas.captionCN  || 0}}</Col>
        <Col span="8">
             <Input v-model="captionCN" style="width: 150px" />
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabs('captionCN')">保存</Button>
        </Col>
      </Row>

      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
        <Col span="5">发行总量</Col>
        <Col span="8">{{this.datas.totalIssuance  || 0}}</Col>
        <Col span="8">
         <InputNumber style="width:100%;" v-model="totalIssuance"></InputNumber>
             <!-- <Input v-model="totalIssuance" style="width: 150px" /> -->
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabs('totalIssuance')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
        <Col span="5">流通总量</Col>
        <Col span="8">{{this.datas.totalCirculation  || 0}}</Col>
        <Col span="8">
         <InputNumber style="width:100%;" v-model="totalCirculation"></InputNumber>
             <!-- <Input v-model="totalCirculation" style="width: 150px" /> -->
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabs('totalCirculation')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
        <Col span="5">发行价格</Col>
        <Col span="8">{{this.datas.issuePrice  || 0}}</Col>
        <Col span="8">
         <InputNumber style="width:100%;" v-model="issuePrice"></InputNumber>
             <!-- <Input v-model="issuePrice" style="width: 150px" /> -->
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabs('issuePrice')">保存</Button>
        </Col>
      </Row>

      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
        <Col span="5">ICON</Col>
        <Col span="8" style="width:254px;overflow:hidden;overflow: hidden;height: 40px;text-overflow: ellipsis;white-space: nowrap;">{{this.datas.iconUrl  || 0}}</Col>
        <Col span="8">
            <!-- <FormItem label="ICON" prop="iconUrl"> -->
                <input ref="form" type="file" name="iconFile" />
            <!-- </FormItem> -->
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabsImage('iconFile')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;">
        <Col span="5">货币类型</Col>
        <Col span="16">
            <RadioGroup v-model="datas.flag">
                <Radio label="1">
                    <span>ERC20</span>
                </Radio>
                <Radio label="2">
                    <span>非ERC20</span>
                </Radio>
            </RadioGroup>
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabs1('flag')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;">
        <Col span="5">主链类型</Col>
        <Col span="16">
             <RadioGroup v-model="datas.symbolType">
                <Radio label="1">
                    <span>BTC</span>
                </Radio>
                <Radio label="2">
                    <span>ETH</span>
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
        <Col span="3">
             <!-- <Button type="primary" @click="tabs1('symbolType')">保存</Button> -->
        </Col>
      </Row>
      <!-- <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;">
        <Col span="5">钱包服务器</Col>
        <Col span="8" style="width:255px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{this.datas.symbolServer || 0}}</Col>
        <Col span="8">
             <Input v-model="symbolServer" style="width: 150px" />
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabs('symbolServer')">保存</Button>
        </Col>
      </Row> -->
      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;" v-if="this.datas.symbolType === '3'">
        <Col span="5">Property ID</Col>
        <Col span="8" >{{this.datas.propertyId || 0}}
        </Col>
        <!-- <Col span="8">
             <Input v-model="contractAddr" style="width: 150px" />
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabs('contractAddr')">保存</Button>
        </Col> -->
      </Row>
      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;" v-if="this.datas.flag === '1' && this.datas.symbolType === '2'">
        <Col span="5">合约精度</Col>
        <Col span="8">{{this.datas.contractDecimals || 0}}</Col>
        <Col span="8">
            <!-- <Input v-model="contractDecimals" style="width: 150px" /> -->
            <InputNumber style="width:100%;" v-model="contractDecimals"></InputNumber>
            <!-- <InputNumber v-model="contractDecimals"  ></InputNumber> -->
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabs2('contractDecimals')">保存</Button>
        </Col>
      </Row>
      <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:45px;" v-if="this.datas.flag === '1' && this.datas.symbolType === '2'">
        <Col span="5">ERC20合约地址</Col>
        <Col span="8" >{{this.datas.contractAddr || 0}}
        </Col>
        <Col span="8">
             <Input v-model="contractAddr" style="width: 150px" />
        </Col>
        <Col span="3">
            <Button type="primary" @click="tabs('contractAddr')">保存</Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import currenyApi from '../../../api/currency'
export default {
    props: ['item'],
    data () {
        return {
            symbol: '1',
            caption: '',
            captionCN: '',
            // symbolServer: '',
            contractDecimals: null,
            contractAddr: '',
            iconFile: '',
            issuePrice: null,
            totalCirculation: null,
            totalIssuance: null,
            datas: {
                flag: '',
                symbolType: '',
                symbol: '1',
                caption: '',
                captionCN: '',
                // symbolServer: '',
                contractDecimals: null,
                contractAddr: '',
                iconFile: '',
                issuePrice: null,
                totalCirculation: null,
                totalIssuance: null,
            }
         } 
    },
    created () {
        this.getSymbolInfo()
    },
    methods: {
        getSymbolInfo () {
            currenyApi.coinFindSymbolInfo({
                symbolId: this.item.symbolId
            },(res) => {
                for (var i in res) {
                    this.datas[i] = res[i] ? String(res[i]) : null
                }
                console.log(this.datas)
            }, (msg) => {
                this.$Message.error({content: msg})
            })
        },
        closeDialog () {
            this.$emit('removeDialog')
        },
        tabsImage (propName) {
            // let data = {
            //     symbolId: this.item.symbolId,
            //     symbol: this.item.symbol
            // }
            // data[propName] = this.datas[propName]
            var formData = new FormData()
            formData.append('iconFile', this.$refs.form.files[0])
            formData.append('symbolId', this.item.symbolId)
            formData.append('symbol', this.item.symbol)
            currenyApi.updateIconFile(formData, (res) =>{
                this.getSymbolInfo()
                this.$Message.success({content: '修改成功'})
            }, (msg) => {
                this.$Message.error({content: msg})
            }) 
        },
        tabs1(propName) {
            let data = {
                symbolId: this.item.symbolId,
            }
            data[propName] = this.datas[propName]
            currenyApi.updateSymbol(data, (res) =>{
                this.getSymbolInfo()
                this.$Message.success({content: '修改成功'})
            }, (msg) => {
                this.$Message.error({content: msg})
            }) 
        },
        tabs(propName) {
            if (!this[propName]) {
                this.$Message.error({content: '不能为空'})
                return
            }
            let data = {
                symbolId: this.item.symbolId,
            }
            data[propName] = this[propName]
            currenyApi.updateSymbol(data, (res) =>{
                this.getSymbolInfo()
                this.$Message.success({content: '修改成功'})
                // this.$emit('okCallback')
            }, (msg) => {
                this.$Message.error({content: msg})
            }) 
        },
         tabs2(propName) {
            if (!this[propName]) {
                this.$Message.error({content: '不能为空'})
                return
            }
            let data = {
                symbolId: this.item.symbolId,
            }
            data[propName] = parseFloat(this[propName])
            currenyApi.updateSymbol(data, (res) =>{
                this.getSymbolInfo()
                this.$Message.success({content: '修改成功'})
            }, (msg) => {
                this.$Message.error({content: msg})
            }) 
        }
    }
}
</script>
<style lang="less" scoped>
.add_order{
    .title{
        position: relative; height: 30px;line-height: 30px; background: #2d8cf0;color: #fff;font-size: 16px;text-align: center;
        span{font-size: 18px;cursor: pointer;position: absolute;right: 10px;top: 2px;}
    }
    .ivu-form .ivu-form-item-label{color: #000;font-size: 13px;}
    .ivu-form-item{margin-top: 10px;}
    .ivu-input{width: 88%;}
    .ivu-form .ivu-form-item-label{padding-left: 10px;}
    .ivu-btn-primary{display: flex; margin:0 auto;margin-bottom: 10px;}
    .ivu-form-item{margin-bottom: 16px;}
}
</style>
