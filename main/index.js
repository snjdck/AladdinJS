
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

const DirectionLight3D = require("lights/DirectionLight3D");
const {Camera3D, Lens} = require("cameras");

const Terrain = require("terrains");

async function onInit(){
	let canvas = document.getElementById("canvas")
	var view3d = new View3D(canvas);
	var gl = view3d.gl;
	
	console.log(gl.getSupportedExtensions());
	//console.log(gl.getExtension("OES_vertex_array_object") === gl.getExtension("OES_vertex_array_object"))
	//ext.createVertexArrayOES,ext.bindVertexArrayOES

	view3d.registerProgram(
		"shader2d&normal",
		"shader3d&normal",
		"shader2d&pick",
		"shader3d&pick",
		"terrain&terrain"
	);

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
//*
	var meshEntity = new MeshEntity();
	meshEntity.mouseEnabled = true;
	meshEntity.mesh = parse(data);
	meshEntity.texture = gl.createDomTexture("texture3");
	view3d.scene3d.root.addChild(meshEntity);

	var terrain = new Terrain();
	terrain.texture = gl.createDomTexture("map_tile");
	view3d.scene3d.root.addChild(terrain);

	let lens = Lens.OrthoLH(canvas.width, canvas.height, -1000, 1000);
	//lens = Lens.PerspectiveFieldOfViewLH(Math.PI / 180 * 70, canvas.height/canvas.width, 0.001, 100000);
	view3d.scene3d.root.addChild(new Camera3D(lens));
//*/
	box.on("enterFrame", () => {
		box.rotation += 1;
		bmp2.rotation -= 2;
	});
}


//document.onmousemove = evt => console.log(evt.clientX, evt.clientY)