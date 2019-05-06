<template>
    <div class="errorDe" style="width: 1000px;height: 650px;padding:20px;background:#fff;">
        <p slot="title">{{vm.$t('monitoring.cwxxxq')}}
             <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <Card style="overflow:auto;height: 570px;">
            {{this.data}}
        </Card>
    </div>
</template>
<script>
import monitApi from '../../api/monitoring'
import util from '../../libs/util'
export default {
    props: ['errorLogId'],
    data () {
        const vm = window.vm;
        return {
            vm: vm,
            data: []
        }
    },
    created () {
        this.getrDetails()
    },
    methods: {
        getrDetails () {
            monitApi.findeErrorDetails(this.errorLogId, (res) => {
                this.data = res
            })
        },
        closeDialog () {
            this.$emit('removeDialog')
        }
    }
}
</script>
<style scoped>
.errorDe p{margin-bottom: 20px;}
</style>


