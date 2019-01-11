
import Blockly from "scratch-blocks";
import {info, board_elf, board_mini} from 'JavascriptBridge';

function createOptions(...args){
	return args.map(v => [String(v), String(v)]);
}

function regNumberOption(target, id, args){
	target[id.toLowerCase()] = {init(){
		this.jsonInit({
			"message0": "%1",
			"args0": [{
				"type": "field_numberdropdown",
				"name": id,
				...args
			}],
			extensions:['output_number', 'colours_textfield']
		});
	}};
}

function jsonInitBlock(id, title, args, typeName, color){
	return {init(){
		let params = {};
		params.args0 = args.map(v => (typeof v === 'string' ? {type:'input_value',name:v} : v));
		params.message0 = title;
		if(typeName){
			params.extensions = [`output_${typeName.toLowerCase()}`, color];
		}else{
			params.extensions = ['shape_statement', color];
		}
		params.tooltip = title;
		this.jsonInit(params);
	}};
}

function jsonInitOption(id, options, typeName, color){
	return {init(){
		var params = {};
		params.args0 = [{
			type: "field_dropdown",
			name: id,
			options: options.map(([k, v]) => [k, v.toString()])
		}];
		params.message0 = "%1";
		params.colour = color.primary;
		params.colourSecondary = color.secondary;
		params.colourTertiary = color.tertiary;
		params.extensions = [`output_${typeName.toLowerCase()}`];
		params.tooltip = id;
		this.jsonInit(params);
	}};
}

function jsonInitEvent(id, title, color){
	return {init(){
		var params = {};
		params.id = id;
		params.message0 = title;
		params.nextStatement = null;
		params.inputsInline = true;
		params.category = "events";
		params.colour = color.primary;
		params.colourSecondary = color.secondary;
		params.colourTertiary = color.tertiary;
		this.jsonInit(params);
	}};
}

function createDropDown(name, options){
	return {type:'field_dropdown', name, options};
}

function defaultIndex(dropdown, index){
	return {...dropdown, defaultIndex:index};
}

