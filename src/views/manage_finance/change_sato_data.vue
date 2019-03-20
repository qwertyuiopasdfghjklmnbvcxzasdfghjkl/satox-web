<template>
    <Row>
        <Card>
            <p slot="title">
                SATO数量修改
                <span class="refresh" @click="getList"></span>
            </p>
            <Row>
                <Col span="16">
                    <Select v-model="formData.type" style="width:200px;">
                        <Option value="account">用户名</Option>
                    </Select>
                    <Input v-model="formData.text" clearable style="width: 200px"></Input>
                    <Button type="primary" @click="getList(true)">查询</Button>
                </Col>
                <Col span="8">
                    <Button type="primary" style="float:right;" @click="reviseDialog">修改记录</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    // import financeApi from '../../api/finance',
    import kyc from '../../api/kyc';
    import util from '../../libs/util';
    import reviseDialog from './components/revise_list';
    import dialog from './components/dialog_sato';

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
                    {title: '用户名', key: 'account'},
                    {title: '手机号', key: 'account'},
                    {title: '姓名', key: 'cn'},
                    {title: '钱包类型', key: 'verifyName'},
                    {title: '币种代号', key: 'verifyName'},
                    {title: '总金额', key: 'verifyName'},
                    {title: '可用金额', key: 'verifyName'},
                    {title: '冻结金额', key: 'verifyName'},
                    {
                        title: '操作',
                        key: 'opreat',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(dialog, {
                                                item: params.row,
                                                state: '0',
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, '增加'),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(dialog, {
                                                item: params.row,
                                                state: '1',
                                                okCallback: () => {
                                                    this.getList();
                                                }
                                            });
                                        }
                                    }
                                }, '扣除')
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
                        return '身份证';
                        break;
                    case 0:
                        return '驾照';
                        break;
                    case 1:
                        return '护照';
                        break;
                }
            },
            switchStaus (state) {//0：未验证、1：待审核、2：已通过、3：未通过、4 : 待复核
                switch (state) {
                    case 0:
                        return '未验证';
                        break;
                    case 1:
                        return '待审核';
                        break;
                    case 2:
                        return '已通过';
                        break;
                    case 3:
                        return '未通过';
                        break;
                    case 4:
                        return '待复核';
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
            reviseDialog () {
                util.setDialog(reviseDialog, {
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

<style scoped>

</style>
