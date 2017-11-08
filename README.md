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
```

### Events  


## API  
example : $("#tree").treetable("function",param);

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
