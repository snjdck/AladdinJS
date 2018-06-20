
function cache(fn, keyFn=null){
	let hit = Object.create(null);
	return (...args) => {
		let k = keyFn ? keyFn(...args) : args[0];
		return (k in hit) ? hit[k] : (hit[k] = fn(k));
	};
}

export default cache;