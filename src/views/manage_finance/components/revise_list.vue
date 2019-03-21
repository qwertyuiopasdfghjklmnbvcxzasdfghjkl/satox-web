<template>
    <Row>
        <Card style="width:1000px;">
            <p slot="title">
                <span>SATO数量修改记录</span>
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
            <Page :current="page" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    import financeApi from '../../../api/finance';
    import kyc from '../../../api/kyc';

    export default {
        data () {
            return {
                page: 1,
                total: 0,
                formData: {
                    type: 'username',
                    text: ''
                },
                columns1: [
                    {title: '创建时间', key: 'createdAt'},
                    {title: '用户名', key: 'username'},
                    {title: '手机号', key: 'mobile'},
                    {title: '姓名', key: 'userRealName'},
                    {
                        title: '钱包类型',
                        key: 'type',
                        render: (h, params) => {
                            return h('div', params.row.type == 1 ? '主钱包' : '非主钱包');
                        }
                    },
                    {title: '币种代号', key: 'symbol'},
                    {title: '数量', key: 'quantity'},
                    {
                        title: '修改类型',
                        key: 'direction',
                        render: (h, params) => {
                            return h('div', params.row.direction == 1 ? '增加' : '扣除');
                        }
                    },
                    {title: '操作人', key: 'lastUpdatedBy'}
                ],
                data1: []
            };
        },
        created () {
            this.getList();
        },
        methods: {
            state (data) {
                switch (data) {
                    case 1:
                }
            },
            getList () {
                let data = {
                    page: this.page,
                    size: 10,
                    symbol: 'SATO'
                };
                if (this.formData.text) {
                    data[this.formData.type] = this.formData.text;
                }
                financeApi.recordSato(data, (res, total) => {
                    this.total = total;
                    this.data1 = res;
                });
            },
            changePage (page) {
                this.page = page;
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
