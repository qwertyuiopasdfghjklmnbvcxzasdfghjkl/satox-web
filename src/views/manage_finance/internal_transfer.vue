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
                        <Option value="fromUsername">转出用户名</Option>
                        <Option value="username">转入用户名</Option>
                    </Select>
                    <Input v-model="formData.text" clearable style="width: 200px"></Input>
                    <Button type="primary" @click="getList(true)">查询</Button>
                </Col>
                <Col span="8">
                    <Button type="primary" style="float:right;" @click="addDialog">添加</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
            <Page :current="page" :total="total" @on-change="changePage"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </Row>
</template>

<script>
    import financeApi from '../../api/finance';
    import util from '../../libs/util';
    import add from './components/add';

    export default {
        data () {
            return {
                page: 1,
                total: 0,
                formData: {
                    type: 'fromUsername',
                    text: ''
                },
                columns1: [
                    {title: '创建时间', key: 'createdAt'},
                    {title: '转出用户名', key: 'fromUsername'},
                    {title: '收入用户名', key: 'username'},
                    {title: '币种', key: 'symbol'},
                    {title: '数量', key: 'quantity'},
                    {title: '备注', key: 'remarks'},
                    {title: '操作人', key: 'lastUpdatedBy'},
                    {
                        title: '状态',
                        key: 'status ',
                        render: (h, params) => { // 1：进行中，2：已完成，3：已取消，4：已拒绝
                            let status = Number(params.row.status);
                            let color = '';
                            switch (status) {
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
                                }, this.switchStaus(params.row.status)),
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
            switchStaus (state) {
                switch (state) {
                    case 1:
                        return '进行中';
                        break;
                    case 2:
                        return '已完成';
                        break;
                    case 3:
                        return '已取消';
                        break;
                    case 4:
                        return '已拒绝';
                        break;
                }
            },
            getList () {
                let data = {
                    page: this.page,
                    size: 15
                };
                if (this.formData.text) {
                    data[this.formData.type] = this.formData.text;
                }
                financeApi.listTransfer(data, (res, total) => {
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
