"use strict";
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
//*/
//A0 = 14
const PORTS = [0, 19, 18, 16, 15];
const SENSOR_PORTS = PORTS;
/*
#define MINI_LIFT_YELLOW   4
#define MINI_LEFT_RED      3
#define MINI_RIGHT_RED     A0
#define MINI_RIGHT_YELLOW  13
*/
const BACK_LED_PORTS = [4,3,14,13];

export const others = newCategory("Others", 'others', Blockly.Colours.pen,[
        //newBlock("weeebot_program"),
       
        /*newBlock("weeebot_steppermove", [
            newDropdownValue("MOTOR_PORT", 3),
            newNumberValue("SPEED", 3000),
            newNumberValue("DISTANCE", 1000)
        ]),
        newBlock("weeebot_encoder_move", [
            newDropdownValue("MOTOR_PORT", 3),
            newNumberValue("SPEED", 100),
            newNumberValue("DISTANCE", 1000)
        ]),*/
        
      
       
        newBlock("relay", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        newBlock("water_atomizer", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        
    ]);
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
export const motion = newCategory("%{BKY_CATEGORY_MOTION}", 'motion', Blockly.Colours.motion, [
     newBlock("weeebot_motor_dc", [
            newDropdownValue("WEEEBOT_DCMOTOR_OPTION", 1),
            newDropdownValue("SPEED", 100)
        ]),
        newBlock("weeebot_motor_move", [
            newDropdownValue("MOVE_DIRECTION", 1),
            newNumberValue("SPEED", 120)
        ]),
        newBlock("weeebot_stop"),
        newBlock("weeebot_motor_dc_130", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newNumberValue("SPEED", 0)
        ]),
        newBlock("on_board_servo", [
            newDropdownValue("SENSOR_PORT", PORTS[1]),
            newDropdownValue("ANGLE", 90)
        ]),
]);

//export const looks = create(["category", {"name":"%{BKY_CATEGORY_LOOKS}", id:'looks', "colour":"#9966FF", "secondaryColour":"#774DCB"},
export const looks = newCategory("%{BKY_CATEGORY_LOOKS}", 'looks', Blockly.Colours.looks, [
     newBlock("test_tone_note", [
            newDropdownValue("TEST_TONE_NOTE_NOTE_OPTION", 262),
            newDropdownValue("TEST_TONE_NOTE_BEAT_OPTION", 500)
        ]),
     newLabel('RGB'),
        newBlock("weeebot_rgb", [
            newDropdownValue("SENSOR_PORT", PORTS[1]),
            newNumberValue("PIXEL", 0),
            newXML("value", {"name":"COLOR"}, [newXML("shadow", {"type":"colour_picker"})])
        ]),
        newBlock("weeebot_rgb3", [
            newDropdownValue("SENSOR_PORT", PORTS[1]),
            newNumberValue("PIXEL", 0),
            newDropdownValue("R", 255, 'RGB_VALUE'),
            newDropdownValue("G", 255, 'RGB_VALUE'),
            newDropdownValue("B", 255, 'RGB_VALUE')
        ]),
        newBlock("weeebot_rgb_RJ11", [
            newDropdownValue("SENSOR_PORT", PORTS[1]),
            newNumberValue("PIXEL", 0),
            newXML("value", {"name":"COLOR"}, [newXML("shadow", {"type":"colour_picker"})])
        ]),
        newBlock("weeebot_rgb3_RJ11", [
            newDropdownValue("SENSOR_PORT", PORTS[1]),
            newNumberValue("PIXEL", 0),
            newNumberValue("R", 255),
            newNumberValue("G", 255),
            newNumberValue("B", 255)
        ]),
        newBlock("led_strip", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newNumberValue("PIXEL", 0),
            newDropdownValue("R", 255, 'RGB_VALUE'),
            newDropdownValue("G", 255, 'RGB_VALUE'),
            newDropdownValue("B", 255, 'RGB_VALUE')
        ]),
         newLabel('ultrasonic'),
    newBlock("ultrasonic_led", [
            newDropdownValue("SENSOR_PORT", PORTS[1]),
            newDropdownValue("ULTRASONIC_LED_INDEX", 3),
            newXML("value", {"name":"COLOR"}, [newXML("shadow", {"type":"colour_picker"})])
        ]),
        newBlock("ultrasonic_led_rgb", [
            newDropdownValue("SENSOR_PORT", PORTS[1]),
            newDropdownValue("ULTRASONIC_LED_INDEX", 3),
            newNumberValue("R", 255),
            newNumberValue("G", 255),
            newNumberValue("B", 255)
        ]),
        newLabel('ir_avoid'),
        newBlock("ir_avoid_led", [
            newDropdownValue("SENSOR_PORT", PORTS[2]),
            newDropdownValue("ULTRASONIC_LED_INDEX", 3),
            newXML("value", {"name":"COLOR"}, [newXML("shadow", {"type":"colour_picker"})])
        ]),
        newBlock("ir_avoid_led_rgb", [
            newDropdownValue("SENSOR_PORT", PORTS[2]),
            newDropdownValue("ULTRASONIC_LED_INDEX", 3),
            newNumberValue("R", 255),
            newNumberValue("G", 255),
            newNumberValue("B", 255)
        ]),
         newBlock("weeebot_single_led", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])/*,
            newDropdownValue("ON_OFF", 'TRUE')*/
        ]),
        newBlock("front_led_light", [
            newDropdownValue("SENSOR_PORT", PORTS[2]),
            newDropdownValue("ULTRASONIC_LED_INDEX", 3)
        ]),
        newBlock("back_led_light", [
            newDropdownValue("BACK_LED_PORT", BACK_LED_PORTS[0])
        ]),
        newBlock("led_button_light", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newDropdownValue("BUTTON_INDEX", 1)
        ]),
        newLabel('MP3'),
        newBlock("mp3_play", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        newBlock("mp3_pause", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        newBlock("mp3_next_music", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        newBlock("mp3_set_music", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newNumberValue("NUM", 1)
        ]),
        newBlock("mp3_set_volume", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newNumberValue("NUM", 0)
        ]),
        newBlock("mp3_set_device", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newDropdownValue("MP3_DEVICE_TYPE", 4)
        ]),
        newBlock("mp3_is_over", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ])
]);



