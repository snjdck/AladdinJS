
export function toNumber(value){
	let n = Number(value);
	return isNaN(n) ? 0 : n;
}

const boolExcept = ['', '0', 'false'];

export function toBoolean(value){
	switch(typeof value){
		case 'boolean':
			return value;
		case 'string':
			return !boolExcept.includes(value.toLowerCase());
		default:
			return Boolean(value);
	}
}

export function isInt(value){
	switch(typeof value){
		case 'boolean':
			return true;
		case 'string':
			return !value.includes('.');
		case 'number':
			return isNaN(value) || Math.floor(value) === value;
	}
}