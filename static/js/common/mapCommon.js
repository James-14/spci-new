/**
 * 地图公用方法
 */

//默认是定位到当前所在城市
function changeDefaultCenter(){
	//通过城市查询获取当前IP所在城市，默认展示
	var options = {
			listener : citySearch_CallBack
	};
	$.SY.maps.citySearch(options);
}
//城市查询的回调函数
 function citySearch_CallBack(result){
        if(result && result.city && result.bounds) {
            var cityinfo = result.city;
            var citybounds = result.bounds;
            //地图显示当前城市
            $.SY.maps.setBounds(citybounds);
        }
 }

//自动匹配框查询位置回调函数
var namePs="";
var lngPs="";
var latPs="";
function autoSearch_CallBack(result){
    var poiList = result.poiList;
    namePs =  poiList.pois[0].name;
    lngPs = poiList.pois[0].location.lng;
    latPs = poiList.pois[0].location.lat;
    //在地图上标注出来位置
    addPsMap();
}
//在地图上添加搜索的点
function addPsMap(){
	if(lngPs!=""&&latPs!=""){
	    //在地图上标注出来位置
		var idPs =  "insertPs";
		var markerOpts = {
	            id:idPs,
	            lng:lngPs,
	            lat:latPs,
	            url:"/common/plugins/map/theme/images/marker.png",
	            //rotation:0,
	            offx:-22,
	            offy:-16.5,
	            label:namePs,
	            fontColor:"red",fontSize:"12px",borderColor:"#2B6D9F", backgroundColor:"yellow"
	        };
		$.SY.maps.removeOverlayById(idPs);
	    $.SY.maps.addMarker(markerOpts);
	}
}

 
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {  
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {  
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);  
    } else {  
        return this.replace(reallyDo, replaceWith);  
    }  
} 