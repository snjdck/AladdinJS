
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
		for(let i=0;;){
			let k = key[i++];
			let v = map.get(k);
			if(i === dimention){
				return v;
			}
			if(!(v instanceof Map)){
				return;
			}
			map = v;
		}
	}

	set(key, value){
		let {map, dimention} = this;
		for(let i=0;;){
			let k = key[i++];
			if(i === dimention){
				if(!map.has(k))++this._size;
				map.set(k, value);
				return;
			}
			let v = map.get(k);
			if(!(v instanceof Map)){
				map.set(k, (v = new Map()));
			}
			map = v;
		}
	}

	has(key){
		let {map, dimention} = this;
		for(let i=0;;){
			let k = key[i++];
			if(i === dimention)
				return map.has(k);
			let v = map.get(k);
			if(!(v instanceof Map))
				return false;
			map = v;
		}
	}

	delete(key){
		let {map, dimention} = this;
		for(let i=0;;){
			let k = key[i++];
			if(i === dimention){
				let success = map.delete(k);
				if(success) --this._size;
				return success;
			}
			let v = map.get(k);
			if(!(v instanceof Map))
				return false;
			map = v;
		}
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

function*traverse(map, keys, index, dimention){
	if(index + 1 < dimention){
		for(let [k, v] of map){
			keys[index] = k;
			yield*traverse(v, keys, index+1, dimention);
		}
	}else{
		for(let k of map.keys()){
			keys[index] = k;
			yield keys;
		}
	}
}

let map = new ArrayKeyMap(2);
map.set(['a', 100], 'aaa');
map.set(['b', 200], 'bbb');
console.log(map.get(['a']))
console.log(map.get(['b']))
console.log(map.map);
for(let item of map){
	console.log(item, "+++++++++")
}