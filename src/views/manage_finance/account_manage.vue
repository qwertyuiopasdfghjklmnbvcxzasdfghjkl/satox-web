<template>
    <div class="account_manage">
        <Tabs>
            <TabPane label="漏记">
                <Form ref="formItem" :model="addFormData" :rules="ruleInline" label-position="left" :label-width="100">
                    <FormItem label="LedgerID" prop="ledgerId">
                        <Input v-model="addFormData.ledgerId" name="ledgerId"></Input>
                    </FormItem>
                    <FormItem label="科目" prop="subject">
                        <Input v-model="addFormData.subject" name="subject"></Input>
                    </FormItem>
                    <FormItem label="数量" prop="amount">
                        <Input v-model="addFormData.amount" name="amount"></Input>
                    </FormItem>
                    <FormItem label="借贷" prop="type">
                       <RadioGroup ref="type" v-model="addFormData.type">
                            <Radio label="1">
                                <span>借方</span>
                            </Radio>
                            <Radio label="2">
                                <span>贷方</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="Banlance" prop="balance">
                        <Input v-model="addFormData.balance" name="balance"></Input>
                    </FormItem>
                    <FormItem label="Related" prop="related">
                        <Input v-model="addFormData.related" name="related"></Input>
                    </FormItem>
                    <FormItem label="是否改账户" prop="updateAccount">
                        <RadioGroup ref="updateAccount" v-model="addFormData.updateAccount">
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="2">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem >
                        <Button type="primary" @click="ledgerAdd">确定</Button>
                        <Button type="primary">取消</Button>
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane label="多记">
                <Form ref="formItem1" :model="reduceData" :rules="ruleInline1" label-position="left" :label-width="100">
                    <FormItem label="Detail_ID" prop="detailId">
                        <Input v-model="reduceData.detailId" name="detailId"></Input>
                    </FormItem>
                    <FormItem label="是否改账户" prop="updateAccount">
                        <RadioGroup v-model="reduceData.updateAccount">
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="2">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem >
                        <Button type="primary" @click="reduceAdd">确定</Button>
                        <Button type="primary">取消</Button>
                    </FormItem>
                 </Form>
            </TabPane>
            <TabPane label="错记">
                 <Form ref="formItem2" :model="fixData" :rules="ruleInline2" label-position="left" :label-width="100">
                    <Card>
                        <p slot="title">第一步：标红</p>
                            <FormItem label="Detail_ID" prop="detailId">
                                <Input v-model="fixData.detailId" name="detailId"></Input>
                            </FormItem>
                            <FormItem label="是否改账户" prop="updateAccountByOne">
                                <RadioGroup v-model="fixData.updateAccountByOne">
                                    <Radio label="1">
                                        <span>是</span>
                                    </Radio>
                                    <Radio label="2">
                                        <span>否</span>
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
                        <p slot="title">第二步：标黑</p>
                        <!-- <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100"> -->
                             <FormItem label="Ledgerid" prop="ledgerid">
                                <Input v-model="fixData.ledgerid" name="ledgerid"></Input>
                            </FormItem> 
                            <FormItem label="科目" prop="subject">
                                <Input v-model="fixData.subject" name="subject"></Input>
                            </FormItem>
                            <FormItem label="数量" prop="amount">
                                <Input v-model="fixData.amount" name="amount"></Input>
                            </FormItem>
                            <FormItem label="借贷" prop="type">
                                <RadioGroup v-model="fixData.type">
                                    <Radio label="1">
                                        <span>借方</span>
                                    </Radio>
                                    <Radio label="2">
                                        <span>贷方</span>
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="Banlance" prop="balance">
                                <Input v-model="fixData.balance" name="balance"></Input>
                            </FormItem>
                            <FormItem label="Related" prop="related">
                                <Input v-model="fixData.related" name="related"></Input>
                            </FormItem>
                            <FormItem label="是否改账户" prop="updateAccountByTwo">
                                <RadioGroup v-model="fixData.updateAccountByTwo">
                                    <Radio label="1">
                                        <span>是</span>
                                    </Radio>
                                    <Radio label="2">
                                        <span>否</span>
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
                     <p slot="title" style="height:40px;line-height:40px;">第三步:执行
                        <Button type="primary" @click="fixAdd">执行</Button>
                        <Button type="primary">取消</Button>
                     </p>
                 </Card>
            </TabPane>
            <TabPane label="平差">
                 <Form ref="formItem3" :model="balanceData" :rules="ruleInline3" label-position="left" :label-width="100">
                    <FormItem label="科目" prop="subject">
                        <Input v-model="balanceData.subject" name="subject"></Input>
                    </FormItem>
                    <FormItem label="数量" prop="amount">
                        <Input v-model="balanceData.amount" name="amount"></Input>
                    </FormItem>
                    <FormItem label="借贷" prop="type">
                       <RadioGroup v-model="balanceData.type">
                            <Radio label="1">
                                <span>借方</span>
                            </Radio>
                            <Radio label="2">
                                <span>贷方</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="Related" prop="related">
                        <Input v-model="balanceData.related" name="related"></Input>
                    </FormItem>
                    <FormItem >
                        <Button type="primary" @click="balanceAdd">确定</Button>
                        <Button type="primary">取消</Button>
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
                    { required: true, message: '请输入LedgerID', trigger: 'blur' }
                ],
                subject: [
                    { required: true, message: '请输入科目', trigger: 'blur' }
                ],
                balance: [
                    { required: true, message: '请输入balance', trigger: 'blur' }
                ],
                amount: [
                    { required: true, message: '请输入数量', trigger: 'blur' }
                ],
                related: [
                    { required: true, message: '请输入related', trigger: 'blur' }
                ]
            },
            reduceData: {
                detailId: '',
                updateAccount: '1'
            },
            ruleInline1: {
               detailId: [
                    { required: true, message: '请输入detailId', trigger: 'blur' }
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
                    { required: true, message: '请输入数量', trigger: 'blur' }
                ],
                related: [
                    { required: true, message: '请输入related', trigger: 'blur' }
                ],
                subject: [
                    { required: true, message: '请输入科目', trigger: 'blur' }
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
                    { required: true, message: '请输入数量', trigger: 'blur' }
                ],
                balance: [
                    { required: true, message: '请输入balance', trigger: 'blur' }
                ],
                detailId: [
                    { required: true, message: '请输入detailId', trigger: 'blur' }
                ],
                ledgerid: [
                    { required: true, message: '请输入ledgerid', trigger: 'blur' }
                ],
                related: [
                    { required: true, message: '请输入related', trigger: 'blur' }
                ],
                subject: [
                    { required: true, message: '请输入科目', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
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
                        this.$Message.success({content: '添加成功'})
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
                        this.$Message.success({content: '添加成功'})
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
                        this.$Message.success({content: '添加成功'})
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
                        this.$Message.success({content: '添加成功'})
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
