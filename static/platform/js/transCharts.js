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
 var total = 0;
 this.data.forEach(function(item) {
  if (item.show) {
    item.itemStyle = {
     normal: {
       color: '#1e95d4'
     }
   }
   total = item.value + '.00%'
  } else {
    item.itemStyle = {
     normal: {
       color: '#cbcbcb'
     }
   }
  }
 })
 var option = {
  title: {
    text: _this.name,
    subtext: total,
    x: 'center',
    y: 'center',
    top: 50,
    textStyle: {
     fontSize: 14,
    },
    subtextStyle: {
     fontSize: 16,
     color: '#1e95d4'
    }
 },
  series: [
    {
       name:_this.name,
       type:'pie',
       radius: ['70%', '85%'],
       avoidLabelOverlap: false,
      //  label: {
      //     normal: {
      //         show: true,
      //         position: 'center',
      //         formatter: function() {
      //          return _this.name + '\r\n' + _this.data[0].value + '.00%'
      //         }
      //     }
      // },
       labelLine: {
           normal: {
               show: false
           }
       },
       data: _this.data
     }
   ]
 }
 this.chart.setOption(option);
}

/** 柱状图 **/

Draw.prototype.bar = function() {
 var _this = this;
 var series = [];
 var lengend = [];
  //F3B32F 5A9AEC E35549 88C249
 var colors = [['#F3B32F'], ['#5A9AEC'], ['#E35549'], ['#88C249']]
 this.data.forEach(function(item, index) {
  lengend.push(item.name)
  series.push({
   name: item.name,
   type: 'bar',
   stack: '总量',
   barWidth: '30%',
   barMinHeight: '100%',
   data: item.data,
   color: colors[(index + 1) % colors.length]
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
   data:lengend,
   right: 'auto',
   bottom: 0
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

Draw.prototype.bar1 = function() {
 var _this = this;
 var series = [];
 var lengend = [];
 this.data.forEach(function(item) {
  lengend.push(item.name)
  series.push({
   name: item.name,
   type: 'bar',
   stack: '总量',
   barWidth: '15%',
   barMinHeight: '100%',
   data: item.data
  })
 })
 series[0].color = ['#1e95d4']
 series[1].color = ['#cbcbcb']
 var option = {
  title : {
   show: true,
   text: _this.title,
   textStyle: {
    fontSize: 16,
    //fontWeight: 'normal'
   }
},
legend: {
  data:lengend.reverse(),
  right: 0
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
  this.data.forEach(function(item) {
   series.push({
    name: item.name,
    type: 'bar',
    barWidth: '35%',
    barMinHeight: '100%',
    label: {
      normal: {
          show: true,
          position: 'top'
      }
  },
    data: item.data,
    color: ['#1e95d4']
   })
  })
  var option = {
   tooltip : {
    trigger: 'axis',
    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
 },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '0%',
    containLabel: true
 },
 legend: {
  show: true,
  type: 'plain',
  align: 'left',
  left: 10,
  data: _this.name
 },
   yAxis:  {
    type: 'value',
    name: _this.title
   },
   xAxis: {
      type: 'category',
      data: _this.name
   },
   series: series
  }
   this.chart.setOption(option);
 }

 /** 折线图 **/

Draw.prototype.line = function() {
  var _this = this;
  var series = [];
  this.data.forEach(function(item) {
   series.push({
    type: 'line',
    barWidth: '35%',
    barMinHeight: '100%',
    data: item.data,
    areaStyle: {normal: {}},
    smooth: true
   })
  })
  series[0].color = ['#1e95d4']
  series[1].color = ['#cbcbcb']
  var option = {
   tooltip : {
    trigger: 'axis',
    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
    }
 },
 grid: {
  bottom: 70
},
 legend: {
  show: true,
  type: 'plain',
  align: 'left',
  left: 10,
  data: _this.name
 },
   yAxis:  [
    {
      type: 'value',
      scale: true,
      max: 38,
      min: 0,
      name: _this.title[0]
     },
     {
      type: 'value',
      name: _this.title[1],
      scale: true,
      max: 38,
      min: 0
     }
   ],
   xAxis: {
      type: 'category',
      data: _this.name
   },
   dataZoom: [
    {
        show: true,
        realtime: true,
        start: 0,
        end: 50
    },
    {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 50
    }
],
   series: series
  }
   this.chart.setOption(option);
 }