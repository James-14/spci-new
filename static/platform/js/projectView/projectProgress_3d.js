$(function(){
	load3DBIM();
});

 function load3DBIM() {
	 var projectId = $("#projectId").val();
	 var building = $("#building").val();
	 console.log(building);
	 document.getElementById("show3DBIM").innerHTML = '<object type="text/html" data="/bim/show_open_models?projectId='+projectId+'&building='+building+'" width="100%" height="100%"></object>';
}