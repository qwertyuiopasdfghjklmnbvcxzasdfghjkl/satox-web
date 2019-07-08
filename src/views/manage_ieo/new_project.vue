<template>
    <Card>
        <p slot="title">{{$t('nav.xjxm')}}</p>
        <project></project>
    </Card>
</template>

<script>
    import project from './components/project';
    import ieoApi from '../../api/ieo';

    export default {
        name: 'new_project',
        components: {project},
        methods: {
            // add: res => {
            //     console.log(res);
            //     ieoApi.addProject(res, (data) => {
            //         this.$Message.success({content: this.$t('common.tjcg')});
            //         this.$router.push({name: 'ieo_project_index'})
            //     }, (msg) => {
            //         this.$Message.error({content: msg});
            //     });
            // }
        }
    };
</script>

<style scoped>

</style>
