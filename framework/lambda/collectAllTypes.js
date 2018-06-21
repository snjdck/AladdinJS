export default function*(target){
	for(let klass=target.constructor; klass; klass=Object.getPrototypeOf(klass)){
		yield klass;
	}
}