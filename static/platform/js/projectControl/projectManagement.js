$(function() {
	// 初始化头像上传
    var avatarUp = new $WebUpload("projectImg",true,"projectImg");
    avatarUp.setUploadBarId("progressBar");
    avatarUp.init();
    Feng.initValidator("pBaseInfo", PBaseInfo.validateFields);
    Feng.initValidator("pMaterial", PMaterial.validateFields);
});

var PBaseInfo = {
    pBaseInfo: {},
    zTreeInstance: null,
    validateFields: {
        projectName: {
            validators: {
                notEmpty: {
                    message: '项目名称不能为空'
                }
            }
        },
        customerSId: {
            validators: {
                notEmpty: {
                    message: '客戶名称不能为空'
                }
            }
        },

        pStartTime: {
            validators: {
                notEmpty: {
                    message: '预计开工日期不能为空'
                }
            }
        },
        pFinishTime: {
            validators: {
                notEmpty: {
                    message: '预计竣工日期不能为空'
                }
            }
        },
        address: {
            validators: {
                notEmpty: {
                    message: '地址不能为空'
                }
            }
        },
        prjBudg: {
            validators: {
                notEmpty: {
                    message: '项目预算不能为空'
                }
            }
        }
    }
};


var PMaterial = {
    pMaterial: {},
    zTreeInstance: null,
    validateFields: {}
};


var PBuilding = {
    pBuilding: {},
    zTreeInstance: null,
    validateFields: {}
};

/**
 * 清除数据
 */
PBaseInfo.clearData = function () {
    this.pBaseInfo = {};
}

PMaterial.clearPData = function () {
    this.pMaterial = {};
}

PBuilding.clearBData = function () {
    this.pBuilding = {};
}

/**
 * 设置对话框中的数据
 *
 * @param key 数据的名称
 * @param value 数据的具体值
 */
PBaseInfo.set = function (key, value) {
    this.pBaseInfo[key] = (typeof value == "undefined") ? $("#" + key).val() : value;
    return this;
}

PMaterial.setP = function (key, value) {
    this.pMaterial[key] = (typeof value == "undefined") ? $("#" + key).val() : value;
    return this;
}

PBuilding.setB = function (key, value) {
    this.pBuilding[key] = (typeof value == "undefined") ? $("#" + key).val() : value;
    return this;
}
/**
 * 设置对话框中的数据
 *
 * @param key 数据的名称
 * @param val 数据的具体值
 */
PBaseInfo.get = function (key) {
    return $("#" + key).val();
}

PMaterial.getP = function (key) {
    return $("#" + key).val();
}

PBuilding.getB = function(key) {
    return $("#" + key).val();
}

/**
 * 收集数据
 */
PBaseInfo.collectData = function () {
    this.set('projectId').set('customerId').set('projPic').set('projectName').set('patiCompany').set('projectNo').set('prjType').set('basType').set('contrType').set('pStartTimeS').set('openTimeS').set('pFinishTimeS').set('finishTimeS').set('address').set('prjBudg').set('remark').set('longitude').set('latitude');
}


PMaterial.collectPData = function () {
    this.setP('totalArea').setP('buildingArea').setP('civDefns').setP('totalBuildingArea').setP('ovgdBuildingArea').setP('undgBuildingArea').setP('buildingFloors').setP('buildingHeight').setP('grnArea').setP('volRate').setP('buildingDensity').setP('grnRate').setP('vehiPark').setP('vehiOvgdPark').setP('vehiUndgPark').setP('nonVehiPark').setP('nonVehiOvgdPark').setP('nonVehiUndgPark').setP('projectId');
}

PBuilding.collectBData = function () {
    this.setB('singletonName').setB('totalBuildingArea').setB('floors').setB('height').setB('estiLauchDate').setB('realLauchDate').setB('estiCompDate').setB('realCompDate');
}

/**
 * 验证数据是否为空
 */
PBaseInfo.validate = function () {
    $('#pBaseInfo').data("bootstrapValidator").resetForm();
    $('#pBaseInfo').bootstrapValidator('validate');
    return $("#pBaseInfo").data('bootstrapValidator').isValid();
}

PMaterial.validateP = function () {
    $('#pMaterial').data("bootstrapValidator").resetForm();
    $('#pMaterial').bootstrapValidator('validate');
    return $("#pMaterial").data('bootstrapValidator').isValid();
}

PBuilding.validateB = function () {
    $('#pBuilding').data("bootstrapValidator").resetForm();
    $('#pBuilding').bootstrapValidator('validate');
    return $("#pBuilding").data('bootstrapValidator').isValid();
}


$("#address").change(function () {
    $('#longitude').val("");
    $('#latitude').val("");
    $('#coordText').text("");
});

/**
 * 获取经纬度信息
 */
