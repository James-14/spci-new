$(document).ready(function() {

	$('#slideNav').click(function(event) {
		$('#top').toggle('fast');
		$('footer').toggle();
		$('.need-top').toggleClass('toTop');
		$(this).parent().toggleClass('getHide');
		$('.need-wider').toggleClass('fullSrc');
		$('.col-md-2').toggle();
		$('.col-md-10').toggleClass('widerArea');
	});
	
});
