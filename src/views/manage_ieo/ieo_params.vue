<template>
    <Card>
        <p slot="title">{{$t('nav.ieocs')}}</p>
        <div class="cont">
            <p>{{$t('ieo.ptjsbnt')}}</p>
            <p><img :src="util.baseURL+data.value"></p>
            <div>
                <input ref="form" type="file"/>
                <Button @click="updataSystemImg()">上传</Button>
            </div>
        </div>
    </Card>
</template>

<script>
    import system from '../../api/systemparam';
    import util from '../../libs/util';

    export default {
        data () {
            return {
                util: util,
                data: {}
            };
        },
        created () {
            this.getfindSysParam();
        },
        methods: {
            getfindSysParam () {
                system.findSysParam((res) => {
                    res.filter(next => {
                        if (next.sysParamId === '136') {
                            this.data = next;
                        }
                    });
                }, (msg) => {
                    this.$Message.error({content: msg});
                });
            },
            updataSystemImg () {
                var formData = new FormData();
                formData.append('file', this.$refs.form.files[0]);
                if (/\.(jpg|png|jpeg|bmp|ico)/i.test(this.$refs.form.files[0].name) === false) {
                    this.$Message.error({content: this.$t('kyc.znscpnghjpeghbmpdtp')});
                    return;
                }
                formData.append('sysParamId', '136');
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

<style scoped lang="less">
    .cont {
        display: flex;

        p {
            padding: 5px 20px;

            img {
                max-width: 200px;
                max-height: 100px;
            }
        }
    }
</style>
