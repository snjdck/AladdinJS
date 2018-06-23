import {InjectTag} from 'ioc';
import Module from './Module';

function Notifier(baseClass=Object, initFn=null){
	return class extends baseClass {
		static [InjectTag] = {module: Module};
		constructor(...args){
			super(...args);
			if(initFn)initFn.apply(this, args);
		}
		notify(msgName, msgData){
			return this.module.notify(msgName, msgData);
		}
	}
}

export default Notifier;