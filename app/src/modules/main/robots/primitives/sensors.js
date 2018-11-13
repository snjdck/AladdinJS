const base_op = require('./base_op');

const {
	onewireGet,
	onewireSet,
	digitalRead,
	analogRead,
	digitalWrite,
	analogWrite,
	createPacket,
	handleRecv
} = base_op;

const LedMatrix7x21 = require('./LedMatrix7x21');
const LedMatrix5x14 = require('./LedMatrix5x14');

import {info, board_elf, board_mini} from 'JavascriptBridge';

function doOnewireSet(port, type, ...data){
	let packet = createPacket(
		onewireSet(port, type, ...data)
	);
	this.write(packet);
	console.log('send bytes count: ', packet.length);
	return handleRecv(this);
}

function doOnewireGet(port, type, count){
	let packet = createPacket(
		onewireGet(port, type, count)
	);
	this.write(packet);
	return handleRecv(this);
}

function stripZero(value){
	if(value.includes('.')){
		while(value[0] === '0'){
			value.shift();
		}
		if(value[0] === '.'){
			value.shift();
		}
	}
	return value;
}

function dc_motor(pwmPin, dirPin, speed){
	let dir = speed > 0 ? 0 : 1;
	let pwm = Math.abs(speed);
	let packet = createPacket(
		digitalWrite(dirPin, dir),
		analogWrite(pwmPin, pwm)
	);
	this.write(packet);
	return handleRecv(this);
}

//前后左右,1234
function dc_move(motorPorts, dir, speed){
	let [pwmPinL, dirPinL] = motorPorts[1];
	let [pwmPinR, dirPinR] = motorPorts[0];
	let pwm = Math.abs(speed);
	let dirL = (dir === 1 || dir === 4) ? 0 : 1;
	let dirR = (dir === 1 || dir === 3) ? 0 : 1;
	if(speed < 0){
		dirL ^= 1;
		dirR ^= 1;
	}
	let packet = createPacket(
		digitalWrite(dirPinL, dirL),
		analogWrite(pwmPinL, pwm),
		digitalWrite(dirPinR, dirR),
		analogWrite(pwmPinR, pwm)
	);
	this.write(packet);
	return handleRecv(this);
}

function dc_motor_rj11(port, speed){
	let cmd = [
		onewireSet(port, 2, [dir, speed])
	];
}

export function servo({SENSOR_PORT, ANGLE}){
	let packet = createPacket(
		base_op.servo(SENSOR_PORT, ANGLE)
	);
	this.net.write(packet);
	return handleRecv(this.net);
}

/*
index = [1 - 4]
*/
function led_button_led(port, index, isOn){
	let value = index ? (1 << (index - 1)) : 0xF;
	return doOnewireSet.call(this, port, (isOn ? 3 : 4), value);
}

async function led_button_read(port, keys){
	let result = await doOnewireGet.call(this, port, 2, 1);
	return result[0] & keys == keys;
}

export async function weeebot_board_button(){
	let packet = createPacket(
		digitalRead(2)
	);
	this.net.write(packet);
	return 0 === await handleRecv(this.net);
}

function colorSensorSetLight(port, isOn){
	return doOnewireSet.call(this, port, 3, isOn ? 1 : 0);
}

function colorSensorWhitebalance(port){
	return doOnewireSet.call(this, port, 4);
}

/*r,g,b,a = [0,3]*/
async function colorSensorRead(port, index){
	let result = await doOnewireGet.call(this, port, 2, 8);
	index <<= 1;
	return result[index] | result[index+1] << 8;
}

/* index=[0,2] */
async function compassSensorRead(port, index){
	let result = await doOnewireGet.call(this, port, 2, 6);
	index <<= 1;
	return result[index] << 8 | result[index+1];
}

/* index=[0,2] */
async function flameSensorRead(port, index){
	let result = await doOnewireGet.call(this, port, 2, 3);
	return result[index];
}

async function gasSensorRead(port){
	let result = await doOnewireGet.call(this, port, 2, 1);
	return result[0];
}

/* 0-humidity, 1-temperature*/
async function humitureSensorRead(port, index){
	let result = await doOnewireGet.call(this, port, 2, 2);
	return result[index];
}

