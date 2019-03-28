<template>
    <div class="addressSet">
        <Card>
            <p slot="title">
                ETHNounce值
                <span class="refresh" @click="reshAll"></span>
            </p>
            <Row style="margin-bottom: 20px;">
                <Col span="14">
                    ETH地址：
                    <Input v-model="address" style="width:300px;"/>
                    <Button type="primary" @click="curPage1=1;getETHNonceList()">查询</Button>
                </Col>
            </Row>
            <Table :columns="columns2" :data="data2"></Table>
            <Page :current="curPage1" :total="total1" :page-size="size" @on-change="changePage1"
                  style="text-align:center;margin-top:20px;"></Page>
        </Card>
    </div>
</template>
<script>
    import monitApi from '../../api/monitoring';
    import updataNonce from './updataNonce';
    import util from '../../libs/util';

    export default {
        data () {
            return {
                curPage1: 1,
                total1: 0,
                size: 10,
                address: '',
                columns2: [
                    {
                        title: 'ETH地址',
                        key: 'address'
                    },
                    {
                        title: 'Nounce值',
                        key: 'nonce'
                    },
                    {
                        title: '更新时间',
                        key: 'updatedAt'
                    },
                    {
                        title: '操作',
                        key: 'address',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {
                                            util.setDialog(updataNonce, {
                                                item: params.row,
                                                okCallback: () => {
                                                    this.getETHNonceList();
                                                }
                                            });
                                        }
                                    }
                                }, '修改Nounce')
                            ]);
                        }
                    }
                ],
                data2: []
            };
        },
        created () {
            // this.getETHNonceList();
        },
        methods: {
            getETHNonceList () {
                if (this.address) {
                    let data = {page: this.curPage1, size: this.size, keyword: this.address};
                    monitApi.findETHNonceList(data, (res, total) => {
                        this.total1 = total;
                        this.data2 = res;
                    });
                } else {
                    this.$Message.error({content: 'ETH地址不能为空'});
                }
            },
            changePage1 (page) {
                this.curPage1 = page;
                this.getETHNonceList();
            },
            reshAll () {
                this.getETHNonceList();
                this.address = '';
            }
        }
    };
</script>
<style scoped>
    .ivu-card-head p {
        display: flex;
        justify-content: space-between;
        height: 30px;
    }
</style>
