<template>
    <div class="">
        <Card>
            <p slot="title">APP发布</p>
            <p class="lit">
                <Icon type="social-android"></Icon>
                安卓APP
            </p>
            <Row style="margin-bottom:20px;">
                <Col span="10">下载网址： {{datas.androidUrl}}</Col>
                <Col span="10">
                    <Input v-model="androidUrl"></Input>
                </Col>
                <Col span="4" style="text-align: center">
                    <Button @click="tabs2('androidUrl')">保存</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="10">APK文件： {{datas.androidPath}}</Col>
                <Col span="10">
                    <input name="apk" ref="form" type="file"/>
                </Col>
                <Col span="4" style="text-align: center">
                    <Button @click="tabs2('androidFile')">保存</Button>
                </Col>
                <Spin fix v-if="show">
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <div>上传中</div>
                </Spin>
            </Row>
            <p class="lit">
                <Icon type="social-apple"></Icon>
                苹果APP
            </p>
            <Row style="margin-bottom:20px;">
                <Col span="10">下载网址： {{datas.appleUrl}}</Col>
                <Col span="10">
                    <Input v-model="appleUrl"/>
                </Col>
                <Col span="4" style="text-align: center">
                    <Button @click="tabs2('appleUrl')">保存</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="10">IPA文件： {{datas.appleIpa}}</Col>
                <Col span="10">
                    <Input v-model="appleIpa"/>
                </Col>
                <Col span="4" style="text-align: center">
                    <Button @click="tabs2('appleIpa')">保存</Button>
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
                androidFile: '0',
                androidPath: '',
                androidUrl: '',
                appleIpa: '',
                appleUrl: '',
                datas: {
                    androidFile: null,
                    androidPath: '',
                    androidUrl: '',
                    appleIpa: '',
                    appleUrl: ''
                },
                show: false
            };
        },
        created () {
            this.detail();
        },
        methods: {
            detail () {
                extendApi.findAppDetail((res) => {
                    this.datas = res;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            tabs2 (propName) {
                if (!this[propName]) {
                    this.$Message.error({content: this.swithType(propName) + '不能为空'});
                    return;
                }
                let formData = new FormData();
                if (propName === 'androidFile') {
                    formData.append('androidFile', this.$refs.form.files[0]);
                    let type = this.$refs.form.files[0].name.split('.');
                    if (type[type.length - 1] !== 'apk') {
                        this.$Message.error({content: '只能上传apk的文件'});
                        return;
                    }
                    this.show = true;
                } else {
                    formData.append(propName, this[propName]);
                }
                this.upData(propName, formData);
            },
            upData (propName, formData) {
                extendApi.updataAppDetail(formData, (res) => {
                    this.detail();
                    this.$Message.success({content: '修改成功'});
                    this[propName] = '';
                    this.androidFile = '0';
                    document.getElementsByTagName('input').value = '';
                    this.show = false;
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            swithType (i) {
                switch (i) {
                    case 'androidPath':
                        return '安卓上传文件';
                    case 'androidUrl':
                        return '安卓下载网址';
                    case 'appleIpa':
                        return '苹果IPA文件';
                    case 'appleUrl':
                        return '苹果下载网址';
                }
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
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
