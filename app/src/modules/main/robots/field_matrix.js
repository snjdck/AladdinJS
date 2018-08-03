import Blockly from 'scratch-blocks';
import overrideMethod from 'utils/function/overrideMethod';

function createMatrix(key){
	Blockly.Blocks[key.toLowerCase()] = {init(){
		this.jsonInit({
			"message0": "%1",
			"args0": [{
				"type": "field_matrix",
				"name": key
			}],
			"extensions": ["colours_sounds", 'output_number']
		});
	}};
}

createMatrix('MATRIX@21*7');
createMatrix('MATRIX@14*5');

const calcSize = (size, pad, count) =>  (size + pad) * count + pad;

overrideMethod(Blockly.FieldMatrix, 'fromJson', oldFn => function(options){
	let result = oldFn.call(this, options);
	let [w, h] = options.name.split('@')[1].split('*');
	result._w = parseInt(w);
	result._h = parseInt(h);
	return result;
});

overrideMethod(Blockly.FieldMatrix.prototype, 'init', oldFn => function(){
	const nodeSize = Blockly.FieldMatrix.THUMBNAIL_NODE_SIZE;
	const nodePad  = Blockly.FieldMatrix.THUMBNAIL_NODE_PAD;
	const THUMBNAIL_W = calcSize(nodeSize, nodePad, this._w);
	const THUMBNAIL_H = calcSize(nodeSize, nodePad, this._h);
	
	oldFn.call(this);
	this.size_.width = THUMBNAIL_W + Blockly.FieldMatrix.ARROW_SIZE + (Blockly.BlockSvg.DROPDOWN_ARROW_PADDING * 1.5);
	let thumbnail = this.fieldGroup_.firstChild;
	let thumbX = Blockly.BlockSvg.DROPDOWN_ARROW_PADDING / 2;
	let thumbY = (this.size_.height - THUMBNAIL_H) / 2;
	thumbnail.setAttribute('transform', `translate(${thumbX},${thumbY})`);
	
	const attr = {
		'width': nodeSize, 'height': nodeSize,
		'rx': nodePad, 'ry': nodePad
	};
	for (var i = 0; i < this._h; i++) {
		for (var n = 0; n < this._w; n++) {
			if(i < 5 && n < 5)continue;
			attr.x = calcSize(nodeSize, nodePad, n);
			attr.y = calcSize(nodeSize, nodePad, i);
			this.ledThumbNodes_.splice(n+i*this._w, 0, 
				Blockly.utils.createSvgElement('rect', attr, thumbnail)
			);
		}
	}
	this.updateMatrix_();
	if(this.arrow_){
		let arrowX = THUMBNAIL_W + Blockly.BlockSvg.DROPDOWN_ARROW_PADDING * 1.5;
		let arrowY = (this.size_.height - Blockly.FieldMatrix.ARROW_SIZE) / 2;
		this.arrow_.setAttribute('transform', `translate(${arrowX},${arrowY})`);
	}
});

overrideMethod(Blockly.FieldMatrix.prototype, 'showEditor_', oldFn => function(){
	const nodeSize = Blockly.FieldMatrix.MATRIX_NODE_SIZE;
	const nodePad  = Blockly.FieldMatrix.MATRIX_NODE_PAD;
	const matrixW = calcSize(nodeSize, nodePad, this._w);
	const matrixH = calcSize(nodeSize, nodePad, this._h);
	oldFn.call(this);
	this.matrixStage_.setAttribute('width', matrixW+'px');
	this.matrixStage_.setAttribute('height',matrixH+'px');
	
	Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);
	const attr = {
		'width': nodeSize,
		'height': nodeSize,
		'rx': Blockly.FieldMatrix.MATRIX_NODE_RADIUS,
		'ry': Blockly.FieldMatrix.MATRIX_NODE_RADIUS
	};
	for (var i = 0; i < this._h; i++) {
		for (var n = 0; n < this._w; n++) {
			if(i < 5 && n < 5)continue;
			attr.x = calcSize(nodeSize, nodePad, n);
			attr.y = calcSize(nodeSize, nodePad, i);
			this.ledButtons_.splice(n+i*this._w, 0,
				Blockly.utils.createSvgElement('rect', attr, this.matrixStage_)
			);
		}
	}
	this.updateMatrix_();

	let buttonDiv = Blockly.DropDownDiv.getContentDiv().children[1];
	buttonDiv.style = 'display: flex; justify-content: space-around; align-items: center;';

	let iconList = FaceData[this._h + 'x' + this._w];
	
	if(this.wrapperList){
		this.unbindWrapperList();
	}else{
		this.wrapperList = [];
	}

	for(let i=0, n=Math.ceil(iconList.length * 0.5); i<n; ++i){
		let iconDiv = document.createElement('div');
		buttonDiv.insertBefore(iconDiv, buttonDiv.lastChild);
		for(let j=0; j<2; ++j){
			let icon = iconList[i+j*n];
			if(!icon)continue;
			let testBtn = this.createButton2(icon);
			let testBtnDiv = document.createElement('div');
			testBtnDiv.appendChild(testBtn);
			iconDiv.appendChild(testBtnDiv);
			this.wrapperList.push(
				Blockly.bindEvent_(testBtn, 'mousedown', this, () => this.setValue(icon))
			);
		}
	}
});

