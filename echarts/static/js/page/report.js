/**
 * Created by yanghuihui on 2017/5/22.
 */

 var report_id = 0;
$(document).ready(function() {
    $('#report_list').DataTable({
        "sScrollX": "100%",   //表格的宽度
        "sScrollXInner": "100%",   //表格的内容宽度
        "bScrollCollapse": true,//当显示的数据不足以支撑表格的默认的高度时，依然显示纵向的滚动条。(默认是false)
        "bStateSave": true //保存状态到cookie *************** 很重要 ， 当搜索的时候页面一刷新会导致搜索的消失。使用这个属性就可避免了

    });
} );

function delReport(id){
    $("#del_confirm").modal('show');
    report_id = id;
}

function delOk(){
    $.ajax({
        url: '/reports/del',
        type: 'post',
        cache: false,
        async: false,
        dataType:'json',
        data:{
            "report_id":report_id
        },
        complete: function(data){
            var res = data.responseJSON;
            if(0 == res["status"])
                window.location.reload();
        }
    });
}

/**
 * 切换环境选择框时，显示不同环境的报告
 */
$(document).on('change','#env',function() {
    var module_id = get_module_id()
    var interface_id = get_interface_id()
    var case_group_id = get_case_group_id()

    go_to('/reports',module_id,interface_id,case_group_id)
});