<template>
    <card>
        <p slot="title">
            {{vm.$t('exchange.xztsyh')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <div class="cont">
            <label><span>{{vm.$t('common.yhm')}}：</span><Input v-model="form.username"></Input></label>
            <label>
                <span>{{vm.$t('exchange.yhlx')}}：</span>
                <Select v-model="form.specialType">
                    <Option :value="1">{{vm.$t('finance.sxfzh')}}</Option>
                    <Option :value="2">{{vm.$t('finance.jqrzh')}}</Option>
                </Select>
            </label>
            <p class="but_box">
                <Button type="primary" @click="add">{{vm.$t('common.tj')}}</button>
            </p>
        </div>
    </card>
</template>

<script>
    import system from '../../api/systemparam';

    export default {
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                form: {
                    username: null,
                    specialType: 1
                }
            };
        },
        methods: {
            add () {
                if (!this.form.username) {
                    this.$Message.error({content: this.vm.$t('common.bnwk')});
                } else {
                    this.todo();
                }
            },
            todo () {
                let data = this.form;
                system.addAccount(data, (res) => {
                    this.$Message.success({content: this.vm.$t('common.tjcg')});
                    this.$emit('okCallback');
                    this.$emit('removeDialog');
                }, (msg) => {
                    this.$Message.error({content: msg});
                    this.$emit('removeDialog');
                });
            },
            closeDialog () {
                this.$emit('removeDialog');
            }
        }
    };
</script>

<style scoped lang="less">
    .cont {
        width: 360px;

        label {
            display: flex;
            align-items: center;
            margin: 6px 0;

            span {
                width: 110px;
            }
        }
    }

    .but_box {
        text-align: center;
        margin-top: 15px;
    }
</style>
