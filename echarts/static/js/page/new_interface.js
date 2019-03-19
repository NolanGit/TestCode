/**
 * Created by yanghuihui on 2017/3/28.
 */


$().ready(function() {

    $('#myTab a').click(function (e) {
        e.preventDefault();//阻止a链接的跳转行为
        $(this).tab('show');//显示当前选中的链接及关联的content
    });

    $("#interface_add_form").validate({
        errorElement: 'span',
        rules: {
            interface_name:{
                required:true,
                rangelength:[1,200]
            },
            interface_url:{
                required:true,
                rangelength:[1,1024]
            }
        },
        messages: {
            interface_name: {
                required:"请输入接口名称",
                rangelength:"接口名称在200个字符以内"
            },
            interface_url: {
                required:"请输入URL",
                rangelength:"接口名称在1024个字符以内"
            }
        },
        submitHandler:function(){
			//interface_save();
        }
    });

    //$("#interface_url").keyup(function(){return updateParams();});
});



/**
 * 修改url key-value参数，动态更新url输入框内容
 */
function updateUrl() {
    var method =    $("#method").find("option:selected").text();
    if(method == 'GET'){
        var sum_value = '';
        var trList = $("#params").children("tr")
        for (var i=0; i<trList.length; i++) {
            var tdArr = trList.eq(i).find("td");
            var select = tdArr.eq(0).find("input").is(':checked') ? 1 : 0;
            if(select == 1){
                var key = $.trim(tdArr.eq(1).find("textarea").val());
                if(key != ''){
                    sum_value += key;
                    var value = $.trim(tdArr.eq(2).find("textarea").val());
                    if('' != value) {
                        sum_value += '=';
                        sum_value += value;
                    }
                    sum_value += '&';
                }
            }
        }
        if (sum_value.length > 1)
            sum_value = sum_value.substring(0, sum_value.length-1);
        var tmp = '';
        if('' != $("#interface_url").val()){
            tmp = $("#interface_url").val()
            if(tmp.indexOf("?")>=0)
                tmp = tmp.split("?")[0];
        }
        tmp = ('' == sum_value) ? tmp : (tmp + '?' + sum_value);
        $("#interface_url").val(tmp);
    }

}


/**
 * 修改url参数，动态更新key-value参数
 */
$(document).on('click','#get_params',function(){
// function updateParams(){
    var method = $("#method").find("option:selected").text();
    if(method == 'GET'){
        var url = $("#interface_url").val();
        var params = '';
        if(url.indexOf("?") >= 0){
            var start = url.indexOf("?");
            var end = url.length;
            params = url.substr(start + 1, end);
        }
        var paramsArr = params.split("&");
        $("#body table tr:not(:first)").remove();
        var oTable = $("#body table");
        $.each(paramsArr, function(index, item){
            var tmp = $.trim(item);
            if('' != tmp){
                var tmpArr = tmp.split('=');
                var key = tmpArr[0]
                var value = typeof(tmpArr[1]) == "undefined" ? '' : tmpArr[1];
                var oTr = '<tr><td ><input type="checkbox" id="select" checked="" style="zoom:180%;"></td>' +
                    '<td ><textarea name="key" class="area" style="width:18%;" initAttrH="30" data-value="' + key + '">' + key + '</textarea> +  </td>' +
                '<td ><textarea name="value" class="area" style="width:34%;" initAttrH="30" data-value="' + value + '">"' + value + '</textarea> </td>' +
                '<td ><input type="checkbox" id="encode" style="zoom:180%;"></td>' +
                '<td ><textarea name="desc" class="area" style="width:26%;" initAttrH="30" placeholder="desc"></td>' +
                '<td><a role="button">×</a></td>' +
                '</tr>'
                oTable.append(oTr);
            }
        });
    }
 });


/**
 * body table 末行有input自增一行
 */
$(document).on('keyup','#body table tbody td textarea',function(e){
    var oTable = $("#body table");
    var eEle = '';
    var target = e.target,
    oTr = $(target).closest('tr');
    if(oTr.index() == oTable.find('tr').last().index())
    {
        eEle = oTr.clone();
        eEle.find("td textarea").val('');
        eEle.find("td textarea").css("z-index",1);
        eEle.find("td textarea").css("height","30px");
        eEle.find("label").attr("data-id",1);
        eEle.find("label").attr("data-value","");
        eEle.find("label").html('无<a class="btn" id="opt_select"><span id="" class="glyphicon glyphicon-pencil"></span></a>');
    }
    oTable.append(eEle);
    var $tr = $("#body table tbody tr");
    $tr.find("td:eq(0)").keyup(function(){return updateUrl();});
    $tr.find("td:eq(1)").keyup(function(){return updateUrl();});
});

