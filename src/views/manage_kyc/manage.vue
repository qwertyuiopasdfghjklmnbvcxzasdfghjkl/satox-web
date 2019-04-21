<!-- KYC管理 -->
<template>
    <Row>
        <Card>
            <p slot="title">
                KYC{{$t('kyc.gl')}}
                <span class="refresh" @click="getList"></span>
            </p>
            <Row>
                <Col span="16">
                    <Select v-model="formData.type" style="width:200px;">
                        <Option value="account">{{$t('common.zh')}}</Option>
                        <Option value="verifyName">{{$t('common.xm')}}</Option>
                        <Option value="verifyIdCard">{{$t('common.zjh')}}</Option>
                        <Option value="cn">{{$t('common.dq')}}</Option>
                    </Select>
                    <Input v-model="formData.text" clearable style="width: 200px"></Input>
                    <Button type="primary" @click="getList(true)">{{$t('common.cx')}}</Button>
                </Col>
                <Col span="8">
                    <Button type="primary" style="float:right;" @click="addDialog">{{$t('common.tj')}}</Button>
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
    import add from './add';
    import kyc from '../../api/kyc';
    import messageModel from './messageModel';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                formData: {
                    type: 'account',
                    text: ''
                },
                columns1: [
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
                    {
                        title: this.$t('common.zt'), key: 'verifyStatus',  //0：未验证、1：待审核、2：已通过、3：未通过、4 : 待复核
                        render: (h, params) => { // 0：未验证  蓝色、1：待审核 蓝色、2：已通过 绿色、3：未通过 红色、4 : 待复核 紫色
                            let status = Number(params.row.verifyStatus);
                            let color = '';
                            switch (status) {
                                case 0:
                                    color = 'blue';
                                    break;
                                case 1:
                                    color = 'blue';
                                    break;
                                case 2:
                                    color = 'green';
                                    break;
                                case 3:
                                    color = 'red';
                                    break;
                                case 4:
                                    color = '#eb00ff';
                                    break;
                            }
                            return h('div', [
                                h('div', {
                                    style: {color: color}
                                }, this.switchStaus(params.row.verifyStatus)),
                            ]);

                        }
                    },
                    {title: this.$t('kyc.tgsj'), key: 'verifyUpdateTime'},
                    {title: this.$t('kyc.shgly'), key: 'firstMgrName'},
                    {title: this.$t('kyc.fhgly'), key: 'secondMgrName'},
                    {
                        title: this.$t('common.cz'), key: 'action', render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(detail, {
                                                verifyId: params.row.verifyId,
                                                type: 'manage'
                                            });
                                        }
                                    }
                                }, this.$t('kyc.ckxq')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                content: '<p style="font-size:20px;margin-top:-6px;">'
                                                    + this.$t('kyc.qrsc') + '？</p>',
                                                style: {fontSize: '20px'},
                                                onOk: () => {
                                                    kyc.deleteVerify({
                                                        verifyId: params.row.verifyId,
                                                        verifyStatus: params.row.verifyStatus
                                                    }, (msg) => {
                                                        this.$Message.success({content: this.$t('kyc.sccg')});
                                                        this.getList();
                                                    }, (msg) => {
                                                        this.$Message.error({content: msg});
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }, this.$t('kyc.sc')),
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
                                                type: 3
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
            this.getList();
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
            switchStaus (state) {//0：未验证、1：待审核、2：已通过、3：未通过、4 : 待复核
                switch (state) {
                    case 0:
                        return this.$t('common.wyz');
                        break;
                    case 1:
                        return this.$t('common.dsh');
                        break;
                    case 2:
                        return this.$t('common.ytg');
                        break;
                    case 3:
                        return this.$t('common.wtg');
                        break;
                    case 4:
                        return this.$t('common.dfh');
                        break;
                }
            },
            getList (key) {
                if (key) {
                    this.curPage = 1;
                }
                let data = {};
                if (this.formData.text) {
                    data[this.formData.type] = this.formData.text;
                }
                kyc.selectPageKycVerifys(this.curPage, data, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            addDialog () {
                util.setDialog(add, {
                    okCallback: () => {
                        this.getList();
                    }
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getList();
            }
        }
    };
</script>

<style lang="less">
    .refresh {
        width: 49px;
        height: 24px;
        background: url(../../images/frsh.png) center/cover no-repeat;
        background-size: contain;
        cursor: pointer;
        color: #2d8cf0;
    }

    .ivu-modal-confirm-body {
        font-size: 20px;
    }

    .ivu-card-head-inner, .ivu-card-head p {
        display: flex !important;
        justify-content: space-between !important;
        height: 40px !important;
        line-height: 40px !important;
    }
</style>
