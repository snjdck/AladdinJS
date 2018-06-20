
import Injector from 'ioc';
import Msg from './Msg';
import {handleMsg, safeCall} from './utils';

class Module
{
	constructor(){
		Object.defineProperties(this, {
			injector: {value: new Injector()},
			controllerDict: {value: new Map()},
			viewSet: {value: new Set()}
		});
		this.injector.mapValue(Module, this, null, null);
		this.injector.mapValue(Injector, this.injector, null, null);
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
	}

	regModel(model, modelType=null){
		this.injector.mapValue(modelType || model.constructor, model);
	}

	delModel(modelType){
		this.injector.ummap(modelType);
	}

	regView(view){
		console.assert(!this.viewSet.has(view));
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

	collectComponents(){return [];}
}

export default Module;