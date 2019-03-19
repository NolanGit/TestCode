/*var del_case_id = 0;
var bool_new = true;
var global_case_id = 0;
var log_check_list = get_log_check_list();
var sql_check_list = get_sql_check_list();*/

$(document).ready(function(){
     $('#interface_name').bind('change', function(){
//        method =  $("#interface_name").find("option:selected").text();
        $("#test_params  tr").remove();
        $("#case_group option").remove();
        var interface_id = $("#interface_name").val();
        var data = getInterfaceParams(interface_id);
        var module_id = data["module_id"];
        var params = data["params_info"];
        console.log(params);
        for(var i = 0; i < params.length; i++) {
            var key = params[i].key;
            var value = params[i].value;
            var $tr = $("<tr>" +
                        "<td><input type='text' class='form-control' disabled='disabled' value='" + key + "'></td>" +
                        "<td><input type='text' class='form-control' value='" + value + "'></td>" +
                        "</tr>");
//                    console.log($tr);
            $("#test_params").append($tr);
        }

        $.ajax({
            url: "/get_cg_list_by_interface_id",
            type: "get",
            data: {"interface_id":interface_id},
            dataType: 'json',
            cache: false,
            async: true,
            error: function() {
                alert("获取组信息失败");
            },
            complete: function(data) {
                var groups = data.responseJSON;
                console.log(groups);
                for(var i = 0; i < groups.length; i++) {
                    var name = groups[i].name;
                    var group_id =  groups[i].id;
                    $("#case_group").append("<option selected=\"\" value='" + group_id + "'>" + name + "</option>");
                    $("#c_test_select").append("<option  value=\" + group_id + \">" + name + "</option>")
                }
            }
        });
        console.log(interface_id);
    });

    var validator = $("#case_params").validate({
        errorElement: 'span',

        rules: {
            case_name: {
                required: true,
                rangelength:[1,30]
            },
            interface: {
                required: true,
                min:1
            },
            group_name: {
                required: true,
                min:1
            }

        },
        messages: {
            case_name: {
                required: "用例名不能为空",
                rangelength:"用例名称要在{0}-{1}个字符之间！"
            },
            interface: {
                required: "接口数据为空，请先创建接口",
                min: "接口必选"
            },
            group_name: {
                required: "用例组数据为空，请先创建用例组",
                min:"用例组必选"
            }
        },
        submitHandler:function(){
            saveCase();
            window.location.reload();
        }
    });

    $('#modal_case_add').on('hide.bs.modal', function() {
        document.getElementById("case_params").reset();
        $("#test_params  tr").remove();
        $("#div_sql div:not(:first)").remove();
        $("#div_log div:not(:first)").remove();
        validator.resetForm();
    })

})

function delConfirm(id) {
    del_case_id = id;
    $("#del_confirm").modal('show');
}

function delCase() {

    $.ajax({
        url: "/del_case",
        type: "post",
        dataType: "json",
        data: {"case_id":del_case_id},
        cache: false,
        async: true,
        error: function(){
            alert("删除接口失败");
        },
        complete: function(data){
            var response = data.responseJSON;
            console.log(response);
            if (0 == response["status"]) {
                window.location.reload();
            }
        }
    });
}

function newCase() {
    bool_new = true;
    $("#modal_label").html("新建用例");
    $("#interface_name").attr("disabled",false);
    $("#case_group").attr("disabled",false);
    $("#test_params tr").remove();
    var params = get_global_interface_params();
    for(var i = 0; i < params.length; i++) {
        var key = params[i].key;
        var value = params[i].value;
        var $tr = $("<tr>" +
        "<td><input type='text' class='form-control' disabled='disabled' value='" + key + "'></td>" +
        "<td><input type='text' class='form-control' value='" + value + "'></td>" +
        "</tr>");
        $("#test_params").append($tr);
    }
    $('#modal_case_add').modal('show');
}

