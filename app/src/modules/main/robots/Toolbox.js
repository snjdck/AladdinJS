
import Blockly from 'scratch-blocks';
import create from 'fileformats/xml/create';
import {
	newXML,
	newBlock,
	newCategory,
	newNumberValue,
	newTextValue,
	newDropdownValue,
	newLabel
} from './utils/ToolboxUtil';

import {info, board_elf, board_mini} from 'JavascriptBridge';
//*/
//A0 = 14
//const PORTS = [0, 19, 18, 16, 15];
//const SENSOR_PORTS = PORTS;
/*
#define MINI_LIFT_YELLOW   4
#define MINI_LEFT_RED      3
#define MINI_RIGHT_RED     A0
#define MINI_RIGHT_YELLOW  13
*/
//const BACK_LED_PORTS = [4,3,14,13];

//单路巡线,单色led,土壤湿度,无mcu
//光线,声音,ir,灯环


const conditionNewBlock = (condition, ...args) => condition ? newBlock(...args) : "";


function createToolbox(){
	const board_type = info.board;
	//console.log(board_type, board_elf, board_mini)
/*
const others = newCategory("%{BKY_CATEGORY_EXECUTE}", 'others', Blockly.Colours.pen,[
		//newBlock("weeebot_program"),
	   
		newBlock("weeebot_steppermove", [
			newDropdownValue("MOTOR_PORT", 3),
			newNumberValue("SPEED", 3000),
			newNumberValue("DISTANCE", 1000)
		]),
		newBlock("weeebot_encoder_move", [
			newDropdownValue("MOTOR_PORT", 3),
			newNumberValue("SPEED", 100),
			newNumberValue("DISTANCE", 1000)
		]),
		
	  
	   
		newBlock("relay"),
		newBlock("water_atomizer"),
		
	]);
*/
/*
toolbox = create(["category", {"name":"WeeeBot\nMini", id:'sounds', "key":"WeeeBotMini", "colour":"#FF6680", "secondaryColour":"#FF3355"},
	newBlock("on_board_servo", [
			newDropdownValue("SENSOR_PORT", PORTS[1]),
			newNumberValue("ANGLE", 90)
		]),
	 newBlock("mp3_is_over", [
			newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
		])
	]);
*/
//console.log(Blockly.Colours)
//export const motion = create(["category", {"name":"%{BKY_CATEGORY_MOTION}", id:'motion', "colour":"#4C97FF", "secondaryColour":"#3373CC"},
const motion = newCategory("%{BKY_CATEGORY_EXECUTE}", 'motion', Blockly.Colours.motion, [
		newBlock("dc_motor", [
			newDropdownValue("SPEED", 100)
		]),
		newBlock("robot_move", [
			newDropdownValue("SPEED", 120)
		]),
		newBlock("robot_stop"),
		newBlock("dc_130_motor", [
			newDropdownValue("SPEED", 0)
		]),
		/*conditionNewBlock(board_type == board_elf, "encoder_motor", [
			newNumberValue("SPEED", 3000),
			newNumberValue("DISTANCE", 1000)
		]),
		conditionNewBlock(board_type == board_elf, "stepper_motor", [
			newNumberValue("SPEED", 100),
			newNumberValue("DISTANCE", 1000)
		]),*/
		newBlock("servo", [
			newDropdownValue("ANGLE", 90)
		]),
		newBlock("relay"),
		newBlock("water_atomizer"),
]);

//export const looks = create(["category", {"name":"%{BKY_CATEGORY_LOOKS}", id:'looks', "colour":"#9966FF", "secondaryColour":"#774DCB"},
const looks = newCategory("%{BKY_CATEGORY_LOOKS}", 'looks', Blockly.Colours.looks, [
		newBlock("buzzer", [
			newDropdownValue("TEST_TONE_NOTE_NOTE_OPTION", 262),
			newDropdownValue("TEST_TONE_NOTE_BEAT_OPTION", 500)
		]),
		conditionNewBlock(board_type == board_elf, "weeebot_board_rgb", [
			newXML("value", {"name":"COLOR"}, [newXML("shadow", {"type":"colour_picker"})])
		]),
		conditionNewBlock(board_type == board_elf, "weeebot_board_rgb3", [
			newDropdownValue("R", 255, 'RGB_VALUE'),
			newDropdownValue("G", 255, 'RGB_VALUE'),
			newDropdownValue("B", 255, 'RGB_VALUE')
		]),
		conditionNewBlock(board_type == board_elf, "weeebot_pin_ring_rgb", [
			newNumberValue("PIXEL", 0, 'math_whole_number'),
			newXML("value", {"name":"COLOR"}, [newXML("shadow", {"type":"colour_picker"})])
		]),
		conditionNewBlock(board_type == board_elf, "weeebot_pin_ring_rgb3", [
			newNumberValue("PIXEL", 0, 'math_whole_number'),
			newDropdownValue("R", 255, 'RGB_VALUE'),
			newDropdownValue("G", 255, 'RGB_VALUE'),
			newDropdownValue("B", 255, 'RGB_VALUE')
		]),
	 //newLabel('RGB'),
		newBlock("rgb_strip", [
			newNumberValue("PIXEL", 0, 'math_whole_number'),
			newXML("value", {"name":"COLOR"}, [newXML("shadow", {"type":"colour_picker"})])
		]),
		newBlock("rgb3_strip", [
			newNumberValue("PIXEL", 0, 'math_whole_number'),
			newDropdownValue("R", 255, 'RGB_VALUE'),
			newDropdownValue("G", 255, 'RGB_VALUE'),
			newDropdownValue("B", 255, 'RGB_VALUE')
		]),
		newBlock("rgb_RJ11", [
			newNumberValue("PIXEL", 0, 'math_whole_number'),
			newXML("value", {"name":"COLOR"}, [newXML("shadow", {"type":"colour_picker"})])
		]),
		newBlock("rgb3_RJ11", [
			newNumberValue("PIXEL", 0, 'math_whole_number'),
			newDropdownValue("R", 255, 'RGB_VALUE'),
			newDropdownValue("G", 255, 'RGB_VALUE'),
			newDropdownValue("B", 255, 'RGB_VALUE')
		]),
		/*
		newBlock("led_strip", [
			newNumberValue("PIXEL", 0, 'math_whole_number'),
			newDropdownValue("R", 255, 'RGB_VALUE'),
			newDropdownValue("G", 255, 'RGB_VALUE'),
			newDropdownValue("B", 255, 'RGB_VALUE')
		]),*/
		// newLabel('ultrasonic'),
		newBlock("ultrasonic_led"),
		newBlock("ultrasonic_rgb", [
			newXML("value", {"name":"COLOR"}, [newXML("shadow", {"type":"colour_picker"})])
		]),
		newBlock("ultrasonic_rgb3", [
			newDropdownValue("R", 255, 'RGB_VALUE'),
			newDropdownValue("G", 255, 'RGB_VALUE'),
			newDropdownValue("B", 255, 'RGB_VALUE')
		]),
		//newLabel('ir_avoid'),
		newBlock("ir_avoid_led"),
		newBlock("ir_avoid_rgb", [
			newXML("value", {"name":"COLOR"}, [newXML("shadow", {"type":"colour_picker"})])
		]),
		newBlock("ir_avoid_rgb3", [
			newDropdownValue("R", 255, 'RGB_VALUE'),
			newDropdownValue("G", 255, 'RGB_VALUE'),
			newDropdownValue("B", 255, 'RGB_VALUE')
		]),
		newBlock("single_led"),
		//newBlock("front_led_light"),
		conditionNewBlock(board_type == board_mini, "weeebotMini_board_back_led"),
		newBlock("led_button_light"),
		//newLabel('MP3'),
		newBlock("mp3_play"),
		newBlock("mp3_pause"),
		newBlock("mp3_prev_music"),
		newBlock("mp3_next_music"),
		newBlock("mp3_set_music", [
			newNumberValue("NUM", 1, 'math_whole_number')
		]),
		newBlock("mp3_set_volume", [
			newNumberValue("NUM", 0, 'math_whole_number')
		]),
		newBlock("mp3_set_device"),
		newBlock("mp3_is_over")
]);



//export const sound = create(["category", {"name":"%{BKY_CATEGORY_SOUND}", id:'sound', "colour":"#D65CD6", "secondaryColour":"#BD42BD"},
const sound = newCategory("%{BKY_CATEGORY_SOUND}", 'sound', Blockly.Colours.sounds, [
		//newLabel('led matrix'),
		newBlock("led_matrix_number", [
			newNumberValue("NUM", 100)
		]),
		newBlock("led_matrix_time", [
			newNumberValue("HOUR", 12, 'math_whole_number'),
			newNumberValue("SECOND", 34, 'math_whole_number')
		]),
		newBlock("led_matrix_string", [
			newNumberValue("X", 0, 'math_integer'),
			newNumberValue("Y", 0, 'math_integer'),
			newTextValue("STR", "Hi")
		]),
		conditionNewBlock(board_type == board_elf, "led_matrix_bitmap_21x7", [
			newNumberValue("X", 0, 'math_integer'),
			newNumberValue("Y", 0, 'math_integer'),
			newDropdownValue('MATRIX', '0', 'MATRIX@21*7')
			//newXML("value", {"name":"LED_MATRIX_DATA"}, [newXML("shadow", {"type":"led_matrix_data"})])
		]),
		conditionNewBlock(board_type == board_mini, "led_matrix_bitmap_14x5", [
			newNumberValue("X", 0, 'math_integer'),
			newNumberValue("Y", 0, 'math_integer'),
			newDropdownValue('MATRIX', '0', 'MATRIX@14*5')
			//newXML("value", {"name":"LED_MATRIX_DATA"}, [newXML("shadow", {"type":"led_matrix_data"})])
		]),
		newBlock("led_matrix_pixel_show", [
			newNumberValue("X", 0, 'math_integer'),
			newNumberValue("Y", 0, 'math_integer'),
		]),
		newBlock("led_matrix_pixel_hide", [
			newNumberValue("X", 0, 'math_integer'),
			newNumberValue("Y", 0, 'math_integer'),
		]),
		newBlock("led_matrix_clear"),
		//newLabel('seven_segment'),
		newBlock("seven_segment", [
			newNumberValue("NUM", 100)
		]),
		//newLabel('oled'),
		newBlock("oled_set_size"),
		newBlock("oled_show_string", [
			newNumberValue("X", 0, 'math_integer'),
			newNumberValue("Y", 0, 'math_integer'),
			newTextValue("STR", "Hi")
		]),
		newBlock("oled_show_number", [
			newNumberValue("X", 0, 'math_integer'),
			newNumberValue("Y", 0, 'math_integer'),
			newNumberValue("NUM", 100)
		]),
		newBlock("oled_clear_screen"),
]);


//export const sensing = create(["category", {"name":"%{BKY_CATEGORY_SENSING}", id:'sensing', "colour":"#4CBFE6", "secondaryColour":"#2E8EB8"},
const sensing = newCategory("%{BKY_CATEGORY_SENSING}", 'sensing', Blockly.Colours.sensing, [
		newBlock("line_follower"),
		newBlock("ultrasonic"),
		conditionNewBlock(board_type == board_mini, "weeebotMini_board_light"),
		conditionNewBlock(board_type == board_mini, "weeebotMini_board_sound"),
		conditionNewBlock(board_type == board_elf, "weeebot_pin_light"),
		conditionNewBlock(board_type == board_elf, "weeebot_pin_sound"),
		newBlock("single_line_follower"),
		newBlock("humiture_humidity"),
		newBlock("humiture_temperature"),
		newBlock("temperature"),
		newBlock("soil"),
		newBlock("sliding_potentiometer"),
		newBlock("potentiometer"),
		newBlock("gas_sensor"),
		newBlock("color_sensor_white_balance"),
		newBlock("color_sensor_light"),
		newBlock("color_sensor"),
		newBlock("flame_sensor"),
		newBlock("joystick"),
		newBlock("compass"),
		newBlock("gyro_gyration"),
		newBlock("gyro_acceleration"),
		conditionNewBlock(board_type == board_elf, "weeebot_board_button"),
		conditionNewBlock(board_type == board_elf, "weeebot_pin_ir"),
		conditionNewBlock(board_type == board_mini, "weeebotMini_board_ir"),
		newBlock("ir_avoid"),
		newBlock("touch"),
		newBlock("led_button"),
		newBlock("pir"),
		newBlock("tilt"),
		newBlock("limit_switch"),
		newBlock('sensing_timer'),
		newBlock('sensing_resettimer'),
		newBlock('sensing_current'),
		newBlock('sensing_dayssince2000'),
]);

const events = newCategory("%{BKY_CATEGORY_EVENTS}", "events", Blockly.Colours.event, [
	newBlock('event_whenflagclicked')
]);

const control = newCategory("%{BKY_CATEGORY_CONTROL}", "control", Blockly.Colours.control, [
	newBlock('control_wait', [
		newNumberValue('DURATION', 1, 'math_positive_number')
	]),
	newBlock('control_repeat', [
		newNumberValue('TIMES', 10, 'math_whole_number')
	]),
	newBlock('control_forever'),
	newBlock('control_if'),
	newBlock('control_if_else'),
	newBlock('control_wait_until'),
	newBlock('control_repeat_until'),
]);

const variable = newCategory("%{BKY_CATEGORY_VARIABLES}", "data", Blockly.Colours.data, "VARIABLE");
const procedure = newCategory("%{BKY_CATEGORY_MYBLOCKS}", "more", Blockly.Colours.more, "PROCEDURE");

const operators = newCategory("%{BKY_CATEGORY_OPERATORS}", "operators", Blockly.Colours.operators, [
	newBlock('operator_add', [
		newNumberValue('NUM1'),
		newNumberValue('NUM2')
	]),
	newBlock('operator_subtract', [
		newNumberValue('NUM1'),
		newNumberValue('NUM2')
	]),
	newBlock('operator_multiply', [
		newNumberValue('NUM1'),
		newNumberValue('NUM2')
	]),
	newBlock('operator_divide', [
		newNumberValue('NUM1'),
		newNumberValue('NUM2')
	]),
	newBlock('operator_random', [
		newNumberValue('FROM', 1),
		newNumberValue('TO', 10)
	]),
	newBlock('operator_lt', [
		newTextValue('OPERAND1'),
		newTextValue('OPERAND2')
	]),
	newBlock('operator_equals', [
		newTextValue('OPERAND1'),
		newTextValue('OPERAND2')
	]),
	newBlock('operator_gt', [
		newTextValue('OPERAND1'),
		newTextValue('OPERAND2')
	]),
	newBlock('operator_and'),
	newBlock('operator_or'),
	newBlock('operator_not'),
	newBlock('operator_join', [
		newTextValue('STRING1', 'hello'),
		newTextValue('STRING2', 'world')
	]),
	newBlock('operator_letter_of', [
		newNumberValue('LETTER', 1, 'math_whole_number'),
		newTextValue('STRING', 'world')
	]),
	newBlock('operator_length', [
		newTextValue('STRING', 'world')
	]),
	newBlock('operator_contains', [
		newTextValue('STRING1', 'hello'),
		newTextValue('STRING2', 'world')
	]),
	newBlock('operator_mod', [
		newNumberValue('NUM1'),
		newNumberValue('NUM2')
	]),
	newBlock('operator_round', [
		newNumberValue('NUM')
	]),
	newBlock('operator_mathop', [
		newNumberValue('NUM')
	])
]);

return create(['xml', events, control, motion, looks, sound, sensing, operators, variable, procedure]);
}
export default createToolbox;