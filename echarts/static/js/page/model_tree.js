/**
 * Created by yanghuihui on 2017/3/6.
 */
//var $j = jQuery.noConflict();
$(document).ready(function(){
    var pagename=$("#pagename").val();
    if(pagename!="static"){
         initTree();
    }

});
function initTree() {
    var setting = {
        view: {
            selectedMulti: false
        },
        data: {
            simpleData: {
            enable: true, /*设置是否启用简单数据格式（zTree支持标准数据格式跟简单数据格式，上面例子中是标准数据格式）*/
            idKey: "id", /*设置启用简单数据格式时id对应的属性名称*/
            pidKey: "pId" /*设置启用简单数据格式时parentId对应的属性名称,ztree根据id及pid层级关系构建树结构*/
            }
        },
        callback: {
            onClick: onClick,
            onRightClick: OnRightClick,
            beforeRename: beforeRename
        }
    };
    var zTreeObj;
    $.ajax({
        type: "Get",
        url: "/get_model_list",   /*ajax请求地址*/
        cache : false,
		async : false,
        success: function (data) {
            zTree_node = $.parseJSON(data)
            zTreeObj = $.fn.zTree.init($("#model_tree"),
                setting, zTree_node); /*加载数据*/
        }
    });
    var select_node = zTreeObj.getNodeByParam("id",get_module_id())
    zTreeObj.selectNode(select_node,true);
    zTreeObj.expandNode(select_node,true,false)


}


/*左键点击树节点的操作*/
function onClick(event, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("model_tree");
 	var nodes = zTree.getSelectedNodes();
 	var treeNode = nodes[0];
    var to_module_id = treeNode.id;
    //href = '/interface_list?module_id='+module_id;
    //window.location.href='/interface_list?module_id='+module_id;
    go_to('/interface_list',to_module_id)
}


/*右键点击树节点的操作*/
function OnRightClick(event, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("model_tree");
    zTree.selectNode(treeNode);
    if (treeNode.pId == null) {
        showRMenu("root", event.clientX , event.clientY); /*根据鼠标位置显示右键操作面板*/
    } else if (treeNode) {
        zTree.selectNode(treeNode);
        showRMenu("node", event.clientX, event.clientY);
    }
}

/**
 * 显示目录右键菜单
 * */
function showRMenu(type, x, y) {
     $("#rMenu").show();
     if (type == "root") {
         $("#m_del").hide();
         $("#m_edit").hide();
         $("#m_up").hide();
         $("#m_down").hide();
         $("#m_add").addClass('mboder');
     } else {
         $("#m_del").show();
         $("#m_edit").show();
         $("#m_up").show();
         $("#m_down").show();
         $("#m_add").removeClass('mboder');
     }
     $("#rMenu").css({ "top": y -70 + "px", "left": x + 2 + "px", "visibility": "visible" });
     $("body").bind("mousedown", onBodyMouseDown);
}

/**
 * 隐藏目录右键菜单
 * */
function hiderRMenu() {
    rMenu = $("#rMenu");
    if (rMenu)
        rMenu.css({ "visibility": "hidden" });
    $("body").unbind("mousedown", onBodyMouseDown);}/*单击页面其他位置 隐藏右键面板*/

/**
 * 点击界面其他位置，右键菜单消失
 **/
function onBodyMouseDown(event) {
    rMenu = $("#rMenu");
    if (!(event.target.id == "rMenu" || $(event.target).parents("#rMenu").length > 0)) {
        rMenu.css({ "visibility": "hidden" });
    }
}


/*增加树节点*/
function addTreeNode() {
    var zTree = $.fn.zTree.getZTreeObj("model_tree");
    var nodes = zTree.getSelectedNodes();
	var treeNode = nodes[0];
    hiderRMenu();
    var name = '新模块名称';
    var newNode = {
        name: name
    };
    if (treeNode) {
        newNode.checked = treeNode.checked;
        newNode.pId = treeNode.id;
        zTree.addNodes(treeNode, newNode);
    }
    else {
        zTree.addNodes(null, newNode);
    }
    var node = zTree.getNodeByParam("name", name, null);
    zTree.selectNode(node); /*选中新增加的节点 */
    zTree.editName(node);/*让新增加的节点处于编辑状态*/
}

/*编辑树节点*/
function editTreeNode() {
    var zTree = $.fn.zTree.getZTreeObj("model_tree");
    var nodes = zTree.getSelectedNodes(); /*得到选中节点集合  */
    if (nodes && nodes.length > 0) {
        var parent = nodes[0].getParentNode(); /*得到选中节点的父节点*/
        if (parent) {
            nodes[0].pId = parent.id; /*如果选中节点父节点存在，将当前结点的pid属性值设置为父节点的id*/
        }
        zTree.editName(nodes[0]); /*让选中节点处于编辑状态*/
    }
    hiderRMenu(); /*隐藏右键面板*/
};


/*编辑并保存节点*/
function beforeRename(treeId, treeNode, newName, isCancel) {
    var zTree = $.fn.zTree.getZTreeObj("model_tree");
    var id = 0;
    if (newName.length == 0) {
        alert("不能为空。");
        return false;
    }
    else {
        if(treeNode.id !=undefined) {
            id = treeNode.id;
        }
        $.ajax({
            type: "POST",
            url: "/edit_model",
            data: {
                    "id": id,
                    "pid": treeNode.pId,
                    "name": newName
            },
            success: function (data) {
                if (data == "fail") {
                    alert("保存失败!");
                    return false;
                }
                if (data == "repeat") {
                    alert("节点名称重复!");
                    zTree.editName(treeNode); /*让选中节点处于编辑状态*/
                    return false;
                }
                treeNode.id = data;
                return true;
            }
        });
    }
};

/**
 * 删除树节点
 */
function removeTreeNode() {
    hiderRMenu();
    var zTree = $.fn.zTree.getZTreeObj("model_tree");
    var nodes = zTree.getSelectedNodes();
    if (nodes && nodes.length > 0) {
        if (nodes[0].children && nodes[0].children.length > 0){
            alert("请先删除下级节点！");
        }
        else {
            if (confirm("该操作会将关联数据同步删除，是否确认删除？") == true) {
                $.ajax({
                    type: "POST",
                    url: "/del_model",
                    data:
                    {
                        "id": nodes[0].id,
                        "pid": nodes[0].getParentNode().id
                    },
                    success: function (data) {
                        if (data == "success") {
                            zTree.removeNode(nodes[0]);
                            go_to('/interface_list',1);
                        }
                        else {
                            alert("删除失败。");
                        }
                    }
                });
            };
        }
    }
};

/**
 * 鼠标移动到右键菜单，显示下划线状态
 */
$(document).on('mouseover','#rMenu ul li',function(){
    $(this).addClass("h_nav_over");
});

$(document).on('mouseout','#rMenu ul li',function(){
    $(this).removeClass("h_nav_over");
});