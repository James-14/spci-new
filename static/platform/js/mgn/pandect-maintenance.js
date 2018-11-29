$(".user-manage .progress").each(function (a, b) {
    $(".user-manage .progress").eq(a).find("i").animate({"width": b.getAttribute("data-val") + "%"})
})

$('[data-toggle="tooltip"]').tooltip();

$(document).on('click', '.add-one', function () {
    var parentNode = $(this).parent().parent();
    var parentNodeUl = $(this).parent().parent().parent();
    parentNode.clone().appendTo(parentNodeUl).addClass('revealIn');
});

$(document).on('click', '.remove-self', function () {

    var parentNode = $(this).parent().parent();

    parentNode.addClass('revealOut');

    cuteHide(parentNode);

    function cuteHide(el) {
        el.animate({opacity: '0'}, 500, function () {
            el.animate({width: '0px'}, 150, function () {
                el.remove();
            });
        });
    }

});

$(document).on('click', '.call-pop', function () {
    $('.pop-background').fadeIn().addClass('revealIn').removeClass('revealOut');
//      window.open('projectQuality_mgn.html');
});

$(document).on('click', '.close-pop', function () {
    $('.pop-background').fadeOut().removeClass('revealIn').addClass('revealOut');
});


var initTabData=function (tabType) {
    //初始化tab数据
    $('#maintenance-tab').attr("w3-include-html-post",Feng.ctxPath +"/project/initPandectMaintenanceTab");
    w3.includeHTMLPOST(null,"projectId="+$('#projectId').val()+"&tabType="+tabType);
}

initTabData(1);

$(".tab-header li").on("click",function(){
    var index= $(".tab-header li").index($(this));
    $(this).addClass("cur").siblings("li").removeClass("cur");
    $(".tab-content-list .tab-content").eq(index).show().siblings(".tab-content").hide();

    initTabData(index+1);

    // if(index==1){//项目信息tab页
    //     var defaultColunms = ProjectTable.initColumn();
    //     table = new BSTable(ProjectTable.id, "/component/listAjaxData", defaultColunms,{onCheck:checkRow,onUncheck:uncheckRow,onCheckAll:checkAll,onUncheckAll:uncheckAll,pageSize:40,onPageChange:pageChange});
    //     table.setPaginationType("server");
    //     table.setQueryParams(ProjectTable.formParams());
    //     ProjectTable.table = table.init();
    // }
});



var selectedComps = new Map();

function checkRow(row){
    if(!selectedComps.containsKey(row.componentId)&&row.pro_state<0){//不存在且小于0
        selectedComps.put(row.componentId,row);
    }else{
        uncheckRow(row);
    }
    changeNum(selectedComps.size());
}

function uncheckRow(row){
    if(selectedComps.containsKey(row.projectId))
        selectedComps.remove(row.projectId);
    changeNum(selectedComps.size());
}

function checkAll(rows){
    rows.forEach(function(row){
        if(!selectedComps.containsKey(row.projectId)&&row.pro_state<0){//不存在且小于0
            selectedComps.put(row.projectId,row);
        }else{
            uncheckRow(row);
        }
    });
    changeNum(selectedComps.size());
}

function uncheckAll(rows){
    rows.forEach(function(row){
        if(selectedComps.containsKey(row.projectId))
            selectedComps.remove(row.projectId);
    });
    $("#projectTable tr").each(function(i){
        $(this).removeClass("selected");
        $(this).children('td').eq(0).children('input').click();
    });
    changeNum(selectedComps.size());
}




var ProjectTable = {
    id: "projectTable",
    seItem: null,
    table: null
};

ProjectTable.formParams = function() {
    var queryData = {};
    queryData['projectNoQ'] = $("#projectNoQ").val();
    queryData['projectNameQ'] = $("#projectNameQ").val();
    queryData['customerNameQ'] = $("#customerNameQ").val();
    queryData['flagQ'] = $("#flagQ").val();
    queryData['prjTypeQ'] = $("#prjTypeQ").val();
    return queryData;
};

ProjectTable.initColumn = function () {
    return [
        {field: 'selectItem', radio: false},
        {title: 'id', field: 'projectId', visible: false, align: 'center', valign: 'middle'},
        {title: '项目编码', field: 'projectNo', align: 'center', valign: 'middle', sortable: true},
        {title: '项目名称', field: 'projectName', align: 'center', valign: 'middle', sortable: true},
        {title: '项目类型', field: 'prjType', align: 'center', valign: 'middle', sortable: true},
        {title: '项目状态', field: 'flag', align: 'center', valign: 'middle', sortable: true,
            formatter : function (value, row, index) {
                var result = "";
                if(value==1){
                    result = "EPC类";
                }else if(value==2){
                    result = "构件生产类";
                }else if(value==3){
                    result = "构件运输类";
                }else if(value==4){
                    result = "构件装配类";
                }
                return result;
            }
        },
        {title: '状态', field: 'state', align: 'center', valign: 'middle', sortable: true,
            formatter : function (value, row, index) {
                var result = "";
                if(value==0){
                    result = "待处理";
                }else if(value==1){
                    result = "正常";
                }else if(value==2){
                    result = "其他异常";
                }else if(value==3){
                    result = "冻结";
                }else if(value==4){
                    result = "延期";
                }else if(value==9){
                    result = "完结";
                }
                return result;
            }
        },
        {title: '项目进度', field: 'state', align: 'center', valign: 'middle', sortable: true,
            formatter : function (value, row, index) {
                return "60%";
            }
        },
        {title: '项目预算', field: 'prjBudg', align: 'center', valign: 'middle', sortable: true},
        {title: '项目周期', field: 'prjBudg', align: 'center', valign: 'middle', sortable: true,
            formatter : function (value, row, index) {
                return "添加";
            }
        },
        {title: '生产工厂', field: 'factoryName', align: 'center', valign: 'middle', sortable: true},
        {title: '项目地址', field: 'address', align: 'center', valign: 'middle', sortable: true},
        {title: '文件状态', field: 'state', align: 'center', valign: 'middle', sortable: true,
            formatter : function (value, row, index) {
                return "正常";
            }
        }
    ];
};
