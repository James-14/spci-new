$(function(){
    var table=$(".table-list").html();
    $(".add-table").on("click",function(){
        $(".table-list").append(table);
    })
    $(".del-table").on("click",function(){
        if($(".table-info").length>1){
            $(".table-info:last").remove();
        }
    })
    $(".tab-manage li").on("click",function(){
        var idx= $(".tab-manage li").index($(this));
        $(this).addClass("cur").siblings("li").removeClass("cur");
        $(".table-content").eq(idx).show().siblings(".table-content").hide()
    })
    $(".tab-header li").on("click",function(){
        var idx= $(".tab-header li").index($(this));
        $(this).addClass("cur").siblings("li").removeClass("cur");
        $(".tab-content-list .tab-content").eq(idx).show().siblings(".tab-content").hide()
    })
    $(".tab-list li").on("click",function(){
        var idx= $(".tab-list li").index($(this));
        $(this).addClass("cur").siblings("li").removeClass("cur");
        $(".info-content").eq(idx).show().siblings(".info-content").hide()
    })
    $(".sm-pic li").on("click",function(){
        $(".big-pic img").attr("src",$(this).find("img").attr("src"));
    })
})


