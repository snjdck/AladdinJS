

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function fetchRGB(argValues){
    var r = argValues.R;
    var g = argValues.G;
    var b = argValues.B;
    r = Math.round(Math.max(0, Math.min(255, r)));
    g = Math.round(Math.max(0, Math.min(255, g)));
    b = Math.round(Math.max(0, Math.min(255, b)));
    return {r, g, b};
}

export function dc_motor({SPEED, DC_MOTOR_INDEX}){
    this.net.sendCmd(200, DC_MOTOR_INDEX, SPEED);
}

export function dc_130_motor({SPEED, SENSOR_PORT}){
	this.net.sendCmd(204, SENSOR_PORT, SPEED);
}

export function robot_move({SPEED, MOVE_DIRECTION}) {
    var spd = SPEED;
    var dir = MOVE_DIRECTION;
    var speeds;
    switch(Number(dir)){
    	case 2: speeds = [spd,-spd];break;
        case 3: speeds = [spd,spd];break;
        case 4: speeds = [-spd,-spd];break;
        default:
            speeds = [-spd,spd];
    }
    this.net.sendCmd(201, ...speeds);
}

export function servo({SENSOR_PORT, ANGLE}) {
	this.net.sendCmd(202, SENSOR_PORT, ANGLE);
}

export function robot_stop(){
	this.net.sendCmd(102);
}

export function weeebot_pin_ring_rgb(argValues){
    argValues.SENSOR_PORT = 13;
    rgb_strip.call(this, argValues);
}

export function weeebot_pin_ring_rgb3(argValues){
    argValues.SENSOR_PORT = 13;
    rgb3_strip.call(this, argValues);
}

export function weeebot_board_rgb(argValues){
    argValues.SENSOR_PORT = 3;
    argValues.PIXEL = 1;
    rgb_strip.call(this, argValues);
}

export function weeebot_board_rgb3(argValues){
    argValues.SENSOR_PORT = 3;
    argValues.PIXEL = 1;
    rgb3_strip.call(this, argValues);
}

export function rgb_strip(argValues, msgID=9) {
    var pin = argValues.SENSOR_PORT;
    var pix = argValues.PIXEL;
    var color = argValues.COLOR;
    color = hexToRgb(color);
    this.net.sendCmd(msgID, pin, pix, color.r, color.g, color.b);
}

export function rgb3_strip(argValues, msgID=9) {
    var pin = argValues.SENSOR_PORT;
    var pix = argValues.PIXEL;
    var color = fetchRGB(argValues);
    this.net.sendCmd(msgID, pin, pix, color.r, color.g, color.b);
}
//*
export function rgb_RJ11(argValues) {
    rgb_strip.call(this, argValues, 13);
}
//*/
export function rgb3_RJ11(argValues) {
    rgb3_strip.call(this, argValues, 13);
}
export function weeebot_pin_light(argValues) {
    var port = argValues.BOARD_PORT;
    return this.net.sendCmd(8, port);
}
export function weeebotMini_board_light() {
    //var port = argValues.LIGHT_PORT;
   // return this.net.sendCmd(8, 21);
    return weeebot_pin_light.call(this, {BOARD_PORT: 21});
}

