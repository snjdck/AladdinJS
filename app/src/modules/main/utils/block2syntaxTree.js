
import SyntaxTreeFactory from 'blockly/SyntaxTreeFactory';

function castBlockList(blockList){
	return blockList.map(castBlock);
}

function castBlock(block){
	let result = [];
	while(block){
		if(block.type === 'control_repeat'){
			result.push(SyntaxTreeFactory.NewLoop(castArg(block.value)[1], block.statement && castBlock(block.statement.block)));
		}else if(block.type === 'control_forever'){
			result.push(SyntaxTreeFactory.NewWhile(SyntaxTreeFactory.NewNumber(1), block.statement && castBlock(block.statement.block)));
		}else if(block.type === 'control_if'){
			let condition = block.value ? castArg(block.value)[1] : SyntaxTreeFactory.NewNumber(0);
			result.push(SyntaxTreeFactory.NewIf(condition, block.statement && castBlock(block.statement.block)));
		}else if(block.type === 'control_if_else'){
			let condition = block.value ? castArg(block.value)[1] : SyntaxTreeFactory.NewNumber(0);
			if(!block.statement){
				result.push(SyntaxTreeFactory.NewIf(condition));
			}else if(Array.isArray(block.statement)){
				let statement = block.statement.reduce((prev, {name, block}) => {
					prev[name] = block;
					return prev;
				},{});
				result.push(SyntaxTreeFactory.NewIf(condition, castBlock(statement['SUBSTACK'])));
				result.push(SyntaxTreeFactory.NewElse(castBlock(statement['SUBSTACK2'])));
			}else if(block.statement.name === 'SUBSTACK'){
				result.push(SyntaxTreeFactory.NewIf(condition, castBlock(block.statement.block)));
			}else{
				result.push(SyntaxTreeFactory.NewUnless(condition, castBlock(block.statement.block)));
			}
		}else if(block.type === 'control_wait_until'){
			let condition = block.value ? castArg(block.value)[1] : SyntaxTreeFactory.NewNumber(1);
			result.push(SyntaxTreeFactory.NewUntil(condition));
		}else if(block.type === 'control_repeat_until'){
			let condition = block.value ? castArg(block.value)[1] : SyntaxTreeFactory.NewNumber(1);
			result.push(SyntaxTreeFactory.NewUntil(condition, block.statement && castBlock(block.statement.block)));
		}else{
			result.push(SyntaxTreeFactory.NewStatement(block.type, castArgList(block)));
		}
		
		block = block.next && block.next.block;
	}
	return result;
}

function castArgList({field, value}){
	if(!(field || value)){
		return [];
	}
	if(field){
		if(!Array.isArray(field))
			field = [field];
		field = field.map(v => [SyntaxTreeFactory.NewString(v.name), SyntaxTreeFactory.NewString(v['#text'])]);
	}
	if(value){
		if(!Array.isArray(value))
			value = [value];
		value = value.map(castArg);
	}
	value = (field && value) ? field.concat(value) : (field || value);
	return [{type:'object', value}];
}

function castArg({name, shadow, block}){
	let value;
	if(block){
		value = SyntaxTreeFactory.NewExpression(block.type, castArgList(block))
	}else{
		let {field, type} = shadow;
		value = field['#text'];
		if(type.endsWith('_number')){
			value = SyntaxTreeFactory.NewNumber(parseFloat(value));
		}else{
			value = SyntaxTreeFactory.NewString(value);
		}
	}
	return [SyntaxTreeFactory.NewString(name), value];
}

export default castBlockList;