const FaceData = function(){
	const IconList = [
	[
		' OO      OO ',
		'O  O    O  O',
		'            ',
		'    OOOO    ',
		'     OO     ',
	],
	[
		'OOO      OOO',
		'O O      O O',
		'OOO O  O OOO',
		'     OO     ',
	],
	[
		'O            O',
		' O          O ',
		'  O        O  ',
		'   O      O   ',
		'O   O    O   O',
	],
	[
		'OOO      OOO',
		' O   OO   O ',
		' O  O  O  O ',
	],
	[
		'O  O    O  O ',
		'O O O O O O O',
		'O  O    O  O ',
		'O O   O O O  ',
		'O OOO   O OOO',
	],
	[
		'O  O O',
		'O  O  ',
		'OOOO O',
		'O  O O',
		'O  O O',
	],
	[
		'OOOOOO ',
		'  O O  ',
		' O  O  ',
		'O   O  ',
		'    OOO',
	],
	[
		'OOO  O  O',
		'O O  O O ',
		'O O  OO  ',
		'O O  O O ',
		'OOO  O  O',
	],
	];

	function _replaceIcon(value){
		return value === 'O' ? 1 : 0;
	}

	function createIcon(data, w, h){
		let iconW = data[0].length;
		let iconH = data.length;
		let x = Math.ceil((w - iconW) * 0.5);
		let y = Math.ceil((h - iconH) * 0.5);
		let result = '';
		for(let i=0; i<h; ++i){
			if(i < y || i >= y+iconH){
				result += '0'.repeat(w);
				continue;
			}
			result += '0'.repeat(x) + data[i-y].replace(/[O\x20]/g, _replaceIcon) + '0'.repeat(w - x - iconW);
		}
		return result;
	}

	return {
		'7x21':IconList.map(v => createIcon(v, 21, 7)),
		'5x14':IconList.map(v => createIcon(v, 14, 5)),
	};
}();

Blockly.FieldMatrix.prototype.createButton2 = function(icon) {
	var nodeSize = 2;
	var nodePad = 1;
	var button = Blockly.utils.createSvgElement('svg', {
		'xmlns': 'http://www.w3.org/2000/svg',
		'xmlns:html': 'http://www.w3.org/1999/xhtml',
		'xmlns:xlink': 'http://www.w3.org/1999/xlink',
		'version': '1.1',
		'height': calcSize(nodeSize, nodePad, this._h) + 'px',
		'width': calcSize(nodeSize, nodePad, this._w) + 'px'
	});
	
	for (var i = 0; i < this._h; i++) {
		for (var n = 0; n < this._w; n++) {
			let index = i * this._w + n;
			let isOn = index < icon.length && icon.charAt(index) === '1';
			Blockly.utils.createSvgElement('rect', {
				'x': calcSize(nodeSize, nodePad, n),
				'y': calcSize(nodeSize, nodePad, i),
				'width': nodeSize, 'height': nodeSize,
				'rx': nodePad, 'ry': nodePad,
				'fill': (isOn ? '#FFFFFF' : this.sourceBlock_.colourSecondary_)
			}, button);
		}
	}
	return button;
};

Blockly.FieldMatrix.prototype.unbindWrapperList = function(){
	for(let wrapper of this.wrapperList){
		Blockly.unbindEvent_(wrapper);
	}
	this.wrapperList.length = 0;
};

overrideMethod(Blockly.FieldMatrix.prototype, 'dispose_', oldFn => function(){
	return () => {
		oldFn.call(this)();
		this.unbindWrapperList();
	};
});

Blockly.FieldMatrix.prototype.setValue = function(matrix){
	if(!matrix || matrix === this.matrix_){
		return;
	}
	if(this.sourceBlock_ && Blockly.Events.isEnabled()){
		Blockly.Events.fire(new Blockly.Events.Change(
			this.sourceBlock_, 'field', this.name, this.matrix_, matrix
		));
	}
	this.matrix_ = matrix.padEnd(this._w * this._h, '0');
	this.updateMatrix_();
};

Blockly.FieldMatrix.prototype.clearMatrix_ = function(e){
	if (e.button != 0) return;
	this.setValue('0'.repeat(this._w * this._h));
};

Blockly.FieldMatrix.prototype.fillMatrix_ = function(e) {
	if (e.button != 0) return;
	this.setValue('1'.repeat(this._w * this._h));
};

Blockly.FieldMatrix.prototype.setLEDNode_ = function(led, state){
	if(led < 0 || led >= this._w * this._h)return;
	var matrix = this.matrix_.substr(0, led) + state + this.matrix_.substr(led + 1);
	this.setValue(matrix);
};

Blockly.FieldMatrix.prototype.fillLEDNode_ = function(led){
	this.setLEDNode_(led, '1');
};

Blockly.FieldMatrix.prototype.clearLEDNode_ = function(led){
	this.setLEDNode_(led, '0');
};

Blockly.FieldMatrix.prototype.toggleLEDNode_ = function(led){
	let isOn = this.matrix_.charAt(led) !== '0';
	this.setLEDNode_(led, isOn ? '0' : '1');
};

Blockly.FieldMatrix.prototype.checkForLED_ = function(e){
	var bBox = this.matrixStage_.getBoundingClientRect();
	var nodeSize = Blockly.FieldMatrix.MATRIX_NODE_SIZE;
	var nodePad = Blockly.FieldMatrix.MATRIX_NODE_PAD;
	var dx = e.clientX - bBox.left;
	var dy = e.clientY - bBox.top;
	var min = nodePad / 2;
	var max = bBox.width - (nodePad / 2);
	if (dx < min || dx > max || dy < min || dy > max) {
		return -1;
	}
	var xDiv = Math.trunc((dx - nodePad / 2) / (nodeSize + nodePad));
	var yDiv = Math.trunc((dy - nodePad / 2) / (nodeSize + nodePad));
	return xDiv + (yDiv * this._w);
};
