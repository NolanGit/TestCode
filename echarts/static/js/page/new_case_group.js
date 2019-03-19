/**
 * Created by yanghuihui on 2017/3/28.
 */


$().ready(function() {
    $(".dept_select").chosen({
        no_results_text: "接口不存在.",//搜索不到内容时，显示的提示语
        placeholder_text : "请选择.",  //下拉选项默认显示的文字
        search_contains: true,  //chosen搜索选项的中间及末尾字符
        disable_search_threshold: 10 //select的option选项大于等于此值，才会显示查询的文本框
    });
    $("#cg_add_form").validate({
        errorElement: 'span',
        rules: {
            cg_name:{
                required:true,
                rangelength:[1,200]
                /*remote:{
                    url:"/cg_name_is_exist",
                    type:"get",
                    data:{
                        cg_name:function(){
                            return $("#cg_name").val();
                        },
                        interface_id:function(){
                            return $("#cg_interface_list option:selected").attr("data-id");
                        }
                    },
                    dataFilter:function(data){
                        if(data == "true"){
                            return false;
                        }
                        else{
                            return true;
                        }
                    }
                }*/
            },
            cg_interface_list:{
                minlength:1
            }
        },
        messages: {
            cg_name: {
                required:"请输入用例组名称",
                rangelength:"用例组名称在200个字符以内"
               /* remote:"用例组名称已经存在"*/
            },
            cg_interface_list:{
                minlength:"接口必选"
            }
        },
        submitHandler:function(){
			cg_submit();
        }
    });
});

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

/**
 * 点击新建用例组的按钮的方法
 */
