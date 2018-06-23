
function defineClass(base, init, instanceProps, staticProps){
	function klass(...args){
		if(base)base.apply(this, args);
		if(init)init.apply(this, args);
	}
	if(base){
		Object.setPrototypeOf(klass, base);
		Object.setPrototypeOf(klass.prototype, base.prototype);
	}
	Object.assign(klass.prototype, instanceProps);
	Object.assign(klass, staticProps);
	return klass;
}

export default defineClass;