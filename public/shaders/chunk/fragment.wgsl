@binding(2) @group(0) var grass_texture: texture_2d<f32>;
@binding(3) @group(0) var grass_sample: sampler;
@binding(4) @group(0) var rock_texture: texture_2d<f32>;
@binding(5) @group(0) var rock_sample: sampler;

@fragment
fn main(@location(0) tex_coord: vec3f,@location(1) normal: vec3f, @location(2) dot_result: f32) -> @location(0) vec4f {
    var grass_result: vec4<f32> = textureSample(grass_texture, grass_sample, vec2<f32>(tex_coord.x, tex_coord.z));
    var rock_result: vec4<f32> = textureSample(rock_texture, rock_sample, vec2<f32>(tex_coord.x+tex_coord.z,tex_coord.y));
    var angle = (dot_result+1.0)/2.0;

    var hpi = 3.14159/2.0;

    if (dot_result > 0.0) {

        var a = smoothstep(1.0, 0.2, dot_result);
        var color: vec3<f32> = mix(grass_result.rgb, rock_result.rgb, a);
        return vec4<f32>(color,1.0);
    }
    return vec4<f32>(rock_result.x*angle, rock_result.y*angle, rock_result.z*angle, rock_result.w);

}