//$(document).on('click','#cg_submit',function(){
function cg_submit(){
    var name = $.trim($("#cg_name").val());
    var desc = $.trim($("#cg_desc").val());
    var module_id = get_module_id()
    var interface_id = $("#cg_interface_list option:selected").attr("data-id");
    var case_group_id = getUrlParam('case_group_id');
    if (case_group_id == null){
        case_group_id = 0;
    }
    //获取全局变量
    var params = new Array();
    var trList = $("#cg_params").children("tr");
    for (var i=0;i<trList.length;i++) {
        var tdArr = trList.eq(i).find("td");
        var key = tdArr.eq(0).find("input").val();
        if (key != '') {
            var value = $.trim(tdArr.eq(1).find("input").val());
            var arr = {"key": key, "value": value};
            params.push(JSON.stringify(arr));
        }
    }
    //获取setup_list [{type:'',key:'',value:'',content:[{'interface_id':'',params:''}] ,'variables':''}]
    var setup_list = new Array();
    $("#cg_setup_list").find("select.cg_type_select").each(function(){
        var select_option = $(this).val();
        var key_id = $(this).siblings("select.type_info_select").find("option:selected").attr("data-id");
        if(select_option.toLowerCase() == 'mysql'){
            var value = $(this).siblings("input.cg_msyql_input").val();
            var var_div = $(this).siblings("div.var_div");
            var var_name = $.trim(var_div.find("input[name=var_name]").val());
            var var_value = $.trim(var_div.find("input[name=var_value]").val());
            var variables = {"key":var_name,"value":var_value}
            var mysql_json = {"type":"mysql","id":key_id,"value":value,"content":'',"variables":variables}
            setup_list.push(JSON.stringify(mysql_json))
        }
        if(select_option.toLowerCase() == 'api'){
            var table = $(this).siblings("div.cg_interface_params").find("table tbody");
            var trList = table.children("tr");
            var setup_params = new Array();
            for (var i=0;i<trList.length;i++) {
                var tdArr = trList.eq(i).find("td");
                var key = $.trim(tdArr.eq(0).find("input").val());
                if (key != '') {
                    var value = $.trim(tdArr.eq(1).find("textarea").attr("data-value"));
                    var opt_key = tdArr.eq(2).find("label").attr("data-id");
                    var opt_name = tdArr.eq(2).find("label").attr("data-value");
                    var opt = {"type":opt_key,"name":opt_name}
                    var arr = {"key": key, "value": value,"opt":opt};
                    setup_params.push(arr);
                }
            }
            var var_div = $(this).siblings("div.var_div");
            var varList=new  Array();
            var_div.find("ul").each(function(data,value) {
                var var_name = $.trim($(this).find("input[name=var_name]").val());
                var var_value = $.trim($(this).find("input[name=var_value]").val());
                var variables ={"key":var_name,"value":var_value};
                varList.push(variables);
            });
      /*      var var_name = $.trim(var_div.find("input[name=var_name]").val());
            var var_value = $.trim(var_div.find("input[name=var_value]").val());
            var variables = {"key":var_name,"value":var_value}*/
            var eapi_json = {"type":"api","id":key_id,"value":'',"content":setup_params,"variables":varList}
            setup_list.push(JSON.stringify(eapi_json))
        }
        if(select_option.toLowerCase() == 'redis') {
            var table = $(this).siblings("div.cg_redis_set").find("table tbody");
            var key_id = $(this).siblings("select.type_info_select").find("option:selected").attr("data-id");
            var trList = table.children("tr");
            var setup_params = new Array();
            for (var i = 0; i < trList.length; i++) {
                var tdArr = trList.eq(i).find("td");
                var redis_type_select = tdArr.find(".redis_type_select").val();
                var key = $.trim(tdArr.eq(1).find("textarea").val());
                if (key != '') {
                    var value = $.trim(tdArr.eq(3).find("textarea").attr("data-value"));
                     //var opt_key = tdArr.eq(2).find("label").attr("data-id");
                     //var opt_name = tdArr.eq(2).find("label").attr("data-value");
                     //var opt = {"type":opt_key,"name":opt_name}
                    var opt = {"type": "", "name": ""}
                    var arr = {"key": key, "value": value, "select_type": redis_type_select};
                    setup_params.push(arr);
                }
            }
            var variables = {"key":"","value":""}
            var redis_json = {"type":"redis","id":key_id,"value":'',"content":setup_params}
            setup_list.push(JSON.stringify(redis_json))
        }

    });



    //获取teardown list
    //获取setup_list [{type:'',key:'',value:'',content:[{'interface_id':'',params:''}] ,'variables':''}]
    var teardown_list = new Array();
    $("#cg_teardown_list").find("select.cg_type_select").each(function(){
        var select_option = $(this).val();
        var key_id = $(this).siblings("select.type_info_select").find("option:selected").attr("data-id");
        if(select_option == 'mysql'){
            var value = $.trim($(this).siblings("input.cg_msyql_input").val());
            var mysql_json = {"type":"mysql","id":key_id,"value":value,"content":''}
            teardown_list.push(JSON.stringify(mysql_json))
        }
        if(select_option == 'api'){
            var table = $(this).siblings("div.cg_interface_params").find("table tbody");
            var trList = table.children("tr");
            var interface_params = new Array();

            for (var i=0;i<trList.length;i++) {
                var tdArr = trList.eq(i).find("td");
                var key = $.trim(tdArr.eq(0).find("input").val());
                if (key != '') {
                    var value = $.trim(tdArr.eq(1).find("textarea").attr("data-value"));
                    var opt_key = tdArr.eq(2).find("label").attr("data-id");
                    var opt_name = tdArr.eq(2).find("label").attr("data-value");
                    var opt = {"type":opt_key,"name":opt_name}
                    var arr = {"key": key, "value": value,"opt":opt};
                    interface_params.push(arr);
                }
            }
            var eapi_json = {"type":"api","id":key_id,"value":'',"content":interface_params}
            teardown_list.push(JSON.stringify(eapi_json))
        }
    });


    $.ajax({
        type: "POST",
        url: "/add_case_group", /*ajax请求地址*/
        cache: false,
        async: false,
        data: {
            "module_id":module_id,
            "interface_id":interface_id,
            "case_group_id":case_group_id,
            "name": name,
            "desc":desc,
            "params":params,
            "setup_list":setup_list,
            "teardown_list":teardown_list
        },
        success: function (data) {
            if (data == "fail") {
                alert("保存失败。");
                return false;
            }
            else if (data == "repeat") {
                alert("推广组名称重复！");
                return false;
            }
            else {
                go_to('/case_group_list',module_id,interface_id)
                //window.location.href = '/case_group_list?module_id=' + module_id + '&interface_id=' + interface_id;
            }
        }
    });
}

