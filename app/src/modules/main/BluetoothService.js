

import {Service} from 'mvc';
import PoolSender from 'utils/PoolSender';

const MAX_SIZE = 64;

class BluetoothService extends Service
{
	constructor(){
		super();
		this.sender = new PoolSender(64, 20, 10, v => {
			this.socket.send(v);
			console.log('serial send:', v.length, v.toString());
		});
		let socket = new WebSocket('ws://192.168.1.133:8081');
		socket.addEventListener('open', function(){
			console.log('socket open')
		});
		socket.addEventListener('close', function(){
			console.log('socket close')
		});
		socket.addEventListener('error', function(){
			console.log('socket error')
		});
		//*
		socket.addEventListener('message', evt => {
			console.log('socket data', evt.data);
			let ret = evt.data//.split(' ').pop();
			this.sender.onRecv(parseInt(ret));
		});

		this.socket = socket;
	}

	sendCmd(...args){
		console.log('sendCmd', args)
		return this.send("M" + args.join(" "));
	}

	send(data){
		if(this.socket.readyState !== WebSocket.OPEN){
			return;
		}
		return new Promise(resolve => {
			this.sender.send(Buffer.from(data+'\n'), resolve, data.startsWith('M10 '));
		});
	}

	clear(){
		this.sender.clear();
	}
}

export default BluetoothService;