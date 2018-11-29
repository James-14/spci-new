/*!
 * jSany JavaScript Library
 *
 * @requires jQuery.js
 *
 * @version v1.0.0
 *
 * @author zhuns
 *
 * Date: 2013-2-17
 */
(function($){
    /**
     * @author zhuns
     * @namespace SY
     * @description 三一软件中心JavaScript库命名空间;高德地图（AMap）相关对象、操作集合对象
     */
    $.SY = {};
    $.SY.version = "1.0.0";
    $.SY.author = "zhuns";

    /**
     * @namespace maps
     * @description maps命名空间，用于地图相关操作等
     */
    $.SY.maps = {};
    /**
     * @description 地图对象
     * @type {{}} object
     */
    $.SY.maps.mapObj = {};
    /**
     * @description 地图缩放级别
     * @type {number} default value 11
     */
    $.SY.maps.zoom = 11;
    /**
     * @description 最大的聚合级别，默认大于17级不聚合
     * @type {number} default value 17
     */
    $.SY.maps.maxZoom = 17;
    /**
     * @description 地图中心
     * @type {{}}
     */
    $.SY.maps.center = {
    		//lng:112.73418,lat:25.754164 //桂阳
    		lng:113.0210781,lat:28.2015000 //长沙
    		//lng:114.193018,lat:22.597072//深圳
    };
    /**
     * @description  鼠标工具
     * @type {{}}
     */
    $.SY.maps.mouseTool;
    /**
     * @description 拖拽导航插件
     * @type {{}}
     */
    $.SY.maps.dragRoute;
    /**
     * @description 点聚合插件
     * @type {{}}
     */
    $.SY.maps.markerClusterer;
    /**
     * @description 地图切换插件
     * @type {{}}
     */
    $.SY.maps.mapType;
    /*
    	定义一个全局hashmap存放地图上添加的覆盖物，主要是为了解决1.3版本后不能根据ID获取到相对应的对象
     */
    var overlaysMap = {};
    /*
    	定义一个全局hashmap存放地图上添加的点聚合覆盖物，主要是为了解决1.3版本后不能根据ID获取到相对应的对象
     */
    var overlaysClustererMap = {};
    /**
     * @description 地图初始化
     * @param mapProperties
     * {
     * container:HTML div ID(必须项),
     * zoom:放大级别(默认13),
     * centerFlag：true：以center的经纬度作为默认中心，false或不填：取默认中心
     * center:{lng:经度,lat:纬度} 地图中心经纬度(不设置center就默认中心)
     * markerClusterer:true表示添加点聚合插件；false或不填：表示不添加
     * addType:true表示添加地图类型切换插件；false或不填：表示不添加
     * features: 表示地图显示内容，默认都显示new Array("bg","building","road","point")
     * }
     */
    $.SY.maps.init = function(mapProperties){
    	$.SY.maps.mapObj  = null;
        overlaysMap = {};
        overlaysClustererMap = {};
        $.SY.maps.mouseTool=null;
        $.SY.maps.dragRoute=null;
        $.SY.maps.markerClusterer=null;
        $.SY.maps.mapType=null;
        var opt = {
                level : $.SY.maps.zoom,// 设置地图缩放级别
                 //center :  new AMap.LngLat( $.SY.maps.center.lng, $.SY.maps.center.lat),// 设置地图中心点
                 doubleClickZoom : true,// 双击放大地图
                 scrollWheel : true, // 鼠标滚轮缩放地图
                 dragEnable : true,
                 resizeEnable : true
             };
        if(typeof mapProperties.zoom !== 'undefined'){
        	opt.level = mapProperties.zoom;
        }
    	if(mapProperties.centerFlag&&typeof mapProperties.center !== 'undefined'){
            var lng = mapProperties.center.lng;
            var lat = mapProperties.center.lat;
            if(typeof lng !== 'undefined'&&typeof lat !== 'undefined'&&""!==lng&&""!==lat){
            	opt.center = new AMap.LngLat(lng, lat);// 设置地图中心点
            }else{
            	opt.center = new AMap.LngLat($.SY.maps.center.lng, $.SY.maps.center.lat);// 设置默认地图中心点
            }
    	}else{
    		opt.center = new AMap.LngLat($.SY.maps.center.lng, $.SY.maps.center.lat);// 设置默认地图中心点
    	}
    	if(typeof mapProperties.features !== 'undefined'){
        	opt.features = mapProperties.features;
        }
        $.SY.maps.mapObj = new AMap.Map(mapProperties.container, opt);
        $.SY.maps.mapObj.plugin(["AMap.ToolBar", "AMap.OverView", "AMap.Scale"], function() {
            var toolbar = new AMap.ToolBar();
            $.SY.maps.mapObj.addControl(toolbar);
            var overview = new AMap.OverView(); // 加载鹰眼
            $.SY.maps.mapObj.addControl(overview);
            var scale = new AMap.Scale(); // 加载比例尺
            $.SY.maps.mapObj.addControl(scale);
        });
        // 鼠标工具
        $.SY.maps.mapObj.plugin(["AMap.MouseTool"], function() {
            $.SY.maps.mouseTool = new AMap.MouseTool($.SY.maps.mapObj);
        });
        
        // 点聚合插件：大于maxZoom时不聚合
        if(mapProperties.markerClusterer){
	        $.SY.maps.mapObj.plugin(["AMap.MarkerClusterer"], function() {
	            $.SY.maps.markerClusterer = new AMap.MarkerClusterer($.SY.maps.mapObj,[],{maxZoom:$.SY.maps.maxZoom});
	        });
        }   
        
        //添加地图类型切换插件
        if(mapProperties.addType){
            $.SY.maps.mapObj.plugin(["AMap.MapType"],function(){
                //地图类型切换
                $.SY.maps.mapType = new AMap.MapType({defaultType:0});//初始状态使用2D地图
                $.SY.maps.mapObj.addControl( $.SY.maps.mapType);
            });
        }
    };
    /**
     * lng经度，必填
     * lat纬度，必填
     * @description 改变默认中心点位置
     */
    $.SY.maps.changeDefaultCenter = function(lng,lat){
    	 if(typeof lng !== 'undefined'&&typeof lat !== 'undefined'&&""!==lng&&""!==lat){
        	 $.SY.maps.center.lng = lng;
        	 $.SY.maps.center.lat = lat;
    	}
    };
    /**
     * @description 激活拉框放大
     */
    $.SY.maps.activeRectZoomIn = function(){
        var zoominOptions={
            strokeStyle:"dashed",
            strokeColor:"#FF33FF",
            fillColor:"#FF99FF",
            fillOpacity:0.5,
            strokeOpacity:1,
            strokeWeight:2
        };
        $.SY.maps.mouseTool.rectZoomIn(zoominOptions);
    };
    /**
     * @description 激活拉框缩小
     */
    $.SY.maps.activeRectZoomOut = function(){
        var zoomoutOptions={
            strokeStyle:"dashed",
            strokeColor:"#FF33FF",
            fillColor:"#FF99FF",
            fillOpacity:0.5,
            strokeOpacity:1,
            strokeWeight:2
        };
        $.SY.maps.mouseTool.rectZoomOut(zoomoutOptions);
    };
    /**
     * @description 激活距离量算
     */
    $.SY.maps.activeRule = function(){
        var lineOptions={
            strokeStyle:"solid",
            strokeColor:"#FF33FF",
            strokeOpacity:1,
            strokeWeight:2
        };
        $.SY.maps.mouseTool.rule(lineOptions);
    };
    /**
     * @description 关闭鼠标工具
     */
    $.SY.maps.closeMouseTool = function(){
        $.SY.maps.mouseTool.close();
    };
    /**
     * @description 激活画点控件
     */
    $.SY.maps.activeDrawPointController = function(){
        $.SY.maps.mouseTool.marker();
    };
    /**
     * @description 冻结画点控件
     */
    $.SY.maps.deactiveDrawPointController = function( listener,clearFlag ){
    	if(typeof clearFlag !== 'undefined'){
            $.SY.maps.mouseTool.close(clearFlag);
    	}else{
            $.SY.maps.mouseTool.close();
    	}
        //$.SY.maps.mapObj.unbind( $.SY.maps.mouseTool, "draw", listener);
        AMap.event.removeListener(listener);
    };
    /**
     * @description 绑定画点完成监听事件
     * @param listener
     */
    $.SY.maps.bindDrawPointCompleteListener = function( listener ){
       // $.SY.maps.mapObj.bind( $.SY.maps.mouseTool, "draw", listener);
        AMap.event.addListener($.SY.maps.mouseTool, "draw", listener);
    };
    /**
     * @description 激活画线控件
     */
    $.SY.maps.activeDrawLineController = function(){
        $.SY.maps.mouseTool.polyline();
    };
    /**
     * @description 冻结画线控件
     */
    $.SY.maps.deactiveDrawLineController = function( listener,clearFlag ){
    	if(typeof clearFlag !== 'undefined'){
            $.SY.maps.mouseTool.close(clearFlag);
    	}else{
            $.SY.maps.mouseTool.close();
    	}
        //$.SY.maps.mapObj.unbind( $.SY.maps.mouseTool, "draw", listener);
        AMap.event.removeListener(listener);
    };
    /**
     * @description 绑定画线完成监听事件
     * @param listener
     */
    $.SY.maps.bindDrawLineCompleteListener = function( listener ){
        //$.SY.maps.mapObj.bind( $.SY.maps.mouseTool, "draw", listener);
        AMap.event.addListener($.SY.maps.mouseTool, "draw", listener);
    };
    /**
     * @description 激活画圆控件
     */
    $.SY.maps.activeDrawCircleController = function(){
        $.SY.maps.mouseTool.circle();
    };
    /**
     * @description 冻结画圆控件
     */
    $.SY.maps.deactiveDrawCircleController = function( listener,clearFlag ){
    	if(typeof clearFlag !== 'undefined'){
            $.SY.maps.mouseTool.close(clearFlag);
    	}else{
            $.SY.maps.mouseTool.close();
    	}
        //$.SY.maps.mapObj.unbind( $.SY.maps.mouseTool, "draw", listener);
        AMap.event.removeListener(listener);
    };
    /**
     * @description 绑定画圆监听事件，当圆画完后，执行监听函数
     * @param listener 圆画完后的监听函数 listener包含一个参数：drawGeometryArgs
     * 通过 drawGeometryArgs.feature.geometry.bounds获取圆的半径
     */
    $.SY.maps.bindDrawCircleCompletedListener = function( listener ){
        //$.SY.maps.mapObj.bind( $.SY.maps.mouseTool, "draw", listener);
        AMap.event.addListener($.SY.maps.mouseTool, "draw", listener);
    };
    /**
     * @description 激活画矩形框控件
     */
    $.SY.maps.activeDrawRectangleController = function(){
        $.SY.maps.mouseTool.rectangle();
    };
    /**
     * @description 冻结画矩形框控件
     */
    $.SY.maps.deactiveDrawRectangleController = function( listener,clearFlag ){
    	if(typeof clearFlag !== 'undefined'){
            $.SY.maps.mouseTool.close(clearFlag);
    	}else{
            $.SY.maps.mouseTool.close();
    	}
        //$.SY.maps.mapObj.unbind( $.SY.maps.mouseTool, "draw", listener);
        AMap.event.removeListener(listener);
    };
    /**
     * @description 绑定画矩形监听事件，当矩形框画完后，执行监听函数
     * @param listener 矩形画完后的监听函数 listener包含一个参数：drawGeometryArgs
     * 通过 drawGeometryArgs.feature.geometry.bounds获取矩形边框
     * 再通过bounds获取left(左边框经度)，right(右边框经度)，top(上边框纬度)，bottom(下边框纬度)
     */
    $.SY.maps.bindDrawRectangleCompletedListener = function( listener ){
        //$.SY.maps.mapObj.bind( $.SY.maps.mouseTool, "draw", listener);
        AMap.event.addListener($.SY.maps.mouseTool, "draw", listener);
    };
    /**
     * @description 激活画多边形控件
     */
    $.SY.maps.activeDrawPolygonController = function(){
        $.SY.maps.mouseTool.polygon();
    };
    /**
     * @description 冻结画多边形控件
     */
    $.SY.maps.deactiveDrawPolygonController = function( listener,clearFlag ){
    	if(typeof clearFlag !== 'undefined'){
            $.SY.maps.mouseTool.close(clearFlag);
    	}else{
            $.SY.maps.mouseTool.close();
    	}
        //$.SY.maps.mapObj.unbind( $.SY.maps.mouseTool, "draw", listener);
        AMap.event.removeListener(listener);
    };
    /**
     * @description 绑定画多边形监听事件，当多边形画完后，执行监听函数
     * @param listener 多边形画完后的监听函数 listener包含一个参数：drawGeometryArgs
     * 通过 drawGeometryArgs.feature.geometry.components;获取component数组，遍历每一个component，
     * component包含components属性，为经纬度点序列
     */
    $.SY.maps.bindDrawPolygonCompletedListener = function( listener ){
        //$.SY.maps.mapObj.bind( $.SY.maps.mouseTool, "draw", listener);
        AMap.event.addListener($.SY.maps.mouseTool, "draw", listener);
    };
    /**
     * @description 解除绑定事件
     * @param listener
     */
    $.SY.maps.unbindListener = function( listener ){
        //$.SY.maps.mapObj.unbind( $.SY.maps.mouseTool, "draw", listener);
        AMap.event.removeListener(listener);
    };
    /**
     * @description 添加指定的监听事件，当执行完后，执行监听函数
     * @param eventName 监听事件名
     * @param listener 监听函数
     */
    $.SY.maps.addEventListener = function(eventName,listener){
    	 AMap.event.addListener($.SY.maps.mapObj,eventName,listener); 
    };
    /**
     * @description 设置地图中心点及zoom级别
     * @param lng 中心点经度
     * @param lat 中心点纬度
     * @param zoom 缩放级别
     */
    $.SY.maps.setCenter = function(lng,lat,zoom){
    	if(typeof lng !== 'undefined'&&typeof lat !== 'undefined'&&""!==lng&&""!==lat){
	        var centerObj = new AMap.LngLat(lng, lat);
	        $.SY.maps.mapObj.setZoomAndCenter(zoom, centerObj);
    	}
    };
    /**
     * @description 平移地图中心位置到指定的经纬度点
     * @param lng 经度
     * @param lat 纬度
     */
    $.SY.maps.panTo = function(lng,lat){
    	if(typeof lng !== 'undefined'&&typeof lat !== 'undefined'&&""!==lng&&""!==lat){
	        var center = new AMap.LngLat(lng, lat);
	        $.SY.maps.mapObj.panTo(center);
    	}
    };
    /**
     * @description 根据id选择Marker点，平移到指定对象
     */
    $.SY.maps.panToById = function(id) {
    	var selMarker = $.SY.maps.mapObj.getOverlays(id);
    	if (selMarker !== undefined) {
    		$.SY.maps.panTo(selMarker.getPosition().lng,selMarker.getPosition().lat);
    	}
    };
    /**
     * @description 平移地图中心自适应大小
     */
    $.SY.maps.setFitView = function(){
    	$.SY.maps.mapObj.setFitView();
    };  
    /**
     * @description 按城市设置地图中心点
     */
    $.SY.maps.setCity = function(cityName){
    	$.SY.maps.mapObj.setCity(cityName);
    }; 
    /**
     * @description 获取地图放大级别
     * @returns:放大级别
     */
    $.SY.maps.getZoom = function(){
        return $.SY.maps.mapObj.getZoom();
    };
    /**
     * @description 设置地图放大级别
     * @returns:放大级别
     */
    $.SY.maps.setZoom = function(zoom){
        $.SY.maps.mapObj.setZoom(zoom);
    };
    /**
     * @description 获取地图范围
     * @returns {{
     *     left:xxx(矩形左边框经度),
     *     right:xxx(矩形右边框经度),
     *     top:xxx(矩形上边框纬度),
     *     bottom:xxx(矩形下边框纬度)
     * }}
     */
    $.SY.maps.getBounds = function(){
        var extents = $.SY.maps.mapObj.getBounds();
        var bounds = {
            left:extents.getSouthWest().getLng(),
            right:extents.getNorthEast().getLng(),
            top:extents.getNorthEast().getLat(),
            bottom:extents.getSouthWest().getLat()
        };
        return bounds;
    };
    /**
     * @description 设置地图范围
     * @returns {{
     *     left:xxx(矩形左边框经度),
     *     right:xxx(矩形右边框经度),
     *     top:xxx(矩形上边框纬度),
     *     bottom:xxx(矩形下边框纬度)
     * }}
     */
    $.SY.maps.setBounds = function(bounds){
    	 $.SY.maps.mapObj.setBounds(bounds);
    };
    /**
     * @description 获取当前视野并设置为Map的限制区域，设定区域限制后，传入参数为限制的Bounds,地图仅在区域内可拖拽
     * @returns {{
     *     left:xxx(矩形左边框经度),
     *     right:xxx(矩形右边框经度),
     *     top:xxx(矩形上边框纬度),
     *     bottom:xxx(矩形下边框纬度)
     * }}
     */
    $.SY.maps.setLimitBounds = function(){
    	 $.SY.maps.mapObj.setLimitBounds($.SY.maps.mapObj.getBounds());
    };
    /**
     * @description 判断给定经纬度点，是否在地图范围内
     * @param lngLat
     * {
     * lng:经度,
     * lat:纬度
     * }(必须)
     * @returns {boolean} 在地图范围内，返回true；否则返回false
     */
    $.SY.maps.inMapBounds = function(lngLat){
        var bounds = $.SY.maps.mapObj.getBounds();
        var point =new AMap.LngLat(lngLat.lng, lngLat.lat);
        return bounds.contains(point);
    };
    /**
     * @description 设置地图上显示的元素种类，支持bg（地图背景）、point（兴趣点）、road（道路）、building（建筑物）
     * * @param features
     * ["bg","point"...](必须)
     */
    $.SY.maps.setFeatures = function(features){
    	 $.SY.maps.mapObj.setFeatures(features);
    };
    /**
     * @description 获取两点之间的距离（米）
     * @param startLngLat
     * {
     *  lng:经度,
     *  lat:纬度
     * }(必须)
     * @param endLngLat
     * {
     * lng:经度,
     * lat:纬度
     * }(必须)
     * @returns {number}
     */
    $.SY.maps.getDistance = function(startLngLat,endLngLat){
        var distance = 0;
        var startLngLatObj =  new AMap.LngLat(startLngLat.lng,startLngLat.lat);
        var endLngLatObj = new AMap.LngLat(endLngLat.lng,endLngLat.lat);
        distance = startLngLatObj.distance(endLngLatObj);
        return distance;
    };

    /**
     * @description 在地图上添加marker点
     * @param markerOpts
     * {
     * lng:经度（必须）,
     * lat:纬度(必须),
     * url:marker点图标的URL(必须),
     * id：标识一个对象(必须),
     * offx:marker点图标偏移x方向值，左移为负数（必须），根据图片大小调整，默认是左上角对齐位置点,(一般不带文字的为-图片宽一半，
     * 带文字的需要具体调试：譬如文字不建议放在左边  文字在左left 需要根据文字长度动态控制；文字在右right  offx不再变 )
     * offy:marker点图标偏移y方向值，上移为负数(必须)，根据图片大小调整,(一般不带文字的为-图片高一半，
     * 带文字的需要具体调试：譬如文字在上top offy-20 ； 文字在下bottom  offy不再变)
     * rotation:marker点图标的旋转方向(必须:顺时针方向0为正北),
     * label:marker点的label文字(可选),
     * labelPos:marker点的label文字展示位置 默认是在图片上top（top，bottom，left，right）
     * imgWidth:marker点的label文字展示控制（labelPos为left或right时，需要定义图片和文字的展示宽度）(可选),
     * labelWidth:marker点的label文字展示控制（labelPos为left或right时，需要定义图片和文字的展示宽度）（可选),
     * fontColor:label字体的颜色(可选),
     * popupContent 如果有内容，则有左键菜单  （可选,html格式),
     * popupOffx : 弹出框偏转x  (可选，有弹出框时必填)   t
     * popupOffy :   弹出框偏转y  (可选，有弹出框时必填)
     * popupWidth : 弹出框宽度  (可选，有弹出框时必填)
     * popupHeight :  弹出框高度   (可选，有弹出框时必填)
     * menuContent:如果有内容，则有右键菜单 （可选,html格式),
     * replaceFlag:是否需要点击后替换图片
     * urlAfterReplace:点击后图片需要替换
     * offxAfterReplace:偏移x方向值
     * offyAfterReplace:偏移y方向值
     * }
     */
    $.SY.maps.addMarker = function(markerOpts){
        var lng = markerOpts.lng;
        var lat = markerOpts.lat;
        var url = markerOpts.url;
        var offx = (typeof markerOpts.offx !== 'undefined') ? markerOpts.offx : 0;
        var offy = (typeof markerOpts.offy !== 'undefined') ? markerOpts.offy : 0;
        var rotation = (typeof markerOpts.rotation !== 'undefined') ? markerOpts.rotation : 0;
        var imgWidth = (typeof markerOpts.imgWidth !== 'undefined') ? markerOpts.imgWidth : "20%";//左右展示label时才有
        var labelWidth = (typeof markerOpts.labelWidth !== 'undefined') ? markerOpts.labelWidth : "75%";
        var id = (typeof markerOpts.id !== 'undefined') ? markerOpts.id : "";
        var label = (typeof markerOpts.label !== 'undefined') ? markerOpts.label : "";
        var fontColor = (typeof markerOpts.fontColor !== 'undefined') ? markerOpts.fontColor : "#000000";
        var fontSize = (typeof markerOpts.fontSize !== 'undefined') ? markerOpts.fontSize : 20;
        var fontWeight = (typeof markerOpts.fontWeight !== 'undefined') ? markerOpts.fontWeight : "bold";
        var fontFamily = (typeof markerOpts.fontFamily !== 'undefined') ? markerOpts.fontFamily : "Arial";
        var backgroundColor = (typeof markerOpts.backgroundColor !== 'undefined') ? markerOpts.backgroundColor : "none";
        var borderColor = (typeof markerOpts.borderColor !== 'undefined') ? markerOpts.borderColor : "black";

        var style =  "white-space: nowrap;overflow:hidden;float:left;color:"+fontColor+";font-size:"+fontSize+";font-family:"+fontFamily+";font-weight:"+fontWeight+";background-color: "
            +backgroundColor+";border-style: solid;border-width: 1px; border-color:"+borderColor+";";

        var point = new AMap.LngLat(lng, lat);
        var content =    "<img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'>" ;
        if(""!=label) {
            if(markerOpts.labelPos=="right"){   //默认是显示在上面
                content =  "<div syle='overflow:auto;'><div style='float:left;width: "+imgWidth+";'><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div><div style='float:left;width: "+labelWidth+";'><span style='"+style+"'>" + label + "</span></div></div>";
            }else  if(markerOpts.labelPos=="left"){
                content =  "<div syle='overflow:auto;'><div style='float:left;width: "+labelWidth+";'><span style='"+style+"'>" + label + "</span></div><div style='float:left;width:  "+imgWidth+";'><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div></div>";
            }else if(markerOpts.labelPos=="bottom"){
                content =  "<div syle='overflow:auto;'><div><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div><div><span style='"+style+"'>" + label + "</span></div></div>";
            }else{
                content =  "<div syle='overflow:auto;'><div><span style='"+style+"'>" + label + "</span></div><div><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div></div>";
            }
        }
        var marker = new AMap.Marker({
            id : id,
            position :   point,
            //angle : rotation,   //如果这是这个  展示的文字和图片都会旋转
            offset : new AMap.Pixel(offx, offy),
            icon : url,
            content :content  ,
            autoRotation:true
        });
        marker.setMap($.SY.maps.mapObj);
        //如果带了ID，则存储到全局变量中
        if(id!==""){
            overlaysMap[id] = marker;
        }
        //$.SY.maps.mapObj.addOverlays(marker);
        //初始化左右键弹出窗口
        if(markerOpts.menuContent){  //如果有右键菜单
            $.SY.maps.onFeatureSelectAndRightPopup(markerOpts,marker);
        }else{
            $.SY.maps.onFeatureSelect(markerOpts,marker);
        }
    };
    /**
     * @description 根据id更新在地图上的marker点图标
     * @param markerOpts
     * {
     * url:marker点图标的URL(必须),
     * id：标识一个对象(必须),
     * }
     */
    $.SY.maps.updateMarkerURL = function(markerOpts){ 
    	var id = (typeof markerOpts.id !== 'undefined') ? markerOpts.id : "";
        var url = markerOpts.url;
        var rotation = (typeof markerOpts.rotation !== 'undefined') ? markerOpts.rotation : 0;
        var imgWidth = (typeof markerOpts.imgWidth !== 'undefined') ? markerOpts.imgWidth : "20%";//左右展示label时才有
        var labelWidth = (typeof markerOpts.labelWidth !== 'undefined') ? markerOpts.labelWidth : "75%";
	    var label = (typeof markerOpts.label !== 'undefined') ? markerOpts.label : "";
        var fontColor = (typeof markerOpts.fontColor !== 'undefined') ? markerOpts.fontColor : "#000000";
        var fontSize = (typeof markerOpts.fontSize !== 'undefined') ? markerOpts.fontSize : 20;
        var fontWeight = (typeof markerOpts.fontWeight !== 'undefined') ? markerOpts.fontWeight : "bold";
        var fontFamily = (typeof markerOpts.fontFamily !== 'undefined') ? markerOpts.fontFamily : "Arial";
        var backgroundColor = (typeof markerOpts.backgroundColor !== 'undefined') ? markerOpts.backgroundColor : "none";
        var borderColor = (typeof markerOpts.borderColor !== 'undefined') ? markerOpts.borderColor : "black";

        var style =  "white-space: nowrap;overflow:hidden;float:left;color:"+fontColor+";font-size:"+fontSize+";font-family:"+fontFamily+";font-weight:"+fontWeight+";background-color: "
            +backgroundColor+";border-style: solid;border-width: 1px; border-color:"+borderColor+";";

        var content =    "<img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'>" ;
        if(""!=label) {
            if(markerOpts.labelPos=="right"){   //默认是显示在上面
                content =  "<div syle='overflow:auto;'><div style='float:left;width: "+imgWidth+";'><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div><div style='float:left;width: "+labelWidth+";'><span style='"+style+"'>" + label + "</span></div></div>";
            }else  if(markerOpts.labelPos=="left"){
                content =  "<div syle='overflow:auto;'><div style='float:left;width: "+labelWidth+";'><span style='"+style+"'>" + label + "</span></div><div style='float:left;width:  "+imgWidth+";'><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div></div>";
            }else if(markerOpts.labelPos=="bottom"){
                content =  "<div syle='overflow:auto;'><div><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div><div><span style='"+style+"'>" + label + "</span></div></div>";
            }else{
                content =  "<div syle='overflow:auto;'><div><span style='"+style+"'>" + label + "</span></div><div><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div></div>";
            }
        }
        if(id!==""){
        	   var selected = overlaysMap[id];
               if (selected !== undefined) { 
            		var selCon = selected.getContent();
            	   	if(selCon!=content){
	            	    selected.setContent(content);  
	               		overlaysMap[id] = selected;
            	   	}
               }
        }
    };
    /**
     * @description 根据id更新在地图上的marker点的位置
     * @param markerOpts
     * {
     * id：标识一个对象(必须),
     * lng:经度（必须）,
     * lat:纬度(必须),
     * }
     */
    $.SY.maps.updateMarkerPosition = function(markerOpts){ 
    	var id = (typeof markerOpts.id !== 'undefined') ? markerOpts.id : "";
    	var lng = markerOpts.lng;
        var lat = markerOpts.lat;
        var openWhenAdd = markerOpts.openWhenAdd;
        var point = new AMap.LngLat(lng, lat);
        if(id!==""){
        	   var selected = overlaysMap[id];
               if (selected !== undefined) { 
            	   	var selPos = selected.getPosition();
            	   	if(selPos!=point){
            	   		selected.setPosition(point);
                		overlaysMap[id] = selected;//更新位置
                		if(openWhenAdd){//如果必须要冒泡的则冒泡
                	   		AMap.event.trigger(selected, "click");
                	   	}else{
                	   		var extData =  selected.getExtData();//如果已经是冒泡的则照样冒泡
    	             		if (extData !== undefined&&extData.reClicked==true) {
    	             			AMap.event.trigger(selected, "click");
    	             		}
                	   	}
            	   	}else{
            	   		if(openWhenAdd){//如果必须要冒泡的则冒泡
                	   		AMap.event.trigger(selected, "click");
                	   	}
            	   	}
               }
        }
    };
    /**
     * @description 添加多个marker点
     * @param markerOptsArray markerOpts数组，markerOpts参见addMarker函数
     */
    $.SY.maps.addMarkers = function(markerOptsArray){
        var optsArray = markerOptsArray;
        var optsLen = optsArray.length;
        for( var i = optsLen-1 ; i >= 0 ; i -= 1 ){
            $.SY.maps.addMarker(optsArray[i]);
        }
    };
    /**
     * @description 在地图上添加线
     * @param lineOpts
     * {
     * points:经纬度对象点数组(必须：[{lng:xxx,lat:xxx},……]),
     * id：标识一个对象(必须),
     * label：如果有label则同时有labelId
     * strokeColor:线颜色(默认值：#FF0000)
     * strokeWidth:线宽度(默认值：2)
     * strokeOpacity:线透明度(默认值：0.4)
     * fontColor:label字体颜色（默认值：#000000）
     * fontSize:label字体大小（默认值：16px）
     * fontFamily:label字体格式（默认值：SimHei）
     * }
     */
    $.SY.maps.addLine = function(lineOpts){
        var points = lineOpts.points;
        var mapPoints = [];
        for( var i = 0 ; i < points.length ; ){
            mapPoints.push( new AMap.LngLat(points[i].lng, points[i].lat));
            i = i+1;
        }
        var id = (typeof lineOpts.id !== 'undefined') ? lineOpts.id : "";
        var strokeColor = (typeof lineOpts.strokeColor !== 'undefined') ? lineOpts.strokeColor : "#FF0000";
        var strokeWidth = (typeof lineOpts.strokeWidth !== 'undefined') ? lineOpts.strokeWidth : 2;
        var strokeOpacity = (typeof lineOpts.strokeOpacity !== 'undefined') ? lineOpts.strokeOpacity : 0.4;
        var strokeStyle = (typeof lineOpts.strokeStyle !== 'undefined') ? lineOpts.strokeStyle :  "solid";
        var fontColor = (typeof lineOpts.fontColor !== 'undefined') ? lineOpts.fontColor : "#000000";
        var fontSize = (typeof lineOpts.fontSize !== 'undefined') ? lineOpts.fontSize : "16px";
        var fontFamily = (typeof lineOpts.fontFamily !== 'undefined') ? lineOpts.fontFamily : "SimHei";
        var fontWeight = (typeof lineOpts.fontWeight !== 'undefined') ? lineOpts.fontWeight : "bold";
        var backgroundColor = (typeof lineOpts.backgroundColor !== 'undefined') ? lineOpts.backgroundColor : "none";
        var borderColor = (typeof lineOpts.borderColor !== 'undefined') ? lineOpts.borderColor : "black";

        var style = "color:"+fontColor+";font-family:"+fontFamily+";font-weight:"+fontWeight+";font-size:"+fontSize+";background-color:"
            +backgroundColor+";border-style: solid;border-width: 1px; border-color:"+borderColor+";";

        var polyline = new AMap.Polyline( {
            id : id,
            path : mapPoints,
            strokeColor : strokeColor,
            strokeWeight : strokeWidth,
            strokeOpacity : strokeOpacity,
            strokeStyle : strokeStyle// 线样式
            //strokeDasharray : [ 10, 5 ]
        });
        polyline.setMap($.SY.maps.mapObj);
        //$.SY.maps.mapObj.addOverlays(polyline);
        //显示名称
        if(lineOpts.label&&lineOpts.label!=""){
            var path = mapPoints;
            var lablePoint=new AMap.LngLat(path[0].lng,path[0].lat);
            var lineMarker = new AMap.Marker({
                position : lablePoint,
                id : "lable_"+id,
                offset:new AMap.Pixel(0,0),
                content:"<div><span style="+style+"><nobr>"+lineOpts.label+"</nobr></span></div>"
            });
            lineMarker.setMap($.SY.maps.mapObj);
            //$.SY.maps.mapObj.addOverlays(lineMarker);
        }

        if(lineOpts.editFlag==true){    //如果编辑标识是true则折线是可编辑的
           //构造折线编辑对象，并开启折线的编辑状态
           $.SY.maps.mapObj.plugin(["AMap.PolyEditor"],function(){
               $.SY.maps.polylineEditor = new AMap.PolyEditor( $.SY.maps.mapObj,polyline);
               $.SY.maps.polylineEditor.open();
           });
        }
        //如果带了ID，则存储到全局变量中
        if(id!==""){
            overlaysMap[id] = polyline;
            overlaysMap["lable_"+id] = lineMarker;
        }
    };
    /**
     * @description 在地图上添加多边形
     * @param polygonOpts
     * {
     * points:经纬度点对象数组(必须：[{lng:xxx,lat:xxx},……]),
     * id：标识一个对象(必须),
     * label：如果有label则同时有labelId
     * fillColor:多边形填充色(默认值：#EE9900)
     * fillOpacity:多边形填充色透明度(默认值：0)
     * strokeColor:多边形边框颜色(默认值：#00FF00)
     * strokeWidth:多边形边框宽度(默认值：2)
     * strokeOpacity:多边形边框透明度(默认值：0.4)
     * fontColor:label字体颜色（默认值：#000000）
     * fontSize:label字体大小（默认值：16px）
     * fontFamily:label字体格式（默认值：SimHei）
     * }
     */
    $.SY.maps.addPolygon = function(polygonOpts){
        var points = polygonOpts.points;
        var mapPoints = [];
        for( var i = 0 ; i < points.length ; i++){
            mapPoints.push(new AMap.LngLat(points[i].lng, points[i].lat));
        }
        var id = (typeof polygonOpts.id !== 'undefined') ? polygonOpts.id : "";
        var fillColor = (typeof polygonOpts.fillColor !== 'undefined') ? polygonOpts.fillColor : "#EE9900";//填充颜色，默认棕色
        var fillOpacity = (typeof polygonOpts.fillOpacity !== 'undefined') ? polygonOpts.fillOpacity : 0;//默认无填充
        var strokeColor = (typeof polygonOpts.strokeColor !== 'undefined') ? polygonOpts.strokeColor : "#00FF00";//边框线颜色，默认绿色
        var strokeWidth = (typeof polygonOpts.strokeWidth !== 'undefined') ? polygonOpts.strokeWidth : 2;
        var strokeOpacity = (typeof polygonOpts.strokeOpacity !== 'undefined') ? polygonOpts.strokeOpacity : 0.4;
        var fontColor = (typeof polygonOpts.fontColor !== 'undefined') ? polygonOpts.fontColor : "#000000";//展示的文字颜色 ，默认黑色
        var fontSize = (typeof polygonOpts.fontSize !== 'undefined') ? polygonOpts.fontSize : "16px";
        var fontFamily = (typeof polygonOpts.fontFamily !== 'undefined') ? polygonOpts.fontFamily : "SimHei";
        var fontWeight = (typeof polygonOpts.fontWeight !== 'undefined') ? polygonOpts.fontWeight : "bold";
        var backgroundColor = (typeof polygonOpts.backgroundColor !== 'undefined') ? polygonOpts.backgroundColor : "none"; //文字背景色，默认无背景色
        var borderColor = (typeof polygonOpts.borderColor !== 'undefined') ? polygonOpts.borderColor : "black";

        var style = "color:"+fontColor+";font-family:"+fontFamily+";font-weight:"+fontWeight+";font-size:"+fontSize+";background-color:"
            +backgroundColor+";border-style: solid;border-width: 1px; border-color:"+borderColor+";";
        var polygon = new AMap.Polygon({
            id:id,
            path:mapPoints,
            strokeColor:strokeColor,
            strokeOpacity:strokeOpacity,
            strokeWeight:strokeWidth,
            fillColor:fillColor,
            fillOpacity:fillOpacity
        });
        polygon.setMap($.SY.maps.mapObj);
        //$.SY.maps.mapObj.addOverlays(polygon);
        //显示名称
        if(polygonOpts.label&&polygonOpts.label!=""&&polygonOpts.labelId&&polygonOpts.labelId!=""){
            var path = mapPoints;
            var lablePoint=new AMap.LngLat((path[0].lng+path[3].lng)/2,(path[0].lat+path[3].lat)/2);
            var polygonMarker = new AMap.Marker({
                position : lablePoint,
                id : polygonOpts.labelId,
                offset:new AMap.Pixel(0,0),
                content:"<div><span style="+style+"><nobr>"+polygonOpts.label+"</nobr></span></div>"
            });
            polygonMarker.setMap($.SY.maps.mapObj);
            //$.SY.maps.mapObj.addOverlays(polygonMarker);
        }
        
        if(polygonOpts.editFlag==true){    //如果编辑标识是true则多边形是可编辑的
            //构造折线编辑对象，并开启折线的编辑状态
            $.SY.maps.mapObj.plugin(["AMap.PolyEditor"],function(){
                $.SY.maps.polylineEditor = new AMap.PolyEditor( $.SY.maps.mapObj,polygon);
                $.SY.maps.polylineEditor.open();
            });
        }
        //如果带了ID，则存储到全局变量中
        if(id!==""){
            overlaysMap[id] = polygon;
        }
        if(polygonOpts.label&&polygonOpts.label!=""&&polygonOpts.labelId&&polygonOpts.labelId!=""){
            overlaysMap[polygonOpts.labelId] = polygonMarker;
        }
    };
    /**
     * @description 根据id给地图上多边形修改label
     * @param circleOpts
     * {
     * id：标识一个对象, （必填）
     * label：如果有label则同时有labelId
     * fontColor:label字体颜色（默认值：#000000）
     * fontSize:label字体大小（默认值：16px）
     * fontFamily:label字体格式（默认值：SimHei）
     * }
     */
    $.SY.maps.updatePolygonLabelById = function(polygonOpts){
        var fontColor = (typeof polygonOpts.fontColor !== 'undefined') ? polygonOpts.fontColor : "#000000";//展示的文字颜色 ，默认黑色
        var fontSize = (typeof polygonOpts.fontSize !== 'undefined') ? polygonOpts.fontSize : "16px";
        var fontFamily = (typeof polygonOpts.fontFamily !== 'undefined') ? polygonOpts.fontFamily : "SimHei";
        var fontWeight = (typeof polygonOpts.fontWeight !== 'undefined') ? polygonOpts.fontWeight : "bold";
        var backgroundColor = (typeof polygonOpts.backgroundColor !== 'undefined') ? polygonOpts.backgroundColor : "none"; //文字背景色，默认无背景色
        var borderColor = (typeof polygonOpts.borderColor !== 'undefined') ? polygonOpts.borderColor : "black";

    	 var sel = $.SY.maps.getOverlayById(polygonOpts.id);
    	 var style = "color:"+fontColor+";font-family:"+fontFamily+";font-weight:"+fontWeight+";font-size:"+fontSize+";background-color:"
         +backgroundColor+";border-style: solid;border-width: 1px; border-color:"+borderColor+";";
    	 
    	 var selMarker = $.SY.maps.getOverlayById("lable_"+polygonOpts.id);
    	 if(selMarker!=null&&(typeofselMarker !== 'undefined')){
    		 selMarker.setMap(null);
    	 }
    	 var path = sel.getPath();
         if(polygonOpts.label&&polygonOpts.label!=""&&polygonOpts.labelId&&polygonOpts.labelId!=""){
	         var lablePoint=new AMap.LngLat((path[0].lng+path[3].lng)/2,(path[0].lat+path[3].lat)/2);
	         var polygonMarker = new AMap.Marker({
	             position : lablePoint,
	             id : polygonOpts.labelId,
	             offset:new AMap.Pixel(0,0),
	             content:"<div><span style="+style+"><nobr>"+polygonOpts.label+"</nobr></span></div>"
	         });
	         polygonMarker.setMap($.SY.maps.mapObj);
	         //如果带了ID，则存储到全局变量中
             overlaysMap[polygonOpts.labelId] = polygonMarker;
         }
    }
    /**
     * @description 在地图上添加圆
     * @param circleOpts
     * {
     * lng:经度, （必填）
     * lat:纬度,   （必填）
     * radius:半径, （必填）
     * id：标识一个对象, （必填）
     * label：如果有label则同时有labelId
     * fillColor:多边形填充色(默认值：#EE9900)
     * fillOpacity:多边形填充色透明度(默认值：0)
     * strokeColor:多边形边框颜色(默认值：#00FF00)
     * strokeWidth:多边形边框宽度(默认值：2)
     * strokeOpacity:多边形边框透明度(默认值：0.4)
     * fontColor:label字体颜色（默认值：#000000）
     * fontSize:label字体大小（默认值：16px）
     * fontFamily:label字体格式（默认值：SimHei）
     * }
     */
    $.SY.maps.addCircle = function(circleOpts){
        var lng = circleOpts.lng;
        var lat = circleOpts.lat;
        var radius = circleOpts.radius;
        var id = (typeof circleOpts.id !== 'undefined') ? circleOpts.id : "";
        var fillColor = (typeof circleOpts.fillColor !== 'undefined') ? circleOpts.fillColor : "#EE9900";
        var fillOpacity = (typeof circleOpts.fillOpacity !== 'undefined') ? circleOpts.fillOpacity : 0;
        var strokeColor = (typeof circleOpts.strokeColor !== 'undefined') ? circleOpts.strokeColor : "#00FF00";
        var strokeWidth = (typeof circleOpts.strokeWidth !== 'undefined') ? circleOpts.strokeWidth : 2;
        var strokeOpacity = (typeof circleOpts.strokeOpacity !== 'undefined') ? circleOpts.strokeOpacity : 0.4;
        var fontColor = (typeof circleOpts.fontColor !== 'undefined') ? circleOpts.fontColor : "#000000";
        var fontSize = (typeof circleOpts.fontSize !== 'undefined') ? circleOpts.fontSize : "16px";
        var fontFamily = (typeof circleOpts.fontFamily !== 'undefined') ? circleOpts.fontFamily : "SimHei";
        var fontWeight = (typeof circleOpts.fontWeight !== 'undefined') ? circleOpts.fontWeight : "bold";
        var backgroundColor = (typeof circleOpts.backgroundColor !== 'undefined') ? circleOpts.backgroundColor : "none";
        var borderColor = (typeof circleOpts.borderColor !== 'undefined') ? circleOpts.borderColor : "black";

        var point = new AMap.LngLat(lng, lat);
        var style = "color:"+fontColor+";font-family:"+fontFamily+";font-weight:"+fontWeight+";font-size:"+fontSize+";background-color:"
            +backgroundColor+";border-style: solid;border-width: 1px; border-color:"+borderColor+";";
        var circle = new AMap.Circle({
            id:id,
            center:point,
            radius:radius,
            strokeColor:strokeColor,
            strokeOpacity:strokeOpacity,
            strokeWeight:strokeWidth,
            fillColor:fillColor,
            fillOpacity:fillOpacity
        });
        circle.setMap($.SY.maps.mapObj);
        //$.SY.maps.mapObj.addOverlays(circle);
        //显示名称
        if(circleOpts.label&&circleOpts.label!=""&&circleOpts.labelId&&circleOpts.labelId!=""){
            var centerMarker = new AMap.Marker({
                position : point,
                id : circleOpts.labelId,
                offset:new AMap.Pixel(0,0),
                content:"<div><span style="+style+"><nobr>"+circleOpts.label+"</nobr></span></div>"
            });
            centerMarker.setMap($.SY.maps.mapObj);
            //$.SY.maps.mapObj.addOverlays(centerMarker);
        }

        if(circleOpts.editFlag==true){    //如果编辑标识是true则多边形是可编辑的
            //构造折线编辑对象，并开启折线的编辑状态
            $.SY.maps.mapObj.plugin(["AMap.CircleEditor"],function(){
                $.SY.maps.circleEditor = new AMap.CircleEditor( $.SY.maps.mapObj,circle);
                $.SY.maps.circleEditor.open();
            });
        }
        //如果带了ID，则存储到全局变量中
        if(id!==""){
            overlaysMap[id] = circle;
        }
        if(circleOpts.label&&circleOpts.label!=""&&circleOpts.labelId&&circleOpts.labelId!=""){
            overlaysMap[circleOpts.labelId] = centerMarker;
        }
    };
    /**
     * @description 根据id给地图上圆修改label
      * @param circleOpts
     * {
     * id：标识一个对象, （必填）
     * label：如果有label则同时有labelId
     * fontColor:label字体颜色（默认值：#000000）
     * fontSize:label字体大小（默认值：16px）
     * fontFamily:label字体格式（默认值：SimHei）
     * }
     */
    $.SY.maps.updateCircleById = function(circleOpts){ 
    	var fontColor = (typeof circleOpts.fontColor !== 'undefined') ? circleOpts.fontColor : "#000000";
	    var fontSize = (typeof circleOpts.fontSize !== 'undefined') ? circleOpts.fontSize : "16px";
	    var fontFamily = (typeof circleOpts.fontFamily !== 'undefined') ? circleOpts.fontFamily : "SimHei";
	    var fontWeight = (typeof circleOpts.fontWeight !== 'undefined') ? circleOpts.fontWeight : "bold";
	    var backgroundColor = (typeof circleOpts.backgroundColor !== 'undefined') ? circleOpts.backgroundColor : "none";
	    var borderColor = (typeof circleOpts.borderColor !== 'undefined') ? circleOpts.borderColor : "black";

    	 var sel = $.SY.maps.getOverlayById(circleOpts.id);
    	 var style = "color:"+fontColor+";font-family:"+fontFamily+";font-weight:"+fontWeight+";font-size:"+fontSize+";background-color:"
         +backgroundColor+";border-style: solid;border-width: 1px; border-color:"+borderColor+";";
    	 
    	 var selMarker = $.SY.maps.getOverlayById("lable_"+circleOpts.id);
    	 if(selMarker!=null&&(typeofselMarker !== 'undefined')){
    		 selMarker.setMap(null);
    	 }
    	 var point = sel.getCenter();
    	 if(circleOpts.label&&circleOpts.label!=""&&circleOpts.labelId&&circleOpts.labelId!=""){
	    	 var centerMarker = new AMap.Marker({
	             position : point,
	             id : circleOpts.labelId,
	             offset:new AMap.Pixel(0,0),
	             content:"<div><span style="+style+"><nobr>"+circleOpts.label+"</nobr></span></div>"
	         });
	         centerMarker.setMap($.SY.maps.mapObj);
	         //如果带了ID，则存储到全局变量中
             overlaysMap[circleOpts.labelId] = centerMarker;
         }
    }
    /**
     * @description 根据ID获取地图上所有的marker点、多边形、线对象 等覆盖物
     */
    $.SY.maps.getOverlayById = function(id){
        //var selected = $.SY.maps.mapObj.getOverlays(id);
        var selected = overlaysMap[id];
    	if (selected !== undefined) {
    		return selected;
    	}
    };
    /**
     * @description 删除地图上所有的marker点、多边形、线对象 等覆盖物
     */
    $.SY.maps.clearOverlays = function(){
        //$.SY.maps.mapObj.clearOverlays();
        $.SY.maps.mapObj.clearMap();
    };
    /**
     * @description 根据ID删除地图上所有的marker点、多边形、线对象 等覆盖物
     */
    $.SY.maps.removeOverlayById = function(id){
        //$.SY.maps.mapObj.removeOverlays(id);
        var selected = overlaysMap[id];
        if (selected !== undefined) {
            selected.setMap(null);
            delete overlaysMap[id];
        }
    };
    /**
     * @description 根据ID获取地图上Marker点的附加属性
     */
    $.SY.maps.getMarkerExtData = function(id){
    	 var selected = overlaysMap[id];
    	if (selected !== undefined) {
    		var extData =  selected.getExtData();
    		if (extData !== undefined) {
    			return extData;
    		}
    	}
    };
    /**
     * @description 输入经纬度点序列，初始化拖拽导航插件
     * @param options
     * {
     *  points:点序列数组(必须,[{lng:xxx,lat:xxx},……]),
     *  drivingPolicy:查询条件（必须,
     *  LEAST_TIME 	Const 	最快捷模式。
     *  LEAST_FEE 	Const 	最经济模式。
     *  LEAST_DISTANCE 	Const 	最短距离模式。
     *  REAL_TRAFFIC 	Const 	考虑实时路况。）
     *  getRoute Array.<LngLat>     返回当前导航路径，即导航路径的经纬度坐标数组。
     *  getWays   Array.<LngLat>   返回导航的所有途经点，即所有途径点的坐标数组。
     * }
     */
    $.SY.maps.initDragRoute = function(options){
        // 拖拽导航插件
        if (options.points != "undefined"&&options.points!=null) {
            var arr = new Array();// LngLat经纬度数组
            for (var i = 0; i < options.points.length; i+=1) {
                arr.push(new AMap.LngLat(options.points[i].lng, options.points[i].lat));
            }
            $.SY.maps.mapObj.plugin(["AMap.DragRoute"], function() {
                if(options.drivingPolicy=="LEAST_TIME"){
                    $.SY.maps.dragRoute = new AMap.DragRoute($.SY.maps.mapObj,arr,AMap.DrivingPolicy.LEAST_TIME);
                }else if(options.drivingPolicy=="LEAST_FEE"){
                    $.SY.maps.dragRoute = new AMap.DragRoute($.SY.maps.mapObj,arr,AMap.DrivingPolicy.LEAST_FEE);
                } else if(options.drivingPolicy=="LEAST_DISTANCE"){
                    $.SY.maps.dragRoute = new AMap.DragRoute($.SY.maps.mapObj,arr,AMap.DrivingPolicy.LEAST_DISTANCE);
                }else if(options.drivingPolicy=="REAL_TRAFFIC"){
                    $.SY.maps.dragRoute = new AMap.DragRoute($.SY.maps.mapObj,arr,AMap.DrivingPolicy.REAL_TRAFFIC);
                }
                $.SY.maps.dragRoute.search(); //查询导航路径并开启拖拽导航
            });
        }

    };
    //销毁拖拽插件，同时会清除拖拽路线
    $.SY.maps.destroyDragRoute = function(){
    	if(null!=$.SY.maps.dragRoute){
    		 $.SY.maps.dragRoute.destroy();
    	}
    };
    //获取导航路径，返回点序列数组([{lng:xxx,lat:xxx},……]),
    $.SY.maps.findDragRoute = function(){
        var arr = [];
       var route =  $.SY.maps.dragRoute.getRoute();
        if (route !=null) {
            var arr = new Array();// LngLat经纬度数组
            for (var i = 0; i <route.length; i+=1) {
                arr.push({lng:route[i].getLng(), lat:route[i].getLat()});
            }
        }
        return arr;
    };
    /**
     * @description 输入经纬度点序列，通过回调函数获取导航路径
     * @param options
     * {
     *  points:点序列数组(必须,[{lng:xxx,lat:xxx},……]),   只支持输入两个点的驾车导航
     *  routeType:查询条件（必须,路径计算规则，取值：
     *  1 =  LEAST_TIME	Const	最快捷模式    默认
        2 = LEAST_FEE	Const	最经济模式
        3 = LEAST_DISTANCE	Const	最短距离模式
        4 = REAL_TRAFFIC	Const	考虑实时路况  )
     *  listener:路径查询成功后的响应函数 listener，通过该参数可以获取到导航路径的经纬度点序列
     *  返回回调函数
     * }
     */
    $.SY.maps.findPath = function(options){
        var   start;
        var end;
        if (options.points != "undefined"&&options.points!=null&&options.points.length==2) {
                start = new AMap.LngLat(options.points[0].lng, options.points[0].lat);
                end = new AMap.LngLat(options.points[1].lng, options.points[1].lat);
        }
        var MDrive;
        AMap.service(["AMap.Driving"], function() {
            var DrivingOption = {
                //驾车策略，包括 LEAST_TIME，LEAST_FEE, LEAST_DISTANCE,REAL_TRAFFIC
                policy:options.routeType
            };
            MDrive = new AMap.Driving(DrivingOption); //构造驾车导航类
            //根据起终点坐标规划驾车路线
            MDrive.search(start, end, function(status, result){
                if(status === 'complete' && result.info === 'OK'){
                    options.listener(result);
                }
            });
        });
    };

    /**
     * @description 输入行政区域名称，通过回调函数绘制行政区域
     * @param options
     * {
     *  city:行政区域名
     *  strokeColor:查询条件（必须,路径计算规则，取值：
     *  ...
     *  返回绘制好的行政区域
     * }
     */
    $.SY.maps.findDistrict = function(options){
   	 	 var city = (typeof options.city !== 'undefined') ? options.city : "长沙市";
    	 var level = (typeof options.level !== 'undefined') ? options.level : "city";
         var strokeColor = (typeof options.strokeColor !== 'undefined') ? options.strokeColor : "#a6c2de";
         var strokeWeight = (typeof options.strokeWeight !== 'undefined') ? options.strokeWeight : "2";
         var fillColor = (typeof options.fillColor !== 'undefined') ? options.fillColor : "#a6c2de";
         var fillOpacity = (typeof options.fillOpacity !== 'undefined') ? options.fillOpacity : "0.1";
         
    	//加载行政区划插件
        var district;
        AMap.service('AMap.DistrictSearch', function() {
            var opts = {
                subdistrict: 1,   //返回下一级行政区
                extensions: 'all',  //返回行政区边界坐标组等具体信息
                level: level  //查询行政级别为市
            };
            //实例化DistrictSearch
            district = new AMap.DistrictSearch(opts);
            //行政区查询
            district.search(city, function(status, result) {
            	if(status=="complete"){
                    var bounds = result.districtList[0].boundaries;
                    var polygons = [];
                    if (bounds) {
                        for (var i = 0, l = bounds.length; i < l; i++) {
                            //生成行政区划polygon
                            var polygon = new AMap.Polygon({
                                map:  $.SY.maps.mapObj,
                                strokeWeight: strokeWeight,
                                path: bounds[i],
                                fillOpacity: fillOpacity,
                                fillColor: fillColor,
                                strokeColor: strokeColor
                            });
                            polygons.push(polygon);
                        }
                    }
            	}
            });
        });
    };
    /**
     * @description 输入行政区域名称和全国的带洞多边形，通过回调函数绘制行政区域
     * @param options
     * {
     *  city:行政区域名
     *  strokeColor:查询条件（必须,路径计算规则，取值：
     *  ...
     *  返回绘制好的行政区域，其他区域是遮盖的
     * }
     */
    $.SY.maps.retainDistrict = function(options){
  	 	var city = (typeof options.city !== 'undefined') ? options.city : "长沙市";
   		var level = (typeof options.level !== 'undefined') ? options.level : "city";
        var strokeColor = (typeof options.strokeColor !== 'undefined') ? options.strokeColor : "#a6c2de";
        var strokeWeight = (typeof options.strokeWeight !== 'undefined') ? options.strokeWeight : "2";
        var fillColor = (typeof options.fillColor !== 'undefined') ? options.fillColor : "#a6c2de";
        var fillOpacity = (typeof options.fillOpacity !== 'undefined') ? options.fillOpacity : "0.9";
    	
    	//画带洞的多边形，外围取一个包含全国地图的多边形
        var district;
        var pointers = {
        		outer:[
        		       [68.566569,54.696718],
        		       [104.261881,54.696718],
        		       [138.363444,54.696718],
        		       [138.363444,38.990189],
        		       [138.363444,10.353869],
        		       [104.261881,10.353869],
        		       [68.566569,10.353869],
        		       [68.566569,38.990189]
        		       
        		       ],
        		inner:[]
        };
        //加载行政区划插件
        AMap.service('AMap.DistrictSearch', function() {
            var opts = {
                    subdistrict: 1,   //返回下一级行政区
                    extensions: 'all',  //返回行政区边界坐标组等具体信息
                    level: level  //查询行政级别为市
                };
                //实例化DistrictSearch
                district = new AMap.DistrictSearch(opts);
                //行政区查询
                district.search(city, function(status, result) {
                	if(status=="complete"){
                		 var bounds = result.districtList[0].boundaries;
                         if (bounds) {
                             for (var i = 0, l = bounds.length; i < l; i++) {
                                 //生成行政区划polygon
                             	 var b = bounds[i];
	                           	 //外围的小岛去掉，大于100个点的才有效
	                           	 if(b.length>100){
	                           		 for (var j = 0, k = b.length; j < k; j++) {
	                                   	pointers.inner.push([b[j].lng,b[j].lat]);
	                              	 }
	                              	  var pathArray = [
	                              	                     pointers.outer,
	                              	                     pointers.inner
	                              	                 ];
	                              	var polygonOptions = {
	                                          map: $.SY.maps.mapObj,
	                                          path: pathArray,
	                                          strokeWeight: strokeWeight,
	                                          fillOpacity: fillOpacity,
	                                          fillColor: fillColor,
	                                          strokeColor: strokeColor
	                                      };
	                                polygon = new AMap.Polygon(polygonOptions);
	                           	 }
                             }
                         }
                	}else{
                		$.SY.maps.retainDistrict(options);
                	}
                });
        });
   };
   /**
    * @description 根据输入的经纬度画全国某地区的带洞多边形
    * @param options
    * {
    *  points:经纬度对象点字符串(必须："113.160034,28.190916;113.160034,28.190916"),
    *  strokeColor:
    *  ...
    *  返回绘制好的行政区域，其他区域是遮盖的
    * }
    */
   $.SY.maps.drawDistrict = function(options){
       var points = (typeof options.points !== 'undefined') ? options.points : "";
       var strokeColor = (typeof options.strokeColor !== 'undefined') ? options.strokeColor : "#a6c2de";
       var strokeWeight = (typeof options.strokeWeight !== 'undefined') ? options.strokeWeight : "2";
       var fillColor = (typeof options.fillColor !== 'undefined') ? options.fillColor : "#a6c2de";
       var fillOpacity = (typeof options.fillOpacity !== 'undefined') ? options.fillOpacity : "0.9";
       
       var mapPoints = [];
       if(points!=""&&points.indexOf(";")>0){
           var arr = points.split(";");
           for( var i = 0 ; i < arr.length ; i++){
        	   var arr2 = arr[i].split(",");
               mapPoints.push([arr2[0], arr2[1]]);
           }  
       }
   	   //画带洞的多边形，外围取一个包含全国地图的多边形
       var pointers = {
       		outer:[
       		       [68.566569,54.696718],
       		       [104.261881,54.696718],
       		       [138.363444,54.696718],
       		       [138.363444,38.990189],
       		       [138.363444,10.353869],
       		       [104.261881,10.353869],
       		       [68.566569,10.353869],
       		       [68.566569,38.990189]
       		       
       		       ],
       		inner:mapPoints
       };
       var pathArray = [
 	                     pointers.outer,
 	                     pointers.inner
 	                 ];
  	  var polygonOptions = {
             map: $.SY.maps.mapObj,
             path: pathArray,
             strokeWeight: strokeWeight,
             fillOpacity: fillOpacity,
             fillColor: fillColor,
             strokeColor: strokeColor
       };
       polygon = new AMap.Polygon(polygonOptions);
  };
    /**
     * @description 根据传入的经纬度点及逆地址编码参数，进行逆地址编码请求(默认返回：省+市+县/区+POI)
     * @param options 逆地址编码参数.{
     *  lng:经度(必须),
     *  lat:纬度(必须),
     *  result:通过回调函数，返回查询结果
     *  全局变量赋值：addressid，获取逆地址解析的更新地址，以便更新
     * }
     */
    $.SY.maps.reverseGeocoding = function(options){
    	if(options.addressid){
    		addressid = options.addressid; 
        }
        var x = options.lng;
        var y = options.lat;
        var lnglatXY = new AMap.LngLat(x,y);
        var MGeocoder;
        //加载地理编码插件
        $.SY.maps.mapObj.plugin(["AMap.Geocoder"], function() {
            MGeocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            //返回地理编码结果
            AMap.event.addListener(MGeocoder, "complete", options.listener);
            AMap.event.addListener(MGeocoder, "error", options.listenerErr);
            //逆地理编码
            MGeocoder.getAddress(lnglatXY);
        });
    };
    /**
     * @description 根据提供IP定位返回所在城市信息
     * @param options 城市查询参数.{
     *  ip：可选，不填的话获取当前用户所在城市
     *  result:通过回调函数，返回查询结果type="complete", info="OK", city="广州市", bounds=城市范围 ...}
     * }
     */
    $.SY.maps.citySearch = function(options){
        var ip = options.ip;
        var citysearch;
        //加载城市查询插件
        $.SY.maps.mapObj.plugin(["AMap.CitySearch"], function() {
            //实例化城市查询类
            citysearch = new AMap.CitySearch();
            //自动获取用户IP，返回当前城市
            if(typeof ip !== 'undefined'){
                citysearch.getCityByIp(ip);
            }else{
                citysearch.getLocalCity();
            }
            AMap.event.addListener(citysearch, "complete",  options.listener);
            AMap.event.addListener(citysearch, "error",  options.listenerErr);
        });
    };
    /**
     * @description 根据输入关键字提示匹配信息，通过回调函数查询POI信息，然后可以增加业务逻辑显示在地图上。
     * @param options
     * {
     *  city:行政区域名
     *  listener:search回调函数
     *  ...
     * }
     */
    $.SY.maps.autoCompletePlaceSearch = function(options){
        var city = (typeof options.city !== 'undefined') ? options.city : "全国";
        //加载自动匹配和地方查询插件
        var autocomplete;
        AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
            var autoOptions = {
                city: city, //城市，默认全国
                input: "keyword"//使用联想输入的input的id
            };
            autocomplete= new AMap.Autocomplete(autoOptions);
            var placeSearch = new AMap.PlaceSearch({
                city:city,
                map: $.SY.maps.mapObj
            })
            AMap.event.addListener(autocomplete, "select",  function(e){
                    //详情查询，搜索出来一个位置显示详细信息
                    placeSearch.getDetails(e.poi.id, function(status, result) {
                        if (status === 'complete' && result.info === 'OK') {
                            options.listener(result);
                        }
                    });
                    /* //这个是按关键字再重新去搜索
                    placeSearch.search(e.poi.location, function(status, result) {
                        if(status === 'complete' && result.info === 'OK'){
                            options.listener(result);
                        }
                    });  */
                }); //鼠标点击或者回车选中某个POI信息时触发此事件
        });
    };
    /**
     * @description 鼠标右键事件，弹出右键菜单
     * @param options
     * {
     *  rightMenu:右键菜单html
     *  ...
     * }
     */
    $.SY.maps.rightClickPop = function(options){
            var me = this;
            var contextMenuPositon = null;
            var contextMenu = new AMap.ContextMenu({isCustom: true, content:  options.rightMenu.join('')});//通过content自定义右键菜单内容
            //地图绑定鼠标右击事件——弹出右键菜单
            $.SY.maps.mapObj.on('rightclick', function(e) {
                contextMenu.open($.SY.maps.mapObj, e.lnglat);
                contextMenuPositon = e.lnglat; //右键菜单位置
                var marker = new AMap.Marker({
                    map: $.SY.maps.mapObj,
                    position: contextMenuPositon //基点位置
                });
            });
    }
    /**
     * @description 捕获鼠标左键点击事件，关闭弹出框的同时需要清空标识
     */
    $.SY.maps.leftClickPop = function(){
             //地图绑定鼠标左击事件
            $.SY.maps.mapObj.on('click', function(e) {
            	$.SY.maps.clearOpenFlagForOverlays();
            });
    }
    /**
     * @description 用于标记当前回放的位置
     * @type {number}
     */
    $.SY.maps.traceLoc = 0;
    /**
     * @description 用于标记定时器
     */
    $.SY.maps.timer;
    /**
     * @description 轨迹回放
     * @param historyDataArray 历史数据数组{
     * [{
     *     lng:经度(必须),
     *     lat:纬度(必须),
     *     rtime:轨迹点时间(必须),
     *     curEvent:当前时间点的事件==展示的label文字
     * },……]
     * }
     *  markerOpts展示图片属性
     * [{
     *   normalStatusIcon 正常轨迹点的图标  (必须，有默认),
     *   exceptionStatusIcon 异常点图标 (必须，有默认),
     *   rotation:偏转方向 (必须，有默认0),
     *   offx:展示的图片的偏转  (必须),
     *   offy:展示的图片的偏转, (必须),
     *   labelPos：展示label的位置  (可选，有默认为图标之上),
     *   imgWidth : 默认展示图片的宽度"5%",（可选，有默认）
     *   labelWidth : 默认展示文字的宽度 "90%", （可选，有默认）
     *   zoom : 放大级别  （可选，有默认为16）
     *   interval 轨迹回放时间间隔   （可选，有默认为3秒）
     *   showEvent : true/false 是否需要展示报警点（可选，有默认false）
     *   showEventLabel  : true/false 是否需要展示报警点的文字（可选，有默认false）
     *   closeurl : 弹出框关闭按钮（可选，有默认）
     *   bottomurl ： 弹出框底部按钮（可选，有默认）
     *   showCurrTime: true/false 是否需要展示当前播放时间（可选，有默认false）
     *   showCurrTimeLabel ： 展示时间的控件id，如果没有则不展示时间
     * },……]
     * }
     */
    var historyDataArray=[];
    $.SY.maps.trace = function(historyDataArrayIn,markerOpts){
        historyDataArray = historyDataArrayIn;
        var normalStatusIcon = (typeof markerOpts.normalStatusIcon !== 'undefined') ? markerOpts.normalStatusIcon : "../images/lianglan.gif";
        var exceptionStatusIcon = (typeof markerOpts.exceptionStatusIcon !== 'undefined') ? markerOpts.exceptionStatusIcon : "../images/hongdian.gif";
        var interval = (typeof markerOpts.interval !== 'undefined') ? markerOpts.interval : "3000";
        var rotation = (typeof markerOpts.rotation !== 'undefined') ? markerOpts.rotation : "0";
        var zoom = (typeof markerOpts.zoom !== 'undefined') ? markerOpts.zoom : "16";
        var closeurl = (typeof markerOpts.closeurl !== 'undefined') ? markerOpts.closeurl : "../images/inforwindowclose.gif";
        var bottomurl = (typeof markerOpts.bottomurl !== 'undefined') ? markerOpts.bottomurl : "../images/inforwindowsharp.png";
        var historyDataLen = historyDataArray.length;
        if( historyDataLen > $.SY.maps.traceLoc ){
            var currentLoc = $.SY.maps.traceLoc;
            if( $.SY.maps.traceLoc > 0 ){
                var points = [];
                points.push(historyDataArray[currentLoc-1]);
                points.push(historyDataArray[currentLoc]);
                /*var distance = $.SY.maps.getDistance(historyDataArray[currentLoc -1],historyDataArray[currentLoc]);
                 if( distance < 1000 ){
                 var lineOpts = {
                 points:points
                 };
                 $.SY.maps.addLine(lineOpts);
                 } */
                var options = {
                    points:points
                };
                $.SY.maps.addLine(options);
            }
            var icon = normalStatusIcon;
            var contentHTML = [];
            var whiteRg = /^\s*$/;
            var curEvent = historyDataArray[currentLoc].curEvent;
            if( typeof(curEvent) !== 'undefined' && !whiteRg.test(curEvent)){
                contentHTML.push("<div class='info'><div class='info-top'>");
                contentHTML.push("<img src='"+closeurl+"' onclick='$.SY.maps.onUnFeatureSelect()'></div><div class='info-middle'>");
                if(markerOpts.showEvent==true){//需要展示报警才加
                    icon = exceptionStatusIcon;
                    contentHTML.push("<p style='line-height: 12px;'>"+ historyDataArray[currentLoc].curEvent+"</p>");
                }
                contentHTML.push("<p style='line-height: 12px;'>"+historyDataArray[currentLoc].rtime+"</p>");
                contentHTML.push("</div><div class='info-bottom'><img src='"+bottomurl+"'></div></div>");
            }else{
                contentHTML.push("<div class='info'><div class='info-top'>");
                contentHTML.push("<img src='"+closeurl+"' onclick='$.SY.maps.onUnFeatureSelect()'></div><div class='info-middle'>");
                contentHTML.push("<p style='line-height: 12px;'>"+historyDataArray[currentLoc].rtime+"</p>");
                contentHTML.push("</div><div class='info-bottom'><img src='"+bottomurl+"'></div></div>");
            }
            var inBounds = $.SY.maps.inMapBounds(historyDataArray[currentLoc]);
            if( !inBounds ){
                $.SY.maps.panTo(historyDataArray[currentLoc].lng,historyDataArray[currentLoc].lat);
            }
            //rotation是必须值，默认使用0
            var marker = {
                id : "trace"+currentLoc,
                lng:historyDataArray[currentLoc].lng,
                lat:historyDataArray[currentLoc].lat,
                url:icon,
                offx:markerOpts.offx,
                offy:markerOpts.offy,
                rotation:rotation,
                popupContent : contentHTML.join(""), //左键弹出框
                popupOffx :  markerOpts.popupOffx,
                popupOffy :  markerOpts.popupOffy,
                popupWidth : markerOpts.popupWidth,
                popupHeight :markerOpts.popupHeight
            };
            if( currentLoc == 0 ){
                $.SY.maps.setCenter(historyDataArray[currentLoc].lng,historyDataArray[currentLoc].lat,zoom);
            }
            if( !whiteRg.test(curEvent)&&markerOpts.showEvent==true&&markerOpts.showEventLabel==true ){
                marker.label = curEvent;     //需要展示label,则需要指定下面的参数
                marker.labelPos = markerOpts.labelPos;
                marker.imgWidth = markerOpts.imgWidth;
                marker.labelWidth = markerOpts.labelWidth;
            }
             //路线上只画出报警点和当前点
            $.SY.maps.addMarker(marker);
	        //如果上一个点不是报警点则移除
            if( $.SY.maps.traceLoc > 0 ){
	             var lastEvent = historyDataArray[currentLoc-1].curEvent;
	             if( typeof(lastEvent) !== 'undefined' && !whiteRg.test(lastEvent)&&markerOpts.showEvent==true){
	             }else{
	              	$.SY.maps.removeOverlayById("trace"+(currentLoc-1)); 
	             }
             }
            //如果需要展示当前时间
            if(markerOpts.showCurrTime==true){
            	if((typeof markerOpts.showCurrTimeLabel !== 'undefined')){
                	$("#"+markerOpts.showCurrTimeLabel).html(historyDataArray[currentLoc].rtime);
            	}
            }
            $.SY.maps.traceLoc += 1;
            $.SY.maps.timer = setTimeout(function(){
                $.SY.maps.trace(historyDataArray,markerOpts);
            },interval);
        }else{
            $.SY.maps.traceLoc = 0;
        }
    };
    //分批次获取数据后，添加数据
    $.SY.maps.addTraceData  = function(historyDataArrayIn){
        var len =  historyDataArrayIn.length;
        for( var k = 0 ; k < len; ){
            historyDataArray.push(historyDataArrayIn[k]);
            k = k+1;
        }
    };
    /**
     * @description 停止历史回放定时器
     */
    $.SY.maps.stopTrace = function(){
        $.SY.maps.traceLoc = 0;
    	clearTimeout($.SY.maps.timer);
    };
    /**
     * @description 当marker点被点击选中时，弹出框
     * @param feature 选中的marker点 showPopup=true是才展示marker点，且必须传入要展示的参数
     */
    $.SY.maps.onFeatureSelect = function(feaAttr,marker){
        var popupOffx = (typeof feaAttr.popupOffx !== 'undefined') ? feaAttr.popupOffx : 15;
        var popupOffy = (typeof feaAttr.popupOffy !== 'undefined') ? feaAttr.popupOffy : -20;
        var popupWidth = (typeof feaAttr.popupWidth !== 'undefined') ? feaAttr.popupWidth : 300;
        var popupHeight = (typeof feaAttr.popupHeight !== 'undefined') ? feaAttr.popupHeight : 0;  
        var openWhenAdd = (typeof feaAttr.openWhenAdd !== 'undefined') ? feaAttr.openWhenAdd : false;
        if(feaAttr.popupContent){
            var point = new AMap.LngLat(feaAttr.lng, feaAttr.lat);
            var infoWindow = new AMap.InfoWindow( {
                isCustom : true,
                closeWhenClickMap : true,
                offset : new AMap.Pixel(popupOffx, popupOffy)
            });
            infoWindow.setContent( feaAttr.popupContent);
            infoWindow.setSize(new AMap.Size(popupWidth, popupHeight));
            var extData = marker.getExtData();
            extData.reClickedReplace = false;
            marker.setExtData(extData);
            //$.SY.maps.mapObj.bind(marker, 'click', function() {
            AMap.event.addListener(marker, 'click', function() {
                $.SY.maps.onUnFeatureSelect();
                infoWindow.open($.SY.maps.mapObj, marker.getPosition());
                //获取行政位置
                if(feaAttr.getPosFlag==true){
                	var options = {
           				    addressid : feaAttr.id,
           		            lng :  marker.getPosition().lng,
           		            lat :  marker.getPosition().lat,
           		            listener : geocoder_CallBack,
           		            listenerErr : geocoder_CallBack_Err
           		        };
                	$.SY.maps.reverseGeocoding(options);
                }
                //如果点击后需要更换图片则更换
                if(feaAttr.replaceFlag==true){
                	var cont = marker.getContent();
                	cont = cont.replace(feaAttr.url,feaAttr.urlAfterReplace);
	                marker.setOffset(new AMap.Pixel(feaAttr.offxAfterReplace, feaAttr.offyAfterReplace));
	                marker.setContent(cont);
                	var extData = marker.getExtData();
                   /* extData.reClickedReplace = true;
                    marker.setExtData(extData);*/
	    			 var strSel = JSON.stringify(extData);
	    			 strSel = strSel.replace("\"reClickedReplace\":false","\"reClickedReplace\":true");
	    			 //strSel = strSel.replace("\"reClicked\":false","\"reClicked\":true");
	    			 marker.setExtData(JSON.parse(strSel));//这种字符串方式只修改某一个覆盖物
                }
                //标记被点击了,延时设置，确保在地图点击事件之后生效，地图点击事件在被覆盖物遮盖时不生效
               setTimeout(function(){$.SY.maps.setOpenFlagForOverlaysById(feaAttr.id);},1000)
			   //$.SY.maps.setOpenFlagForOverlaysById(feaAttr.id);
            });
            if(openWhenAdd==true){
                $.SY.maps.onUnFeatureSelect();
                infoWindow.open($.SY.maps.mapObj, marker.getPosition());  
                $.SY.maps.mapObj.panTo(marker.getPosition());
                //获取行政位置
                if(feaAttr.getPosFlag==true){
                	var options = {
           				    addressid : feaAttr.id,
           		            lng : marker.getPosition().lng,
           		            lat : marker.getPosition().lat,
           		            listener : geocoder_CallBack,
           		            listenerErr : geocoder_CallBack_Err
           		        };
                	$.SY.maps.reverseGeocoding(options);
                }
                //标记被点击了
                setTimeout(function(){$.SY.maps.setOpenFlagForOverlaysById(feaAttr.id);},1000)
                //$.SY.maps.setOpenFlagForOverlaysById(feaAttr.id);
            }
        }
	     
    };
    /**
     * @description 当marker点被点击选中时，弹出框
     * @param feature 选中的marker点 showPopup=true是才展示marker点，且必须传入要展示的参数
     * re:定义返回值
     */  
    var contextMenu; 
    $.SY.maps.onFeatureSelectAndRightPopup = function(feaAttr,marker){
        var popupOffx = (typeof feaAttr.popupOffx !== 'undefined') ? feaAttr.popupOffx : 15;
        var popupOffy = (typeof feaAttr.popupOffy !== 'undefined') ? feaAttr.popupOffy : -20;
        var popupWidth = (typeof feaAttr.popupWidth !== 'undefined') ? feaAttr.popupWidth : 300;
        var popupHeight = (typeof feaAttr.popupHeight !== 'undefined') ? feaAttr.popupHeight : 0;
        var openWhenAdd = (typeof feaAttr.openWhenAdd !== 'undefined') ? feaAttr.openWhenAdd : false;
        if(feaAttr.popupContent){
            var point = new AMap.LngLat(feaAttr.lng, feaAttr.lat);
            var infoWindow = new AMap.InfoWindow( {
                isCustom : true,
                closeWhenClickMap : true,
                offset : new AMap.Pixel(popupOffx, popupOffy)
            });

            infoWindow.setContent( feaAttr.popupContent);
            infoWindow.setSize(new AMap.Size(popupWidth, popupHeight));
            var extData = marker.getExtData();
            extData.reClickedReplace = false;
            marker.setExtData(extData);
            //$.SY.maps.mapObj.bind(marker, 'click', function() {
            AMap.event.addListener(marker, 'click', function() { 
                $.SY.maps.onUnFeatureSelect();
                infoWindow.open($.SY.maps.mapObj, marker.getPosition()); 
                //获取行政位置
                if(feaAttr.getPosFlag==true){
                	var options = {
           				    addressid : feaAttr.id,
           		            lng :  marker.getPosition().lng,
           		            lat :  marker.getPosition().lat,
           		            listener : geocoder_CallBack,
           		            listenerErr : geocoder_CallBack_Err
           		        };
                	$.SY.maps.reverseGeocoding(options);
                }
                //如果点击后需要更换图片则更换
                if(feaAttr.replaceFlag==true){
                	var cont = marker.getContent();
	                cont = cont.replace(feaAttr.url,feaAttr.urlAfterReplace);
	                marker.setOffset(new AMap.Pixel(feaAttr.offxAfterReplace, feaAttr.offyAfterReplace));
	                marker.setContent(cont); 
                    //标记是否点击
                	var extData = marker.getExtData();
                    /*extData.reClickedReplace = true;
                    marker.setExtData(extData);*/
	    			 var strSel = JSON.stringify(extData);
	    			 strSel = strSel.replace("\"reClickedReplace\":false","\"reClickedReplace\":true");
	    			 //strSel = strSel.replace("\"reClicked\":false","\"reClicked\":true");
	    			 marker.setExtData(JSON.parse(strSel));//这种字符串方式只修改某一个覆盖物
                }
                //标记被点击了
                setTimeout(function(){$.SY.maps.setOpenFlagForOverlaysById(feaAttr.id);},1000)
                //$.SY.maps.setOpenFlagForOverlaysById(feaAttr.id);
            }); 
            if(openWhenAdd==true){
                $.SY.maps.onUnFeatureSelect();
                infoWindow.open($.SY.maps.mapObj, marker.getPosition());
                $.SY.maps.mapObj.panTo(marker.getPosition());
                //获取行政位置
                if(feaAttr.getPosFlag==true){
                	var options = {
           				    addressid : feaAttr.id,
           		            lng : marker.getPosition().lng,
           		            lat : marker.getPosition().lat,
           		            listener : geocoder_CallBack,
           		            listenerErr : geocoder_CallBack_Err
           		        };
                	$.SY.maps.reverseGeocoding(options);
                }
                //标记被点击了
                setTimeout(function(){$.SY.maps.setOpenFlagForOverlaysById(feaAttr.id);},1000)
                //$.SY.maps.setOpenFlagForOverlaysById(feaAttr.id);
            }
        }
        //创建右键菜单
        contextMenu = new AMap.ContextMenu({isCustom:true,content:feaAttr.menuContent});//通过content自定义右键菜单内容

        //地图绑定鼠标右击事件——弹出右键菜单
        // AMap.event.addListener( marker,'rightclick',function(e){
        //$.SY.maps.mapObj.bind(marker,"rightclick",function(e){
        AMap.event.addListener(marker, 'rightclick', function(e) {
            $.SY.maps.onUnFeatureSelect();
            //屏蔽右键
            /*if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)){
                e.originalEvent.returnValue = false;
            }else{
                e.originalEvent.preventDefault();
            }*/
            contextMenu.open( $.SY.maps.mapObj,marker.getPosition());
            if(feaAttr.re){
            	re = feaAttr.re;
            }
        });
    };
    /**
     * @description 根据id设置覆盖物的弹出框标识置为true
     */
    $.SY.maps.setOpenFlagForOverlaysById = function(id){
    	if(overlaysMap!=null&&id!==""){
    		var selected = overlaysMap[id];
    		if (selected !== undefined) {
    			 var extData = selected.getExtData();
    			 var strSel = JSON.stringify(extData);
    			 strSel = strSel.replace("\"reClicked\":false","\"reClicked\":true");
    			 selected.setExtData(JSON.parse(strSel));//这种字符串方式只修改某一个覆盖物
                 overlaysMap[id] = selected;
    		}
    	}
    };
    /**
     * @description 设置所有覆盖物的弹出框标识都是false
     */
    $.SY.maps.clearOpenFlagForOverlays = function(){
    	if(overlaysMap!=null){
    		for(var i in overlaysMap){
    			var selected = overlaysMap[i];
    		    if (selected !== undefined) {
    		    	 var extData = selected.getExtData();
                     extData.reClicked = false;//这种方式会把所有覆盖物的extData都修改了
                     selected.setExtData(extData);
                     overlaysMap[i] = selected;
    		    }
    		}
    	}
    };
    /**
     * @description 当marker点失去焦点时，移除marker对应的popup
     */
    $.SY.maps.onUnFeatureSelect = function(){
        $.SY.maps.mapObj.clearInfoWindow();
        $.SY.maps.clearOpenFlagForOverlays();//弹出框打开标识全部为false
    };
    /**
     * @description 关闭右键菜单
     */
    $.SY.maps.closeContextMenu = function() {
    	contextMenu.close();
    };


    //屏蔽浏览器右键
    window.onload = function(){
        $(document).bind('contextmenu', function(e) {
            return false;
        });
    };

    /**
     * @description 动态轨迹回放初始化
     * opts   入参
     * points 轨迹数组[{
     * [{
     *     lng:经度(必须),
     *     lat:纬度(必须),
     *     angle角度(可选),
     *     speed速度(可选),
     *     locationTime定位时刻(可选)  ,
     *     curEvent:当前时间点的事件==展示的label文字
     * },……]
     *   url:图片 (必须),
     *   offx:展示的图片的偏转  (必须),
     *   offy:展示的图片的偏转, (必须),
     *   startId 开始暂停按钮ID  (必须),
     *   zoom 放大级别(必须，有默认13),
     *   intervalTime：每个多长时间加载一个点  (必须，有默认1秒),
     *   step : 每个intervalTime间隔内跳转几个点（可选，有默认1个）,
     *   showEvent : true/false 是否需要展示报警点（可选，有默认false）
     *   expurl:报警点图片 (必须),
     *   expoffx:展示的图片的偏转  (必须),
     *   expoffy:展示的图片的偏转, (必须),
     *   showEventLabel  : true/false 是否需要展示报警点的文字（可选，有默认false）
     *   closeurl : 弹出框关闭按钮（可选，有默认）
     *   bottomurl ： 弹出框底部按钮（可选，有默认）
     *   showCurrTime: true/false 是否需要展示当前播放时间（可选，有默认false）
     *   showCurrTimeLabel ： 展示时间的控件id，如果没有则不展示时间
     *   showEventInBox：true/false 是否需要展示事件列表（可选，有默认false）
     *   showEventInBoxId ： 展示事件的表格tbody的id，如果没有则不展示
     *   showTotalDis: true/false 是否需要途径的距离（可选，有默认false）
     *   showTotalDisLabel ： 展示途径的距离的控件id，如果没有则不展示途径的距离
     * },……]
     * }
     */
    var marker;
    var polyline;
    var currPoints = [];
    var totalPoints = [];
    var currIndex = 1;
    var maxIndex = 0;
    var intervalHander;
    var isStart = false;
    var step = 1;
    var intervalTime = 1000;
    var zoom = 13;
    var startId;
    var points;
    var options;
    var dis = 0;//计算回放轨迹途径的距离
    $.SY.maps.initHistoryData  = function(opts){
        points = opts.points;
        startId = opts.startId;
        zoom = (typeof opts.zoom !== 'undefined') ? opts.zoom : 13;
        intervalTime =  (typeof opts.intervalTime !== 'undefined') ? opts.intervalTime : 1000;
        step = (typeof opts.step !== 'undefined') ? opts.step : 1;
        options =  opts;
        totalPoints = [];
        var len =  points.length;
        for( var k = 0 ; k < len; ){
        	if(null!=points[k].lng&&""!=points[k].lng&&null!=points[k].lat&&""!=points[k].lat){
                totalPoints.push( new AMap.LngLat(points[k].lng, points[k].lat));
        	}
        	k = k+1;
        }
        if (polyline != null && polyline != undefined) {
            polyline.setMap(null);
        }
        if (totalPoints.length >= 1) {
            currIndex = 1;
            maxIndex = totalPoints.length ;
            isStart = false;

            marker = new AMap.Marker({
                map:$.SY.maps.mapObj,
                position:totalPoints[0],//基点位置
                icon:opts.url, //marker图标，直接传递地址url
                offset:new AMap.Pixel(opts.offx,opts.offy), //相对于基点的位置
                autoRotation:true 
            });
            marker.setMap($.SY.maps.mapObj);
            marker.hide();
            $.SY.maps.mapObj.setCenter(totalPoints[0], zoom);
            $("#"+startId).attr("disabled",  false);
            
	        //如果需要展示事件列表，则初次加载需要清空
	        if(options.showEventInBox==true){
				if((typeof options.showEventInBoxId !== 'undefined')){
			    	$("#"+options.showEventInBoxId).empty();
			    }
			}
        }else {
            clearInterval(intervalHander);
            $("#"+startId).attr("value",  "播放");
            $("#"+startId).attr("disabled",  true);
           // alert("没有该用户的轨迹数据！");
        }
    };
    //分批次获取数据后，添加数据
    $.SY.maps.addHistoryData  = function(opts){
        var  point = opts.points;
        var len =  point.length;
        for( var k = 0 ; k < len; ){
        	if(null!=point[k].lng&&""!=point[k].lng&&null!=point[k].lat&&""!=point[k].lat){
                totalPoints.push( new AMap.LngLat(point[k].lng, point[k].lat));
                points.push(point[k]);
        	}
            k = k+1;
        }
        maxIndex = totalPoints.length ;
    };
    //点击播放暂停时调用
    $.SY.maps.startOrStop =  function() {
        if (!isStart) {
            clearInterval(intervalHander);
            intervalHander = setTimeout("$.SY.maps.showTrack()", 1);
            isStart = true;
            $("#"+startId).attr("value",  "暂停");
            $("#"+startId).attr("disabled",  false);
        } else {
            clearInterval(intervalHander);
            isStart = false;
            $("#"+startId).attr("value",  "播放");
            $("#"+startId).attr("disabled",  false);
        }

    }
    //点击停止时调用
    $.SY.maps.stop = function() {
        clearInterval(intervalHander);
        currIndex = 1;
        isStart = false;
        $("#"+startId).attr("value",  "播放完毕");
        $("#"+startId).attr("disabled",  true);
    }
    //点击重放时调用
    $.SY.maps.replay = function() {
    	//$.SY.maps.mapObj.clearOverlays();
    	$.SY.maps.mapObj.clearMap();
        $.SY.maps.onUnFeatureSelect();
    	marker = new AMap.Marker({
            map:$.SY.maps.mapObj,
            position:totalPoints[0],//基点位置
            icon:options.url, //marker图标，直接传递地址url
            offset:new AMap.Pixel(options.offx,options.offy), //相对于基点的位置
            autoRotation:true 
        });
        marker.setMap($.SY.maps.mapObj);
        $.SY.maps.mapObj.setCenter(totalPoints[0], zoom);
        if (polyline != null && polyline != undefined) {
            polyline.setMap(null);
        }
        clearInterval(intervalHander);
        currIndex = 1;
        isStart = false;
        $.SY.maps.startOrStop();
        //如果需要展示事件列表，则再次加载需要清空
        if(options.showEventInBox==true){
			if((typeof options.showEventInBoxId !== 'undefined')){
		    	$("#"+options.showEventInBoxId).empty();
		    }
		}
    }
    //内部函数，展示轨迹
    $.SY.maps.showTrack = function() {
        currPoints = [];
        for (var i = 0; i < currIndex; i++) {
            currPoints.push(totalPoints[i]);
        }
        if(currIndex==1){ //刚开始画，则加载线控件
            polyline  =  new AMap.Polyline( {
            map:$.SY.maps.mapObj,
            path : currPoints,
            strokeColor: "#00A",
            strokeOpacity:1,//线透明度
            strokeWeight: 3,
            strokeStyle:"solid"//线样式
            });
            polyline.setMap($.SY.maps.mapObj);
        }else{   //后续更新线控件内容
            var polylineoptions={
                path:currPoints
            };
            polyline.setOptions(polylineoptions);
        }
        $.SY.maps.showPosition();

        //如果需要展示当前经过的总距离，计算途径的距离,单位km,取4位小数
        if(options.showTotalDis==true){
        	if((typeof options.showTotalDisLabel !== 'undefined')){
        		if (currIndex <= maxIndex) {
                    if(currIndex==1){
                        dis = 0;
                    }else{
                        var twodis  = currPoints[currIndex-1].distance(currPoints[currIndex-2]);
                        dis = dis+twodis;
                    }
                }
        		var disShow = parseFloat(""+(dis/1000)).toFixed(4);
            	$("#"+options.showTotalDisLabel).html(disShow+"km");
        	}
        }
        
        if (currIndex < maxIndex) {
            currIndex += step;
            if (currIndex > maxIndex) {
                currIndex = maxIndex;
            }
            intervalHander = setTimeout("$.SY.maps.showTrack()", intervalTime);
        }else {
            clearInterval(intervalHander);
            isStart = false;
            $("#"+startId).attr("value",  "播放完毕");
            $("#"+startId).attr("disabled",  true);
        }
    }
    //内部函数展示点位置
    $.SY.maps.showPosition = function() {
        var pt = totalPoints[currIndex - 1];
        var point = points[currIndex - 1];
        marker.show();
        marker.setPosition(pt);   //更新点控件位置
        var inBounds = $.SY.maps.inMapBounds(pt);
        if( !inBounds ){
            $.SY.maps.mapObj.panTo(pt);
        }
        //如果有报警则需要增加报警点展示
        if(options.showEvent==true){
            var whiteRg = /^\s*$/;
            if( typeof( point.curEvent) !== 'undefined' && !whiteRg.test( point.curEvent)){
                var expurl = (typeof options.expurl !== 'undefined') ? options.expurl : "../images/hongdian.gif";
                var closeurl = (typeof options.closeurl !== 'undefined') ? options.closeurl : "../images/inforwindowclose.gif";
                var bottomurl = (typeof options.bottomurl !== 'undefined') ? options.bottomurl : "../images/inforwindowsharp.png";
                //var content = point.curEvent+":"+point.locationTime;
                var contentHTML = [];
                contentHTML.push("<div class='info'><div class='info-top'>");
                contentHTML.push("<img src='"+closeurl+"' onclick='$.SY.maps.onUnFeatureSelect()'></div><div class='info-middle'>");
                contentHTML.push("<p style='line-height: 12px;'>"+ point.curEvent+"</p>");
                contentHTML.push("<p style='line-height: 12px;'>"+point.locationTime+"</p>");
                contentHTML.push("</div><div class='info-bottom'><img src='"+bottomurl+"'></div></div>");
                var markerexp = {
                    lng:pt.lng,
                    lat:pt.lat,
                    url:expurl,
                    offx:options.expoffx,
                    offy:options.expoffy,
                    popupContent :contentHTML.join(""), //左键弹出框
                    popupOffx :  options.popupOffx,
                    popupOffy :  options.popupOffy,
                    popupWidth : options.popupWidth,
                    popupHeight :options.popupHeight
                };
                if( options.showEventLabel==true ){
                    markerexp.label =  point.curEvent;     //需要展示label,则需要指定下面的参数
                    markerexp.labelPos = options.labelPos;
                    markerexp.imgWidth = options.imgWidth;
                    markerexp.labelWidth = options.labelWidth;
                }
                $.SY.maps.addMarker(markerexp);
                //如果需要展示事件列表，则组装添加到列表id中
                if(options.showEventInBox==true){
		        	if((typeof options.showEventInBoxId !== 'undefined')){
                		var tempTrTd = "<tr onclick=\"$.SY.maps.popEvent('"+closeurl+"','"+bottomurl+"','"+point.curEvent+"','"+point.locationTime+"',"+pt.lng+","+pt.lat+");\"><td>"+point.curEvent+"</td><td>"+point.locationTime+"</td></tr>";
		            	$("#"+options.showEventInBoxId).append(tempTrTd);
		        	}
		        }
            }
        }

        //如果需要展示当前时间
        if(options.showCurrTime==true){
        	if((typeof options.showCurrTimeLabel !== 'undefined')){
            	$("#"+options.showCurrTimeLabel).html(point.locationTime);
        	}
        }
    }
    //有事件列表时，点击tr的冒泡展示事件
    $.SY.maps.popEvent = function (closeurl,bottomurl,curEvent,locationTime,lng,lat) {
        var contentHTML = [];
        contentHTML.push("<div class='info'><div class='info-top'>");
        contentHTML.push("<img src='"+closeurl+"' onclick='$.SY.maps.onUnFeatureSelect()'></div><div class='info-middle'>");
        contentHTML.push("<p style='line-height: 12px;'>"+ curEvent+"</p>");
        contentHTML.push("<p style='line-height: 12px;'>"+locationTime+"</p>");
        contentHTML.push("</div><div class='info-bottom'><img src='"+bottomurl+"'></div></div>");
        var position =   new AMap.LngLat(lng, lat);
 		var infoWindow = new AMap.InfoWindow( {
                isCustom : true,
                closeWhenClickMap : true,
                offset : new AMap.Pixel(15, -20)
            });
         infoWindow.setContent(contentHTML.join(""));
         infoWindow.setSize(new AMap.Size(300, 0));  
         $.SY.maps.onUnFeatureSelect();
         infoWindow.open($.SY.maps.mapObj,position); 
    }
    //间隔时间改变时调用
    $.SY.maps.speedChanged = function (speedId) {
        intervalTime = parseInt($("#"+speedId).val());
    }
    //间隔周期内跳转数时间改变时调用
    $.SY.maps.stepChanged = function (stepId) {
        step = parseInt($("#"+stepId).val());
    }

    /**
     * @description 添加聚合Marker点
     * @param markerOpts参见addMarker函数
     */
    $.SY.maps.addClusterMarker = function(markerOpts){
        var lng = markerOpts.lng;
        var lat = markerOpts.lat;
        var url = markerOpts.url;
        var offx = (typeof markerOpts.offx !== 'undefined') ? markerOpts.offx : 0;
        var offy = (typeof markerOpts.offy !== 'undefined') ? markerOpts.offy : 0;
        var rotation = (typeof markerOpts.rotation !== 'undefined') ? markerOpts.rotation : 0;
        var imgWidth = (typeof markerOpts.imgWidth !== 'undefined') ? markerOpts.imgWidth : "20%";//左右展示label时才有
        var labelWidth = (typeof markerOpts.labelWidth !== 'undefined') ? markerOpts.labelWidth : "75%";
        var id = (typeof markerOpts.id !== 'undefined') ? markerOpts.id : "";
        var label = (typeof markerOpts.label !== 'undefined') ? markerOpts.label : "";
        var fontColor = (typeof markerOpts.fontColor !== 'undefined') ? markerOpts.fontColor : "#000000";
        var fontSize = (typeof markerOpts.fontSize !== 'undefined') ? markerOpts.fontSize : 20;
        var fontWeight = (typeof markerOpts.fontWeight !== 'undefined') ? markerOpts.fontWeight : "bold";
        var fontFamily = (typeof markerOpts.fontFamily !== 'undefined') ? markerOpts.fontFamily : "Arial";
        var backgroundColor = (typeof markerOpts.backgroundColor !== 'undefined') ? markerOpts.backgroundColor : "none";
        var borderColor = (typeof markerOpts.borderColor !== 'undefined') ? markerOpts.borderColor : "black";

        var style =  "white-space: nowrap;overflow:hidden;float:left;color:"+fontColor+";font-size:"+fontSize+";font-family:"+fontFamily+";font-weight:"+fontWeight+";background-color: "
            +backgroundColor+";border-style: solid;border-width: 1px; border-color:"+borderColor+";";

        var point = new AMap.LngLat(lng, lat);
        var content =    "<img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'>" ;
        if(""!=label) {
            if(markerOpts.labelPos=="right"){   //默认是显示在上面
                content =  "<div syle='overflow:auto;'><div style='float:left;width: "+imgWidth+";'><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div><div style='float:left;width: "+labelWidth+";'><span style='"+style+"'>" + label + "</span></div></div>";
            }else  if(markerOpts.labelPos=="left"){
                content =  "<div syle='overflow:auto;'><div style='float:left;width: "+labelWidth+";'><span style='"+style+"'>" + label + "</span></div><div style='float:left;width:  "+imgWidth+";'><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div></div>";
            }else if(markerOpts.labelPos=="bottom"){
                content =  "<div syle='overflow:auto;'><div><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div><div><span style='"+style+"'>" + label + "</span></div></div>";
            }else{
                content =  "<div syle='overflow:auto;'><div><span style='"+style+"'>" + label + "</span></div><div><img  style='transform:rotate("+ rotation+"deg);-webkit-transform:rotate("+rotation+"deg);' src='" + url + "'  border='0'></div></div>";
            }
        }
        var marker = new AMap.Marker({
            id : id,
            position :   point,
            //angle : rotation,   //如果这是这个  展示的文字和图片都会旋转
            offset : new AMap.Pixel(offx, offy),
            icon : url,
            content :content  ,
            autoRotation:true
        });

        //$.SY.maps.mapObj.addOverlays(marker);
        if((typeof $.SY.maps.markerClusterer !== 'undefined')){
            $.SY.maps.markerClusterer.addMarker(marker);
            //如果带了ID，则存储到全局变量中
            if(id!==""){
                overlaysClustererMap[id] = marker;
            }
        }
        //初始化左右键弹出窗口
        if(markerOpts.menuContent){  //如果有右键菜单
            $.SY.maps.onFeatureSelectAndRightPopup(markerOpts,marker);
        }else{
            $.SY.maps.onFeatureSelect(markerOpts,marker);
        }

    };
    
    /**
     * @description 删除所有聚合Marker点
     */
    $.SY.maps.clearClusterMarkers = function(){
	       $.SY.maps.markerClusterer.clearMarkers();
    }

    /**
     * @description 根据ID获取聚合Marker点
     */
    $.SY.maps.getClusterMarkerById = function(id){
        var selected = overlaysClustererMap[id];
        if(selected !== undefined) {
 	       return selected;
        }
    };
    /**
     * @description 根据ID删除聚合Marker点
     */
    $.SY.maps.removeClusterMarkerById = function(id){
        //$.SY.maps.mapObj.removeOverlays(id);
        var selected = overlaysClustererMap[id];
        if(selected !== undefined) {
 	       $.SY.maps.markerClusterer.removeMarker(selected);
        }
    };
    /**
     * @description 根据ID获取地图上聚合Marker点的附加属性
     */
    $.SY.maps.getClusterMarkerExtData = function(id){
    	 var selected = overlaysClustererMap[id];
    	if (selected !== undefined) {
    		var extData =  selected.getExtData();
    		if (extData !== undefined) {
    			return extData;
    		}
    	}
    };
})(jQuery);
