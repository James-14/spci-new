function showUserList(deptId){
	
	var isShow = $("#dept_"+deptId).attr("class");
	var cls2 = isShow.split(' ');
	 
	if(cls2[1] && cls2[1]=='icon'){
		 $("#dept_"+deptId).removeClass("icon");
		
		 $("dd[deptid="+deptId+"]").each(function(){
			$(this).css("display","none");
		 });
		 
	}else{
		 $("#dept_"+deptId).addClass("icon");
		 $("dd[deptid="+deptId+"]").each(function(){
				$(this).css("display","block");
		 });
		 
		 $(".userDt").each(function(){
			 	var cls = $(this).attr("class");
				var clsTemp = cls.split(' ');
				if(clsTemp[1] && clsTemp[1]=='icon'){
					var id = $(this).attr("id");
					var ids = id.split("_");
					if(ids[1]!=deptId){
						$("#dept_"+ids[1]).removeClass("icon");
						 $("dd[deptid="+ids[1]+"]").each(function(){
								$(this).css("display","none");
					    });
					}
					
				}
		 });
		 
	}
}

	var initUserList = function(searchValue){
			$.ajax({
	            async: false,
	            type: "POST",
	            data: {userName:searchValue},
	            url: "/sns/getUserList",
	            dataType: 'json',
	            success: function (data) {
	                if(data.success){
	                    var userList = data.userList;
	                    var deptList = data.deptList;
	                    
	                    if(deptList && deptList.length>0){
	                    	$("#contactsDiv").html("");//清空列表
	                    	for(var i=0;i<deptList.length;i++){//for start
	                    		var dept = deptList[i];
	                    		var liStr = "<dl class='userDl'><dt class='userDt' onclick='showUserList("+dept.id+")' id='dept_"+dept.id+"'>"+dept.simplename+"</dt></dl>";
	                    		
	                    		var liObj = $("#contactsDiv");
		                    	if(liObj.children().length>0){
		                    		$($("#contactsDiv").last()).append(liStr);
		                    	}else{
		                    		$("#contactsDiv").html(liStr);
		                    	}
		                    	
		                    	/**联系人列表**/
		                		if(userList.length>0){
			                    	var userStr = "";
			                    	 for(var j=0;j<userList.length;j++){
			                    		var user = userList[j];
			                    		var deptid = user.deptId;//部门ID
			                    		if(deptid == dept.id){
			                    			userStr = userStr + "<dd class='userDd' id='user_"+user.userId+"' deptid='"+dept.id+"'><a href='###' onclick='addUser(this)' id='"+user.userId+"'  style='text-decoration:none;'>"+user.userName+"</a></dd>"
			                    		}
			 	                    }
			                    	$("#dept_"+dept.id).after(userStr);
			                    }
	                    	}//for end
	                    }else{
	                    	
	                    	/**联系人列表**/
	                		if(userList.length>0){
	                			var userStr = "";
		                    	 for(var j=0;j<userList.length;j++){
		                    		var user = userList[j];
		                    		var deptid = user.deptId;//部门ID
		                    		if(deptid == dept.id){
		                    			userStr = userStr + "<dd class='userDd' id='user_"+user.userId+"' deptid='"+dept.id+"'><a href='###' onclick='addUser(this)' id='"+user.userId+"' style='text-decoration:none;'>"+user.userName+"</a></dd>"
		                    		}
		 	                    }
		                    	$("#contactsDiv").html("<dl class='userDl'><dt class='userDt'>"+userStr+"</dt></dl>");
		                    }
	                    }
	                }
	            }
	         });
	  }
	
	function addUser(ths){
		var name = $(ths).text();
        var userId = $(ths).attr('id');
        
        var cls = $(ths).attr("class");
        if('not-add' == cls){
        	$('#sendText').append('<div class=sending>' + '<span class=name-label userId='+userId+'>' + name + '</span>' + '<span onclick="delUser(this)" class=close-label>&times;</span>' + '</div>');
        	$(ths).attr('class','added-man');
        }
	}
	
	/**刪除收件人**/
	function delUser(ths){
            $(ths).parent('.sending').fadeOut().remove();
            var backName = $(ths).parent().find('.name-label').text();
            
            $('.contact-list').find('li').find("a[class='added-man']").each(function() {
                if(backName == $(this).text()) {
                    $(this).attr('class','not-add');   
                }
            });
	}
