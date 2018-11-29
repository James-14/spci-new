		
jQuery(document).ready(function() {
	$('#dragBar').on('mousedown',function(e){
		e.preventDefault();
		dragArea = $('#dragArea');
		$(document).on('mousemove',function(es){	    		
			dragArea.css('width',$(document).width() - es.pageX);
			$('#mainArea').css('marginRight',$(document).width() - es.pageX);
		});
		$('#mainFrame').contents().on('mousemove',function(es){
			dragArea.css('width',$(document).width() - es.pageX);
			$('#mainArea').css('marginRight',dragArea.width());
		});
		$('#dragFrame').contents().on('mousemove',function(es){
			$('#mainArea').css('marginRight',dragArea.width());
			dragArea.css('width',dragArea.width() - es.pageX);
		});
		function offBind() {
			$(document).off('mousemove').off('mousedown');
			$('iframe').contents().off('mousemove').off('mousedown');
		}
		$(document).on('mouseup',function(){
			offBind();
		});
		$('iframe').contents().on('mouseup',function(){
			offBind();
		});
	})
});