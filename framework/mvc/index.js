
import Notifier from './src/Notifier';
import Msg from './src/Msg';

export const MsgModuleStartup = Msg.ModuleStartup;
export const Model = Notifier();
export const Service = Notifier();
export const Controller = Notifier();
export {InjectTag} from 'ioc';
export * from './src/Msg';
export * from './src/react';
