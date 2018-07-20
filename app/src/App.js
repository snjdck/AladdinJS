import React, { Component } from 'react';
import Blockly from 'scratch-blocks';
import './App.css';
import {Button} from 'antd';
//import {showFlyout} from './hack';
//import xml2json from 'fileformats/xml/toJSON'
import {MsgNames} from './modules/main';
import {ViewComponent} from 'mvc';

/*
workspace.setVisible(true)
//*/






class App extends ViewComponent {
	static defaultProps = {module:'MainModule'};
	constructor(props){
		super(props);
		this.state = {codeRunFlag:false};
	}
	runCode = () => {
		this.setState(oldState => {
			let msgName = oldState.codeRunFlag ? MsgNames.stopCode : MsgNames.runCode;
			this.notify(msgName);
			return {codeRunFlag:!oldState.codeRunFlag}
		});
	}

	componentDidMount(){
	}
	render(){
		let {codeRunFlag} = this.state;
		return (
			<div className="App">
				<div id="blocklyDiv"></div>
				<Button className='goBackBtn'>Go Back</Button>
				<Button className="runBtn" type={codeRunFlag ? "danger" :"primary"} onClick={this.runCode}>{codeRunFlag ? "Stop" :"Start"}</Button>
			</div>
		);
	}
}

export default App;