/**
 * 点击新建用例组的取消的方法
 */
$(document).on('click','#cg_cancel',function() {
    //var interface_id = $(" #cg_interface_list option:selected").attr("data-id");
    //var interface_id = getUrlParam("interface_id")
    var interface_id = get_interface_id()
    var module_id = get_module_id()
    if (interface_id != 0) {
        window.location.href = '/case_group_list?module_id=' + module_id + '&interface_id=' + interface_id;
    }
    else{
        window.location.href = '/case_group_list?module_id=' + module_id;
    }
});


/**
 全局变量框，点击+号，增加一行
 */
$(document).on('click','#cg_gp_table tr th a',function(e){
    var table = $("#cg_gp_table");
    var vTr= "<tr>" +
        "<td><input  type=\"text\"></td>" +
        "<td><input  type=\"text\"></td>" +
        "<td><a role=\"button\">×</a>" +
        "</td>" +
        "</tr>";
    table.append(vTr);
});

/**
 * 全局变量框，点击×删除一行
 */
$(document).on('click','#cg_gp_table tr td a',function(){
    $(this).closest('tr').remove();
});


/**
 * setup参数列表，点击×删除一行
 */
$(document).on('click','#body_row_del',function(){
    $(this).closest('tr').remove();
})

/**
 * 用例组setuplist点击新建+按钮的事件cg_setup_add_column
 */
$(document).on('click','#cg_setup_add_column',function(){
    var dl_html = '<div class="setup_list_class" ondrop="drop(event,this)" ondragover="allowDrop(event)" draggable="true" ondragstart="drag(event, this)">' +
            '<i class="glyphicon glyphicon-plus"></i>' +
            '<select class="cg_type_select">' +
                '<option value="api" selected>Api</option> ' +
                '<option  value="mysql">Mysql</option> ' +
                '<option  value="redis">Redis</option>' +
            '</select>' +
            '<select class="type_info_select dept_select" style="width:300px" data-placeholder="请选择"></select> ' +
            '<input class="cg_msyql_input" type="text" style="width:300px;display:none" >' +
                '<a class="cg_del" role="button" class="btn btn-primary">×</a>' +
            '<div  class="cg_interface_params" style="display:none"></div>' +
            '<div class="cg_redis_set" style="display:none">' +
                '<table class="table" id="cg_redis_set_table">' +
                    '<thead> ' +
                        '<tr> ' +
                            '<th width="10%" class="th_show">type</th> ' +
                            '<th width="20%" class="th_show">key</th>' +
                            '<th width="10%" class="th_show">:</th> ' +
                            '<th width="30%" class="th_show">value</th> ' +
                            '<th width="20%" class="th_show" style="display: none">opt</th> ' +
                            '<th width="10%" class="th_show"><a  id="redis_add_row" role="button">+</a></th> ' +
                        '</tr> ' +
                    '</thead>' +
                    '<tbody id="cg_redis_params">' +
                        '<tr>' +
                            '<td width="10%"> <select class="redis_type_select"> <option value="add" selected>新增/编辑</option> <option  value="del" >删除</option> </select> </td>' +
                            '<td width="20%"> <textarea  id="redis_key" class="area" style="width:20%" initAttrH="30" data-value=""></textarea> </td> ' +
                            '<td width="10%" align="center">:</td> ' +
                            '<td width="30%"> <textarea  id="redis_value" class="area" style="width:30%" initAttrH="30" data-value=""></textarea> </td>' +
                            '<th width="20%" class="th_show" style="display: none">opt</th> ' +
                            '<td width="10%"><a  id="redis_row_del" role="button">×</a></td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table> ' +
            '</div>' +
            '<div class="var_div" style="display:none" id="var_div">' +
                '<lable>传递变量:</label><a role="button" class="btn btn-primary" id="quick_add_params">+</a>' +
                '<ul><input type="text" name="var_name"/>:<input type="text" name="var_value" style="width:300px"/><a  id="var_row_del" role="button">×</a></ul>' +
            '</div>' +
        '</div>';

    $("#cg_setup_list").append(dl_html)
    var select = $("#cg_setup_list").children(".setup_list_class:last-child").children(".type_info_select")
    select.chosen({
                        no_results_text: "接口不存在.",//搜索不到内容时，显示的提示语
                        //placeholder_text : "请选择.",  //下拉选项默认显示的文字
                        search_contains: true,  //chosen搜索选项的中间及末尾字符
                        disable_search_threshold: 10 //select的option选项大于等于此值，才会显示查询的文本框
                    })
    //$('<option selected><a href="#">请选择</a></option>').appendTo(select)

    $.ajax({
        type: "GET",
        url: "/get_all_interface", /*ajax请求地址*/
        cache: false,
        async: false,
        success: function (data) {
                if (data == "fail") {
                    alert("保存失败。");
                    return false;
                }
                else {
                    var dataRole = eval(data);
                    for(i = 0;i<dataRole.length;i++){
                        $('<option data-id="' + dataRole[i].id + '"><a href="#">' + dataRole[i].name + '</a></option>').appendTo(select)
                    }
                    select.trigger("chosen:updated")
                    select.chosen()
                }
            }
        });

});


