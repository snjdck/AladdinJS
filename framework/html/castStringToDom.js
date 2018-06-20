
function castStringToDom(html){
	let div = document.createElement("div");
	div.innerHTML = html;
	return div.childNodes;
}

export default castStringToDom;