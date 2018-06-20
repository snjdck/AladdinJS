
class Signal
{
	constructor(){
		Object.defineProperty(this, "handlerMap", {value:new Map()});
	}

	add(handler, once=false){
		this.handlerMap.set(handler, once);
	}

	remove(handler){
		this.handlerMap.delete(handler);
	}

	has(handler){
		return this.handlerMap.has(handler);
	}

	notify(...args){
		for(let [handler, once] of this.handlerMap.entries()){
			if(once)this.remove(handler);
			handler(...args);
		}
	}
}

export default Signal;