//点击+号，redis参数列添加一行
$(document).on('click','#redis_add_row',function(){
    var oTable = $(this).parents("#cg_redis_set_table").children("#cg_redis_params");
    var oTr = '<tr>' +
            '<td width="10%"> ' +
                '<select class="redis_type_select"> ' +
                    '<option value="add" selected>新增/编辑</option> ' +
                    '<option  value="del" >删除</option> ' +
                '</select> ' +
            '</td>' +
            '<td width="20%"> <textarea  id="redis_key" class="area" style="width:20%" initAttrH="30" data-value=""></textarea> </td> ' +
            '<td width="10%" align="center">:</td> ' +
            '<td width="30%"> <textarea  id="redis_value" class="area" style="width:30%" initAttrH="30" data-value=""></textarea> </td>' +
            '<th width="20%" class="th_show" style="display: none">opt</th> ' +
            '<td width="10%"><a  id="redis_row_del" role="button">×</a></td>' +
        '</tr>'
    oTable.append(oTr);
})

/**
 *redis参数列表，点击×删除一行
 */
$(document).on('click','#redis_row_del',function(){
    var oTable = $(this).parents('#cg_redis_params');
    var oTr = $(this).closest('tr');
    if(oTable.find('tr').length == 1){
        oTr.find("td textarea").val('')
    }
    else{
        oTr.remove();
    }
})


/**
 * 删除setuplist的一行
 */
$(document).on('click','.cg_del',function(){
    $(this).parent("div").remove();
});


/**
 * setuplist参数类型选择框切换的绑定事件
 */
