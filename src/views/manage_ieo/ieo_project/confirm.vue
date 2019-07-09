<template>
    <Card class="cont">
        <h2>{{name === 1 ? vm.$t('ieo.nqdykkfb') : vm.$t('ieo.nqdysbjd')}}</h2>
        <Button type="primary" :disabled="state" @click="tod()">{{vm.$t('common.qd')}}</Button>
        <Button :disabled="state" @click="close()">{{vm.$t('common.qx')}}</Button>
        <div v-if="state">
            <Spin fix>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <!--<div>Loading</div>-->
            </Spin>
        </div>
    </Card>
</template>

<script>
    import ieoApi from '../../../api/ieo';

    export default {
        name: 'confirm',
        props: ['item', 'name'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                state: false
            };
        },
        methods: {
            tod () {
                this.state = true;
                let data = {
                    projectId: this.item.projectId
                };
                if (this.name === 1) {
                    ieoApi.debit(data, res => {
                        this.$Message.success({content: res});
                        this.close();
                        this.state = false;
                    }, msg => {
                        this.$Message.error({content: msg});
                        this.state = false;
                    });
                } else {
                    ieoApi.unfreeze(data, res => {
                        this.$Message.success({content: res});
                        this.close();
                        this.state = false;
                    }, msg => {
                        this.$Message.error({content: msg});
                        this.state = false;
                    });
                }
            },
            close () {
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style scoped lang="less">
    .cont {
        padding: 30px;

        button {
            margin: 0 20px;
        }

        h2 {
            font-weight: 400;
            margin-bottom: 14px;
            text-align: center;
        }
    }

    .demo-spin-icon-load {
        font-size: 32px !important;
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