export function temperature({SENSOR_PORT}) {
    return this.net.sendCmd( 12, SENSOR_PORT);
}
export function weeebotMini_board_sound(){
    //var port = argValues.SOUND_PORT;
   // return this.net.sendCmd( 11, 17);
    //argValues.BOARD_PORT = 17;
    return weeebot_pin_sound.call(this, {BOARD_PORT: 17});
}
export function weeebot_pin_sound(argValues){
    var port = argValues.BOARD_PORT;
    return this.net.sendCmd( 11, port);
}
/*
function weeebot_encoder_move(argValues) {
    var port = argValues.MOTOR_PORT;
    var speed = argValues.SPEED;
    var distance = argValues.DISTANCE;
    //var cmd = "M202 " + port + " " + speed + " " + distance;
    var cmd = createCMD(202, port, speed, distance);
    console.log(cmd);
    //util.ioQuery('serial', 'sendMsg', [cmd]);
}
function weeebot_steppermove(argValues) {
    var port = argValues.MOTOR_PORT;
    var speed = argValues.SPEED;
    var distance = argValues.DISTANCE;
    //var cmd = "M203 " + port + " " + speed + " " + distance;
    var cmd = createCMD(203, port, speed, distance);
    console.log(cmd);
    //util.ioQuery('serial', 'sendMsg', [cmd]);
}
*/
export function weeebot_pin_ir(argValues) {
    var port = argValues.BOARD_PORT;
    var code = argValues.IR_CODE;
    return this.net.sendCmd( 7, port, code);
}
export function weeebotMini_board_ir(argValues) {
    argValues.BOARD_PORT = 2;
    return weeebot_pin_ir.call(this, argValues);
}
export function weeebot_board_button(argValues){
    var port = 2;
    return this.net.sendCmd( 0, port);
}
export function buzzer(argValues){
    var note = argValues.TEST_TONE_NOTE_NOTE_OPTION;
    var hz = argValues.TEST_TONE_NOTE_BEAT_OPTION;
    return this.net.sendCmd( 10, note, hz);
}
export function ultrasonic(argValues){
    var port = argValues.SENSOR_PORT;
    return this.net.sendCmd( 110, port);
}
export function ultrasonic_led(argValues){
    var port = argValues.SENSOR_PORT;
    var index = argValues.ULTRASONIC_LED_INDEX;
    var isOn = argValues.ON_OFF;
    this.net.sendCmd( 127, port, index, isOn);
}
export function ultrasonic_rgb(argValues){
    var port = argValues.SENSOR_PORT;
    var index = argValues.ULTRASONIC_LED_INDEX;
    var color = hexToRgb(argValues.COLOR);
    this.net.sendCmd( 109, port, index, color.r, color.g, color.b);
}
export function ultrasonic_rgb3(argValues){
    var port = argValues.SENSOR_PORT;
    var index = argValues.ULTRASONIC_LED_INDEX;
    var color = fetchRGB(argValues);
    this.net.sendCmd( 109, port, index, color.r, color.g, color.b);
}
export function line_follower(argValues){
    var port = argValues.SENSOR_PORT;
    var index = argValues.LINE_FOLLOWER_INDEX;
    return this.net.sendCmd( 111, port, index);
}
export function led_matrix_number(argValues){
    var port = argValues.SENSOR_PORT;
    var num = argValues.NUM;
    this.net.sendCmd( 112, port, num);
}
export function led_matrix_time(argValues){
    var port = argValues.SENSOR_PORT;
    var hour = argValues.HOUR;
    var second = argValues.SECOND;
    var showColon = argValues.SHOW_COLON;
    this.net.sendCmd( 113, port, hour, second, showColon);
}
export function led_matrix_string(argValues){
    var port = argValues.SENSOR_PORT;
    var x = argValues.X;
    var y = argValues.Y;
    var str = argValues.STR;
    this.net.sendCmd( 114, port, x, y, str);
}

export function led_matrix_bitmap_21x7(argValues){
    //console.log('21x7',argValues)
    led_matrix_bitmap.call(this, argValues, 21, 7);
}

export function led_matrix_bitmap_14x5(argValues){
    //console.log('14x5',argValues)
    led_matrix_bitmap.call(this, argValues, 14, 5);
}

function led_matrix_bitmap(argValues, w, h){
    var port = argValues.SENSOR_PORT;
    var x = argValues.X;
    var y = argValues.Y;
    var data = argValues.MATRIX.split('');
    var bytes = [];
    for(var j=0; j<w; ++j){
        bytes[j] = 0;
        for(var i=0; i<h; ++i){
            if(data[i*w+j] === '1'){
                bytes[j] |= 1 << i;
            }
        }
    }
    this.net.sendCmd( 115, port, x, y, ...bytes);
}

export function led_matrix_pixel_show(argValues){
    var port = argValues.SENSOR_PORT;
    var x = argValues.X;
    var y = argValues.Y;
    this.net.sendCmd( 1, port, x, y);
}

export function led_matrix_pixel_hide(argValues){
    var port = argValues.SENSOR_PORT;
    var x = argValues.X;
    var y = argValues.Y;
    this.net.sendCmd( 2, port, x, y);
}

export function led_matrix_clear(argValues){
    var port = argValues.SENSOR_PORT;
    this.net.sendCmd( 3, port);
}

export function ir_avoid(argValues){
    var port = argValues.SENSOR_PORT;
    return this.net.sendCmd( 117, port);
}

export function single_line_follower(argValues){
    var port = argValues.BOARD_PORT;
    return this.net.sendCmd( 116, port);
}

