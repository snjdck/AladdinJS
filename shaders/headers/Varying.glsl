
#ifdef IS_VERT
out vec2 uv;
flat out vec3 Position;
flat out int InstanceID;
flat out int InstanceIndex;
#endif

#ifdef IS_FRAG
in vec2 uv;
flat in vec3 Position;
flat in int InstanceID;
flat in int InstanceIndex;
#endif