"use strict";

const SVG = require("fileformats/svg");
const Spec = require("blockly/graphic/Spec");
const BlockBase = require("blockly/graphic/BlockBase");
const BlockListDef = require("./BlockListDef");

function createBlockContextMenu(block){
	let menu = new nw.Menu();
	menu.append(new nw.MenuItem({ label: 'Item A', click(){console.log("A click", block)}}));
	menu.append(new nw.MenuItem({ label: 'Item B' }));
	menu.append(new nw.MenuItem({ type: 'separator' }));
	menu.append(new nw.MenuItem({ label: 'Item C' }));
	block.oncontextmenu = function(e){
		e.preventDefault();
		menu.popup(e.x, e.y);
		return false;
	};
}

function createEditAreaContextMenu(target){
	target.oncontextmenu = function(e){
		e.preventDefault();
		return false;
	}
}

function setBlockList(parent, blockInfoList){
	while(parent.hasChildNodes()){
		parent.removeChild(parent.childNodes[0]);
	}
	for(let group of blockInfoList){
		let span = document.createElement("span");
		parent.appendChild(span);
		span.innerHTML = group.name;
		for(let blockInfo of group.items){
			let svg = SVG.createElement("svg");
			parent.appendChild(svg);
			svg.setAttribute("style","display:block;margin:6px 0px 6px 0px;");

			let block = new BlockBase();
			svg.appendChild(block.svg);
			block.setSpec(blockInfo);

			let bound = svg.getBBox();
			svg.setAttribute("width", bound.width);
			svg.setAttribute("height", bound.height);
			block.enableClone(blockEditArea);
		}
	}
}

const headerHeight = 60;
const stageWidth = 500;

const root = document.body;
/*
let header = document.createElement("div");
header.style.position = "absolute";
header.style.width = "100%";
header.style.height = headerHeight + "px";
header.style.backgroundColor = "rgb(0,0,255)";

let stage = document.createElement("div");
stage.style.position = "absolute";
stage.style.width = stageWidth + "px";
stage.style.top = headerHeight + "px";
stage.style.bottom = "0px";
stage.style.backgroundColor = "rgb(0,255,255)";

let blocks = document.createElement("div");
blocks.style.position = "absolute";
blocks.style.top = headerHeight + "px";
blocks.style.left = stageWidth + "px";
blocks.style.bottom = "0px";
blocks.style.right = "0px";
blocks.style.userSelect = "none";
//blocks.style.backgroundColor = "rgb(255,0,255)";

//root.appendChild(header);
//root.appendChild(stage);
root.appendChild(blocks);
*/

let blocks = document.getElementById("blocks");

let blockEditAreaContainer = document.getElementById("blockEditAreaContainer");
let blockList = document.getElementById("blockList");
//let scratchCategoryMenu = document.getElementById("scratchCategoryMenu");
let deleteArea = document.getElementById("deleteArea");

(function(stage){
	let offset;
	let onMove = evt => stage.style.width = (offset + evt.x) + "px";
	let reject = evt => evt.x < stage.getBoundingClientRect().width - 10;
	stage.addEventListener("mousedown", function(evt){
		if(reject(evt))return;
		offset = stage.getBoundingClientRect().width - evt.x;
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", function(evt){
			window.removeEventListener("mousemove", onMove);
		}, {once:true});
	});
	stage.addEventListener("mousemove", function(evt){
		stage.style.cursor = reject(evt) ? "default" : "e-resize";
	});
})(document.getElementById("stage"));


/*
let blockEditAreaContainer = document.createElement("div");
blockEditAreaContainer.setAttribute("class", "alex");
blockEditAreaContainer.style.position = "absolute";
blockEditAreaContainer.style.overflow = "auto";
blockEditAreaContainer.style.top = "1px";
blockEditAreaContainer.style.bottom = "1px";
blockEditAreaContainer.style.right = "1px";
blockEditAreaContainer.style.left = "60px";
//blockEditAreaContainer.style.backgroundColor = "rgb(255,255,255)";
*/

