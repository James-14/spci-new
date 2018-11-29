     // 基于准备好的dom，初始化echarts实例
    var myChart1 = echarts.init(document.getElementById('chart1'));
    var myChart2 = echarts.init(document.getElementById('chart2'));

    var cd1 = echarts.init(document.getElementById('cd1'));
    var cd2 = echarts.init(document.getElementById('cd2'));

    var gTooltip = {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    };

    var labelTop = {
        normal : {
            color: '#00a1ea',
            label : {
                show : false,
                position : 'bottom',
                formatter : '{b}',
                textStyle: {
                    baseline : 'bottom',
                }
            },
            labelLine : {
                show : false
            }
        }
    };
    var labelFromatter = {
        normal : {
            label : {
                formatter : function (params){
                    return (1000 - params.value)/10 + '%'
                },
                textStyle: {
                    baseline : 'bottom'
                }
            }
        },
    };
    var labelBottom = {
        normal : {
            color: '#ccc',
            label : {
                show : true,
                position : 'center'
            },
            labelLine : {
                show : false
            }
        }
    };
    var radius = [25, 40];

    var smallRadius = [35,50];

    var triOptions = {
        baseOption : {
            tooltip : gTooltip,
            calculable: true,
            series : [
            {
                name: '迷你报表1',
                type: 'pie',
                itemStyle : labelFromatter,
                clockWise: true,
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show:false,
                    }
                },
                labelLine:{
                    normal: {
                        show:false
                    }
                },
                data:[
                {value:770, name:'未完成',
                itemStyle:labelBottom},
                {value:230, name:'已发货',
                itemStyle:labelTop}
                ]
            },
            {
                name: '迷你报表2',
                type: 'pie',
                itemStyle : labelFromatter,
                clockWise: true,
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show:false,
                    }
                },
                labelLine:{
                    normal: {
                        show:false
                    }
                },
                data:[
                {value:580, name:'未完成',
                itemStyle:labelBottom},
                {value:420, name:'已发货',
                itemStyle:labelTop}
                ]
            },
            {
                name: '迷你报表3',
                type: 'pie',
                itemStyle : labelFromatter,
                clockWise: true,
                avoidLabelOverlap: true,
                label: {
                    normal: {
                        show:false,
                    }
                },
                labelLine:{
                    normal: {
                        show:false
                    }
                },
                data:[
                {value:380, name:'未完成',
                itemStyle:labelBottom},
                {value:620, name:'已发货',
                itemStyle:labelTop}
                ]
            }
            ]
        },
        media: [
        {
            option : {
                series:[
                    {   radius:radius,
                        center:['15%','50%']
                    },
                    {
                        radius:radius,
                        center:['50%','50%']
                    },
                    {
                        radius:radius,
                        center:['85%','50%']
                    }
                ]
            }
        },
        {
            query : {
                maxWidth: 364
            },
            option : {
                series:[
                        {   radius: smallRadius,
                            center: ['50%', '15%']
                        },
                        {
                            radius: smallRadius,
                            center: ['50%', '50%']
                        },
                        {
                            radius: smallRadius,
                            center: ['50%', '85%']
                        }
                    ]
            }
        }
            ]
        };

    // global 配置

    var gLabel = {
        normal: {
            textStyle: {
                color: '#000',
                fontFamilt:'Microsoft Yahei'
            }
        },
        emphasis:{
            show:true,
            textStyle:{
                fontSize:'14',
                fontFamilt:'Microsoft Yahei',
                fontWeight:'bold'
            }
        }
    };

    var gLabelLine = {
        normal: {
            length:10,
            length2:10      
        }
    };

    // 指定图表的配置项和数据
    var option1 = {
        tooltip : gTooltip,
         title : {
            text: '160000\n总成本',
            x: 'center',
            y: 'center',
            textStyle: {
                fontSize:'16',
            }
        },
        series : [
            {
                name: '报表1',
                type: 'pie',
                radius: ['35%', '60%'],
                center:['50%','50%'],
                clockWise: false,

                data:[
                    {value:200, name:'安装成本',
                    itemStyle:{
                        normal:{
                            color: '#a45ee5'
                        }
                    }},
                    {value:200, name:'运输成本',
                    itemStyle:{
                        normal:{
                            color:'#bfe2d6'
                        }
                    }},
                    {value:800, name:'生产成本',
                    itemStyle:{
                        normal:{
                            color:'#00a1ea'
                        }
                    }}
                ].sort(function (a, b) { return a.value - b.value; }),
                label: gLabel,
              labelLine:gLabelLine
            }
        ]
    };

     // 指定图表的配置项和数据
    var option2 = {
        tooltip : gTooltip,
        title : {
            text: '1300\n总构件数',
            x: 'center',
            y: 'center',
            textStyle: {
                fontSize:'16',
            }
        },
        series : [
            {
                name: '报表2',
                type: 'pie',
                radius: ['35%', '60%'],
                center:['50%','50%'],
                selectedMode:'multiple',
                clockWise: false,
                avoidLabelOverlap: false,
                data:[
                    {value:150, name:'已到场',
                    itemStyle:{
                        normal:{
                            color: '#f5efc8'
                        }
                    }},
                    {value:200, name:'运输中',
                    itemStyle:{
                        normal:{
                            color:'#bfe2d6'
                        }
                    }},
                    {value:200, name:'未发货',
                    itemStyle:{
                        normal:{
                            color:'#ec7c7b'
                        }
                    }},
                    {value:1000, name:'已安装',
                    itemStyle:{
                        normal:{
                            color:'#00a1ea'
                        }
                    }}
                ].sort(function (a, b) { return a.value - b.value; }),
                label: gLabel,
                labelLine:gLabel
            }
        ]
    };

    var optionRt = {
        tooltip : gTooltip,
        series : [
            {
                name: '生产进度',
                type: 'pie',
                radius: ['0%', '50%'],
                center:['50%','50%'],
                selectedMode:'multiple',
                clockWise: false,
                avoidLabelOverlap: false,
                data:[
                    {value:125, name:'延迟发货',
                    itemStyle:{
                        normal:{
                            color: '#ec6e6c'
                        }
                    }},
                    {value:875, name:'延迟发货',
                    itemStyle:{
                        normal:{
                            color:'#00a1ea'
                        }
                    }}
                ].sort(function (a, b) { return a.value - b.value; }),
                label: gLabel,
                labelLine:gLabelLine
            }
        ]
    };

    // 设置完成
    myChart1.setOption(option1);
    myChart2.setOption(option2);

    cd1.setOption(triOptions);
    cd2.setOption(triOptions);

    window.onresize = function() {
        myChart1.resize();
        myChart2.resize();
        cd1.resize();
        cd2.resize();
    };