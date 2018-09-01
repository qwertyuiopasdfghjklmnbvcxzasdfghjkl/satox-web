<template>
  <div>
    <div v-if="!isDetail">
      <Card style="margin-bottom:10px">
        <Form ref="searchForm" :model="searchData" :label-width="80">
            <Row>
                <Col span="4">
                    <FormItem label="姓名" prop="name">
                        <Input v-model="searchData.name" style="width:200px"></Input>
                    </FormItem>
                </Col>
                <Col span="4">
                    <FormItem label="开始时间">
                        <DatePicker v-model="searchData.beginTiem" type="date"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="4">
                    <FormItem label="结束时间">
                        <DatePicker v-model="searchData.endTiem" type="date"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="12">
                    <FormItem label="状态" prop='type'>
                        <Select v-model="searchData.type" style="width:200px">
                            <Option value="0">全部</Option>
                            <Option value="1">通过</Option>
                            <Option value="2">不通过</Option>
                            <Option value="3">待审核</Option>
                        </Select>
                    </FormItem>
                </Col>
            </Row>
            <FormItem>
                <Button type="primary" @click="search">查询</Button>
                <Button type="ghost" style="margin-left: 8px" @click="resetSearchForm">重置</Button>
            </FormItem>
        </Form>
      </Card>
      <Table :columns="columns" :data="datas"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="totalCount" :current="curPage"></Page>
        </div>
      </div>
    </div>
    <detail :data='detailData' v-if="isDetail" @goBack='goBack'></detail>
  </div>
</template>

<script>
import util from '../../libs/util';
import Detail from './detail';
import qs from 'qs';
export default {
    components: {
        Detail
    },
    data () {
        return {
            searchData: {
                name: '',
                beginTiem: '',
                endTiem: '',
                type: '0'
            },
            detailData: {},
            isDetail: false,
            totalCount: 0,
            curPage: 1,
            columns: [
                { title: '姓氏', key: 'verify_surname' },
                { title: '名字', key: 'verify_name' },
                { title: '性别', key: 'verify_sex' },
                { title: '身份证号码', key: 'verify_idcard' },
                {
                    title: '状态',
                    key: 'verify_status',
                    render: (h, params) => {
                        let style = {};
                        let status = params.row.verify_status;
                        if (status === '审核通过') {
                            style.color = '#42b983';
                        } else if (status === '审核不通过') {
                            style.color = '#ED1C24';
                        } else {
                            style.color = '#F6A623';
                        }
                        return h('label', { style: style }, params.row.verify_status);
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 150,
                    align: 'center',
                    render: (h, params) => {
                        let buttons = [];
                        if (params.row.verify_status === '待审核') {
                            buttons.push(
                                h('Button',
                                    {
                                        props: { type: 'primary', size: 'small' },
                                        on: {
                                            click: () => {
                                                this.isDetail = true;
                                                this.auditing(params.row);
                                            }
                                        }
                                    },
                                    '审核'
                                )
                            );
                        }
                        return h('div', buttons);
                    }
                }
            ],
            datas: []
        };
    },
    created () {
        this.search();
    },
    methods: {
        search: function () {
            let param = {
                page: 1,
                type: this.searchData.type
            };
            this.searchData.name && (param.name = this.searchData.name);
            if (this.searchData.beginTiem) {
                let beginTime = this.searchData.beginTiem;
                console.log(beginTime)
            }
            this.searchData.endTiem && (param.endTiem = this.searchData.endTiem.toString().substring(0, 10));
            util.ajax.post('api/v1/admin/idCardList', qs.stringify(param)).then(res => {
                if (res.data && res.data.code === 200) {
                    this.datas = res.data.data;
                    this.totalCount = this.datas.length;
                }
            }).catch(error => {
                window.console.log(error);
            });
        },
        resetSearchForm: function () {
            this.$refs.searchForm.resetFields();
        },
        auditing: function (data) {
            util.ajax.post('idCardShow', qs.stringify({
                id: data.verify_id
            })).then(res => {
                if (res.data && res.data.code === 200) {
                    this.detailData = res.data.data;
                }
            }).catch(error => {
                window.console.log(error);
            });
        },
        goBack: function (isSearch) {
            this.detailData = {};
            this.isDetail = false;
            isSearch && this.search();
        }
    }
};
</script>

<style lang="less" scoped>

</style>