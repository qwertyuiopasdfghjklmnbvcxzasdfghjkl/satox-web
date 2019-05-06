<template>
    <div class="">
        <Card>
            <p slot="title">{{$t('operation.appfb')}}</p>
            <p class="lit">
                <Icon type="social-android"></Icon>
                {{$t('operation.azapp')}}
            </p>
            <Row style="margin-bottom:20px;">
                <Col span="10">{{$t('operation.xzwz')}}： {{datas.androidUrl}}</Col>
                <Col span="10">
                    <Input v-model="androidUrl"></Input>
                </Col>
                <Col span="4" style="text-align: center">
                    <Button @click="tabs2('androidUrl')">{{$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="10">{{$t('operation.apkwj')}}： {{datas.androidPath}}</Col>
                <Col span="10">
                    <Upload
                            :before-upload="handleUpload"
                            :format="format"
                            action="//jsonplaceholder.typicode.com/posts/">
                        <Button icon="ios-cloud-upload-outline">{{$t('operation.xzwj')}}</Button>
                        <span v-if="file !== null"> {{ file.name }}</span>
                    </Upload>
                    <div class="loding" v-if="loadingStatus">
                        <Progress :percent="percentComplete" :status="status"/>
                    </div>
                </Col>
                <Col span="4" style="text-align: center">
                    <div>
                        <Button @click="upload" :loading="loadingStatus">
                            {{ loadingStatus ? $t('operation.scz') : $t('operation.sc') }}</Button>
                    </div>
                </Col>
            </Row>
            <p class="lit">
                <Icon type="social-apple"></Icon>
                {{$t('operation.pgapp')}}
            </p>
            <Row style="margin-bottom:20px;">
                <Col span="10">{{$t('operation.xzwz')}}： {{datas.appleUrl}}</Col>
                <Col span="10">
                    <Input v-model="appleUrl"/>
                </Col>
                <Col span="4" style="text-align: center">
                    <Button @click="tabs2('appleUrl')">{{$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:20px;">
                <Col span="10">{{$t('operation.ipawj')}}： {{datas.appleIpa}}</Col>
                <Col span="10">
                    <Input v-model="appleIpa"/>
                </Col>
                <Col span="4" style="text-align: center">
                    <Button @click="tabs2('appleIpa')">{{$t('common.bc')}}</Button>
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
                    this.$Message.error({content: this.swithType(propName) + this.$t('common.bnwk')});
                    return;
                }
                let formData = new FormData();
                formData.append(propName, this[propName]);
                this.upData(propName, formData);
            },
            upData (propName, formData) {
                extendApi.updataAppDetail(formData, (res) => {
                    this.detail();
                    this.$Message.success({content: this.$t('common.xgcg')});
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
                        return this.$t('operation.azscwj');
                    case 'androidUrl':
                        return this.$t('operation.azxzwz');
                    case 'appleIpa':
                        return this.$t('operation.pgipawj');
                    case 'appleUrl':
                        return this.$t('operation.pgxzwz');
                }
            },
            handleUpload (file) {
                this.file = file;
                let type = file.name.split('.');
                if (type[type.length - 1] !== 'apk') {
                    this.$Message.error({content: this.$t('operation.znscapkdwj')});
                    this.file = null;
                    return;
                }
                return false;
            },
            upload () {
                if (!this.file) {
                    this.$Message.error({content: this.$t('operation.apkbnwk')});
                    return;
                }
                this.loadingStatus = true;
                extendApi.upData(this.file, (evt) => {
                        if (evt.lengthComputable) {
                            this.percentComplete = Math.round(evt.loaded * 100 / evt.total);
                        } else {
                            this.$Message.error(this.$t('operation.wjyw'));
                        }
                    },
                    (evt) => {
                        /* 当服务器响应后，这个事件就会被触发 */
                        this.file = null;
                        this.loadingStatus = false;
                        this.detail();
                        this.$Message.success(this.$t('operation.sccg'));
                    },
                    (evt) => {
                        this.$Message.error(this.$t('operation.scwjfslcw'));
                        this.status = 'wrong';
                    },
                    (evt) => {
                        this.$Message.error(this.$t('operation.scbqx'));
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
