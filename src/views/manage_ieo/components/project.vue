<template>
    <div class="box">
        <Form ref="form" :model="form" :rules="ruleInline" :label-width="142" style="margin:0 20px;">
            <div class="law">
                <FormItem :label="vm.$t('ieo.xmmc')" prop="projectName">
                    <Input v-model="form.projectName" :maxlength="32" class="w1"></Input>
                </FormItem>
                <FormItem :label="vm.$t('common.kssj')" prop="startTime">
                    <DatePicker type="datetime"
                                class="w1"
                                v-model="form.startTime"
                                :placeholder="vm.$t('common.kssj')"
                                format="yyyy-MM-dd HH:mm:ss"></DatePicker>
                </FormItem>

                <FormItem prop="projectSymbol" :label="vm.$t('common.bzdh')">
                    <label class="green_title">{{vm.$t('common.bzdh')}}</label>
                    <Input v-model="form.projectSymbol" :maxlength="32" class="w1"></Input>
                </FormItem>
                <FormItem :label="vm.$t('ieo.jzsj')" prop="endTime">
                    <DatePicker type="datetime"
                                class="w1"
                                v-model="form.endTime"
                                :placeholder="vm.$t('ieo.jzsj')"
                                format="yyyy-MM-dd HH:mm:ss"></DatePicker>
                </FormItem>

                <FormItem :label="vm.$t('ieo.bzlogo')" prop="logoFile">
                    <span v-if="cont"><img :src="utils.baseURL+cont.projectLogo" width="40" height="40"></span>
                    <input type="file" ref="logoFiles" name="logoFile" class="w1" @change="getImg()">
                </FormItem>
                <FormItem :label="vm.$t('ieo.kksj')" prop="paidTime">
                    <DatePicker type="datetime"
                                class="w1"
                                v-model="form.paidTime"
                                :placeholder="vm.$t('ieo.kksj')"
                                format="yyyy-MM-dd HH:mm:ss"></DatePicker>
                </FormItem>

                <FormItem :label="vm.$t('ieo.xmjj')" prop="projectProfile">
                    <Input v-model="form.projectProfile" class="w1" type="textarea" :maxlength="255"></Input>
                </FormItem>
                <FormItem :label="vm.$t('ieo.fbsj')" prop="releaseTime">
                    <DatePicker type="datetime"
                                class="w1"
                                v-model="form.releaseTime"
                                :placeholder="vm.$t('ieo.fbsj')"
                                format="yyyy-MM-dd HH:mm:ss"></DatePicker>
                </FormItem>
            </div>


            <FormItem :label="vm.$t('ieo.fxsl')" prop="totalIssue">
                <numberbox class="number_input w1" v-model="form.totalIssue"></numberbox>
                <Tag type="border" color="green">{{vm.$t('common.bzdh')}}</Tag>
            </FormItem>
            <FormItem prop="priceSymbol">
                <label class="red_title"><i
                        class="red">* </i>{{vm.$t('ieo.xsd')}}<span>{{vm.$t('ieo.jjbz')}}</span></label>
                <Select v-model="form.priceSymbol" class="w1">
                    <Option v-for="item in symbolList"
                            :value="item.symbol"
                            :key="item.symbol">
                        {{ item.symbol }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem :label="vm.$t('ieo.fxjghbz')" prop="issuePrice">
                <b style="font-size: 20px">1</b>
                <Tag type="border" color="red">{{vm.$t('ieo.jjbz')}}</Tag>
                <b>=</b>
                <numberbox class="number_input w2" v-model="form.issuePrice"></numberbox>
                <Tag type="border" color="green">{{vm.$t('common.bzdh')}}</Tag>
            </FormItem>
            <FormItem :label="vm.$t('ieo.mjmbhzb')" prop="totalRaised">
                <numberbox class="number_input w1" v-model="form.totalRaised"></numberbox>
                <Tag type="border" color="red">{{vm.$t('ieo.jjbz')}}</Tag>
            </FormItem>
            <FormItem :label="vm.$t('ieo.zfs')" prop="totalSubscription">
                <numberbox class="number_input w1" :accuracy="0" v-model="form.totalSubscription"></numberbox>
            </FormItem>
            <FormItem :label="vm.$t('ieo.mfjghbz')" prop="subscriptionPrice">
                <numberbox class="number_input w1" v-model="form.subscriptionPrice"></numberbox>
                <Tag type="border" color="red">{{vm.$t('ieo.jjbz')}}</Tag>
            </FormItem>
            <FormItem :label="vm.$t('ieo.mfdbsl')" prop="oneSymbolCount">
                <numberbox class="number_input w1" v-model="form.oneSymbolCount"></numberbox>
                <Tag type="border" color="red">{{vm.$t('common.bzdh')}}</Tag>
            </FormItem>
            <FormItem :label="vm.$t('ieo.dfbz')" class="tab" prop="paymentConfig">
                <Table :columns="columns" :data="form.paymentConfig"></Table>
                <Button class="btn1" icon="plus-round" @click="add()">{{vm.$t('common.tj')}}</Button>
            </FormItem>
            <div>
                <p class="title1"><span class="red">*</span>{{vm.$t('ieo.rgxz')}}：</p>
                <div class="">
                    <FormItem prop="needKyc">
                        <Checkbox v-model="needKyc">{{vm.$t('ieo.yhsfxykyc')}}</Checkbox>
                    </FormItem>
                    <div>
                        <FormItem prop="subscriptionLimit">
                            <RadioGroup v-model="form.subscriptionLimit">
                                <Radio :label="0">{{vm.$t('ieo.yhsfznsgyc')}}</Radio>
                                <Radio :label="1">{{vm.$t('ieo.yhsfznmgbzsgyc')}}</Radio>
                            </RadioGroup>
                        </FormItem>
                    </div>
                </div>

                <FormItem :label="vm.$t('ieo.grrgfszsx')" prop="subscriptionQuantityLimit">
                    <numberbox class="number_input w1" :accuracy="0"
                               v-model="form.subscriptionQuantityLimit"></numberbox>
                </FormItem>
                <FormItem :label="vm.$t('ieo.grmcrgfsxx')" prop="subscriptionLeast">
                    <numberbox class="number_input w1" :accuracy="0" v-model="form.subscriptionLeast"></numberbox>
                </FormItem>
            </div>
            <p><br><br></p>
            <FormItem :label="vm.$t('ieo.xmffbsbzh')" prop="projectAccount">
                <Input v-model="form.projectAccount" :maxlength="120"></Input>
            </FormItem>

            <FormItem :label="vm.$t('ieo.rgxuzhi')" prop="subscriptionNotice">
                <Input v-model="form.subscriptionNotice" type="textarea" :maxlength="500" :rows="8"></Input>
            </FormItem>
            <FormItem :label="vm.$t('ieo.xmgz')" prop="participationRules">
                <Input v-model="form.participationRules" type="textarea" :maxlength="500" :rows="8"></Input>
            </FormItem>
            <FormItem :label="vm.$t('ieo.xmxq')" prop="projectDetail">
                <div id="father">
                    <wangeditor :catchData="catchData" :content="form.projectDetail"></wangeditor>
                </div>
            </FormItem>

            <FormItem>
                <Button type="primary" v-if="cont" class="btn" size="large" @click="updata()">
                    {{vm.$t('common.xg')}}
                </Button>
                <Button type="primary" v-else class="btn" size="large" @click=" submit()">
                    {{vm.$t('finance.chuangj')}}
                </Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import Numberbox from '../../components/dialog/numberbox';
    import wangeditor from './wangeditor';
    import currenyApi from '../../../api/currency';
    import ieoApi from '../../../api/ieo';
    import util from '../../../libs/util';
    import add from './addSymbol';

    export default {
        name: 'project',
        props: ['cont'],
        components: {Numberbox, wangeditor},
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                symbolList: [],
                needKyc: false,
                utils: util,
                form: {
                    projectName: null,
                    startTime: null,
                    projectSymbol: null,
                    endTime: null,
                    logoFile: null,
                    paidTime: null,
                    projectProfile: null,
                    releaseTime: null,
                    totalIssue: null,
                    priceSymbol: null,
                    issuePrice: null,
                    totalRaised: null,
                    totalSubscription: null,
                    subscriptionPrice: null,
                    oneSymbolCount: null,
                    paymentConfig: [],
                    needKyc: 0,
                    subscriptionLimit: null,
                    subscriptionQuantityLimit: null,
                    subscriptionLeast: null,
                    projectAccount: null,
                    subscriptionNotice: null,
                    participationRules: null,
                    projectDetail: null,
                },
                ruleInline: {
                    projectName: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.xmmc'), trigger: 'blur'}
                    ],
                    startTime: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.kssj')}
                    ],
                    projectSymbol: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('common.bzdh'), trigger: 'blur'}
                    ],
                    endTime: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.jzsj')}
                    ],
                    logoFile: [
                        {required: !this.cont, message: vm.$t('common.qsr') + vm.$t('ieo.bzlogo')}
                    ],
                    paidTime: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.kksj')}
                    ],
                    projectProfile: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.xmjj'), trigger: 'blur'}
                    ],
                    releaseTime: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.fbsj')}
                    ],
                    totalIssue: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.fxsl')}
                    ],
                    priceSymbol: [
                        {
                            required: true,
                            message: vm.$t('common.qsr') + vm.$t('ieo.xsd') + vm.$t('ieo.jjbz'),
                            trigger: 'blur'
                        }
                    ],
                    issuePrice: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.fxjghbz')}
                    ],
                    totalRaised: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.mjmbhzb')}
                    ],
                    totalSubscription: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.zfs')}
                    ],
                    subscriptionPrice: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.mfjghbz')}
                    ],
                    oneSymbolCount: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.mfdbsl')}
                    ],
                    paymentConfig: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.dfbz')}
                    ],
                    needKyc: [
                        {required: false}
                    ],
                    subscriptionLimit: [
                        {required: true, message: vm.$t('common.qxz')}
                    ],
                    subscriptionQuantityLimit: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.grrgfszsx')}
                    ],
                    subscriptionLeast: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.grmcrgfsxx')}
                    ],
                    projectAccount: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.xmffbsbzh'), trigger: 'blur'}
                    ],
                    subscriptionNotice: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.rgxuzhi'), trigger: 'blur'}
                    ],
                    participationRules: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.xmgz'), trigger: 'blur'}
                    ],
                    projectDetail: [
                        {required: true, message: vm.$t('common.qsr') + vm.$t('ieo.xmxq'), trigger: 'blur'}
                    ],
                },
                columns: [
                    {key: 'symbolType', title: vm.$t('operation.bh')},
                    {key: 'symbol', title: vm.$t('common.bz')},
                    {key: 'symbolCount', title: vm.$t('ieo.mfsl')},
                    {
                        key: 'orderId4', title: vm.$t('common.cz'), render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(add, {
                                                symbolList: this.symbolList,
                                                item: params.row,
                                                okCallback: (res) => {
                                                    this.form.paymentConfig[params.index] = res;
                                                }
                                            });
                                        }
                                    }
                                }, vm.$t('ieo.bj')),
                                h('Button', {
                                    props: {type: 'warning', size: 'small'},
                                    on: {
                                        click: () => {
                                            this.form.paymentConfig.splice(params.index, 1);
                                        }
                                    }
                                }, vm.$t('common.sc'))
                            ]);
                        }
                    },
                ],
                datas: [{orderId: 123, orderId2: 'eft'}],
            };
        },
        watch: {
            needKyc () {
                if (this.needKyc) {
                    this.form.needKyc = 1;
                } else {
                    this.form.needKyc = 0;
                }
            }
        },
        created () {
            this.getdataSymbol();
            if (this.cont) {
                this.form = this.cont;
                this.form.paymentConfig = JSON.parse(this.form.paymentConfig);
                this.needKyc = this.form.needKyc === 1;
                console.log(this.form);
            }
        },
        methods: {
            getdataSymbol () {
                currenyApi.findAllValidSymbolList((res) => {
                    this.symbolList = res;
                });
            },
            submit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.form.projectDetail = this.form.projectDetail.toString();
                        this.form.paymentConfig =
                            typeof this.form.paymentConfig ===
                            'string' ? this.form.paymentConfig :
                                JSON.stringify(this.form.paymentConfig);
                        let formData = new FormData();
                        let i;
                        console.log(this.form);
                        for (i in this.form) {
                            formData.append(i, this.form[i]);
                        }
                        ieoApi.addProject(formData, (res) => {
                            this.$Message.success({content: this.vm.$t('common.tjcg')});
                            this.$router.push({name: 'ieo_project_index'});
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });
                    }
                });
            },
            updata () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        delete this.form.state;
                        delete this.form.updatedAt;
                        delete this.form.createdAt;
                        delete this.form.projectLogo;
                        this.form.projectDetail = this.form.projectDetail.toString();
                        this.form.paymentConfig = JSON.stringify(this.form.paymentConfig);
                        let formData = new FormData();
                        let i;
                        for (i in this.form) {
                            formData.append(i, this.form[i]);
                        }
                        ieoApi.updataProject(formData, (res) => {
                            this.$Message.success({content: this.vm.$t('common.xgcg')});
                            this.$emit('updata');
                        }, (msg) => {
                            this.$Message.error({content: msg});
                        });
                    }
                });
            },
            catchData (value) {
                this.form.projectDetail = value;      //在这里接受子组件传过来的参数，赋值给data里的参数
            },
            add () {
                util.setDialog(add, {
                    symbolList: this.symbolList,
                    okCallback: (res) => {
                        this.form.paymentConfig.push(res);
                    }
                });
            },
            getImg () {
                this.form.logoFile = this.$refs.logoFiles.files[0];
                console.log(this.$refs.logoFiles.files[0], this.form);
            },
            getPdf () {
                console.log(this.$refs.pdf.files[0]);
            }
        }
    };
</script>

<style scoped lang="less">
    @import "project";
</style>