let blockEditArea = SVG.createElement("svg");
blockEditArea.setAttribute("width","2000");
blockEditArea.setAttribute("height","2000");
createEditAreaContextMenu(blockEditArea);
/*
let blockList = document.createElement("div");
blockList.setAttribute("class", "alex");
blockList.style.position = "absolute";
blockList.style.left = blockEditAreaContainer.style.left;
blockList.style.top = "1px";
blockList.style.bottom = "1px";
blockList.style.backgroundColor = "rgba(255,193,107,0.6)";
blockList.style.overflow = "auto";
blockList.style.padding = "6px 0px 6px 0px";
//blockList.style.maxHeight = "100%";
*/
//let scratchCategoryMenu = document.createElement("div");
//scratchCategoryMenu.appendChild(createCategoryMenu(blockEditAreaContainer.style.left));
//scratchCategoryMenu.appendChild(blockList);
/*
let deleteArea = document.createElement("div");
deleteArea.style.position = "absolute";
deleteArea.style.width = "100%";
deleteArea.style.height = "100%";
deleteArea.style.top = "0px";
deleteArea.style.left = "0px";
//deleteArea.style.backgroundColor = "rgba(0,0,0,0.6)";
deleteArea.style.display = "none";
*/
createCategoryMenu();
blockEditAreaContainer.appendChild(blockEditArea);
//blocks.appendChild(blockEditAreaContainer);
//blocks.appendChild(scratchCategoryMenu);
//scratchCategoryMenu.appendChild(deleteArea);

function createCategoryMenu(width){
	/*
	let menu = document.createElement("div");
	menu.style.display = "-webkit-box";
	menu.style.webkitBoxOrient = "vertical";
	//menu.setAttribute("style", "display:-webkit-box; -webkit-box-direction:reverse;");
	
	menu.style.backgroundColor = blockList.style.backgroundColor;
	menu.style.color = "#575E75";
	menu.style.fontSize = "12px";
	menu.style.width = width;
*/
	let menu = document.getElementById("menu");
	/*
	menu.style.display = "box";
	menu.style.boxOrient = "vertical";
	menu.style.boxDirection = "reverse";
	*/
	for(let item of BlockListDef){
		let div = document.createElement("div");
		div.setAttribute("style", " text-align: center; background-clip: content-box;-webkit-box-sizing:border-box;");
		let bubble = document.createElement("embed");
		bubble.setAttribute("type", "image/svg+xml");
		bubble.setAttribute("width", 36);
		bubble.setAttribute("height", 28);
		bubble.setAttribute("src", "icons/" + item.name + ".svg");
		bubble.setAttribute("style", "pointer-events: none;");
		let label = document.createElement("span");
		label.innerHTML = item.name;

		div.appendChild(bubble);
		div.appendChild(label);
		menu.appendChild(div);
	}
	let menuChildNodes = Array.from(menu.childNodes);
	function findNode(path){
		for(let node of path){
			if(menuChildNodes.includes(node)){
				return node;
			}
		}
	}
	window.addEventListener("mousedown", function(evt){
		let target = findNode(evt.path);
		for(let node of menuChildNodes){
			if(node != target){
				node.style.backgroundColor = null;
			}
		}
		if(target){
			target.style.backgroundColor = "yellow";
			blockList.style.display = null;
		}else{
			blockList.style.display = "none";
		}
	})
	return menu;
}

setBlockList(blockList, BlockListDef);
blockList.style.display = "none";
/*
scratchCategoryMenu.onmouseover = function(evt){
	
}
scratchCategoryMenu.onmouseout = function(evt){
	blockList.style.display = "none";
	//console.log("mouse leave", evt);
}
blockList.onmousedown = () => ;
*/


(function(){
	let deleteFlag = false;
	blockEditArea.addEventListener("block_drag_begin", function(evt){
		deleteArea.style.display = null;
	});
	blockEditArea.addEventListener("block_drag_end", function(evt){
		deleteArea.style.display = "none";
		if(deleteFlag){
			evt.block.moveToTrash();
			evt.preventDefault();
		}
	});
	deleteArea.onmouseover = function(){
		this.style.backgroundColor = "rgba(255,0,0,0.5)";
		deleteFlag = true;
	}
	deleteArea.onmouseout = function(){
		this.style.backgroundColor = "rgba(0,0,0,0.5)";
		deleteFlag = false;
	}
})();