//export const sound = create(["category", {"name":"%{BKY_CATEGORY_SOUND}", id:'sound', "colour":"#D65CD6", "secondaryColour":"#BD42BD"},
export const sound = newCategory("%{BKY_CATEGORY_SOUND}", 'sound', Blockly.Colours.sounds, [
        newLabel('led matrix'),
        newBlock("weeebot_led_matrix_number", [
            newDropdownValue("SENSOR_PORT", PORTS[3]),
            newNumberValue("NUM", 100)
        ]),
        //*
        newBlock("weeebot_led_matrix_time", [
            newDropdownValue("SENSOR_PORT", PORTS[3]),
            newNumberValue("HOUR", 12),
            //newDropdownValue("SHOW_COLON", 1),
            newNumberValue("SECOND", 34)
        ]),//*/
        newBlock("weeebot_led_matrix_string", [
            newDropdownValue("SENSOR_PORT", PORTS[3]),
            newNumberValue("X", 0),
            newNumberValue("Y", 0),
            newTextValue("STR", "Hi")
        ]),
        //*
        newBlock("weeebot_led_matrix_bitmap", [
            newDropdownValue("SENSOR_PORT", PORTS[3]),
            newNumberValue("X", 0),
            newNumberValue("Y", 0),
            newDropdownValue('MATRIX', '0101010101100010101000100')
            //newXML("value", {"name":"LED_MATRIX_DATA"}, [newXML("shadow", {"type":"led_matrix_data"})])
        ]),//*/
        newBlock("weeebot_led_matrix_pixel_show", [
            newDropdownValue("SENSOR_PORT", PORTS[3]),
            newNumberValue("X", 0),
            newNumberValue("Y", 0)
        ]),
        newBlock("weeebot_led_matrix_pixel_hide", [
            newDropdownValue("SENSOR_PORT", PORTS[3]),
            newNumberValue("X", 0),
            newNumberValue("Y", 0)
        ]),
        newBlock("weeebot_led_matrix_clear", [
            newDropdownValue("SENSOR_PORT", PORTS[3])
        ]),
        newLabel('seven_segment'),
        newBlock("seven_segment", [
            newDropdownValue("SENSOR_PORT", PORTS[1]),
            newNumberValue("NUM", 100)
        ]),
        newLabel('oled'),
                newBlock("oled_set_size", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newDropdownValue("OLED_SIZE", 8)
        ]),
        newBlock("oled_show_string", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newNumberValue("X", 0),
            newNumberValue("Y", 0),
            newTextValue("STR", "Hi")
        ]),
        newBlock("oled_show_number", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newNumberValue("X", 0),
            newNumberValue("Y", 0),
            newNumberValue("NUM", 100)
        ]),
        newBlock("oled_clear_screen", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
]);




