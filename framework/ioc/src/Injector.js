
import safeCall from 'lambda/safeCall';
import collectAllTypes from 'lambda/collectAllTypes';
import ArrayKeyMap from 'ds/ArrayKeyMap';

import InjectionTypeValue from './InjectionTypeValue';
import InjectionTypeClass from './InjectionTypeClass';
import InjectionTypeSingleton from './InjectionTypeSingleton';

class Injector
{
	constructor(parent=null){
		Object.defineProperty(this, 'parent', {value: parent, writable: true});
		Object.defineProperty(this, 'ruleDict', {value: new ArrayKeyMap(2)});
	}

	mapValue(key, value, realInjector=this){
		this.mapRule(key, new InjectionTypeValue(realInjector, value));
	}

	mapClass(key, value=null, realInjector=null){
		this.mapRule(key, new InjectionTypeClass(realInjector || this, fetchFunction(key, value)));
	}

	mapSingleton(key, value=null, realInjector=null){
		this.mapRule(key, new InjectionTypeSingleton(realInjector || this, fetchFunction(key, value)));
	}

	mapRule(key, rule){
		this.ruleDict.set(key, rule);
	}

	mapMetaRule(key, rule){
		this.ruleDict.set([key, KeyMeta], rule);
	}

	unmap(key){
		this.ruleDict.delete(key);
	}

	getRule(key, inherit=true){
		for(let injector=this; injector; injector=injector.parent){
			let rule = injector.ruleDict.get(key);
			if(!inherit || rule)return rule;
		}
	}

	getInstance(type, id){
		let rule = this.getRule([type, id]) || this.getRule([type, KeyMeta]);
		return rule && rule.getValue(this, id);
	}

	injectInto(target){
		let queue = Array.from(collectAllTypes(target)).filter(v => v.hasOwnProperty(InjectTag)).map(v => v[InjectTag]);
		let injection = queue.reduceRight((prev, curr) => Object.assign(prev, curr), Object.create(null));
		for(let [k, v] of Object.entries(injection))
			target[k] = Array.isArray(v) ? this.getInstance(...v) : this.getInstance(v);
		safeCall(target, InjectTag, this);
	}
}

function fetchFunction(key, value){
	let fn = value || Array.isArray(key) ? key[0] : key;
	if(typeof fn !== 'function')throw new Error('value must be function!');
	return fn;
}

const KeyMeta = Symbol('meta');
const InjectTag = Symbol('inject');

export {
	Injector,
	InjectTag
};