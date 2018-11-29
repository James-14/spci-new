/**
 * 构件信息管理初始化
 */
var ComponentTB = {
    id: "componentTable",	//表格id
    seItem: null,		//选中的条目
    table: null,
    layerIndex: -1
};


/**
 * 初始化表格的列
 */
ComponentTB.initColumn = function () {
	return [  	    
        [
        	{title:"构件图号",valign:"middle",align:"center",colspan:0},
        	{title:"构件属性信息",valign:"middle",align:"center",colspan:9},
        	{title:"计划预排",valign:"middle",align:"center",colspan:2},
        	{title:"生产过程信息",valign:"middle",align:"center",colspan:9}        	
        ],
        [
        	{title: 'id', field: 'componentId', visible: false, align: 'center', valign: 'middle'},
	        {title: '构件图号', field: 'cdraw', align: 'center', valign: 'middle', sortable: false,
	      	formatter : function (value, row, index) {
	      		//return '<a href="${ctxPath}/product/pdf/component_pdfDraw?id='+row['componentId']+'" target="_blank" data-toggle="tooltip" title="查看图档" data-placement="top">'+row['cdraw']+'</a>';
	          	return "<a href='#' onclick=\"showDrawingInfo('"+row['cdraw']+"','"+row['componentId']+"',"+row['type']+")\">"+row['cdraw']+"</a>";	
	          }
	        },
	        {title: 'RFID号', field: 'rfid', align: 'center', valign: 'middle', sortable: false},
	        {title: '状态', field: 'state', align: 'center', valign: 'middle', sortable: false,
	      	formatter : function (value, row, index) {
	      		//console.log(value);
	      		var result = "";
	      		if(value=='待计划'){
	      			result += value;
	      		}else if(value=='待生产'){
	      			result += "<font style='font-weight:bold' color='#1C86EE'>"+value+"</font>";
	      		}else if(value=='已生产'){
	      			result += "<font style='font-weight:bold' color='green'>"+value+"</font>";
	      		}else{
	      			result += "<font style='font-weight:bold' color='#0000CD'>"+value+"</font>";
	      		}
	      		return result;
	          }
	        },
	        {title: '构件类型', field: 'componentType', align: 'center', valign: 'middle', sortable: false},
	        {title: '工程名称', field: 'projectName', align: 'center', valign: 'middle', sortable: false},
	        {title: '工程编号', field: 'projectNo', align: 'center', valign: 'middle', sortable: false},
	        {title: '楼号', field: 'building', align: 'center', valign: 'middle', sortable: false},
	        {title: '层号', field: 'cfloor', align: 'center', valign: 'middle', sortable: false},
	        {title: '标号', field: 'inventoryName', align: 'center', valign: 'middle', sortable: false},
	        {title: '方量', field: 'mixquantity', align: 'center', valign: 'middle', sortable: false},
	        {title: '计划安装时间', field: 'planTime', visible: true, align: 'center', valign: 'middle',
	    		formatter:function(value,row,index){
	    			if(!value)
						return " ";
	    			else
	    				return $time.fmtDate('yyyy-MM-dd',new Date(value));
	    		}
	        },
	        {title: '要货时间', field: 'orderTime', visible: true, align: 'center', valign: 'middle',
        		formatter:function(value,row,index){
        			if(!value)
    					return " ";
        			else
        				return $time.fmtDate('yyyy-MM-dd',new Date(value));
        		}
	    	},
        	{title: '工厂', field: 'fname', align: 'center', valign: 'middle', sortable: false},
        	{title: '生产线', field: 'lname', align: 'center', valign: 'middle', sortable: false},
        	{title: '承建单位', field: 'patiCompany', align: 'center', valign: 'middle', sortable: false},
        	{title: '项目经理', field: 'patiName', align: 'center', valign: 'middle', sortable: false},
        	{title: '浇筑时间', field: 'pouringTime', visible: true, align: 'center', valign: 'middle',
	    		formatter:function(value,row,index){
	    			if(!value)
						return " ";
	    			else
	    				return $time.fmtDate('yyyy-MM-dd',new Date(value));
	    		}
        	},
    		{title: '脱模时间', field: 'finishTime', visible: true, align: 'center', valign: 'middle',
	    		formatter:function(value,row,index){
	    			if(!value)
						return " ";
	    			else
	    				return $time.fmtDate('yyyy-MM-dd',new Date(value));
	    		}
	    	},
    		{title: '发运时间', field: 'logisticTime', visible: true, align: 'center', valign: 'middle',
	    		formatter:function(value,row,index){
	    			if(!value)
						return " ";
	    			else
	    				return $time.fmtDate('yyyy-MM-dd',new Date(value));
	    		}
	    	},
    		{title: '吊装时间', field: 'hostingTime', visible: true, align: 'center', valign: 'middle',
	    		formatter:function(value,row,index){
	    			if(!value)
						return " ";
	    			else
	    				return $time.fmtDate('yyyy-MM-dd',new Date(value));
	    		}
    		}	        
	      ]
        ];
};

