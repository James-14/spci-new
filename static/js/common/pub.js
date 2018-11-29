/**
 * 用途：使用于全部文件的全局变量，全局方法。
 * 作者：tanp2
 * 日期：2017-11-21
 */
var $ctx = {
    cmp : '三一快而居',
    /**treeUrl : "/common/pages/cmn/tree.do",
    mtreeUrl:"/busi/pages/purchase/mdClassify/tree.do",
    comboUrl : "/common/pages/cmn/combo.do",
    selectUrl : "/common/pages/cmn/select.do",
    gridUrl : "/common/pages/cmn/grid.do",
    printUrl : "/common/pages/cmn/print.do",
    printTplUrl : "/common/pages/cmn/printTpl.do",
    suggestUrl : "/common/pages/cmn/suggest.do",**/
};



(function($) {
    $.extend({
        /**
         * @author
         * @description 获取存放在meta里面上下文变量
         * @param
         * @returns
         * */
        ctx : function(name) {
            var vl = $ctx[name];
            if (!vl) {
                vl = $("meta[name=" + name + "]").attr("content") || '';
                $ctx[name] = vl;
            }
            return vl;
        },
        /**
         * 页面自定义控件url转换
         * url地址转换 /xx/yy.do -> /base/xx/yy.do
         * tree:dept -> /base/treeUrl?_code=dept
         * grid:dept -> /base/gridUrl?_code=dept
         * combo:dept->/base/comboUrl?_code=dept
         */
        url : function(url) {
            !url && $util.debug("$.url函数传入的url为空!");
            var rst = $.ctx("base") || '';
            if (url.indexOf('/') == -1) {
                var ar = url.split(":"), chg = $ctx[ar[0] + "Url"];
                !chg && (ar[0] + "Url对应的Url未定义!");
                rst += chg;
                ar[1]
                && (rst += (rst.indexOf('?') == -1 ? '?' : '&')
                    + "_code=" + ar[1]);
            } else {
                rst += url;
            }
            return rst;
        },
        /**
         * @author
         * @description 统一的后台post请求
         * @param url
         * @param data
         * @param callback
         * @returns
         * */
        reqUrl : function(url, data, callback) {
            return $.post(url, data, callback, "json").error(function(a,b,c,d){
                //$.mbbox.hide('.submitWaitingTip',$util.alert({classN:'alertErr',title:'错误提示',content : "操作失败,请刷新页面重试！"}));
            });
        },
        /**
         * @author
         * @description 默认值赋值
         * @param o  目标对象
         * @param c  默认值  需要赋的值
         * @returns
         * */
        applyIf : function(o, c) {
            if (o && c) {
                for ( var p in c) {
                    if (typeof o[p] == "undefined") {
                        o[p] = c[p];
                    }
                }
            }
            return o;
        }
    });

    /**
     * 名称：扩展方法类
     * 用途：扩展 jQuery 元素集来提供新的方法（通常用来制作插件）。扩展的对象jQuery对象可以直接调用
     * 作者：
     * 日期：
     **/
    $.fn.extend({
        /**
         * @author
         * @description 增加一个鼠标效果，鼠标放上去的效果和移走的效果
         * @param
         * @returns
         * */
        "liveHoverClass" : function(classN) {//增加一个鼠标效果
            var _self = $(this);
            _self.live('mouseover', function() {
                $(this).addClass(classN);
            }).live('mouseout', function() {
                $(this).removeClass(classN);
            });
        },
        /**
         * @author
         * @description 获取元素里面的值
         * @param
         * @returns 返回获取的对象（值对形式）
         * 示例：
         * $("#formid").vals()即获取id为formid的form表单里面input，select等值
         * */
        vals : function(param, map) {
            if (typeof (param) == 'boolean' || param === undefined) {
                var c = {};// 暂存checkbox,选中的值用逗号隔开
                this.each(function() {
                    //var xx=$(this).attr("name")||'st';
                    //console.time(xx);
                    if(/input/i.test(this.tagName)){
                        if (/checkbox/i.test(this.type)) {
                            var key = this.name || this.id;
                            var val = this.checked ? (this.value || 'on') : '';
                            if(val!=''){
                                if (c[key]) {
                                    c[key] = c[key] + "," + val;
                                } else {
                                    c[key] = val;
                                }
                            }
                        } else if (/radio/i.test(this.type)) {
                            if (this.checked)
                                c[this.name || this.id] = $.trim($(this).val());
                        } else {
                            c[this.name || this.id] = $.trim($(this).val());
                        }
                    } else if (/select/i.test(this.tagName)) {
                        c[this.name || this.id] = $.trim($(this).val()) + "";
                    } else if ($(this).has(":input").length) {
                        var sub = $(":input", this).vals();
                        $.extend(c, sub);
                    } else {
                        c[this.name || this.id] = $.trim($(this).val());
                    }
                    //console.timeEnd(xx);
                });
                return param !== false ? c : $.param(c);
            } else if (typeof (param) == 'object') {
                this.each(function() {
                    if (/div|span|table|form|ul|li/i.test(this.tagName)) {
                        $(":input,label,b", this).vals(param, map);
                    } else {
                        var nm = this.name || this.id||$(this).attr("data-vl");
                        var vl = map && map[nm] ? param[map[nm]] : param[nm];
                        if (vl !== undefined && vl !== null) {
                            if (/label|b/i.test(this.tagName)) {
                                $(this).text(vl);
                            }else  {
                                $(this).val(vl);
                            }
                        }
                    }
                });
            }
        },
        /**
         * @author
         * @description 查找所有非submit的input元素，将其置空，主要用于表单的置空;再看传入的参数是否为空
         * @description 不为空就置值到对应的元素上
         * @param  data 将其设置到对应的元素上，data参数是一个map,按照map里的key，循环去设置值;如果为空就不设值
         * @returns
         * */
        clear : function(data) {
            $(":input:not(:submit)", this).val("");
            if (data)
                $(this).vals(data);
        },
        /**
         * @author
         * @description 将a链接href的url地址中加入params里面的参数
         * @param params为值对形式{}
         * @returns 增加了params里面每个对象的url，并将这个url设置为了a的href属性
         * */
        href:function(params){
            var url=$(this).attr('href'),arr=url.split('?'),temp=arr[1];
            params=params||{};
            $.each(params,function(k,v){
                var rex=new RegExp("&?"+k+"=[^&]*");
                temp=temp.replace(rex,"");
                temp=k+"="+v+"&"+temp;
            });
            var newUrl=arr[0]+"?"+temp;
            $(this).attr('href',newUrl);
        }
    });
})(jQuery);

