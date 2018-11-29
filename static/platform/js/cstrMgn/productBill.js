   $(function() {
	   initTabNum();
	   initProjectTemplate(0)
	    // tab选项卡切换
	    $('.tabs .item').on('click', function(item, a) {
	      initProjectTemplate($(this).attr("data"))
	      var index = $('.tabs .item').index(this);
	      if (index == 0) {
	        $('.bill-footer').addClass('info-footer')
	        $('.order-ok').show();
	      } else {
	        $('.bill-footer').removeClass('info-footer')
	        $('.order-ok').hide();
	      }
	      $(this).addClass('active').siblings().removeClass('active');
	      $('.tab-cons .item').eq(index).addClass('active').siblings().removeClass('active');
	      $('.main-box .box-item').eq(index).addClass('active').siblings().removeClass('active'); 
	      //adapter();
	    });
	   
   });

   var ProductBill = {
      id: "list-content",
      seItem: null,
      table: null
  };
   
  // 小屏幕菜单选择
  $('.sm-menu').click(function() {
    if ($('.navbar-list').is(':hidden')){
      $('.navbar-list').show();
    } else {
      $('.navbar-list').hide();
    }
  });
  
  // 已完成变色
  $('.btn-box').find('span').each(function(){
	  if($(this).text().indexOf("完成") >= 0) {
		  $(this).css('color','#258dc5');
	  }
  });
  
  function initTabNum(){
	  var ajax = new $ax(Feng.ctxPath + "/product/getProjectBillNum", function (data) {
				$("#totleNum").html(data.total);
				$("#finishNum").html(data.finish);
				$("#productNum").html(data.product);
				$("#preNum").html(data.pre);
		}, function (data) {
			Feng.error("获取订单分类数量数据失败!");
	   });
	  ajax.start();
  }
  
  function initProjectTemplate(arg){
	 var ajax = new $ax(Feng.ctxPath + "/product/getProjectBillData", function (data) {
		if(data==''){
			var content = "<div class=\"item-main white-bg\" style=\"text-align:center;\">暂无订单数据</div>"
			$("#list-content").html(content);
			return;
		}
		var tpl = $('#list-template').text();
		var tempFn = doT.template(tpl);
		$('#list-content').html(tempFn(data));	
		}, function (data) {
			Feng.error("获取项目订单数据失败!");
	    });
	  ajax.set('type',arg);
	  ajax.start();
  }
  
  function showBillDetail(arg1){
	  var url = Feng.ctxPath + "/product/showBillDetail.html?billId="+arg1;
		var index = layer.open({
	        type: 2,
	        title: '查看订单详情',
	        area: ['910px', '550px'], //宽高
	        fix: false, //不固定
	        maxmin: true,
	        content: url
	    });
		ProductBill.layerIndex = index;
  }
  
  function getBackDetail(arg2){	 
	  var tab;
	  $(".tabs .item").each(function(){
		 if($(this).hasClass("active")){
			tab = $(this).attr("data");			
		 }
	  });
	  var url = Feng.ctxPath + "/product/showBillDetail.html?billId="+arg2+"&modify="+1;
		var index = layer.open({
	        type: 2,
	        title: '查看订单详情',
	        area: ['910px', '550px'], //宽高
	        fix: false, //不固定
	        maxmin: true,
	        content: url
     });
	 ProductBill.layerIndex = index;	  
  }
  
  function getBackAll(arg3){
	  var tab;
	  $(".tabs .item").each(function(){
		 if($(this).hasClass("active")){
			tab = $(this).attr("data");			
		 }
	  });
	  var param = {};
	  param.titleId = arg3;
	  param.tabId = tab;
	  var ajax = new $ax(Feng.ctxPath + "/product/backBillAll", function (data) {
			if(data.code == 200){
				Feng.success(data.message);	
				var url = Feng.ctxPath + "/product/productBill?tabId="+tab;
	      		Feng.goTo(url);
			}else{
				Feng.error(data.message);	
			}
	  }, function (data) {
		  	Feng.error("订单全部退回失败!");
	  });
	  ajax.set(param);
	  ajax.start();
  }
  
  