/**
 * header table 末行有input自增一行
 */
$(document).on('keyup','#headers table tbody td textarea',function(e){
    var oTable = $("#headers table");
    var eEle = '';
    var target = e.target,
    oTr = $(target).closest('tr');
    if(oTr.index() == oTable.find('tr').last().index())
    {
        eEle = oTr.clone();
        eEle.find("td textarea").val('');
        eEle.find("td textarea").css("z-index",1)
    }
    oTable.append(eEle);
});

/**
 * body table中，点击×删除一行
 */
$(document).on('click','#body_row_del',function(){
    var oTable = $("#body table tbody");
    var oTr = $(this).closest('tr');
    del_row(oTable,oTr)
    updateUrl();
});

/**
 * header table中，点击×删除一行,仅剩一行时，仅清空数据，不删除
 */
$(document).on('click','#headers_row_del',function(){
    var oTable = $("#headers table tbody");
    var oTr = $(this).closest('tr');
    del_row(oTable,oTr)
});

function del_row(oTable,oTr){
    if(oTable.find('tr').length == 1){
        oTr.find("td textarea").val('')
    }
    else{
        oTr.remove();
    }
}

/**
 * need login选择，显示uid输入框
 */
$(document).on('click','#need_login',function(){
    if ($("#need_login").is(':checked')) {
        $("#login_uid").show();
    } else {
        $("#login_uid").hide();
        $("#login_uid-error").html("");
    }
});


function isJsonString(str) {
        try {
            if (typeof JSON.parse(str) == "object") {
                return true;
            }
        } catch(e) {
        }
        return false;
    }

/**
 * 点击Send按钮，发送请求，并显示结果
 */
$(document).on('click','#interface_send',function(){
    var env =  $("#env").val();
    var url = $.trim($("#interface_url").val());
    var need_login_id = $("#need_login").is(':checked') ? 1 : 0;
    var login_uid = $("#need_login").is(':checked') ? $.trim($("#login_uid").val()) : "";
    var method =  $("#method").find("option:selected").text();
    var content_type = get_content_type();
    var array_params = new Array();
    if(content_type.substring(0,1) == '2'){
        array_params = $.trim($("#body_raw_input").val());
    }
    else{
        var trList = $("#params").children("tr")
        for (var i=0;i<trList.length;i++) {
            var tdArr = trList.eq(i).find("td");
            var select = tdArr.eq(0).find("input").is(':checked') ? 1 : 0;
            if(select == 1){
                var key = $.trim(tdArr.eq(1).find("textarea").attr("data-value"));
                var value = $.trim(tdArr.eq(2).find("textarea").attr("data-value"));
                var opt_key = tdArr.eq(3).find("label").attr("data-id");
                var opt_name = tdArr.eq(3).find("label").attr("data-value");
                var opt = {"type":opt_key,"name":opt_name}
                var arr = {"key" : key, "value" : value, "opt":opt};
                array_params.push(JSON.stringify(arr));
            }
        }
    }


    var array_headers = new Array();
    var headerList = $("#header_params").children("tr")
    for (var i=0;i<headerList.length;i++) {
        var tdArr = headerList.eq(i).find("td");
        var select = tdArr.eq(0).find("input").is(':checked') ? 1 : 0;
        if(select == 1){
            var key = $.trim(tdArr.eq(1).find("textarea").attr("data-value"));
            var value = $.trim(tdArr.eq(2).find("textarea").attr("data-value"));
            var arr = {"key" : key, "value" : value};
            array_headers.push(JSON.stringify(arr));
        }
    }

    $.ajax({
        type: "POST",
        url: "/run_interface", /*ajax请求地址*/
        cache: false,
        async: false,
        //dataType: "json",
        data: {
            "url": url,
            "need_login":need_login_id,
            "login_uid":login_uid,
            "method":method,
            "content_type":content_type,
            "params":array_params,
            "headers":array_headers,
            "env":env
        },
        success: function (data) {
            if (data == "fail") {
                alert("保存失败。");
                return false;
            }
            else {
                datacontent=data.content;
                if(isJsonString(datacontent)){
                     var rdata =jQuery.parseJSON(datacontent);
                     var json_str = formatJson(rdata)
                    $("#result").html( json_str);
                     $("#status").html(data.status);
                     $("#time").html(data.time);
                }else{
                     $("#result").html(datacontent);
                     $("#status").html(data.status);
                     $("#time").html(data.time);
                }

               /*if(data.match("^\{(.+:.+,*){1,}\}$")){
                    var rdata = jQuery.parseJSON(data);
                    /!*var json_str = formatJson(data)
                    //$("#result_type").find("option[value = 'json']").attr("selected","selected");
                    $("#result").html( json_str);*!/
                    $("#result").html( rdata.content);
                    $("#status").html(rdata.status);
                    $("#time").html(rdata.time);
                }
                else{
                    //string
                    //$("#result_type").find("option[value = 'html']").attr("selected","selected");
                    $("#result").text(data).html();
                }*/

            }
        }
    })

});

