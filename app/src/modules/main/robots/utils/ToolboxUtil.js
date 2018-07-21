
function newXML(name, attributes, children=[]){
	return [name, attributes, ...children];
}

function newBlock(type, children=[]){
	return ["block", {type, id:type}, ...children];
}

function newCategory(name, id, colour, children=[]){
	let result = ["category", {name, id, colour:colour.primary, secondaryColour:colour.tertiary}];
	if(Array.isArray(children))
		result.push(...children);
	else
		result[1].custom = children;
	return result;
}

function newNumberValue(name, defaultValue, shadowType='math_number'){
	return ["value", {name}, ["shadow", {"type":shadowType}, ["field", {"name":"NUM"}, defaultValue]]];
}

function newTextValue(name, defaultValue){
	return ["value", {name}, ["shadow", {"type":"text"}, ["field", {"name":"TEXT"}, defaultValue]]];
}

function newDropdownValue(name, defaultValue, shadow=name){
	return ["value", {name}, ["shadow", {"type":shadow.toLowerCase()}, ["field", {name:shadow}, defaultValue]]];
}

const newLabel = text => newXML('label', {text});

export {
	newXML,
	newBlock,
	newCategory,
	newNumberValue,
	newTextValue,
	newDropdownValue,
	newLabel
};