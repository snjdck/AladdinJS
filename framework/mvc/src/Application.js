
import Injector from 'ioc';
import Msg from './Msg';
import {Model, Service, View, Controller} from './Notifier';
import {isBaseClass} from './utils';

class Application
{
	constructor(){
		Object.defineProperties(this, {
			injector: {value: new Injector()},
			moduleDict: {value: new Map()}
		});
		this.injector.mapValue(Application, this, null, null);
		this.injector.mapValue(Injector, this.injector, null, null);
	}

	regModule(module){
		console.assert(!(this.hasStartup || this.moduleDict.has(module.constructor)));
		this.moduleDict.set(module.constructor, module);
		module.injector.parent = this.injector;
		return this;
	}

	getModule(moduleType){
		return this.moduleDict.get(moduleType);
	}

	getModuleByRootViewName(rootViewName){
		if(!rootViewName)return;
		for(let module of this.moduleDict.values()){
			if(module.rootViewName == rootViewName){
				return module;
			}
		}
	}

	notify(msgName, msgData){
		for(let module of this.moduleDict.values()){
			module.notify(msgName, msgData);
		}
	}

	startup(...args){
		if(this.hasStartup)return;
		Object.defineProperty(this, "hasStartup", {value:true});
		this.onStartup(...args);
		this.notify(Msg.ModuleStartup);
	}

	onStartup(){
		let moduleList = Array.from(this.moduleDict.values());
		for(let module of moduleList) initAllModels(module);
		for(let module of moduleList) initAllServices(module);
		for(let module of moduleList) initAllViews(module);
		for(let module of moduleList) initAllControllers(module);
	}
}

const initComponents = (filter, initFn) => module => initFn(module, module.collectComponents().filter(filter));

const initAllModels = initComponents(function(v){
	if(!Array.isArray(v))
		return isBaseClass(v, Model);
	if(v.length == 2)
		return isBaseClass(v[1], Model)
	if(v.length == 1)
		return isBaseClass(v[0], Model)
}, function(module, set){
	for(let v of set){
		if(Array.isArray(v)){
			if(v.length == 2){
				module.regModel(v[1], v[0]);
				continue;
			}else if(v.length == 1){
				v = v[0];
			}else{
				throw new Error(v);
			}
		}
		if(v.prototype){
			module.regModel(new v());
		}else{
			module.regModel(v);
		}
	}
});

const initAllServices = initComponents(function(v){
	if(!Array.isArray(v))
		return isBaseClass(v, Service);
	if(v.length == 3)
		return true;
	if(v.length == 1)
		return isBaseClass(v[0], Service);
	if(v.length == 2){
		return (typeof v[1] == "boolean") || isBaseClass(v[1], Service);
	}
	throw new Error(v);
}, function(module, set){
	for(let v of set){
		if(!Array.isArray(v)){
			module.regService(v, v);
		}else if(v.length == 3){
			module.regService(...v);
		}else if(v.length == 2){
			if(typeof v[1] == "boolean"){
				module.regService(v[0], ...v);
			}else{
				module.regService(...v);
			}
		}else if(v.length == 1){
			module.regService(v[0], v[0]);
		}else{
			throw new Error(v);
		}
	}
});

const initAllViews = initComponents(
	v => isBaseClass(v, View),
	(module, set) => set.forEach(v => module.regView(v))
);

const initAllControllers = initComponents(
	v => isBaseClass(v, Controller),
	(module, set) => set.forEach(v => module.regController(v))
);

export default Application;