$(document).on('change','.cg_type_select',function() {
        var select_option = $(this).val();
        var select = $(this).next("select.dept_select");
        select.html("")
        select.chosen("destroy")  //chose销毁之前的数据
        select.chosen({
                        no_results_text: "接口不存在.",//搜索不到内容时，显示的提示语
                        //placeholder_text : "请选择.",  //下拉选项默认显示的文字
                        search_contains: true,  //chosen搜索选项的中间及末尾字符
                        disable_search_threshold: 10 //select的option选项大于等于此值，才会显示查询的文本框
                    })
        //$("<option value='-1'>请选择</option>").appendTo(select);
        if (select_option == 'mysql'){
            var sql_check_list = get_sql_check_list();
            $.each($.parseJSON(sql_check_list), function(index, item){
                $('<option data-id=' + item.id + '>' + item.name + '</option>').appendTo(select);
            });
            select.trigger("chosen:updated")
            select.chosen()
            $(this).siblings("input.cg_msyql_input").show();
            $(this).siblings("div.cg_interface_params").empty()
            $(this).siblings("div.cg_interface_params").css({"display":"none"});
            $(this).siblings("div.var_div").css({"display":"none"});
            $(this).siblings("div.cg_redis_set").css({"display":"none"});
        }
        if (select_option == 'api'){
            $(this).siblings("input.cg_msyql_input").hide();
            $(this).siblings("div.cg_redis_set").css({"display":"none"});
            //select.append('<option selected><a href="#"></a></option>');
            $.ajax({
                type: "GET",
                url: "/get_all_interface", /*ajax请求地址*/
                cache: false,
                async: false,
                success: function (data) {
                        if (data == "fail") {
                            alert("保存失败。");
                            return false;
                        }
                        else {
                            var dataRole = eval(data);
                            for(i = 0;i<dataRole.length;i++){
                                select.append('<option data-id="' + dataRole[i].id + '"><a href="#">' + dataRole[i].name + '</a></option>');
                            }
                            select.trigger("chosen:updated")
                            select.chosen()
                        }
                    }
                });
        }
        if (select_option == 'redis'){
            var redis_check_list = get_redis_check_list();
            $.each($.parseJSON(redis_check_list), function(index, item){
                $('<option data-id=' + item.id + '>' + item.name + '</option>').appendTo(select);
            });
            select.trigger("chosen:updated")
            select.chosen()
            $(this).siblings("input.cg_msyql_input").hide();
            $(this).siblings("div.cg_interface_params").empty();
            $(this).siblings("div.cg_interface_params").css({"display":"none"});
            $(this).siblings("div.var_div").css({"display":"none"});
            $(this).siblings("div.cg_redis_set").css({"display":"block"});
        }
    }
);
/**
 * 选择接口时，自动加载接口的参数
 */
$(document).on("change",".type_info_select", function () {
    var select_type = $(this).prev('.cg_type_select').val();
    var div_var = $(this).siblings("div.var_div");
    div_var.css({"display":"block"});

    var var_i = $(this).siblings("i.glyphicon");
    //设置展开的状态
    var_i.removeClass('glyphicon-plus').addClass('glyphicon-minus');

    if(select_type == 'api'){
        var select_option = $(this).val();
        var div_params = $(this).siblings("div.cg_interface_params");

        div_params.empty();
        //div_var.find("input").val("");
        if (select_option == '选择接口'){
            div_params.css({"display":"none"});
            div_var.css({"display":"none"})
        }
        else {
            var id_num = $('[id=cg_interface_params_table]').length + 1
            var table_html = '<table class="table" id="cg_interface_params_table">' +
                '<thead> ' +
                    '<tr> ' +
                        '<th width="20%" >参数名称</th> ' +
                        '<th width="50%">参数值</th> ' +
                        '<th width="20%"></th>' +
                        '<th width="10%"></th>' +
                    '</tr>' +
                '</thead> ' +
                '<tbody id="params' + id_num + '">';
            var interface_id = $(this).children("option:selected").attr("data-id");
            $.ajax({
                type: "GET",
                url: "/get_interface_params", /*ajax请求地址*/
                cache: false,
                async: false,
                data: {
                    "interface_id": interface_id
                },
                success: function (data) {
                    if (data == "fail") {
                        alert("保存失败。");
                        return false;
                    }
                    else {
                        var params = data.params_info;
                        for (i = 0; i < params.length; i++) {
                            var tr_html = '<tr>' +
                                '<td><input type="text" value="' + params[i].key + '" disabled></td>' +
                                '<td><textarea  class="area" style="width:400px" initAttrH="30" data-value=\'' + params[i].value + '\' >' + params[i].value + '</textarea></td>' +
                                '<td> ' +
                                    '<label data-id="1" data-value="" class="opt_label_class">无 ' +
                                        '<a class="btn" id="opt_select"><span id="" class="glyphicon glyphicon-pencil"></span></a> ' +
                                    '</label> ' +
                                '</td>' +
                                '<td><a  id="body_row_del" role="button">×</a></td>' +
                                '</tr>';
                            table_html += tr_html;
                        }
                        table_html += '</tbody> </table>';
                        div_params.html(table_html);
                        div_params.css({"display":"block"});
                    }
                }
            });
        }
    }
});