var editor;
$(function(){
	
	/**初始化联系人列表**/
	initUserList();
	
	var E = window.wangEditor;
	editor = new E('#simple-editor');
	editor.customConfig.menus = [
	    'bold',  // 粗体
	    'underline',  // 下划线
	    'justify',  // 对齐方式
	    'undo'//,  // 撤销
    ];
	editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
	editor.create();
	
	/**监听粘贴事件**/
	document.addEventListener('paste', function (event) {
	    var isChrome = false;
	    if (event.clipboardData || event.originalEvent) {
	    	
	        //某些chrome版本使用的是event.originalEvent
	        var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
	        if(clipboardData.items){
	            // for chrome
	            var  items = clipboardData.items, len = items.length, blob = null;
	            isChrome = true;
	            for (var i = 0; i < len; i++) {
	                if (items[i].type.indexOf("image") !== -1) {
	                	
	                    //getAsFile() 此方法只是living standard firefox ie11 并不支持
	                    blob = items[i].getAsFile();
	                }
	            }
	            var reader = new FileReader();
	            
	            //base64码显示
	            reader.onload = function (event) {
	        	   
	           // event.target.result 即为图片的Base64编码字符串
	           var base64_str = event.target.result;
	           var img = document.createElement('img');
	           img.src = base64_str;
	           var ptxt = $($("#simple-editor p").last()).html();
	           if(ptxt=='<br>'){
	        	   $($("#simple-editor p").last()).html("");
	           }
	           $($("#simple-editor p").last()).append(img);
            }
            if(blob){
              reader.readAsDataURL(blob);
	        }
	      }
	   }
	});
	
	/**获得焦点事件**/
	$("#title").focus(function(){
		$(this).removeClass('titleInput');
	});
	
	
	/**发送**/
	$("#sendBtn").click();
	
	/**搜索内容**/
	$("#searchValue").change(function(){
		var v = $.trim($(this).val());
		if(v==""){
			initUserList();
		}else{
			initUserList(v);
		}
		
	});
	
	/**搜索联系人**/
	$("#searchBtn").click(function(){
		initUserList($("#searchValue").val());
		
	});
	
	/***重置***/
	$("#resetBtn").click(function(){
		window.location.reload();
	});
});

/**提取联系人列表**/
function extractContacts(){
	var userArr = new Array();
	$("#sendText .sending").each(function(index){
		var span = $(this).find("span[class='name-label']");
		if(span){
			var userId = $(span).attr('userId');
			userArr[index] = userId;
		}
	});
	return userArr;
}

/**提取图片数据**/
function extractContext(json){
		var js = json[0];
    	var children = js.children;
    	var arr = new Array();
    	for(var j=0;j<children.length;j++){
    		var ch = children[j];
    		if(ch instanceof Object){
    			var tag = ch.tag;
    			if(tag=='img'){
    				var attrs = ch.attrs;
    				var attr = attrs[0];
    				var name = attr.name;
    				if(name && name=='src'){
    					var value = attr.value;
    					value = value.replace(',','!!!');
    					arr[j] = value;
    				}
    			}
    		}
    	}
	return arr;
}

function save(){
	var html = editor.txt.html();
	var json = editor.txt.getJSON();
    var imgArr = extractContext(json); //图片列表
    
	var title = $("#communicateTitle").val();//标题
	title = $.trim(title); //沟通主题
	
	var snsType = $("#snsType").val();//沟通类型
	var finishTime = $("#finishTime").val();//完成时间
	
	var componentxyz = $("#componentxyz").val();//构件坐标
	
	console.log(title);
	if(null==title || title==""){
		layer.msg('标题不能为空.');
		return;
	}
	
	if(title.length>30){
		$("#title").addClass('titleInput');
		layer.msg('标题太长.');
		return;
	}
	
	var userArr = extractContacts();//联系人列表
	
	if(null==userArr || userArr.length==0){
		layer.msg('收件人不能为空.');
		return;
	}

	var re = new RegExp("<img.*?>", "g"); // 创建正则表达式对象。
	var repStr = html.match(re); // 在字符串 s 中查找匹配。
	var txt = html.replace(repStr,"");
	$.ajax({
        async: false,
        type: "POST",
        traditional: "true",
        data: {imgArr:imgArr,title:title,userArr:userArr,txt:txt},
        url: "/sns/saveSNS",
        dataType: 'json',
        success: function (data) {
            if(data.success){
            	layer.msg('发送成功.',{
            		  icon: 1,
            		  time: 1000 //2秒关闭（如果不配置，默认是3秒）
            		},function(){
            		reload();
            	});
            }else{
            	layer.msg('发送失败.');
            }
        }
     });
	
}

function reload(){
	location.reload();
}