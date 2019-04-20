<template>
    <div class="account_manage">
        <Tabs>
            <TabPane :label="$t('finance.lj')">
                <Form ref="formItem" :model="addFormData" :rules="ruleInline" label-position="left" :label-width="100">
                    <FormItem label="LedgerID" prop="ledgerId">
                        <Input v-model="addFormData.ledgerId" name="ledgerId"></Input>
                    </FormItem>
                    <FormItem :label="$t('finance.km')" prop="subject">
                        <Input v-model="addFormData.subject" name="subject"></Input>
                    </FormItem>
                    <FormItem :label="$t('common.sl')" prop="amount">
                        <Input v-model="addFormData.amount" name="amount"></Input>
                    </FormItem>
                    <FormItem :label="$t('finance.jd')" prop="type">
                       <RadioGroup ref="type" v-model="addFormData.type">
                            <Radio label="1">
                                <span>{{$t('finance.jf')}}</span>
                            </Radio>
                            <Radio label="2">
                                <span>{{$t('finance.df')}}</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="Banlance" prop="balance">
                        <Input v-model="addFormData.balance" name="balance"></Input>
                    </FormItem>
                    <FormItem label="Related" prop="related">
                        <Input v-model="addFormData.related" name="related"></Input>
                    </FormItem>
                    <FormItem :label="$t('finance.sfgzh')" prop="updateAccount">
                        <RadioGroup ref="updateAccount" v-model="addFormData.updateAccount">
                            <Radio label="1">
                                <span>{{$t('common.s')}}</span>
                            </Radio>
                            <Radio label="2">
                                <span>{{$t('common.f')}}</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem >
                        <Button type="primary" @click="ledgerAdd">{{$t('common.qd')}}</Button>
                        <Button type="primary" @click="reset()">{{$t('common.qx')}}</Button>
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane :label="$t('finance.dj')">
                <Form ref="formItem1" :model="reduceData" :rules="ruleInline1" label-position="left" :label-width="100">
                    <FormItem label="Detail_ID" prop="detailId">
                        <Input v-model="reduceData.detailId" name="detailId"></Input>
                    </FormItem>
                    <FormItem :label="$t('finance.sfgzh')" prop="updateAccount">
                        <RadioGroup v-model="reduceData.updateAccount">
                            <Radio label="1">
                                <span>{{$t('common.s')}}</span>
                            </Radio>
                            <Radio label="2">
                                <span>{{$t('common.f')}}</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem >
                        <Button type="primary" @click="reduceAdd">{{$t('common.qd')}}</Button>
                        <Button type="primary" @click="reset1()">{{$t('common.qx')}}</Button>
                    </FormItem>
                 </Form>
            </TabPane>
            <TabPane :label="$t('finance.cj')">
                 <Form ref="formItem2" :model="fixData" :rules="ruleInline2" label-position="left" :label-width="100">
                    <Card>
                        <p slot="title">{{$t('finance.dybbh')}}</p>
                            <FormItem label="Detail_ID" prop="detailId">
                                <Input v-model="fixData.detailId" name="detailId"></Input>
                            </FormItem>
                            <FormItem :label="$t('finance.sfgzh')" prop="updateAccountByOne">
                                <RadioGroup v-model="fixData.updateAccountByOne">
                                    <Radio label="1">
                                        <span>{{$t('common.s')}}</span>
                                    </Radio>
                                    <Radio label="2">
                                        <span>{{$t('common.f')}}</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            <!-- <FormItem >
                                <Button type="primary">确定</Button>
                                <Button type="primary">取消</Button>
                            </FormItem> -->
                        <!-- </Form> -->
                    </Card>
                    <Card>
                        <p slot="title">{{$t('finance.debbh')}}</p>
                        <!-- <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100"> -->
                             <FormItem label="Ledgerid" prop="ledgerid">
                                <Input v-model="fixData.ledgerid" name="ledgerid"></Input>
                            </FormItem>
                            <FormItem :label="$t('finance.km')" prop="subject">
                                <Input v-model="fixData.subject" name="subject"></Input>
                            </FormItem>
                            <FormItem :label="$t('common.sl')" prop="amount">
                                <Input v-model="fixData.amount" name="amount"></Input>
                            </FormItem>
                            <FormItem :label="$t('finance.jd')" prop="type">
                                <RadioGroup v-model="fixData.type">
                                    <Radio label="1">
                                        <span>{{$t('finance.jf')}}</span>
                                    </Radio>
                                    <Radio label="2">
                                        <span>{{$t('finance.df')}}</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="Banlance" prop="balance">
                                <Input v-model="fixData.balance" name="balance"></Input>
                            </FormItem>
                            <FormItem label="Related" prop="related">
                                <Input v-model="fixData.related" name="related"></Input>
                            </FormItem>
                            <FormItem :label="$t('finance.sfgzh')" prop="updateAccountByTwo">
                                <RadioGroup v-model="fixData.updateAccountByTwo">
                                    <Radio label="1">
                                        <span>{{$t('common.s')}}</span>
                                    </Radio>
                                    <Radio label="2">
                                        <span>{{$t('common.f')}}</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            <!-- <FormItem >
                                <Button type="primary">确定</Button>
                                <Button type="primary">取消</Button>
                            </FormItem> -->

                    </Card>
                </Form>
                 <Card>
                     <p slot="title" style="height:40px;line-height:40px;">{{$t('finance.dsbzx')}}
                        <Button type="primary" @click="fixAdd">{{$t('finance.zx')}}</Button>
                        <Button type="primary" @click="reset2()">{{$t('common.qx')}}</Button>
                     </p>
                 </Card>
            </TabPane>
            <TabPane :label="$t('finance.pc')">
                 <Form ref="formItem3" :model="balanceData" :rules="ruleInline3" label-position="left" :label-width="100">
                    <FormItem :label="$t('finance.km')" prop="subject">
                        <Input v-model="balanceData.subject" name="subject"></Input>
                    </FormItem>
                    <FormItem :label="$t('common.sl')" prop="amount">
                        <Input v-model="balanceData.amount" name="amount"></Input>
                    </FormItem>
                    <FormItem :label="$t('finance.jd')" prop="type">
                       <RadioGroup v-model="balanceData.type">
                            <Radio label="1">
                                <span>{{$t('finance.jf')}}</span>
                            </Radio>
                            <Radio label="2">
                                <span>{{$t('finance.df')}}</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="Related" prop="related">
                        <Input v-model="balanceData.related" name="related"></Input>
                    </FormItem>
                    <FormItem >
                        <Button type="primary" @click="balanceAdd">{{$t('common.qd')}}</Button>
                        <Button type="primary" @click="reset3()">{{$t('common.qx')}}</Button>
                    </FormItem>
                 </Form>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
