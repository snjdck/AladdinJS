#include <headers/HeaderVert>

out vec2 uv;

void main()
{
	vec2 vertex = vec2(gl_VertexID >> 1, gl_VertexID & 1);
	gl_Position = vec4(vertex * 2.0 - 1.0, 0, 1);
	uv = vertex;
}