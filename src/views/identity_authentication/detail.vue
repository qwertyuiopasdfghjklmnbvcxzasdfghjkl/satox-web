<template>
    <Card>
        <Form ref="searchForm" :label-width="100">
            <FormItem label="地区">
                {{data.verify_class}}
            </FormItem>
            <Row>
                <Col span="8">
                    <FormItem label="姓氏">
                        {{data.verify_surname}}
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="名字">
                        {{data.verify_name}}
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="性别">
                        {{data.verify_sex}}
                    </FormItem>
                </Col>
            </Row>
            <FormItem label="身份证号码">
                {{data.verify_idcard}}
            </FormItem>
            <Row>
                <Col span="8">
                    <FormItem label="本人身份证正面照片">
                        <div class="image">
                            <img :width="frontimg.width" :height="frontimg.height" :src="frontimg.url" v-if="data.verify_frontimg"/>
                        </div>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="本人身份证背面照片">
                        <div class="image">
                            <img :width="backimg.width" :height="backimg.height" :src="backimg.url" v-if="data.verify_backimg"/>
                        </div>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="手持本人身份证正面照和个人签字">
                        <div class="image">
                            <img :width="handimg.width" :height="handimg.height" :src="handimg.url" v-if="data.verify_handimg"/>
                        </div>
                    </FormItem>
                </Col>
            </Row>
            <FormItem>
                <Button type="primary" @click="auditing(1)">审核通过</Button>
                <Button type="ghost" @click="auditing(2)" style="margin-left: 8px">审核不通过</Button>
                <Button type="ghost" style="margin-left: 8px" @click="back">返回</Button>
            </FormItem>
        </Form>
    </Card>
</template>

<script>
import util from '../../libs/util';
import qs from 'qs';
export default {
    props: {
        data: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data () {
        return {
            frontimg: { width: 0, height: 0, url: '' },
            backimg: { width: 0, height: 0, url: '' },
            handimg: { width: 0, height: 0, url: '' }
        };
    },
    watch: {
        data () {
            this.frontimg.url = util.baseURL + this.data.verify_frontimg;
            util.imageScale(314, 200, this.frontimg);
            this.backimg.url = util.baseURL + this.data.verify_backimg;
            util.imageScale(314, 200, this.backimg);
            this.handimg.url = util.baseURL + this.data.verify_handimg;
            util.imageScale(314, 200, this.handimg);
        }
    },
    methods: {
        auditing (status) {
            util.ajax.post('idCardAuditing', qs.stringify({
                id: this.data.verify_id,
                userid: this.data.verify_userid,
                status: status
            })).then(res => {
                if (res.data) {
                    if (res.data.code === 200) {
                        this.$Message.success(res.data.msg);
                        this.$emit('goBack', true);
                    } else {
                        this.$Message.error(res.data.msg);
                        this.$emit('goBack', true);
                    }
                } else {
                    this.$Message.error('其他错误');
                    this.$emit('goBack', true);
                }
            }).catch(error => {
                this.$Message.error('其他错误');
                this.$emit('goBack', true);
                window.console.log(error);
            });
        },
        back: function () {
            this.$emit('goBack');
        }
    }
};
</script>

<style lang="less" scoped>
.image {
  width: 314px;
  height: 200px;
  overflow: hidden;
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-align-items: center;
  align-items: center;
  border: 1px #ccc dashed;
}
</style>