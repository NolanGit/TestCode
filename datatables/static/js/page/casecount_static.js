$(document).ready(function(){
　$("#icase_count").on("click",function(){
　  var interface_id = $("#count_interface_list option:selected").attr("data-id");
    var interface_time = $("input[name='starttime']").val();
    $.ajax({
        type: "POST",
        url: "/get_interface_count_by_interface_id",
        async: false,
        data: {
            "interface_id":interface_id,
            "interface_time":interface_time
        },
        success: function (data) {
        console.log(data);
            if (data == '') {
                alert("数据不存在!");
            }
            else {
	        var in_fail = data.interface_fail_count;
	        console.log(in_fail,'in_fail');
			var in_pass = data.interface_pass_count;
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
					[{name:'interface_pass_count',data: [in_pass]},
					{ name:'interface_fail_count',data: [in_fail]}]
			});
            }
        }
    });
　　});

    $("#count_interface_list").empty();
    $("#count_interface_list").append("<option  data-id=0>  请选择</option>");
    $.ajax({
        type: "GET",
        url: "/get_all_interface",
        cache: false,
        async: false,
        data: {

        },
        success: function (data) {
            if (data == 0) {
                alert("接口不存在。");
                return false;
            }
            else {
            for(var i =0;i<data.length;i++){
            console.log(data)
                $("#count_interface_list").append("<option  data-id=\"" + data[i].id + "\">" + data[i].name + "</option>");
            }
            }
        }
    });
   });


