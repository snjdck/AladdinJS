/*
head - type - count - data[count]


2560 max D49 A15

1 - one wire set
2 - one wire get
3 - pinMode
4 - digitread
5 - anologread
6 - digitwrite
7 - anologwrite
8 - delay
9 - interrupt

//蜂鸣器		-done
//红外		-done
//舵机
//数码管 - done
//陀螺仪 - done
//表情面板 - done
//oled    - done
//rgbled  - done
//温度传感器 -done

size - msg(n) - \n
*/
function onewireGet(pin, type, count){
	return Buffer.from([2, pin, type, count]);
}

function onewireSet(pin, type, ...data){
	return Buffer.from([1, pin, type, data.length, ...data]);
}


/*
#define INPUT 0x0
#define OUTPUT 0x1
#define INPUT_PULLUP 0x2
*/
function pinMode(pin, mode){
	return Buffer.from([3, pin, mode]);
}

function digitalRead(pin){
	return Buffer.from([4, pin]);
}

function analogRead(pin){
	return Buffer.from([5, pin]);
}

function digitalWrite(pin, value){
	return Buffer.from([6, pin, value ? 1 : 0]);
}

function analogWrite(pin, value){
	value = Math.max(0, Math.min(255, value));
	return Buffer.from([7, pin, value]);
}

function buzzer(pin, frequency, duration){
	let result = Buffer.allocUnsafe(8);
	result[0] = 10;
	result[1] = pin;
	result.writeUInt16LE(frequency, 2);
	result.writeUInt32LE(duration, 4);
	return result;
}

function ir(pin){
	return Buffer.from([11, pin]);
}

function temperature(pin){
	return Buffer.from([12, pin]);
}

function rgb(pin, count, index, r, g, b){
	return Buffer.from([13, pin, count, index, g, r, b]);
}

function servo(pin, value){
	value = Math.max(0, Math.min(180, value));
	return Buffer.from([14, pin, value]);
}

const createPacket = function(head, tail, index){
	return function(...packets){
		let result = Buffer.concat([head, ...packets, tail]);
		result[1] = index;
		result[2] = result.length - 1;
		index = (index + 1) & 0xFF;
		return result;
	}
}(Buffer.from(['W'.charCodeAt(), 0, 0]), Buffer.from([0xa]), 0);

function handleRecv(serial){
	return new Promise((resolve, reject) => {
		let buffer = Buffer.alloc(0);
		let result;
		serial.on("data", data => {
			buffer = Buffer.concat([buffer, data]);
			if(buffer.length < 5)return;
			if(buffer.length != buffer[2] + 1)return;
			switch(buffer[3]){
				case 0:
					break;
				case 1:
					result = buffer[4];
					break;
				case 2:
					result = buffer[4] << 8 | buffer[5];
					break;
				case 3:
					result = buffer.slice(5, 5+buffer[4]);
					break;
				default:
					console.log('error')
			}
			serial.removeAllListeners('data');
			resolve(result);
		});
	});
}

module.exports = {
	onewireGet,
	onewireSet,
	digitalRead,
	analogRead,
	digitalWrite,
	analogWrite,
	buzzer,
	ir,
	temperature,
	rgb,
	servo,
	createPacket,
	handleRecv
};
