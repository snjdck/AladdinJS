
import {
	MsgName,
	Controller,
	InjectTag
} from "mvc";

import Blockly from 'scratch-blocks';
import {showFlyout} from '../../../hack';
import MainModel from '../MainModel';
import {MsgNames} from '../';
import toolbox from '../robots';

class InitCmd extends Controller
{
	static id = MsgName.ModuleStartup;
	static [InjectTag] = {model: MainModel};

	exec(){
		Blockly.ScratchMsgs.setLocale('en');
		let side = 'start';
		let workspace = Blockly.inject('blocklyDiv', {
			comments: true,
			disable: false,
			collapse: true,
			media: 'media/',
			readOnly: false,
			rtl: false,
			scrollbars: true,
			toolbox: toolbox,
			toolboxPosition:  side === 'top' || side === 'start' ? 'start' : 'end',
			horizontalLayout: side === 'top' || side === 'bottom',
			trashcan: true,
			sounds: true,
			zoom: {
				controls: true,
				wheel: true,
				startScale: 0.75,
				maxScale: 4,
				minScale: 0.25,
				scaleSpeed: 1.1
			},
			grid:{
				spacing: 20,
				length: 3,
				colour: 'blue',
				snap: true
			},
			colours: {
				fieldShadow: 'rgba(255, 255, 255, 0.3)',
				dragShadowOpacity: 0.6
			}
		});

		workspace.addChangeListener(function(event){
			console.log('addChangeListener', event.type, event.element, event.isOutside);
			if(event.type === 'create'){
				showFlyout(false);
			}
		});

		this.model.workspace = workspace;

		Blockly.Procedures.externalProcedureDefCallback = (...args) => this.notify(MsgNames.createFnBlock, args);
	}
}

export default InitCmd;