$(document).on('click','.glyphicon-plus',function(){
    $(this).removeClass('glyphicon-plus').addClass('glyphicon-minus');
    var div_params = $(this).siblings("div.cg_interface_params");
    var div_var = $(this).siblings("div.var_div");
    var div_redis = $(this).siblings("div.cg_redis_set")
    div_params.css({"display":"block"});
    div_var.css({"display":"block"})
    var sel_type = $(this).siblings('select.cg_type_select').val()
    if (sel_type == 'redis')
        div_redis.css({"display":"block"})

});

$(document).on('click','.glyphicon-minus',function(){
    $(this).removeClass('glyphicon-minus').addClass('glyphicon-plus');
    var div_params = $(this).siblings("div.cg_interface_params");
    var div_var = $(this).siblings("div.var_div");
    var div_redis = $(this).siblings("div.cg_redis_set")
    div_params.css({"display":"none"});
    div_var.css({"display":"none"});
    div_redis.css({"display":"none"})
});


/**
 * 用例组teardown点击新建+按钮的事件
 */
$(document).on('click','#cg_teardown_add_column',function(){
    var html = '<div class="setup_list_class" ondrop="drop(event,this)" ondragover="allowDrop(event)" draggable="true" ondragstart="drag(event, this)">' +
        '<i class="glyphicon glyphicon-plus"></i>' +
        '<select class="cg_type_select">' +
        '<option value="api" selected>Api</option> ' +
        '<option  value="mysql">Mysql</option> </select>' +
        '<select class="type_info_select dept_select" style="width:300px" data-placeholder="请选择"  ></select> ' +
        '<input class="cg_msyql_input" type="text" style="width:300px;display:none" >' +
        '<a class="cg_del" role="button" class="btn btn-primary">×</a>' +
        '<div  class="cg_interface_params" style="display:none"></div>' +
        '</div>';

    $("#cg_teardown_list").append(html);

    var select = $("#cg_teardown_list").children(".setup_list_class:last-child").children(".type_info_select")
    select.chosen({
                        no_results_text: "接口不存在.",//搜索不到内容时，显示的提示语
                        placeholder_text : "请选择.",  //下拉选项默认显示的文字
                        search_contains: true,  //chosen搜索选项的中间及末尾字符
                        disable_search_threshold: 10 //select的option选项大于等于此值，才会显示查询的文本框
                    })
    $('<option selected><a href="#"></a>请选择</option>').appendTo(select)

    $.ajax({
        type: "GET",
        url: "/get_all_interface", /*ajax请求地址*/
        cache: false,
        async: false,
        success: function (data) {
                if (data == "fail") {
                    alert("保存失败。");
                    return false;
                }
                else {
                    var dataRole = eval(data);
                    for(i = 0;i<dataRole.length;i++){
                        $('<option data-id="' + dataRole[i].id + '"><a href="#">' + dataRole[i].name + '</a></option>').appendTo(select)
                    }
                    select.trigger("chosen:updated")
                    select.chosen()
                }
            }
        });
});

/**
 * 点击opt下面的编辑时，弹出选择操作框
 */
$(document).on('click','#opt_select',function(){
    var from = $(this).parents("tbody").attr("id");
    var tr = $(this).closest('tr');
    var tr_num = tr[0].rowIndex;
    var tdArr = tr.find("td");
    var selectId = tdArr.eq(2).find("label").attr("data-id");
    var selectName =  tdArr.eq(2).find("label").attr("data-value");

    if(selectId != '0'){
        $("input[name='radioopt']").get(selectId-1).checked=true;
    }
    else{
        $("input[name='radioopt']").get(selectId).checked=true;
    }
    if(selectId == '3'){
        $('#radio_encode_id').val(selectName)
    }
    $("#edit_opt").attr('data-from',from);
    $("#edit_opt").attr('data-id',tr_num);
    $("#edit_opt").modal('show');
});


