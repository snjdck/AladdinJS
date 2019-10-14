#include <headers/Header>
#include <headers/VertexOut>

layout(row_major)
uniform;

layout(location=0)
in vec2 inputPosition;

layout(location=1)
in vec4 inputMargin;

flat out vec4 fgColor;

#define MAX_OBJECTS (gl_MaxVertexUniformVectors - 1) / 7

uniform _ {
	vec2 screenMatrix;
	int InstanceIDBase;
};

uniform WorldMatrix_BLOCK {
	mat3x2 worldMatrix[MAX_OBJECTS];
};

uniform TextureMul_BLOCK {
	vec4 textureMul[MAX_OBJECTS];
};

uniform TextureAdd_BLOCK {
	vec4 textureAdd[MAX_OBJECTS];
};

uniform RectSize_BLOCK {
	vec4 rectSize[MAX_OBJECTS];		//w,rw,h,rh
};

uniform Scale9grid_BLOCK {
	vec4 scale9grid[MAX_OBJECTS];	//lm,rm,tm,bm
};

uniform Color_2D_BLOCK {
	vec4 color[MAX_OBJECTS];
};

void main()
{
	vec4 margin = inputMargin * scale9grid[gl_InstanceID];
	margin = margin.xxzz + margin.yyww;

	vec4 xyuv = inputPosition.xxyy * rectSize[gl_InstanceID] + margin;
	xyuv.yw /= rectSize[gl_InstanceID].yw;
	xyuv = xyuv.xzyw * textureMul[gl_InstanceID] + textureAdd[gl_InstanceID];

	xyuv.xy = worldMatrix[gl_InstanceID] * vec3(xyuv.xy, 1);
	Position = vec3(xyuv.xy, 0);
	xyuv.xy *= screenMatrix.xy;
	xyuv.xy += vec2(-1, 1);

	gl_Position = vec4(xyuv.xy, 0, 1);
	uv = xyuv.zw;
	InstanceID = gl_InstanceID;
	InstanceIndex = InstanceIDBase + gl_InstanceID;
	fgColor = color[gl_InstanceID];
}