PBaseInfo.queryCoord=function () {

    var address=$("#address").val();

    if (address == null || address == '') {
        Feng.error("请先填写项目地址!");
        return;
    }

    $.reqUrl(Feng.ctxPath + "/project/queryCoord",{"address":address},function(result){

        $('#longitude').val(result.longitude);
        $('#latitude').val(result.latitude);

        if(result.longitude==null||result.longitude==""){
            Feng.error("未查询到该地址经纬度信息!");
            $('#coordText').text("");
        }else{
            $('#coordText').text(result.longitude+","+result.latitude);
        }
    });
}

/**
 * 提交工程
 */
PBaseInfo.addSubmit = function () {
    $("#customerId").val($("#customerSId").val());
    this.clearData();
    this.collectData();
    if (!PBaseInfo.validate()) {
        return;
    }
    var cId = $('#customerId').val();
    if (cId == null || cId == '') {
        Feng.error("请确认已维护客户!");
        return;
    }
    this.set('customerId', cId);
    this.set('projectId', $("#pId").val());
    var imgA = new Array();
    $("input[name='projectImg']").each(function(i){
		if($(this).val()!=null){
			imgA.push($(this).val());
		}		
	});
    this.set('projectImgs', imgA.toString());
    this.set('editFlag', $("#editFlag").val());

    var params = this.pBaseInfo;

    // if(params.longitude==null || params.longitude==""){
    //     Feng.error("请先获取经纬度信息!");
    //     return;
    // }

    if(params.longitude==null || params.longitude=="") {

        layer.confirm('未获取到项目地址经纬度信息，是否提交？', {
            btn: ['确认', '取消'],
            shadeClose: true
        }, function () {
            commitEvent(params);
        });
    }else{
        commitEvent(params);
    }
    
}


var commitEvent=function(params){
    var url = Feng.ctxPath + "/project/checkProject";
    var ajax = new $ax(url, function (data) {
        var ajax1 = new $ax(Feng.ctxPath + "/project/saveProject", function (data) {
            Feng.success("保存成功!");
            var url = Feng.ctxPath + "/project/projectManagement?cId=" + data.cId + "&pId=" + data.pId + "&num=" + 2 + "&editFlag=" + $('#editFlag').val();
            Feng.goTo(url);
        }, function (data) {
            Feng.error("保存失败!" + data.responseJSON.message + "!");
        });
        ajax1.set(params);
        ajax1.start();
    }, function (data) {
        Feng.error("业务异常!" + data.responseJSON.message + "!");
    });
    ajax.set(params);
    ajax.start();
}

/**
 *  添加工程资料
 */
PMaterial.addSubmit = function () {
    this.clearPData();
    this.collectPData();
    if (!this.validateP()) {
        return;
    }
    var pId = $('#pId').val();
    if (pId == null || pId == '') {
        Feng.error("请确认已维护项目!");
        return;
    }
    this.pMaterial['projectId'] = pId;
    this.pMaterial['mId'] = $("#mId").val();
    this.pMaterial['cId'] = $("#customerId").val();
    this.pMaterial['editFlag'] = $("#editFlag").val();
    var params = this.pMaterial;
    var ajax1 = new $ax(Feng.ctxPath + "/project/saveProjectMaterial", function (data) {
        Feng.success("保存成功!");
        var url = Feng.ctxPath + "/project/projectManagement?cId=" + data.cId + "&pId=" + data.pId + "&num=" + 3 + "&editFlag=" + $('#editFlag').val();
        Feng.goTo(url);
    }, function (data) {
        Feng.error("保存失败!" + data.responseJSON.message + "!");
    });
    ajax1.set(params);
    ajax1.start();
}

