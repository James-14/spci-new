     // 基于准备好的dom，初始化echarts实例
     var myChart1 = echarts.init(document.getElementById('chart1'));
     var myChart2 = echarts.init(document.getElementById('chart2'));
     var myChart3 = echarts.init(document.getElementById('chart3'));
     var myChart4 = echarts.init(document.getElementById('chart4'));
     var myChart5 = echarts.init(document.getElementById('chart5'));
     var myChart6 = echarts.init(document.getElementById('chart6'));
/*     var myChart7 = echarts.init(document.getElementById('chart7'));
     var myChart8 = echarts.init(document.getElementById('chart8'));
     var myChart9 = echarts.init(document.getElementById('chart9'));*/


    var gTooltip1 = {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}"+"条"+"({d}%)"
    };

    var gTooltip2 = {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}"+"万元"+"({d}%)"
    };

    var gTooltip3 = {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c}"+"件"+"({d}%)"
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
            length:7,
            length2:7      
        }
    };

    // 指定图表的配置项和数据
    var option1 = {
        tooltip : gTooltip1,
         title : {
            text: '质量',
            x: 'center',
            y: 'center',
            textStyle: {
                fontSize:'12',
            }
        },
        series : [
            {
                name: '质量报表',
                type: 'pie',
                radius: ['50%', '80%'],
                center:['50%','50%'],
                clockWise: false,

                data:[
                    {value:200, name:'未处理',
                    itemStyle:{
                        normal:{
                            color: '#eb6e6d'
                        }
                    }},
                    {value:200, name:'处理中',
                    itemStyle:{
                        normal:{
                            color:'#bfe2d6'
                        }
                    }},
                    {value:800, name:'已处理',
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

    var option1query = {
        baseOption:{
         tooltip : gTooltip1,
         title : {
            text: '质量',
            x: 'center',
            y: 'center',
            textStyle: {
                fontSize:'12',
            }
        },
        series : [
        {
            name: '质量报表',
            type: 'pie',
            center:['50%','50%'],
            clockWise: false,
            data:[
            {value:200, name:'未处理',
            itemStyle:{
                normal:{
                    color: '#eb6e6d'
                }
            }},
            {value:200, name:'处理中',
            itemStyle:{
                normal:{
                    color:'#bfe2d6'
                }
            }},
            {value:800, name:'已处理',
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
    },
    media: [
    {
        option : {
            series:[
            {   radius:['50%','80%']
                }
            ]
        }
    },
    {
        query : {
            maxWidth: 615
        },
        option : {
            series:[
            {   radius:['30%','50%']
                }
            ]
        }
    }
    ]
};

       // 指定图表的配置项和数据
    var option2 = {
        tooltip : gTooltip2,
         title : {
            text: '成本',
            x: 'center',
            y: 'center',
            textStyle: {
                fontSize:'12',
            }
        },
        series : [
            {
                name: '成本报表',
                type: 'pie',
                radius: ['50%', '80%'],
                center:['50%','50%'],
                clockWise: false,

                data:[
                    {value:20, name:'安装成本',
                    itemStyle:{
                        normal:{
                            color: '#f4c253'
                        }
                    }},
                    {value:20, name:'运输成本',
                    itemStyle:{
                        normal:{
                            color:'#674ea3'
                        }
                    }},
                    {value:80, name:'生产成本',
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
    var option3 = {
        tooltip : gTooltip3,
        title : {
            text: '进度',
            x: 'center',
            y: 'center',
            textStyle: {
                fontSize:'12',
            }
        },
        series : [
            {
                name: '进度报表',
                type: 'pie',
                radius: ['50%', '80%'],
                center:['50%','50%'],
                selectedMode:'multiple',
                clockWise: false,
                avoidLabelOverlap: false,
                data:[
                    {value:150, name:'未发货',
                    itemStyle:{
                        normal:{
                            color: '#eb6e6d'
                        }
                    }},
                    {value:200, name:'运输中',
                    itemStyle:{
                        normal:{
                            color:'#bfe2d6'
                        }
                    }},
                    {value:200, name:'已到场',
                    itemStyle:{
                        normal:{
                            color:'#674ea3'
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
                labelLine:gLabelLine
            }
        ]
    };

    var option4 = {
        tooltip : gTooltip1,
        title : {
            text: '0\n质量',
            x: 'center',
            y: 'center',
            textStyle: {
                fontSize:'12',
            }
        },
        series : [
        {
            name: '质量报表',
            type: 'pie',
            radius: ['50%', '80%'],
            center:['50%','50%'],
            selectedMode:'single',
            clockWise: false,
            data:[
            {value:0, name:'',
            itemStyle:{
                normal:{
                    color: '#ddd'
                }
            }}
            ],
            labelLine:{
                normal: {
                    length:0,
                    length2:0      
                }
            }
        }
        ]
    };

    var optionRt = {
        tooltip : gTooltip3,
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
     myChart3.setOption(option3);
     myChart4.setOption(option4);
     myChart5.setOption(option2);
     myChart6.setOption(option3);
     myChart7.setOption(option1);
     myChart8.setOption(option2);
     myChart9.setOption(option3);