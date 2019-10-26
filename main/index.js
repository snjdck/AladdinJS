
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

const world1objects = require('mu/world1objects');
const readMapObj = require('mu/readMapObj');
const mapTileList = require('mu/mapTileList');

async function onInit(){
	let canvas = document.getElementById("canvas")
	var view3d = new View3D(canvas);
	
	const {gl, assetMgr, createTextureArray} = WebGL;
	
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
	fileList = fileList.map(parse);

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
	//view3d.scene2d.root.addChild(bmp3d2);
	bmp3d2.root3d.addChild(weapon2 = new MeshEntity(weaponMesh));

	
	let terrainTexture = await createTextureArray(mapTileList.map(v => `../assets/World1/${v}.jpg`));
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

	for(let {mesh, x, y} of readMapObj(1)){
		let entity = new MeshEntity(mesh);
		view3d.scene3d.root.addChild(entity);
		entity.y = y / 128;
		entity.x = x / 128;
		entity.scale = 0.5
	}
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

//document.onmousemove = evt => console.log(evt.clientX, evt.clientY)