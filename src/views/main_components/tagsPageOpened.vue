<style lang="less">
    @import '../main.less';
</style>

<template>
    <div>
        <transition-group name="taglist-moving-animation">
            <Tag
                type="dot"
                v-for="item in pageTagsList2"
                :key="item.name"
                :name="item.name"
                @on-close="closePage"
                @click.native="linkTo(item.name, item.title)"
                :closable="item.name==='home_index'||item.name===menuListFirstName?false:true"
                :color="item.children?(item.children[0].name===currentPageName?'blue':'default'):(item.name===currentPageName?'blue':'default')"
            >{{ $t(item.title) }}</Tag>
        </transition-group>
    </div> <!--v-if="item.name==='1'"-->
</template>

<script>
export default {
    name: 'tagsPageOpened',
    data () {
        return {
            currentPageName: this.$route.name
        };
    },
    props: {
        pageTagsList: Array
    },
    computed: {
        title () {
            return this.$store.state.currentTitle;
        },
        pageTagsList2 () {
            return this.pageTagsList.slice(1)
        },
        menuListFirstName () {
          let menuList = this.$store.state.menuList
          if (menuList.length) {
              return menuList[0].children[0].name
          }
          return 'home_index'
        }
    },
    methods: {
        closePage (event, name) {
            this.$store.commit('removeTag', name);
            localStorage.pageOpenedList = JSON.stringify(this.$store.state.pageOpenedList);
            if (this.currentPageName === name) {
                let lastPageName = '';
                if (this.$store.state.pageOpenedList.length > 1) {
                    lastPageName = this.$store.state.pageOpenedList[1].name;
                } else {
                    lastPageName = this.$store.state.pageOpenedList[0].name;
                }
                this.$router.push({
                    name: lastPageName
                });
            }
        },
        linkTo (name, title) {
            this.$router.push({
                name: name
            });
        }
    },
    watch: {
        '$route' (to) {
            this.currentPageName = to.name;
        }
    }
};
</script>
