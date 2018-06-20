
import escape from './escape';

let _eval = eval;
let pattern = /<%(=|!|)([^]*?)%>/;
let builtin = {escape:{value:escape}};

let join = (generator, char) => Array.from(generator).join(char);

function* _template(input){
	for(;;){
		let info = pattern.exec(input);
		let head = info ? input.slice(0, info.index) : input;
		if( head)yield `yield ${JSON.stringify(head)};`;
		if(!info)break;
		input = input.slice(info.index + info[0].length);
		let text = info[2];
		switch(info[1]){
			case "=": text = `escape(String(${text}))`;//fallthrough
			case "!": text = `yield ${text};`;break;
		}
		yield text;
	}
}

function template(input){
	let code = join(_template(input), '\n');
	let handler = _eval(`(function*(){with(this){${code}}})`);
	return (self=null) => join(handler.call(Object.create(self, builtin)), '');
}

export default template;