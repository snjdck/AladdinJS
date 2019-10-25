
//"chromium-args": "--mixed-context",

const {Bitmap, Bitmap3D} = require("opengl/2d");
const {MeshEntity} = require("opengl/3d");
const View3D = require("opengl/View3D");
const DisplayObject2D = require("opengl/DisplayObject2D");
const {Texture2D} = require("opengl/textures");

const parse = require("fileformats/bmd");
const load = require("utils/loader");

const DirectionLight3D = require("opengl/lights/DirectionLight3D");
const {Camera3D, Lens, ClearFlags} = require("opengl/cameras");

const {Terrain} = require("opengl/terrains");
const {TextureMaterial, TextureHitTestMaterial} = require("opengl/materials");
const TerrainMaterial = require("opengl/materials/TerrainMaterial");
const {ColorMatrixFilter, BlurFilter} = require("opengl/filters");
const WebGL = require('opengl/WebGL');
const Clock = require('opengl/Clock');

async function onInit(){
	let canvas = document.getElementById("canvas")
	var view3d = new View3D(canvas);
	
	const {gl, assetMgr} = WebGL;
	
	console.log(gl.getSupportedExtensions());

	var bitmap = new Bitmap();
	bitmap.texture = new Texture2D(gl.createDomTexture("texture"));
	bitmap.texture.scale9grid = [20,20,20,20];
	bitmap.width = bitmap.height = 500;

	var bmp2 = new Bitmap();
	bmp2.x = 480;
	bmp2.texture = new Texture2D(gl.createDomTexture("texture2"));

	var bmp3 = new Bitmap();
	bmp3.x = 480;
	bmp3.y = 300;
	bmp3.texture = bmp2.texture;

	var box = new DisplayObject2D();
	box.addChild(bitmap);
	box.addChild(bmp2);
	box.addChild(bmp3);
	//bmp2.filter = new BlurFilter();

	view3d.scene2d.root.addChild(box);
	box.scale = 0.2;
	//box.filter = new ColorMatrixFilter();
//*
	
	let playerMesh = parse(await assetMgr.loadFile("player.bmd.mesh"));
	let weaponMesh = parse(await assetMgr.loadFile("Spear10.bmd.mesh"));
	let fileList = await assetMgr.loadFiles(["ArmorCls", "BootCls", "GloveCls","HelmCls","PantCls"].map(v => v + ".bmd.mesh"));
	fileList = fileList.map(v => parse(v));

	for(let i=0; i<3; ++i){
		let castShadow = i % 2 == 0;
		let playerEntity = new MeshEntity(playerMesh);
		view3d.scene3d.root.addChild(playerEntity);
		playerEntity.y = i * 100;
		playerEntity.x = 300;

		let weaponEntity = new MeshEntity(weaponMesh);
		weaponEntity.castShadow = castShadow;
		playerEntity.bindObjectToBone("knife_gdf", weaponEntity);

		for(let data of fileList){
			let meshEntity = new MeshEntity(data, false);
			meshEntity.castShadow = castShadow;
			meshEntity.shareSkeletonWith(playerEntity);
			view3d.scene3d.root.addChild(meshEntity);
		}
	}

	let weapon1, weapon2;
	let bmp3d = new Bitmap3D(200, 300);
	view3d.scene2d.root.addChild(bmp3d);
	bmp3d.root3d.addChild(weapon1 = new MeshEntity(weaponMesh));

	let bmp3d2 = new Bitmap3D(200, 300);
	bmp3d2.x = 10;
	bmp3d2.y = -10;
	view3d.scene2d.root.addChild(bmp3d2);
	bmp3d2.root3d.addChild(weapon2 = new MeshEntity(weaponMesh));

	let terrainTexture = await createMapTexture(256, 256, 9);
	let terrain = new Terrain(new TerrainMaterial(terrainTexture));
	view3d.scene3d.root.addChild(terrain);

	let lens = Lens.OrthoLH(canvas.width, canvas.height, -1000, 1000);
	let camera = new Camera3D(lens);
	let rotation = camera.rotation;
	rotation.rotateAxisX(120 * Math.PI / 180);
	rotation.rotateAxisZ(-45 * Math.PI / 180);
	camera.rotation = rotation;
	camera.clearFlags = ClearFlags.SolidColor();
	//camera.rect = [-0.5, 0, 0.5, 1];
	//camera.rect = [0, -0.5, 1, 0.5];
	//lens = Lens.PerspectiveFieldOfViewLH(Math.PI / 180 * 70, canvas.height/canvas.width, 0.001, 100000);
	view3d.scene3d.root.addChild(camera);

	if(false){
		let camera = new Camera3D(lens);
		camera.clearFlags = ClearFlags.Depth();
		camera.depth = 1;
		let rotation = camera.rotation;
		rotation.rotateAxisX(120 * Math.PI / 180);
		rotation.rotateAxisZ(-45 * Math.PI / 180);
		camera.rotation = rotation;
		camera.rect = [0.5, 0, 0.3, 0.3];
		//camera.rect = [0, 0.5, 0.5, 0.5];
		view3d.scene3d.root.addChild(camera);
	}
	view3d.scene3d.root.addChild(new DirectionLight3D());
//*/
	let angle = 0;
	Clock.on("enterFrame", function(){
		box.rotation += 0.5;
		bmp2.rotation -= 1;
		//bmp3d.x += 2;
		if(bmp3d.x > 500){
			bmp3d.x = 0;
		}
		//rotation.fromAxisAngle({x:1,y:0,z:0}, angle++ * Math.PI / 180);
		weapon1.rotation = weapon1.rotation.fromEulerAngles(0, angle++ * Math.PI / 180, 0);
	});
}

async function createMapTexture(width, height, depth){
	const {gl} = WebGL;

	//let nameList = ['TileGrass02.jpg', 'TileGround02.jpg'];
	let nameList = ["TileGrass01", "TileGrass02", "TileGround01", "TileGround02", "TileGround03", "TileWater01", "TileWood01", "TileRock01", "TileRock02"];
	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
	gl.texStorage3D(gl.TEXTURE_2D_ARRAY, 1, gl.RGB8, width, height, depth);
	gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	let context = canvas.getContext('2d');

	for(let i=0; i<nameList.length; ++i){
		let image = await loadImage(`../assets/World1/${nameList[i]}.jpg`);
		if(image.width != width){
			context.drawImage(image, 0, 0, width, height);
			image = canvas;
		}
		gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, width, height, 1, gl.RGB, gl.UNSIGNED_BYTE, image);
	}
	return texture;
	/*

const {width, height} = image;

	var texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	
	gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGB8, width, height);
	gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	*/
}

async function loadImage(path){
	let image = new Image();
	image.src = path;
	await image.decode();
	return image;
}


//document.onmousemove = evt => console.log(evt.clientX, evt.clientY)