# jsTree-Simple-Creator
###Easy JSTree Creation and manipulation kit

JSTree is an epic library, but a bit difficult for beginner programmers.
This repo aims to create a simple method of initializing x number of trees.
Although it does not allow as much manipulation (on the surface) as JSTree objects themselves, it allows for easily replicating and displaying data on a showcase website.

**This tool is currently being cleaned up for public use**

Uses:
    -> Create trees straight from sql 2D array datasets
    -> Manipulate trees by easily adding hierarchical manipulation
    -> Easily add options to: open/close one depth, open/close all depths
    -> Functions to get paths to specific node given either an array or jstree

It's as easy as:
```javascript
// This is an example initialization
var treeObj = new jstreeCreator("treeBox", "example", "open", "treeBoxSearch", true);
// Initialize and draw your tree
treeObj.initTree();
```

Given some database table that returns an array akin to:
```
[['friend','companion','prankster'],
 ['friend','companion','serious guy'],
 ['friend','best friend','relaxed'],
 ['enemy','bully','aggressive'],
 ['enemy','rival', '']]
```

Assuming we store that array in 'tempArr', we can easily initialize it with:
```html
<input type="text" id="treeBoxSearch" placeholder="Search...">
<div id="treeBox"></div>

<script>

    // Initialize object to store our tree info
	var friendObj = new jstreeCreator("treeBox", "friendshipTree", "open", "treeBoxSearch2", true);

    // Set the objects display content
	friendObj.contentSet.contentArr = tempArr;
	// Initialize our tree
	friendObj.initTree();

</script>
```

will show up as:

![Alt text](/screens/level7.png "Title")