/**
 * 获取当前接口设置的content_type字段值
 */
function get_content_type(){
    var content_type = $("input[name='content_type']:checked").val();
    if(content_type == '2'){
        var raw_type = $("#raw_type").val();
        content_type = raw_type;
    }
    return content_type;
}

$(document).on('click','#interface_save',function() {
    var dataset_name = $('input:radio[name=dataset]:checked').attr("data-name");
    if (dataset_name != undefined)
        $("#save_info").html('接口参数信息将保存到数据集:' + dataset_name + '中！')
    else
        $("#save_info").html('接口参数信息将保存到默认数据集中！')
    $('#save_confirm').modal('show');

})

/**
 * 接口保存的方法
 */
function interface_save(){
    var module_id = get_module_id()
    var interface_id = getUrlParam('interface_id');
    if (interface_id == null){
        interface_id = 0;
    }
    var env =  $("#env").val();
    var inter_name =  $("#interface_name").val();
    var inter_desc =  $("#interface_desc").val();
    var interface_priority =  $("#interface_priority").val();
    var url = $.trim($("#interface_url").val());
    var need_login_id = $("#need_login").is(':checked') ? 1 : 0;
    var login_uid = $("#need_login").is(':checked') ? $.trim($("#login_uid").val()) : "";
    var method =  $("#method").find("option:selected").text();
    var content_type = get_content_type();
    var array_params = new Array();
    var dataset_id = $('input:radio[name="dataset"]:checked').val();
    if(content_type.substring(0,1) == '2'){
        array_params = $.trim($("#body_raw_input").val());
    }
    else{
        var trList = $("#params").children("tr")
        for (var i=0;i<trList.length;i++) {
            var tdArr = trList.eq(i).find("td");
            var key = $.trim(tdArr.eq(1).find("textarea").attr("data-value"));

            if(key != ''){
                var select = 1;
                var value = $.trim(tdArr.eq(2).find("textarea").attr("data-value"));
                var opt_key = tdArr.eq(3).find("label").attr("data-id");
                var opt_name = tdArr.eq(3).find("label").attr("data-value");
                var opt = {"type":opt_key,"name":opt_name}
                var desc = $.trim(tdArr.eq(4).find("textarea").attr("data-value"));
                var arr = {"select" : select, "key" : key, "value" : value, "opt":opt,"desc" : desc};
                array_params.push(JSON.stringify(arr));
            }
        }
    }
    var array_headers = new Array();
    var headerList = $("#header_params").children("tr")
    for (var i=0;i<headerList.length;i++) {
        var tdArr = headerList.eq(i).find("td");
        var key = $.trim(tdArr.eq(1).find("textarea").attr("data-value"));
        if(key != ''){
            var select = 1;
            var value = $.trim(tdArr.eq(2).find("textarea").attr("data-value"));
            var desc = $.trim(tdArr.eq(3).find("textarea").attr("data-value"));
            var arr = {"select" : select, "key" : key, "value" : value, "desc" : desc};
            array_headers.push(JSON.stringify(arr));
        }
    }

    $.ajax({
        type: "POST",
        url: "/save_interface", /*ajax请求地址*/
        cache: true,
        async: true,
        data: {
            "module_id":module_id,
            "interface_id":interface_id,
            "name":inter_name,
            "desc":inter_desc,
            "interface_priority":interface_priority,
            "url": url,
            "need_login":need_login_id,
            "login_uid":login_uid,
            "method":method,
            "params":array_params,
            "headers":array_headers,
            "env":env,
            "dataset_id":dataset_id,
            "content_type":content_type
        },
        success: function (data) {
            if (data == "fail") {
                alert("保存失败,请重试");
                return false;
            }
            else{
                //go_to('/interface_list',module_id)
                alert("保存成功!");
                return true;
            }
        }
    })
}


