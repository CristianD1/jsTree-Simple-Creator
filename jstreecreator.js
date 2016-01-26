
// Global variable to store id relations with their names
var orgUnitToName = {};


// The main object that creates the tree
function jstreeCreator(treeBox, treeType, nodeState, searchBar, multipleSelect, addDepth){

	// General tree-specific settings
	this.treeBoxID = treeBox             || 'default';
	this.nodeState = nodeState           || 'open';
	this.searchBar = searchBar           || false;
	this.multipleSelect = multipleSelect || false;

	// storage for the result settings
	this.contentSet = {
			treeType : 'example',
			contentArr : [],
			parentIconLink : "",
			leafIconLink : "",
			addDepth : (addDepth!=undefined&&addDepth!="")?true:false
		}
	
	this.treeID = "#"+this.treeBoxID;
	this.searchBarID = "#"+this.searchBar;

	// tree event functions
	function onReady(e, data){ 
		(nodeState == 'open')?data.instance.open_all():data.instance.close_all();
	};
	this.onActivatedNode = function(e, data){  };
	this.onChangedNode = function(e, data){  };

		
	var self = this;

	// initialize the tree in the element: treeBoxID 
	this.initTree = function(){

		if(self.contentSet.treeType == 'example'){
			self.contentSet.contentArr = [['a','b','c'],['a','d',''],['e','f',''],['e','f','g']];
		}

		$(self.treeID).jstree("destroy");

		// initialize the dataset and put it in the requested element
		$(self.treeID).html(twoDArrToTree(self.contentSet));

		// initialize the tree and its coresponding functions
		$(self.treeID).jstree({
						"core" : {
							"plugins" : ["search"],
							"search" : {'fuzzy' : false},
						},
						"plugins" : [ "checkbox", "search", "sort"],
					});
		$(self.treeID).on('ready.jstree', initSearchBar(self.searchBarID, self.treeID), function(e, data){
			onReady(e, data);
		});
		$(self.treeID).on("activate_node.jstree", function(e, data){
			self.onActivatedNode(e, data);
		});
		$(self.treeID).on("changed.jstree", function(e, data){
			self.onChangedNode(e, data);
		});



		// Init helpers
		function initSearchBar(sID, ID){
			if(sID != false){
			  	$(sID).keyup(function () {
			      	var v = $(sID).val();
			      	$(ID).jstree("search", v);
			 	});
			}
		}

	}
}


/* ----------------- TREE RENDERING ----------------- */


