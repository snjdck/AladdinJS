
class Msg
{
	constructor(name, data){
		Object.defineProperty(this, "name", {value:name});
		Object.defineProperty(this, "data", {value:data});
		Object.defineProperty(this, "defaultPreventedFlag", {value:false,writable:true});
		Object.defineProperty(this, "processCanceledFlag" , {value:false,writable:true});
		checkMsgNameType(name);
	}

	cancelProcess(){
		this.processCanceledFlag = true;
	}

	isProcessCanceled(){
		return this.processCanceledFlag;
	}

	preventDefault(){
		this.defaultPreventedFlag = true;
	}

	isDefaultPrevented(){
		return this.defaultPreventedFlag;
	}
}

function checkMsgNameType(msgName){
	switch(typeof msgName){
		case "symbol":
		case "string":
			return;
	}
	console.assert(false, "msg.name must be 'symbol' or 'string'!", msgName);
}

function createMsgNames(...nameList){
	let target = this || Object.create(null);
	for(let name of nameList)
		Object.defineProperty(target, name, {value:Symbol(name), enumerable:true});
	return target;
}

createMsgNames.call(Msg, "ModuleStartup");

export {
	Msg as default,
	createMsgNames
};
