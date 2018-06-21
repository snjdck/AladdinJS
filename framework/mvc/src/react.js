import {Component} from 'react';
import ReactDOM from 'react-dom';
import Application from './Application';

class ReactApplication extends Application
{
	onStartup(element, container){
		super.onStartup();
		registerViews(this, ReactDOM.render(element, container));
	}
}

class ViewComponent extends Component
{
	componentDidMount(){}
	componentWillUnmount(){
		this.module.delView(this);
	}
	notify(msgName, msgData){
		return this.module.notify(msgName, msgData);
	}
}

class ModuleComponent extends ViewComponent{}

const walk = (function(){
	function* _walk(fiber){
		for(;fiber;fiber=fiber.sibling){
			let flag = fiber.stateNode instanceof ViewComponent;
			if(flag)yield fiber.stateNode;
			yield* _walk(fiber.child);
			if(flag)yield;
		}
	}
	return component => _walk(component._reactInternalFiber);
})();

function registerViews(application, component){
	let moduleStack = [];
	let module;
	for(let node of walk(component)){
		if(node === undefined){
			module = moduleStack.pop();
			continue;
		}
		moduleStack.push(module);
		if(node instanceof ModuleComponent)
			module = application.getModuleByRootViewName(node.constructor.name);
		node.module = module;
		module.regView(node);
	}
}

export {
	ModuleComponent,
	ViewComponent,
	ReactApplication
};