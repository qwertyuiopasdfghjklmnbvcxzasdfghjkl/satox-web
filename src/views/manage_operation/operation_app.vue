<template>
    <div class="">
        <Card>
            <p slot="title">{{$t('operation.appfb')}}</p>
            <div class="box">
                <div class="cont">
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
                                    {{ loadingStatus ? $t('operation.scz') : $t('operation.sc') }}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:20px;">
                        <Col span="10">{{$t('operation.bbh')}}： {{datas.androidVersion}}</Col>
                        <Col span="10">
                            <Input v-model="androidVersion" :maxlength="50"></Input>
                        </Col>
                        <Col span="4" style="text-align: center">
                            <Button @click="tabs2('androidVersion')">{{$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:20px;">
                        <!--<Col span="10">{{$t('operation.gxts')}}：-->
                            <!--<span v-html="datas.androidUpdateIntro" style="display: inline-block"></span>-->
                        <!--</Col>-->

                        <Col span="10" style="display: flex;">
                            {{$t('operation.gxts')}}：
                            <ul class="text_box">
                                <li><span v-html="datas.androidUpdateIntro.zh" style="display: block"></span></li>
                                <li><span v-html="datas.androidUpdateIntro.en" style="display: block"></span></li>
                                <li><span v-html="datas.androidUpdateIntro.cht" style="display: block"></span></li>
                            </ul>
                        </Col>
                        <Col span="10" class="remaket_box">
                            <Input v-model="androidCN" type="textarea" :placeholder="$t('operation.zw')" :maxlength="1000"></Input>
                            <Input v-model="androidEN" type="textarea" :placeholder="$t('operation.yw')" :maxlength="1000"></Input>
                            <Input v-model="androidTW" type="textarea" :placeholder="$t('operation.zwft')" :maxlength="1000"></Input>
                        </Col>


                        <!--<Col span="10">-->
                            <!--<Input type="textarea" v-model="androidUpdateIntro"></Input>-->
                        <!--</Col>-->
                        <Col span="4" style="text-align: center">
                            <Button @click="tabs2('androidUpdateIntro')">{{$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:20px;">
                        <Col span="10">{{$t('operation.sgts')}}：
                            <RadioGroup v-model="datas.androidPromptUpdate">
                                <Radio label="0">不推送</Radio>
                                <Radio label="1">推送</Radio>
                            </RadioGroup>
                        </Col>
                        <Col span="10">
                            <Button @click="push('androidPromptUpdate')">{{$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                </div>

                <div class="cont">
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
                    <Row style="margin-bottom:20px;">
                        <Col span="10">{{$t('operation.bbh')}}： {{datas.appleVersion}}</Col>
                        <Col span="10">
                            <Input v-model="appleVersion" :maxlength="50"></Input>
                        </Col>
                        <Col span="4" style="text-align: center">
                            <Button @click="tabs2('appleVersion')">{{$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:20px;">
                        <Col span="10" style="display: flex;">
                            {{$t('operation.gxts')}}：
                            <ul class="text_box">
                                <li><span v-html="datas.appleUpdateIntro.zh" style="display: block"></span></li>
                                <li><span v-html="datas.appleUpdateIntro.en" style="display: block"></span></li>
                                <li><span v-html="datas.appleUpdateIntro.cht" style="display: block"></span></li>
                            </ul>
                        </Col>
                        <Col span="10" class="remaket_box">
                            <Input v-model="appleCN" type="textarea" :placeholder="$t('operation.zw')" :maxlength="1000"></Input>
                            <Input v-model="appleEN" type="textarea" :placeholder="$t('operation.yw')" :maxlength="1000"></Input>
                            <Input v-model="appleTW" type="textarea" :placeholder="$t('operation.zwft')" :maxlength="1000"></Input>
                        </Col>
                        <Col span="4" style="text-align: center">
                            <Button @click="tabs2('appleUpdateIntro')">{{$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                    <Row style="margin-bottom:20px;">
                        <Col span="10">{{$t('operation.sgts')}}：
                            <RadioGroup v-model="datas.applePromptUpdate">
                                <Radio label="0">不推送</Radio>
                                <Radio label="1">推送</Radio>
                            </RadioGroup>
                        </Col>
                        <Col span="10">
                            <Button @click="push('applePromptUpdate')">{{$t('common.bc')}}</Button>
                        </Col>
                    </Row>
                </div>
            </div>
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
                androidVersion: '',
                androidUpdateIntro: {},
                appleVersion: '',
                appleUpdateIntro: {},
                appleCN: null,
                appleEN: null,
                appleTW: null,
                androidCN: null,
                androidEN: null,
                androidTW: null,
                datas: {
                    androidFile: null,
                    androidPath: '',
                    androidUrl: '',
                    appleIpa: '',
                    appleUrl: '',
                    androidVersion: '',
                    androidUpdateIntro: {},
                    appleVersion: '',
                    appleUpdateIntro: {},
                    applePromptUpdate: null,
                    androidPromptUpdate: null,
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
                    this.datas.appleUpdateIntro = JSON.parse(this.datas.appleUpdateIntro);
                    this.datas.androidUpdateIntro = JSON.parse(this.datas.androidUpdateIntro);
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            ReplaceSeperator (mobiles) {
                var i;
                var result = '';
                var c;
                if (!mobiles) {
                    return;
                }
                for (i = 0; i < mobiles.length; i++) {
                    c = mobiles.substr(i, 1);
                    if (c == '\n') {
                        result = result + '<br/>';
                    } else if (c != '\r') {
                        result = result + c;
                    }
                }
                return result;
            },
            tabs2 (propName) {
                if (propName === 'appleUpdateIntro' || propName === 'androidUpdateIntro') {
                    let data = {}
                    data.zh = this.ReplaceSeperator(propName === 'appleUpdateIntro' ? this.appleCN : this.androidCN);
                    data.en = this.ReplaceSeperator(propName === 'appleUpdateIntro' ? this.appleEN : this.androidEN);
                    data.cht = this.ReplaceSeperator(propName === 'appleUpdateIntro' ? this.appleTW : this.androidTW);
                    propName === 'appleUpdateIntro' ? this.appleUpdateIntro = JSON.stringify(data)
                        : this.androidUpdateIntro = JSON.stringify(data);
                }
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
            },
            push (propName) {
                let formData = new FormData();
                formData.append(propName, this.datas[propName]);
                this.upData(propName, formData);
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

    .box {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
    }

    .cont {
        display: inline-block;
        width: 50%;
        padding-left: 20px;

        &:last-child {
            border-left: 1px solid #ededed;
        }
    }

    @media (max-width: 2000px ) {
        .box {
            flex-flow: column;

            .cont {
                width: 100%;

                &:last-child {
                    border-left: none;
                    border-top: 1px solid #ededed;

                }
            }
        }
    }

    .remaket_box {
        div {
            margin-top: 5px;
        }
    }

    .text_box {
        li {
            margin-bottom: 15px;
        }
    }
</style>
