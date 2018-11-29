$(function() {
  $('.list .show dd').show('slow');
	$('.list dl').click(function(){
		$(this).children('dd').slideDown().end().siblings().children('dd').slideUp();
		$(this).children('dt').addClass('icon').end().siblings().children('dt').removeClass();
		$('.list').children('dt').css({background:'url(images/reduce.png) no-repeat 0 0'});
	});
	// $('.list .show').click(function(){
	// 	$(this).children('dt').css({background:'url(images/reduce.png) no-repeat 0 0'});
	// });
	// $('.all-show-btn').click(function(){
	// 	$('.list dl dd').slideDown();
	// 	$('.list dl dt').addClass('icon');
	// 	$('.list .show dt').css({background:'url(images/add.png) no-repeat 0 0'});
	// });
	// $('.all-hide-btn').click(function(){
	// 	$('.list dl dd').slideUp();
	// 	$('.list dl dt').removeClass();
	// 	$('.list .show dt').css({background:'url(images/add.png) no-repeat 0 0'});	
	// });
})