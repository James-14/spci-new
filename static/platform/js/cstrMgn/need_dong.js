setTimeout(function() {
		initPage();
}, 500);

function initPage(){
	var ajax = new $ax(Feng.ctxPath + "/product/buildingInfo", function (data) {
		var tpl = $('#list-template').text();
		var tempFn = doT.template(tpl);
		$('#list-content').html(tempFn(data));	
		}, function (data) {
        });
		ajax.set('projectId',$("#projectId").val());
        ajax.start();
}