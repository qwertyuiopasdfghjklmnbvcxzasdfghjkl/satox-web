<template>
  <div class="add_order">
    <Card style="width:600px;">
        <p slot="title">
        添加币种
        <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
      </p>
     <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100" style="max-height:680px;overflow:auto;">
        <Row>
            <Col span="12">
                <FormItem label="代号" prop="symbol">
                    <Input v-model="formLeft.symbol" name="symbol"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="英文全称" prop="caption">
                    <Input v-model="formLeft.caption" name="caption"></Input>
                </FormItem>
            </Col>
        </Row>
         <Row>
            <Col span="12">
                <FormItem label="中文名全称" prop="captionCN">
                    <Input v-model="formLeft.captionCN" name="captionCN"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="发行总量" prop="totalIssuance">
                    <Input v-model="formLeft.totalIssuance" name="totalIssuance"></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="流通总量" prop="totalCirculation">
                    <Input v-model="formLeft.totalCirculation" name="totalCirculation"></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="发行价格" prop="issuePrice">
                    <Input v-model="formLeft.issuePrice" name="issuePrice"></Input>
                </FormItem>
            </Col>
        </Row>
        <FormItem label="货币类型" prop="flag">
            <RadioGroup ref="flag" v-model="formLeft.flag">
                <Radio label="1">
                    <span>ERC20</span>
                </Radio>
                <Radio label="2">
                    <span>非ERC20</span>
                </Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="主链类型" prop="symbolType">
            <RadioGroup ref="symbolType" v-model="formLeft.symbolType">
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
        </FormItem>
         <FormItem label="Property ID" prop="propertyId" v-if="this.formLeft.symbolType === '3'">
             <Input v-model="formLeft.propertyId" name="propertyId"></Input>
            <!-- <input type="file" ref="iconFile" name="iconFile" @change="iconValidator('iconFile', $event)"/> -->
        </FormItem>
        <FormItem label="ICON" prop="iconFile">
            <input type="file" ref="iconFile" name="iconFile" @change="iconValidator('iconFile', $event)"/>
        </FormItem>
        <FormItem label="ERC20合约地址" prop="contractAddr" v-if="this.formLeft.flag === '1' && this.formLeft.symbolType === '2'">
            <Input v-model="formLeft.contractAddr" name="contractAddr"></Input>
        </FormItem>
         <Row>
            <Col span="12">
                 <FormItem label="合约精度" prop="contractDecimals" v-if="this.formLeft.flag === '1' && this.formLeft.symbolType === '2'">
                    <Input v-model="formLeft.contractDecimals" name="contractDecimals" ></Input>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="最小提币数量" prop="minWithdrawQuantity">
                    <numberbox ref="price" type="text" :min="0.1" name="minWithdrawQuantity" v-model="formLeft.minWithdrawQuantity" style="width100%;border:1px solid #dddee1;"/>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="手续费固定额度" prop="feeFixedAmount">
                    <numberbox ref="price" type="text" :min="0.1" name="feeFixedAmount" v-model="formLeft.feeFixedAmount" style="width100%;border:1px solid #dddee1;"/>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="旷工费" prop="minerFee">
                    <numberbox ref="price" type="text" :min="0.1" name="minerFee" v-model="formLeft.minerFee" style="width100%;border:1px solid #dddee1;"/>
                </FormItem>
            </Col>
        </Row>
        <Row>
            <Col span="12">
                <FormItem label="GASPrice" prop="gasprice" v-if="this.formLeft.symbolType === '2'">
                   <InputNumber style="width:100%;" :min="0.1" name="gasprice" v-model="formLeft.gasprice"></InputNumber>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="GASNumber" prop="gaslimit" v-if="this.formLeft.symbolType === '2'">
                     <InputNumber style="width:100%;" :min="0.1" name="gaslimit" v-model="formLeft.gaslimit"></InputNumber>
                </FormItem>
            </Col>
        </Row>
        <FormItem label="充币权限" prop="rechargeFlag">
            <RadioGroup ref="rechargeFlag" v-model="formLeft.rechargeFlag">
                <Radio label="1">
                    <span>正常</span>
                </Radio>
                <Radio label="2">
                    <span>冻结</span>
                </Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="提币权限" prop="withdrawFlag">
            <RadioGroup ref="withdrawFlag" v-model="formLeft.withdrawFlag">
               <Radio label="1">
                    <span>正常</span>
                </Radio>
                <Radio label="2">
                    <span>暂停</span>
                </Radio>
            </RadioGroup>
        </FormItem>
        <FormItem label="等待区块数" prop="confirmBlock">
            <InputNumber style="width:100%;" name="confirmBlock" v-model="formLeft.confirmBlock"></InputNumber>
        </FormItem>
        <Button type="primary" @click="addCurreny()">添加</Button>
    </Form>
    </Card>
  </div>
