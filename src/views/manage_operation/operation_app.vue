<template>
    <div class="">
        <Card>
            <p slot="title">APP发布</p>
            <p class="lit">
                <Icon type="social-android"></Icon>
                安卓APP
            </p>
            <Row style="margin-bottom:20px;">
                <Col span="5">下载网址</Col>
                <Col span="5">{{datas.sequence}}</Col>
                <Col span="11">
                    <Input style="width:200px;" v-model="sequence"></Input>
                </Col>
                <Col span="3">
                    <Button @click="tabs2('sequence')">保存</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">APK文件</Col>
                <Col span="5">{{datas.title}}</Col>
                <Col span="11">
                    <input name="apk" ref="form" type="file"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs2('title')">保存</Button>
                </Col>
            </Row>
            <p class="lit">
                <Icon type="social-apple"></Icon>
                苹果APP
            </p>
            <Row style="margin-bottom:20px;">
                <Col span="5">下载网址</Col>
                <Col span="5">{{datas.link}}</Col>
                <Col span="11">
                    <Input v-model="link" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabsLink('link')">保存</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="5">IPA文件</Col>
                <Col span="5">{{datas.titleEn}}</Col>
                <Col span="11">
                    <Input v-model="titleEn" style="width: 200px"/>
                </Col>
                <Col span="3">
                    <Button @click="tabs2('titleEn')">保存</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    import extendApi from '../../api/extend';

    export default {
        props: ['item'],
        data () {
            return {
                sequence: null,
                title: '',
                link: '',
                titleEn: '',
                linkEn: '',
                titleCht: '',
                linkCht: '',
                datas: {
                    sequence: null,
                    title: '',
                    link: '',
                    titleEn: '',
                    linkEn: '',
                    titleCht: '',
                    linkCht: ''
                }
            };
        },
        created () {
            this.detail();
        },
        methods: {
            detail () {
                extendApi.findDetail({
                    announcementId: this.item.announcementId
                }, (res) => {
                    this.datas = [res][0][0];
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            tabs2 (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: this.swithType(propName) + '不能为空'});
                    return;
                }
                let data = {
                    announcementId: this.item.announcementId,
                    version: this.item.version
                };
                data[propName] = this[propName];
                extendApi.updateAnnouncement(data, (res) => {
                    this.detail();
                    this.$Message.success({content: '修改成功'});
                    this[propName] = '';
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            }
        }
    };
</script>

<style lang="less" scoped>
    .lit {
        padding: 1.5rem 0;
        border-top: 1px solid #eaeaec;

        i {
            font-size: 2rem;
            padding-right: 6px;
        }

        &:first-child {
            border: none;
        }
    }
</style>
