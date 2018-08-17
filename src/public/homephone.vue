<template>
  <div class="homephone">
    <div class="header">
      <img src="../assets/images/home/logophone.png" />
      <img src="../assets/images/home/caidan.png" class="mune"/>
    </div>
    <div class="content">
      <div class="frame1">
        <h3>BITARK</h3>
        <span>A Perfect Security and Speed</span>
        <span>Solution for Exchanges</span>
      </div>
      <div class="frame2">
        <h3>币币交易</h3>
        <p>BITARK首创黑客免疫交易技术BITARK KO SOLUTION，旨在为全球的交易所提供百分之百杜绝黑客入侵，以及千万笔/秒的超高频交易解决方案，只需要7-10套服务器，便可服务全球224个国家和地区。</p>
        <p>BITARK KO SOLUTION是从底层CPU，到密钥机，到操作系统再到密钥策略管理系统、用户管理系统、分布式容灾管理中心等系统软件实现软硬件完美结合，为数字加密货币交易所提供终极安全保障的解决方案。</p>
        <img src="../assets/images/cen1.gif" />
      </div>
      <div class="frame3">
        <div class="frame3-left"> 
          <h3>OTC交易</h3>
          <p>BITARK团队已经研发了一款便捷的OTC交易系统，可以快速地进行OTC撮合交易，让数字资产与法币以最佳的方式进行迅速的价值交换。</p>
        </div>
        <div class="frame3-right">
          <img src="../assets/images/cen2.gif" />
        </div>
      </div>
      <div class="show"></div>
      <div class="frame4">
        <div class="frame4-top">
          <div class="frame4-left"></div>
          <div class="frame4-right">
            <h3>社区代币对接</h3>
            <p>通过制定完善的社区代币奖励规则，将社区进行代币化，同时对接数字货币交易所，促进数字资产流转，区块链生态搭建。</p>
          </div>
        </div>
        <div class="frame4-bottom">
          <img src="../assets/images/cen3.gif" />
        </div>
      </div>
      <div class="frame-footer">
        <div class="footer-contet">
          <p>Whitepaper download</p>
          <div class="download">
            <span>English</span>
            <span>中文</span>
          </div>
          <p>Follow us</p>
          <div class="icon">
            <a class="icon-facebook"></a>
            <a class="icon-twitter"></a>
            <a class="icon-telegram"></a>
            <a class="icon-linkedin"></a>
            <a class="icon-weixin"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.homephone{}
.header{height: 0.88rem;line-height: 0.88rem;width: 100%;background: #333333;text-align: center;overflow: hidden;}
.header img{width: 1.68rem;height: 0.38rem;margin-top: 0.22rem;}
.header img.mune{width: 0.44rem;height: 0.44rem; position: absolute;right: 0.3rem;}
.content{width: 100%;height: 100%;}
.frame1{height: 4rem;width: 100%;background: url(../assets/images/home/beijing.png) no-repeat center;position: relative;background-size: 100%;}
.frame1 h3{font-size: 0.36rem;color: rgb(0, 0, 0);position: absolute;top: 0.28rem;left: 0.28rem;}
.frame1 span{color: rgb(51,51,51);font-size: 0.24rem;position: absolute;left: 0.28rem;}
.frame1 span:nth-child(2){top: 0.82rem;}
.frame1 span:nth-child(3){top: 1.22rem}
.frame2{padding: 0.24rem;height: 8.06rem;background: #2f2f2f;text-align: center;}
.frame2 h3{color: #faf6f6;font-size: 0.36rem;margin-top: 0.1rem;text-align: left;}
.frame2 p{line-height: 0.42rem;font-size: 0.24rem;color: #ccc;text-align: left;}
.frame2 img{width: 75%;}
.frame3{height: 4.62rem;background:url(../assets/images/home/beijing2.png) no-repeat center;display: flex;}
.frame3-left {margin-left: 0.24rem;width: 50%;}
.frame3-left h3{font-size: 0.36rem;color: #292929;font-weight: bold;margin-top: 0.6rem;}
.frame3-left p{font-size: 0.24rem;color: #333;line-height: 0.4rem;}
.frame3-right img{width: 100%;height: 100%}
.frame3-right{margin-right: 0.24rem;width: 50%;}
.show{height: 57px;width: 100%;background: url(../assets/images/home/show.png) repeat-x;}
.frame4{height: 6.88rem;background: #2f2f2f;}
.frame4-top{display: flex;}
.frame4-left{width: 50%;margin-left: 0.24rem;}
.frame4-right{width: 50%;margin-right: 0.24rem;}
.frame4-right h3{font-size:0.36rem;color:#faf6f6;margin-top: 0.7rem;}
.frame4-right p{font-size: 0.24rem;color: #ccc;line-height: 0.42rem;}
.frame4-bottom img{width: 68%;}
.frame-footer{height: 3.32rem;width: 100%; background:#292929;position: relative;}
.footer-contet{height: 3.32rem;width: 100%; position: absolute;left: 0rem;right: 0rem;margin-top: 0.24rem;text-align: center;}
.footer-contet p{font-size: 0.3rem;font-weight: bold;color: #f0f0f0;}
.download {margin: 0.2rem 0 0.2rem 0}
.download span{display: inline-block;width: 1.8rem;height: 0.56rem;line-height: 0.56rem;border:2px solid #f0f0f0;border-radius: 0.1rem; cursor: pointer;color: #f0f0f0;font-size: 0.24rem;font-weight: bold;text-align: center;margin:0.2rem 0.3rem 0.25rem 0.2rem;}
.icon {margin-top: 0.2rem;}
.icon a{display: inline-block;width: 0.52rem;height: 0.42rem;color: #ffffff;}
</style>

