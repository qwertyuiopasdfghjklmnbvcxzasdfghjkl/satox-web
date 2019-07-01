<template>
    <Card class="box">
        <p slot="title">{{$t('nav.xjxm')}}</p>
        <Form ref="form" :model="form" :rules="ruleInline" :label-width="90" style="margin:0 20px;">
            <div class="law">
                <FormItem :label="vm.$t('ieo.xmmc')" prop="productName">
                    <Input v-model="form.productName" :maxlength="32" class="w1"></Input>
                </FormItem>
                <FormItem :label="vm.$t('ieo.xmmc')" prop="productName">
                    <DatePicker type="datetime"
                                class="w1"
                                v-model="form.createdStart"
                                :placeholder="$t('common.kssj')"
                                format="yyyy-MM-dd HH:mm:ss"></DatePicker>
                </FormItem>

                <FormItem :label="vm.$t('common.bzdh')" prop="productName">
                    <Input v-model="form.productName" :maxlength="32" class="w1"></Input>
                </FormItem>
                <FormItem :label="vm.$t('ieo.xmmc')" prop="productName">
                    <DatePicker type="datetime"
                                class="w1"
                                v-model="form.createdStart"
                                :placeholder="$t('common.kssj')"
                                format="yyyy-MM-dd HH:mm:ss"></DatePicker>
                </FormItem>

                <FormItem :label="vm.$t('mall.tp')" prop="iconFile">
                    <input type="file" ref="iconFile" name="iconFile" class="w1" @change="getImg()">
                </FormItem>
                <FormItem :label="vm.$t('ieo.xmmc')" prop="productName">
                    <DatePicker type="datetime"
                                class="w1"
                                v-model="form.createdStart"
                                :placeholder="$t('common.kssj')"
                                format="yyyy-MM-dd HH:mm:ss"></DatePicker>
                </FormItem>

                <FormItem :label="vm.$t('common.bzdh')" prop="productName">
                    <Input v-model="form.productName" class="w1" type="textarea" :maxlength="255"></Input>
                </FormItem>
                <FormItem :label="vm.$t('ieo.xmmc')" prop="productName">
                    <DatePicker type="datetime"
                                class="w1"
                                v-model="form.createdStart"
                                :placeholder="$t('common.kssj')"
                                format="yyyy-MM-dd HH:mm:ss"></DatePicker>
                </FormItem>
            </div>


            <FormItem :label="vm.$t('mall.yj')" prop="originalPrice">
                <numberbox class="number_input w1" v-model="form.originalPrice"></numberbox>
                <Tag type="border" color="green">标签一</Tag>
            </FormItem>
            <FormItem :label="vm.$t('mall.zkj')" prop="discountPrice">
                <Select class="w1">
                    <Option :value="'eth'" :key="'eth'">eth</Option>
                </Select>
            </FormItem>
            <FormItem :label="vm.$t('mall.mc')" prop="productName">
                1  <Tag type="border" color="red">标签一</Tag> =
                <numberbox class="number_input w1" v-model="form.originalPrice"></numberbox>
                <Tag type="border" color="green">标签一</Tag>
            </FormItem>
            <FormItem :label="vm.$t('mall.yj')" prop="originalPrice">
                <numberbox class="number_input w1" v-model="form.originalPrice"></numberbox>
                <Tag type="border" color="red">标签一</Tag>
            </FormItem>
            <FormItem :label="vm.$t('mall.yj')" prop="originalPrice">
                <numberbox class="number_input w1" :accuracy="0" v-model="form.originalPrice"></numberbox>
            </FormItem>
            <FormItem :label="vm.$t('mall.yj')" prop="originalPrice">
                <numberbox class="number_input w1" v-model="form.originalPrice"></numberbox>
                <Tag type="border" color="red">标签一</Tag>
            </FormItem>
            <div class="tab">
                <p>付款币种：</p>
                <Table :columns="columns" :data="datas"></Table>
                <Button>{{vm.$t('common.tj')}}</Button>
            </div>
            <div >
                <p>认购限制</p>
                <div class="m90">
                    <Checkbox v-model="form.single">Checkbox</Checkbox>
                    <div>
                        <RadioGroup v-model="form.disabledGroup">
                            <Radio label="金斑蝶"></Radio>
                            <Radio label="爪哇犀牛"></Radio>
                        </RadioGroup>
                    </div>
                </div>

                <FormItem :label="vm.$t('mall.yj')" prop="originalPrice">
                    <numberbox class="number_input w1" :accuracy="0" v-model="form.originalPrice"></numberbox>
                </FormItem>
                <FormItem :label="vm.$t('mall.yj')" prop="originalPrice">
                    <numberbox class="number_input w1" :accuracy="0" v-model="form.originalPrice"></numberbox>
                </FormItem>
            </div>
            <p><br><br></p>
            <FormItem :label="vm.$t('mall.ywm')" prop="productNameEn">
                <Input v-model="form.productNameEn" :maxlength="120"></Input>
            </FormItem>

            <FormItem :label="vm.$t('mall.jj')" prop="productDescription">
                <Input v-model="form.productDescription" type="textarea" :maxlength="500" :rows="8"></Input>
            </FormItem>
            <FormItem :label="vm.$t('mall.ywjj')" prop="productDescriptionEn">
                <Input v-model="form.productDescriptionEn" type="textarea" :maxlength="500" :rows="8"></Input>
            </FormItem>

            <FormItem>
                <Button type="primary" class="btn"  size="large">{{vm.$t('finance.chuangj')}}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import Numberbox from '../../components/dialog/numberbox';
    export default {
        name: 'project',
        components: {Numberbox},
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                form: {},
                ruleInline: {},
                columns: [
                    {key: 'orderId', title: vm.$t('operation.bh')},
                    {key: 'orderId2', title: vm.$t('common.bz')},
                    {key: 'orderId3', title: vm.$t('ieo.mfsl')},
                    {key: 'orderId4', title: vm.$t('common.cz'),render: (h, params) => {
                        return h('div', [
                            h( 'Button', {
                                props: {type: 'primary', size: 'small'},
                                style: { margin: '3px'},
                                on: {
                                    click: () => {}
                                }
                            }, vm.$t('ieo.bj')),
                            h( 'Button', {
                                props: {type: 'warning', size: 'small'},
                                on: {
                                    click: () => {}
                                }
                            }, vm.$t('common.sc'))
                        ])
                        }},
                ],
                datas: [{orderId: 123,orderId2: 'eft'}],
            };
        }
    };
</script>

<style scoped lang="less">
 @import "project";
</style>
