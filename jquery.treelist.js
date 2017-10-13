/*!
 * treelist v0.1
 * update 20170802
 */
(function($) {
    "use strict";
    var plugin_name='treelist';
    if(typeof($.fn[plugin_name])=='function') return false;


    var dclass={
        container:plugin_name+'_container', /*列表容器*/

        node:plugin_name+'_list_node' /*节点元素*/
    };
   
    function _isjq(el){
        return el && typeof(el)=='object' && el.length>0;
    }
    /*获取节点层级数*/
    function _lv(node,lv){
        if(typeof(lv)=='string' || typeof(lv)=='number'){
            node.attr('data-tl_level',lv);
            return '';
        }else{
            return node.attr('data-tl_level')-0;
        }
    }

    function _get_node(id){
        if(typeof(id)=='string' || typeof(id)=='number'){
            return this.node_list.filter('[data-'+this.options.nodeIdAttr+'="'+id+'"]');
        }
        return id;
    }
    /*获取所有父节点*/
    function _get_parent_all(node_start){
        var options=this.options;
        var index=this.node_list.index(node_start);


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
        var index=this.node_list.index(node_start);

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
        var pid_now=node_start.attr('data-'+options.parentIdAttr);
        var node_list=node_start.siblings('[data-'+options.parentIdAttr+'="'+pid_now+'"]');
        return node_list;
    }
    /*获取所有子节点*/
    function _get_child(node_start){
        var node_list=$();
        var node_lv=_lv(node_start);
        var index=this.node_list.index(node_start);

        this.node_list.slice(index+1).each(function(){
            if(node_lv<_lv($(this))){
                node_list=node_list.add($(this));
            }else{
                return false;
            }
        });
        return node_list;
    }

    /*展开*/
    function _expand(node_start,noevent){
        var options=this.options;
        if(!node_start){
            this.node_list.show().removeClass(options.collapsedClass);
            return ;
        }
        node_start=_get_node.call(this,node_start);
        node_start.removeClass(options.collapsedClass);
        var node_lv=_lv(node_start);
        var index=this.node_list.index(node_start);

        this.node_list.slice(index+1).each(function(){
            var diff_lv=node_lv-_lv($(this));
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
    /*收起*/
    function _collapse(node_start,noevent){
        var options=this.options;
        if(!node_start){
            this.node_list.hide().addClass(options.collapsedClass);
            this.node_top_list.show();
            return ;
        }
        node_start=_get_node.call(this,node_start);
        node_start.addClass(options.collapsedClass);
        var node_lv=_lv(node_start);
        var index=this.node_list.index(node_start);

        this.node_list.slice(index+1).each(function(){
            if(node_lv<_lv($(this))){
                /*这些都是当前节点的子节点*/
                $(this).hide().addClass(options.collapsedClass);
            }else{
                return false;
            }
        });

        if(!noevent && typeof(options.onCollapse)=='function'){
            options.onCollapse.call(this,node_start);
        }
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
    /*添加子节点*/
    function _add_child(child,parent){
        var that=this;
        var options=this.options;
        var to_add=$();
        if(!_isjq(child)) child=$(child);

        if(_isjq(parent)){
            parent.after(child);
        }else{/*直接在根节点下添加*/
            //var node_id_list={};
            //that.node_list.each(function(i){
            //    node_id_list[$(this).attr('data-'+options.nodeIdAttr)]=i+1;
            //});
            //child.each(function(i){
            //    var node=$(this);
            //    var node_id=node.attr('data-'+options.nodeIdAttr);
            //    var node_pid=node.attr('data-'+options.parentIdAttr);
            //    if(!node_id_list[node_id]){ /*找出需要添加的，已存在则不添加*/
            //        to_add=to_add.add(node);
            //        //if(!to_add[node_id]) to_add[node_id]={_ch:{}};
            //        //to_add[node_id].key=i;
            //        //
            //        //if(!to_add[node_pid]) to_add[node_pid]={_ch:{}};
            //        //to_add[node_pid]._ch[node_id]=to_add[node_id];
            //        //delete to_add[node_id];
            //    }
            //});
            //if(to_add.length==0) return to_add;
            //that.element.append(to_add);
            //_update_node.call(that,to_add);

            that.element.append(child);
        }

        _cache_node.call(that);

        _update_node.call(that,child,parent);


        if(_isjq(parent)){
            if(options.autoExpandChild){
            }else{
                var plv=_lv(parent);
                child.each(function(){
                    if(plv==_lv($(this))-1){
                        $(this).addClass(options.collapsedClass).show();
                    }else{
                    }
                });
            }
        }


        return to_add;
    }

    /*更新node缓存*/
    function _cache_node(){
        var options=this.options;
        if(options.nodeClass){
            this.node_list=$('.'+options.nodeClass,this.element);
        }else{
            this.node_list=this.element.children();
        }
        this.node_list.addClass(dclass.node);
        this.node_top_list=this.node_list.filter('[data-'+options.parentIdAttr+'="'+options.rootId+'"]');
    }
    /*更新输入的节点树数据*/
    function _update_node(node_list,parent_node){
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
            init_lv=_lv(parent_node)+1;
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
            if(options.indenterClass){
                $('.'+options.indenterClass,node)
                    .css('padding-left',(node_lv-1)*options.indent);
            }
            _lv(node,node_lv);

            if(hide_prev) autohide(prev);

            prev=node;
        });
        autohide(prev);

        if(no_parent.length>0){ /*不在根节点下的节点,TODO::优化，增强，处理意外情况*/
            $.each(no_parent,function(k,v){
                prev.parent().append(v);
            });
        }
    }
    /**
     * 插件主类,容器管理器
     * @param element 容器元素
     * @param opt 自定义配置
     */
    function Container(element,opt){
        var options = $.extend(true,{},Container.DEFAULTS);
        if(opt) $.extend(options, opt);

        this.options=options;
        this.element=element;
        var that=this;


        _cache_node.call(that);
        if(options.initCollapseAll){
            _collapse.call(that);
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
                options.onChange.call(this,node);
            }
        };

        element.addClass(dclass.container).off('click.'+plugin_name);
        element.on('click.'+plugin_name,'.'+dclass.node,function(e){
            var target=$(e.target);
            if(options.expanderClass && target.hasClass(options.expanderClass)){
                expand_action(target);
                return;
            }
            if(options.selectAreaClass && target.hasClass(options.selectAreaClass) || target.closest('.'+options.selectAreaClass).length>0){
                select_action(target);
                return;
            }

        });

    }
    Container.prototype = {
    };
    Container.DEFAULTS = {
        nodeClass:false,
        nodeIdAttr:"id", // maps to data-id
        parentIdAttr:"pid", // maps to data-pid
        rootId:'0',

        expanderClass:false,/*折叠按钮*/
        indenterClass:false,/*每行缩进所使用的元素*/
        collapsedClass:'collapsed',/*节点收起时的class*/

        indent:19,
        initCollapseAll:true,/*初始化的时候全部收起*/
        autoExpandChild:false,/*是否自动展开子节点的子节点*/
        autoHideExpander:true,/*是否自动隐藏没有子节点的节点折叠按钮*/

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
        addChild:function(child,parent){
            return _add_child.call(this,child,parent);
        },
        update:function(parent){
            var that=this;
            var options=that.options;
            if(parent){
                _update_node.call(that,parent);
            }else{
                _cache_node.call(that);
                if(options.initCollapseAll){
                    _collapse.call(that);
                }
                _update_node.call(that,that.node_list);
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
        var re=[];
        var el=this.each(function(){
            var $t = $(this),
                plugin_instance = $t.data(plugin_name);
            if(plugin_instance && API[methodOrOptions]){
                re.push(API[methodOrOptions].apply(plugin_instance, args));
            }else if(!plugin_instance){
                $t.data(plugin_name, new Container($t, methodOrOptions));
            }
        });

        return re.length>0?(re.length==1?re[0]:re):el;
    };
})(jQuery);