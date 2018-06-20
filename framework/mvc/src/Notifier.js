
import {InjectTag} from 'ioc';
import Module from './Module';

class Notifier
{
	notify(msgName, msgData=null){
		return this.module.notify(msgName, msgData);
	}
}

Notifier[InjectTag] = {module: Module};

export class Model extends Notifier {}
export class Service extends Notifier {}
export class Controller extends Notifier {}
export class View extends Notifier {}