ComponentTB.search = function () {
        var queryData = ComponentTB.formParams();
        ComponentTB.table.refresh({query: queryData});
}; 
    
ComponentTB.formParams = function() {
        var queryData = {};
        queryData['projectId'] = $("#projects").val();
        queryData['building'] = $("#building").val();
        queryData['floor'] = $("#floor").val();
        queryData['componentDrawing'] = $("#componentDrawing").val();
        queryData['componentType'] = $("#componentType").val();
        queryData['componentState'] = $("#componentState").val();
        queryData['startTime'] = $("#startTime").val();
        queryData['endTime'] = $("#endTime").val();
        return queryData;
    }


$(function() {
      $('#startTime').datepicker({  
           format: 'yyyy-mm-dd',
           todayBtn:"linked"
      });
      
      $('#endTime').datepicker({  
          format: 'yyyy-mm-dd',
          todayBtn:"linked"
     });     
     
      $('.date-icon').click(function() {
        if ($(this).parent().find('.calendar').is(':hidden')){
          $(this).parent().find('.calendar').show();
        } else {
          $(this).parent().find('.calendar').hide();
        }
      });      
      var defaultColunms = ComponentTB.initColumn();
      var table = new BSTable(ComponentTB.id, "/product/listDongData", defaultColunms,{pageSize:10,onPageChange:pageChange});
      table.setPaginationType("server");
      table.setQueryParams(ComponentTB.formParams());
      ComponentTB.table = table.init();
      
    //项目-楼-层 联动
      $('#projects').on('change',function(){
          var projectId = $(this).val();
          if(projectId != ''){
            $.ajax("/project/getFloorByProjectId?projectId="+projectId, {
              dataType:"json",
              type:"POST",
              success: function(data) {
                if(data){
                  floors = new Array(); 
                  $.each(data.floors,function(i, item){
                      
                      floors .push(item.nodeCode);
                  });
                  var html = '<select id="building" name="building" style="width: 140px;" class="condition">';
                  html += '<option></option>';
                  $.each(data.buildings,function(i, item){
                    html += '<option value="'+item+'"';
                    html += '>'+item+'</option>';
                  });
                  html += '</select>'
                  $('#building').prop('outerHTML',html);
                }else{
                  $('#building').prop('outerHTML', '<input type="text" id="building" name="building" class="condition">');
                }
              }
            });
            $('#floor').prop('outerHTML', '<input type="text" id="floor" name="floor" class="condition">');
          }else{
            $('#building').prop('outerHTML', '<input type="text" id="building" name="building" class="condition">');
            $('#floor').prop('outerHTML', '<input type="text" id="floor" name="floor" class="condition">');
          }         
      });
      $(".form-dong-body").on("change","#building",function(event){
          var projectId = $('#projects').val();
          var building = $(this).val();
          if(projectId != '' && building != '' && floors && floors.length>0){
            var html = '<select id="floor" name="floor" style="width: 140px;" class="condition">';
            html += '<option></option>';
            $.each(floors,function(i, item){
              var items = item.split("\@");
              if(projectId == items[0] && building == items[1]){
                html += '<option value="'+items[2]+'"';
                html += '>'+items[2]+'</option>';
              }
            });
            html += '</select>'
            $('#floor').prop('outerHTML',html);
          }else{
            $('#floor').prop('outerHTML', '<input type="text" id="floor" name="floor" class="condition">');
          }         
	    });
      
});

function showDrawingInfo(drawStr,componentId,type){
	var url = Feng.ctxPath + "/component/draw.html?componentId="+componentId + "&drawStr="+drawStr + "&type="+type;
	var index = layer.open({
        type: 2,
        title: '查看图档信息',
        area: ['910px', '550px'], //宽高
        fix: false, //不固定
        maxmin: true,
        content: url
    });
	ComponentTB.layerIndex = index;
} 

function pageChange(number,size){
	selectedComps.clear();
}
