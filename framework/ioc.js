
class InjectionTypeValue
{
	constructor(realInjector, value){
		this.realInjector = realInjector;
		this.value = value;
	}
	getValue(injector, id){
		if(this.realInjector){
			injector = this.realInjector;
			this.realInjector = null;
			injector.injectInto(this.value);
		}
		return this.value;
	}
}

class InjectionTypeClass
{
	constructor(realInjector, klass){
		this.realInjector = realInjector;
		this.klass = klass;
	}
	getValue(injector, id){
		let value = newClass(this.klass);
		this.realInjector.injectInto(value);
		return value;
	}
}

class InjectionTypeSingleton
{
	constructor(realInjector, klass){
		this.realInjector = realInjector;
		this.klass = klass;
		this.value = null;
	}
	getValue(injector, id){
		if(!this.value){
			this.value = newClass(this.klass);
			this.realInjector.injectInto(this.value);
			this.realInjector = null;
			this.klass = null;
		}
		return this.value;
	}
}

const newClass = klass => klass.prototype ? new klass() : klass();

class Injector
{
	static calcKey(type, id=null, isMeta=false){
		let key = (type instanceof Function) ? type.name : type.toString();
		return isMeta ? `${key}@` : (id ? `${key}@${id}` : key);
	}

	static calcMetaKey(type){
		return this.calcKey(type, null, true);
	}

	constructor(parent=null){
		Object.defineProperties(this, {
			parent: {
				value: parent,
				writable: true
			},
			ruleDict: {
				value: Object.create(null)
			}
		});
	}

	mapValue(type, value, id=null, realInjector=true){
		if(realInjector === true) realInjector = this;
		this.mapRule(type, new InjectionTypeValue(realInjector, value), id);
	}

	mapClass(type, value=null, id=null, realInjector=null){
		this.mapRule(type, new InjectionTypeClass(realInjector || this, value || type), id);
	}

	mapSingleton(type, value=null, id=null, realInjector=null){
		this.mapRule(type, new InjectionTypeSingleton(realInjector || this, value || type), id);
	}

	mapRule(type, rule, id=null){
		this.ruleDict[Injector.calcKey(type, id)] = rule;
	}

	mapMetaRule(type, rule){
		this.ruleDict[Injector.calcMetaKey(type)] = rule;
	}

	unmap(type, id=null){
		delete this.ruleDict[Injector.calcKey(type, id)];
	}

	getRule(key, inherit=true){
		for(let injector=this; injector; injector=injector.parent){
			let rule = injector.ruleDict[key];
			if(!inherit || rule)return rule;
		}
	}

	getInstance(type, id=null){
		let rule = this.getRule(Injector.calcKey(type, id)) || this.getRule(Injector.calcMetaKey(type));
		return rule && rule.getValue(this, id);
	}

	injectInto(target){
		let queue = [];
		for(let klass=target.constructor; klass; klass=Object.getPrototypeOf(klass)){
			queue.push(klass[InjectTag]);
		}
		let injection = queue.filter(Boolean).reduceRight((prev, curr) => Object.assign(prev, curr), Object.create(null));
		for(let [k, v] of Object.entries(injection)){
			target[k] = Array.isArray(v) ? this.getInstance(...v) : this.getInstance(v);
		}
		let callback = target[InjectTag];
		if(callback instanceof Function){
			callback.call(target, this);
		}
	}
}

const InjectTag = Symbol("InjectTag");
Object.defineProperty(Injector, "Tag", {value:InjectTag});

export {
	Injector as default,
	InjectTag
};