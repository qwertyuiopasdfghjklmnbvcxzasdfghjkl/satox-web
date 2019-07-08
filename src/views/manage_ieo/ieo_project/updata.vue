<template>
    <Card style="width: 1000px">
        <p slot="title">
            {{vm.$t('ieo.xgsx')}}
            <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
        </p>
        <project :cont="item" @updata="updata()"></project>
    </Card>
</template>

<script>
    import project from '../components/project';

    export default {
        components: {project},
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm
            };
        },
        created () {
            console.log(this.item);
        },
        methods: {
            updata () {
                this.$emit('removeDialog');
                this.$emit('okCallback');
            },
            closeDialog () {
                this.$emit('removeDialog');
                // this.$emit('okCallback');
            },
        }
    };
</script>

<style scoped>

</style>
