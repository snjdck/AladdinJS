import {toNumber, toBoolean, isInt} from '../utils/typecast';
import primitives from './Primitives';

const VAR_DICT = Object.create(null);
const LIST_DICT = Object.create(null);

function tan(angle) {
	angle = angle % 360;
	switch (angle) {
	case -270:
	case 90:
		return Infinity;
	case -90:
	case 270:
		return -Infinity;
	default:
		return parseFloat(Math.tan((Math.PI * angle) / 180).toFixed(10));
	}
}

const sensing = {
	sensing_timer(){
		return (Date.now() - timer) * 0.001;
	},
	sensing_resettimer(){
		timer = Date.now();
	},
	sensing_current({CURRENTMENU}){
		const date = new Date();
		switch (CURRENTMENU.toLowerCase()) {
		case 'year': return date.getFullYear();
		case 'month': return date.getMonth() + 1; // getMonth is zero-based
		case 'date': return date.getDate();
		case 'dayofweek': return date.getDay() + 1; // getDay is zero-based, Sun=0
		case 'hour': return date.getHours();
		case 'minute': return date.getMinutes();
		case 'second': return date.getSeconds();
		}
		return 0;
	},
	sensing_dayssince2000(){
		const msPerDay = 24 * 60 * 60 * 1000;
		const start = new Date(2000, 0, 1); // Months are 0-indexed.
		const today = new Date();
		const dstAdjust = today.getTimezoneOffset() - start.getTimezoneOffset();
		let mSecsSinceStart = today.valueOf() - start.valueOf();
		mSecsSinceStart += ((today.getTimezoneOffset() - dstAdjust) * 60 * 1000);
		return mSecsSinceStart / msPerDay;
	}
};

const operator = {
	operator_add({NUM1, NUM2}){
		return toNumber(NUM1) + toNumber(NUM2);
	},
	operator_subtract({NUM1, NUM2}){
		return toNumber(NUM1) - toNumber(NUM2);
	},
	operator_multiply({NUM1, NUM2}){
		return toNumber(NUM1) * toNumber(NUM2);
	},
	operator_divide({NUM1, NUM2}){
		return toNumber(NUM1) / toNumber(NUM2);
	},
	operator_lt({OPERAND1, OPERAND2}){
		//=====================================
	},
	operator_equals({OPERAND1, OPERAND2}){
		//=====================================
	},
	operator_gt({OPERAND1, OPERAND2}){
		//=====================================
	},
	operator_and({OPERAND1, OPERAND2}){
		return toBoolean(OPERAND1) && toBoolean(OPERAND2);
	},
	operator_or({OPERAND1, OPERAND2}){
		return toBoolean(OPERAND1) || toBoolean(OPERAND2);
	},
	operator_not({OPERAND}){
		return !toBoolean(OPERAND);
	},
	operator_random({FROM, TO}){
		FROM = toNumber(FROM);
		TO = toNumber(TO);
		if(FROM === TO)return FROM;
		let a = FROM <= TO ? FROM : TO;
		let b = FROM <= TO ? TO : FROM;
		if(isInt(FROM) && isInt(TO))
			return Math.floor(Math.random() * (b - a + 1)) + a;
		return Math.random() * (b - a) + a;
	},
	operator_join({STRING1, STRING2}){
		return String(STRING1) + String(STRING2);
	},
	operator_letter_of({LETTER, STRING}){
		let index = toNumber(LETTER) - 1;
		return String(STRING).charAt(index);
	},
	operator_length({STRING}){
		return String(STRING).length;
	},
	operator_contains({STRING1, STRING2}){
		return String(STRING1).toLowerCase().includes(String(STRING2).toLowerCase())
	},
	operator_mod({NUM1, NUM2}){
		NUM1 = toNumber(NUM1);
		NUM2 = toNumber(NUM2);
		let result = NUM1 % NUM2;
		if(result / NUM2 < 0)
			result += NUM2;
		return result;
	},
	operator_round({NUM}){
		return Math.round(toNumber(NUM));
	},
	operator_mathop({OPERATOR, NUM}){
		const n = toNumber(NUM);
		switch(OPERATOR.toLowerCase()){
		case 'abs': return Math.abs(n);
		case 'floor': return Math.floor(n);
		case 'ceiling': return Math.ceil(n);
		case 'sqrt': return Math.sqrt(n);
		case 'sin': return parseFloat(Math.sin((Math.PI * n) / 180).toFixed(10));
		case 'cos': return parseFloat(Math.cos((Math.PI * n) / 180).toFixed(10));
		case 'tan': return tan(n);
		case 'asin': return (Math.asin(n) * 180) / Math.PI;
		case 'acos': return (Math.acos(n) * 180) / Math.PI;
		case 'atan': return (Math.atan(n) * 180) / Math.PI;
		case 'ln': return Math.log(n);
		case 'log': return Math.log(n) / Math.LN10;
		case 'e ^': return Math.exp(n);
		case '10 ^': return Math.pow(10, n);
		}
		return 0;
	}
};

