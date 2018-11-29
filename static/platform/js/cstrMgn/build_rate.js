$(function() {
      // 菜单下拉
      $('.hd-list .form').on('click', function() {
        if ($(this).find('.sl-box').is(":hidden")) {
          $(this).find('.sl-box').show();
        } else {
          $(this).find('.sl-box').hide();
        }
      })
      // 时间日历
        $('#mydatepicker1').dcalendarpicker({
          format:'yyyy-mm-dd'
        }); 
        $('#mydatepicker2').dcalendarpicker({
          format:'yyyy-mm-dd'
        });
        $('.date-icon').click(function() {
        if ($(this).parent().find('.calendar').is(':hidden')){
          $(this).parent().find('.calendar').show();
        } else {
          $(this).parent().find('.calendar').hide();
        }
      })
      search(1);      
    });
	
	function search(arg){
		if(arg<1){
  			$("#project").empty();
  		}
		var params=$('#query').vals();
  		var ajax = new $ax(Feng.ctxPath + "/product/getProjectRate", function (data) {
  			var content = "<ul class=\"build-body clearfix\">";
  			var dataA = new Array();
  			for(var i=0;i<data.length;i++){
  				var dataE = new Array();
  				content+="<li class=\"col-xs-12 col-sm-6 col-md-3\" onClick=\"toNeedDong(this)\" id=\""+data[i].projectId+"\">";
  				content+="<div class=\"box\">";
  				content+="<span class=\"tip\">进度正常</span>";
  				content+="<div id=\"echart"+i+"\" class=\"board2 intoProgress\" style=\"width:100%;height:230px;\"></div>";
  				content+="<p class=\"total\">构件总数："+data[i].compNum+"</p>";
  				content+="<div class=\"info\">";
  				content+="<h3 class=\"title\">"+data[i].projectName+"</h3>";
  				content+="<div class=\"text\">";
  				content+="<p><span class=\"labels\">待计划：</span><span class=\"nums\">"+data[i].restNum+"</span></p>";
  				content+="<p><span class=\"labels\">待生产：</span><span class=\"nums\">"+data[i].planNum+"</span></p>";
  				content+="<p><span class=\"labels\">已生产：</span><span class=\"nums\">"+data[i].productNum+"</span></p>";
  				content+="<p><span class=\"labels\">已发货：</span><span class=\"nums\">"+data[i].sendNum+"</span></p>";
  				content+="</div>";
  				content+="</div>";
  				content+="</div>";
  				content+="</li>";
  				dataE.push(data[i].product);
  				var param1 = {};param1.projectId=data[i].projectId;param1.value=data[i].product;param1.name="已生产"+data[i].productNum;param1.show=true;dataE.push(param1);
  				var param2 = {};param2.value=data[i].planNum;param2.name="待生产";param2.show=false;dataE.push(param2);
  				var param3 = {};param3.value=data[i].sendNum;param3.name="已发货";param3.show=false;dataE.push(param3);
  				var param4 = {};param4.value=data[i].restNum;param4.name="待计划";param4.show=false;dataE.push(param4);
  				dataA.push(dataE);
  			}
  			content += "</ul>";
  			$("#project").append(content);
  			for(var k=0;k<dataA.length;k++){ 
  			  var temp = new Array();
  			  temp.push(dataA[k][1]);
  			  temp.push(dataA[k][2]);
  			  temp.push(dataA[k][3]);
  			  temp.push(dataA[k][4]);  		       		     
  		      new Draw('echart'+k, "生产进度", temp, '生产进度').pie();  		      
  			}
  		}, function (data) {
  	        Feng.error("获取数据失败!");
  	    });
  	    ajax.set(params);
  	    ajax.start();
	}

	function reset(){
		$("#query")[0].reset();
	}
    
	function toNeedDong(arg){
		window.location.href = "/product/toNeedDong?projectId="+$(arg).attr("id");
	}