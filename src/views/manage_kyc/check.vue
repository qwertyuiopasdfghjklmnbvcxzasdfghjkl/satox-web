<!-- KYC复核 -->
<template>
    <Row>
        <Card>
            <p slot="title">KYC{{$t('kyc.fh')}}
                <span class="refresh" @click="getCheckVerifys"></span>
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
                    <Button type="primary" @click="getCheckVerifys(true)">{{$t('common.cx')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    import util from '../../libs/util';
    import detail from './auditing_detail';
    import kycAPI from '../../api/kyc';
    import messageModel from './messageModel';

    export default {
        props: ['userId'],
        data () {
            return {
                curPage: 1,
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
                        render: (h, params) => {
                            return h('div', this.switchVerify(params.row.verifyClass));
                        }
                    },
                    {title: this.$t('common.zjh'), key: 'verifyIdCard'},
                    {title: this.$t('kyc.shgly'), key: 'firstMgrName'},
                    {
                        title: this.$t('common.cz'), key: 'action', render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {
                                            util.setDialog(detail, {
                                                verifyId: params.row.verifyId,
                                                type: 'fuhe',
                                                okCallback: () => {
                                                    this.getCheckVerifys();
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
                                            util.setDialog(messageModel, {
                                                userId: params.row.verifyUserID,
                                                username: params.row.account,
                                                type: 2
                                            });
                                        }
                                    }
                                })
                            ]);
                        }
                    }
                ],
                data1: []
            };
        },
        created () {
            this.getCheckVerifys();
        },
        methods: {
            switchVerify (state) {// 0：驾照，1：护照，2：国民身份证）
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
            getCheckVerifys (key) {
                if (key) {
                    this.curPage = 1;
                }
                let data = {userId: this.userId};
                if (this.formData.text) {
                    data[this.formData.type] = this.formData.text;
                }
                kycAPI.listPageReCheckVerifys(this.curPage, data, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                }, (msg) => {
                    this.$Messages.error({content: msg});
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getCheckVerifys();
            }
        }
    };
</script>

<style lang="less" scoped>
    .refresh {
        width: 49px;
        height: 24px;
        background: url(../../images/frsh.png) center/cover no-repeat;
        background-size: contain;
        cursor: pointer;
        color: #2d8cf0;
    }

    .ivu-card-head-inner, .ivu-card-head p {
        display: flex !important;
        justify-content: space-between !important;
        height: 40px !important;
        line-height: 40px !important;
    }
</style>