async function iravoid_isObstacle(port){
	let result = await doOnewireGet.call(this, port, 2, 1);
	return result[0] != 0;
}

function iravoid_rgb(port, index, r, g, b){
	let value = Array(6).fill(0);
	for(let i=1; i<=2; ++i){
		if(index & i == 0)continue;
		let k = (i - 1) * 3;
		value[k] = r;
		value[k+1] = g;
		value[k+2] = b;
	}
	return doOnewireSet.call(this, port, 3, ...value);
}

function iravoid_led(port, index, isOn){
	let value = 0;
	for(let i=1; i<=2; ++i){
		if(index & i == 0)continue;
		if(isOn){
			value |= i;
		}else{
			value &= ~i;
		}
	}
	return doOnewireSet.call(this, port, 4, value);
}

/* index=[0,2] */
async function joystick(port, index){
	let result = await doOnewireGet.call(this, port, 2, 3);
	return result[index];
}

async function ledLineFollower(port){
	let result = await doOnewireGet.call(this, port, 2, 1);
	return result[0] * 1023 / 255;
}

function ledLineFollower_led(port, isOn){
	return doOnewireSet.call(this, port, isOn ? 3 : 4);
}

function light(port){
	let packet = createPacket(
		analogRead(port)
	);
	this.write(packet);
	return handleRecv(this);
}

const sound = light;

function limitSwitch(port){
	let packet = createPacket(
		digitalRead(port)
	);
	this.write(packet);
	return handleRecv(this);
}

/* index=[0,1] */
async function linefollower(port, index){
	let result = await doOnewireGet.call(this, port, 2, 2);
	return (1 - result[index] / 255) * 1023;
}

function mp3_setMusic(port, index){
	return doOnewireSet.call(this, port, 2, index >> 8, index & 0xFF);
}

function mp3_setVolume(port, value){
	return doOnewireSet.call(this, port, 3, value);
}

function mp3_nextMusic(port){
	return doOnewireSet.call(this, port, 4);
}

function mp3_pause(port){
	return doOnewireSet.call(this, port, 5);
}

function mp3_play(port){
	return doOnewireSet.call(this, port, 6);
}

/* type = 2 or 4 */
function mp3_setDevice(port, type){
	return doOnewireSet.call(this, port, 7, type);
}

async function mp3_isOver(port){
	let result = await doOnewireGet.call(this, port, 8, 1);
	return result[0];
}

function mp3_prevMusic(port){
	return doOnewireSet.call(this, port, 9);
}

async function pir(port){
	return 0 !== await potentiomter.call(this, port);
}

async function potentiomter(port){
	let result = await doOnewireGet.call(this, port, 2, 1);
	return result[0];
}

function relay(port, isOn){
	return doOnewireSet.call(this, port, 2, isOn ? 1 : 0);
}


/* data 15字节 grb顺序*/
function rgbLedRJ11(port, index, r, g, b){
	let data = Array(15).fill(0);
	if(index > 0){
		index = (index - 1) * 3;
		data[index] = g;
		data[index+1] = r;
		data[index+2] = b;
	}else{
		for(let i=0; i<15; i+=3){
			data[i] = g;
			data[i+1] = r;
			data[i+2] = b;
		}
	}
	return doOnewireSet.call(this, port, 2, ...data);
}

function singleLED(port, isOn){
	let packet = createPacket(
		digitalWrite(port, isOn ? 1 : 0)
	);
	this.write(packet);
	return handleRecv(this);
}

async function singleLinefollower(port){
	let packet = createPacket(
		analogRead(port)
	);
	this.write(packet);
	let result = await handleRecv(this);
	return 1023 - result;
}

const slidingPotentiomter = potentiomter;

async function tilt(port){
	let result = await potentiomter.call(this, port);
	return result;
}

async function touch(port){
	return 0 !== await potentiomter.call(this, port);
}

const ultrasonic_rgb = iravoid_rgb;
const ultrasonic_led = iravoid_led;
export async function ultrasonic({SENSOR_PORT}){
	let result = await doOnewireGet.call(this.net, SENSOR_PORT, 2, 2);
	return (result[0] | result[1] << 8) / 17.57;
}