/*
  twoDArrToTree(array, string, string, bool, [int]) returns a string that can be rendered with jstree
			usage: document.write( twoDArrToTree(arr, str, str, bool, [int]) )
		
		Example Input: 	            |a|b|c|
									|a|b|d|
									|e|f|g|
									|e|h|i|

        Example Output (depiction): a
									+-b
									  +-c
									  +-d
									e
									+-f
									  +-g
								    +-h
									  +-i

		Real Output: 
		<ul>
			<li> a
					<ul>
						<li> b
							<ul>
								<li> c </li>
								<li> d </li>
							</ul>
						</li>
					</ul>
			</li>
			<li> e
					<ul>
						<li> f
							<ul>
								<li> g </li>
							</ul>
						</li>
						<li> h
							<ul>
								<li> i </li>
							</ul>
						</li>
					</ul>
			</li>
		</ul>


		parameter info: contentSet.contentArr represents a tree hierarchy
							-> Must be of the form
								|a|b|c|
								|a|b|d|
								|e|f|g|
								|e|h|i|
								(or some derivative thereof)
*/
function twoDArrToTree(contentSet){

	var maxLength = 0;
	var contentArrLen = contentSet.contentArr.length;

	// Intelligently get the maximum row length
	for(var i = 0; i < contentArrLen; i++){
		var len = contentSet.contentArr[i].length;
		maxLength = (len > maxLength)?len:maxLength;
	}


	// Constants
	var numRows = contentArrLen;
	var numCols = 0;
	if(contentSet.contentArr[0] != undefined){
		numCols = contentSet.contentArr[0].length;
	}
	if(maxLength != null && maxLength != undefined && maxLength != 0){
		numCols = maxLength;
	}


	var foundArr = [];

	var currItem = "";

	/*
		----------------------------   STEP 1   ----------------------------


	  Create hallow array from infoArray (getting rid of unnecessary hierarchy)
	  ie: 	The input contentSet.contentArr:
	  			   |a|b|c|
				   |a|b|d|
				   |e|f|g|
				   |e|h|i|
			Is transformed into:
				   |a|b|c|
				   | | |d|
				   |e|f|g|
				   | |h|i|
	*/

	for(var currRow = 0; currRow < numRows; ++currRow){
		var tStr = ""
		for(var currCol = 0; currCol < numCols; ++currCol){

			var item = contentSet.contentArr[currRow][currCol];

			if(item != undefined && item != ""){
				if(foundArr[currCol] == item){
					contentSet.contentArr[currRow][currCol] = "";
				}else{
					foundArr[currCol] = "";
				}
				foundArr[currCol] = item;
			}

			//tStr += " | " + contentSet.contentArr[currRow][currCol] + " | ";

		}
		//console.log(tStr);
	}

	// Clean the array of entirely blank rows
	var tempArr = [numRows];
	for(var i = 0; i < numRows; ++i){
		tempArr[i] = [numCols];
	}
	var tempArrRow = 0;

	var emptyRow = true;

	for(var currRow = 0; currRow < numRows; ++currRow){
		emptyRow = true;

		// Check if row is empty
		for(var currCol = 0; currCol < numCols; ++currCol){
			if(contentSet.contentArr[currRow][currCol] != ""){
				emptyRow = false;
				break;
			}
		}

		// If the row is not empty, add it to tempArr
		if(!emptyRow){
			for(var currCol = 0; currCol < numCols; ++currCol){
				tempArr[tempArrRow][currCol] = contentSet.contentArr[currRow][currCol];
			}
			tempArrRow += 1;
		}
	}
	contentSet.contentArr = tempArr;
	numRows = tempArrRow;


	
	// for(var row = 0; row < numRows; ++row){
	// 	var tStr = "";
	// 	for(var col = 0; col < numCols; ++col){
	// 		tStr += " | "+contentSet.contentArr[row][col]+" | ";
	// 	}
	// 	console.log(tStr);
	// }

	/*
		----------------------------   STEP 2   ----------------------------

		Uses the hallow array to create the jstree appropriate string.
		
		Using a variable that stores the previously maximum reached depth (prevDepth),
			the function acts according to the position of the current depth (currDepth).

		Pseudocode:
			Loop by rows {
				Loop by columns {
					current depth = column + 1
					if( the current item is not empty ) {
						if( current depth <= previous depth ) {
							find the difference
							close as many tags as the difference
							set the previous depth equal to the current depth
						}
						append new node to the resultString
					} else if ( current depth > previous depth ){
						move back once
						end this loop
					}
				}
				previous depth = current depth
			}
	*/

	// Set the prevDepth to initially be the first element we can find
	//      If the array is: | |a|b| then we consider a the first element
	var prevDepth = 0;
	for(var col = 0; col < numCols; ++col){
		if(contentSet.contentArr[0][col] != ""){
			prevDepth = col;
			break;
		}
	}

	var currDepth = 0;
	var diff = 0;
	var prevFoundItems = [];

	var resultString = "<ul>";
	for(var row = 0; row < numRows; ++row){
		currDepth = 0;

		for(var col = 0; col < numCols; ++col){
			currDepth = col + 1;

			if(contentSet.contentArr[row][col] != "" && contentSet.contentArr[row][col] != undefined){

				if(prevFoundItems[col] == contentSet.contentArr[row][col]){
					contentSet.contentArr[row][col] = "";
				}else{
					prevFoundItems[col] = "";
				}

				// Our current position is closer to the root than the previous position
				//		so we move back in the tree (close tags) to get to our position
				if(currDepth <= prevDepth){
					diff = (prevDepth - currDepth);
					for(var i = 0; i <= diff; ++i){
						resultString += "</ul></li>";
					}
					prevDepth = currDepth;
				}

				// Set the current node's icon link
				var iconLink;
				if(col == numCols - 1){
					iconLink = contentSet.leafIconLink;
				}else{
					iconLink = contentSet.parentIconLink;
				}
				// Custom iconlink for transits
				if(contentSet.contentArr[row][col].indexOf("_Transit_Dept_") != -1){
					iconLink = contentSet.leafIconLink;
				}
				var jt = '{"icon":"'+iconLink+'"}';


				// Get rid of spaces and other odd characters in the current element
				var itemID = customTreeReplace(contentSet.contentArr[row][col]);
				var itemName = contentSet.contentArr[row][col];

				var parentItem = "";
				if(col > 0 && prevFoundItems[col-1] != undefined){
					parentItem = prevFoundItems[col-1];
				}


				var id = "";
				var displayName = contentSet.contentArr[row][col];

				// Determine node name settings given the type of tree requested
				if(contentSet.treeType == "Dept" || contentSet.treeType == "HRDept"){
					if(contentSet.addDepth){
						id = "d"+currDepth+"n"+"_"+itemID
					}else{
						id = itemID;
					}
					itemName = (contentSet.contentArr[row][col] in orgUnitToName)?orgUnitToName[contentSet.contentArr[row][col]]:contentSet.contentArr[row][col];
					displayName = (displayName in orgUnitToName)?orgUnitToName[displayName]:displayName;

					if(displayName.indexOf("_Transit_") != -1){
						displayName = displayName.substring(0, displayName.indexOf("_Transit_"));
					}

					// Initialize this depth
					if($.inArray(currDepth, depDepths) == -1){depDepths.push(currDepth);}
				}else{
					id = row+"_"+col+"_"+itemID;
				}

				displayName = (contentSet.treeType == "location" && currDepth == 5)?"Floor: "+displayName:displayName;

				// Define the node and add it to the tree
				resultString += "<li id='"+id+"' data-jstree='"+jt+"' name='"+itemName+"' data-nodedepth='"+currDepth+"'>"+displayName+"<ul>";

				prevFoundItems[col] = contentSet.contentArr[row][col];

			}else if(currDepth > prevDepth){
				currDepth -= 1;
				break;
			}
		}
		prevDepth = currDepth;
	}
	resultString += "</ul>";


	// Sort and remove duplicates from our depth arrays
	locDepths.sort(function(a, b){return a - b;});
	depDepths.sort(function(a, b){return a - b;});


	return resultString;

}
/* HELPERS FOR JSTREE RENDERING */
// Checks if val exists in arr
function existsInArray(arr, val){
	var res = false;
	for(var i = 0; i < arr.length; ++i){
		if(arr[i] == val){
			res = true;
			break;
		}
	}
	return res;
}
// Delete odd characters in the trees
function customTreeReplace(str){ return str.replace(/[ &\/°"§%()\[\]{}=\\?´`'#<>|,;.:+-]+/g, ""); }


/* ----------------- END TREE RENDERING ----------------- */

/* ----------------- FUNCTIONS FOR  RENDERING ----------------- */

// Uses a given array of selected information departments (selectedList)
//		and the original pseudo tree array to resolve to a list of node paths
//		Then initializes the newly created tree using the resolved paths only
function getNodePathsFromArr(previewID, infoArr, selectedList, maxLength){

	var prevFoundList = [];
	var foundRows = [];

	var allPathsList = [];

	if(selectedList.length != 0){

		//
		var numRows = infoArr.length;
		var numCols = infoArr[0].length;;
		if(maxLength != null && maxLength != undefined){
			numCols = maxLength;
		}

		for(var currPos = 0; currPos < selectedList.length; ++currPos){

			var currChild = selectedList[currPos];

			// Only run the code if we havent previously seen this child
			if(jQuery.inArray(currChild, prevFoundList) == -1){
				prevFoundList.push(currChild);

				var currPath = [];

				//
				var foundPos = false;
				var targetRow = 0;
				var targetCol = 0;

				// Loop through the array to find the position that the required child node exists at
				for(var currRow = 0; currRow < numRows; ++currRow){
					for(var currCol = 0; currCol < numCols; ++currCol){

						if(infoArr[currRow][currCol] == currChild){
							foundPos = true;
							targetRow = currRow;
							targetCol = currCol;

							foundRows.push(targetRow);
						}

					}
					if(foundPos){break;}
				}
			}

		}

		// go through the original hierarchy array and only push through the ones that we selected
		foundRows.sort(function(a, b){return a - b;}); 	

		for(var i = 0; i < foundRows.length; ++i){
			var num = foundRows[i];
			var tempA = [];
			for(var col = 0; col < unchangedHRDeptJSArr[num].length; ++col){
				tempA.push(unchangedHRDeptJSArr[num][col]);
			}
			allPathsList.push(tempA);
		}
		
	}else{
		allPathsList = HRDeptJSArr;
	}

	var resultTree = twoDArrToTree( allPathsList, "images/treeDepartment.png", "images/treeTransit.png", false, numCols, "department" );
	

	InitializeDisplayTree(treeviewHRDep, resultTree);
}

// Uses a given tree and list of selected items to resolve to a list of
//		node paths to each node
//		Creates a preview-based tree for the tooltips
function getNodePathsFromTree(previewID, treeID, selectedList, treeType) {

	if(selectedList.length != 0){

		var res = "";

		var resArray = [];
		var maxLength = 0;
		selectedList.sort();

		for(var nPos = 0; nPos < selectedList.length; ++nPos){
			res = "";

			// Determine the tree type given the currently selected element
			if(treeID != treeviewLoc){
				if(selectedList[nPos].search("OU") != -1){
					treeID = treeviewHRDep;
				}else{
					treeID = treeviewDep;
				}
			}

			var loSelectedNode = $(treeID).jstree(true).get_node(selectedList[nPos]);

			if(loSelectedNode.parents != undefined){

			    var loData = [];
			    var lnLevel = loSelectedNode.parents.length;
			    var lsSelectedID = loSelectedNode.id;
			    var loParent = $("#" + lsSelectedID);

			    for (var ln = 0; ln < lnLevel; ln++) {
			        var loParent = loParent.parent().parent();
					
			        if (loParent.children()[1] != undefined) {
			            loData.push(loParent.children()[1].text);
			        }
			    }

			   	loData = loData.reverse();

			   	loData.push("<font color=#F66B81>" + loSelectedNode.text + "</font>");

			   	var currLen = loData.length;

			   	if(currLen > maxLength){
			   		maxLength = currLen;
			   	}

			   	resArray.push(loData);

			}
	   	}

	 	if(treeType == "tooltips"){treeType = "";}
	   	var resultTree = twoDArrToTree( resArray, "null", "null", true, maxLength, treeType );
	   	reInitializeTooltipTree(previewID+treeType, resultTree);
	   	

	   	$(previewID).html("View Preview");
   	
   	}else{

		$(previewID).html("None Selected");
		$(previewID+"Tooltip").html("None Selected");

   	}

}


/* ---------------- Functions for opening/closing nodes at a next depth ---------------- */

// Storage and manipulation for opened nodes
var locDepths = [];
var depDepths = [];

function openCloseBtn(treeID, action){
	// Depending on the treeID passed in, set the respective tree depth array
	var depthArr = (treeID == treeviewLoc) ? locDepths : depDepths;

	if(action == "open"){
		// Sort ascending
		depthArr.sort(function(a, b){ return a - b; });
	}else{
		// Sort descending
		depthArr.sort(function(a, b){ return b - a; });
	}

	var doneSomething = false;

	// Go through our depth array and check if any of the current depths are not fully opened/closed
	for(var i = 0; i < depthArr.length; ++i){
		doneSomething = openCloseDepth(treeID, depthArr[i], action);
		if(doneSomething){
			break;
		}
	}
}

function openCloseDepth(treeID, depth, action){
	var doneSomething = false;

	for(var item in $(treeID).jstree()._model.data){
		var node = $(treeID).jstree(true).get_node(item);

		if(action == "open"){
			// if the node is on our depth, closed and has children, open it
			if(node.data != undefined && node.data.nodedepth == depth && node.state.opened == false && node.children.length != 0){
				$(treeID).jstree(true).open_node(node.id, false);
				doneSomething = true;
			}
		}else{
			// if the node is on our depth and opened, close it
			if(node.data != undefined && node.data.nodedepth == depth && node.state.opened == true){
				$(treeID).jstree(true).close_node(node.id, false);
				doneSomething = true;
			}
		}
	}

	return doneSomething;
}