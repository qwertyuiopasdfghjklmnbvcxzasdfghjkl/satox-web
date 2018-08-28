/**
 * opts 参数
 * {
 * container: {dom} 容器
 * scale: {number} itemWidth索引，默认6
 * klineType: {string} K线图类型(btc\eth)，默认btc
 * chartSetting: {boolean} 是否缓存配置，默认true
 * hideDepth: {boolean} 是否隐藏深度信息，默认false
 * onAsksAndBidsCallback: {function} 深度回调函数，默认空
 * onLastTradesCallback: {function} 最新买卖信息回调函数，默认空
 * }
 * 
 * 横向轴文字 TimelinePlotter.prototype.Draw
 * 纵向轴文字和线 RangePlotter.prototype.Draw
 * 划分区域线(实线) TableLayout.prototype.drawGrid
 * 虚线区域 CGridPlotter.prototype.Draw
 * 主区域柱形图 CandlestickPlotter.prototype.Draw
 * 主区域顶部信息 MainInfoPlotter.prototype.Draw
 * volume区域柱状图 IndicatorPlotter.prototype.drawVolumeStick
 * 折线图 Plotter.drawLines
 * volume区域顶部信息 IndicatorInfoPlotter.prototype.Draw
 * 主区域最大最小值 MinMaxPlotter.prototype.Draw
 * 右侧区域绘图仪 COrderGraphPlotter.prototype.Draw
 * 最后Volume文字绘图仪 LastVolumePlotter.prototype.Draw
 * 最后交易文字绘图仪 LastClosePlotter.prototype.Draw
 * 横向轴文字区域高度 TemplateMeasuringHandler.onMeasuring
 * 横向选择显示信息 TimelineSelectionPlotter.prototype.Draw
 * 纵向选择显示信息 RangeSelectionPlotter.prototype.Draw
 * 
 * theme 参数
 * {
 * Positive: 涨柱图颜色
 * Negative: 跌柱图颜色
 * PositiveDark: 
 * NegativeDark: 
 * Unchanged: 
 * Background: mainCanvas背景色
 * Cursor: 光标滑动线颜色
 * RangeMark: 右侧范围标记字体颜色
 * Indicator0: MA5字体颜色
 * Indicator1: MA10字体颜色
 * Indicator2: MA30字体颜色
 * Indicator3: 
 * Indicator4: 未使用
 * Indicator5: 未使用
 * Grid0: mainCanvas表格线颜色
 * Grid1: mainCanvas范围分界线颜色、overflayCanvas区域分界线颜色
 * Grid2: 未使用
 * Grid3: 底部横向区域鼠标滑动tip提示边框线颜色
 * Grid4: 右侧纵向区域鼠标滑动tip提示表框线颜色
 * TextPositive: 顶部tip提示涨幅“涨”字体颜色
 * TextNegative: 顶部tip提示涨幅“跌”字体颜色
 * Text0: 未使用
 * Text1: 未使用
 * Text2: 底部横向区域和右侧纵向区域范围字体颜色
 * Text3: 右侧纵向区域鼠标滑动tip提示字体颜色
 * Text4: 顶部和volume(量)tip提示字体颜色
 * LineColorNormal: 工具线颜色
 * LineColorSelected: 鼠标滑动到工具线颜色
 * CircleColorFill: 工具线圆圈填充色
 * CircleColorStroke: 工具线圆圈边框色
 * }
 */