/*

let block = new BlockBase();
blockEditArea.appendChild(block.svg);
block.type = 2;
block.setSpec("move %{number,number,STEPS,10} steps");


let test2 = new BlockBase();
blockEditArea.appendChild(test2.svg);
test2.type = 1;
test2.setSpec("time");
test2.setXY(10, 30);


let test3 = new BlockBase();
blockEditArea.appendChild(test3.svg);
test3.type = 5;
test3.setSpec("for");
test3.setXY(10, 90);


test3 = new BlockBase();
blockEditArea.appendChild(test3.svg);
test3.type = 10;
test3.setSpec("arduino");
test3.setXY(10, 200);
*/

/*
setBlockList(document.getElementById("blockList"), BlockListDef);

//document.addEventListener("drag", e => console.log(e));
let blockEditArea = createElementSVG("svg");
document.getElementById("blockEditArea").appendChild(blockEditArea);
blockEditArea.setAttribute("width","2000");
blockEditArea.setAttribute("height","2000");


let blockList = document.getElementById("blockList");
let groupMenu = document.getElementById("groupMenu");

blockList.style.display = "none";
*/
/*
<table width="100%" height="100%">
			<tr>
				<td colspan="2" width="100%" height="20" style="background-color: rgb(0,0,255);">
				</td>
			</tr>
			<tr>
				<td width="500" height="100%" style="background-color: rgb(0,255,255);">
				</td>
				<td width="100%" height="100%">
					<div id="groupMenu" style="display: table-cell;vertical-align: top;">
		<div class="scratchCategoryMenu" style="display: inline-block;">
			<div class="scratchCategoryMenuRow">
				<div class="scratchCategoryMenuItem categorySelected">
					<div class="scratchCategoryItemBubble" style="background-color: rgb(76, 151, 255); border-color: rgb(51, 115, 204);"></div>
					<div class="scratchCategoryMenuItemLabel">Motion</div>
				</div>
			</div>
			<div class="scratchCategoryMenuRow">
				<div class="scratchCategoryMenuItem">
					<div class="scratchCategoryItemBubble" style="background-color: rgb(153, 102, 255); border-color: rgb(119, 77, 203);"></div>
					<div class="scratchCategoryMenuItemLabel">Looks</div>
				</div>
			</div>
			<div class="scratchCategoryMenuRow">
				<div class="scratchCategoryMenuItem">
					<div class="scratchCategoryItemBubble" style="background-color: rgb(214, 92, 214); border-color: rgb(189, 66, 189);"></div>
					<div class="scratchCategoryMenuItemLabel">Sound</div>
				</div>
			</div>
			<div class="scratchCategoryMenuRow">
				<div class="scratchCategoryMenuItem">
					<div class="scratchCategoryItemBubble" style="background-color: rgb(255, 213, 0); border-color: rgb(204, 153, 0);"></div>
					<div class="scratchCategoryMenuItemLabel">Events</div>
				</div>
			</div>
			<div class="scratchCategoryMenuRow">
				<div class="scratchCategoryMenuItem">
					<div class="scratchCategoryItemBubble" style="background-color: rgb(255, 171, 25); border-color: rgb(207, 139, 23);"></div>
					<div class="scratchCategoryMenuItemLabel">Control</div>
				</div>
			</div>
			<div class="scratchCategoryMenuRow">
				<div class="scratchCategoryMenuItem">
					<div class="scratchCategoryItemBubble" style="background-color: rgb(76, 191, 230); border-color: rgb(46, 142, 184);"></div>
					<div class="scratchCategoryMenuItemLabel">Sensing</div>
				</div>
			</div>
			<div class="scratchCategoryMenuRow">
				<div class="scratchCategoryMenuItem">
					<div class="scratchCategoryItemBubble" style="background-color: rgb(64, 191, 74); border-color: rgb(56, 148, 56);"></div>
					<div class="scratchCategoryMenuItemLabel">Operators</div>
				</div>
			</div>
			<div class="scratchCategoryMenuRow">
				<div class="scratchCategoryMenuItem">
					<div class="scratchCategoryItemBubble" style="background-color: rgb(255, 140, 26); border-color: rgb(219, 110, 0);"></div>
					<div class="scratchCategoryMenuItemLabel">Variables</div>
				</div>
			</div>
			<div class="scratchCategoryMenuRow">
				<div class="scratchCategoryMenuItem">
					<div class="scratchCategoryItemBubble" style="background-color: rgb(255, 102, 128); border-color: rgb(255, 77, 106);"></div>
					<div class="scratchCategoryMenuItemLabel">My Blocks</div>
				</div>
			</div>
		</div>
		<div id="blockList" style="max-height:400px;overflow:auto;position: absolute;left:60px;background-color: rgba(255,255,255,0.6);">
		</div>
		</div>
		<div id="blockEditArea" style="overflow:auto; position:absolute; left:500px; right:0px; height:600px;">
		</div>
				</td>
			</tr>
		<div class="blocklyWidgetDiv fieldTextInput" style="display: none; width: 41px; height: 33px; margin-left: 0px; border-radius: 16.5px; border-color: rgb(51, 115, 204); transition: box-shadow 0.25s; box-shadow: rgba(255, 255, 255, 0.3) 0px 0px 0px 4px;">
			<input id="textInput" class="blocklyHtmlInput" style="border-radius: 16.5px; font-size: 14px;">
		</div>
*/

