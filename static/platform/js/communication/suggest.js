var editor;
$(function(){
	
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
	           var ptxt = $($("p").last()).html();
	           if(ptxt=='<br>'){
	        	   $($("p").last()).html("");
	           }
	           $($("p").last()).append(img);
            }
            if(blob){
              reader.readAsDataURL(blob);
	        }
	      }
	   }
	});
	
	
	/**类型选择**/
	$(".span-box").click(function(){
		$(".span-box").each(function(){
			$(this).removeClass("backCls"); 
		});
		$(this).addClass("backCls");
	});
	
	/**获得焦点事件**/
	$("#title").focus(function(){
		$(this).removeClass('titleInput');
	});
	
	
	/**提交**/
	$("#submitBtn").click(function(){
		save(2);
	});
	
	/**保存**/
	$("#saveBtn").click(function(){
		save(1);
	});
	
	/***重置***/
	$("#resetBtn").click(function(){
		window.location.reload();
	});
});

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

function save(state){
	
	var type = null;
	$(".span-box").each(function(){
		var temp  = $(this).attr("type");
		if(temp){
			type = temp;
		}
	});
	
	var html = editor.txt.html();
	var json = editor.txt.getJSON();
    var imgArr = extractContext(json); //图片列表
	var title = $("#title").val();//标题
	title = $.trim(title);
	
	if(null==type || type==""){
		layer.msg('请选择类型..');
		return;
	}
	
	if(null==title || title==""){
		layer.msg('标题不能为空.');
		return;
	}
	
	if(title.length>30){
		$("#title").addClass('titleInput');
		layer.msg('标题太长.');
		return;
	}
	/*
	var userArr = extractContacts();//联系人列表
	
	if(null==userArr || userArr.length==0){
		layer.msg('收件人不能为空.');
		return;
	}*/

	var re = new RegExp("<img.*?>", "g"); // 创建正则表达式对象。
	var repStr = html.match(re); // 在字符串 s 中查找匹配。
	var txt = html.replace(repStr,"");
	$.ajax({
        async: false,
        type: "POST",
        traditional: "true",
        data: {imgArr:imgArr,title:title,txt:txt,snsState:state,snsType:type},
        url: "/sns/saveSNS",
        dataType: 'json',
        success: function (data) {
            if(data.success){
            	layer.msg('提交成功.',{
            		  icon: 1,
            		  time: 1000 //2秒关闭（如果不配置，默认是3秒）
            		},function(){
            		window.location.href = "/communication/online_listen";
            	});
            }else{
            	layer.msg('提交失败.');
            }
        }
     });
}

function reload(){
	location.reload();
}