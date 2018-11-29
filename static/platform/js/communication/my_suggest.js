$(function(){
	initMessageList();
	
	//全部
	$("#list0").click(function(){
		initMessageList();
	});
	
	//预审通过
	$("#list10").click(function(){
		initMessageList(10);
	});
	
	//已采纳
	$("#list11").click(function(){
		initMessageList(11);
	});
	
	//已实现
	$("#list6").click(function(){
		initMessageList(6);
	});
});

function initMessageList(snsState){
	$.ajax({
        async: false,
        type: "POST",
        traditional: "true",
        data: {snsState:snsState},
        url: "/sns/getUserSnsList",
        dataType: 'json',
        success: function (data) {
            if(data.success){
            	var list = data.info;
            	var userId = data.userId;
            	buildMessageList(list,userId);
            }else{
            	layer.msg('提取数据失败.');
            }
        }
     });
}

function getDetail(id,userId){
	window.location.href = "/sns/getDetail?id="+id+"&userId="+userId;
}

function buildMessageList(list,userId){
	if(!list){
		return;
	}
	var ulListStr = "";
	for(var i=0;i<list.length;i++){
		var msg = list[i];
		var liStart = "<li id='"+msg.id+"' onclick='getDetail("+msg.id+","+userId+")'>";
		
		var title = msg.title; //标题
		var snsType = msg.snsType;//类型
		var snsState = msg.snsState;//状态
		var content = msg.content;//内容
		var content = msg.content;//状态
		var imgList = msg.spciMessageImgs;//图片列表
		var createTime = msg.createdate;//创建时间
		
		var s = "";
		var css = "";
		if(snsState==8){//已实现
			s = "已实现";
			css = "green-btn";
		}else if(snsState==7){//暂不实现
			s = "暂不实现";
			css = "org-btn";
		}else if(snsState==5){//未采纳
			s = "未采纳";
		}else if(snsState==2){//预审中/提交
			s = "预审中";
		}else if(snsState==3){//预审未通过
			s = "预审未通过";
			css = "red-btn";
		}else if(snsState==4){//预审通过
			s = "预审通过";
			css = "blue-btn";
		}else if(snsState==6){//已采纳
			s = "已采纳";
			css = "blue-btn";
		}
		var titleStr = "<p class='title'><span class='btn "+css+" pull-right'>"+s+"</span>";
		
		if(snsType==1){//建议
			titleStr = titleStr + "<b>【功能建议】</b>";
		}else if(snsType==2){//问题
			titleStr = titleStr + "<b>【问题反馈】</b>";
		}
		titleStr += title + "</p>";
		
		var createTimeSre = "<div class='dates'> 发布于： <span>"+createTime+"</span></div>";
		var contentStr = "<div class='description'>"+content+"</div>";
		
		var ulStr = "<ul class='user-btns'><li><i class='icon through'></i><span>"+(999+i)+"</span></li><li><i class='icon comment'></i><span>"+(320+i)+"</span></li><li><i class='icon zan'></i><span>"+(320)+"</span></li></ul>"
		
		var liEnd = "</li>";
		
		ulListStr += (liStart+titleStr +createTimeSre + /*imgs +*/ unescapeHTML(contentStr) + ulStr + liEnd);
	}
	$(".msgs-list").html(ulListStr);
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

function getImgs(imgList){
	var result = "<div class='imgs'>";
	if(imgList){
		for(var i=0;i<imgList.length;i++){
			var img = imgList[i];
			var imgcontext = img.imgcontext; //图片内容	
			result = result + "<span><img src='"+imgcontext+"' alt=''></span>";
		}
	}
	result = result + "</div>";
	return result;
}