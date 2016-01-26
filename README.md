# jsTree-Simple-Creator
Easy JSTree Creation and manipulation kit

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
