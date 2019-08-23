<template>
    <Card style="width:600px;">
        <p slot="title">
            {{item ? vm.$t('exchange.xgjgfp') : vm.$t('exchange.xzjgfp')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form ref="formValidate" :model="form" :rules="ruleInline" :label-width="100" class="cont" style="margin:0 20px;">

            <FormItem :label="vm.$t('exchange.zfbfb')" prop="amplitudeRate">
                <numberbox v-model="form.amplitudeRate " name="amplitudeRate"></numberbox><span>%</span>
            </FormItem>
            <FormItem :label="vm.$t('exchange.zfje')" prop="changeAmount">
                <numberbox v-model="form.changeAmount " name="changeAmount" :minus="true"></numberbox>
            </FormItem>
            <FormItem :label="vm.$t('exchange.zhangfbfb')" prop="changeRate">
                <numberbox v-model="form.changeRate " name="changeRate" :minus="true"></numberbox><span>%</span>
            </FormItem>
            <FormItem :label="vm.$t('exchange.wtpl')" prop="interval">
                <numberbox v-model="form.interval " name="interval"></numberbox><span>/ms</span>
            </FormItem>
            <FormItem :label="vm.$t('exchange.slfw')" prop="quantityRange">
                <numberbox v-model="quantityRange1" name="quantityRange1" style="width: 138px"></numberbox>
                <span>-</span>
                <numberbox v-model="quantityRange2" name="quantityRange2" style="width: 138px"></numberbox>
            </FormItem>
            <FormItem :label="vm.$t('common.kssj')" prop="startAt">
                <DatePicker type="datetime" v-model="form.startAt"
                            :placeholder="vm.$t('common.kssj')"
                            :disabled="Boolean(item)"
                            :readonly="Boolean(item)"
                            format="yyyy-MM-dd HH:mm:ss"
                            style="width: 300px"></DatePicker>
            </FormItem>
            <FormItem :label="vm.$t('common.jssj')" prop="endAt">
                <DatePicker type="datetime" v-model="form.endAt"
                            :placeholder="vm.$t('common.jssj')"
                            :disabled="Boolean(item)"
                            :readonly="Boolean(item)"
                            format="yyyy-MM-dd HH:mm:ss"
                            style="width: 300px"></DatePicker>
            </FormItem>
            <FormItem :label="vm.$t('operation.scmc')" prop="market">
                <Select style="width: 300px;" v-model="form.market">
                    <Option v-for="item in marketList" :value="item.market" :key="item.market">{{ item.market }}</Option>
                </Select>
            </FormItem>
            <FormItem :label="vm.$t('common.zt')" prop="status">
                <RadioGroup v-model="form.status">
                    <Radio :label="1">{{vm.$t('fund.qy')}}</Radio>
                    <Radio :label="2">{{vm.$t('exchange.ty')}}</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem>
                <Button type="primary" style="width:300px;" @click="add">{{vm.$t('common.bc')}}</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import Numberbox from "../../components/dialog/numberbox";
    import currenyApi from '../../../api/currency'
    import util from '../../../libs/util';
    export default {
        components: {Numberbox},
        props:['item'],
        data () {
            var vm = window.vm;
            return {
                vm: vm,
                quantityRange1: null,
                quantityRange2: null,
                marketList: [],
                form: {
                    amplitudeRate: null,
                    changeAmount: null,
                    changeRate: null,
                    quantityRange: null,
                    interval: null,
                    startAt: null,
                    endAt: null,
                    market: null,
                    status: 1,
                },
                ruleInline: {
                    amplitudeRate: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('exchange.zfbfb')}
                    ],
                    changeAmount: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('exchange.zfje')}
                    ],
                    changeRate: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('exchange.zhangfbfb')}
                    ],
                    quantityRange: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('exchange.slfw')}
                    ],
                    interval: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('exchange.wtpl')}
                    ],
                    startAt: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('common.kssj')}
                    ],
                    endAt: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('common.jssj')}
                    ],
                    market: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('operation.scmc')}
                    ],
                    status: [
                        {required: true, message: vm.$t('common.qsr')+vm.$t('common.zt')}
                    ],
                }
            };
        },
        computed:{

        },
        watch:{
            quantityRange1(){
                console.log(this.quantityRange1+'-'+this.quantityRange2)
                this.form.quantityRange = this.quantityRange1+'-'+this.quantityRange2
            },
            quantityRange2(){
                console.log(this.quantityRange1+'-'+this.quantityRange2)
                this.form.quantityRange = this.quantityRange1+'-'+this.quantityRange2
            }
        },
        created(){
            this.getAllMarket();
            if(this.item){
                this.form = JSON.parse(JSON.stringify(this.item))
                this.quantityRange1 = this.item.quantityRange.split('-')[0]
                this.quantityRange2 = this.item.quantityRange.split('-')[1]
            }
        },
        methods: {
            getAllMarket () {
                currenyApi.findAllMarketList((res) => {
                    this.marketList = res;
                });
            },
            add () {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        let d = JSON.stringify(this.form)
                        let data = JSON.parse(d)
                        data.startAt = util.dateToStr(new Date(data.startAt))
                        data.endAt = util.dateToStr(new Date(data.endAt))
                        console.log(data)
                        if(this.item){
                            currenyApi.updateSectionPrice(data, (res) => {
                                this.$Message.success({content: this.vm.$t('common.xgcg')});
                                this.$emit('okCallback');
                                this.$emit('removeDialog');
                            }, (msg) => {
                                this.$Message.error({content: msg});
                            });
                        }else{
                            currenyApi.addSectionPrice(data, (res) => {
                                this.$Message.success({content: this.vm.$t('common.tjcg')});
                                this.$emit('okCallback');
                                this.$emit('removeDialog');
                            }, (msg) => {
                                this.$Message.error({content: msg});
                            });
                        }

                    }
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            }
        }
    }
</script>

<style scoped lang="less">
    input{
        width: 300px;
        border:1px solid #dddee1;
    }
    .cont{
        span{
            padding: 0 6px;
        }
    }
</style>