(function (KLineChart) {
  if (typeof module === 'object') {
    module.exports = KLineChart
  } else {
    window.KLineChart = KLineChart
  }
})(function (opts) {
  String.prototype.getDecimalDigits = function () {
    let a = this.split('.')[1]
    return a ? a.length : 0
  }

  // polyfill 提供了这个方法用来获取设备的 pixel ratio
	function getPixelRatio () {
		var context = document.createElement("canvas");
		var backingStore = context.backingStorePixelRatio ||
			context.webkitBackingStorePixelRatio ||
			context.mozBackingStorePixelRatio ||
			context.msBackingStorePixelRatio ||
			context.oBackingStorePixelRatio ||
			context.backingStorePixelRatio || 1;

		return (window.devicePixelRatio || 1) / backingStore;
  }

  var klineType = opts.klineType || 'eosbtc';

  var GLOBAL_VAR = {
    KLineData: {},
    time_type: '1min',
    market_from: '1',
    market_from_name: 'ttrans',
    limit: '1000',
    requestParam: '',
    chartMgr: null,
    G_HTTP_REQUEST: null,
    TimeOutId: null,
    button_down: false,
    init: false,
    fixedNumber: opts.fixedNumber || 8,
    ratio: getPixelRatio(),
    periodMap: {'01w': '1week', '03d': '3day', '01d': '1day', '12h': '12hour', '06h': '6hour', '04h': '4hour', '02h': '2hour', '01h': '1hour', '30m': '30min', '15m': '15min', '05m': '5min', '03m': '3min', '01m': '1min'},
    tagMapPeriod: {'1w': '01w', '3d': '03d', '1d': '01d', '12h': '12h', '6h': '06h', '4h': '04h', '2h': '02h', '1h': '01h', '30m': '30m', '15m': '15m', '5m': '05m', '3m': '03m', '1m': '01m'},
    url: ''
  }

  var container = opts.container;
  var containerWidth = container.clientWidth * GLOBAL_VAR.ratio;
  var containerHeight = container.clientHeight * GLOBAL_VAR.ratio;

  var chart_mainCanvas = document.createElement('canvas');
  var chart_overlayCanvas = document.createElement('canvas');
  chart_mainCanvas.width = chart_overlayCanvas.width = `${containerWidth}`;
  chart_mainCanvas.height = chart_overlayCanvas.height = `${containerHeight}`;
  chart_mainCanvas.style.cssText = `width:100%;height:100%;cursor:default;overflow:hidden;position:absolute;z-index:0;left:0;top:0;`;
  chart_overlayCanvas.style.cssText = `width:100%;height:100%;cursor:default;overflow:hidden;position:absolute;z-index:2;left:0;top:0;`;

  container.appendChild(chart_mainCanvas);
  container.appendChild(chart_overlayCanvas);

  let fontFamily = `${12 * GLOBAL_VAR.ratio}px Microsoft YaHei`
  
  var classId = 0
  function createClass () {
    var j = arguments.length
    var e = function () {}
    var d
    if (j) {
      d = arguments[0]
      for (var a in d.prototype) {
        e.prototype[a] = d.prototype[a]
      }
    }
    for (var c = 1; c < j; c++) {
      var b = arguments[c]
      var g = b.prototype.__construct
      if (g) {
        if (!e.prototype.__featureConstructors) {
          e.prototype.__featureConstructors = []
        }
        e.prototype.__featureConstructors.push(g)
        delete b.prototype.__construct
      }
      for (var a in b.prototype) {
        e.prototype[a] = b.prototype[a]
      }
      if (g) {
        b.prototype.__construct = g
      }
    }
    var h = function () {
      if (this.__construct) {
        this.__construct.apply(this, arguments)
      }
      if (this.__featureConstructors) {
        var f = this.__featureConstructors
        for (var k = 0; k < f.length; k++) {
          f[k].apply(this, arguments)
        }
      }
    }
    e.prototype.__classId = classId++
    if (d != undefined) {
      h.__super = d.prototype
      e.prototype.__super = d
    }
    h.prototype = new e()
    return h
  }
  function isInstance(c, a) {
    var b = a.prototype.__classId;
    if (c.__classId == b) {
      return true;
    }
    var d = c.__super;
    while (d != undefined) {
      if (d.prototype.__classId == b) {
        return true;
      }
      d = d.prototype.__super;
    }
    return false;
  }
  var MEvent = createClass();
  MEvent.prototype.__construct = function() {
    this._handlers = [];
  };
  MEvent.prototype.addHandler = function(b, a) {
    if (this._indexOf(b, a) < 0) {
      this._handlers.push({obj: b, func: a});
    }
  };
  MEvent.prototype.removeHandler = function(c, b) {
    var a = this._indexOf(c, b);
    if (a >= 0) {
      this._handlers.splice(a, 1);
    }
  };
  MEvent.prototype.raise = function(f, h) {
    var b = this._handlers;
    var j, d, k = b.length;
    for (d = 0; d < k; d++) {
      j = b[d];
      j.func.call(j.obj, f, h);
    }
  };
  MEvent.prototype._indexOf = function(j, g) {
    var b = this._handlers;
    var h, d, k = b.length;
    for (d = 0; d < k; d++) {
      h = b[d];
      if (j == h.obj && g == h.func) {
        return d;
      }
    }
    return -1;
  };
  String.fromFloat = function(a, c) {
    var d = a.toFixed(c);
    for (var b = d.length - 1; b >= 0; b--) {
      if (d[b] == ".") {
        return d.substring(0, b);
      }
      if (d[b] != "0") {
        return d.substring(0, b + 1);
      }
    }
    return d;
  };
  var ExprEnv = createClass();
  ExprEnv.get = function() {
    return ExprEnv.inst;
  };
  ExprEnv.set = function(a) {
    ExprEnv.inst = a;
  };
  ExprEnv.prototype.getDataSource = function() {
    return this._ds;
  };
  ExprEnv.prototype.setDataSource = function(a) {
    return (this._ds = a);
  };
  ExprEnv.prototype.getFirstIndex = function() {
    return this._firstIndex;
  };
  ExprEnv.prototype.setFirstIndex = function(a) {
    return (this._firstIndex = a);
  };
  var Expr = createClass();
  Expr.prototype.__construct = function() {
    this._rid = 0;
  };
  Expr.prototype.execute = function(a) {};
  Expr.prototype.reserve = function(a, b) {};
  Expr.prototype.clear = function() {};
  var OpenExpr = createClass(Expr);
  var HighExpr = createClass(Expr);
  var LowExpr = createClass(Expr);
  var CloseExpr = createClass(Expr);
  var VolumeExpr = createClass(Expr);
  OpenExpr.prototype.execute = function(a) {
    return ExprEnv.get()._ds.getDataAt(a).open;
  };
  HighExpr.prototype.execute = function(a) {
    return ExprEnv.get()._ds.getDataAt(a).high;
  };
  LowExpr.prototype.execute = function(a) {
    return ExprEnv.get()._ds.getDataAt(a).low;
  };
  CloseExpr.prototype.execute = function(a) {
    return ExprEnv.get()._ds.getDataAt(a).close;
  };
  VolumeExpr.prototype.execute = function(a) {
    return ExprEnv.get()._ds.getDataAt(a).volume;
  };
  var ConstExpr = createClass(Expr);
  ConstExpr.prototype.__construct = function(a) {
    ConstExpr.__super.__construct.call(this);
    this._value = a;
  };
  ConstExpr.prototype.execute = function(a) {
    return this._value;
  };
  var ParameterExpr = createClass(Expr);
  ParameterExpr.prototype.__construct = function(b, c, d, a) {
    ParameterExpr.__super.__construct.call(this);
    this._name = b;
    this._minValue = c;
    this._maxValue = d;
    this._value = this._defaultValue = a;
  };
  ParameterExpr.prototype.execute = function(a) {
    return this._value;
  };
  ParameterExpr.prototype.getMinValue = function() {
    return this._minValue;
  };
  ParameterExpr.prototype.getMaxValue = function() {
    return this._maxValue;
  };
  ParameterExpr.prototype.getDefaultValue = function() {
    return this._defaultValue;
  };
  ParameterExpr.prototype.getValue = function() {
    return this._value;
  };
  ParameterExpr.prototype.setValue = function(a) {
    this._value = a == 0 ? 0 : this._value = Math.min(Math.max(this._minValue, a), this._maxValue)
  };
  var OpAExpr = createClass(Expr);
  var OpABExpr = createClass(Expr);
  var OpABCExpr = createClass(Expr);
  var OpABCDExpr = createClass(Expr);
  OpAExpr.prototype.__construct = function(b) {
    OpAExpr.__super.__construct.call(this);
    this._exprA = b;
  };
  OpAExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
      this._rid = a;
      this._exprA.reserve(a, b);
    }
  };
  OpAExpr.prototype.clear = function() {
    this._exprA.clear();
  };
  OpABExpr.prototype.__construct = function(d, c) {
    OpABExpr.__super.__construct.call(this);
    this._exprA = d;
    this._exprB = c;
  };
  OpABExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
      this._rid = a;
      this._exprA.reserve(a, b);
      this._exprB.reserve(a, b);
    }
  };
  OpABExpr.prototype.clear = function() {
    this._exprA.clear();
    this._exprB.clear();
  };
  OpABCExpr.prototype.__construct = function(e, d, f) {
    OpABCExpr.__super.__construct.call(this);
    this._exprA = e;
    this._exprB = d;
    this._exprC = f;
  };
  OpABCExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
      this._rid = a;
      this._exprA.reserve(a, b);
      this._exprB.reserve(a, b);
      this._exprC.reserve(a, b);
    }
  };
  OpABCExpr.prototype.clear = function() {
    this._exprA.clear();
    this._exprB.clear();
    this._exprC.clear();
  };
  OpABCDExpr.prototype.__construct = function(f, e, h, g) {
    OpABCDExpr.__super.__construct.call(this);
    this._exprA = f;
    this._exprB = e;
    this._exprC = h;
    this._exprD = g;
  };
  OpABCDExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
      this._rid = a;
      this._exprA.reserve(a, b);
      this._exprB.reserve(a, b);
      this._exprC.reserve(a, b);
      this._exprD.reserve(a, b);
    }
  };
  OpABCDExpr.prototype.clear = function() {
    this._exprA.clear();
    this._exprB.clear();
    this._exprC.clear();
    this._exprD.clear();
  };
  var NegExpr = createClass(OpAExpr);
  NegExpr.prototype.__construct = function(b) {
    NegExpr.__super.__construct.call(this, b);
  };
  NegExpr.prototype.execute = function(a) {
    return -this._exprA.execute(a);
  };
  var AddExpr = createClass(OpABExpr);
  var SubExpr = createClass(OpABExpr);
  var MulExpr = createClass(OpABExpr);
  var DivExpr = createClass(OpABExpr);
  AddExpr.prototype.__construct = function(d, c) {
    AddExpr.__super.__construct.call(this, d, c);
  };
  SubExpr.prototype.__construct = function(d, c) {
    SubExpr.__super.__construct.call(this, d, c);
  };
  MulExpr.prototype.__construct = function(d, c) {
    MulExpr.__super.__construct.call(this, d, c);
  };
  DivExpr.prototype.__construct = function(d, c) {
    DivExpr.__super.__construct.call(this, d, c);
  };
  AddExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) + this._exprB.execute(a);
  };
  SubExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) - this._exprB.execute(a);
  };
  MulExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) * this._exprB.execute(a);
  };
  DivExpr.prototype.execute = function(e) {
    var d = this._exprA.execute(e);
    var c = this._exprB.execute(e);
    if (d == 0) {
      return d;
    }
    if (c == 0) {
      return d > 0 ? 1000000 : -1000000;
    }
    return d / c;
  };
  var GtExpr = createClass(OpABExpr);
  var GeExpr = createClass(OpABExpr);
  var LtExpr = createClass(OpABExpr);
  var LeExpr = createClass(OpABExpr);
  var EqExpr = createClass(OpABExpr);
  GtExpr.prototype.__construct = function(d, c) {
    GtExpr.__super.__construct.call(this, d, c);
  };
  GeExpr.prototype.__construct = function(d, c) {
    GeExpr.__super.__construct.call(this, d, c);
  };
  LtExpr.prototype.__construct = function(d, c) {
    LtExpr.__super.__construct.call(this, d, c);
  };
  LeExpr.prototype.__construct = function(d, c) {
    LeExpr.__super.__construct.call(this, d, c);
  };
  EqExpr.prototype.__construct = function(d, c) {
    EqExpr.__super.__construct.call(this, d, c);
  };
  GtExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) > this._exprB.execute(a) ? 1 : 0;
  };
  GeExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) >= this._exprB.execute(a) ? 1 : 0;
  };
  LtExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) < this._exprB.execute(a) ? 1 : 0;
  };
  LeExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) <= this._exprB.execute(a) ? 1 : 0;
  };
  EqExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) == this._exprB.execute(a) ? 1 : 0;
  };
  var MaxExpr = createClass(OpABExpr);
  MaxExpr.prototype.__construct = function(d, c) {
    MaxExpr.__super.__construct.call(this, d, c);
  };
  MaxExpr.prototype.execute = function(a) {
    return Math.max(this._exprA.execute(a), this._exprB.execute(a));
  };
  var AbsExpr = createClass(OpAExpr);
  AbsExpr.prototype.__construct = function(b) {
    AbsExpr.__super.__construct.call(this, b);
  };
  AbsExpr.prototype.execute = function(a) {
    return Math.abs(this._exprA.execute(a));
  };
  var RefExpr = createClass(OpABExpr);
  RefExpr.prototype.__construct = function(d, c) {
    RefExpr.__super.__construct.call(this, d, c);
    this._offset = -1;
  };
  RefExpr.prototype.execute = function(b) {
    if (this._offset < 0) {
      this._offset = this._exprB.execute(b);
      if (this._offset < 0) {
        throw "offset < 0";
      }
    }
    b -= this._offset;
    if (b < 0) {
      throw "index < 0";
    }
    var a = this._exprA.execute(b);
    if (isNaN(a)) {
      throw "NaN";
    }
    return a;
  };
  var AndExpr = createClass(OpABExpr);
  var OrExpr = createClass(OpABExpr);
  AndExpr.prototype.__construct = function(d, c) {
    AndExpr.__super.__construct.call(this, d, c);
  };
  OrExpr.prototype.__construct = function(d, c) {
    OrExpr.__super.__construct.call(this, d, c);
  };
  AndExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) != 0 && this._exprB.execute(a) != 0 ? 1 : 0;
  };
  OrExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) != 0 || this._exprB.execute(a) != 0 ? 1 : 0;
  };
  var IfExpr = createClass(OpABCExpr);
  IfExpr.prototype.__construct = function(e, d, f) {
    IfExpr.__super.__construct.call(this, e, d, f);
  };
  IfExpr.prototype.execute = function(a) {
    return this._exprA.execute(a) != 0 ? this._exprB.execute(a) : this._exprC.execute(a);
  };
  var AssignExpr = createClass(OpAExpr);
  AssignExpr.prototype.__construct = function(c, b) {
    AssignExpr.__super.__construct.call(this, b);
    this._name = c;
    this._buf = [];
  };
  AssignExpr.prototype.getName = function() {
    return this._name;
  };
  AssignExpr.prototype.execute = function(a) {
    return this._buf[a];
  };
  AssignExpr.prototype.assign = function(a) {
    this._buf[a] = this._exprA.execute(a);
    if (ExprEnv.get()._firstIndex >= 0) {
      if (isNaN(this._buf[a]) && !isNaN(this._buf[a - 1])) {
        throw this._name + ".assign(" + a + "): NaN";
      }
    }
  };
  AssignExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
      for (var d = b; d > 0; d--) {
        this._buf.push(NaN);
      }
    }
    AssignExpr.__super.reserve.call(this, a, b);
  };
  AssignExpr.prototype.clear = function() {
    AssignExpr.__super.clear.call(this);
    this._buf = [];
  };
  var OutputStyle = {None: 0, Line: 1, VolumeStick: 2, MACDStick: 3, SARPoint: 4};
  var OutputExpr = createClass(AssignExpr);
  OutputExpr.prototype.__construct = function(d, b, e, c) {
    OutputExpr.__super.__construct.call(this, d, b);
    this._style = e === undefined ? OutputStyle.Line : e;
    this._color = c;
  };
  OutputExpr.prototype.getStyle = function() {
    return this._style;
  };
  OutputExpr.prototype.getColor = function() {
    return this._color;
  };
  var RangeOutputExpr = createClass(OutputExpr);
  RangeOutputExpr.prototype.__construct = function(d, b, e, c) {
    RangeOutputExpr.__super.__construct.call(this, d, b, e, c);
  };
  RangeOutputExpr.prototype.getName = function() {
    return this._name + this._exprA.getRange();
  };
  var RangeExpr = createClass(OpABExpr);
  RangeExpr.prototype.__construct = function(d, c) {
    RangeExpr.__super.__construct.call(this, d, c);
    this._range = -1;
    this._buf = [];
  };
  RangeExpr.prototype.getRange = function() {
    return this._range;
  };
  RangeExpr.prototype.initRange = function() {
    this._range = this._exprB.execute(0);
  };
  RangeExpr.prototype.execute = function(a) {
    if (this._range < 0) {
      this.initRange();
    }
    var c = (this._buf[a].resultA = this._exprA.execute(a));
    var b = (this._buf[a].result = this.calcResult(a, c));
    return b;
  };
  RangeExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
      for (var d = b; d > 0; d--) {
        this._buf.push({resultA: NaN, result: NaN});
      }
    }
    RangeExpr.__super.reserve.call(this, a, b);
  };
  RangeExpr.prototype.clear = function() {
    RangeExpr.__super.clear.call(this);
    this._range = -1;
    this._buf = [];
  };
  var HhvExpr = createClass(RangeExpr);
  var LlvExpr = createClass(RangeExpr);
  HhvExpr.prototype.__construct = function(d, c) {
    HhvExpr.__super.__construct.call(this, d, c);
  };
  LlvExpr.prototype.__construct = function(d, c) {
    LlvExpr.__super.__construct.call(this, d, c);
  };
  HhvExpr.prototype.calcResult = function(b, h) {
    if (this._range == 0) {
      return NaN;
    }
    var e = ExprEnv.get()._firstIndex;
    if (e < 0) {
      return h;
    }
    if (b > e) {
      var g = this._range;
      var a = h;
      var f = b - g + 1;
      var c = Math.max(e, f);
      for (; c < b; c++) {
        var d = this._buf[c];
        if (a < d.resultA) {
          a = d.resultA;
        }
      }
      return a;
    } else {
      return h;
    }
  };
  LlvExpr.prototype.calcResult = function(b, h) {
    if (this._range == 0) {
      return NaN;
    }
    var e = ExprEnv.get()._firstIndex;
    if (e < 0) {
      return h;
    }
    if (b > e) {
      var g = this._range;
      var a = h;
      var f = b - g + 1;
      var c = Math.max(e, f);
      for (; c < b; c++) {
        var d = this._buf[c];
        if (a > d.resultA) {
          a = d.resultA;
        }
      }
      return a;
    } else {
      return h;
    }
  };
  var CountExpr = createClass(RangeExpr);
  CountExpr.prototype.__construct = function(d, c) {
    CountExpr.__super.__construct.call(this, d, c);
  };
  CountExpr.prototype.calcResult = function(a, e) {
    if (this._range == 0) {
      return NaN;
    }
    var c = ExprEnv.get()._firstIndex;
    if (c < 0) {
      return 0;
    }
    if (a >= c) {
      var d = this._range - 1;
      if (d > a - c) {
        d = a - c;
      }
      var b = 0;
      for (; d >= 0; d--) {
        if (this._buf[a - d].resultA != 0) {
          b++;
        }
      }
      return b;
    } else {
      return 0;
    }
  };
  var SumExpr = createClass(RangeExpr);
  SumExpr.prototype.__construct = function(d, c) {
    SumExpr.__super.__construct.call(this, d, c);
  };
  SumExpr.prototype.calcResult = function(a, d) {
    var b = ExprEnv.get()._firstIndex;
    if (b < 0) {
      return d;
    }
    if (a > b) {
      var c = this._range;
      if (c == 0 || c >= a + 1 - b) {
        return this._buf[a - 1].result + d;
      }
      return this._buf[a - 1].result + d - this._buf[a - c].resultA;
    } else {
      return d;
    }
  };
  var StdExpr = createClass(RangeExpr);
  StdExpr.prototype.__construct = function(d, c) {
    StdExpr.__super.__construct.call(this, d, c);
  };
  StdExpr.prototype.calcResult = function(b, g) {
    if (this._range == 0) {
      return NaN;
    }
    var a = this._stdBuf[b];
    var e = ExprEnv.get()._firstIndex;
    if (e < 0) {
      a.resultMA = g;
      return 0;
    }
    if (b > e) {
      var f = this._range;
      if (f >= b + 1 - e) {
        f = b + 1 - e;
        a.resultMA = this._stdBuf[b - 1].resultMA * (1 - 1 / f) + g / f;
      } else {
        a.resultMA = this._stdBuf[b - 1].resultMA + (g - this._buf[b - f].resultA) / f;
      }
      var d = 0;
      for (var c = b - f + 1; c <= b; c++) {
        d += Math.pow(this._buf[c].resultA - a.resultMA, 2);
      }
      return Math.sqrt(d / f);
    }
    a.resultMA = g;
    return 0;
  };
  StdExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
      for (var d = b; d > 0; d--) {
        this._stdBuf.push({resultMA: NaN});
      }
    }
    StdExpr.__super.reserve.call(this, a, b);
  };
  StdExpr.prototype.clear = function() {
    StdExpr.__super.clear.call(this);
    this._stdBuf = [];
  };
  var MaExpr = createClass(RangeExpr);
  MaExpr.prototype.__construct = function(d, c) {
    MaExpr.__super.__construct.call(this, d, c);
  };
  MaExpr.prototype.calcResult = function(a, d) {
    if (this._range == 0) {
      return NaN;
    }
    var b = ExprEnv.get()._firstIndex;
    if (b < 0) {
      return d;
    }
    if (a > b) {
      var c = this._range;
      if (c >= a + 1 - b) {
        c = a + 1 - b;
        return this._buf[a - 1].result * (1 - 1 / c) + d / c;
      }
      return this._buf[a - 1].result + (d - this._buf[a - c].resultA) / c;
    } else {
      return d;
    }
  };
  var EmaExpr = createClass(RangeExpr);
  EmaExpr.prototype.__construct = function(d, c) {
    EmaExpr.__super.__construct.call(this, d, c);
  };
  EmaExpr.prototype.initRange = function() {
    EmaExpr.__super.initRange.call(this);
    this._alpha = 2 / (this._range + 1);
  };
  EmaExpr.prototype.calcResult = function(a, d) {
    if (this._range == 0) {
      return NaN;
    }
    var c = ExprEnv.get()._firstIndex;
    if (c < 0) {
      return d;
    }
    if (a > c) {
      var b = this._buf[a - 1];
      return this._alpha * (d - b.result) + b.result;
    }
    return d;
  };
  var ExpmemaExpr = createClass(EmaExpr);
  ExpmemaExpr.prototype.__construct = function(d, c) {
    ExpmemaExpr.__super.__construct.call(this, d, c);
  };
  ExpmemaExpr.prototype.calcResult = function(a, e) {
    var c = ExprEnv.get()._firstIndex;
    if (c < 0) {
      return e;
    }
    if (a > c) {
      var d = this._range;
      var b = this._buf[a - 1];
      if (d >= a + 1 - c) {
        d = a + 1 - c;
        return b.result * (1 - 1 / d) + e / d;
      }
      return this._alpha * (e - b.result) + b.result;
    }
    return e;
  };
  var SmaExpr = createClass(RangeExpr);
  SmaExpr.prototype.__construct = function(e, d, f) {
    SmaExpr.__super.__construct.call(this, e, d);
    this._exprC = f;
    this._mul;
  };
  SmaExpr.prototype.initRange = function() {
    SmaExpr.__super.initRange.call(this);
    this._mul = this._exprC.execute(0);
  };
  SmaExpr.prototype.calcResult = function(a, d) {
    if (this._range == 0) {
      return NaN;
    }
    var b = ExprEnv.get()._firstIndex;
    if (b < 0) {
      return d;
    }
    if (a > b) {
      var c = this._range;
      if (c > a + 1 - b) {
        c = a + 1 - b;
      }
      return ((c - 1) * this._buf[a - 1].result + d * this._mul) / c;
    }
    return d;
  };
  var SarExpr = createClass(OpABCDExpr);
  SarExpr.prototype.__construct = function(f, e, h, g) {
    SarExpr.__super.__construct.call(this, f, e, h, g);
    this._buf = [];
    this._range = -1;
    this._min;
    this._step;
    this._max;
  };
  SarExpr.prototype.execute = function(j) {
    if (this._range < 0) {
      this._range = this._exprA.execute(0);
      this._min = this._exprB.execute(0) / 100;
      this._step = this._exprC.execute(0) / 100;
      this._max = this._exprD.execute(0) / 100;
    }
    var d = this._buf[j];
    var m = ExprEnv.get();
    var g = m._firstIndex;
    if (g < 0) {
      d.longPos = true;
      d.sar = m._ds.getDataAt(j).low;
      d.ep = m._ds.getDataAt(j).high;
      d.af = 0.02;
    } else {
      var c = m._ds.getDataAt(j).high;
      var k = m._ds.getDataAt(j).low;
      var b = this._buf[j - 1];
      d.sar = b.sar + b.af * (b.ep - b.sar);
      if (b.longPos) {
        d.longPos = true;
        if (c > b.ep) {
          d.ep = c;
          d.af = Math.min(b.af + this._step, this._max);
        } else {
          d.ep = b.ep;
          d.af = b.af;
        }
        if (d.sar > k) {
          d.longPos = false;
          var e = j - this._range + 1;
          for (e = Math.max(e, g); e < j; e++) {
            var f = m._ds.getDataAt(e).high;
            if (c < f) {
              c = f;
            }
          }
          d.sar = c;
          d.ep = k;
          d.af = 0.02;
        }
      } else {
        d.longPos = false;
        if (k < b.ep) {
          d.ep = k;
          d.af = Math.min(b.af + this._step, this._max);
        } else {
          d.ep = b.ep;
          d.af = b.af;
        }
        if (d.sar < c) {
          d.longPos = true;
          var e = j - this._range + 1;
          for (e = Math.max(e, g); e < j; e++) {
            var a = m._ds.getDataAt(e).low;
            if (k > a) {
              k = a;
            }
          }
          d.sar = k;
          d.ep = c;
          d.af = 0.02;
        }
      }
    }
    return d.sar;
  };
  SarExpr.prototype.reserve = function(a, b) {
    if (this._rid < a) {
      for (var d = b; d > 0; d--) {
        this._buf.push({longPos: true, sar: NaN, ep: NaN, af: NaN});
      }
    }
    SarExpr.__super.reserve.call(this, a, b);
  };
  SarExpr.prototype.clear = function() {
    SarExpr.__super.clear.call(this);
    this._range = -1;
  };
  var Indicator = createClass();
  Indicator.prototype.__construct = function() {
    this._exprEnv = new ExprEnv();
    this._rid = 0;
    this._params = [];
    this._assigns = [];
    this._outputs = [];
  };
  Indicator.prototype.addParameter = function(a) {
    this._params.push(a);
  };
  Indicator.prototype.addAssign = function(a) {
    this._assigns.push(a);
  };
  Indicator.prototype.addOutput = function(a) {
    this._outputs.push(a);
  };
  Indicator.prototype.getParameterCount = function() {
    return this._params.length;
  };
  Indicator.prototype.getParameterAt = function(a) {
    return this._params[a];
  };
  Indicator.prototype.getOutputCount = function() {
    return this._outputs.length;
  };
  Indicator.prototype.getOutputAt = function(a) {
    return this._outputs[a];
  };
  Indicator.prototype.clear = function() {
    this._exprEnv.setFirstIndex(-1);
    var b, a = this._assigns.length;
    for (b = 0; b < a; b++) {
      this._assigns[b].clear();
    }
    a = this._outputs.length;
    for (b = 0; b < a; b++) {
      this._outputs[b].clear();
    }
  };
  Indicator.prototype.reserve = function(c) {
    this._rid++;
    var b, a = this._assigns.length;
    for (b = 0; b < a; b++) {
      this._assigns[b].reserve(this._rid, c);
    }
    a = this._outputs.length;
    for (b = 0; b < a; b++) {
      this._outputs[b].reserve(this._rid, c);
    }
  };
  Indicator.prototype.execute = function(d, a) {
    if (a < 0) {
      return;
    }
    this._exprEnv.setDataSource(d);
    ExprEnv.set(this._exprEnv);
    try {
      var c, b;
      b = this._assigns.length;
      for (c = 0; c < b; c++) {
        this._assigns[c].assign(a);
      }
      b = this._outputs.length;
      for (c = 0; c < b; c++) {
        this._outputs[c].assign(a);
      }
      if (this._exprEnv.getFirstIndex() < 0) {
        this._exprEnv.setFirstIndex(a);
      }
    } catch (f) {
      if (this._exprEnv.getFirstIndex() >= 0) {
        alert(f);
        throw f;
      }
    }
  };
  Indicator.prototype.getParameters = function() {
    var c = [];
    var b, a = this._params.length;
    for (b = 0; b < a; b++) {
      c.push(this._params[b].getValue());
    }
    return c;
  };
  Indicator.prototype.setParameters = function(b) {
    if (b instanceof Array && b.length == this._params.length) {
      for (var a in this._params) {
        this._params[a].setValue(b[a]);
      }
    }
  };
  var HLCIndicator = createClass(Indicator);
  HLCIndicator.prototype.__construct = function() {
    HLCIndicator.__super.__construct.call(this);
    var a = new ParameterExpr("M1", 2, 1000, 60);
    this.addParameter(a);
    this.addOutput(new OutputExpr("HIGH", new HighExpr(), OutputStyle.None));
    this.addOutput(new OutputExpr("LOW", new LowExpr(), OutputStyle.None));
    this.addOutput(new OutputExpr("CLOSE", new CloseExpr(), OutputStyle.Line, Theme.Color.Indicator0));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), a), OutputStyle.Line, Theme.Color.Indicator1));
  };
  HLCIndicator.prototype.getName = function() {
    return "CLOSE";
  };
  var MAIndicator = createClass(Indicator);
  MAIndicator.prototype.__construct = function() {
    MAIndicator.__super.__construct.call(this);
    var f = new ParameterExpr("M1", 2, 1000, 5);
    var e = new ParameterExpr("M2", 2, 1000, 10);
    var d = new ParameterExpr("M3", 2, 1000, 30);
    var c = new ParameterExpr("M4", 2, 1000, 0);
    var b = new ParameterExpr("M5", 2, 1000, 0);
    var a = new ParameterExpr("M6", 2, 1000, 0);
    this.addParameter(f);
    this.addParameter(e);
    this.addParameter(d);
    this.addParameter(c);
    this.addParameter(b);
    this.addParameter(a);
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), f)));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), e)));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), d)));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), c)));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), b)));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(new CloseExpr(), a)));
  };
  MAIndicator.prototype.getName = function() {
    return "MA";
  };
  var EMAIndicator = createClass(Indicator);
  EMAIndicator.prototype.__construct = function() {
    EMAIndicator.__super.__construct.call(this);
    var f = new ParameterExpr("M1", 2, 1000, 5);
    var e = new ParameterExpr("M2", 2, 1000, 10);
    var d = new ParameterExpr("M3", 2, 1000, 30);
    var c = new ParameterExpr("M4", 2, 1000, 0);
    var b = new ParameterExpr("M5", 2, 1000, 0);
    var a = new ParameterExpr("M6", 2, 1000, 0);
    this.addParameter(f);
    this.addParameter(e);
    this.addParameter(d);
    this.addParameter(c);
    this.addParameter(b);
    this.addParameter(a);
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), f)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), e)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), d)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), c)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), b)));
    this.addOutput(new RangeOutputExpr("EMA", new EmaExpr(new CloseExpr(), a)));
  };
  EMAIndicator.prototype.getName = function() {
    return "EMA";
  };
  var VOLUMEIndicator = createClass(Indicator);
  VOLUMEIndicator.prototype.__construct = function() {
    VOLUMEIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("M1", 2, 500, 5);
    var a = new ParameterExpr("M2", 2, 500, 10);
    this.addParameter(c);
    this.addParameter(a);
    var b = new OutputExpr("VOLUME", new VolumeExpr(), OutputStyle.VolumeStick, Theme.Color.Text4);
    this.addOutput(b);
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(b, c), OutputStyle.Line, Theme.Color.Indicator0));
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(b, a), OutputStyle.Line, Theme.Color.Indicator1));
  };
  VOLUMEIndicator.prototype.getName = function() {
    return "VOLUME";
  };
  var MACDIndicator = createClass(Indicator);
  MACDIndicator.prototype.__construct = function() {
    MACDIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("SHORT", 2, 200, 12);
    var d = new ParameterExpr("LONG", 2, 200, 26);
    var a = new ParameterExpr("MID", 2, 200, 9);
    this.addParameter(c);
    this.addParameter(d);
    this.addParameter(a);
    var b = new OutputExpr("DIF", new SubExpr(new EmaExpr(new CloseExpr(), c), new EmaExpr(new CloseExpr(), d)));
    this.addOutput(b);
    var f = new OutputExpr("DEA", new EmaExpr(b, a));
    this.addOutput(f);
    var e = new OutputExpr("MACD", new MulExpr(new SubExpr(b, f), new ConstExpr(2)), OutputStyle.MACDStick);
    this.addOutput(e);
  };
  MACDIndicator.prototype.getName = function() {
    return "MACD";
  };
  var DMIIndicator = createClass(Indicator);
  DMIIndicator.prototype.__construct = function() {
    DMIIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("N", 2, 90, 14);
    var h = new ParameterExpr("MM", 2, 60, 6);
    this.addParameter(c);
    this.addParameter(h);
    var j = new AssignExpr("MTR", new ExpmemaExpr(new MaxExpr(new MaxExpr(new SubExpr(new HighExpr(), new LowExpr()), new AbsExpr(new SubExpr(new HighExpr(), new RefExpr(new CloseExpr(), new ConstExpr(1))))), new AbsExpr(new SubExpr(new RefExpr(new CloseExpr(), new ConstExpr(1)), new LowExpr()))), c));
    this.addAssign(j);
    var k = new AssignExpr("HD", new SubExpr(new HighExpr(), new RefExpr(new HighExpr(), new ConstExpr(1))));
    this.addAssign(k);
    var d = new AssignExpr("LD", new SubExpr(new RefExpr(new LowExpr(), new ConstExpr(1)), new LowExpr()));
    this.addAssign(d);
    var a = new AssignExpr("DMP", new ExpmemaExpr(new IfExpr(new AndExpr(new GtExpr(k, new ConstExpr(0)), new GtExpr(k, d)), k, new ConstExpr(0)), c));
    this.addAssign(a);
    var g = new AssignExpr("DMM", new ExpmemaExpr(new IfExpr(new AndExpr(new GtExpr(d, new ConstExpr(0)), new GtExpr(d, k)), d, new ConstExpr(0)), c));
    this.addAssign(g);
    var b = new OutputExpr("PDI", new MulExpr(new DivExpr(a, j), new ConstExpr(100)));
    this.addOutput(b);
    var i = new OutputExpr("MDI", new MulExpr(new DivExpr(g, j), new ConstExpr(100)));
    this.addOutput(i);
    var f = new OutputExpr("ADX", new ExpmemaExpr(new MulExpr(new DivExpr(new AbsExpr(new SubExpr(i, b)), new AddExpr(i, b)), new ConstExpr(100)), h));
    this.addOutput(f);
    var e = new OutputExpr("ADXR", new ExpmemaExpr(f, h));
    this.addOutput(e);
  };
  DMIIndicator.prototype.getName = function() {
    return "DMI";
  };
  var DMAIndicator = createClass(Indicator);
  DMAIndicator.prototype.__construct = function() {
    DMAIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("N1", 2, 60, 10);
    var b = new ParameterExpr("N2", 2, 250, 50);
    var e = new ParameterExpr("M", 2, 100, 10);
    this.addParameter(c);
    this.addParameter(b);
    this.addParameter(e);
    var a = new OutputExpr("DIF", new SubExpr(new MaExpr(new CloseExpr(), c), new MaExpr(new CloseExpr(), b)));
    this.addOutput(a);
    var d = new OutputExpr("DIFMA", new MaExpr(a, e));
    this.addOutput(d);
  };
  DMAIndicator.prototype.getName = function() {
    return "DMA";
  };
  var TRIXIndicator = createClass(Indicator);
  TRIXIndicator.prototype.__construct = function() {
    TRIXIndicator.__super.__construct.call(this);
    var d = new ParameterExpr("N", 2, 100, 12);
    var e = new ParameterExpr("M", 2, 100, 9);
    this.addParameter(d);
    this.addParameter(e);
    var c = new AssignExpr("MTR", new EmaExpr(new EmaExpr(new EmaExpr(new CloseExpr(), d), d), d));
    this.addAssign(c);
    var b = new OutputExpr("TRIX", new MulExpr(new DivExpr(new SubExpr(c, new RefExpr(c, new ConstExpr(1))), new RefExpr(c, new ConstExpr(1))), new ConstExpr(100)));
    this.addOutput(b);
    var a = new OutputExpr("MATRIX", new MaExpr(b, e));
    this.addOutput(a);
  };
  TRIXIndicator.prototype.getName = function() {
    return "TRIX";
  };
  var BRARIndicator = createClass(Indicator);
  BRARIndicator.prototype.__construct = function() {
    BRARIndicator.__super.__construct.call(this);
    var d = new ParameterExpr("N", 2, 120, 26);
    this.addParameter(d);
    var c = new AssignExpr("REF_CLOSE_1", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(c);
    var b = new OutputExpr("BR", new MulExpr(new DivExpr(new SumExpr(new MaxExpr(new ConstExpr(0), new SubExpr(new HighExpr(), c)), d), new SumExpr(new MaxExpr(new ConstExpr(0), new SubExpr(c, new LowExpr())), d)), new ConstExpr(100)));
    this.addOutput(b);
    var a = new OutputExpr("AR", new MulExpr(new DivExpr(new SumExpr(new SubExpr(new HighExpr(), new OpenExpr()), d), new SumExpr(new SubExpr(new OpenExpr(), new LowExpr()), d)), new ConstExpr(100)));
    this.addOutput(a);
  };
  BRARIndicator.prototype.getName = function() {
    return "BRAR";
  };
  var VRIndicator = createClass(Indicator);
  VRIndicator.prototype.__construct = function() {
    VRIndicator.__super.__construct.call(this);
    var g = new ParameterExpr("N", 2, 100, 26);
    var h = new ParameterExpr("M", 2, 100, 6);
    this.addParameter(g);
    this.addParameter(h);
    var e = new AssignExpr("REF_CLOSE_1", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(e);
    var d = new AssignExpr("TH", new SumExpr(new IfExpr(new GtExpr(new CloseExpr(), e), new VolumeExpr(), new ConstExpr(0)), g));
    this.addAssign(d);
    var b = new AssignExpr("TL", new SumExpr(new IfExpr(new LtExpr(new CloseExpr(), e), new VolumeExpr(), new ConstExpr(0)), g));
    this.addAssign(b);
    var f = new AssignExpr("TQ", new SumExpr(new IfExpr(new EqExpr(new CloseExpr(), e), new VolumeExpr(), new ConstExpr(0)), g));
    this.addAssign(f);
    var a = new OutputExpr("VR", new MulExpr(new DivExpr(new AddExpr(new MulExpr(d, new ConstExpr(2)), f), new AddExpr(new MulExpr(b, new ConstExpr(2)), f)), new ConstExpr(100)));
    this.addOutput(a);
    var c = new OutputExpr("MAVR", new MaExpr(a, h));
    this.addOutput(c);
  };
  VRIndicator.prototype.getName = function() {
    return "VR";
  };
  var OBVIndicator = createClass(Indicator);
  OBVIndicator.prototype.__construct = function() {
    OBVIndicator.__super.__construct.call(this);
    var e = new ParameterExpr("M", 2, 100, 30);
    this.addParameter(e);
    var d = new AssignExpr("REF_CLOSE_1", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(d);
    var c = new AssignExpr("VA", new IfExpr(new GtExpr(new CloseExpr(), d), new VolumeExpr(), new NegExpr(new VolumeExpr())));
    this.addAssign(c);
    var a = new OutputExpr("OBV", new SumExpr(new IfExpr(new EqExpr(new CloseExpr(), d), new ConstExpr(0), c), new ConstExpr(0)));
    this.addOutput(a);
    var b = new OutputExpr("MAOBV", new MaExpr(a, e));
    this.addOutput(b);
  };
  OBVIndicator.prototype.getName = function() {
    return "OBV";
  };
  var EMVIndicator = createClass(Indicator);
  EMVIndicator.prototype.__construct = function() {
    EMVIndicator.__super.__construct.call(this);
    var e = new ParameterExpr("N", 2, 90, 14);
    var f = new ParameterExpr("M", 2, 60, 9);
    this.addParameter(e);
    this.addParameter(f);
    var d = new AssignExpr("VOLUME", new DivExpr(new MaExpr(new VolumeExpr(), e), new VolumeExpr()));
    this.addAssign(d);
    var b = new AssignExpr("MID", new MulExpr(new DivExpr(new SubExpr(new AddExpr(new HighExpr(), new LowExpr()), new RefExpr(new AddExpr(new HighExpr(), new LowExpr()), new ConstExpr(1))), new AddExpr(new HighExpr(), new LowExpr())), new ConstExpr(100)));
    this.addAssign(b);
    var a = new OutputExpr("EMV", new MaExpr(new DivExpr(new MulExpr(b, new MulExpr(d, new SubExpr(new HighExpr(), new LowExpr()))), new MaExpr(new SubExpr(new HighExpr(), new LowExpr()), e)), e));
    this.addOutput(a);
    var c = new OutputExpr("MAEMV", new MaExpr(a, f));
    this.addOutput(c);
  };
  EMVIndicator.prototype.getName = function() {
    return "EMV";
  };
  var RSIIndicator = createClass(Indicator);
  RSIIndicator.prototype.__construct = function() {
    RSIIndicator.__super.__construct.call(this);
    var e = new ParameterExpr("N1", 2, 120, 6);
    var b = new ParameterExpr("N2", 2, 250, 12);
    var a = new ParameterExpr("N3", 2, 500, 24);
    this.addParameter(e);
    this.addParameter(b);
    this.addParameter(a);
    var d = new AssignExpr("LC", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(d);
    var c = new AssignExpr("CLOSE_LC", new SubExpr(new CloseExpr(), d));
    this.addAssign(c);
    this.addOutput(new OutputExpr("RSI1", new MulExpr(new DivExpr(new SmaExpr(new MaxExpr(c, new ConstExpr(0)), e, new ConstExpr(1)), new SmaExpr(new AbsExpr(c), e, new ConstExpr(1))), new ConstExpr(100))));
    this.addOutput(new OutputExpr("RSI2", new MulExpr(new DivExpr(new SmaExpr(new MaxExpr(c, new ConstExpr(0)), b, new ConstExpr(1)), new SmaExpr(new AbsExpr(c), b, new ConstExpr(1))), new ConstExpr(100))));
    this.addOutput(new OutputExpr("RSI3", new MulExpr(new DivExpr(new SmaExpr(new MaxExpr(c, new ConstExpr(0)), a, new ConstExpr(1)), new SmaExpr(new AbsExpr(c), a, new ConstExpr(1))), new ConstExpr(100))));
  };
  RSIIndicator.prototype.getName = function() {
    return "RSI";
  };
  var WRIndicator = createClass(Indicator);
  WRIndicator.prototype.__construct = function() {
    WRIndicator.__super.__construct.call(this);
    var h = new ParameterExpr("N", 2, 100, 10);
    var e = new ParameterExpr("N1", 2, 100, 6);
    this.addParameter(h);
    this.addParameter(e);
    var a = new AssignExpr("HHV", new HhvExpr(new HighExpr(), h));
    this.addAssign(a);
    var c = new AssignExpr("HHV1", new HhvExpr(new HighExpr(), e));
    this.addAssign(c);
    var b = new AssignExpr("LLV", new LlvExpr(new LowExpr(), h));
    this.addAssign(b);
    var g = new AssignExpr("LLV1", new LlvExpr(new LowExpr(), e));
    this.addAssign(g);
    var f = new OutputExpr("WR1", new MulExpr(new DivExpr(new SubExpr(a, new CloseExpr()), new SubExpr(a, b)), new ConstExpr(100)));
    this.addOutput(f);
    var d = new OutputExpr("WR2", new MulExpr(new DivExpr(new SubExpr(c, new CloseExpr()), new SubExpr(c, g)), new ConstExpr(100)));
    this.addOutput(d);
  };
  WRIndicator.prototype.getName = function() {
    return "WR";
  };
  var SARIndicator = createClass(Indicator);
  SARIndicator.prototype.__construct = function() {
    SARIndicator.__super.__construct.call(this);
    var d = new ConstExpr(4);
    var b = new ConstExpr(2);
    var a = new ConstExpr(2);
    var c = new ConstExpr(20);
    this.addOutput(new OutputExpr("SAR", new SarExpr(d, b, a, c), OutputStyle.SARPoint));
  };
  SARIndicator.prototype.getName = function() {
    return "SAR";
  };
  var KDJIndicator = createClass(Indicator);
  KDJIndicator.prototype.__construct = function() {
    KDJIndicator.__super.__construct.call(this);
    var f = new ParameterExpr("N", 2, 90, 9);
    var c = new ParameterExpr("M1", 2, 30, 3);
    var b = new ParameterExpr("M2", 2, 30, 3);
    this.addParameter(f);
    this.addParameter(c);
    this.addParameter(b);
    var i = new AssignExpr("HHV", new HhvExpr(new HighExpr(), f));
    this.addAssign(i);
    var e = new AssignExpr("LLV", new LlvExpr(new LowExpr(), f));
    this.addAssign(e);
    var d = new AssignExpr("RSV", new MulExpr(new DivExpr(new SubExpr(new CloseExpr(), e), new SubExpr(i, e)), new ConstExpr(100)));
    this.addAssign(d);
    var g = new OutputExpr("K", new SmaExpr(d, c, new ConstExpr(1)));
    this.addOutput(g);
    var a = new OutputExpr("D", new SmaExpr(g, b, new ConstExpr(1)));
    this.addOutput(a);
    var h = new OutputExpr("J", new SubExpr(new MulExpr(g, new ConstExpr(3)), new MulExpr(a, new ConstExpr(2))));
    this.addOutput(h);
  };
  KDJIndicator.prototype.getName = function() {
    return "KDJ";
  };
  var ROCIndicator = createClass(Indicator);
  ROCIndicator.prototype.__construct = function() {
    ROCIndicator.__super.__construct.call(this);
    var d = new ParameterExpr("N", 2, 120, 12);
    var e = new ParameterExpr("M", 2, 60, 6);
    this.addParameter(d);
    this.addParameter(e);
    var a = new AssignExpr("REF_CLOSE_N", new RefExpr(new CloseExpr(), d));
    this.addAssign(a);
    var b = new OutputExpr("ROC", new MulExpr(new DivExpr(new SubExpr(new CloseExpr(), a), a), new ConstExpr(100)));
    this.addOutput(b);
    var c = new OutputExpr("MAROC", new MaExpr(b, e));
    this.addOutput(c);
  };
  ROCIndicator.prototype.getName = function() {
    return "ROC";
  };
  var MTMIndicator = createClass(Indicator);
  MTMIndicator.prototype.__construct = function() {
    MTMIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("N", 2, 120, 12);
    var d = new ParameterExpr("M", 2, 60, 6);
    this.addParameter(c);
    this.addParameter(d);
    var b = new OutputExpr("MTM", new SubExpr(new CloseExpr(), new RefExpr(new CloseExpr(), c)));
    this.addOutput(b);
    var a = new OutputExpr("MTMMA", new MaExpr(b, d));
    this.addOutput(a);
  };
  MTMIndicator.prototype.getName = function() {
    return "MTM";
  };
  var BOLLIndicator = createClass(Indicator);
  BOLLIndicator.prototype.__construct = function() {
    BOLLIndicator.__super.__construct.call(this);
    var e = new ParameterExpr("N", 2, 120, 20);
    this.addParameter(e);
    var d = new AssignExpr("STD_CLOSE_N", new StdExpr(new CloseExpr(), e));
    this.addAssign(d);
    var a = new OutputExpr("BOLL", new MaExpr(new CloseExpr(), e));
    this.addOutput(a);
    var b = new OutputExpr("UB", new AddExpr(a, new MulExpr(new ConstExpr(2), d)));
    this.addOutput(b);
    var c = new OutputExpr("LB", new SubExpr(a, new MulExpr(new ConstExpr(2), d)));
    this.addOutput(c);
  };
  BOLLIndicator.prototype.getName = function() {
    return "BOLL";
  };
  var PSYIndicator = createClass(Indicator);
  PSYIndicator.prototype.__construct = function() {
    PSYIndicator.__super.__construct.call(this);
    var c = new ParameterExpr("N", 2, 100, 12);
    var d = new ParameterExpr("M", 2, 100, 6);
    this.addParameter(c);
    this.addParameter(d);
    var b = new OutputExpr("PSY", new MulExpr(new DivExpr(new CountExpr(new GtExpr(new CloseExpr(), new RefExpr(new CloseExpr(), new ConstExpr(1))), c), c), new ConstExpr(100)));
    this.addOutput(b);
    var a = new OutputExpr("PSYMA", new MaExpr(b, d));
    this.addOutput(a);
  };
  PSYIndicator.prototype.getName = function() {
    return "PSY";
  };
  var STOCHRSIIndicator = createClass(Indicator);
  STOCHRSIIndicator.prototype.__construct = function() {
    STOCHRSIIndicator.__super.__construct.call(this);
    var f = new ParameterExpr("N", 3, 100, 14);
    var h = new ParameterExpr("M", 3, 100, 14);
    var a = new ParameterExpr("P1", 2, 50, 3);
    var g = new ParameterExpr("P2", 2, 50, 3);
    this.addParameter(f);
    this.addParameter(h);
    this.addParameter(a);
    this.addParameter(g);
    var e = new AssignExpr("LC", new RefExpr(new CloseExpr(), new ConstExpr(1)));
    this.addAssign(e);
    var d = new AssignExpr("CLOSE_LC", new SubExpr(new CloseExpr(), e));
    this.addAssign(d);
    var c = new AssignExpr("RSI", new MulExpr(new DivExpr(new SmaExpr(new MaxExpr(d, new ConstExpr(0)), f, new ConstExpr(1)), new SmaExpr(new AbsExpr(d), f, new ConstExpr(1))), new ConstExpr(100)));
    this.addAssign(c);
    var b = new OutputExpr("STOCHRSI", new MulExpr(new DivExpr(new MaExpr(new SubExpr(c, new LlvExpr(c, h)), a), new MaExpr(new SubExpr(new HhvExpr(c, h), new LlvExpr(c, h)), a)), new ConstExpr(100)));
    this.addOutput(b);
    this.addOutput(new RangeOutputExpr("MA", new MaExpr(b, g)));
  };
  STOCHRSIIndicator.prototype.getName = function() {
    return "StochRSI";
  };
  var Chart = createClass();
  Chart.strPeriod = {
    "zh-cn": {line: "(分时)", "1min": "(1分钟)", "5min": "(5分钟)", "15min": "(15分钟)", "30min": "(30分钟)", "1hour": "(1小时)", "1day": "(日线)", "1week": "(周线)", "3min": "(3分钟)", "2hour": "(2小时)", "4hour": "(4小时)", "6hour": "(6小时)", "12hour": "(12小时)", "3day": "(3天)"},
    "en-us": {line: "(Line)", "1min": "(1m)", "5min": "(5m)", "15min": "(15m)", "30min": "(30m)", "1hour": "(1h)", "1day": "(1d)", "1week": "(1w)", "3min": "(3m)", "2hour": "(2h)", "4hour": "(4h)", "6hour": "(6h)", "12hour": "(12h)", "3day": "(3d)"},
    "zh-tw": {line: "(分時)", "1min": "(1分钟)", "5min": "(5分钟)", "15min": "(15分钟)", "30min": "(30分钟)", "1hour": "(1小時)", "1day": "(日线)", "1week": "(周线)", "3min": "(3分钟)", "2hour": "(2小時)", "4hour": "(4小時)", "6hour": "(6小時)", "12hour": "(12小時)", "3day": "(3天)"}
  };
  Chart.prototype.__construct = function() {
    this._data = null;
    this._charStyle = "CandleStick";
    this._depthData = {array: null, asks_count: 0, bids_count: 0, asks_si: 0, asks_ei: 0, bids_si: 0, bids_ei: 0};
    this._time = GLOBAL_VAR.time_type;
    this._market_from = GLOBAL_VAR.market_from;
    this._usd_cny_rate = 6.1934;
    this._money_type = "USD";
    this._contract_unit = "BTC";
    this.strIsLine = false;
    this.strCurrentMarket = 20150403001;
    this.strCurrentMarketType = 1;
  };
  Chart.prototype.setTitle = function() {
    var b = ChartManager.getInstance().getLanguage();
    var a = `${GLOBAL_VAR.market_from_name} ${Chart.strPeriod[b][this.strIsLine?"line":this._time]} ${(this._contract_unit + "/" + this._money_type).toUpperCase()}`;
    ChartManager.getInstance().setTitle("frame0.k0", a);
  };
  Chart.prototype.setCurrentList = function() {};
  Chart.prototype.setMarketFrom = function(a) {
    this._market_from = a;
    this.updateDataAndDisplay();
  };
  Chart.prototype.updateDataAndDisplay = function() {
    GLOBAL_VAR.market_from = this._market_from;
    GLOBAL_VAR.time_type = this._time;
    this.setTitle();
    ChartManager.getInstance().setCurrentDataSource("frame0.k0", "KOALL." + this._market_from + "." + this._time);
    ChartManager.getInstance().setNormalMode();
    var a = GLOBAL_VAR.chartMgr.getDataSource("frame0.k0").getLastDate();
    if (a == -1) {
      GLOBAL_VAR.requestParam = setHttpRequestParam(GLOBAL_VAR.market_from, GLOBAL_VAR.time_type, GLOBAL_VAR.limit, null);
      RequestData(true);
    } else {
      GLOBAL_VAR.requestParam = setHttpRequestParam(GLOBAL_VAR.market_from, GLOBAL_VAR.time_type, null, a.toString());
      RequestData();
    }
    ChartManager.getInstance().redraw("All", false);
  };
  Chart.prototype.setCurrentContractUnit = function(a) {
    this._contract_unit = a;
    this.updateDataAndDisplay();
  };
  Chart.prototype.setCurrentMoneyType = function(a) {
    this._money_type = a;
    this.updateDataAndDisplay();
  };
  Chart.prototype.setCurrentPeriod = function(a) {
    this._time = GLOBAL_VAR.periodMap[a];
    this.updateDataAndDisplay();
  };
  Chart.prototype.updateDataSource = function(a) {
    this._data = a;
    ChartManager.getInstance().updateData("frame0.k0", this._data);
  };
  Chart.prototype.updateDepth = function(d) {
    if (d == null) {
      this._depthData.array = [];
      ChartManager.getInstance().redraw("All", false);
      return;
    }
    if (!d.asks || !d.bids || d.asks == "" || d.bids == "") {
      return;
    }
    var b = this._depthData;
    b.array = [];
    for (var a = 0; a < d.asks.length; a++) {
      var c = {};
      c.rate = d.asks[a][0];
      c.amount = d.asks[a][1];
      b.array.push(c);
    }
    for (var a = 0; a < d.bids.length; a++) {
      var c = {};
      c.rate = d.bids[a][0];
      c.amount = d.bids[a][1];
      b.array.push(c);
    }
    b.asks_count = d.asks.length;
    b.bids_count = d.bids.length;
    b.asks_si = b.asks_count - 1;
    b.asks_ei = 0;
    b.bids_si = b.asks_count;
    b.bids_ei = b.asks_count + b.bids_count - 1;
    for (var a = b.asks_si; a >= b.asks_ei; a--) {
      if (a == b.asks_si) {
        b.array[a].amounts = b.array[a].amount;
      } else {
        b.array[a].amounts = b.array[a + 1].amounts + b.array[a].amount;
      }
    }
    for (var a = b.bids_si; a <= b.bids_ei; a++) {
      if (a == b.bids_si) {
        b.array[a].amounts = b.array[a].amount;
      } else {
        b.array[a].amounts = b.array[a - 1].amounts + b.array[a].amount;
      }
    }
    ChartManager.getInstance().redraw("All", false);
  };
  Chart.prototype.setMainIndicator = function(a) {
    this._mainIndicator = a;
    if (a == "NONE") {
      ChartManager.getInstance().removeMainIndicator("frame0.k0");
    } else {
      ChartManager.getInstance().setMainIndicator("frame0.k0", a);
    }
    ChartManager.getInstance().redraw("All", true);
  };
  Chart.prototype.setIndicator = function(b, a) {
    if (a == "NONE") {
      var b = 2;
      if (Template.displayVolume == false) {
        b = 1;
      }
      var c = ChartManager.getInstance().getIndicatorAreaName("frame0.k0", b);
      if (c != "") {
        ChartManager.getInstance().removeIndicator(c);
      }
    } else {
      var b = 2;
      if (Template.displayVolume == false) {
        b = 1;
      }
      var c = ChartManager.getInstance().getIndicatorAreaName("frame0.k0", b);
      if (c == "") {
        Template.createIndicatorChartComps("frame0.k0", a);
      } else {
        ChartManager.getInstance().setIndicator(c, a);
      }
    }
    ChartManager.getInstance().redraw("All", true);
  };
  Chart.prototype.addIndicator = function(a) {
    ChartManager.getInstance().addIndicator(a);
    ChartManager.getInstance().redraw("All", true);
  };
  Chart.prototype.removeIndicator = function(a) {
    var b = ChartManager.getInstance().getIndicatorAreaName(2);
    ChartManager.getInstance().removeIndicator(b);
    ChartManager.getInstance().redraw("All", true);
  };
  var CName = createClass();
  CName.prototype.__construct = function(a) {
    this._names = [];
    this._comps = [];
    if (a instanceof CName) {
      this._names = a._names;
      this._comps = a._comps;
    } else {
      var d = a.split(".");
      var c = d.length - 1;
      if (c > 0) {
        this._comps = d;
        this._names.push(d[0]);
        for (var b = 1; b <= c; b++) {
          this._names.push(this._names[b - 1] + "." + d[b]);
        }
      } else {
        this._comps.push(a);
        this._names.push(a);
      }
    }
  };
  CName.prototype.getCompAt = function(a) {
    if (a >= 0 && a < this._comps.length) {
      return this._comps[a];
    }
    return "";
  };
  CName.prototype.getName = function(a) {
    if (a < 0) {
      if (this._names.length > 0) {
        return this._names[this._names.length - 1];
      }
    } else {
      if (a < this._names.length) {
        return this._names[a];
      }
    }
    return "";
  };
  var NamedObject = createClass();
  NamedObject.prototype.__construct = function(a) {
    this._name = a;
    this._nameObj = new CName(a);
  };
  NamedObject.prototype.getFrameName = function() {
    return this._nameObj.getName(0);
  };
  NamedObject.prototype.getDataSourceName = function() {
    return this._nameObj.getName(1);
  };
  NamedObject.prototype.getAreaName = function() {
    return this._nameObj.getName(2);
  };
  NamedObject.prototype.getName = function() {
    return this._nameObj.getName(-1);
  };
  NamedObject.prototype.getNameObject = function() {
    return this._nameObj;
  };
  var ChartArea = createClass(NamedObject);
  ChartArea.prototype.__construct = function(a) {
    ChartArea.__super.__construct.call(this, a);
    this._left = 0;
    this._top = 0;
    this._right = 0;
    this._bottom = 0;
    this._changed = false;
    this._highlighted = false;
    this._pressed = false;
    this._selected = false;
    this.Measuring = new MEvent();
  };
  ChartArea.DockStyle = {Left: 0, Top: 1, Right: 2, Bottom: 3, Fill: 4};
  ChartArea.prototype.getDockStyle = function() {
    return this._dockStyle;
  };
  ChartArea.prototype.setDockStyle = function(a) {
    this._dockStyle = a;
  };
  ChartArea.prototype.getLeft = function() {
    return this._left;
  };
  ChartArea.prototype.getTop = function() {
    return this._top;
  };
  ChartArea.prototype.setTop = function(a) {
    if (this._top != a) {
      this._top = a;
      this._changed = true;
    }
  };
  ChartArea.prototype.getRight = function() {
    return this._right;
  };
  ChartArea.prototype.getBottom = function() {
    return this._bottom;
  };
  ChartArea.prototype.setBottom = function(a) {
    if (this._bottom != a) {
      this._bottom = a;
      this._changed = true;
    }
  };
  ChartArea.prototype.getCenter = function() {
    return (this._left + this._right) >> 1;
  };
  ChartArea.prototype.getMiddle = function() {
    return (this._top + this._bottom) >> 1;
  };
  ChartArea.prototype.getWidth = function() {
    return this._right - this._left;
  };
  ChartArea.prototype.getHeight = function() {
    return this._bottom - this._top;
  };
  ChartArea.prototype.getRect = function() {
    return {X: this._left, Y: this._top, Width: this._right - this._left, Height: this._bottom - this._top};
  };
  ChartArea.prototype.contains = function(a, b) {
    if (a >= this._left && a < this._right) {
      if (b >= this._top && b < this._bottom) {
        return [this];
      }
    }
    return null;
  };
  ChartArea.prototype.getMeasuredWidth = function() {
    return this._measuredWidth;
  };
  ChartArea.prototype.getMeasuredHeight = function() {
    return this._measuredHeight;
  };
  ChartArea.prototype.setMeasuredDimension = function(b, a) {
    this._measuredWidth = b;
    this._measuredHeight = a;
  };
  ChartArea.prototype.measure = function(b, c, a) {
    this._measuredWidth = 0;
    this._measuredHeight = 0;
    this.Measuring.raise(this, {Width: c, Height: a});
    if (this._measuredWidth == 0 && this._measuredHeight == 0) {
      this.setMeasuredDimension(c, a);
    }
  };
  ChartArea.prototype.layout = function(e, d, c, a, b) {
    e <<= 0;
    if (this._left != e) {
      this._left = e;
      this._changed = true;
    }
    d <<= 0;
    if (this._top != d) {
      this._top = d;
      this._changed = true;
    }
    c <<= 0;
    if (this._right != c) {
      this._right = c;
      this._changed = true;
    }
    a <<= 0;
    if (this._bottom != a) {
      this._bottom = a;
      this._changed = true;
    }
    if (b) {
      this._changed = true;
    }
  };
  ChartArea.prototype.isChanged = function() {
    return this._changed;
  };
  ChartArea.prototype.setChanged = function(a) {
    this._changed = a;
  };
  ChartArea.prototype.isHighlighted = function() {
    return this._highlighted;
  };
  ChartArea.prototype.getHighlightedArea = function() {
    return this._highlighted ? this : null;
  };
  ChartArea.prototype.highlight = function(a) {
    this._highlighted = this == a;
    return this._highlighted ? this : null;
  };
  ChartArea.prototype.isPressed = function() {
    return this._pressed;
  };
  ChartArea.prototype.setPressed = function(a) {
    this._pressed = a;
  };
  ChartArea.prototype.isSelected = function() {
    return this._selected;
  };
  ChartArea.prototype.getSelectedArea = function() {
    return this._selected ? this : null;
  };
  ChartArea.prototype.select = function(a) {
    this._selected = this == a;
    return this._selected ? this : null;
  };
  ChartArea.prototype.onMouseMove = function(a, b) {
    return null;
  };
  ChartArea.prototype.onMouseLeave = function(a, b) {};
  ChartArea.prototype.onMouseDown = function(a, b) {
    return null;
  };
  ChartArea.prototype.onMouseUp = function(a, b) {
    return null;
  };
  var MainArea = createClass(ChartArea);
  MainArea.prototype.__construct = function(a) {
    MainArea.__super.__construct.call(this, a);
    this._dragStarted = false;
    this._oldX = 0;
    this._oldY = 0;
    this._passMoveEventToToolManager = true;
  };
  MainArea.prototype.onMouseMove = function(a, c) {
    var b = ChartManager.getInstance();
    if (b._capturingMouseArea == this) {
      if (this._dragStarted == false) {
        if (Math.abs(this._oldX - a) > 1 || Math.abs(this._oldY - c) > 1) {
          this._dragStarted = true;
        }
      }
    }
    if (this._dragStarted) {
      b.hideCursor();
      if (b.onToolMouseDrag(this.getFrameName(), a, c)) {
        return this;
      }
      b.getTimeline(this.getDataSourceName()).move(a - this._oldX);
      return this;
    }
    if (this._passMoveEventToToolManager && b.onToolMouseMove(this.getFrameName(), a, c)) {
      b.hideCursor();
      return this;
    }
    switch (b._drawingTool) {
      case ChartManager.DrawingTool.Cursor:
        b.showCursor();
        break;
      case ChartManager.DrawingTool.CrossCursor:
        if (b.showCrossCursor(this, a, c)) {
          b.hideCursor();
        } else {
          b.showCursor();
        }
        break;
      default:
        b.hideCursor();
        break;
    }
    return this;
  };
  MainArea.prototype.onMouseLeave = function(a, b) {
    this._dragStarted = false;
    this._passMoveEventToToolManager = true;
  };
  MainArea.prototype.onMouseDown = function(a, c) {
    var b = ChartManager.getInstance();
    b.getTimeline(this.getDataSourceName()).startMove();
    this._oldX = a;
    this._oldY = c;
    this._dragStarted = false;
    if (b.onToolMouseDown(this.getFrameName(), a, c)) {
      this._passMoveEventToToolManager = false;
    }
    return this;
  };
  MainArea.prototype.onMouseUp = function(a, d) {
    var c = ChartManager.getInstance();
    var b = null;
    if (this._dragStarted) {
      this._dragStarted = false;
      b = this;
    }
    if (c.onToolMouseUp(this.getFrameName(), a, d)) {
      b = this;
    }
    this._passMoveEventToToolManager = true;
    return b;
  };
  var IndicatorArea = createClass(ChartArea);
  IndicatorArea.prototype.__construct = function(a) {
    IndicatorArea.__super.__construct.call(this, a);
    this._dragStarted = false;
    this._oldX = 0;
    this._oldY = 0;
  };
  IndicatorArea.prototype.onMouseMove = function(a, c) {
    var b = ChartManager.getInstance();
    if (b._capturingMouseArea == this) {
      if (this._dragStarted == false) {
        if (this._oldX != a || this._oldY != c) {
          this._dragStarted = true;
        }
      }
    }
    if (this._dragStarted) {
      b.hideCursor();
      b.getTimeline(this.getDataSourceName()).move(a - this._oldX);
      return this;
    }
    switch (b._drawingTool) {
      case ChartManager.DrawingTool.CrossCursor:
        b.showCrossCursor(this, a, c) ? b.hideCursor() : b.showCursor()
        break;
      default:
        b.showCursor();
        break;
    }
    return this;
  };
  IndicatorArea.prototype.onMouseLeave = function(a, b) {
    this._dragStarted = false;
  };
  IndicatorArea.prototype.onMouseDown = function(a, c) {
    var b = ChartManager.getInstance();
    b.getTimeline(this.getDataSourceName()).startMove();
    this._oldX = a;
    this._oldY = c;
    this._dragStarted = false;
    return this;
  };
  IndicatorArea.prototype.onMouseUp = function(a, b) {
    if (this._dragStarted) {
      this._dragStarted = false;
      return this;
    }
    return null;
  };
  var MainRangeArea = createClass(ChartArea);
  MainRangeArea.prototype.__construct = function(a) {
    MainRangeArea.__super.__construct.call(this, a);
  };
  MainRangeArea.prototype.onMouseMove = function(a, b) {
    ChartManager.getInstance().showCursor();
    return this;
  };
  var IndicatorRangeArea = createClass(ChartArea);
  IndicatorRangeArea.prototype.__construct = function(a) {
    IndicatorRangeArea.__super.__construct.call(this, a);
  };
  IndicatorRangeArea.prototype.onMouseMove = function(a, b) {
    ChartManager.getInstance().showCursor();
    return this;
  };
  var TimelineArea = createClass(ChartArea);
  TimelineArea.prototype.__construct = function(a) {
    TimelineArea.__super.__construct.call(this, a);
  };
  TimelineArea.prototype.onMouseMove = function(a, b) {
    ChartManager.getInstance().showCursor();
    return this;
  };
  var ChartAreaGroup = createClass(ChartArea);
  ChartAreaGroup.prototype.__construct = function(a) {
    ChartAreaGroup.__super.__construct.call(this, a);
    this._areas = [];
    this._highlightedArea = null;
    this._selectedArea = null;
  };
  ChartAreaGroup.prototype.contains = function(b, g) {
    var d;
    var c, f, e = this._areas.length;
    for (f = 0; f < e; f++) {
      c = this._areas[f];
      d = c.contains(b, g);
      if (d != null) {
        d.push(this);
        return d;
      }
    }
    return ChartAreaGroup.__super.contains(b, g);
  };
  ChartAreaGroup.prototype.getAreaCount = function() {
    return this._areas.length;
  };
  ChartAreaGroup.prototype.getAreaAt = function(a) {
    if (a < 0 || a >= this._areas.length) {
      return null;
    }
    return this._areas[a];
  };
  ChartAreaGroup.prototype.addArea = function(a) {
    this._areas.push(a);
  };
  ChartAreaGroup.prototype.removeArea = function(c) {
    var b, a = this._areas.length;
    for (b = 0; b < a; b++) {
      if (c == this._areas[b]) {
        this._areas.splice(b);
        this.setChanged(true);
        break;
      }
    }
  };
  ChartAreaGroup.prototype.getGridColor = function() {
    return this._gridColor;
  };
  ChartAreaGroup.prototype.setGridColor = function(a) {
    this._gridColor = a;
  };
  ChartAreaGroup.prototype.getHighlightedArea = function() {
    if (this._highlightedArea != null) {
      return this._highlightedArea.getHighlightedArea();
    }
    return null;
  };
  ChartAreaGroup.prototype.highlight = function(c) {
    this._highlightedArea = null;
    var d, b, a = this._areas.length;
    for (b = 0; b < a; b++) {
      d = this._areas[b].highlight(c);
      if (d != null) {
        this._highlightedArea = d;
        return this;
      }
    }
    return null;
  };
  ChartAreaGroup.prototype.getSelectedArea = function() {
    if (this._selectedArea != null) {
      return this._selectedArea.getSelectedArea();
    }
    return null;
  };
  ChartAreaGroup.prototype.select = function(c) {
    this._selectedArea = null;
    var d, b, a = this._areas.length;
    for (b = 0; b < a; b++) {
      d = this._areas[b].select(c);
      if (d != null) {
        this._selectedArea = d;
        return this;
      }
    }
    return null;
  };
  ChartAreaGroup.prototype.onMouseLeave = function(a, d) {
    var c, b = this._areas.length;
    for (c = 0; c < b; c++) {
      this._areas[c].onMouseLeave(a, d);
    }
  };
  ChartAreaGroup.prototype.onMouseUp = function(b, f) {
    var c, e, d = this._areas.length;
    for (e = 0; e < d; e++) {
      c = this._areas[e].onMouseUp(b, f);
      if (c != null) {
        return c;
      }
    }
    return null;
  };
  var TableLayout = createClass(ChartAreaGroup);
  TableLayout.prototype.__construct = function(a) {
    TableLayout.__super.__construct.call(this, a);
    this._nextRowId = 0;
    this._focusedRowIndex = -1;
  };
  TableLayout.prototype.getNextRowId = function() {
    return this._nextRowId++;
  };
  TableLayout.prototype.measure = function(a, u, m) {
    this.setMeasuredDimension(u, m);
    var g, p = 0, H = 0;
    var x, k;
    var o = [];
    var w, v = this._areas.length;
    for (w = 0; w < v; w += 2) {
      g = this._areas[w].getHeight();
      if (g == 0) {
        if (w == 0) {
          k = (v + 1) >> 1;
          var t = k * 2 + 5;
          var d = (m / t * 2) << 0;
          x = m;
          for (w = k - 1; w > 0; w--) {
            o.unshift(d);
            x -= d;
          }
          o.unshift(x);
          break;
        } else {
          if (w == 2) {
            g = p / 3;
          } else {
            g = p;
          }
        }
      }
      H += g;
      p = g;
      o.push(g);
    }
    if (H > 0) {
      var J = m / H;
      k = (v + 1) >> 1;
      x = m;
      for (w = k - 1; w > 0; w--) {
        o[w] *= J;
        x -= o[w];
      }
      o[0] = x;
    }
    var G = 8;
    var z = 88 * GLOBAL_VAR.ratio;
    var b = Math.min(240, u >> 1);
    var f = z;
    var I = ChartManager.getInstance();
    var e = I.getTimeline(this.getDataSourceName());
    if (e.getFirstIndex() >= 0) {
      var l = [];
      for (f = z; f < b; f += G) {
        l.push(e.calcFirstIndex(e.calcColumnCount(u - f)));
      }
      var y = e.getLastIndex();
      var q = [".main", ".secondary"];
      var s = new Array(l.length);
      var C, j;
      for (
        C = 0, j = 0, f = z;
        C < this._areas.length && j < l.length;
        C += 2
      ) {
        var A = this._areas[C];
        var F = I.getPlotter(A.getName() + "Range.main");
        for (var B in q) {
          var r = I.getDataProvider(A.getName() + q[B]);
          if (r == undefined) {
            continue;
          }
          r.calcRange(l, y, s, null);
          while (j < l.length) {
            var E = F.getRequiredWidth(a, s[j].min);
            var D = F.getRequiredWidth(a, s[j].max);
            if (Math.max(E, D) < f) {
              break;
            }
            j++;
            f += G;
          }
        }
      }
    }
    for (w = 1; w < this._areas.length; w += 2) {
      this._areas[w].measure(a, f, o[w >> 1]);
    }
    var c = u - f;
    for (w = 0; w < this._areas.length; w += 2) {
      this._areas[w].measure(a, c, o[w >> 1]);
    }
  };
  TableLayout.prototype.layout = function(g, k, l, a, d) {
    TableLayout.__super.layout.call(this, g, k, l, a, d);
    if (this._areas.length < 1) {
      return;
    }
    var e;
    var c = g + this._areas[0].getMeasuredWidth();
    var m = k, j;
    if (!d) {
      d = this.isChanged();
    }
    var h, f = this._areas.length;
    for (h = 0; h < f; h++) {
      e = this._areas[h];
      j = m + e.getMeasuredHeight();
      e.layout(g, m, c, j, d);
      h++;
      e = this._areas[h];
      e.layout(c, m, this.getRight(), j, d);
      m = j;
    }
    this.setChanged(false);
  };
  TableLayout.prototype.drawGrid = function(c) {
    if (this._areas.length < 1) {
      return;
    }
    var d = ChartManager.getInstance();
    var e = d.getTheme(this.getFrameName());
    c.fillStyle = e.getColor(Theme.Color.Grid1);
    c.fillRect(this._areas[0].getRight(), this.getTop(), 1 * GLOBAL_VAR.ratio, this.getHeight());
    var b, a = this._areas.length - 2;
    for (b = 0; b < a; b += 2) {
      c.fillRect(this.getLeft(), this._areas[b].getBottom(), this.getWidth(), 1 * GLOBAL_VAR.ratio);
    }
    if (!d.getCaptureMouseWheelDirectly()) {
      for (b = 0, a += 2; b < a; b += 2) {
        if (this._areas[b].isSelected()) {
          c.strokeStyle = e.getColor(Theme.Color.Indicator1);
          c.strokeRect(this.getLeft() + 0.5, this.getTop() + 0.5, this.getWidth() - 1, this.getHeight() - 1);
          break;
        }
      }
    }
  };
  TableLayout.prototype.highlight = function(c) {
    this._highlightedArea = null;
    var d, b, a = this._areas.length;
    for (b = 0; b < a; b++) {
      d = this._areas[b];
      if (d == c) {
        b &= ~1;
        d = this._areas[b];
        d.highlight(d);
        this._highlightedArea = d;
        b++;
        d = this._areas[b];
        d.highlight(null);
        d.highlight(d);
      } else {
        d.highlight(null);
      }
    }
    return this._highlightedArea != null ? this : null;
  };
  TableLayout.prototype.select = function(c) {
    this._selectedArea = null;
    var d, b, a = this._areas.length;
    for (b = 0; b < a; b++) {
      d = this._areas[b];
      if (d == c) {
        b &= ~1;
        d = this._areas[b];
        d.select(d);
        this._selectedArea = d;
        b++;
        d = this._areas[b];
        d.select(d);
      } else {
        d.select(null);
      }
    }
    return this._selectedArea != null ? this : null;
  };
  TableLayout.prototype.onMouseMove = function(l, k) {
    if (this._focusedRowIndex >= 0) {
      var m = this._areas[this._focusedRowIndex];
      var e = this._areas[this._focusedRowIndex + 2];
      var f = k - this._oldY;
      if (f == 0) {
        return this;
      }
      var h = this._oldUpperBottom + f;
      var g = this._oldLowerTop + f;
      if (h - m.getTop() >= 60 && e.getBottom() - g >= 60) {
        m.setBottom(h);
        e.setTop(g);
      }
      return this;
    }
    var c, a = this._areas.length - 2;
    for (c = 0; c < a; c += 2) {
      var j = this._areas[c].getBottom();
      if (k >= j - 4 && k < j + 4) {
        ChartManager.getInstance().showCursor("n-resize");
        return this;
      }
    }
    return null;
  };
  TableLayout.prototype.onMouseLeave = function(a, b) {
    this._focusedRowIndex = -1;
  };
  TableLayout.prototype.onMouseDown = function(c, f) {
    var e, d = this._areas.length - 2;
    for (e = 0; e < d; e += 2) {
      var a = this._areas[e].getBottom();
      if (f >= a - 4 && f < a + 4) {
        this._focusedRowIndex = e;
        this._oldY = f;
        this._oldUpperBottom = a;
        this._oldLowerTop = this._areas[e + 2].getTop();
        return this;
      }
    }
    return null;
  };
  TableLayout.prototype.onMouseUp = function(b, e) {
    if (this._focusedRowIndex >= 0) {
      this._focusedRowIndex = -1;
      var d, c = this._areas.length;
      var a = [];
      for (d = 0; d < c; d += 2) {
        a.push(this._areas[d].getHeight());
      }
      ChartSettings.get().charts.areaHeight = a;
      ChartSettings.save();
    }
    return this;
  };
  var DockableLayout = createClass(ChartAreaGroup);
  DockableLayout.prototype.__construct = function(a) {
    DockableLayout.__super.__construct.call(this, a);
  };
  DockableLayout.prototype.measure = function(c, d, a) {
    DockableLayout.__super.measure.call(this, c, d, a);
    d = this.getMeasuredWidth();
    a = this.getMeasuredHeight();
    for (var b in this._areas) {
      var e = this._areas[b];
      e.measure(c, d, a);
      switch (e.getDockStyle()) {
        case ChartArea.DockStyle.left:
        case ChartArea.DockStyle.Right:
          d -= e.getMeasuredWidth();
          break;
        case ChartArea.DockStyle.Top:
        case ChartArea.DockStyle.Bottom:
          a -= e.getMeasuredHeight();
          break;
        case ChartArea.DockStyle.Fill:
          d = 0;
          a = 0;
          break;
      }
    }
  };
  DockableLayout.prototype.layout = function(d, g, k, a, b) {
    DockableLayout.__super.layout.call(this, d, g, k, a, b);
    d = this.getLeft();
    g = this.getTop();
    k = this.getRight();
    a = this.getBottom();
    var j, f;
    if (!b) {
      b = this.isChanged();
    }
    for (var e in this._areas) {
      var c = this._areas[e];
      switch (c.getDockStyle()) {
        case ChartArea.DockStyle.left:
          j = c.getMeasuredWidth();
          c.layout(d, g, d + j, a, b);
          d += j;
          break;
        case ChartArea.DockStyle.Top:
          f = c.getMeasuredHeight();
          c.layout(d, g, k, g + f, b);
          g += f;
          break;
        case ChartArea.DockStyle.Right:
          j = c.getMeasuredWidth();
          c.layout(k - j, g, k, a, b);
          k -= j;
          break;
        case ChartArea.DockStyle.Bottom:
          f = c.getMeasuredHeight();
          c.layout(d, a - f, k, a, b);
          a -= f;
          break;
        case ChartArea.DockStyle.Fill:
          c.layout(d, g, k, a, b);
          d = k;
          g = a;
          break;
      }
    }
    this.setChanged(false);
  };
  DockableLayout.prototype.drawGrid = function(c) {
    var j = ChartManager.getInstance();
    var e = j.getTheme(this.getFrameName());
    var d = this.getLeft();
    var g = this.getTop();
    var h = this.getRight();
    var a = this.getBottom();
    c.fillStyle = e.getColor(this._gridColor);
    for (var f in this._areas) {
      var b = this._areas[f];
      switch (b.getDockStyle()) {
        case ChartArea.DockStyle.Left:
          c.fillRect(b.getRight(), g, 1, a - g);
          d += b.getWidth();
          break;
        case ChartArea.DockStyle.Top:
          c.fillRect(d, b.getBottom(), h - d, 1 * GLOBAL_VAR.ratio);
          g += b.getHeight();
          break;
        case ChartArea.DockStyle.Right:
          c.fillRect(b.getLeft(), g, 1, a - g);
          h -= b.getWidth();
          break;
        case ChartArea.DockStyle.Bottom:
          c.fillRect(d, b.getTop(), h - d, 1 * GLOBAL_VAR.ratio);
          a -= b.getHeight();
          break;
      }
    }
  };
  var ChartManager = createClass();
  ChartManager.DrawingTool = {
    Cursor: 0,
    CrossCursor: 1,
    DrawLines: 2,
    DrawFibRetrace: 3,
    DrawFibFans: 4,
    SegLine: 5,
    StraightLine: 6,
    ArrowLine: 7,
    RayLine: 8,
    HoriStraightLine: 9,
    HoriRayLine: 10,
    HoriSegLine: 11,
    VertiStraightLine: 12,
    PriceLine: 13,
    BiParallelLine: 14,
    BiParallelRayLine: 15,
    TriParallelLine: 16,
    BandLine: 17
  };
  ChartManager._instance = null;
  ChartManager.getInstance = function() {
    if (ChartManager._instance == null) {
      ChartManager._instance = new ChartManager();
    }
    return ChartManager._instance;
  };
  ChartManager.prototype.__construct = function() {
    this._dataSources = {};
    this._dataSourceCache = {};
    this._dataProviders = {};
    this._frames = {};
    this._areas = {};
    this._timelines = {};
    this._ranges = {};
    this._plotters = {};
    this._themes = {};
    this._titles = {};
    this._frameMousePos = {};
    this._dsChartStyle = {};
    this._dragStarted = false;
    this._oldX = 0;
    this._fakeIndicators = {};
    this._captureMouseWheelDirectly = true;
    this._chart = {};
    this._chart.defaultFrame = new Chart();
    this._drawingTool = ChartManager.DrawingTool.CrossCursor;
    this._beforeDrawingTool = this._drawingTool;
    this._language = "zh-cn";
    this._mainCanvas = null;
    this._overlayCanvas = null;
    this._mainContext = null;
    this._overlayContext = null;
  };
  ChartManager.prototype.redraw = function(a, b) {
    if (a == undefined || b) {
      a = "All";
    }
    if (a == "All" || a == "MainCanvas") {
      if (b) {
        this.getFrame("frame0").setChanged(true);
      }
      this.layout(this._mainContext, "frame0", 0, 0, this._mainCanvas.width, this._mainCanvas.height);
      this.drawMain("frame0", this._mainContext);
    }
    if (a == "All" || a == "OverlayCanvas") {
      this._overlayContext.clearRect(0, 0, this._overlayCanvas.width, this._overlayCanvas.height);
      this.drawOverlay("frame0", this._overlayContext);
    }
  };
  ChartManager.prototype.bindCanvas = function(b, a) {
    if (b == "main") {
      this._mainCanvas = a;
      this._mainContext = a.getContext("2d");
    } else if (b == "overlay") {
      this._overlayCanvas = a;
      this._overlayContext = a.getContext("2d");
      if (this._captureMouseWheelDirectly) {
        this._overlayCanvas.removeEventListener('mousewheel', mouseWheel)
        this._overlayCanvas.addEventListener('mousewheel', mouseWheel, false);
      }
    }
  };
  ChartManager.prototype.getCaptureMouseWheelDirectly = function() {
    return this._captureMouseWheelDirectly;
  };
  ChartManager.prototype.setCaptureMouseWheelDirectly = function(a) {
    this._captureMouseWheelDirectly = a;
    if (a) {
      this._overlayCanvas.removeEventListener('mousewheel', mouseWheel)
      this._overlayCanvas.addEventListener('mousewheel', mouseWheel, false);
    } else {
      this._overlayCanvas.removeEventListener('mousewheel', mouseWheel);
    }
  };
  ChartManager.prototype.getChart = function(a) {
    return this._chart.defaultFrame;
  };
  ChartManager.prototype.init = function() {
    delete this._ranges["frame0.k0.indic1"];
    delete this._ranges["frame0.k0.indic1Range"];
    delete this._areas["frame0.k0.indic1"];
    delete this._areas["frame0.k0.indic1Range"];
    DefaultTemplate.loadTemplate("frame0.k0", "KOALL");
    this.redraw("All", true);
  };
  ChartManager.prototype.setCurrentDrawingTool = function(a) {
    this._drawingTool = ChartManager.DrawingTool[a];
    this.setRunningMode(this._drawingTool);
  };
  ChartManager.prototype.getLanguage = function() {
    return this._language;
  };
  ChartManager.prototype.setLanguage = function(a) {
    this._language = a;
  };
  ChartManager.prototype.setThemeName = function(a, b) {
    if (b == undefined) {
      b = "Dark";
    }
    var c;
    switch (b) {
      case "Light":
        c = new LightTheme();
        break;
      default:
        b = "Dark";
        c = new DarkTheme();
        break;
    }
    this._themeName = b;
    this.setTheme(a, c);
    this.getFrame(a).setChanged(true);
  };
  ChartManager.prototype.getChartStyle = function(b) {
    var a = this._dsChartStyle[b];
    if (a == undefined) {
      return "CandleStick";
    }
    return a;
  };
  ChartManager.prototype.setChartStyle = function(e, c) {
    if (this._dsChartStyle[e] == c) {
      return;
    }
    var g = e + ".main";
    var b = g + ".main";
    var a = g + ".main";
    var f, d;
    switch (c) {
      case "CandleStick":
      case "CandleStickHLC":
      case "OHLC":
        f = this.getDataProvider(b);
        if (f == undefined || !isInstance(f, MainDataProvider)) {
          f = new MainDataProvider(b);
          this.setDataProvider(b, f);
          f.updateData();
        }
        this.setMainIndicator(e, ChartSettings.get().charts.mIndic);
        switch (c) {
          case "CandleStick":
            d = new CandlestickPlotter(a);
            break;
          case "CandleStickHLC":
            d = new CandlestickHLCPlotter(a);
            break;
          case "OHLC":
            d = new OHLCPlotter(a);
            break;
        }
        this.setPlotter(a, d);
        d = new MinMaxPlotter(g + ".decoration");
        this.setPlotter(d.getName(), d);
        break;
      case "Line":
        f = new IndicatorDataProvider(b);
        this.setDataProvider(f.getName(), f);
        f.setIndicator(new HLCIndicator());
        this.removeMainIndicator(e);
        d = new IndicatorPlotter(a);
        this.setPlotter(a, d);
        this.removePlotter(g + ".decoration");
        break;
    }
    this.getArea(d.getAreaName()).setChanged(true);
    this._dsChartStyle[e] = c;
  };
  ChartManager.prototype.setNormalMode = function() {
    this._drawingTool = this._beforeDrawingTool;
    if (this._drawingTool == ChartManager.DrawingTool.Cursor) {
      this.showCursor();
    } else {
      this.hideCursor();
    }
    opts.onToolCallback && opts.onToolCallback()
  };
  ChartManager.prototype.setRunningMode = function(b) {
    var c = this.getDataSource("frame0.k0");
    var a = c.getCurrentToolObject();
    if (a != null && a.state != CToolObject.state.AfterDraw) {
      c.delToolObject();
    }
    if (c.getToolObjectCount() > 10) {
      this.setNormalMode();
      return;
    }
    this._drawingTool = b;
    if (b == ChartManager.DrawingTool.Cursor) {
      this.showCursor();
    } else {
    }
    switch (b) {
      case ChartManager.DrawingTool.Cursor:
        this._beforeDrawingTool = b;
        break;
      case ChartManager.DrawingTool.ArrowLine:
        c.addToolObject(new CArrowLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.BandLine:
        c.addToolObject(new CBandLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.BiParallelLine:
        c.addToolObject(new CBiParallelLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.BiParallelRayLine:
        c.addToolObject(new CBiParallelRayLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.CrossCursor:
        this._beforeDrawingTool = b;
        break;
      case ChartManager.DrawingTool.DrawFibFans:
        c.addToolObject(new CFibFansObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.DrawFibRetrace:
        c.addToolObject(new CFibRetraceObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.DrawLines:
        c.addToolObject(new CStraightLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.HoriRayLine:
        c.addToolObject(new CHoriRayLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.HoriSegLine:
        c.addToolObject(new CHoriSegLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.HoriStraightLine:
        c.addToolObject(new CHoriStraightLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.PriceLine:
        c.addToolObject(new CPriceLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.RayLine:
        c.addToolObject(new CRayLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.SegLine:
        c.addToolObject(new CSegLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.StraightLine:
        c.addToolObject(new CStraightLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.TriParallelLine:
        c.addToolObject(new CTriParallelLineObject("frame0.k0"));
        break;
      case ChartManager.DrawingTool.VertiStraightLine:
        c.addToolObject(new CVertiStraightLineObject("frame0.k0"));
        break;
    }
  };
  ChartManager.prototype.getTitle = function(a) {
    return this._titles[a];
  };
  ChartManager.prototype.setTitle = function(b, a) {
    this._titles[b] = a;
  };
  ChartManager.prototype.getLastTime = function(a) {
    var b = this.getCachedDataSource(a);
    if (b != null) {
      var c = b._dataItems.length;
      if (c < 1) {
        return -1;
      }
      return b._dataItems[c - 1].date;
    } else {
      return -1;
    }
  };
  ChartManager.prototype.setCurrentDataSource = function(d, a) {
    var b = this.getCachedDataSource(a);
    if (b != null) {
      this.setDataSource(d, b, true);
    } else {
      var c = this.getDataSource(d);
      if (c != null) {
        if (isInstance(c, MainDataSource)) {
          b = new MainDataSource(a);
        } else {
          if (isInstance(c, CLiveOrderDataSource)) {
            b = new CLiveOrderDataSource(a);
          } else {
            if (isInstance(c, CLiveTradeDataSource)) {
              b = new CLiveTradeDataSource(a);
            }
          }
        }
        this.setDataSource(d, b, true);
        this.setCachedDataSource(a, b);
      }
    }
  };
  ChartManager.prototype.getDataSource = function(a) {
    return this._dataSources[a];
  };
  ChartManager.prototype.setDataSource = function(a, b, c) {
    this._dataSources[a] = b;
    if (c) {
      this.updateData(a, null);
    }
  };
  ChartManager.prototype.getCachedDataSource = function(a) {
    return this._dataSourceCache[a];
  };
  ChartManager.prototype.setCachedDataSource = function(a, b) {
    this._dataSourceCache[a] = b;
  };
  ChartManager.prototype.getDataProvider = function(a) {
    return this._dataProviders[a];
  };
  ChartManager.prototype.setDataProvider = function(a, b) {
    this._dataProviders[a] = b;
  };
  ChartManager.prototype.removeDataProvider = function(a) {
    delete this._dataProviders[a];
  };
  ChartManager.prototype.getFrame = function(a) {
    return this._frames[a];
  };
  ChartManager.prototype.setFrame = function(a, b) {
    this._frames[a] = b;
  };
  ChartManager.prototype.removeFrame = function(a) {
    delete this._frames[a];
  };
  ChartManager.prototype.getArea = function(a) {
    return this._areas[a];
  };
  ChartManager.prototype.setArea = function(a, b) {
    this._areas[a] = b;
  };
  ChartManager.prototype.removeArea = function(a) {
    delete this._areas[a];
  };
  ChartManager.prototype.getTimeline = function(a) {
    return this._timelines[a];
  };
  ChartManager.prototype.setTimeline = function(a, b) {
    this._timelines[a] = b;
  };
  ChartManager.prototype.removeTimeline = function(a) {
    delete this._timelines[a];
  };
  ChartManager.prototype.getRange = function(a) {
    return this._ranges[a];
  };
  ChartManager.prototype.setRange = function(b, a) {
    this._ranges[b] = a;
  };
  ChartManager.prototype.removeRange = function(a) {
    delete this._ranges[a];
  };
  ChartManager.prototype.getPlotter = function(a) {
    return this._plotters[a];
  };
  ChartManager.prototype.setPlotter = function(a, b) {
    this._plotters[a] = b;
  };
  ChartManager.prototype.removePlotter = function(a) {
    delete this._plotters[a];
  };
  ChartManager.prototype.getTheme = function(a) {
    return this._themes[a];
  };
  ChartManager.prototype.setTheme = function(a, b) {
    this._themes[a] = b;
  };
  ChartManager.prototype.getFrameMousePos = function(b, a) {
    if (this._frameMousePos[b] != undefined) {
      a.x = this._frameMousePos[b].x;
      a.y = this._frameMousePos[b].y;
    } else {
      a.x = -1;
      a.y = -1;
    }
  };
  ChartManager.prototype.setFrameMousePos = function(b, c, a) {
    this._frameMousePos[b] = {x: c, y: a};
  };
  ChartManager.prototype.drawArea = function(c, d, f) {
    var g = d.getNameObject().getCompAt(2);
    if (g == "timeline") {
      if (d.getHeight() < 20) {
        return;
      }
    } else {
      if (d.getHeight() < 30) {
        return;
      }
    }
    if (d.getWidth() < 30) {
      return;
    }
    g = d.getName();
    var e, b, a = f.length;
    for (b = 0; b < a; b++) {
      e = this._plotters[g + f[b]];
      if (e != undefined) {
        e.Draw(c);
      }
    }
  };
  ChartManager.prototype.drawAreaMain = function(a, b) {
    var c = this._dataSources[b.getDataSourceName()];
    var d;
    if (c.getDataCount() < 1) {
      d = [".background"];
    } else {
      d = [".background", ".grid", ".main", ".secondary"];
    }
    this.drawArea(a, b, d);
    b.setChanged(false);
  };
  
  ChartManager.prototype.drawAreaOverlay = function(a, b) {
    var c = this._dataSources[b.getDataSourceName()];
    var d;
    if (c.getDataCount() < 1) {
      d = [".selection"];
    } else {
      d = [".decoration", ".selection", ".info", ".tool"];
    }
    this.drawArea(a, b, d);
  };
  ChartManager.prototype.drawMain = function(a, c) {
    var drawn = false;
    if (!drawn) {
      for (var d in this._areas) {
        if (this._areas[d].getFrameName() == a && !isInstance(this._areas[d], ChartAreaGroup)) {
          this.drawAreaMain(c, this._areas[d]);
        }
      }
    }
    var f;
    for (var b in this._timelines) {
      f = this._timelines[b];
      if (f.getFrameName() == a) {
        f.setUpdated(false);
      }
    }
    for (var b in this._ranges) {
      f = this._ranges[b];
      if (f.getFrameName() == a) {
        f.setUpdated(false);
      }
    }
    for (var b in this._areas) {
      f = this._areas[b];
      if (f.getFrameName() == a) {
        f.setChanged(false);
      }
    }
  };
  ChartManager.prototype.drawOverlay = function(a, b) {
    for (var d in this._areas) {
      var c = this._areas[d];
      if (isInstance(c, ChartAreaGroup)) {
        if (c.getFrameName() == a) {
          c.drawGrid(b);
        }
      }
    }
    for (var d in this._areas) {
      var c = this._areas[d];
      if (isInstance(c, ChartAreaGroup) == false) {
        if (c.getFrameName() == a) {
          this.drawAreaOverlay(b, c);
        }
      }
    }
  };
  ChartManager.prototype.updateData = function(a, g) {
    var d = this.getDataSource(a);
    if (d == undefined) {
      return;
    }
    if (g != null) {
      if (!d.update(g)) {
        return false;
      }
      if (d.getUpdateMode() == DataSource.UpdateMode.DoNothing) {
        return true;
      }
    } else {
      d.setUpdateMode(DataSource.UpdateMode.Refresh);
    }
    var j = this.getTimeline(a);
    if (j != undefined) {
      j.update();
    }
    if (d.getDataCount() < 1) {
      return true;
    }
    var k = [".main", ".secondary"];
    var b, h;
    for (var c in this._areas) {
      b = this._areas[c];
      if (isInstance(b, ChartAreaGroup)) {
        continue;
      }
      if (b.getDataSourceName() != a) {
        continue;
      }
      h = b.getName();
      for (var f = 0; f < k.length; f++) {
        var e = this.getDataProvider(h + k[f]);
        if (e != undefined) {
          e.updateData();
        }
      }
    }
    return true;
  };
  ChartManager.prototype.updateRange = function(a) {
    var d = this.getDataSource(a);
    if (d.getDataCount() < 1) {
      return;
    }
    var k = [".main", ".secondary"];
    var b, h;
    for (var c in this._areas) {
      b = this._areas[c];
      if (isInstance(b, ChartAreaGroup)) {
        continue;
      }
      if (b.getDataSourceName() != a) {
        continue;
      }
      h = b.getName();
      for (var f = 0; f < k.length; f++) {
        var e = this.getDataProvider(h + k[f]);
        if (e != undefined) {
          e.updateRange();
        }
      }
      var j = this.getTimeline(a);
      if (j != undefined && j.getMaxItemCount() > 0) {
        var g = this.getRange(h);
        if (g != undefined) {
          g.update();
        }
      }
    }
  };
  ChartManager.prototype.layout = function(b, g, f, i, j, a) {
    var c = this.getFrame(g);
    c.measure(b, j - f, a - i);
    c.layout(f, i, j, a);
    for (var d in this._timelines) {
      var h = this._timelines[d];
      if (h.getFrameName() == g) {
        h.onLayout();
      }
    }
    for (var d in this._dataSources) {
      if (d.substring(0, g.length) == g) {
        this.updateRange(d);
      }
    }
  };
  ChartManager.prototype.SelectRange = function(b, f) {
    var c;
    for (var a in this._ranges) {
      var e = this._ranges[a].getAreaName();
      var d = b.getName();
      if (e == d) {
        this._ranges[a].selectAt(f);
      } else {
        this._ranges[a].unselect();
      }
    }
  };
  ChartManager.prototype.scale = function(b) {
    if (this._highlightedFrame == null) {
      return;
    }
    var a = this._highlightedFrame.getHighlightedArea();
    if (this.getRange(a.getName()) != undefined) {
      var d = a.getDataSourceName();
      var c = this.getTimeline(d);
      if (c != null) {
        c.scale(b);
        this.updateRange(d);
      }
    }
  };
  ChartManager.prototype.showCursor = function(a) {
    if (a === undefined) {
      a = "default";
    }
    this._mainCanvas.style.cursor = a;
    this._overlayCanvas.style.cursor = a;
  };
  ChartManager.prototype.hideCursor = function() {
    this._mainCanvas.style.cursor = "none";
    this._overlayCanvas.style.cursor = "none";
  };
  ChartManager.prototype.showCrossCursor = function(b, a, d) {
    var c = this.getRange(b.getName());
    if (c != undefined) {
      c.selectAt(d);
      c = this.getTimeline(b.getDataSourceName());
      if (c != undefined) {
        if (c.selectAt(a)) {
          return true;
        }
      }
    }
    return false;
  };
  ChartManager.prototype.hideCrossCursor = function(a) {
    if (a != null) {
      for (var c in this._timelines) {
        var b = this._timelines[c];
        if (b != a) {
          b.unselect();
        }
      }
    } else {
      for (var c in this._timelines) {
        this._timelines[c].unselect();
      }
    }
    for (var c in this._ranges) {
      this._ranges[c].unselect();
    }
  };
  ChartManager.prototype.clearHighlight = function() {
    if (this._highlightedFrame != null) {
      this._highlightedFrame.highlight(null);
      this._highlightedFrame = null;
    }
  };
  ChartManager.prototype.onToolMouseMove = function(b, a, f) {
    var c = false;
    b += ".";
    for (var e in this._dataSources) {
      if (e.indexOf(b) == 0) {
        var d = this._dataSources[e];
        if (isInstance(d, MainDataSource)) {
          if (d.toolManager.acceptMouseMoveEvent(a, f)) {
            c = true;
          }
        }
      }
    }
    return c;
  };
  ChartManager.prototype.onToolMouseDown = function(b, a, f) {
    var c = false;
    b += ".";
    for (var e in this._dataSources) {
      if (e.indexOf(b) == 0) {
        var d = this._dataSources[e];
        if (isInstance(d, MainDataSource)) {
          if (d.toolManager.acceptMouseDownEvent(a, f)) {
            c = true;
          }
        }
      }
    }
    return c;
  };
  ChartManager.prototype.onToolMouseUp = function(b, a, f) {
    var c = false;
    b += ".";
    for (var e in this._dataSources) {
      if (e.indexOf(b) == 0) {
        var d = this._dataSources[e];
        if (isInstance(d, MainDataSource)) {
          if (d.toolManager.acceptMouseUpEvent(a, f)) {
            c = true;
          }
        }
      }
    }
    return c;
  };
  ChartManager.prototype.onToolMouseDrag = function(b, a, f) {
    var c = false;
    b += ".";
    for (var e in this._dataSources) {
      if (e.indexOf(b) == 0) {
        var d = this._dataSources[e];
        if (isInstance(d, MainDataSource)) {
          if (d.toolManager.acceptMouseDownMoveEvent(a, f)) {
            c = true;
          }
        }
      }
    }
    return c;
  };
  ChartManager.prototype.onMouseMove = function(f, k, h, g) {
    k *= GLOBAL_VAR.ratio;
		h *= GLOBAL_VAR.ratio;
    var c = this.getFrame(f);
    if (c === undefined) {
      return;
    }
    this.setFrameMousePos(f, k, h);
    this.hideCrossCursor();
    if (this._highlightedFrame != c) {
      this.clearHighlight();
    }
    if (this._capturingMouseArea != null) {
      this._capturingMouseArea.onMouseMove(k, h);
      return;
    }
    var b = c.contains(k, h);
    if (b == null) {
      return;
    }
    var j, e, d = b.length;
    for (e = d - 1; e >= 0; e--) {
      j = b[e];
      j = j.onMouseMove(k, h);
      if (j != null) {
        if (!isInstance(j, ChartAreaGroup)) {
          c.highlight(j);
          this._highlightedFrame = c;
        }
        return;
      }
    }
  };
  ChartManager.prototype.onMouseLeave = function(c, a, e, b) {
    a *= GLOBAL_VAR.ratio;
		e *= GLOBAL_VAR.ratio;
    var d = this.getFrame(c);
    if (d == undefined) {
      return;
    }
    this.setFrameMousePos(c, a, e);
    this.hideCrossCursor();
    this.clearHighlight();
    if (this._capturingMouseArea != null) {
      this._capturingMouseArea.onMouseLeave(a, e);
      this._capturingMouseArea = null;
    }
    this._dragStarted = false;
  };
  ChartManager.prototype.onMouseDown = function(d, b, j) {
    b *= GLOBAL_VAR.ratio;
		j *= GLOBAL_VAR.ratio;
    var h = this.getFrame(d);
    if (h == undefined) {
      return;
    }
    var e = h.contains(b, j);
    if (e == null) {
      return;
    }
    var c, g, f = e.length;
    for (g = f - 1; g >= 0; g--) {
      c = e[g];
      c = c.onMouseDown(b, j);
      if (c != null) {
        this._capturingMouseArea = c;
        return;
      }
    }
  };
  ChartManager.prototype.onMouseUp = function(b, a, d) {
    a *= GLOBAL_VAR.ratio;
		d *= GLOBAL_VAR.ratio;
    var c = this.getFrame(b);
    if (c == undefined) {
      return;
    }
    if (this._capturingMouseArea) {
      if (this._capturingMouseArea.onMouseUp(a, d) == null && this._dragStarted == false) {
        if (this._selectedFrame != null && this._selectedFrame != c) {
          this._selectedFrame.select(null);
        }
        if (this._capturingMouseArea.isSelected()) {
          if (!this._captureMouseWheelDirectly) {
            this._overlayCanvas.removeEventListener('mousewheel', mouseWheel)
          }
          c.select(null);
          this._selectedFrame = null;
        } else {
          if (this._selectedFrame != c) {
            if (!this._captureMouseWheelDirectly) {
              this._overlayCanvas.removeEventListener('mousewheel', mouseWheel)
              this._overlayCanvas.addEventListener("mousewheel", mouseWheel, false);
            }
          }
          c.select(this._capturingMouseArea);
          this._selectedFrame = c;
        }
      }
      this._capturingMouseArea = null;
      this._dragStarted = false;
    }
  };
  ChartManager.prototype.deleteToolObject = function() {
    var b = this.getDataSource("frame0.k0");
    var c = b.getSelectToolObjcet();
    if (c != null) {
      b.delSelectToolObject();
    }
    var a = b.getCurrentToolObject();
    if (a != null && a.getState() != CToolObject.state.AfterDraw) {
      b.delToolObject();
    }
    this.setNormalMode();
  };
  ChartManager.prototype.unloadTemplate = function(a) {
    var b = this.getFrame(a);
    if (b == undefined) {
      return;
    }
    for (var c in this._dataSources) {
      if (c.match(a + ".")) {
        delete this._dataSources[c];
      }
    }
    for (var c in this._dataProviders) {
      if (this._dataProviders[c].getFrameName() == a) {
        delete this._dataProviders[c];
      }
    }
    delete this._frames[a];
    for (var c in this._areas) {
      if (this._areas[c].getFrameName() == a) {
        delete this._areas[c];
      }
    }
    for (var c in this._timelines) {
      if (this._timelines[c].getFrameName() == a) {
        delete this._timelines[c];
      }
    }
    for (var c in this._ranges) {
      if (this._ranges[c].getFrameName() == a) {
        delete this._ranges[c];
      }
    }
    for (var c in this._plotters) {
      if (this._plotters[c].getFrameName() == a) {
        delete this._plotters[c];
      }
    }
    delete this._themes[a];
    delete this._frameMousePos[a];
  };
  ChartManager.prototype.createIndicatorAndRange = function(e, a, c) {
    var d, b;
    switch (a) {
      case "MA":
        d = new MAIndicator();
        b = new PositiveRange(e);
        break;
      case "EMA":
        d = new EMAIndicator();
        b = new PositiveRange(e);
        break;
      case "VOLUME":
        d = new VOLUMEIndicator();
        b = new ZeroBasedPositiveRange(e);
        break;
      case "MACD":
        d = new MACDIndicator();
        b = new ZeroCenteredRange(e);
        break;
      case "DMI":
        d = new DMIIndicator();
        b = new PercentageRange(e);
        break;
      case "DMA":
        d = new DMAIndicator();
        b = new Range(e);
        break;
      case "TRIX":
        d = new TRIXIndicator();
        b = new Range(e);
        break;
      case "BRAR":
        d = new BRARIndicator();
        b = new Range(e);
        break;
      case "VR":
        d = new VRIndicator();
        b = new Range(e);
        break;
      case "OBV":
        d = new OBVIndicator();
        b = new Range(e);
        break;
      case "EMV":
        d = new EMVIndicator();
        b = new Range(e);
        break;
      case "RSI":
        d = new RSIIndicator();
        b = new PercentageRange(e);
        break;
      case "WR":
        d = new WRIndicator();
        b = new PercentageRange(e);
        break;
      case "SAR":
        d = new SARIndicator();
        b = new PositiveRange(e);
        break;
      case "KDJ":
        d = new KDJIndicator();
        b = new PercentageRange(e);
        break;
      case "ROC":
        d = new ROCIndicator();
        b = new Range(e);
        break;
      case "MTM":
        d = new MTMIndicator();
        b = new Range(e);
        break;
      case "BOLL":
        d = new BOLLIndicator();
        b = new Range(e);
        break;
      case "PSY":
        d = new PSYIndicator();
        b = new Range(e);
        break;
      case "StochRSI":
        d = new STOCHRSIIndicator();
        b = new PercentageRange(e);
        break;
      default:
        return null;
    }
    if (!c) {
      d.setParameters(ChartSettings.get().indics[a]);
    }
    return {indic: d, range: b};
  };
  ChartManager.prototype.setMainIndicator = function(e, a) {
    var h = e + ".main";
    var g = this.getDataProvider(h + ".main");
    if (g == undefined || !isInstance(g, MainDataProvider)) {
      return false;
    }
    var f;
    switch (a) {
      case "MA":
        f = new MAIndicator();
        break;
      case "EMA":
        f = new EMAIndicator();
        break;
      case "BOLL":
        f = new BOLLIndicator();
        break;
      case "SAR":
        f = new SARIndicator();
        break;
      default:
        return false;
    }
    f.setParameters(ChartSettings.get().indics[a]);
    var c = h + ".secondary";
    var b = this.getDataProvider(c);
    if (b == undefined) {
      b = new IndicatorDataProvider(c);
      this.setDataProvider(b.getName(), b);
    }
    b.setIndicator(f);
    var d = this.getPlotter(c);
    if (d == undefined) {
      d = new IndicatorPlotter(c);
      this.setPlotter(d.getName(), d);
    }
    this.getArea(h).setChanged(true);
    return true;
  };
  ChartManager.prototype.setIndicator = function(h, a) {
    var d = this.getArea(h);
    if (d == undefined || d.getNameObject().getCompAt(2) == "main") {
      return false;
    }
    var g = this.getDataProvider(h + ".secondary");
    if (g == undefined || !isInstance(g, IndicatorDataProvider)) {
      return false;
    }
    var c = this.createIndicatorAndRange(h, a);
    if (c == null) {
      return false;
    }
    var f = c.indic;
    var b = c.range;
    this.removeDataProvider(h + ".main");
    this.removePlotter(h + ".main");
    this.removeRange(h);
    this.removePlotter(h + "Range.decoration");
    g.setIndicator(f);
    this.setRange(h, b);
    b.setPaddingTop(20 * GLOBAL_VAR.ratio);
    b.setPaddingBottom(5 * GLOBAL_VAR.ratio);
    b.setMinInterval(20 * GLOBAL_VAR.ratio);
    if (isInstance(f, VOLUMEIndicator)) {
      var e = new LastVolumePlotter(h + "Range.decoration");
      this.setPlotter(e.getName(), e);
    } else {
      if (isInstance(f, BOLLIndicator) || isInstance(f, SARIndicator)) {
        var g = new MainDataProvider(h + ".main");
        this.setDataProvider(g.getName(), g);
        g.updateData();
        var e = new OHLCPlotter(h + ".main");
        this.setPlotter(e.getName(), e);
      }
    }
    return true;
  };
  ChartManager.prototype.removeMainIndicator = function(c) {
    var d = c + ".main";
    var b = d + ".secondary";
    var a = this.getDataProvider(b);
    if (a == undefined || !isInstance(a, IndicatorDataProvider)) {
      return;
    }
    this.removeDataProvider(b);
    this.removePlotter(b);
    this.getArea(d).setChanged(true);
  };
  ChartManager.prototype.removeIndicator = function(g) {
    var b = this.getArea(g);
    if (b == undefined || b.getNameObject().getCompAt(2) == "main") {
      return;
    }
    var f = this.getDataProvider(g + ".secondary");
    if (f == undefined || !isInstance(f, IndicatorDataProvider)) {
      return;
    }
    var c = g + "Range";
    var a = this.getArea(c);
    if (a == undefined) {
      return;
    }
    var e = this.getArea(b.getDataSourceName() + ".charts");
    if (e == undefined) {
      return;
    }
    e.removeArea(b);
    this.removeArea(g);
    e.removeArea(a);
    this.removeArea(c);
    for (var d in this._dataProviders) {
      if (this._dataProviders[d].getAreaName() == g) {
        this.removeDataProvider(d);
      }
    }
    for (var d in this._ranges) {
      if (this._ranges[d].getAreaName() == g) {
        this.removeRange(d);
      }
    }
    for (var d in this._plotters) {
      if (this._plotters[d].getAreaName() == g) {
        this.removePlotter(d);
      }
    }
    for (var d in this._plotters) {
      if (this._plotters[d].getAreaName() == c) {
        this.removePlotter(d);
      }
    }
  };
  ChartManager.prototype.getIndicatorParameters = function(a) {
    var f = this._fakeIndicators[a];
    if (f == undefined) {
      var b = this.createIndicatorAndRange("", a);
      if (b == null) {
        return null;
      }
      this._fakeIndicators[a] = f = b.indic;
    }
    var e = [];
    var d, c = f.getParameterCount();
    for (d = 0; d < c; d++) {
      e.push(f.getParameterAt(d));
    }
    return e;
  };
  ChartManager.prototype.setIndicatorParameters = function(a, c) {
    var f, e;
    for (f in this._dataProviders) {
      var d = this._dataProviders[f];
      if (isInstance(d, IndicatorDataProvider) == false) {
        continue;
      }
      e = d.getIndicator();
      if (e.getName() == a) {
        e.setParameters(c);
        d.refresh();
        this.getArea(d.getAreaName()).setChanged(true);
      }
    }
    e = this._fakeIndicators[a];
    if (e == undefined) {
      var b = this.createIndicatorAndRange("", a, true);
      if (b == null) {
        return;
      }
      this._fakeIndicators[a] = e = b.indic;
    }
    e.setParameters(c);
  };
  ChartManager.prototype.getIndicatorAreaName = function(c, a) {
    var d = this.getArea(c + ".charts");
    var b = d.getAreaCount() >> 1;
    if (a < 0 || a >= b) {
      return "";
    }
    return d.getAreaAt(a << 1).getName();
  };
  var Timeline = createClass(NamedObject);
  Timeline._ItemWidth = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29];
  Timeline._SpaceWidth = [1, 2, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 7, 7, 7];
  Timeline.PADDING_LEFT = 4 * GLOBAL_VAR.ratio;
  Timeline.PADDING_RIGHT = 8 * GLOBAL_VAR.ratio;
  Timeline.prototype.__construct = function(a) {
    Timeline.__super.__construct.call(this, a);
    this._updated = false;
    this._innerLeft = 0;
    this._innerWidth = 0;
    this._firstColumnLeft = 0;
    this._scale = opts.scale ? Math.min(Math.max(opts.scale, 0), Timeline._ItemWidth.length - 1) : 6;
    this._lastScale = -1;
    this._maxItemCount = 0;
    this._maxIndex = 0;
    this._firstIndex = -1;
    this._selectedIndex = -1;
    this._savedFirstIndex = -1;
  };
  Timeline.prototype.isLatestShown = function() {
    return this.getLastIndex() == this._maxIndex;
  };
  Timeline.prototype.isUpdated = function() {
    return this._updated;
  };
  Timeline.prototype.setUpdated = function(a) {
    this._updated = a;
  };
  Timeline.prototype.getItemWidth = function() {
    return Timeline._ItemWidth[this._scale] * GLOBAL_VAR.ratio;
  };
  Timeline.prototype.getSpaceWidth = function() {
    return Timeline._SpaceWidth[this._scale] * GLOBAL_VAR.ratio;
  };
  Timeline.prototype.getColumnWidth = function() {
    return this.getSpaceWidth() + this.getItemWidth();
  };
  Timeline.prototype.getInnerWidth = function() {
    return this._innerWidth;
  };
  Timeline.prototype.getItemLeftOffset = function() {
    return this.getSpaceWidth();
  };
  Timeline.prototype.getItemCenterOffset = function() {
    return this.getSpaceWidth() + (this.getItemWidth() >> 1);
  };
  Timeline.prototype.getFirstColumnLeft = function() {
    return this._firstColumnLeft;
  };
  Timeline.prototype.getMaxItemCount = function() {
    return this._maxItemCount;
  };
  Timeline.prototype.getFirstIndex = function() {
    return this._firstIndex;
  };
  Timeline.prototype.getLastIndex = function() {
    return Math.min(this._firstIndex + this._maxItemCount, this._maxIndex);
  };
  Timeline.prototype.getSelectedIndex = function() {
    return this._selectedIndex;
  };
  Timeline.prototype.getMaxIndex = function() {
    return this._maxIndex;
  };
  Timeline.prototype.calcColumnCount = function(a) {
    return Math.floor(a / this.getColumnWidth()) << 0;
  };
  Timeline.prototype.calcFirstColumnLeft = function(a) {
    return this._innerLeft + this._innerWidth - this.getColumnWidth() * a;
  };
  Timeline.prototype.calcFirstIndexAlignRight = function(c, a, b) {
    return Math.max(0, c + Math.max(a, 1) - Math.max(b, 1));
  };
  Timeline.prototype.calcFirstIndex = function(a) {
    return this.validateFirstIndex(this.calcFirstIndexAlignRight(this._firstIndex, this._maxItemCount, a), a);
  };
  Timeline.prototype.updateMaxItemCount = function() {
    var a = this.calcColumnCount(this._innerWidth);
    var c;
    if (this._maxItemCount < 1) {
      c = this.calcFirstIndex(a);
    } else {
      if (this._lastScale == this._scale) {
        c = this.validateFirstIndex(this._firstIndex - (a - this._maxItemCount));
      } else {
        var b = this._selectedIndex >= 0 ? this._selectedIndex : this.getLastIndex() - 1;
        c = this.validateFirstIndex(b - Math.round((b - this._firstIndex) * a / this._maxItemCount));
      }
    }
    this._lastScale = this._scale;
    if (this._firstIndex != c) {
      if (this._selectedIndex == this._firstIndex) {
        this._selectedIndex = c;
      }
      this._firstIndex = c;
      this._updated = true;
    }
    if (this._maxItemCount != a) {
      this._maxItemCount = a;
      this._updated = true;
    }
    this._firstColumnLeft = this.calcFirstColumnLeft(a);
  };
  Timeline.prototype.validateFirstIndex = function(a, c) {
    if (this._maxIndex < 1) {
      return -1;
    }
    if (a < 0) {
      return 0;
    }
    return Math.min(Math.max(0, this._maxIndex - 1), a)
  };
  Timeline.prototype.validateSelectedIndex = function() {
    if (this._selectedIndex < this._firstIndex) {
      this._selectedIndex = -1;
    } else {
      if (this._selectedIndex >= this.getLastIndex()) {
        this._selectedIndex = -1;
      }
    }
  };
  Timeline.prototype.onLayout = function() {
    var c = ChartManager.getInstance();
    var b = c.getArea(this.getDataSourceName() + ".main");
    if (b != null) {
      this._innerLeft = b.getLeft() + Timeline.PADDING_LEFT;
      var a = Math.max(0, b.getWidth() - (Timeline.PADDING_LEFT + Timeline.PADDING_RIGHT));
      if (this._innerWidth != a) {
        this._innerWidth = a;
        this.updateMaxItemCount();
      }
    }
  };
  Timeline.prototype.toIndex = function(a) {
    return this._firstIndex + this.calcColumnCount(a - this._firstColumnLeft);
  };
  Timeline.prototype.toColumnLeft = function(a) {
    return this._firstColumnLeft + this.getColumnWidth() * (a - this._firstIndex);
  };
  Timeline.prototype.toItemLeft = function(a) {
    return this.toColumnLeft(a) + this.getItemLeftOffset();
  };
  Timeline.prototype.toItemCenter = function(a) {
    return this.toColumnLeft(a) + this.getItemCenterOffset();
  };
  Timeline.prototype.selectAt = function(a) {
    this._selectedIndex = this.toIndex(a);
    this.validateSelectedIndex();
    return this._selectedIndex >= 0;
  };
  Timeline.prototype.unselect = function() {
    this._selectedIndex = -1;
  };
  Timeline.prototype.update = function() {
    var c = ChartManager.getInstance();
    var b = c.getDataSource(this.getDataSourceName());
    var d = this._maxIndex;
    this._maxIndex = b.getDataCount();
    switch (b.getUpdateMode()) {
      case DataSource.UpdateMode.Refresh:
        if (this._maxIndex < 1) {
          this._firstIndex = -1;
        } else {
          this._firstIndex = Math.max(this._maxIndex - this._maxItemCount, 0);
        }
        this._selectedIndex = -1;
        this._updated = true;
        break;
      case DataSource.UpdateMode.Append:
        var e = this.getLastIndex();
        var a = b.getErasedCount();
        if (e < d) {
          if (a > 0) {
            this._firstIndex = Math.max(this._firstIndex - a, 0);
            if (this._selectedIndex >= 0) {
              this._selectedIndex -= a;
              this.validateSelectedIndex();
            }
            this._updated = true;
          }
        } else {
          if (e == d) {
            this._firstIndex += this._maxIndex - d;
            if (this._selectedIndex >= 0) {
              this._selectedIndex -= a;
              this.validateSelectedIndex();
            }
            this._updated = true;
          }
        }
        break;
    }
  };
  Timeline.prototype.move = function(a) {
    if (this.isLatestShown()) {
      ChartManager.getInstance().getArea(this.getDataSourceName() + ".mainRange").setChanged(true);
    }
    this._firstIndex = this.validateFirstIndex(
      this._savedFirstIndex - this.calcColumnCount(a),
      this._maxItemCount
    );
    this._updated = true;
    if (this._selectedIndex >= 0) {
      this.validateSelectedIndex();
    }
  };
  Timeline.prototype.startMove = function() {
    this._savedFirstIndex = this._firstIndex;
  };
  Timeline.prototype.scale = function(a) {
    this._scale += a;
    if (this._scale < 0) {
      this._scale = 0;
    } else {
      if (this._scale >= Timeline._ItemWidth.length) {
        this._scale = Timeline._ItemWidth.length - 1;
      }
    }
    this.updateMaxItemCount();
    if (this._selectedIndex >= 0) {
      this.validateSelectedIndex();
    }
  };
  var Range = createClass(NamedObject);
  Range.prototype.__construct = function(a) {
    Range.__super.__construct.call(this, a);
    this._updated = true;
    this._minValue = Number.MAX_VALUE;
    this._maxValue = -Number.MAX_VALUE;
    this._outerMinValue = Number.MAX_VALUE;
    this._outerMaxValue = -Number.MAX_VALUE;
    this._ratio = 0;
    this._top = 0;
    this._bottom = 0;
    this._paddingTop = 0;
    this._paddingBottom = 0;
    this._minInterval = 36;
    this._selectedPosition = -1;
    this._selectedValue = -Number.MAX_VALUE;
    this._gradations = [];
  };
  Range.prototype.isUpdated = function() {
    return this._updated;
  };
  Range.prototype.setUpdated = function(a) {
    this._updated = a;
  };
  Range.prototype.getMinValue = function() {
    return this._minValue;
  };
  Range.prototype.getMaxValue = function() {
    return this._maxValue;
  };
  Range.prototype.getRange = function() {
    return this._maxValue - this._minValue;
  };
  Range.prototype.getOuterMinValue = function() {
    return this._outerMinValue;
  };
  Range.prototype.getOuterMaxValue = function() {
    return this._outerMaxValue;
  };
  Range.prototype.getOuterRange = function() {
    return this._outerMaxValue - this._outerMinValue;
  };
  Range.prototype.getHeight = function() {
    return Math.max(0, this._bottom - this._top);
  };
  Range.prototype.getGradations = function() {
    return this._gradations;
  };
  Range.prototype.getMinInterval = function() {
    return this._minInterval;
  };
  Range.prototype.setMinInterval = function(a) {
    this._minInterval = a;
  };
  Range.prototype.getSelectedPosition = function() {
    if (this._selectedPosition >= 0) {
      return this._selectedPosition;
    }
    if (this._selectedValue > -Number.MAX_VALUE) {
      return this.toY(this._selectedValue);
    }
    return -1;
  };
  Range.prototype.getSelectedValue = function() {
    if (this._selectedValue > -Number.MAX_VALUE) {
      return this._selectedValue;
    }
    var b = ChartManager.getInstance();
    var a = b.getArea(this.getAreaName());
    if (a == null) {
      return -Number.MAX_VALUE;
    }
    if (
      this._selectedPosition < a.getTop() + 12 ||
      this._selectedPosition >= a.getBottom() - 4
    ) {
      return -Number.MAX_VALUE;
    }
    return this.toValue(this._selectedPosition);
  };
  Range.prototype.setPaddingTop = function(a) {
    this._paddingTop = a;
  };
  Range.prototype.setPaddingBottom = function(a) {
    this._paddingBottom = a;
  };
  Range.prototype.toValue = function(a) {
    return this._maxValue - (a - this._top) / this._ratio;
  };
  Range.prototype.toY = function(a) {
    if (this._ratio > 0) {
      return this._top + Math.floor((this._maxValue - a) * this._ratio + 0.5);
    }
    return this._top;
  };
  Range.prototype.toHeight = function(a) {
    return Math.floor(a * this._ratio + 1.5);
  };
  Range.prototype.update = function() {
    var c = Number.MAX_VALUE;
    var a = -Number.MAX_VALUE;
    var e = ChartManager.getInstance();
    var g, f = [".main", ".secondary"];
    for (var b = 0; b < f.length; b++) {
      g = e.getDataProvider(this.getName() + f[b]);
      if (g != null) {
        c = Math.min(c, g.getMinValue());
        a = Math.max(a, g.getMaxValue());
      }
    }
    var d = {min: c, max: a};
    this.preSetRange(d);
    this.setRange(d.min, d.max);
  };
  Range.prototype.select = function(a) {
    this._selectedValue = a;
    this._selectedPosition = -1;
  };
  Range.prototype.selectAt = function(a) {
    this._selectedPosition = a;
    this._selectedValue = -Number.MAX_VALUE;
  };
  Range.prototype.unselect = function() {
    this._selectedPosition = -1;
    this._selectedValue = -Number.MAX_VALUE;
  };
  Range.prototype.preSetRange = function(a) {
    if (a.min == a.max) {
      a.min = -1;
      a.max = 1;
    }
  };
  Range.prototype.setRange = function(d, f) {
    var c = ChartManager.getInstance();
    var b = c.getArea(this.getAreaName());
    if (this._minValue == d && this._maxValue == f && !b.isChanged()) {
      return;
    }
    this._updated = true;
    this._minValue = d === f ? d - 1 / Math.pow(10, d.toString().getDecimalDigits()) : d;
    this._maxValue = f;
    this._gradations = [];
    var e = b.getTop() + this._paddingTop;
    var a = b.getBottom() - (this._paddingBottom);
    if (e >= a) {
      this._minValue = this._maxValue;
      return;
    }
    this._top = e;
    this._bottom = a;
    if (this._maxValue > this._minValue) {
      this._ratio = (a - e) / (this._maxValue - this._minValue);
    } else {
      this._ratio = 1;
    }
    this._outerMinValue = this.toValue(b.getBottom());
    this._outerMaxValue = this.toValue(b.getTop());
    this.updateGradations();
  };
  Range.prototype.calcInterval = function() {
    var e = this.getHeight();
    var f = this.getMinInterval();
    if (e / f <= 1) {
      f = e >> 1;
    }
    var g = this.getRange();
    var b = 0;
    while (b > -GLOBAL_VAR.fixedNumber && Math.floor(g) < g) {
      g *= 10;
      b--;
    }
    var a, j;
    for (; ; b++) {
      j = Math.pow(10, b);
      a = j;
      let height = Math.floor(this.toHeight(a) / GLOBAL_VAR.ratio);
      if (height > f) {
        break;
      }
      a = 2 * j;
      if (height > f) {
        break;
      }
      a = 5 * j;
      if (height > f) {
        break;
      }
    }
    return a;
  };
  Range.prototype.updateGradations = function() {
    this._gradations = [];
    var b = this.calcInterval();
    if (b <= 0) {
      return;
    }
    var a = Math.floor(this.getMaxValue() / b) * b;
    do {
      this._gradations.push(a);
      a -= b;
    } while (a > this.getMinValue());
  };
  var PositiveRange = createClass(Range);
  PositiveRange.prototype.__construct = function(a) {
    PositiveRange.__super.__construct.call(this, a);
  };
  PositiveRange.prototype.preSetRange = function(a) {
    a.min = Math.max(a.min, 0);
    a.max = Math.max(a.max, 0);
  };
  var ZeroBasedPositiveRange = createClass(Range);
  ZeroBasedPositiveRange.prototype.__construct = function(a) {
    ZeroBasedPositiveRange.__super.__construct.call(this, a);
  };
  ZeroBasedPositiveRange.prototype.preSetRange = function(a) {
    a.min = 0;
    a.max = Math.max(a.max, 0);
  };
  var MainRange = createClass(Range);
  MainRange.prototype.__construct = function(a) {
    MainRange.__super.__construct.call(this, a);
  };
  MainRange.prototype.preSetRange = function(e) {
    var l = ChartManager.getInstance();
    var n = l.getTimeline(this.getDataSourceName());
    var b = n.getMaxIndex() - n.getLastIndex();
    if (b < 25) {
      var f = l.getDataSource(this.getDataSourceName());
      var h = f.getDataAt(f.getDataCount() - 1);
      var i = (e.max - e.min) / 4 * (1 - b / 25);
      e.min = Math.min(e.min, Math.max(h.low - i, 0));
      e.max = Math.max(e.max, h.high + i);
    }
    if (e.min > 0) {
      var k = e.max / e.min;
      if (k < 1.016) {
        var g = (e.max + e.min) / 2;
        var j = (k - 1) * 1.5;
        e.max = g * (1 + j);
        e.min = g * (1 - j);
      } else {
        if (k < 1.048) {
          var g = (e.max + e.min) / 2;
          e.max = g * 1.024;
          e.min = g * 0.976;
        }
      }
    }
    if (e.min < 0) {
      e.min = 0;
    }
    if (e.max < 0) {
      e.max = 0;
    }
  };
  var ZeroCenteredRange = createClass(Range);
  ZeroCenteredRange.prototype.__construct = function(a) {
    ZeroCenteredRange.__super.__construct.call(this, a);
  };
  ZeroCenteredRange.prototype.calcInterval = function(d) {
    var b = this.getMinInterval();
    if (d.getHeight() / b < 2) {
      return 0;
    }
    var c = this.getRange();
    var a;
    for (a = 3; ; a += 2) {
      if (this.toHeight(c / a) <= b) {
        break;
      }
    }
    a -= 2;
    return c / a;
  };
  ZeroCenteredRange.prototype.updateGradations = function() {
    this._gradations = [];
    var d = ChartManager.getInstance();
    var c = d.getArea(this.getAreaName());
    var b = this.calcInterval(c);
    if (b <= 0) {
      return;
    }
    var a = b / 2;
    do {
      this._gradations.push(a);
      this._gradations.push(-a);
      a += b;
    } while (a <= this.getMaxValue());
  };
  ZeroCenteredRange.prototype.preSetRange = function(b) {
    var a = Math.max(Math.abs(b.min), Math.abs(b.max));
    b.min = -a;
    b.max = a;
  };
  var PercentageRange = createClass(Range);
  PercentageRange.prototype.__construct = function(a) {
    PercentageRange.__super.__construct.call(this, a);
  };
  PercentageRange.prototype.updateGradations = function() {
    this._gradations = [];
    var e = ChartManager.getInstance();
    var d = e.getArea(this.getAreaName());
    var b = 10;
    var c = Math.floor(this.toHeight(b));
    if (c << 2 > d.getHeight()) {
      return;
    }
    var a = Math.ceil(this.getMinValue() / b) * b;
    if (a == 0) {
      a = 0;
    }
    if (c << 2 < 24) {
      if (c << 1 < 8) {
        return;
      }
      do {
        if (a == 20 * GLOBAL_VAR.ratio || a == 80 * GLOBAL_VAR.ratio) {
          this._gradations.push(a);
        }
        a += b;
      } while (a < this.getMaxValue());
    } else {
      do {
        if (c < 8) {
          if (a == 20 * GLOBAL_VAR.ratio || a == 50 * GLOBAL_VAR.ratio || a == 80 * GLOBAL_VAR.ratio) {
            this._gradations.push(a);
          }
        } else {
          if (a == 0 || a == 20 * GLOBAL_VAR.ratio || a == 50 * GLOBAL_VAR.ratio || a == 80 * GLOBAL_VAR.ratio || a == 100 * GLOBAL_VAR.ratio) {
            this._gradations.push(a);
          }
        }
        a += b;
      } while (a < this.getMaxValue());
    }
  };
  var DataSource = createClass(NamedObject);
  DataSource.prototype.__construct = function(a) {
    DataSource.__super.__construct.call(this, a);
  };
  DataSource.UpdateMode = {DoNothing: 0, Refresh: 1, Update: 2, Append: 3};
  DataSource.prototype.getUpdateMode = function() {
    return this._updateMode;
  };
  DataSource.prototype.setUpdateMode = function(a) {
    this._updateMode = a;
  };
  DataSource.prototype.getCacheSize = function() {
    return 0;
  };
  DataSource.prototype.getDataCount = function() {
    return 0;
  };
  var MainDataSource = createClass(DataSource);
  MainDataSource.prototype.__construct = function(a) {
    MainDataSource.__super.__construct.call(this, a);
    this._erasedCount = 0;
    this._dataItems = [];
    this._decimalDigits = 0;
    this.toolManager = new CToolManager(a);
  };
  MainDataSource.prototype.getCacheSize = function() {
    return this._dataItems.length;
  };
  MainDataSource.prototype.getDataCount = function() {
    return this._dataItems.length;
  };
  MainDataSource.prototype.getUpdatedCount = function() {
    return this._updatedCount;
  };
  MainDataSource.prototype.getAppendedCount = function() {
    return this._appendedCount;
  };
  MainDataSource.prototype.getErasedCount = function() {
    return this._erasedCount;
  };
  MainDataSource.prototype.getDecimalDigits = function() {
    return Math.min(this._decimalDigits, 8);
  };
  MainDataSource.prototype.calcDecimalDigits = function(a) {
    var c = "" + a;
    var b = c.indexOf(".");
    if (b < 0) {
      return 0;
    }
    return c.length - 1 - b;
  };
  MainDataSource.prototype.getLastDate = function() {
    var a = this.getDataCount();
    if (a < 1) {
      return -1;
    }
    return this.getDataAt(a - 1).date;
  };
  MainDataSource.prototype.getDataAt = function(a) {
    return this._dataItems[a];
  };
  MainDataSource.prototype.update = function(c) {
    this._updatedCount = 0;
    this._appendedCount = 0;
    this._erasedCount = 0;
    var h = this._dataItems.length;
    if (h > 0) {
      var g = h - 1;
      var l = this._dataItems[g];
      var j, f, b = c.length;
      for (f = 0; f < b; f++) {
        j = c[f];
        if (j[0] == l.date) {
          if (l.open == j[1] && l.high == j[2] && l.low == j[3] && l.close == j[4] && l.volume == j[5]) {
            this.setUpdateMode(DataSource.UpdateMode.DoNothing);
          } else {
            this.setUpdateMode(DataSource.UpdateMode.Update);
            this._dataItems[g] = {date: j[0], open: j[1], high: j[2], low: j[3], close: j[4], volume: j[5]};
            this._updatedCount++;
          }
          f++;
          if (f < b) {
            this.setUpdateMode(DataSource.UpdateMode.Append);
            for (; f < b; f++, this._appendedCount++) {
              j = c[f];
              this._dataItems.push({date: j[0], open: j[1], high: j[2], low: j[3], close: j[4], volume: j[5]});
            }
          }
          return true;
        }
      }
      if (b < 1000) {
        this.setUpdateMode(DataSource.UpdateMode.DoNothing);
        return false;
      }
    }
    this.setUpdateMode(DataSource.UpdateMode.Refresh);
    this._dataItems = [];
    var k, a, j, f, b = c.length;
    for (f = 0; f < b; f++) {
      j = c[f];
      for (a = 1; a <= 4; a++) {
        k = this.calcDecimalDigits(j[a]);
        if (this._decimalDigits < k) {
          this._decimalDigits = k;
        }
      }
      this._dataItems.push({date: j[0], open: j[1], high: j[2], low: j[3], close: j[4], volume: j[5]});
    }
    return true;
  };
  MainDataSource.prototype.select = function(a) {
    this.toolManager.selecedObject = a;
  };
  MainDataSource.prototype.unselect = function() {
    this.toolManager.selecedObject = -1;
  };
  MainDataSource.prototype.addToolObject = function(a) {
    this.toolManager.addToolObject(a);
  };
  MainDataSource.prototype.delToolObject = function() {
    this.toolManager.delCurrentObject();
  };
  MainDataSource.prototype.getToolObject = function(a) {
    return this.toolManager.getToolObject(a);
  };
  MainDataSource.prototype.getToolObjectCount = function() {
    return this.toolManager.toolObjects.length;
  };
  MainDataSource.prototype.getCurrentToolObject = function() {
    return this.toolManager.getCurrentObject();
  };
  MainDataSource.prototype.getSelectToolObjcet = function() {
    return this.toolManager.getSelectedObject();
  };
  MainDataSource.prototype.delSelectToolObject = function() {
    this.toolManager.delSelectedObject();
  };
  var DataProvider = createClass(NamedObject);
  DataProvider.prototype.__construct = function(a) {
    DataProvider.__super.__construct.call(this, a);
    this._minValue = 0;
    this._maxValue = 0;
    this._minValueIndex = -1;
    this._maxValueIndex = -1;
  };
  DataProvider.prototype.getMinValue = function() {
    return this._minValue;
  };
  DataProvider.prototype.getMaxValue = function() {
    return this._maxValue;
  };
  DataProvider.prototype.getMinValueIndex = function() {
    return this._minValueIndex;
  };
  DataProvider.prototype.getMaxValueIndex = function() {
    return this._maxValueIndex;
  };
  DataProvider.prototype.calcRange = function(l, h, d, j) {
    var e = Number.MAX_VALUE;
    var m = -Number.MAX_VALUE;
    var k = -1;
    var b = -1;
    var c = {};
    var f = h - 1;
    var a = l.length - 1;
    for (; a >= 0; a--) {
      var g = l[a];
      if (f < g) {
        d[a] = {min: e, max: m};
      } else {
        for (; f >= g; f--) {
          if (this.getMinMaxAt(f, c) == false) {
            continue;
          }
          if (e > c.min) {
            e = c.min;
            k = f;
          }
          if (m < c.max) {
            m = c.max;
            b = f;
          }
        }
        d[a] = {min: e, max: m};
      }
      if (j != null) {
        j[a] = {minIndex: k, maxIndex: b};
      }
    }
  };
  DataProvider.prototype.updateRange = function() {
    var e = ChartManager.getInstance();
    var c = e.getTimeline(this.getDataSourceName());
    var b = [c.getFirstIndex()];
    var d = [{}];
    var a = [{}];
    this.calcRange(b, c.getLastIndex(), d, a);
    this._minValue = d[0].min;
    this._maxValue = d[0].max;
    this._minValueIndex = a[0].minIndex;
    this._maxValueIndex = a[0].maxIndex;
  };
  var MainDataProvider = createClass(DataProvider);
  MainDataProvider.prototype.__construct = function(a) {
    MainDataProvider.__super.__construct.call(this, a);
    this._candlestickDS = null;
  };
  MainDataProvider.prototype.updateData = function() {
    var b = ChartManager.getInstance();
    var a = b.getDataSource(this.getDataSourceName());
    if (!isInstance(a, MainDataSource)) {
      return;
    }
    this._candlestickDS = a;
  };
  MainDataProvider.prototype.getMinMaxAt = function(a, b) {
    var c = this._candlestickDS.getDataAt(a);
    b.min = c.low;
    b.max = c.high;
    return true;
  };
  var IndicatorDataProvider = createClass(DataProvider);
  IndicatorDataProvider.prototype.getIndicator = function() {
    return this._indicator;
  };
  IndicatorDataProvider.prototype.setIndicator = function(a) {
    this._indicator = a;
    this.refresh();
  };
  IndicatorDataProvider.prototype.refresh = function() {
    var d = ChartManager.getInstance();
    var c = d.getDataSource(this.getDataSourceName());
    if (c.getDataCount() < 1) {
      return;
    }
    var e = this._indicator;
    var a, b = c.getDataCount();
    e.clear();
    e.reserve(b);
    for (a = 0; a < b; a++) {
      e.execute(c, a);
    }
  };
  IndicatorDataProvider.prototype.updateData = function() {
    var e = ChartManager.getInstance();
    var d = e.getDataSource(this.getDataSourceName());
    if (d.getDataCount() < 1) {
      return;
    }
    var g = this._indicator;
    var f = d.getUpdateMode();
    switch (f) {
      case DataSource.UpdateMode.Refresh:
        this.refresh();
        break;
      case DataSource.UpdateMode.Append:
        g.reserve(d.getAppendedCount());
      case DataSource.UpdateMode.Update:
        var b, c = d.getDataCount();
        var a = d.getUpdatedCount() + d.getAppendedCount();
        for (b = c - a; b < c; b++) {
          g.execute(d, b);
        }
        break;
    }
  };
  IndicatorDataProvider.prototype.getMinMaxAt = function(b, f) {
    f.min = Number.MAX_VALUE;
    f.max = -Number.MAX_VALUE;
    var a, e = false;
    var d, c = this._indicator.getOutputCount();
    for (d = 0; d < c; d++) {
      a = this._indicator.getOutputAt(d).execute(b);
      if (isNaN(a) == false) {
        e = true;
        f.min = Math.min(f.min, a)
        f.max = Math.max(f.max, a)
      }
    }
    return e;
  };
  var theme_color_id = 0;
  var theme_font_id = 0;
  var Theme = createClass();
  Theme.prototype.getColor = function(a) {
    return this._colors[a];
  };
  Theme.prototype.getFont = function(a) {
    return this._fonts[a];
  };
  Theme.Color = {
    Positive: theme_color_id++,
    Negative: theme_color_id++,
    PositiveDark: theme_color_id++,
    NegativeDark: theme_color_id++,
    Unchanged: theme_color_id++,
    Background: theme_color_id++,
    Cursor: theme_color_id++,
    RangeMark: theme_color_id++,
    Indicator0: theme_color_id++,
    Indicator1: theme_color_id++,
    Indicator2: theme_color_id++,
    Indicator3: theme_color_id++,
    Indicator4: theme_color_id++,
    Indicator5: theme_color_id++,
    Grid0: theme_color_id++,
    Grid1: theme_color_id++,
    Grid2: theme_color_id++,
    Grid3: theme_color_id++,
    Grid4: theme_color_id++,
    TextPositive: theme_color_id++,
    TextNegative: theme_color_id++,
    Text0: theme_color_id++,
    Text1: theme_color_id++,
    Text2: theme_color_id++,
    Text3: theme_color_id++,
    Text4: theme_color_id++,
    LineColorNormal: theme_color_id++,
    LineColorSelected: theme_color_id++,
    CircleColorFill: theme_color_id++,
    CircleColorStroke: theme_color_id++
  };
  Theme.Font = {
    Default: theme_font_id++
  };
  var DarkTheme = createClass(Theme);
  DarkTheme.prototype.__construct = function() {
    let ThemeColor = opts.ThemeColor || {}
    this._colors = [];
    this._colors[Theme.Color.Positive] = ThemeColor.Positive || "#03c087"; // #ff6203
    this._colors[Theme.Color.Negative] = ThemeColor.Negative || "#e76d42"; // #44ea37
    this._colors[Theme.Color.PositiveDark] = ThemeColor.PositiveDark || "#03c087";
    this._colors[Theme.Color.NegativeDark] = ThemeColor.NegativeDark || "#e76d42";
    this._colors[Theme.Color.Unchanged] = ThemeColor.Unchanged || "#283149";
    this._colors[Theme.Color.Background] = ThemeColor.Background || "#181b2a"; //"#080808"
    this._colors[Theme.Color.Cursor] = ThemeColor.Cursor || "#aaa";
    this._colors[Theme.Color.RangeMark] = ThemeColor.RangeMark || "#f9ee30";
    this._colors[Theme.Color.Indicator0] = ThemeColor.Indicator0 || "#888"; //#ddd
    this._colors[Theme.Color.Indicator1] = ThemeColor.Indicator1 || "#f9ee30";
    this._colors[Theme.Color.Indicator2] = ThemeColor.Indicator2 || "#f600ff";
    this._colors[Theme.Color.Indicator3] = ThemeColor.Indicator3 || "#6bf";
    this._colors[Theme.Color.Indicator4] = ThemeColor.Indicator4 || "#a5cf81";
    this._colors[Theme.Color.Indicator5] = ThemeColor.Indicator5 || "#e18b89";
    this._colors[Theme.Color.Grid0] = ThemeColor.Grid0 || "#313c5a"; //#333
    this._colors[Theme.Color.Grid1] = ThemeColor.Grid1 || "#313c5a";
    this._colors[Theme.Color.Grid2] = ThemeColor.Grid2 || "#666";
    this._colors[Theme.Color.Grid3] = ThemeColor.Grid3 || "#888";
    this._colors[Theme.Color.Grid4] = ThemeColor.Grid4 || "#aaa";
    this._colors[Theme.Color.TextPositive] = ThemeColor.TextPositive || "#03c087";
    this._colors[Theme.Color.TextNegative] = ThemeColor.TextNegative || "#e76d42";
    this._colors[Theme.Color.Text0] = ThemeColor.Text0 || "#d6dff9";
    this._colors[Theme.Color.Text1] = ThemeColor.Text1 || "#d6dff9";
    this._colors[Theme.Color.Text2] = ThemeColor.Text2 || "#d6dff9";
    this._colors[Theme.Color.Text3] = ThemeColor.Text3 || "#d6dff9";
    this._colors[Theme.Color.Text4] = ThemeColor.Text4 || "#d6dff9"; //#ccc
    this._colors[Theme.Color.LineColorNormal] = ThemeColor.LineColorNormal || "#a6a6a6";
    this._colors[Theme.Color.LineColorSelected] = ThemeColor.LineColorSelected || "#ffffff";
    this._colors[Theme.Color.CircleColorFill] = ThemeColor.CircleColorFill || "#000000";
    this._colors[Theme.Color.CircleColorStroke] = ThemeColor.CircleColorStroke || "#ffffff";
    this._fonts = [];
    this._fonts[Theme.Font.Default] = fontFamily;
  };
  var LightTheme = createClass(Theme);
  LightTheme.prototype.__construct = function() {
    this._colors = [];
    this._colors[Theme.Color.Positive] = "#19b34c";
    this._colors[Theme.Color.Negative] = "#990e0e";
    this._colors[Theme.Color.PositiveDark] = "#007800";
    this._colors[Theme.Color.NegativeDark] = "#960000";
    this._colors[Theme.Color.Unchanged] = "#fff";
    this._colors[Theme.Color.Background] = "#0a0a0a"; // #0a0a0a
    this._colors[Theme.Color.Cursor] = "#aaa";
    this._colors[Theme.Color.RangeMark] = "#f9ee30";
    this._colors[Theme.Color.Indicator0] = "#ddd";
    this._colors[Theme.Color.Indicator1] = "#f9ee30";
    this._colors[Theme.Color.Indicator2] = "#f600ff";
    this._colors[Theme.Color.Indicator3] = "#6bf";
    this._colors[Theme.Color.Indicator4] = "#a5cf81";
    this._colors[Theme.Color.Indicator5] = "#e18b89";
    this._colors[Theme.Color.Grid0] = "#333";
    this._colors[Theme.Color.Grid1] = "#2B2929";
    this._colors[Theme.Color.Grid2] = "#666";
    this._colors[Theme.Color.Grid3] = "#888";
    this._colors[Theme.Color.Grid4] = "#aaa";
    this._colors[Theme.Color.TextPositive] = "#19b34c";
    this._colors[Theme.Color.TextNegative] = "#990e0e";
    this._colors[Theme.Color.Text0] = "#2B2929";
    this._colors[Theme.Color.Text1] = "#666";
    this._colors[Theme.Color.Text2] = "#888";
    this._colors[Theme.Color.Text3] = "#aaa";
    this._colors[Theme.Color.Text4] = "#ccc";
    this._colors[Theme.Color.LineColorNormal] = "#a6a6a6";
    this._colors[Theme.Color.LineColorSelected] = "#ffffff";
    this._colors[Theme.Color.CircleColorFill] = "#000000";
    this._colors[Theme.Color.CircleColorStroke] = "#ffffff";
    this._fonts = [];
    this._fonts[Theme.Font.Default] = fontFamily;
  };
  var TemplateMeasuringHandler = createClass();
  TemplateMeasuringHandler.onMeasuring = function(c, b) {
    var d = b.Width;
    var a = b.Height;
    var e = c.getNameObject().getCompAt(2);
    if (e == "timeline") {
      c.setMeasuredDimension(d, 30 * GLOBAL_VAR.ratio);
    }
  };
  var Template = createClass();
  Template.displayVolume = true;
  Template.createCandlestickDataSource = function(a) {
    return new MainDataSource(a);
  };
  Template.createLiveOrderDataSource = function(a) {
    return new CLiveOrderDataSource(a);
  };
  Template.createLiveTradeDataSource = function(a) {
    return new CLiveTradeDataSource(a);
  };
  Template.createDataSource = function(d, a, c) {
    var b = ChartManager.getInstance();
    if (b.getCachedDataSource(a) == null) {
      b.setCachedDataSource(a, c(a));
    }
    b.setCurrentDataSource(d, a);
    b.updateData(d, null);
  };
  Template.createTableComps = function(a) {
    Template.createMainChartComps(a);
    if (Template.displayVolume) {
      Template.createIndicatorChartComps(a, "VOLUME");
    }
    Template.createTimelineComps(a);
  };
  Template.createMainChartComps = function(c) {
    var j = ChartManager.getInstance();
    var b = j.getArea(c + ".charts");
    var g = c + ".main";
    var h = g + "Range";
    var d = new MainArea(g);
    j.setArea(g, d);
    b.addArea(d);
    var i = new MainRangeArea(h);
    j.setArea(h, i);
    b.addArea(i);
    var e = new MainDataProvider(g + ".main");
    j.setDataProvider(e.getName(), e);
    j.setMainIndicator(c, "MA");
    var f = new MainRange(g);
    j.setRange(f.getName(), f);
    f.setPaddingTop(28 * GLOBAL_VAR.ratio);
    f.setPaddingBottom(12 * GLOBAL_VAR.ratio);
    var a = new MainAreaBackgroundPlotter(g + ".background");
    j.setPlotter(a.getName(), a);
    a = new CGridPlotter(g + ".grid");
    j.setPlotter(a.getName(), a);
    a = new CandlestickPlotter(g + ".main");
    j.setPlotter(a.getName(), a);
    a = new MinMaxPlotter(g + ".decoration");
    j.setPlotter(a.getName(), a);
    a = new MainInfoPlotter(g + ".info");
    j.setPlotter(a.getName(), a);
    a = new SelectionPlotter(g + ".selection");
    j.setPlotter(a.getName(), a);
    a = new CDynamicLinePlotter(g + ".tool");
    j.setPlotter(a.getName(), a);
    a = new RangeAreaBackgroundPlotter(g + "Range.background");
    j.setPlotter(a.getName(), a);
    a = new COrderGraphPlotter(g + "Range.grid");
    j.setPlotter(a.getName(), a);
    a = new RangePlotter(g + "Range.main");
    j.setPlotter(a.getName(), a);
    a = new RangeSelectionPlotter(g + "Range.selection");
    j.setPlotter(a.getName(), a);
    a = new LastClosePlotter(g + "Range.decoration");
    j.setPlotter(a.getName(), a);
  };
  Template.createIndicatorChartComps = function(d, p) {
    var o = ChartManager.getInstance();
    var c = o.getArea(d + ".charts");
    var h = d + ".indic" + c.getNextRowId();
    var n = h + "Range";
    var e = new IndicatorArea(h);
    o.setArea(h, e);
    c.addArea(e);
    var k = c.getAreaCount() >> 1;
    var j = ChartSettings.get().charts.areaHeight;
    if (j.length > k) {
      var l, g;
      for (g = 0; g < k; g++) {
        l = c.getAreaAt(g << 1);
        l.setTop(0);
        l.setBottom(j[g]);
      }
      e.setTop(0);
      e.setBottom(j[k]);
    }
    var m = new IndicatorRangeArea(n);
    o.setArea(n, m);
    c.addArea(m);
    var f = new IndicatorDataProvider(h + ".secondary");
    o.setDataProvider(f.getName(), f);
    if (o.setIndicator(h, p) == false) {
      o.removeIndicator(h);
      return;
    }
    var b = new MainAreaBackgroundPlotter(h + ".background");
    o.setPlotter(b.getName(), b);
    b = new CGridPlotter(h + ".grid");
    o.setPlotter(b.getName(), b);
    b = new IndicatorPlotter(h + ".secondary");
    o.setPlotter(b.getName(), b);
    b = new IndicatorInfoPlotter(h + ".info");
    o.setPlotter(b.getName(), b);
    b = new SelectionPlotter(h + ".selection");
    o.setPlotter(b.getName(), b);
    b = new RangeAreaBackgroundPlotter(h + "Range.background");
    o.setPlotter(b.getName(), b);
    b = new RangePlotter(h + "Range.main");
    o.setPlotter(b.getName(), b);
    b = new RangeSelectionPlotter(h + "Range.selection");
    o.setPlotter(b.getName(), b);
  };
  Template.createTimelineComps = function(d) {
    var b = ChartManager.getInstance();
    var c;
    var a = new Timeline(d);
    b.setTimeline(a.getName(), a);
    c = new TimelineAreaBackgroundPlotter(d + ".timeline.background");
    b.setPlotter(c.getName(), c);
    c = new TimelinePlotter(d + ".timeline.main");
    b.setPlotter(c.getName(), c);
    c = new TimelineSelectionPlotter(d + ".timeline.selection");
    b.setPlotter(c.getName(), c);
  };
  Template.createLiveOrderComps = function(c) {
    var a = ChartManager.getInstance();
    var b;
    b = new BackgroundPlotter(c + ".main.background");
    a.setPlotter(b.getName(), b);
    b = new CLiveOrderPlotter(c + ".main.main");
    a.setPlotter(b.getName(), b);
  };
  Template.createLiveTradeComps = function(c) {
    var a = ChartManager.getInstance();
    var b;
    b = new BackgroundPlotter(c + ".main.background");
    a.setPlotter(b.getName(), b);
    b = new CLiveTradePlotter(c + ".main.main");
    a.setPlotter(b.getName(), b);
  };
  var DefaultTemplate = createClass(Template);
  DefaultTemplate.loadTemplate = function(g, b) {
    var e = ChartManager.getInstance();
    var c = ChartSettings.get();
    var a = new CName(g).getCompAt(0);
    e.unloadTemplate(a);
    Template.createDataSource(g, b, Template.createCandlestickDataSource);
    var f = new DockableLayout(a);
    e.setFrame(f.getName(), f);
    e.setArea(f.getName(), f);
    f.setGridColor(Theme.Color.Grid1);
    var d = new TimelineArea(g + ".timeline");
    e.setArea(d.getName(), d);
    f.addArea(d);
    d.setDockStyle(ChartArea.DockStyle.Bottom);
    d.Measuring.addHandler(d, TemplateMeasuringHandler.onMeasuring);
    var h = new TableLayout(g + ".charts");
    e.setArea(h.getName(), h);
    h.setDockStyle(ChartArea.DockStyle.Fill);
    f.addArea(h);
    Template.createTableComps(g);
    e.setThemeName(a, c.theme);
    return e;
  };
  var Plotter = createClass(NamedObject);
  Plotter.prototype.__construct = function(a) {
    Plotter.__super.__construct.call(this, a);
  };
  Plotter.isChrome = navigator.userAgent.toLowerCase().match(/chrome/) != null;
  Plotter.drawLine = function(d, b, e, a, c) {
    d.beginPath();
    d.lineWidth = 1 * GLOBAL_VAR.ratio;
    d.moveTo((b << 0) + 0.5, (e << 0) + 0.5);
    d.lineTo((a << 0) + 0.5, (c << 0) + 0.5);
    d.stroke();
  };
  Plotter.drawLines = function(c, d) {
    var b, a = d.length;
    c.beginPath();
    c.moveTo(d[0].x, d[0].y);
    for (b = 1; b < a; b++) {
      c.lineTo(d[b].x, d[b].y);
    }
    if (Plotter.isChrome) {
      c.moveTo(d[0].x, d[0].y);
      for (b = 1; b < a; b++) {
        c.lineTo(d[b].x, d[b].y);
      }
    }
    c.stroke();
  };
  Plotter.drawDashedLine = function(b, c, l, a, k, g, j) {
    if (g < 2) {
      g = 2;
    }
    var e = a - c;
    var d = k - l;
    b.beginPath();
    if (d == 0) {
      var h = (e / g + 0.5) << 0;
      for (var f = 0; f < h; f++) {
        b.rect(c, l, j, 1);
        c += g;
      }
      b.fill();
    } else {
      var h = (Math.sqrt(e * e + d * d) / g + 0.5) << 0;
      e = e / h;
      d = d / h;
      var n = e * j / g;
      var m = d * j / g;
      for (var f = 0; f < h; f++) {
        b.moveTo(c + 0.5, l + 0.5);
        b.lineTo(c + 0.5 + n, l + 0.5 + m);
        c += e;
        l += d;
      }
      b.stroke();
    }
  };
  Plotter.createHorzDashedLine = function(b, c, a, j, f, h) {
    if (f < 2) {
      f = 2;
    }
    var d = a - c;
    var g = (d / f + 0.5) << 0;
    for (var e = 0; e < g; e++) {
      b.rect(c, j, h, 1 * GLOBAL_VAR.ratio);
      c += f;
    }
  };
  Plotter.createLineRectangles = function(d, a, top, h) {
    d.lineWidth = 1 * GLOBAL_VAR.ratio;
    a = a || []
    d.beginPath();
    var f, c, b = a.length;
    for (c = 0; c < b; c++) {
      f = a[c];
      d.rect(f.x, top, f.w, h);
    }
  };
  Plotter.createRectangles = function(d, a) {
    d.beginPath();
    var f, c, b = a.length;
    for (c = 0; c < b; c++) {
      f = a[c];
      d.rect(f.x, f.y, f.w, f.h);
    }
  };
  Plotter.createPolygon = function(c, d) {
    c.beginPath();
    c.moveTo(d[0].x + 0.5, d[0].y + 0.5);
    var b, a = d.length;
    for (b = 1; b < a; b++) {
      c.lineTo(d[b].x + 0.5, d[b].y + 0.5);
    }
    c.closePath();
  };
  Plotter.drawString = function(b, d, c) {
    var a = b.measureText(d).width;
    if (c.w < a) {
      return false;
    }
    b.fillText(d, c.x, c.y);
    c.x += a;
    c.w -= a;
    return true;
  };
  var BackgroundPlotter = createClass(Plotter);
  BackgroundPlotter.prototype.__construct = function(a) {
    BackgroundPlotter.__super.__construct.call(this, a);
    this._color = Theme.Color.Background;
  };
  BackgroundPlotter.prototype.getColor = function() {
    return this._color;
  };
  BackgroundPlotter.prototype.setColor = function(a) {
    this._color = a;
  };
  BackgroundPlotter.prototype.Draw = function(a) {
    var c = ChartManager.getInstance();
    var b = c.getArea(this.getAreaName());
    var d = c.getTheme(this.getFrameName());
    a.fillStyle = d.getColor(this._color);
    a.fillRect(b.getLeft(), b.getTop(), b.getWidth(), b.getHeight());
  };
  var MainAreaBackgroundPlotter = createClass(BackgroundPlotter);
  MainAreaBackgroundPlotter.prototype.__construct = function(a) {
    MainAreaBackgroundPlotter.__super.__construct.call(this, a);
  };
  MainAreaBackgroundPlotter.prototype.Draw = function(c) {
    var i = ChartManager.getInstance();
    var b = i.getArea(this.getAreaName());
    var j = i.getTimeline(this.getDataSourceName());
    var f = i.getRange(this.getAreaName());
    var d = i.getTheme(this.getFrameName());
    var g = b.getRect();
    if (!b.isChanged() && !j.isUpdated() && !f.isUpdated()) {
      var e = j.getFirstIndex();
      var h = j.getLastIndex() - 2;
      var a = Math.max(e, h);
      g.X = j.toColumnLeft(a);
      g.Width = b.getRight() - g.X;
    }
    c.fillStyle = d.getColor(this._color);
    c.fillRect(g.X, g.Y, g.Width, g.Height);
  };
  var RangeAreaBackgroundPlotter = createClass(BackgroundPlotter);
  RangeAreaBackgroundPlotter.prototype.__construct = function(a) {
    RangeAreaBackgroundPlotter.__super.__construct.call(this, a);
  };
  RangeAreaBackgroundPlotter.prototype.Draw = function(c) {
    var e = ChartManager.getInstance();
    var g = this.getAreaName();
    var d = e.getArea(g);
    var b = e.getRange(g.substring(0, g.lastIndexOf("Range")));
    var a = b.getNameObject().getCompAt(2) == "main";
    if (a) {
    } else {
      if (!d.isChanged() && !b.isUpdated()) {
        return;
      }
    }
    var f = e.getTheme(this.getFrameName());
    c.fillStyle = f.getColor(this._color);
    c.fillRect(d.getLeft(), d.getTop(), d.getWidth(), d.getHeight());
  };
  var TimelineAreaBackgroundPlotter = createClass(BackgroundPlotter);
  TimelineAreaBackgroundPlotter.prototype.__construct = function(a) {
    TimelineAreaBackgroundPlotter.__super.__construct.call(this, a);
  };
  TimelineAreaBackgroundPlotter.prototype.Draw = function(a) {
    var d = ChartManager.getInstance();
    var c = d.getArea(this.getAreaName());
    var b = d.getTimeline(this.getDataSourceName());
    if (!c.isChanged() && !b.isUpdated()) {
      return;
    }
    var e = d.getTheme(this.getFrameName());
    a.fillStyle = e.getColor(this._color);
    a.fillRect(c.getLeft(), c.getTop(), c.getWidth(), c.getHeight());
  };
  var CGridPlotter = createClass(NamedObject);
  CGridPlotter.prototype.__construct = function(a) {
    CGridPlotter.__super.__construct.call(this, a);
  };
  CGridPlotter.prototype.Draw = function(c) {
    var o = ChartManager.getInstance();
    var b = o.getArea(this.getAreaName());
    var p = o.getTimeline(this.getDataSourceName());
    var j = o.getRange(this.getAreaName());
    var f = false;
    if (!b.isChanged() && !p.isUpdated() && !j.isUpdated()) {
      var i = p.getFirstIndex();
      var m = p.getLastIndex();
      var a = Math.max(i, m - 2);
      var e = p.toColumnLeft(a);
      c.save();
      c.lineWidth = 1 * GLOBAL_VAR.ratio;
      c.rect(e, b.getTop(), b.getRight() - e, b.getHeight());
      c.clip();
      f = true;
    }
    var h = o.getTheme(this.getFrameName());
    c.fillStyle = h.getColor(Theme.Color.Grid0);
    Plotter.createLineRectangles(c, o._verticalGridLines, b.getTop(), b.getHeight());
    c.fill();
    c.strokeStyle = h.getColor(Theme.Color.Grid0);
    // c.fillStyle = h.getColor(Theme.Color.Grid0);
    c.beginPath();
    var g = 4, k = 1;
    if (Plotter.isChrome) {
      g = 4;
      k = 1;
    }
    var l = j.getGradations();
    for (var d in l) {
      let cx1 = b.getLeft() + 0.5
      let cx2 = b.getRight() + 0.5
      let cy = j.toY(l[d]) + 0.5
      // 超出范围部分排除掉
      if (j.toY(l[d]) >= b._bottom) {
        continue;
      }
      c.moveTo(cx1, cy)
      c.lineTo(cx2, cy)
      // Plotter.createHorzDashedLine(c, b.getLeft(), b.getRight(), j.toY(l[d]), g, k);
    }
    c.stroke()
    // c.fill();
    if (f) {
      c.restore();
    }
  };
  var CandlestickPlotter = createClass(NamedObject);
  CandlestickPlotter.prototype.__construct = function(a) {
    CandlestickPlotter.__super.__construct.call(this, a);
  };
  CandlestickPlotter.prototype.Draw = function(c) {
    var A = ChartManager.getInstance();
    var s = A.getDataSource(this.getDataSourceName());
    if (s.getDataCount() < 1) {
      return;
    }
    var u = A.getArea(this.getAreaName());
    var h = A.getTimeline(this.getDataSourceName());
    var p = A.getRange(this.getAreaName());
    if (p.getRange() == 0) {
      return;
    }
    var y = A.getTheme(this.getFrameName());
    var a = isInstance(y, DarkTheme);
    var j = h.getFirstIndex();
    var n = h.getLastIndex();
    var g;
    if (u.isChanged() || h.isUpdated() || p.isUpdated()) {
      g = j;
    } else {
      g = Math.max(j, n - 2);
    }
    var v = h.getColumnWidth(), x = h.getItemWidth(), e = h.toItemLeft(g), z = h.toItemCenter(g);
    var w = [], f = [], b = [], l = [];
    for (var t = g; t < n; t++) {
      var B = s.getDataAt(t);
      var m = p.toY(B.high);
      var C = p.toY(B.low);
      var o = B.open;
      var r = B.close;
      if (r > o) {
        var q = p.toY(r);
        var k = p.toY(o);
        var d = Math.max(k - q, 1);
        if (d > 1 && x > 1 && a) {
          w.push({x: e + 0.5, y: q + 0.5, w: x - 1, h: d - 1});
        } else {
          f.push({x: e, y: q, w: Math.max(x, 1), h: Math.max(d, 1) });
        }
        if (B.high > r) {
          m = Math.min(m, q - 1);
          f.push({x: z, y: m, w: 1 * GLOBAL_VAR.ratio, h: q - m});
        }
        if (o > B.low) {
          C = Math.max(C, k + 1);
          f.push({x: z, y: k, w: 1 * GLOBAL_VAR.ratio, h: C - k});
        }
      } else {
        if (r == o) {
          var q = p.toY(r);
          b.push({x: e, y: q, w: Math.max(x, 1), h: 1});
          if (B.high > r) {
            m = Math.min(m, q - 1);
          }
          if (o > B.low) {
            C = Math.max(C, q + 1);
          }
          if (m < C) {
            b.push({x: z, y: m, w: 1 * GLOBAL_VAR.ratio, h: C - m });
          }
        } else {
          var q = p.toY(o);
          var k = p.toY(r);
          var d = Math.max(k - q, 1);
          l.push({x: e, y: q, w: Math.max(x, 1), h: Math.max(d, 1)});
          if (B.high > o) {
            m = Math.min(m, q - 1);
          }
          if (r > B.low) {
            C = Math.max(C, k + 1);
          }
          if (m < C) {
            l.push({x: z, y: m, w: 1 * GLOBAL_VAR.ratio, h: C - m});
          }
        }
      }
      e += v;
      z += v;
    }
    if (w.length > 0) {
      c.fillStyle = y.getColor(Theme.Color.Positive);
      c.strokeStyle = y.getColor(Theme.Color.Positive);
      Plotter.createRectangles(c, w);
      c.stroke();
      c.fill();
    }
    if (f.length > 0) {
      c.fillStyle = y.getColor(Theme.Color.Positive);
      Plotter.createRectangles(c, f);
      c.fill();
    }
    if (b.length > 0) {
      c.fillStyle = y.getColor(Theme.Color.Negative);
      Plotter.createRectangles(c, b);
      c.fill();
    }
    if (l.length > 0) {
      c.fillStyle = y.getColor(Theme.Color.Negative);
      Plotter.createRectangles(c, l);
      c.fill();
    }
  };
  var CandlestickHLCPlotter = createClass(Plotter);
  CandlestickHLCPlotter.prototype.__construct = function(a) {
    CandlestickHLCPlotter.__super.__construct.call(this, a);
  };
  CandlestickHLCPlotter.prototype.Draw = function(c) {
    var A = ChartManager.getInstance();
    var s = A.getDataSource(this.getDataSourceName());
    if (!isInstance(s, MainDataSource) || s.getDataCount() < 1) {
      return;
    }
    var u = A.getArea(this.getAreaName());
    var h = A.getTimeline(this.getDataSourceName());
    var p = A.getRange(this.getAreaName());
    if (p.getRange() == 0) {
      return;
    }
    var y = A.getTheme(this.getFrameName());
    var a = isInstance(y, DarkTheme);
    var j = h.getFirstIndex();
    var n = h.getLastIndex();
    var g = u.isChanged() || h.isUpdated() || p.isUpdated() ? j : Math.max(j, n - 2);
    var v = h.getColumnWidth(), x = h.getItemWidth(), e = h.toItemLeft(g), z = h.toItemCenter(g);
    var w = [], f = [], b = [], l = [];
    for (var t = g; t < n; t++) {
      var B = s.getDataAt(t);
      var m = p.toY(B.high);
      var C = p.toY(B.low);
      var o = B.open;
      if (t > 0) {
        o = s.getDataAt(t - 1).close;
      }
      var r = B.close;
      if (r > o) {
        var q = p.toY(r);
        var k = p.toY(o);
        var d = Math.max(k - q, 1);
        if (d > 1 && x > 1 && a) {
          w.push({x: e + 0.5, y: q + 0.5, w: x - 1, h: d - 1});
        } else {
          f.push({x: e, y: q, w: Math.max(x, 1), h: Math.max(d, 1)});
        }
        if (B.high > r) {
          m = Math.min(m, q - 1);
          f.push({x: z, y: m, w: 1 * GLOBAL_VAR.ratio, h: q - m});
        }
        if (o > B.low) {
          C = Math.max(C, k + 1);
          f.push({x: z, y: k, w: 1 * GLOBAL_VAR.ratio, h: C - k});
        }
      } else {
        if (r == o) {
          var q = p.toY(r);
          b.push({x: e, y: q, w: Math.max(x, 1), h: 1});
          if (B.high > r) {
            m = Math.min(m, q - 1);
          }
          if (o > B.low) {
            C = Math.max(C, q + 1);
          }
          if (m < C) {
            b.push({x: z, y: m, w: 1 * GLOBAL_VAR.ratio, h: C - m});
          }
        } else {
          var q = p.toY(o);
          var k = p.toY(r);
          var d = Math.max(k - q, 1);
          l.push({x: e, y: q, w: Math.max(x, 1), h: Math.max(d, 1)});
          if (B.high > o) {
            m = Math.min(m, q - 1);
          }
          if (r > B.low) {
            C = Math.max(C, k + 1);
          }
          if (m < C) {
            l.push({x: z, y: m, w: 1 * GLOBAL_VAR.ratio, h: C - m});
          }
        }
      }
      e += v;
      z += v;
    }
    if (w.length > 0) {
      c.strokeStyle = y.getColor(Theme.Color.Positive);
      Plotter.createRectangles(c, w);
      c.stroke();
    }
    if (f.length > 0) {
      c.fillStyle = y.getColor(Theme.Color.Positive);
      Plotter.createRectangles(c, f);
      c.fill();
    }
    if (b.length > 0) {
      c.fillStyle = y.getColor(Theme.Color.Negative);
      Plotter.createRectangles(c, b);
      c.fill();
    }
    if (l.length > 0) {
      c.fillStyle = y.getColor(Theme.Color.Negative);
      Plotter.createRectangles(c, l);
      c.fill();
    }
  };
  var OHLCPlotter = createClass(Plotter);
  OHLCPlotter.prototype.__construct = function(a) {
    OHLCPlotter.__super.__construct.call(this, a);
  };
  OHLCPlotter.prototype.Draw = function(b) {
    var z = ChartManager.getInstance();
    var q = z.getDataSource(this.getDataSourceName());
    if (!isInstance(q, MainDataSource) || q.getDataCount() < 1) {
      return;
    }
    var s = z.getArea(this.getAreaName());
    var g = z.getTimeline(this.getDataSourceName());
    var o = z.getRange(this.getAreaName());
    if (o.getRange() == 0) {
      return;
    }
    var w = z.getTheme(this.getFrameName());
    var h = g.getFirstIndex();
    var n = g.getLastIndex();
    var f = s.isChanged() || g.isUpdated() || o.isUpdated() ? h : Math.max(h, n - 2);
    var t = g.getColumnWidth();
    var v = g.getItemWidth() >> 1;
    var d = g.toItemLeft(f);
    var x = g.toItemCenter(f);
    var u = d + g.getItemWidth();
    var e = [], a = [], k = [];
    for (var r = f; r < n; r++) {
      var A = q.getDataAt(r);
      var m = o.toY(A.high);
      var B = o.toY(A.low);
      var c = Math.max(B - m, 1);
      if (A.close > A.open) {
        var p = o.toY(A.close);
        var j = o.toY(A.open);
        e.push({x: x, y: m, w: 1 * GLOBAL_VAR.ratio, h: c});
        e.push({x: d, y: p, w: v, h: 1 * GLOBAL_VAR.ratio});
        e.push({x: x, y: j, w: v, h: 1 * GLOBAL_VAR.ratio});
      } else {
        if (A.close == A.open) {
          var l = o.toY(A.close);
          a.push({x: x, y: m, w: 1 * GLOBAL_VAR.ratio, h: c});
          a.push({x: d, y: l, w: v, h: 1 * GLOBAL_VAR.ratio});
          a.push({x: x, y: l, w: v, h: 1 * GLOBAL_VAR.ratio});
        } else {
          var p = o.toY(A.open);
          var j = o.toY(A.close);
          k.push({x: x, y: m, w: 1 * GLOBAL_VAR.ratio, h: c});
          k.push({x: d, y: p, w: v, h: 1 * GLOBAL_VAR.ratio});
          k.push({x: x, y: j, w: v, h: 1 * GLOBAL_VAR.ratio});
        }
      }
      d += t;
      x += t;
      u += t;
    }
    if (e.length > 0) {
      b.fillStyle = w.getColor(Theme.Color.Positive);
      Plotter.createRectangles(b, e);
      b.fill();
    }
    if (a.length > 0) {
      b.fillStyle = w.getColor(Theme.Color.Negative);
      Plotter.createRectangles(b, a);
      b.fill();
    }
    if (k.length > 0) {
      b.fillStyle = w.getColor(Theme.Color.Negative);
      Plotter.createRectangles(b, k);
      b.fill();
    }
  };
  var MainInfoPlotter = createClass(Plotter);
  MainInfoPlotter.prototype.__construct = function(a) {
    MainInfoPlotter.__super.__construct.call(this, a);
  };
  function format_time(a) {
    return a < 10 ? "0" + a.toString() : a.toString();
  }
  MainInfoPlotter.prototype.Draw = function(c) {
    var B = ChartManager.getInstance();
    var w = B.getArea(this.getAreaName());
    var e = B.getTimeline(this.getDataSourceName());
    var m = B.getDataSource(this.getDataSourceName());
    var y = B.getTheme(this.getFrameName());
    c.font = y.getFont(Theme.Font.Default);
    c.textAlign = "left";
    c.textBaseline = "top";
    c.fillStyle = y.getColor(Theme.Color.Text4);
    var a = {x: w.getLeft() + 4, y: w.getTop() + 2, w: w.getWidth() - 8, h: 20 * GLOBAL_VAR.ratio};
    var s = e.getSelectedIndex();
    if (s < 0) {
      return;
    }
    var C = m.getDataAt(s);
    var i = 8;
    var g = new Date(C.date);
    var k = g.getFullYear();
    var A = format_time(g.getMonth() + 1);
    var z = format_time(g.getDate());
    var f = format_time(g.getHours());
    var l = format_time(g.getMinutes());
    var D = B.getLanguage();
    if (D == "zh-cn") {
      if (!Plotter.drawString(c, "时间: " + k + "-" + A + "-" + z + "  " + f + ":" + l, a)) {
        return;
      }
      if (!Plotter.drawString(c, "  开: " + C.open.toFixed(i), a)) {
        return;
      }
      if (!Plotter.drawString(c, "  高: " + C.high.toFixed(i), a)) {
        return;
      }
      if (!Plotter.drawString(c, "  低: " + C.low.toFixed(i), a)) {
        return;
      }
      if (!Plotter.drawString(c, "  收: " + C.close.toFixed(i), a)) {
        return;
      }
    } else {
      if (D == "en-us") {
        if (!Plotter.drawString(c, "DATE: " + k + "-" + A + "-" + z + "  " + f + ":" + l, a)) {
          return;
        }
        if (!Plotter.drawString(c, "  O: " + C.open.toFixed(i), a)) {
          return;
        }
        if (!Plotter.drawString(c, "  H: " + C.high.toFixed(i), a)) {
          return;
        }
        if (!Plotter.drawString(c, "  L: " + C.low.toFixed(i), a)) {
          return;
        }
        if (!Plotter.drawString(c, "  C: " + C.close.toFixed(i), a)) {
          return;
        }
      } else {
        if (D == "zh-tw") {
          if (!Plotter.drawString(c,"時間: " + k + "-" + A + "-" + z + "  " + f + ":" + l, a)) {
            return;
          }
          if (!Plotter.drawString(c, "  開: " + C.open.toFixed(i), a)) {
            return;
          }
          if (!Plotter.drawString(c, "  高: " + C.high.toFixed(i), a)) {
            return;
          }
          if (!Plotter.drawString(c, "  低: " + C.low.toFixed(i), a)) {
            return;
          }
          if (!Plotter.drawString(c, "  收: " + C.close.toFixed(i), a)) {
            return;
          }
        }
      }
    }
    if (s > 0) {
      if (D == "zh-cn") {
        if (!Plotter.drawString(c, "  涨幅: ", a)) {
          return;
        }
      } else {
        if (D == "en-us") {
          if (!Plotter.drawString(c, "  CHANGE: ", a)) {
            return;
          }
        } else {
          if (D == "zh-tw") {
            if (!Plotter.drawString(c, "  漲幅: ", a)) {
              return;
            }
          }
        }
      }
      var o = m.getDataAt(s - 1);
      var h = (C.close - o.close) / o.close * 100;
      if (h >= 0) {
        h = " " + h.toFixed(2);
        c.fillStyle = y.getColor(Theme.Color.TextPositive);
      } else {
        h = h.toFixed(2);
        c.fillStyle = y.getColor(Theme.Color.TextNegative);
      }
      if (!Plotter.drawString(c, h, a)) {
        return;
      }
      c.fillStyle = y.getColor(Theme.Color.Text4);
      if (!Plotter.drawString(c, " %", a)) {
        return;
      }
    }
    var d = (C.high - C.low) / C.low * 100;
    if (D == "zh-cn") {
      if (!Plotter.drawString(c, "  振幅: " + d.toFixed(2) + " %", a)) {
        return;
      }
      if (!Plotter.drawString(c, "  量: " + C.volume.toFixed(2), a)) {
        return;
      }
    } else {
      if (D == "en-us") {
        if (!Plotter.drawString(c, "  AMPLITUDE: " + d.toFixed(2) + " %", a)) {
          return;
        }
        if (!Plotter.drawString(c, "  V: " + C.volume.toFixed(2), a)) {
          return;
        }
      } else {
        if (D == "zh-tw") {
          if (!Plotter.drawString(c, "  振幅: " + d.toFixed(2) + " %", a)) {
            return;
          }
          if (!Plotter.drawString(c, "  量: " + C.volume.toFixed(2), a)) {
            return;
          }
        }
      }
    }
    var q = B.getDataProvider(this.getAreaName() + ".secondary");
    if (q == undefined) {
      return;
    }
    var b = q.getIndicator();
    var p, t = b.getOutputCount();
    for (p = 0; p < t; p++) {
      var u = b.getOutputAt(p);
      var j = u.execute(s);
      if (isNaN(j)) {
        continue;
      }
      var x = "  " + u.getName() + ": " + j.toFixed(i);
      var r = u.getColor();
      if (r === undefined) {
        r = Theme.Color.Indicator0 + p;
      }
      c.fillStyle = y.getColor(r);
      if (!Plotter.drawString(c, x, a)) {
        return;
      }
    }
  };
  var IndicatorPlotter = createClass(NamedObject);
  IndicatorPlotter.prototype.__construct = function(a) {
    IndicatorPlotter.__super.__construct.call(this, a);
  };
  IndicatorPlotter.prototype.Draw = function(a) {
    var A = ChartManager.getInstance();
    var u = A.getArea(this.getAreaName());
    var e = A.getTimeline(this.getDataSourceName());
    var k = A.getRange(this.getAreaName());
    if (k.getRange() == 0) {
      return;
    }
    var l = A.getDataProvider(this.getName());
    if (!isInstance(l, IndicatorDataProvider)) {
      return;
    }
    var y = A.getTheme(this.getFrameName());
    var w = e.getColumnWidth();
    var f = e.getFirstIndex();
    var g = e.getLastIndex();
    var d = u.isChanged() || e.isUpdated() || k.isUpdated() ? f : Math.max(f, g - 2);
    var b = l.getIndicator();
    var s, m, o = b.getOutputCount();
    for (m = 0; m < o; m++) {
      s = b.getOutputAt(m);
      var t = s.getStyle();
      if (t == OutputStyle.VolumeStick) {
        this.drawVolumeStick(a, y, A.getDataSource(this.getDataSourceName()), d, g, e.toItemLeft(d), w, e.getItemWidth(), k);
      } else {
        if (t == OutputStyle.MACDStick) {
          this.drawMACDStick(a, y, s, d, g, e.toItemLeft(d), w, e.getItemWidth(), k);
        } else {
          if (t == OutputStyle.SARPoint) {
            this.drawSARPoint(a, y, s, d, g, e.toItemCenter(d), w, e.getItemWidth(), k);
          }
        }
      }
    }
    var c = e.toColumnLeft(d);
    var z = e.toItemCenter(d);
    a.save();
    a.rect(c, u.getTop(), u.getRight() - c, u.getHeight());
    a.clip();
    a.translate(0.5, 0.5);
    for (m = 0; m < o; m++) {
      var h = z;
      s = b.getOutputAt(m);
      if (s.getStyle() == OutputStyle.Line) {
        var j, r = [];
        if (d > f) {
          j = s.execute(d - 1);
          if (isNaN(j) == false) {
            r.push({x: h - w, y: k.toY(j)});
          }
        }
        for (var q = d; q < g; q++, h += w) {
          j = s.execute(q);
          if (isNaN(j) == false) {
            r.push({x: h, y: k.toY(j)});
          }
        }
        if (r.length > 0) {
          var p = s.getColor();
          if (p == undefined) {
            p = Theme.Color.Indicator0 + m;
          }
          a.strokeStyle = y.getColor(p);
          Plotter.drawLines(a, r);
        }
      }
    }
    a.restore();
  };
  IndicatorPlotter.prototype.drawVolumeStick = function(b, s, m, f, j, o, p, r, k) {
    var a = isInstance(s, DarkTheme);
    var d = o;
    var h = k.toY(0);
    var q = [];
    var e = [];
    var g = [];
    for (var n = f; n < j; n++) {
      var t = m.getDataAt(n);
      var l = k.toY(t.volume);
      var c = k.toHeight(t.volume);
      if (t.close > t.open) {
        if (c > 1 && r > 1 && a) {
          q.push({x: d + 0.5, y: l + 0.5, w: r - 1, h: c - 1});
        } else {
          e.push({x: d, y: l, w: Math.max(r, 1), h: Math.max(c, 1)});
        }
      } else {
        if (t.close == t.open) {
          if (n > 0 && t.close >= m.getDataAt(n - 1).close) {
            if (c > 1 && r > 1 && a) {
              q.push({x: d + 0.5, y: l + 0.5, w: r - 1, h: c - 1});
            } else {
              e.push({x: d, y: l, w: Math.max(r, 1), h: Math.max(c, 1)});
            }
          } else {
            g.push({x: d, y: l, w: Math.max(r, 1), h: Math.max(c, 1)});
          }
        } else {
          g.push({x: d, y: l, w: Math.max(r, 1), h: Math.max(c, 1)});
        }
      }
      d += p;
    }
    if (q.length > 0) {
      b.fillStyle = s.getColor(Theme.Color.Positive);
      b.strokeStyle = s.getColor(Theme.Color.Positive);
      Plotter.createRectangles(b, q);
      b.stroke();
      b.fill();
    }
    if (e.length > 0) {
      b.fillStyle = s.getColor(Theme.Color.Positive);
      Plotter.createRectangles(b, e);
      b.fill();
    }
    if (g.length > 0) {
      b.fillStyle = s.getColor(Theme.Color.Negative);
      Plotter.createRectangles(b, g);
      b.fill();
    }
  };
  // 指数指标MACD
  IndicatorPlotter.prototype.drawMACDStick = function(a, r, g, e, h, n, o, q, k) {
    var c = n;
    var s = k.toY(0);
    var p = [];
    var t = [];
    var d = [];
    var f = [];
    var j = e > 0 ? g.execute(e - 1) : NaN;
    for (var l = e; l < h; l++) {
      var m = g.execute(l);
      if (m >= 0) {
        var b = k.toHeight(m);
        if ((l == 0 || m >= j) && b > 1 && q > 1) {
          p.push({x: c + 0.5, y: s - b + 0.5, w: q - 1, h: b - 1});
        } else {
          d.push({x: c, y: s - b, w: Math.max(q, 1), h: Math.max(b, 1 * GLOBAL_VAR.ratio)});
        }
      } else {
        var b = k.toHeight(-m);
        if ((l == 0 || m >= j) && b > 1 && q > 1) {
          t.push({x: c + 0.5, y: s + 0.5, w: q - 1, h: b - 1});
        } else {
          f.push({x: c, y: s, w: Math.max(q, 1), h: Math.max(b, 1 * GLOBAL_VAR.ratio)});
        }
      }
      j = m;
      c += o;
    }
    if (p.length > 0) {
      a.fillStyle = r.getColor(Theme.Color.Positive);
      a.strokeStyle = r.getColor(Theme.Color.Positive);
      Plotter.createRectangles(a, p);
      a.stroke();
      a.fill();
    }
    if (t.length > 0) {
      a.fillStyle = r.getColor(Theme.Color.Negative);
      a.strokeStyle = r.getColor(Theme.Color.Negative);
      Plotter.createRectangles(a, t);
      a.stroke();
      a.fill();
    }
    if (d.length > 0) {
      a.fillStyle = r.getColor(Theme.Color.Positive);
      Plotter.createRectangles(a, d);
      a.fill();
    }
    if (f.length > 0) {
      a.fillStyle = r.getColor(Theme.Color.Negative);
      Plotter.createRectangles(a, f);
      a.fill();
    }
  };
  IndicatorPlotter.prototype.drawSARPoint = function(c, g, e, j, p, k, n, l, h) {
    var b = l >> 1;
    if (b < 0.5) {
      b = 0.5;
    }
    if (b > 4) {
      b = 4;
    }
    var a = k;
    var o = a + b;
    var d = 2 * Math.PI;
    c.save();
    c.translate(0.5, 0.5);
    c.strokeStyle = g.getColor(Theme.Color.Indicator3);
    c.beginPath();
    for (var f = j; f < p; f++) {
      var m = h.toY(e.execute(f));
      c.moveTo(o, m);
      c.arc(a, m, b, 0, d);
      a += n;
      o += n;
    }
    c.stroke();
    c.restore();
  };
  var IndicatorInfoPlotter = createClass(Plotter);
  IndicatorInfoPlotter.prototype.__construct = function(a) {
    IndicatorInfoPlotter.__super.__construct.call(this, a);
  };
  IndicatorInfoPlotter.prototype.Draw = function(c) {
    var p = ChartManager.getInstance();
    var b = p.getArea(this.getAreaName());
    var q = p.getTimeline(this.getDataSourceName());
    var h = p.getDataProvider(this.getAreaName() + ".secondary");
    var j = p.getTheme(this.getFrameName());
    c.font = j.getFont(Theme.Font.Default);
    c.textAlign = "left";
    c.textBaseline = "top";
    c.fillStyle = j.getColor(Theme.Color.Text4);
    var l = {x: b.getLeft() + 4, y: b.getTop() + 2, w: b.getWidth() - 8, h: 20};
    var a = h.getIndicator();
    var m;
    switch (a.getParameterCount()) {
      case 0:
        m = a.getName();
        break;
      case 1:
        m = a.getName() + "(" + a.getParameterAt(0).getValue() + ")";
        break;
      case 2:
        m = a.getName() + "(" + a.getParameterAt(0).getValue() + "," + a.getParameterAt(1).getValue() + ")";
        break;
      case 3:
        m = a.getName() + "(" + a.getParameterAt(0).getValue() + "," + a.getParameterAt(1).getValue() + "," + a.getParameterAt(2).getValue() + ")";
        break;
      case 4:
        m = a.getName() + "(" + a.getParameterAt(0).getValue() + "," + a.getParameterAt(1).getValue() + "," + a.getParameterAt(2).getValue() + "," + a.getParameterAt(3).getValue() + ")";
        break;
      default:
        return;
    }
    if (!Plotter.drawString(c, m, l)) {
      return;
    }
    var k = q.getSelectedIndex();
    if (k < 0) {
      return;
    }
    var i, o, f, g;
    var e, d = a.getOutputCount();
    for (e = 0; e < d; e++) {
      i = a.getOutputAt(e);
      o = i.execute(k);
      if (isNaN(o)) {
        continue;
      }
      f = "  " + i.getName() + ": " + o.toFixed(2);
      g = i.getColor();
      if (g === undefined) {
        g = Theme.Color.Indicator0 + e;
      }
      c.fillStyle = j.getColor(g);
      if (!Plotter.drawString(c, f, l)) {
        return;
      }
    }
  };
  var MinMaxPlotter = createClass(NamedObject);
  MinMaxPlotter.prototype.__construct = function(a) {
    MinMaxPlotter.__super.__construct.call(this, a);
  };
  MinMaxPlotter.prototype.Draw = function(b) {
    var i = ChartManager.getInstance();
    var d = i.getDataSource(this.getDataSourceName());
    if (d.getDataCount() < 1) {
      return;
    }
    var j = i.getTimeline(this.getDataSourceName());
    if (j.getInnerWidth() < j.getColumnWidth()) {
      return;
    }
    var h = i.getRange(this.getAreaName());
    if (h.getRange() == 0) {
      return;
    }
    var e = i.getDataProvider(this.getAreaName() + ".main");
    var g = j.getFirstIndex();
    var a = (g + j.getLastIndex()) >> 1;
    var f = i.getTheme(this.getFrameName());
    b.font = f.getFont(Theme.Font.Default);
    b.textBaseline = "middle";
    b.fillStyle = f.getColor(Theme.Color.Text4);
    b.strokeStyle = f.getColor(Theme.Color.Text4);
    var c = d.getDecimalDigits();
    this.drawMark(b, e.getMinValue(), c, h.toY(e.getMinValue()), g, a, e.getMinValueIndex(), j);
    this.drawMark(b, e.getMaxValue(), c, h.toY(e.getMaxValue()), g, a, e.getMaxValueIndex(), j);
  };
  MinMaxPlotter.prototype.drawMark = function(d, k, e, j, g, a, h, l) {
    var f, c, b;
    var i;
    if (h > a) {
      d.textAlign = "right";
      f = l.toItemCenter(h) - 4 * GLOBAL_VAR.ratio;
      c = f - 7 * GLOBAL_VAR.ratio;
      b = f - 3 * GLOBAL_VAR.ratio;
      i = c - 4 * GLOBAL_VAR.ratio;
      // 当文字超出左边画图则显示在右边
      let width = d.measureText(parseFloat(k).toFixed(GLOBAL_VAR.fixedNumber)).width;
      if (i - width < 0) {
        d.textAlign = "left";
        f = l.toItemCenter(h) + 4 * GLOBAL_VAR.ratio;
        c = f + 7 * GLOBAL_VAR.ratio;
        b = f + 3 * GLOBAL_VAR.ratio;
        i = c + 4 * GLOBAL_VAR.ratio;
      }
    } else {
      d.textAlign = "left";
      f = l.toItemCenter(h) + 4 * GLOBAL_VAR.ratio;
      c = f + 7 * GLOBAL_VAR.ratio;
      b = f + 3 * GLOBAL_VAR.ratio;
      i = c + 4 * GLOBAL_VAR.ratio;
    }
    Plotter.drawLine = function(d, b, e, a, c) {
      d.beginPath();
      d.lineWidth = 1 * GLOBAL_VAR.ratio;
      d.moveTo((b << 0) + 0.5, (e << 0) + 0.5);
      d.lineTo((a << 0) + 0.5, (c << 0) + 0.5);
      d.stroke();
    };
    Plotter.drawLine(d, f, j, c, j);
    Plotter.drawLine(d, f, j, b, j + 2 * GLOBAL_VAR.ratio);
    Plotter.drawLine(d, f, j, b, j - 2 * GLOBAL_VAR.ratio);
    d.fillText(parseFloat(k).toFixed(GLOBAL_VAR.fixedNumber), i, j);
  };
  var TimelinePlotter = createClass(Plotter);
  TimelinePlotter.prototype.__construct = function(a) {
    TimelinePlotter.__super.__construct.call(this, a);
  };
  TimelinePlotter.TP_MINUTE = 60 * 1000;
  TimelinePlotter.TP_HOUR = 60 * TimelinePlotter.TP_MINUTE;
  TimelinePlotter.TP_DAY = 24 * TimelinePlotter.TP_HOUR;
  TimelinePlotter.TIME_INTERVAL = [
    5 * TimelinePlotter.TP_MINUTE,
    10 * TimelinePlotter.TP_MINUTE,
    15 * TimelinePlotter.TP_MINUTE,
    30 * TimelinePlotter.TP_MINUTE,
    TimelinePlotter.TP_HOUR,
    2 * TimelinePlotter.TP_HOUR,
    3 * TimelinePlotter.TP_HOUR,
    6 * TimelinePlotter.TP_HOUR,
    12 * TimelinePlotter.TP_HOUR,
    TimelinePlotter.TP_DAY,
    2 * TimelinePlotter.TP_DAY
  ];
  TimelinePlotter.MonthConvert = {1: "Jan.", 2: "Feb.", 3: "Mar.", 4: "Apr.", 5: "May.", 6: "Jun.", 7: "Jul.", 8: "Aug.", 9: "Sep.", 10: "Oct.", 11: "Nov.", 12: "Dec."};
  TimelinePlotter.prototype.Draw = function(b) {
    var G = ChartManager.getInstance();
    var z = G.getArea(this.getAreaName());
    var e = G.getTimeline(this.getDataSourceName());
    if (!z.isChanged() && !e.isUpdated()) {
      return;
    }
    var s = G.getDataSource(this.getDataSourceName());
    if (s.getDataCount() < 2) {
      return;
    }
    var t = s.getDataAt(1).date - s.getDataAt(0).date;
    var u, w = TimelinePlotter.TIME_INTERVAL.length;
    for (u = 0; u < w; u++) {
      if (t < TimelinePlotter.TIME_INTERVAL[u]) {
        break;
      }
    }
    for (; u < w; u++) {
      if (TimelinePlotter.TIME_INTERVAL[u] % t == 0) {
        if (TimelinePlotter.TIME_INTERVAL[u] / t * e.getColumnWidth() > 60) {
          break;
        }
      }
    }
    var h = e.getFirstIndex();
    var k = e.getLastIndex();
    var A = new Date();
    var c = A.getTimezoneOffset() * 60 * 1000;
    var C = G.getTheme(this.getFrameName());
    b.font = C.getFont(Theme.Font.Default);
    b.textAlign = "center";
    b.textBaseline = "middle";
    var I = G.getLanguage();
    var j = [];
    var q = z.getTop();
    var H = z.getMiddle();
    for (var y = h; y < k; y++) {
      var F = s.getDataAt(y).date;
      var a = Math.floor((F - c) / GLOBAL_VAR.ratio);
      var g = new Date(F);
      var o = g.getFullYear();
      var E = g.getMonth() + 1;
      var B = g.getDate();
      var f = g.getHours();
      var r = g.getMinutes();
      var p = "";
      if (u < w) {
        var v = Math.max(TimelinePlotter.TP_DAY, TimelinePlotter.TIME_INTERVAL[u]);
        if (a % v == 0) {
          if (I == "zh-cn") {
            p = E.toString() + "月" + B.toString() + "日";
          } else {
            if (I == "zh-tw") {
              p = E.toString() + "月" + B.toString() + "日";
            } else {
              if (I == "en-us") {
                p = TimelinePlotter.MonthConvert[E] + " " + B.toString();
              }
            }
          }
          b.fillStyle = C.getColor(Theme.Color.Text4);
        } else {
          if (a % TimelinePlotter.TIME_INTERVAL[u] == 0) {
            var D = r.toString();
            if (r < 10) {
              D = "0" + D;
            }
            p = f.toString() + ":" + D;
            b.fillStyle = C.getColor(Theme.Color.Text2);
          }
        }
      } else {
        if (B == 1 && f < t / TimelinePlotter.TP_HOUR) {
          if (E == 1) {
            p = o.toString();
            if (I == "zh-cn") {
              p += "年";
            } else {
              if (I == "zh-tw") {
                p += "年";
              }
            }
          } else {
            if (I == "zh-cn") {
              p = E.toString() + "月";
            } else {
              if (I == "zh-tw") {
                p = E.toString() + "月";
              } else {
                if (I == "en-us") {
                  p = TimelinePlotter.MonthConvert[E];
                }
              }
            }
          }
          b.fillStyle = C.getColor(Theme.Color.Text4);
        }
      }
      if (p.length > 0) {
        var l = e.toItemCenter(y);
        j.push({x: l, y: q, w: 1, h: 4 * GLOBAL_VAR.ratio});
        b.fillText(p, l, H);
      }
    }
    if (j.length > 0) {
      b.save()
      let width = 100
      if (j.length > 1) {
        width = j[1].x - j[0].x
      }
      let ss = [j[0]]
      while (ss[ss.length - 1].x + width < z.getRight() - 88 * GLOBAL_VAR.ratio) {
        ss.push({
          x: ss[ss.length - 1].x + width,
          y: ss[0].y,
          w: 1
        })
      }
      G._verticalGridLines = ss
      b.fillStyle = C.getColor(Theme.Color.Grid1);
      Plotter.createRectangles(b, j);
      b.fill();
      b.restore()
    }
  };
  var RangePlotter = createClass(NamedObject);
  RangePlotter.prototype.__construct = function(a) {
    RangePlotter.__super.__construct.call(this, a);
  };
  RangePlotter.prototype.getRequiredWidth = function(b, a) {
    var c = ChartManager.getInstance();
    var d = c.getTheme(this.getFrameName());
    b.font = d.getFont(Theme.Font.Default);
    return b.measureText((Math.floor(a) + 0.88).toString()).width + 16;
  };
  RangePlotter.prototype.Draw = function(c) {
    var p = ChartManager.getInstance();
    //frame0.k0.indic0Range
    var h = this.getAreaName();
    var b = p.getArea(h);
    var m = h.substring(0, h.lastIndexOf("Range"));
    var i = p.getRange(m);
    if (i.getRange() == 0) {
      return;
    }
    var j = i.getNameObject().getCompAt(2) == "main";
    if (j) {
    } else {
      if (!b.isChanged() && !i.isUpdated()) {
        return;
      }
    }
    var l = i.getGradations();
    if (l.length == 0) {
      return;
    }
    var e = b.getLeft();
    var o = b.getRight();
    var a = b.getCenter();
    var g = p.getTheme(this.getFrameName());
    c.font = g.getFont(Theme.Font.Default);
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = g.getColor(Theme.Color.Text2);
    var f = [];
    for (var d in l) {
      var k = i.toY(l[d]);
      // 超出范围部分排除掉
      if (k >= b._bottom) {
        continue;
      }
      f.push({x: e, y: k, w: 6 * GLOBAL_VAR.ratio, h: 1 * GLOBAL_VAR.ratio});
      f.push({x: o - 6 * GLOBAL_VAR.ratio, y: k, w: 6 * GLOBAL_VAR.ratio, h: 1 * GLOBAL_VAR.ratio});
      c.fillText(parseFloat(l[d]).toFixed(h === 'frame0.k0.indic0Range' ? 2 : GLOBAL_VAR.fixedNumber), a, k);
    }
    if (f.length > 0) {
      c.fillStyle = g.getColor(Theme.Color.Grid1);
      Plotter.createRectangles(c, f);
      c.fill();
    }
  };
  var COrderGraphPlotter = createClass(NamedObject);
  COrderGraphPlotter.prototype.__construct = function(a) {
    COrderGraphPlotter.__super.__construct.call(this, a);
  };
  COrderGraphPlotter.prototype.Draw = function(a) {
    return this._Draw_(a);
  };
  COrderGraphPlotter.prototype._Draw_ = function(a) {
    if (this.Update() == false) {
      return;
    }
    if (this.updateData() == false) {
      return;
    }
    this.m_top = this.m_pArea.getTop();
    this.m_bottom = this.m_pArea.getBottom();
    this.m_left = this.m_pArea.getLeft();
    this.m_right = this.m_pArea.getRight();
    a.save();
    a.rect(this.m_left, this.m_top, this.m_right - this.m_left, this.m_bottom - this.m_top);
    a.clip();
    var c = ChartManager.getInstance().getChart()._depthData;
    this.x_offset = 0;
    this.y_offset = 0;
    var b = {};
    var d = {};
    b.x = this.m_left + c.array[this.m_ask_si].amounts * this.m_Step;
    b.y = this.m_pRange.toY(c.array[this.m_ask_si].rate);
    d.x = this.m_left + c.array[this.m_bid_si].amounts * this.m_Step;
    d.y = this.m_pRange.toY(c.array[this.m_bid_si].rate);
    if (Math.abs(b.y - d.y) < 1) {
      this.y_offset = 1;
    }
    this.x_offset = 1;
    this.DrawBackground(a);
    this.UpdatePoints();
    this.FillBlack(a);
    this.DrawGradations(a);
    this.DrawLine(a);
    a.restore();
  };
  COrderGraphPlotter.prototype.DrawBackground = function(b) {
    b.fillStyle = this.m_pTheme.getColor(Theme.Color.Background);
    b.fillRect(this.m_left, this.m_top, this.m_right - this.m_left, this.m_bottom - this.m_top);
    var c = ChartManager.getInstance().getChart()._depthData;
    if (this.m_mode == 0) {
      var f = this.m_pRange.toY(c.array[this.m_ask_si].rate) - this.y_offset;
      var a = this.m_pRange.toY(c.array[this.m_bid_si].rate) + this.y_offset;
      var e = b.createLinearGradient(this.m_left, 0, this.m_right, 0);
      e.addColorStop(0, this.m_pTheme.getColor(Theme.Color.Background));
      e.addColorStop(1, this.m_pTheme.getColor(Theme.Color.PositiveDark));
      b.fillStyle = e;
      b.fillRect(this.m_left, this.m_top, this.m_right - this.m_left, f - this.m_top);
      var d = b.createLinearGradient(this.m_left, 0, this.m_right, 0);
      d.addColorStop(0, this.m_pTheme.getColor(Theme.Color.Background));
      d.addColorStop(1, this.m_pTheme.getColor(Theme.Color.NegativeDark));
      b.fillStyle = d;
      b.fillRect(this.m_left, a, this.m_right - this.m_left, this.m_bottom - a);
    } else {
      if (this.m_mode == 1) {
        var e = b.createLinearGradient(this.m_left, 0, this.m_right, 0);
        e.addColorStop(0, this.m_pTheme.getColor(Theme.Color.Background));
        e.addColorStop(1, this.m_pTheme.getColor(Theme.Color.PositiveDark));
        b.fillStyle = e;
        b.fillRect(this.m_left, this.m_top, this.m_right - this.m_left, this.m_bottom - this.m_top);
      } else {
        if (this.m_mode == 2) {
          var d = b.createLinearGradient(this.m_left, 0, this.m_right, 0);
          d.addColorStop(0, this.m_pTheme.getColor(Theme.Color.Background));
          d.addColorStop(1, this.m_pTheme.getColor(Theme.Color.NegativeDark));
          b.fillStyle = d;
          b.fillRect(this.m_left, this.m_top, this.m_right - this.m_left, this.m_bottom - this.m_top);
        }
      }
    }
  };
  COrderGraphPlotter.prototype.DrawLine = function(b) {
    if (this.m_mode == 0 || this.m_mode == 1) {
      b.strokeStyle = this.m_pTheme.getColor(Theme.Color.Positive);
      b.beginPath();
      b.moveTo(Math.floor(this.m_ask_points[0].x) + 0.5, Math.floor(this.m_ask_points[0].y) + 0.5);
      for (var a = 1; a < this.m_ask_points.length; a++) {
        b.lineTo(Math.floor(this.m_ask_points[a].x) + 0.5, Math.floor(this.m_ask_points[a].y) + 0.5);
      }
      b.stroke();
    }
    if (this.m_mode == 0 || this.m_mode == 2) {
      b.strokeStyle = this.m_pTheme.getColor(Theme.Color.Negative);
      b.beginPath();
      b.moveTo(this.m_bid_points[0].x + 0.5, this.m_bid_points[0].y + 0.5);
      for (var a = 1; a < this.m_bid_points.length; a++) {
        b.lineTo(this.m_bid_points[a].x + 0.5, this.m_bid_points[a].y + 0.5);
      }
      b.stroke();
    }
  };
  COrderGraphPlotter.prototype.UpdatePoints = function() {
    var f = ChartManager.getInstance().getChart()._depthData;
    this.m_ask_points = [];
    var g = {};
    g.x = Math.floor(this.m_left);
    g.y = Math.floor(this.m_pRange.toY(f.array[this.m_ask_si].rate) - this.y_offset);
    this.m_ask_points.push(g);
    var b = 0;
    for (var e = this.m_ask_si; e >= this.m_ask_ei; e--) {
      var a = {};
      var h = {};
      if (e == this.m_ask_si) {
        a.x = Math.floor(this.m_left + f.array[e].amounts * this.m_Step + this.x_offset);
        a.y = Math.floor(this.m_pRange.toY(f.array[e].rate) - this.y_offset);
        this.m_ask_points.push(a);
        b = 1;
      } else {
        a.x = Math.floor(this.m_left + f.array[e].amounts * this.m_Step + this.x_offset);
        a.y = Math.floor(this.m_ask_points[b].y);
        h.x = Math.floor(a.x);
        h.y = Math.floor(this.m_pRange.toY(f.array[e].rate) - this.y_offset);
        this.m_ask_points.push(a);
        b++;
        this.m_ask_points.push(h);
        b++;
      }
    }
    this.m_bid_points = [];
    var c = {};
    c.x = Math.floor(this.m_left);
    c.y = Math.ceil(this.m_pRange.toY(f.array[this.m_bid_si].rate) + this.y_offset);
    this.m_bid_points.push(c);
    var d = 0;
    for (var e = this.m_bid_si; e <= this.m_bid_ei; e++) {
      var a = {};
      var h = {};
      if (e == this.m_bid_si) {
        a.x = Math.floor(this.m_left + f.array[e].amounts * this.m_Step + this.x_offset);
        a.y = Math.ceil(this.m_pRange.toY(f.array[e].rate) + this.y_offset);
        this.m_bid_points.push(a);
        d = 1;
      } else {
        a.x = Math.floor(this.m_left + f.array[e].amounts * this.m_Step + this.x_offset);
        a.y = Math.ceil(this.m_bid_points[d].y);
        h.x = Math.floor(a.x);
        h.y = Math.ceil(this.m_pRange.toY(f.array[e].rate) + this.x_offset);
        this.m_bid_points.push(a);
        d++;
        this.m_bid_points.push(h);
        d++;
      }
    }
  };
  COrderGraphPlotter.prototype.updateData = function() {
    var d = ChartManager.getInstance().getChart()._depthData;
    if (d.array == null) {
      return false;
    }
    if (d.array.length <= 50) {
      return false;
    }
    var a = this.m_pRange.getOuterMinValue();
    var b = this.m_pRange.getOuterMaxValue();
    this.m_ask_si = d.asks_si;
    this.m_ask_ei = d.asks_si;
    for (var c = d.asks_si; c >= d.asks_ei; c--) {
      if (d.array[c].rate < b) {
        this.m_ask_ei = c;
      } else {
        break;
      }
    }
    this.m_bid_si = d.bids_si;
    this.m_bid_ei = d.bids_si;
    for (var c = d.bids_si; c <= d.bids_ei; c++) {
      if (d.array[c].rate > a) {
        this.m_bid_ei = c;
      } else {
        break;
      }
    }
    if (this.m_ask_ei == this.m_ask_si) {
      this.m_mode = 2;
    } else {
      if (this.m_bid_ei == this.m_bid_si) {
        this.m_mode = 1;
      } else {
        this.m_mode = 0;
      }
    }
    this.m_Step = this.m_pArea.getWidth();
    if (this.m_mode == 0) {
      if (this.m_ask_ei == d.asks_ei && this.m_bid_ei == d.bids_ei) {
        this.m_Step /= Math.min(d.array[this.m_ask_ei].amounts, d.array[this.m_bid_ei].amounts);
      } else {
        if (this.m_ask_ei != d.asks_ei && this.m_bid_ei == d.bids_ei) {
          this.m_Step /= d.array[this.m_bid_ei].amounts;
        } else {
          if (this.m_ask_ei == d.asks_ei && this.m_bid_ei != d.bids_ei) {
            this.m_Step /= d.array[this.m_ask_ei].amounts;
          } else {
            if (this.m_ask_ei != d.asks_ei && this.m_bid_ei != d.bids_ei) {
              this.m_Step /= Math.max(d.array[this.m_ask_ei].amounts, d.array[this.m_bid_ei].amounts);
            }
          }
        }
      }
    } else {
      if (this.m_mode == 1) {
        this.m_Step /= d.array[this.m_ask_ei].amounts;
      } else {
        if (this.m_mode == 2) {
          this.m_Step /= d.array[this.m_bid_ei].amounts;
        }
      }
    }
    return true;
  };
  COrderGraphPlotter.prototype.Update = function() {
    this.m_pMgr = ChartManager.getInstance();
    var b = this.getAreaName();
    this.m_pArea = this.m_pMgr.getArea(b);
    if (this.m_pArea == null) {
      return false;
    }
    var a = b.substring(0, b.lastIndexOf("Range"));
    this.m_pRange = this.m_pMgr.getRange(a);
    if (this.m_pRange == null || this.m_pRange.getRange() == 0) {
      return false;
    }
    this.m_pTheme = this.m_pMgr.getTheme(this.getFrameName());
    if (this.m_pTheme == null) {
      return false;
    }
    return true;
  };
  COrderGraphPlotter.prototype.DrawGradations = function(b) {
    var m = ChartManager.getInstance();
    var g = this.getAreaName();
    var a = m.getArea(g);
    var k = g.substring(0, g.lastIndexOf("Range"));
    var h = m.getRange(k);
    if (h.getRange() == 0) {
      return;
    }
    var j = h.getGradations();
    if (j.length == 0) {
      return;
    }
    var d = a.getLeft();
    var l = a.getRight();
    var e = [];
    for (var c in j) {
      var i = h.toY(j[c]);
      e.push({x: d, y: i, w: 6, h: 1});
      e.push({x: l - 6, y: i, w: 6, h: 1});
    }
    if (e.length > 0) {
      var f = m.getTheme(this.getFrameName());
      b.fillStyle = f.getColor(Theme.Color.Grid1);
      Plotter.createRectangles(b, e);
      b.fill();
    }
  };
  COrderGraphPlotter.prototype.FillBlack = function(f) {
    var c = this.m_ask_points;
    var g = this.m_bid_points;
    var a = {};
    var d = {};
    a.x = this.m_right;
    a.y = c[0].y;
    d.x = this.m_right;
    d.y = c[c.length - 1].y;
    var h = {};
    var b = {};
    h.x = this.m_right;
    h.y = g[0].y - 1;
    b.x = this.m_right;
    b.y = g[g.length - 1].y;
    c.unshift(a);
    c.push(d);
    g.unshift(h);
    g.push(b);
    f.fillStyle = this.m_pTheme.getColor(Theme.Color.Background);
    f.beginPath();
    f.moveTo(Math.floor(c[0].x) + 0.5, Math.floor(c[0].y) + 0.5);
    for (var e = 1; e < c.length; e++) {
      f.lineTo(Math.floor(c[e].x) + 0.5, Math.floor(c[e].y) + 0.5);
    }
    f.fill();
    f.beginPath();
    f.moveTo(Math.floor(g[0].x) + 0.5, Math.floor(g[0].y) + 0.5);
    for (var e = 1; e < g.length; e++) {
      f.lineTo(Math.floor(g[e].x) + 0.5, Math.floor(g[e].y) + 0.5);
    }
    f.fill();
    c.shift();
    c.pop();
    g.shift();
    g.pop();
  };
  COrderGraphPlotter.prototype.DrawTickerGraph = function(c) {
    return;
    var j = ChartManager.getInstance();
    var d = j.getDataSource(this.getDataSourceName());
    var i = d._dataItems[d._dataItems.length - 1].close;
    var b = this.m_left + 1;
    var a = this.m_pRange.toY(i);
    var h = b + 5;
    var g = a + 2.5;
    var f = b + 5;
    var e = a - 2.5;
    c.fillStyle = this.m_pTheme.getColor(Theme.Color.Mark);
    c.strokeStyle = this.m_pTheme.getColor(Theme.Color.Mark);
  };
  var LastVolumePlotter = createClass(Plotter);
  LastVolumePlotter.prototype.__construct = function(a) {
    LastVolumePlotter.__super.__construct.call(this, a);
  };
  LastVolumePlotter.prototype.Draw = function(b) {
    var k = ChartManager.getInstance();
    var l = k.getTimeline(this.getDataSourceName());
    var f = this.getAreaName();
    var a = k.getArea(f);
    var i = f.substring(0, f.lastIndexOf("Range"));
    var g = k.getRange(i);
    if (g.getRange() == 0) {
      return;
    }
    var c = k.getDataSource(this.getDataSourceName());
    if (c.getDataCount() < 1) {
      return;
    }
    var j = c.getDataAt(c.getDataCount() - 1).volume;
    var h = g.toY(j);
    var d = a.getLeft() + 1;
    Plotter.createPolygon(b, [
      {x: a.getLeft(), y: h},
      {x: a.getLeft() + 5 * GLOBAL_VAR.ratio, y: h + 10 * GLOBAL_VAR.ratio},
      {x: a.getRight() - 3 * GLOBAL_VAR.ratio, y: h + 10 * GLOBAL_VAR.ratio},
      {x: a.getRight() - 3 * GLOBAL_VAR.ratio, y: h - 10 * GLOBAL_VAR.ratio},
      {x: a.getLeft() + 5 * GLOBAL_VAR.ratio, y: h - 10 * GLOBAL_VAR.ratio}
    ]);
    var e = k.getTheme(this.getFrameName());
    b.lineWidth = 1 * GLOBAL_VAR.ratio;
    b.fillStyle = e.getColor(Theme.Color.Background);
    b.fill();
    b.strokeStyle = e.getColor(Theme.Color.Grid4);
    b.stroke();
    b.font = e.getFont(Theme.Font.Default);
    b.textAlign = "center";
    b.textBaseline = "middle";
    b.fillStyle = e.getColor(Theme.Color.RangeMark);
    b.strokeStyle = e.getColor(Theme.Color.RangeMark);
    b.fillText(String.fromFloat(j, c.getDecimalDigits()), a.getCenter(), h);
  };
  var LastClosePlotter = createClass(Plotter);
  LastClosePlotter.prototype.__construct = function(a) {
    LastClosePlotter.__super.__construct.call(this, a);
  };
  LastClosePlotter.prototype.Draw = function(b) {
    var k = ChartManager.getInstance();
    var l = k.getTimeline(this.getDataSourceName());
    var f = this.getAreaName();
    var a = k.getArea(f);
    var i = f.substring(0, f.lastIndexOf("Range"));
    var g = k.getRange(i);
    if (g.getRange() == 0) {
      return;
    }
    var c = k.getDataSource(this.getDataSourceName());
    if (c.getDataCount() < 1) {
      return;
    }
    var j = c._dataItems[c._dataItems.length - 1].close;
    if (j <= g.getMinValue() || j >= g.getMaxValue()) {
      return;
    }
    var h = g.toY(j);
    var d = a.getLeft() + 1;
    Plotter.createPolygon(b, [
      {x: a.getLeft(), y: h}, 
      {x: a.getLeft() + 5 * GLOBAL_VAR.ratio, y: h + 10 * GLOBAL_VAR.ratio}, 
      {x: a.getRight() - 3 * GLOBAL_VAR.ratio, y: h + 10 * GLOBAL_VAR.ratio}, 
      {x: a.getRight() - 3 * GLOBAL_VAR.ratio, y: h - 10 * GLOBAL_VAR.ratio}, 
      {x: a.getLeft() + 5 * GLOBAL_VAR.ratio, y: h - 10 * GLOBAL_VAR.ratio}]
    );
    var e = k.getTheme(this.getFrameName());
    b.lineWidth = 1 * GLOBAL_VAR.ratio;
    b.fillStyle = e.getColor(Theme.Color.Background);
    b.fill();
    b.strokeStyle = e.getColor(Theme.Color.Grid4);
    b.stroke();
    b.font = e.getFont(Theme.Font.Default);
    b.textAlign = "center";
    b.textBaseline = "middle";
    b.fillStyle = e.getColor(Theme.Color.RangeMark);
    b.strokeStyle = e.getColor(Theme.Color.RangeMark);
    b.fillText(String.fromFloat(j, c.getDecimalDigits()), a.getCenter(), h);
  };
  var SelectionPlotter = createClass(Plotter);
  SelectionPlotter.prototype.__construct = function(a) {
    SelectionPlotter.__super.__construct.call(this, a);
  };
  SelectionPlotter.prototype.Draw = function(c) {
    var f = ChartManager.getInstance();
    if (f._drawingTool != ChartManager.DrawingTool.CrossCursor) {
      return;
    }
    var e = f.getArea(this.getAreaName());
    var d = f.getTimeline(this.getDataSourceName());
    if (d.getSelectedIndex() < 0) {
      return;
    }
    var b = f.getRange(this.getAreaName());
    var g = f.getTheme(this.getFrameName());
    c.strokeStyle = g.getColor(Theme.Color.Cursor);
    var a = d.toItemCenter(d.getSelectedIndex());
    Plotter.drawLine(c, a, e.getTop() - 1, a, e.getBottom());
    var h = b.getSelectedPosition();
    if (h >= 0) {
      Plotter.drawLine(c, e.getLeft(), h, e.getRight(), h);
    }
  };
  var TimelineSelectionPlotter = createClass(NamedObject);
  TimelineSelectionPlotter.MonthConvert = {1: "Jan.", 2: "Feb.", 3: "Mar.", 4: "Apr.", 5: "May.", 6: "Jun.", 7: "Jul.", 8: "Aug.", 9: "Sep.", 10: "Oct.", 11: "Nov.", 12: "Dec."};
  TimelineSelectionPlotter.prototype.__construct = function(a) {
    TimelineSelectionPlotter.__super.__construct.call(this, a);
  };
  TimelineSelectionPlotter.prototype.Draw = function(b) {
    var q = ChartManager.getInstance();
    var l = q.getArea(this.getAreaName());
    var c = q.getTimeline(this.getDataSourceName());
    if (c.getSelectedIndex() < 0) {
      return;
    }
    var j = q.getDataSource(this.getDataSourceName());
    if (!isInstance(j, MainDataSource)) {
      return;
    }
    var m = q.getTheme(this.getFrameName());
    var r = q.getLanguage();
    var g = c.toItemCenter(c.getSelectedIndex());
    g = Math.max(g, 54.5);
    b.lineWidth = 1 * GLOBAL_VAR.ratio;
    b.fillStyle = m.getColor(Theme.Color.Background);
    b.fillRect(Math.max(g - 52.5 * GLOBAL_VAR.ratio, 2 * GLOBAL_VAR.ratio), l.getTop() + 2.5 * GLOBAL_VAR.ratio, 106 * GLOBAL_VAR.ratio, 18 * GLOBAL_VAR.ratio);
    b.strokeStyle = m.getColor(Theme.Color.Grid3);
    b.strokeRect(Math.max(g - 52.5 * GLOBAL_VAR.ratio, 2 * GLOBAL_VAR.ratio), l.getTop() + 2.5 * GLOBAL_VAR.ratio, 106 * GLOBAL_VAR.ratio, 18 * GLOBAL_VAR.ratio);
    b.font = m.getFont(Theme.Font.Default);
    b.textAlign = "center";
    b.textBaseline = "middle";
    b.fillStyle = m.getColor(Theme.Color.Text4);
    var f = new Date(j.getDataAt(c.getSelectedIndex()).date);
    var o = f.getMonth() + 1;
    var n = f.getDate();
    var e = f.getHours();
    var i = f.getMinutes();
    var a = o.toString();
    var d = n.toString();
    var k = e.toString();
    var p = i.toString();
    if (i < 10) {
      p = "0" + p;
    }
    var h = "";
    if (r == "zh-cn") {
      h = `${a}月${d}日  ${k}:${p}`;
    } else if(r == "zh-tw") {
      h = `${a}月${d}日  :${p}`;
    } else if (r == "en-us") {
      h = `${TimelineSelectionPlotter.MonthConvert[o]} ${d}  ${k}:${p}`;
    }
    var diff = Math.max(g - 52.5 * GLOBAL_VAR.ratio, 2 * GLOBAL_VAR.ratio) - (g - 52.5 * GLOBAL_VAR.ratio);
		diff = diff === 2 ? 0 : diff;
    b.fillText(h, diff + g, l.getMiddle() - 4 * GLOBAL_VAR.ratio);
  };
  var RangeSelectionPlotter = createClass(NamedObject);
  RangeSelectionPlotter.prototype.__construct = function(a) {
    RangeSelectionPlotter.__super.__construct.call(this, a);
  };
  RangeSelectionPlotter.prototype.Draw = function(b) {
    var j = ChartManager.getInstance();
    var e = this.getAreaName();
    var a = j.getArea(e);
    var k = j.getTimeline(this.getDataSourceName());
    if (k.getSelectedIndex() < 0) {
      return;
    }
    var h = e.substring(0, e.lastIndexOf("Range"));
    var f = j.getRange(h);
    if (f.getRange() == 0 || f.getSelectedPosition() < 0) {
      return;
    }
    var i = f.getSelectedValue();
    if (i == -Number.MAX_VALUE) {
      return;
    }
    var g = f.getSelectedPosition();
    Plotter.createPolygon(b, [
      {x: a.getLeft(), y: g},
      {x: a.getLeft() + 5 * GLOBAL_VAR.ratio, y: g + 10 * GLOBAL_VAR.ratio},
      {x: a.getRight() - 3 * GLOBAL_VAR.ratio, y: g + 10 * GLOBAL_VAR.ratio},
      {x: a.getRight() - 3 * GLOBAL_VAR.ratio, y: g - 10 * GLOBAL_VAR.ratio},
      {x: a.getLeft() + 5 * GLOBAL_VAR.ratio, y: g - 10 * GLOBAL_VAR.ratio}
    ]);
    var d = j.getTheme(this.getFrameName());
    b.fillStyle = d.getColor(Theme.Color.Background);
    b.fill();
    b.strokeStyle = d.getColor(Theme.Color.Grid4);
    b.stroke();
    b.font = d.getFont(Theme.Font.Default);
    b.textAlign = "center";
    b.textBaseline = "middle";
    b.fillStyle = d.getColor(Theme.Color.Text3);
    var c = 2;
    if (f.getNameObject().getCompAt(2) == "main") {
      c = j.getDataSource(this.getDataSourceName()).getDecimalDigits();
    }
    c = e === 'frame0.k0.indic0Range' ? 2 : GLOBAL_VAR.fixedNumber
    b.fillText(String.fromFloat(i, c), a.getCenter(), g);
  };
  var ChartSettings = {};
  ChartSettings.checkVersion = function() {
    if (ChartSettings._data.ver < 2) {
      ChartSettings._data.ver = 2;
      var a = ChartSettings._data.charts;
      a.period_weight = {};
      a.period_weight.line = 8;
      a.period_weight["1min"] = 7;
      a.period_weight["5min"] = 6;
      a.period_weight["15min"] = 5;
      a.period_weight["30min"] = 4;
      a.period_weight["1hour"] = 3;
      a.period_weight["1day"] = 2;
      a.period_weight["1week"] = 1;
      a.period_weight["3min"] = 0;
      a.period_weight["2hour"] = 0;
      a.period_weight["4hour"] = 0;
      a.period_weight["6hour"] = 0;
      a.period_weight["12hour"] = 0;
      a.period_weight["3day"] = 0;
    }
    if (ChartSettings._data.ver < 3) {
      ChartSettings._data.ver = 3;
      var a = ChartSettings._data.charts;
      a.areaHeight = [];
    }
  };
  ChartSettings.get = function() {
    if (ChartSettings._data == undefined) {
      ChartSettings.init();
      ChartSettings.load();
      ChartSettings.checkVersion();
    }
    return ChartSettings._data;
  };
  ChartSettings.init = function() {
    var h = "CandleStick";
    var c = "MA";
    var a = new Array("VOLUME", "MACD");
    var l = "1m";
    var d = {};
    d.chartStyle = h;
    d.mIndic = c;
    d.indics = a;
    d.indicsStatus = "close";
    d.period = l;
    ChartSettings._data = {ver: 1, charts: d, indics: ChartManager.getInstance().getIndics(), theme: "Dark"};
    ChartSettings.checkVersion();
  };
  ChartSettings.load = function() {
    if (opts.chartSetting === false) {
      return
    }
    var chartSettings = window.localStorage.getItem('chartSettings')
    if (!chartSettings) {
      return
    }
    ChartSettings._data = JSON.parse(chartSettings);
  };
  ChartSettings.save = function() {
    if (opts.chartSetting === false) {
      return
    }
    window.localStorage.setItem('chartSettings', JSON.stringify(ChartSettings._data))
  };
  var CPoint = createClass(NamedObject);
  CPoint.state = {Hide: 0, Show: 1, Highlight: 2 };
  CPoint.prototype.__construct = function(a) {
    CPoint.__super.__construct.call(this, a);
    this.pos = {index: -1, value: -1};
    this.state = CPoint.state.Hide;
  };
  CPoint.prototype.getChartObjects = function() {
    var b = ChartManager.getInstance();
    var d = b.getDataSource("frame0.k0");
    if (d == null || !isInstance(d, MainDataSource)) {
      return null;
    }
    var c = b.getTimeline("frame0.k0");
    if (c == null) {
      return null;
    }
    var a = b.getRange("frame0.k0.main");
    if (a == null) {
      return null;
    }
    return {pMgr: b, pCDS: d, pTimeline: c, pRange: a};
  };
  CPoint.prototype.setPosXY = function(b, f) {
    var e = this.getChartObjects();
    var d = e.pTimeline.toIndex(b);
    var c = e.pRange.toValue(f);
    var a = this.snapValue(d, c);
    if (a != null) {
      c = a;
    }
    this.setPosIV(d, c);
  };
  CPoint.prototype.setPosXYNoSnap = function(a, e) {
    var d = this.getChartObjects();
    var c = d.pTimeline.toIndex(a);
    var b = d.pRange.toValue(e);
    this.setPosIV(c, b);
  };
  CPoint.prototype.setPosIV = function(b, a) {
    this.pos = {index: b, value: a};
  };
  CPoint.prototype.getPosXY = function() {
    var c = this.getChartObjects();
    var b = c.pTimeline.toItemCenter(this.pos.index);
    var a = c.pRange.toY(this.pos.value);
    return {x: b, y: a};
  };
  CPoint.prototype.getPosIV = function() {
    return {i: this.pos.index, v: this.pos.value};
  };
  CPoint.prototype.setState = function(a) {
    this.state = a;
  };
  CPoint.prototype.getState = function() {
    return this.state;
  };
  CPoint.prototype.isSelected = function(a, c) {
    var b = this.getPosXY();
    if (a < b.x - 4 || a > b.x + 4 || c < b.y - 4 || c > b.y + 4) {
      return false;
    }
    this.setState(CPoint.state.Highlight);
    return true;
  };
  CPoint.prototype.snapValue = function(o, j) {
    var k = this.getChartObjects();
    var h = null;
    var c = Math.floor(k.pTimeline.getFirstIndex());
    var e = Math.floor(k.pTimeline.getLastIndex());
    if (o < c || o > e) {
      return h;
    }
    var f = k.pRange.toY(j);
    var d = k.pCDS.getDataAt(o);
    if (d == null || d == undefined) {
      return h;
    }
    var p = k.pCDS.getDataAt(o > 0 ? o - 1 : 0);
    var b = k.pMgr.getChartStyle(k.pCDS.getFrameName());
    var l = k.pRange.toY(d.open);
    var g = k.pRange.toY(d.high);
    var r = k.pRange.toY(d.low);
    var m = k.pRange.toY(d.close);
    if (b === "CandleStickHLC") {
      l = k.pRange.toY(p.close);
    }
    var q = Math.abs(l - f);
    var n = Math.abs(g - f);
    var s = Math.abs(r - f);
    var a = Math.abs(m - f);
    if (q <= n && q <= s && q <= a) {
      if (q < 6) {
        h = d.open;
      }
    }
    if (n <= q && n <= s && n <= a) {
      if (n < 6) {
        h = d.high;
      }
    }
    if (s <= q && s <= n && s <= a) {
      if (s < 6) {
        h = d.low;
      }
    }
    if (a <= q && a <= n && a <= s) {
      if (a < 6) {
        h = d.close;
      }
    }
    return h;
  };
  var CToolObject = createClass(NamedObject);
  CToolObject.state = {BeforeDraw: 0, Draw: 1, AfterDraw: 2};
  CToolObject.prototype.__construct = function(a) {
    CToolObject.__super.__construct.call(this, a);
    this.drawer = null;
    this.state = CToolObject.state.BeforeDraw;
    this.points = [];
    this.step = 0;
  };
  CToolObject.prototype.getChartObjects = function() {
    var c = ChartManager.getInstance();
    var e = c.getDataSource("frame0.k0");
    if (e == null || !isInstance(e, MainDataSource)) {
      return null;
    }
    var d = c.getTimeline("frame0.k0");
    if (d == null) {
      return null;
    }
    var a = c.getArea("frame0.k0.main");
    if (a == null) {
      return null;
    }
    var b = c.getRange("frame0.k0.main");
    if (b == null) {
      return null;
    }
    return {pMgr: c, pCDS: e, pTimeline: d, pArea: a, pRange: b};
  };
  CToolObject.prototype.isValidMouseXY = function(a, d) {
    var b = this.getChartObjects();
    var c = {left: b.pArea.getLeft(), top: b.pArea.getTop(), right: b.pArea.getRight(), bottom: b.pArea.getBottom()};
    if (a < c.left || a > c.right || d < c.top || d > c.bottom) {
      return false;
    }
    return true;
  };
  CToolObject.prototype.getPlotter = function() {
    return this.drawer;
  };
  CToolObject.prototype.setState = function(a) {
    this.state = a;
  };
  CToolObject.prototype.getState = function() {
    return this.state;
  };
  CToolObject.prototype.addPoint = function(a) {
    this.points.push(a);
  };
  CToolObject.prototype.getPoint = function(a) {
    return this.points[a];
  };
  CToolObject.prototype.acceptMouseMoveEvent = function(a, b) {
    if (this.isValidMouseXY(a, b) == false) {
      return false;
    }
    if (this.state == CToolObject.state.BeforeDraw) {
      this.setBeforeDrawPos(a, b);
    } else {
      if (this.state == CToolObject.state.Draw) {
        this.setDrawPos(a, b);
      } else {
        if (this.state == CToolObject.state.AfterDraw) {
          this.setAfterDrawPos(a, b);
        }
      }
    }
    return true;
  };
  CToolObject.prototype.acceptMouseDownEvent = function(a, b) {
    if (this.isValidMouseXY(a, b) == false) {
      return false;
    }
    if (this.state == CToolObject.state.BeforeDraw) {
      this.setDrawPos(a, b);
      this.setState(CToolObject.state.Draw);
    } else {
      if (this.state == CToolObject.state.Draw) {
        this.setAfterDrawPos(a, b);
        if (this.step == 0) {
          this.setState(CToolObject.state.AfterDraw);
        }
      } else {
        if (this.state == CToolObject.state.AfterDraw) {
          if (CToolObject.prototype.isSelected.call(this, a, b)) {
            this.setDrawPos(a, b);
            this.setState(CToolObject.state.Draw);
          } else {
            this.oldx = a;
            this.oldy = b;
          }
        }
      }
    }
    return true;
  };
  CToolObject.prototype.acceptMouseDownMoveEvent = function(g, e) {
    if (this.isValidMouseXY(g, e) == false) {
      return false;
    }
    if (this.state == CToolObject.state.Draw) {
      this.setDrawPos(g, e);
    } else {
      if (this.state == CToolObject.state.AfterDraw) {
        var a = this.getChartObjects();
        var b = a.pTimeline.getItemWidth();
        var c = a.pRange;
        if (Math.abs(g - this.oldx) < b && Math.abs(e - this.oldy) == 0) {
          return true;
        }
        var i = a.pTimeline.toIndex(this.oldx);
        var f = a.pRange.toValue(this.oldy);
        var j = a.pTimeline.toIndex(g);
        var h = a.pRange.toValue(e);
        this.oldx = g;
        this.oldy = e;
        var l = j - i;
        var k = h - f;
        for (var d in this.points) {
          this.points[d].pos.index += l;
          this.points[d].pos.value += k;
        }
      }
    }
    return true;
  };
  CToolObject.prototype.acceptMouseUpEvent = function(a, b) {
    if (this.isValidMouseXY(a, b) == false) {
      return false;
    }
    if (this.state == CToolObject.state.Draw) {
      this.setAfterDrawPos(a, b);
      if (this.step == 0) {
        this.setState(CToolObject.state.AfterDraw);
      }
      return true;
    }
    return false;
  };
  CToolObject.prototype.setBeforeDrawPos = function(a, c) {
    for (var b in this.points) {
      this.points[b].setPosXY(a, c);
      this.points[b].setState(CPoint.state.Show);
    }
  };
  CToolObject.prototype.setDrawPos = function(a, c) {
    for (var b in this.points) {
      if (this.points[b].getState() == CPoint.state.Highlight) {
        this.points[b].setPosXY(a, c);
      }
    }
  };
  CToolObject.prototype.setAfterDrawPos = function(a, d) {
    if (this.step != 0) {
      this.step -= 1;
    }
    for (var b in this.points) {
      this.points[b].setState(CPoint.state.Hide);
    }
    if (this.step == 0) {
      var c = this.getChartObjects();
      c.pMgr.setNormalMode();
    }
  };
  CToolObject.prototype.isSelected = function(a, d) {
    var c = false;
    for (var b in this.points) {
      if (this.points[b].isSelected(a, d)) {
        this.points[b].setState(CPoint.state.Highlight);
        c = true;
        break;
      }
    }
    if (c == true) {
      this.select();
      return true;
    }
    return false;
  };
  CToolObject.prototype.select = function() {
    for (var a in this.points) {
      if (this.points[a].getState() == CPoint.state.Hide) {
        this.points[a].setState(CPoint.state.Show);
      }
    }
  };
  CToolObject.prototype.unselect = function() {
    for (var a in this.points) {
      if (this.points[a].getState() != CPoint.state.Hide) {
        this.points[a].setState(CPoint.state.Hide);
      }
    }
  };
  CToolObject.prototype.calcDistance = function(l, i, g) {
    var a = l.getPosXY().x;
    var j = l.getPosXY().y;
    var o = i.getPosXY().x;
    var h = i.getPosXY().y;
    var n = g.getPosXY().x;
    var f = g.getPosXY().y;
    var d = a - n;
    var b = j - f;
    var m = o - n;
    var k = h - f;
    var c = Math.abs(d * k - b * m);
    var e = Math.sqrt(Math.pow(o - a, 2) + Math.pow(h - j, 2));
    return c / e;
  };
  CToolObject.prototype.calcGap = function(b, m, k) {
    var a = b.sx;
    var i = b.sy;
    var o = b.ex;
    var h = b.ey;
    var n = m;
    var g = k;
    var e = a - n;
    var c = i - g;
    var l = o - n;
    var j = h - g;
    var d = Math.abs(e * j - c * l);
    var f = Math.sqrt(Math.pow(o - a, 2) + Math.pow(h - i, 2));
    return d / f;
  };
  CToolObject.prototype.isWithRect = function(g, d, c) {
    var h = g.getPosXY().x;
    var f = g.getPosXY().y;
    var b = d.getPosXY().x;
    var a = d.getPosXY().y;
    var i = c.getPosXY().x;
    var e = c.getPosXY().y;
    if (h > b) {
      h += 4;
      b -= 4;
    } else {
      h -= 4;
      b += 4;
    }
    if (f > a) {
      f += 4;
      a -= 4;
    } else {
      f -= 4;
      a += 4;
    }
    if (h <= i && b >= i && f <= e && a >= e) {
      return true;
    }
    if (h >= i && b <= i && f <= e && a >= e) {
      return true;
    }
    if (h <= i && b >= i && f >= e && a <= e) {
      return true;
    }
    if (h >= i && b <= i && f >= e && a <= e) {
      return true;
    }
    return false;
  };
  var CBiToolObject = createClass(CToolObject);
  CBiToolObject.prototype.__construct = function(a) {
    CBiToolObject.__super.__construct.call(this, a);
    this.addPoint(new CPoint(a));
    this.addPoint(new CPoint(a));
  };
  CBiToolObject.prototype.setBeforeDrawPos = function(a, b) {
    this.step = 1;
    CBiToolObject.__super.setBeforeDrawPos.call(this, a, b);
    this.getPoint(0).setState(CPoint.state.Show);
    this.getPoint(1).setState(CPoint.state.Highlight);
  };
  var CTriToolObject = createClass(CToolObject);
  CTriToolObject.prototype.__construct = function(a) {
    CTriToolObject.__super.__construct.call(this, a);
    this.addPoint(new CPoint(a));
    this.addPoint(new CPoint(a));
    this.addPoint(new CPoint(a));
  };
  CTriToolObject.prototype.setBeforeDrawPos = function(a, b) {
    this.step = 2;
    CBiToolObject.__super.setBeforeDrawPos.call(this, a, b);
    this.getPoint(0).setState(CPoint.state.Show);
    this.getPoint(1).setState(CPoint.state.Show);
    this.getPoint(2).setState(CPoint.state.Highlight);
  };
  CTriToolObject.prototype.setAfterDrawPos = function(a, d) {
    if (this.step != 0) {
      this.step -= 1;
    }
    if (this.step == 0) {
      for (var b in this.points) {
        this.points[b].setState(CPoint.state.Hide);
      }
    } else {
      this.getPoint(0).setState(CPoint.state.Show);
      this.getPoint(1).setState(CPoint.state.Highlight);
      this.getPoint(2).setState(CPoint.state.Show);
    }
    if (this.step == 0) {
      var c = this.getChartObjects();
      c.pMgr.setNormalMode();
    }
  };
  var CBandLineObject = createClass(CBiToolObject);
  CBandLineObject.prototype.__construct = function(a) {
    CBandLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawBandLinesPlotter(a, this);
  };
  CBandLineObject.prototype.isSelected = function(l, h) {
    if (CBandLineObject.__super.isSelected.call(this, l, h) == true) {
      return true;
    }
    var g = new CPoint("frame0.k0");
    g.setPosXY(l, h);
    var k = this.getPoint(0).getPosXY().x;
    var j = this.getPoint(0).getPosXY().y;
    var f = this.getPoint(1).getPosXY().x;
    var e = this.getPoint(1).getPosXY().y;
    var a = [100, 87.5, 75, 62.5, 50, 37.5, 25, 12.5, 0];
    for (var d = 0; d < a.length; d++) {
      var b = j + (100 - a[d]) / 100 * (e - j);
      if (b < h + 4 && b > h - 4) {
        this.select();
        return true;
      }
    }
    return false;
  };
  var CBiParallelLineObject = createClass(CTriToolObject);
  CBiParallelLineObject.prototype.__construct = function(a) {
    CBiParallelLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawBiParallelLinesPlotter(a, this);
  };
  CBiParallelLineObject.prototype.isSelected = function(n, l) {
    if (CTriParallelLineObject.__super.isSelected.call(this, n, l) == true) {
      return true;
    }
    var m = this.getPoint(0).getPosXY().x;
    var j = this.getPoint(0).getPosXY().y;
    var e = this.getPoint(1).getPosXY().x;
    var d = this.getPoint(1).getPosXY().y;
    var a = this.getPoint(2).getPosXY().x;
    var o = this.getPoint(2).getPosXY().y;
    var k = {x: m - e, y: j - d};
    var i = {x: m - a, y: j - o};
    var g = {x: k.x + i.x, y: k.y + i.y};
    var h = m - g.x;
    var f = j - g.y;
    var c = {sx: m, sy: j, ex: a, ey: o};
    var b = {sx: e, sy: d, ex: h, ey: f};
    if (this.calcGap(c, n, l) > 4 && this.calcGap(b, n, l) > 4) {
      return false;
    }
    return true;
  };
  var CBiParallelRayLineObject = createClass(CTriToolObject);
  CBiParallelRayLineObject.prototype.__construct = function(a) {
    CBiParallelRayLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawBiParallelRayLinesPlotter(a, this);
  };
  CBiParallelRayLineObject.prototype.isSelected = function(n, l) {
    if (CTriParallelLineObject.__super.isSelected.call(this, n, l) == true) {
      return true;
    }
    var m = this.getPoint(0).getPosXY().x;
    var j = this.getPoint(0).getPosXY().y;
    var e = this.getPoint(1).getPosXY().x;
    var d = this.getPoint(1).getPosXY().y;
    var a = this.getPoint(2).getPosXY().x;
    var o = this.getPoint(2).getPosXY().y;
    var k = {x: m - e, y: j - d};
    var i = {x: m - a, y: j - o};
    var g = {x: k.x + i.x, y: k.y + i.y};
    var h = m - g.x;
    var f = j - g.y;
    var c = {sx: m, sy: j, ex: a, ey: o};
    var b = {sx: e, sy: d, ex: h, ey: f};
    if ((c.ex > c.sx && n > c.sx - 4) || (c.ex < c.sx && n < c.sx + 4) || (b.ex > b.sx && n > b.sx - 4) || (b.ex < b.sx && n < b.sx + 4)) {
      if (this.calcGap(c, n, l) > 4 && this.calcGap(b, n, l) > 4) {
        return false;
      }
    } else {
      return false;
    }
    this.select();
    return true;
  };
  var CFibFansObject = createClass(CBiToolObject);
  CFibFansObject.prototype.__construct = function(a) {
    CFibFansObject.__super.__construct.call(this, a);
    this.drawer = new DrawFibFansPlotter(a, this);
  };
  CFibFansObject.prototype.isSelected = function(h, g) {
    if (CFibFansObject.__super.isSelected.call(this, h, g) == true) {
      return true;
    }
    var s = new CPoint("frame0.k0");
    s.setPosXY(h, g);
    var n = this.getPoint(0).getPosXY().x;
    var m = this.getPoint(0).getPosXY().y;
    var r = this.getPoint(1).getPosXY().x;
    var q = this.getPoint(1).getPosXY().y;
    var j = this.getChartObjects();
    var d = {left: j.pArea.getLeft(), top: j.pArea.getTop(), right: j.pArea.getRight(), bottom: j.pArea.getBottom()};
    var f = [0, 38.2, 50, 61.8];
    for (var p = 0; p < f.length; p++) {
      var o = m + (100 - f[p]) / 100 * (q - m);
      var l = {x: n, y: m};
      var z = {x: r, y: o};
      var e = getRectCrossPt(d, l, z);
      var w = Math.pow(e[0].x - n, 2) + Math.pow(e[0].y - m, 2);
      var v = Math.pow(e[0].x - r, 2) + Math.pow(e[0].y - q, 2);
      var k = w > v ? {x: e[0].x, y: e[0].y} : {x: e[1].x, y: e[1].y};
      if (k.x > n && h < n) {
        continue;
      }
      if (k.x < n && h > n) {
        continue;
      }
      var u = new CPoint("frame0.k0");
      u.setPosXY(n, m);
      var t = new CPoint("frame0.k0");
      t.setPosXY(k.x, k.y);
      if (this.calcDistance(u, t, s) > 4) {
        continue;
      }
      this.select();
      return true;
    }
    return false;
  };
  var CFibRetraceObject = createClass(CBiToolObject);
  CFibRetraceObject.prototype.__construct = function(a) {
    CFibRetraceObject.__super.__construct.call(this, a);
    this.drawer = new DrawFibRetracePlotter(a, this);
  };
  CFibRetraceObject.prototype.isSelected = function(l, h) {
    if (CFibRetraceObject.__super.isSelected.call(this, l, h) == true) {
      return true;
    }
    var g = new CPoint("frame0.k0");
    g.setPosXY(l, h);
    var k = this.getPoint(0).getPosXY().x;
    var j = this.getPoint(0).getPosXY().y;
    var f = this.getPoint(1).getPosXY().x;
    var e = this.getPoint(1).getPosXY().y;
    var a = [100, 78.6, 61.8, 50, 38.2, 23.6, 0];
    for (var d = 0; d < a.length; d++) {
      var b = j + (100 - a[d]) / 100 * (e - j);
      if (b < h + 4 && b > h - 4) {
        this.select();
        return true;
      }
    }
    return false;
  };
  var CHoriRayLineObject = createClass(CBiToolObject);
  CHoriRayLineObject.prototype.__construct = function(a) {
    CHoriRayLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawHoriRayLinesPlotter(a, this);
  };
  CHoriRayLineObject.prototype.setDrawPos = function(a, b) {
    if (this.points[0].getState() == CPoint.state.Highlight) {
      this.points[0].setPosXY(a, b);
      this.points[1].setPosXYNoSnap(this.points[1].getPosXY().x, this.points[0].getPosXY().y);
      return;
    }
    if (this.points[1].getState() == CPoint.state.Highlight) {
      this.points[1].setPosXY(a, b);
      this.points[0].setPosXYNoSnap(this.points[0].getPosXY().x, this.points[1].getPosXY().y);
    }
  };
  CHoriRayLineObject.prototype.isSelected = function(a, g) {
    if (CHoriRayLineObject.__super.isSelected.call(this, a, g) == true) {
      return true;
    }
    var f = new CPoint("frame0.k0");
    f.setPosXY(a, g);
    var d = this.getPoint(0).getPosXY().y;
    var e = this.getPoint(0).getPosXY().x;
    var b = this.getPoint(1).getPosXY().x;
    if (g > d + 4 || g < d - 4) {
      return false;
    }
    if (b > e && a < e - 4) {
      return false;
    }
    if (b < e && a > e + 4) {
      return false;
    }
    this.select();
    return true;
  };
  var CHoriSegLineObject = createClass(CBiToolObject);
  CHoriSegLineObject.prototype.__construct = function(a) {
    CHoriSegLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawHoriSegLinesPlotter(a, this);
  };
  CHoriSegLineObject.prototype.setDrawPos = function(a, b) {
    if (this.points[0].getState() == CPoint.state.Highlight) {
      this.points[0].setPosXY(a, b);
      this.points[1].setPosXYNoSnap(this.points[1].getPosXY().x, this.points[0].getPosXY().y);
      return;
    }
    if (this.points[1].getState() == CPoint.state.Highlight) {
      this.points[1].setPosXY(a, b);
      this.points[0].setPosXYNoSnap(this.points[0].getPosXY().x, this.points[1].getPosXY().y);
    }
  };
  CHoriSegLineObject.prototype.isSelected = function(a, g) {
    if (CHoriSegLineObject.__super.isSelected.call(this, a, g) == true) {
      return true;
    }
    var f = new CPoint("frame0.k0");
    f.setPosXY(a, g);
    var d = this.getPoint(0).getPosXY().y;
    var e = this.getPoint(0).getPosXY().x;
    var b = this.getPoint(1).getPosXY().x;
    if (g > d + 4 || g < d - 4) {
      return false;
    }
    if (e > b && (a > e + 4 || a < b - 4)) {
      return false;
    }
    if (e < b && (a < e - 4 || a > b + 4)) {
      return false;
    }
    this.select();
    return true;
  };
  var CHoriStraightLineObject = createClass(CBiToolObject);
  CHoriStraightLineObject.prototype.__construct = function(a) {
    CHoriStraightLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawHoriStraightLinesPlotter(a, this);
  };
  CHoriStraightLineObject.prototype.setDrawPos = function(a, c) {
    for (var b in this.points) {
      this.points[b].setPosXY(a, c);
    }
  };
  CHoriStraightLineObject.prototype.isSelected = function(a, e) {
    if (CHoriStraightLineObject.__super.isSelected.call(this, a, e) == true) {
      return true;
    }
    var d = new CPoint("frame0.k0");
    d.setPosXY(a, e);
    var b = this.getPoint(0).getPosXY().y;
    if (e > b + 4 || e < b - 4) {
      return false;
    }
    this.select();
    return true;
  };
  var CRayLineObject = createClass(CBiToolObject);
  CRayLineObject.prototype.__construct = function(a) {
    CRayLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawRayLinesPlotter(a, this);
  };
  CRayLineObject.prototype.isSelected = function(a, f) {
    if (CRayLineObject.__super.isSelected.call(this, a, f) == true) {
      return true;
    }
    var e = new CPoint("frame0.k0");
    e.setPosXY(a, f);
    var d = this.getPoint(0).getPosXY().x;
    var b = this.getPoint(1).getPosXY().x;
    if (b > d && a < d - 4) {
      return false;
    }
    if (b < d && a > d + 4) {
      return false;
    }
    if (this.calcDistance(this.getPoint(0), this.getPoint(1), e) < 4) {
      this.select();
      return true;
    }
    return false;
  };
  var CSegLineObject = createClass(CBiToolObject);
  CSegLineObject.prototype.__construct = function(a) {
    CSegLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawSegLinesPlotter(a, this);
  };
  CSegLineObject.prototype.isSelected = function(a, d) {
    if (CSegLineObject.__super.isSelected.call(this, a, d) == true) {
      return true;
    }
    var b = new CPoint("frame0.k0");
    b.setPosXY(a, d);
    if (this.isWithRect(this.getPoint(0), this.getPoint(1), b) == false) {
      return false;
    }
    if (this.calcDistance(this.getPoint(0), this.getPoint(1), b) < 4) {
      this.select();
      return true;
    }
    return false;
  };
  var CStraightLineObject = createClass(CBiToolObject);
  CStraightLineObject.prototype.__construct = function(a) {
    CStraightLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawStraightLinesPlotter(a, this);
  };
  CStraightLineObject.prototype.isSelected = function(a, d) {
    if (CStraightLineObject.__super.isSelected.call(this, a, d) == true) {
      return true;
    }
    var b = new CPoint("frame0.k0");
    b.setPosXY(a, d);
    if (this.calcDistance(this.getPoint(0), this.getPoint(1), b) < 4) {
      this.select();
      return true;
    }
    return false;
  };
  var CTriParallelLineObject = createClass(CTriToolObject);
  CTriParallelLineObject.prototype.__construct = function(a) {
    CTriParallelLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawTriParallelLinesPlotter(a, this);
  };
  CTriParallelLineObject.prototype.isSelected = function(p, o) {
    if (CTriParallelLineObject.__super.isSelected.call(this, p, o) == true) {
      return true;
    }
    var q = this.getChartObjects();
    var l = this.getPoint(0).getPosXY().x;
    var k = this.getPoint(0).getPosXY().y;
    var t = this.getPoint(1).getPosXY().x;
    var r = this.getPoint(1).getPosXY().y;
    var b = this.getPoint(2).getPosXY().x;
    var A = this.getPoint(2).getPosXY().y;
    var j = {x: l - t, y: k - r };
    var i = {x: l - b, y: k - A};
    var h = {x: j.x + i.x, y: j.y + i.y};
    var n = l - h.x;
    var m = k - h.y;
    var z = {sx: l, sy: k, ex: b, ey: A};
    var w = {sx: t, sy: r, ex: n, ey: m};
    var f = {x: l - t, y: k - r};
    var d = {x: b - n, y: A - m};
    var g = {x: t - l, y: r - k};
    var e = {x: n - b, y: m - A};
    var u = Math.abs(g.x - l);
    var s = Math.abs(g.y - k);
    var c = Math.abs(e.x - b);
    var a = Math.abs(e.y - A);
    var v = {sx: u, sy: s, ex: c, ey: a};
    if (this.calcGap(z, p, o) > 4 && this.calcGap(w, p, o) > 4 && this.calcGap(v, p, o) > 4) {
      return false;
    }
    this.select();
    return true;
  };
  var CVertiStraightLineObject = createClass(CBiToolObject);
  CVertiStraightLineObject.prototype.__construct = function(a) {
    CVertiStraightLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawVertiStraightLinesPlotter(a, this);
  };
  CVertiStraightLineObject.prototype.setDrawPos = function(a, c) {
    for (var b in this.points) {
      this.points[b].setPosXY(a, c);
    }
  };
  CVertiStraightLineObject.prototype.isSelected = function(a, e) {
    if (CVertiStraightLineObject.__super.isSelected.call(this, a, e) == true) {
      return true;
    }
    var d = new CPoint("frame0.k0");
    d.setPosXY(a, e);
    var b = this.getPoint(0).getPosXY().x;
    if (a > b + 4 || a < b - 4) {
      return false;
    }
    this.select();
    return true;
  };
  var CPriceLineObject = createClass(CSegLineObject);
  CPriceLineObject.prototype.__construct = function(a) {
    CPriceLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawPriceLinesPlotter(a, this);
  };
  CPriceLineObject.prototype.setDrawPos = function(a, c) {
    for (var b in this.points) {
      this.points[b].setPosXY(a, c);
    }
  };
  CPriceLineObject.prototype.isSelected = function(a, h) {
    if (CFibRetraceObject.__super.isSelected.call(this, a, h) == true) {
      return true;
    }
    var g = new CPoint("frame0.k0");
    g.setPosXY(a, h);
    var f = this.getPoint(0).getPosXY().x;
    var e = this.getPoint(0).getPosXY().y;
    var d = this.getPoint(1).getPosXY().x;
    var b = this.getPoint(1).getPosXY().y;
    if (a < f - 4) {
      return false;
    }
    if (h >= e + 4 || h <= e - 4) {
      return false;
    }
    this.select();
    return true;
  };
  var CArrowLineObject = createClass(CSegLineObject);
  CArrowLineObject.prototype.__construct = function(a) {
    CArrowLineObject.__super.__construct.call(this, a);
    this.drawer = new DrawArrowLinesPlotter(a, this);
  };
  var CToolManager = createClass(NamedObject);
  CToolManager.prototype.__construct = function(a) {
    CToolManager.__super.__construct.call(this, a);
    this.selectedObject = -1;
    this.toolObjects = [];
  };
  CToolManager.prototype.getToolObjectCount = function() {
    return this.toolObjects.length;
  };
  CToolManager.prototype.addToolObject = function(a) {
    this.toolObjects.push(a);
  };
  CToolManager.prototype.getToolObject = function(a) {
    if (a < this.toolObjects.length && a >= 0) {
      return this.toolObjects[a];
    }
    return null;
  };
  CToolManager.prototype.getCurrentObject = function() {
    return this.getToolObject(this.getToolObjectCount() - 1);
  };
  CToolManager.prototype.getSelectedObject = function() {
    return this.getToolObject(this.selectedObject);
  };
  CToolManager.prototype.delCurrentObject = function() {
    this.toolObjects.splice(this.getToolObjectCount() - 1, 1);
  };
  CToolManager.prototype.delSelectedObject = function() {
    this.toolObjects.splice(this.selectedObject, 1);
    this.selectedObject = -1;
  };
  CToolManager.prototype.acceptMouseMoveEvent = function(a, e) {
    if (this.selectedObject == -1) {
      var d = this.toolObjects[this.getToolObjectCount() - 1];
      if (d != null && d.getState() != CToolObject.state.AfterDraw) {
        return d.acceptMouseMoveEvent(a, e);
      }
    } else {
      var c = this.toolObjects[this.selectedObject];
      if (c.getState() == CToolObject.state.Draw) {
        return c.acceptMouseMoveEvent(a, e);
      }
      c.unselect();
      this.selectedObject = -1;
    }
    for (var b in this.toolObjects) {
      if (this.toolObjects[b].isSelected(a, e)) {
        this.selectedObject = b;
        return false;
      }
    }
    return false;
  };
  CToolManager.prototype.acceptMouseDownEvent = function(a, d) {
    this.mouseDownMove = false;
    if (this.selectedObject == -1) {
      var c = this.toolObjects[this.getToolObjectCount() - 1];
      if (c != null && c.getState() != CToolObject.state.AfterDraw) {
        return c.acceptMouseDownEvent(a, d);
      }
    } else {
      var b = this.toolObjects[this.selectedObject];
      if (b.getState() != CToolObject.state.BeforeDraw) {
        return b.acceptMouseDownEvent(a, d);
      }
    }
    return false;
  };
  CToolManager.prototype.acceptMouseDownMoveEvent = function(b, f) {
    this.mouseDownMove = true;
    if (this.selectedObject == -1) {
      var e = this.toolObjects[this.getToolObjectCount() - 1];
      if (e != null && e.getState() == CToolObject.state.Draw) {
        return e.acceptMouseDownMoveEvent(b, f);
      }
      return false;
    } else {
      var d = this.toolObjects[this.selectedObject];
      if (d.getState() != CToolObject.state.BeforeDraw) {
        if (d.acceptMouseDownMoveEvent(b, f) == true) {
          var a = this.toolObjects[this.selectedObject].points;
          for (var c = 0; c < a.length; c++) {
            if (a[c].state == CPoint.state.Highlight || a[c].state == CPoint.state.Show) {
              return true;
            }
          }
        }
        return true;
      }
    }
  };
  CToolManager.prototype.acceptMouseUpEvent = function(a, d) {
    if (this.mouseDownMove == true) {
      if (this.selectedObject == -1) {
        var c = this.toolObjects[this.getToolObjectCount() - 1];
        if (c != null && c.getState() == CToolObject.state.Draw) {
          return c.acceptMouseUpEvent(a, d);
        }
        return true;
      } else {
        var b = this.toolObjects[this.selectedObject];
        if (b.getState() != CToolObject.state.BeforeDraw) {
          return b.acceptMouseUpEvent(a, d);
        }
      }
    }
    if (this.selectedObject != -1) {
      return true;
    }
    var c = this.toolObjects[this.getToolObjectCount() - 1];
    if (c != null) {
      if (c.getState() == CToolObject.state.Draw) {
        return true;
      }
      if (!c.isValidMouseXY(a, d)) {
        return false;
      }
      if (c.isSelected(a, d)) {
        return true;
      }
    }
    return false;
  };
  var CToolPlotter = createClass(NamedObject);
  CToolPlotter.prototype.__construct = function(a, d) {
    CToolPlotter.__super.__construct.call(this, a);
    this.toolObject = d;
    var c = ChartManager.getInstance();
    var b = c.getArea("frame0.k0.main");
    if (b == null) {
      this.areaPos = {left: 0, top: 0, right: 0, bottom: 0};
      return;
    }
    this.areaPos = {left: b.getLeft(), top: b.getTop(), right: b.getRight(), bottom: b.getBottom()};
    this.crossPt = {};
    this.normalSize = 4;
    this.selectedSize = 6;
    this.cursorLen = 4;
    this.cursorGapLen = 3;
    this.theme = ChartManager.getInstance().getTheme(this.getFrameName());
  };
  CToolPlotter.prototype.drawCursor = function(a) {
    this.drawCrossCursor(a);
  };
  CToolPlotter.prototype.drawCrossCursor = function(e) {
    e.strokeStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    e.fillStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    var d = this.toolObject.getPoint(0).getPosXY();
    if (d == null) {
      return;
    }
    var c = d.x;
    var f = d.y;
    var b = this.cursorLen;
    var a = this.cursorGapLen;
    e.fillRect(c, f, 1, 1);
    Plotter.drawLine(e, c - b - a, f, c - a, f);
    Plotter.drawLine(e, c + b + a, f, c + a, f);
    Plotter.drawLine(e, c, f - b - a, c, f - a);
    Plotter.drawLine(e, c, f + b + a, c, f + a);
  };
  CToolPlotter.prototype.drawCircle = function(c, b, a) {
    var e = b.x;
    var d = b.y;
    c.beginPath();
    c.arc(e, d, a, 0, 2 * Math.PI, false);
    c.fillStyle = this.theme.getColor(Theme.Color.CircleColorFill);
    c.fill();
    c.stroke();
  };
  CToolPlotter.prototype.drawCtrlPt = function(b) {
    b.strokeStyle = this.theme.getColor(Theme.Color.CircleColorStroke);
    for (var a = 0; a < this.ctrlPtsNum; a++) {
      this.drawCircle(b, this.ctrlPts[1][a], this.normalSize);
    }
  };
  CToolPlotter.prototype.highlightCtrlPt = function(b) {
    b.strokeStyle = this.theme.getColor(Theme.Color.CircleColorStroke);
    for (var a = 0; a < this.ctrlPtsNum; a++) {
      if (this.toolObject.getPoint(a).getState() == CPoint.state.Highlight) {
        this.drawCircle(b, this.ctrlPts[1][a], this.selectedSize);
      }
    }
  };
  CToolPlotter.prototype.drawFibRayLines = function(d, g, c) {
    for (var b = 0; b < this.fiboFansSequence.length; b++) {
      var a = g.y + (100 - this.fiboFansSequence[b]) / 100 * (c.y - g.y);
      var f = {x: g.x, y: g.y};
      var e = {x: c.x, y: a};
      this.drawRayLines(d, f, e);
    }
  };
  CToolPlotter.prototype.drawRayLines = function(c, g, b) {
    this.getAreaPos();
    var e = {x: g.x, y: g.y};
    var d = {x: b.x, y: b.y};
    var f = getRectCrossPt(this.areaPos, e, d);
    var a;
    if (b.x == g.x) {
      if (b.y == g.y) {
        a = b;
      } else {
        a = b.y > g.y ? {x: f[1].x, y: f[1].y} : {x: f[0].x, y: f[0].y};
      }
    } else {
      a = b.x > g.x ? {x: f[1].x, y: f[1].y} : {x: f[0].x, y: f[0].y};
    }
    Plotter.drawLine(c, g.x, g.y, a.x, a.y);
  };
  CToolPlotter.prototype.lenBetweenPts = function(b, a) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };
  CToolPlotter.prototype.getCtrlPts = function() {
    for (var a = 0; a < this.ctrlPtsNum; a++) {
      this.ctrlPts[0][a] = this.toolObject.getPoint(a);
    }
  };
  CToolPlotter.prototype.updateCtrlPtPos = function() {
    for (var a = 0; a < this.ctrlPtsNum; a++) {
      this.ctrlPts[1][a] = this.ctrlPts[0][a].getPosXY();
    }
  };
  CToolPlotter.prototype.getAreaPos = function() {
    var b = ChartManager.getInstance();
    var a = b.getArea("frame0.k0.main");
    if (a == null) {
      this.areaPos = {left: 0, top: 0, right: 0, bottom: 0};
      return;
    }
    this.areaPos = {left: Math.floor(a.getLeft()), top: Math.floor(a.getTop()), right: Math.floor(a.getRight()), bottom: Math.floor(a.getBottom())};
  };
  CToolPlotter.prototype.updateDraw = function(a) {
    a.strokeStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    this.draw(a);
    this.drawCtrlPt(a);
  };
  CToolPlotter.prototype.finishDraw = function(a) {
    a.strokeStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    this.draw(a);
  };
  CToolPlotter.prototype.highlight = function(a) {
    a.strokeStyle = this.theme.getColor(Theme.Color.LineColorSelected);
    this.draw(a);
    this.drawCtrlPt(a);
    this.highlightCtrlPt(a);
  };
  var DrawStraightLinesPlotter = createClass(CToolPlotter);
  DrawStraightLinesPlotter.prototype.__construct = function(a, b) {
    DrawStraightLinesPlotter.__super.__construct.call(this, a, b);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawStraightLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
      Plotter.drawLine(a, this.areaPos.left, this.startPoint.y, this.areaPos.right, this.startPoint.y);
    } else {
      this.crossPt = getRectCrossPt(this.areaPos, this.startPoint, this.endPoint);
      Plotter.drawLine(a, this.crossPt[0].x, this.crossPt[0].y, this.crossPt[1].x, this.crossPt[1].y);
    }
  };
  var DrawSegLinesPlotter = createClass(CToolPlotter);
  DrawSegLinesPlotter.prototype.__construct = function(a, b) {
    DrawSegLinesPlotter.__super.__construct.call(this, a, b);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawSegLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
      this.endPoint.x += 1;
    }
    Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
  };
  var DrawRayLinesPlotter = createClass(CToolPlotter);
  DrawRayLinesPlotter.prototype.__construct = function(a, b) {
    DrawRayLinesPlotter.__super.__construct.call(this, a);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawRayLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
      this.endPoint.x += 1;
    }
    this.drawRayLines(a, this.startPoint, this.endPoint);
  };
  var DrawArrowLinesPlotter = createClass(CToolPlotter);
  DrawArrowLinesPlotter.prototype.__construct = function(a, b) {
    DrawArrowLinesPlotter.__super.__construct.call(this, a, b);
    this.toolObject = b;
    this.arrowSizeRatio = 0.03;
    this.arrowSize = 4;
    this.crossPt = {x: -1, y: -1};
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawArrowLinesPlotter.prototype.drawArrow = function(c, b, f) {
    var d = this.lenBetweenPts(b, f);
    var i = [f.x - b.x, f.y - b.y];
    this.crossPt.x = b.x + (1 - this.arrowSize / d) * i[0];
    this.crossPt.y = b.y + (1 - this.arrowSize / d) * i[1];
    var h = [-i[1], i[0]];
    var a = {x: h[0], y: h[1]};
    var g = {x: 0, y: 0};
    h[0] = this.arrowSize * a.x / this.lenBetweenPts(a, g);
    h[1] = this.arrowSize * a.y / this.lenBetweenPts(a, g);
    var e = [this.crossPt.x + h[0], this.crossPt.y + h[1]];
    Plotter.drawLine(c, f.x, f.y, e[0], e[1]);
    e = [this.crossPt.x - h[0], this.crossPt.y - h[1]];
    Plotter.drawLine(c, f.x, f.y, e[0], e[1]);
  };
  DrawArrowLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
      this.endPoint.x += 1;
    }
    Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
    this.drawArrow(a, this.startPoint, this.endPoint);
  };
  var DrawHoriStraightLinesPlotter = createClass(CToolPlotter);
  DrawHoriStraightLinesPlotter.prototype.__construct = function(a, b) {
    DrawHoriStraightLinesPlotter.__super.__construct.call(this, a);
    this.toolObject = b;
    this.ctrlPtsNum = 1;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawHoriStraightLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    Plotter.drawLine(a, this.areaPos.left, this.startPoint.y, this.areaPos.right, this.startPoint.y);
  };
  var DrawHoriRayLinesPlotter = createClass(CToolPlotter);
  DrawHoriRayLinesPlotter.prototype.__construct = function(a, b) {
    DrawHoriRayLinesPlotter.__super.__construct.call(this, a);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawHoriRayLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x) {
      Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.areaPos.right, this.startPoint.y);
    } else {
      var b = {x: this.endPoint.x, y: this.startPoint.y};
      this.drawRayLines(a, this.startPoint, b);
    }
  };
  var DrawHoriSegLinesPlotter = createClass(CToolPlotter);
  DrawHoriSegLinesPlotter.prototype.__construct = function(a, b) {
    DrawHoriSegLinesPlotter.__super.__construct.call(this, a, b);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawHoriSegLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    this.endPoint.y = this.startPoint.y;
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
      Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.endPoint.x + 1, this.startPoint.y);
    } else {
      Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.endPoint.x, this.startPoint.y);
    }
  };
  var DrawVertiStraightLinesPlotter = createClass(CToolPlotter);
  DrawVertiStraightLinesPlotter.prototype.__construct = function(a, b) {
    DrawVertiStraightLinesPlotter.__super.__construct.call(this, a);
    this.toolObject = b;
    this.ctrlPtsNum = 1;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawVertiStraightLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    Plotter.drawLine(a, this.startPoint.x, this.areaPos.top, this.startPoint.x, this.areaPos.bottom);
  };
  var DrawPriceLinesPlotter = createClass(CToolPlotter);
  DrawPriceLinesPlotter.prototype.__construct = function(a, b) {
    DrawPriceLinesPlotter.__super.__construct.call(this, a);
    this.toolObject = b;
    this.ctrlPtsNum = 1;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawPriceLinesPlotter.prototype.draw = function(a) {
    a.font = fontFamily;
    a.textAlign = "left";
    a.fillStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    var b = this.ctrlPts[0][0].getPosIV().v;
    Plotter.drawLine(a, this.startPoint.x, this.startPoint.y, this.areaPos.right, this.startPoint.y);
    a.fillText(b.toFixed(2), this.startPoint.x + 2, this.startPoint.y - 15);
  };
  var ParallelLinesPlotter = createClass(CToolPlotter);
  ParallelLinesPlotter.prototype.__construct = function(a, b) {
    ParallelLinesPlotter.__super.__construct.call(this, a);
    this.toolObject = b;
  };
  ParallelLinesPlotter.prototype.getParaPt = function() {
    var b = [];
    b[0] = this.endPoint.x - this.startPoint.x;
    b[1] = this.endPoint.y - this.startPoint.y;
    var a = [];
    a[0] = this.paraStartPoint.x - this.startPoint.x;
    a[1] = this.paraStartPoint.y - this.startPoint.y;
    this.paraEndPoint = {x: -1, y: -1};
    this.paraEndPoint.x = b[0] + a[0] + this.startPoint.x;
    this.paraEndPoint.y = b[1] + a[1] + this.startPoint.y;
  };
  var DrawBiParallelLinesPlotter = createClass(ParallelLinesPlotter);
  DrawBiParallelLinesPlotter.prototype.__construct = function(a, b) {
    DrawBiParallelLinesPlotter.__super.__construct.call(this, a, b);
    this.toolObject = b;
    this.ctrlPtsNum = 3;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawBiParallelLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.paraStartPoint = this.ctrlPts[1][1];
    this.endPoint = this.ctrlPts[1][2];
    this.getParaPt();
    this.getAreaPos();
    this.crossPt0 = getRectCrossPt(this.areaPos, this.startPoint, this.endPoint);
    Plotter.drawLine(a, this.crossPt0[0].x, this.crossPt0[0].y, this.crossPt0[1].x, this.crossPt0[1].y);
    this.crossPt1 = getRectCrossPt(this.areaPos, this.paraStartPoint, this.paraEndPoint);
    Plotter.drawLine(a, this.crossPt1[0].x, this.crossPt1[0].y, this.crossPt1[1].x, this.crossPt1[1].y);
  };
  var DrawBiParallelRayLinesPlotter = createClass(ParallelLinesPlotter);
  DrawBiParallelRayLinesPlotter.prototype.__construct = function(a, b) {
    DrawBiParallelRayLinesPlotter.__super.__construct.call(this, a, b);
    this.toolObject = b;
    this.ctrlPtsNum = 3;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawBiParallelRayLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.paraStartPoint = this.ctrlPts[1][1];
    this.endPoint = this.ctrlPts[1][2];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
      this.endPoint.x += 1;
    }
    this.getParaPt();
    this.drawRayLines(a, this.startPoint, this.endPoint);
    this.drawRayLines(a, this.paraStartPoint, this.paraEndPoint);
  };
  var DrawTriParallelLinesPlotter = createClass(ParallelLinesPlotter);
  DrawTriParallelLinesPlotter.prototype.__construct = function(a, b) {
    DrawTriParallelLinesPlotter.__super.__construct.call(this, a, b);
    this.toolObject = b;
    this.ctrlPtsNum = 3;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawTriParallelLinesPlotter.prototype.draw = function(c) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.paraStartPoint = this.ctrlPts[1][1];
    this.endPoint = this.ctrlPts[1][2];
    var b = [];
    b[0] = this.endPoint.x - this.startPoint.x;
    b[1] = this.endPoint.y - this.startPoint.y;
    var a = [];
    a[0] = this.paraStartPoint.x - this.startPoint.x;
    a[1] = this.paraStartPoint.y - this.startPoint.y;
    this.para1EndPoint = {x: -1, y: -1};
    this.para2EndPoint = {x: -1, y: -1};
    this.para2StartPoint = {x: -1, y: -1};
    this.para1EndPoint.x = b[0] + a[0] + this.startPoint.x;
    this.para1EndPoint.y = b[1] + a[1] + this.startPoint.y;
    this.para2StartPoint.x = this.startPoint.x - a[0];
    this.para2StartPoint.y = this.startPoint.y - a[1];
    this.para2EndPoint.x = this.endPoint.x - a[0];
    this.para2EndPoint.y = this.endPoint.y - a[1];
    this.getAreaPos();
    this.crossPt0 = getRectCrossPt(this.areaPos, this.startPoint, this.endPoint);
    Plotter.drawLine(c, this.crossPt0[0].x, this.crossPt0[0].y, this.crossPt0[1].x, this.crossPt0[1].y);
    this.crossPt1 = getRectCrossPt(this.areaPos, this.paraStartPoint, this.para1EndPoint);
    Plotter.drawLine(c, this.crossPt1[0].x, this.crossPt1[0].y, this.crossPt1[1].x, this.crossPt1[1].y);
    this.crossPt2 = getRectCrossPt(this.areaPos, this.para2StartPoint, this.para2EndPoint);
    Plotter.drawLine(c, this.crossPt2[0].x, this.crossPt2[0].y, this.crossPt2[1].x, this.crossPt2[1].y);
  };
  var BandLinesPlotter = createClass(CToolPlotter);
  BandLinesPlotter.prototype.__construct = function(a, b) {
    BandLinesPlotter.__super.__construct.call(this, a);
    this.toolObject = b;
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  BandLinesPlotter.prototype.drawLinesAndInfo = function(d, f, c) {
    d.font = fontFamily;
    d.textAlign = "left";
    d.fillStyle = this.theme.getColor(Theme.Color.LineColorNormal);
    var g;
    if (this.toolObject.state == CToolObject.state.Draw) {
      this.startPtValue = this.toolObject.getPoint(0).getPosIV().v;
      this.endPtValue = this.toolObject.getPoint(1).getPosIV().v;
    }
    this.getAreaPos();
    for (var b = 0; b < this.fiboSequence.length; b++) {
      var a = f.y + (100 - this.fiboSequence[b]) / 100 * (c.y - f.y);
      if (a > this.areaPos.bottom) {
        continue;
      }
      var e = this.startPtValue + (100 - this.fiboSequence[b]) / 100 * (this.endPtValue - this.startPtValue);
      Plotter.drawLine(d, this.areaPos.left, a, this.areaPos.right, a);
      g = this.fiboSequence[b].toFixed(1) + "% " + e.toFixed(1);
      d.fillText(g, this.areaPos.left + 2, a - 15);
    }
  };
  BandLinesPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    this.drawLinesAndInfo(a, this.startPoint, this.endPoint);
  };
  var DrawFibRetracePlotter = createClass(BandLinesPlotter);
  DrawFibRetracePlotter.prototype.__construct = function(a, b) {
    DrawFibRetracePlotter.__super.__construct.call(this, a, b);
    this.toolObject = b;
    this.fiboSequence = [100, 78.6, 61.8, 50, 38.2, 23.6, 0];
  };
  var DrawBandLinesPlotter = createClass(BandLinesPlotter);
  DrawBandLinesPlotter.prototype.__construct = function(a, b) {
    DrawBandLinesPlotter.__super.__construct.call(this, a, b);
    this.toolObject = b;
    this.fiboSequence = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
  };
  var DrawFibFansPlotter = createClass(CToolPlotter);
  DrawFibFansPlotter.prototype.__construct = function(a, b) {
    DrawFibFansPlotter.__super.__construct.call(this, a);
    this.toolObject = b;
    this.fiboFansSequence = [0, 38.2, 50, 61.8];
    this.ctrlPtsNum = 2;
    this.ctrlPts = new Array(new Array(this.ctrlPtsNum), new Array(2));
    this.getCtrlPts();
  };
  DrawFibFansPlotter.prototype.drawLinesAndInfo = function(b, c, a) {
    this.drawFibRayLines(b, c, a);
  };
  DrawFibFansPlotter.prototype.draw = function(a) {
    this.updateCtrlPtPos();
    this.getAreaPos();
    this.startPoint = this.ctrlPts[1][0];
    this.endPoint = this.ctrlPts[1][1];
    if (this.startPoint.x == this.endPoint.x && this.startPoint.y == this.endPoint.y) {
      this.endPoint.x += 1;
    }
    this.drawLinesAndInfo(a, this.startPoint, this.endPoint);
  };
  var CDynamicLinePlotter = createClass(NamedObject);
  CDynamicLinePlotter.prototype.__construct = function(a) {
    CDynamicLinePlotter.__super.__construct.call(this, a);
    this.flag = true;
    this.context = ChartManager.getInstance()._overlayContext;
  };
  CDynamicLinePlotter.prototype.getAreaPos = function() {
    var b = ChartManager.getInstance();
    var a = b.getArea("frame0.k0.main");
    if (a == null) {
      this.areaPos = {left: 0, top: 0, right: 0, bottom: 0};
      return;
    }
    this.areaPos = {left: Math.floor(a.getLeft()), top: Math.floor(a.getTop()), right: Math.floor(a.getRight()), bottom: Math.floor(a.getBottom())};
  };
  CDynamicLinePlotter.prototype.Draw = function(b) {
    this.getAreaPos();
    var g = ChartManager.getInstance();
    var h = g.getDataSource(this.getDataSourceName());
    if (h == null || !isInstance(h, MainDataSource)) {
      return;
    }
    this.context.save();
    this.context.rect(this.areaPos.left, this.areaPos.top, this.areaPos.right - this.areaPos.left, this.areaPos.bottom - this.areaPos.top);
    this.context.clip();
    var c = h.getToolObjectCount();
    for (var a = 0; a < c; a++) {
      var f = h.getToolObject(a);
      var e = f.getState();
      switch (e) {
        case CToolObject.state.BeforeDraw:
          f.getPlotter().theme = ChartManager.getInstance().getTheme(this.getFrameName());
          f.getPlotter().drawCursor(this.context);
          break;
        case CToolObject.state.Draw:
          f.getPlotter().theme = ChartManager.getInstance().getTheme(this.getFrameName());
          f.getPlotter().updateDraw(this.context);
          break;
        case CToolObject.state.AfterDraw:
          f.getPlotter().theme = ChartManager.getInstance().getTheme(this.getFrameName());
          f.getPlotter().finishDraw(this.context);
          break;
        default:
          break;
      }
    }
    var d = h.getSelectToolObjcet();
    if (d != null && d != CToolObject.state.Draw) {
      d.getPlotter().highlight(this.context);
    }
    this.context.restore();
    return;
  };

  function mouseWheel(e) {
    var orgEvent = e || window.event
    orgEvent.preventDefault();
    orgEvent.stopPropagation();
    var delta = 0
    var deltaX = 0
    var deltaY = 0
    // Old school scrollwheel delta
    if ( 'detail' in orgEvent ) { deltaY = orgEvent.detail * -1; }
    if ( 'wheelDelta' in orgEvent ) { deltaY = orgEvent.wheelDelta; }
    if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY; }
    if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }
    if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
      deltaX = deltaY * -1;
      deltaY = 0;
    }

    // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
    delta = deltaY === 0 ? deltaX : deltaY;

    // New school wheel delta (wheel event)
    if ( 'deltaY' in orgEvent ) {
      deltaY = orgEvent.deltaY * -1;
      delta  = deltaY;
    }
    if ( 'deltaX' in orgEvent ) {
      deltaX = orgEvent.deltaX;
      if ( deltaY === 0 ) { delta  = deltaX * -1; }
    }

    // No change actually happened, no reason to go any further
    if ( deltaY === 0 && deltaX === 0 ) { return; }
    ChartManager.getInstance().scale(delta > 0 ? 1 : -1);
    ChartManager.getInstance().redraw("All", true);
    return false;
  }

  function getRectCrossPt(h, c, f) {
    var b;
    var i = {x: -1, y: -1};
    var a = {x: -1, y: -1};
    var g = f.x - c.x;
    var d = f.y - c.y;
    if (Math.abs(g) < 2) {
      i = {x: c.x, y: h.top};
      a = {x: f.x, y: h.bottom};
      b = [i, a];
      return b;
    }
    var e = d / g;
    a.x = h.right;
    a.y = c.y + (h.right - c.x) * e;
    i.x = h.left;
    i.y = c.y + (h.left - c.x) * e;
    b = [i, a];
    return b;
  }

  function setHttpRequestParam(b, c, a, e) {
    var d = `needTickers=1&symbol=${b}&type=${c}`;
    if (a != null) {
      d += `&size=${a}`;
    } else {
      d += `&since=${e}`;
    }
    return d;
  }

  function refreshTemplate() {
    GLOBAL_VAR.chartMgr = DefaultTemplate.loadTemplate("frame0.k0", "KOALL");
    ChartManager.getInstance().redraw("All", true);
  }

  ChartManager.prototype.updateKlienDatas = function(a) {
    GLOBAL_VAR.chartMgr.updateData("frame0.k0", a);
    this.redraw("All", false)
  };
  ChartManager.prototype.setMarketFrom = function(a) {
    Template.displayVolume = false;
    refreshTemplate();
    readCookie();
    ChartManager.getInstance().getChart().setMarketFrom(a);
  };
  ChartManager.prototype.on_size = function() {
    containerWidth = container.clientWidth * GLOBAL_VAR.ratio;
    containerHeight = container.clientHeight * GLOBAL_VAR.ratio;
    chart_mainCanvas.width = chart_overlayCanvas.width = containerWidth;
    chart_mainCanvas.height = chart_overlayCanvas.height = containerHeight;
    this.redraw("All", true);
  };
  ChartManager.prototype.getIndics = function(){
    var f = {};
    var k = new Array("MA", "EMA", "VOLUME", "MACD", "KDJ", "StochRSI", "RSI", "DMI", "OBV", "BOLL", "DMA", "TRIX", "BRAR", "VR", "EMV", "WR", "ROC", "MTM", "PSY");
    for (var g = 0; g < k.length; g++) {
      var m = ChartManager.getInstance().createIndicatorAndRange("", k[g], true);
      if (m == null) {
        continue;
      }
      f[k[g]] = [];
      var b = m.indic.getParameters();
      for (var e = 0; e < b.length; e++) {
        f[k[g]].push(b[e]);
      }
    }
    return f;
  }
  //设置语种
  ChartManager.prototype.switch_language = function(b) {
    var a = b.replace(/-/, '_')
    ChartManager.getInstance().setLanguage(b)
    ChartManager.getInstance().getChart().setTitle()
    var a = ChartSettings.get()
    a.language = b
    ChartSettings.save()
  }
  //切换主题(Dark|Light)
  ChartManager.prototype.switch_theme = function(theme) {
    ChartManager.getInstance().setThemeName("frame0", theme);
    var d = ChartSettings.get();
    d.theme = theme;
    ChartSettings.save();
    ChartManager.getInstance().redraw();
  };
  //开启技术指标
  ChartManager.prototype.open_indic = function(a){
    if (a == "on") {
      var b = ChartSettings.get();
      b.charts.indicsStatus = "open";
      ChartSettings.save();
      var c = b.charts.indics[1];
      if (Template.displayVolume == false) {
        ChartManager.getInstance().getChart().setIndicator(2, c);
      } else {
        ChartManager.getInstance().getChart().setIndicator(2, c);
      }
    } else {
      if (a == "off") {
        ChartManager.getInstance().getChart().setIndicator(2, "NONE");
        var b = ChartSettings.get();
        b.charts.indicsStatus = "close";
        ChartSettings.save();
      }
    }
  }
  //切换技术指标
  ChartManager.prototype.switch_indic = function(b){
    var c = ChartSettings.get();
    c.charts.indics[1] = b;
    ChartSettings.save();
    if (Template.displayVolume == false) {
      ChartManager.getInstance().getChart().setIndicator(1, b);
    } else {
      ChartManager.getInstance().getChart().setIndicator(2, b);
    }
  }
  ChartManager.prototype.calcPeriodWeight = function(d){
    var a = d;
    if (d != "line") {
      a = GLOBAL_VAR.periodMap[GLOBAL_VAR.tagMapPeriod[d]];
    }
    var c = ChartSettings.get().charts.period_weight;
    for (var b in c) {
      if (c[b] > c[a]) {
        c[b] -= 1;
      }
    }
    c[a] = 8;
    ChartSettings.save();
  }
  //切换周期
  ChartManager.prototype.switch_period = function(a){
    this.showCursor();
    this.calcPeriodWeight(a);
    var b = ChartSettings.get();
    b.charts.period = a;
    ChartSettings.save();
    if (a == "line") {
      this.getChart().strIsLine = true;
      this.setChartStyle("frame0.k0", "Line");
      this.getChart().setCurrentPeriod("01m");
      return;
    }
    this.getChart().strIsLine = false;
    var c = GLOBAL_VAR.tagMapPeriod[a];
    var b = ChartSettings.get();
    b.charts.period = a;
    ChartSettings.save();
    this.setChartStyle("frame0.k0", ChartSettings.get().charts.chartStyle);
    this.getChart().setCurrentPeriod(c);
  }
  //切换market
  ChartManager.prototype.switch_market_selected = function(b){
    this.getChart()._market_from = b;
    var a = ChartSettings.get();
    a.charts.market_from = b;
    ChartSettings.save();
  }
  ChartManager.prototype.switch_market = function(b){
    var chartManager = ChartManager.getInstance()
    chartManager.switch_market_selected(b);
    var a = ChartSettings.get();
    if (a.charts.period == "line") {
      chartManager.getChart().strIsLine = true;
      chartManager.setChartStyle("frame0.k0", "Line");
    } else {
      chartManager.getChart().strIsLine = false;
      chartManager.setChartStyle("frame0.k0", ChartSettings.get().charts.chartStyle);
    }
    chartManager.getChart().setMarketFrom(b);
  }
  ChartManager.prototype.switch_tools = function(a) {
    if (a == "on") {
    } else {
      if (a == "off") {
        ChartManager.getInstance().setRunningMode(ChartManager.getInstance()._beforeDrawingTool);
        ChartManager.getInstance().redraw("All", true);
      }
    }
  }
  //画图工具
  ChartManager.prototype.drawingTool = function(b) {
    GLOBAL_VAR.chartMgr.setRunningMode(ChartManager.DrawingTool[b]);
  }
  //清除工具线
  ChartManager.prototype.clearCanvasToolsLine = function(){
    var d = this.getDataSource("frame0.k0");
    var b = d.getToolObjectCount();
    for (var c = 0; c < b; c++) {
      d.delToolObject();
    }
    this.redraw("OverlayCanvas", false);
  }
  ChartManager.prototype.getCurrentParams = function(){
    var c = ChartSettings.get();
    return {
      indicsStatus: c.charts.indicsStatus,
      indics: c.charts.indics[1],
      period: c.charts.period,
      theme: c.theme,
      mIndic: c.charts.mIndic,
      chartStyle: c.charts.chartStyle
    }
  }
  //切换主指标
  ChartManager.prototype.switch_main_indicator = function(b){
    var c = ChartSettings.get();
    c.charts.mIndic = b;
    ChartSettings.save();
    var d = ChartManager.getInstance();
    if (!d.setMainIndicator("frame0.k0", b)) {
      d.removeMainIndicator("frame0.k0");
    }
    d.redraw();
  }
  //主图样式
  ChartManager.prototype.switch_chartStyle = function(d) {
    var b = ChartSettings.get();
    b.charts.chartStyle = d;
    ChartSettings.save();
    var c = ChartManager.getInstance();
    c.setChartStyle("frame0.k0", d);
    c.redraw();
  }
  ChartManager.prototype.getChartSettings = function () {
    var b = ChartSettings.get();
    return b;
  }

  function readCookie() {
    var chartManager = ChartManager.getInstance()
    ChartSettings.get();
    ChartSettings.save();
    var b = ChartSettings.get();
    chartManager.setChartStyle("frame0.k0", b.charts.chartStyle);
    var e = b.charts.market_from;
    if (!GLOBAL_VAR.init) {
      e = klineType;
      GLOBAL_VAR.init = true;
    }
    GLOBAL_VAR.market_from = klineType;
    chartManager.switch_market_selected(e);
    var d = b.charts.period;
    chartManager.switch_period(d);
    if (b.charts.indicsStatus == "close") {
      chartManager.open_indic("off");
    } else {
      if (b.charts.indicsStatus == "open") {
        chartManager.open_indic("on");
      }
    }
    chartManager.getChart().setMainIndicator(b.charts.mIndic);
    chartManager.setThemeName("frame0", b.theme);
    chartManager.switch_tools("off");
    chartManager.switch_theme(b.theme);
    chartManager.switch_language(b.language || "zh-cn");
  }

  var RequestData = function(a) {
  };

  function KLineMouseEvent(){
    if ('ontouchstart' in document) {
			function getTouchDist(e) {
				var x1 = 0, y1 = 0, x2 = 0, y2 = 0,
					x3 = 0, y3 = 0, result = {};
				x1 = e.touches[0].pageX;
				x2 = e.touches[1].pageX;
				y1 = e.touches[0].pageY;
				y2 = e.touches[1].pageY;
				if (!x1 || !x2) return;

				if (x1 <= x2) {
					x3 = (x2 - x1) / 2 + x1;
				} else {
					x3 = (x1 - x2) / 2 + x2;
				}
				if (y1 <= y2) {
					y3 = (y2 - y1) / 2 + y1;
				} else {
					y3 = (y1 - y2) / 2 + y2;
				}

				result = {
					dist: Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))),
					x: Math.round(x3),
					y: Math.round(y3)
				};

				return result;
			}
			var startFingerDist, startFingerX, startFingerY, prevRatio = 1,
				touchTimeId = null;
      chart_overlayCanvas.addEventListener("touchstart", function (d) {
				d.preventDefault();
        var cm = ChartManager.getInstance();
				if (d.touches.length === 2) {
					var touchPos = getTouchDist(d);
					startFingerDist = touchPos.dist;
					cm.onMouseUp("frame0", touchPos.x, touchPos.y);
					cm.redraw("All")
					cm.onMouseMove("frame0", touchPos.x, touchPos.y, false);
					cm.redraw("OverlayCanvas");
					return;
				}
				var c = d.target.getBoundingClientRect();
				var b = d.touches[0].clientX - c.left;
				var f = d.touches[0].clientY - c.top;
				touchTimeId = setTimeout(function () {
					cm.onMouseDown("frame0", b, f);
				}, 10);
				cm.onMouseMove("frame0", b, f, true);
				cm.redraw("All", false);
			});
			chart_overlayCanvas.addEventListener("touchmove", function (f) {
				f.preventDefault();
				if (f.touches.length === 2) {
					var nowFingerDist = getTouchDist(f).dist, //获得当前长度
						ratio = nowFingerDist / startFingerDist; //计算缩放比
					if (ratio - prevRatio === 0) {
						prevRatio = 1;
						return;
          }
					ChartManager.getInstance().scale(ratio - prevRatio > 0 ? 1 : -1);
					ChartManager.getInstance().redraw("All", true);
					prevRatio = ratio;
					return;
				}
				var c = f.target.getBoundingClientRect();
				var b = f.touches[0].clientX - c.left;
				var g = f.touches[0].clientY - c.top;
				var d = ChartManager.getInstance();
				d.onMouseMove("frame0", b, g, true);
				d.redraw("All", false);
			});
			chart_overlayCanvas.addEventListener("touchend", function (f) {
				var c = f.target.getBoundingClientRect();
				var b = f.clientX - c.left;
				var g = f.clientY - c.top;
				var d = ChartManager.getInstance();
				d.onMouseUp("frame0", b, g);
				d.redraw("All");
				clearTimeout(touchTimeId);
			});
			return;
		}
    chart_overlayCanvas.addEventListener('contextmenu', function(b) {
      b.cancelBubble = true;
      b.returnValue = false;
      b.preventDefault();
      b.stopPropagation();
      return false;
    }, false)
    chart_overlayCanvas.addEventListener('mousemove', function(f) {
      var c = f.target.getBoundingClientRect();
      var b = f.clientX - c.left;
      var g = f.clientY - c.top;
      var d = ChartManager.getInstance();
      if (GLOBAL_VAR.button_down == true) {
        d.onMouseMove("frame0", b, g, true);
        d.redraw("All", false);
      } else {
        d.onMouseMove("frame0", b, g, false);
        d.redraw("OverlayCanvas");
      }
    }, false)
    chart_overlayCanvas.addEventListener('mouseleave', function(f) {
      var c = f.target.getBoundingClientRect();
      var b = f.clientX - c.left;
      var g = f.clientY - c.top;
      var d = ChartManager.getInstance();
      d.onMouseLeave("frame0", b, g, false);
      d.redraw("OverlayCanvas");
    }, false)
    chart_overlayCanvas.addEventListener('mouseup', function(f) {
      if (f.which != 1) {
        return;
      }
      GLOBAL_VAR.button_down = false;
      var c = f.target.getBoundingClientRect();
      var b = f.clientX - c.left;
      var g = f.clientY - c.top;
      var d = ChartManager.getInstance();
      d.onMouseUp("frame0", b, g);
      d.redraw("All");
    }, false)
    chart_overlayCanvas.addEventListener('mousedown', function(d) {
      var chartManager = ChartManager.getInstance()
      if (d.which != 1) {
        chartManager.deleteToolObject();
        chartManager.redraw("OverlayCanvas", false);
        return;
      }
      GLOBAL_VAR.button_down = true;
      var c = d.target.getBoundingClientRect();
      var b = d.clientX - c.left;
      var f = d.clientY - c.top;
      chartManager.onMouseDown("frame0", b, f);
    }, false)
  };

  (function(){
    ChartManager.getInstance().bindCanvas("main", chart_mainCanvas);
    ChartManager.getInstance().bindCanvas("overlay", chart_overlayCanvas);
    KLineMouseEvent()
    refreshTemplate();
    readCookie();
  })();
  return ChartManager.getInstance();
});
