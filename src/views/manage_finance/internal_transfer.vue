<template>
    <Row>
        <Card>
            <p slot="title">
                内部转账
                <span class="refresh" @click="getList"></span>
            </p>
            <Row>
                <Col span="16">
                    <Select v-model="formData.type" style="width:200px;">
                        <Option value="account">转出用户名</Option>
                        <Option value="verifyName">转入用户名</Option>
                    </Select>
                    <Input v-model="formData.text" clearable style="width: 200px"></Input>
                    <Button type="primary" @click="getList(true)">查询</Button>
                </Col>
                <Col span="8">
                    <Button type="primary" style="float:right;" @click="addDialog">添加</Button>
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
    import add from './components/add';

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
                    {title: '创建时间', key: 'account'},
                    {title: '转出用户名', key: 'account'},
                    {title: '收入用户名', key: 'cn'},
                    {title: '币种', key: 'verifyName'},
                    {title: '数量', key: 'verifyName'},
                    {title: '备注', key: 'verifyName'},
                    {title: '操作人', key: 'verifyName'},
                    {
                        title: '状态', key: 'verifyStatus',  // 已完成、失败、待完成
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

<style scoped>

</style>
