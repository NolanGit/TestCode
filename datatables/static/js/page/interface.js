/**
 * Created by yanghuihui on 2017/3/6.
 */
var index = 1;
var key_name = "";
var value_name = "";
var desc_name = "";
var method = 'POST';
var bool_new = true;
var global_interface_id  = 0;
var result_content = "";
//var array_results = new Array();
var result = {};
var global_interface_name = "";
var global_module_id = 0;

$(document).ready(function(){

//    $("li").click(function() {
//        $(this).addClass("active").siblings().removeClass("active");
////        get_interface_list();
//    });

    $(".pop").popover({
        trigger:'manual',//manual 触发方式
        delay: {show: 100, hide: 100},
        placement : 'bottom',
        /*   title : '<div style="text-align:center; color:red; text-decoration:underline; font-size:14px;"> 接口返回信息</div>', */
        title:'<div>接口返回信息</div>',
        html: 'false',
        content : function () {
//            return $("#data-content").html(); // 把content变成html
            return result_content
        },
//        content : result_content,
        animation: false
    });

    $('body').click(function (event) {
        var target = $(event.target);       // 判断自己当前点击的内容
        if (!target.hasClass('popover')
                && !target.hasClass('pop')
                && !target.hasClass('popover-content')
                && !target.hasClass('popover-title')
                && !target.hasClass('arrow')) {
            $('.pop').popover('hide');      // 当点击body的非弹出框相关的内容的时候，关闭所有popover
        }
    });

    $(".interface_list td").click(function(){
        global_interface_id = $(this).parent().find("td").index($(this)[0]);
	});

    $(".pop").click(function (event) {
        $('.pop').popover('hide');          // 当点击一个按钮的时候把其他的所有内容先关闭。
        var click_id = this.parentNode.parentNode.children[1].innerText;
        result_content = "";
        $.each(result, function(index, content) {
//			  	content = $.parseJSON(content);
            if (index == click_id) {
                result_content = "<pre style=\"font-size:15px;word-break:break-all;\" spellcheck=\"true\">" + content + "</pre>";
                return;
            }
        });
        $(this).popover('toggle');          // 然后只把自己打开。
    });

     $("#add_interface").click(function(){
        addInterface();
     });

    $('#modal_add').on('hide.bs.modal', function() {
    //      window.location.reload();
        document.getElementById("interface_params").reset();
        $("#params tr:not(:first)").remove();
        validator.resetForm();
    })

    $("#need_login").bind("click", function () {
        if ($("#need_login").is(':checked')) {
            $("#login_uid").show();
        } else {
            $("#login_uid").hide();
            $("#login_uid-error").html("");
        }
    });

    var validator = $("#interface_params").validate({
        errorElement: 'span',
//        focusCleanup: true,
        rules: {
            interface: {
                required: true,
                rangelength: [1,30],
                remote: {
                    url: '/check_interface_name',
                    type: 'post',
                    data: {

                        "interface": function () { return $("#interface_name").val(); },
                        "bool_new": function () { return bool_new; },
                        "ignore_name": function() { return global_interface_name; },
                        "module_id": function() { return global_module_id; }
//                        "module_id":getUrlParam('module_id')
                    }
                 }
            },
            add_api_url: {
                required:true
//                url:true
            },
            key:"required",
            login_uid:"required"
        },
        messages: {
            interface: {
                required: "接口名不能为空",
                rangelength: "接口名称要在{0}-{1}个字符之间！",
                remote: "接口名称已存在"
            },
            add_api_url: {
                required: "接口地址不能为空"
//                url: "输入的url格式不对"
            },
            key: "参数名不能为空",
            login_uid: "请输入登陆的uid"
        },
        submitHandler:function(){
            saveInterface();
            window.location.reload();
        }
    });
//    $("[name=key]").each(function(){$(this).rules("add", {  required: true,  messages: {required: "鍙傛暟鍚嶄笉鑳戒负绌?" }  });});

    $("#add").click(function(){
        addTbaleRow();
    });

    $("#add_header").click(function(){
        addHeaders();
    });

//    $("#save_interface").click(function(){
//        saveInterface();
//        window.location.reload();
//    });

    $('#method').bind('change', function(){
        method =  $("#method").find("option:selected").text();
        console.log(method);
    });



})


/*function get_interface_list() {
    var module_id = getUrlParam('module_id');
    href = '/interface_list?module_id='+module_id;
    window.location.href='/interface_list?module_id='+3;*/
//    $.ajax({
//        url: "/interface_list",
//        type: "get",
//        data: {"module_id":3},
//        dataType: 'html',
//		cache: false,
//		async: true,
//		beforeSend: function() {
//        	;
//    	}, //加载执行方法
//	    error: function(xhr, err) {
//        	alert('接口保存失败：' + err + '！')
//    	},  //错误执行方法
//	    complete: function(data) {
//	        console.log(data.responseText);
//	    }
//    });
//}

