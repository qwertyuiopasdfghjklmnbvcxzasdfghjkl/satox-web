<template>
    <div>
        <Row>
           <Card style="font-size:16px;">
                <Row>
                    <Form :model="searchForm">
                        <p class="notwrap">
                            <strong>
                                <span>用户管理</span>
                                <span class="padding-left-20">
                                    <Input v-model="searchForm.name" placeholder="请输入邮箱" style="width:120px;"></Input>
                                    <Button type="primary">搜索</Button>
                                </span>
                                <span class="padding-left-20">
                                    <Checkbox>等待审核</Checkbox>
                                </span>
                            </strong>
                        </p>
                    </Form>
                </Row>
            </Card>
        </Row>
        <Row>
            <Card class="margin-top-10" style="height:740px;">
                <Table :columns="columns" :data="datas"></Table>
                <Page style="margin-top:10px;float:right;" :total="params.totalPage" :page-size="params.show" @on-change="pageChange"></Page>
            </Card>
        </Row>
        <info-model v-model="infoModelShow" :id="id"/>
        <state-model v-model="stateModelShow" :userId="stateId" :state="state" @customerList="customerList"/>
        <auth-model v-model="authModelShow" :userId="verifyId" @customerList="customerList"/>
        <trade-model v-model="tradeModelShow" :username="tradeUsername" :userId="tradeUserId"/>
        <assets-model v-model="assetsModelShow" :userId="userId" :username="username"/>
    </div>
</template>

<script>
import util from '../../libs/util';
import qs from 'qs';
import stateModel from './stateModel';
import infoModel from './infoModel';
import authModel from './authModel';
import tradeModel from './tradeRecordModel'
import assetsModel from './assetsModel'
export default {
    components: {
      stateModel,
      infoModel,
      authModel,
      tradeModel,
      assetsModel
    },
    data () {
        return {
            infoModelShow: false,
            stateModelShow: false,
            authModelShow: false,
            tradeModelShow: false,
            assetsModelShow: false,
            searchForm: {
                name: '',
                type: null
            },
            id: null,
            userId: null,
            username: null,
            tradeUserId: null,
            tradeUsername: null,
            verifyId: null,
            stateId: null,
            state: null,
            params: {
                page: 1,
                show: 10,
                totalPage: 0
            },
            columns: [
                {title: '账号', key: 'username'},
                {title: '在线状态', key: 'online', render: (h, params) => {
                    return h('div', [params.row.online === true ? '在线' : '不在线']);
                }},
                {title: '账号状态', key: 'state', render: (h, params) => {
                    return h('div', [params.row.state === 1 ? '正常' : '已冻结']);
                }},
                {title: '认证状态', key: 'verify_status', render: (h, params) => {
                    var verify_status = params.row.verify_status;
                    var style = {};
                    if (verify_status === -1) {
                        verify_status = '无';
                    } else if (verify_status === 0) {
                        verify_status = '待认证';
                        style = {color: '#2db7f5'};
                    } else if (verify_status === 1) {
                        verify_status = '已认证';
                        style = {color: '#19be6b'}
                    } else if (verify_status === 2) {
                        verify_status = '认证失败';
                        style = {color: '#ed3f14'}
                    }
                    return h('div',{
                        style: style
                    }, [verify_status]);
                }},
                {title: '操作', key: 'action', width: 500, render: (h, params) => {
                    return h('div', [
                        h('Button', {
                            props: {
                                type: 'primary', size: 'small'},
                                style: { marginRight: '10px'},
                                on: {
                                    click: () => {
                                        this.id = params.row.id;
                                        this.infoModelShow = true
                                    }
                                }
                        }, '用户信息'),
                        h('Button', {
                            props: {type: 'primary', size: 'small'},
                            style: { marginRight: '10px'},
                            on: {
                                click: () => {
                                    this.userId = params.row.id;
                                    this.assetsModelShow = true;
                                    this.username = params.row.username;
                                }
                            }
                        }, '资产信息'),
                        h('Button', {
                            props: {type: 'primary', size: 'small'},
                            style: { marginRight: '10px'},
                            on: {
                                click: () => {
                                    this.tradeModelShow = true;
                                    this.tradeUserId = params.row.id;
                                    this.tradeUsername = params.row.username;
                                }
                            }
                        }, '交易信息'),
                        h('Button', {
                            props: {
                                type: 'error', size: 'small'},
                                style: { marginRight: '10px'},
                                on: {
                                    click: () => {
                                        this.stateModelShow = true;
                                        this.stateId = params.row.id;
                                        this.state = params.row.state;
                                    }
                                }
                        }, params.row.state === 0 ?'解冻':'冻结'),
                        params.row.verify_status !== 0 ? '' : h('Button', {
                            props: {
                                type: 'error', size: 'small'},
                                style: { marginRight: '10px'},
                                on: {
                                    click: () => {
                                        this.authModelShow = true;
                                        this.verifyId = params.row.id;
                                        this.state = params.row.state;
                                    }
                                }
                        }, '认证')
                    ]);
                }}
            ],
            datas: []
        };
    },
    computed: {
        paramsChange () {
            return {
                page: this.params.page
            }
        }
    },
    watch: {
      infoModelShow (bool) {
          !bool && (this.id = null);
      },
      assetsModelShow (bool) {
          !bool && (this.userId = null);
      },
      paramsChange () {
          this.customerList();
      }
    },
    created () {
        this.customerList();
    },
    methods : {
      customerList() {
          util.ajax.get('api/v1/manage/otc/customerList', {params: this.params}).then((res)=> {
            if (res.data && res.data.rst === 1) {
                var data = res.data.data;
                this.datas = data
                this.params.totalPage = res.data.total;
            } else if (res.data && res.data.rst !== 1) {
                var msgs = res.data.msg;
                this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
            } else {
                this.$Message.error('其他错误');
                window.console.log(error);
            }
        })
      },
      pageChange (page) {
          this.params.page = page;
      }
    }
};
</script>

<style lang="less" scoped>

</style>