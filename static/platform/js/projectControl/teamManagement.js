
$(function(){
	var ajax = new $ax(Feng.ctxPath + "/project/getTeamUser", function (data) {
        //console.log(data);
		$("#content").html(data);
    }, function (data) {
        Feng.error("获取数据失败!" + data.responseJSON.message + "!");
    });
    ajax.start();
    
    setTimeout(function(){
    	$('.team-modal .tabs li').on('click', function() {
    		var index = $(this).index();
    		$(this).addClass('active').siblings().removeClass('active');
    		$('.tab-cons .cons').eq(index).show().siblings().hide();
    	})
    	$('.tab-cons .cons').each(function() {
    		$(this).find('.btn-ok').on('click', function() {
    			$(this).parents('.cons').find('.select-list li').each(function() {
    				if ($(this).find('input')[0].checked) {
    					var data = $(this).find('span').text();
    					$('.team td').each(function() {
    						if ($(this).data('name') == 'td2') {
    							$(this).append(data)
    						}
    					})
    				}
    			})
    			$('#myModal').modal('hide');
    		})
    	})
    },800);
    
});

function todoProject(arg){
	$("#project").nextAll().remove();
	var content = "";
	var text = $("#projectS").find("option:selected").text();
	content+="<td class='td2'><b style='margin-left:10px;'>"+text+"</b><input type='hidden' id='projectId' value='"+$(arg).val()+"'/></td>";
	$("#project").after(content);
}


var checkUserFlag=false;//是否选择了用户

function checkUser(val){




	var roleMap = new Map();
	$(".roleCheck").each(function(){
		if(!roleMap.containsKey($(this).attr("name"))){
			roleMap.put($(this).attr("name"),$(this).attr("name"));
		}
	});
	var array = roleMap.keys();
	for(var i=0;i<array.length;i++){
		checkUserFlag=true;
		var temp = array[i];
		var todo = array[i].split("A");
		$("#"+todo[1]).nextAll().remove();

		$("input:checkbox[name='"+temp+"']:checked").each(function(){
			var content = "<b style='margin-left:10px;'>";
			content+= $(this).attr("data-n")+"</b><input type='hidden' name='"+todo[1]+"' value='"+$(this).val()+"'/></td>";
			$("#"+todo[1]).after(content);
		});
	}

	if(array.length<1){
		checkUserFlag=false;
	}

}

function resetUser(){
	$("input[type='checkbox']").each(function(){
		if(this.checked){
			this.checked=false;
		}
	});
}

function saveTeam(){
	var roleMap = new Map();
	var params = new Array();
	var projectId = $("#projectId").val();
	if(null==projectId||projectId==''||projectId==undefined){
		Feng.alert("请选择项目");
		return;
	}

	if(!checkUserFlag){
		Feng.alert("当前team未发生变化，请选择用户后再进行保存");
		return;
	}
	$("span[name='role']").each(function(){
		roleMap.put($(this).attr("id"),$(this).attr("id"));		
	});
	var array = roleMap.keys();
	var warn = "";
	for(var i=0;i<array.length;i++){
		var roleId = array[i];
		var userMap = new Map();
		$("input[name='"+roleId+"']").each(function(){
			userMap.put($(this).val());
		});
		var param = {};
		param.roleId = roleId;
		if(!userMap.isEmpty()){
			param.user = userMap.keys().toString();
		}else{
			warn+= "\""+$("#"+roleId).parent().prev().text()+"\" ";			
		}
		params.push(param);
	}
	if(warn!=""){
		Feng.alert(warn+"没有选择用户");
		return;
	}
	var paramF = {};
	paramF.projectId=projectId;
	paramF.teamParam = JSON.stringify(params);
	var ajax2 = new $ax(Feng.ctxPath + "/project/addProjectTeam", function (data) {
		Feng.success("添加成功!");
		// $('#clearRadio').click();
	}, function (data) {
        Feng.error("组织Team失败!" + data.responseJSON.message + "!");
    });
    ajax2.set(paramF);
    ajax2.start(); 
}