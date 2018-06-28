
function wrap(func, prev, next){
	if(!(prev || next))return func;
	if(!func){
		if(!prev)return next;
		if(!next)return prev;
	}
	return function(...args){
		if(prev)prev.apply(this, args);
		if(func)func.apply(this, args);
		if(next)next.apply(this, args);
	}
}

function wrapMethod(target, name, prevCall, nextCall){
	target[name] = wrap(target[name], prevCall, nextCall);
}

export {
	wrap,
	wrapMethod
};