export function ir_avoid_led(argValues){
    var port = argValues.SENSOR_PORT;
    var index = argValues.ULTRASONIC_LED_INDEX;
    var isOn = argValues.ON_OFF;
    this.net.sendCmd( 128, port, index, isOn);
}
export function ir_avoid_rgb(argValues){
    var port = argValues.SENSOR_PORT;
    var index = argValues.ULTRASONIC_LED_INDEX;
    var color = hexToRgb(argValues.COLOR);
    this.net.sendCmd( 118, port, index, color.r, color.g, color.b);
}
export function ir_avoid_rgb3(argValues){
    var port = argValues.SENSOR_PORT;
    var index = argValues.ULTRASONIC_LED_INDEX;
    var color = fetchRGB(argValues);
    this.net.sendCmd( 118, port, index, color.r, color.g, color.b);
}
export function weeebotMini_board_back_led(argValues){
    let pin = argValues.BACK_LED_PORT;
    var on = argValues.ON_OFF;
    this.net.sendCmd( 119, pin, on);
}
/*
function front_led_light(argValues){
    var pin = argValues.SENSOR_PORT;
    var index = argValues.ULTRASONIC_LED_INDEX;
    var on = argValues.ON_OFF;
    this.net.sendCmd( 120, pin, index, on);
}*/
export function humiture_humidity(argValues){
    var pin = argValues.SENSOR_PORT;
    return this.net.sendCmd( 122, pin, 1);
}
export function humiture_temperature(argValues){
    var pin = argValues.SENSOR_PORT;
    return this.net.sendCmd( 122, pin, 0);
}
export function touch(argValues){
    var pin = argValues.SENSOR_PORT;
    return this.net.sendCmd( 121, pin);
}
export function soil(argValues){
    var pin = argValues.BOARD_PORT;
    return this.net.sendCmd( 124, pin);
}
export function seven_segment(argValues){
    var pin = argValues.SENSOR_PORT;
    var num = argValues.NUM;
    this.net.sendCmd( 123, pin, Number(num));
}
export function single_led(argValues){
    var port = argValues.SENSOR_PORT;
    var isOn = argValues.ON_OFF;
    return this.net.sendCmd( 125, port, isOn);
}

export function sliding_potentiometer(argValues){
    var port = argValues.SENSOR_PORT;
    return this.net.sendCmd( 126, port);
}

export function gas_sensor(argValues){
    var port = argValues.SENSOR_PORT;
    return this.net.sendCmd( 126, port);
}

export function potentiometer(argValues){
    var port = argValues.SENSOR_PORT;
    return this.net.sendCmd( 126, port);
}

export function led_button_light(argValues){
    var port = argValues.SENSOR_PORT;
    var index = argValues.BUTTON_INDEX;
    var isOn = argValues.ON_OFF;
    this.net.sendCmd( 15, port, index, isOn);
}

export function relay(argValues){
    var port = argValues.SENSOR_PORT;
    var isOn = argValues.ON_OFF;
    this.net.sendCmd( 26, port, isOn);
}

export function water_atomizer(argValues){
    var port = argValues.SENSOR_PORT;
    var isOn = argValues.ON_OFF;
    this.net.sendCmd( 27, port, isOn);
}

export function color_sensor_white_balance(argValues){
    var port = argValues.SENSOR_PORT;
    this.net.sendCmd( 17, port);
}

export function color_sensor_light(argValues){
    var port = argValues.SENSOR_PORT;
    var isOn = argValues.ON_OFF;
    this.net.sendCmd( 18, port, isOn);
}

export function mp3_play(argValues){
    var port = argValues.SENSOR_PORT;
    this.net.sendCmd( 33, port);
}

export function mp3_pause(argValues){
    var port = argValues.SENSOR_PORT;
    this.net.sendCmd( 32, port);
}

export function mp3_prev_music(argValues){
    var port = argValues.SENSOR_PORT;
    this.net.sendCmd( 39, port);
}

export function mp3_next_music(argValues){
    var port = argValues.SENSOR_PORT;
    this.net.sendCmd( 31, port);
}

export function mp3_set_music(argValues){
    var port = argValues.SENSOR_PORT;
    var num = argValues.NUM;
    this.net.sendCmd( 28, port, num);
}

export function mp3_set_volume(argValues){
    var port = argValues.SENSOR_PORT;
    var num = argValues.NUM;
    this.net.sendCmd( 29, port, num);
}

export function mp3_set_device(argValues){
    var port = argValues.SENSOR_PORT;
    var num = argValues.MP3_DEVICE_TYPE;
    this.net.sendCmd( 30, port, num);
}

export function mp3_is_over(argValues){
    var port = argValues.SENSOR_PORT;
    return this.net.sendCmd( 34, port);
}

