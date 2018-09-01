<template>
    <div class="account_manage">
        <Tabs>
            <TabPane label="漏记">
                <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                    <FormItem label="LedgerID" prop="captionCN">
                        <Input v-model="formLeft.LedgerID" name="captionCN"></Input>
                    </FormItem>
                    <FormItem label="科目" prop="captionCN">
                        <Input v-model="formLeft.captionCN" name="captionCN"></Input>
                    </FormItem>
                    <FormItem label="数量" prop="number">
                        <Input v-model="formLeft.number" name="number"></Input>
                    </FormItem>
                    <FormItem label="借贷" prop="borrow">
                       <RadioGroup >
                            <Radio label="1">
                                <span>借方</span>
                            </Radio>
                            <Radio label="2">
                                <span>贷方</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="Banlance" prop="banlance">
                        <Input v-model="formLeft.banlance" name="banlance"></Input>
                    </FormItem>
                    <FormItem label="Related" prop="related">
                        <Input v-model="formLeft.related" name="related"></Input>
                    </FormItem>
                    <FormItem label="是否改账户" prop="accout">
                        <RadioGroup v-model="formLeft.accout">
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="2">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="LedgerID" prop="captionCN">
                        <Input v-model="formLeft.LedgerID" name="captionCN"></Input>
                    </FormItem>
                    <FormItem >
                        <Button type="primary">确定</Button>
                        <Button type="primary">取消</Button>
                    </FormItem>
                </Form>
            </TabPane>
            <TabPane label="多记">
                <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                    <FormItem label="Detail_ID" prop="captionCN">
                        <Input v-model="formLeft.LedgerID" name="captionCN"></Input>
                    </FormItem>
                    <FormItem label="是否改账户" prop="accout">
                        <RadioGroup v-model="formLeft.accout">
                            <Radio label="1">
                                <span>是</span>
                            </Radio>
                            <Radio label="2">
                                <span>否</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem >
                        <Button type="primary">确定</Button>
                        <Button type="primary">取消</Button>
                    </FormItem>
                 </Form>
            </TabPane>
            <TabPane label="惜记">
                <Card>
                     <p slot="title">第一步：标红</p>
                     <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                        <FormItem label="Detail_ID" prop="captionCN">
                            <Input v-model="formLeft.LedgerID" name="captionCN"></Input>
                        </FormItem>
                        <FormItem label="是否改账户" prop="accout">
                            <RadioGroup v-model="formLeft.accout">
                                <Radio label="1">
                                    <span>是</span>
                                </Radio>
                                <Radio label="2">
                                    <span>否</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem >
                            <Button type="primary">确定</Button>
                            <Button type="primary">取消</Button>
                        </FormItem>
                    </Form>
                </Card>
                <Card>
                     <p slot="title">第二步：标黑</p>
                     <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                         <FormItem label="Detail_ID" prop="captionCN">
                            <Input v-model="formLeft.LedgerID" name="captionCN"></Input>
                        </FormItem>
                        <FormItem label="科目" prop="captionCN">
                            <Input v-model="formLeft.captionCN" name="captionCN"></Input>
                        </FormItem>
                        <FormItem label="数量" prop="number">
                            <Input v-model="formLeft.number" name="number"></Input>
                        </FormItem>
                        <FormItem label="借贷" prop="borrow">
                            <RadioGroup >
                                <Radio label="1">
                                    <span>借方</span>
                                </Radio>
                                <Radio label="2">
                                    <span>贷方</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="Banlance" prop="banlance">
                            <Input v-model="formLeft.banlance" name="banlance"></Input>
                        </FormItem>
                        <FormItem label="Related" prop="related">
                            <Input v-model="formLeft.related" name="related"></Input>
                        </FormItem>
                        <FormItem label="是否改账户" prop="accout">
                            <RadioGroup v-model="formLeft.accout">
                                <Radio label="1">
                                    <span>是</span>
                                </Radio>
                                <Radio label="2">
                                    <span>否</span>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem >
                            <Button type="primary">确定</Button>
                            <Button type="primary">取消</Button>
                        </FormItem>
                    </Form>
                </Card>
                 <Card>
                     <p slot="title" style="height:40px;line-height:40px;">第三步:执行
                        <Button type="primary">执行</Button>
                        <Button type="primary">取消</Button>
                     </p>
                 </Card>
            </TabPane>
            <TabPane label="平差">
                 <Form ref="formItem" :model="formLeft" :rules="ruleInline" label-position="left" :label-width="100">
                    <FormItem label="科目" prop="captionCN">
                        <Input v-model="formLeft.captionCN" name="captionCN"></Input>
                    </FormItem>
                    <FormItem label="数量" prop="number">
                        <Input v-model="formLeft.number" name="number"></Input>
                    </FormItem>
                    <FormItem label="借贷" prop="borrow">
                       <RadioGroup >
                            <Radio label="1">
                                <span>借方</span>
                            </Radio>
                            <Radio label="2">
                                <span>贷方</span>
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="Related" prop="related">
                        <Input v-model="formLeft.related" name="related"></Input>
                    </FormItem>
                    <FormItem >
                        <Button type="primary">确定</Button>
                        <Button type="primary">取消</Button>
                    </FormItem>
                 </Form>
            </TabPane>
        </Tabs>
    </div>
</template>
<script>
export default {
    data () {
        return {
            formLeft: {
                captionCN: '',
                LedgerID: '',
                subject: '',
                banlance: '',
                number: '',
                related: '',
                accout: ''
            },
            ruleInline: {
                LedgerID: [
                    { required: true, message: '请输入英文简称', trigger: 'blur' }
                ],
                subject: [
                    { required: true, message: '请输入英文简称', trigger: 'blur' }
                ],
                banlance: [
                    { required: true, message: '请输入英文简称', trigger: 'blur' }
                ],
                number: [
                    { required: true, message: '请输入英文简称', trigger: 'blur' }
                ],
                related: [
                    { required: true, message: '请输入英文简称', trigger: 'blur' }
                ],
                accout: [
                    { required: true, message: '请输入英文简称', trigger: 'blur' }
                ],
            }
        }
    }
}
</script>
<style scoped>
.account_manage{width: 500px;background: #fff;padding: 20px;}
</style>
