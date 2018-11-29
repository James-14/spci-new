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
 var total = _this.data[0].value+'%';
 var lengend = [];
 _this.data.forEach((item) => {
  lengend.push(item.name)
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
// tooltip : {
//     trigger: 'item',
//     formatter: "{a} <br/>{b} : {c} ({d}%)"
// },
 legend: {
  show: false,
  type: 'plain',
  align: 'left',
  bottom: 0,
  data: lengend
 },
  series: [
    {
       name:_this.name,
       type:'pie',
       radius: ['65%', '85%'],
       avoidLabelOverlap: false,
        label: {
            normal: {
                show: false,
                position: 'center'
            },
            // emphasis: {
            //     show: true,
            //     textStyle: {
            //         fontSize: '30',
            //         fontWeight: 'bold'
            //     }
            // }
        },
      //  label: {
      //     normal: {
      //         show: true,
      //         position: 'center',
      //         formatter: function() {
      //          return _this.name + '\r\n' + _this.data[0].value + '.00%'
      //         }
      //     }
      // },
       data: _this.data,
       color: ['#7CCD7C', '#CCCCCC']
     }
   ]
 }
 this.chart.setOption(option);
}


/** 饼图 **/

Draw.prototype.pie2 = function() {
    var _this = this;
    var total = 0;
    var colors = [['#00b7ee'], ['#bfe1d6'], ['#fca13f'], ['#5f52a0']];
    var lengend = [];
    _this.data.forEach((item) => {
        lengend.push(item.name)
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
        legend: {
            show: true,
            type: 'plain',
            align: 'left',
            bottom: 0,
            data: lengend
        },
        series: [
            {
                name:_this.name,
                type:'pie',
                radius: ['35%', '65%'],
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
                        show: true
                    }
                },
                data: _this.data,
                color: ['#00b7ee', '#bfe1d6', '#fca13f', '#5f52a0']
            }
        ]
    }
    this.chart.setOption(option);
}


/** 柱状图 **/

Draw.prototype.bar = function() {
  var _this = this;
  var series = [];
  var colors = [['#4ab476'], ['#1f95d5'], ['#929daf']];
  var lengend = [];
  this.data.forEach(function(item, index) {
    lengend.push(item.name)
   series.push({
    name: item.name,
    type: 'bar',
    barMinHeight: '100%',
    label: {
      normal: {
          show: true,
          position: 'top'
      }
  },
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
  show: true,
  type: 'plain',
  align: 'left',
  right: 100,
  data: lengend
 },
   yAxis:  {
    type: 'value',
    name: _this.title
   },
   xAxis: {
      type: 'category',
      data: _this.name
   },
   toolbox:{
	  show:true,
	  feature:{
		  dataZomm:{show:true}
	  }
   },
   dataZoom:{
	   show:true,
	   start:0,
	   end:100
   },
   series: series
  }
   this.chart.setOption(option);
 }
