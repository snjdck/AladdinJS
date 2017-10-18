attribute vec3 inputPosition;
attribute vec2 inputUV;

uniform vec3 screenMatrix;
uniform mat4 cameraMatrix;
uniform mat4 worldMatrix;

//uniform vec4 boneList[100];

varying lowp vec2 uv;

void main()
{
	vec4 localPosition = vec4(inputPosition, 1);
	vec4 worldPosition = worldMatrix * localPosition;
	vec4 cameraPosition = cameraMatrix * worldPosition;
	vec3 screenPosition = cameraPosition.xyz * screenMatrix;

	gl_Position = vec4(screenPosition, 1);
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