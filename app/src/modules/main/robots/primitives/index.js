import {toNumber, toBoolean, isInt} from '../utils/typecast';
import primitives from './Primitives';

const VAR_DICT = Object.create(null);
const LIST_DICT = Object.create(null);

export default {
	...primitives,
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