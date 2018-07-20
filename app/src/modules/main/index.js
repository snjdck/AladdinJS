
import {ModuleMeta} from 'mvc';

import commands from './commands'
import MainModel from './MainModel';
import MainService from './MainService';
import BluetoothService from './BluetoothService';
import MsgNames from './MsgNames';

export {
	MsgNames
}

export default ModuleMeta({
	name: 'MainModule',
	models:[MainModel],
	services:[MainService, BluetoothService],
	controllers:commands,
	plugins:[],
	message:{
		interested:[],
		dispatched:[]
	}
});