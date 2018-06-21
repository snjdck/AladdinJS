import {Component} from 'react';
import ReactDOM from 'react-dom';
import Application from './Application';

class ReactApplication extends Application
{
	onStartup(element, container){
		super.onStartup();
		this.registerViews(ReactDOM.render(element, container));
	}
	registerViews(component, module=null){
		let moduleStack = [];
		for(let node of walk(component)){
			if(node === undefined){
				module = moduleStack.pop();
				continue;
			}
			moduleStack.push(module);
			if(node instanceof ModuleComponent)
				module = this.getModuleByRootViewName(node.constructor.name);
			node.module = module;
			module.regView(node);
		}
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

export {
	ModuleComponent,
	ViewComponent,
	ReactApplication
};