#version 300 es

precision highp float;
precision highp int;

layout(location=0)
in vec3 inputPosition;

layout(location=1)
in vec2 inputUV;

uniform mat4 screenMatrix;
uniform mat4 cameraMatrix;
uniform mat4 worldMatrix;

//uniform vec4 boneList[100];

out lowp vec2 uv;

void main()
{
	vec4 localPosition = vec4(inputPosition, 1);
	vec4 worldPosition = worldMatrix * localPosition;
	vec4 cameraPosition = cameraMatrix * worldPosition;
	vec4 screenPosition = screenMatrix * cameraPosition;

	gl_Position = screenPosition;
	uv = inputUV;
}

vec3 rotate(vec4 quaternion, vec3 point)
{
	vec3 t0 = quaternion.xyz * quaternion.yzx;	//xy,yz,zx
	vec3 t1 = quaternion.xyz * quaternion.www;	//xw,yw,zw
	vec4 t2 = quaternion * quaternion;			//xx,yy,zz,ww

	vec3 result = (t0 - t1.zxy) * point.yzx + (t0.zxy + t1.yzx) * point.zxy;
	result += result;
	result += point * (t2.xyz + t2.www - t2.yzx - t2.zxy);
	return result;
}