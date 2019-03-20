<template>
    <Row>
        <Card style="width:1000px;">
            <p slot="title">
                <span>SATO数量修改</span>
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row>
                <Col span="16">
                    <span>用户名</span>
                    <Input v-model="formData.text" clearable style="width: 200px"></Input>
                    <Button type="primary" @click="getList(true)">查询</Button>
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
    import kyc from '../../../api/kyc';

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
                    {title: '用户名', key: 'account'},
                    {title: '手机号', key: 'cn'},
                    {title: '姓名', key: 'verifyName'},
                    {title: '钱包类型', key: 'verifyName'},
                    {title: '币种代号', key: 'verifyName'},
                    {title: '修改类型', key: 'verifyName'},
                    {title: '数量', key: 'verifyName'},
                    {title: '操作人', key: 'opreat'}
                ],
                data1: []
            };
        },
        created () {
            this.getList();
        },
        methods: {
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
            changePage (page) {
                this.curPage = page;
                this.getList();
            },
            closeDialog () {
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style scoped>

</style>
