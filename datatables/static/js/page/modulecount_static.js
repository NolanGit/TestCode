$(document).ready(function(){
　$("#icase_count").on("click",function(){
　  var module_id = $("#count_module_list option:selected").attr("data-id");
    var module_time = $("input[name='starttime']").val();
    $.ajax({
        type: "POST",
        url: "/get_module_count_by_module_id",
        async: false,
        data: {
            "module_id":module_id,
            "module_time":module_time
        },
        success: function (data) {
        console.log(data);
            if (data == '') {
                alert("数据不存在!");
            }
            else {
	        var in_fail = data.module_fail_count;
	        console.log(in_fail,'in_fail');
			var in_pass = data.module_pass_count;
			var chart = new Highcharts.Chart({
			chart:{
					renderTo: 'container'
				},
				title: {
					text: '用例执行情况统计',
					x: -20 //center
				},
				subtitle: {
					text: '默认显示当前日期的执行情况统计',
					x: -20
				},
				xAxis: {
					categories: ['1', '2', '3', '4', '5', '6','7', '8', '9', '10', '11', '12', '13', '14', '15','16', '17', '18', '19', '20', '21', '22', '23', '24','25', '26', '27', '28', '29', '30', '31']
				},
				yAxis: {
					title: {
						text: '用例执行数量统计 (个)'
					},
					plotLines: [{
						value: 0,
						width: 1,
						color: '#808080'
					}]
				},
				tooltip: {
					valueSuffix: '个'
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'middle',
					borderWidth: 0
				},
				series:
					[{name:'module_pass_count',data: [in_pass]},
					{ name:'module_fail_count',data: [in_fail]}]
			});
            }
        }
    });
　　});

    $("#count_module_list").empty();
    $("#count_module_list").append("<option  data-id=0>  请选择</option>");
    $.ajax({
        type: "GET",
        url: "/get_all_modules",
        cache: false,
        async: false,
        data: {

        },
        success: function (data) {
            if (data == 0) {
                alert("模块不存在。");
            }
            else {
            for(var j =0;j<data.length;j++){
                console.log(decodeURI(data))
                $("#count_module_list").append("<option  data-id=\"" + data[j].id + "\">" + data[j].name + "</option>");
            }
            }
        }
    });
});


