@binding(2) @group(0) var grass_texture: texture_2d<f32>;
@binding(3) @group(0) var grass_sample: sampler;
@binding(4) @group(0) var rock_texture: texture_2d<f32>;
@binding(5) @group(0) var rock_sample: sampler;

@fragment
fn main(@location(0) tex_coord: vec2f, @location(1) dot_result: f32) -> @location(0) vec4f {
    var grass_result: vec4<f32> = textureSample(grass_texture, grass_sample, tex_coord);
    var rock_result: vec4<f32> = textureSample(rock_texture, rock_sample, tex_coord);
    var angle = (dot_result+1.0)/2.0;
    if (dot_result > 0.0) {
        var scalar: f32 = dot_result*dot_result*dot_result;
        var negate: f32 = 1.0 - scalar;
        grass_result = vec4<f32>(grass_result.x*scalar, grass_result.y*scalar, grass_result.z*scalar, grass_result.w*scalar);
        rock_result = vec4<f32>(rock_result.x*negate, rock_result.y*negate, rock_result.z*negate, rock_result.w*negate);
        return grass_result+rock_result;
    }
    return vec4<f32>(rock_result.x*angle, rock_result.y*angle, rock_result.z*angle, rock_result.w);

}