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
     * @description 三一软件中心JavaScript库命名空间
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
     * @description 用于设置是否使用本地地图
     * @type {boolean} default value false 默认不使用本地部署的切片地图
     */
    $.SY.maps.localMap = false;
    /**
     * @description 设置本地切片服务的URL
     * @type {string}
     */
    $.SY.maps.localMapURL = "";
    /**
     * @description 用于设置是否使用部署在三一的远程切片地图服务
     * @type {boolean} default value true 默认使用部署在三一的远程切片地图服务
     */
    $.SY.maps.remoteMap = true;
    /**
     * @description 部署在三一的远程切片服务URL
     * @type {string}
     */
    $.SY.maps.remoteMapURL = "http://10.0.65.143:8081/chinaMap/maphandler?x=${x}&y=${y}&z=${l}";//发布时用切片地图

    /**
     * @description 部署在三一的iServer动态生成地图URL
     * @type {string}
     */
    $.SY.maps.dynamicURL = "http://10.0.65.145:8090/iserver/services/map-cshMap/rest/maps/cshMap";//开发时用iServer
    //$.SY.maps.dynamicURL = "http://10.0.65.144:8090/iserver/services/map-china20130107/rest/maps/china";
    /**
     * @description 路径导航URL
     * @type {string}
     */
    $.SY.maps.transportationURL = "http://10.0.65.145:8090/iserver/services/transportationAnalyst-cshMap/rest/networkanalyst/NetDT@cshdata";
    //$.SY.maps.transportationURL =  "http://10.0.65.144:8090/iserver/services/transportationAnalyst-china20130107/rest/networkanalyst/NetDT@RoadNet";
    /**
     * @description 逆地址编码URL
     * @type {string}    "http://10.0.65.145:8090/iserver/services/map-cshMap/rest/maps/cshMap";
     */
    $.SY.maps.reverseGeocodingURL = "http://10.0.65.144:8090/iserver/services/map-china20130107/rest/maps/china";
    /**
     * @description 地图对象
     * @type {{}} object
     */
    $.SY.maps.mapObj = {};
    /**
     * @description 地图缩放级别
     * @type {number} default value 13
     */
    $.SY.maps.zoom = 13;
    /**
     * @description 当zoom大于等于5时，显示marker的label
     * @type {number}
     */
    $.SY.maps.showLabelZoom = 5;
    /**
     * @description 地图中心
     * @type {{}}
     */
    $.SY.maps.center = {
        lng:112.630679,
        lat:26.890282
    };
    /**
     * @description 地图底图
     * @type {{}}
     */
    $.SY.maps.baseLayer = {};
    /**
     * @description marker点图层
     * @type {{}}
     */
    $.SY.maps.pointLayer = {};

    /**
     * @description marker点图层
     * @type {{}}
     */
    $.SY.maps.markerLayer = {};
    /**
     * @description 聚合marker点图层
     * @type {{}}
     */
    $.SY.maps.clusterLayer = {};
    /**
     * @description 多边形图层
     * @type {{}}
     */
    $.SY.maps.polygonLayer = {};
    /**
     * @description 线图层
     * @type {{}}
     */
    $.SY.maps.lineLayer = {};

    /**
     * @description 画线控件
     * @type {{}}
     */
    $.SY.maps.drawLineController = {};
    /**
     * @description 画矩形控制器
     * @type {{}}
     */
    $.SY.maps.drawRectangleController = {};
    /**
     * @description 画多边形控制器
     * @type {{}}
     */
    $.SY.maps.drawPolygonController = {};
    /**
     * @description marker点、多边形选中响应
     * @type {{}}
     */
    $.SY.maps.featureSelector = {};
    /**
     * @description 聚合marker点选中响应
     * @type {{}}
     */
    $.SY.maps.clusterSelector = {};
    /**
     * @description 地图初始化
     * @param mapProperties
     * {
     * container:HTML div ID(必须项),
     * zoom:放大级别(默认13),
     * center:{lng:经度,lat:纬度} 地图中心经纬度(默认在长沙三一),
     * localMap:是否使用本地地图(会修改$.SY.maps.localMap的值：true或false，可选项；可直接修改$.SY.maps.localMap的值),
     * fullScreen:是否使用全屏控件(默认包含全屏控件:true-包含;false-不包含)
     * }
     */
    $.SY.maps.init = function(mapProperties){
        $.SY.maps.mapObj = new SuperMap.Map(mapProperties.container, { controls: [
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar({showSlider:true}),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true
                }

            })], allOverlays: true
        });

        $.SY.maps.pointLayer = new SuperMap.Layer.Markers("Markers");
        $.SY.maps.markerLayer = new SuperMap.Layer.Vector("markerLayer");
        $.SY.maps.polygonLayer = new SuperMap.Layer.Vector("polygonLayer");
        $.SY.maps.lineLayer = new SuperMap.Layer.Vector("lineLayer");
        //marker点等选中控件
        $.SY.maps.featureSelector = new SuperMap.Control.SelectFeature($.SY.maps.markerLayer,{repeat:true,onSelect: $.SY.maps.onFeatureSelect,onUnselect: $.SY.maps.onUnFeatureSelect});
        $.SY.maps.mapObj.addControl($.SY.maps.featureSelector);
        //画点控件
        $.SY.maps.drawPointController = new SuperMap.Control.DrawFeature($.SY.maps.lineLayer,SuperMap.Handler.Point);
        $.SY.maps.mapObj.addControl($.SY.maps.drawPointController);
        //画线控件
        $.SY.maps.drawLineController = new SuperMap.Control.DrawFeature($.SY.maps.lineLayer,SuperMap.Handler.Path);
        $.SY.maps.mapObj.addControl($.SY.maps.drawLineController);
        //画矩形控件
        $.SY.maps.drawRectangleController= new SuperMap.Control.DrawFeature($.SY.maps.polygonLayer, SuperMap.Handler.RegularPolygon,{handlerOptions:{irregular:true}});//画规则的矩形
        $.SY.maps.mapObj.addControl($.SY.maps.drawRectangleController);
        //画多边形控件
        $.SY.maps.drawPolygonController = new SuperMap.Control.DrawFeature($.SY.maps.polygonLayer, SuperMap.Handler.Polygon);
        $.SY.maps.mapObj.addControl($.SY.maps.drawPolygonController);

        if( typeof mapProperties.center !== 'undefined' ){//地图中心位置
            $.SY.maps.center.lng =  mapProperties.center.lng;
            $.SY.maps.center.lat =  mapProperties.center.lat;
        }
        if( typeof mapProperties.localMap !== 'undefined' ){//是否使用本地地图
            $.SY.maps.localMap =  mapProperties.localMap;
        }
        /**
         * @description 自定义全屏控件（支持最新版的Firefox、chrome）,依赖fullscreen.js,不需要修改
         * @type {*}
         */
        if( typeof mapProperties.fullScreen === 'undefined' || mapProperties.fullScreen ){
            SuperMap.Control.FullScreenControl = SuperMap.Class(SuperMap.Control,{
                id: "fullScreen",
                type: SuperMap.Control.TYPE_BUTTON,
                isFull: false,
                trigger: function() {
                    if (!this.isFull) {
                        screenfull.request($('#'+mapProperties.container)[0]);
                    }else {
                        screenfull.exit();
                    }
                    this.isFull = !this.isFull;
                },
                draw: function(px) {
                    SuperMap.Control.prototype.draw.apply(this, arguments);
                    this._addButton("fullBtn", "zoom-maxextent-mini_one.png",
                        new SuperMap.Pixel(0,0), new SuperMap.Size(16, 11));
                    return this.div;
                },
                _addButton:function(id, img, xy, sz) {
                    var imgLocation = SuperMap.Util.getImagesLocation() + img;
                    var btn = SuperMap.Util.createAlphaImageDiv(
                        this.id + "_" + id,
                        xy, sz, imgLocation, "absolute");
                    btn.style.cursor = "pointer";
                    btn.style.alt = "全屏";
                    this.div.appendChild(btn);
                    SuperMap.Event.observe(btn, "mousedown",
                        SuperMap.Function.bindAsEventListener(this.trigger, btn));
                    SuperMap.Event.observe(btn, "dblclick",
                        SuperMap.Function.bindAsEventListener(this.trigger, btn));
                    SuperMap.Event.observe(btn, "click",
                        SuperMap.Function.bindAsEventListener(this.trigger, btn));
                    return btn;
                },
                CLASS_NAME: "SuperMap.Control.FullScreenControl"
            });
            var fullScreenControl = new SuperMap.Control.FullScreenControl();
            $.SY.maps.mapObj.addControl(fullScreenControl);
        }
        if( $.SY.maps.localMap || $.SY.maps.remoteMap ){//使用静态切片地图
            var vectorGroup = "";
            if( $.SY.maps.localMap ){
                vectorGroup = $.SY.maps.localMapURL;
            }
            if($.SY.maps.remoteMap ){
                vectorGroup = $.SY.maps.remoteMapURL;
            }
            SuperMap.Layer.V5Layer = SuperMap.Class(SuperMap.CanvasLayer, {
                mode: 'VECTOR',
                name: "V5Layer",
                url: null,
                VectorGroup :vectorGroup,
                initialize: function (options) {
                    var me = this;
                    options = SuperMap.Util.extend({
                        maxExtent: new SuperMap.Bounds(-180, -90, 180, 90),
                        resolutions: [1.11709248643759997546959971484,  0.55854624321879998773479985742002,0.27927312160939999386739992871001,0.13963656080469999693369996435501,
                            0.0698182804023499984668499821775,0.03490914020117499923342499108875,0.01745457010058749961671249554438,0.00872728505029374980835624777219,
                            0.00436364252514687490417812388609,0.00218182126257343745208906194305,0.00109091063128671872604453097152,0.00054545531564335936302226548576174,
                            0.00027272765782167968151113274288087,0.00013636382891083984075556637144043,0.000068181914455419920377783185720217,0.000034090957227709960188891592860109,
                            0.000017045478613854980094445796430054,0.0000085227393069274900472228982150272,0.0000042613696534637450236114491075136,0.0000021306848267318725118057245], //0-19级，请自行补充完整
                        scales: [1/470000000, 1/235000000,1/117500000 ,1/58750000,1/29375000,
                            1/14687500,1/7343750,1/3671875,1/1835938,1/917969,
                            1/458984,1/229492,1/114746,1/57373,1/28687,
                            1/14343,1/7172, 1/3586,1/1793,1/896]
                    }, options);
                    SuperMap.CanvasLayer.prototype.initialize.apply(me, [me.name, me.url, null, options]);
                },
                destroy: function () {
                    var me = this;
                    SuperMap.CanvasLayer.prototype.destroy.apply(me, arguments);
                    me.name = null;
                    me.url = null;
                },
                clone: function (obj) {
                    var me = this;
                    if (obj == null) {
                        obj = new SuperMap.Layer.V5Layer(
                            me.name, me.url, me.getOptions());
                    }
                    obj = SuperMap.CanvasLayer.prototype.clone.apply(me, [obj]);
                    return obj;
                },
                getLevelForResolution: function (res) {
                    var me = this;
                    var selectIndex = 0;
                    for (var i=0,len=me.resolutions.length;i<len;i++) {
                        if (me.resolutions[i] ===res) {
                            selectIndex = i;
                            break;
                        }
                    }
                    return  Math.round(1/me.scales[selectIndex]);
                },
                getTileUrl: function (xyz) {
                    var me = this,
                        tileSize = new SuperMap.Size(256,256),
                        url = me.url;
                    //此处获取比例尺或等级值
                    var level = me.getLevelForResolution(me.map.getResolution());
                    me.url = me.VectorGroup;
                    //替换url模板
                    var url =  SuperMap.String.format(me.url, {
                        x: xyz.x,
                        y: xyz.y,
                        l: level
                    });
                    return url;
                },
                CLASS_NAME: "SuperMap.Layer.V5Layer"
            });
            $.SY.maps.baseLayer = new SuperMap.Layer.V5Layer();
            $.SY.maps.layerInitializeListener();
        }else{//使用iServer动态出图
            $.SY.maps.baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("dynamicMap", $.SY.maps.dynamicURL, {transparent: true, cacheEnabled: true}, {
                /* resolutions: [ 1.4073606133878825508580000928978,
                 0.70368030669394127542900004644889, 0.35184015334697063771450002322444, 0.17592007667348531885725001161222,
                 0.08796003833674265942862500580611, 0.04398001916837132971431250290306, 0.02199000958418566485715625145153,
                 0.01099500479209283242857812572576, 0.00549750239604641621428906286288, 0.00274875119802320810714453143144,
                 0.00137437559901160405357226571572, 0.00068718779950580202678613285786, 0.00034359389975290101339306642893,
                 0.00017179694987645050669653321446, 0.00008589847493822525334826660723, 0.00004294923746911262667413330361,
                 0.00002147461873455631333706665180, 0.00001073730936727815666853332590, 0.00000536865468363907833426666295,
                 0.000002684327341819539167133331
                 ]    */
                //如果要访问iserver发布的服务，则需要设置比例尺属性值，这样才能保证
                scales:[1/470000000,1/235000000,1/117500000,1/58750000,1/29375000,1/14687500,1/7343750,
                    1/3671875,1/1835937.5,1/917968.75,1/458984.375,1/229492.1875,1/114746.09375,
                    1/57373.046875,1/28686.5234375,1/14343.26171875,1/7171.630859375,1/3585.8154296875,1/1792.90771484375,1/896.453857421875]
            });
            $.SY.maps.baseLayer.events.on({"layerInitialized": $.SY.maps.layerInitializeListener});
        }
        $.SY.maps.featureSelector.activate();
    };
    /**
     * @description 地图底图加载后的响应事件
     */
    $.SY.maps.layerInitializeListener = function(){
        $.SY.maps.mapObj.addLayers([$.SY.maps.baseLayer, $.SY.maps.polygonLayer, $.SY.maps.lineLayer, $.SY.maps.markerLayer,$.SY.maps.pointLayer]);
        $.SY.maps.mapObj.setCenter(new SuperMap.LonLat($.SY.maps.center.lng, $.SY.maps.center.lat), $.SY.maps.zoom);
        $.SY.maps.mapObj.events.on({"zoomend": $.SY.maps.redrawAllFeature});
    };
    /**
     * @description 地图缩放监听事件，当缩放级别大于等于13时，显示label
     */
    $.SY.maps.redrawAllFeature = function(){
        var showZoom = $.SY.maps.showLabelZoom;
        var zoom = $.SY.maps.mapObj.getZoom();
        var vector = $.SY.maps.markerLayer.features;
        var polygonVector = $.SY.maps.polygonLayer.features;
        var vectorNum = vector.length;
        var polygonVectorNum = polygonVector.length;
        for( var i = 0 ; i < vectorNum ; i += 1){
            if( zoom >= showZoom ){
                vector[i].style.label = vector[i].label;
            }else{
                vector[i].style.label = "";
            }
        }
        for( var j = 0 ; j < polygonVectorNum ; j += 1){
            if( zoom >= showZoom ){
                polygonVector[j].style.label = polygonVector[j].label;
            }else{
                polygonVector[j].style.label = "";
            }
        }
        $.SY.maps.polygonLayer.redraw();
        $.SY.maps.markerLayer.redraw();
    };
    /**
     * @description 激活画点控件
     */
    $.SY.maps.activeDrawPointController = function(){
        $.SY.maps.drawPointController.activate();
    };
    /**
     * @description 冻结画点控件
     */
    $.SY.maps.deactiveDrawPointController = function( listener ){
        $.SY.maps.drawPointController.deactivate();
        $.SY.maps.drawPointController.events.un({"featureadded":listener});
    };
    /**
     * @description 绑定画点完成监听事件
     * @param listener
     */
    $.SY.maps.bindDrawPointCompleteListener = function( listener ){
        $.SY.maps.drawPointController.events.on({"featureadded": listener});
    };
    /**
     * @description 激活画线控件
     */
    $.SY.maps.activeDrawLineController = function(){
        $.SY.maps.drawLineController.activate();
    };
    /**
     * @description 冻结画线控件
     */
    $.SY.maps.deactiveDrawLineController = function( listener ){
        $.SY.maps.drawLineController.deactivate();
        $.SY.maps.drawLineController.events.un({"featureadded":listener});
    };
    /**
     * @description 绑定画线完成监听事件
     * @param listener
     */
    $.SY.maps.bindDrawLineCompleteListener = function( listener ){
        $.SY.maps.drawLineController.events.on({"featureadded": listener});
    };
    /**
     * @description 激活画矩形框控件
     */
    $.SY.maps.activeDrawRectangleController = function(){
        $.SY.maps.drawRectangleController.activate();
    };
    /**
     * @description 冻结画矩形框控件
     */
    $.SY.maps.deactiveDrawRectangleController = function( listener ){
        $.SY.maps.drawRectangleController.deactivate();
        $.SY.maps.drawRectangleController.events.un({"featureadded":listener});
    };
    /**
     * @description 绑定画矩形监听事件，当矩形框画完后，执行监听函数
     * @param listener 矩形画完后的监听函数 listener包含一个参数：drawGeometryArgs
     * 通过 drawGeometryArgs.feature.geometry.bounds获取矩形边框
     * 再通过bounds获取left(左边框经度)，right(右边框经度)，top(上边框纬度)，bottom(下边框纬度)
     */
    $.SY.maps.bindDrawRectangleCompletedListener = function( listener ){
        $.SY.maps.drawRectangleController.events.on({"featureadded": listener});
    };
    /**
     * @description 激活画多边形控件
     */
    $.SY.maps.activeDrawPolygonController = function(){
        $.SY.maps.drawPolygonController.activate();
    };
    /**
     * @description 冻结画多边形控件
     */
    $.SY.maps.deactiveDrawPolygonController = function( listener ){
        $.SY.maps.drawPolygonController.deactivate();
        $.SY.maps.drawPolygonController.events.un({"featureadded":listener});
    };
    /**
     * @description 绑定画多边形监听事件，当多边形画完后，执行监听函数
     * @param listener 多边形画完后的监听函数 listener包含一个参数：drawGeometryArgs
     * 通过 drawGeometryArgs.feature.geometry.components;获取component数组，遍历每一个component，
     * component包含components属性，为经纬度点序列
     */
    $.SY.maps.bindDrawPolygonCompletedListener = function( listener ){
        $.SY.maps.drawPolygonController.events.on({"featureadded": listener});
    };
    /**
     * @description 设置地图中心点及zoom级别
     * @param lng 中心点经度
     * @param lat 中心点纬度
     * @param zoom 缩放级别
     */
    $.SY.maps.setCenter = function(lng,lat,zoom){
        var center = new SuperMap.LonLat(lng,lat);
        $.SY.maps.mapObj.setCenter(center,zoom,false,true);
    };
    /**
     * @description 平移地图中心位置到指定的经纬度点
     * @param lng 经度
     * @param lat 纬度
     */
    $.SY.maps.panTo = function(lng,lat){
        var center = new SuperMap.LonLat(lng,lat);
        $.SY.maps.mapObj.panTo(center);
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
        var extents = $.SY.maps.mapObj.getExtent();
        var bounds = {
            left:extents.left,
            right:extents.right,
            top:extents.top,
            bottom:extents.bottom
        };
        return bounds;
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
        var isInBounds = false;
        var bounds = $.SY.maps.getBounds();
        var lngFloat = parseFloat(lngLat.lng);
        var latFloat = parseFloat(lngLat.lat);
        var boundLeftFloat = parseFloat(bounds.left);
        var boundRightFloat = parseFloat(bounds.right);
        var boundTopFloat  = parseFloat(bounds.top);
        var boundBottomFloat = parseFloat(bounds.bottom);
        if( lngFloat < boundRightFloat && lngFloat > boundLeftFloat && latFloat > boundBottomFloat && latFloat < boundTopFloat){
            isInBounds = true;
        }
        return isInBounds;
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
        var startLngLatObj = new SuperMap.LonLat(startLngLat.lng,startLngLat.lat);
        var endLngLatObj = new SuperMap.LonLat(endLngLat.lng,endLngLat.lat);
        distance = SuperMap.Util.distVincenty(startLngLatObj,endLngLatObj)*1000;
        return distance;
    };
    /**
     * @description 根据中心点及指定的长宽获取矩形的四个角
     * @param centerLngLat
     * {
     *  lng:经度,
     *  lat:纬度
     * }(必须)
     * @param lenx指定长
     * @param lenx指定宽
     * (必须)
     * @returns {rectObject ={righttop:righttop,rightdown:rightdown,leftdown:leftdown,lefttop:lefttop},注意righttop{lon:lon,lat:lat}}
     */
    $.SY.maps.getRectangle = function(centerLngLat,lenx,leny){
        var rectObject;
        var cenLngLatObj = new SuperMap.LonLat(centerLngLat.lng,centerLngLat.lat);
        var a = Math.atan(leny/lenx)*180/Math.PI;
        var lenxy = Math.sqrt( Math.pow(lenx/2,2) + Math.pow(leny/2,2));
        var righttopa = 90 -a;
        var righttop= SuperMap.Util.destinationVincenty(cenLngLatObj,righttopa,lenxy);

        var rightdowna = 90 + a;
        var rightdown = SuperMap.Util.destinationVincenty(cenLngLatObj,rightdowna,lenxy);

        var leftdowna =  270 - a;
        var leftdown= SuperMap.Util.destinationVincenty(cenLngLatObj,leftdowna,lenxy);

        var lefttopa = 270 + a;
        var lefttop= SuperMap.Util.destinationVincenty(cenLngLatObj,lefttopa,lenxy);

        rectObject ={righttop:righttop,rightdown:rightdown,leftdown:leftdown,lefttop:lefttop};
        return rectObject;
    };
    /**
     * @description 在地图上添加marker点
     * @param markerOpts
     * {
     * lng:经度（必须）,
     * lat:纬度(必须),
     * url:marker点图标的URL(必须),
     * rotation:marker点图标的旋转方向(必须:顺时针方向0为正北),
     * w:marker点图标的宽度(必须),
     * h:marker点图标的高度(必须),
     * label:marker点的label文字,
     * fontColor:label字体的颜色(可选),
     * popupContent 如果有内容，则有左键菜单  （可选,html格式),
     * menuContent:如果有内容，则有右键菜单 （可选,html格式),
     * }
     */
    $.SY.maps.addMarker = function(markerOpts){
        var lng = markerOpts.lng;
        var lat = markerOpts.lat;
        var url = markerOpts.url;
        var rotation = markerOpts.rotation;
        var iconW = markerOpts.w;
        var iconH = markerOpts.h;
        var fontColor = (typeof markerOpts.fontColor !== 'undefined') ? markerOpts.fontColor : "#000000";
        var fontSize = (typeof markerOpts.fontSize !== 'undefined') ? markerOpts.fontSize : 12;
        var fontWeight = (typeof markerOpts.fontWeight !== 'undefined') ? markerOpts.fontWeight : "bold";
        var fontFamily = (typeof markerOpts.fontFamily !== 'undefined') ? markerOpts.fontFamily : "Arial";

        var point = new SuperMap.Geometry.Point(lng,lat);
        var style = {externalGraphic:url,graphicWidth:iconW,graphicHeight:iconH,
            cursor:"pointer",labelAlign:"ct",rotation:rotation,labelXOffset:20,labelYOffset:15,
            fontSize:fontSize,fontColor:fontColor,fontWeight:fontWeight,fontFamily:fontFamily};
        var zoom = $.SY.maps.mapObj.getZoom();
        var showZoom = $.SY.maps.showLabelZoom;
        var label = "";
        if( markerOpts.label ){
            label = markerOpts.label;
        }
        if( zoom >= showZoom ){
            style.label = label;
        }
        var pointVector = new SuperMap.Feature.Vector(point,markerOpts,style);
        //存储label，用于当zoom级别大于等于showZoom时显示
        pointVector.label = label;
        if( markerOpts.id ){
            pointVector.id = markerOpts.id;
        }

        $.SY.maps.markerLayer.addFeatures([pointVector]);
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
     * @description 删除所有marker点
     */
    $.SY.maps.removeAllMarkers = function(){
        $.SY.maps.markerLayer.removeAllFeatures();
    };
    /**
     * @description 在地图上添加线
     * @param lineOpts
     * {
     * points:经纬度对象点数组(必须：[{lng:xxx,lat:xxx},……]),
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
        var id = lineOpts.id;
        var mapPoints = [];
        for( var i = 0 ; i < points.length ; i += 1){
            mapPoints.push( new SuperMap.Geometry.Point(points[i].lng, points[i].lat));
        }
        var lineObj = new SuperMap.Geometry.LineString(mapPoints);

        var strokeColor = (typeof lineOpts.strokeColor !== 'undefined') ? lineOpts.fillColor : "#FF0000";
        var strokeWidth = (typeof lineOpts.strokeWidth !== 'undefined') ? lineOpts.fillColor : 2;
        var strokeOpacity = (typeof lineOpts.strokeOpacity !== 'undefined') ? lineOpts.fillColor : 0.4;
        var fontColor = (typeof lineOpts.fontColor !== 'undefined') ? lineOpts.fontColor : "#000000";
        var fontSize = (typeof lineOpts.fontSize !== 'undefined') ? lineOpts.fontSize : "16px";
        var fontFamily = (typeof lineOpts.fontFamily !== 'undefined') ? lineOpts.fontFamily : "SimHei";

        var style = {stroke:true,strokeColor:strokeColor,strokeWidth:strokeWidth,strokeOpacity:strokeOpacity,
            fontColor:fontColor,fontSize:fontSize,fontFamily:fontFamily};
        var zoom = $.SY.maps.mapObj.getZoom();
        var showZoom = $.SY.maps.showLabelZoom;
        var label = "";
        if( lineOpts.label ){
            label = lineOpts.label;
        }
        if( zoom >= showZoom ){
            style.label = label;
        }
        var lineVector = new SuperMap.Feature.Vector(lineObj,{},style);
        lineVector.label = label;
        if( id!== undefined ){
            lineVector.id = id;
        }
        $.SY.maps.lineLayer.addFeatures(lineVector);
    };
    /**
     * @description 删除地图上的所有线对象
     */
    $.SY.maps.removeAllLines = function(){
        $.SY.maps.lineLayer.removeAllFeatures();
    };
    /**
     * @description 在地图上添加矩形框
     * @param rectOpts
     * {
     * left:矩形左边框经度(必须)
     * top:矩形上边框纬度(必须)
     * right:矩形右边框经度(必须)
     * bottom:矩形下边框纬度(必须)
     * fillColor:矩形填充色(默认值：#8ECEA5)
     * fillOpacity:矩形填充色透明度(默认值：0.3)
     * strokeColor:矩形边框颜色(默认值：#20D660)
     * strokeWidth:矩形边框宽度(默认值：3)
     * strokeOpacity:矩形边框透明度(默认值：0.7)
     * fontColor:label字体颜色（默认值：#000000）
     * fontSize:label字体大小（默认值：16px）
     * fontFamily:label字体格式（默认值：SimHei）
     * }
     */
    $.SY.maps.addRectangle = function(rectOpts){
        var left = rectOpts.left;
        var top = rectOpts.top;
        var right = rectOpts.right;
        var bottom = rectOpts.bottom;
        var id = rectOpts.id;
        var fillColor = (typeof rectOpts.fillColor !== 'undefined') ? rectOpts.fillColor : "#8ECEA5";
        var fillOpacity = (typeof rectOpts.fillOpacity !== 'undefined') ? rectOpts.fillOpacity : 0.3;
        var strokeColor = (typeof rectOpts.strokeColor !== 'undefined') ? rectOpts.strokeColor : "#20D660";
        var strokeWidth = (typeof rectOpts.strokeWidth !== 'undefined') ? rectOpts.strokeWidth : 3;
        var strokeOpacity = (typeof rectOpts.strokeOpacity !== 'undefined') ? rectOpts.strokeOpacity : 0.7;
        var fontColor = (typeof rectOpts.fontColor !== 'undefined') ? rectOpts.fontColor : "#000000";
        var fontSize = (typeof rectOpts.fontSize !== 'undefined') ? rectOpts.fontSize : "16px";
        var fontFamily = (typeof rectOpts.fontFamily !== 'undefined') ? rectOpts.fontFamily : "SimHei";

        if( left != right && top != bottom ){
            var bounds = new SuperMap.Bounds(left,bottom,right,top);
            var rect = bounds.toGeometry();
            var style = {fillColor:fillColor,fillOpacity:fillOpacity,stroke:true,strokeColor:strokeColor,
                strokeWidth:strokeWidth,strokeOpacity:strokeOpacity,labelAlign:"cm",fontColor:fontColor,
                fontSize:fontSize,fontFamily:fontFamily};
            var zoom = $.SY.maps.mapObj.getZoom();
            var showZoom = $.SY.maps.showLabelZoom;
            var label = "";
            if( rectOpts.label ){
                label = rectOpts.label;
            }
            if( zoom >= showZoom ){
                style.label = label;
            }
            var rectVector = new SuperMap.Feature.Vector(rect);
            rectVector.style = style;
            rectVector.label = label;
            if( id!== undefined ){
                rectVector.id = id;
            }
            $.SY.maps.polygonLayer.addFeatures([rectVector]);
        }
    };

    /**
     * @description 在地图上添加多边形
     * @param polygonOpts
     * {
     * points:经纬度点对象数组(必须：[{lng:xxx,lat:xxx},……]),
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
        var id = polygonOpts.id;
        var mapPoints = [];
        for( var i = 0 ; i < points.length ; i++){
            mapPoints.push( new SuperMap.Geometry.Point(points[i].lng, points[i].lat));
        }
        var lineRingObj = new SuperMap.Geometry.LinearRing(mapPoints);
        var polygonObj = new SuperMap.Geometry.Polygon([lineRingObj]);
        var fillColor = (typeof polygonOpts.fillColor !== 'undefined') ? polygonOpts.fillColor : "#EE9900";
        var fillOpacity = (typeof polygonOpts.fillOpacity !== 'undefined') ? polygonOpts.fillOpacity : 0;
        var strokeColor = (typeof polygonOpts.strokeColor !== 'undefined') ? polygonOpts.strokeColor : "#00FF00";
        var strokeWidth = (typeof polygonOpts.strokeWidth !== 'undefined') ? polygonOpts.strokeWidth : 2;
        var strokeOpacity = (typeof polygonOpts.strokeOpacity !== 'undefined') ? polygonOpts.strokeOpacity : 0.4;
        var fontColor = (typeof polygonOpts.fontColor !== 'undefined') ? polygonOpts.fontColor : "#000000";
        var fontSize = (typeof polygonOpts.fontSize !== 'undefined') ? polygonOpts.fontSize : "16px";
        var fontFamily = (typeof polygonOpts.fontFamily !== 'undefined') ? polygonOpts.fontFamily : "SimHei";

        var style = {stroke:true,strokeColor:strokeColor,strokeWidth:strokeWidth,fillOpacity:fillOpacity,
            strokeOpacity:strokeOpacity,fillColor:fillColor,polygonOpts:polygonOpts,fontColor:fontColor,labelAlign:"cm",
            fontSize:fontSize,fontFamily:fontFamily};
        //stroke:不需要描边则设为false,strokeColor:十六进制描边颜色,strokeWidth:像素描边宽度，默认为1,fillOpacity:填充不透明度。默认为0.4,
        //strokeOpacity:描边的不透明度(0-1),默认为0.4,fillColor:十六进制填充颜色默认为”#ee9900”,polygonOpts:polygonOpts,fontColor:标签字体颜色
        //fontFamily:标签的字体类型 fontSize:标签的字体大小 fontStyle:标签的字体样式
        var zoom = $.SY.maps.mapObj.getZoom();
        var showZoom = $.SY.maps.showLabelZoom;
        var label = "";
        if( polygonOpts.label ){
            label = polygonOpts.label;
        }
        if( zoom >= showZoom ){
            style.label = label;
        }
        var polygnVector = new SuperMap.Feature.Vector(polygonObj,{},style);
        polygnVector.label =  label;
        if( id!== undefined ){
            polygnVector.id = id;
        }
        $.SY.maps.polygonLayer.addFeatures([polygnVector]);
    };
    /**
     * @description 添加多个多边形
     * @param multiPolygonOpts
     * {
     * polygons:多边形数组[
     * {
     * polygon:[
     * {
     *   lng:xxx,
     *   lat:xxx
     * },……
     * ]
     * },……]
     * fillColor:多边形填充色(默认值：#EE9900)
     * fillOpacity:多边形填充色透明度(默认值：0)
     * strokeColor:多边形边框颜色(默认值：#00FF00)
     * strokeWidth:多边形边框宽度(默认值：2)
     * strokeOpacity:多边形边框透明度(默认值：0.4)
     * fontColor:label字体颜色（默认值：#000000）
     * fontSize:label字体大小（默认值：16px）
     * fontFamily:label字体格式（默认值：SimHei）
     * }
     * @returns {SuperMap.Feature.Vector}
     */
    $.SY.maps.addMultiPolygon = function(multiPolygonOpts){
        var polygons = multiPolygonOpts.polygons;
        var polygonArr = [];
        var fillColor = (typeof multiPolygonOpts.fillColor !== 'undefined') ? multiPolygonOpts.fillColor : "#EE9900";
        var fillOpacity = (typeof multiPolygonOpts.fillOpacity !== 'undefined') ? multiPolygonOpts.fillColor : 0;
        var strokeColor = (typeof multiPolygonOpts.strokeColor !== 'undefined') ? multiPolygonOpts.fillColor : "#00FF00";
        var strokeWidth = (typeof multiPolygonOpts.strokeWidth !== 'undefined') ? multiPolygonOpts.fillColor : 2;
        var strokeOpacity = (typeof multiPolygonOpts.strokeOpacity !== 'undefined') ? multiPolygonOpts.fillColor : 0.4;
        var fontColor = (typeof multiPolygonOpts.fontColor !== 'undefined') ? multiPolygonOpts.fontColor : "#000000";
        var fontSize = (typeof multiPolygonOpts.fontSize !== 'undefined') ? multiPolygonOpts.fontSize : "16px";
        var fontFamily = (typeof multiPolygonOpts.fontFamily !== 'undefined') ? multiPolygonOpts.fontFamily : "SimHei";

        for( var i = 0 ; i < polygons.length ; i += 1){
            var polygon = polygons[i].polygon;
            var mapPoints = [];
            for( var j = 0,len=polygon.length ; j < len ; j += 1){
                mapPoints.push( new SuperMap.Geometry.Point(polygon[j].lng, polygon[j].lat));
            }
            var lineRingObj = new SuperMap.Geometry.LinearRing(mapPoints);
            var polygonObj = new SuperMap.Geometry.Polygon([lineRingObj]);
            polygonArr.push(polygonObj);
        }
        var style = {stroke:true,strokeColor:strokeColor,strokeWidth:strokeWidth,
            fillOpacity:fillOpacity,fillColor:fillColor,strokeOpacity:strokeOpacity,
            fontColor:fontColor,fontSize:fontSize,fontFamily:fontFamily};
        var multiPolygonObj = new SuperMap.Geometry.MultiPolygon(polygonArr);
        var multiPolygonVector = new SuperMap.Feature.Vector(multiPolygonObj,{},style);
        $.SY.maps.polygonLayer.addFeatures(multiPolygonVector);
        return multiPolygonVector;
    };
    /**
     * @description 移除地图上所有的矩形和多边形
     */
    $.SY.maps.removeAllPolygons = function(){
        $.SY.maps.polygonLayer.removeAllFeatures();
    };
    /**
     * @description 删除地图上所有的marker点、多边形、线对象
     */
    $.SY.maps.clearOverlays = function(){
        $.SY.maps.markerLayer.removeAllFeatures();
        $.SY.maps.lineLayer.removeAllFeatures();
        $.SY.maps.polygonLayer.removeAllFeatures();
    };
    /**
     * @description 输入经纬度点序列，查找连接点序列的路径
     * @param options
     * {
     *  points:点序列数组(必须,[{lng:xxx,lat:xxx},……]),
     *  weightFieldName:查询条件（路径最短、时间最短等，默认值：路径最短（SMLENGTH）且当前只支持路径最短）
     *  listener:路径查询成功后的响应函数 listener函数有一个参数findPathEventArgs，通过该参数可以获取到导航路径的经纬度点序列
     *  findPathEventArgs.result。pathList[0].route.points 即为经纬度点序列数组
     * }
     */
    $.SY.maps.findPath = function(options){
        var findPathService = "";//路径导航REST服务
        var parameter = "";//路径导航REST服务参数
        var analystParameter = "";//路径分析条件
        var resultSetting = "";//返回结果设置
        var nodeArray = [];
        var weightFieldName = (typeof options.weightFieldName !== 'undefined')? options.weightFieldName : "SMLENGTH";
        if( options.points && options.points.length > 1 ){
            var points = options.points;
            for( var i = 0 ; i < points.length ; i += 1){
                nodeArray.push(new SuperMap.Geometry.Point(points[i].lng,points[i].lat));
            }
            resultSetting = new SuperMap.REST.TransportationAnalystResultSetting({
                returnEdgeFeatures: true,
                returnEdgeGeometry: true,
                returnEdgeIDs: true,
                returnNodeFeatures: true,
                returnNodeGeometry: true,
                returnNodeIDs: true,
                returnPathGuides: true,
                returnRoutes: true
            });
            analystParameter = new SuperMap.REST.TransportationAnalystParameter({
                resultSetting:resultSetting,
                weightFieldName:weightFieldName
            });
            parameter = new SuperMap.REST.FindPathParameters({
                isAnalyzeById: false,
                nodes: nodeArray,
                hasLeastEdgeCount: false,
                parameter: analystParameter
            });
            var pathService = $.SY.maps.transportationURL;
            findPathService = new SuperMap.REST.FindPathService(pathService,{
                eventListeners:{"processCompleted":options.listener}
            });
            findPathService.processAsync(parameter);
        }else{
            return;
        }
    };
    /**
     * @description 根据传入的经纬度点及逆地址编码参数，进行逆地址编码请求(默认返回：省+市+县/区+POI)，注意要根据地图发布情况，修改
     * new SuperMap.REST.FilterParameter({name: "China_Province_pl@cshdata", fields:["NAME"]})中的name属性
     * @param options 逆地址编码参数.{
     *  lng:经度(必须),
     *  lat:纬度(必须),
     *  distance:范围，单位米(默认100米),
     *  expectCount:期望返回POI点的个数（默认2个，比如：三一老培训中心，长沙市八医院）,
     *  successListener:逆地址编码成功响应函数（必须）, successListener函数带一个参数result
     *  result.result.totalCount获取查询参数总计返回结果数目
     *  result.result.recordsets 省、市、县/区、POI，如果都有值，那么result.recordsets[0]对应省份、
     *  result.result.recordsets[1]对应市、result.recordsets[2]对应县/区、result.recordsets[3]对应POI
     *  result.result.recordsets[i].features 对应每一项查询参数具体结果数组
     *  result.result.recordsets[i].features[j].attributes['NAME'] 对应具体值
     *  具体参考示例,
     *  failedListener:逆地址编码失败后的响应函数(必须) failedListener函数带一个参数e,可以 通过
     *  e.error.errorMsg获取逆地址编码失败原因
     * }
     */
    $.SY.maps.reverseGeocoding = function(options){
        var x = options.lng;
        var y = options.lat;
        var queryUrl = $.SY.maps.reverseGeocodingURL;
        var distance = (typeof options.distance !== "undefined") ? (parseFloat(options.distance) * 0.00001) : 0.05;
        var expectCount = (typeof options.expectCount !== "undefined") ? options.expectCount : 5;
        var queryProvinceParam = new SuperMap.REST.FilterParameter({name: "China_Province_pl@china", fields:["NAME"]});
        var queryCityParam = new SuperMap.REST.FilterParameter({name: "China_CitDistrict_pl@china", fields:["NAME"]});
        var queryTownParam = new SuperMap.REST.FilterParameter({name: "China_TownDistrict_pl_1@china", fields:["NAME"]});
        var queryPOIParam = new SuperMap.REST.FilterParameter({name: "POI@zongshuju", fields:["NAME"]});

        var queryByGeometryParameters;
        var queryService;
        var queryParams = [queryProvinceParam,queryCityParam,queryTownParam,queryPOIParam]; //,queryRegionParam
        //queryParams.push(queryPOIParam);
        queryByGeometryParameters = new SuperMap.REST.QueryByDistanceParameters({
            queryParams: queryParams,
            returnContent: true,
            geometry: new SuperMap.Geometry.Point(x, y),
            isNearest: true, //只返回一个最近的结果，此处未起作用
            distance: distance, //0.00001约为1米，半径越大，等待响应与接收数据时间越长
            expectCount:expectCount
        });
        queryService = new SuperMap.REST.QueryByDistanceService(queryUrl);
        queryService.events.on({
            "processCompleted": options.successListener,
            "processFailed": options.failedListener
        });
        queryService.processAsync(queryByGeometryParameters);
    };
    /**
     * @description 用于标记当前回放的位置
     * @type {number}
     */
    $.SY.maps.traceLoc = 0;
    /**
     * @description 轨迹回放
     * @param historyDataArray 历史数据数组{
     * [{
     *     lng:经度(必须),
     *     lat:纬度(必须),
     *     rtime:轨迹点时间(必须),
     *     curEvent:当前时间点的事件
     * },……]
     * }
      *  markerOpts展示图片属性
     * [{
     * @param normalStatusIcon 正常轨迹点的图标
     * @param exceptionStatusIcon 异常点图标
     * @param iconW 图标宽度
     * @param iconH 图标高度
     * @param interval 轨迹回放时间间隔
     * @param  showEvent : true/false 是否需要展示报警点（可选，有默认false）
     * @param  showEventLabel  : true/false 是否需要展示报警点的文字（可选，有默认false）
     * },……]
     * }
     *

     */
    $.SY.maps.trace = function(historyDataArray, markerOpts){
        var normalStatusIcon = (typeof markerOpts.normalStatusIcon !== 'undefined') ? markerOpts.normalStatusIcon : "../images/lianglan.gif";
        var exceptionStatusIcon = (typeof markerOpts.exceptionStatusIcon !== 'undefined') ? markerOpts.exceptionStatusIcon : "../images/hongdian.gif";
        var interval = (typeof markerOpts.interval !== 'undefined') ? markerOpts.interval : "3000";
        var iconW = (typeof markerOpts.iconW !== 'undefined') ? markerOpts.iconW : "5";
        var iconH = (typeof markerOpts.iconH !== 'undefined') ? markerOpts.iconH : "5";
        var historyDataLen = historyDataArray.length;
        if( historyDataLen > $.SY.maps.traceLoc ){
            var currentLoc = $.SY.maps.traceLoc;
            if( $.SY.maps.traceLoc > 0 ){
                var points = [];
                points.push(historyDataArray[currentLoc -1]);
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
           // var content = historyDataArray[currentLoc].rtime;
            var contentHTML = [];
            contentHTML.push("<div class='detailInformation'>");

            var whiteRg = /^\s*$/;
            var curEvent = historyDataArray[currentLoc].curEvent;
            if( typeof(curEvent) !== 'undefined' && !whiteRg.test(curEvent)){
                if(markerOpts.showEvent==true){//需要展示报警才加
                    icon = exceptionStatusIcon;
                    content =curEvent+":"+content;
                    contentHTML.push("<p style='font-size:12px;line-height: 12px;'>"+ curEvent+"</p>");
                }
            }
            contentHTML.push("<p style='font-size:12px;line-height: 12px;'>"+historyDataArray[currentLoc].rtime+"</p>");
            contentHTML.push("</div>");
            var inBounds = $.SY.maps.inMapBounds(historyDataArray[currentLoc]);
            if( !inBounds ){
                $.SY.maps.panTo(historyDataArray[currentLoc].lng,historyDataArray[currentLoc].lat);
            }
            //rotation是必须值，默认使用0
            var marker = {
                lng:historyDataArray[currentLoc].lng,
                lat:historyDataArray[currentLoc].lat,
                url:icon,
                w:iconW,
                h:iconH,
                rotation:0,
                popupContent:contentHTML.join("")
            };
            if( currentLoc == 0 ){
                $.SY.maps.setCenter(historyDataArray[currentLoc].lng,historyDataArray[currentLoc].lat,16);
            }
            if( !whiteRg.test(curEvent)&&markerOpts.showEvent==true&&markerOpts.showEventLabel==true ){
                marker.label = curEvent;
            }
            $.SY.maps.addMarker(marker);
            $.SY.maps.traceLoc += 1;
            setTimeout(function(){
                $.SY.maps.trace(historyDataArray,markerOpts);
            },interval);
        }else{
            $.SY.maps.traceLoc = 0;
        }
    };


    /**
     * @description 地图初始化  带右键点击事件
     * @param mapProperties
     * {
     * container:HTML div ID(必须项),
     * zoom:放大级别(默认13),
     * center:{lng:经度,lat:纬度} 地图中心经纬度(默认在长沙三一),
     * localMap:是否使用本地地图(会修改$.SY.maps.localMap的值：true或false，可选项；可直接修改$.SY.maps.localMap的值),
     * fullScreen:是否使用全屏控件(默认包含全屏控件:true-包含;false-不包含)
     * }
     */
    $.SY.maps.initAddRightPopup = function(mapProperties){
        $.SY.maps.mapObj = new SuperMap.Map(mapProperties.container, { controls: [
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar({showSlider:true}),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true
                }

            })], allOverlays: true
        });

        $.SY.maps.pointLayer = new SuperMap.Layer.Markers("Markers");
        $.SY.maps.markerLayer = new SuperMap.Layer.Vector("markerLayer");
        $.SY.maps.polygonLayer = new SuperMap.Layer.Vector("polygonLayer");
        $.SY.maps.lineLayer = new SuperMap.Layer.Vector("lineLayer");
        //marker点多边形等等选中控件
        $.SY.maps.featureSelector = new SuperMap.Control.SelectFeature([$.SY.maps.polygonLayer,$.SY.maps.markerLayer],{repeat:true,onSelect: $.SY.maps.onFeatureSelect,onUnselect: $.SY.maps.onUnFeatureSelect,onContextMenuSelect: $.SY.maps.contextMenuHandler});//onContextMenuSelect右键事件
        $.SY.maps.mapObj.addControl($.SY.maps.featureSelector);
        //画点控件
        $.SY.maps.drawPointController = new SuperMap.Control.DrawFeature($.SY.maps.lineLayer,SuperMap.Handler.Point);
        $.SY.maps.mapObj.addControl($.SY.maps.drawPointController);
        //画线控件
        $.SY.maps.drawLineController = new SuperMap.Control.DrawFeature($.SY.maps.lineLayer,SuperMap.Handler.Path);
        $.SY.maps.mapObj.addControl($.SY.maps.drawLineController);
        //画矩形控件
        $.SY.maps.drawRectangleController= new SuperMap.Control.DrawFeature($.SY.maps.polygonLayer, SuperMap.Handler.RegularPolygon,{handlerOptions:{irregular:true}});//画规则的矩形
        $.SY.maps.mapObj.addControl($.SY.maps.drawRectangleController);
        //画多边形控件
        $.SY.maps.drawPolygonController = new SuperMap.Control.DrawFeature($.SY.maps.polygonLayer, SuperMap.Handler.Polygon);
        $.SY.maps.mapObj.addControl($.SY.maps.drawPolygonController);

        if( typeof mapProperties.center !== 'undefined' ){//地图中心位置
            $.SY.maps.center.lng =  mapProperties.center.lng;
            $.SY.maps.center.lat =  mapProperties.center.lat;
        }
        if( typeof mapProperties.localMap !== 'undefined' ){//是否使用本地地图
            $.SY.maps.localMap =  mapProperties.localMap;
        }
        /**
         * @description 自定义全屏控件（支持最新版的Firefox、chrome）,依赖fullscreen.js,不需要修改
         * @type {*}
         */
        if( typeof mapProperties.fullScreen === 'undefined' || mapProperties.fullScreen ){
            SuperMap.Control.FullScreenControl = SuperMap.Class(SuperMap.Control,{
                id: "fullScreen",
                type: SuperMap.Control.TYPE_BUTTON,
                isFull: false,
                trigger: function() {
                    if (!this.isFull) {
                        screenfull.request($('#'+mapProperties.container)[0]);
                    }else {
                        screenfull.exit();
                    }
                    this.isFull = !this.isFull;
                },
                draw: function(px) {
                    SuperMap.Control.prototype.draw.apply(this, arguments);
                    this._addButton("fullBtn", "zoom-maxextent-mini_one.png",
                        new SuperMap.Pixel(0,0), new SuperMap.Size(16, 11));
                    return this.div;
                },
                _addButton:function(id, img, xy, sz) {
                    var imgLocation = SuperMap.Util.getImagesLocation() + img;
                    var btn = SuperMap.Util.createAlphaImageDiv(
                        this.id + "_" + id,
                        xy, sz, imgLocation, "absolute");
                    btn.style.cursor = "pointer";
                    btn.style.alt = "全屏";
                    this.div.appendChild(btn);
                    SuperMap.Event.observe(btn, "mousedown",
                        SuperMap.Function.bindAsEventListener(this.trigger, btn));
                    SuperMap.Event.observe(btn, "dblclick",
                        SuperMap.Function.bindAsEventListener(this.trigger, btn));
                    SuperMap.Event.observe(btn, "click",
                        SuperMap.Function.bindAsEventListener(this.trigger, btn));
                    return btn;
                },
                CLASS_NAME: "SuperMap.Control.FullScreenControl"
            });
            var fullScreenControl = new SuperMap.Control.FullScreenControl();
            $.SY.maps.mapObj.addControl(fullScreenControl);
        }
        if( $.SY.maps.localMap || $.SY.maps.remoteMap ){//使用静态切片地图
            var vectorGroup = "";
            if( $.SY.maps.localMap ){
                vectorGroup = $.SY.maps.localMapURL;
            }
            if($.SY.maps.remoteMap ){
                vectorGroup = $.SY.maps.remoteMapURL;
            }
            SuperMap.Layer.V5Layer = SuperMap.Class(SuperMap.CanvasLayer, {
                mode: 'VECTOR',
                name: "V5Layer",
                url: null,
                VectorGroup :vectorGroup,
                initialize: function (options) {
                    var me = this;
                    options = SuperMap.Util.extend({
                        maxExtent: new SuperMap.Bounds(-180, -90, 180, 90),
                        resolutions: [1.11709248643759997546959971484,  0.55854624321879998773479985742002,0.27927312160939999386739992871001,0.13963656080469999693369996435501,
                            0.0698182804023499984668499821775,0.03490914020117499923342499108875,0.01745457010058749961671249554438,0.00872728505029374980835624777219,
                            0.00436364252514687490417812388609,0.00218182126257343745208906194305,0.00109091063128671872604453097152,0.00054545531564335936302226548576174,
                            0.00027272765782167968151113274288087,0.00013636382891083984075556637144043,0.000068181914455419920377783185720217,0.000034090957227709960188891592860109,
                            0.000017045478613854980094445796430054,0.0000085227393069274900472228982150272,0.0000042613696534637450236114491075136,0.0000021306848267318725118057245], //0-19级，请自行补充完整
                        scales: [1/470000000, 1/235000000,1/117500000 ,1/58750000,1/29375000,
                            1/14687500,1/7343750,1/3671875,1/1835938,1/917969,
                            1/458984,1/229492,1/114746,1/57373,1/28687,
                            1/14343,1/7172, 1/3586,1/1793,1/896]
                    }, options);
                    SuperMap.CanvasLayer.prototype.initialize.apply(me, [me.name, me.url, null, options]);
                },
                destroy: function () {
                    var me = this;
                    SuperMap.CanvasLayer.prototype.destroy.apply(me, arguments);
                    me.name = null;
                    me.url = null;
                },
                clone: function (obj) {
                    var me = this;
                    if (obj == null) {
                        obj = new SuperMap.Layer.V5Layer(
                            me.name, me.url, me.getOptions());
                    }
                    obj = SuperMap.CanvasLayer.prototype.clone.apply(me, [obj]);
                    return obj;
                },
                getLevelForResolution: function (res) {
                    var me = this;
                    var selectIndex = 0;
                    for (var i=0,len=me.resolutions.length;i<len;i++) {
                        if (me.resolutions[i] ===res) {
                            selectIndex = i;
                            break;
                        }
                    }
                    return  Math.round(1/me.scales[selectIndex]);
                },
                getTileUrl: function (xyz) {
                    var me = this,
                        tileSize = new SuperMap.Size(256,256),
                        url = me.url;
                    //此处获取比例尺或等级值
                    var level = me.getLevelForResolution(me.map.getResolution());
                    me.url = me.VectorGroup;
                    //替换url模板
                    var url =  SuperMap.String.format(me.url, {
                        x: xyz.x,
                        y: xyz.y,
                        l: level
                    });
                    return url;
                },
                CLASS_NAME: "SuperMap.Layer.V5Layer"
            });
            $.SY.maps.baseLayer = new SuperMap.Layer.V5Layer();
            $.SY.maps.layerInitializeListener();
        }else{//使用iServer动态出图
            $.SY.maps.baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("dynamicMap", $.SY.maps.dynamicURL, {transparent: true, cacheEnabled: true}, {
                /* resolutions: [ 1.4073606133878825508580000928978,
                 0.70368030669394127542900004644889, 0.35184015334697063771450002322444, 0.17592007667348531885725001161222,
                 0.08796003833674265942862500580611, 0.04398001916837132971431250290306, 0.02199000958418566485715625145153,
                 0.01099500479209283242857812572576, 0.00549750239604641621428906286288, 0.00274875119802320810714453143144,
                 0.00137437559901160405357226571572, 0.00068718779950580202678613285786, 0.00034359389975290101339306642893,
                 0.00017179694987645050669653321446, 0.00008589847493822525334826660723, 0.00004294923746911262667413330361,
                 0.00002147461873455631333706665180, 0.00001073730936727815666853332590, 0.00000536865468363907833426666295,
                 0.000002684327341819539167133331
                 ]    */
                //如果要访问iserver发布的服务，则需要设置比例尺属性值，这样才能保证
                scales:[1/470000000,1/235000000,1/117500000,1/58750000,1/29375000,1/14687500,1/7343750,
                    1/3671875,1/1835937.5,1/917968.75,1/458984.375,1/229492.1875,1/114746.09375,
                    1/57373.046875,1/28686.5234375,1/14343.26171875,1/7171.630859375,1/3585.8154296875,1/1792.90771484375,1/896.453857421875]
            });
            $.SY.maps.baseLayer.events.on({"layerInitialized": $.SY.maps.layerInitializeListener});
        }
        $.SY.maps.featureSelector.activate();
    };

    /**
     * @description 地图初始化  带聚散和右键点击事件
     * @param mapProperties
     * {
     * container:HTML div ID(必须项),
     * zoom:放大级别(默认13),
     * center:{lng:经度,lat:纬度} 地图中心经纬度(默认在长沙三一),
     * localMap:是否使用本地地图(会修改$.SY.maps.localMap的值：true或false，可选项；可直接修改$.SY.maps.localMap的值),
     * fullScreen:是否使用全屏控件(默认包含全屏控件:true-包含;false-不包含)
     * }
     */
    $.SY.maps.initAddClusterPopup = function(mapProperties){
        $.SY.maps.mapObj = new SuperMap.Map(mapProperties.container, { controls: [
            new SuperMap.Control.ScaleLine(),
            new SuperMap.Control.PanZoomBar({showSlider:true}),
            new SuperMap.Control.Navigation({
                dragPanOptions: {
                    enableKinetic: true
                }

            })], allOverlays: true
        });

        $.SY.maps.pointLayer = new SuperMap.Layer.Markers("Markers");
        $.SY.maps.markerLayer = new SuperMap.Layer.Vector("markerLayer");
        $.SY.maps.polygonLayer = new SuperMap.Layer.Vector("polygonLayer");
        $.SY.maps.lineLayer = new SuperMap.Layer.Vector("lineLayer");
        var clusterLen =(typeof mapProperties.clusterLen !== 'undefined') ? mapProperties.clusterLen : 5;
        var isDiffused =(typeof mapProperties.isDiffused !== 'undefined') ? mapProperties.isDiffused : false;
        $.SY.maps.clusterLayer = new SuperMap.Layer.ClusterLayer("Cluster",{tolerance:clusterLen,isDiffused:isDiffused}); //tolerance:定义多长范围内才聚合，isDiffused定义点击气泡是否散开

        //聚散marker点等选中控件
        $.SY.maps.clusterSelector = new SuperMap.Control.SelectCluster([$.SY.maps.clusterLayer,$.SY.maps.polygonLayer,$.SY.maps.markerLayer],{hover:false,onSelect:$.SY.maps.onClusterFeatureSelect,onUnselect:$.SY.maps.onClusterUnFeatureSelect, onContextMenuSelect:$.SY.maps.contextClusterMenuHandler});
        $.SY.maps.mapObj.addControl($.SY.maps.clusterSelector);

        //画点控件
        $.SY.maps.drawPointController = new SuperMap.Control.DrawFeature($.SY.maps.lineLayer,SuperMap.Handler.Point);
        $.SY.maps.mapObj.addControl($.SY.maps.drawPointController);
        //画线控件
        $.SY.maps.drawLineController = new SuperMap.Control.DrawFeature($.SY.maps.lineLayer,SuperMap.Handler.Path);
        $.SY.maps.mapObj.addControl($.SY.maps.drawLineController);
        //画矩形控件
        $.SY.maps.drawRectangleController= new SuperMap.Control.DrawFeature($.SY.maps.polygonLayer, SuperMap.Handler.RegularPolygon,{handlerOptions:{irregular:true}});//画规则的矩形
        $.SY.maps.mapObj.addControl($.SY.maps.drawRectangleController);
        //画多边形控件
        $.SY.maps.drawPolygonController = new SuperMap.Control.DrawFeature($.SY.maps.polygonLayer, SuperMap.Handler.Polygon);
        $.SY.maps.mapObj.addControl($.SY.maps.drawPolygonController);

        if( typeof mapProperties.center !== 'undefined' ){//地图中心位置
            $.SY.maps.center.lng =  mapProperties.center.lng;
            $.SY.maps.center.lat =  mapProperties.center.lat;
        }
        if( typeof mapProperties.localMap !== 'undefined' ){//是否使用本地地图
            $.SY.maps.localMap =  mapProperties.localMap;
        }
        /**
         * @description 自定义全屏控件（支持最新版的Firefox、chrome）,依赖fullscreen.js,不需要修改
         * @type {*}
         */
        if( typeof mapProperties.fullScreen === 'undefined' || mapProperties.fullScreen ){
            SuperMap.Control.FullScreenControl = SuperMap.Class(SuperMap.Control,{
                id: "fullScreen",
                type: SuperMap.Control.TYPE_BUTTON,
                isFull: false,
                trigger: function() {
                    if (!this.isFull) {
                        screenfull.request($('#'+mapProperties.container)[0]);
                    }else {
                        screenfull.exit();
                    }
                    this.isFull = !this.isFull;
                },
                draw: function(px) {
                    SuperMap.Control.prototype.draw.apply(this, arguments);
                    this._addButton("fullBtn", "zoom-maxextent-mini_one.png",
                        new SuperMap.Pixel(0,0), new SuperMap.Size(16, 11));
                    return this.div;
                },
                _addButton:function(id, img, xy, sz) {
                    var imgLocation = SuperMap.Util.getImagesLocation() + img;
                    var btn = SuperMap.Util.createAlphaImageDiv(
                        this.id + "_" + id,
                        xy, sz, imgLocation, "absolute");
                    btn.style.cursor = "pointer";
                    btn.style.alt = "全屏";
                    this.div.appendChild(btn);
                    SuperMap.Event.observe(btn, "mousedown",
                        SuperMap.Function.bindAsEventListener(this.trigger, btn));
                    SuperMap.Event.observe(btn, "dblclick",
                        SuperMap.Function.bindAsEventListener(this.trigger, btn));
                    SuperMap.Event.observe(btn, "click",
                        SuperMap.Function.bindAsEventListener(this.trigger, btn));
                    return btn;
                },
                CLASS_NAME: "SuperMap.Control.FullScreenControl"
            });
            var fullScreenControl = new SuperMap.Control.FullScreenControl();
            $.SY.maps.mapObj.addControl(fullScreenControl);
        }
        if( $.SY.maps.localMap || $.SY.maps.remoteMap ){//使用静态切片地图
            var vectorGroup = "";
            if( $.SY.maps.localMap ){
                vectorGroup = $.SY.maps.localMapURL;
            }
            if($.SY.maps.remoteMap ){
                vectorGroup = $.SY.maps.remoteMapURL;
            }
            SuperMap.Layer.V5Layer = SuperMap.Class(SuperMap.CanvasLayer, {
                mode: 'VECTOR',
                name: "V5Layer",
                url: null,
                VectorGroup :vectorGroup,
                initialize: function (options) {
                    var me = this;
                    options = SuperMap.Util.extend({
                        maxExtent: new SuperMap.Bounds(-180, -90, 180, 90),
                        resolutions: [1.11709248643759997546959971484,  0.55854624321879998773479985742002,0.27927312160939999386739992871001,0.13963656080469999693369996435501,
                            0.0698182804023499984668499821775,0.03490914020117499923342499108875,0.01745457010058749961671249554438,0.00872728505029374980835624777219,
                            0.00436364252514687490417812388609,0.00218182126257343745208906194305,0.00109091063128671872604453097152,0.00054545531564335936302226548576174,
                            0.00027272765782167968151113274288087,0.00013636382891083984075556637144043,0.000068181914455419920377783185720217,0.000034090957227709960188891592860109,
                            0.000017045478613854980094445796430054,0.0000085227393069274900472228982150272,0.0000042613696534637450236114491075136,0.0000021306848267318725118057245], //0-19级，请自行补充完整
                        scales: [1/470000000, 1/235000000,1/117500000 ,1/58750000,1/29375000,
                            1/14687500,1/7343750,1/3671875,1/1835938,1/917969,
                            1/458984,1/229492,1/114746,1/57373,1/28687,
                            1/14343,1/7172, 1/3586,1/1793,1/896]
                    }, options);
                    SuperMap.CanvasLayer.prototype.initialize.apply(me, [me.name, me.url, null, options]);
                },
                destroy: function () {
                    var me = this;
                    SuperMap.CanvasLayer.prototype.destroy.apply(me, arguments);
                    me.name = null;
                    me.url = null;
                },
                clone: function (obj) {
                    var me = this;
                    if (obj == null) {
                        obj = new SuperMap.Layer.V5Layer(
                            me.name, me.url, me.getOptions());
                    }
                    obj = SuperMap.CanvasLayer.prototype.clone.apply(me, [obj]);
                    return obj;
                },
                getLevelForResolution: function (res) {
                    var me = this;
                    var selectIndex = 0;
                    for (var i=0,len=me.resolutions.length;i<len;i++) {
                        if (me.resolutions[i] ===res) {
                            selectIndex = i;
                            break;
                        }
                    }
                    return  Math.round(1/me.scales[selectIndex]);
                },
                getTileUrl: function (xyz) {
                    var me = this,
                        tileSize = new SuperMap.Size(256,256),
                        url = me.url;
                    //此处获取比例尺或等级值
                    var level = me.getLevelForResolution(me.map.getResolution());
                    me.url = me.VectorGroup;
                    //替换url模板
                    var url =  SuperMap.String.format(me.url, {
                        x: xyz.x,
                        y: xyz.y,
                        l: level
                    });
                    return url;
                },
                CLASS_NAME: "SuperMap.Layer.V5Layer"
            });
            $.SY.maps.baseLayer = new SuperMap.Layer.V5Layer();
            $.SY.maps.layerRightInitializeListener();
        }else{//使用iServer动态出图
            $.SY.maps.baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer("dynamicMap", $.SY.maps.dynamicURL, {transparent: true, cacheEnabled: true}, {
                /* resolutions: [ 1.4073606133878825508580000928978,
                 0.70368030669394127542900004644889, 0.35184015334697063771450002322444, 0.17592007667348531885725001161222,
                 0.08796003833674265942862500580611, 0.04398001916837132971431250290306, 0.02199000958418566485715625145153,
                 0.01099500479209283242857812572576, 0.00549750239604641621428906286288, 0.00274875119802320810714453143144,
                 0.00137437559901160405357226571572, 0.00068718779950580202678613285786, 0.00034359389975290101339306642893,
                 0.00017179694987645050669653321446, 0.00008589847493822525334826660723, 0.00004294923746911262667413330361,
                 0.00002147461873455631333706665180, 0.00001073730936727815666853332590, 0.00000536865468363907833426666295,
                 0.000002684327341819539167133331
                 ]    */
                //如果要访问iserver发布的服务，则需要设置比例尺属性值，这样才能保证
                scales:[1/470000000,1/235000000,1/117500000,1/58750000,1/29375000,1/14687500,1/7343750,
                    1/3671875,1/1835937.5,1/917968.75,1/458984.375,1/229492.1875,1/114746.09375,
                    1/57373.046875,1/28686.5234375,1/14343.26171875,1/7171.630859375,1/3585.8154296875,1/1792.90771484375,1/896.453857421875]
            });
            $.SY.maps.baseLayer.events.on({"layerInitialized": $.SY.maps.layerRightInitializeListener});
        }
    };
    /**
     * @description 地图底图加载后的响应事件
     */
    $.SY.maps.layerRightInitializeListener = function(){
        $.SY.maps.mapObj.addLayers([$.SY.maps.baseLayer, $.SY.maps.polygonLayer, $.SY.maps.lineLayer, $.SY.maps.markerLayer,$.SY.maps.pointLayer,$.SY.maps.clusterLayer]);
        $.SY.maps.mapObj.setCenter(new SuperMap.LonLat($.SY.maps.center.lng, $.SY.maps.center.lat), $.SY.maps.zoom);
        $.SY.maps.mapObj.events.on({"zoomend": $.SY.maps.redrawAllFeature});
        $.SY.maps.activeClusterController();
    };

    /**
     * @description 当marker点被点击选中时，弹出框
     * @param feature 选中的marker点 marker点必须传入tip参数
     */
    var popup;
    $.SY.maps.onFeatureSelect = function(feature){
        //代码里面可以增加业务逻辑判断
        var feaAttr = feature.attributes;
        if( feaAttr.popupContent){
            popup = new SuperMap.Popup("pointVector_popup",
                feature.geometry.getBounds().getCenterLonLat(),
                new SuperMap.Size(200,250),
                feaAttr.popupContent,
                true);
            popup.closeOnMove = true;
            popup.autoSize = true;
            popup.keepInMap = true;
            popup.panMapIfOutOfView = true;
            popup.setBackgroundColor("#ebf3f9");
            popup.setBorder("1px solid #4f749c");
            feature.popup = popup;
            $.SY.maps.mapObj.addPopup(popup);
        }
    };
    /**
     * @description 当marker点失去焦点时，移除marker对应的popup
     * @param feature 失去焦点的marker
     */
    $.SY.maps.onUnFeatureSelect = function(){
        popup.destroy();
        popup = null;
    };
    /**
     * @description 当marker点被右键点击选中时，弹出对应的popup
     * @param feature 选中的marker点
     */
    var lng;
    var lat;
    $.SY.maps.contextMenuHandler = function(feature) {
        //自行修改，代码里面可以增加业务逻辑判断
        var id =  feature.id;
        var feaAttr = feature.attributes;
        lng = feature.geometry.x;
        lat = feature.geometry.y;
        if( feaAttr.menuContent){
            popup = new SuperMap.Popup("pointVector_popup2",
                feature.geometry.getBounds().getCenterLonLat(),
                new SuperMap.Size(200,250),
                feaAttr.menuContent,
                true);
            popup.closeOnMove = true;
            popup.autoSize = true;
            popup.keepInMap = true;
            popup.panMapIfOutOfView = true;
            popup.setBackgroundColor("#ebf3f9");
            popup.setBorder("1px solid #4f749c");
            feature.popup = popup;
            $.SY.maps.mapObj.addPopup(popup);
        }
    };

    /**
     * @description 使用聚散功能，当散出来marker点被点击选中时，弹出对应的popup
     * @param feature 选中的marker点
     */
    $.SY.maps.onClusterFeatureSelect = function(feature){
        //自行修改，代码里面可以增加业务逻辑判断
        if(!feature.isCluster){
            $.SY.maps.onClusterUnFeatureSelect();
            var id =  feature.id;
            var feaAttr = feature.attributes;
            if( feaAttr.popupContent){
                popup = new SuperMap.Popup("pointVector_popup",
                    feature.geometry.getBounds().getCenterLonLat(),
                    new SuperMap.Size(200,250),
                    feaAttr.popupContent,
                    true);
                popup.closeOnMove = true;
                popup.autoSize = true;
                popup.keepInMap = true;
                popup.panMapIfOutOfView = true;
                popup.setBackgroundColor("#ebf3f9");
                popup.setBorder("1px solid #4f749c");
                feature.popup = popup;
                $.SY.maps.mapObj.addPopup(popup);
            }
        }
    };
    /**
     * @description 使用聚散功能，当散出来marker点被点击选中时，弹出对应的popup
     * @param feature 选中的marker点
     */
    var infowin;
    var cenLng;//气泡中心点
    var cenLat;//气泡中心点
    $.SY.maps.onClusterFeatureSelectAll= function(feature){
        //自行修改，代码里面可以增加业务逻辑判断
        $.SY.maps.onClusterUnFeatureSelect();
        $.SY.maps.onClusterUnFeatureSelect2();
        var geo = feature.geometry;
        var bounds = geo.getBounds();
        var center = bounds.getCenterLonLat();
        var childrens =  feature.children;
        var contentHTML = [];
        contentHTML.push("<div class='pop' style='overflow-y:hidden;'>");
        for(var i=0;i<childrens.length;i++){
            var fearAttr =  childrens[i].attributes
             if( fearAttr.selfNum ){
             contentHTML.push("<p>"+fearAttr.selfNum+"</p>");
             }
        }
        contentHTML.push("</div>");
        cenLng = feature.geometry.bounds.centerLonLat.lon;
        cenLat = feature.geometry.bounds.centerLonLat.lat;
        infowin = new SuperMap.Popup("pointVector_popup",
            new SuperMap.LonLat(cenLng,cenLat),
            new SuperMap.Size(200,250),
            contentHTML.join(""),
            true);
        infowin.closeOnMove = true;
        infowin.autoSize = true;
        infowin.minSize = new SuperMap.Size(100,100);
        infowin.keepInMap = true;
        infowin.panMapIfOutOfView = true;
        infowin.setBackgroundColor("#ebf3f9");
        infowin.setBorder("1px solid #4f749c");
        $.SY.maps.mapObj.addPopup(infowin);
        delete contentHTML;

        $(".pop p").click(function(){
            var index = $(".pop p").index($(this));
            $.SY.maps.show(childrens[index])  ;
        });
    };
    //点击车辆列表的弹出框
    $.SY.maps.show = function(feature){
        //自行修改，代码里面可以增加业务逻辑判断
        $.SY.maps.onClusterUnFeatureSelect();
        var id =  feature.id;
        var feaAttr = feature.attributes;
        if( feaAttr.popupContent){
            popup = new SuperMap.Popup("pointVector_popup",
                new SuperMap.LonLat(cenLng+0.001,cenLat),
                new SuperMap.Size(200,250),
                feaAttr.popupContent,
                true);
            popup.closeOnMove = true;
            popup.autoSize = true;
            popup.keepInMap = true;
            popup.panMapIfOutOfView = true;
            popup.setBackgroundColor("#ebf3f9");
            popup.setBorder("1px solid #4f749c");
            $.SY.maps.mapObj.addPopup(popup);
        }
    } ;

    /**
     * @description 使用聚散功能，当散出来marker点失去焦点时，移除marker对应的popup
     * @param feature 失去焦点的marker
     */
    $.SY.maps.onClusterUnFeatureSelect  = function(){
        if(popup){
            try{
                popup.hide();
                popup.destroy();
            }
            catch(e){}
        }
    };
    /**
     * @description 使用聚散功能，当气泡失去焦点时，移除对应的popup
     * @param feature 失去焦点的marker
     */
    $.SY.maps.onClusterUnFeatureSelect2  = function(){
        if(infowin){
            try{
                infowin.hide();
                infowin.destroy();
            }
            catch(e){}
        }
    };

    /**
     * @description 使用聚散功能，当散出来marker点被右键点击选中时，弹出对应的popup
     * @param feature 选中的marker点
     */
    $.SY.maps.contextClusterMenuHandler = function(feature) {
        //自行修改，代码里面可以增加业务逻辑判断
        var id =  feature.id;
        var feaAttr = feature.attributes;
        lng = feature.geometry.x;
        lat = feature.geometry.y;
        if( feaAttr.menuContent){
            popup = new SuperMap.Popup("pointVector_popup2",
                feature.geometry.getBounds().getCenterLonLat(),
                new SuperMap.Size(200,250),
                feaAttr.menuContent,
                true);
            popup.closeOnMove = true;
            popup.autoSize = true;
            popup.keepInMap = true;
            popup.panMapIfOutOfView = true;
            popup.setBackgroundColor("#ebf3f9");
            popup.setBorder("1px solid #4f749c");
            feature.popup = popup;
            $.SY.maps.mapObj.addPopup(popup);
        }
    };
    /**
     * @description 激活聚散选择控件
     */
    $.SY.maps.activeClusterController = function(){
        $.SY.maps.clusterLayer.events.on({"clickout": function(f){
            $.SY.maps.onClusterUnFeatureSelect();
        }});
        $.SY.maps.clusterLayer.events.on({"moveend": function(e){
            if(e&& e.zoomChanged) $.SY.maps.onClusterUnFeatureSelect();
        }});
        $.SY.maps.clusterLayer.events.on({"clickCluster": function(f){
            $.SY.maps.onClusterUnFeatureSelect();
            $.SY.maps.onClusterFeatureSelectAll(f)
        }});
        $.SY.maps.clusterSelector.activate();
    };

    /**
     * @description 添加散出来的点的信息
     */
    $.SY.maps.clusterMarkers = function(fs){
        $.SY.maps.addClusterMarkers(fs);
    } ;
    /**
     * @description 在地图上Cluster层添加多个marker点
     * @param markerOptsArray markerOpts数组，markerOpts参见addMarker函数
     * {
     * lng:经度（必须）,
     * lat:纬度(必须),
     * url:marker点图标的URL(必须),
     * rotation:marker点图标的旋转方向(必须:顺时针方向0为正北),
     * w:marker点图标的宽度(必须),
     * h:marker点图标的高度(必须),
     * label:marker点的label文字,
     * fontColor:label字体的颜色(可选),
     * popupContent:marker点，点击后弹出框的内容（HTML内容）
     * menuContent:如果有内容，则有右键菜单 （可选,html格式)
     * }
     */
    $.SY.maps.addClusterMarkers = function(markerOptsArray){
        var ps = [];
        var optsLen = markerOptsArray.length;
        for( var i=0;i<optsLen;i++ ){
            var markerOpts =  markerOptsArray[i];
            var lng = markerOpts.lng;
            var lat = markerOpts.lat;
            var url = markerOpts.url;
            var rotation = markerOpts.rotation;
            var iconW = markerOpts.w;
            var iconH = markerOpts.h;
            var fontColor = (typeof markerOpts.fontColor !== 'undefined') ? markerOpts.fontColor : "#000000";
            var fontSize = (typeof markerOpts.fontSize !== 'undefined') ? markerOpts.fontSize : 12;
            var fontWeight = (typeof markerOpts.fontWeight !== 'undefined') ? markerOpts.fontWeight : "bold";
            var fontFamily = (typeof markerOpts.fontFamily !== 'undefined') ? markerOpts.fontFamily : "Arial";

            var point = new SuperMap.Geometry.Point(lng,lat);
            var style = {externalGraphic:url,graphicWidth:iconW,graphicHeight:iconH,
                cursor:"pointer",labelAlign:"ct",rotation:rotation,labelXOffset:20,labelYOffset:15,
                fontSize:fontSize,fontColor:fontColor,fontWeight:fontWeight,fontFamily:fontFamily};
            var zoom = $.SY.maps.mapObj.getZoom();
            var label = "";
            if( markerOpts.label ){
                label = markerOpts.label;
            }
            if( zoom >= 13 ){
                style.label = label;
            }
            var pointVector = new SuperMap.Feature.Vector(point,markerOpts,style);
            pointVector.label = label;
            if( markerOpts.id ){
                pointVector.id = markerOpts.id;
            }

            ps.push(pointVector);
        }
        $.SY.maps.clusterLayer.addFeatures(ps);
    };
    /**
     *@description 删除掉所有的Marker点
     */
    $.SY.maps.removeAllClusterMarkers = function(){
        $.SY.maps.clusterLayer.removeAllFeatures();
    };

})(jQuery);
