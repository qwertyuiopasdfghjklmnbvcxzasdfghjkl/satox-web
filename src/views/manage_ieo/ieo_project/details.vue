<template>
    <Card class="box" style="width: 1000px;">
        <p slot="title">
            {{vm.$t('ieo.xmxq')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Form :label="140" class="cont">
            <div class="law">
                <FormItem :label="vm.$t('ieo.xmmc')+'：'">
                    <span>{{item.projectName}}</span>
                </FormItem>
                <FormItem :label="vm.$t('common.kssj')+'：'">
                    <span>{{item.startTime}}</span>
                </FormItem>

                <FormItem>
                    <label class="green_title">{{vm.$t('common.bzdh')}}：</label>
                    <span>{{item.projectSymbol}}</span>
                </FormItem>
                <FormItem :label="vm.$t('ieo.jzsj')+'：'">
                    <span>{{item.endTime}}</span>
                </FormItem>

                <FormItem :label="vm.$t('ieo.bzlogo')+'：'">
                    <span><img :src="util.baseURL+item.projectLogo" height="50"></span>
                </FormItem>
                <FormItem :label="vm.$t('ieo.kksj')+'：'">
                    <span>{{item.paidTime}}</span>
                </FormItem>

                <FormItem :label="vm.$t('ieo.xmjj')+'：'">
                    <span>{{item.projectProfile}}</span>
                </FormItem>
                <FormItem :label="vm.$t('ieo.fbsj')+'：'">
                    <span>{{item.releaseTime}}</span>
                </FormItem>
            </div>


            <FormItem :label="vm.$t('ieo.fxsl')+'：'">
                <span>{{item.totalIssue}}</span>
                <Tag type="border" color="green">{{vm.$t('common.bzdh')}}</Tag>
            </FormItem>
            <FormItem>
                <label class="red_title">{{vm.$t('ieo.xsd')}}<span>{{vm.$t('ieo.jjbz')}}：</span></label>
                <span>{{item.priceSymbol}}</span>
            </FormItem>
            <FormItem :label="vm.$t('ieo.fxjghbz')+'：'">
                1
                <Tag type="border" color="red">{{vm.$t('ieo.jjbz')}}</Tag>
                =
                <span>{{item.issuePrice}}</span>
                <Tag type="border" color="green">{{vm.$t('common.bzdh')}}</Tag>
            </FormItem>
            <FormItem :label="vm.$t('ieo.mjmbhzb')+'：'">
                <span>{{item.totalRaised}}</span>
                <Tag type="border" color="red">{{vm.$t('ieo.jjbz')}}</Tag>
            </FormItem>
            <FormItem :label="vm.$t('ieo.zfs')+'：'">
                <span>{{item.totalSubscription}}</span>
            </FormItem>
            <FormItem :label="vm.$t('ieo.mfjghbz')+'：'">
                <span>{{item.subscriptionPrice}}</span>
                <Tag type="border" color="red">{{vm.$t('ieo.jjbz')}}</Tag>
            </FormItem>
            <FormItem :label="vm.$t('ieo.mfdbsl')+'：'">
                <span>{{item.oneSymbolCount}}</span>
                <Tag type="border" color="red">{{vm.$t('common.bzdh')}}</Tag>
            </FormItem>
            <div>
                <span>{{vm.$t('ieo.dfbz')+'：'}}</span>
                <Table :columns="columns" :data="JSON.parse(item.paymentConfig)"></Table>
            </div>
            <div class="rebox">
                <p>{{vm.$t('ieo.rgxz')+'：'}}</p>
                <div class="m90">
                    <Checkbox v-model="needKyc" disabled>{{vm.$t('ieo.yhsfxykyc')}}</Checkbox>
                    <div>
                        <RadioGroup v-model="item.subscriptionLimit">
                            <Radio :label="0" disabled>{{vm.$t('ieo.yhsfznsgyc')}}</Radio>
                            <Radio :label="1" disabled>{{vm.$t('ieo.yhsfznmgbzsgyc')}}</Radio>
                        </RadioGroup>
                    </div>
                </div>

                <FormItem :label="vm.$t('ieo.grrgfszsx')+'：'">
                    <span>{{item.subscriptionQuantityLimit}}</span>
                </FormItem>
                <FormItem :label="vm.$t('ieo.grmcrgfsxx')+'：'">
                    <span>{{item.subscriptionLeast}}</span>
                </FormItem>
            </div>
            <p><br><br></p>
            <FormItem :label="vm.$t('ieo.xmffbsbzh')+'：'" prop="productNameEn">
                <span>{{item.projectAccount}}</span>
            </FormItem>

            <FormItem :label="vm.$t('ieo.rgxuzhi')+'：'" prop="productDescription">
                <div class="detail" v-html="item.subscriptionNotice"></div>
            </FormItem>
            <FormItem :label="vm.$t('ieo.xmgz')+'：'" prop="productDescriptionEn">
                <div class="detail" v-html="item.participationRules"></div>
            </FormItem>
            <FormItem :label="vm.$t('ieo.xmxq')+'：'" prop="productDescriptionEn">
                <div v-html="item.projectDetail" class="detail"></div>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
    import Numberbox from '../../components/dialog/numberbox';
    import wangeditor from '../components/wangeditor';
    import util from '../../../libs/util';

    export default {
        name: 'project',
        components: {Numberbox, wangeditor},
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                needKyc: null,
                util: util,
                columns: [
                    {key: 'symbolType', title: vm.$t('operation.bh')},
                    {key: 'symbol', title: vm.$t('common.bz')},
                    {key: 'symbolCount', title: vm.$t('ieo.mfsl')},
                ],
            };
        },
        created () {
            this.needKyc = this.item.needKyc === 1
        },
        methods: {
            // catchData (value) {
            //     this.content = value;      //在这里接受子组件传过来的参数，赋值给data里的参数
            // }
            closeDialog () {
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style scoped lang="less">
    @import "../components/project";

    .cont {
        padding: 15px 30px;
    }

    .rebox {
        margin-top: 15px;

        .m90 {
            margin: 10px 0;
        }
    }

    .box {
        .green_title, .red_title {
            margin-left: 0;
        }
    }
    .detail{
        width: 750px;
        display: inline-block;
        border: 1px solid #e2e5e6;
        padding: 20px;
    }
</style>
