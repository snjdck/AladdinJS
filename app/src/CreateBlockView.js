import React from 'react';
import Blockly from 'scratch-blocks';

import {Button, Modal} from 'antd';

import {MsgNames} from './modules/main';
import toolbox from './modules/main/robots';
import MainModel from './modules/main/MainModel';
import {ViewComponent, InjectTag} from 'mvc';

class CreateBlockView extends ViewComponent
{
	static [InjectTag] = {model: MainModel};

	constructor(props){
		super(props);
		this.state = {visible:false};
	}

	onOk = () => {
		this.onCancel();
		const newMutation = this.mutationRoot ? this.mutationRoot.mutationToDom(true) : null;
		this.callback(newMutation);
		let workspace = this.model.workspace;
		workspace.updateToolbox(toolbox);
		
	}

	onCancel = () => {
		if(this.workspace){
			this.workspace.dispose();
			this.workspace = null;
		}
		this.setState({visible: false});
	}

	handleAddLabel = () =>{
        if (this.mutationRoot) {
            this.mutationRoot.addLabelExternal();
        }
    }
    handleAddBoolean = () =>{
        if (this.mutationRoot) {
            this.mutationRoot.addBooleanExternal();
        }
    }
    handleAddTextNumber = () =>{
        if (this.mutationRoot) {
            this.mutationRoot.addStringNumberExternal();
        }
    }

	[MsgNames.createFnBlock]({data:[mutator, callback]}){
		//console.log('msg data', msg.data);
		this.callback = callback;
		this.setState({visible:true});
		const oldDefaultToolbox = Blockly.Blocks.defaultToolbox;
        Blockly.Blocks.defaultToolbox = null;
        //this.workspace = ScratchBlocks.inject(this.blocks, workspaceConfig);
		this.workspace = Blockly.inject('blockDefDiv', defaultOptions);
		Blockly.Blocks.defaultToolbox = oldDefaultToolbox;
		

		// Create the procedure declaration block for editing the mutation.
        this.mutationRoot = this.workspace.newBlock('procedures_declaration');

        // Make the declaration immovable, undeletable and have no context menu
        this.mutationRoot.setMovable(false);
        this.mutationRoot.setDeletable(false);
        this.mutationRoot.contextMenu = false;

        this.workspace.addChangeListener(() => {
            this.mutationRoot.onChangeFn();
            // Keep the block centered on the workspace
            const metrics = this.workspace.getMetrics();
            const {x, y} = this.mutationRoot.getRelativeToSurfaceXY();
            const dy = (metrics.viewHeight / 2) - (this.mutationRoot.height / 2) - y;
            let dx = (metrics.viewWidth / 2) - (this.mutationRoot.width / 2) - x;
            // If the procedure declaration is wider than the view width,
            // keep the right-hand side of the procedure in view.
            if (this.mutationRoot.width > metrics.viewWidth) {
                dx = metrics.viewWidth - this.mutationRoot.width - x;
            }
            this.mutationRoot.moveBy(dx, dy);
        });
        this.mutationRoot.domToMutation(mutator);
        this.mutationRoot.initSvg();
        this.mutationRoot.render();
        //this.setState({warp: this.mutationRoot.getWarp()});
        // Allow the initial events to run to position this block, then focus.
        setTimeout(() => {
            this.mutationRoot.focusLastEditor_();
        });
	}

	render(){
		return (<Modal
			title='Create Block'
			visible={this.state.visible}
			onOk={this.onOk}
			onCancel={this.onCancel}
			>
			<div id='blockDefDiv' style={{width:'400px',height:'300px'}}></div>
			<div>
				<Button onClick={this.handleAddBoolean}>add bool</Button>
				<Button onClick={this.handleAddLabel}>add label</Button>
				<Button onClick={this.handleAddTextNumber}>add number</Button>
			</div>
		</Modal>);
	}
}

export default CreateBlockView;

const defaultOptions = {
	media: 'media/',
    zoom: {
        controls: false,
        wheel: false,
        startScale: 0.9
    },

    comments: false,
    collapse: false,
    scrollbars: true
};