#include <headers/Header>
#include <headers/QuadVertexList>

out vec2 uv;

void main()
{
	vec4 vertex = QuadVertexList[gl_VertexID];
	gl_Position = vec4(vertex.xy, 0, 1);
	uv = vertex.zw;
}