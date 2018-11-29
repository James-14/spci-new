var table;
var table1;
$(function() {
			query1();//上部
			query2(1);//中部
			queryPie();	              
            // 饼图轮播切换
			jQuery(".pros-pie").slide({
				mainCell : ".bd ul",
				autoPage : true,
				effect : "left",
				autoPlay : false,
				vis : 3,
				trigger : "click"
			});
			// 小屏幕菜单选择
			$('.sm-menu').click(function() {
				if ($('.navbar-list').is(':hidden')) {
					$('.navbar-list').show();
				} else {
					$('.navbar-list').hide();
				}
			})
			// 日期设置
			$('#mydatepicker1').dcalendarpicker({
				format : 'yyyy-mm-dd'
			});
			$('#mydatepicker2').dcalendarpicker({
				format : 'yyyy-mm-dd'
			});
			$('.date-icon').click(function() {
				if ($(this).parent().find('.calendar').is(':hidden')) {
					$(this).parent().find('.calendar').show();
				} else {
					$(this).parent().find('.calendar').hide();
				}
			})	
			
			var defaultColunms = factorySaturation.initColumn();     
		      table = new BSTable(factorySaturation.id, "/product/listFactoryData?type=0", defaultColunms,{pageSize:5});
		      table.setPaginationType("server");
		      //table.setQueryParams(factorySaturation.formParams());
		      factorySaturation.table = table.init();
		      
		      var defaultColunms1 = factorySpare.initColumn();     
		      table1 = new BSTable(factorySpare.id, "/product/listFactoryData?type=1", defaultColunms,{pageSize:5});
		      table1.setPaginationType("server");
		      //table1.setQueryParams(factorySpare.formParams());
		      factorySpare.table = table1.init();
});

	 var factorySaturation = {
	      id: "factorySaturation",
	      seItem: null,
	      table: null
	  };
	 
	 var factorySpare = {
	      id: "factorySpare",
	      seItem: null,
	      table: null
	  };

	 factorySaturation.initColumn = function () {
	      return [
	    	  {title: 'id', field: 'factoryId', visible: false, align: 'center', valign: 'middle'},
	          {title: '工厂名称', field: 'factoryName', align: 'center', valign: 'middle'},
	          {title: '已派项目', field: 'projectName', align: 'center', valign: 'middle'},
	          {title: '实际产能', field: 'aNum', align: 'center', valign: 'middle'},
	          {title: '剩余产能', field: 'exNum', align: 'center', valign: 'middle'},
	          {title: '饱和度', field: 'per', align: 'center', valign: 'middle'}
	         ];
	  };
	  
	  factorySpare.initColumn = function () {
	      return [
	    	  {title: 'id', field: 'factoryId', visible: false, align: 'center', valign: 'middle'},
	          {title: '工厂名称', field: 'factoryName', align: 'center', valign: 'middle'},
	          {title: '已派项目', field: 'projectName', align: 'center', valign: 'middle'},
	          {title: '实际产能', field: 'aNum', align: 'center', valign: 'middle'},
	          {title: '剩余产能', field: 'exNum', align: 'center', valign: 'middle'},
	          {title: '饱和度', field: 'per', align: 'center', valign: 'middle'}
	         ];
	  };

function query1(){
	var ajax = new $ax(Feng.ctxPath + "/product/getCompanyFactoryRate", function (data) {
		//console.log(data);	
		    $("#factoryTo").attr("href","/product/productBill?companyId="+data.companyId);
			$("#factoryTo").html("<p class='txt'>"+data.factoryName+" 订单总览</p>");
			$("#totalNeed").html(data.noSignQNum);
			$("#toSNeed").html(data.totoleQNum);
			$("#pNum").html(data.projectNum);
			$("#monthNeed").html(data.curMQNum);
			$("#avgMNeed").html(data.avgMQNum);
			$("#topMonth").html("最高峰 （"+data.topMonth+")月");
			$("#state").html(data.state);
			$("#sNum").html("当月交付"+data.curMSNum+"方");
			$("#nextS").html("下一交期 "+data.nextMQDate+"，"+data.nextMQNum+"方");		
		}, function (data) {
	        Feng.error("获取工厂产能数据失败!");
	    });
	    ajax.start();
}

function query2(arg){
	if(arg<1){
		$("#project").empty();
	}
	var params=$('#query').vals();
	var ajax = new $ax(Feng.ctxPath + "/product/getProjectChartData", function (bakData) {
		//console.log(bakData);
		var data = new Array();
		
		for(var i=0;i<bakData.data.length;i++){
			var param = {};
			param.name = bakData.data[i].projectName;
			param.data = bakData.data[i].actualNum;
			data.push(param);
		}
		var data1 = {};
		data1.name="剩余产能";
		data1.data=data.extraNum;
		data.push(data1);		
		var eBar = new Draw('chart', bakData.xAxis, data).bar3();
	}, function (data) {
        Feng.error("获取数据失败!");
    });
    ajax.set(params);
    ajax.start();
}

function queryPie(){
	var ajax = new $ax(Feng.ctxPath + "/product/getCompanyFactoryPieData", function (data) {
			var content = "<ul class=\"clearfix\">";
			var array = new Array();
			for(var i=0;i<data.length;i++){
				content+="<li class=\"col-xs-12 col-sm-4\">";
				content+="<div class=\"pie-title\">"+data[i].name+"</div>";
				content+="<div class=\"chart\" id=\"chart"+(i+1)+"\" style=\"width:100%;height:200px;\"></div>";
				content+="<div class=\"line\"></div>";
				content+="</li>";
				var tArray = new Array();
				var pTemp = 0;				
				for(var j=0;j<data[i].data.length;j++){
					var temp = {};
					temp.name="第"+data[i].data[j].strDate+"季度";
					temp.value = data[i].data[j].aNum;
					pTemp += data[i].data[j].percent;
					tArray.push(temp);
				}
				tArray.push(pTemp);
				array.push(tArray);
			}
			content +="</ul>";
			$("#projectPie").html(content);
			for(var a=0;a<array.length;a++){
				var temp = new Array();
	  			  temp.push(array[a][0]);
	  			  temp.push(array[a][1]);
	  			  temp.push(array[a][2]);
	  			  temp.push(array[a][3]);  		       		     
	  			  new Draw('chart'+(a+1), '', temp).pie();  
			}
			
	}, function (data) {
        Feng.error("获取工厂产能数据失败!");
    });
    ajax.start();
}