export function oled_set_size(argValues){
    var port = argValues.SENSOR_PORT;
    var size = argValues.OLED_SIZE;
    this.net.sendCmd( 35, port, size);
}

export function oled_show_string(argValues){
    var port = argValues.SENSOR_PORT;
    var x = argValues.X;
    var y = argValues.Y;
    var str = argValues.STR;
    this.net.sendCmd( 37, port, x, y, str);
}

export function oled_show_number(argValues){
    var port = argValues.SENSOR_PORT;
    var x = argValues.X;
    var y = argValues.Y;
    var num = argValues.NUM;
    this.net.sendCmd( 36, port, x, y, num);
}

export function oled_clear_screen(argValues){
    var port = argValues.SENSOR_PORT;
    this.net.sendCmd( 38, port);
}

export function color_sensor(argValues){
    var port = argValues.SENSOR_PORT;
    var type = argValues.COLOR_TYPE;
    return this.net.sendCmd( 19, port, type);
}

export function flame_sensor(argValues){
    var port = argValues.SENSOR_PORT;
    var index = argValues.FLAME_INDEX;
    return this.net.sendCmd( 20, port, index);
}

export function joystick(argValues){
    var port = argValues.SENSOR_PORT;
    var axis = argValues.AXIS2;
    return this.net.sendCmd( 22, port, axis);
}

export function limit_switch(argValues){
    var port = argValues.SENSOR_PORT;
    return this.net.sendCmd( 21, port);
}

export function compass(argValues){
    var port = argValues.SENSOR_PORT;
    var axis = argValues.AXIS3;
    return this.net.sendCmd( 23, port, axis);
}

export function gyro_gyration(argValues){
    var port = argValues.SENSOR_PORT;
    var axis = argValues.AXIS3;
    return this.net.sendCmd( 24, port, axis);
}

export function gyro_acceleration(argValues){
    var port = argValues.SENSOR_PORT;
    var axis = argValues.AXIS3;
    return this.net.sendCmd( 24, port, parseInt(axis)+3);
}

export function led_button(argValues){
    var port = argValues.SENSOR_PORT;
    var index = argValues.BUTTON_INDEX;
    return this.net.sendCmd( 14, port, index);
}

export function pir(argValues){
    var port = argValues.SENSOR_PORT;
    return this.net.sendCmd( 16, port);
}

export function tilt(argValues){
    var port = argValues.SENSOR_PORT;
    var index = argValues.LINE_FOLLOWER_INDEX;
    return this.net.sendCmd( 25, port, index);
}

 /*
export default {
        led_strip,
        weeebot_motor_dc,
        weeebot_motor_dc_130,
        weeebot_motor_move,
        on_board_servo,
        weeebot_stop,
        weeebot_rgb,
        weeebot_rgb3,
        weeebot_rgb_RJ11,
        weeebot_rgb3_RJ11,
        board_light_sensor,
        board_temperature_sensor,
        board_sound_sensor,
        //weeebot_encoder_move,
        //weeebot_steppermove,
        weeebot_infraread,
        weeebot_on_board_button,
        test_tone_note,
        ultrasonic,
        ultrasonic_led,
        line_follower,
        weeebot_led_matrix_number,
        weeebot_led_matrix_time,
        weeebot_led_matrix_string,
        weeebot_led_matrix_bitmap_21x7,
        weeebot_led_matrix_bitmap_14x5,
        weeebot_led_matrix_pixel_show,
        weeebot_led_matrix_pixel_hide,
        weeebot_led_matrix_clear,
        weeebot_ir_avoid,
        weeebot_single_line_follower,
        ultrasonic_led_rgb,
        ir_avoid_led,
        ir_avoid_led_rgb,
        back_led_light,
        front_led_light,
        humiture_temperature,
        humiture_humidity,
        touch,
        soil,
        seven_segment,
        weeebot_single_led,
        sliding_potentiometer,
        potentiometer,
        gas_sensor,

        led_button_light,
        relay,
        water_atomizer,
        color_sensor_white_balance,
        color_sensor_light,
        mp3_play,
        mp3_pause,
        mp3_next_music,
        mp3_set_music,
        mp3_set_volume,
        mp3_set_device,
        mp3_is_over,
        oled_set_size,
        oled_show_string,
        oled_show_number,
        oled_clear_screen,
        color_sensor,
        flame_sensor,
        joystick,
        limit_switch,
        compass,
        gyro_gyration,
        gyro_acceleration,
        touch,
        led_button,
        pir,
        tilt
};*/