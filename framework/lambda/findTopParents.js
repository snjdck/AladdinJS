
function findTopParents(list, isSubFn){
	for(let i=0; i<list.length; ++i){
		let parent = list[i];
		for(let j=list.length-1; j>=0; --j){
			if(i === j)continue;
			if(isSubFn(parent, list[j])){
				list.splice(j, 1);
				if(i > j)--i;
			}
		}
	}
	return list;
}

export default findTopParents;