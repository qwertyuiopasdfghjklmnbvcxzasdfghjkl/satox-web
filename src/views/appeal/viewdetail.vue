<template>
    <Modal v-model="show" title="问题详情">
        <Form label-position="top">
            <FormItem label="问题描述">
                {{data.description}}
            </FormItem>
            <FormItem label="凭证截图">
                <div class="appeal-viewdetail-image"></div>
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
    props: ['value', 'id'],
    data () {
        return {
            show: this.value,
            data: {}
        }
    },
    watch: {
        value (bool) {
            this.show = bool;
        },
        show (bool) {
            !bool && (this.data = {});
            this.$emit('input', bool);
        },
        id (id) {
            this.getDetail(id);
        }
    },
    methods: {
        getDetail (id) { // 获取申诉详情
            util.ajax.get(`api/v1/manage/otc/appeal/detail/${id}`).then((res) => {
                if (res.data && res.data.rst === 1) {
                    this.data = res.data.data || {};
                    this.downImages(this.data.image_path);
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
        downImages (image_path) { // 下载申诉图片
            if (!image_path) {
                return;
            }
            util.ajax.post(`api/v1/manage/otc/download/appeal/images`, qs.stringify({
                image_path: image_path
            })).then((res) => {
                if (res.data && res.data.rst === 1) {
                    // debugger;
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

<style lang="less">
.appeal-viewdetail-image{width:100%;height:200px;background:#ccc;}
</style>