
function handleMsg(dict, msg){
	for(let target of dict.values()){
		if(msg.isProcessCanceled())break;
		safeCall(target, msg.name, msg);
	}
}

function safeCall(target, name, ...args){
	if(target[name] instanceof Function)
		return target[name](...args);
}

function isBaseClass(v, base){
	if(!v.prototype)
		return v instanceof base;
	for(;v;v=Object.getPrototypeOf(v))
		if(v === base)return true;
}

export {
	handleMsg,
	safeCall,
	isBaseClass
};
