
import Injector from 'ioc';
import Msg from './Msg';
import safeCall from 'lambda/safeCall';

class Module
{
	constructor(meta){
		Object.defineProperty(this, "name", {value: meta.name});
		Object.defineProperty(this, "meta", {value: meta});
		Object.defineProperty(this, "injector", {value: new Injector()});
		Object.defineProperty(this, "controllerDict", {value: new Map()});
		Object.defineProperty(this, "viewSet", {value: new Set()});
		Object.defineProperty(this, "roleSet", {value: new Set()});
		this.injector.mapValue(Module, this, null, null);
		this.injector.mapValue(Injector, this.injector, null, null);
		assertMeta(meta);
	}

	notify(msgName, msgData=null){
		let msg = new Msg(msgName, msgData);
		handleMsg(this.controllerDict, msg);
		handleMsg(this.viewSet, msg);
		return !msg.isDefaultPrevented();
	}

	regService(serviceInterface, serviceClass, asLocal=false){
		let injector = asLocal ? this.injector : this.injector.parent;
		injector.mapSingleton(serviceInterface, serviceClass, null, this.injector);
		this.roleSet.add(serviceInterface);
	}

	regModel(model, modelType=null){
		if(!modelType)modelType = model.constructor;
		this.injector.mapValue(modelType, model);
		this.roleSet.add(modelType);
	}

	delModel(modelType){
		this.injector.ummap(modelType);
	}

	regView(view){
		if(this.viewSet.has(view))return;
		this.viewSet.add(view);
		this.injector.injectInto(view);
		safeCall(view, "onReg");
	}

	delView(view){
		safeCall(view, "onDel");
		this.viewSet.delete(view);
	}

	regController(controllerType){
		console.assert(!this.controllerDict.has(controllerType));
		let controller = new controllerType();
		this.controllerDict.set(controllerType, controller);
		this.injector.injectInto(controller);
		safeCall(controller, "onReg");
	}

	delController(controllerType){
		let controller = this.controllerDict.get(controllerType);
		safeCall(controller, "onDel");
		this.controllerDict.delete(controllerType);
	}

	activateRoles(){
		for(let role of this.roleSet)
			this.injector.getInstance(role);
		this.roleSet.clear();
	}

	collectAllModels(){return this.meta.models;}
	collectAllServices(){return this.meta.services;}
	collectAllControllers(){return this.meta.controllers;}
}

function handleMsg(dict, msg){
	for(let target of dict.values()){
		if(msg.isProcessCanceled())break;
		safeCall(target, msg.name, msg);
	}
}

function assertMeta(meta){
	console.assert(typeof meta.name === 'string', 'module must have a name!');
	console.assert(Array.isArray(meta.models), 'models must provided!');
	console.assert(Array.isArray(meta.services), 'services must provided!');
	console.assert(Array.isArray(meta.controllers), 'controllers must provided!');
}

export default Module;