/**
 * body div下点击bulk-edit，切换到bulk编辑模式
 */
$(document).on('click','#body_bulk_edit_button',function(){
    var array_params = ""
    var trList = $("#params").children("tr")
    for (var i=0;i<trList.length;i++) {
        var tdArr = trList.eq(i).find("td");
        var key = $.trim(tdArr.eq(1).find("textarea").val());
        if(key != ''){
            var value = $.trim(tdArr.eq(2).find("textarea").val());
            var arr = { key: value};
            array_params +=  key + ":" + value +"\n"
        }
    }
    $("#body_key_value").css({"display":"none"});
    $("#body_bulk").css({"display":"block"});
    $("#body_bulk textarea").val(array_params)
});

/**
 * header div下点击bulk-edit，切换到bulk编辑模式
 */
$(document).on('click','#header_bulk_edit_button',function(){
    var array_params = ""
    var trList = $("#header_params").children("tr")
    for (var i=0;i<trList.length;i++) {
        var tdArr = trList.eq(i).find("td");
        var key = $.trim(tdArr.eq(1).find("textarea").val());
        if(key != ''){
            var value = $.trim(tdArr.eq(2).find("textarea").val());
            var arr = { key: value};
            array_params +=  key + ":" + value +"\n"
        }
    }
    $("#header_key_value").css({"display":"none"});
    $("#headers_bulk").css({"display":"block"});
    $("#headers_bulk textarea").val(array_params)
});




/**
 * body div下点击key-value-edit，切换到key-value编辑模式
 */
$(document).on('click','#body_key_value_edit_button',function(){
    //$("#body table tbody").html("")
    var oTable = $("#params")
    var area_text = $.trim($("#body_bulk textarea").val())
    $("#body_key_value").css({"display":"block"});
    $("#body_bulk").css({"display":"none"});
    change_to_key_value("params",oTable,area_text)

});

/**
 * header div 下点击key-value-edit，切换到key-value编辑模式
 */
$(document).on('click','#header_key_value_edit_button',function(){
    var oTable = $("#header_params")
    var area_text = $.trim($("#headers_bulk textarea").val())
    $("#header_key_value").css({"display":"block"});
    $("#headers_bulk").css({"display":"none"});
    change_to_key_value("header_params",oTable,area_text)
});



