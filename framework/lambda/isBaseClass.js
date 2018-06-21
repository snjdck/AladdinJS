
export default function(v, base){
	if(!v.prototype)
		return v instanceof base;
	for(;v;v=Object.getPrototypeOf(v))
		if(v === base)return true;
	return false;
}