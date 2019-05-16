<!-- KYC审核 -> 查看详情并处理 -->
<template>
    <Card style="width:1000px;height:550px;">
        <p slot="title">
            {{vm.$t('common.xxxx')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;font-size:23px;"
               @click="closeDialog"></i>
        </p>
        <Table :columns="columns1" :data="data1" style="margin-bottom:20px;"></Table>
        <Row type="flex" justify="space-between" style="margin-bottom:20px;">
            <Col span="8" class="auditing_detail_img">
                <img v-if="data1.length && data1[0].verifyBackImg" v-image-preview
                     :src="data1.length && data1[0].verifyBackImg" width="300px" height="300px"/>
            </Col>
            <Col span="8" class="auditing_detail_img">
                <img v-if="data1.length && data1[0].verifyFrontImg" v-image-preview
                     :src="data1.length && data1[0].verifyFrontImg" width="300px" height="300px"/>
            </Col>
            <Col span="8" class="auditing_detail_img">
                <img v-if="data1.length && data1[0].verifyHandImg" v-image-preview
                     :src="data1.length && data1[0].verifyHandImg" width="300px" height="300px"/>
            </Col>
        </Row>
        <Row type="flex" justify="center" v-if="this.type !== 'manage'">
            <Button type="ghost" style="margin-right: 8px" @click="disagree">{{vm.$t('common.btg')}}</Button>
            <Button type="primary" @click="pass()" :disabled="state">{{vm.$t('common.tg')}}</Button>
        </Row>
    </Card>
</template>

<script>
    import kycApi from '../../api/kyc';
    import util from '../../libs/util';
    import check from './auditing_check';
    import reason from './reason';

    export default {
        props: ['verifyId', 'type', 'params'],
        data () {
            var vm = window.vm;
            return {
                vm: vm,
                state: false,
                aaa: null,
                columns1: [
                    {title: vm.$t('monitoring.sqsj'), key: 'createdTime'},
                    {title: vm.$t('common.zh'), key: 'account'},
                    {title: vm.$t('common.dq'), key: 'cn'},
                    {title: vm.$t('common.xm'), key: 'verifyName'},
                    {
                        title: vm.$t('common.xb'), key: 'verifySex',
                        render: (h, params) => {
                            return h('div', params.row.verifySex == 1 ? vm.$t('common.n') : vm.$t('common.nv'));
                        }
                    },
                    {
                        title: vm.$t('common.zjlx'), key: 'verifyClass',
                        render: (h, params) => { // 1:身份证 2：驾照  3：护照
                            return h('div', this.switchStaus(params.row.verifyClass));
                        }
                    },
                    {title: vm.$t('common.zjh'), key: 'verifyIdCard'}
                ],
                data1: [],
                code: ''
            };
        },
        created () {
            setTimeout(() => {
                this.aaa = 'https://www.baidu.com/img/bd_logo1.png';
            }, 2000);
            if (this.verifyId) {
                if (this.type === 'manage') {
                    this.getDetail1();
                    return;
                }
                this.getDetail();
            }

        },
        methods: {
            disagree () {
                util.setDialog(reason, {
                    verifyId: this.verifyId,
                    type: this.type,
                    okCallback: () => {
                        this.$emit('okCallback');
                        this.$emit('removeDialog');
                    }
                });
            },
            pass () {
                if (this.type) {
                    this.passfirstReview('true');
                    return;
                }
                this.getcationCheck(this.params.row.verifyId);
            },
            getcationCheck (verifyId) {
                kycApi.duplicationCheck({
                    verifyId: verifyId
                }, (res) => {
                    util.setDialog(check, {
                        verifyId: verifyId,
                        status: res,
                        okCallback: () => {
                            this.$emit('okCallback');
                            this.$emit('removeDialog');
                        }
                    });
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            switchStaus (state) {// 0：驾照，1：护照，2：国民身份证）
                switch (state) {
                    case 2:
                        return this.vm.$t('common.sfz');
                        break;
                    case 0:
                        return this.vm.$t('common.jz');
                        break;
                    case 1:
                        return this.vm.$t('common.hz');
                        break;
                }
            },
            getDetail1 () {
                kycApi.showKycDetails({
                    verifyId: this.verifyId
                }, (res) => {
                    this.data1 = [res];
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            getDetail () {
                kycApi[this.type !== 'fuhe' ? 'showFirstReview' : 'showSecondReview']({
                    verifyId: this.verifyId
                }, (res) => {
                    this.data1 = [res];
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            },
            passfirstReview (code) {
                this.state = true;
                kycApi[this.type !== 'fuhe' ? 'firstReview' : 'secondReview'](code, {
                    verifyId: this.verifyId
                }, (res) => {
                    if (code === 'true') {
                        this.$Message.success({content: this.vm.$t('common.shtg')});
                    } else {
                        this.$Message.error({content: this.vm.$t('common.shbtg')});
                    }
                    this.$emit('okCallback');
                    this.$emit('removeDialog');
                }, (msg) => {
                    this.$Message.error({content: msg});
                    this.$emit('removeDialog');
                });
            }
        }
    };
</script>

<style lang="less">
    .auditing_detail_img {
        width: 300px !important;
        height: 300px !important;
        background: gray;
    }
</style>