function change_to_key_value(tbody_id,oTable,area_text){
    if (area_text != ''){
        var params_list = area_text.split('\n')
        var trList = oTable.children("tr")
        var max_num = 0;
        $.each(params_list,function(n,params){
            max_num = n;
            var key = '';
            var value = '';
            if($.trim(params) != ''){
                //如果包含:，需要特殊处理
                if(FindCount(params,':') > 1){
                    var first_index = params.indexOf(':');
                    key = params.substring(0,first_index);
                    value = params.substr(first_index+1);
                }
                else{
                    var tmp_list = params.split(':')
                    key = tmp_list[0]
                    value = tmp_list[1]
                }
                //填充到原来的tbody中去
                var tdArr = trList.eq(n).find("td");
                if(tdArr.length > 0){
                    tdArr.eq(1).find("textarea").val(key);
                    tdArr.eq(2).find("textarea").val(value);
                    tdArr.eq(1).find("textarea").attr("data-value",key);//val(key);  //充值key的值
                    tdArr.eq(2).find("textarea").attr("data-value",value);//val(value);  //充值value的值
                }
                else{
                    if (tbody_id == "header_params"){
                        var oTr = '<tr>' +
                        '<td ><input type="checkbox"  id="select" style="zoom:180%;"></td>' +
                        '<td ><textarea name="key" class="area" style="width:26%;" initAttrH="30" data-value="' + key + '">' + key + '</textarea></td>' +
                        '<td ><textarea name="value" class="area" style="width:26%;" initAttrH="30" data-value="' + value + '">' + value + '</textarea></td>' +
                        '</td>' +
                        '<td ><textarea name="desc" class="area" style="width:26%;" initAttrH="30" placeholder="desc"></textarea></td>' +
                        '<td><a role="button" style="margin-left:50%;">×</a></td>' +
                        '</tr>'
                    }
                    else{
                         var oTr = '<tr>' +
                        '<td ><input type="checkbox"  id="select" style="zoom:180%;"></td>' +
                        '<td ><textarea name="key" class="area" style="width:26%;" initAttrH="30" data-value="' + key + '">' + key + '</textarea></td>' +
                        '<td ><textarea name="value" class="area" style="width:26%;" initAttrH="30" data-value="' + value + '">' + value + '</textarea></td>' +
                        ' <td > ' +
                            '<label data-id="1" data-value="" class="opt_label_class">无 <a class="btn" id="opt_select"><span id="" class="glyphicon glyphicon-pencil"></span></a> ' +
                            '</label> ' +
                        '</td>' +
                        '<td ><textarea name="desc" class="area" style="width:26%;" initAttrH="30" placeholder="desc"></textarea></td>' +
                        '<td><a role="button" style="margin-left:50%;">×</a></td>' +
                        '</tr>'
                    }

                    oTable.append(oTr);
                }
            }
        });
        var tr_length = trList.length;
        //如果删除了，要同步删除key-value框里面的内容
        if (max_num < tr_length){
            var i = max_num + 1;
            for (i = max_num + 1;i < tr_length;i ++){
                trList[i].remove();
            }

        }
        //补充一个空行
        var oTr = '<tr><td ><input type="checkbox"  id="select" style="zoom:180%;"></td>' +
                '<td ><textarea name="key" class="area" style="width:26%;" initAttrH="30" placeholder="key"></textarea></td>' +
                '<td ><textarea name="value" class="area" style="width:26%;" initAttrH="30" placeholder="value"></textarea></td>' +
                 ' <td > ' +
                            '<label data-id="1" data-value="" class="opt_label_class">无 <a class="btn" id="opt_select"><span id="" class="glyphicon glyphicon-pencil"></span></a> ' +
                            '</label> ' +
                        '</td>' +
                '<td ><textarea name="desc" class="area" style="width:26%;" initAttrH="30" placeholder="desc"></textarea></td>' +
                '<td><a role="button" style="margin-left:50%;">×</a></td>'+
                '</tr>'
        if(tbody_id == 'header_params'){
            oTr = '<tr><td ><input type="checkbox" id="select" style="zoom:180%;"></td>' +
                '<td ><textarea name="key" class="area" style="width:26%;" initAttrH="30" placeholder="key"></textarea></td>' +
                '<td ><textarea name="value" class="area" style="width:26%;" initAttrH="30" placeholder="value"></textarea></td>' +
                '<td ><textarea name="desc" class="area" style="width:26%;" initAttrH="30" placeholder="desc"></textarea></td>' +
                '<td><a role="button" style="margin-left:50%;">×</a></td>'+
                '</tr>'
        }

        oTable.append(oTr);
    }
}

function FindCount(targetStr, FindStr) {
    var start = 0;
    var aa = 0;
    var ss =targetStr.indexOf(FindStr, start);
    while (ss > -1) {
        start = ss + FindStr.length;
        aa++;
        ss = targetStr.indexOf(FindStr, start);
    }
    return aa;
}

/**
 * JSON格式解析，暂时未用
 * @param json
 * @param options
 * @returns {string}
 */
