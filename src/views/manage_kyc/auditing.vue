<!-- KYC审核 -->
<template>
    <Row>
        <Card>
            <p slot="title">KYC{{$t('common.sh')}}
                <span class="refresh" @click="getList"></span>
            </p>
            <Row>
                <Col span="24">
                    <Select v-model="formData.type" style="width:200px;">
                        <Option value="account">{{$t('common.zh')}}</Option>
                        <Option value="verifyName">{{$t('common.xm')}}</Option>
                        <Option value="verifyIdCard">{{$t('common.zjh')}}</Option>
                        <Option value="cn">{{$t('common.dq')}}</Option>
                    </Select>
                    <Input v-model="formData.text" clearable style="width: 200px"></Input>
                    <Button type="primary" @click="getList(true)">{{$t('common.cx')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top:10px;">
                <Col span="8">{{$t('kyc.dshyhsl')}}：{{data2.verifyWaitFirstCheck || 0}}{{$t('kyc.g')}}</Col>
                <Col span="8">{{$t('kyc.dfhyhsl')}}：{{data2.verifyWaitSecondCheck || 0}}{{$t('kyc.g')}}</Col>
                <Col span="8">{{$t('kyc.ytgyhsl')}}：{{data2.verifyPass || 0}}{{$t('kyc.g')}}</Col>
            </Row>
            <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
            <Page :current="curPage" :page-size="pageSize" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    import util from '../../libs/util';
    import check from './auditing_check';
    import detail from './auditing_detail';
    import kycAPI from '../../api/kyc';
    import messageModel from './messageModel';

    export default {
        data () {
            return {
                curPage: 1,
                pageSize: 10,
                total: 0,
                formData: {
                    type: 'account',
                    text: ''
                },
                columns1: [
                    {title: this.$t('monitoring.sqsj'), key: 'createdTime'},
                    {title: this.$t('common.zh'), key: 'account'},
                    {title: this.$t('common.dq'), key: 'cn'},
                    {title: this.$t('common.xm'), key: 'verifyName'},
                    {
                        title: this.$t('common.xb'), key: 'verifySex',
                        render: (h, params) => {
                            return h('div', params.row.verifySex === 1 ? this.$t('common.n') : this.$t('common.nv'));
                        }
                    },
                    {
                        title: this.$t('common.zjlx'), key: 'verifyClass',
                        render: (h, params) => { // 1:身份证 2：驾照  3：护照
                            return h('div', this.switchStaus(params.row.verifyClass));
                        }
                    },
                    {title: this.$t('common.zjh'), key: 'verifyIdCard'},
                    {
                        title: this.$t('common.cz'), key: 'action', render: (h, params) => {
                            return h('div', [
                                // h('Button', {
                                //     props: {type: 'primary', size: 'small'},
                                //     style: {marginRight: '10px'},
                                //     on: {
                                //         click: () => {
                                //           this.getcationCheck(params.row.verifyId)
                                //         }
                                //     }
                                // }, '重复检查'),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {

                                            util.setDialog(detail, {
                                                verifyId: params.row.verifyId,
                                                params: params,
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('kyc.ckxqbcl')),
                                h('i', {
                                    class: 'ivu-icon ivu-icon-volume-medium',
                                    style: {
                                        verticalAlign: 'middle',
                                        cursor: 'pointer',
                                        fontSize: '30px',
                                        marginLeft: '10px',
                                        cursor: this.readOnly ? 'not-allowed' : 'pointer',
                                        color: this.readOnly ? '#CCC' : null
                                    },
                                    on: {
                                        click: () => {
                                            // kycAPI.firstSendSystemMessage((res) => {
                                            //   this.$Message.success({content: '发送成功'})
                                            // }, (msg) => {
                                            //   this.$Message.error({content: msg})
                                            // })
                                            // if (this.readOnly) {
                                            //     return
                                            // }
                                            util.setDialog(messageModel, {
                                                userId: params.row.verifyUserID,
                                                username: params.row.account,
                                                type: 1
                                            });
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                data1: [],
                statisticData: [],
                data2: []
            };
        },
        created () {
            this.getList();
            this.getStatusCount();
        },
        computed: {
            image () {
                return '../../src/images/frsh.png';
            }
        },
        methods: {
            switchStaus (state) {// 0：驾照，1：护照，2：国民身份证）
                switch (state) {
                    case 2:
                        return this.$t('common.sfz');
                        break;
                    case 0:
                        return this.$t('common.jz');
                        break;
                    case 1:
                        return this.$t('common.hz');
                        break;
                }
            },
            getcationCheck (verifyId) {
                kycAPI.duplicationCheck({
                    verifyId: verifyId
                }, (res) => {
                    util.setDialog(check, {
                        verifyId: verifyId,
                        status: res,
                        okCallback: () => {
                            this.getList();
                        }
                    });
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            getStatusCount () {
                kycAPI.showReviewStatusCount((res) => {
                    this.data2 = res.data;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            getList (key) {
                if (key) {
                    this.curPage = 1;
                }
                let data = {};
                if (this.formData.text) {
                    data[this.formData.type] = this.formData.text;
                }
                kycAPI.listPageUserVerifys(this.pageSize, this.curPage, data, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            statistic () {
                kycAPI.kycStatistic((res) => {
                    this.statisticData = res;
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getList();
            }
        }
    };
</script>

<style lang="less" scoped>
    .ivu-card-head-inner, .ivu-card-head p {
        display: flex !important;
        justify-content: space-between !important;
        height: 40px !important;
        line-height: 40px !important;
    }

    .refresh {
        width: 49px;
        height: 24px;
        background: url(../../images/frsh.png) center/cover no-repeat;
        background-size: contain;
        cursor: pointer;
        color: #2d8cf0;
    }
</style>
