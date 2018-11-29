$(function(){
	initDetail();
	
	$("#getMessageList").click(function(){
		var userId = $(this).attr("userId");
		if(userId){
			window.location.href = "/communication/my_suggest";
		}else{
			window.location.href = "/communication/suggest_more";
		}
	});
});

function initDetail(){
	$.ajax({
        async: false,
        type: "POST",
        traditional: "true",
        data: {id:$("#detailId").val()},
        url: "/sns/getMessage",
        dataType: 'json',
        success: function (data) {
            if(data.success){
            	var msg = data.info;
            	buildMessage(msg);
            }else{
            	layer.msg('提取数据失败.');
            }
        }
     });
}

function buildMessage(msg){
	var title = msg.title;
	var snsState = msg.snsState;
	var content = msg.content;
	
	$("#title").html(title);
	
	var type = msg.snsType ;
	var t = "";
	if(type==1){
		t = "【功能建议】";
	}else if(type==1){
		t = "【问题反馈】";
	}
	
	var s = "";
	var css = "";
	if(snsState==2){//提交
		s = "已提交";
		$("#circle"+snsState).attr("class","circle");
		//$("#right-line"+snsState).attr("class","circle");
		//$("#left-line"+snsState).attr("class","circle");
	}else if(snsState==4){//已采纳
		s = "已实现";
		css = "green-btn";
		
		$("#circle"+snsState).attr("class","circle");
		//$("#right-line"+snsState).attr("class","circle");
		//$("#left-line"+snsState).attr("class","circle");
	}else if(snsState==6){//已实现
		s = "已实现";
		css = "green-btn";
		$("#circle"+snsState).attr("class","circle");
		//$("#right-line"+snsState).attr("class","circle");
		//$("#left-line"+snsState).attr("class","circle");
	}else if(snsState==7){//暂不修复
		s = "暂不修复";
		css = "org-btn";
		$("#circle"+snsState).attr("class","circle");
		//$("#right-line"+snsState).attr("class","circle");
		//$("#left-line"+snsState).attr("class","circle");
	}else if(snsState==8){//未采纳
		s = "未采纳";
		$("#circle"+snsState).attr("class","circle");
		//$("#right-line"+snsState).attr("class","circle");
		//$("#left-line"+snsState).attr("class","circle");
	}else if(snsState==9){//预审未通过
		s = "预审未通过";
		css = "red-btn";
		$("#circle"+snsState).attr("class","circle");
		//$("#right-line"+snsState).attr("class","circle");
		//$("#left-line"+snsState).attr("class","circle");
	}else if(snsState==10){//预审通过
		s = "预审通过";
		css = "blue-btn";
		$("#circle"+snsState).attr("class","circle");
		//$("#right-line"+snsState).attr("class","circle");
		//$("#left-line"+snsState).attr("class","circle");
	}
	
	
	
	
	var typeStr = "<span class='btn "+css+" pull-right'>"+s+"</span><b>"+t+"</b>"+title;
	$("#titleTypeId").html(typeStr);
	$("#createTimeId").html(msg.createdate);
	
	$("#typeId").html(t);
	
	var imgIdStr = "";
	var imgList = msg.spciMessageImgs;
	 
	if(imgList && imgList.length>0){
		for(var i=0;i<imgList.length;i++){
			var imgContent = imgList[i].imgcontext;
			var imgId = imgList[i].id;
			imgIdStr = imgIdStr + "<img onclick='getDeatilImg("+imgId+")' style='width: 100%;height: 250px;cursor:pointer;' src = '"+imgContent+"'>"
		}
		$("#imgId").html(imgIdStr);
	}else{
		$("#imgId").remove();
	}
	if(content){
		$("#desciprtionId").html(unescapeHTML(content));
	}
}

function unescapeHTML(a){  
    a = "" + a;  
    var r1 = new RegExp("& lt;","g");
    var r2 = new RegExp("& gt;","g");
    var r3 = new RegExp("& amp;","g");
    var r4 = new RegExp("& quot;","g");
    var r5 = new RegExp("& apos;","g");
    return a.replace(r1, "<").replace(r2, ">").replace(r3, "&").replace(r4, '"').replace(r5, "'");  
}

function getDeatilImg(imgId){
	window.open("/sns/getImgDetal?imgId="+imgId);  
}