</template>
<script>
import currenyApi from '../../api/currency'
import until from '../../libs/util'
import numberbox from '../components/dialog/numberbox'
export default {
  data () {
    const validateAddrCheck = (rule, value, callback) => {
        if (this.formLeft.flag === '1' && value === '') {
            callback(new Error('请输入ERC20合约地址'));
        } else {
            callback();
        }
    }
    const customValidator = (rule, value, callback) => {
        if (this.formLeft[rule.field] === null) {
          return callback(new Error('error'))
        } else {
          return callback()
        }
    }
    const xxx = (rule, value, callback) => {
        if (/\.(jpg|png|jpeg|bmp|ico)/i.test(value) === false) {
            return callback(new Error())
        } else {
            return callback()
        }
    }
    let self = this
    const xxx1 = (rule, value, callback) => {
        let isTrue = until.limitUploadImage(self.$refs.iconFile)
            if (!isTrue) {
                return callback(new Error())
            }
            return callback()
    }
    return {
      formLeft: {
        caption: '',
        captionCN: '',
        confirmBlock: null,
        contractAddr: '',
        feeFixedAmount: null,
        iconFile: '',
        minWithdrawQuantity: null,
        rechargeFlag: '1', // 1，正常 2，暂停
        // riseRatio: null,
        contractDecimals: null,
        flag: '1',
        symbol: '',
        // symbolServer: '',
        symbolType: '2',
        withdrawFlag: '1', // 1，正常 2，冻结
        gaslimit: null,
        gasprice: null,
        minerFee: null,
        totalIssuance: null, //发行总量
        totalCirculation: null, //流通总量
        issuePrice: null, //发行价格
        propertyId: null
      },
      ruleInline: {
            symbol: [
                { required: true, message: '请输入英文简称', trigger: 'blur' }
            ],
            caption: [
                { required: true, message: '请输入英文全称', trigger: 'blur' },
            ],
            captionCN: [
                { required: true, message: '请输入中文全称', trigger: 'blur' }
            ],

            totalIssuance: [
                { required: true, message: '请输入发行总量', trigger: 'blur' }
            ],
            totalCirculation: [
                { required: true, message: '请输入流通总量', trigger: 'blur' }
            ],
            issuePrice: [
                { required: true, message: '请输入发行价格', trigger: 'blur' }
            ],

            flag: [
                { required: true, message: '请输入货币类型', trigger: 'blur' },
            ],
            symbolType: [
                { required: true, message: '请输入公链类型', trigger: 'blur' }
            ],
            iconFile: [
                 { required: true, message: '请输入ICON', trigger: 'blur' },
                 { validator: xxx, message: '只能上传PNG或JPG或JPEG或bmp或ICO格式的图片', trigger: 'blur' },
                 { validator: xxx1, message: '图片不能超过2M', trigger: 'blur' }
            ],
            // symbolServer: [
            //     { required: true, message: '请输入钱包服务', trigger: 'blur' },
            // ],
            contractAddr: [
                { required: true, message: '请输入ERC20合约地址', trigger: 'blur' },
                { validator: validateAddrCheck, message: '请输入ERC20合约地址', trigger: 'blur' },
            ],
            contractDecimals: [
                { required: true, message: '请输入合约精度', trigger: 'blur' },
                { validator: validateAddrCheck, message: '请输入合约精度', trigger: 'blur' },
            ],
            minWithdrawQuantity: [
                { required: true,  message: '请输入最小提币数量',},
                { validator: customValidator, message: '请输入最小提币数量', trigger: 'blur' },
            ],
            minerFee: [
                { required: true, message: '请输入旷工费',},
                { validator: customValidator, message: '请输入旷工费', trigger: 'blur' },
            ],
            feeFixedAmount: [
                { required: true,  message: '请输入手续费固定额度'},
                { validator: customValidator, message: '请输入手续费固定额度', trigger: 'blur' },
            ],
            // riseRatio: [
            //     { required: true, message: '请输入上浮百分比',},
            //     { validator: customValidator, message: '请输入上浮百分比', trigger: 'blur' },
            // ],
            rechargeFlag: [
                { required: true, message: '请输入充币权限', trigger: 'blur' }
            ],
            withdrawFlag: [
                { required: true, message: '请输入提币权限', trigger: 'blur' }
            ],
            confirmBlock: [
                { required: true, message: '请输入等待区块数',},
                { validator: customValidator, message: '请输入等待区块数', trigger: 'blur' },
            ],
            gasprice: [
                { required: true, message: '请输入gasprice'},
                { validator: customValidator, message: '请输入gasprice', trigger: 'blur' },
            ],
            gaslimit: [
                { required: true, message: '请输入gaslimit'},
                { validator: customValidator, message: '请输入gaslimit', trigger: 'blur' },
            ],
            propertyId: [
                { required: true, message: '请输入propertyId'},
            ]
        }
    }
  },
  components: {
     numberbox
  },
  created () {
    this.$nextTick(() => {
      let cks = ['flag', 'symbolType', 'rechargeFlag', 'withdrawFlag'];
      cks.forEach((item) => {
          let flags = this.$refs[item].$el.querySelectorAll('input')
        flags[0].value = '1'
        flags[1].value = '2'
      })
    })
  },
  methods: {
    binValidator (prop, e) {
       this.formLeft[prop] = e.target.value
    },
    abiValidator (prop, e) {
       this.formLeft[prop] = e.target.value
    },
    iconValidator (prop, e) {
       this.formLeft[prop] = e.target.value
    },
    closeDialog () {
        this.$emit('removeDialog')
    },
    addCurreny() {
        let form = this.$refs.formItem;
        form.validate((valid) => {
            if (valid) {
                var formData = new FormData(form.$el)
                let cks = ['flag', 'symbolType', 'rechargeFlag', 'withdrawFlag']
                cks.forEach((item) => {
                    formData.append(item, this.formLeft[item])
                })
                currenyApi.insertSymbol(formData,(res) => {
                    this.$Message.success({content: '添加成功'})
                    this.$emit('okCallback')
                    this.$emit('removeDialog')
                }, (msg) => {
                    this.$Message.error({content: msg})
                })
            }
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
