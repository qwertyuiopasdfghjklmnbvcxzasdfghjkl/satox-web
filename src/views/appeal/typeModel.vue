<template>
    <Modal v-model="show" title="问题类型管理" width="360">
        <Form ref="typeForm" :model="typeData" :rules="typeValidate" label-position="top">
            <FormItem label="问题描述" prop="type">
                <Input style="width:220px;" v-model="typeData.type"></Input>
                <span style="float:right;"><Button type="primary" @click="addType">添加</Button></span>
            </FormItem>
            <FormItem>
                <div class="appeal-type-list">
                    <ul>
                        <li v-for="(item, index) in datas" :key="item.id" class="appeal-type-list-item">
                            {{item.type}}
                            <a v-if="item.id!==1" class="appeal-type-list-item-delete" @click="deleteType(item.id, index)">删除</a>
                        </li>
                    </ul>
                </div>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="show=false">关闭</Button>
        </div>
    </Modal>
</template>

<script>
import util from '@/libs/util';
import qs from 'qs';
export default {
    props: ['value'],
    data () {
        return {
            show: this.value,
            datas: [],
            typeData: {
                type: ''
            },
            typeValidate: {
                type: [
                    {required: true, message: '请输入问题描述', trigger: 'blur'}
                ]
            }
        }
    },
    watch: {
        value (bool) {
            this.show = bool;
        },
        show (bool) {
            this.$emit('input', bool);
        }
    },
    created () {
        this.getList();
    },
    methods: {
        getList () { // 获取申诉类型
            util.ajax.get(`api/v1/manage/otc/appeal/types`).then((res) => {
                if (res.data && res.data.rst === 1) {
                    this.datas = res.data.data;
                } else if (res.data && res.data.rst !== 1){
                    var msgs = res.data.msg;
                    this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                    window.console.log(res.data.msg);
                }
            }).catch((error) => {
                this.$Message.error('其他错误');
                window.console.log(error);
            });
        },
        addType () { // 新增申诉类型
            this.$refs.typeForm.validate((valid) => {
                if (!valid) {
                    return;
                }
                util.ajax.post(`api/v1/manage/otc/appeal/types`, qs.stringify(this.typeData)).then((res) => {
                    if (res.data && res.data.rst === 1) {
                        this.$Message.success(res.data.msg);
                        this.typeData.type = '';
                        this.getList();
                    } else if (res.data && res.data.rst !== 1){
                        var msgs = res.data.msg;
                        this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                        window.console.log(res.data.msg);
                    }
                }).catch((error) => {
                    this.$Message.error('其他错误');
                    window.console.log(error);
                });
            });
        },
        deleteType (id, index) { // 删除申诉类型
            util.ajax.delete(`api/v1/manage/otc/appeal/types/${id}`).then((res) => {
                if (res.data && res.data.rst === 1) {
                    this.$Message.success(res.data.msg);
                    this.datas.splice(index, 1);
                } else if (res.data && res.data.rst !== 1){
                    var msgs = res.data.msg;
                    this.$Message.error(typeof msgs === 'string' ? msgs : msgs[0]);
                    window.console.log(res.data.msg);
                }
            }).catch((error) => {
                this.$Message.error('其他错误');
                window.console.log(error);
            });
        }
    }
};
</script>

<style>
.appeal-type-list{width:100%;height:200px;overflow-y:scroll;border:1px solid #ccc;}
.appeal-type-list-item{text-indent: 10px;}
.appeal-type-list-item-delete{float:right;margin-right:10px;}
</style>
