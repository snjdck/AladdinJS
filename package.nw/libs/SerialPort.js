"use strict";

const EventEmitter = require("events");
const {serial, runtime} = chrome;

class SerialPort extends EventEmitter
{
	static list(){
		return new Promise(resolve => {
			serial.getDevices(ports => {
				resolve(ports
					.filter(port => /^USB/.test(port.displayName))
					.map(port => port.path)
				);
			});
		});
	}

	constructor(path, options, callback){
		super();
		this.onData = this.onData.bind(this);
		this.connectionId = -1;
		serial.connect(path, options, info => {
			if(info){
				this.connectionId = info.connectionId;
				serial.onReceive.addListener(this.onData);
				callback.call(this);
			}else{
				callback.call(this, runtime.lastError.message);
			}
		});
	}

	onData(info){
		if(info.connectionId != this.connectionId){
			return;
		}
		this.emit("data", Buffer.from(info.data));
	}

	write(data){
		if(this.connectionId < 0)
			return;
		let offset = data.byteOffset;
		let length = data.byteLength;
		serial.send(this.connectionId, data.buffer.slice(offset, offset+length), ()=>{});
	}

	sendLine(line){
		this.write(Buffer.from(line+"\n"));
		return new Promise((resolve, reject) => {
			let buffer = "";
			this.on("data", data => {
				buffer += data.toString();
				let index = buffer.indexOf("\n");
				if(index < 0)return;
				this.removeAllListeners();
				resolve(buffer.slice(0, index).trim());
			});
		});
	}

	sendMsg(...args){
		return this.sendLine("M" + args.join(" "));
	}

	close(){
		serial.disconnect(this.connectionId, () => {
			this.emit("close");
		});
	}
}

module.exports = SerialPort;