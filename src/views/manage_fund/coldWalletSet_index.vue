<template>
    <div class="coldWalletSet">
        <Card>
            <p slot="title">冷钱包设置
                <Button type="primary" @click="add">添加</Button>
            </p>
            <Table :columns="columns1" :data="data1"></Table>
        </Card>
    </div>
</template>
<script>
import addWallet from './addWallet'
import upWallet from './upWallet'
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
                        title: '地址',
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
                                            util.setDialog(upWallet)
                                        }
                                    }
                                }, '修改')
                            ]);
                        }
                    }
                ],
                data1: []
            }
        },
        methods: {
            add () {
                util.setDialog(addWallet)
            }
        }
    }
</script>
<style scoped>
.ivu-card-head p{display: flex;justify-content:space-between;height: 30px;}
</style>
