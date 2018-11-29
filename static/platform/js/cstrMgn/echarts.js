/** 构造函数 **/
function Draw (elem, name, data, title) {
 this.chart = echarts.init(document.getElementById(elem));
 this.name = name;
 this.data = data;
 this.title = title;
}

/** 饼图 **/

Draw.prototype.pie = function() {
 var _this = this;
 var colors = [['#4876FF'], ['#CD2626'], ['#8968CD'], ['#00b7ee']]
 var option = {
  tooltip : {
    trigger: 'item',
    formatter: "{a} <br/>{b} : {c} ({d}%)"
},
  title: {
    text: _this.name,
    x: 'center',
    y: 'center',
    top: '40%',
    textStyle: {
     fontSize: 14,
    },
 },
  series: [
    {
       name:_this.name,
       type:'pie',
       radius: ['50%', '70%'],
       data: _this.data,
       color: colors,
       labelLine:{
           normal: {
               length:7,
               length2:3      
           }
       }
     }
   ]
 }
 this.chart.setOption(option);
}

/** 柱状图 **/

Draw.prototype.bar1 = function() {
  var _this = this;
  var series = [];
  var lengend = [];
  var colors = [['#8bc24a'], ['#f6b332'], ['#1e95d4'], ['#e6534c']]
  this.data.forEach(function(item, index) {
    lengend.push(item.name)
   series.push({
    name: item.name,
    type: 'bar',
    barWidth: '35%',
    barMinHeight: '100%',
    data: item.data,
    color: colors[(index + 1) % 4]
   })
  })
  var option = {
   tooltip : {
    trigger: 'axis',
    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
 },
 legend: {
  show: true,
  left: '40%',
  bottom: 0,
  data: lengend
 },
   yAxis:  {
    type: 'value'
   },
   xAxis: {
      type: 'category',
      data: _this.name
   },
   series: series
  }
   this.chart.setOption(option);
 }

/** 柱状图 **/

Draw.prototype.bar2 = function() {
 var _this = this;
 var series = [];
 var lengend = [];
 var colors = [['#8bc24a'], ['#f6b332'], ['#1e95d4'], ['#e6534c']]
 this.data.forEach(function(item, index) {
  lengend.push(item.name)
  series.push({
   name: item.name,
   type: 'bar',
   stack: '总量',
   barWidth: '15%',
   barMinHeight: '100%',
   data: item.data,
   color: colors[(index + 1) % 4]
  })
 })
 var option = {
  legend: {
    show: true,
    data:lengend,
    left: '40%',
    bottom: 0,
  },
  yAxis:  {
   type: 'value'
  },
  xAxis: {
     type: 'category',
     data: _this.name
  },
  series: series
 }
  this.chart.setOption(option);
}
/** 柱状图 **/

Draw.prototype.bar3 = function() {
  var _this = this;
  var series = [];
  var lengend = [];
  var colors = [['#8bc24a'], ['#f6b332'], ['#1e95d4'], ['#e6534c']]
  this.data.forEach(function(item, index) {
   lengend.push(item.name)
   series.push({
    name: item.name,
    type: 'bar',
    stack: '总量',
    barWidth: '15%',
    barMinHeight: '100%',
    data: item.data,
    color: colors[(index + 1) % 4]
   })
  })
  var option = {
   legend: {
     show: true,
     data:lengend,
   },
   yAxis:  {
    type: 'value'
   },
   xAxis: {
      type: 'category',
      data: _this.name
   },
   series: series
  }
   this.chart.setOption(option);
 }
 
 
