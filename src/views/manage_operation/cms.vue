<!-- cms -->
<template>
    <Card>
        <p slot="title">{{$t('nav.cmsgl')}}</p>
        <Row>
            <Col span="20">
                {{$t('operation.ssyjmk')}}：
                <Select v-model="firstLevel" style="width:200px">
                    <Option :value="0">{{$t('common.qb')}}</Option>
                    <Option :value="1">{{$t('operation.ggjzx')}}</Option>
                    <Option :value="2">{{$t('operation.yjnr')}}</Option>
                </Select>
                {{$t('operation.ssejmk')}}：
                <Select v-model="secondLevel " style="width:200px">
                    <Option :value="0">{{$t('common.qb')}}</Option>
                    <Option :value="1">{{$t('operation.gg')}}</Option>
                    <Option :value="2">{{$t('operation.zx')}}</Option>
                    <Option :value="3">{{$t('operation.gywm')}}</Option>
                    <Option :value="4">{{$t('operation.jy')}}</Option>
                    <Option :value="5">{{$t('operation.bzzx')}}</Option>
                    <Option :value="6">{{$t('operation.tksm')}}</Option>
                </Select>
                {{$t('operation.bt')}}
                <Input v-model="keyword" style="width:200px"></Input>
                {{$t('common.zt')}}：
                <Select v-model="state" style="width:200px">
                    <Option :value="3">{{$t('common.qb')}}</Option>
                    <Option :value="0">{{$t('operation.wfb')}}</Option>
                    <Option :value="1">{{$t('operation.yfb')}}</Option>
                </Select>
                <Button type="primary" @click="curPage=1;getList()">{{$t('common.cx')}}</Button>
            </Col>
            <Col span="4">
                <Button type="primary" style="float:right" @click="add()">{{$t('operation.xinzwz')}}</Button>
            </Col>
        </Row>
        <Table :columns="columns1" :data="data1" style="margin-top:20px;"></Table>
        <Page :current="curPage" :total="total" @on-change="changePage" style="text-align:center;margin-top:20px;" :page-size="size"></Page>
    </Card>
</template>

<script>
    import util from '../../libs/util'
    import add from './cms/add'
    import detail from './cms/detail'
    import updata from './cms/updata'
    import extendApi from '../../api/extend'
    export default {
        data () {
            return {
                firstLevel: 0,
                secondLevel: 0,
                keyword: null,
                state: 3,
                curPage: 1,
                size: 10,
                total: 0,
                columns1: [
                    {
                        title: 'ID',
                        key: 'cmsInfoId'
                    },
                    {
                        title: this.$t('operation.ssyjmk'),
                        key: 'firstLevel',
                        render: (h, params) => {
                            return h('div', this.firstSwith(params.row.firstLevel))
                        }
                    },
                    {
                        title: this.$t('operation.ssejmk'),
                        key: 'secondLevel',
                        render: (h, params) => {
                            return h('div', this.secondSwith(params.row.secondLevel))
                        }
                    },
                    {
                        title: this.$t('operation.zwbt'),
                        key: 'titleCn'
                    },
                    {
                        title: this.$t('operation.ywbt'),
                        key: 'titleEn',
                    },
                    {
                        title: this.$t('operation.fbsj'),
                        key: 'createdAt'
                    },
                    {
                        title: this.$t('common.zt'),
                        key: 'state',
                        render: (h, params) => {

                            return h('div',{
                                    style:{
                                        color: params.row.state === 1? '#3fffd5': '#ff7329'
                                    },
                                }, params.row.state === 1 ? this.$t('operation.yfb'): this.$t('operation.wfb')
                            )
                        }
                    },
                    {
                        title: this.$t('common.cz'),
                        key: 'active',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(detail,{item:params.row})
                                        }
                                    }
                                }, this.$t('operation.wzyl')),
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            util.setDialog(updata,{
                                                item: params.row,
                                                okCallback: ()=>{
                                                    this.getList()
                                                }
                                            })
                                        }
                                    }
                                }, this.$t('common.xg')),
                                h('Button', { //分发状态(0：未分发 1：已分发 2：已取消)
                                    props: {type: 'primary', size: 'small'},
                                    style: {margin: '3px'},
                                    on: {
                                        click: () => {
                                            let data = params.row;
                                            data.state = params.row.state === 0 ? 1: 0
                                            extendApi.updataCms(data, (res) => {
                                                this.$Message.success({content: params.row.state === 0 ?
                                                        this.$t('operation.xscg'): this.$t('operation.fbcg')})
                                                this.getList()
                                            }, (msg) => {
                                                this.$Message.error({content: msg})
                                            })
                                        }
                                    }
                                },params.row.state === 1 ? this.$t('exchange.xs'): this.$t('operation.fb')),
                            ]);
                        }
                    }
                ],
                data1: []
            }
        },
        created () {
            this.getList()
        },
        methods: {
            firstSwith (stauts) {
                switch (stauts) {
                    case 1:
                        return this.$t('operation.ggjzx')
                    case 2:
                        return this.$t('operation.yjnr')
                }
            },
            secondSwith (stauts) {
                switch (stauts) {
                    case 1:
                        return this.$t('operation.gg')
                    case 2:
                        return this.$t('operation.zx')
                    case 3:
                        return this.$t('operation.gywm')
                    case 4:
                        return this.$t('operation.jy')
                    case 5:
                        return this.$t('operation.bzzx')
                    case 6:
                        return this.$t('operation.tksm')
                }
            },
            getList () {
                let data = {
                    firstLevel: this.firstLevel === 0 ? null : this.firstLevel,
                    secondLevel: this.secondLevel === 0 ? null : this.secondLevel,
                    state: this.state === 3 ? null : this.state,
                    keyword: this.keyword,
                    page: this.curPage,
                    size: this.size,
                }
                extendApi.getCms(data, (res, total) => {
                    this.total = total
                    this.data1 = res
                })
            },
            changePage (page) {
                this.curPage = page
                this.getList()
            },
            add () {
                util.setDialog(add, {
                    okCallback: () => {
                        this.getList()
                    }
                })
            }
        }
    }
</script>