var $util = {
		/**
	     * @author 
	     * @description 将数据整理成值对的格式，
	     * @param 
	     * @returns {**：**}
	     * 示例：
	     * 例如查询表格时点击查询按钮获取相关参数，返回格式为{grid:"gridBox",scopr:"sBox"}
	     * */
		data : function(el, attrName) {
			attrName = attrName || 'data';
			var data = "{}";
			//exec用正则表达式模式在字符串中运行查找，并返回包含该查找结果的一个数组。
			var m = /({.*})/.exec($(el).attr(attrName));
			if (m)
				data = m[1];
			if (data.indexOf('{') < 0)
				data = "{" + data + "}";
			//eval检查 JScript 代码并执行.
			data = eval("(" + data + ")");
			return data;
		},
		 /**
	     * @author 
	     * @description 跳转到其他页面
	     * @param url为跳转地址
	     * @returns 
	     * */
		goto:function(url){
			try{
				$('<a href="'+url+'"></a>').appendTo($('body')).get(0).click();
			}catch(e){
				window.location.href=url;
			}
		}
};

$.download = function (url, data, method) {
	// 获取url和data
	if (url && data) {
	    // data 是 string 或者 array/object
	    data = typeof data == 'string' ? data : jQuery.param(data);
	    // 把参数组装成 form的  input
	    var inputs = '';
	    jQuery.each(data.split('&'), function () {
	var pair = this.split('=');
	inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
	    });
	    // request发送请求
	    jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
	.appendTo('body').submit().remove();
	};
};


/**
 * 时间操作方法
 */
