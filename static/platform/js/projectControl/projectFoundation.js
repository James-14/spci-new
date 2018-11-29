var ScmCustomer = {
	scmCustomer : {},
    zTreeInstance : null,
    validateFields: {
    	customerName: {
            validators: {
                notEmpty: {
                    message: '客户名称不能为空'
                }
            }
        }
    }
};

/**
 * 清除数据
 */
ScmCustomer.clearData = function() {
    this.scmCustomer = {};
}

/**
 * 设置对话框中的数据
 *
 * @param key 数据的名称
 * @param val 数据的具体值
 */
ScmCustomer.set = function(key, value) {
    this.scmCustomer[key] = (typeof value == "undefined") ? $("#" + key).val() : value;
    return this;
}

/**
 * 设置对话框中的数据
 *
 * @param key 数据的名称
 * @param val 数据的具体值
 */
ScmCustomer.get = function(key) {
    return $("#" + key).val();
}

/**
 * 收集数据
 */
ScmCustomer.collectData = function() {
    this.set('customerId').set('customerName').set('linkway').set('remark').set('address').set('companyId');
}


/**
 * 验证数据是否为空
 */
ScmCustomer.validate = function () {
    $('#scmCustomer').data("bootstrapValidator").resetForm();
    $('#scmCustomer').bootstrapValidator('validate');
    return $("#scmCustomer").data('bootstrapValidator').isValid();
}

/**
 * 提交添加部门
 */
ScmCustomer.addSubmit = function() {
    this.clearData();
    this.collectData();
    
    if (!this.validate()) {
        return;
    }
    var companyId = $('#companyId').val();
	if(companyId == null || companyId == ''){
		Feng.error("请先选择公司!");
		return;
	}
	var params = this.scmCustomer;
	var url = Feng.ctxPath+"/customer/check";
	var ajax = new $ax(url, function (data) {
        var url1=Feng.ctxPath + "/customer/add";
	    if(params.customerId!=null && params.customerId!=''){
            url1=Feng.ctxPath + "/customer/edit";
        }
		var ajax1 = new $ax(url1, function (data) {
			Feng.success("添加成功!");
            var url=Feng.ctxPath+"/project/projectManagement?cId="+data+"&pId="+$('#pId').val()+"&num="+1+"&editFlag="+$("#editFlag").val();
	        // var url=Feng.ctxPath+"/project/projectManagement?cId="+data+"&num="+1;
	        Feng.goTo(url);
		}, function (data) {
	        Feng.error("新增失败!" + data.responseJSON.message + "!");
	    });
	    ajax1.set(params);
	    ajax1.start();
    }, function (data) {
    	Feng.error("业务异常!" + data.responseJSON.message + "!");
    });
    ajax.set(params);
    ajax.start();	
}


$(function() {
    Feng.initValidator("scmCustomer", ScmCustomer.validateFields);
});

