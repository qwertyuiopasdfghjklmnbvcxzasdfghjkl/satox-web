<template>
  <div class="bk-wrap index-slider">
     <div class="bk-main index-content">
      <slider :pages="pages" :sliderinit="sliderinit"  >
        &lt;!&ndash; slot  &ndash;&gt;
      </slider>
     </div>
  </div>
</template>

<script>
  import banner01 from './banner01'
  import banner02 from './banner02'
  import slider from 'vue-concise-slider'// 引入slider组件
  export default {
    data () {
      return {
        pages: [
          {
            component: banner01
          },
          {
            component: banner02
          }
        ],
        // 滑动配置[obj]
        sliderinit: {
          currentPage: 0, // 当前页码
          thresholdDistance: 500, // 滑动判定距离
          thresholdTime: 100, // 滑动判定时间
          autoplay: 15000, // 自动滚动[ms]
          loop: true, // 循环滚动
          direction: 'horizontal', // 方向设置，垂直滚动
          infinite: 1, // 无限滚动前后遍历数
          slidesToScroll: 1, // 每次滑动项数
          timingFunction: 'ease', // 滑动方式
          duration: 0 // 滑动时间
        }
      }
    },
    components: {
      slider
    }
  }
</script>

<style scoped>
  .bk-wrap{position:relative;overflow:hidden;width:100%;}
  .bk-main{position:relative;overflow:hidden;margin:0 auto;width:1200px;}
  .index-slider{background: #0c1426;}
  .index-slider .index-content{
    height: 360px;
  }
  .index-content .slider-item{
     background-size: initial;
  }
  .slider-container /deep/ .slider-pagination-bullets{
    bottom: 26px;
  }
.slider-container /deep/ .slider-pagination-bullets>.slider-pagination-bullet{
    background:#47577f none repeat scroll 0 0;
    border-radius: 5px!important;
    display: inline-block!important;
    height: 7px!important;
    opacity: 1;
    width: 35px!important;
    cursor: pointer!important;
    margin: 0 5px;
  }

  .slider-container /deep/ div.slider-pagination-bullets .slider-pagination-bullet-active{
    background: #48bcff none repeat scroll 0 0;
    opacity: 1;
  }
  .beijing001{background:#0c1426;}
  .beijing001-center{display:flex;height:360px;flex-flow:row wrap;justify-content:space-between;align-items:center;}
  .slider-nav{position:absolute;bottom:22px;left:45%;}
  .slider-nav ul{margin:0 auto;width:170px;}
  .slider-nav ul li{display:inline-block;width:35px;}
  .slider-nav ul li span{display:inline-block;width:30px;height:4px;border-radius:2px;background:#47577f;}
  .slider-nav ul li span.slider-this{background:#48bcff;}
</style>
