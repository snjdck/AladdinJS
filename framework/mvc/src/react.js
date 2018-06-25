import {Component} from 'react';
import ReactDOM from 'react-dom';
import Application from './Application';
import Notifier from './Notifier';
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
			if(node.props.module)
				module = this.getModule(node.props.module);
			module.regView(node);
		}
	}
}

const ViewComponent = Notifier(Component, function(){
	wrapMethod(this, 'UNSAFE_componentWillMount',  () => enqueue(this));
	wrapMethod(this, 'componentWillUnmount', null, () => this.module.delView(this));
});

const enqueue = createBatchQueue(queue => findTopParents(queue, isSubFiber).forEach(registerViews));
const isViewComponent = fiber => fiber.stateNode instanceof ViewComponent;
const getFiber = component => component._reactInternalFiber;

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
	return component => walk(getFiber(component), true);
})();

function isSubFiber(parent, child){
	parent = getFiber(parent);
	child  = getFiber(child);
	for(; child; child = child.return){
		if(child === parent){
			return true;
		}
	}
}

function registerViews(component){
	let module;
	let fiber = getFiber(component);
	while(fiber.return){
		fiber = fiber.return;
		if(module || !isViewComponent(fiber))continue;
		module = fiber.stateNode.module;
	}
	let application = fiber.stateNode.containerInfo._reactApplication;
	application.registerViews(component, module);
}

export {
	ReactApplication,
	ViewComponent
};