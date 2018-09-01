<template>
    <div class="addressSet">
        <Card>
            <p slot="title">自动转账</p>
             <Table :columns="columns1" :data="data1"></Table>
        </Card>
         <Card>
            <p slot="title">手动转账</p>
             <Table :columns="columns2" :data="data2"></Table>
        </Card>
    </div>
</template>
<script>
import upAddress from './upAddress'
import util from '../../libs/util'
export default {
    data () {
        return {
            columns1: [
                {
                    title: '币种',
                    key: 'name'
                },
                {
                    title: '触发数量',
                    key: 'age'
                },
                {
                    title: '剩余数量',
                    key: 'age'
                },
                {
                    title: ' ',
                    key: 'address',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {type: 'primary', size: 'small'},
                                style: {marginRight: '10px'},
                                on: {
                                    click () {
                                        util.setDialog(upAddress)
                                    }
                                }
                            }, '修改')
                        ]);
                    }
                }
            ],
            data1: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    date: '2016-10-02'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    date: '2016-10-04'
                }
            ],
            columns2: [
                {
                    title: '币种',
                    key: 'name'
                },
                {
                    title: '转账数量',
                    key: 'age'
                },
                {
                    title: ' ',
                    key: 'address',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {type: 'primary', size: 'small'},
                                style: {marginRight: '10px'},
                                on: {
                                    click () {
                                        util.setDialog(upAddress)
                                    }
                                }
                            }, '执行')
                        ]);
                    }
                }
            ],
            data2: [
                {
                    name: 'John Brown',
                    age: 18,
                    address: 'New York No. 1 Lake Park',
                    date: '2016-10-03'
                },
                {
                    name: 'Jim Green',
                    age: 24,
                    address: 'London No. 1 Lake Park',
                    date: '2016-10-01'
                },
                {
                    name: 'Joe Black',
                    age: 30,
                    address: 'Sydney No. 1 Lake Park',
                    date: '2016-10-02'
                },
                {
                    name: 'Jon Snow',
                    age: 26,
                    address: 'Ottawa No. 2 Lake Park',
                    date: '2016-10-04'
                }
            ]
        }
    },
    methods: {
    }
}
</script>
<style scoped>
.ivu-card-head p{display: flex;justify-content:space-between;height: 30px;}
</style>