function opt_select_ok(){
    var from = $("#edit_opt").attr("data-from")
    var tr_num = $("#edit_opt").attr("data-id") - 1;
    var encode_id = 0
    var label_obj = $("#" + from + " tr:eq(" + tr_num + ") td:eq(2) label");
    var radio_checked = $("input[name='radioopt']:checked").val()
    var radio_checked_text  = '无';
    var radio_checked_res = '<a class="btn" id="opt_select"><span id="" class="glyphicon glyphicon-pencil"></span></a>'
    switch (radio_checked) {
        case "2":
            radio_checked_text = '整体加密';
            label_obj.attr("data-id", radio_checked);
            break;
        case "3":
            encode_id = $("#radio_encode_id").val();
            radio_checked_text = encode_id+'字段加密';
            label_obj.attr("data-id", radio_checked);

            break;
        case "4":
            radio_checked_text = '自动生成logid';
            label_obj.attr("data-id", radio_checked);
            break;
        default:
            radio_checked_text = '无';
            label_obj.attr("data-id", 0);
            break;
    }
    label_obj.attr("data-value",encode_id);
    radio_checked_res = radio_checked_text + radio_checked_res;

    label_obj.html(radio_checked_res)
}


 $("body").on("input",".area",function(){
     $(this).css("z-index",2);
     $(this).txtaAutoHeight();
 })


 $("body").on("blur",".area",function(){
     $(this).css("z-index",1);
     var content = $(this).val().replace(/\n/g,"");
     $(this).attr("data-value",content)
     if(get_length(content)>50)
        content = subString(content,50,1) ;
     console.log(content)
     $(this).val(content);
     $(this).css("height","30px");
 });

$("body").on("focus",".area",function(){
    $(this).val($(this).attr("data-value"));
     $(this).css("z-index",2);
     $(this).txtaAutoHeight();
 });



$(document).on("click","#quick_add_setup",function () {
   $("#quickSetupModal").modal("show");
   dragula([document.getElementById("left-bag"), document.getElementById("right-bag")]);

   env=$("#env").val();
   $.ajax({
       type:"POST",
        url: "/get_base_casegroup", /*ajax请求地址*/
        cache: false,
        async: false,
        data:{env:env},
        success: function (data) {
                if (data == "fail") {
                    alert("保存失败。");
                    return false;
                }
                else {
                    var text="";

                    for(i = 0;i<data.length;i++){
                       text+='<div data-id="' + data[i].id + '" class="drag">' + data[i].name + '</div>';
                    }
                   $("#left-bag").empty().append(text);
                }
            }
        });
});

$(document).on("click","#quick_setup_sure",function () {
    var idList='';
    $("#right-bag").find(".drag").each(function (data,value) {
         id=value.dataset["id"];
         content=value.innerText;
       /*  $("#cg_setup_add_column").click();
         $(".type_info_select.dept_select").last().find('option[data-id=id]').attr("selected",true);
         $(".dept_select").last().val(content).trigger("chosen:updated");
         $(".dept_select").last().change();*/
       idList+=id+',';
    });

    url=window.location.href;
     window.location.href=url+"&case_group_ids="+idList;
    $("#quickSetupModal").modal("hide");
});


$(document).on("click","#quick_add_params",function () {
     var addtext="<ul><input type=\"text\" name=\"var_name\" value=\"\"/>:<input type=\"text\" name=\"var_value\" value=\"\"  style=\"width:300px\"/><a  id=\"var_row_del\" role=\"button\">×</a></ul>";
     var adddiv=$(this).closest("div");
     adddiv.append(addtext);
});

$(document).on("click","#var_row_del",function () {
     var oTr = $(this).closest('ul');
     oTr.remove();
});


