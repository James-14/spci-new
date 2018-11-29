	jQuery(document).ready(function() {
		$.ajaxPrefilter(function( options, original_Options, jqXHR ) {
			options.async = true;
		});
		
		$(function(){
			$("#nav").load("/pt/inav");
			$("#footer").load("/pt/ifooter"); 
		});
	});