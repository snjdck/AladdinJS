#include <headers/Header>

out vec2 uv;

void main()
{
	vec2 vertex = vec2(gl_VertexID >> 1, gl_VertexID & 1);
	gl_Position = vec4(vertex * vec2(2) - vec2(1), 0, 1);
	uv = vertex;
}