import Blockly from 'scratch-blocks';
import './locale/en';
import {message, Modal, Input} from 'antd';
import React from 'react';
import wrapFn from 'utils/function/overrideMethod';

Blockly.Toolbox.prototype.width=500;
Blockly.VerticalFlyout.prototype.DEFAULT_WIDTH=400;

wrapFn(Blockly.BlockDragger.prototype, 'pixelsToWorkspaceUnits_', oldFn => function(pt){
	return pt ? oldFn.call(this, pt) : {x:0,y:0};
});

wrapFn(Blockly.FieldNumber, 'fromJson', oldFn => function(options){
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
});

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

Blockly.Procedures.externalProcedureDefCallback = function(){
	message.warn('create function!');
}

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

export {
	showFlyout
}