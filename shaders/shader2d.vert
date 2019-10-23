#include <headers/HeaderVert>
#include <headers/Varying>

//default column_major
//layout(row_major)uniform;

uniform vec2 screenWH;
uniform int InstanceIDBase;

layout(location=auto)
in mat2x3 worldMatrix;

layout(location=auto)
in vec4 textureMul;

layout(location=auto)
in vec4 textureAdd;

layout(location=auto)
in vec4 rectSize;//w,rw,h,rh

layout(location=auto)
in vec4 scale9grid;//lm,rm,tm,bm

void main()
{
	vec2 inputPosition = vec2(gl_VertexID >> 1 & 1, gl_VertexID >> 3);
	vec4 inputMargin = vec4(equal(
		ivec2(gl_VertexID & 3, gl_VertexID >> 2).xxyy,
		ivec2(1, 2).xyxy
	));
	inputMargin.yw = -inputMargin.yw;
	vec4 margin = inputMargin * scale9grid;
	margin = margin.xxzz + margin.yyww;

	vec4 xyuv = inputPosition.xxyy * rectSize + margin;
	xyuv.yw /= rectSize.yw;
	xyuv = xyuv.xzyw * textureMul + textureAdd;

	xyuv.xy = vec3(xyuv.xy, 1) * worldMatrix;
	Position = vec3(xyuv.xy, 0);
	xyuv.xy = screenWH * vec2(xyuv) + vec2(-1, 1);

	gl_Position = vec4(xyuv.xy, 0, 1);
	uv = xyuv.zw;

#ifdef PICKING_MODE_FLAG
	InstanceID = gl_InstanceID;
	InstanceIndex = InstanceIDBase + gl_InstanceID;
#endif
}