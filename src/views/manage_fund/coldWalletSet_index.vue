<template>
    <div class="coldWalletSet">
        <Card>
            <p slot="title">冷钱包设置
                <Button type="primary" @click="add">添加</Button>
            </p>
            <Table :columns="columns1" :data="data1"></Table>
            <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;"></Page>  
        </Card>
    </div>
</template>
<script>
import addWallet from './addWallet'
import upWallet from './upWallet'
import util from '../../libs/util'
import fundApi from '../../api/fund'
import updataWaletAddress from './updataWaletAddress'
import addAddress from './addAddress'
    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                columns1: [
                    {
                        title: '币种',
                        key: 'symbol'
                    },
                    {
                        title: '地址',
                        key: 'address',
                        render: (h, params) => {
                            let o = this.detail(params.row.addressList, h);
                            return h('Select', {
                                props: {value:o.selValue },
                                on: {
                                    'on-change': (value) => {
                                        params.row.$select_value = value
                                    }
                                }
                            }, o.options)
                        }
                    },
                    {
                        title: ' ',
                        key: 'address',
                        render: (h, params) => {
                            let o = this.detail(params.row.addressList, h);
                            // console.log(o)
                            // console.log( o.valueAll.enable)
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small', disabled: o.valueAll && o.valueAll.enable === null },                                    
                                    // props: {type: 'primary', size: 'small', disabled: (params.row.$select_value==null && o.valueAll.enable===1) || params.row.$select_value==o.valueAll.address},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            let sel = null
                                            let list = params.row.addressList
                                            for(let i=0;i<list.length;i++){
                                                let d = list[i]
                                                if (d.address === params.row.$select_value) {
                                                    sel = d
                                                    break
                                                }
                                            }
                                            if (!sel){
                                                this.$Message.error({content: '请选择地址'})
                                                return
                                            }
                                            fundApi.updateColdWallet({
                                                walletId: sel.walletId,
                                                version: sel.version,
                                                enable: sel.enable
                                            }, (res) => {
                                                this.$Message.success({content: '启用成功'})
                                            })  
                                        }
                                    }
                                }, o.valueAll && o.valueAll.enable === 1 ? '禁用': '启用'),
                                h('Button', {
                                    props: {type: 'primary', size: 'small', disabled: (params.row.$select_value==null && o.valueAll && o.valueAll.enable === 1) || o.valueAll &&  params.row.$select_value==o.valueAll.address},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            let sel = null
                                            let list = params.row.addressList
                                            for(let i=0;i<list.length;i++){
                                                let d = list[i]
                                                if (d.address === params.row.$select_value) {
                                                    sel = d
                                                    break
                                                }
                                            }

                                            let options = []
                                            let selValue = null
                                            let oldVersion = null
                                            params.row.addressList.forEach((item1) => {
                                                if (item1.defaultFlag == 1) {
                                                    selValue = item1.walletId
                                                    oldVersion = item1.version
                                                }
                                            })
                                                fundApi.setDetail({
                                                    oldDefaultWalletId:selValue || null,
                                                    newDefaultWalletId: sel.walletId,
                                                    oldVersion:oldVersion || null,
                                                    newVersion: sel.version
                                                }, () => {
                                                    this.$Message.success({content: '设置成功'})
                                                }, (msg) => {
                                                    this.$Message.error({content: msg})
                                                })
                                            
                                        }
                                    }
                                }, '设为默认'),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            let selItem = null
                                            let list = params.row.addressList
                                            for(let i=0;i<list.length;i++){
                                                let d = list[i]
                                                if (d.address === params.row.$select_value) {
                                                    selItem = d
                                                    break
                                                } else if (d.defaultFlag == 1) {
                                                    selItem = d
                                                    break
                                                }
                                            }
                                            if (!selItem) {
                                                this.$Message.error({content: '请选择默认地址'})
                                            } else {
                                                util.setDialog(updataWaletAddress, {
                                                    item: selItem,
                                                    okCallback: () => {
                                                        this.getAllColdWallet()
                                                    }
                                                })
                                                
                                            }
                                            
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(addAddress, {
                                                symbol: params.row.symbol,
                                                okCallback: () => {
                                                    this.getAllColdWallet()
                                                }
                                            })
                                        }
                                    }
                                }, '新增地址'),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {marginRight: '10px'},
                                    on: {
                                        click: () => {
                                            let o = this.detail(params.row.addressList, h)
                                            fundApi.deleteColdWallet({
                                                walletId: o.valueAll.walletId
                                            }, (res) => {
                                                this.$Message.success({content: '删除成功'})
                                                this.getAllColdWallet()
                                            })
                                        }
                                    }
                                }, '删除地址')
                            ]);
                        }
                    }
                ],
                data1: [],
                symbol: ''
            }
        },
        created () {
            this.getAllColdWallet()
        },
        methods: {
            detail (addressList, h) {
                let options = []
                let selValue = null
                let valueAll = null
                let abled = false
                addressList.forEach((item) => {
                    if (item.defaultFlag == 1) {
                        selValue = item.address
                        valueAll = item
                    }
                    if (item.address === null) {
                        abled = true
                    } else {
                        options.push(h('Option', {
                            props: {value: item.address, label: item.address}
                        }))
                    }
                    
                })
                return {
                    options: options,
                    selValue: selValue,
                    valueAll: valueAll,
                    abled: abled
                }
            },
            add () {
                util.setDialog(addWallet, {
                    okCallback: () => {
                        this.getAllColdWallet()
                    }
                })
            },
            getAllColdWallet () {
                fundApi.findAllColdWallet(this.curPage, (res, total) => {
                    res.forEach((item) => {
                        item.$select_value = null
                    })
                    this.total = total
                    // console.log(res[0].addressList[0].address)
                    this.data1 = res
                    // this.symbol = res.symbol
                })
            },
            changePage (page) {
                this.curPage = page
                this.getAllColdWallet()
            }
        }
    }
</script>
<style scoped>
.ivu-card-head p{display: flex;justify-content:space-between;height: 30px;}
</style>
