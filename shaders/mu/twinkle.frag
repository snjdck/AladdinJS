#include <headers/HeaderFrag>
#include <headers/Varying>
#include <blocks/TIME_BLOCK>

uniform sampler2D sampler0;

const float v_low = 0.3;
const float v_max = 1.0;
//const vec4 c_max = vec4(v_max, 0, 0, 1.0);
//const vec4 c_min = vec4(v_low, 0, 0, 1.0);
const vec4 c_max = vec4(0, v_max, v_max, 1.0);
const vec4 c_min = vec4(0, v_low, v_low, 1.0);

const float a = exp(1.0) / (exp(2.0) - 1.0);
const float b = 1.0 / (exp(2.0) - 1.0);
const float s = 0.002;

out vec4 color;

void main(){
	float ratio = exp(sin(time * s)) * a - b;//0-1
	color = texture(sampler0, uv) * mix(c_min, c_max, ratio);
}