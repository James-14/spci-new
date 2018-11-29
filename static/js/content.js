// var $parentNode = window.parent.document;

function $childNode(name) {
    return window.frames[name]
}

// tooltips
$('.tooltip-demo').tooltip({
    selector: "[data-toggle=tooltip]",
    container: "body"
});

// 使用animation.css修改Bootstrap Modal
$('.modal').appendTo("body");

$("[data-toggle=popover]").popover();

//折叠ibox
$('.collapse-link').click(function () {
    var ibox = $(this).closest('div.ibox');
    var button = $(this).find('i');
    var content = ibox.find('div.ibox-content');
    content.slideToggle(200);
    button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
    ibox.toggleClass('').toggleClass('border-bottom');
    setTimeout(function () {
        ibox.resize();
        ibox.find('[id^=map-]').resize();
    }, 50);
});

//关闭ibox
$('.close-link').click(function () {
    var content = $(this).closest('div.ibox');
    content.remove();
});

//判断当前页面是否在iframe中
if (top == this) {
    var gohome = '<div class="gohome"><a class="animated bounceInUp" href="' + Feng.ctxPath + '/" title="返回首页"><i class="fa fa-home"></i></a></div>';
    $('body').append(gohome);
}

//animation.css
function animationHover(element, animation) {
    element = $(element);
    element.hover(
        function () {
            element.addClass('animated ' + animation);
        },
        function () {
            //动画完成之前移除class
            window.setTimeout(function () {
                element.removeClass('animated ' + animation);
            }, 2000);
        });
}

//拖动面板
function WinMove() {
    var element = "[class*=col]";
    var handle = ".ibox-title";
    var connect = "[class*=col]";
    $(element).sortable({
            handle: handle,
            connectWith: connect,
            tolerance: 'pointer',
            forcePlaceholderSize: true,
            opacity: 0.8,
        })
        .disableSelection();
};




var showAppDownload=function() {

    $("#qrcode").fadeIn("slow");
};

var hideAppDownload=function() {
    $("#qrcode").fadeOut("slow");
};

// 调用laydate
function calldate(id) {
	 laydate.render({
		 elem:'#' + id
		 ,eventElem: '#' + id + '-icon'
		 ,trigger: 'click'
		 ,calendar: false
		 ,theme: '#357ecc'
		 }) 
}


// 调用laydate
function calldate(id,callBack) {
    laydate.render({
        elem:'#' + id
        ,eventElem: '#' + id + '-icon'
        ,trigger: 'click'
        ,calendar: false
        ,theme: '#357ecc'
        ,done: function(value, date, endDate){//控件选择完毕后的回调---点击日期、清空、现在、确定均会触发。
            console.log(value); //得到日期生成的值，如：2017-08-18
            console.log(date); //得到日期时间对象：{year: 2017, month: 8, date: 18, hours: 0, minutes: 0, seconds: 0}
            console.log(endDate); //得结束的日期时间对象，开启范围选择（range: true）才会返回。对象成员同上。
            if(callBack){
                callBack(value);
            }

        }
    })
}

function calldate_only_year(id) {
	 laydate.render({
		 elem:'#' + id
		 ,calendar: true
		 ,theme: '#357ecc'
		 ,type: 'year'
		 }) 
}

function calldate_only_year_month(id,doneFun) {
	if(null!=doneFun&&doneFun!=undefined){
		laydate.render({
			 elem:'#' + id
			 ,calendar: false
			 ,btns: ['confirm']
			 ,theme: '#357ecc'
			 ,type: 'month'
			 ,value: new Date()	 
			,done:doneFun
		 });
	 }else{
		 laydate.render({
			 elem:'#' + id
			 ,calendar: false
			 ,btns: ['confirm']
			 ,theme: '#357ecc'
			 ,type: 'month'			 
		 });
	 } 
	
}


