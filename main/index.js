
//"chromium-args": "--mixed-context",

const {Bitmap} = require("2d");
const {MeshEntity} = require("3d");
const View3D = require("View3D");
const DisplayObject2D = require("DisplayObject2D");
const {Texture2D} = require("textures");

const parse = require("fileformats/bmd");
const load = require("utils/loader");

const DirectionLight3D = require("lights/DirectionLight3D");
const {Camera3D, Lens} = require("cameras");

const {Terrain} = require("terrains");
const {TextureMaterial, TextureHitTestMaterial} = require("materials");
const TerrainMaterial = require("materials/TerrainMaterial");
const {ColorMatrixFilter, BlurFilter} = require("filters");

async function onInit(){
	let canvas = document.getElementById("canvas")
	var view3d = new View3D(canvas);
	view3d.timeScale = 10;
	var gl = view3d.gl;
	const {assetMgr} = gl;
	
	console.log(gl.getSupportedExtensions());

	var bitmap = new Bitmap();
	bitmap.texture = new Texture2D(gl.createDomTexture("texture"));
	bitmap.texture.scale9grid = [200,200,200,200];
	bitmap.width = bitmap.height = 500;

	var bmp2 = new Bitmap();
	bmp2.x = 480;
	bmp2.texture = new Texture2D(gl.createDomTexture("texture2"));

	var box = new DisplayObject2D();
	box.addChild(bitmap);
	box.addChild(bmp2);
	bmp2.filter = new BlurFilter();

	view3d.scene2d.root.addChild(box);
	box.scale = 0.1;
	box.filter = new ColorMatrixFilter();
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

	let terrainTexture = gl.createDomTexture("map_tile");
	let terrain = new Terrain(new TerrainMaterial(terrainTexture));
	view3d.scene3d.root.addChild(terrain);

	let lens = Lens.OrthoLH(canvas.width, canvas.height, -1000, 1000);
	let camera = new Camera3D(lens);
	let rotation = camera.rotation;
	rotation.rotateAxisX(120 * Math.PI / 180);
	rotation.rotateAxisZ(-45 * Math.PI / 180);
	camera.rotation = rotation;
	//lens = Lens.PerspectiveFieldOfViewLH(Math.PI / 180 * 70, canvas.height/canvas.width, 0.001, 100000);
	view3d.scene3d.root.addChild(camera);
	view3d.scene3d.root.addChild(new DirectionLight3D());
//*/
	let angle = 0;
	box.addListener("enterFrame", function(){
		box.rotation += 0.5;
		bmp2.rotation -= 1;
		//let rotation = meshEntity.rotation;
		//rotation.fromEulerAngles(0, angle++ * Math.PI / 180, 0);
		//rotation.fromAxisAngle({x:1,y:0,z:0}, angle++ * Math.PI / 180);
		//meshEntity.rotation = rotation;
	});
}



//document.onmousemove = evt => console.log(evt.clientX, evt.clientY)