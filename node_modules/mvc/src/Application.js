
import Injector from 'ioc';
import Module from './Module';
import Msg from './Msg';

class Application
{
	constructor(){
		Object.defineProperty(this, "injector",   {value: new Injector()});
		Object.defineProperty(this, "moduleDict", {value: Object.create(null)});
		this.injector.mapValue(Application, this, null, null);
		this.injector.mapValue(Injector, this.injector, null, null);
	}

	regModule(meta){
		let module = new Module(meta);
		console.assert(!(this.hasStartup || (module.name in this.moduleDict)));
		this.moduleDict[module.name] = module;
		module.injector.parent = this.injector;
		return this;
	}

	getModule(moduleName){
		return this.moduleDict[moduleName];
	}

	notify(msgName, msgData){
		for(let module of Object.values(this.moduleDict)){
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
		let moduleList = Array.from(Object.values(this.moduleDict));
		for(let module of moduleList) initAllModels(module);
		for(let module of moduleList) module.activateRoles();
		for(let module of moduleList) initAllServices(module);
		for(let module of moduleList) module.activateRoles();
		for(let module of moduleList) initAllControllers(module);
		for(let module of moduleList) module.onStartup();
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
