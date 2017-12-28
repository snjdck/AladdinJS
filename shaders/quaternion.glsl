vec4 concat(vec4 a, vec4 b)
{
	vec4 t0 = b.w * a;
	vec4 t1 = b.x * a.wzyx;
	vec4 t2 = b.y * a.zwxy;
	vec4 t3 = b.z * a.yxwz;
	t1.yw = -t1.yw;
	t2.zw = -t2.zw;
	t3.xw = -t3.xw;
	return t0 + t1 + t2 + t3;
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

vec3 transform2(vec4 quaternion, vec4 translation, vec3 point)
{
	return rotate(quaternion, point * translation.w) + translation.xyz;
}

mat4 cast2mat(vec4 quaternion, vec4 translation)
{
	vec3 t0 = quaternion.xyz * quaternion.yzx;	//xy,yz,zx
	vec3 t1 = quaternion.xyz * quaternion.www;	//xw,yw,zw
	vec4 t2 = quaternion * quaternion;			//xx,yy,zz,ww

	vec3 a = t2.xyz + t2.www - t2.yzx - t2.zxy;
	vec3 b = (t0     - t1.zxy) * 2.0;
	vec3 c = (t0.zxy + t1.yzx) * 2.0;

	return mat4(
		vec4(a.x, c.y, b.z, 0),
		vec4(b.x, a.y, c.z, 0),
		vec4(c.x, b.y, a.z, 0),
		vec4(translation.xyz, 1)
	);
}