
//"chromium-args": "--mixed-context",

const Matrix2D = require("Matrix2D");
const Matrix3D = require("Matrix3D");
const Quaternion = require("Quaternion");
const Bitmap = require("Bitmap");
const MeshEntity = require("MeshEntity");
const View3D = require("View3D");
const DisplayObjectContainer2D = require("DisplayObjectContainer2D");

const parse = require("./bmd");
const load = require("utils/loader");

async function onInit(){
	var view3d = new View3D();
	var gl = view3d.gl;
	//console.log(gl.getSupportedExtensions());
	//console.log(gl.getExtension("OES_vertex_array_object") === gl.getExtension("OES_vertex_array_object"))
	//ext.createVertexArrayOES,ext.bindVertexArrayOES

	view3d.registerProgram("shader2d", "shader3d");

	var bitmap = new Bitmap();
	bitmap.texture = gl.createDomTexture("texture");
	bitmap.texture.scale9grid = [200,200,200,200];
	bitmap.width = bitmap.height = 500;

	var bmp2 = new Bitmap();
	bmp2.x = 480;
	bmp2.texture = gl.createDomTexture("texture2");

	var box = new DisplayObjectContainer2D();
	box.addChild(bitmap);
	box.addChild(bmp2);

	view3d.scene2d.root.addChild(box);
	box.scale = 0.1;

	var data = await load("/assets/test.mesh", "arraybuffer");

	var meshEntity = new MeshEntity();
	meshEntity.mesh = parse(data);
	meshEntity.texture = gl.createDomTexture("texture3");
	view3d.scene3d.root.addChild(meshEntity);

	box.on("enterFrame", () => {
		box.rotation += 1;
		bmp2.rotation -= 2;
	});
}


//document.onmousemove = evt => console.log(evt.clientX, evt.clientY)