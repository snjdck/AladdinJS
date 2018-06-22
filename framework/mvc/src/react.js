import {Component} from 'react';
import ReactDOM from 'react-dom';
import Application from './Application';
import Module from './Module';

class ReactApplication extends Application
{
	onStartup(element, container){
		super.onStartup();
		this.registerViews(ReactDOM.render(element, container));
	}
	registerViews(component, module=null){
		let moduleStack = [];
		for(let node of traverseChildren(component)){
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

class ReactModule extends Module
{
	registerViews(component){
		this.application.registerViews(component, this);
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

function isViewComponent(fiber){
	return fiber.stateNode instanceof ViewComponent;
}

const traverseChildren = (function(){
	function* walk(fiber){
		for(;fiber;fiber=fiber.sibling){
			let flag = isViewComponent(fiber);
			if(flag)yield fiber.stateNode;
			yield* walk(fiber.child);
			if(flag)yield;
		}
	}
	return component => walk(component._reactInternalFiber);
})();

function* traverseParents(component){
	let fiber = component._reactInternalFiber;
	while(fiber.return){
		fiber = fiber.return;
		if(isViewComponent(fiber)){
			yield fiber.stateNode;
		}
	}
}

export {
	ModuleComponent,
	ViewComponent,
	ReactApplication,
	ReactModule
};