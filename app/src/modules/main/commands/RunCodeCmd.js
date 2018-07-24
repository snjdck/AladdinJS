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
import Primitives from '../robots/Primitives';

const VAR_DICT = Object.create(null);
const LIST_DICT = Object.create(null);

const funcDict = {
	control_wait({DURATION}){
		return new Promise(resolve => {
			let expired = performance.now() + DURATION * 1000;
			this.suspendUpdater = () => {
				if(performance.now() >= expired){
					resolve();
				}
			};
		});
	},
	event_whenflagclicked(){

	},
	argument_reporter_boolean({VALUE}){
		console.log('argument_reporter_boolean', VALUE);
		return this.getVar(VALUE);
	},
	argument_reporter_string_number({VALUE}){
		console.log('argument_reporter_string_number', VALUE);
		return this.getVar(VALUE);
	},
	data_listcontents({LIST}){
		console.log('LIST', LIST)
		return 0;
	},
	data_variable({VARIABLE}){
		return VAR_DICT[VARIABLE];
	},
	data_setvariableto({VARIABLE, VALUE}){
		VAR_DICT[VARIABLE] = VALUE;
		console.log(VAR_DICT)
	},
	data_changevariableby({VARIABLE, VALUE}){
		VAR_DICT[VARIABLE] = Number(VAR_DICT[VARIABLE]) + Number(VALUE);
		console.log(VAR_DICT)
	},
	data_showvariable({VARIABLE}){
		console.log('show var:', VARIABLE)
	},
	data_hidevariable({VARIABLE}){
		console.log('hide var:', VARIABLE)
	},
	data_addtolist({LIST, ITEM}){
		if(!(LIST in LIST_DICT)){
			LIST_DICT[LIST] = [];
		}
		LIST_DICT[LIST].push(ITEM);
	},
	data_deleteoflist({LIST, INDEX}){
		if(!(LIST in LIST_DICT)){
			return;
		}
		LIST_DICT[LIST].splice(INDEX-1, 1);
	},
	data_deletealloflist({LIST}){
		if(!(LIST in LIST_DICT)){
			return;
		}
		LIST_DICT[LIST].splice(0);
	},
	data_insertatlist({LIST, INDEX, ITEM}){
		if(!(LIST in LIST_DICT)){
			LIST_DICT[LIST] = [ITEM];
		}else{
			LIST_DICT[LIST].splice(INDEX-1, 0, ITEM);
		}
	},
	data_replaceitemoflist({LIST, INDEX, ITEM}){
		if(!(LIST in LIST_DICT)){
			LIST_DICT[LIST] = [];
		}
		LIST_DICT[LIST][INDEX-1] = ITEM;
	},
	data_itemoflist({LIST, INDEX}){
		if(!(LIST in LIST_DICT)){
			return 0;
		}
		return LIST_DICT[LIST][INDEX-1];
	},
	data_itemnumoflist({LIST, ITEM}){
		if(!(LIST in LIST_DICT)){
			return -1;
		}
		let index = LIST_DICT[LIST].indexOf(ITEM);
		if(index < 0){
			return index;
		}
		return index + 1;
	},
	data_lengthoflist({LIST}){
		if(!(LIST in LIST_DICT)){
			return 0;
		}
		return LIST_DICT[LIST].length;
	},
	data_listcontainsitem({LIST, ITEM}){
		if(!(LIST in LIST_DICT)){
			return 0;
		}
		return LIST_DICT[LIST].includes(ITEM);
	},
	data_showlist({LIST}){
		console.log('show list:', LIST)
	},
	data_hidelist({LIST}){
		console.log('hide list:', LIST)
	}
};

//*
class Provider extends FunctionProvider
{
	init(){
		super.init();
		Object.entries(funcDict).forEach(([k, v]) => this.register(v, k));
		Object.entries(Primitives).forEach(([k, v]) => this.register(v, k));
	}
}
//*/
const interpreter = new Interpreter(new Provider());
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