		
jQuery(document).ready(function() {
		/*
		$.ajaxPrefilter(function( options, original_Options, jqXHR ) {
			options.async = true;
		});
		*/
	    $('body').on('click','#contactBtnGroup li:first-child',function(){
	    	/* $('#dialogBox').fadeToggle("800","linear"); */
	    	 $('#dialogBox').fadeIn().addClass('revealIn').removeClass('revealOut');
	    })
	    
	    $('body').on('click','#closeDia',function(){
	    	/* $('#dialogBox').fadeToggle("800","linear"); */
	    	 $('#dialogBox').fadeOut().addClass('revealOut').removeClass('revealIn');
	    })
	    
	    /* 没什么用的加载动画 */
/*	    $('body').prepend("<div class=bouncing-loader-container><div class=bouncing-loader>" +
		"<div></div><div></div><div></div></div></div>");*/
	    
	    $('body').prepend("<div class=rightFm style='display:none'><iframe id='iframeID'></iframe><div id=btnBar>"+
	    		"<span id=closeFmBtn>&times;</span></div><div id=dragBar></div></div>");
	      
	    function fadeOut() {
	    	$('.bouncing-loader-container').fadeOut();
	    }

	    setTimeout(fadeOut, 1000);
	    
	    $('body').on('click','#dialogBox a',function(){
	    	var href = $(this).attr('href');
	    	var frameBox = $('body .rightFm');
	    	frameBox.find('iframe').attr('src',href);
	    	frameBox.show();
	    	frameBox.addClass('clsFm');
	    	$('#dialogBox').fadeOut().addClass('revealOut').removeClass('revealIn');
	    	return false;
	    })
	    
	    $('#closeFmBtn').on('click',function(){
	    	$(this).parent().parent().removeClass("clsFm fullFm");
	    	$(this).parent().parent().toggle();
	    })
	    
	   $('#resizeFmBtn').on('click',function(){
	    	$(this).parent().parent().toggleClass('fullFm');
	    	$(this).toggleClass('smItBtn');
	    })
	    
/*	    $('.rightFm').resizable({
	    	handles: 'n,w,s,e' ,minWidth: 450
	    })*/
	    $('#dragBar').on('mousedown',function(e){
	    	e.preventDefault();
	    	dragFm = $('.rightFm');
	    	$(document).on('mousemove',function(es){	    		
	    		$('.rightFm').css('width',$(document).width() - es.pageX);
	    	});
	    	$('#iframeID').contents().on('mousemove',function(es){
	    		//console.log($(document).width(),es.pageX);
	    		$('.rightFm').css('width',$('.rightFm').width() - es.pageX);
	    	});
	    	$(document).on('mouseup',function(){
	    		$(document).off('mousemove').off('mousedown');
	    		$('#iframeID').contents().off('mousemove').off('mousedown');
	    	})
	    })
	    
			function getYear() {
			var copyright=new Date();
			update=copyright.getFullYear();
			$("#crtime").html("2012-"+ update);	    
			}
	    
	    	setTimeout(getYear,300);
	    	
	    	$(window).resize(getYear);
	    
	});