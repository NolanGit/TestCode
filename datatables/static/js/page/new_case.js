$(document).ready(function(){
    $(".dept_select").chosen({
        no_results_text: "接口不存在.",//搜索不到内容时，显示的提示语
        placeholder_text : "请选择.",  //下拉选项默认显示的文字
        search_contains: true,  //chosen搜索选项的中间及末尾字符
        disable_search_threshold: 10 //select的option选项大于等于此值，才会显示查询的文本框
    });

    var validator = $("#cg_add_form").validate({
        errorElement: 'span',
        rules: {
            case_name: {
                required: true,
                rangelength:[1,70]
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
            $("#savetype").val(-1);
            saveCase();
        }
    });
})

function saveCase(){
    var interface_id = $("#c_interface_list option:selected").attr("data-id");
    var case_name = $.trim($("#case_name").val());
    var case_desc = $.trim($("#case_desc").val());
    var group_id = $("#c_case_group_list option:selected").attr("data-id");
    var module_id = get_module_id()
    var case_id = getUrlParam('case_id');
    var savetype=$("#savetype").val();
    if (case_id == null){
        case_id = 0;
    }
    var test_interface_id = $("#c_test_select option:selected").attr("data-id");
    var array_params = new Array();
    if(test_interface_id != 0){
        var trList = $("#c_interface_params tbody").children("tr")
        for (var i=0; i<trList.length; i++) {
            var tdArr = trList.eq(i).find("td");
            var key = tdArr.eq(0).find("input").val();
            var value = tdArr.eq(1).find("textarea").attr("data-value");
            var opt_key = tdArr.eq(2).find("label").attr("data-id");
            var opt_name = tdArr.eq(2).find("label").attr("data-value");
            var opt = {"type":opt_key,"name":opt_name}
            var arr = {"key" : key, "value" : value,"opt":opt};
            array_params.push(JSON.stringify(arr));
        }
    }

    //var res_assert = $.trim($("input[name='resonse_info']").val());
    //change by liujiaqi
    var res_assert = new Array();
    $('.res-check').each(function(i,n){
        var keyword = $.trim($(this).find('input').val());
        res_assert.push({
        "keyword":keyword
        });
    })

    var sql_assert = new Array();
    $('.sql-check').each(function(i, n){
        var sql_id = $(this).find('select option:selected').attr('data-id');
        var keyword = $.trim($(this).find('textarea').val());
        sql_assert.push({
            "sql_id":sql_id,
            "keyword":keyword
        });
    })
    var log_assert = new Array();
    $('.log-check').each(function(i, n){
        var log_id = $(this).find('select option:selected').attr('data-id');
        var log_check_points = Array();
        var check_points_divs = $(this).children("div");
        $(check_points_divs).each(function(index,value){
            var keyword = $.trim($(this).find('input').val());
            log_check_points.push(keyword)
            console.log(log_check_points)
        });
        log_assert.push({
            "log_id":log_id,
            "keyword":log_check_points
        });
    })
    console.log(log_assert);
    var res_type=$("input[name='res_checktype']:checked").val();
    var logcheck_type=$("input[name='log_checktype']:checked").val();
    var schema_assert=$("#select_jsonschema option:selected").val();
    var check_point = {"res":res_assert, "sql":sql_assert, "log":log_assert,"type":res_type,"schema":schema_assert,"logtype":logcheck_type};//0905 changed by liujiaqi

    $.ajax({
            url: "/save_case",
            type: "post",
            data: {
                "module_id":module_id,
                "interface_id":interface_id,
                "case_name":case_name,
                "group_id":group_id,
                "array_params":array_params,
                "check_point":JSON.stringify(check_point),
                "case_id":case_id,
                "case_desc":case_desc
            },
            cache: false,
            async: false,
            success: function (data) {
                 if (data == "fail") {
                    alert("保存失败。");
                    return false;
                }
                else{
                     if(savetype==-1){
                         go_to('/case_list',module_id,interface_id,group_id)
                     }
                 }
            }
        });
}
/**
 * 下拉框，变更接口时，同步变更对应的用例组下拉框
 */
$(document).on('change','#c_interface_list',function(){
    var interface_id = $("#c_interface_list option:selected").attr("data-id");
    var interface_name = $("#c_interface_list option:selected").val();
    $("#c_case_group_list").empty()
    $("#c_case_group_list").append("<option  data-id=0>  请选择</option>");
    $.ajax({
        url: "/get_cg_list_by_interface_id",
        type: "get",
        data: {
            "interface_id": interface_id
        },
        cache: false,
        async: false,
        success: function (data) {
            if (data == "fail") {
                alert("获取组信息失败");
                return false;
            }
            else {
                for (var i = 0; i < data.length; i++) {
                    var name = data[i].name;
                    var group_id = data[i].id;
                    $("#c_case_group_list").append("<option  data-id=\"" + group_id + "\">" + name + "</option>");
                }
            }
        }
    });

    //test下拉框随着选择的接口，变化接口的名称
    $("#c_test_select").empty();
    $("#c_test_select").append("<option  data-id=0>  请选择</option>");
    if (interface_id != 0){
        $("#c_test_select").append("<option  data-id=\"" + interface_id + "\">" + interface_name + "</option>");
    }

});

/**
 * 选择接口，显示对应的参数
 */
$(document).on('change','#c_test_select',function(){
    var table_params = $("#c_interface_params");
    $("#c_interface_params tbody").empty();
    var interface_id = $("#c_test_select option:selected").attr("data-id");
    if (interface_id != 0) {
        $.ajax({
            url: "/get_interface_params",
            type: "get",
            data: {
                "interface_id": interface_id
            },
            cache: false,
            async: false,
            success: function (data) {
                if (data == "fail") {
                    alert("获取接口参数信息失败!");
                    return false;
                }
                else {
                    var params = data.params_info;
                    for (i = 0; i < params.length; i++) {
                        var tr_html = '<tr>' +
                            '<td><input type="text" value="' + params[i].key + '" disabled></td>' +
                            '<td><textarea  class="area" style="width:400px" initAttrH="30" data-value=\'' + params[i].value + '\' >' + params[i].value + '</textarea></td>' +
                            '<td ><label data-id="1" data-value="" class="opt_label_class">无' +
                                '<a class="btn" id="opt_select"><span id="" class="glyphicon glyphicon-pencil"></span></a>' +
                                '</label>' +
                            '</td>'+
                            '<td><a  id="c_params_del" role="button">×</a></td>' +
                            '</tr>';
                        table_params.append(tr_html);
                    }
                   // $("#c_res_div").children("input").removeAttr("disabled");
                }
            }
        });
    }
    else{
      //  $("#c_res_div").children("input").attr("value",'');
      //  $("#c_res_div").children("input").attr("placeholder",'请输入接口返回检查内容');
      //  $("#c_res_div").children("input").attr("disabled","disabled");
    }
});

/**
 * 点击+号，接口返回检查点增加一行，liujiaqi
 */
$(document).on('click','#c_add_res_check',function(){
    var $div_element = '<div class="form-inline res-check" style="margin-top:5px;"> ' +
        '<input  type="text" class=" case_input" placeholder="请输入接口返回检查内容..."> ' +
        '<a class="c_del" role="button" class="btn btn-primary">×</a> ' +
        '</div>';
    $("#div_res").append($div_element)
});

/**
 * 点击+号，接口返回检查jsonschema点增加一行，liujiaqi   0905
 */
$(document).on('click','#c_add_res_check_jsonschema',function(){
    //var schema_infos = get_schema_check_list()
    var select_element = '<select  id="select_jsonschema"  name="select_jsonschema" class="form-control " style="margin-left:5px;"> ';
    select_element += '<option selected value="jsonschema" >jsonschema</option>';
    select_element +=  '</select>'
    var $div_element = '<div class="form-inline jsonschema-check" style="margin-top:5px;"> ' +
        select_element +
        '</br>' +
        '<a class="c_del" role="button" class="btn btn-primary">×</a> ' +
        '</div>';
    $("#div_res_jsonschema").empty().append($div_element)
});

/**
 * 点击+号，sql检查点增加一行
 */
$(document).on('click','#c_add_sql_check',function(){
    var sql_infos = get_sql_check_list()
    var select_element = '<select name="select_sql" class="form-control " style="margin-left:5px;"> ';
    $.each($.parseJSON(sql_infos), function(index, item){
        select_element += '<option data-id=' + item.id + '>' + item.name + '</option>';
    });
    select_element +=  '</select>'
    var $div_element = '<div class="form-inline sql-check" style="margin-top:5px;"> ' +
        select_element +
        '</br><textarea type="text" type="text" class="form-control " rows="3" cols="150" placeholder="请输入检查点数据库信息..."></textarea> ' +
        '<a class="c_del" role="button" class="btn btn-primary">×</a> ' +
        '</div>';
    $("#div_sql").append($div_element)
});

/**
 * 点击×删除一行
 */
$(document).on('click','.c_del',function(){
    $(this).parent("div").remove();
});

/**
 * test参数列表，点击×删除一行
 */
$(document).on('click','#c_params_del',function(){
    $(this).closest('tr').remove();
})


/**
 * 点击+号，log检查点增加一行
 */
$(document).on('click','#c_add_log_check',function(){
    var log_infos = get_log_check_list();
    var select_element = '<select name="select_log" class="form-control logcheck" style="margin-left:5px;"> ';
    $.each($.parseJSON(log_infos), function(index, item){
        select_element += '<option data-id=' + item.id + '>' + item.name + '</option>';
    });
    select_element +=  '</select>'
    var $div_element = '<div class="form-inline log-check" style="margin-top:5px;"> ' +
        select_element +
        '<a class="btn"  id="c_add_log_check_point"><span class="glyphicon glyphicon-plus"></span></a>' +
        '<a class="c_del" role="button" class="btn btn-primary">×</a> '+
        '</br>' +
        '<div style="margin-left:80px;">' +
        '<input type="text" class=" case_input" placeholder="请输入检查点日志信息..."> ' +
        '<a class="c_del" role="button" class="btn btn-primary">×</a>' +
        '</br>' +
        '</div> ' +
        '</div>';
    $("#div_log").append($div_element)
});

/**
 * 点击文件输出类型后面的加号，新增一行输入项
 */
$(document).on('click','#c_add_log_check_point',function(){
    var div_element = '<div style="margin-left:80px;">' +
        '<input type="text" class=" case_input" placeholder="请输入检查点日志信息...">' +
        '<a class="c_del" role="button" class="btn btn-primary">×</a>' +
        '</br>' +
        '</div> '
    $(this).parent("div").append(div_element)
});

/**
 * 点击新建用例的取消的方法
 */
$(document).on('click','#cg_cancel',function() {
    var interface_id = get_interface_id()
    var module_id = get_module_id()
    var case_group_id = get_case_group_id()
    go_to('/case_list',module_id,interface_id,case_group_id)
});

/**
 * 鼠标悬浮时，显示浮层
 * @param obj
 * @param id
 */
function show(obj,id) {
    var objDiv = $("#"+id+"");
    $(objDiv).css("position", "absolute");//让这个层可以绝对定位
    $(objDiv).css({"display":"block"});
    /*$(objDiv).css("left", event.clientX   + "px");
    $(objDiv).css("top", event.clientY +10  + "px");*/
    var p = $(objDiv).position(); //获取这个元素的left和top
    var x = p.left + self.width();//获取这个浮动层的left
    var docWidth = $(document).width();//获取网页的宽
    if (x > docWidth - div.width() - 20) {
        x = p.left - div.width();
    }
        div.css("left", x);
        div.css("top", p.top);
}
/**
 * 鼠标离开时，不显示浮层
 * @param obj
 * @param id
 */
function hide(obj,id) {
    var objDiv = $("#"+id+"");
    $(objDiv).css({"display":"none"});
}


/**
 * 点击opt下面的编辑时，弹出选择操作框
 */
$(document).on('click','#opt_select',function(){
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
    $("#edit_opt").attr('data-id',tr_num);
    $("#edit_opt").modal('show');
});

function opt_select_ok(){
    var tr_num = $("#edit_opt").attr("data-id") - 1;
    var encode_id = 0
    var label_obj = $("#params tr:eq(" + tr_num + ") td:eq(2) label");
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



/**
 * 校验信息
 *
 */
$(document).on('click','#cg_checkdata',function() {
    /*获取当前用例id*/
     var case_id = getUrlParam('case_id');
     var idList=new Array();
     idList[0]=case_id;
     var env = get_env();

     if(case_id==null){
          var info_fail="<div class=\"alert alert-warning\" role=\"alert\">"+"请先补充用例"+"</div>";
                $("#check_result").empty().append(info_fail);
    }else{
         $("#savetype").val(1);
         saveCase();
        $.ajax({
        type: "POST",
        url: "/run_case_check", /*ajax请求地址*/
        cache: false,
        async: true,
        data: {
            "module_id": get_module_id(),
            "case_id_list":idList,
            "env":env,
            "type":1
        },
        success: function (data) {
            if(data.errno=="ok"){
                var info_ok="<div class=\"alert alert-success\" role=\"alert\">验证通过</div>";
                $("#check_result").empty().append(info_ok);
            }else{
                var info_fail="<div class=\"alert alert-warning\" role=\"alert\">"+data.data+"</div>";
                $("#check_result").empty().append(info_fail);
            }
            }
        });
    }

});



$(document).on("change",".form-control.logcheck",function () {
    var log_id = $(this).find('option:selected').attr('data-id');
    if((log_id=="17")|| (log_id=="2")){
        msginfos=get_msg_info();
        msgjson=$.parseJSON(msginfos);
        var select_element = '<select name="msg_log" class="form-control msg-log" style="margin-left:5px;"> ';
        for(var msg in msgjson){
             select_element += '<option data-id=' + msg + '>' + msgjson[msg] + '</option>';
        }
        select_element +=  '</select><select name="msg_log" class="form-control level-log" style="margin-left:5px;"><option data-id=\' + msg + \'></option></select>'
        if( $(this).closest("div").find(".form-control.msg-log")==null){
            $(this).after(select_element);
        }else{
            $(this).closest("div").find(".form-control.msg-log").remove();
            $(this).closest("div").find(".form-control.level-log").remove();
            $(this).closest("div").find(".case_input").eq(0).val("");
             $(this).after(select_element);
        }

    }else{
            $(this).closest("div").find(".form-control.msg-log").remove();
            $(this).closest("div").find(".form-control.level-log").remove();
            $(this).closest("div").find(".case_input").eq(0).val("");

    }
});

$(document).on("change",".form-control.msg-log",function () {
    var log_id = $(this).find('option:selected').attr('data-id');
    var log_pid=$(this).closest("div").find(".form-control.logcheck option:selected").attr('data-id');
    levelinfos="";
    if(log_pid=="17"){
        levelinfos=get_level_info();
    }else{
        levelinfos=get_level_info2();
    }
    leveljson=$.parseJSON(levelinfos);
    levellist=leveljson[log_id];

    var select_element = '';
    for(var level in levellist){
         select_element += '<option data-id=' +levellist[level] + '>' + levellist[level]+ '</option>';
    }
    $(this).closest("div").find(".form-control.level-log").empty().append(select_element);

});


$(document).on("change",".form-control.level-log",function () {
    var selecttype = $(this).find('option:selected').attr('data-id');
    var text= $(this).closest("div").find(".case_input").eq(0);
    var log_pid=$(this).closest("div").find(".form-control.logcheck option:selected").attr('data-id');
    if(log_pid=="17"){
                $.ajax({
                    type: "POST",
                    url: "/get_case_msg", /*ajax请求地址*/
                    cache: false,
                    async: true,
                    data: {
                        "msgtype":selecttype
                    },
                    success: function (data) {
                        if(data.errno=="ok"){
                            var datastr=JSON.stringify(data.data);
                          text.val(datastr);
                        }else{
                            alert("fail");
                        }
                    }
            });
    }else{
            $.ajax({
            type: "POST",
            url: "/get_kafka_msg", /*ajax请求地址*/
            cache: false,
            async: true,
            data: {
                "msgtype":selecttype
            },
            success: function (data) {
                if(data.errno=="ok"){
                    var datastr=JSON.stringify(data.data);
                  text.val(datastr);
                }else{
                    alert("fail");
                }
            }
        });
    }

});