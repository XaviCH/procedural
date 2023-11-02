struct Camera {
  projection: mat4x4f,
  view: mat4x4f,
  coord: vec3<i32>,
}

struct Fragment {
    @builtin(position) position: vec4f,
    @location(0) tex_coord: vec3f,
    @location(1) normal: vec3f,
    @location(2) dot_result: f32
};

@binding(0) @group(0) var<uniform> camera: Camera;
@binding(1) @group(0) var<uniform> coord: vec3<i32>;

@vertex
fn main(@location(0) position: vec3f, @location(1) normal : vec3f) -> Fragment {
    var output: Fragment;
    var relative: vec3f = vec3<f32>((camera.coord + coord)*16);

    output.position = camera.projection * camera.view * vec4<f32>((relative+position), 1.0);


    var offset_x: f32 = position.x - floor(position.x);
    var offset_y: f32 = position.y - floor(position.y);
    var offset_z: f32 = position.z - floor(position.z);
    if (i32(position.x) % 2 == 1) { offset_x += 1.0; }
    if (i32(position.y) % 2 == 1) { offset_y += 1.0; }
    if (i32(position.z) % 2 == 1) { offset_z += 1.0; }


    output.tex_coord = vec3<f32>(
      position.x,
      position.y,
      position.z,
    );
    output.normal = normal;
    output.dot_result = dot(normal, vec3<f32>(0.0,1.0,0.0));

    return output;
}