class ByteArray
{
	constructor(buffer){
		this.littleEndian = true;
		this.buffer = buffer;
		this.decoder = new TextDecoder();
		this.dataView = new DataView(buffer);
		this.offset = 0;
	}

	get bytesAvailable(){
		return this.dataView.byteLength - this.offset;
	}

	readString1(){
		var count = this.readU8();
		var buffer = this.buffer.slice(this.offset, this.offset+count);
		var value = this.decoder.decode(buffer);
		this.offset += count;
		return value;
	}

	readU8(){
		var value = this.dataView.getUint8(this.offset);
		++this.offset;
		return value;
	}

	readU16(){
		var value = this.dataView.getUint16(this.offset, true);
		this.offset += 2;
		return value;
	}

	readS16(){
		var value = this.dataView.getInt16(this.offset, true);
		this.offset += 2;
		return value;
	}

	readU32(){
		var value = this.dataView.getUint32(this.offset, true);
		this.offset += 4;
		return value;
	}

	readS32(){
		var value = this.dataView.getInt32(this.offset, true);
		this.offset += 4;
		return value;
	}

	readFloat(){
		var value = this.dataView.getFloat32(this.offset, true);
		this.offset += 4;
		return value;
	}
}

function doList(ba, handler){
	var count = ba.readU16();
	var result = [];
	for(var i=0; i<count; ++i){
		result[i] = handler(ba, i);
	}
	return result;
}

function parse(data){
	var ba = new ByteArray(data);
	var formatList = doList(ba, ba => {
		var name = ba.readString1();
		var format = ba.readString1();
		var offset = ba.readU8();
		return {name, format, offset};
	});
	var subMeshList = doList(ba, ba => {
		var texture = ba.readString1();
		var vertexCount = ba.readU16();
		var data32PerVertex = ba.readU8();
		var count = vertexCount * data32PerVertex * 4;
		var vertexData = data.slice(ba.offset, ba.offset + count);
		ba.offset += count;
		var indexCount = ba.readU32();
		var indexData = data.slice(ba.offset, ba.offset + indexCount * 2);
		ba.offset += indexCount * 2;
		var boneCount = ba.readU8();
		var boneData = [];
		for(var i=0; i<boneCount; ++i){
			boneData[i] = ba.readU8();
		}
		return {vertexData, indexData, data32PerVertex, boneData};
	});
	var boneList = doList(ba, ba => {
		var boneName = ba.readString1();
		var boneID = ba.readS16();
		var bonePID = ba.readS16();
		return {boneName, boneID, bonePID};
	});
	function readKeyframe(ba){
		var time = ba.readFloat();
		var translation = {};
		var rotation = {};
		
		translation.x = ba.readFloat();
		translation.y = ba.readFloat();
		translation.z = ba.readFloat();
		
		rotation.x = ba.readFloat();
		rotation.y = ba.readFloat();
		rotation.z = ba.readFloat();
		return {time, rotation, translation};
	}
	var animationList = doList(ba, ba => {
		var name = ba.readString1();
		var duration = ba.readFloat();
		var trackCount = ba.readU16();
		var trackDict = {};
		for(var i=0; i<trackCount; ++i){
			var boneID = ba.readU16();
			trackDict[boneID] = doList(ba, readKeyframe);
		}
		return {name, duration, trackDict};
	});
	if(ba.bytesAvailable > 0){
		throw new Error("parse error");
	}
	return {formatList, subMeshList, boneList, animationList};
}

module.exports = parse;