export default {
	...primitives,
	...sensing,
	...operator,
	control_wait({DURATION}){
		return new Promise(resolve => {
			let expired = performance.now() + toNumber(DURATION) * 1000;
			this.suspendUpdater = () => {
				if(performance.now() >= expired){
					resolve();
				}
			};
		});
	},
	event_whenflagclicked(){

	},
	argument_reporter_boolean({VALUE}){
		return toBoolean(this.getVar(VALUE));
	},
	argument_reporter_string_number({VALUE}){
		return this.getVar(VALUE);
	},
	data_listcontents({LIST}){
		console.log('LIST', LIST)
		return 0;
	},
	data_variable({VARIABLE}){
		return VAR_DICT[VARIABLE];
	},
	data_setvariableto({VARIABLE, VALUE}){
		VAR_DICT[VARIABLE] = VALUE;
		console.log(VAR_DICT)
	},
	data_changevariableby({VARIABLE, VALUE}){
		VAR_DICT[VARIABLE] = toNumber(VAR_DICT[VARIABLE]) + toNumber(VALUE);
		console.log(VAR_DICT)
	},
	data_showvariable({VARIABLE}){
		console.log('show var:', VARIABLE)
	},
	data_hidevariable({VARIABLE}){
		console.log('hide var:', VARIABLE)
	},
	data_addtolist({LIST, ITEM}){
		if(!(LIST in LIST_DICT)){
			LIST_DICT[LIST] = [];
		}
		LIST_DICT[LIST].push(ITEM);
	},
	data_deleteoflist({LIST, INDEX}){
		if(!(LIST in LIST_DICT)){
			return;
		}
		LIST_DICT[LIST].splice(INDEX-1, 1);
	},
	data_deletealloflist({LIST}){
		if(!(LIST in LIST_DICT)){
			return;
		}
		LIST_DICT[LIST].splice(0);
	},
	data_insertatlist({LIST, INDEX, ITEM}){
		if(!(LIST in LIST_DICT)){
			LIST_DICT[LIST] = [ITEM];
		}else{
			LIST_DICT[LIST].splice(INDEX-1, 0, ITEM);
		}
	},
	data_replaceitemoflist({LIST, INDEX, ITEM}){
		if(!(LIST in LIST_DICT)){
			LIST_DICT[LIST] = [];
		}
		LIST_DICT[LIST][INDEX-1] = ITEM;
	},
	data_itemoflist({LIST, INDEX}){
		if(!(LIST in LIST_DICT)){
			return 0;
		}
		return LIST_DICT[LIST][INDEX-1];
	},
	data_itemnumoflist({LIST, ITEM}){
		if(!(LIST in LIST_DICT)){
			return -1;
		}
		let index = LIST_DICT[LIST].indexOf(ITEM);
		if(index < 0){
			return index;
		}
		return index + 1;
	},
	data_lengthoflist({LIST}){
		if(!(LIST in LIST_DICT)){
			return 0;
		}
		return LIST_DICT[LIST].length;
	},
	data_listcontainsitem({LIST, ITEM}){
		if(!(LIST in LIST_DICT)){
			return 0;
		}
		return LIST_DICT[LIST].includes(ITEM);
	},
	data_showlist({LIST}){
		console.log('show list:', LIST)
	},
	data_hidelist({LIST}){
		console.log('hide list:', LIST)
	}
};

let timer = Date.now();