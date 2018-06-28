import {InjectTag} from 'ioc';
import Module from './Module';
import defineClass from 'lambda/defineClass';

const instanceProps = {
	notify(msgName, msgData){
		return this.module.notify(msgName, msgData);
	}
};

const staticProps = {
	[InjectTag]: {module: Module}
};

export default (baseClass, initFn) => defineClass(baseClass, initFn, instanceProps, staticProps);