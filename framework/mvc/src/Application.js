
import Injector from 'ioc';
import Msg from './Msg';

class Application
{
	constructor(){
		Object.defineProperty(this, "injector",   {value: new Injector()});
		Object.defineProperty(this, "moduleDict", {value: new Map()});
		this.injector.mapValue(Application, this, null, null);
		this.injector.mapValue(Injector, this.injector, null, null);
	}

	regModule(module){
		console.assert(!(this.hasStartup || this.moduleDict.has(module.constructor)));
		Object.defineProperty(module, 'application', {value: this});
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
		for(let module of moduleList) initAllControllers(module);
	}
}

function initAllModels(module){
	for(let v of module.collectAllModels()){
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
}

function initAllServices(module){
	for(let v of module.collectAllServices()){
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
}

function initAllControllers(module){
	for(let v of module.collectAllControllers()){
		module.regController(v);
	}
}

export default Application;
