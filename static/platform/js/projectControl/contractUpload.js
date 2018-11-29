$(function(){
	var data = {};
	data.path = 'project';
	data.module = '合同上传';
	var projectId = $("#projectId").val();
	data.url = '/project/uploadFile?projectId='+projectId;
	fileUpload('picker','thelist','ctlBtn',data,function(req){
		if(req != null && req != ''){
			var content ="";
			if(req){
				content += "<input type='hidden' name='upFile' value='";
				content += req.newFileName+"' />"
			}
			$("#remark").append(content);
		}
	});
	Feng.initValidator("homeForm", HomeForm.validateFields);
});

var HomeForm = {
		homeForm : {},
	    zTreeInstance : null,
	    validateFields: {
	    	projectId: {
	            validators: {
	                notEmpty: {
	                    message: '工程名称不能为空'
	                }
	            }
	        },
	        customerId:{
	            validators: {
	                notEmpty: {
	                    message: '客户名称不能为空'
	                }
	            }
	        },
	        contractName: {
	            validators: {
	                notEmpty: {
	                    message: '合同名称不能为空'
	                }
	            }
	        },
	        contractNo: {
	            validators: {
	                notEmpty: {
	                    message: '合同编号不能为空'
	                }
	            }
	        },
	        contractType: {
	            validators: {
	                notEmpty: {
	                    message: '合同类型不能为空'
	                }
	            }
	        },
	        state: {
	            validators: {
	                notEmpty: {
	                    message: '合同状态不能为空'
	                }
	            }
	        }
	    }
};


HomeForm.openUserSelect = function () {
    var index = layer.open({
        type: 2,
        title: '选择用户',
        area: ['900px', '500px'], //宽高
        fix: false, //不固定
        maxmin: true,
        content: Feng.ctxPath + '/project/userSelect'
    });
    this.layerIndex = index;
};


/**
 * 清除数据
 */
HomeForm.clearData = function() {
    this.homeForm = {};
}

HomeForm.set = function(key, val) {
    this.homeForm[key] = (typeof value == "undefined") ? $("#" + key).val() : value;
    return this;
}

HomeForm.get = function(key) {
    return $("#" + key).val();
}

HomeForm.collectData = function() {
    this.set('projectId').set('contractId').set('contractName').set('contractNo').set('customerId').set('contractType').set('state').set('linker').set('linkPhone').set('signer').set('signerDate').set('startTime').set('endTime').set('summary').set('remark');
}

HomeForm.validate = function () {
    $('#homeForm').data("bootstrapValidator").resetForm();
    $('#homeForm').bootstrapValidator('validate');
    return $("#homeForm").data('bootstrapValidator').isValid();
}


HomeForm.addSubmit = function() {
    this.clearData();
    this.collectData();    
	if (!this.validate()) {
	    return;
	 }
	var param = this.homeForm;
	var params = {};
	params.homeForm = param;
	var array = new Array();
	var pa = {};
	$("input[name='upFile']").each(function(i){
		if($(this).val()!=null){
			pa.docName = $(this).val();
			array.push(pa);
		}
		
	});
	if(array.length>0){
		params.doc = array;
	}
	var jsonParam = JSON.stringify(params);
	var paramF = {};
	paramF.compara = jsonParam;

	var url=Feng.ctxPath + "/project/addProjectUpload";

	if(param.contractId!=null && param.contractId!=""){//修改
		url=Feng.ctxPath + "/project/editProjectUpload";
	}
	var ajax = new $ax(Feng.ctxPath+"/project/checkContractUpload", function (data) {
	    var ajax1 = new $ax(url, function (data) {
			Feng.success("添加成功!");
	        var url=Feng.ctxPath+"/project/teamManagement?pId=" + $('#pId').val()+"&editFlag="+$("#editFlag").val();
	        Feng.goTo(url);
	    }, function (data) {
	        Feng.error("新增失败!" + data.responseJSON.message + "!");
	    });
	    ajax1.set(paramF);
	    ajax1.start();
	}, function (data) {
        Feng.error("业务异常!" + data.responseJSON.message + "!");
    });
    ajax.set(paramF);
    ajax.start();
}