export default function (){
	/*var color = {
		"primary": "#FF6680",
		"secondary": "#FF4D6A",
		"tertiary": "#FF3355"
	};*/
	//const Blockly = require("scratch-blocks");
	//var Translation = Blockly.Msg;
	
	var result = {};
	function regBlock(id, title, args, typeName, color){
		result[id] = jsonInitBlock(id, title, args, typeName, color);
	}
	function regOption(id, typeName, options, color){
		result[id] = jsonInitOption(id.toUpperCase(), options, typeName, color);
	}
	function regEvent(id, title, color){
		result[id] = jsonInitEvent(id, title, color);
	}
	regNumberOption(result, 'SPEED', {
		"precision": 1,
		"min":-255,
		"max":255,
		options:createOptions(-255, -200, -150, -100, -50, 0, 50, 100, 150, 200, 255)
	});
	regNumberOption(result, 'ANGLE', {
		"precision": 1,
		"min":0,
		"max":180,
		options:createOptions(0, 30, 60, 90, 120, 150, 180)
	});
	regNumberOption(result, 'RGB_VALUE', {
		"precision": 1,
		"min":0,
		"max":255,
		options:createOptions(0, 64, 128, 192, 255)
	});
	//regBooleanOption(result, 'ON_OFF')

	/*
	result['led_matrix_data'] = {
  init: function() {
	this.jsonInit({
	  "message0": "%1",
	  "args0": [
		{
		  "type": "field_led",
		  "name": "LED_MATRIX_DATA",
		  "data": "[0,0,0,0,0]",
		  "size": "14x5"
		}
	  ],
	  "outputShape": 4,
	  "output": "String"
	});
  }
};*/
	//regEvent("weeebot_program", Translation.WB_PROGRAM_BEGIN);
	/*regOption("move_direction", "Number", [
		[Translation.WB_Forward, 1],
		[Translation.WB_Backward, 2],
		[Translation.WB_Left, 3],
		[Translation.WB_Right, 4]]);*/
	const MOVE_DIRECTION = createDropDown('MOVE_DIRECTION', [
		['%{BKY_WB_Forward}', '1'],
		['%{BKY_WB_Backward}', '2'],
		['%{BKY_WB_Left}', '3'],
		['%{BKY_WB_Right}', '4']
	]);
	/*regOption("line_follower_index", "Number", [
		['S1', 1],
		['S2', 2]]);*/
	const LINE_FOLLOWER_INDEX = createDropDown('LINE_FOLLOWER_INDEX', [
		['S1', '1'],
		['S2', '2']
	]);
	/*regOption("ultrasonic_led_index", "Number", [
		[Translation.WB_Left, 2],
		[Translation.WB_Right, 1],
		[Translation.WB_Both, 3]]);*/
	const ULTRASONIC_LED_INDEX = createDropDown('ULTRASONIC_LED_INDEX', [
		['%{BKY_WB_Both}',  '3'],
		['%{BKY_WB_Left}',  '2'],
		['%{BKY_WB_Right}', '1']
	]);
	
	const MOTOR_PORT = createDropDown('MOTOR_PORT', createOptions(3, 4, 5, 6));
	/*regOption("weeebot_dcmotor_option", "Number", [
		['M1', 1],
		['M2', 2]]);*/
	/*regOption("on_off", "Number", [
		[Translation.ON , 1],
		[Translation.OFF, 0]]);*/
	/*
	regOption("light_port", "Number", [
		['%{BKY_WB_OnBoard}',21],
		['%{BKY_WB_PortA}', 19],
		['%{BKY_WB_PortB}', 18],
		['%{BKY_WB_PortC}', 16],
		['%{BKY_WB_PortD}', 15]], Blockly.Colours.sensing);
	regOption("sound_port", "Number", [
		['%{BKY_WB_OnBoard}',17],
		['%{BKY_WB_PortA}', 19],
		['%{BKY_WB_PortB}', 18],
		['%{BKY_WB_PortC}', 16],
		['%{BKY_WB_PortD}', 15]], Blockly.Colours.sensing);
	*/
	/*regOption("sensor_port", "Number", [
		[Translation.WB_PortA, 19],
		[Translation.WB_PortB, 18],
		[Translation.WB_PortC, 16],
		[Translation.WB_PortD, 15]]);*/

	let SENSOR_PORT, BOARD_PORT, DC_MOTOR_INDEX;
	if(info.board === board_elf){
		let portList = [
			['%{BKY_WB_Port1}', '14'],
			['%{BKY_WB_Port2}', '15'],
			['%{BKY_WB_Port3}', '19'],
			['%{BKY_WB_Port4}', '18'],
			['%{BKY_WB_Port5}', '17'],
			['%{BKY_WB_Port6}', '16']
		];
		SENSOR_PORT = defaultIndex(createDropDown('SENSOR_PORT', [
			['%{BKY_WB_PortA}', '9'],
			['%{BKY_WB_PortB}', '10'],
			['%{BKY_WB_PortC}', '12'],
			['%{BKY_WB_PortD}', '4'],
			...portList
		]), 3);
		BOARD_PORT = defaultIndex(createDropDown('BOARD_PORT', portList), 3);
		DC_MOTOR_INDEX = createDropDown('DC_MOTOR_INDEX', [
			['M1', '1'],
			['M2', '2'],
			['M3', '3'],
			['M4', '4'],
			['M5', '5'],
			['M6', '6'],
			['M7', '7'],
			['M8', '8'],
			['M9', '9'],
			['M10', '10']
		]);
	}else{
		SENSOR_PORT = defaultIndex(createDropDown('SENSOR_PORT', [
			['%{BKY_WB_PortA}', '19'],
			['%{BKY_WB_PortB}', '18'],
			['%{BKY_WB_PortC}', '16'],
			['%{BKY_WB_PortD}', '15']
		]), 3);
		BOARD_PORT = defaultIndex(createDropDown('BOARD_PORT', [
			['%{BKY_WB_PortA}', '19'],
			['%{BKY_WB_PortB}', '18'],
			['%{BKY_WB_PortC}', '16'],
			['%{BKY_WB_PortD}', '15']
		]), 3);
		DC_MOTOR_INDEX = createDropDown('DC_MOTOR_INDEX', [
			['M1', '1'],
			['M2', '2']
		]);
	}

	

	/*regOption("back_led_port", "Number", [
		[Translation.WB_MINI_LEFT_YELLOW, 4],
		[Translation.WB_MINI_LEFT_RED, 3],
		[Translation.WB_MINI_RIGHT_RED, 14],
		[Translation.WB_MINI_RIGHT_YELLOW, 13]]);*/
	const IR_CODE = createDropDown('IR_CODE', [
		["A", '69'],
		["B", '70'],
		["C", '71'],
		["D", '68'],
		["E", '67'],
		["F", '13'],
		["↑", '64'],
		["↓", '25'],
		["←", '7'],
		["→", '9'],
		["OK",'21'],
		["R0",'22'],
		["R1",'12'],
		["R2",'24'],
		["R3",'94'],
		["R4",'8'],
		["R5",'28'],
		["R6",'90'],
		["R7",'66'],
		["R8",'82'],
		["R9",'74']
	]);
	/*regOption("ir_code", "Number", [
		["A",69],
		["B",70],
		["C",71],
		["D",68],
		["E",67],
		["F",13],
		["↑",64],
		["↓",25],
		["←",7],
		["→",9],
		["OK",21],
		["R0",22],
		["R1",12],
		["R2",24],
		["R3",94],
		["R4",8],
		["R5",28],
		["R6",90],
		["R7",66],
		["R8",82],
		["R9",74]]);*/
	regOption("test_tone_note_note_option", "Number", [
		["B0", 31],["C1", 33],["D1", 37],["E1", 41],["F1", 44],["G1", 49],["A1", 55],["B1", 62],
		["C2", 65],["D2", 73],["E2", 82],["F2", 87],["G2", 98],["A2", 110],["B2", 123],
		["C3", 131],["D3", 147],["E3", 165],["F3", 175],["G3", 196],["A3", 220],["B3", 247],
		["C4", 262],["D4", 294],["E4", 330],["F4", 349],["G4", 392],["A4", 440],["B4", 494],
		["C5", 523],["D5", 587],["E5", 659],["F5", 698],["G5", 784],["A5", 880],["B5", 988],
		["C6", 1047],["D6", 1175],["E6", 1319],["F6", 1397],["G6", 1568],["A6", 1760],["B6", 1976],
		["C7", 2093],["D7", 2349],["E7", 2637],["F7", 2794],["G7", 3136],["A7", 3520],["B7", 3951],
		["C8", 4186],["D8", 4699]], Blockly.Colours.looks);
	regOption("test_tone_note_beat_option", "Number", [
		['%{BKY_WB_TONE_Half}',500],
		['%{BKY_WB_TONE_Quarter}',250],
		['%{BKY_WB_TONE_Eighth}',125],
		['%{BKY_WB_TONE_Whole}',1000],
		['%{BKY_WB_TONE_Double}',2000]], Blockly.Colours.looks);
	const SHOW_COLON = createDropDown('SHOW_COLON', [
		[":", '1'],
		["　",'0']]);
	/*regOption("show_colon", "Number", [
		[":",1],
		["　",0]]);
	regOption("on_off", "Number", [
		[Translation.ON , 1],
		[Translation.OFF, 0]]);*/
	const ON_OFF = createDropDown("ON_OFF", [
		['%{BKY_ON}' , '1'],
		['%{BKY_OFF}', '0']
	]);
	const BACK_LED_PORT = createDropDown('BACK_LED_PORT', [
		['%{BKY_WB_MINI_LEFT_YELLOW}', '4'],
		['%{BKY_WB_MINI_LEFT_RED}', '3'],
		['%{BKY_WB_MINI_RIGHT_RED}', '14'],
		['%{BKY_WB_MINI_RIGHT_YELLOW}', '13']
	]);
	/*const ON_OFF = {
		"type": "field_checkbox",
      "name": "ON_OFF",
      "checked": true
	};
	const COLOR = {
		"type": "field_colour_slider",
      "name": "COLOR",
      "colour": "#ff0000"
	};*/
	const BUTTON_INDEX = createDropDown('BUTTON_INDEX', createOptions(1, 2, 3, 4));
	/*regOption("button_index", "Number", [
		["1", 1],
		["2", 2],
		["3", 3],
		["4", 4]]);*/
	const MP3_DEVICE_TYPE = createDropDown('MP3_DEVICE_TYPE', [
		["FLASH", '4'],
		["TF", '2']
	]);
	/*regOption("mp3_device_type", "Number", [
		["FLASH", 4],
		["TF", 2]]);*/
	const OLED_SIZE = createDropDown('OLED_SIZE', createOptions(8, 16));
	/*regOption("oled_size", "Number", [
		["8",  8],
		["16", 16]]);*/
	const COLOR_TYPE = createDropDown('COLOR_TYPE', [
		['%{BKY_COLOUR_LIGHT}', '0'],
		['%{BKY_COLOUR_RGB_RED}',  '1'],
		['%{BKY_COLOUR_RGB_GREEN}','2'],
		['%{BKY_COLOUR_RGB_BLUE}', '3']
	]);
	/*regOption("color_type", "Number", [
		[Translation.COLOUR_LIGHT,0],
		[Translation.COLOUR_RGB_RED,  1],
		[Translation.COLOUR_RGB_GREEN,2],
		[Translation.COLOUR_RGB_BLUE, 3]]);*/
	const FLAME_INDEX = createDropDown('FLAME_INDEX', createOptions(1, 2, 3));
	/*regOption("flame_index", "Number", [
		["1",1],
		["2",2],
		["3",3]]);*/
	const AXIS2 = createDropDown('AXIS2', [
		['%{BKY_X_AXIS}', '0'],
		['%{BKY_Y_AXIS}', '1']
	]);
	const AXIS3 = createDropDown('AXIS3', [
		['%{BKY_X_AXIS}', '0'],
		['%{BKY_Y_AXIS}', '1'],
		['%{BKY_Z_AXIS}', '2']
	]);
	/*regOption("axis2", "Number", [
		[Translation.X_AXIS,0],
		[Translation.Y_AXIS,1]]);
	regOption("axis3", "Number", [
		[Translation.X_AXIS,0],
		[Translation.Y_AXIS,1],
		[Translation.Z_AXIS,2]]);*/


	regBlock("weeebot_board_rgb", '%{BKY_WB_RGB_BOARD}', ["COLOR"], null, 'colours_looks');
	regBlock("weeebot_board_rgb3", '%{BKY_WB_RGB3_BOARD}', ["R", "G", "B"], null, 'colours_looks');
	regBlock("weeebot_board_button", '%{BKY_WB_BOARD_BUTTON}', [], "Boolean", 'colours_sensing');
	regBlock("weeebot_pin_ring_rgb", '%{BKY_WB_RGB_RING}', ["PIXEL", "COLOR"], null, 'colours_looks');
	regBlock("weeebot_pin_ring_rgb3", '%{BKY_WB_RGB3_RING}', ["PIXEL", "R", "G", "B"], null, 'colours_looks');
	regBlock("weeebot_pin_light", '%{BKY_WB_LIGHT}', [defaultIndex(BOARD_PORT, 0)], "Number", 'colours_sensing');
	regBlock("weeebot_pin_sound", '%{BKY_WB_SOUND}', [defaultIndex(BOARD_PORT, 2)], "Number", 'colours_sensing');
	regBlock("weeebot_pin_ir", '%{BKY_WB_IR}', [defaultIndex(BOARD_PORT, 1), IR_CODE], "Boolean", 'colours_sensing');
	
	regBlock("weeebotMini_board_light", '%{BKY_WB_LIGHT_ON_BOARD}', [], "Number", 'colours_sensing');
	regBlock("weeebotMini_board_sound", '%{BKY_WB_SOUND_ON_BOARD}', [], "Number", 'colours_sensing');
	regBlock("weeebotMini_board_ir", '%{BKY_WB_BOARD_IR_PRESSED}', [IR_CODE], "Boolean", 'colours_sensing');
	regBlock("weeebotMini_board_back_led", '%{BKY_WB_MINI_BACK_LED}', [BACK_LED_PORT, ON_OFF], null, 'colours_looks');

	regBlock("single_led", '%{BKY_WB_SINGLE_LED}', [SENSOR_PORT, ON_OFF], null, 'colours_looks');
	regBlock("single_line_follower", '%{BKY_WB_SINGLE_LINE_FOLLOWER}', [defaultIndex(BOARD_PORT, 0)], "Number", 'colours_sensing');
	regBlock("soil", '%{BKY_WB_SOIL}', [BOARD_PORT], "Number", 'colours_sensing');

	regBlock("dc_motor",   '%{BKY_WB_DCMOTOR}',    [DC_MOTOR_INDEX, "SPEED"], null, 'colours_motion');
	regBlock("robot_move", '%{BKY_WB_MOTOR_MOVE}', [MOVE_DIRECTION, "SPEED"], null, 'colours_motion');
	regBlock("robot_stop", '%{BKY_WB_STOP_MOTOR}', [], null, 'colours_motion');
	regBlock("dc_130_motor", '5V 130 %{BKY_WB_DCMOTOR}', [SENSOR_PORT, "SPEED"], null, 'colours_motion');
	regBlock("encoder_motor",   '%{BKY_WB_ENCODER_MOVE}',    [MOTOR_PORT, "SPEED", "DISTANCE"], null, 'colours_motion');
	regBlock("stepper_motor",   '%{BKY_WB_STEPPER_MOVE}',    [MOTOR_PORT, "SPEED", "DISTANCE"], null, 'colours_motion');
	regBlock("servo", '%{BKY_WB_BOARD_SERVO}', [SENSOR_PORT, "ANGLE"], null, 'colours_motion');
	regBlock("buzzer", '%{BKY_WB_TONE}', ["TEST_TONE_NOTE_NOTE_OPTION", "TEST_TONE_NOTE_BEAT_OPTION"], null, 'colours_looks');

	regBlock("rgb_strip", '%{BKY_WB_RGB_STRIP}', [SENSOR_PORT, "PIXEL", "COLOR"], null, 'colours_looks');
	regBlock("rgb3_strip", '%{BKY_WB_RGB3_STRIP}', [SENSOR_PORT, "PIXEL", "R", "G", "B"], null, 'colours_looks');
	regBlock("rgb_RJ11",  '%{BKY_WB_RGB1}', [SENSOR_PORT, "PIXEL", "COLOR"], null, 'colours_looks');
	regBlock("rgb3_RJ11", '%{BKY_WB_RGB2}', [SENSOR_PORT, "PIXEL", "R", "G", "B"], null, 'colours_looks');
	regBlock("line_follower", '%{BKY_WB_LINE_FOLLOWER}', [defaultIndex(SENSOR_PORT, 0), LINE_FOLLOWER_INDEX], "Number", 'colours_sensing');

	regBlock("ultrasonic", '%{BKY_WB_ULTRASONIC}', [defaultIndex(SENSOR_PORT, 1)], "Number", 'colours_sensing');
	regBlock("ultrasonic_led", '%{BKY_WB_ULTRASONIC_LED}', [defaultIndex(SENSOR_PORT, 1), ULTRASONIC_LED_INDEX, ON_OFF], null, 'colours_looks');
	regBlock("ultrasonic_rgb", '%{BKY_WB_ULTRASONIC_RGB}', [defaultIndex(SENSOR_PORT, 1), ULTRASONIC_LED_INDEX, "COLOR"], null, 'colours_looks');
	regBlock("ultrasonic_rgb3", '%{BKY_WB_ULTRASONIC_RGB3}', [defaultIndex(SENSOR_PORT, 1), ULTRASONIC_LED_INDEX, "R", "G", "B"], null, 'colours_looks');

	regBlock("ir_avoid", '%{BKY_WB_IR_AVOID}', [defaultIndex(SENSOR_PORT, 1)], "Boolean", 'colours_sensing');
	regBlock("ir_avoid_led", '%{BKY_WB_IR_AVOID_LED}', [defaultIndex(SENSOR_PORT, 1), ULTRASONIC_LED_INDEX, ON_OFF], null, 'colours_looks');
	regBlock("ir_avoid_rgb", '%{BKY_WB_IR_AVOID_RGB}', [defaultIndex(SENSOR_PORT, 1), ULTRASONIC_LED_INDEX, "COLOR"], null, 'colours_looks');
	regBlock("ir_avoid_rgb3", '%{BKY_WB_IR_AVOID_RGB3}', [defaultIndex(SENSOR_PORT, 1), ULTRASONIC_LED_INDEX, "R", "G", "B"], null, 'colours_looks');

	regBlock("led_matrix_number", '%{BKY_WB_LED_MATRIX_NUMBER}', [defaultIndex(SENSOR_PORT, 2), "NUM"], null, 'colours_sounds');
	regBlock("led_matrix_time", '%{BKY_WB_LED_MATRIX_TIME}', [defaultIndex(SENSOR_PORT, 2), "HOUR", SHOW_COLON, "SECOND"], null, 'colours_sounds');
	regBlock("led_matrix_string", '%{BKY_WB_LED_MATRIX_STRING}', [defaultIndex(SENSOR_PORT, 2), "X", "Y", "STR"], null, 'colours_sounds');
	regBlock("led_matrix_bitmap_21x7", '%{BKY_WB_LED_MATRIX_BITMAP}', [defaultIndex(SENSOR_PORT, 2), "X", "Y", "MATRIX"], null, 'colours_sounds');
	regBlock("led_matrix_bitmap_14x5", '%{BKY_WB_LED_MATRIX_BITMAP}', [defaultIndex(SENSOR_PORT, 2), "X", "Y", "MATRIX"], null, 'colours_sounds');
	regBlock("led_matrix_pixel_show", '%{BKY_WB_LED_MATRIX_PIXEL_SHOW}', [defaultIndex(SENSOR_PORT, 2), "X", "Y"], null, 'colours_sounds');
	regBlock("led_matrix_pixel_hide", '%{BKY_WB_LED_MATRIX_PIXEL_HIDE}', [defaultIndex(SENSOR_PORT, 2), "X", "Y"], null, 'colours_sounds');
	regBlock("led_matrix_clear", '%{BKY_WB_LED_MATRIX_CLEAR}', [defaultIndex(SENSOR_PORT, 2)], null, 'colours_sounds');
	
	
	
	//regBlock("front_led_light", '%{BKY_WB_MINI_FRONT_LED}', [defaultIndex(SENSOR_PORT, 1), ULTRASONIC_LED_INDEX, ON_OFF], null, 'colours_looks');

	regBlock("humiture_humidity", '%{BKY_WB_HUMITURE_HUMIDITY}', [SENSOR_PORT], "Number", 'colours_sensing');
	regBlock("humiture_temperature", '%{BKY_WB_HUMITURE_TEMPERATURE}', [SENSOR_PORT], "Number", 'colours_sensing');
	
	regBlock("seven_segment", '%{BKY_WB_7_SEGMENT_DISPLAY}', [SENSOR_PORT, "NUM"], null, 'colours_sounds');
	
	regBlock("sliding_potentiometer", '%{BKY_WB_SLIDING_POTENTIOMETER}', [SENSOR_PORT], "Number", 'colours_sensing');
	regBlock("potentiometer", '%{BKY_WB_POTENTIOMETER}', [SENSOR_PORT], "Number", 'colours_sensing');
	regBlock("gas_sensor", '%{BKY_WB_GAS}', [SENSOR_PORT], "Number", 'colours_sensing');

	//regBlock("led_strip", '%{BKY_WB_LED_STRIP}', [SENSOR_PORT, "PIXEL", "R", "G", "B"], null, 'colours_looks');
	regBlock("led_button_light", '%{BKY_WB_LED_BUTTON_LIGHT}', [SENSOR_PORT, BUTTON_INDEX, ON_OFF], null, 'colours_looks');
	regBlock("relay", '%{BKY_WB_RELAY}', [SENSOR_PORT, ON_OFF], null, 'colours_motion');
	regBlock("water_atomizer", '%{BKY_WB_WATER_ATOMIZER}', [SENSOR_PORT, ON_OFF], null, 'colours_motion');
	regBlock("color_sensor_white_balance", '%{BKY_WB_COLOR_SENSOR_WHITE_BALANCE}', [SENSOR_PORT], null, 'colours_sensing');
	regBlock("color_sensor_light", '%{BKY_WB_COLOR_SENSOR_LIGHT}', [SENSOR_PORT, ON_OFF], null, 'colours_sensing');
	regBlock("mp3_play", '%{BKY_WB_MP3_PLAY}', [SENSOR_PORT], null, 'colours_looks');
	regBlock("mp3_pause", '%{BKY_WB_MP3_PAUSE}', [SENSOR_PORT], null, 'colours_looks');
	regBlock("mp3_prev_music", '%{BKY_WB_MP3_PREV_MUSIC}', [SENSOR_PORT], null, 'colours_looks');
	regBlock("mp3_next_music", '%{BKY_WB_MP3_NEXT_MUSIC}', [SENSOR_PORT], null, 'colours_looks');
	regBlock("mp3_set_music", '%{BKY_WB_MP3_SET_MUSIC}', [SENSOR_PORT, "NUM"], null, 'colours_looks');
	regBlock("mp3_set_volume", '%{BKY_WB_MP3_SET_VOLUME}', [SENSOR_PORT, "NUM"], null, 'colours_looks');
	regBlock("mp3_set_device", '%{BKY_WB_MP3_SET_DEVICE}', [SENSOR_PORT, MP3_DEVICE_TYPE], null, 'colours_looks');
	regBlock("mp3_is_over", '%{BKY_WB_MP3_IS_OVER}', [SENSOR_PORT], "Boolean", 'colours_looks');
	regBlock("oled_set_size", '%{BKY_WB_OLED_SET_SIZE}', [SENSOR_PORT, OLED_SIZE], null, 'colours_sounds');
	regBlock("oled_show_string", '%{BKY_WB_OLED_SHOW_STRING}', [SENSOR_PORT, "X", "Y", "STR"], null, 'colours_sounds');
	regBlock("oled_show_number", '%{BKY_WB_OLED_SHOW_NUMBER}', [SENSOR_PORT, "X", "Y", "NUM"], null, 'colours_sounds');
	regBlock("oled_clear_screen", '%{BKY_WB_OLED_CLEAR_SCREEN}', [SENSOR_PORT], null, 'colours_sounds');
	regBlock("color_sensor", '%{BKY_WB_COLOR_SENSOR}', [SENSOR_PORT, COLOR_TYPE], "Number", 'colours_sensing');
	regBlock("flame_sensor", '%{BKY_WB_FLAME_SENSOR}', [SENSOR_PORT, FLAME_INDEX], "Number", 'colours_sensing');
	regBlock("joystick", '%{BKY_WB_JOYSTICK}', [SENSOR_PORT, AXIS2], "Number", 'colours_sensing');
	regBlock("compass", '%{BKY_WB_COMPASS}', [SENSOR_PORT, AXIS3], "Number", 'colours_sensing');
	regBlock("gyro_gyration", '%{BKY_WB_GYRO_GYRATION}', [SENSOR_PORT, AXIS3], "Number", 'colours_sensing');
	regBlock("gyro_acceleration", '%{BKY_WB_GYRO_ACCELERATION}', [SENSOR_PORT, AXIS3], "Number", 'colours_sensing');
	regBlock("touch", '%{BKY_WB_TOUCH}', [SENSOR_PORT], "Boolean", 'colours_sensing');
	regBlock("led_button", '%{BKY_WB_LED_BUTTON}', [SENSOR_PORT, BUTTON_INDEX], "Boolean", 'colours_sensing');
	regBlock("pir",  '%{BKY_WB_PIR}', [SENSOR_PORT], "Boolean", 'colours_sensing');
	regBlock("tilt", '%{BKY_WB_TILT}', [SENSOR_PORT, LINE_FOLLOWER_INDEX], "Boolean", 'colours_sensing');
	regBlock("limit_switch", '%{BKY_WB_LIMIT_SWITCH}', [SENSOR_PORT], "Boolean", 'colours_sensing');
	regBlock("temperature", '%{BKY_WB_TEMPERATURE}', [SENSOR_PORT], "Number", 'colours_sensing');

	return result;
};