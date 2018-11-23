# treelist   
demo : https://nuxkk321.github.io/jquery.treelist/


## Usage  
example :   
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

## Configuration  


### Settings  

```js
var config = {
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

### Events  


## API  
example : 
```js 
$("#tree").treetable("function",param);
```

### Functions

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
