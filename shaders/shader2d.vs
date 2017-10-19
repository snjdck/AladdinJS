#version 300 es

precision highp float;
precision highp int;

layout(location=0)
in vec2 inputPosition;

layout(location=1)
in vec4 inputMargin;

uniform ConstData {
	vec4 screenMatrix;
	vec3 worldMatrixX;
	vec3 worldMatrixY;
	vec4 textureMul;
	vec4 textureAdd;
	vec4 rectSize;		//w,rw,h,rh
	vec4 scale9grid;	//lm,rm,tm,bm
};

/*
uniform vec4 screenMatrix;
uniform vec3 worldMatrixX;
uniform vec3 worldMatrixY;
uniform vec4 textureMul;
uniform vec4 textureAdd;
uniform vec4 rectSize;		//w,rw,h,rh
uniform vec4 scale9grid;	//lm,rm,tm,bm
*/
out vec2 uv;

void main()
{
	vec4 margin = inputMargin * scale9grid;
	margin = margin.xxzz + margin.yyww;

	vec4 xyuv = inputPosition.xxyy * rectSize + margin;
	xyuv.yw /= rectSize.yw;
	xyuv = xyuv.xzyw * textureMul + textureAdd;

	vec3 position = vec3(xyuv.xy, 1);
	xyuv.x = dot(position, worldMatrixX);
	xyuv.y = dot(position, worldMatrixY);
	xyuv.xy = xyuv.xy * screenMatrix.xy + screenMatrix.zw;

	gl_Position = vec4(xyuv.xy, 0, 1);
	uv = xyuv.zw;
}