<template>
    <div class="notice-container">
        <div class="title"><i class="icon-volume-down"></i> <span>[{{$t('public.notice')}}]</span> </div>
        <div class="notice-list">
            <swiper :options="swiperOption" ref="mySwiperA">
                <!-- 幻灯内容 -->
                <swiper-slide v-for="item in notice"><a :href="getLink(item)" target="_blank">{{getTitle(item)}}</a></swiper-slide>
            </swiper>
        </div>
    </div>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default{
props:['notice'],
data(){
    return {
        swiperOption: {
            // 所有配置均为可选（同Swiper配置）
            direction : 'vertical',
            height: 25,
            autoplay: true, 
            speed: 400, 
            loop:true,
            setWrapperSize :true,
            observer:true,
        }
    }
},
computed: {
    ...mapGetters(['getLang']),
},
mounted() {
    
},
methods:{
    getTitle(item){
        let title = item.titleEn
        switch(this.getLang){
            case 'zh-CN':
            title = item.title
            break
            case 'cht':
            title = item.titleCht
            break
        }
        return title
    },
    getLink(item){
        let link = item.linkEn
        switch(this.getLang){
            case 'zh-CN':
            link = item.link
            break
            case 'cht':
            link = item.linkCht
            break
        }
        return link
    },
}
}
</script>
<style type="text/css" scoped="">
.notice-container {display: flex; font-size: 13px;}
.notice-container .title {line-height: 30px;}
.notice-container .title i {color: #D79802; font-size: 16px; vertical-align: middle;}
.notice-container .title span {color: #D79802; padding-left: 5px; padding-right: 15px; padding-top: 2px;}
.notice-list {flex: 1;}
.notice-list .swiper-slide { color: #fff; height: 25px; line-height: 35px;}
.notice-list .swiper-slide a:hover {text-decoration: underline;}
</style>