function editCase(case_id, interface_id) {
    global_case_id = case_id;
    bool_new = false;
    var current_params = new Array();
    var data = getInterfaceParams(interface_id);
    for(var i = 0; i < data["params_info"].length; i++) {
        var key = data["params_info"][i].key;
        current_params.push(key);
    }

    $.ajax({
        url: '/edit_case',
        type: 'post',
        data: {"case_id":case_id},
        cache: false,
        async: false,
        error: function(){
            alert("编辑用例失败");
        },
        complete: function(data){
            var data = data.responseJSON;
            console.log(data);
            $("#modal_label").html("编辑用例");
            $("input[name='case_name']").val(data["case_name"]);
            var interface_name = data["interface_name"];
            $("#interface_name option").each(function(){
                if($(this).text() == interface_name){
                    $(this).prop("selected",true);
                    $(this).parent().attr("disabled", true);
                }
            });
            var group_name = data["group_name"];
            $("#case_group").append("<option value='' selected='selected'>" + group_name +"</option>");
            $("#case_group").attr("disabled", true);

            $("#test_params tr").remove()
            var case_params = $.parseJSON(data["params"]);
            $.each(case_params, function(index, item){
                item = $.parseJSON(item);
                var key = item.key;
                var pos = $.inArray(key, current_params)
                if (-1 != pos) {
                    current_params.splice(pos, 1);
                    var value = item.value;
                    var $tr = $("<tr>" +
                                "<td><input type='text' class='form-control' disabled='disabled' value='" + key + "'></td>" +
                                "<td><input type='text' class='form-control' value='" + value + "'></td>" +
                                "</tr>");
                    $("#test_params").append($tr);
                }
            });
            console.log(current_params);
            $.each(current_params, function(index, value){
                var $tr = $("<tr>" +
                            "<td><input type='text' class='form-control' disabled='disabled' value='" + key + "'></td>" +
                            "<td><input type='text' class='form-control' value='" + value + "'></td>" +
                            "</tr>");
                $("#test_params").append($tr);
            });

            console.log(case_params);
            var check_point = $.parseJSON(data["check_point"]);
            var res_check = check_point["res"];
            $("input[name='resonse_info']").val(res_check);
            var sql_check = check_point["sql"];
            $.each(sql_check, function(index, item){
                var sql_id = item.sql_id;
                var keyword = item.keyword;
                if (0 == index) {
                    $(".sql-check select option").each(function(){
                        if (sql_id == $(this).data('id'))
                            $(this).prop("selected",true);
                    });
                    $(".sql-check input").val(keyword);
                } else {
                    $.each($.parseJSON(sql_check_list), function(index, item){
                        if(sql_id == item.id) {
                            addSqlCheck(item.name, keyword);
                        }
                    });
                }

            });
            var log_check = check_point["log"];
            $.each(log_check, function(index, item){
                var log_id = item.log_id;
                var keyword = item.keyword;
                if (0 == index) {
                    $(".log-check select option").each(function(){
                        if (log_id == $(this).data('id'))
                            $(this).prop("selected",true);
                    });
                    $(".log-check input").val(keyword);
                } else {
                    $.each($.parseJSON(log_check_list), function(index, item){
                        if(log_id == item.id) {
                            addLogCheck(item.name, keyword);
                        }
                    });
                }

            });
            $('#modal_case_add').modal('show');
        }
    });
}


function getInterfaceParams(id){
    var params_data = '';
    $.ajax({
            url: "/get_interface_params",
            type: "get",
            data: {"interface_id": id},
            dataType: 'json',
            cache: false,
            async: false,
            error: function() {
                alert("获取接口参数失败");
            },
            complete: function(data) {
                params_data = data.responseJSON;
            }
    });
    return params_data
}

function copy_case(case_id){
    $.ajax({
        type: "POST",
        url: "/copy_case", /*ajax请求地址*/
        cache: false,
        async: false,
        data: {
            "case_id": case_id
        },
        success: function (data) {
            if(data == 'ok'){
                window.location.reload();//刷新当前页面.
            }
            else{
                alert("复制用例失败！")
            }
        }
    });
}


/**
 * 批量运行用例的方法
 */
$(document).on('click','#case_run',function() {
    /*判断用户是否勾选用例，未勾选提示*/
    var choose_flag= false;
    $("input[name='case_checkbox']:checkbox").each(function () {
            if($(this).attr('checked')) {
                choose_flag = true;
            }
    })
    if (choose_flag != true){
        alert("请勾选要运行的用例！");
        return;
    }
    var check_list = new Array()
    var env = get_env()
    $("[name='case_checkbox'][checked]").each(function(){
        check_list.push($(this).val())
    })

    $.ajax({
        type: "POST",
        url: "/run_cases", /*ajax请求地址*/
        cache: false,
        async: true,
        data: {
            "module_id": get_module_id(),
            "case_id_list":check_list,
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
$(document).on('change','#case_check_all',function() {
    if (!$(this).is(':checked')){
        $("[name='case_checkbox']:checkbox").removeAttr("checked");
    }
    else{
        $("[name='case_checkbox']:checkbox").prop("checked", true);
        $("[name='case_checkbox']:checkbox").attr("checked",'checked');
    }
});


/**
 * 点击复选框的操作,当全部勾选的时候，全选框也选中
 */
$(document).on('change','#case_checkbox',function() {
    if (!$(this).is(':checked')){
        $(this).removeAttr("checked");
        $("[name='case_check_all']:checkbox").removeAttr("checked");
    }
    else{
        $(this).attr("checked",'checked');
        var is_check_all = true;
        $("[name='case_checkbox']").each(function(){
            if(!($(this).is(':checked'))){
                is_check_all = false;
                return false;
            }
        })
        if(is_check_all){
             $("[name='case_check_all']:checkbox").prop("checked", true);
        }
    }
});