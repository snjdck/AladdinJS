export default function(target, name, ...args){
	if(target[name] instanceof Function)
		return target[name](...args);
}