var $time={
    /**
     *@description:将毫秒数转换成可读时间，当小于1小时时，转换成：xxx分钟；当大于1小时时，转换成：xxx小时xxx分钟
     */
    formatTime : function(millisecond){
        var digitRg = /^(\d*.?)\d+$/;
        if( digitRg.test(millisecond) ){
            var timeFloat = parseFloat( millisecond );
            if( timeFloat < (3600*1000)){
                if( timeFloat < 60 * 1000 ){
                    return Math.round( timeFloat / 1000) + "秒";
                }else{
                    return Math.round( timeFloat / (1000 * 60)) + "分钟";
                }
            }else{
                var hours = Math.floor(timeFloat / (3600*1000)) + "小时";
                var minute = Math.round((timeFloat % (3600*1000)) / (1000 * 60))+ "分钟";
                return hours+minute;
            }
        }else{
            return "-";
        }
    },
    /**
     * @author
     * @description 获取某年中某个月的天数
     * @param year int类型值，年份
     * @param month int类型值，月份
     * @returns {number} 当月天数
     */
    getMonthDays : function(year,month){
        var monthDays = 31;
        switch (month){
            case 4:
            case 6:
            case 9:
            case 11:
                monthDays = 30;
                break;
            case 2:
                if( year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0 )){
                    monthDays = 29;
                }else{
                    monthDays = 28;
                }
        }
        return monthDays;
    },
    /**
     * @author
     * @description 移除时间字符串中的毫秒
     * @param datetimeStr 时间字符串
     * @returns {string} 移除毫秒后的时间字符串
     */
    removeMillisecond: function(datetimeStr){
        var resultStr = datetimeStr;
        var datetimeArr = resultStr.split(".");
        if( datetimeArr.length > 0 ){
            resultStr = datetimeArr[0];
        }
        return resultStr;
    },
    /**
     * @author
     * @description 获取当前时间（时间格式为：yyyy-MM-dd hh:mm:ss）
     * @returns {string} 格式化地时间字符串
     */
    getCurrentDT : function(){
        var dtStr = "";
        var currentDT = new Date();
        var fullYear = currentDT.getFullYear();
        var month = currentDT.getMonth();
        var date = currentDT.getDate();
        var hours = currentDT.getHours();
        var minutes = currentDT.getMinutes();
        var seconds = currentDT.getSeconds();
        month += 1;
        dtStr += fullYear;
        dtStr += "-";
        if( month < 10 ){
            month = "0" +month;
        }
        dtStr += month;
        dtStr += "-";
        if( date < 10 ){
            date = "0"+date;
        }
        dtStr += date;
        dtStr += " ";
        if( hours < 10 ){
            hours = "0"+hours;
        }
        dtStr += hours;
        dtStr += ":";
        if( minutes < 10 ){
            minutes = "0"+minutes;
        }
        dtStr += minutes;
        dtStr += ":";
        if( seconds < 10 ){
            seconds = "0"+seconds;
        }
        dtStr += seconds;
        return dtStr;
    },
    /**
     * @author
     * @description 比较两个时间字符串所表示的时间前后
     * @param firstDTStr 第一个时间字符串
     * @param secondDTStr 第二个时间字符串
     * @returns {number}如果第一个时间后于第二个时间，那么返回1；如果第一时间先于第二个时间返回-1；时间相同则返回0
     */
    compareDTStr : function(firstDTStr,secondDTStr){
        var dtReg = /^(\d{4})-(\d{1,2})-(\d{1,2})\s*(\d{1,2}):(\d{1,2}):(\d{1,2})(\.\d*)?$/;
        var result = 0;
        var firstDTArr = [];
        var secondDTArr = [];
        if( dtReg.test(firstDTStr) ){
            firstDTArr.push(parseInt(RegExp.$1,10));
            firstDTArr.push(parseInt(RegExp.$2,10));
            firstDTArr.push(parseInt(RegExp.$3,10));
            firstDTArr.push(parseInt(RegExp.$4,10));
            firstDTArr.push(parseInt(RegExp.$5,10));
            firstDTArr.push(parseInt(RegExp.$6,10));
            if(dtReg.test(secondDTStr)){
                secondDTArr.push(parseInt(RegExp.$1,10));
                secondDTArr.push(parseInt(RegExp.$2,10));
                secondDTArr.push(parseInt(RegExp.$3,10));
                secondDTArr.push(parseInt(RegExp.$4,10));
                secondDTArr.push(parseInt(RegExp.$5,10));
                secondDTArr.push(parseInt(RegExp.$6,10));
                var i = 0;
                for(; i < 6 ; i += 1 ){
                    if( firstDTArr[i] > secondDTArr[i] ){
                        result = 1;
                        break;
                    }else if( firstDTArr[i] < secondDTArr[i] ){
                        result = -1;
                        break;
                    }
                }
                if( i === 6 ){
                    result = 0;
                }
            }else{
                result = 1;
            }
        }else{
            result = -1;
        }
        return result;
    },

    /**
     * @author
     * @description 获取当前时间的N天前，N天后的日期和时间
     * @param dateGap int类型；日期间隔（天），如果大于0，那么是N天后的日期和时间；如果小于0，那么是N天前的日期和时间
     * @param haveTime boolean类型；是否需要时间
     * @returns {string} 时间结果字符串
     */
    getBeforeAfterDate : function(dateGap,haveTime){
        var currentDT = new Date();
        var result = "";
        var millisecondGap = dateGap * 24 * 60 * 60 * 1000;
        var resultDT = new Date(currentDT.getTime() + millisecondGap);
        var resultYear = resultDT.getFullYear();
        var resultMonth = resultDT.getMonth();
        resultMonth += 1;
        resultMonth = resultMonth < 10 ? ("0" + resultMonth) : resultMonth;
        var resultDate = resultDT.getDate();
        resultDate = resultDate < 10 ? ("0" + resultDate) : resultDate;
        result = resultYear + "-" + resultMonth + "-" + resultDate;
        if( typeof haveTime !== "undefined" && haveTime === true){
            result += " ";
            var hours = resultDT.getHours();
            hours = hours < 10 ? ("0" + hours) : hours;
            result += hours;
            var minutes = resultDT.getMinutes();
            minutes = minutes < 10 ? ("0" + minutes) : minutes;
            result += ":";
            result += minutes;
            var seconds = resultDT.getSeconds();
            seconds = seconds < 10 ? ("0" + seconds) : seconds;
            result += ":";
            result += seconds;
        }
        return result;
    },
    /**
     * @author
     * @description 比较两个时间相隔的天数【endTime-startTime的天数】
     * @param (startTime,endTime)
     * @returns 相差的天数
     * */
    diffTwoDates:function(startTime,endTime){
        var begin = new Date(Date.parse(startTime.replace(/-/g, "/"))); //转换成date格式,字符串必须是2013/08/08的格式,把这种字符串转成date格式
        var end = new Date(Date.parse(endTime.replace(/-/g, "/")));
        var dif = end.getTime() - begin.getTime();
        var day = Math.floor(dif / (1000 * 60 * 60 * 24));
        //day+=1;
        return day;
    },
    /**
     * @author zhuns
     * @description 获取两个时间的时间间隔
     * @param firstDTStr 第一个时间 2014-05-05 00:00:00
     * @param secondDTStr 第二个时间 2014-05-06 00:00:00
     * @returns {number} 返回第一个时间与第二个时间的时间间隔（单位秒）；如果第一个时间后于第二个时间，返回正数；否则返回负数
     */
    getSecondsBetweenTwoDT: function(firstDTStr,secondDTStr){
        var dtReg = /^(\d{4})-(\d{1,2})-(\d{1,2})\s*(\d{1,2}):(\d{1,2}):(\d{1,2})(\.\d*)?$/;
        var seconds = 0;
        var firstDTArr = [];
        var secondDTArr = [];
        if( dtReg.test(firstDTStr) ){
            firstDTArr.push(parseInt(RegExp.$1,10));
            firstDTArr.push(parseInt(RegExp.$2,10));
            firstDTArr.push(parseInt(RegExp.$3,10));
            firstDTArr.push(parseInt(RegExp.$4,10));
            firstDTArr.push(parseInt(RegExp.$5,10));
            firstDTArr.push(parseInt(RegExp.$6,10));
            if(dtReg.test(secondDTStr)){
                secondDTArr.push(parseInt(RegExp.$1,10));
                secondDTArr.push(parseInt(RegExp.$2,10));
                secondDTArr.push(parseInt(RegExp.$3,10));
                secondDTArr.push(parseInt(RegExp.$4,10));
                secondDTArr.push(parseInt(RegExp.$5,10));
                secondDTArr.push(parseInt(RegExp.$6,10));
                var firstDatetime = new Date();
                firstDatetime.setFullYear(firstDTArr[0]);
                firstDatetime.setMonth(firstDTArr[1]-1);
                firstDatetime.setDate(firstDTArr[2]);
                firstDatetime.setHours(firstDTArr[3]);
                firstDatetime.setMinutes(firstDTArr[4]);
                firstDatetime.setSeconds(firstDTArr[5]);

                var secondDatetime = new Date();
                secondDatetime.setFullYear(secondDTArr[0]);
                secondDatetime.setMonth(secondDTArr[1]-1);
                secondDatetime.setDate(secondDTArr[2]);
                secondDatetime.setHours(secondDTArr[3]);
                secondDatetime.setMinutes(secondDTArr[4]);
                secondDatetime.setSeconds(secondDTArr[5]);

                seconds = (firstDatetime.getTime() - secondDatetime.getTime()) / 1000;

            }else{
                seconds = "err";
            }
        }else{
            seconds = "err";
        }
        return seconds;
    },
    /**
     * @author
     * @description 按照给定的时间格式输出时间
     * @param (format,date)format为定义的格式，date为需要转换的时间
     * @returns 按照格式转换以后的时间
     * 示例：
     * $time.fmtDate('yyyy-MM-dd hh:mm:ss',row.plan_time)
     * $time.fmtDate('yyyy-MM-dd hh:mm',row.plan_time)
     * */
    fmtDate:function(format,date){
        date=date||new Date();
        if(typeof(date)=='number'){
            date=new Date(date);
        }
        var o = {
            "M+" : date.getMonth()+1, //month
            "d+" : date.getDate(), //day
            "h+" : date.getHours(), //hour
            "m+" : date.getMinutes(), //minute
            "s+" : date.getSeconds(), //second
            "q+" : Math.floor((date.getMonth()+3)/3), //quarter
            "S" : date.getMilliseconds() //millisecond
        } ;
        if(/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        }

        for(var k in o) {
            if(new RegExp("("+ k +")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return format;
    },
    /**
     * @author
     * @description 获取当前日期的上一个月
     * @param 日期，例如2014-08-14
     * @returns 日期 例如2014-07-14
     * */
    getUpMonth:function (t) {
        var tarr = t.split('-');
        var year = tarr[0],month = tarr[1],day = tarr[2];
        var days = new Date(year,month,0);
        days = days.getDate();//获取当前日期中的月的天数

        var year2 = year;
        var month2 = parseInt(month)-1;
        if(month2==0) {
            year2 = parseInt(year2)-1;
            month2 = 12;
        }
        var day2 = day;
        var days2 = new Date(year2,month2,0);
        days2 = days2.getDate();
        if(day2>days2) {
            day2 = days2;
        }
        if(month2<10) {
            month2 = '0'+month2;
        }
        var t2 = year2+'-'+month2+'-'+day2;
        return t2;
    },
    /**
     * @author
     * @description 获取当前日期及上个月该天的值对
     * @param
     * @returns [2014-07-14,2014-08-14]
     * */
    getMonthBetten:function () {
        var now =  new Date();
        var nowYear = now.getFullYear();
        var nowMonth = now.getMonth()+1;
        var nowDay = now.getDate();
        nowMonth = (nowMonth<10)?('0'+nowMonth):nowMonth;
        nowDay = (nowDay<10)?('0'+nowDay):nowDay;
        var toady = nowYear+'-'+nowMonth+'-'+nowDay;
        var lastDate = $time.getUpMonth(toady);
        return dayArr = [lastDate,toady];
    },
    /**
     * @author
     * @description 将时间格式化为yyyy-MM-dd的格式
     * @param
     * @returns
     * */
    formatDate:function(currDate){
        var xYear=currDate.getFullYear();
        var xMonth=currDate.getMonth()+1;
        if(xMonth<10){
            xMonth="0"+xMonth;
        }
        var xDay=currDate.getDate();
        if(xDay<10){
            xDay="0"+xDay;
        }
        return xYear+"-"+xMonth+"-"+xDay;
    },
    
    formatMonth:function(currDate){
        var xYear=currDate.getFullYear();
        var xMonth=currDate.getMonth()+1;
        if(xMonth<10){
            xMonth="0"+xMonth;
        }
        return xYear+"-"+xMonth;
    }
}

function Map() {
    this.elements = new Array();
    //获取MAP元素个数
    this.size = function() {
        return this.elements.length;
    };
    //判断MAP是否为空
    this.isEmpty = function() {
        return (this.elements.length < 1);
    };
    //删除MAP所有元素
    this.clear = function() {
        this.elements = new Array();
    };
    //向MAP中增加元素（key, value)
    this.put = function(_key, _value) {
        this.elements.push( {
            key : _key,
            value : _value
        });
    };
    //删除指定KEY的元素，成功返回True，失败返回False
    this.remove = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //获取指定KEY的元素值VALUE，失败返回NULL
    this.get = function(_key) {
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    return this.elements[i].value;
                }
            }
        } catch (e) {
            return null;
        }
    };
    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
    this.element = function(_index) {
        if (_index < 0 || _index >= this.elements.length) {
            return null;
        }
        return this.elements[_index];
    };
    //判断MAP中是否含有指定KEY的元素
    this.containsKey = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //判断MAP中是否含有指定VALUE的元素
    this.containsValue = function(_value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //获取MAP中所有VALUE的数组（ARRAY）
    this.values = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    };
    //获取MAP中所有KEY的数组（ARRAY）
    this.keys = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    };
}