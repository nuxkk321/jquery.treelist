# treelist   
demo : https://nuxkk321.github.io/jquery.treelist/


## 使用概述
该插件不生成节点左侧的展开收起图标,以及上下级节点间的各种连接线
仅给节点添加表示层级的class,用padding-left 实现缩进的效果

代码示例:
```html
  <dl id="data_box_main" >
    <dt data-pid="0" data-id="1">node_1</dt>
    <dt data-pid="1" data-id="3">node_1_3</dt>
    <dt data-pid="1" data-id="6">node_1_6</dt>
  </dl>
  <script src="jquery.treelist.js"></script>
  <script>
      $('#data_box_main').treelist();
  </script>
```

## 配置说明  

```js
var config = {
    nodeClass:false, //标示子节点的class,如果不填,则默认为容器元素的所有子元素
    nodeIdAttr:"id", //存放节点id属性的 data-属性名
    parentIdAttr:"pid", //存放节点pid属性的 data-属性名
    rootId:'0',//根节点id,默认为0

    expanderClass:false,/*折叠按钮*/
    indenterClass:false,/*每行缩进所使用的元素*/
    collapsedClass:'collapsed',/*节点收起时的class*/

    indent:19,//默认缩进量,单位px
    initCollapseAll:true,/*初始化的时候全部收起*/
    autoExpandChild:false,/*是否自动展开子节点的子节点*/
    autoHideExpander:true,/*是否自动隐藏没有子节点的节点折叠按钮*/

    selectAreaClass:false,/*可进行'选中'操作的区域class,如果提供了该class,则在点击这个class的区域时,自动选中该节点以及所有子节点*/
    /*每一个被选中的节点都会触发onChange事件*/
    /*如果所有子节点都被选中或者没有子节点,父节点会被加上 options.selectedAllClass 的class*/
    /*如果子节点中有未被选中的节点,父节点会被加上options.selectedSomeClass 的class,同时  options.selectedAllClass 会被去除*/
    
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
```

## 事件  


## API  
代码示例 : 
```js 
$("#tree").treetable("接口名",param);
```

### 接口
* expand: 
* collapse: 
* expandAll: 
* collapseAll: 
* getNode: 
* getChild: 
* getSibling: 
* getParent: 
* getParentAll: 
* addChild: 
* update: 
