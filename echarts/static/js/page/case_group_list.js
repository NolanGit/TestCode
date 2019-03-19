/**
 * Created by yanghuihui on 2017/3/28.
 */

//var $j = jQuery.noConflict()
var oTable;
var to_del_cg_id = 0;
$(document).ready( function () {
    oTable = $('#case_group_table').DataTable({
        "aLengthMenu": [[20,50, 100,-1], ["20条","50条", "100条", "All"]],
        "aoColumnDefs": [{
               //设置第3列不排序
               "bSortable": false,
               "aTargets": [0,5]
           }],
        fixedHeader: true
    });
} );


/**
 * 点击删除用例组按钮的方法
 */
function del_case_group() {
    $.ajax({
        type: "POST",
        url: "/del_case_group", /*ajax请求地址*/
        cache: false,
        async: false,
        data: {
            "case_group_id": to_del_cg_id
        },
        success: function (data) {
            if (data == "fail") {
                layerAlert("保存失败。");
                return false;
            }
            else {
                window.location.reload();
            }
        }
    });
}


/**
 * 批量运行用例组的方法
 */
$(document).on('click','#cg_run',function() {
    /*判断用户是否勾选用例组，未勾选提示*/
    var choose_flag= false;
    $("input[name='cg_checkbox']:checkbox").each(function () {
            if($(this).attr('checked')) {
                choose_flag = true;
            }
})
if (choose_flag != true){
    alert("请勾选要运行的用例组！");
    return;
}
    var check_list = new Array()
    var env = get_env()
    $("[name='cg_checkbox'][checked]").each(function(){
        check_list.push($(this).val())
    })
    var report_type = 0;
    if (!$("#cg_check_all").is(':checked')){
        report_type = 1;
    }
    $.ajax({
        type: "POST",
        url: "/run_case_group", /*ajax请求地址*/
        cache: false,
        async: true,
        data: {
            "module_id": get_module_id(),
            "interface_id":get_interface_id(),
            "case_group_id_list":check_list,
            "report_type":report_type,
            "env":env

        },
        success: function (data) {
        }
    });
    alert("用例执行任务添加成功，可稍后到结果页查看结果！");
});

/**
 * 点击全选操作
 */
$(document).on('change','#cg_check_all',function() {
    if (!$(this).is(':checked')){
        $("[name='cg_checkbox']:checkbox").removeAttr("checked");
    }
    else{
        $("[name='cg_checkbox']:checkbox").prop("checked", true);
        $("[name='cg_checkbox']:checkbox").attr("checked",'checked');
    }
});


/**
 * 点击复选框的操作,当全部勾选的时候，全选框也选中
 */
$(document).on('change','#cg_checkbox',function() {
    if (!$(this).is(':checked')){
        $(this).removeAttr("checked");
        $("[name='cg_check_all']:checkbox").removeAttr("checked");
    }
    else{
        $(this).attr("checked",'checked');
        var is_check_all = true;
        $("[name='cg_checkbox']").each(function(){
            if(!($(this).is(':checked'))){
                is_check_all = false;
                return false;
            }
        })
        if(is_check_all){
             $("[name='cg_check_all']:checkbox").prop("checked", true);
        }
    }
});

function copy_case_group(case_group_id){
    $.ajax({
        type: "POST",
        url: "/copy_case_group", /*ajax请求地址*/
        cache: false,
        async: false,
        data: {
            "case_group_id": case_group_id
        },
        success: function (data) {
            if(data == 'ok'){
                window.location.reload();//刷新当前页面.
            }
            else{
                alert("复制用例组失败！")
            }
        }
    });
}


function delConfirm(cg_id) {
    to_del_cg_id = cg_id;
    $('#del_confirm').modal('show');
}
