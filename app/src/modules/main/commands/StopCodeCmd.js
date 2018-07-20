import {
	Controller,
	InjectTag
} from "mvc";

import Blockly from 'scratch-blocks';
import MainModel from '../MainModel';
import MsgNames from '../MsgNames';
import BluetoothService from '../BluetoothService';

import xml2json from 'fileformats/xml/toJSON';

import block2syntaxTree from '../utils/block2syntaxTree';
import {Interpreter, FunctionProvider, Thread} from 'blockly';



class StopCodeCmd extends Controller
{
	static id = MsgNames.stopCode;
	static [InjectTag] = {model: MainModel, bluetooth: BluetoothService};

	exec(){
		let interpreter = Thread.prototype.interpreter;
		if(interpreter){
			interpreter.stopAllThreads();
		}
		this.bluetooth.clear();
	}
}

export default StopCodeCmd;