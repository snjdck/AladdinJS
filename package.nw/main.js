"use strict";

const SVG = require("fileformats/svg");
const Spec = require("blockly/graphic/Spec");
const BlockBase = require("blockly/graphic/BlockBase");
const BlockListDef = require("./BlockListDef");
const BlockEditor = require("./libs/BlockEditor");
const {
	BLOCK_TYPE_EXPRESSION,
	BLOCK_TYPE_STATEMENT,
	BLOCK_TYPE_BREAK,
	BLOCK_TYPE_CONTINUE,
	BLOCK_TYPE_FOR,
	BLOCK_TYPE_IF,
	BLOCK_TYPE_ELSE_IF,
	BLOCK_TYPE_ELSE,

	BLOCK_TYPE_ARDUINO,

	INSERT_PT_BELOW,
	INSERT_PT_ABOVE,
	INSERT_PT_SUB,
	INSERT_PT_WRAP,
	INSERT_PT_CHILD
} = require("blockly/graphic/BlockConst");

let online = require("./libs/Primitives");

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

const offlineDict = Object.create(null);

function setBlockList(parent, blockInfoList){
	parent.innerHTML = "";
	/*
	while(parent.hasChildNodes()){
		parent.removeChild(parent.childNodes[0]);
	}*/
	for(let group of blockInfoList){
		let span = document.createElement("span");
		span.setAttribute("id", group.name);
		parent.appendChild(span);
		span.innerHTML = group.name;
		for(let blockInfo of group.items){
			if(blockInfo.id){
				offlineDict[blockInfo.id] = blockInfo.cpp;
				if(blockInfo.run){
					functionProvider.register(blockInfo.run, blockInfo.id);
				}
			}
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



function _replace(input, index){
	switch(input){
		case "<": return "&lt;";
		case ">": return "&gt;";
		case "&": return "&amp;";
	}
	return null;
}
function escapeHtmlChar(input){
	return input.replace(/[<>&]/g, _replace);
}
function renderColor(code){
	code = replaceColor(code, /(setup|loop)(?=\(\))/g, 0x996600);
	code = replaceColor(code, /for|if|else|while/g, 0x996600);
	code = replaceColor(code, /(?=^|\s)(void|String|int|char|double|boolean|true|false|#include)(?= )/gm, 0x990000);
	code = replaceColor(code, /(PORT|SLOT)_\d/g, 0x996600);
	return code;
}
function replaceColor(code, pattern, color){
	return code.replace(pattern, '<font color="#' + color.toString(16) + '">$&</font>');
}
function setCode(code){
	code = code.replace(/^\s+|\s+$/g, "");
	code = code.replace(/(\t+|\x20+)\n/g, "");
	code = code.replace(/\n{3,}/g, "\n\n");
	code = escapeHtmlChar(code);
	code = renderColor(code);
	var lineList = code.split("\n");
	var lineCount = lineList.length;
	var lineText = [];
	for(var i=0; i<lineCount; ++i){
		lineText.push((i + 1).toString());
	}
	let lineNumberView = document.getElementById("source_code");
	let codeView = lineNumberView.nextElementSibling;
	codeView.innerHTML = "<pre>" + code + "</pre>";
	lineNumberView.innerHTML = "<pre>" + lineText.join("\n") + "</pre>";
}

function createDropdownBtn(id, label, type="btn-info"){
	let div = $(`<div class="btn-group" id="${id}"></div>`);
	div.append(`<button type="button" class="btn ${type}">${label}</button>`);
	div.append(`<button type="button" class="btn ${type} dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>`);
	div.append(`<div class="dropdown-menu dropdown-menu-right"></div>`);
	return div;
}

function createDropdownBtnByData(id, dataList, defaultIndex=0, type="btn-info"){
	dataList = dataList.map(v => Array.isArray(v) ? (v.length < 2 ? [v[0],v[0]] : v) : [v,v]);
	let dropdown = createDropdownBtn(id, dataList[defaultIndex][0], type);
	dropdown.data("value", dataList[defaultIndex][1]);
	dropdown.change(function(evt){
		evt.stopPropagation();
		let value = dataList[$(evt.target).index()];
		dropdown.children(":first-child").text(value[0]);
		dropdown.data("value", value[1]);
	});
	dropdown.on("show.bs.dropdown", function(evt){
		let nowText = this.firstElementChild.innerText;
		let menu = evt.relatedTarget.nextElementSibling;
		menu.innerHTML = dataList.map(([label, key]) => {
			if(label == nowText)
				return `<span class="dropdown-item active">${label}</span>`;
			return `<span class="dropdown-item" onclick="$(this).trigger('change');">${label}</span>`;
		}).join("");
	});
	return dropdown;
}

const tooltipDict = {
	"language_btn":{
		"en":"Language",
		"zh-cn":"语言"
	},
	"board_btn":{
		"en":"Board",
		"zh-cn":"主板"
	}
};
const tooltip = {title:function(){
	if(!this.id)return;
	if(!tooltipDict[this.id]){
		console.warn("tooltip not add", this.id);
		return;
	}
	return tooltipDict[this.id][$("#language_btn").data("value")];
}};

$("#header").append(
	createDropdownBtn("port_btn", "Not Connected"),
	createDropdownBtnByData("board_btn", ["WeeeBot", "WeeeBot mini"]).tooltip(tooltip),
	createDropdownBtnByData("language_btn", [["English","en"],["简体中文", "zh-cn"]]).tooltip(tooltip)
);
(function(){
	const SerialPort = require("./libs/SerialPort");
	const port_btn = $("#port_btn");
	window.setPort = port => {
		port_btn[0].dataset.value = port;
		$("#port_btn>:first-child").text(port || "Not Connected");
		if(port){
			new SerialPort(port, {bitrate:115200}, function(msg){
				if(!msg){
					window.serial = this;
				}else{
					Messenger().post(`serial error: ${msg}`);
					setPort("");
				}
			});
		}else{
			if(window.serial){
				window.serial.close();
			}
		}
	}
	port_btn.on("show.bs.dropdown", function(evt){
		let value = port_btn[0].dataset.value;
		let menu = evt.relatedTarget.nextElementSibling;
		if(value){
			menu.innerHTML = `<span class="dropdown-item" onclick="setPort('');">Disconnect</span>`;
		}else{
			chrome.serial.getDevices(function(devices){
				menu.innerHTML = devices.map(({displayName, path}) => {
					return `<span class="dropdown-item" onclick="setPort('${path}');">${path}\t(${displayName})</span>`;
				}).join("");
			});
		}
	});
})();

$("#console_view").next().append(createDropdownBtnByData("source_code_type", ["C++", "Python"], 0, "btn-secondary btn-sm").tooltip(tooltip));

//*

Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom',
    theme: 'flat'
};

$("#stage_tab input[type=radio]").change(function(){
	let index = $(this).parent().index();
	$("#stage > *:visible").hide();
	$(`#stage > *:eq(${index})`).show();
});

setCode(`#include <WeELF328P.h>

WeDCMotor dc;
Servo servo_9;
WeLEDPanelModuleMatrix7_21 ledPanel_12(12);

void setup(){
    servo_9.attach(9);
    dc.move(1,0);
    dc.reset(1);
    dc.run(0);
    servo_9.write(90);
    servo_9.write(90);
    dc.move(1,0);
    ledPanel_12.showClock(12,30,strcmp(":",":")==0);
    ledPanel_12.showBitmap2(0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,0,0,0,0,0,0,0,0);
    ledPanel_12.turnOffDot(0,0);
}

void loop(){
    servo_9.write(90);
    dc.move(1,0);
    ledPanel_12.showClock(12,30,strcmp(":",":")==0);
    ledPanel_12.showBitmap2(0,0,0,0,0,0,0,0,0,0,0,64,0,0,0,0,0,0,0,0,0,0,0);
    ledPanel_12.turnOffDot(0,0);
    _loop();
}

void _delay(float seconds){
    long endTime = millis() + seconds * 1000;
    while(millis() < endTime)_loop();
}

void _loop(){
}`);
//*/
(function(stage){
	let offset;
	let onMove = evt => stage.style.width = (offset + evt.x) + "px";
	stage.nextElementSibling.addEventListener("mousedown", function(evt){
		offset = stage.getBoundingClientRect().width - evt.x;
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", function(evt){
			window.removeEventListener("mousemove", onMove);
		}, {once:true});
	});
})(document.getElementById("stage"));

(function(svg_scaler){
	svg_scaler.addEventListener("change", function(evt){
		let scale = parseFloat(this.value);
		blockEditArea.dataset.scale = scale;
		blockEditArea.setAttribute("transform", `scale(${scale})`);
	});
})(document.getElementById("svg_scaler"));


let blockEditArea = SVG.createElement("svg");
blockEditArea.setAttribute("width","1000");
blockEditArea.setAttribute("height","1000");
blockEditArea.setAttribute("style","transform-origin:left top;");
createEditAreaContextMenu(blockEditArea);

const blockEditor = new BlockEditor(blockEditArea);


function showCode(){
	let syntaxTree = $("#source_code").data("value");
	let type = $("#source_code_type").data("value");
	let code = blockEditor.genCode(syntaxTree, offlineDict, type);
	if(code){
		setCode(code.join("\n"));
	}else{
		setCode("");
		Messenger().post(`no ${type} code!`);
	}
}
blockEditArea.addEventListener("block_changed", function(){
	$("#source_code").data("value", blockEditor.genSyntaxTree());
	showCode();
});
$("#source_code_type").change(showCode);

createCategoryMenu();
$("#blockEditAreaContainer").append(blockEditArea);

const {Interpreter, FunctionProvider, Thread} = require("blockly");

const functionProvider = new FunctionProvider();

const interpreter = new Interpreter(functionProvider);
interpreter.run();

$("#btn_run").click(function(){
	let syntaxTree = blockEditor.genSyntaxTree();
	if(syntaxTree){
		console.log(syntaxTree);
		interpreter.execute(syntaxTree);
		console.log(interpreter.castCodeListToString(interpreter.compile(syntaxTree)));
	}
});


function createCategoryMenu(){
	let menu = document.getElementById("menu");
	for(let item of BlockListDef){
		let div = document.createElement("div");
		div.setAttribute("style", " text-align: center; background-clip: content-box;-webkit-box-sizing:border-box;");
		let bubble = document.createElement("embed");
		bubble.setAttribute("type", "image/svg+xml");
		bubble.setAttribute("width", 36);
		bubble.setAttribute("height", 28);
		bubble.setAttribute("src", "icons/" + item.name + ".svg");
		bubble.setAttribute("style", "pointer-events: none;");
		let label = document.createElement("a");
		label.setAttribute("class","navbar-link");
		label.setAttribute("href","#"+item.name);
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


(function(deleteArea){
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
})(document.getElementById("deleteArea"));


/*

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