export function water_atomizer({SENSOR_PORT, ON_OFF}){
	return doOnewireSet.call(this.net, SENSOR_PORT, (ON_OFF ? 2 : 3));
}

function buzzer(argValues){
	var note = argValues.TEST_TONE_NOTE_NOTE_OPTION;
    var hz = argValues.TEST_TONE_NOTE_BEAT_OPTION;
	let port = info.board == board_elf ? 11 : 7;
	let packet = createPacket(
		base_op.buzzer(port, note, hz)
	);
	this.net.write(packet);
	return handleRecv(this.net);
}

async function ir_pressed(pin, code){
	let packet = createPacket(
		ir(pin)
	);
	this.write(packet);
	return code === await handleRecv(this);
}

async function getTemperature(pin){
	let packet = createPacket(
		temperature(pin)
	);
	this.write(packet);
	return (await handleRecv(this)) * 0.0625;//除以16
}

function sleep(seconds){
	let packet = createPacket(
		delay(seconds)
	);
	this.write(packet);
	return handleRecv(this);
}

function rgb_led(port, count, index, r, g, b){
	let packet = createPacket(
		rgb(port, count, index, r, g, b)
	);
	console.log(packet)
	this.write(packet);
	return handleRecv(this);
}

/* 0-gx,1-gy,2-gz,3-gyrX,4-gyrY,5-gyrZ */
const gyro = function(){
	const gSensitivity =  1 / 65.5;
	const factor = 180 / Math.PI;
	let timestamp = 0;
	let data = Array(6).fill(0);
	return async function(port, index){
		const result = await doOnewireGet.call(this, port, 2, 14);
		const buffer = Buffer.from(result);
		let now = new Date().getTime();
		if(timestamp === 0){
			timestamp = now;
		}
		
		const dt = (now - timestamp) * 0.001;
		timestamp = now;
		let bu
		const accX = buffer.readInt16BE(0);
		const accY = buffer.readInt16BE(2);
		const accZ = buffer.readInt16BE(4);
		data[3] = buffer.readInt16BE(8) * gSensitivity;
		data[4] = buffer.readInt16BE(10) * gSensitivity;
		data[5] = buffer.readInt16BE(12) * gSensitivity;
		const ax = Math.atan2(accX, Math.sqrt(accY*accY+accZ*accZ)) * factor;
		const ay = Math.atan2(accY, Math.sqrt(accX*accX+accZ*accZ)) * factor;
		//*
		if(accZ > 0){
			data[0] -= data[4] * dt;
			data[1] += data[3] * dt;
		}else{
			data[0] += data[4] * dt;
			data[1] -= data[3] * dt;
		}
		data[2] += data[5] * dt;//*/
		data[2] %= 360;
		if(data[2] > 180){
			data[2] -= 360;
		}
		data[0] = 0.98 * data[0] + 0.02 * ax;
		data[1] = 0.98 * data[1] + 0.02 * ay;
		console.clear();
		console.log(result, data)
		return data[index];
	}
}();

function segment7Display(port, value){
	value = Math.max(Math.min(value, 9999), -999);
	let data = Array(4).fill(0x40);

	value = value.toString();
	value = value.slice(0, 4 + value.includes('.'));
	value = stripZero(value.split('').reverse());

	let k = 3, hasComma = false;
	for(let char of value){
		if(char === '-'){
			data[k] = 0x10;
			break;
		}
		if(char === '.'){
			hasComma = true;
			continue;
		}
		data[k] = parseInt(char);
		if(hasComma){
			data[k] |= 0x20;
			hasComma = false;
		}
		--k;
	}

	return doOnewireSet.call(this, port, 2, ...data);
}

function ledMatrix_clear(port){
	return doOnewireSet.call(this, port, 5);
}

function ledMatrix_showLine(port, x, value){
	return doOnewireSet.call(this, port, 3, x, value);
}