import financeApi from '../../api/finance'
export default {
    data () {
        return {
            addFormData: {
                ledgerId: '',
                subject: '',
                amount: '',
                type: '1',
                balance: '',
                related: '',
                updateAccount: '1'
            },
            ruleInline: {
                ledgerId: [
                    { required: true, message: this.$t('common.qsr') + 'LedgerID', trigger: 'blur' }
                ],
                subject: [
                    { required: true, message: this.$t('common.qsr') + this.$t('finance.km'), trigger: 'blur' }
                ],
                balance: [
                    { required: true, message: this.$t('common.qsr') + 'balance', trigger: 'blur' }
                ],
                amount: [
                    { required: true, message: this.$t('common.qsr') + this.$t('common.sl'), trigger: 'blur' }
                ],
                related: [
                    { required: true, message: this.$t('common.qsr') + 'related', trigger: 'blur' }
                ]
            },
            reduceData: {
                detailId: '',
                updateAccount: '1'
            },
            ruleInline1: {
               detailId: [
                    { required: true, message: this.$t('common.qsr') + 'detailId', trigger: 'blur' }
                ]
            },
            balanceData: {
                amount: '',
                related: '',
                subject: '',
                type: '1'
            },
            ruleInline3: {
                amount: [
                    { required: true, message: this.$t('common.qsr') + this.$t('common.sl'), trigger: 'blur' }
                ],
                related: [
                    { required: true, message: this.$t('common.qsr') + 'related', trigger: 'blur' }
                ],
                subject: [
                    { required: true, message: this.$t('common.qsr') + this.$t('finance.km'), trigger: 'blur' }
                ]
            },
            fixData: {
                amount: '',
                balance: '',
                detailId: '',
                ledgerid: '',
                related: '',
                subject: '',
                type: '1',
                updateAccountByOne: '1',
                updateAccountByTwo: '1'
            },
            ruleInline2: {
                amount: [
                    { required: true, message: this.$t('common.qsr') + this.$t('common.sl'), trigger: 'blur' }
                ],
                balance: [
                    { required: true, message: this.$t('common.qsr') + 'balance', trigger: 'blur' }
                ],
                detailId: [
                    { required: true, message: this.$t('common.qsr') + 'detailId', trigger: 'blur' }
                ],
                ledgerid: [
                    { required: true, message: this.$t('common.qsr') + 'ledgerid', trigger: 'blur' }
                ],
                related: [
                    { required: true, message: this.$t('common.qsr') + 'related', trigger: 'blur' }
                ],
                subject: [
                    { required: true, message: this.$t('common.qsr') + this.$t('finance.km'), trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        reset3 () {
            this.balanceData.amount =  '',
            this.balanceData.related = '',
            this.balanceData.subject =  '',
            this.balanceData.type =  '1'
        },
        reset2 () {
            this.fixData.amount = '',
            this.fixData.balance = '',
            this.fixData.detailId = '',
            this.fixData.ledgerid = '',
            this.fixData.related = '',
            this.fixData.subject = '',
            this.fixData.type = '1',
            this.fixData.updateAccountByOne =  '1',
            this.fixData.updateAccountByTwo = '1'
        },
        reset1  () {
            this.reduceData.updateAccount = '1',
            this.reduceData.detailId = ''
        },
        reset () {
            this.addFormData.ledgerId =  '',
            this.addFormData.subject =  '',
            this.addFormData.amount =  '',
            this.addFormData.type =  '1',
            this.addFormData.balance =  '',
            this.addFormData.related =  ''
            this.addFormData.updateAccount =  '1'
        },
        ledgerAdd () {
            let form = this.$refs.formItem;
            form.validate((valid) => {
                if (valid) {
                    financeApi.ledgerAdd({
                            ledgerId: this.addFormData.ledgerId,
                            subject: this.addFormData.subject,
                            amount: this.addFormData.amount,
                            type: this.addFormData.type,
                            balance: this.addFormData.balance,
                            related: this.addFormData.related,
                            updateAccount: this.addFormData.updateAccount === '1' ? true : false
                        }, (res) => {
                        this.$Message.success({content: this.$t('common.tjcg')})
                    }, (msg) => {
                        this.$Message.error({content: msg})
                    })
                }
            })
       },
       reduceAdd () {
           let form = this.$refs.formItem1;
            form.validate((valid) => {
                if (valid) {
                    financeApi.ledgerReduce({
                            detailId: this.reduceData.detailId,
                            updateAccount: this.reduceData.updateAccount === '1' ? true : false
                        }, (res) => {
                        this.$Message.success({content: this.$t('common.tjcg')})
                    }, (msg) => {
                        this.$Message.error({content: msg})
                    })
                }
            })
       },
       balanceAdd () {
           let form = this.$refs.formItem3;
            form.validate((valid) => {
                if (valid) {
                    financeApi.ledgerBalance(this.balanceData, (res) => {
                        this.$Message.success({content: this.$t('common.tjcg')})
                    }, (msg) => {
                        this.$Message.error({content: msg})
                    })
                }
            })
       },
       fixAdd () {
            let form = this.$refs.formItem2;
            form.validate((valid) => {
                if (valid) {
                    financeApi.ledgerFix({
                            amount: this.fixData.amount,
                            balance:  this.fixData.balance,
                            detailId:  this.fixData.detailId,
                            ledgerId: this.fixData.ledgerid,
                            related:  this.fixData.related,
                            subject:  this.fixData.subject,
                            type:  this.fixData.type,
                            updateAccountByOne: this.fixData.updateAccountByOne === '1' ? true : false,
                            updateAccountByTwo: this.fixData.updateAccountByTwo === '1' ? true : false
                        }, (res) => {
                        this.$Message.success({content: this.$t('common.tjcg')})
                    }, (msg) => {
                        this.$Message.error({content: msg})
                    })
                }
            })

       }
    }
}
</script>
<style scoped>
.account_manage{width: 500px;background: #fff;padding: 20px;}
</style>
