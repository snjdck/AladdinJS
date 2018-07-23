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