var formatJson = function(json, options) {
            var reg = null,
              formatted = '',
              pad = 0,
              PADDING = '    '; // one can also use '\t' or a different number of spaces
            // optional settings
            options = options || {};
            // remove newline where '{' or '[' follows ':'
            options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
            // use a space after a colon
            options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;

            // begin formatting...

            // make sure we start with the JSON as a string
            if (typeof json !== 'string') {
                json = JSON.stringify(json);
            }
            // parse and stringify in order to remove extra whitespace
            json = JSON.parse(json);
            json = JSON.stringify(json);

            // add newline before and after curly braces
            reg = /([\{\}])/g;
            json = json.replace(reg, '\r\n$1\r\n');

            // add newline before and after square brackets
            reg = /([\[\]])/g;
            json = json.replace(reg, '\r\n$1\r\n');

            // add newline after comma
            reg = /(\,)/g;
            json = json.replace(reg, '$1\r\n');

            // remove multiple newlines
            reg = /(\r\n\r\n)/g;
            json = json.replace(reg, '\r\n');

            // remove newlines before commas
            reg = /\r\n\,/g;
            json = json.replace(reg, ',');

            // optional formatting...
            if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
                reg = /\:\r\n\{/g;
                json = json.replace(reg, ':{');
                reg = /\:\r\n\[/g;
                json = json.replace(reg, ':[');
            }
            if (options.spaceAfterColon) {
                reg = /\:/g;
                json = json.replace(reg, ': ');
            }

            $.each(json.split('\r\n'), function(index, node) {
                var i = 0,
                  indent = 0,
                  padding = '';

                if (node.match(/\{$/) || node.match(/\[$/)) {
                    indent = 1;
                } else if (node.match(/\}/) || node.match(/\]/)) {
                    if (pad !== 0) {
                        pad -= 1;
                    }
                } else {
                    indent = 0;
                }

                for (i = 0; i < pad; i++) {
                    padding += PADDING;
                }

                formatted += padding + node + '\r\n';
                pad += indent;
            });

            return formatted;
        };

/**
 * json格式解析，将json串解析成html，设置各种颜色，方便查看
 * @param json
 * @returns {string}
 */
function syntaxHighlight(json) {
            //var json = {    "country": 1,    "province": 32,    "city": 0,    "onlineversion": 2,    "errorcode": 0,    "runtime": 11,    "data": [        {            "tid": "356",            "num": 1,            "addata": [                {                    "adid": -1794711377,                    "custid": 1473996911,                    "clickprice": 2,                    "price": 266.4,                    "planid": 606463442,                    "gid": 606572355,                    "mediatype": 27,                    "crowdtype": 0,                    "rankscore": 1266.62,                    "matchtype": 1,                    "pctr": 0.001,                    "quality": 3.96216,                    "level": 0,                    "appid": 1068,                    "appcompany": "北京三快科技有限公司",                    "apptype": 102230,                    "pkgsize": 41505362,                    "download": 299924482,                    "appver": "8.2.3",                    "pkgname": "com.sankuai.meituan",                    "is_extend": 0,                    "appscore": 9.7,                    "apkid": 0,                    "app_cid": 1,                    "promote_type": 1,                    "url_version": "",                    "ad_style": 2,                    "showurl": "http://p3.qhimg.com/t018e7ed6b97598062f.jpg",                    "rule": "",                    "url_type": 1,                    "ratingnum": 44965,                    "subtitle": "全网广东广东",                    "button": "是否",                    "appmd5": "f004ea300d62a54b6b20087c7977bad4",                    "asw": 1200,                    "ash": 627,                    "creative_type": 14,                    "goodsid": "",                    "goodsprice": "",                    "tagname": "356",                    "adtitle": "美团",                    "addesc": "广东广东全网",                    "targeturl": "http://shouji.360tpcdn.com/170620/f004ea300d62a54b6b20087c7977bad4/com.sankuai.meituan_523.apk",                    "imgurls": [                        "http://p17.qhimg.com/dr/160_160_/t011cfe40ab6b7abd9d.png"                    ],                    "crowdids": []                }            ]        }    ],    "provincestr": "广东",    "citystr": "其他"}
            if (typeof json != 'string') {
                json = JSON.stringify(json, undefined, 2);
            }
            json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
                var cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        }

/**
 * 点击opt下面的编辑时，弹出选择操作框
 */
$(document).on('click','#opt_select',function(){
    var tr = $(this).closest('tr');
    var tr_num = tr[0].rowIndex;
    var tdArr = tr.find("td");
    var selectId = tdArr.eq(3).find("label").attr("data-id");
    var selectName =  tdArr.eq(3).find("label").attr("data-value");

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
    var label_obj = $("#params tr:eq(" + tr_num + ") td:eq(3) label");
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
     if(get_length(content)>26)
        content = subString(content,26,1) ;
     console.log(content)
     $(this).val(content);
     $(this).css("height","30px");
 });

$("body").on("focus",".area",function(){
    $(this).val($(this).attr("data-value"));
     $(this).css("z-index",2);
     $(this).txtaAutoHeight();
 })


/**
 * 选择raw后，弹出类型选择框
 */
$(document).on("change","input:radio[name='content_type']",function(){
    var content_type = $("input[name='content_type']:checked").val();
    if(content_type == '2'){
        $("#raw_type").css({"display":"inline-block"});
        $("#body_raw_content").css({"display":"block"})
        $("#body_key_value").css({"display":"none"})
        $("#body_bulk").css({"display":"none"})
    }
    else{
        $("#raw_type").css({"display":"none"});
        $("#body_raw_content").css({"display":"none"})
         $("#body_key_value").css({"display":"block"})
        $("#body_bulk").css({"display":"none"})
    }
});


/**
 * 把结果格式化成不同的类型
 */
$(document).on('change','#result_type',function(){
    var result_type = $("#result_type").val();
    var data = $('#result').html()
    if(result_type.toLowerCase() == 'json'){
        if(data.match("^\{(.+:.+,*){1,}\}$")){
            var rdata = jQuery.parseJSON(data);
            var json_str = formatJson(data)
            $("#result").html( json_str);
        }
    }
    if(result_type.toLowerCase() == 'html'){
        $("#result").text(data).html();
    }
    if(result_type.toLowerCase() == 'xml'){
       var html_data = Trim(data)
        $("#result").text(html_data).html();
    }
    if(result_type.toLowerCase() == 'text'){
       var html_data = Trim(data)
        $("#result").text(html_data).html();
    }
})

 function Trim(str) {
     var result = str.replace(/[\r\n]/g, "").replace(/[ ]/g, "")
     return result
 }

function  add_dateset(){
    $("#add_new_dataset").html('新建数据集');
    $("#dataset_name").val('')
    $('#modal_dataset_add').modal('show');
}

/**
 * 获取当面页url的指定参数值
 */
function GetUrlParam(paraName) {
    var url = document.location.toString();
    var arrObj = url.split("?");
    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;
        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");
            if (arr != null && arr[0] == paraName) {
                return arr[1];
            }
        }
        return "";
    }
    else {

        return "";
    }
}
/**
* 弹框新建数据组的数据保存
*/
function add_dataset_db() {
    var dataset_name = $("#dataset_name").val();
    var dataset_id = $("#dataset_id").val();
    var interface_id = GetUrlParam("interface_id")
    $.ajax({
        type: "POST",
        url: "/add_dataset_db",
        cache:false,
        async:false,
        data: {
            "dataset_id":dataset_id,
            "dataset_name": dataset_name,
            "interface_id": interface_id
        },
       success: function (data) {
           if(data == 'add_ok'){
               window.location.reload();
               //alert("添加数据组成功！");
           }
           else{
               if(data == 'edit_ok'){
                   alert("编辑数据组成功！");
                   window.location.reload();
               }
               else{
                   alert("修改数据集失败！");
               }
           }
        }
    });
}

