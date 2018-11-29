function drawComponent(obj,canvasId){
	var canvas = $("#"+canvasId)[0];  
	if(canvas == null)
	    return false;
    var ctx = canvas.getContext("2d");
    ctx.font="15px Calibri";
    for(var i=0;i<obj.pList.length;i++){
    	var xstart = 0, ystart = 0,xend = 0,yend = 0, count = 0,lastX = 0,lastY = 0;
		var ar = obj.pList[i];
    	for(var j=0;j<=ar.length;j++){
			var v;
			var le = ar.length;
			if(j<le){
				v = ar[j];
			}
			var vType = v.cType;
			if(vType==0  || vType==1 ||vType==2 ||vType==4||vType==5||vType==10){
				 if(vType==4)
	    	       	{ctx.beginPath(); 
					 ctx.save();
					 ctx.strokeStyle = "gray";
					 
					
	    	       	}
	    	       	else 
	    	       	 {ctx.beginPath(); 
					 ctx.save();
	    	       	 ctx.strokeStyle = "black";
	    	       	 }

				//如果是最后一笔，则该画线的终点坐标为第一笔的起点坐标
			   if(j==le){
				   xend = lastX;
				   yend = lastY;
			   }else{
				   
				    //获取X坐标值
					var x = parseInt(v.xAxis)+parseInt(v.absoluteX);
					
					//获取Y坐标值，在canvas 中，Y轴的正方向向下，所有这里Y值取反
					var y = -((parseInt(v.yAxis))+parseInt(v.absoluteY));
					
					//如果是第一次循环，则只获取起始X，Y的值，不需要画线
					if(j==0){
						
						//记录起始坐标
						xstart = x;ystart = y;
						lastX = x;lastY = y;
						continue;
					}else{
						
						//画线的终点坐标
						xend = x;yend = y;
					}
			   }
				//英寸数  = 毫米数/25.4
				var ycsXs = xstart/25.4,ycsYs = ystart/25.4,ycsXe = xend/25.4,ycsYe = yend/25.4;
				var xdpi = getDPI()[0],ydpi = getDPI()[1];
				
				//缩放倍数
				var  zoom = 30;
				
				//象素数  = 英寸数*DPI
				var xspx = ycsXs* xdpi/zoom,yspx = ycsYs*ydpi/zoom,xepx = ycsXe* xdpi/zoom,yepx = ycsYe* ydpi/zoom;
				
				//画线
				ctx.moveTo(xspx,yspx+canvas.height);ctx.lineTo(xepx,yepx+canvas.height);
				xstart = xend;ystart = yend;
				
				// ctx.strokeStyle = "red";
				//ctx.fill();//填充
				/* ctx.save();
    	        ctx.beginPath();
    	        if(vType==4)
    	       	 ctx.strokeStyle = "red";
    	       	else 
    	       	 ctx.strokeStyle = "black";*/
				ctx.closePath(); 
			    ctx.stroke();//画线
			    ctx.restore();
			 /*    ctx.restore(); */
			}else if(vType==3){
				
				
				ctx.beginPath(); 
				ctx.save();
   	       	    ctx.strokeStyle = "black";
   	       	    var r = v.radius;
				var arry = drawConvert(parseInt(v.xAxis)+parseInt(v.absoluteX),canvas.height-((parseInt(v.yAxis))+parseInt(v.absoluteY)));
				r = (r/25.4)*xdpi/zoom;
				var startA = v.startA;
				if(startA==null){
					startA = 0;
				}
				var endA = v.endA;
				if(endA==null){
					endA = 360;
				}
				ctx.beginPath();
			    var circle = {
			    	x : arry[0],	//圆心的x轴坐标值
			    	y : arry[1],	//圆心的y轴坐标值
			    	r : r		//圆的半径
			    };
			    //console.log(circle.x+"|"+circle.y+"|"+circle.r);
			    //沿着坐标点(100,100)为圆心、半径为50px的圆的顺时针方向绘制弧线
			    ctx.arc(circle.x, circle.y, Math.abs(circle.r), (startA/180)*Math.PI, (endA/180)*Math.PI, true); 
			   
			    //context.fill();
			   // ctx.closePath();
			   	ctx.closePath(); 
			    ctx.stroke();//画线
			    ctx.restore();
			    
			   //按照指定的路径绘制弧线
			    //ctx.stroke();
			}
			else if(vType==6 || vType==7 ){
				 if(vType==6)
	    	       	{ctx.beginPath(); 
					 ctx.save();
					 ctx.strokeStyle = "red";
					 
					
	    	       	}
	    	       	else 
	    	       	 {ctx.beginPath(); 
					 ctx.save();
	    	       	 ctx.strokeStyle = "blue";
	    	       	 }
				 
				    //获取X坐标值
					var x = parseInt(v.xAxis)+parseInt(v.absoluteX);
					
					//获取Y坐标值，在canvas 中，Y轴的正方向向下，所有这里Y值取反
					var y = -((parseInt(v.yAxis))+parseInt(v.absoluteY));
					
					//如果是第一次循环，则只获取起始X，Y的值，不需要画线
					if(vType==6){
						
						//记录起始坐标
						xstart = x;
						ystart = y;
						xend = x-parseInt(v.radius);
						yend = y;
					}else if(vType==7){
						xstart = x;
						ystart = y;
						xend = x;
						yend = y-parseInt(v.radius);
						
					}
			   
				//英寸数  = 毫米数/25.4
				var ycsXs = xstart/25.4,ycsYs = ystart/25.4,ycsXe = xend/25.4,ycsYe = yend/25.4;
				var xdpi = getDPI()[0],ydpi = getDPI()[1];
				
				//缩放倍数
				
				//象素数  = 英寸数*DPI
				var xspx = ycsXs* xdpi/zoom,yspx = ycsYs*ydpi/zoom,xepx = ycsXe* xdpi/zoom,yepx = ycsYe* ydpi/zoom;
				
				//画线
				ctx.moveTo(xspx,yspx+canvas.height);ctx.lineTo(xepx,yepx+canvas.height);
				xstart = xend;ystart = yend;
				
		
				ctx.closePath(); 
			    ctx.stroke();//画线
			    ctx.restore();
			   ctx.restore(); 
			}
		 
		}
 
    	
    }
}

/**
 * 坐标转换
 */
function drawConvert(x,y){
	var arry = new Array();
	
	//英寸数  = 毫米数/25.4
	var ycsX = x/25.4,ycsY = y/25.4;
	var xdpi = getDPI()[0],ydpi = getDPI()[1];
	
	//缩放倍数
	var  zoom = 30;
	
	//象素数  = 英寸数*DPI
	var xpx = ycsX*xdpi/zoom;
	var ypx =ycsY*ydpi/zoom+350;
	arry[0] = xpx;
	arry[1] = ypx;
	return arry;
}

function getDPI() {
	var arrDPI = new Array;
	if (window.screen.deviceXDPI) {
	arrDPI[0] = window.screen.deviceXDPI;
	arrDPI[1] = window.screen.deviceYDPI;
	}
	else {
	var tmpNode = document.createElement("DIV");
	tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
	document.body.appendChild(tmpNode);
	arrDPI[0] = parseInt(tmpNode.offsetWidth);
	arrDPI[1] = parseInt(tmpNode.offsetHeight);
	tmpNode.parentNode.removeChild(tmpNode); 
	}
	return arrDPI;
}

function cleanCanvas(tarId,sX,sY,eX,eY){
	var canvas = $("#"+tarId)[0];  
	if(canvas == null)
	    return false;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(sX,sY,eX,eY);
}