/***************************楼栋信息维护*******************/
$(function () {
    $("#addSingle").click(function () {
        var snum = $("#singleCount").val();
        snum = parseInt(snum) + 1;
        $("#singleCount").val(snum);
        var content = "";
        if (snum > 1) {
            content += "<div id=\"menu2Table\">";
            content += "<ul class=\"row\">";
            content += "<li class=\"col-md-2 col-sm-2 col-xs-12\">单体" + snum + "名称</li>";
            content += "<li class=\"col-md-4 col-sm-4 col-xs-12\"><input type=\"text\" name=\"singletonName" + snum + "\" id=\"singletonName" + snum + "\"></li>";
            content += "<li class=\"col-md-2 col-sm-2 col-xs-12\">总建筑面积</li>";
            content += "<li class=\"col-md-4 col-sm-4 col-xs-12\"><input type=\"text\" name=\"totalBuildingAreas" + snum + "\" id=\"totalBuildingAreas" + snum + "\"></li>";
            content += "</ul>";
            content += "<ul class=\"row\">";
            content += "<li class=\"col-md-2 col-sm-2 col-xs-12\">建筑层数</li>";
            content += "<li class=\"col-md-4 col-sm-4 col-xs-12\"><input type=\"text\" name=\"floors" + snum + "\" id=\"floors" + snum + "\"></li>";
            content += "<li class=\"col-md-2 col-sm-2 col-xs-12\">建筑高度</li>";
            content += "<li class=\"col-md-4 col-sm-4 col-xs-12\"><input type=\"text\" name=\"height" + snum + "\" id=\"height" + snum + "\"></li>";
            content += "</ul>";
            content += "<ul class=\"row\">";
            content += "<li class=\"col-md-2 col-sm-2 col-xs-12\">计划开工日期</li>";


            content += "<li class=\"col-md-4 col-sm-4 col-xs-12\"><div class=\"dates\"><input  type=\"text\" id=\"estiLauchDate" + snum + "\"/><i class=\"date-icon\"></i></div></li>";
            content += "<li class=\"col-md-2 col-sm-2 col-xs-12\">实际开工日期</li>";
            content += "<li class=\"col-md-4 col-sm-4 col-xs-12\"><div class=\"dates\"><input  type=\"text\"  id=\"realLauchDate" + snum + "\"/><i class=\"date-icon\"></i></div></li>";
            content += "</ul>";
            content += "<ul class=\"row\">";
            content += "<li class=\"col-md-2 col-sm-2 col-xs-12\">计划竣工日期</li>";
            content += "<li class=\"col-md-4 col-sm-4 col-xs-12\"><div class=\"dates\"><input  type=\"text\"  id=\"estiCompDate" + snum + "\"/><i class=\"date-icon\"></i></div></li>";
            content += "<li class=\"col-md-2 col-sm-2 col-xs-12\">实际竣工日期</li>";
            content += "<li class=\"col-md-4 col-sm-4 col-xs-12\"><div class=\"dates\"><input  type=\"text\" id=\"realCompDate" + snum + "\"/><i class=\"date-icon\"></i></div></li>";
            content += "</ul>";
            content += "</div>";
        }
        if (content != "") {
            $("div[id=menu2Table]:last").after(content);
            calldate("estiLauchDate"+snum);
            calldate("realLauchDate"+snum);
            calldate("estiCompDate"+snum);
            calldate("realCompDate"+snum);

        }
    });
});
/**
 * 添加工程楼栋
 */
PBuilding.addBSubmit = function () {
    var bnum = $("#singleCount").val();//单体楼栋数

    var tNum = /^\+?[1-9][0-9]*$/;
    var params = new Array();
    var errorType = 0;
    var errorNo = "";
    var singletonName, totalBuildingArea, floors, height, estiLauchDate, realLauchDate, estiCompDate, realCompDate, nodeId;
    var pId = $('#pId').val();
    if (pId == null || pId == '') {
        Feng.error("请确认已维护项目!");
        return;
    }
    for (var i = 1; i <= bnum; i++) {

        nodeId = $.trim($("#nodeId" + i).val());
        singletonName = $.trim($("#singletonName" + i).val());
        totalBuildingArea = $.trim($("#totalBuildingAreas" + i).val());
        floors = $.trim($("#floors" + i).val());
        height = $.trim($("#height" + i).val());
        estiLauchDate = $.trim($("#estiLauchDate" + i).val());
        realLauchDate = $.trim($("#realLauchDate" + i).val());
        estiCompDate = $.trim($("#estiCompDate" + i).val());
        realCompDate = $.trim($("#realCompDate" + i).val());
        if (singletonName == null || singletonName == '' || floors == '' || floors == null) {
            errorType = 1;
            errorNo = i;
            break;
        } else if (!tNum.test(floors)) {//不是数字
            errorType = 2;
            errorNo = i;
            break;
        }

        var param = {};
        param.singletonName = singletonName;
        param.totalBuildingArea = totalBuildingArea;
        param.floors = floors;
        param.height = height;
        param.estiLauchDate = estiLauchDate;
        param.realLauchDate = realLauchDate;
        param.estiCompDate = estiCompDate;
        param.realCompDate = realCompDate;
        param.projectId = pId;
        param.nodeId = nodeId;
        params.push(param);
    }
    if (errorType == 1) {
        Feng.error("数据异常!第" + errorNo + "组数据中\"单体名称\"或\"建筑层数\"没填写!");
        return;
    } else if (errorType == 2) {
        Feng.error("数据异常!第" + errorNo + "组数据中\"建筑层数\"不是数字!");
        return;
    }
    var jsonParam = JSON.stringify(params);
    var paramF = {};
    paramF.compara = jsonParam;

    paramF.editFlag = $("#editFlag").val();
    var ajax2 = new $ax(Feng.ctxPath + "/project/saveProjectBuilding", function (data) {
        Feng.success("保存成功!");
        var url = Feng.ctxPath + "/project/contractUpload?pId=" + $('#pId').val()+"&editFlag="+$("#editFlag").val();
        Feng.goTo(url);
    }, function (data) {
        Feng.error("保存失败!" + data.responseJSON.message + "!");
    });
    ajax2.set(paramF);
    ajax2.start();
};