function addInterface() {
    bool_new = true;
    global_interface_name = '';
    $("#modalLabel").html("新建接口");
    $('#modal_add').modal('show');
}

function delParams(aObject) {
     var flag = window.confirm("确认刪除该行？");
         if(!flag){
          return false;
         } else {
          aObject.remove();
          return false;
         }
        return false;
}


function saveInterface() {
//    var module_id = getUrlParam('module_id');
    var id = bool_new ? "" : global_interface_id
    var url = $.trim($("#add_api_url").val());
    var need_login = $("#need_login").is(':checked') ? 1 : 0;
    var array_params = new Array();
    var trList = $("#params").children("tr")
    for (var i=0;i<trList.length;i++) {
        var tdArr = trList.eq(i).find("td");
        var key = $.trim(tdArr.eq(0).find("input").val());
        var value = $.trim(tdArr.eq(1).find("input").val());
        var desc = $.trim(tdArr.eq(2).find("input").val());
        var arr = {"key" : key, "value" : value, "desc" : desc};
        array_params.push(JSON.stringify(arr));
    }

    var array_headers = new Array();
    var headerList = $("#header_params").children("tr")
    for (var i=0;i<headerList.length;i++) {
        var tdArr = headerList.eq(i).find("td");
        var key = $.trim(tdArr.eq(0).find("input").val());
        var value = $.trim(tdArr.eq(1).find("input").val());
        var desc = $.trim(tdArr.eq(2).find("input").val());
        var arr = {"key" : key, "value" : value, "desc" : desc};
        array_headers.push(JSON.stringify(arr));
    }

    var name = $("#interface_name").val();
    var login_uid = $("#need_login").is(':checked') ? $("#login_uid").val() : "";
    $.ajax({
        type:"POST",
		url:"/save_interface",
		data: {"id":id, "module_id":global_module_id, "url":url, "need_login":need_login, "params":array_params, "name":name, "status":1, "method":method, "login_uid":login_uid, "headers":array_headers},
		dataType: 'json',
		cache: false,
		async: false,
		beforeSend: function() {
        	;
    	}, //加载执行方法
	    error: function(xhr, err) {
        	alert('接口保存失败：' + err + '！')
    	},  //错误执行方法
	    complete: function(data) {
	    	var str=data.responseJSON;
	    	console.log(str);
	    	if (0 != str["status"]) {
	    		alert("接口保存失败");
	    	}
	    }
    });
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function editInterface(module_id, interface_id) {
    bool_new = false;
    global_module_id = module_id;
    global_interface_id = interface_id;
//    var interface_id = $("#GridView1 tr td:first").text()
    $.ajax({
        type:"POST",
        url:"/edit_interface",
        data:{"interface_id":global_interface_id},
        dataType:'json',
        cache:false,
        async:false,
        beforeSend: function() {
        	;
    	}, //加载执行方法
	    error: function(xhr, err) {
        	alert('编辑接口失败：' + err + '！')
    	},  //错误执行方法
    	complete: function(data) {
    	    var str = data.responseJSON;
    	    global_interface_name = str["name"];
    	    console.log(str["name"]);
    	    $("#modalLabel").html("编辑接口");
    	    $("#interface_name").val(str["name"]);
    	    $("#method").val(str["method"]);
    	    if (str["need_login"]) {
    	        $("#need_login").prop("checked", true);
    	        $("#login_uid").val(str["login_uid"]);
    	        $("#login_uid").show();
    	    } else {
    	        $("#need_login").prop("checked", false);
    	        $("#login_uid").hide();
    	    }

    	    $("#add_api_url").val(str["url"]);
    	    var params = str["params"];
    	    params = $.parseJSON(params);
    	    $.each(params, function(index, content) {
			  	content = $.parseJSON(content);
			   	var key = content.key
			   	var value = content.value;
			   	var desc = content.desc;
			   	if (0 == index) {
			   		$("[name=key]").val(key);
			   		$("[name=value]").val(value);
			   		$("[name=desc]").val(desc);
			   	} else {
			   	    addTbaleRow(key, value, desc);
			   	}
			});

			var header = str["header"];
			if (typeof(exp) != "undefined" && header.length >= 1) {
			    headers = $.parseJSON(header);
                $.each(headers, function(index, content) {
                    content = $.parseJSON(content);
                    var key = content.key
                    var value = content.value;
                    var desc = content.desc;
                    if (0 == index) {
                        $("[name=header_key]").val(key);
                        $("[name=header_value]").val(value);
                        $("[name=header_desc]").val(desc);
                    } else {
                        addHeaders(key, value, desc);
                    }

                });
			}


			$('#modal_add').modal('show');
		}
    });
}

function addTbaleRow(key, value, desc) {
    var key = arguments[0] ? arguments[0] : "";
    var value = arguments[1] ? arguments[1] : "";
    var desc = arguments[2] ? arguments[2] : "";
    key_name = "key" + index;
    value_name = "value" + index;
    desc_name = "desc" + index;
    var $tr = $("<tr>" +
               "<td><input type='text' class='form-control' placeholder='key' name='" + key_name + "' value='" + key + "'></td>" +
               "<td><input type='text' class='form-control' placeholder='value' name='" + value_name + "' value='" + value + "'></td>" +
               "<td><input type='text' class='form-control' placeholder='desc' name='" + desc_name + "' value='" + desc + "'></td>" +
               "<td><a role='button'>x</a></td>" +
               "</tr>");
    console.log($tr);
    $("#params").append($tr);
    $tr.find("td:eq(3)").click(function(){return delParams($tr);});
    index += 1;
    $("[name^=key]").each(function(){
        $(this).rules("add", {
            required: true,
            messages: {
                required: "参数名不能为空"
            }
        });
    });
//    $("[name^=value]").each(function(){
//        $(this).rules("add", {
//            required: true,
//            messages: {
//                required: "参数值不能为空"
//            }
//        });
//    });
//    $("[name^=desc]").each(function(){
//        $(this).rules("add", {
//            required: true,
//            messages: {
//                required: "参数描述不能为空"
//            }
//        });
//    });

}


function addHeaders(key, value, desc) {
    var key = arguments[0] ? arguments[0] : "";
    var value = arguments[1] ? arguments[1] : "";
    var desc = arguments[2] ? arguments[2] : "";
    key_name = "header_key" + index;
    value_name = "header_value" + index;
    desc_name = "header_desc" + index;
    var $tr = $("<tr>" +
               "<td><input type='text' class='form-control' placeholder='key' name='" + key_name + "' value='" + key + "'></td>" +
               "<td><input type='text' class='form-control' placeholder='value' name='" + value_name + "' value='" + value + "'></td>" +
               "<td><input type='text' class='form-control' placeholder='desc' name='" + desc_name + "' value='" + desc + "'></td>" +
               "<td><a role='button'>x</a></td>" +
               "</tr>");
    console.log($tr);
    $("#header_params").append($tr);
    $tr.find("td:eq(3)").click(function(){return delParams($tr);});
    index += 1;
}


function delConfirm(id) {
    global_interface_id = id
    $('#del_confirm').modal('show');
}

function delInterface() {
//    interface_id = $("#row_id").parent().children().eq(1).html();
    $.ajax({
        type:"post",
        url:"/del_interface",
        data:{"interface_id":global_interface_id},
        dataType:'json',
        cache:false,
        async:true,
        beforeSend: function() {
        	;
    	}, //加载执行方法
	    error: function(xhr, err) {
        	alert('删除接口失败：' + err + '！')
    	},  //错误执行方法
    	complete: function(data) {
    	    window.location.reload();
    	}
    });
}

function copyInterface(id) {
//    前端动态添加
//    var table = $('#interface_list').DataTable();
//    var td_option = '<input  type=\'checkbox\' />';
//    var td_name = '<a class="btn btn-link" role="button"  href="/case_group_list?module_id={{ module_id}}&interface_id={{ row.id }}">dabing</a>'
//    var td_operate =
//        '<a class="btn btn-link" role="button" onclick="return editInterface({{ row.id }});">编辑</a>' +
//        '<a class="btn btn-link" role="button" onclick="return delConfirm({{ row.id }});">删除</a>' +
//        '<button type="button" class="btn btn-default btn-sm" onclick="return copyInterface({{ row.id }})"><span class="glyphicon glyphicon-copy"></span> 复制</button>' +
//        '<button type="button" class="btn btn-default btn-sm" onclick="return runTest({{ row.id }})"><span class="glyphicon glyphicon-play"></span> 运行</button>' +
//        '<button type="button" data-interfaceid="{{ row.id }}" class="btn btn-default btn-sm pop" data-container="body">结果</button>';
//    table.row.add([td_option, td_name, "dabing", "POST", td_operate]).draw();

    $.ajax({
        type:"post",
        url:"/copy_interface/" + id,
        dataType:'json',
        cache:false,
        async:true,
        beforeSend: function() {
        	;
    	}, //加载执行方法
	    error: function(xhr, err) {
        	alert('复制接口失败：' + err + '！')
    	},  //错误执行方法
    	complete: function(data) {
    	    var data = data.responseJSON;
    	    if(0 == data["status"]) {
    	        window.location.reload();
    	    }
    	}
    });
}


function runTest(id) {
    var env = $("#env").val();
    $.ajax({
        type:"POST",
        url:"/run_test",
        data:{
            "interface_id":id,
            "env":env
        },
        cache:false,
        async:true,
        beforeSend: function() {
            ;
        },//加载执行方法
        error: function(xhr, err) {
            alert('运行接口失败：' + err + '！')
        },//错误执行方法
        complete: function(data) {
            var json_obj = data.responseJSON;
            console.log(json_obj);
//            var result = {"interface_id":id, "info":json_obj};
            result[id] = json_obj
            console.log(result);
            alert('接口运行成功,点击结果查看运行结果！')
//            array_results.push(JSON.stringify(result));
        }
    });
}

