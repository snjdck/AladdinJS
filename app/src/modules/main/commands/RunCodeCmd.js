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
import primitives from '../robots/primitives';

const provider = new FunctionProvider();
Object.entries(primitives).forEach(([k, v]) => provider.register(v, k));
const interpreter = new Interpreter(provider);
interpreter.run();

class RunCodeCmd extends Controller
{
	static id = MsgNames.runCode;
	static [InjectTag] = {model: MainModel, bluetooth: BluetoothService};

	exec(){
		Thread.prototype.net = this.bluetooth;
		Thread.prototype.interpreter = interpreter;

		let workspace = this.model.workspace;
		let xml = Blockly.Xml.workspaceToDom(workspace);
		let json = xml2json(xml);
		if(!json.block)return;
		let blocks = Array.isArray(json.block) ? json.block : [json.block];
		let fnDefs = blocks.filter(v => v.type === 'procedures_definition');
		console.log(fnDefs)
		for(let blockList of block2syntaxTree(fnDefs)){
			console.log('fndef',blockList)
			let codeList = interpreter.compile(blockList);
			console.log('fncodes',interpreter.castCodeListToString(codeList));
		}
		//fnDefs = block2syntaxTree(fnDefs).reduce((a, b) => a.concat(b), []);
		let globalContext = interpreter.executeSynchronously(block2syntaxTree(fnDefs).reduce((a, b) => a.concat(b), []));
		blocks = blocks.filter(v => v.type === 'event_whenflagclicked');
		console.log(blocks);
		for(let blockList of block2syntaxTree(blocks)){
			console.log(blockList)
			let codeList = interpreter.compile(blockList);
			console.log(interpreter.castCodeListToString(codeList));
			interpreter.executeAssembly(codeList, globalContext);
		}
	}
}

export default RunCodeCmd;