$(function(){
	$("#buildingId").change(function(){
		var nodeId = $(this).val();
		
		var ajax = new $ax("/project/mgn/getScmProjectBuildingByNodeId", function (data) {
			var build = data.build;
			if(build){
				var allArea = build.allArea;
				if(!allArea || allArea==''){
					allArea = 0;
				}
				$("#allArea").html("<span>总建筑面积：</span>"+allArea+"平方米");
				
				var buildingFnum = build.buildingFnum;
				if(!buildingFnum || buildingFnum==''){
					buildingFnum = 0;
				}
				$("#buildingFnum").html("<span>建筑层数：</span>"+buildingFnum+"层");
				
				var buildingHigh = build.buildingHigh;
				if(!buildingHigh || buildingHigh==''){
					buildingHigh = 0;
				}
				$("#buildingHigh").html("<span>建筑高度：</span>"+buildingHigh+"米");
				
				var planStartTime = build.planStartTime;
				if(!planStartTime ){
					planStartTime = "暂无";
				}
				$("#planStartTime").html("<span>计划开工日期：</span>"+dateFtt("yyyy-MM-dd hh:mm:ss",planStartTime));
				
				var actualStartTime = build.actualStartTime;
				if(!actualStartTime ){
					actualStartTime = "暂无";
				}
				$("#actualStartTime").html("<span>实际开工日期：</span>"+dateFtt("yyyy-MM-dd hh:mm:ss",actualStartTime));
				
				var planFinishTime = build.planFinishTime;
				if(!planFinishTime ){
					planFinishTime = "暂无";
				}
				$("#planFinishTime").html("<span>计划竣工日期：</span>"+dateFtt("yyyy-MM-dd hh:mm:ss",planFinishTime));
				
				var actualFinishTime = build.actualFinishTime;
				if(!actualFinishTime ){
					actualFinishTime = "暂无";
				}
				$("#actualFinishTime").html("<span>实际竣工日期：</span>"+dateFtt("yyyy-MM-dd hh:mm:ss",actualFinishTime));
			}else{
				$("#allArea").html("<span>总建筑面积：</span>"+0+"平方米");
				
				$("#buildingFnum").html("<span>建筑层数：</span>"+0+"层");
				
				$("#buildingHigh").html("<span>建筑高度：</span>"+0+"米");
				
				$("#planStartTime").html("<span>计划开工日期：</span>暂无");
				
				$("#actualStartTime").html("<span>实际开工日期：</span>暂无");
				
				$("#planFinishTime").html("<span>计划竣工日期：</span>暂无");
				
				$("#actualFinishTime").html("<span>实际竣工日期：</span>暂无");
			}
	    }, function (data) {
	        Feng.error("业务异常!" + data.responseJSON.message + "!");
	    });
	    ajax.set("nodeId",nodeId);
	    ajax.start();
		
		/**
        <li id="actualFinishTime"><span>实际竣工日期：</span>
        @if(build.actualFinishTime==null){
	        	暂无
	     @}else{
	    	${build.actualFinishTime}
	     @}
        </li>
		 */
		
		
		
		
		
		
		
		
		
		
		
	});
});

/**************************************时间格式化处理************************************/
function dateFtt(fmt,date){
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}