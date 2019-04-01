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
                    <Upload
                            :before-upload="handleUpload"
                            :format="format"
                            action="//jsonplaceholder.typicode.com/posts/">
                        <Button icon="ios-cloud-upload-outline">选择文件</Button>
                        <span v-if="file !== null"> {{ file.name }}</span>
                    </Upload>
                    <div class="loding" v-if="loadingStatus">
                        <Progress :percent="percentComplete" :status="status"/>
                    </div>
                </Col>
                <Col span="4" style="text-align: center">
                    <div>
                        <Button @click="upload" :loading="loadingStatus">{{ loadingStatus ? '上传中' : '上传' }}</Button>
                    </div>
                </Col>
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
                show: false,
                file: null,
                fileSize: 0,
                percentComplete: 0,
                loadingStatus: false,
                status: 'active',
                format: ['apk']
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
                formData.append(propName, this[propName]);
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
            },
            handleUpload (file) {
                this.file = file;
                let type = file.name.split('.');
                if (type[type.length - 1] !== 'apk') {
                    this.$Message.error({content: '只能上传apk的文件'});
                    this.file = null;
                    return;
                }
                return false;
            },
            upload () {
                if (!this.file) {
                    this.$Message.error({content: 'APK文件不能为空'});
                    return;
                }
                this.loadingStatus = true;
                extendApi.upData(this.file, (evt) => {
                        if (evt.lengthComputable) {
                            this.percentComplete = Math.round(evt.loaded * 100 / evt.total);
                        } else {
                            this.$Message.error('文件有误');
                        }
                    },
                    (evt) => {
                        /* 当服务器响应后，这个事件就会被触发 */
                        this.file = null;
                        this.loadingStatus = false;
                        this.detail();
                        this.$Message.success('上传成功');
                    },
                    (evt) => {
                        this.$Message.error('上传文件发生了错误尝试');
                        this.status = 'wrong';
                    },
                    (evt) => {
                        this.$Message.error('上传被用户取消或者浏览器断开连接');
                        this.status = 'wrong';
                    }
                );
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

    .demo-spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    @keyframes ani-demo-spin {
        from {
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .demo-spin-col {
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>
