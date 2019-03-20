/**
 * Created by maxuan .
 */
var bool_new = true;
/**
 * 删除环境方法
 **/
function del_env_group(env_id) {
    if(confirm("确认删除吗？")){
        $.ajax({
            type: "POST",
            url: "/del_env_group",
            cache: false,
            async: false,
            data: {
                "env_id": env_id
            },
            success: function (data) {
                if (data=="fail") {
                    alert("删除失败！");
                    return false;
                }
                else {
                    alert("删除成功！");
                    window.location.reload();
                }
            }
        });
    }
}





/**
 * 删除环境下变量
 **/
function del_env_vars(env_var_id) {
    $.ajax({
        type: "POST",
        url: "/del_env_var",
        cache: false,
        async: false,
        data:{
            "env_var_id": env_var_id
        },
        success: function (data) {
            if (data == "fail") {
                alert("删除失败！");
                return false;
            }
            else {
                return true;
                //删除变量时停止加载页面，避免影响使用，但是后续需要添加弹框确认是否删除
               // window.location.reload();
            }
        }
    });
}

/**
 *增加环境方法
 **/
function  add_env_group(){
    bool_new = true;
    $("#add_env_label").html("新增环境及变量");
    $('#modal_case_add').modal('show');
}
/**
 *删除单元格当前新增行
 */
function deleteRow_my(r)
{
    r.closest('tr').remove();
}

/**
 * 删除单元格已有行，同时将该行在db的状态置为-1
 */
function  deleteRow_available(r,env_var_id)
{
    deleteRow_my(r);
    del_env_vars(env_var_id);
}

/**
 * 新增环境时，在当前窗口新增or删除环境变量用
 */
$(document).ready(function(){
    $("#add_env").click(function(){
        var tr ="<tr ><td style=\"width:110px;\" >" +
            "<input class=\"text\"  style=\"width:110px;\" placeholder=\"请输入参数名称\"></td>" +
        "<td style=\"width: 200px;\"><input class=\"text\"  style=\"width:200px;\" placeholder=\"请输入参数值\"> </td>"+
            "<td style=\"width: 110px;\"><select >  <option value=\"1\" >sql类型</option>  <option value=\"2\">日志类型</option>"+
                        "<option value=\"3\" selected=\"selected\">普通类型</option><option value=\"5\">模板类型</option></td>"+
            "<td style=\"width: 30px;\"><input type=\"button\" value=\"X\" id=\"delete_env\" onclick=\"deleteRow_my(this)\"/></td></tr>";
        $("#add_env_table").append(tr);
    });
})

/**
 *在主页删除or新增环境变量用
 */
$(document).ready(function(){
    $(".add_env_vars").click(function(){
        var tr ="<tr ><td style=\"width:10px;display: none\" >" +
            "<input class=\"text\"  style=\"width:10px;\" placeholder=\"参数ID占位符\"></td>" +
            "<td style=\"width:auto;\" >" +
            "<input class=\"text\"  style=\"width:150px;\" placeholder=\"请输入参数名称\"></td>" +
            "<td style=\"width:auto;\"><input class=\"text\"  style=\"width:500px;\" placeholder=\"请输入参数值\"> "+
            "<td style=\"width:auto;\"><select >  <option value=\"1\" >sql类型</option>  <option value=\"2\" selected=\"selected\">日志类型</option>"+
            "<option value=\"4\" >redis类型</option> "+
            "<option value=\"3\" selected=\"selected\">普通类型</option><option value=\"5\">模板类型</option> </select></td> "+
            "<td style=\"width:auto;\"><input type=\"button\" value=\"X\" id=\"delete_env_vars\" onclick=\"deleteRow_my(this,'add_env_vars_table')\"/></td></tr>";
        $(this).parent('th').parent('tr').parent('tbody').append(tr);
    });
})

/*
*添加环境及环境下变量的保存
 */
function add_env_group_db() {
    var env_name = $("#env_name").val();
    var env_desc = $("#env_desc").val();
    var array_vars = new Array();
    var trList = $("#env_vars_params").children("tr")
    for (var i=3;i<trList.length;i++) {
        var tdArr = trList.eq(i).find("td");
        var var_name = tdArr.eq(0).find("input").val();
        var var_value = tdArr.eq(1).find("input").val();
        var var_type = tdArr.eq(2).find("select").val();
        var arr = {"var_name" : var_name, "var_value" : var_value, "var_type":var_type, "status" : 1};
        array_vars.push(JSON.stringify(arr));
    }
    $.ajax({
        type: "POST",
        url: "/add_env_group_db",
        cache: false,
        async: false,
        data:{
            "env_name":env_name, "env_desc":env_desc,"params":array_vars
        },
        dataType: 'json',
        success: function (data) {
            if (data == "fail") {
                alert("添加环境变量失败！");
                return false;
            }
            else {
                window.location.href="/env_group_list";
            }
        }
    });
}

/**
 * 当前页在环境下添加环境变量的保存
 **/
$(document).on('click','#add_env_vars_db',function(){
//function add_env_vars_db(){
    //获取当前环境ID
    var env_id_present = $(this).parent().parent().parent().find("li").find("input").val();
    //var env_id_present = 1;
    var array_vars_only = new Array();
    var trList = $(this).parent().parent().find("tbody").children("tr")
    for (var i=1;i<trList.length;i++) {
        var tdArr = trList.eq(i).find("td");
        var var_id = tdArr.eq(0).find("input").val();
        var var_name = tdArr.eq(1).find("input").val();
        var var_value = tdArr.eq(2).find("input").val();
        var var_type = tdArr.eq(3).find("select").val();
        var arr = {"var_id":var_id, "var_name" : var_name, "var_value" : var_value, "var_type":var_type, "status" : 1};
        array_vars_only.push(JSON.stringify(arr));
    }
    $.ajax({
        type: "POST",
        url: "/add_env_vars_db",
        cache: false,
        async: false,
        data:{
            "env_id_present":env_id_present,
            "params":array_vars_only
        },
        dataType: 'json',
        success: function (data) {
            if (data == "fail") {
                alert("添加环境变量失败！");
                return false;
            }
            else {
                alert("添加环境变量成功！");
            }
        }
    });
});
