#include <_Header>

layout(location=0)
in vec2 inputPosition;

out vec2 uv;

void main()
{
	gl_Position = vec4(inputPosition * 2.0 - 1.0, 0, 1);
	uv = inputPosition;
}