<template>
    <Card>
        <p slot="title">{{$t('system.xtcspz')}}</p>
        <Row style="margin-bottom:10px;border-bottom:1px solid #dddee1;">
            <Col span="6">{{$t('system.xm')}}</Col>
            <Col span="6">{{$t('system.xz')}}</Col>
            <Col span="12">{{$t('common.xg')}}</Col>
        </Row>
        <Row style="margin-bottom:10px;">
            <Col span="6">{{siteName.codeDesc}}</Col>
            <Col span="6">{{siteName.value}}</Col>
            <Col span="12">
                <Input :min="0" style="width:80px;" type="text" v-model="formData.siteName"></Input>
                <Button @click="updataSystem(siteName)" style="margin-left:10px;" type="primary">{{$t('common.xg')}}
                </Button>
            </Col>
        </Row>
        <Row style="margin-bottom:10px;">
            <Col span="6">{{eosMemoPre.codeDesc}}</Col>
            <Col span="6" v-if="eosMemoPre.valueType === 1"><img class="img" :src="base+eosMemoPre.value"/></Col>
            <Col span="6" v-if="eosMemoPre.valueType === 0">{{eosMemoPre.value}}</Col>
            <Col span="12" v-if="eosMemoPre.valueType === 0">
                <Input :min="0" style="width:80px;" type="text" v-model="formData.eosMemoPre"></Input>
                <Button @click="updataSystem(eosMemoPre)" style="margin-left:10px;" type="primary">{{$t('common.xg')}}
                </Button>
            </Col>
            <Col span="12" v-if="eosMemoPre.valueType === 1">
                <input name="siteLogo" ref="form2" type="file"/>
                <Button @click="updataSystemImg(eosMemoPre.sysParamId)" type="primary">{{$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-bottom:10px;">
            <Col span="6">{{siteFavicon.codeDesc}}</Col>
            <Col span="6"><img class="img" :src="base+siteFavicon.value"/></Col>
            <Col span="12">
                <input name="siteLogo" ref="form" type="file"/>
                <Button @click="updataSystemImg(siteFavicon.sysParamId)" type="primary">{{$t('common.bc')}}</Button>
            </Col>
        </Row>
        <Row style="margin-bottom:10px;">
            <Col span="6">{{siteLogo.codeDesc}}</Col>
            <Col span="6"><img class="img" :src="base+siteLogo.value"/></Col>
            <Col span="12">
                <input name="siteLogo" ref="form1" type="file"/>
                <Button @click="updataSystemImg(siteLogo.sysParamId)" type="primary">{{$t('common.bc')}}</Button>
            </Col>
        </Row>
    </Card>
</template>

<script>
    import system from '../../api/systemparam';
    import curreny from '../../api/currency';
    import util from '../../libs/util';
    import addOrEditFeeAccount from './addOrEditFeeAccount';
    import addOrEditWithdrawalAddress from './addOrEditWithdrawalAddress';
    import addConfig from './addConfig';

    export default {
        data () {
            return {
                base: util.baseURL,
                sysItem: [],
                eosMemoPre: {},
                siteFavicon: {},
                siteLogo: {},
                siteName: {},
                formData: {
                    eosMemoPre: null,
                    siteFavicon: null,
                    siteLogo: null,
                    siteName: null
                }
            };
        },
        created () {
            this.getfindSysParam();
        },
        methods: {
            getfindSysParam () {
                system.findSysParam((res) => {
                    this.sysItem = res.filter(data => {
                        if (data.paramGroup === 3) {
                            return data;
                        }
                    });
                    console.log(this.sysItem);
                    this.sysItem.filter(res => {
                        switch (true) {
                            case res.code === 'eosMemoPre' :
                                this.eosMemoPre = res;
                                break;
                            case res.code === 'siteFavicon' :
                                this.siteFavicon = res;
                                break;
                            case res.code === 'siteLogo' :
                                this.siteLogo = res;
                                break;
                            case res.code === 'siteName' :
                                this.siteName = res;
                                break;
                        }
                    });
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            updataSystem (data) {
                let code = data.code;
                let value = this.formData[code];
                if (!value) {
                    this.$Message.error({content: '请输入内容'});
                    return;
                }
                system.saveSysParam({
                    value: value,
                    sysParamId: data.sysParamId,
                    version: data.version
                }, (res) => {
                    this.getfindSysParam();
                    this.$Message.success({content: '修改成功'});
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            updataSystemImg (d) {
                var formData = new FormData();
                console.log(this.$refs.form.files[0],this.$refs.form1.files[0]);
                if (d == 106) {
                    formData.append('file', this.$refs.form1.files[0]);
                    if (/\.(jpg|png|jpeg|bmp|ico)/i.test(this.$refs.form1.files[0].name) === false) {
                        this.$Message.error({content: this.$t('kyc.znscpnghjpeghbmpdtp')});
                        return;
                    }
                } else if (d == 107) {
                    formData.append('file', this.$refs.form.files[0]);
                    if (/\.(jpg|png|jpeg|bmp|ico)/i.test(this.$refs.form.files[0].name) === false) {
                        this.$Message.error({content: this.$t('kyc.znscpnghjpeghbmpdtp')});
                        return;
                    }
                }else if (d == 114) {
                    formData.append('file', this.$refs.form2.files[0]);
                    if (/\.(jpg|png|jpeg|bmp|ico)/i.test(this.$refs.form2.files[0].name) === false) {
                        this.$Message.error({content: this.$t('kyc.znscpnghjpeghbmpdtp')});
                        return;
                    }
                }
                formData.append('sysParamId', d);
                system.updateAdminImg(formData, (res) => {
                    this.getfindSysParam();
                    this.$Message.success({content: this.$t('common.xgcg')});
                    document.getElementsByTagName('input').value = '';
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            }
        }
    };
</script>

<style scoped>
    .img {
        max-width: 60px;
        max-height: 40px;
    }
</style>
