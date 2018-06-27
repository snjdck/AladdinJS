
class ArrayKeyMap
{
	constructor(dimention){
		if(typeof dimention !== 'number')dimention = 1;
		Object.defineProperty(this, 'dimention', {value: Math.max(Math.floor(dimention), 1)});
		Object.defineProperty(this, 'map', {value: new Map()});
		Object.defineProperty(this, '_size', {value: 0, writable: true});
	}

	get size(){
		return this._size;
	}

	get(key){
		let {map, dimention} = this;
		for(let i=0, k; map; map=map.get(k)){
			k = fetchKey(key, i++);
			if(i === dimention){
				return map.get(k);
			}
		}
	}

	has(key){
		let {map, dimention} = this;
		for(let i=0, k; map; map=map.get(k)){
			k = fetchKey(key, i++);
			if(i === dimention){
				return map.has(k);
			}
		}
		return false;
	}

	delete(key){
		let {map, dimention} = this;
		for(let i=0, k; map; map=map.get(k)){
			k = fetchKey(key, i++);
			if(i === dimention){
				let success = map.delete(k);
				if(success) --this._size;
				return success;
			}
		}
		return false;
	}

	set(key, value){
		let {map, dimention} = this;
		for(let i=0, k; ; map=map.get(k)){
			k = fetchKey(key, i++);
			if(i === dimention){
				if(!map.has(k))++this._size;
				map.set(k, value);
				break;
			}
			if(!map.has(k)){
				map.set(k, new Map());
			}
		}
		return this;
	}

	clear(){
		this.map.clear();
		this._size = 0;
	}

	*entries(){
		for(let k of this.keys())
			yield [k, this.get(k)];
	}

	keys(){
		return traverse(this.map, [], 0, this.dimention);
	}

	*values(){
		for(let k of this.keys())
			yield this.get(k);
	}

	forEach(fn, thisArg){
		for(let k of this.keys())
			fn.call(thisArg, this.get(k), k, this);
	}

	[Symbol.iterator](){
		return this.entries();
	}
}

function fetchKey(key, i){
	return Array.isArray(key) ? key[i] : i > 0 ? undefined : key;
}

function*traverse(map, keys, index, dimention){
	const nextIndex = index + 1;
	if(nextIndex < dimention){
		for(let [k, v] of map){
			keys[index] = k;
			yield*traverse(v, keys, nextIndex, dimention);
		}
	}else{
		for(let k of map.keys()){
			keys[index] = k;
			yield keys;
		}
	}
}

export default ArrayKeyMap;
