/**
 * Created by yanghuihui on 2017/5/22.
 */

$(document).ready(function(){
    $('ul.nav > li').each(function(index, item){
        var class_name = location.pathname.split('/')[1];
        if($(this).hasClass(class_name)){
            <!--$('ul.nav > li').removeClass('active');-->
            $(this).addClass("active").siblings().removeClass("active");
        }
    });
    var pagename=$("#pagename").val();
    if(pagename!="static"){
        $("#nav_route").show();
        $("#nav_tab").show();
         $("#base_model_tree").show();
    }else{
           $("#nav_route").hide();
           $("#nav_tab").hide();

    }
});

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

function get_env(){
    var env = $("#env").val();
    if(env == undefined){
        env = 1
    }
    return env;
}
/**
 * 点击链接后，跳转到对应的URL
 * @param url
 * @param module_id
 * @param interface_id
 * @param case_group_id
 */
function go_to(url,module_id,interface_id,case_group_id,case_id){
    var module_id =  arguments[1] ? arguments[1] : 0;//设置第一个参数的默认值为1
    var interface_id = arguments[2] ? arguments[2] : 0;
    var case_group_id = arguments[3] ? arguments[3] : 0;
    var case_id = arguments[4] ? arguments[4] : 0;

    var env_select = get_env();
    var go_url = url + '?env='+env_select;

    if(module_id != 0 && module_id != null){
        go_url += '&module_id='+module_id
    }
    if(interface_id != 0 && interface_id != null){
        go_url += '&interface_id='+interface_id
    }
    if(case_group_id != 0 && case_group_id != null){
        go_url += '&case_group_id='+case_group_id
    }
    if(case_id != 0 && case_id != null){
        go_url += '&case_id='+case_id
    }
    location.href = go_url
}

function get_length(str) {
  ///<summary>获得字符串实际长度，中文2，英文1</summary>
  ///<param name="str">要获得长度的字符串</param>
  var realLength = 0, len = str.length, charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128)
       realLength += 1;
    else
       realLength += 2;
  }
  return realLength;
};

//截取字符串 包含中文处理
//(串,长度,增加...)
function subString(str, len, hasDot)
{
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex,"**").length;
    for(var i = 0;i < strLength;i++)
    {
        singleChar = str.charAt(i).toString();
        if(singleChar.match(chineseRegex) != null)
        {
            newLength += 2;
        }
        else
        {
            newLength++;
        }
        if(newLength > len)
        {
            break;
        }
        newStr += singleChar;
    }

    if(hasDot && strLength > len)
    {
        newStr += "...";
    }
    return newStr;
}
