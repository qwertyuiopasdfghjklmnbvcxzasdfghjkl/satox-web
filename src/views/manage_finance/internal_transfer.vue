<template>
    <Row>
        <Card>
            <p slot="title">
                {{$t('finance.nbzz')}}
                <span class="refresh" @click="getList"></span>
            </p>
            <Row>
                <Col span="16">
                    <Select v-model="formData.type" style="width:200px;">
                        <Option value="fromUsername">{{$t('finance.zcyhm')}}</Option>
                        <Option value="username">{{$t('finance.skyhm')}}</Option>
                    </Select>
                    <Input v-model="formData.text" clearable style="width: 200px"></Input>
                    <Button type="primary" @click="getList(true)">{{$t('common.cx')}}</Button>
                </Col>
                <Col span="8">
                    <Button type="primary" style="float:right;" @click="addDialog">{{$t('common.tj')}}</Button>
                </Col>
            </Row>
            <Table :columns="columns1" :data="data1" style="margin-top:10px;"></Table>
            <Page :current="page" :total="total" :page-size="size" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>
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
                size: 15,
                formData: {
                    type: 'fromUsername',
                    text: ''
                },
                columns1: [
                    {title: this.$t('common.cjsj'), key: 'createdAt'},
                    {title: this.$t('finance.zcyhm'), key: 'fromUsername'},
                    {title: this.$t('finance.skyhm'), key: 'username'},
                    {title: this.$t('common.bz'), key: 'symbol'},
                    {title: this.$t('common.sl'), key: 'quantity'},
                    {title: this.$t('common.beiz'), key: 'remarks'},
                    {title: this.$t('finance.czr'), key: 'lastUpdatedBy'},
                    {
                        title: this.$t('common.zt'),
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
                        return this.$t('common.jxz');
                        break;
                    case 2:
                        return this.$t('common.ywc');
                        break;
                    case 3:
                        return this.$t('common.yqx');
                        break;
                    case 4:
                        return this.$t('common.yjj');
                        break;
                }
            },
            getList () {
                let data = {
                    page: this.page,
                    size: this.size
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
                this.page = page;
                this.getList();
            }
        }
    };
</script>

<style scoped>

</style>
