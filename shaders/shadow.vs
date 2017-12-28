#include <_Header>
#include <quaternion>

layout(location=0)
in vec2 inputPosition;

out vec2 uv;
flat out mat4 matrix;

uniform mat4 screenMatrix1;
uniform vec4 cameraMatrix[2];
uniform mat4 screenMatrix2;

void main(){
	gl_Position = vec4(inputPosition, 0, 1);
	uv = inputPosition * 0.5 + 0.5;
	matrix = screenMatrix2 * cast2mat(cameraMatrix[0], cameraMatrix[1]) * screenMatrix1;
}