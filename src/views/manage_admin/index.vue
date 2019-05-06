<!-- 管理员权限管理 -->
<template>
    <Card>
        <p slot="title">{{$t('admin.glyqx')}}</p>
        <Row style="margin-bottom:10px;">
            <Button type="primary" icon="android-add" style="float:right;" @click="openDialog">{{$t('admin.xzgly')}}</Button>
        </Row>
        <Row style="border-top:1px solid #e9eaec;height:40px;line-height:40px;">
            <Col span="4">{{$t('admin.gly')}}</Col>
            <Col span="4">{{$t('common.zh')}}</Col>
            <!-- <Col span="4">权限类型</Col> -->
            <Col span="12">{{$t('admin.xgqxlx')}}</Col>
            <Col span="4">{{$t('common.cz')}}</Col>
        </Row>
        <Row v-for="(data, index) in data1" :key="data.id" style="border-top:1px solid #e9eaec;">
            <Col span="4" style="min-width: 100px;text-overflow: ellipsis;overflow: hidden;word-wrap: normal;">
                {{data.userRealName }}
            </Col>
            <Col span="4" style="border:1px solid #fff;">{{data.username}}</Col>
            <!-- <Col span="4">权限类型</Col> -->
            <Col span="12">
                <Select v-model="data.roleIds" filterable multiple>
                    <Option v-for="item in cityList" :value="item.roleId" :key="item.roleId">{{ item.roleNameCn }}
                    </Option>
                </Select>
            </Col>
            <Col span="4">
                <Button type="primary" @click="saveRole(data)">{{$t('common.bc')}}</Button>
                <Button type="ghost" @click="deleteUser(index)">{{$t('common.sc')}}</Button>
            </Col>
        </Row>
        <Page :current="curPage" :total="total" @on-change="changePage"
              style="text-align:center;margin-top:20px;"></Page>
    </Card>
</template>

<script>
    import util from '../../libs/util';
    import dialog from './dialog';
    import author from '../../api/author';

    export default {
        data () {
            return {
                curPage: 1,
                total: 0,
                cityList: [],
                model12: [],
                columns1: [
                    {title: this.$t('admin.gly'), key: 'realname'},
                    {title: '账号', key: 'username'},
                    {title: '权限类型', key: 'type'},
                    {title: '修改信息', key: 'selecttype'},
                    {
                        title: '操作', key: 'action', render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {type: 'primary', size: 'small'},
                                    on: {
                                        click: () => {
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                data1: []
            };
        },
        created () {
            this.getUserList();
            this.role();
        },
        methods: {
            deleteUser (index) {
                console.log(this.data1[0].bmUserId);
                author.deleteUser(this.data1[index].bmUserId, (res) => {
                    this.$Message.success({content: this.$t('kyc.sccg')});
                    this.getUserList();
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            saveRole (data) {
                let roleList = [];
                let roleIdsStr = ',' + data.roleIds.join(',') + ',';
                this.cityList.forEach((item) => {
                    if (roleIdsStr.indexOf(',' + item.roleId + ',') !== -1) {
                        roleList.push(item);
                    }
                });
                author.updateUserRole({
                    bmUserId: data.bmUserId,
                    version: data.version,
                    roleList: roleList
                }, (res) => {
                    this.$Message.success({content: this.$t('common.xgcg')});
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            openDialog () {
                util.setDialog(dialog, {
                    okCallback: () => {
                        this.getUserList();
                    }
                });
            },
            getUserList () {
                author.findBmUserList(this.curPage, (res, total) => {
                    this.total = total;
                    res.forEach((item) => {
                        item.roleIds = [];
                        item.roleList.forEach((m) => {
                            item.roleIds.push(m.roleId);
                        });
                    });
                    this.data1 = res;
                }, (msg) => {
                    if (msg === '不允许访问') {
                        this.$Message.error({content: msg});
                        return;

                    }
                });
            },
            role () {
                author.findAllRoleList({}, (res) => {
                    this.cityList = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            changePage (page) {
                this.curPage = page;
                this.getUserList();
            }
        }
    };
</script>

<style lang="less">
</style>