/*
function setBlock(parent, blockInfo){
	
	let block = createElementSVG("g");
	//block.setAttribute("transform", `translate(0,${parent.getBBox().height})`);
	parent.appendChild(block);
	
	block.appendChild(createBlockPath());
	let offsetX = 0;
	for(let item of Spec.parse(blockInfo)){
		let element = setBlockArg(item, offsetX);
		block.appendChild(element);
		offsetX += element.getBBox().width;
	}
	return block;
}

function setBlockArg(item, offsetX){
	let element;
	if(item.type == "label"){
		element = createText(item.value, 0, 24);
		element.setAttribute("transform", `translate(${offsetX},12)`);
		//offsetX += element.getComputedTextLength();
	}else if(item.type == "number"){
		element = createElementSVG("g");
		element.setAttribute("transform", `translate(${offsetX},12)`);
		element.appendChild(createRoundBg());
		let label = createText(item.value || 0, 12, 24, "middle")
		element.appendChild(label);
		element.onclick = function(e){
			let textInput = document.getElementById("textInput");
			textInput.onblur = function(){
				textInput.parentNode.style.display = "none";
				label.innerHTML = textInput.value;
			}
			textInput.parentNode.style.display = "block";
			let bound = label.getBoundingClientRect();
			console.log(bound)
			textInput.parentNode.style.left = bound.left + "px";
			textInput.parentNode.style.top = bound.top + "px";
			textInput.value = label.innerHTML;
			textInput.focus();
		}
	}
	return element;
}
*/


/*
function findBlock(id){
	for(let {items} of BlockListDef){
		for(let item of items){
			if(id == item.id){
				return item;
			}
		}
	}
}
*/

/*
const SVG_NS = "http://www.w3.org/2000/svg";
const HTM_NS = "http://www.w3.org/1999/xhtml";
const createElementSVG = tag => document.createElementNS(SVG_NS, tag);
const createElementHTM = tag => document.createElementNS(HTM_NS, tag);
*/
/*
function createBlockBg(){
	let rect = createElementSVG("rect");
	rect.setAttribute("x","0");
	rect.setAttribute("y","0");
	rect.setAttribute("width","150");
	rect.setAttribute("height","55");
	rect.setAttribute("stroke","red");
	rect.setAttribute("fill","green");
	return rect;
}

function createBlockPath(){
	let path = createElementSVG("path");
	path.setAttribute("fill","#4C97FF");
	path.setAttribute("stroke","#3373CC");
	path.setAttribute("fill-opacity","1");
	path.setAttribute("d","m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 145.3671875 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z");
	return path;
}

function createRoundBg(){
	return SVG.createElement("rect", {
		"fill":"#FFFF00",
		"stroke":"#3373CC",
		"fill-opacity":"1",
		"width":40,
		"height":32,
		"rx":16,
		"ry":16
	});
}

function createText(text, x=0, y=0, anchor="start"){
	let element = createElementSVG("text");
	element.setAttribute("x", x);
	element.setAttribute("y", y);
	element.setAttribute("text-anchor", anchor);
	element.setAttribute("style", "user-select:none;font-size: 14px;");
	element.innerHTML = text;
	return element;
}
*/