<template>
    <Card style="width:840px">
        <p slot="title">
            账户权限
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Row style="margin:0 20px;">
            <Row style="margin-bottom:10px;">
                <Col span="12">权限名称</Col>
                <Col span="8">当前状态</Col>
                <Col span="4" style="text-align:right;">修改</Col>
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">币币交易权限{{data2.length}}</Col>
                <Col span="8">{{data2.exchangePermission === 1? '正常':'冻结'}}</Col>
                <Col span="4">
                    <Button type="primary" style="float:right;" @click="tabs('exchangePermission')">{{data2.exchangePermission === 1? '冻结':'正常'}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">谷歌二次认证</Col>
                <Col span="8">{{data2.googleAuthenticate === 1? '已绑定':'未绑定'}}</Col>
                <Col span="4">
                    <Button :disabled="data2.googleAuthenticate !== 1" type="primary" style="float:right;" @click="tabs('googleAuthenticate')">{{data2.googleAuthenticate === 1? '解绑':'绑定'}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">短信二次认证</Col>
                <Col span="8">{{data2.mobileAuthenticate === 1? '已绑定':'未绑定'}}</Col>
                <Col span="4">
                    <Button :disabled="data2.mobileAuthenticate !== 1" type="primary" style="float:right;" @click="tabsMobile('mobileAuthenticate')">{{data2.mobileAuthenticate === 1? '解绑':'绑定'}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">提现权限</Col>
                <Col span="8">{{data2.withdrawPermission === 1? '正常':'冻结'}}</Col>
                <Col span="4">
                    <Button type="primary" style="float:right;" @click="tabs('withdrawPermission')">{{data2.withdrawPermission === 1? '冻结':'正常'}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">KYC状态</Col>
                <Col span="8">{{data2.kycStatus === 2? '已认证':'未认证'}}</Col>
                <!-- <Col span="4">
                    <Button type="primary" style="float:right;" @click="tabs('kycStatus')">{{data2.kycStatus === 1? '解冻':'正常'}}</Button>
                </Col> -->
            </Row>
            <Row style="margin-bottom:10px;">
                <Col span="12">OTC交易权限</Col>
                <Col span="8">{{data2.otcPermission === 1? '正常':'冻结'}}</Col>
                <Col span="4">
                    <!-- <Button type="primary" style="float:right;" @click="tabs('otcPermission')">{{data2.otcPermission === 1? '冻结':'正常'}}</Button> -->
                </Col>
            </Row>
            <Row style="margin-bottom:10px;border-bottom:1px solid #ccc;padding-bottom:10px;display:none;">
                <Col span="12">
                    <span style="margin-right:20px;">
                        硬件状态
                    </span>
                    <span>
                        硬件钱包ID
                    </span>
                    <span>
                        {{data2.usbKeyId}}
                        <!-- {{data2.usbKeyStatus === 1? '正常':'解冻'}} -->
                    </span>
                </Col>
                <Col span="8">{{data2.usbKeyStatus === 1? '正常':'冻结'}}</Col>
                <Col span="4">
                    <Button type="primary" style="float:right;" @click="tabs('usbKeyStatus')">{{data2.usbKeyStatus === 1? '解冻':'正常'}}</Button>
                </Col>
            </Row>
            <!-- <Row style="margin-bottom:10px;">
                <Col span="6">提现额度</Col>
                <Col span="6">{{data2.withdrawLimitAmount}}BTC</Col>
                <Col span="6">
                    <InputNumber v-model="withdrawLimitAmount" max="10000"></InputNumber>
                </Col>
                <Col span="6">
                    <Button type="primary" style="float:right;" @click="tabs('withdrawLimitAmount', true)">保存</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:10px;border-bottom:1px solid #ccc;padding-bottom:10px;">
                <Col span="6">人工审核额度</Col>
                <Col span="6">{{data2.artificialAuditingAmount}}BTC</Col>
                <Col span="6">
                     <InputNumber v-model="artificialAuditingAmount"></InputNumber>
                </Col>
                <Col span="6">
                    <Button type="primary" style="float:right;" @click="tabs('artificialAuditingAmount', true)">保存</Button>
                </Col>
            </Row> -->
            <Row>
                <span style="font-size:18px;font-weight:bold;">API</span>
            </Row>
            <Table :columns="columns1" :data="data1"></Table>
            <Row type="flex" justify="center" style="margin-top:10px;">
                <Button @click="closeDialog">取消</Button>
                <Button type="primary" style="margin-left:20px;" @click="upSubmit">保存</Button>
            </Row>
        </Row>
    </Card>
</template>

<script>
import currenyApi from '../../../api/currency'
export default {
    props: ['userId', 'version'],
    data () {
        return {
            active: true,
            withdrawLimitAmount: null || 0,
            artificialAuditingAmount: null,
            columns1: [
                {title: '名称', key: 'name', render: (h, params) => {
                    return h('div', [
                        h('Input')
                    ]);
                }},
                {title: '公钥', key: 'publickey'},
                {title: '权限', key: 'permission', render: (h, params) => {
                    return h('div', [
                        h('CheckboxGroup', [
                            h('Checkbox', {
                                props: {label: '读取消息'}
                            }),
                            h('Checkbox', {
                                props: {label: '限价委托'}
                            }),
                            h('Checkbox', {
                                props: {label: '市价委托'}
                            }),
                            h('Checkbox', {
                                props: {label: '账户提币'}
                            })
                        ])
                    ]);
                }},
                {title: 'IP', key: 'ip', render: (h, params) => {
                    return h('div', [
                        h('Input')
                    ]);
                }}
            ],
            data1: [],
            data2: {}
        }
    },
    created() {
        this.getPermission()
    },
    methods: {
        closeDialog () {
            this.$emit('removeDialog');
        },
        getPermission() {
            currenyApi.findUserPermission(this.userId, (res) => {
                if (res === null) {
                    return
                }
                this.data2 = res
            },(msg) => {
             this.$Message.error({content: msg})
             })
        },
        tabsMobile(propName, type) {
           let data = {
             userId: this.data2.userId,
             version: this.data2.version
           }
           if (!type) {
             data[propName] = this.data2[propName] === 1 ? 2 : 1
           } else {
             data[propName] = this[propName]
           }
           currenyApi.updateUserPermission(data, (res) =>{
              if (res == 0) {
                   this.$Message.error({content: '记录已被其他人修改'})
                   return
               }
               if (!type) {
                 this.data2[propName] = this.data2[propName] === 2
               } else {
                 this[propName] = ''
               }
               this.$Message.success({content: '修改成功'})
               this.getPermission()
           }, (msg) => {
               this.$Message.error({content: msg})
           })
        },
        tabs(propName, type) {
           let data = {
             userId: this.data2.userId,
             version: this.data2.version
           }
           if (!type) {
             data[propName] = this.data2[propName] === 1 ? 2 : 1
           } else {
             data[propName] = this[propName]
           }
           currenyApi.updateUserPermission(data, (res) =>{
              if (res == 0) {
                   this.$Message.error({content: '记录已被其他人修改'})
                   return
               }
               if (!type) {
                 this.data2[propName] = this.data2[propName] === 1 ? 2 : 1
               } else {
                 this[propName] = null
               }
               this.$Message.success({content: '修改成功'})
               this.getPermission()
           }, (msg) => {
               this.$Message.error({content: msg})
           })
        },
        upSubmit () {

        }
    }
}
</script>

<style>

</style>
