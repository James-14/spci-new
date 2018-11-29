 
/*让2,3边框高度始终与左边相等；状态灯变色*/
 
 jQuery(document).ready(function() {
	 
	        var myHeight = $('#box1').height();
			console.log('初始高度：'+myHeight);
			$('.st').height(myHeight);
	 
	    $(window).resize(function(){
			var myHeight = $('#box1').height();
			console.log('缩放高度：'+myHeight);
			$('.st').height(myHeight);
		});


        $(".status").hover(function(){
            var color = $(this).css('color');
            $(this).css({
                "background":color,
                "color":"white",
                "cursor":"pointer"
            })
        },function(){
            var color = $(this).css('borderColor');
            $(this).css({
                "background":"white",
                "color":color
            })
        });
		
		  $(".nav li").hover(function(){
            $(this).addClass('active');
        },function(){
             $(this).removeClass('active');
        });
		
    });

 