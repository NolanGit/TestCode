/**
 * Created by yanghuihui on 2017/3/6.
 */

function login(){
    var uname = $.trim($("#username").val());
    var pwd = $.trim($("#password").val());
    if (uname == "" || pwd == "") {
        alert("用户名或密码不能为空!");
        return;
    }
    $.ajax({
        url: "/auth/login",
        type: "POST",
        data: {
            username: uname,
            password: pwd
        },
        cache : false,
		async : false,
        success: function(data){
            if (data == 'success') {
                window.location.href = '/interface_list?module_id=1';
            }
            else{
                $("#password").val('').focus();
                alert("用户名或密码不正确!");
            }
        }
    })
}