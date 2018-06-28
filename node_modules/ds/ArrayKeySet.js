
import ArrayKeyMap from './ArrayKeyMap';

class ArrayKeySet
{
	constructor(dimention){
		Object.defineProperty(this, 'map', {value: new ArrayKeyMap(dimention)});
	}

	get size(){
		return this.map.size;
	}

	add(value){
		this.map.set(value);
		return this;
	}

	delete(value){
		return this.map.delete(value)
	}

	has(value){
		return this.map.has(value);
	}

	clear(){
		this.map.clear();
	}

	values(){
		return this.map.keys();
	}

	*entries(){
		for(let v of this.values())
			yield [v, v];
	}

	forEach(fn, thisArg){
		for(let v of this.values())
			fn.call(thisArg, v, v, this);
	}

	[Symbol.iterator](){
		return this.values();
	}
}

export default ArrayKeySet;
