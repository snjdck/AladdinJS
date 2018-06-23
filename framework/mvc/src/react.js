import {Component} from 'react';
import ReactDOM from 'react-dom';
import Application from './Application';
import Module from './Module';
import createBatchQueue from 'lambda/createBatchQueue';
import findTopParents from 'lambda/findTopParents';
import {wrapMethod} from 'lambda/wrap';

class ReactApplication extends Application
{
	onStartup(element, container){
		super.onStartup();
		container._reactApplication = this;
		ReactDOM.render(element, container);
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

class ViewComponent extends Component
{
	constructor(props){
		super(props);
		wrapMethod(this, 'UNSAFE_componentWillMount',  () => enqueue(this));
		wrapMethod(this, 'componentWillUnmount', null, () => this.module.delView(this));
	}
	notify(msgName, msgData){
		return this.module.notify(msgName, msgData);
	}
}

class ModuleComponent extends ViewComponent{}

const enqueue = createBatchQueue(queue => findTopParents(queue, isSubFiber).forEach(registerViews));

function isViewComponent(fiber){
	return fiber.stateNode instanceof ViewComponent;
}

const traverseChildren = (function(){
	function* walk(fiber, skipSibling=false){
		for(;fiber;fiber=fiber.sibling){
			let flag = isViewComponent(fiber);
			if(flag)yield fiber.stateNode;
			yield* walk(fiber.child);
			if(flag)yield;
			if(skipSibling)break;
		}
	}
	return component => walk(component._reactInternalFiber, true);
})();

function isSubFiber(parent, child){
	parent = parent._reactInternalFiber;
	child  =  child._reactInternalFiber;
	for(; child; child = child.return){
		if(child === parent){
			return true;
		}
	}
}

function registerViews(component){
	let fiber = component._reactInternalFiber;
	while(fiber.return){
		fiber = fiber.return;
		let module = fiber.stateNode.module;
		if(isViewComponent(fiber) && module instanceof Module){
			module.application.registerViews(component, module);
			return;
		}
	}
	let application = fiber.stateNode.containerInfo._reactApplication;
	application.registerViews(component);
}

export {
	ModuleComponent,
	ViewComponent,
	ReactApplication
};