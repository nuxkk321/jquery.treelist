/*
 * treelist v0.1  
 * https://github.com/nuxkk321/jquery.treelist
 * update 20181123
 */
(function($) {
    "use strict";
    var plugin_name='treelist';
    if(typeof($.fn[plugin_name])=='function') return false;

	/*固定的class*/
    var dclass={};
	dclass.container=plugin_name+'_container'; /*列表容器*/
	dclass.node=plugin_name+'_list_node'; /*节点元素*/
	
   
    function _isjq(el){
        return el && typeof(el)=='object' && el.length>0;
    }
    /*获取节点层级数*/
    function _set_or_get_lv_data_form_node(node,lv){
        if(typeof(lv)=='string' || typeof(lv)=='number'){
            node.attr('data-tl_level',lv);
            return '';
        }else{
            return node.attr('data-tl_level')-0;
        }
    }
    /*根据id查询单个节点*/
    function _get_node(node){
        if(typeof(node)=='string' || typeof(node)=='number'){
            return this.node_list.filter('[data-'+this.options.nodeIdAttr+'="'+node+'"]');
        }else if(node instanceof jQuery){
            /*如果是jquery对象,则获取node*/
            node=node.closest('.'+dclass.node);
        }

        return node;
    }
    /*根据单个节点获取id*/
    function _get_node_id(node){
        var options=this.options;
        if(typeof(node)=='string' || typeof(node)=='number'){
            return node;
        }

        if(node instanceof jQuery){ 
            /*如果是jquery对象,则获取id*/
            return node.attr('data-'+options.nodeIdAttr);
        }

        /*其他情况 直接返回node*/
        return node;
    }
    /*获取所有父节点*/
    function _get_parent_all(node_start){
        var options=this.options;

        node_start=_get_node.call(this,node_start);

        var node_list=$();
        var pid_now=node_start.attr('data-'+options.parentIdAttr);
        node_start.prevAll().each(function(){
            if(pid_now==$(this).attr('data-'+options.nodeIdAttr)){
                node_list=node_list.add($(this));
                pid_now=$(this).attr('data-'+options.parentIdAttr)
            }
            if(String(pid_now)=='0') return false;
        });
        return node_list;
    }
    function _get_parent(node_start){
        var options=this.options;

        node_start=_get_node.call(this,node_start);

        var node_list=$();
        var pid_now=node_start.attr('data-'+options.parentIdAttr);
        node_start.prevAll().each(function(){
            if(pid_now==$(this).attr('data-'+options.nodeIdAttr)){
                node_list=$(this);
                return false;
            }
        });
        return node_list;
    }
    function _get_sibling(node_start){
        var options=this.options;

        node_start=_get_node.call(this,node_start);

        var pid_now=node_start.attr('data-'+options.parentIdAttr);
        var node_list=node_start.siblings('[data-'+options.parentIdAttr+'="'+pid_now+'"]');
        return node_list;
    }
    /*获取所有子节点*/
    function _get_child(node_start){

        node_start=_get_node.call(this,node_start);

        var node_lv=_set_or_get_lv_data_form_node(node_start);
        var index=this.node_list.index(node_start);

        var node_list=$();
        this.node_list.slice(index+1).each(function(){
            if(node_lv<_set_or_get_lv_data_form_node($(this))){
                node_list=node_list.add($(this));
            }else{
                return false;
            }
        });
        return node_list;
    }

    /**
     * 展开
     * @param node_start 当前点击的节点
     */
    function _expand(node_start,noevent){
        var options=this.options;

        if(!node_start){
            this.node_list.show().removeClass(options.collapsedClass);
            return ;
        }
        node_start=_get_node.call(this,node_start);
        node_start.removeClass(options.collapsedClass);
        var node_lv=_set_or_get_lv_data_form_node(node_start);
        var index=this.node_list.index(node_start);
        
        this.node_list.slice(index+1).each(function(){
            var diff_lv=node_lv-_set_or_get_lv_data_form_node($(this));

            if(diff_lv<0){/*这些都是当前节点的子节点*/
                if(options.autoExpandChild){
                    $(this).show().removeClass(options.collapsedClass);
                }else{/*只展开一层的子节点*/
                    if(diff_lv==-1){
                        /*一层子节点*/
                        $(this).show();
                    }else{
                        /*二层以上的子节点,不做任何处理*/
                    }
                }
            }else{
                return false;
            }
        });

        if(!noevent && typeof(options.onExpand)=='function'){
            options.onExpand.call(this,node_start);
        }
    }

    /**
     * 收起节点
     * @param node_start 需要收起的节点,如果只有一个,会自动将其子节点也收起
     * @param noevent
     * @private
     */
    function _collapse(node_start,noevent){
        var options=this.options;
        if(!node_start){
            /* 列表全部隐藏，并添加收起的类名 */
            this.node_list.not('.'+options.skipCollapseClass).hide().addClass(options.collapsedClass);
            /* 顶级列表显示 */
            this.node_top_list.show();
            return ;
        }

        node_start=_get_node.call(this,node_start);
        if(!node_start) return;//没有需要收起的节点

        if(node_start.length>1){
            /*大于一个的节点,这种情况不自动寻找子节点进行收起*/
            node_start.each(function(){
                var node=$(this);
                if(node.hasClass(options.skipCollapseClass)){
                    /*如果设置了特定的class,则跳过不收起*/
                }else if(node.hasClass(options.collapsedClass)){
                    /*如果已经收起,则跳过不收起*/
                }else{
                    node.hide().addClass(options.collapsedClass);
                }
            });
        }else if(node_start.length==1){
            /*单个节点,自动寻找子节点收起*/
            node_start.addClass(options.collapsedClass);
            var node_lv=_set_or_get_lv_data_form_node(node_start);
            var index=this.node_list.index(node_start);

            this.node_list.slice(index+1).each(function(){
                if(node_lv<_set_or_get_lv_data_form_node($(this))){
                    /*这些都是当前节点的子节点*/
                    $(this).hide().addClass(options.collapsedClass);
                }else{
                    return false;
                }
            });
        }
        
        if(!noevent && typeof(options.onCollapse)=='function'){
            options.onCollapse.call(this,node_start);
        }
    }
    // 返回所有收起状态的节点,或id
    function _getCollapseNode(return_type) {
        var options = this.options;
        /* 找出有收起类的项目 */
        var node_list = this.node_list.filter('.'+options.collapsedClass);

        if(return_type==0){
            return node_list;
        }

        /*返回id的数组*/
        var id_list = [];
        node_list.each(function(){
            id_list.push($(this).attr('data-'+options.nodeIdAttr));
        });

        return id_list;
    }
    // 返回所有 全选 状态的节点,或id
    function _getSelectedNode(return_type,has_selected_some) {
        var options = this.options;

        /*找出 全选 的item*/
        var filter_str='.'+options.selectedAllClass;
        /*额外选项:部分选中*/
        if(has_selected_some) filter_str+=',.'+options.selectedSomeClass;

        var node_list = this.node_list.filter(filter_str);

        if(return_type==0){
            return node_list;
        }

        /*返回id的数组*/
        var id_list = [];
        node_list.each(function(){
            id_list.push($(this).attr('data-'+options.nodeIdAttr));
        });

        return id_list;
    }

    /*选中*/
    function _select(node){
        var that=this,
            options=that.options,
            child_list=_get_child.call(that,node),
            parent_list=_get_parent_all.call(that,node);

        node.addClass(options.selectedAllClass);/*选中的节点直接设为全选*/
        child_list.addClass(options.selectedAllClass);/*所有子节点也设为全选*/

        /*从下往上逐级检查所有同级节点选中情况*/
        var check_class='.'+options.selectedAllClass;
        var stop_index=0;
        parent_list=parent_list.add(node);
        for(var i=parent_list.length-1;i>0;i--){
            var siblings=_get_sibling.call(that,parent_list.eq(i));
            if(siblings.not(check_class).length>0){/*同级还有不是全选的,则父级变为部分选中*/
                stop_index=i;
                break;
            }else{/*同级都是全选的,则父级变为全选中*/
                parent_list.eq(i-1).addClass(options.selectedAllClass);
            }
        }
        if(stop_index>0){
            for(var i=stop_index;i>0;i--){
                parent_list.eq(i-1).removeClass(options.selectedAllClass).addClass(options.selectedSomeClass);
            }
        }
    }
    /*反选*/
    function _unselect(node){
        var that=this,
            options=that.options,
            child_list=_get_child.call(that,node),
            parent_list=_get_parent_all.call(that,node);

        var remove_class=options.selectedAllClass+' '+options.selectedSomeClass;
        node.removeClass(remove_class);/*选中的节点去掉所有class*/
        child_list.removeClass(remove_class);/*所有子节点也去掉所有class*/

        /*从下往上逐级检查所有同级节点选中情况*/
        var check_class='.'+options.selectedAllClass+',.'+options.selectedSomeClass;
        var stop_index=0;
        parent_list=parent_list.add(node);
        for(var i=parent_list.length-1;i>0;i--){
            var siblings=_get_sibling.call(that,parent_list.eq(i));
            if(siblings.filter(check_class).length>0){/*同级还有选中的,停止检查,并且从此之上的父级全部变为部分选中*/
                stop_index=i;
                break;
            }else{/*同级没有选中的,父级去掉所有类*/
                parent_list.eq(i-1).removeClass(remove_class);
            }
        }

        if(stop_index>0){
            for(var i=stop_index;i>0;i--){
                parent_list.eq(i-1).removeClass(options.selectedAllClass).addClass(options.selectedSomeClass);
            }
        }
    }

    /*更新node缓存*/
    function _set_node_list_to_cache(){
        var options=this.options;
        /*
        如果有指定选择节点使用的class,则选择指定节点,
        否则选择总容器的子节点
        记在 node_list
        */
        if(options.nodeClass){
            this.node_list=$('.'+options.nodeClass,this.element);
        }else{
            this.node_list=this.element.children();
        }
        this.node_list.addClass(dclass.node);/*给找到的节点元素,加上 标识符 class*/

        /* 顺便将节点列表中，pid为顶级 的列表找出来,记在 node_top_list */
        this.node_top_list=this.node_list.filter('[data-'+options.parentIdAttr+'="'+options.rootId+'"]');
    }
    /*更新输入的节点树数据*/
    function _update_node(node_list,parent_node,cb){
        var options=this.options;
        var stem_info=[];
        var no_parent=[];
        var prev={length:0};
        var init_lv=1;
        var parent_id=options.rootId;

        var autohide=function(node){
            if(node.length>0 && options.expanderClass && options.autoHideExpander){
                $('.'+options.expanderClass,node).hide();
            }
        };

        if(_isjq(parent_node)){
            init_lv=_set_or_get_lv_data_form_node(parent_node)+1;
            parent_id=parent_node.attr('data-'+options.nodeIdAttr);
        }

        node_list.each(function(){
            var node=$(this);
            var node_id=node.attr('data-'+options.nodeIdAttr);
            var node_pid=node.attr('data-'+options.parentIdAttr);
            var node_lv;
            var hide_prev=1;
            if(node_pid==parent_id){ /*如果父节点是root,则重新开始计算stem*/
                stem_info=[];
                stem_info.push(node_id);
                node_lv=0;
            }else{
                node_lv=$.inArray(node_pid,stem_info)+1;
                if(node_lv==0){/*不在主干中,排序到列表最后*/
                    no_parent.push(node);
                }else{/*当前节点的pid是之前扫描的主干中的节点*/
                    if(node_lv==stem_info.length){/*是最后一个节点的子节点*/
                        stem_info.push(node_id);
                        hide_prev=0;
                    }else{
                        stem_info=stem_info.slice(0,node_lv);
                        stem_info.push(node_id);
                    }
                }
            }
            node_lv+=init_lv;
            if(options.indenterClass){ //缩进占位用的元素
                $('.'+options.indenterClass,node)
                    .css('padding-left',(node_lv-1)*options.indent);
            }
            _set_or_get_lv_data_form_node(node,node_lv);

            if(hide_prev) autohide(prev);

            prev=node;
        });
        autohide(prev);

		var root_node=_get_node.call(this,options.rootId);//如果存在根节点的元素,则该元素上的 expander 不隐藏
		if(root_node.length>0){
			root_node.find('.'+options.expanderClass).show();
		}
        if(no_parent.length>0){ /*不在根节点下的节点,TODO::优化，增强，处理意外情况*/
            $.each(no_parent,function(k,v){
                prev.parent().append(v);
            });
        }

        if(typeof(cb)=='function') cb();
    }

    /**
     * 插件主类,容器管理器,
     * 将已存在的node_list 添上 树状图模型的标示符 以及收放操作按钮
     *
     * @param element 容器元素
     * @param cfg 自定义配置
     */
    function Container(element,cfg){
        // 自定义配置覆盖默认配置
        var options = $.extend(true,{},Container.DEFAULTS);
        if(cfg) $.extend(options, cfg);

        this.options=options;
        this.element=element;
        var that=this;

        _set_node_list_to_cache.call(that);

        if(options.initCollapseAll){
            _collapse.call(that);/*收起全部节点*/
        }

        _update_node.call(that,that.node_list);

        var expand_action=function(expander){
            var node=expander.closest('.'+dclass.node);
            if(node.hasClass(options.collapsedClass)){/*已经收起的展开*/
                _expand.call(that,node);
            }else{/*未收起的则收起*/
                _collapse.call(that,node);
            }
        };
        var select_action=function(target){
            var node=target.closest('.'+dclass.node);
            if(node.hasClass(options.selectedAllClass)){/*已经全选的的进行反选*/
                _unselect.call(that,node);
            }else{/*未全选的进行全选*/
                _select.call(that,node);
            }
            if(typeof(options.onChange)=='function'){
                options.onChange.call(that,node);
            }
        };

        element.addClass(dclass.container).off('click.'+plugin_name);
        element
        /*点击节点时的事件*/
        .on('click.'+plugin_name,'.'+dclass.node,function(e){
            var target=$(e.target);
            if(options.expanderClass && target.hasClass(options.expanderClass)){
                expand_action(target);
                return;
            }
            if(options.selectAreaClass && target.closest('.'+options.selectAreaClass).length>0){
                select_action(target);
                return;
            }

        });

        if(options.expanderAllElement){
			if(options.initCollapseAll){ 
				//如果初始化时全部收起,则给 expanderAllElement 加上收起的标记
				options.expanderAllElement.addClass(options.collapsedClass);
			}
			/*全部折叠的事件*/
			options.expanderAllElement.off('click.'+plugin_name);
			options.expanderAllElement.on('click.'+plugin_name,function(){
				var node=$(this);
				if(node.hasClass(options.collapsedClass)){
					/*展开*/
					_expand.call(that);
					node.removeClass(options.collapsedClass);
				}else{
					/*收起*/
					_collapse.call(that);
					node.addClass(options.collapsedClass);
				}
			});
        }

    }
    Container.prototype = {
    };
    Container.DEFAULTS = {
		//自定义筛选node的class选择器,如果不填,则默认为容器元素的所有子元素
        nodeClass:false, 
		
        nodeIdAttr:"id", // maps to data-id
        parentIdAttr:"pid", // maps to data-pid
        rootId:'0',

        expanderClass:false,/*折叠按钮*/
        indenterClass:false,/*每行缩进所使用的元素*/
        collapsedClass:'collapsed',/*节点收起时的class*/
		skipCollapseClass:'skip_collapse',/*加上该class的节点不会被收起*/

        indent:19,
        initCollapseAll:true,/*初始化的时候全部收起*/
        autoExpandChild:false,/*是否自动展开子节点的子节点*/
        autoHideExpander:true,/*是否自动隐藏没有子节点的节点折叠按钮*/
        expanderAllElement:'',/*全部折叠的触发元素*/

        selectAreaClass:false,/*可进行选中的出发区域*/
        selectedAllClass:'selected_all',/*节点和子节点全部选中的class*/
        selectedSomeClass:'selected_some',/*节点和子节点部分选中的class*/

        onExpand:function(node){
            /*展开节点时的事件*/
        },
        onCollapse:function(node){
            /*收起节点时的事件*/
        },
        onChange:function(node){
            /*选中或反选节点时的事件*/
        }
    };

    var API = {
        expand:function(node,noevent){
            _expand.call(this,node,noevent);
        },
        collapse:function(node,noevent){
            _collapse.call(this,node,noevent);
        },
        expandAll:function(){
            _expand.call(this);
        },
        collapseAll:function(){
            _collapse.call(this);
        },
        getNode:function(id){
            return _get_node.call(this,id);
        },
        getChild:function(node){
            return _get_child.call(this,node);
        },
        getSibling:function(node){
            return _get_sibling.call(this,node);
        },
        getParent:function(node){
            return _get_parent.call(this,node);
        },
        getParentAll:function(node){
            return _get_parent_all.call(this,node);
        },

        getCollapseNode: function(return_type) {
            return _getCollapseNode.call(this,return_type)
        },
        getSelectedNode: function(return_type,has_selected_some) {
            return _getSelectedNode.call(this,return_type,has_selected_some)
        },

        update:function(parent,cb){
            var that=this;
            var options=that.options;
            if(typeof(parent)=='function'){
                cb=parent;
                parent='';
            }

            if(parent){
                _update_node.call(that,parent,cb);
            }else{
                _set_node_list_to_cache.call(that);
                if(options.initCollapseAll){
                    _collapse.call(that);
                }
                _update_node.call(that,that.node_list,cb);
            }

        }
    };
    /*全局事件*/


     /**
     * 入口方法
     * @param methodOrOptions 参数说明:
     * @returns {*}
     */
    $.fn[plugin_name] = function(methodOrOptions) {
        var args = Array.prototype.slice.call(arguments, 1);
		var el = $(this);
		var	plugin_instance = el.data(plugin_name);
		if(plugin_instance && API[methodOrOptions]){
			return API[methodOrOptions].apply(plugin_instance, args);
		}else if(!plugin_instance){
			el.data(plugin_name, new Container(el, methodOrOptions));
		}
		
		return el;
    };
})(jQuery);