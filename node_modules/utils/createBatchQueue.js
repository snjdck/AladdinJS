
function createBatchQueue(handler){
	let curr = [];
	let next = [];
	function callback(){
		let temp = curr;
		curr = next;
		next = temp;
		handler(next);
		next.splice(0);
	}
	return value => {
		if(curr.length === 0)
			setImmediate(callback);
		curr.push(value);
	};
}

export default createBatchQueue;