//export const sensing = create(["category", {"name":"%{BKY_CATEGORY_SENSING}", id:'sensing', "colour":"#4CBFE6", "secondaryColour":"#2E8EB8"},
export const sensing = newCategory("%{BKY_CATEGORY_SENSING}", 'sensing', Blockly.Colours.sensing, [
       newBlock("color_sensor_white_balance", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        newBlock("color_sensor_light", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        

        newBlock("line_follower", [
            newDropdownValue("SENSOR_PORT", PORTS[1]),
            newDropdownValue("LINE_FOLLOWER_INDEX", 1)
        ]),
        newBlock("ultrasonic", [
            newDropdownValue("SENSOR_PORT", PORTS[1])
        ]),
        newBlock("board_light_sensor", [
            newDropdownValue("LIGHT_PORT", 21)
        ]),
        newBlock("board_sound_sensor", [
            newDropdownValue("SOUND_PORT", 17)
        ]),
        /*newBlock("board_temperature_sensor", [
            newDropdownValue("SENSOR_PORT", PORTS[1])
        ]),
        newBlock("weeebot_on_board_button", [
            newDropdownValue("SENSOR_PORT", PORTS[1])
        ]),*/
        
        newBlock("weeebot_single_line_follower", [
            newDropdownValue("SENSOR_PORT", PORTS[1])
        ]),
        newBlock("humiture_humidity", [
            newDropdownValue("SENSOR_PORT", PORTS[1])
        ]),
        newBlock("humiture_temperature", [
            newDropdownValue("SENSOR_PORT", PORTS[1])
        ]),
        newBlock("soil", [
            newDropdownValue("SENSOR_PORT", PORTS[1])
        ]),
        newBlock("sliding_potentiometer", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        newBlock("potentiometer", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        newBlock("gas_sensor", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        newBlock("color_sensor", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newDropdownValue("COLOR_TYPE", 0)
        ]),
        newBlock("flame_sensor", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newDropdownValue("FLAME_INDEX", 1)
        ]),
        newBlock("joystick", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newDropdownValue("AXIS2", 0)
        ]),
        newBlock("compass", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newDropdownValue("AXIS3", 0)
        ]),
        newBlock("gyro_gyration", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newDropdownValue("AXIS3", 0)
        ]),
        newBlock("gyro_acceleration", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newDropdownValue("AXIS3", 0)
        ]),
        newBlock("weeebot_infraread", [
            newDropdownValue("IR_CODE", 69)
        ]),
        newBlock("weeebot_ir_avoid", [
            newDropdownValue("SENSOR_PORT", PORTS[2])
        ]),
        newBlock("touch", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        newBlock("led_button", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newDropdownValue("BUTTON_INDEX", 1)
        ]),
        newBlock("pir", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        newBlock("tilt", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1]),
            newDropdownValue("LINE_FOLLOWER_INDEX", 1)
        ]),
        newBlock("limit_switch", [
            newDropdownValue("SENSOR_PORT", SENSOR_PORTS[1])
        ]),
        newBlock('sensing_timer'),
        newBlock('sensing_resettimer'),
        newBlock('sensing_current'),
        newBlock('sensing_dayssince2000'),
]);

export const events = newCategory("%{BKY_CATEGORY_EVENTS}", "events", Blockly.Colours.event, [
    newBlock('event_whenflagclicked')
]);

export const control = newCategory("%{BKY_CATEGORY_CONTROL}", "control", Blockly.Colours.control, [
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

export const variable = newCategory("%{BKY_CATEGORY_VARIABLES}", "data", Blockly.Colours.data, "VARIABLE");
export const procedure = newCategory("%{BKY_CATEGORY_MYBLOCKS}", "more", Blockly.Colours.more, "PROCEDURE");

export const operators = newCategory("%{BKY_CATEGORY_OPERATORS}", "operators", Blockly.Colours.operators, [
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

export default create(['xml', events, control, motion, looks, sound, sensing, operators, variable, procedure, others]);