function ledMatrix_showBitmap(port, x, y, bytes, w, h){
	if(Math.abs(x) >= w || Math.abs(y) >= h){
		return ledMatrix_clear.call(this, port);
	}
	let data = [];
	for(let i=0; i<w; ++i){
		let j = i - x;
		if(j < 0 || w <= j){
			data[i] = 0;
		}else if(y >= 0){
			data[i] = bytes[j] << y;
		}else{
			data[i] = bytes[j] >> -y;
		}
	}
	return doOnewireSet.call(this, port, 2, ...data);
}

function ledMatrix_showString(port, x, y, string, w, h){
	if(x >= w || Math.abs(y) >= h){
		return ledMatrix_clear.call(this, port);
	}
	let data = Array(w).fill(0);
	for(let char of string){
		if(x >= w)break;
		if(x > -6){
			copyChar(data, x, y, LedMatrix7x21, char);
		}
		x += 6;
	}
	return doOnewireSet.call(this, port, 2, ...data);
}

function ledMatrix7x21_showBitmap(...args){
	return ledMatrix_showBitmap.call(this, ...args, 21, 7);
}

function ledMatrix5x14_showBitmap(...args){
	return ledMatrix_showBitmap.call(this, ...args, 14, 5);
}

function ledMatrix7x21_showString(...args){
	return ledMatrix_showString.call(this, ...args, 21, 7);
}

function ledMatrix5x14_showString(...args){
	return ledMatrix_showString.call(this, ...args, 14, 5);
}

function copyChar(dest, x, y, lib, char){
	let data = lib[char.charCodeAt()] || lib['$'.charCodeAt()];
	for(let i=0; i<6; ++i){
		let index = i + x;
		if(index < 0)continue;
		if(index >= dest.length)break;
		dest[index] = (y >= 0) ? (data[i] << y) : (data[i] >> -y);
	}
}

function ledMatrix7x21_showClock(port, hour, minute, hasPoint){
	let data = Array(21).fill(0);
	copyChar(data, -1, 0, LedMatrix7x21, Math.floor(hour * 0.1).toString());
	copyChar(data,  4, 0, LedMatrix7x21, (hour % 10).toString());
	copyChar(data, 11, 0, LedMatrix7x21, Math.floor(minute * 0.1).toString());
	copyChar(data, 16, 0, LedMatrix7x21, (minute % 10).toString());
	data[10] = hasPoint ? 0x14 : 0;
	return doOnewireSet.call(this, port, 2, ...data);
}

function ledMatrix7x21_showNumber(port, value){
	value = Math.max(Math.min(value, 9999), -999);
	let data = Array(21).fill(0);

	value = value.toString();
	value = value.slice(0, 4 + value.includes('.'));
	value = stripZero(value.split('').reverse());

	let x = 21;
	for(let char of value){
		if(char === '.'){
			data[x-1] = 0x40;
			x -= 2;
			continue;
		}
		x -= 5;
		copyChar(data, x, 0, LedMatrix7x21, char);
	}

	return doOnewireSet.call(this, port, 2, ...data);
}

function ledMatrix5x14_showNumber(port, value){
	value = Math.max(Math.min(value, 999), -99);
	let data = Array(14).fill(0);

	value = value.toString();
	value = value.slice(0, 3 + value.includes('.'));
	value = stripZero(value.split('').reverse());

	let x = 14;
	for(let char of value){
		if(char === '.')continue;
		x -= 5;
		copyChar(data, x, 0, LedMatrix5x14, char);
	}

	x = 14;
	for(let char of value){
		if(char !== '.'){
			x -= 5;
			continue;
		}
		data[x-1] &= 0xF;
		data[x] = 0x10;
		data[x+1] &= 0xF;
		break;
	}

	return doOnewireSet.call(this, port, 2, ...data);
}

function oled_clearScreen(port){
	return doOnewireSet.call(this, port, 4);
}

function oled_showString(port, x, y, string){
	if(typeof string != 'string'){
		string = string.toString();
	}
	return doOnewireSet.call(this, port, 2, 8, x, y, ...string.split('').map(v => v.charCodeAt()), 0);
}

const oled_showNumber = oled_showString;

function oled_showLine(port, x, y, data){
	return doOnewireSet.call(this, port, 3, x, y, data);
}

//编码,步进电机