/**
 * 新建接口时，新建数据组按钮禁用，编辑接口时可用;
 * 新建接口时，数据组区域不展示，编辑接口时展示；
 */
$().ready(function(){
    /*检查url中是否包含接口参数，不包含说明是新建接口，包含说明是编辑接口*/
    if( GetUrlParam("interface_id") == ""){
        var buttonObject = document.getElementById('new_dataset');
        buttonObject.disabled=true;
        $("#dataset_div").hide();
    }
});

function del_dataset_one(dataset_id) {
    if(confirm("确认删除该数据组吗？")){
        $.ajax({
            type: "POST",
            url: "/del_dataset_one",
            cache: false,
            async: false,
            data: {
                "dataset_id": dataset_id
            },
            success: function (data) {
                if (data=="fail") {
                    alert("删除失败！");
                    return false;
                }
                else {
                    $("input:radio[name=dataset]").eq(0).attr("checked",'checked');
                    window.location.reload();
                }
            }
        });
    }
}

function edit_dataset(id,dataset_name){
    $("#add_new_dataset").html('编辑数据集');
    $("#dataset_id").val(id)
    $("#dataset_name").val(dataset_name)
    $('#modal_dataset_add').modal('show');
};


//点击数据集radio，切换参数信息
$(document).on('click','input:radio[name="dataset"]',function(){
    var dataset_id = $(this).val();
    var interface_id = $(this).attr("data-id")
    $.ajax({
        url: '/get_dataset_info/' + interface_id + '/' + dataset_id,
        type: 'get',
        dataType: 'json',
        success: function(res) {
            var params_type = res[1];
            if(params_type == 0 || params_type == 1 || params_type == null){
                if(params_type == null) {
                    $('input:radio[name=content_type][value="0"]').prop("checked", 'checked');
                }
                else{
                    $('input:radio[name=content_type][value=' + params_type + ']').prop("checked",'checked');
                }
                $("#raw_type").css({"display":"none"});
                $('#body_raw_input').val('');
                $("#body_raw_content").css({"display":"none"});
                $("#body_key_value").css({"display":"block"});
                $("#body_bulk").css({"display":"none"});
                if(params_type == 0 || params_type == 1){
                    var arr = JSON.parse(res[0]);
                    //填充到表格
                    $('#params').html('');//先清空表格
                    $.each(arr,function(n,params){
                        var data = JSON.parse(arr[n])
                        var select = data.select;
                        var key = data.key;
                        var value = data.value;
                        var opt_name = ''
                        var opt_type = ''
                        if($.inArray('opt',Object.keys(data))){
                            var opt = data.opt;
                            opt_name = opt.name;
                            opt_type = opt.type;
                        }

                        var opt_desc = '';
                        if(opt_type == 2){
                            opt_desc = '整体加密'
                        }
                        if(opt_type == 3){
                            opt_desc = opt_name + '字段加密'
                        }
                        if(opt_type == 4){
                            opt_desc = 'logid自动生成密'
                        }
                        var desc = data.desc;
                        var oTr = '<tr>' +
                            '<td ><input type="checkbox"  id="select" style="zoom:180%;" checked></td>' +
                            '<td ><textarea name="key" class="area" style="width:26%;" initAttrH="30" data-value="' + key + '">' + key + '</textarea></td>' +
                            '<td ><textarea name="value" class="area" style="width:26%;" initAttrH="30" data-value="' + value + '">' + value + '</textarea></td>' +
                            ' <td > ' +
                                '<label data-id="'+opt_type+'" data-value="'+opt_name+'" class="opt_label_class">' + opt_desc + ' <a class="btn" id="opt_select"><span id="" class="glyphicon glyphicon-pencil"></span></a> ' +
                                 '</label> ' +
                            '</td>' +
                            '<td ><textarea name="desc" class="area" style="width:26%;" initAttrH="30" placeholder="desc">'+desc+'</textarea></td>' +
                            '<td><a role="button" id="body_row_del" style="margin-left:50%;">×</a></td>' +
                            '</tr>'
                        $('#params').append(oTr);
                    });
                }
                //补充一个空行
                var oTr = '<tr><td ><input type="checkbox"  id="select" style="zoom:180%;"></td>' +
                '<td ><textarea name="key" class="area" style="width:26%;" initAttrH="30" placeholder="key"></textarea></td>' +
                '<td ><textarea name="value" class="area" style="width:26%;" initAttrH="30" placeholder="value"></textarea></td>' +
                 ' <td > ' +
                            '<label data-id="1" data-value="" class="opt_label_class"> <a class="btn" id="opt_select"><span id="" class="glyphicon glyphicon-pencil"></span></a> ' +
                            '</label> ' +
                        '</td>' +
                '<td ><textarea name="desc" class="area" style="width:26%;" initAttrH="30" placeholder="desc"></textarea></td>' +
                '<td><a role="button" id="body_row_del" style="margin-left:50%;">×</a></td>'+
                '</tr>'
                $('#params').append(oTr);
            }
            else{
                $('input:radio[name=content_type][value="2"]').prop("checked",'checked');
                $("#raw_type").css({"display":"inline-block"});
                $('#raw_type option[value=' + params_type + ']').attr("selected",'selected');
                $("#body_raw_content").css({"display":"block"})
                $("#body_key_value").css({"display":"none"})
                $("#body_bulk").css({"display":"none"})
                var arr = res[0]
                $("#body_raw_input").val(arr);
            }
        }
    })
})

$(document).on('click','#copy',function(){
     var clipboard = new ClipboardJS('.btn');

    clipboard.on('success', function(e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        e.clearSelection();
    });

    clipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });
});



