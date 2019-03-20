
 //实现左侧树和其他因素的隐藏
//https://stackoverflow.com/questions/19970383/trouble-setting-up-chartkick-with-flask
/*
$(document).ready(function(){
    $("#base_model_tree").hide();
    $("#nav_route").hide();
    $("#nav_tab").hide();
});
*/
//var infoTable;
var to_del_cg_id = 0;
$(document).ready( function () {
    initsidenav();
    getInfo(2);
    $('#interInfotable').DataTable({
                        "aLengthMenu": [[20,50, 100,-1], ["20条","50条", "100条", "All"]],
                        "aoColumnDefs": [{
                               //设置第3列不排序
                               "bSortable": false,
                               "aTargets": [0,1],
                           }],
                        fixedHeader: true,
                        "destroy": true,
                        "bStateSave":true,
                        "bAutoWidth": false,
                        "aoColumns" : [

                            { sWidth: '80px' },
                            { sWidth: '150px' },
                            { sWidth: '30px' },
                            { sWidth: '30px' }
                        ]
                    });
} );
function createTable(module_id){
   $('#interInfotable').DataTable({
                        "aLengthMenu": [[20,50, 100,-1], ["20条","50条", "100条", "All"]],
                        "aoColumnDefs": [{
                               //设置第3列不排序
                               "bSortable": false,
                               "aTargets": [0,1],
                           }],
                        fixedHeader: true,
                        "destroy": true,
                        "bStateSave":true,
                        "bAutoWidth": false,
                        "aoColumns" : [
                            { sWidth: '50px' },
                            { sWidth: '150px' },
                            { sWidth: '50px' },
                            { sWidth: '50px' }
                        ],
                        "fnCreatedRow": function (nRow, aData, iDataIndex) {
                            if (aData[3] >1000000) {
                                $('td:eq(3)', nRow).css("color","red");
                            }

                        },
           ajax: {
                    type: "POST",
                    url: "http://dianjing.test.com:8000/getModelInterInfo",
                    data: {
                        moduleid:module_id
                    },
                    error: function () {
                        alertError("");
                    },
                    dataSrc: function (json) {
                        json.draw = json.data.draw;
                        json.recordsTotal = json.data.recordsTotal;
                        json.recordsFiltered = json.data.recordsFiltered;
                        return json.data;
                    }
                }



   });
}
function  initsidenav() {
    var text="";
    text+="<div class=\"sidebar main left\" id=\"sidebar-main\">\n" +
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t          <ul class='menu'>\n" +
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t            <li class=\"level1\"><a href=\"#allstatic\">各产品线下接口/case数统计\n</a></li>\n" +
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t            <li class=\"level1\"><a href=\"#infostatic\">各接口下case数统计</a></li>\n" +
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t          </ul>\n" +
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t        </nav>      \n" +
        "\t\t\t\t\t\t\t\t\t\t\t\t\t\t    </div>";
    $("#base_model_tree").empty().append(text);


}

$(document).on("change",".module_info_select",function(){
    var module_id=$(this).children("option:selected").attr("data-id");
    $("#interInfotable").dataTable().fnDestroy();
    createTable(module_id);

});

function  getInfo(module_id) {
    $.ajax({
        url:'/getModelInterInfo',
        type: 'post',
        cache: false,
        async: false,
        dataType:'json',
        data:{
            "moduleid":module_id
        },
       success:function (data) {
            if (data.errno=="0"){
                interinfolist=data.data;
                 text="";
                for(i=0;i<interinfolist.length;i++){

                    text+=" <tr class=\"interinfo\" >\n" +
                        " <td class=\"inter_name\" style=\"\">"+interinfolist[i][0]+"</td>\n" +
                        " <td class=\"inter_url\" style=\"\">"+interinfolist[i][1]+"</td>\n" +
                        " <td class=\"inter_casenum\" style=\"\">"+interinfolist[i][2]+"</td>\n" ;
                    if(interinfolist[i][3]>1000000){
                        text+=" <td class=\"inter_pvnum\" style=\"color: red\">"+interinfolist[i][3]+"</td></tr>";
                    }else{
                        text+=" <td class=\"inter_pvnum\" style=\"\">"+interinfolist[i][3]+"</td></tr>";
                    }
                }
                $("#interInfotable").find("tbody").empty().append(text);


            }

        }

    });
}

/*
function  getpvCount() {
    var urllist =[];
    $("#interInfotable").find(".interinfo").each(function() {
        var  interobj={"id":'',"url":''};
        interobj.id=$(this).find(".inter_id")[0].innerText;
        interobj.url=$(this).find(".inter_url")[0].innerText;
        if(interobj.id!=''){
            urllist.push(interobj);
        }

    });

    $.ajax({
        url: '/getModelInterPv',
        type: 'Get',
        cache: false,
        async: false,
        dataType: 'json',
        data: {"modulelist":'2,3,'},
        success: function (data) {
            if (data.errno=="0"){
                interinfolist=data.data;
                 text="";
                for(i=0;i<interinfolist.length;i++) {
                    info=interinfolist[i];
                    id=info.id;
                    $("#"+id+"").find(".inter_pvnum")[0].innerText=info.count;
                }
            }
        }
    });

}*/
