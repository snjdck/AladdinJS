import Blockly from 'scratch-blocks';
import {message, Modal, Input} from 'antd';
import React from 'react';
import wrapFn from 'utils/function/overrideMethod';

Blockly.Toolbox.prototype.width=500;
Blockly.VerticalFlyout.prototype.DEFAULT_WIDTH=400;

function copyProps(to, from, props){
	for(let prop of props){
		to[prop] = from[prop];
	}
}

copyProps(
	Blockly.FieldTextDropdown.prototype,
	Blockly.FieldDropdown.prototype,
	['getOptions', 'onItemSelected', 'isOptionListDynamic']
);
/*
Blockly.ScratchMsgs.translate = function(msgId, defaultMsg, useLocale){
	let locale = useLocale || Blockly.ScratchMsgs.currentLocale_;
	if(locale in Blockly.ScratchMsgs.locales){
		let messages = Blockly.ScratchMsgs.locales[locale];
		if(Object.keys(messages).includes(msgId)) {
			return messages[msgId];
		}
	}
	return defaultMsg;
}

wrapFn(Blockly.ScratchMsgs, 'translate', oldFn => function(key, defaultMsg, lang){
	let result = oldFn.call(this, key, defaultMsg, lang);
	if(lang !== 'en' && result === undefined){
		result = oldFn.call(this, key, defaultMsg, 'en');
	}
	return result;
});
*/
function translateLocale(value){
	return value.replace(/%\{BKY_(\w+)\}/, function(match, p1){
		return Blockly.ScratchMsgs.translate(p1);
	});
}

wrapFn(Blockly.FieldDropdown.prototype, 'showEditor_', oldFn => function(){
	oldFn.call(this);
	let list = document.querySelectorAll("div.goog-menuitem-content");
	for(let node of list){
		let oldText = node.innerHTML;
		let newText = translateLocale(oldText);
		if(newText !== oldText){
			node.innerHTML = newText;
		}
	}
});

wrapFn(Blockly.FieldDropdown.prototype, 'setValue', oldFn => function(newValue){
	oldFn.call(this, newValue);
	let newText = translateLocale(this.text_);
	if(newText !== this.text_){
		this.text_ = newText;
		this.forceRerender();
	}
});

wrapFn(Blockly.BlockDragger.prototype, 'pixelsToWorkspaceUnits_', oldFn => function(pt){
	return pt ? oldFn.call(this, pt) : {x:0,y:0};
});

wrapFn(Blockly.FieldDropdown, 'fromJson', oldFn => function(options){
	let result = oldFn.call(this, options);
	const key = 'defaultIndex';
	if(key in options){
		let index = options[key];
		if(index > 0){
			result.setValue(result.getOptions()[index][1]);
		}
	}
	return result;
});

const fromJson = oldFn => function(options){
	let result = oldFn.call(this, options);
	const hasMin = 'min' in options;
	const hasMax = 'max' in options;
	if(hasMin && hasMax){
		let min = parseFloat(options.min);
		let max = parseFloat(options.max);
		result.setValidator(value => Math.min(max, Math.max(min, parseFloat(value))));
	}else if(hasMin){
		let min = parseFloat(options.min);
		result.setValidator(value => Math.max(min, parseFloat(value)));
	}else if(hasMax){
		let max = parseFloat(options.max);
		result.setValidator(value => Math.min(max, parseFloat(value)));
	}
	return result;
}

wrapFn(Blockly.FieldNumber, 'fromJson', fromJson);
wrapFn(Blockly.FieldNumberDropdown, 'fromJson', fromJson);

Blockly.alert=function(info, callback){
	message.warn(info, callback);
};
Blockly.confirm=function(info, callback){
	Modal.confirm({
		content: info,
		maskClosable: true,
		onOk(){
			callback(true)
		},
		onCancel(){
			callback(false)
		}
	});
};
Blockly.prompt=function(title, defaultInput, callback){
	let content = '';
	function onChange(evt){
		content = evt.target.value;
	}
	Modal.confirm({
		title,
		content: <Input onChange={onChange} placeholder={defaultInput} />,
		maskClosable: true,
		onOk(){
			callback(content);
		},
		onCancel(){
			callback();
		}
	});
};

function showFlyout(value){
	value = value ? 'visible' : 'hidden';
	let elementList = ['blocklyFlyout', 'blocklyFlyoutScrollbar'];
	elementList = elementList.map(v => document.getElementsByClassName(v)[0]);
	for(let element of elementList){
		element.style.visibility = value;
	}
}

Blockly.Toolbox.prototype.setSelectedItemFactory = function(item) {
  var selectedItem = item;
  return function(){
  	showFlyout(true);
    this.setSelectedItem(selectedItem);
    Blockly.Touch.clearTouchIdentifier();
  };
};

wrapFn(Blockly.WorkspaceSvg.prototype, 'recordDeleteAreas_', oldFn => function(){
	oldFn.call(this);
	let rect = this.deleteAreaToolbox_;
	if(rect){
		rect.left = 0;
		rect.top = 0;
		rect.width = 100;
	}
});
/*
wrapFn(Blockly.ScrollbarPair.prototype, 'resize', oldFn => function(){
	return
	var hostMetrics = this.workspace_.getMetrics();
	console.log(hostMetrics);
	oldFn.call(this);
});
*/
wrapFn(Blockly.WorkspaceSvg, 'getTopLevelWorkspaceMetrics_', oldFn => function(){
	let metrics = oldFn.call(this);
	const delta = 400;
	metrics.absoluteLeft -= delta;
	metrics.toolboxWidth -= delta;
	metrics.viewWidth += delta;
	return metrics;
});
/*
wrapFn(Blockly.WorkspaceSvg, 'getContentDimensionsBounded_', oldFn => function(ws, svgSize){
	let content = Blockly.WorkspaceSvg.getContentDimensionsExact_(ws);

	var viewWidth = svgSize.width;
	var viewHeight = svgSize.height;
	var halfWidth = 10;
	var halfHeight = 10;
	
	let left = Math.min(content.left - halfWidth, content.right - viewWidth);
	let top = Math.min(content.top - halfHeight, content.bottom - viewHeight);
	let right = Math.max(content.right + halfWidth, content.left + viewWidth);
	let bottom = Math.max(content.bottom + halfHeight, content.top + viewHeight);

	return {
		left, top,
		width : right - left,
		height: bottom - top
	};
});
*/
export {
	showFlyout
}