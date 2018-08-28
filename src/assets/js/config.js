const config = {
  domain: process.env.NODE_ENV === 'development' ? 'dev.koall.io' : location.host.split(':')[0],
  imageType: /\.(jpg|png|jpeg|bmp)/i,
  protocol: window.location.protocol === 'https:' ? 'wss://': 'ws://'
}

export default config
