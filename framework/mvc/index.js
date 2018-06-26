
import Notifier from './src/Notifier';
import Msg, {createMsgNames} from './src/Msg';
import {ReactApplication, ViewComponent} from './src/react';

function startupReactApplication(element, container, ...moduleMetaList){
	moduleMetaList.reduce((app, mod) => app.regModule(mod), new ReactApplication()).startup(element, container);
}

export const MsgModuleStartup = Msg.ModuleStartup;
export const Model = Notifier();
export const Service = Notifier();
export const Controller = Notifier();
export {InjectTag} from 'ioc';
export {
	ViewComponent,
	createMsgNames,
	startupReactApplication
}
