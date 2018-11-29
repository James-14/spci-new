/** 构造函数 **/
function Draw(elem, name, data, title) {
    this.chart = echarts.init(document.getElementById(elem));
    this.name = name;
    this.data = data;
    this.title = title;
}

/** 饼图 **/

Draw.prototype.pie = function () {
    var _this = this;
    var total = 0;
    this.data.forEach(function (item) {
        if (item.show) {
            item.itemStyle = {
                normal: {
                    color: '#1e95d4'
                }
            }
            total = item.percent + '%'
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
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
            {
                name: _this.name,
                type: 'pie',
                radius: ['70%', '85%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
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

Draw.prototype.bar1 = function () {
    var _this = this;
    var series = [];
    var lengend = [];
    $.each(this.data,function (index,item) {
        if(index==0) {
            series.push({
                name: item.name,
                type: 'bar',
                // stack: '总量',
                barWidth: '15%',
                barMinHeight: '100%',
                data: item.data,
                z:10
            })
        }else{
            series.push({
                name: item.name,
                type: 'bar',
                // stack: '总量',
                barWidth: '15%',
                silent: true,
                barMinHeight: '100%',
                data: item.data,
                barGap:'-100%'
            })
        }
        lengend.push(item.name)

    })
    series[0].color = ['#1e95d4']
    series[1].color = ['#cbcbcb']
    var option = {
        title: {
            show: true,
            text: _this.title,
            textStyle: {
                fontSize: 16,
                //fontWeight: 'normal'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: lengend.reverse(),
            right: 0
        },
        yAxis: {
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

Draw.prototype.bar2 = function () {
    var _this = this;
    var series = [];
    this.data.forEach(function (item) {
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
            color: [item.color]
        })
    })
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '0%',
            containLabel: true
        },
        legend: {
            data:_this.title
        },
        yAxis: {
            type: 'value',
            name: "物料数(件)"
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

Draw.prototype.line = function () {
    var _this = this;
    var series = [];
    $.each(this.data, function (index, item) {
        series.push({
            type: 'line',
            barWidth: '35%',
            barMinHeight: '100%',
            data: item.data,
            areaStyle: {normal: {}},
            smooth: true,
            yAxisIndex: index,
            max: item.max,
            name:item.name
        })
    });
    series[0].color = ['#1e95d4']
    series[1].color = ['#cbcbcb']
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            bottom: 70
        },
        legend: {
            show: true,
            // type: 'plain',
            // align: 'left',
            // left: 10,
            data: _this.title
        },
        yAxis: [
            {
                type: 'value',
                scale: true,
                max: series[0].max * 1.5,
                min: 0,
                splitLine: {
                    show: false
                },
                name: _this.title[0],
                position: 'left'
            },
            {
                type: 'value',
                name: _this.title[1],
                scale: true,
                max: series[1].max * 1.5,
                min: 0,
                splitLine: {
                    show: false
                },
                position: 'right'
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
                end: 100
            },
            {
                type: 'inside',
                realtime: true,
                start: 0,
                end: 100
            }
        ],

        series: series
    }
    this.chart.setOption(option);
}