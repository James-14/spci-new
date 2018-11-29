	$(function(){
		initLabelType();//初始化标签类型
	});

	//构件坐标赋值
	function showHtml(v){
		if(v){
			$("#componentxyz").val(v);
		}
	}

	//返回标签类型
	function getLabelType(){
		var v = $("#typeId").val();
		return $("#labelType"+v).attr('m');
	}
	
	//判断是否加载了iframe
	function isLoadIframe(){
		var src = $(window.parent.$("#iframeID"))[0].src;
		if(src && src=='toAddLabelPage'){
			return true;
		}
		return false;
	}
	
/**初始化标签类型**/
function initLabelType(){
	$.ajax({
        async: false,
        type: "POST",
        traditional: "true",
        data: {},
        url: "/communication/getInitData",
        dataType: 'json',
        success: function (data) {
            if(data.success){
            	var type = data.type;//问题类型
            	if(type){
            		var typeStr = "";
            		for(var i=0;i<type.length;i++){
            			var id = type[i].id;
            			var labelTypeName = type[i].labelTypeName;
            			var imgName =  type[i].imgName;
            			var imgUrl = type[i].imgUrl;
            			typeStr = typeStr + "<option m="+imgUrl+" id=labelType"+imgName+" value="+imgName+">"+labelTypeName+"</option>";
            		}
            		if(typeStr.length>0){
            			$("#typeId").html(typeStr);
            		}
            	}
            	
            	var project = data.project;//项目
            	if(project){
            		var projectStr = "";
            		for(var i=0;i<project.length;i++){
            			var projectId = project[i].projectId;
            			var projectName = project[i].projectName;
            			projectStr =projectStr + "<option value="+projectId+">"+projectName+"</option>";
            		}
            		if(projectStr.length>0){
            			$("#projectId").html(projectStr);
            		}
            	}
            	
            	var labels = data.labels; //模型标签
            	if(labels){
            		var lablesStr = "";
            		for(var i=0;i<labels.length;i++){
            			var labelId = labels[i].id;
            			var labelName = labels[i].labelName;
            			lablesStr =lablesStr + "<option value="+labelId+">"+labelName+"</option>";
            		}
            		if(lablesStr.length>0){
            			$("#lablesId").html(lablesStr);
            		}
            	}
            }else{
            	layer.msg('提取数据失败.');
            }
        }
     });
}