import BigNumber from '@/assets/js/bignumber.min'
/**
 * 币种深度图
 * asks: 卖
 * bids: 买
 * opts
 * {
 * container: 容器
 * riseColor: 涨
 * fallColor: 跌
 * }
 */
(function (KLineDepth) {
  if (typeof module === 'object') {
    module.exports = KLineDepth
  } else {
    window.KLineDepth = KLineDepth
  }
})(function (opts) {
  opts = opts || {}
  opts.container = opts.container || document.body
  let riseColor = opts.riseColor || '#0ee7a5' // 绿涨
  let fallColor = opts.fallColor || '#e76d42' // 红跌
  let fontColor = opts.fontColor || '#d6dff9' // 字体颜色
  let gridLineColor = opts.gridLineColor  || '#313c5a' // 表格线颜色
  let middleLineColor = opts.middleLineColor || '#cbd4ec' // 中间线颜色
  let tpFillStyle = opts.tpFillStyle || '#2d344e' // 提示背景色
  let tpStrokeStyle = opts.tpStrokeStyle || '#d6dff9' // 提示文字边框
  let tpTextColor = opts.tpTextColor || '#fff' // 提示文字"Price"颜色
  let tpTextPriceColor = opts.tpTextPriceColor || '#fff' // 提示文字价格颜色
  let isOpacity = opts.isOpacity !== false // 背景是否半透明，默认半透明
  let fontFamily = opts.fontFamily || 'Microsoft YaHei' // 字体
  let ySplitLen = Math.min(Math.max(opts.ySplitLen || 30, 30), 50) // 纵向切割间距
  let xSplitLen = Math.min(Math.max(opts.xSplitLen || 100, 30), 100) // 横向切割间距
  let isAmountShowLeft = opts.isAmountShowLeft === true
  let fixed = opts.fixed || 8
  let zoomRatio = new BigNumber(1)

  // polyfill 提供了这个方法用来获取设备的 pixel ratio
	var getPixelRatio = function () {
		var context = document.createElement("canvas");
		var backingStore = context.backingStorePixelRatio ||
			context.webkitBackingStorePixelRatio ||
			context.mozBackingStorePixelRatio ||
			context.msBackingStorePixelRatio ||
			context.oBackingStorePixelRatio ||
			context.backingStorePixelRatio || 1;

		return (window.devicePixelRatio || 1) / backingStore
  }
  let _ratio = 3 || getPixelRatio()

  var container = opts.container
  var cWidth = container.clientWidth * _ratio
  var cHeight = container.clientHeight * _ratio

  function createCanvas (zIdx) {
    let canvas = document.createElement('canvas')
    canvas.width = `${cWidth}`
    canvas.height = `${cHeight}`
    canvas.style.cssText = `width:100%;height:100%;cursor:default;overflow:hidden;position:absolute;z-index:${zIdx};left:0;top:0;`
    container.appendChild(canvas)

    return canvas
  }
  var gridCanvas = createCanvas(0)
  var depthCanvas = createCanvas(1)
  var markCanvas = createCanvas(2)

  function roundRect(x, y, w, h, r, dirct, title) {
    r = r * _ratio
    w = w * _ratio
    h = h * _ratio
    if (w < 2 * r) {
      r = w / 2
    }
    if (h < 2 * r) {
      r = h / 2
    }
    this.font = `${12 * _ratio}px ` + fontFamily
    let w1 = this.measureText(title).width
    let w2 = this.measureText('Price').width
    w = Math.max(w, Math.ceil(w1 + w2 + 20))
    if (dirct === 'left') {
      x = x + 5 * _ratio
      y = y - h - 5 * _ratio
    } else if (dirct === 'right') {
      x = x - w - 5 * _ratio
      y = y - h - 5 * _ratio
    }
    this.fillStyle = tpFillStyle
    this.strokeStyle = tpStrokeStyle
    this.lineWidth = 1 * _ratio
    this.beginPath()
    this.moveTo(x + r + 0.5, y + 0.5)
    this.arcTo(x + w + 0.5, y + 0.5, x + w + 0.5, y + h + 0.5, r) // 右上角
    if (dirct === 'left') {
      this.arcTo(x + w + 0.5, y + h + 0.5, x + 0.5, y + h + 0.5, r) // 右下角
      this.lineTo(x + 5 * _ratio + 0.5, y + h + 0.5)
      this.lineTo(x - 3 * _ratio + 0.5, y + h + 3 * _ratio + 0.5)
      this.lineTo(x + 0.5, y + h - 5 + 0.5) // 左下角
    } else if (dirct === 'right') {
      this.lineTo(x + w + 0.5, y + h - 5 * _ratio + 0.5)
      this.lineTo(x + w + 3 * _ratio + 0.5, y + h + 3 * _ratio + 0.5)
      this.lineTo(x + w - 5 * _ratio + 0.5, y + h + 0.5)
      this.arcTo(x + 0.5, y + h + 0.5, x + 0.5, y + 0.5, r) // 左下角
    } else {
      this.arcTo(x + w + 0.5, y + h + 0.5, x + 0.5, y + h + 0.5, r) // 右下角
      this.arcTo(x + 0.5, y + h + 0.5, x + 0.5, y + 0.5, r) // 左下角
    }
    this.arcTo(x + 0.5, y + 0.5, x + w + 0.5, y + 0.5, r) // 左上角
    this.closePath()
    this.fill()
    this.stroke()
    if (dirct === 'left') {
      this.textAlign = 'left'
      this.textBaseline = 'middle'
      this.fillStyle = tpTextColor
      this.fillText('Price', x + 7, y + h / 2)
      this.fillStyle = tpTextPriceColor
      this.fillText(title, x + w2 + 13, y + h / 2)
    } else if (dirct === 'right') {
      this.textAlign = 'right'
      this.textBaseline = 'middle'
      this.fillStyle = tpTextPriceColor
      this.fillText(title, x + w - 7, y + h / 2)
      this.fillStyle = tpTextColor
      this.fillText('Price', x + w - w1 - 13, y + h / 2)
    }
    return this
  }

  function colorRgb(alpha) {
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
    var sColor = this.toLowerCase()
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
          var sColorNew = '#'
          for(var i=1; i<4; i+=1){
            sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
          }
          sColor = sColorNew
        }
        // 处理六位的颜色值
        var sColorChange = []
        for(var i = 1; i < 7; i += 2){
          sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
        }  
        return 'rgba(' + sColorChange.join(',') + ',' + (alpha === undefined ? 1 : alpha) + ')'
    } else {
      return sColor
    }
  }
  
  // 获取自然数
  function getNaturalNumber() {
    let s = this.split('.')
    if (s[1]) {
      let m = s[1].match(/^[0]*/g)
      return m ? m[0].length + 1 : 1
    } else {
      return 0
    }
  }

  function toMoney() {
    let s = this.split('.')
    let s0 = s[0]
    let end = s0.length % 3
    let arr = []
    if (end != 0) {
      arr.push(s0.substring(0, end))
    }
    let count = Math.floor(s0.length / 3)
    if (count > 0) {
      s0 = s0.substring(end)
      do {
        arr.push(s0.substring(0, 3))
        s0 = s0.substring(3)
      } while (s0.length)
    }
    s[0] = arr.join(',')
    return s.join('.')
  }
  
  function ChartManager () {
    this._rightWidth = (isAmountShowLeft ? 0 : 100) * _ratio
    this._bottomHeight = 30 * _ratio
    this._top = 20 * _ratio
    this._left = 0

    this._grid = gridCanvas.getContext('2d')
    this._depth = depthCanvas.getContext('2d')
    this._mark = markCanvas.getContext('2d')
    
    let self = this
    markCanvas.addEventListener('mousemove', function (e) {
      let p = markCanvas.getBoundingClientRect ? markCanvas.getBoundingClientRect() : {x: 0, y: 0}
      self._markPos = {
        x: Math.floor(e.pageX - p.x) * _ratio,
        y: Math.floor(e.pageY - p.y) * _ratio
      }
      self.drawMark()
    }, false)
    markCanvas.addEventListener('mouseout', function () {
      self._markPos = null
      self.drawMark()
    })
    markCanvas.addEventListener('onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll', function (e) {
      let delta = -e.wheelDelta || e.detail
      if (delta > 0) {
        zoomRatio = BigNumber.min(10, zoomRatio.mul(1.1))
      } else if (delta < 0) {
        zoomRatio = BigNumber.max(0.01, zoomRatio.mul(0.9))
      }
      self.drawGrid()
      self.drawDepth()
      e.preventDefault()
    }, false)

    this.init()
    this.drawGrid()
  }
  ChartManager.prototype.init = function () {
    cWidth = container.clientWidth * _ratio
    cHeight = container.clientHeight * _ratio
    this._width = cWidth
    this._height = cHeight
    this._right = this._width - this._rightWidth
    this._bottom = this._height - this._bottomHeight
    gridCanvas.width = depthCanvas.width = markCanvas.width = `${cWidth}`
    gridCanvas.height = depthCanvas.height = markCanvas.height = `${cHeight}`
  }
  // y分割
  const ySplit = function (callback) {
    let avg = ySplitLen * _ratio
    let y = this._bottom - avg
    while (y >= this._top) {
      callback && callback(y, avg)
      y -= avg
    }
  }
  // x分割
  const xSplit = function (callback) {
    let middle = Math.floor(this._right / 2)
    let avg = xSplitLen * _ratio
    let x = middle - avg / 2
    let i = 0
    let distance = null
    while (x > avg / 2) {
      distance = i === 0 ? -avg / 2 : distance - avg
      callback && callback(x, distance)
      x -= avg
      i = 1
    }
    x = middle + avg / 2
    i = 0
    while (x < this._right - avg / 2) {
      distance = i === 0 ? avg / 2 : distance + avg
      callback && callback(x, distance)
      x += avg
      i = 1
    }
  }
  ChartManager.prototype.drawGrid = function () {
    let ctx = this._grid
    // clear canvas
    ctx.clearRect(0, 0, this._width, this._height)

    // 区域线
    ctx.strokeStyle = gridLineColor
    ctx.lineWidth = 1 * _ratio
    ctx.beginPath()
    // 底部
    ctx.moveTo(0.5, this._bottom + 0.5)
    ctx.lineTo(this._width + 0.5, this._bottom + 0.5)
    // 右边
    ctx.moveTo(this._right + 0.5, 0.5)
    ctx.lineTo(this._right + 0.5, this._bottom + 0.5)
    
    // y分割线
    ySplit.call(this, (y) => {
      ctx.moveTo(0.5, y + 0.5)
      ctx.lineTo(this._right + 0.5, y + 0.5)
    })

    // x分割线
    xSplit.call(this, (x) => {
      ctx.moveTo(x + 0.5, 0.5)
      ctx.lineTo(x + 0.5, this._bottom + 0.5)
    })
    ctx.stroke()

    // 中间线
    ctx.beginPath()
    ctx.strokeStyle = middleLineColor
    ctx.moveTo(Math.floor(this._right / 2) + 0.5, 20 + 0.5)
    ctx.lineTo(Math.floor(this._right / 2) + 0.5, this._bottom + 0.5)
    ctx.stroke()
  }
  // 合并深度Amounts
  const mergeDepthAmounts = function (res) {
    let data = []
    let min = new BigNumber(0)
    let max = new BigNumber(0)
    res.forEach((item, index) => {
      let c = null
      if (index === 0) {
        c = {
          price: new BigNumber((item[0] || 0).toString()),
          amounts: new BigNumber((item[1] || 0).toString())
        }
        min = c.price
        max = c.price
      } else {
        c = {
          price: new BigNumber((item[0] || 0).toString()),
          amounts: (new BigNumber((item[1] || 0).toString())).add(data[data.length - 1].amounts)
        }
        min = BigNumber.min(min, c.price)
        max = BigNumber.max(max, c.price)
      }
      data.push(c)
    })
    return {
      min: min,
      max: max,
      data: data
    }
  }
  ChartManager.prototype.drawDepth = function (res) {
    if (res) {
      this._data = res
    }
    res = res || this._data || []
    let ctx = this._depth
    // clear canvas
    ctx.clearRect(0, 0, this._width, this._height)

    ctx.textAlign = this._rightWidth === 0 ? 'left' : 'center'
    ctx.font = `${12 * _ratio}px ${fontFamily}`
    ctx.textBaseline = 'middle'
    ctx.fillStyle = fontColor

    // 卖
    let asks = mergeDepthAmounts(res.asks)
    this.asks = asks
    // 买
    let bids = mergeDepthAmounts(res.bids)
    this.bids = bids

    // 量
    let askAmounts = asks.data.length ? asks.data[asks.data.length - 1].amounts : new BigNumber(0)
    let bidAmounts = bids.data.length ? bids.data[bids.data.length - 1].amounts : new BigNumber(0)
    let amounts = BigNumber.max(askAmounts, bidAmounts)
    let pxAmount = new BigNumber(Math.ceil(amounts.div(this._bottom - 60 * _ratio).toFixed(1)))
    if (pxAmount.equals(0)) {
      pxAmount = new BigNumber(1)
    }
    this._pxAmount = pxAmount
    ySplit.call(this, (y) => {
      let am = toMoney.call(pxAmount.mul(this._bottom - y).toFixed(0))
      if (this._rightWidth === 0) {
        ctx.fillText(am, 5, y)
      } else {
        ctx.fillText(am, this._right + this._rightWidth / 2, y)
      }
    })

    // 价格
    asks.min = asks.min.equals(0) ? bids.max : asks.min
    if (asks.max.equals(0)) {
      asks.max = asks.min
    }
    bids.max = bids.max.equals(0) ? asks.min : bids.max
    if (bids.min.equals(0)) {
      bids.min = bids.max
    }

    // 默认没像素值
    let pxPrice = new BigNumber(1)
    pxPrice = pxPrice.div(Math.pow(10, fixed))

    // 默认没像素值
    let centerPrice = asks.min.minus(asks.min.minus(bids.max).div(2))
    if (centerPrice.equals(0)) {
      // 设置默认中间值
      centerPrice = pxPrice.mul(this._right / 2)
    }
    this._centerPrice = centerPrice

    // 计算买单最大没像素的价格
    let bidPxPrice = BigNumber.max(centerPrice, bids.max).minus(bids.min).div(this._right / 2).toFixed()
    bidPxPrice = (new BigNumber(bidPxPrice)).toFixed(getNaturalNumber.call(bidPxPrice))
    // 计算卖卖单没像素的价格
    let askPxPrice = asks.max.minus(BigNumber.min(centerPrice, asks.min)).div(this._right / 2).toFixed()
    askPxPrice = (new BigNumber(askPxPrice)).toFixed(getNaturalNumber.call(askPxPrice))
    let avgPxPrice = BigNumber.min(bidPxPrice, askPxPrice)
    if (!avgPxPrice.equals(0)) {
      pxPrice = avgPxPrice
    }
    pxPrice = pxPrice.mul(zoomRatio)
    this._pxPrice = pxPrice

    // X轴Price信息
    ctx.textAlign = 'center'
    let prevX = Math.floor(this._right / 2)
    let nextX = prevX
    xSplit.call(this, (x, distance) => {
      let priceX = centerPrice.add(pxPrice.mul(distance))
      if (priceX.lt(0)) {
        return
      }
      let title = priceX.toFixed(fixed, 1)
      let tWidth = Math.floor(ctx.measureText(title).width / 2)
      if (distance < 0 && (x - tWidth <= 0 || x + tWidth >= prevX)) {
        return
      } else if (distance > 0 && (x + tWidth >= this._right || x - tWidth <= nextX)) {
        return
      }
      if (distance < 0) {
        prevX = x - tWidth
      } else if (distance > 0) {
        nextX = x + tWidth
      }
      ctx.fillText(title, x + 0.5, this._bottom + (this._bottomHeight / 2))
    })

    this.drawDepthArea()
  }
  const drawDepthArea = function (data, color, dataType, callback) {
    let ctx = this._depth
    let middleX = new BigNumber(Math.floor(this._right / 2))
    let bottom = new BigNumber(this._bottom)
    let centerPrice = this._centerPrice
    let pxPrice = this._pxPrice
    let pxAmount = this._pxAmount

    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = 1 * _ratio
    ctx.beginPath()
    let prevY = null
    let minY = null
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      let x = Number(middleX.minus(centerPrice.minus(item.price).div(pxPrice)).toFixed(0, 1))
      let y = Number(bottom.minus(item.amounts.div(pxAmount).toFixed(0, 1)))
      if (callback && callback(x, (x) => {
        if (i === 0) {
          ctx.moveTo(x + 0.5, bottom - 0.5)
          ctx.lineTo(x + 0.5, y)
          ctx.lineTo(x + 0.5, bottom - 0.5)
          return
        }
        ctx.lineTo(x + 0.5, prevY - 0.5)
        ctx.lineTo(x + 0.5, y)
        ctx.lineTo(x + 0.5, bottom - 0.5)
      })) {
        break
      }
      if (dataType === 'bid') {
        // 买
        x = Math.min(this._right, x) 
      } else if (dataType === 'ask') {
        // 卖
        x = Math.max(0, x)
      }
      if (i === 0) {
        minY = bottom
        ctx.moveTo(x + 0.5, bottom - 0.5)
      } else {
        ctx.lineTo(x + 0.5, prevY - 0.5)
      }
      minY = Math.min(minY, y)
      ctx.lineTo(x + 0.5, y - 0.5)
      if (i === data.length - 1) {
        ctx.lineTo(x + 0.5, bottom - 0.5)
      }
      prevY = y
    }
    var radialGradient = ctx.createLinearGradient(0, 0, 0, this._bottom)
    radialGradient.addColorStop(0, colorRgb.call(color, 0.6))
    radialGradient.addColorStop(1, colorRgb.call(color, 0.05))
    ctx.fillStyle = isOpacity ? radialGradient : color
    ctx.fill()
    ctx.stroke()
  }
  ChartManager.prototype.drawDepthArea = function () {
    // 买
    drawDepthArea.call(this, this.bids.data, riseColor, 'bid', (x, callback) => {
      let bool = x <= 0
      bool && callback && callback(1)
      return bool
    })
    // 卖
    drawDepthArea.call(this, this.asks.data, fallColor, 'ask', (x, callback) => {
      let bool = x >= this._right
      bool && callback && callback(this._right - 1)
      return bool
    })

    this.drawMark()
  }
  const drawMark = function (data, direct, callback) {
    let ctx = this._mark
    let pos = this._markPos
    let middleX = new BigNumber(Math.floor(this._right / 2))
    let bottom = new BigNumber(this._bottom)
    let centerPrice = this._centerPrice
    let pxPrice = this._pxPrice
    let pxAmount = this._pxAmount
    let curPos = null
    let px = pos.x
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      let x = Number(middleX.add(item.price.minus(centerPrice).div(pxPrice)).toFixed(0, 1))
      let y = Number(bottom.minus(item.amounts.div(pxAmount).toFixed(0, 1)))
      if (i === data.length - 1 && callback && callback(x)) {
        curPos = null
        break
      }
      if (px === x) {
        curPos = {x: x, y: y, title: item.price.toFixed(fixed)}
      } else if (callback && callback(x) && i < data.length - 1) {
        curPos = {
          x: px,
          y: y,
          title: centerPrice.add(pxPrice.mul(px - middleX)).toFixed(fixed)
        }
      }
    }
    if (curPos) {
      roundRect.call(ctx, curPos.x, curPos.y, 80, 36, 4, direct, curPos.title)
    } else {
      let price = centerPrice.add(pxPrice.mul(px - middleX)).toFixed(fixed)
      roundRect.call(ctx, px, this._bottom - 1, 80, 36, 4, direct, price)
    }
  }
  // 标注
  ChartManager.prototype.drawMark = function () {
    let ctx = this._mark
    // clear canvas
    ctx.clearRect(0, 0, this._width, this._height)

    let pos = this._markPos
    if (!pos) {
      return
    }
    if (pos.x > this._right) {
      return
    }
    let middleX = new BigNumber(Math.floor(this._right / 2))
    let px = pos.x
    if (middleX > px) {
      // 买
      drawMark.call(this, this.bids.data, 'left', (x) => {
        return px < x
      })
    } else if (middleX < px) {
      // 卖
      drawMark.call(this, this.asks.data, 'right', (x) => {
        return px > x
      })
    }
  }
  ChartManager.prototype.resize = function () {
    this.init()
    this.drawGrid()
    this.drawDepth()
  }

  var cm = new ChartManager()

  return cm
})
