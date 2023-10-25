import { vec3 } from "gl-matrix"
import { device } from "../settings";

export class Mesh {
    
    vertices: Vertex[] = [];
    faces: Face[] = [];

    VBOBuffer: GPUBuffer | null = null;

    load() {
        const faces = this.faces.length;
        const VBO = new Float32Array(faces*3*6);

        for(let f=0; f<faces; ++f) {
            const face = this.faces[f];
            for(let v=0; v<3; ++v) { // triangle primitives
                const offset = f*3*6+v*6;
                const vertex = face.vertices[v];

                VBO[offset  ] = vertex.position[0];
                VBO[offset+1] = vertex.position[1];
                VBO[offset+2] = vertex.position[2];
                if (vertex.normal !== undefined) {
                    VBO[offset+3] = vertex.normal[0];
                    VBO[offset+4] = vertex.normal[1];
                    VBO[offset+5] = vertex.normal[2];
                } else {
                    VBO[offset+3] = face.normal[0];
                    VBO[offset+4] = face.normal[1];
                    VBO[offset+5] = face.normal[2];
                }
            }
        }

        this.VBOBuffer = device.createBuffer({
            size: VBO.byteLength,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });

        device.queue.writeBuffer(this.VBOBuffer, 0, VBO);
    }

    unload() {
        this.VBOBuffer?.destroy();
    }



}

export class Vertex {
    position: vec3;
    normal: vec3 | undefined;

    constructor(position: number[], normal: number[] | undefined = undefined) {
        this.position = vec3.clone(position);
        if (normal !== undefined) 
            this.normal = vec3.clone(normal);
    }
}

export class Face {
    vertices: Vertex[];
    normal: vec3;

    constructor(vertices: Vertex[], normal: number[] | undefined = undefined) {
        this.vertices = vertices;
        if (normal !== undefined)
            this.normal = vec3.clone(normal);
        else 
            this.normal = vec3.fromValues(0,0,0);
    }
}