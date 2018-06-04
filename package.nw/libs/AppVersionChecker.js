"use strict";

const os = require("os");

const isVersionGreatThan = (a, b) => castVersion(a) > castVersion(b);
const castVersion = v => v ? v.split(".").map((n,i)=>parseInt(n)/Math.pow(10,i)).reduce((a,b)=>a+b) : 0;
const uniquePath = path => `${path}?r=${Math.random()}`;

const CONFIG_PATH = "http://ox2nuzbz7.bkt.clouddn.com/config/weeecode_version.json";
let HOME_PAGE = "http://www.weeemake.com/download/";

const html = `
<div class="modal" tabindex="-1"">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">There is a newer version</h5>
				<button type="button" class="close" data-dismiss="modal">
					<span>&times;</span>
				</button>
			</div>
			<div class="modal-body"></div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
				<button type="button" class="btn btn-primary" data-dismiss="modal">Download now</button>
			</div>
		</div>
	</div>
</div>
`;

$.get(uniquePath(CONFIG_PATH), function(result){
	let version = "1.0.1";
	if(os.platform() == "win32"){
	}else{
	}
	if(!isVersionGreatThan(version, nw.App.manifest.version)){
		return;
	}
	let modal = $(html).appendTo("body");
	modal.find("div[class~=modal-body]").html("Hello");
	modal.find("button[class~=btn-primary]").click(() => window.open(HOME_PAGE));
	modal.on("hidden.bs.modal", () => modal.remove());
	modal.modal({backdrop:true});
});


