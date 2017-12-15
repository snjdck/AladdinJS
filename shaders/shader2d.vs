#include <_Header>
#include <_VertexOut>

layout(location=0)
in vec2 inputPosition;

layout(location=1)
in vec4 inputMargin;

struct Object {
	mat2x3 worldMatrix;
	vec4 textureMul;
	vec4 textureAdd;
	vec4 rectSize;		//w,rw,h,rh
	vec4 scale9grid;	//lm,rm,tm,bm
};

uniform _ {
	vec2 screenMatrix;
	int InstanceIDBase;
	Object objectList[10];
};

#define object objectList[gl_InstanceID]

void main()
{
	vec4 margin = inputMargin * object.scale9grid;
	margin = margin.xxzz + margin.yyww;

	vec4 xyuv = inputPosition.xxyy * object.rectSize + margin;
	xyuv.yw /= object.rectSize.yw;
	xyuv = xyuv.xzyw * object.textureMul + object.textureAdd;

	xyuv.xy = transpose(object.worldMatrix) * vec3(xyuv.xy, 1);
	xyuv.xy *= screenMatrix.xy;
	xyuv.xy += vec2(-1, 1);

	gl_Position = vec4(xyuv.xy, 0, 1);
	uv = xyuv.zw;
	InstanceID = gl_InstanceID;
	InstanceIndex = InstanceIDBase + gl_InstanceID;
}