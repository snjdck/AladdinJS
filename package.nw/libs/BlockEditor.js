"use strict";

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

const {outputCodeSelf} = require("blockly/graphic/BlockJsonOutput");
const {translate} = require("blockly/runtime/JsonCodeToArduino");

class BlockEditor
{
	constructor(svg){
		this.svg = svg;
	}

	getTopBlocks(){
		return Array.from(this.svg.childNodes)
			.filter(({block}) => block && block.isTopBlock())
			.map(({block}) => block);
	}

	genSyntaxTree(){
		for(let block of this.getTopBlocks()){
			if(block.type != BLOCK_TYPE_ARDUINO){
				continue;
			}
			return outputCodeSelf(block);
		}
	}

	genCode(syntaxTree, context, type){
		switch(type){
			case "C++": return translate(syntaxTree, context);
		}
	}
}

module.exports = BlockEditor;