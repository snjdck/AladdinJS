
import Notifier from './src/Notifier';
import Msg, {createMsgNames} from './src/Msg';
import {ReactApplication, ViewComponent} from './src/react';

function createReactApplication(element, container, ...moduleMetaList){
	let application = new ReactApplication();
	for(let meta of moduleMetaList)
		application.regModule(meta);
	application.startup(element, container);
	return application;
}

export const MsgModuleStartup = Msg.ModuleStartup;
export const Model = Notifier();
export const Service = Notifier();
export const Controller = Notifier();
export {InjectTag} from 'ioc';
export {
	ViewComponent,
	createMsgNames,
	createReactApplication
}
