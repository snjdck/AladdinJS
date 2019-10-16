#include <headers/HeaderVert>
#include <headers/Varying>

layout(row_major)
uniform;

uniform _ {
	vec2 screenMatrix;
	int InstanceIDBase;
};

uniform WorldMatrix_BLOCK {
	mat3x2 worldMatrix[MAX_2D_OBJECTS];
};

uniform TextureMul_BLOCK {
	vec4 textureMul[MAX_2D_OBJECTS];
};

uniform TextureAdd_BLOCK {
	vec4 textureAdd[MAX_2D_OBJECTS];
};

uniform RectSize_BLOCK {
	vec4 rectSize[MAX_2D_OBJECTS];		//w,rw,h,rh
};

uniform Scale9grid_BLOCK {
	vec4 scale9grid[MAX_2D_OBJECTS];	//lm,rm,tm,bm
};

void main()
{
	vec2 inputPosition = vec2(gl_VertexID >> 1 & 1, gl_VertexID >> 3);
	vec4 inputMargin = vec4(equal(
		ivec2(gl_VertexID & 3, gl_VertexID >> 2).xxyy,
		ivec2(1, 2).xyxy
	));
	inputMargin.yw = -inputMargin.yw;
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
}